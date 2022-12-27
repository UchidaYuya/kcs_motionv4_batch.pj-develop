//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2008/10/16
//
//
//error_reporting(E_ALL);
//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@author houshiyama
//@since 2008/10/16
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("MtSession.php");

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
//ログイン時の入力値をクッキーに保存する
//
//@author nakanita
//@since 2008/11/06
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
class ShopMenuView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	//docomo_onlyをリセット
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.H_js = Array();
		this.H_css = Array();
		this.H_assign = Array();
		this.H_assign.page_path = "<li class=\"csNavi\"><a href=\"/Shop/menu.php\" class=\"csNavi\">\u30E1\u30CB\u30E5\u30FC</a>";
		this.O_Sess = MtSession.singleton();
		this.O_Sess.setGlobal("docomo_only", false);
	}

	setLoginCookie() //ログイン時以外は何もしない
	//30日
	{
		if (_POST.login !== "login") {
			return;
		}

		var expire = Date.now() / 1000 + 60 * 60 * 24 * 30;

		if (undefined !== _POST.group == true && _POST.group !== "") {
			setcookie("sh_group", _POST.group, expire, "/");
		}

		if (undefined !== _POST.userid_ini == true && _POST.userid_ini !== "") {
			setcookie("sh_userid_ini", _POST.userid_ini, expire, "/");
		}

		if (undefined !== _POST.loginid == true && _POST.loginid !== "") {
			setcookie("sh_loginid", _POST.loginid, expire, "/");
		}
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