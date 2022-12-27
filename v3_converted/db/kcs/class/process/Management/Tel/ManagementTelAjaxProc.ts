//
//電話管理用Ajax
//
//更新履歴：<br>
//2008/05/28 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/28
//@filesource
//@uses ManagementAjaxProcBase
//@uses ManagementTelMenuAjaxView
//@uses ManagementTelMenuAjaxModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話管理用Ajax
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/28
//@uses ManagementAjaxProcBase
//@uses ManagementTelAjaxView
//@uses ManagementTelAjaxModel
//

require("process/Management/ManagementAjaxProcBase.php");

require("model/Management/Tel/ManagementTelAjaxModel.php");

require("view/Management/Tel/ManagementTelAjaxView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/28
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/28
//
//@access protected
//@return void
//@uses ManagementMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/28
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
//@since 2008/05/28
//
//@access public
//@return void
//
class ManagementTelAjaxProc extends ManagementAjaxProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementTelAjaxView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementTelAjaxModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};