//
//注文メニューProcクラス
//
//更新履歴：<br>
//2008/05/13 宮澤龍彦 作成
//
//@uses OrderMenuProcBase
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/05/13
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ディレクトリ名
//
//const PUB = "/Order";
//
//プロセス実装
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/Order/OrderMenuProcBase.php");

require("model/Order/OrderMenuModelBase.php");

require("view/Order/OrderMenuViewBase.php");

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
class OrderMenuProc extends OrderMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderMenuViewBase();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new OrderMenuModelBase(O_db0, H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};