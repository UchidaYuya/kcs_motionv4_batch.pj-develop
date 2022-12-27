//
//運送管理情報一覧Proccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementTransitMenuView
//@uses ManagementTransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementMenuProcBase
//@uses ManagementTransitMenuView
//@uses ManagementTransitMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Transit/ManagementTransitMenuView.php");

require("model/Management/Transit/ManagementTransitMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//@uses TransitMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TransitMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class ManagementTransitMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementTransitMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementTransitMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};