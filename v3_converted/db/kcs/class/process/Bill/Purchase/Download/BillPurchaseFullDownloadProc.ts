//
//購買請求配下全ての部署ダウンロードProccess
//
//更新履歴：<br>
//2008/04/30 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/30
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
//@since 2008/04/30
//@uses BillDownloadProcBase
//@uses PurchaseFullDownloadView
//@uses PurchaseFullDownloadModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Purchase/Download/BillPurchaseFullDownloadView.php");

require("model/Bill/Purchase/Download/BillPurchaseFullDownloadModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/30
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/04/30
//
//@abstract
//@access protected
//@return void
//@uses PurchaseFullDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/04/30
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
//@since 2008/04/30
//
//@access public
//@return void
//
class BillPurchaseFullDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillPurchaseFullDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillPurchaseFullDownloadModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};