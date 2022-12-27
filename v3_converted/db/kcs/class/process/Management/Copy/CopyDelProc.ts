//
//コピー機削除Proccess
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementDelProcBase
//@uses CopyDelView
//@uses CopyDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementDelProcBase
//@uses CopyDelView
//@uses CopyDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Copy/CopyDelModel.php");

require("view/Management/Copy/CopyDelView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//@uses CopyDelView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses CopyDelModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new CopyDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};