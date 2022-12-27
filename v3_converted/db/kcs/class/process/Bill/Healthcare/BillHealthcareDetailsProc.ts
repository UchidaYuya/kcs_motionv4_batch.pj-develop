//
//運送請求Proccess
//
//更新履歴：<br>
//2008/04/23 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/23
//@filesource
//@uses BillMenuProcBase
//@uses TransitMenuView
//@uses TransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報トップページProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/23
//@uses BillDetailsProcBase
//@uses TransitDetailsView
//@uses TransitDetailsModel
//

require("process/Bill/BillDetailsProcBase.php");

require("model/Bill/Healthcare/BillHealthcareDetailsModel.php");

require("view/Bill/Healthcare/BillHealthcareDetailsView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/23
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/23
//
//@access protected
//@return void
//@uses TransitDetailsModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/23
//
//@param array $H_g_sess
//@param mixed $O_bill
//@access protected
//@return void
//@uses TransitDetailsModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return void
//
class BillHealthcareDetailsProc extends BillDetailsProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillHealthcareDetailsView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillHealthcareDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};