//
//管理者：在庫マスター画面のView
//
//更新履歴<br>
//2008/07/08 石崎公久 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/29
//@filesource
//
//
//
//管理者：在庫マスター画面のView
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/09
//

require("MtSession.php");

require("view/Admin/Product/AdminProductStockView.php");

require("view/ViewFinish.php");

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
//O_Qf
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
//@var boolean
//@access private
//
//
//getSubmitFlag
//
//@author ishizaki
//@since 2008/07/15
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
//displaySmarty
//
//@author ishizaki
//@since 2008/05/01
//
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//clearSessSelf
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
//@access private
//@return void
//
//
//setAssign
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
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
//makeFormElements
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class AdminProductEditStockView extends AdminProductStockView {
	getSubmitFlag() {
		return this.submitFlag;
	}

	constructor(H_navi) {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_assign.admin_fncname = "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u5909\u66F4";
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.O_Qf = new QuickFormUtil("form");
		this.A_form = Array();
		this.submitFlag = false;
	}

	checkCGIParam() {
		if (true == (undefined !== _GET.branchid)) {
			if (false === is_numeric(_GET.branchid)) {
				this.getOut().errorOut(0, "AdminProductEditStockView::checkCGIParam \u306B\u6E21\u3055\u308C\u305F branchid \u304C\u6570\u5024\u3067\u306F\u306A\u3044", false);
			}

			this.O_Sess.setSelf("branchid", _GET.branchid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var productid = this.O_Sess.getPub(this.getSProductIdName());
		var branchid = this.O_Sess.getSelf("branchid");

		if (true == !productid || true == !branchid) {
			header("Location: /Admin/menu.php");
			throw die(0);
		}

		if (true == (undefined !== _POST.submit) && ("\u78BA\u8A8D\u753B\u9762\u3078" == _POST.submit || "\u5909\u66F4\u3059\u308B" == _POST.submit)) {
			if (get_magic_quotes_gpc() == true) {
				_POST.property = stripslashes(_POST.property);
			}

			this.O_Sess.setSelf("property", _POST.property);
			this.O_Sess.setSelf("submit", _POST.submit);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _GET.reset)) {
			this.O_Sess.clearSessionSelf();
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var submit = this.O_Sess.getSelf("submit");

		if (false == !submit && "\u5909\u66F4\u3059\u308B" === String(submit)) {
			this.submitFlag = true;
		}
	}

	displaySmarty() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayFinish() //二重登録を防止
	//完了画面
	{
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u306E\u5909\u66F4", "/Admin/Product/stock_menu.php", "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7\u3078");
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
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

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	makeFormElements(property, err = "") {
		var A_elements = [{
			name: "property",
			label: "\u8272",
			inputtype: "text"
		}];
		var submit = this.O_Sess.getSelf("submit");

		if (true === !submit || err == true) {
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

		if (true == is_null(this.O_Sess.getSelf("property"))) {
			this.O_Qf.setDefaultsWrapper({
				property: property
			});
		} else {
			this.O_Qf.setDefaultsWrapper({
				property: this.O_Sess.getSelf("property")
			});
		}

		if (true == err) {
			this.O_Qf.setElementErrorWrapper("property", "\u3054\u5165\u529B\u3044\u305F\u3060\u3044\u305F\u8272\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002");
		}

		this.O_Qf.setFormElement(A_elements);
		var O_form = this.O_Qf.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	__destruct() {
		super.__destruct();
	}

};