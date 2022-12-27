//
//受注詳細印刷Proc
//
//更新履歴：<br>
//2008/06/30 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/06/30
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("process/Order/OrderFormProcBase.php");
//
//受注詳細印刷Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/07/23
//

require("process/Order/ShopOrderDetailProc.php");

require("model/Order/ShopOrderPrintOutModel.php");

require("model/Order/ShopOrderUserInfoModel.php");

require("view/Order/ShopOrderDetailView.php");

require("view/Order/ShopOrderPrintOutView.php");

require("view/Order/BillingViewBase.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/06/30
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/06/30
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/06/30
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//お客様情報Modelオブジェクト取得
//
//@author igarashi
//@since 2008/07/22
//
//@param $H_g_sess
//
//@access protected
//@return none
//
//
//受注詳細メインループ
//
//@author igarashi
//
//@access public
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderPrintOutProc extends ShopOrderDetailProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ShopOrderPrintOutView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderPrintOutModel(O_db0, H_g_sess, flg);
	}

	get_ShopOrderUserInfoModel(H_g_sess) {
		return new ShopOrderUserInfoModel(O_db0, H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//["SELF"]以下のSESSIONを消す これやらないと別画面での更新がいつまでも「完了」になる
	//if(true == isset($H_sess["SELF"]["execsub"])){
	//}
	//包括販売店は配下の販売店idを拾う
	//$A_shopid = $O_model->checkUnificationShop($H_g_ses["shopid"]);
	//権限一覧を取得
	//cssを取得
	//
	//form作成
	//
	//件数を取得
	//販売店ステータス取得
	//
	//表示用情報取得
	//
	//オーダー情報取得
	//包括販売店は配下の販売店idを拾う
	//管理ログ出力
	//部門コード取得
	//振替先部門コード取得
	//電話番号別振替先部門コード取得
	//お客様情報取得
	//サービス名取得
	//オプション名取得
	//電話の出力有無 付属品は出力しない
	//現在時刻取得
	//存在しないデータを表示できる様にする(-で表示させる)
	//$H_view["order"]["machine"] = $O_model->repairOrderData($H_view["order"]["machine"], "telno", "-", true, false);
	//$H_view["order"]["option"] = $O_model->getOptionName($H_view["order"]["machine"][0]["option"]);
	//自動ステータス権限チェック
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		var billView = new BillingViewBase();
		O_model.setBillView(billView);
		var O_m_user = this.get_ShopOrderUserInfoModel(H_g_sess);
		O_view.clearUnderSession([ShopOrderPrintOutProc.PUB]);
		var A_auth = O_model.get_AuthIni();
		H_view.js = O_view.getHeaderJS();
		H_view.count = O_model.getOrderSubCount(H_sess[ShopOrderPrintOutProc.PUB].orderid, "count");
		H_view.status = O_model.getShopOrderStatus(false);
		var H_view = O_model.getOrderInfo(H_g_sess, H_sess[ShopOrderPrintOutProc.PUB].orderid, H_g_sess.shopid);
		H_view.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid);
		var A_shopid = O_model.getChildShopID(H_g_sess, H_view.unify, true);

		if (true == Array.isArray(A_shopid)) {
			var A_keyshop = Object.keys(A_shopid);
		}

		if (true == H_view.unify) {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderPrintOutProc.PUB].orderid, A_keyshop);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderPrintOutProc.PUB].orderid, A_keyshop);
		} else {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderPrintOutProc.PUB].orderid, H_g_sess.shopid);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderPrintOutProc.PUB].orderid, H_g_sess.shopid);
		}

		O_model.writeShopMngLog(H_sess, "print");
		H_view.correct.postcode = O_model.getShopPostCode(H_view.order.shopid);
		H_view.transcode = O_model.getToTransferShop(H_sess[ShopOrderPrintOutProc.PUB].orderid, "code");

		if (0 < H_view.machine.length) {
			H_view.machine = O_model.getDetailTransferShopCode(H_view.machine, H_view.order.orderid);
		}

		if (0 < H_view.acce.length) {
			H_view.acce = O_model.getDetailTransferShopCode(H_view.acce, H_view.order.orderid);
		}

		H_view.calc = O_model.mathRegister(H_view);
		H_view.user = O_m_user.getUserInfomation(H_view.order);
		H_view.service = O_model.getServiceName(H_view.order.service);
		H_view.option = O_model.getOptionName(H_view.machine[0].option, H_view.order.ordertype, H_view.order.carid);
		H_view.discounts = O_model.getOptionName(H_view.machine[0].waribiki, H_view.order.ordertype, H_view.order.carid);
		H_view.telviewflg = O_model.getTelViewFlag(H_view.order.ordertype);
		H_view.nowtime = O_model.getNowTime();
		O_model.convDisplayData(H_view);
		O_model.createAuthObjectForShopAdmin(H_g_sess.shopid);

		if (!O_model.checkShopAdminFuncId(H_g_sess.shopid, ShopOrderPrintOutProc.FNC_PRINT_UPDATE)) //ステータス更新
			{
				var A_sql = O_model.updateStatus(H_view);
				O_model.execUpdateStatusHandRow(A_sql, this.debagmode);
			}

		var O_Auth = MtAuthority.singleton(H_view.order.pactid);
		var A_PactAuth = O_Auth.getPactFuncIni("all");
		O_view.displaySmarty(H_g_sess, H_sess, H_view, A_PactAuth);
	}

	__destruct() {
		super.__destruct();
	}

};