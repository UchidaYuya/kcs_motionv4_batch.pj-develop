//
//購買ID移動Proccess
//
//更新履歴：<br>
//2008/03/25 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/25
//@filesource
//@uses ManagementMoveProcBase
//@uses PurchaseMoveView
//@uses PurchaseMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買ID移動Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/25
//@uses ManagementMoveProcBase
//@uses PurchaseMoveView
//@uses PurchaseMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Purchase/PurchaseMoveModel.php");

require("view/Management/Purchase/PurchaseMoveView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/25
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/25
//
//@access protected
//@return void
//@uses PurchaseMoveView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/25
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses PurchaseMoveModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/25
//
//@access public
//@return void
//
class PurchaseMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new PurchaseMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};