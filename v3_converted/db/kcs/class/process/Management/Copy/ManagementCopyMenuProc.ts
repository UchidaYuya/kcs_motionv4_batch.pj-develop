//
//コピー機管理情報一覧Proccess
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementCopyMenuView
//@uses ManagementCopyMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementMenuProcBase
//@uses ManagementCopyMenuView
//@uses ManagementCopyMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Copy/ManagementCopyMenuView.php");

require("model/Management/Copy/ManagementCopyMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//@uses CopyMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses CopyMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class ManagementCopyMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementCopyMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementCopyMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};