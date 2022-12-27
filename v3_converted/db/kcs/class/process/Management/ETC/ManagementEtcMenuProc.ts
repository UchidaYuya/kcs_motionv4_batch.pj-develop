//
//ETC管理情報一覧Proccess
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/27
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementEtcMenuView
//@uses ManagementEtcMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/27
//@uses ManagementMenuProcBase
//@uses ManagementEtcMenuView
//@uses ManagementEtcMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/ETC/ManagementEtcMenuView.php");

require("model/Management/ETC/ManagementEtcMenuModel.php");

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
//@uses ManagementEtcMenuView
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
//@uses ManagementEtcMenuModel
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
class ManagementEtcMenuProc extends ManagementMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementEtcMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementEtcMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};