//
//購買管理ダウンロードProccess
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@filesource
//@uses ManagementDownloadProcBase
//@uses PurchaseDownloadView
//@uses ManagementPurchaseMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買管理ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@uses ManagementDownloadProcBase
//@uses PurchaseDownloadView
//@uses ManagementPurchaseMenuModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Purchase/Download/PurchaseDownloadView.php");

require("model/Management/Purchase/ManagementPurchaseMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/27
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
//@since 2008/03/27
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses ManagementPurchaseMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class PurchaseDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementPurchaseMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};