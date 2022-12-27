//
//メニューViewクラス
//
//@uses ViewSmarty
//@package Menu
//@filesource
//@author katsushi
//@since 2008/06/17
//
//
//error_reporting(E_ALL);
//
//メニューViewクラス
//
//@uses ViewSmarty
//@package Menu
//@author katsushi
//@since 2008/06/17
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
//
//checkAuth
//
//@author katsushi
//@since 2008/06/17
//
//@access protected
//@return void
//
//
//checkCustomAuth
//
//@author nakanita
//@since 2008/11/14
//
//@access protected
//@return void
//
//
//getAuthBase
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
//
//chkOrderFunc
//
//@author katsushi
//@since 2008/10/28
//
//@access public
//@return void
//
//
//setHelpFile
//
//@author katsushi
//@since 2008/12/19
//
//@access public
//@return void
//
//
//chkInfoFunc
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
//
//getAuthPact
//
//@author katsushi
//@since 2008/09/11
//
//@access public
//@return void
//
//
//getCookieTab
//
//@author katsushi
//@since 2008/08/17
//
//@access public
//@return void
//
//
//getCookieOrderTab
//
//@author ishizaki
//@since 2008/08/28
//
//@access public
//@return void
//
//
//setAssign
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//addJs
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/08/17
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class MenuView extends ViewSmarty {
	constructor() //ログインチェックしないと基底セッションが作れず絶対日本語表記になってしまうので
	//$this->H_assign["page_path"] = "<li class=\"csNavi\"><a href=\"/Menu/menu_v2.php\" class=\"csNavi\">V2メニュー</a>";
	{
		if (undefined === this.O_Sess.language) {
			this.checkLogin();
		}

		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_js = Array();
		this.H_css = Array();
		this.H_assign = Array();
	}

	checkAuth() //$this->checkCustomAuth();
	{}

	checkCustomAuth() //パスワード変更がある場合、強制的に変更ページに飛ばす
	{
		if (this.gSess().passOUT === "ON" || this.gSess().passOUT === "OFF") //パスワード変更画面に強制的に飛ばす
			{
				header("Location: /Menu/chg_password.php");
				throw die(0);
			}
	}

	getAuthBase() {
		return this.getAuth().getUserFuncId(this.gSess().userid);
	}

	chkOrderFunc() {
		return this.getAuth().chkUserFuncIni(this.gSess().userid, "fnc_mt_order_adm");
	}

	setHelpFile() {
		this.getAuth().setHelpFunc(this.gSess().userid);
	}

	chkInfoFunc() {
		return this.getAuth().chkUserFuncIni(this.gSess().userid, "fnc_info");
	}

	getAuthPact() {
		return this.getAuth().getPactFuncId();
	}

	getCookieTab() {
		if (undefined !== _COOKIE.menuTab == true) {
			return _COOKIE.menuTab;
		}

		return "1";
	}

	getCookieOrderTab() //if(isset($_COOKIE["orderTab"]) == true){
	//			return $_COOKIE["orderTab"];
	//		}
	{
		return undefined;
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

	displaySmarty() //パンくずリンク
	{
		if (this.gSess().language == "ENG") {
			this.H_assign.page_path = "<li class=\"csNavi\"><a href=\"/Menu/menu.php\" class=\"csNavi\">Menu</a>";
		} else {
			this.H_assign.page_path = "<li class=\"csNavi\"><a href=\"/Menu/menu.php\" class=\"csNavi\">\u30E1\u30CB\u30E5\u30FC</a>";
		}

		this.assignSmarty();

		if (this.gSess().pacttype == "H") {
			var tplfile = this.getDefaultTemplate().replace(/\.tpl$/g, "_hotline.tpl");
			this.get_Smarty().display(tplfile);
		} else {
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};