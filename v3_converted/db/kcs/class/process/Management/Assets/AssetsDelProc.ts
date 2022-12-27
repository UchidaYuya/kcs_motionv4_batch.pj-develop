//
//資産削除Proccess
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementDelProcBase
//@uses AssetsDelView
//@uses AssetsDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@uses ManagementDelProcBase
//@uses AssetsDelView
//@uses AssetsDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Assets/AssetsDelModel.php");

require("view/Management/Assets/AssetsDelView.php");

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
//@uses AssetsDelView
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
//@uses AssetsDelModel
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
class AssetsDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};