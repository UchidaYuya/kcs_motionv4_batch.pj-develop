//error_reporting(E_ALL|E_STRICT);
//require_once("model/TransitModel.php");	// ●未実装
//
//SendBillMailProc
//請求、管理、注文履歴メール送信
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2016/11/04
//

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SendBillMailView.php");

require("model/script/SendBillMailModel.php");

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
//メール送信のメイン部分
//@author web
//@since 2016/11/04
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2016/11/04
//
//@access public
//@return void
//
class SendBillMailProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	//Viewの生成
	//Modelの生成
	//$this->O_Model = new SendBillMailModel($this->get_MtScriptAmbient());
	{
		super(H_param);
		this.O_View = new SendBillMailView();
		this.O_Model = new SendBillMailModel();
	}

	doExecute(H_param: {} | any[] = Array()) //error_reporting(0);
	//ini_set( 'display_errors', 0 );
	//警告は表示しない
	//固有ログディレクトリの作成取得
	//処理開始
	//$this->infoOut("計算開始\n",0);
	//スクリプトの二重起動防止ロック
	//テスト中はロックされると面倒なので外しておく
	//引数の値をメンバーに
	//$this->Mode = $this->O_View->get_HArgv("-m");
	//メール送信するぽよ。
	//終了
	//$this->infoOut("メール送信完了\n",0);
	{
		ini_set("error_reporting", E_ERROR);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.pactid = this.O_View.get_HArgv("-p");

		while (this.O_Model.updateMail())

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw die(result);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};