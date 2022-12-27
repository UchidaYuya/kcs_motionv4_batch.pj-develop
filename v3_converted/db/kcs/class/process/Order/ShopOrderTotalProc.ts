//
//受注詳細ページプロセス
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
//プロセス実装
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/07/23
//

require("process/Order/ShopOrderDetailProc.php");

require("model/Order/ShopOrderTotalModel.php");

require("view/Order/ShopOrderTotalView.php");

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
class ShopOrderTotalProc extends ShopOrderDetailProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ShopOrderTotalView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new ShopOrderTotalModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//包括販売店は配下の販売店idを拾う
	//権限一覧を取得
	//cssを取得
	//パンクズリンク取得
	//
	//form作成
	//
	//
	//表示用情報取得
	//
	//オーダー情報取得
	//
	//更新
	//
	//システム用の値を表示用に変換
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.clearUnderSession(ShopOrderTotalProc.PUB);
		var A_shopid = O_model.checkUnificationShop(H_g_ses.shopid);
		var A_auth = O_model.get_AuthIni();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		H_view.order = O_model.getOrderInfo(H_sess[ShopOrderTotalProc.PUB].orderid, H_g_sess.shopid, A_shopid, Array());
		H_view.order = O_model.convOrderInfo(H_view.order);
		O_view.displaySmarty(H_g_sess, H_view);
	}

	__destruct() {
		super.__destruct();
	}

};