//
//運送請求明細ダウンロードProccess
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
//@uses TransitDownloadView
//@uses TransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送請求明細ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@uses BillDownloadProcBase
//@uses TransitDownloadView
//@uses TransitMenuModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Transit/Download/BillTransitDetailsDownloadView.php");

require("model/Bill/Transit/BillTransitDetailsModel.php");

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
//@uses TransitDownloadView
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
//@uses TransitMenuModel
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
class BillTransitDetailsDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillTransitDetailsDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillTransitDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};