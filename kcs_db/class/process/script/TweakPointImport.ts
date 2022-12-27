//ポイント調整　インポート(process)
//2008/03/05 石崎公久 作成
import ProcessBaseBatch from "../ProcessBaseBatch";
import TweakPointImportModel from "../../model/script/TweakPointImportModel";
import TweakPointImportView from "../../view/script/TweakPointImportView";
import MtScriptAmbient from "../../MtScriptAmbient";

export default class TweakPointImport extends ProcessBaseBatch {
	O_View: TweakPointImportView;
	O_Model: TweakPointImportModel;
	DataDir: string;
	A_Pact: any;
	constructor(H_param: {} | any[] = Array()) //view の生成
	//引数確認の処理が終わっている
	//model作成
	//データディレクトリの取得
	{
		super(H_param);
		this.getSetting().loadConfig("SUO");
		this.O_View = new TweakPointImportView();
		this.O_Model = new TweakPointImportModel(this.get_MtScriptAmbient());
		this.DataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.O_View.get_HArgv("-y") + this.getSetting().get("suo_file_dir") + this.getSetting().get("suo_point_dir");
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//データディレクトリの存在確認
	//対象Pactidのリストが１件に満たない（つまり０件）の場合は、
	//エラー表示をして終了します。
	//pactidごとの処理
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		var post_level = this.getSetting().get("suo_cd_post_level") + 1;
		this.set_Dirs(this.O_View.get_ScriptName());

		if (false == this.isDirCheck(this.DataDir)) {
			this.errorOut(1000, "SUOポイント調整ディレクトリ（" + this.DataDir + "）が存在しない、又は読み込み・書き込み権限がありません\n");
			throw process.exit(-1);
		}

		this.A_Pact = this.getPactList(this.DataDir, this.O_View.get_HArgv("-p"));

		if (this.A_Pact.length < 1) {
			this.errorOut(0, "対象となる顧客が存在しません。" + this.DataDir + " 配下に、顧客用のフォルダを作成してください。\n");
			throw process.exit(-1);
		}

		this.lockProcess(this.O_View.get_ScriptName());

		for (var pactid of this.A_Pact) //インポートファイルのパス
		//インポート処理 ハッシュで受け取り
		//false が返ってきたときは、ディレクトリにインポートファイルが存在しなかったので
		//処理を飛ばして次の pactid に移る
		//先月の累計ポイントの取得(枝番まで）
		//今月の獲得ポイントを取得（枝番まで）
		//ポイントのマージ（枝番まで）
		//インサートアップデート
		{
			this.infoOut("pactid:" + pactid + " 処理開始\n");
			var import_file = this.makeImportPath(pactid, this.getSetting().get("suo_point_file"));
			var H_point = this.importPoint(pactid, import_file);

			if (false === H_point) {
				continue;
			}

			H_point = await this.O_Model.pointPostFromTel(H_point, pactid, this.O_View.get_HArgv("-y"));
			var H_allpoint = await this.O_Model.selectAllPoint(pactid, this.O_View.get_HArgv("-y"), true);
			var H_risepoint = await this.O_Model.selectRisePoint(pactid, this.O_View.get_HArgv("-y"), false);
			H_point = this.mergePointHash(pactid, H_point, H_allpoint, H_risepoint);
			var res = this.O_Model.insertUpdate(H_point);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}

	mergePointHash(pactid: number, H_point: any[], H_allpoint: any[], H_risepoint: any[]) //処理するポストIDの一覧を作成する。
	//部署ごとの値を生成する
	{
		var H_tmp = Array();
		var A_postid_list = Array();
		var billdate = this.O_Model.yyyymmConcierge(this.O_View.get_HArgv("-y"), false);

		for (var telno in H_point) {
			var value = H_point[telno];
			A_postid_list.push(telno);
		}

		for (var telno in H_allpoint) {
			var value = H_allpoint[telno];
			A_postid_list.push(telno);
		}

		for (var telno in H_risepoint) {
			var value = H_risepoint[telno];
			A_postid_list.push(telno);
		}

		// A_postid_list = [...new Set(A_postid_list)];
		A_postid_list.sort();

		for (var cnt = 0; cnt < A_postid_list.length; cnt++) //d_thispoint
		//au_thispoint
		//d_usepoint
		//au_usepoint
		//d_allpoint
		//au_allpoint
		{
			var postid = A_postid_list[cnt];
			H_tmp[cnt].pactid = pactid;
			H_tmp[cnt].postid = postid;
			H_tmp[cnt].billdate = billdate;

			if (false == (undefined !== H_risepoint[postid].d_thispoint)) {
				var d_thispoint = 0;
			} else {
				d_thispoint = H_risepoint[postid].d_thispoint;
			}

			if (false == (undefined !== H_risepoint[postid].au_thispoint)) {
				var au_thispoint = 0;
			} else {
				au_thispoint = H_risepoint[postid].au_thispoint;
			}

			if (false == (undefined !== H_point[postid].d_usepoint)) {
				var d_usepoint = 0;
			} else {
				d_usepoint = H_point[postid].d_usepoint;
			}

			if (false == (undefined !== H_point[postid].au_usepoint)) {
				var au_usepoint = 0;
			} else {
				au_usepoint = H_point[postid].au_usepoint;
			}

			if (false == (undefined !== H_allpoint[postid].d_allpoint)) {
				var d_allpoint = 0;
			} else {
				d_allpoint = H_allpoint[postid].d_allpoint;
			}

			if (false == (undefined !== H_allpoint[postid].au_allpoint)) {
				var au_allpoint = 0;
			} else {
				au_allpoint = H_allpoint[postid].au_allpoint;
			}

			H_tmp[cnt].d_thispoint = d_thispoint;
			H_tmp[cnt].au_thispoint = au_thispoint;
			H_tmp[cnt].d_usepoint = d_usepoint;
			H_tmp[cnt].au_usepoint = au_usepoint;
			H_tmp[cnt].d_allpoint = d_allpoint + d_thispoint - d_usepoint;
			H_tmp[cnt].au_allpoint = au_allpoint + au_thispoint - au_usepoint;
		}

		return H_tmp;
	}

	makeImportPath(pactid: string, setfile: string) {
		return this.DataDir + "/" + pactid + setfile;
	}

	importPoint(pactid: string, import_file: string) //インポートファイルの存在／読み込み／書き込み　権限確認
	{
		var check_result = this.isFileCheck(import_file);

		if ("nothing" === check_result) {
			this.infoOut("pactid " + pactid + ":" + import_file + " が存在しなかったので次の会社の処理に移行します。\n");
			return false;
		} else if ("diswrite" === check_result || "disread" === check_result) {
			this.errorOut(1000, "pactid " + pactid + ":" + import_file + " 読み込み、または書き込み権限が無いので、処理できません。\n");
			return false;
		}

		return this.O_Model.get_ImportDataCSVHash(import_file);
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
