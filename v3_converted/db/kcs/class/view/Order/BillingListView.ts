//
//注文画面の請求先一覧ビュー
//
//@uses BillingMenuView
//@package
//@author web
//@since 2013/04/05
//

require("view/Order/BillingMenuView.php");

//
//__construct
//
//@author web
//@since 2013/04/05
//
//@access public
//@return void
//
//
//assignBillData
//
//@author web
//@since 2013/04/05
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2013/04/05
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/05
//
//@access public
//@return void
//
class BillingListView extends BillingMenuView {
	constructor() {
		super();
	}

	assignBillData() {
		var lSess = this.gSess().getSelfAll();

		if (undefined !== lSess.selid) {
			this.assign("selBill", this.getModel().getBillData(lSess.selid));
			delete this.H_Local.selid;
			this.gSess().clearSessionKeySelf("selid");
		}
	}

	displaySmarty() {
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};