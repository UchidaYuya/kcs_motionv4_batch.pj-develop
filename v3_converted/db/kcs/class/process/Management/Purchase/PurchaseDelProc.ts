//
//購買ID削除Proccess
//
//更新履歴：<br>
//2008/04/01 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/01
//@filesource
//@uses ManagementDelProcBase
//@uses PurchaseDelView
//@uses PurchaseDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買ID削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/01
//@uses ManagementDelProcBase
//@uses PurchaseDelView
//@uses PurchaseDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Purchase/PurchaseDelModel.php");

require("view/Management/Purchase/PurchaseDelView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/01
//
//@access protected
//@return void
//@uses PurchaseDelView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses PurchaseDelModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/01
//
//@access public
//@return void
//
class PurchaseDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new PurchaseDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};