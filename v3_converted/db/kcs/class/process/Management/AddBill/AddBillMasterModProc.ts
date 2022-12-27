//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("process/Management/AddBill/AddBillMasterAddProc.php");

require("view/Management/AddBill/AddBillMasterModView.php");

require("model/Management/AddBill/AddBillMasterModModel.php");

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
class AddBillMasterModProc extends AddBillMasterAddProc {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMasterModView();
	}

	get_Model(H_g_sess) {
		return new AddBillMasterModModel(this.get_DB(), H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};