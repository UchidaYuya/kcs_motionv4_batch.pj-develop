//
//注文画面の請求先一覧用プロセス
//
//@uses BillingProcBase
//@package
//@author web
//@since 2013/03/22
//

require("process/Order/BillingMenuProc.php");

require("model/Order/BillingMenuModel.php");

require("view/Order/BillingListView.php");

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
//@since 2013/04/05
//
//@param array $H_param
//@access public
//@return void
//
//
//getListView
//
//@author web
//@since 2013/04/05
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
class BillingListProc extends BillingMenuProc {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var listView = this.getListView();
		listView.setSiteMode(H_param.site);
		var menuModel = this.getMenuModel();
		listView.startCheck();
		menuModel.setView(listView);

		if (BillingViewBase.SITE_SHOP == H_param.site) {
			var lSess = listView.gSess().getPub(BillingListProc.PUB);
			menuModel.setPactId(lSess.pactid);
			menuModel.setPostId(lSess.postid);
		}

		listView.setModel(menuModel);
		listView.assignBillData();
		var list = menuModel.getList();
		listView.assign("lists", list);
		menuModel.getPageLink();
		listView.displaySmarty();
	}

	getListView() {
		if (!this.listView instanceof BillingListView) {
			this.listView = new BillingListView();
		}

		return this.listView;
	}

	__destruct() {
		super.__destruct();
	}

};