//
//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする （Process）
//
//更新履歴：<br>
//2009/04/08 前田 聡 作成
//
//KgCheckTelnoPostidProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/08
//@uses MtTableUtil
//@uses PactModel
//@uses TelModel
//@uses ProcessBaseBatch
//@uses KgCheckTelnoPostidView
//@uses KgCheckTelnoPostidModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/TelModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/KgCheckTelnoPostidView.php");

require("model/script/KgCheckTelnoPostidModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/04/08
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/04/08
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/04/08
//
//@access public
//@return void
//
class KgCheckTelnoPostidProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgCheckTelnoPostidView();
		this.O_Model = new KgCheckTelnoPostidModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//ＦＥＳＴＡ電話所属部署データディレクトリを取得
	//ＦＥＳＴＡ電話所属部署データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//対象テーブル番号を取得
	//テーブル名設定
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().KG + "\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().KG_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, "\uFF26\uFF25\uFF33\uFF34\uFF21\u96FB\u8A71\u6240\u5C5E\u90E8\u7F72\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "\uFF26\uFF25\uFF33\uFF34\uFF21\u96FB\u8A71\u6240\u5C5E\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//TelModelインスタンスを作成
		//請求月テーブルより電話番号マスターを取得する array(basename(予備項目１) => array(telno => 部署情報))
		//拠点一覧を取得
		//ファイルデータを拠点毎に処理
		//ファイルデータを拠点毎に処理 END
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				} else //pactid 毎のＦＥＳＴＡ電話所属部署データディレクトリ設定
				//ＦＥＳＴＡ電話所属部署データファイル名を取得
				//処理するファイル数
				//ＦＥＳＴＡ電話所属部署データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//全ファイルデータ配列
				//ファイル数分処理する
				//END FOR ファイル数分処理する
				//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
				//ログ出力
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_festaFile = this.getFileList(dataDirPact);
					var fileCnt = A_festaFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF26\uFF25\uFF33\uFF34\uFF21\u96FB\u8A71\u6240\u5C5E\u90E8\u7F72\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					A_festaFile.sort();
					var fileErrFlg = false;
					var H_allFileData = Array();

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//データファイルを取得
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var A_fileData = Array();
						A_fileData = this.O_Model.chkFestaData(dataDirPact + "/" + A_festaFile[fileCounter]);

						if (A_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //東京用部門ファイル
							{
								if (preg_match("/^" + this.getSetting().FILE_HEAD_TOKYO + "/", A_festaFile[fileCounter]) == true) //ファイル識別子をキーファイルデータを値とした連想配列へ格納
									//大阪用部門ファイル
									{
										H_allFileData[this.getSetting().FILE_HEAD_TOKYO] = A_fileData;
									} else if (preg_match("/^" + this.getSetting().FILE_HEAD_OSAKA + "/", A_festaFile[fileCounter]) == true) //ファイル識別子をキーファイルデータを値とした連想配列へ格納
									//不明ファイル
									{
										H_allFileData[this.getSetting().FILE_HEAD_OSAKA] = A_fileData;
									} else //次のpactidへスキップ
									{
										this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF26\uFF25\uFF33\uFF34\uFF21\u96FB\u8A71\u6240\u5C5E\u90E8\u7F72\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB" + A_festaFile[fileCounter] + "\u306E\u7A2E\u985E\u304C\u4E0D\u660E\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
										continue;
									}
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF26\uFF25\uFF33\uFF34\uFF21\u96FB\u8A71\u6240\u5C5E\u90E8\u7F72\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //ＦＥＳＴＡ電話所属部署データを電話と部署に分離して配列に格納する
						//電話番号をキー、ユーザ部署ＩＤを値とした連想配列データ
						{
							var H_editAllFileData = this.O_Model.editFestaData(H_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_festaFile.join(",") + "\n", 0);
				}

			var O_TelModel = new TelModel();
			var H_telnoX = O_TelModel.getPostInfo(A_pactid[pactCounter], tableNo, this.getSetting().CARID);
			var A_baseName = Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (var baseName of Object.values(A_baseName)) //拠点日本語名を取得
			//電話番号一覧を取得
			//ファイルデータを１電話番号ずつ処理
			//ファイルデータを１電話番号ずつ処理 END
			{
				if (baseName == this.getSetting().FILE_HEAD_TOKYO) {
					var baseNameJP = this.getSetting().BASENAME_TOKYO;
				} else if (baseName == this.getSetting().FILE_HEAD_OSAKA) {
					baseNameJP = this.getSetting().BASENAME_OSAKA;
				}

				var allFileDataCnt = H_editAllFileData[baseName].length;
				var A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
				//ＤＢに登録が無い電話の場合
				{
					var telno = telno + "";

					if (undefined !== H_telnoX[baseNameJP][telno] == false) //ＤＢに登録が有る電話の場合
						{
							print("\u96FB\u8A71\u756A\u53F7" + telno + "\u304C" + telX_tb + "\u306E\u90E8\u7F72" + H_editAllFileData[baseName][telno] + "\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\n");
						} else //ＦＥＳＴＡの登録部署と異なる部署に登録されている場合
						{
							if (H_editAllFileData[baseName][telno] != H_telnoX[baseNameJP][telno].userpostid) {
								print("\u96FB\u8A71\u756A\u53F7" + telno + "\u306F\uFF26\uFF25\uFF33\uFF34\uFF21\u3067\u306E\u767B\u9332\u90E8\u7F72" + H_editAllFileData[baseName][telno] + "\u3068" + telX_tb + "\u3067\u306E\u767B\u9332\u90E8\u7F72" + H_telnoX[baseNameJP][telno].userpostid + "\u304C\u7570\u306A\u3063\u3066\u3044\u307E\u3059\n");
							}
						}
				}
			}

			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30C1\u30A7\u30C3\u30AF\u5B8C\u4E86\n", 1);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().KG + "\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};