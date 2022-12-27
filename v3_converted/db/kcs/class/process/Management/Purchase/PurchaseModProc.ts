//
//購買ID変更Process
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/14
//@filesource
//@uses ManagementModProcBase
//@uses PurchaseModView
//@uses PurchaseModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買ID変更Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/14
//@uses ManagementModProcBase
//@uses PurchaseModView
//@uses PurchaseModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Purchase/PurchaseModModel.php");

require("view/Management/Purchase/PurchaseModView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/14
//
//@access protected
//@return void
//@uses PurchaseModView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses PurchaseModModel
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
class PurchaseModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new PurchaseModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};