//
//メニューViewクラス
//
//@uses ViewSmarty
//@package Menu
//@filesource
//@author houshiyama
//@since 2008/10/16
//
//
//error_reporting(E_ALL);
//
//メニューViewクラス
//
//@uses ViewSmarty
//@package Menu
//@author houshiyama
//@since 2008/10/16
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

//
//__construct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//checkAuth
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//getAuthBase
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//getAuthPact
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//setAssign
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//addJs
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//assignSmarty
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
class MenuView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.H_js = Array();
		this.H_css = Array();
		this.H_assign = Array();
		this.H_assign.page_path = "<li class=\"csNavi\"><a href=\"/Shop/menu_v3.php\" class=\"csNavi\">\u30E1\u30CB\u30E5\u30FC</a>";
	}

	checkAuth() {
		this.checkCustomAuth();
	}

	getAuthBase() {
		return this.getAuth().getUserFuncId(this.gSess().memid);
	}

	getAuthShop() {
		return this.getAuth().getShopFuncId();
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	addJs(jsfile) {
		if (Array.isArray(this.H_assign.H_jsfile) == false) {
			this.H_assign.H_jsfile = Array();
		}

		this.H_assign.H_jsfile.push(jsfile);
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

	displaySmarty() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};