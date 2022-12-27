//
//受注内容修正フォームViewクラス
//
//更新履歴：<br>
//2008/09/08 igarashi
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/09/08
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//require_once("view/ViewSmarty.php");
//
//承認フォームViewクラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/08/26
//@uses MtSetting
//@uses MtSession
//

require("RecogFormView.php");

require("model/Order/ShopOrderDetailModel.php");

require("model/Order/ShopOrderEditModel.php");

//
//販売店用パラメータチェック
//
//@author igarashi
//@since 2008/09/18
//
//
//
//受注種別を取得して返す
//
//@author igarashi
//@since 2008/09/18
//
//@access protected
//@return integer
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
//
//
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
//
//
//更新履歴入力用フォーム作成
//
//@author igarashi
//@since 2008/09/16
//
//
//
//完了画面の設定
//
//@author igarashi
//@since 2008/09/18
//
//
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class ShopOrderEditView extends RecogFormView {
	constructor(flg = ShopOrderEditView.SITE_SHOP) {
		H_param.site = ViewBaseHTML.SITE_SHOP;
		super(H_param);
	}

	checkCGIParamForShop() {}

	getShopOrderType(orderid) {
		var O_model = new ShopOrderEditModel(O_db0, this.getGlobalShopSession(), 1);
		return O_model.getShopOrderType(orderid);
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u53D7\u6CE8\u5185\u5BB9\u5909\u66F4"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u53D7\u6CE8\u5185\u5BB9\u5909\u66F4"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u53D7\u6CE8\u5185\u5BB9\u5909\u66F4"
			};
		}

		return H_link;
	}

	getCSS() {
		return "csRecog";
	}

	makeOrderHistoryForm() {
		var A_form = Array();
		var H_g_sess = this.getGlobalShopSession();
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		A_form.push({
			name: "member",
			label: "\u66F4\u65B0\u8005",
			inputtype: "select",
			data: O_model.getShopMember(H_g_sess.shopid, false)
		});
		A_form.push({
			name: "comment",
			label: "\u30B3\u30E1\u30F3\u30C8",
			inputtype: "text",
			options: {
				size: 120
			}
		});
		return A_form;
	}

	endOrderFormView(orderid) //セッションクリア
	//直接入力の付属品を消しておかないともう一度修正画面を開いたときに二重に表示される 20090826miya
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		delete this.H_Dir.free_acce;
		this.O_Sess.SetPub(ShopOrderEditView.PUB, this.H_Dir);
		this.writeLastForm();
		var H_sess = this.getGlobalShopSession();
		var O_finish = new ViewFinish(H_sess.shopid);
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u306E\u4FEE\u6B63", "/Shop/MTOrder/order_detail.php", "\u623B\u308B");
	}

	__destruct() {
		super.__destruct();
	}

};