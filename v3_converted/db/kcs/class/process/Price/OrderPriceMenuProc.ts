//
//価格表のメニューページProccess
//
//更新履歴：<br>
//2008/06/26 石崎 作成
//
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表のメニューページProccess
//
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("process/Price/OrderPriceMenuProcBase.php");

require("model/Price/PriceMenuModel.php");

require("view/Price/OrderPriceMenuView.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author ishizaki
//@since 2008/06/26
//
//@access protected
//@return void
//@uses TweakPointMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TweakPointMenuModel
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class OrderPriceMenuProc extends OrderPriceMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderPriceMenuView({
			"": "\u6CE8\u6587"
		}, {
			"": "\u4FA1\u683C\u8868"
		});
	}

	get_Model(pactid, postid) {
		return new PriceMenuModel(pactid, postid);
	}

	__destruct() {
		super.__destruct();
	}

};