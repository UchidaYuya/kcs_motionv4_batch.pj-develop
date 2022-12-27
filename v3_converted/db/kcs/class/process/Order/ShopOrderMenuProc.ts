//
//販売店受注一覧<br>
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
//販売店受注一覧Proc
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/Order/OrderListMenuProc.php");

require("model/Order/ShopOrderMenuModel.php");

require("view/Order/ShopOrderMenuView.php");

require("model/Order/ShopOrderModelBase.php");

require("OrderUtil.php");

require("MtDateUtil.php");

class ShopOrderMenuProc extends OrderListMenuProc {
	consoleout(string) {
		if (is_null(GLOBALS.start) or is_null(GLOBALS.fp)) {
			return;
		}

		fwrite(GLOBALS.fp, string + ":" + (Date.now() / 1000 - GLOBALS.start) + "\n");
	}

	constructor() {
		this.consoleout("start construct");
		super();
		this.O_order = OrderUtil.singleton();
		this.consoleout("end construct");
	}

	get_ShopOrderMenuView() {
		return new ShopOrderMenuView();
	}

	doExecute(H_param: {} | any[] = Array()) //OrderUtil作成
	//view生成
	//global session
	//menu用model取得
	//注文詳細modelbase呼出し
	//今日の日付を連想配列に入れる
	//loginチェック
	//localセッションを取得
	//必須sessionチェック
	//統括販売店かチェック 後付けカコワルイ…
	//統括販売店なら下位の販売店IDも取得する
	//ダウンロード権限の有無を取得
	//formの初期状態を取得する
	//$H_sess["SELF"]["post"] = $O_view->setDefaultSearchSession($H_sess["SELF"], $H_date);
	//ステータス一覧を取得する
	//発注種別一覧を取得する
	//販売店名一覧を取得
	//キャリア一覧を取得する
	//購入方法を取得
	//受領確認を取得
	//k76 予定日確定日
	//振替先を取得する
	//部門コードを取得する (部門コードは下位の販売店IDいらない)
	//form作成
	//formのdefalt値入力
	//$O_view->setSearchFormDefault($O_order, $H_sess["SELF"], $H_date);
	//検索条件の入力チェック
	//sql句作成
	//検索実行
	//データをまとめたり分納探したり
	//offsetしないとね
	//台数を別に取得する
	//ページリンク作成
	//display
	//$this->debugOut( "DEBUG: 表示してみたんだからねっ！" );
	{
		this.consoleout("start doExecute");
		var temp = Date.now() / 1000;
		var O_view = this.get_ShopOrderMenuView();
		var H_g_sess = O_view.getGlobalShopSession();

		if (H_g_sess.docomo_only == true) {
			if (_SERVER.REQUEST_URI == "/Shop/MTOrder/menu.php") {
				header("Location:  /Shop/MTOrder/order_menu.php");
				throw die();
			}
		}

		O_view.clearUnderSession([ShopOrderMenuProc.PUB]);
		var O_model = new ShopOrderMenuModel(O_db0, H_g_sess);
		var O_basemodel = new ShopOrderModelBase(O_db0, H_g_sess);
		var H_date = O_model.getTodayHash();
		this.consoleout("start startCheck");
		O_view.startCheck();
		this.consoleout("end startCheck");
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		H_flg.unify = H_box.unify = O_model.checkUnifyShop(H_g_sess.shopid);

		if (true == H_flg.unify) {
			var H_shopid = O_model.getChildShopID(H_g_sess.shopid, H_g_sess.shopname, H_box.unify, true);
			var A_shopid = Object.keys(H_shopid);
		} else {
			A_shopid = [H_g_sess.shopid];
		}

		H_flg.dlauth = O_model.getDLAuth(H_g_sess);
		H_sess[ShopOrderMenuProc.PUB].post = O_view.setDefaultSearchSession(H_sess[ShopOrderMenuProc.PUB], H_date);
		H_box.status = O_model.getOrderStatus([this.O_order.st_sub_trchkreq, this.O_order.st_receiptreq, this.O_order.st_receiptfin]);
		H_box.ordertype = O_model.getOrderType();
		this.consoleout("start getShopList");
		var H_shoplist = O_model.getShopList(O_view.gSess().groupid);
		this.consoleout("end getShopList");
		this.consoleout("start getOrderCarrier");
		H_box.carid = O_model.getOrderCarrier();
		this.consoleout("end getOrderCarrier");
		this.consoleout("start \u691C\u7D22\u6642\u306E\u307F");

		if (!O_view.getSearchMode()) //$H_info["fromshop"] = $O_model->getTransferShopId($A_shopid, $H_shoplist, "from");
			//$H_info["toshop"] = $O_model->getTransferShopId($A_shopid, $H_shoplist, "to");
			{
				this.consoleout("\tstart getCarrierInfo");
				H_info.carrier = O_model.getCarrierInfo();
				this.consoleout("\tstart getStatusInfo");
				H_info.status = O_model.getStatusInfo();
				this.consoleout("\tstart getChargeCount");
				H_info.chargecnt = O_model.getChargeCount(A_shopid);
			}

		this.consoleout("end \u691C\u7D22\u6642\u306E\u307F");
		H_box.buyselid = O_model.getOrderBuySelID();
		H_box.receipt = O_model.getOrderReceive();
		H_box.deliverydate_type = O_model.getOrderDeliveryDateType();
		H_box.send_deliverydate_flg = O_model.getOrderSendDeliveryDateFlg();
		this.consoleout("start getTransfer");
		H_select.trans = O_model.getTransfer(H_g_sess, A_shopid);
		this.consoleout("end getTransfer");
		H_select.section = O_model.getSectionCode(A_shopid);
		var O_prefmodel = new PrefectureModel();
		H_select.pref[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		H_select.pref += O_prefmodel.getPrefecture("JPN");
		O_view.makeSearchForm(H_box, H_select);
		O_view.setSearchFormDefault(H_sess[ShopOrderMenuProc.PUB], H_date);
		O_view.checkSearchRule(H_sess);
		this.consoleout("start makeSearchSql");
		var H_sql = O_model.makeSearchSql(H_sess, H_box, A_shopid);
		this.consoleout("end makeSearchSql");
		this.consoleout("start \u30C7\u30FC\u30BF\u53D6\u5F97");

		if (!O_view.getSearchMode()) {
			H_info.fromshop = O_model.getTransferShopId(A_shopid, H_shoplist, "from", O_view);
			H_info.toshop = O_model.getTransferShopId(A_shopid, H_shoplist, "to", O_view);
			var H_data = O_model.getSearchResult(H_sql.search, O_view);
		}

		this.consoleout("end \u30C7\u30FC\u30BF\u53D6\u5F97");
		this.consoleout("start makeListData");
		H_data = O_model.makeListData(H_data);
		this.consoleout("end makeListData");
		var A_order = O_basemodel.extractOrderColumn(H_data, "orderid");

		if (0 < A_order.length) //$H_data = $O_model->addTransferInfo($H_data, $A_order, $H_g_sess["shopid"]);
			//$O_model->addTransferInfo(&$H_data, &$A_order, &$H_g_sess["shopid"]);
			{
				O_model.addTransferInfo(H_data, A_order, A_shopid);
			}

		var cnt = H_data.length;
		O_model.setOrderID(H_data, H_sql);
		H_data = O_model.offsetListData(H_sess, H_data);
		H_data = O_model.getOrderNumber(H_data);
		var pagelink = O_model.getPageLink(H_sess, cnt);
		O_view.setSearchWhere(H_sql.down);
		O_view.displaySmarty(H_g_sess, H_data, H_flg, H_sess[ShopOrderMenuProc.PUB].limit, cnt, pagelink, H_view.pankuzu_link, H_shoplist, H_info);
	}

	__destruct() {
		super.__destruct();
	}

};