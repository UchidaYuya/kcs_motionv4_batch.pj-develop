//
//注文履歴詳細ページプロセス
//
//更新履歴：<br>
//2008/04/01 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/03/07
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderFormProcBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/Order/OrderFormProcBase.php");

require("model/Order/OrderFormModel.php");

require("view/Order/OrderFormView.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderDetailProc extends OrderFormProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderFormView();
	}

	get_Model(H_g_sess: {} | any[], O_order) {
		return new OrderFormModel(O_db0, H_g_sess, O_order);
	}

	__destruct() {
		super.__destruct();
	}

};