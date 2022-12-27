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
//パンくずリンク作成
//
//@author web
//@since 2013/04/16
//
//@access protected
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
class BillingAddView extends BillingViewBase {
	constructor() {
		super();
	}

	setBreadCrumbs() {
		return this.assignBreadCrumbs({
			"./billMenu.php": this.langLists.bcMenu[this.gSess().language],
			"": this.langLists.bcAdd[this.gSess().language]
		});
	}

	__destruct() {
		super.__destruct();
	}

};