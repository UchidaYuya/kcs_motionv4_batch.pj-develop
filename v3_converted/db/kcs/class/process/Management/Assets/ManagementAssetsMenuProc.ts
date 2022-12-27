//
//資産管理情報一覧Proccess
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementAssetsMenuView
//@uses ManagementAssetsMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@uses ManagementMenuProcBase
//@uses ManagementAssetsMenuView
//@uses ManagementAssetsMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Assets/ManagementAssetsMenuView.php");

require("model/Management/Assets/ManagementAssetsMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//@uses ManagementAssetsMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses ManagementAssetsMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
class ManagementAssetsMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementAssetsMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementAssetsMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};