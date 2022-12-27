//
//ショップ：在庫設定
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@subpackage View
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//error_reporting(E_ALL);
//
//ショップ：在庫設定
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
//A_form
//
//@var mixed
//@access private
//
//
//submitFlag
//
//@var mixed
//@access private
//
//
//productid
//
//@var mixed
//@access private
//
//
//branchiid
//
//@var mixed
//@access private
//
//
//shopid
//
//@var mixed
//@access private
//
//
//getProductID
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getBranchID
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getShopID
//
//@author ishizaki
//@since 2008/11/05
//
//@access public
//@return void
//
//
//getSubmitFlag
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getSessStatus
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getSessReserve
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getSessLayaway
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getSessShipcnt
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getSessStock
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/07/24
//
//@access public
//@return void
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
//clearSessSelf
//
//@author ishizaki
//@since 2008/07/24
//
//@access public
//@return void
//
//
//makeFormElements
//
//@author ishizaki
//@since 2008/07/23
//
//@param mixed $H_stock_detail
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/23
//
//@param mixed $H_stock_detail
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
class ShopProductStockEditView extends ViewSmarty {
	getProductID() {
		return this.productid;
	}

	getBranchID() {
		return this.branchid;
	}

	getShopID() {
		return this.shopid;
	}

	getSubmitFlag() {
		return this.submitFlag;
	}

	getSessStatus() {
		return this.O_Sess.getSelf("status");
	}

	getSessReserve() {
		return this.O_Sess.getSelf("reserve");
	}

	getSessLayaway() {
		return this.O_Sess.getSelf("layaway");
	}

	getSessShipcnt() {
		return this.O_Sess.getSelf("shipcnt");
	}

	getSessStock() {
		return this.O_Sess.getSelf("stock");
	}

	displayFinish() //二重登録を防止
	//完了画面
	{
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u5728\u5EAB\u8A2D\u5B9A", "/Shop/Product/menu.php", "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7");
	}

	constructor(H_navi) //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.O_Sess = MtSession.singleton();
		this.H_assign.title = "\u5728\u5EAB\u8A2D\u5B9A";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
		this.O_Qf = new QuickFormUtil("form");
		this.A_form = Array();
		this.submitFlag = false;
	}

	checkCGIParam() //リセットが押されたらこのセッションをクリア
	{
		if (true == (undefined !== _GET.reset)) {
			this.O_Sess.clearSessionSelf();
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _GET.productid) && true == (undefined !== _GET.branchid) && true == (undefined !== _GET.shopid)) {
			this.O_Sess.setSelf("productid", _GET.productid);
			this.O_Sess.setSelf("branchid", _GET.branchid);
			this.O_Sess.setSelf("shopid", _GET.shopid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.productid = this.O_Sess.getSelf("productid");
		this.branchid = this.O_Sess.getSelf("branchid");
		this.shopid = this.O_Sess.getSelf("shopid");

		if (true == is_null(this.productid) || true == is_null(this.branchid)) {
			header("Location: /Shop/Product/menu.php");
			throw die(0);
		}

		if (true == (undefined !== _GET.reset)) {
			this.O_Sess.clearSessionSelf();
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.submit) && ("\u78BA\u8A8D\u753B\u9762\u3078" == _POST.submit || "\u5909\u66F4\u3059\u308B" == _POST.submit)) {
			this.O_Sess.setSelf("status", _POST.status);

			if ("" == _POST.reserve) {
				_POST.reserve = 0;
			}

			this.O_Sess.setSelf("reserve", _POST.reserve);

			if ("" == _POST.layaway) {
				_POST.layaway = 0;
			}

			this.O_Sess.setSelf("layaway", _POST.layaway);

			if ("" == _POST.stock) {
				_POST.stock = 0;
			}

			this.O_Sess.setSelf("stock", _POST.stock);
			this.O_Sess.setSelf("submit", _POST.submit);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var submit = this.O_Sess.getSelf("submit");

		if (false == !submit && "\u5909\u66F4\u3059\u308B" === String(submit)) {
			this.submitFlag = true;
		}
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
	}

	makeFormElements(H_stock_detail) {
		var A_elements = [{
			name: "status",
			label: "\u5728\u5EAB\u72B6\u6CC1",
			inputtype: "select",
			data: this.getSetting().A_stock_status
		}, {
			name: "reserve",
			label: "\u4E88\u7D04\u6570",
			inputtype: "text",
			options: {
				maxlength: 8,
				size: 8
			}
		}, {
			name: "layaway",
			label: "\u53D6\u7F6E\u5728\u5EAB\u6570",
			inputtype: "text",
			options: {
				maxlength: 8,
				size: 8
			}
		}, {
			name: "stock",
			label: "\u30D5\u30EA\u30FC\u5728\u5EAB\u6570",
			inputtype: "text",
			options: {
				maxlength: 8,
				size: 8
			}
		}];
		var submit = this.O_Sess.getSelf("submit");

		if (true === !submit) {
			A_elements.push({
				name: "submit",
				label: "\u78BA\u8A8D\u753B\u9762\u3078",
				inputtype: "submit"
			});
		} else {
			A_elements.push({
				name: "submit",
				label: "\u5909\u66F4\u3059\u308B",
				inputtype: "submit"
			});
			this.O_Qf.freezeWrapper();
			this.O_Sess.clearSessionKeySelf("submit");
		}

		this.O_Qf.setFormElement(A_elements);
		var O_form = this.O_Qf.makeFormObject();

		if (true == is_null(this.O_Sess.getSelf("status")) && true != is_null(H_stock_detail.status)) {
			this.O_Qf.setDefaultsWrapper({
				status: array_search(H_stock_detail.status, this.getSetting().A_stock_status, true)
			});
		} else {
			this.O_Qf.setDefaultsWrapper({
				status: this.O_Sess.getSelf("status")
			});
		}

		if (true != is_null(this.O_Sess.getSelf("reserve"))) {
			this.O_Qf.setDefaultsWrapper({
				reserve: this.O_Sess.getSelf("reserve")
			});
		}

		if (true != is_null(this.O_Sess.getSelf("layaway"))) {
			this.O_Qf.setDefaultsWrapper({
				layaway: this.O_Sess.getSelf("layaway")
			});
		}

		if (true != is_null(this.O_Sess.getSelf("stock"))) {
			this.O_Qf.setDefaultsWrapper({
				stock: this.O_Sess.getSelf("stock")
			});
		}

		var qfRule = [{
			name: "reserve",
			mess: "\u4E88\u7D04\u6570\u306F\u534A\u89D2\u6570\u5B57\u3067\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "layaway",
			mess: "\u53D6\u7F6E\u5728\u5EAB\u6570\u306F\u534A\u89D2\u6570\u5B57\u3067\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "stock",
			mess: "\u30D5\u30EA\u30FC\u5728\u5EAB\u6570\u306F\u534A\u89D2\u6570\u5B57\u3067\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}];
		this.O_Qf.makeFormRule(qfRule);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	displaySmarty(H_stock_detail) {
		this.H_assign.productname = H_stock_detail.productname;
		this.H_assign.property = H_stock_detail.property;
		this.H_assign.status = H_stock_detail.status;
		this.H_assign.reserve = H_stock_detail.reserve;
		this.H_assign.layaway = H_stock_detail.layaway;
		this.H_assign.stock = H_stock_detail.stock;
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
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