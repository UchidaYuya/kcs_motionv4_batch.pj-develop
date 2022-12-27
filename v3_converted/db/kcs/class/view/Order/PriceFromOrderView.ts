//
//注文側価格表メニュー表示
//
//更新履歴：<br>
//2008/06/26	石崎公久	作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtAuthority
//@uses MtSession
//@package Price
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//
//
//
//注文側価格表メニュー表示
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtAuthority
//@uses MtSession
//@package Price
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//

require("MtSession.php");

require("MtAuthority.php");

require("view/Price/PriceViewBase.php");

require("view/MakePankuzuLink.php");

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
//ordertype
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
//H_assign
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
//PostID
//
//@var mixed
//@access private
//
//
//Site
//
//@var mixed
//@access private
//
//
//H_order_session
//
//@var mixed
//@access public
//
//
//getPriceAuthType
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//getPactID
//
//@author ishizaki
//@since 2008/09/12
//
//@access public
//@return void
//
//
//getPostID
//
//@author ishizaki
//@since 2009/01/20
//
//@access public
//@return void
//
//
//setPriceNavi
//
//@author ishizaki
//@since 2008/08/27
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/30
//
//@param string $err_str
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
//
//@param mixed $H_price
//@param mixed $A_pattern
//@param mixed $pricepattern
//@param mixed $carid
//@param mixed $priceheader
//@param mixed $pricefooter
//@access public
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
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class PriceFromOrderView extends PriceViewBase {
	static Pub = "/price_return";
	static Order = "/MTOrder";

	getPriceAuthType() {
		return this.PriceAuthType;
	}

	getPactID() {
		return this.PactID;
	}

	getPostID() {
		return this.PostID;
	}

	setPriceNavi(H_navi) {
		this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTML(H_navi);
	}

	constructor(H_navi = undefined) {
		super(H_navi);
		this.O_Sess = MtSession.singleton();

		if (false == is_null(H_navi)) {
			this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTML(H_navi);
		} else {
			var OrderPub = this.O_Sess.getPub(PriceFromOrderView.Order);
			this.getOut().debugOut("view/Order/PriceFromOrderView::__construct()>>url:" + this.O_Sess.getSelf("url"), false);

			if (true == is_null(this.O_Sess.getSelf("url"))) {
				var H_url = parse_url(_SERVER.HTTP_REFERER);
				this.getOut().debugOut("view/Order/PriceFromOrderView::__construct()>>_SERVER'HTTP_REFERER':" + _SERVER.HTTP_REFERER, false);
				this.O_Sess.setSelf("url", H_url.path);
				this.getOut().debugOut("view/Order/PriceFromOrderView::__construct()>>url:" + this.O_Sess.getSelf("url"), false);
			}

			this.Site = "user";

			if (false == is_null(this.gSess().memid)) {
				this.Site = "shop";
			}

			if ("ENG" === this.gSess().language) {
				this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTMLEng({
					[this.O_Sess.getSelf("url")]: OrderPub.carname + " " + OrderPub.ptnname,
					"": "Price list"
				}, this.Site);
			} else {
				this.PriceNavi = MakePankuzuLink.makePankuzuLinkHTML({
					[this.O_Sess.getSelf("url")]: OrderPub.carname + " " + OrderPub.ptnname,
					"": "\u4FA1\u683C\u8868"
				}, this.Site);
			}
		}

		var H_order = this.gSess().getPub(PriceFromOrderView.Order);
		this.H_order_session = H_order;

		if ((!is_null(this.gSess().memid) || is_null(this.gSess().pactid)) && !!H_order.pactid) {
			this.PactID = H_order.pactid;
		} else {
			this.PactID = this.gSess().pactid;
		}

		if (false == is_null(H_order.applypostid)) {
			this.PostID = H_order.applypostid;
		} else if (true == is_null(this.gSess().postid)) {
			this.PostID = H_order.postid;
		} else {
			this.PostID = this.gSess().postid;
		}

		if (true == is_numeric(this.PactID)) {
			this.O_Auth = MtAuthority.singleton(this.PactID);
			this.PriceAuthType = this.checkPriceAuthType(this.PactID);
		} else {
			this.getOut().errorOut(8, "pactid\u304C\u306A\u3044", true);
		}

		this.getSetting().loadConfig("price");
	}

	checkCGIParam() {
		var OrderPub = this.O_Sess.getPub(PriceFromOrderView.Order);

		if (true == (undefined !== _GET.price_detailid)) //下で入れた注文画面からのPOSTを入れなおして返す 20090327miya
			//注文画面以外へも帰れるように変更 20080908miya
			{
				var url = this.O_Sess.getSelf("url");
				OrderPub.price_detailid = _GET.price_detailid;
				var OrderSelf = this.O_Sess.getPub(url);

				if (true == Array.isArray(OrderSelf)) {
					for (var key in OrderSelf) {
						var val = OrderSelf[key];
						OrderPub[key] = val;
					}
				}

				if (1 > Array.from(OrderPub).length) {
					this.getOut().errorOut(8, "\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u306A\u3044", true);
				}

				this.O_Sess.setPub(PriceFromOrderView.Order, OrderPub);
				this.O_Sess.clearSessionSelf();
				header("Location: " + url);
				throw die(0);
			}

		if (false == (undefined !== OrderPub.type) && true == (undefined !== _POST.type)) {
			OrderPub.type = _POST.type;
		}

		if (false == (undefined !== OrderPub.carid) && true == is_numeric(_POST.carid)) {
			OrderPub.carid = _POST.carid;
		}

		if (false == (undefined !== OrderPub.cirid) && true == is_numeric(_POST.cirid)) {
			OrderPub.cirid = _POST.cirid;
		}

		if (false == (undefined !== OrderPub.ppid) && true == is_numeric(_POST.ppid)) {
			OrderPub.ppid = _POST.ppid;
		}

		if (true == (undefined !== _POST.tempname) || true == (undefined !== _POST.deftemp) || true == (undefined !== _POST.recogpostid) || true == (undefined !== _POST.purchase) || true == (undefined !== _POST.pay_frequency)) //名称と既定は元ページのローカルセッション（SELF）に入る
			//選択しないで戻ったときのために購入方式と割賦回数も入れておく
			//登録部署はディレクトリセッションに入る
			//雛型でPOSTから入ってきたときのみという条件をつけなかったので注文画面で消えていた 20090312miya
			{
				url = this.O_Sess.getSelf("url");
				OrderSelf.tempname = _POST.tempname;
				OrderSelf.deftemp = _POST.deftemp;
				OrderSelf.purchase = _POST.purchase;
				OrderSelf.pay_frequency = _POST.pay_frequency;
				this.O_Sess.setPub(url, OrderSelf);

				if ("" != _POST.recogpostid) {
					OrderPub.recogpostid = _POST.recogpostid;
				}

				if (1 > Array.from(OrderPub).length) {
					this.getOut().errorOut(8, "\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u306A\u3044", true);
				}

				this.O_Sess.setPub(PriceFromOrderView.Order, OrderPub);
			}

		this.ordertype = OrderPub.type;
		this.O_Sess.setSelf("type", OrderPub.type);
		this.O_Sess.setSelf("ppid", OrderPub.ppid);
		var ppid = this.O_Sess.getSelf("ppid");
		this.O_Sess.setSelf("carid", OrderPub.carid);
		this.O_Sess.setSelf("cirid", OrderPub.cirid);

		if (false == is_null(this.ordertype) && false == is_null(ppid)) {
			if (this.ordertype != "C") {
				this.O_Sess.setSelf("buytype1", 0);
				this.O_Sess.setSelf("buytype2", 0);
			} else {
				this.O_Sess.setSelf("buytype1", 1);
				this.O_Sess.setSelf("buytype2", undefined);
			}
		}

		ppid = this.O_Sess.getSelf("ppid");

		if (true == is_null(this.ordertype) || true == is_null(ppid)) //注文画面以外へも帰れるように変更 20090220miya
			{
				header("Location: " + url);
				throw die(0);
			}
	}

	displaySmarty(err_str = "") //言語によるテンプレートの振り分け 20090926miya
	{
		if ("ENG" === this.gSess().language) {
			var tmppath = KCS_DIR + PRICE_DIR_ENG + "/menu.tpl";
		} else {
			tmppath = KCS_DIR + PRICE_DIR + "/menu.tpl";
		}

		if ("user" == this.Site) {
			this.get_Smarty().assign("page_path", this.PriceNavi);
		} else {
			this.get_Smarty().assign("shop", 1);
			this.get_Smarty().assign("title", "\u4FA1\u683C\u8868");
			this.get_Smarty().assign("shop_submenu", this.PriceNavi);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		}

		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().assign("backurl", this.O_Sess.getSelf("url"));
		this.get_Smarty().display(tmppath);
	}

	displayHTML(H_price, usertplfile, H_stock, priceheader = undefined, pricefooter = undefined) //言語によるテンプレートの振り分け
	{
		if ("ENG" === this.gSess().language) {
			var tmppath = KCS_DIR + PRICE_DIR_ENG + "/" + usertplfile;
		} else {
			tmppath = KCS_DIR + PRICE_DIR + "/" + usertplfile;
		}

		if (false == is_null(priceheader)) {
			this.get_Smarty().assign("priceheader", priceheader);
		}

		if (false == is_null(pricefooter)) {
			this.get_Smarty().assign("pricefooter", pricefooter);
		}

		if (true == (undefined !== this.H_assign.H_cdmaone_price)) {
			this.get_Smarty().assign("H_cdmaone_price", this.H_assign.H_cdmaone_price);
		}

		if (true == (undefined !== this.H_assign.H_lte_price)) {
			this.get_Smarty().assign("H_lte_price", this.H_assign.H_lte_price);
		}

		if (false == is_null(this.gSess().memid)) {
			this.get_Smarty().assign("shop", 1);
		}

		if ("user" == this.Site) {
			this.get_Smarty().assign("page_path", this.PriceNavi);
		} else {
			this.get_Smarty().assign("title", "\u4FA1\u683C\u8868");
			this.get_Smarty().assign("shop_submenu", this.PriceNavi);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		}

		this.get_Smarty().assign("buyselid", _POST.purchase);
		this.get_Smarty().assign("paycnt", _POST.pay_frequency);
		this.get_Smarty().assign("H_price", H_price);
		this.get_Smarty().assign("H_stock", H_stock);
		this.get_Smarty().assign("ordertype", this.ordertype);
		this.get_Smarty().assign("php_self", _SERVER.PHP_SELF);
		this.get_Smarty().assign("backurl", this.O_Sess.getSelf("url"));
		this.get_Smarty().display(tmppath);
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	__destruct() {
		super.__destruct();
	}

};