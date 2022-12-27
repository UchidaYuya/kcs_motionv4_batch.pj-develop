//error_reporting(E_ALL|E_STRICT);
//
//AddBillCopyBulkProc
//
//@uses AddBillModBulkProc
//@package
//@author web
//@since 2016/10/03
//

require("process/Bill/AddBill/AddBillModBulkProc.php");

require("view/Bill/AddBill/AddBillCopyBulkView.php");

require("model/Bill/AddBill/AddBillCopyBulkModel.php");

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
class AddBillCopyBulkProc extends AddBillModBulkProc {
	constructor(H_param: {} | any[] = Array()) //メニューにて、検索の対象月が当月じゃないなら全てのテーブルを対象にする
	{
		super(H_param);

		if (_SESSION["/Bill/AddBill/Input/menu.php"].search.range != "now") {
			this.tb_all_flag = true;
		}
	}

	get_View() {
		return new AddBillCopyBulkView();
	}

	get_Model(H_g_sess) {
		return new AddBillCopyBulkModel(this.get_DB(), H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};