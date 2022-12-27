//
//コピー機請求配下全ての部署ダウンロードProccess
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
//管理請求ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/15
//@uses BillDownloadProcBase
//@uses CopyFullDownloadView
//@uses CopyFullDownloadModel
//

require("process/Bill/BillDownloadProcBase.php");

require("view/Bill/Copy/Download/BillCopyFullDownloadView.php");

require("model/Bill/Copy/Download/BillCopyFullDownloadModel.php");

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
//@uses CopyFullDownloadView
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
class BillCopyFullDownloadProc extends BillDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillCopyFullDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillCopyFullDownloadModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};