//
//EV請求Proccess
//
//更新履歴：<br>
//2010/07/15 宮澤龍彦 作成
//
//@package Bill
//@subpackage Proccess
//@author miyazawa
//@since 2010/07/15
//@filesource
//@uses BillMenuProcBase
//@uses EvMenuView
//@uses EvMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報トップページProccess
//
//@package Bill
//@subpackage Proccess
//@author miyazawa
//@since 2010/07/15
//@uses BillDetailsProcBase
//@uses EvDetailsView
//@uses EvDetailsModel
//

require("process/Bill/BillDetailsProcBase.php");

require("model/Bill/Ev/BillEvDetailsModel.php");

require("view/Bill/Ev/BillEvDetailsView.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2010/07/15
//
//@access protected
//@return void
//@uses EvDetailsModel
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_g_sess
//@param mixed $O_bill
//@access protected
//@return void
//@uses EvDetailsModel
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/07/15
//
//@access public
//@return void
//
class BillEvDetailsProc extends BillDetailsProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillEvDetailsView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillEvDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};