//
//購買請求Proccess
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
//@uses PurchaseMenuView
//@uses PurchaseMenuModel
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
//@uses PurchaseDetailsView
//@uses PurchaseDetailsModel
//

require("process/Bill/BillDetailsProcBase.php");

require("model/Bill/Purchase/BillPurchaseDetailsModel.php");

require("view/Bill/Purchase/BillPurchaseDetailsView.php");

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
//@uses PurchaseDetailsModel
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
//@uses PurchaseDetailsModel
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
class BillPurchaseDetailsProc extends BillDetailsProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillPurchaseDetailsView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillPurchaseDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};