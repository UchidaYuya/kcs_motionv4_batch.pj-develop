//
//テストViewクラス
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
//テストViewクラス
//
//@uses ViewSmarty
//@package TEST
//@author katsushi
//@since 2008/06/25
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author katsushi
//@since 2008/06/25
//
//@param array $H_menu
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
class TESTView extends ViewSmarty {
	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_js = Array();
		this.H_css = Array();
	}

	displaySmarty(H_pact: {} | any[]) {
		this.get_Smarty().assign("H_pact", H_pact);
		this.get_Smarty().assign("H_jsfile", ["jquery.js", "flexigrid.js", "test.js"]);
		this.get_Smarty().assign("H_cssfile", ["flexigrid.css"]);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};