//
//EV請求明細ダウンロードProccess
//
//更新履歴：<br>
//2010/07/15 宮澤龍彦 作成
//
//@package Bill
//@subpackage Proccess
//@author miyazawa
//@since 2010/07/15
//@filesource
//@uses BillDownloadProcBase
//@uses EvDownloadView
//@uses EvMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV請求明細ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author miyazawa
//@since 2010/07/15
//@uses BillDownloadProcBase
//@uses EvDownloadView
//@uses EvMenuModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Ev/Download/BillEvDetailsDownloadView.php");

require("model/Bill/Ev/BillEvDetailsModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author miyazawa
//@since 2010/07/15
//
//@abstract
//@access protected
//@return void
//@uses EvDownloadView
//
//
//各ページのモデル取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_g_sess
//@param mixed $O_bill
//@abstract
//@access protected
//@return void
//@uses EvMenuModel
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/07/15
//
//@access public
//@return void
//
class BillEvDetailsDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillEvDetailsDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillEvDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};