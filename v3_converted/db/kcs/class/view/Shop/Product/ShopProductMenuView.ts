//
//ショップ：在庫マスター一覧
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//error_reporting(E_ALL);
//
//ショップ：在庫マスター一覧
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSession.php");

require("view/ViewSmarty.php");

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
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//productid
//
//@var mixed
//@access private
//
//
//branchid
//
//@var mixed
//@access private
//
//
//delflg
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
//H_postdata
//
//@var mixed
//@access private
//
//
//getProductID
//
//@author ishizaki
//@since 2008/07/24
//
//@access public
//@return void
//
//
//getBranchID
//
//@author ishizaki
//@since 2008/07/24
//
//@access public
//@return void
//
//
//getDelflag
//
//@author ishizaki
//@since 2008/07/24
//
//@access public
//@return void
//
//
//getShopID
//
//@author ishizaki
//@since 2008/11/04
//
//@access public
//@return void
//
//
//getPostData
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
//makeFormElements
//
//@author ishizaki
//@since 2008/07/24
//
//@param array $A_carcir
//@access public
//@return void
//
//
//makeHierSelectCircuit
//
//@author ishizaki
//@since 2008/07/24
//
//@param array $A_circuit
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
//setAssign
//
//@author ishizaki
//@since 2008/11/05
//
//@param mixed $name
//@param mixed $value
//@access public
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
class ShopProductMenuView extends ViewSmarty {
	getProductID() {
		return this.productid;
	}

	getBranchID() {
		return this.branchid;
	}

	getDelflag() {
		return this.delflg;
	}

	getShopID() {
		return this.shopid;
	}

	getPostData() {
		return this.H_postdata;
	}

	constructor(H_navi) //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.O_Qf = new QuickFormUtil("form");
		this.A_form = Array();
		this.H_postdata = Array();
		this.O_Sess = MtSession.singleton();
		this.H_assign.title = "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
		this.H_assign.H_jsfile = ["shopStockDelete.js"];
		this.productid = this.O_Sess.getSelf("productid");
		this.branchid = this.O_Sess.getSelf("branchid");
		this.delflg = this.O_Sess.getSelf("delflg");
		this.shopid = this.O_Sess.getSelf("shopid");
		var tmp = this.O_Sess.getSelf("postdata");
		this.gSess().clearSessionMenu();

		if (undefined !== tmp) {
			this.O_Sess.setSelf("postdata", tmp);
		}

		this.clearLastForm();
	}

	makeFormElements(A_carcir: {} | any[], H_shop = false) //ショップリストが渡されたら
	{
		var A_elements = [{
			name: "carcir",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "hierselect",
			separator: "&nbsp;&nbsp;\u56DE\u7DDA\u7A2E\u5225&nbsp;",
			data: A_carcir
		}, {
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text"
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit"
		}];

		if (false != H_shop) {
			A_elements.push({
				name: "shoplist",
				label: "\u8CA9\u58F2\u5E97",
				inputtype: "select",
				data: H_shop
			});
		}

		this.O_Qf.setFormElement(A_elements);
		var O_form = this.O_Qf.makeFormObject();

		if (undefined !== this.O_Sess.getSelf("postdata")) {
			var H_search = this.O_Sess.getSelf("postdata");

			if (false != H_shop) {
				this.O_Qf.setDefaultsWrapper({
					shoplist: H_search.shoplist
				});
			}

			this.O_Qf.setDefaultsWrapper({
				productname: H_search.productname
			});
			this.O_Qf.setDefaultsWrapper({
				carcir: H_search.carcir
			});
		}

		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	makeHierSelectCircuit(A_circuit: {} | any[]) {
		var H_return = Array();

		for (var i = 0; i < A_circuit.length; i++) {
			H_return[A_circuit[i].carid][A_circuit[i].cirid] = A_circuit[i].cirname;
		}

		return H_return;
	}

	checkCGIParam() {
		if (0 < _GET.length) {
			if (true == (undefined !== _GET.reset)) {
				this.O_Sess.setSelf("postdata", undefined);
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.productid) && true == (undefined !== _POST.branchid) && true == (undefined !== _POST.delflg) && true == (undefined !== _POST.shopid)) {
			this.O_Sess.setSelf("productid", _POST.productid);
			this.O_Sess.setSelf("branchid", _POST.branchid);
			this.O_Sess.setSelf("delflg", _POST.delflg);
			this.O_Sess.setSelf("shopid", _POST.shopid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (0 < _POST.length) {
			this.O_Sess.setSelf("postdata", _POST);
		}

		if (undefined !== this.O_Sess.getSelf("postdata")) {
			var _POST = this.O_Sess.getSelf("postdata");

			if (true == (undefined !== _POST.shoplist)) {
				this.H_postdata.shoplist = _POST.shoplist;
			}

			if (true == (undefined !== _POST.productname)) {
				this.H_postdata.productname = _POST.productname;
			}

			if (true == (undefined !== _POST.carcir) && true == Array.isArray(_POST.carcir) && 0 != _POST.carcir[0]) {
				this.H_postdata.carid = +_POST.carcir[0];
				this.H_postdata.cirid = +_POST.carcir[1];
			}
		} else {
			this.H_postdata.shoplist = undefined;
			this.H_postdata.productname = undefined;
			this.H_postdata.carid = undefined;
			this.H_postdata.cirid = undefined;
		}
	}

	displaySmarty(A_stocklist) {
		this.H_assign.A_stocklist = A_stocklist;
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

	setAssign(name, value) {
		this.H_assign[name] = value;
	}

	__destruct() {
		super.__destruct();
	}

};