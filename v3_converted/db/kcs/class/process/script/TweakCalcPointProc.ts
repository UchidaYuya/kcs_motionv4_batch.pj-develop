//
//獲得ポイント計算　(process)
//
//更新履歴：<br>
//2008/03/28 石崎公久 作成
//
//@uses SUOBaseProc
//@package SUO
//@subpackage Process
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//
//
//error_reporting(E_ALL|E_STRICT);
//
//獲得ポイント計算　(process)
//
//@uses SUOBaseProc
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//

require("process/SUOBaseProc.php");

require("model/script/TweakCalcPointModel.php");

require("view/script/TweakCalcPointView.php");

require("MtScriptAmbient.php");

//
//Viewオブジェクト
//
//@var TweakCalcPointView
//@access protected
//
//
//Modelオブジェクト
//
//@var TweakCalcPointModel
//@access protected
//
//
//引数で渡されたYYYYMM
//
//@var String
//@access protected
//
//
//顧客IDを入れる
//
//@var integer
//@access protected
//
//
//実行中のスクリプト固有のログディレクトリ
//
//@var string
//@access protected
//
//
//調整額設定ハッシュ
//
//@var mixed
//@access protected
//
//
//エラーの生じた電話番号（tmp）
//
//@var string
//@access protected
//
//
//ポストモデルを入れる
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//１．固有のログディレクトリを作成<br>
//２．二重起動ロック<br>
//３．引数（pactid, yyyymm）をメンバー変数へ<br>
//（トランザクション開始）<br>
//４．ポイントフラグのついたドコモの請求明細を取得<br>
//５．各々の電話の獲得ポイントを対象部署に集計。<br>
//７．AUの各電話の合計金額を請求明細から取得<br>
//８．調整後の内容の COPY INSERT を行う
//（コミット or ロールバック）
//９．二重起動ロック解除
//
//@author ishizaki
//@since 2008/03/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class TweakCalcPointProc extends SUOBaseProc {
	constructor(H_param: {} | any[] = Array()) //引数確認の処理が終わっている
	//model作成
	{
		super(H_param);
		this.TelNoError = "";
		this.getSetting().loadConfig("SUO");
		this.O_View = new TweakCalcPointView();
		this.O_Model = new TweakCalcPointModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
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
		var post_level = this.getSetting().suo_cd_post_level + 1;
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactID = this.O_View.get_HArgv("-p");
		this.YYYYMM = this.O_View.get_HArgv("-y");
		this.get_DB().beginTransaction();
		var H_calc_point = Array();
		this.H_TweakConf = this.O_Model.getTweakConf(this.PactID);

		if (false == this.H_TweakConf) {
			this.errorOut(1000, "\u6307\u5B9A\u3057\u305F\u9867\u5BA2ID\u306E\u8ABF\u6574\u8A2D\u5B9A\u304C\u3001tweak_config_tb\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw die(-1);
		}

		var A_details_docomo = this.O_Model.getTelDetailsPointflag(this.PactID, this.YYYYMM, this.getSetting().car_docomo);
		var details_num = A_details_docomo.length;

		if (1 > details_num) {
			this.infoOut("\u30C9\u30B3\u30E2\u306E\u30DD\u30A4\u30F3\u30C8\u5BFE\u8C61\u306E\u8ACB\u6C42\u60C5\u5831\u304C\u4E00\u4EF6\u3082\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		} else {
			this.infoOut(details_num + "\u4EF6\u306E\u30C9\u30B3\u30E2\u8ACB\u6C42\u60C5\u5831\u3092\u51E6\u7406\u3057\u307E\u3059\u3002\n");

			for (var cnt = 0; cnt < details_num; cnt++) {
				var thistelpost = this.O_Model.getTelPostid(this.PactID, A_details_docomo[cnt].telno, this.getSetting().car_docomo, this.YYYYMM);

				if (false == thistelpost) {
					this.errorTel(A_details_docomo[cnt].telno, 1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_docomo[cnt].telno + "\uFF09\u306F\u7B2C" + post_level + "\u968E\u5C64\u3088\u308A\u4E0A\u5C64\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002\n");
					continue;
				}

				var thistelstage = this.O_Model.getTelAddPoint(this.PactID, A_details_docomo[cnt].telno, this.getSetting().car_docomo, this.YYYYMM);

				if (true == (undefined !== H_calc_point[thistelpost])) {
					H_calc_point[thistelpost].docomo += this.tweakPointDocomo(A_details_docomo[cnt].charge, thistelstage);
				} else {
					H_calc_point[thistelpost].docomo = this.tweakPointDocomo(A_details_docomo[cnt].charge, thistelstage);
					H_calc_point[thistelpost].au = 0;
				}
			}
		}

		var A_details_au = this.O_Model.getTelDetailsPointAU(this.PactID, this.YYYYMM, this.getSetting().car_au);
		details_num = A_details_au.length;

		if (1 > details_num) {
			this.infoOut("au\u306E\u30DD\u30A4\u30F3\u30C8\u5BFE\u7167\u306E\u8ACB\u6C42\u60C5\u5831\u304C\u4E00\u4EF6\u3082\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		} else {
			this.infoOut(details_num + "\u4EF6\u306Eau\u8ACB\u6C42\u60C5\u5831\u3092\u51E6\u7406\u3057\u307E\u3059\u3002\n");

			for (cnt = 0;; cnt < details_num; cnt++) {
				thistelstage = this.getSetting().suo_docomo_default_point;
				thistelpost = this.O_Model.getTelPostid(this.PactID, A_details_au[cnt].telno, this.getSetting().car_au, this.YYYYMM);

				if (false == thistelpost) {
					this.errorTel(A_details_au[cnt].telno, 1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306F\u7B2C" + post_level + "\u968E\u5C64\u3088\u308A\u4E0A\u5C64\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002\n");
					continue;
				}

				if (true == (-1 !== array_merge(this.getSetting().A_suo_au_simple_plan, this.getSetting().A_win_single_simple).indexOf(A_details_au[cnt].planid))) {
					this.infoOut("\u96FB\u8A71\u756A\u53F7\uFF08" + A_details_au[cnt].telno + "\uFF09\u306F\u3001\u30DD\u30A4\u30F3\u30C8\u52A0\u7B97\u3057\u306A\u3044\u96FB\u8A71\u306E\u305F\u3081\u8A08\u7B97\u3092\u884C\u3044\u307E\u305B\u3093\u3002\n", 0);
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

		if (true == this.O_Model.checkTweakPointTbData(this.PactID, this.YYYYMM)) {
			this.errorOut(1000, "\u65E2\u306B\u7372\u5F97\u30DD\u30A4\u30F3\u30C8\u304C\u96C6\u8A08\u3055\u308C\u3066\u3044\u307E\u3059\u306E\u3067\u3001\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\u3002\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw die(-1);
		}

		if (0 < H_calc_point.length) {
			var res = this.O_Model.insertThisPoint(this.PactID, this.YYYYMM, H_calc_point);
		} else {
			this.infoOut("\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u8ACB\u6C42\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
			this.unLockProcess(this.O_View.get_ScriptName());
			throw die(-1);
		}

		if (true == PEAR.isError(res)) {
			this.get_DB().rollback();
			this.errorOut(1000, "\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u7372\u5F97\u30DD\u30A4\u30F3\u30C8\u306E\u96C6\u8A08\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3059\u3002\n");
		} else {
			this.get_DB().commit();
			this.infoOut("\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002\n");
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	tweakPointDocomo(charge, stage) {
		return +(charge * this.getSetting().suo_tweak_point_docomo / 100 / 100) * stage;
	}

	tweakPointAu(charge, stage) {
		return +(charge * this.getSetting().suo_tweak_point_au / 100 / 100) * stage;
	}

	__destruct() {
		super.__destruct();
	}

};