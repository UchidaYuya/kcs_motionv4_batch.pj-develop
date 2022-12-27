//
//ポイント表示Viewの基底クラス
//
//更新履歴<br>
//2013/09/20 石崎公久 作成
//
//@uses ViewSmarty
//@package kcsmotion
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2013/09/24
//@filesource
//
//
//
//ViewInsight
//
//@uses ViewSmarty
//@package kcsmotion
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2013/09/24
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//コンストラクタ
//
//@author ishizaki
//@since 2013/09/24
//
//@access public
//@return void
//
//
//setNavigation
//
//@author web
//@since 2013/09/24
//
//@param array $navi
//@access public
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2013/10/02
//
//@access public
//@return void
//
//
//startCheck
//
//@author web
//@since 2013/09/26
//
//@param ValidateAuthorityInterface $validate
//@access public
//@return void
//
//
//setSessionAndRedirectMenu
//
//@author web
//@since 2013/09/26
//
//@access public
//@return void
//
class ViewInsight extends ViewSmarty {
	constructor() {
		super();
	}

	setNavigation(navi: {} | any[]) {
		this.TweakNavi = MakePankuzuLink.makePankuzuLinkHTML(navi);
	}

	displaySmarty() {
		this.get_Smarty().assign("page_path", this.TweakNavi);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	startCheck(validate: ValidateAuthorityInterface) {
		this.checkLogin();
		var gSess = this.getGlobalSession();
		var a = this.getAuth().getUserFuncIni(gSess.userid);
		var b = this.getAuth().getPactFuncIni();
		var temp = array_merge(a, b);

		if (!validate.fire(temp)) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", 0, this.getTopMenu());
		}
	}

	setSessionAndRedirectMenu(session: SessionningInterface, redirect: RedirecterInterface) {
		session.set();
		redirect.fire();
	}

	__destruct() {
		super.__destruct();
	}

};