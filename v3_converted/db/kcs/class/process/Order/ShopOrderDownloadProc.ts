//
//販売店受注一覧ダウンロード
//
//更新履歴:<br>
//2008/10/07
//
//@users OrderFormProcBase
//@packages Order
//@subpacckage Process
//@author igarashi
//@since 2008/10/07
//
//
//販売店受注一覧ダウンロード
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/10/07
//

require("process/Order/ShopOrderMenuProc.php");

require("model/Order/ShopOrderDetailModel.php");

require("model/Order/ShopOrderDownloadModel.php");

require("view/Order/ShopOrderDownloadView.php");

require("OrderUtil.php");

require("MtDateUtil.php");

class ShopOrderDownloadProc extends ShopOrderMenuProc {
	constructor() {
		super();

		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			this.pub = "/Shop/MTOrder/rapid";
		} else {
			this.pub = ShopOrderDownloadProc.PUB;
		}
	}

	doExecute(H_param: {} | any[] = Array()) //view生成
	//global session
	//session初期化
	//$O_view->clearSessionMenu();
	//menu用model取得
	//loginチェック
	//localセッションを取得
	//包括販売店かチェック
	//包括販売店は配下の販売店idを拾う
	//3つのテーブルを一つのデータに
	//exit;
	//display
	{
		var O_view = new ShopOrderDownloadView();
		var H_g_sess = O_view.getGlobalShopSession();
		O_view.clearUnderSession([this.pub]);
		var O_model = new ShopOrderDownloadModel(O_db0, H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var auth = O_model.getDLAuth(H_g_sess);

		if (undefined == auth) {
			O_model.exitNotAuth();
			throw die();
		}

		O_view.checkParamError(this.pub, H_sess, H_g_sess);
		O_model.writeShopMngLog(H_g_sess, H_sess);
		H_view.unify = O_model.checkUnifyShop(H_g_sess.shopid);
		var A_shopid = O_model.getChildShopID(H_g_sess.shopid, H_g_sess.shopname, H_view.unify, true);

		if (true == Array.isArray(A_shopid)) {
			var A_keyshop = Object.keys(A_shopid);
		}

		var H_order = O_model.getOrderTB(H_sess[this.pub].down.where, H_sess[this.pub].down.orderby);
		var H_sub = O_model.getOrderSubTB(H_sess[this.pub].down.where, H_sess[this.pub].down.orderby);
		var H_detail = O_model.getOrderTelDetailTB(H_sess[this.pub].down.where, H_sess[this.pub].down.orderby);
		var H_trans = O_model.getOrderTransfer(H_g_sess);
		H_data.carrier = O_model.getCarrierName();
		H_data.circuit = O_model.getCircuitName();
		H_data.charge = O_model.getChargeCount(A_keyshop, H_view.unify);
		H_data.transto = O_model.getTransferToInfo(A_keyshop);
		H_data.transfrom = O_model.getTransferFromInfo(A_keyshop);
		H_data.secfunc = O_model.getSecRootFuncPact(A_keyshop);
		H_data.prel = O_model.getPostRelShopInfo(A_keyshop);
		H_sub = O_model.mergeOrderSubAndDetail(H_sub, H_detail);
		H_sub = O_model.mergeOrderAndSub(H_order, H_sub);
		H_view.pntinfo = O_model.getPointRate(H_g_sess);
		H_view.notloan = O_model.getNoLoanBuyID(H_g_sess);
		O_model.compDLData(H_sub);
		H_sub = O_model.sortColumn(H_g_sess, H_sub, H_trans, H_view, H_data);
		H_sub = O_model.recalcBilltotal2(H_sub);
		H_sub = O_model.replacePoint(H_sub, H_order);

		for (var key in H_sub) {
			var val = H_sub[key];
			ksort(H_sub[key]);
		}

		O_view.outOrderList(H_sub);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};