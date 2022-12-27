//
//ショップ：価格表リレーション登録
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//error_reporting(E_ALL);
//
//ショップ：価格表登録
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author ishizaki
//@since 2008/02/08
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("MtSession.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//O_Sess
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/08
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/18
//
//@param mixed $A_stocklist
//@access public
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/07/18
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShowShopPriceView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.O_Sess = MtSession.singleton();
		this.H_assign.title = "\u4FA1\u683C\u8868\u767B\u9332";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML({
			"/Shop/MTPrice/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868"
		}, "shop");
		this.getSetting().loadConfig("price");
	}

	checkCGIParam() {
		if (true == (undefined !== _GET.pricelistid) && true == is_numeric(_GET.pricelistid)) {
			this.O_Sess.setSelf("pricelistid", _GET.pricelistid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var pricelistid = this.O_Sess.getSelf("pricelistid");

		if (true == is_null(pricelistid)) {
			header("Location: /Shop/Price/menu.php");
			throw die(0);
		}
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	displaySmarty(err_str = undefined) {
		var tmppath = KCS_DIR + PRICE_DIR + "/shop_" + this.H_assign.tmpfile;
		this.assignSmarty();
		this.get_Smarty().assign("shop", true);

		if (false == is_null(err_str)) {
			this.get_Smarty().assign("err_str", err_str);
			this.get_Smarty().display(KCS_DIR + PRICE_DIR + "/menu.tpl");
		} else {
			this.get_Smarty().display(tmppath);
		}
	}

	assignSmarty() {
		{
			let _tmp_0 = this.H_assign;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				this.get_Smarty().assign(key, value);
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};