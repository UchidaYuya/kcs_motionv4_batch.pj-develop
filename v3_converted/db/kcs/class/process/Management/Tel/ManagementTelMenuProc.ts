//
//電話管理情報一覧Proccess
//
//更新履歴：<br>
//2008/05/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/21
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementTelMenuView
//@uses ManagementTelMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/21
//@uses ManagementMenuProcBase
//@uses ManagementTelMenuView
//@uses ManagementTelMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Tel/ManagementTelMenuView.php");

require("model/Management/Tel/ManagementTelMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return void
//@uses ManagementTelMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses ManagementTelMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
class ManagementTelMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementTelMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementTelMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};