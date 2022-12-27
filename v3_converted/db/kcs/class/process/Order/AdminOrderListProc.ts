//
//管理者側受注集計<br>
//
//更新履歴:<br>
//2008/06/20
//
//@users OrderFormProcBase
//@packages Order
//@subpacckage Process
//@author igarashi
//@since 2008/06/20
//
//
//管理者側受注集計<br>
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/ProcessBaseHtml.php");

require("model/Order/AdminOrderListModel.php");

require("view/Order/AdminOrderListView.php");

require("OrderUtil.php");

require("MtDateUtil.php");

class AdminOrderListProc extends ProcessBaseHtml {
	static PUB = "/MTOrderList";

	constructor(H_param = Array()) {
		super(H_param);
		this.O_order = OrderUtil.singleton();
	}

	get_View() {
		return new AdminOrderListView();
	}

	get_Model() {
		return new AdminOrderListModel(O_db0);
	}

	doExecute(H_param: {} | any[] = Array()) //view生成
	//session初期化
	//$O_view->clearSessionMenu();
	//menu用model取得
	//loginチェック
	//localセッションを取得
	//var_dump($H_view["data"]);
	//display
	//$this->debugOut( "DEBUG: 表示してみたんだからねっ！" );
	{
		var O_view = this.get_View();
		O_view.clearUnderSession();
		var O_model = this.get_Model();
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		O_model.writeAdminMngLog(O_view, H_sess.SELF);
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		var A_shopid = O_model.getGroupShopID(O_view.gSess().admin_groupid);
		var A_shop = O_model.makeShopSelect(A_shopid);
		var fiscal = O_model.getFiscalMonth();
		H_view.monthtree = O_model.makeMonthTree(fiscal);
		H_view.kisyo = O_model.getKisyo(fiscal);
		var A_mode = O_model.getDispModeSelect();
		O_view.makeForm(A_shop, A_mode);
		H_view.data = O_model.getOrderListCtrl(H_sess.SELF, A_shopid, 0, "admin");
		H_view.data = O_model.makeOutputData(H_view.data, H_view.kisyo);
		O_view.displaySmarty(H_view);
	}

	__destruct() {
		super.__destruct();
	}

};