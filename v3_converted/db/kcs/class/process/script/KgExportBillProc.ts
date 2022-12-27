//
//ＫＧ ＦＥＳＴＡ用データ出力処理 （Process）
//
//更新履歴：<br>
//2009/04/23 前田 聡 作成
//
//KgExportBillProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/23
//@uses MtTableUtil
//@uses ProcessBaseBatch
//@uses KgExportBillView
//@uses KgExportBillModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("process/ProcessBaseBatch.php");

require("view/script/KgExportBillView.php");

require("model/script/KgExportBillModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/04/23
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/04/23
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/04/23
//
//@access public
//@return void
//
class KgExportBillProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgExportBillView();
		this.O_Model = new KgExportBillModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//ＦＥＳＴＡ用データ出力ディレクトリを取得
	//ＦＥＳＴＡ用データ出力ディレクトリチェック（スクリプト終了）
	//テーブル名設定
	//ファイル名用タイプスタンプ取得
	//拠点毎に処理する
	//拠点毎に処理する END
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().KG_BILL_EXP + "\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + this.getSetting().KG_DIR_EXP + "/" + this.PactId + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, "\uFF26\uFF25\uFF33\uFF34\uFF21\u7528\u30C7\u30FC\u30BF\u51FA\u529B\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
		var now = str_replace(" ", "", str_replace(":", "", str_replace("-", "", this.get_DB().getNow())));

		for (var baseName of Object.values(this.getSetting().A_FILE_HEAD_LIST)) //ファイル出力バッファ初期化
		//区分毎に処理する
		//区分毎に処理する END
		//電話番号、通話区分順でソート
		//出力ファイル作成
		//ファイルオープン
		//ファイル出力
		//バッファ出力
		//ファイルクローズ
		{
			var A_fileBuff = Array();

			for (var kubunNo of Object.values(this.getSetting().A_TUWA_KUBUN_LIST)) //通話区分毎の対象内訳種別コード設定変数名
			//ＤＢより請求データ取得
			//取得エラーの場合
			//１電話番号ずつ処理する
			{
				var kubunName = "A_KUBUN" + kubunNo + "_CODE_LIST";
				var H_expData = this.O_Model.getTelDetailsDataBaseName(this.PactId, tableNo, this.getSetting().CARID, baseName, this.getSetting()[kubunName]);

				if (H_expData === false) {
					throw die(-1);
				}

				if (H_expData.length == 0) {
					continue;
				}

				var A_telno = Object.keys(H_expData);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
				//電話番号文字列長を取得
				//電話番号桁数オーバー
				//利用金額文字列長を取得
				//利用金額桁数オーバー
				{
					var telno = telno + "";
					var telnoLen = telno.length;

					if (telnoLen > this.getSetting().TELNO_LEN) //警告を出すのみ 処理続行
						//電話番号桁数不足
						{
							this.warningOut(1000, telno + "\u306E\u96FB\u8A71\u756A\u53F7\u6841\u6570\u304C" + this.getSetting().TELNO_LEN + "\u6841\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\n", 1);
						} else if (telnoLen < this.getSetting().TELNO_LEN) //電話番号の文字列数を調整する
						{
							for (var cnt = 0; cnt < this.getSetting().TELNO_LEN - telnoLen; cnt++) {
								telno = telno + this.getSetting().TELNO_BLANK;
							}
						}

					var charge = H_expData[telno] + "";
					var chargeLen = charge.length;

					if (chargeLen > this.getSetting().CHARGE_LEN) //警告を出すのみ 処理続行
						{
							this.warningOut(1000, telno + "\u306E\u5229\u7528\u91D1\u984D\u6841\u6570\u304C" + this.getSetting().CHARGE_LEN + "\u6841\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\n", 1);
						} else if (chargeLen < this.getSetting().CHARGE_LEN) //利用金額の文字列数を調整する
						{
							for (cnt = 0;; cnt < this.getSetting().CHARGE_LEN - chargeLen; cnt++) {
								charge = this.getSetting().CHARGE_BLANK + charge;
							}
						}

					A_fileBuff.push(telno + kubunNo + charge + "\r\n");
				}
			}

			A_fileBuff.sort();
			var fileName = dataDir + baseName + "Data" + now;
			var fp = fopen(fileName, "w");

			for (var lineBuff of Object.values(A_fileBuff)) {
				fwrite(fp, mb_convert_encoding(lineBuff, "SJIS-win", "UTF-8"));
			}

			fflush(fp);
			fclose(fp);
			this.infoOut("\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86 " + fileName + "\n", 1);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().KG_BILL_EXP + "\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};