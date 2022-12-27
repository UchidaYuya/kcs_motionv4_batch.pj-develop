//
//受注詳細お客様情報編集Proc
//
//更新履歴：<br>
//2008/07/23 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/07/23
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("model/Order/BillingModelBase.php");
//
//受注詳細お客様情報編集Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/06/30
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderDetailModel.php");

require("model/Order/ShopOrderUserInfoModel.php");

require("view/Order/ShopOrderEditUserInfoView.php");

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
//Smartyで表示
//
//@author igarashi
//@since 2008/07/23
//
//@param $H_param
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
class ShopOrderEditUserInfoProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ShopOrderEditUserInfoView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderUserInfoModel(O_db0, H_g_sess, flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//orderdetail model作成
	//$billModel = new BillingModelBase();
	//$O_view->setBillView($billView);
	//権限一覧を取得
	//入力フォーム作成
	//cssを取得
	//パンクズリンク取得
	//
	//form作成
	//
	//
	//表示用情報取得
	//
	//SESSIONに保存済みなら再取得はしません
	//
	//更新
	//
	//QuickFormにデフォルト値をセット
	//$O_view->setFormRule();
	//入力チェック
	//更新ボタンが押されてなければ抜ける
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		var O_detailmodel = new ShopOrderDetailModel(O_db0, H_g_sess);
		var billView = new BillingViewBase();
		O_detailmodel.setBillView(billView);
		var A_auth = O_model.get_AuthIni();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		O_view.makeShopOrderUserInfoForm(H_sess[ShopOrderEditUserInfoProc.PUB].count);

		if (false == (undefined !== H_sess.SELF.dbget)) //取得した情報をSESSIONに入れる
			{
				H_view.order = O_detailmodel.getOrderInfo(H_g_sess, H_sess[ShopOrderEditUserInfoProc.PUB].orderid, H_g_sess.shopid);
				H_view.order.manage = O_model.getTelManageInfo(O_model.extractOrderColumn(H_view.order.machine, "telno"), H_view.order);
				H_view.order.machine = O_model.mergeOrderAndManageData(H_view.order.machine, H_view.order.manage);
				H_view.order.user = O_model.getUserInfomation(H_view.order.order, O_detailmodel.getSecondRootAuth(H_view.order.order.pactid));
				O_view.setSessionOrderInfo("order", H_view.order);
			} else {
			H_view.order = H_sess.SELF.dbget.order;
		}

		H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderEditUserInfoProc.PUB].orderid, H_g_sess.shopid);
		H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderEditUserInfoProc.PUB].orderid, H_g_sess.shopid);
		O_view.setDefaultsForm(O_model.getFreewordDefault(H_view.order.machine));
		O_view.setDefaultsForm(H_view.order.user);
		O_view.validate(H_sess.SELF.update);
		H_view.upflg = false;

		if (true == (undefined !== H_sess.SELF.update.execsub)) //更新sql作成
			//var_dump($A_sql);
			//更新実行
			//$O_view->endUpdateProc(array(self::PUB, "/MTOrderList"));
			{
				var A_sql = O_model.makeUserInfomationSQL(H_sess.SELF, H_sess[ShopOrderEditUserInfoProc.PUB].orderid);
				H_view.upflg = O_model.execUpdateStatus(A_sql);
				O_view.endUpdateProc([ShopOrderEditUserInfoProc.PUB, "/MTOrderList", "/Shop/MTOrder/rapid"]);
			} else {
			H_view.upflg = "unexec";
		}

		O_view.displaySmarty(H_g_sess, H_sess, H_view);
	}

	__destruct() {
		super.__destruct();
	}

};