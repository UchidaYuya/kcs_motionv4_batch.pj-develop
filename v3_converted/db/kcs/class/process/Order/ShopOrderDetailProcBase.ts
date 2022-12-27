//
//受注詳細基底Proc
//
//更新履歴：<br>
//2008/07/03 igarashi 作成
//
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/07/03
//
//
//error_reporting(E_ALL|E_STRICT);
//
//受注詳細基底Proc
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("OrderFormProcBase.php");

require("OrderUtil.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/06/30
//
//@param array $H_param
//@access public
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderDetailProcBase extends OrderFormProcBase {
	static PUB = "/MTOrder";
	static FNC_PRINT_ALWAYS = 27;
	static FNC_PRINT_UPDATE = 28;
	static FNC_ORDERMAIL_SEND = 29;
	static FNC_PRINT_DELIVERY = 205;

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_order = OrderUtil.singleton();
		this.debagmode = false;
	}

	__destruct() {
		super.__destruct();
	}

};