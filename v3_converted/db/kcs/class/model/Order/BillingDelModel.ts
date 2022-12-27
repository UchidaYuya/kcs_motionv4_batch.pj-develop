//
//注文請求先削除モデル
//
//@uses BillingModelBase
//@package
//@author web
//@since 2013/04/04
//

require("model/Order/BillingModelBase.php");

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
//deleteBill
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
class BillingDelModel extends BillingModelBase {
	constructor() {
		super();
	}

	deleteBill() {
		var data = this.getView().gSess().getSelfAll();
		this.sqls.push("DELETE FROM order_billing_tb WHERE defaultflg=false AND id=" + this.get_DB().dbQuote(data.id, "int", true));
		return this;
	}

	__destruct() {
		super.__destruct();
	}

};