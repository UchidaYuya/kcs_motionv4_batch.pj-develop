require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

//values
//顧客IDの指定
//請求対象月yyyymm
//purchase_tbにも追加するかどうか
//delete後Copyか追加か
//バックアップフラグ
//処理対象のpactid一覧
//データの場所
//objects
//abstract関数
//Viewの作成
//modelの作成
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
//getModel
//モデルの取得
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//getView
//viewの作成
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//Initialize
//初期化
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//endCommon
//
//@author web
//@since 2017/02/23
//
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
class ImportBaseProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.debug = false;
	}

	getModel() {
		if (this.O_model) {
			return this.O_model;
		}

		return this.createModel(this.BillDate);
	}

	getView() {
		if (this.O_view) {
			return this.O_view;
		}

		return this.createView();
	}

	initCommon() //viewの作成
	//error_reporting(0);
	//ini_set( 'display_errors', 0 );
	//ini_set( 'error_reporting', E_ERROR );	//	警告は表示しない
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//顧客ID(pactid)
	//取込み対象月の指定
	//purchase_tbにも追加するかどうか
	//delete後Copyか追加か
	//バックアップについて
	//modelの作成
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//処理する契約ＩＤを取得する
	//処理する契約ＩＤ数
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	{
		var O_view = this.getView();
		this.set_Dirs(O_view.get_ScriptName());

		if (!this.debug) {
			this.lockProcess(O_view.get_ScriptName());
		}

		this.PactId = O_view.get_HArgv("-p");
		this.BillDate = O_view.get_HArgv("-y");
		this.TargetTable = O_view.get_HArgv("-t");
		this.Mode = O_view.get_HArgv("-e");
		this.BackUpFlg = O_view.get_HArgv("-b");
		var O_model = this.getModel();
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + "/" + this.getSetting().DATA_DIRECTORY;

		if (!this.isDirCheck(dataDir, "rw")) {
			this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		if ("Y" == this.BackUpFlg) {
			var tblist = O_model.getBackUpTableNameList();

			for (var tbname of Object.values(tblist)) {
				var expFile = dataDir + "/" + tbname + date("YmdHis") + ".exp";

				if (false == this.expData(tbname, expFile, this.getSetting().NUM_FETCH)) {
					throw die(-1);
				}
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

		this.A_TargetPactid = A_pactid;
		this.O_model = O_model;
		this.O_view = O_view;
		this.dataDirectory = dataDir;
	}

	endCommon() //スクリプトの二重起動防止ロック解除
	{
		if (!this.debug) {
			this.unLockProcess(this.O_view.get_ScriptName());
		}

		this.set_ScriptEnd();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};