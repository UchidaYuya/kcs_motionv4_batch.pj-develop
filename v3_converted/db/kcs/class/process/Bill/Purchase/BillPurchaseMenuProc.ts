//
//購買請求Proccess
//
//更新履歴：<br>
//2008/04/11 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/11
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
//@since 2008/04/11
//@uses BillMenuProcBase
//@uses PurchaseMenuView
//@uses PurchaseMenuModel
//

require("process/Bill/BillMenuProcBase.php");

require("model/Bill/Purchase/BillPurchaseMenuModel.php");

require("view/Bill/Purchase/BillPurchaseMenuView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/11
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/11
//
//@access protected
//@return void
//@uses PurchaseMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/11
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses PurchaseMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/11
//
//@access public
//@return void
//
class BillPurchaseMenuProc extends BillMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillPurchaseMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new BillPurchaseMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};