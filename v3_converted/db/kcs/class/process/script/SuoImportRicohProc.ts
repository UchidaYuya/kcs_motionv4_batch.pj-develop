//
//リコーコピー機データ取込処理 （Process）
//
//更新履歴：<br>
//2008/07/04 前田 聡 作成
//
//SuoImportRicohProc
//
//@package SUO
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/07/04
//@uses ProcessBaseBatch
//@uses SuoImportRicohView
//
//
//error_reporting(E_ALL|E_STRICT);

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportRicohView.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/07/04
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2008/07/04
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2008/07/04
//
//@access public
//@return void
//
class SuoImportRicohProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	{
		super(H_param);
		this.O_View = new SuoImportRicohView();
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//引数の値をメンバーに
	//請求データ取込
	//請求データ取込失敗した場合
	{
		this.infoOut("\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		system("php " + this.getSetting().KCS_DIR + "/script/SuoImportRicohBill.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg + " -t=" + this.TargetTable, rtn);

		if (0 != rtn) {
			this.errorOut(1000, "\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\n\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\n", 0, "", "");
			throw die(-1);
		}

		system("php " + this.getSetting().KCS_DIR + "/script/SuoImportRicohMeisai.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};