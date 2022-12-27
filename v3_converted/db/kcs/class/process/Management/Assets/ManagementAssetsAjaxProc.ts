//
//端末管理用Ajax
//
//更新履歴：<br>
//2008/08/07 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/07
//@filesource
//@uses ManagementAjaxProcBase
//@uses ManagementAssetsMenuAjaxView
//@uses ManagementAssetsMenuAjaxModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//端末管理用Ajax
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/07
//@uses ManagementAjaxProcBase
//@uses ManagementAssetsAjaxView
//@uses ManagementAssetsAjaxModel
//

require("process/Management/ManagementAjaxProcBase.php");

require("model/Management/Assets/ManagementAssetsAjaxModel.php");

require("view/Management/Assets/ManagementAssetsAjaxView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/07
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/07
//
//@access protected
//@return void
//@uses ManagementMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/07
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
//@since 2008/08/07
//
//@access public
//@return void
//
class ManagementAssetsAjaxProc extends ManagementAjaxProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementAssetsAjaxView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementAssetsAjaxModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};