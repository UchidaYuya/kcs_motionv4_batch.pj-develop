//
//EV ID管理情報一覧Proccess
//
//更新履歴：<br>
//2010/07/15 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/15
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementEvMenuView
//@uses ManagementEvMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/15
//@uses ManagementMenuProcBase
//@uses ManagementEvMenuView
//@uses ManagementEvMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Ev/ManagementEvMenuView.php");

require("model/Management/Ev/ManagementEvMenuModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author maeda
//@since 2010/07/15
//
//@access protected
//@return void
//@uses EvMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author maeda
//@since 2010/07/15
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvMenuModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
class ManagementEvMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementEvMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementEvMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};