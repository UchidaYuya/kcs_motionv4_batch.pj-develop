//
//コピー機請求明細ダウンロードProccess
//
//更新履歴：<br>
//2008/07/15 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/15
//@filesource
//@uses BillDownloadProcBase
//@uses CopyDownloadView
//@uses CopyMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機請求明細ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/15
//@uses BillDownloadProcBase
//@uses CopyDownloadView
//@uses CopyMenuModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Copy/Download/BillCopyDetailsDownloadView.php");

require("model/Bill/Copy/BillCopyDetailsModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/07/15
//
//@abstract
//@access protected
//@return void
//@uses CopyDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $H_g_sess
//@param mixed $O_bill
//@abstract
//@access protected
//@return void
//@uses CopyMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/07/15
//
//@access public
//@return void
//
class BillCopyDetailsDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillCopyDetailsDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillCopyDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};