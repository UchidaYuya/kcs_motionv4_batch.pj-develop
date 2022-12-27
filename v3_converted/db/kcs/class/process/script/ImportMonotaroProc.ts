//
//ものたろう取込み(伊達)
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportMonotaroProc
//ものたろう取込み
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2017/01/26
//

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportMonotaroView.php");

require("model/script/ImportMonotaroModel.php");

//
//__construct
//コンストラクタ
//@author web
//@since 2017/01/26
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//実行
//@author web
//@since 2017/01/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
class ImportMonotaroProc extends ProcessBaseBatch {
	static dirmono = "MonotaRO";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("monotaro");
	}

	doExecute(H_param: {} | any[] = Array()) //viewの作成
	//error_reporting(0);
	//ini_set( 'display_errors', 0 );
	//ini_set( 'error_reporting', E_ERROR );	//	警告は表示しない
	//固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//顧客ID(pactid)
	//取込み対象月の指定
	//purchase_tbにも追加するかどうか
	//delete後Copyか追加か
	//バックアップについて
	//modelの作成
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//処理する契約ＩＤ配列を初期化
	//処理する契約ＩＤを取得する
	//処理する契約ＩＤ数
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	//pactidごとに処理する
	//スクリプトの二重起動防止ロック解除
	//終了
	//exit(0);
	{
		var O_view = new ImportMonotaroView();
		this.set_Dirs(O_view.get_ScriptName());
		this.infoOut("\u53D6\u8FBC\u307F\u958B\u59CB(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.lockProcess(O_view.get_ScriptName());
		this.PactId = O_view.get_HArgv("-p");
		this.BillDate = O_view.get_HArgv("-y");
		this.TargetTable = O_view.get_HArgv("-t");
		this.Mode = O_view.get_HArgv("-e");
		this.BackUpFlg = O_view.get_HArgv("-b");
		var O_model = new ImportMonotaroModel(this.get_MtScriptAmbient(), this.BillDate);
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + "/" + ImportMonotaroProc.dirmono;

		if (!this.isDirCheck(dataDir, "rw")) {
			this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		if ("Y" == this.BackUpFlg) //xxテーブルのバックアップ
			{
				var tbno = O_model.getTableNo();
				var purchdetails_tb = "purchase_details_" + tbno + "_tb";
				var expFile = dataDir + "/" + purchdetails_tb + date("YmdHis") + ".exp";

				if (false == this.expData(purchdetails_tb, expFile, this.getSetting().NUM_FETCH)) {
					throw die(-1);
				}
			}

		var A_pactid = Array();
		A_pactid = this.getPactList(dataDir, this.PactId);
		var pactCnt = A_pactid.length;

		if (pactCnt <= 0) //エラー出力
			//ロック解除
			{
				this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
				this.unLockProcess(O_view.get_ScriptName());
				throw die(-1);
			}

		var A_pactDone = Array();

		for (var pactid of Object.values(A_pactid)) //データディレクトリを開く
		//ディレクトリが開けたかチェック
		//ファイル一つずつ取得する
		//ディレクトリを閉じる
		//エラーでなければコミット
		{
			var dir = dataDir + "/" + pactid;
			var handle = opendir(dir);

			if (handle === false) {
				this.errorOut(1000, "pactid=" + pactid + "\u306E\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F\n", 0, "", "");
				this.errorOut(1000, dir + "\u304C\u958B\u3051\u306A\u3044\n", 0, "", "");
				continue;
			}

			if (!O_model.setPactID(pactid, this.Mode)) {
				closedir(handle);
				this.errorOut(1000, "pactid=" + pactid + "\u306E\u53D6\u8FBC\u307F\u5931\u6557\n", 0, "", "");
				continue;
			}

			O_model.beginTransaction();
			var bError = false;
			var bSuccess = false;

			while ((filename = readdir(handle)) !== false) //ファイルのみ取得
			{
				var path = dir + "/" + filename;

				if (filetype(path) == "file") //ファイルを読み込んでDBに追加する
					{
						if (O_model.addDataByFile(path, this.TargetTable)) //読み込み成功しました
							{
								bSuccess = true;
							} else //何かしらのエラー。ロールバックする
							{
								bError = true;
								O_model.rollback();
								this.errorOut(1000, "pactid=" + pactid + "\u306E\u53D6\u8FBC\u307F\u5931\u6557\n", 0, "", "");
								break;
							}
					}
			}

			closedir(handle);

			if (!bError && bSuccess) //ASP追加
				//コミットする
				{
					O_model.addASP();
					O_model.commit();
				}
		}

		this.unLockProcess(O_view.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u53D6\u8FBC\u307F\u7D42\u4E86(" + date("Y-m-d H:i:s") + ")\n", 0);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};