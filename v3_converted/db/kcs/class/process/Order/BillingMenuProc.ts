//
//注文の請求先一覧用プロセス
//
//@uses BillingProcBase
//@package
//@author web
//@since 2013/03/22
//

require("process/Order/BillingProcBase.php");

require("model/Order/BillingMenuModel.php");

require("view/Order/BillingMenuView.php");

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
//doExecute
//
//@author web
//@since 2013/03/22
//
//@param array $H_param
//@access protected
//@return void
//
//
//getMenuModel
//
//@author web
//@since 2013/03/22
//
//@access private
//@return void
//
//
//getMenuView
//
//@author web
//@since 2013/03/22
//
//@access private
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
class BillingMenuProc extends BillingProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var menuView = this.getMenuView();
		var menuModel = this.getMenuModel();
		var gSess = menuView.getGlobalSession();
		menuView.startCheck();
		var lSess = menuView.getLocalSession();
		menuView.clearLastForm();
		menuModel.setView(menuView);
		menuView.setModel(menuModel);
		var list = menuModel.getMenuList();
		menuView.assign("lists", list);
		menuModel.getPageLink();
		menuView.displaySmarty();
	}

	getMenuModel() {
		if (!this.menuModel instanceof BillingMenuModel) {
			this.menuModel = new BillingMenuModel();
		}

		return this.menuModel;
	}

	getMenuView() {
		if (!this.menuView instanceof BillingMenuView) {
			this.menuView = new BillingMenuView();
		}

		return this.menuView;
	}

	__destruct() {
		super.__destruct();
	}

};