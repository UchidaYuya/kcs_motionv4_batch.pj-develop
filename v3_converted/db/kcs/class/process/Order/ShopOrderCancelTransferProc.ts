//
//受注振替キャンセルProc
//
//更新履歴：<br>
//2008/08/03 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/08/07
//
//
//error_reporting(E_ALL|E_STRICT);
//
//受注振替キャンセルProc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/08/07
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderCancelTransferModel.php");

require("view/Order/ShopOrderCancelTransferView.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/08/07
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/08/07
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/08/07
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
//@since 2008/08/03
//
//@param $H_param
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return void
//
class ShopOrderCancelTransferProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //$this->debagmode=true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderCancelTransferView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderCancelTransferModel(O_db0, H_g_sess, flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//統括販売店なら下位の販売店も拾う
	//権限一覧を取得
	//cssを取得
	//パンクズリンク取得
	//
	//form作成
	//
	//form作る
	//
	//表示用情報取得
	//
	//オーダー情報取得
	//取得した情報をSESSIONに入れる
	//
	//更新
	//
	//入力チェック
	//更新ボタンが押されたら更新処理
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		H_view.flg.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid);

		if (H_view.flg.unify) {
			var A_shopid = O_model.getChildShopID(H_g_sess, H_view.flg.unify, true);
			A_shopid = Object.keys(A_shopid);
		} else {
			A_shopid = [H_g_sess.shopid];
		}

		var A_auth = O_model.get_AuthIni();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		O_view.makeQuickForm();
		O_view.checkOrderID(H_sess[ShopOrderCancelTransferProc.PUB].orderid);
		var H_result = O_model.getOrderInfo(H_sess[ShopOrderCancelTransferProc.PUB].orderid, H_g_sess.shopid);
		var H_trans = O_model.getTransferInfomation(H_sess, A_shopid);
		H_result = O_model.checkCancelTransferPossible(H_trans, H_result, A_shopid);
		H_view.permit = H_result.permit;
		H_view.unperm = H_result.unperm;
		var H_permit = H_result.permitorder;
		O_view.setSessionOrderInfo("permit", H_result.permit);
		O_view.setSessionOrderInfo("unperm", H_result.unperm);
		O_view.setSessionOrderInfo("permitorder", H_result.permitorder);
		O_view.validate(H_sess.SELF);

		if (true == (undefined !== H_sess.SELF.exitsub)) {
			if (0 < H_view.permit.length) //order_tbのsql作成
				//メール送信準備
				{
					var H_charge = O_model.getChargeCount(H_view.permit);
					var H_sql = O_model.makeDeleteOrderTransfer(H_g_sess, H_view.permit, H_charge, A_shopid);
					var H_mail = O_model.readyTransferCancelMail(H_g_sess, H_sess.SELF.dbget);
					H_view.upflg = O_model.execUpdateStatusHand(H_sql, this.debagmode);

					if (0 < H_view.unperm.length) {
						H_view.upflg.flg = "part";
					}

					O_model.sendTransferCancelMail(H_g_sess, H_view.upflg.err, H_mail);

					if (false == this.debagmode) {
						O_view.endUPdateProc([ShopOrderCancelTransferProc.PUB, "/MTOrderList", "/Shop/MTOrder/rapid"]);
					}
				} else {
				H_view.upflg.flg = "unexec";
			}
		} else {
			H_view.upflg.flg = "unexec";
		}

		O_view.displaySmarty(H_g_sess, H_view);
	}

	__destruct() {
		super.__destruct();
	}

};