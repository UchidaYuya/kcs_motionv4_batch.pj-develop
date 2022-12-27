//
//受注集計Proc
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
//受注集計Proc
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/Order/AdminOrderListProc.php");

require("model/Order/ShopOrderListModel.php");

require("view/Order/ShopOrderListView.php");

class ShopOrderListProc extends AdminOrderListProc {
	static PUB = "/MTOrderList";

	constructor(H_param = Array()) {
		super(H_param);
	}

	get_View() {
		return new ShopOrderListView();
	}

	get_Model() {
		return new ShopOrderListModel(O_db0);
	}

	doExecute(H_param: {} | any[] = Array()) //view生成
	//session初期化
	//menu用model取得
	//loginチェック
	//localセッションを取得
	//ログに書く
	//var_dump($H_view["data"]);
	//display
	//$this->debugOut( "DEBUG: 表示してみたんだからねっ！" );
	{
		var O_view = this.get_View();
		O_view.clearUnderSession([ShopOrderListProc.PUB]);
		var O_model = this.get_Model();
		O_view.startCheck();
		H_g_sess.shopname = O_view.gSess().name;
		H_g_sess.personname = O_view.gSess().personname;
		var H_sess = O_view.getLocalSession();
		O_model.writeShopMngLog(H_g_sess, H_sess);
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		H_view.unify = O_model.checkUnifyShop(O_view.gSess().shopid);
		var A_shopid = O_model.getChildShopID(O_view.gSess().shopid, O_view.gSess().name, H_view.unify);
		var A_shop = O_model.makeShopSelect(A_shopid);
		var fiscal = O_model.getFiscalMonth(O_view.gSess().shopid);
		H_view.monthtree = O_model.makeMonthTree(fiscal);
		H_view.kisyo = O_model.getKisyo(fiscal);
		var A_mode = O_model.getDispModeSelect();
		var H_pact = O_model.getPostId(A_shopid);
		O_view.makeFormShop(A_shop, A_mode, H_pact, H_view.unify);
		H_view.data = O_model.getOrderListCtrl(H_sess.SELF, A_shopid, O_view.gSess().shopid, H_view.unify);
		H_view.data = O_model.makeOutputData(H_view.data, H_view.kisyo);
		O_view.displaySmarty(H_g_sess, H_view);
	}

	__destruct() {
		super.__destruct();
	}

};