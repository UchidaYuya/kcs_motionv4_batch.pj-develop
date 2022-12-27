//獲得ポイント計算　(process)
//2008/03/28 石崎公久 作成

import TweakCalcPointModel from "../../model/script/TweakCalcPointModel";
import TweakCalcPointView from "../../view/script/TweakCalcPointView";
import MtScriptAmbient from "../../MtScriptAmbient";
import SUOBaseProc from "../SUOBaseProc";
import PostModel from "../../model/PostModel";

export default class TweakCalcPointProc extends SUOBaseProc {
	O_View: TweakCalcPointView;
	O_Model: TweakCalcPointModel;
	O_PostModel: PostModel | undefined;
	YYYYMM: string;
	PactID!: number;
	H_TweakConf: any;
	TelNoError: string;
	constructor(H_param: {} | any[] = Array()) //引数確認の処理が終わっている
	//model作成
	{
		super(H_param);
		this.TelNoError = "";
		this.getSetting().loadConfig("SUO");
		this.O_View = new TweakCalcPointView();
		this.O_Model = new TweakCalcPointModel(this.get_MtScriptAmbient());
		this.PactID = this.O_View.get_HArgv("-p");
		this.YYYYMM = this.O_View.get_HArgv("-y");
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//トランザクション開始
	//獲得ポイント格納用
	//[postid][docomo]
	//[au]
	//割引額設定取得
	//ドコモの処理：ここまで
	//AUの処理：ここから
	//請求情報の取得
	//auの処理：ここまで
	//インサートする先の請求月にデータが入っていればエラー
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		const post_level = this.getSetting().get("suo_cd_post_level") + 1;
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.get_DB().beginTransaction();
		const H_calc_point = Array();
		this.H_TweakConf = await this.O_Model.getTweakConf(this.PactID);

		if (false == this.H_TweakConf) {
			this.errorOut(1000, "指定した顧客IDの調整設定が、tweak_config_tbに入力されていません。\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw process.exit(-1);
		}

		const A_details_docomo  = await this.O_Model.getTelDetailsPointflag(this.PactID, this.YYYYMM, this.getSetting().get("car_docomo"));
		let details_num = A_details_docomo.length;

		if (1 > details_num) {
			this.infoOut("ドコモのポイント対象の請求情報が一件もありませんでした。\n");
		} else {
			this.infoOut(details_num + "件のドコモ請求情報を処理します。\n");

			for (var cnt = 0; cnt < details_num; cnt++) {
				var thistelpost = await this.O_Model.getTelPostid(this.PactID, A_details_docomo[cnt].telno, this.getSetting().get("car_docomo"), this.YYYYMM);

				if (false == thistelpost) {
					this.errorTel(A_details_docomo[cnt].telno, 1000, "電話番号（" + A_details_docomo[cnt].telno + "）は第" + post_level + "階層より上層に登録されています。\n");
					continue;
				}

				var thistelstage = this.O_Model.getTelAddPoint(this.PactID, A_details_docomo[cnt].telno, this.getSetting().get("car_docomo"), this.YYYYMM);

				if (true == (undefined !== H_calc_point[thistelpost])) {
					H_calc_point[thistelpost].docomo += this.tweakPointDocomo(A_details_docomo[cnt].charge, thistelstage);
				} else {
					H_calc_point[thistelpost].docomo = this.tweakPointDocomo(A_details_docomo[cnt].charge, thistelstage);
					H_calc_point[thistelpost].au = 0;
				}
			}
		}

		const A_details_au = await this.O_Model.getTelDetailsPointAU(this.PactID, this.YYYYMM, this.getSetting().get("car_au"));
		details_num = A_details_au.length;

		if (1 > details_num) {
			this.infoOut("auのポイント対照の請求情報が一件もありませんでした。\n");
		} else {
			this.infoOut(details_num + "件のau請求情報を処理します。\n");

			for (cnt = 0; cnt < details_num; cnt++) {
				thistelstage = this.getSetting().get("suo_docomo_default_point");
				thistelpost = await this.O_Model.getTelPostid(this.PactID, A_details_au[cnt].telno, this.getSetting().get("car_au"), this.YYYYMM);

				if (false == thistelpost) {
					this.errorTel(A_details_au[cnt].telno, 1000, "電話番号（" + A_details_au[cnt].telno + "）は第" + post_level + "階層より上層に登録されています。\n");
					continue;
				}

				// if (true == (-1 !== array_merge(this.getSetting().A_suo_au_simple_plan, this.getSetting().A_win_single_simple).indexOf(A_details_au[cnt].planid))) {
				if (true == (-1 !== (this.getSetting().get("A_suo_au_simple_plan").concat( this.getSetting().get("A_win_single_simple"))).indexOf(A_details_au[cnt].planid))) {
					this.infoOut("電話番号（" + A_details_au[cnt].telno + "\）は、ポイント加算しない電話のため計算を行いません。\n", 0);
					continue;
				}

				if (true == (undefined !== H_calc_point[thistelpost])) {
					H_calc_point[thistelpost].au += this.tweakPointAu(A_details_au[cnt].charge, thistelstage);
				} else {
					H_calc_point[thistelpost].docomo = 0;
					H_calc_point[thistelpost].au = this.tweakPointAu(A_details_au[cnt].charge, thistelstage);
				}
			}
		}

		if (true == await this.O_Model.checkTweakPointTbData(this.PactID, this.YYYYMM)) {
			this.errorOut(1000, "既に獲得ポイントが集計されていますので、処理を中止します。\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw process.exit(-1);
		}

		if (0 < H_calc_point.length) {
			var res = this.O_Model.insertThisPoint(this.PactID, this.YYYYMM, H_calc_point);
		} else {
			this.infoOut("処理対象となる請求情報がありませんでした。\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw process.exit(-1);
		}

		if (!res) {
			this.get_DB().rollback();
			this.errorOut(1000, "データの更新に失敗しました。獲得ポイントの集計をキャンセルします。\n");
		} else {
			this.get_DB().commit();
			this.infoOut("データの更新が完了しました。\n");
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit(0);
	}

	tweakPointDocomo(charge: number, stage: number) {
		return +(charge * this.getSetting().get("suo_tweak_point_docomo") / 100 / 100) * stage;
	}

	tweakPointAu(charge: number, stage: number) {
		return +(charge * this.getSetting().get("suo_tweak_point_au") / 100 / 100) * stage;
	}

};
