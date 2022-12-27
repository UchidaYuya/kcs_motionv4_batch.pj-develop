//error_reporting(E_ALL|E_STRICT);
//
//SendOrderHistoryMail
//メール送信
//@uses ProcessBaseHtml
//@package
//@author date
//@since 2016/10/11
//

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("process/Bill/Mail/SendMailProc.php");

require("model/Bill/Mail/SendOrderHistoryMailModel.php");

require("view/Bill/Mail/SendOrderHistoryMailView.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class SendOrderHistoryMailProc extends SendMailProc {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new SendOrderHistoryMailView();
	}

	get_Model(H_g_sess) {
		return new SendOrderHistoryMailModel(this.get_DB(), H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};