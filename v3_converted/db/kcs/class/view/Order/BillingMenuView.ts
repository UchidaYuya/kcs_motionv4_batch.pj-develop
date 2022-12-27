//
//注文の請求先一覧用ビュー
//
//@uses BillingViewBase
//@package
//@author web
//@since 2013/03/22
//

require("view/Order/BillingViewBase.php");

//
//__construct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//clearLastForm
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//パンくず作成
//
//@author web
//@since 2013/04/16
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
class BillingMenuView extends BillingViewBase {
	constructor() {
		super();
	}

	clearLastForm() {
		this.gSess().setPub("/_lastform", _SERVER.PHP_SELF);
		this.gSess().clearSessionPub("/_lastform");
	}

	setBreadCrumbs() {
		return this.assignBreadCrumbs({
			"": this.langLists.bcMenu[this.gSess().language]
		});
	}

	displaySmarty() {
		this.setJsFile();
		this.setBreadCrumbs();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};