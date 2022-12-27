//
//注文請求先削除ビュー
//
//@uses BillingViewBase
//@package
//@author web
//@since 2013/04/04
//

require("view/Order/BillingViewBase.php");

//
//__construct
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
class BillingDelView extends BillingViewBase {
	constructor() {
		super();
	}

	displaySmarty() {
		if (!this.tplFile) {
			this.tplFile = this.getDefaultTemplate();
		}

		this.get_Smarty().display(this.tplFile);
		return this;
	}

	__destruct() {
		super.__destruct();
	}

};