//
//購買請求明細ダウンロードProccess
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
//購買請求明細ダウンロードProccess
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

require("view/Bill/Purchase/Download/BillPurchaseDetailsDownloadView.php");

require("model/Bill/Purchase/BillPurchaseDetailsModel.php");

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
class BillPurchaseDetailsDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillPurchaseDetailsDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillPurchaseDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};