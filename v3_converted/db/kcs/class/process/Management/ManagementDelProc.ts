//
//全て一覧削除Proccess
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@filesource
//@uses ManagementDelProcBase
//@uses ManagementDelView
//@uses ManagementDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//全て一覧削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@uses ManagementDelProcBase
//@uses ManagementDelView
//@uses ManagementDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/ManagementDelModel.php");

require("view/Management/ManagementDelView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/21
//
//@access protected
//@return void
//@uses ManagementDelView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses ManagementDelModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class ManagementDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};