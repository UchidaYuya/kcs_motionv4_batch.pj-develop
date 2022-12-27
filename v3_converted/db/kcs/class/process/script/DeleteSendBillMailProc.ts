//
//ヘルスケア取込処理 （Process）
//
//更新履歴：<br>
//2015/0710 伊達 作成
//
//CalcHealthcareProc
//
//@package
//@subpackage Process
//@author date
//@filesource
//@since 2015/07/10
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("model/TransitModel.php");	// ●未実装

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/DeleteSendBillMailView.php");

require("model/script/DeleteSendBillMailModel.php");

//
//コンストラクタ
//
//@author date
//@since 2015/07/10
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/07/10
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
class DeleteSendBillMailProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new DeleteSendBillMailView();
		this.O_Model = new DeleteSendBillMailModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u6DFB\u4ED8\u8CC7\u6599\u306E\u524A\u9664\u958B\u59CB\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.O_Model.update(this.PactId);
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw die();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};