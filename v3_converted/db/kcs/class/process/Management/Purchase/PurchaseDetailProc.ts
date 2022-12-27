//
//購買ID詳細画面Proccess
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//購買ID詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2008/03/21
//@uses ManagementDetailProcBase
//@uses PurchaseDetailView
//@uses PurchaseDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Purchase/PurchaseDetailModel.php");

require("view/Management/Purchase/PurchaseDetailView.php");

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
//@uses PurchaseDetailView
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
//@uses PurchaseDetailModel
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
class PurchaseDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PurchaseDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new PurchaseDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};