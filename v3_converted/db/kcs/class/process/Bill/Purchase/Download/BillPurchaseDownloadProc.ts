//
//購買請求ダウンロードProccess
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@filesource
//@uses BillDownloadProcBase
//@uses PurchaseDownloadView
//@uses PurchaseMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理請求ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@uses BillDownloadProcBase
//@uses PurchaseDownloadView
//@uses PurchaseMenuModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Purchase/Download/BillPurchaseDownloadView.php");

require("model/Bill/Purchase/BillPurchaseMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/04/28
//
//@abstract
//@access protected
//@return void
//@uses PurchaseDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_g_sess
//@param mixed $O_bill
//@abstract
//@access protected
//@return void
//@uses PurchaseMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
class BillPurchaseDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillPurchaseDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillPurchaseMenuModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};