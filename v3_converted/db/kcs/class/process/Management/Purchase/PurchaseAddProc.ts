//
//購買ID新規登録Process
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementAddProcBase
//@uses PurchaseAddView
//@uses PurchaseAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買ID新規登録Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@uses ManagementAddProcBase
//@uses PurchaseAddView
//@uses PurchaseAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Purchase/PurchaseAddModel.php");

require("view/Management/Purchase/PurchaseAddView.php");

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
//@uses PurchaseAddView
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
//@uses PurchaseAddModel
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
class PurchaseAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new PurchaseAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};