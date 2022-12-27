//
//管理情報トップページProccess
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
//@uses ManagementMenuView
//@uses ManagementMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報トップページProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@uses ManagementMenuProcBase
//@uses ManagementMenuView
//@uses ManagementMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("model/Management/ManagementMenuModel.php");

require("view/Management/ManagementMenuView.php");

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
//@uses ManagementMenuModel
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
//@uses ManagementMenuModel
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
class ManagementMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};