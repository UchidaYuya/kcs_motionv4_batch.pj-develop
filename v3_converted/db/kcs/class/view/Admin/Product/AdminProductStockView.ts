//
//管理者：在庫マスター画面のView
//
//更新履歴<br>
//2008/07/08 石崎公久 作成
//2008/11/17 石崎公久 一覧で検索結果を保持する為にセッションおw消すのをやめた
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

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

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
//session_name
//
//@var string
//@access private
//
//
//getSProductIdValue
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//getSProductID
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//getBranchProperty
//
//@author ishizaki
//@since 2008/07/15
//
//@access public
//@return void
//
//
//getBranchID
//
//@author ishizaki
//@since 2008/07/16
//
//@access public
//@return void
//
//
//getDelflg
//
//@author ishizaki
//@since 2008/07/16
//
//@access public
//@return void
//
//
//clearSessSelf
//
//@author ishizaki
//@since 2008/07/16
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
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class AdminProductStockView extends ViewSmarty {
	getSProductIdValue() {
		return this.O_Sess.getPub(this.Sproductid);
	}

	getSProductIdName() {
		return this.Sproductid;
	}

	getBranchProperty() {
		return this.O_Sess.getSelf("property");
	}

	getBranchID() {
		return this.O_Sess.getSelf("branchid");
	}

	getDelflg() {
		return this.O_Sess.getSelf("delflg");
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
	}

	constructor(H_navi = undefined) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.Sproductid = "/product_stock_productid";
		this.clearLastForm();
		this.O_Sess = MtSession.singleton();

		if (false === is_null(H_navi)) {
			this.H_assign.admin_fncname = "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7";
			this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
			this.H_assign.H_jsfile = ["adminProductStockDelete.js"];
		}
	}

	checkCGIParam() //GETでわたらせたproductid を在庫マスター以下で使うセッションに格納
	//20081116　一覧で検索結果を覚えさせるためこめんとあうと
	//$this->O_Sess->clearSessionExcludePub($this->Sproductid);
	{
		if (true == (undefined !== _GET.productid)) {
			this.O_Sess.setPub(this.Sproductid, _GET.productid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var productid = this.O_Sess.getPub(this.Sproductid);

		if (false == !productid && true == (undefined !== _POST.branchid) && true == (undefined !== _POST.delflg)) {
			this.O_Sess.setSelf("branchid", _POST.branchid);
			this.O_Sess.setSelf("delflg", _POST.delflg);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == !productid) {
			header("Location: /Admin/menu.php");
			throw die(0);
		}
	}

	displaySmarty() {
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

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	__destruct() {
		super.__destruct();
	}

};