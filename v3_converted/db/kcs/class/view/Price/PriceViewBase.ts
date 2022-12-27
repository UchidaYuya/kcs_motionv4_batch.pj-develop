//
//価格表Viewの基底クラス
//
//更新履歴<br>
//2008/06/26 石崎公久 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@abstract
//@package Price
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@filesource
//
//
//
//価格表Viewの基底クラス
//
//@uses ViewSmarty
//@abstract
//@package Price
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("MtAuthority.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//PriceNavi
//
//@var mixed
//@access protected
//
//
//O_Sess
//
//@var mixed
//@access private
//
//
//O_Auth
//
//@var mixed
//@access private
//
//
//PriceAuthType
//
//@var mixed
//@access private
//
//
//PactID
//
//@var mixed
//@access private
//
//
//テンプレートファイル
//
//@var mixed
//@access protected
//
//
//getPriceAuthType
//
//@author ishizaki
//@since 2008/08/04
//
//@access public
//@return void
//
//
//コンストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/02
//
//@access public
//@return void
//
//
//getSelfSession
//
//@author ishizaki
//@since 2008/08/04
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/05/01
//
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/04
//
//@param mixed $H_price
//@param mixed $usertplfile
//@param mixed $H_stock
//@param mixed $listtype
//@param mixed $A_carid
//@param mixed $priceheader
//@param mixed $pricefooter
//@param mixed $err_str
//@access public
//@return void
//
//
//メンバーにテンプレートファイル名を格納
//
//@author ishizaki
//@since 2009/08/24
//
//@param mixed $file
//@access protected
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//getPriceNavi
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//checkPriceAuthType
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
class PriceViewBase extends ViewSmarty {
	static Order = "/MTOrder";

	getPriceAuthType() {
		return this.PriceAuthType;
	}

	constructor(H_navi = undefined) {
		this.O_Sess = MtSession.singleton();
		H_navi.language = this.O_Sess.language;
		super(H_navi);

		if (false == is_null(H_navi)) {
			if ("ENG" === this.gSess().language) {
				this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTMLEng({
					"": "Price list"
				});
			} else {
				this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTML({
					"": "\u4FA1\u683C\u8868"
				});
			}
		}

		this.PactID = this.gSess().pactid;

		if (!is_null(this.gSess().memid) || is_null(this.gSess().pactid)) {
			var H_order = this.gSess().getPub(PriceViewBase.Order);

			if (!!H_order.pactid) {
				this.PactID = H_order.pactid;
			}
		}

		if (true == is_numeric(this.PactID)) {
			this.O_Auth = MtAuthority.singleton(this.PactID);
			this.PriceAuthType = this.checkPriceAuthType(this.PactID);
		} else {
			this.getOut().errorOut(8, "pactid\u304C\u306A\u3044", false);
		}

		this.getSetting().loadConfig("price");
	}

	checkCGIParam() {
		var OrderPub = this.O_Sess.getPub(PriceViewBase.Order);

		if (true == (undefined !== _GET.price_detailid)) {
			OrderPub.price_detailid = _GET.price_detailid;
			this.O_Sess.setPub(PriceViewBase.Order, OrderPub);
			header("Location: order_form.php");
			throw die(0);
		}

		if (true == (undefined !== _GET.carid) || true == (undefined !== _GET.type)) {
			this.O_Sess.setSelf("carid", _GET.carid);
			this.O_Sess.setSelf("type", _GET.type);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}
	}

	getSelfSession() {
		return this.O_Sess.getSelfAll();
	}

	displaySmarty(err_str = "") //言語によるテンプレートの振り分け
	//$this->get_Smarty()->display( $this->getDefaultTemplate());
	{
		if ("ENG" === this.gSess().language) {
			var tmppath = KCS_DIR + PRICE_DIR_ENG + "/menu.tpl";
		} else {
			tmppath = KCS_DIR + PRICE_DIR + "/menu.tpl";
		}

		this.get_Smarty().assign("php_self", _SERVER.PHP_SELF);
		this.get_Smarty().assign("page_path", this.PriceNavi);
		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().assign("backurl", "/Menu/menu.php");
		this.get_Smarty().display(tmppath);
	}

	displayHTML(carid, H_price, usertplfile, H_stock, listtype, A_carid, priceheader = undefined, pricefooter = undefined, err_str = undefined) //言語によるテンプレートの振り分け
	//$this->get_Smarty()->display($tmppath);
	{
		this._setTemplateFile(usertplfile);

		if (false == is_null(priceheader)) {
			this.get_Smarty().assign("priceheader", priceheader);
		}

		if (false == is_null(pricefooter)) {
			this.get_Smarty().assign("pricefooter", pricefooter);
		}

		this.get_Smarty().assign("err_str", err_str);

		if (true == (undefined !== this.H_assign.H_cdmaone_price)) {
			this.get_Smarty().assign("H_cdmaone_price", this.H_assign.H_cdmaone_price);
		}

		this.get_Smarty().assign("H_jsfile", ["style_chenger.js"]);
		this.get_Smarty().assign("thiscarid", carid);
		this.get_Smarty().assign("page_path", this.PriceNavi);
		this.get_Smarty().assign("A_carid", A_carid);
		this.get_Smarty().assign("listtype", listtype);
		this.get_Smarty().assign("H_price", H_price);
		this.get_Smarty().assign("H_stock", H_stock);
		this.get_Smarty().assign("php_self", _SERVER.PHP_SELF);
		this.get_Smarty().assign("backurl", "/Menu/menu.php");
		this.get_Smarty().display(this.templateFile);
	}

	_setTemplateFile(file) {
		if ("ENG" === this.gSess().language) {
			this.templateFile = KCS_DIR + PRICE_DIR_ENG + "/" + file;
		} else {
			this.templateFile = KCS_DIR + PRICE_DIR + "/" + file;
		}
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	checkPriceAuthType() {
		if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_admin")) {
			return "fnc_mt_price_admin";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_shop")) {
			return "fnc_mt_price_shop";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_pact")) {
			return "fnc_mt_price_pact";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_post")) {
			return "fnc_mt_price_post";
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};