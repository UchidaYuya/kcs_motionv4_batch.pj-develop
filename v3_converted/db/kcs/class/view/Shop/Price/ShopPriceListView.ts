//
//ショップ：価格表一覧
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
//@package Sample
//@subpackage View
//@author ishizaki
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
//PricelistID
//
//@var mixed
//@access private
//
//
//Delflag
//
//@var mixed
//@access private
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
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShopPriceListView extends ViewSmarty {
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
		this.H_assign.title = "\u4FA1\u683C\u8868\u4E00\u89A7";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
		this.H_assign.H_jsfile = ["shopPriceSelect.js"];
		this.PricelistID = this.O_Sess.getSelf("pricelistid");
		var shopid = undefined;

		if (undefined !== this.O_Sess.getSelf("shopid")) {
			shopid = this.O_Sess.getSelf("shopid");
		}

		this.Delflag = this.O_Sess.getSelf("delflag");
		this.O_Sess.clearSessionMenu();

		if (undefined !== shopid) {
			this.O_Sess.setSelf("shopid", shopid);
		}

		this.O_Sess.setSelf("pricelistid", this.PricelistID);
		this.O_Sess.setSelf("delflag", this.Delflag);
	}

	makeFormElements(A_carcir: {} | any[]) {
		var A_elements = [{
			name: "carcir",
			label: "\u30AD\u30E3\u30EA\u30A2\u3001\u56DE\u7DDA\u7A2E\u5225",
			inputtype: "hierselect",
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
		this.O_Qf.setFormElement(A_elements);
		var O_form = this.O_Qf.makeFormObject();
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

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	checkCGIParam() //削除フラグ変更用JSから飛んできた場合はセッションに入れて読み直し
	{
		if (true == (undefined !== _POST.pricelistid) && true == (undefined !== _POST.delflag)) {
			this.O_Sess.setSelf("pricelistid", _POST.pricelistid);
			this.O_Sess.setSelf("delflag", _POST.delflag);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.shopid) && "" != _POST.shopid) {
			this.O_Sess.setSelf("shopid", _POST.shopid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}
	}

	displaySmarty(err_str = "") {
		this.assignSmarty();
		this.get_Smarty().assign("err_str", err_str);
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