//
//購買管理情報一覧Proccess
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/07
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementPurchaseMenuView
//@uses ManagementPurchaseMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@uses ManagementMenuProcBase
//@uses ManagementPurchaseMenuView
//@uses ManagementPurchaseMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Purchase/ManagementPurchaseMenuView.php");

require("model/Management/Purchase/ManagementPurchaseMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/13
//
//@access protected
//@return void
//@uses PurchaseMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/13
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
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementPurchaseMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementPurchaseMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementPurchaseMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};