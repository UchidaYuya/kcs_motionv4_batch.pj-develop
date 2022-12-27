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
//@uses BillMenuProcBase
//@uses EvMenuView
//@uses EvMenuModel
//

require("process/Bill/BillMenuProcBase.php");

require("model/Bill/Ev/BillEvMenuModel.php");

require("view/Bill/Ev/BillEvMenuView.php");

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
//@uses EvMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvMenuModel
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
class BillEvMenuProc extends BillMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillEvMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new BillEvMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};