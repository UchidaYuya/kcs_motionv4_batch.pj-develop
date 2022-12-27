//
//注文請求削除プロセス
//
//@uses BillingProcBase
//@package
//@author web
//@since 2013/04/04
//

require("process/Order/BillingProcBase.php");

require("model/Order/BillingDelModel.php");

require("view/Order/BillingDelView.php");

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
//doExecute
//
//@author web
//@since 2013/04/04
//
//@param array $H_param
//@access public
//@return void
//
//
//getModel
//
//@author web
//@since 2013/04/04
//
//@access protected
//@return void
//
//
//getView
//
//@author web
//@since 2013/04/04
//
//@access protected
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
class BillingDelProc extends BillingProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var delModel = this.getModel();
		var delView = this.getView();
		delModel.setView(delView);
		delView.startCheck();
		delModel.deleteBill();
		delModel.queryExecute();
		delView.displaySmarty();
	}

	getModel() {
		if (!this.delModel instanceof BillingDelModel) {
			this.delModel = new BillingDelModel();
		}

		return this.delModel;
	}

	getView() {
		if (!this.delView instanceof BillingDelView) {
			this.delView = new BillingDelView();
		}

		return this.delView;
	}

	__destruct() {
		super.__destruct();
	}

};