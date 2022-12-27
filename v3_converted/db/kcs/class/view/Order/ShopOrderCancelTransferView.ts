//
//振替キャンセル
//
//更新履歴：<br>
//2008/07/03 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/00/03
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//振替キャンセル
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/08/03
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderDetailViewBase.php");

require("model/Order/ShopOrderDetailModel.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/08/03
//
//@access public
//@return void
//
//
//一括状態更新、振替、振替キャンセル用にparamチェックを上書き
//
//@author igarashi
//@since 2008/08/03
//
//@access public
//@return none
//
//
//ページ個別のパラメータチェック
//
//@author igarashi
//@since 2008/07/03
//
//@access protected
//@return none
//
//
//checkOrderID
//
//@author igarashi
//@since 2009/09/10
//
//@param mixed $H_order
//@access public
//@return void
//
//入力フォームを作成する
//
// @author igarashi
// @since 2008/08/03
//
// @param $subcnt(表示するオーダーに含まれるsubの件数)
// @access public
// @return none
//
//makePankuzuLinkHash
//
//@author igarashi
//@since 2008/01/01
//
//@access public
//@return void
//
//
//Smarty表示
//
//@author igarashi
//@since 2008/07/23
//
//@access public
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/23
//
//@access public
//@return void
//
class ShopOrderCancelTransferView extends ShopOrderDetailViewBase {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParam() //一括ステータス変更、振替専用のcheckCGIParam。中でPeculiarも呼んでます
	{
		this.checkLumpProcCGIParam();
		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderCancelTransferView.PUB, this.H_Dir);
	}

	checkCGIParamPeculiar() {}

	checkOrderID(H_order) {
		if (this.O_order.A_empty == H_order || "" == H_order || undefined == H_order) {
			this.getOut().errorOut(5, "orderid\u304C\u306A\u3044", false);
		}
	}

	makeQuickForm() {
		var backurl = "menu.php";

		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			backurl = "rapid.php";
		}

		var A_form = [{
			name: "cancel",
			label: "\u53D7\u6CE8\u4E00\u89A7\u306B\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "location.href='" + backurl + "'"
			}
		}, {
			name: "exitsub",
			label: "\u632F\u66FF\u3092\u53D6\u308A\u6D88\u3059",
			inputtype: "submit"
		}];
		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"": "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB"
			};
		}

		return H_link;
	}

	displaySmarty(H_g_sess, H_view) //全件成功
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		var H_permit = O_model.makeUniqueArray(H_view.permit);
		var H_unperm = O_model.makeUniqueArray(H_view.unperm);
		this.get_Smarty().assign("shop_person", H_g_sess.personname);
		this.get_Smarty().assign("title", "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB");
		this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);

		if ("exec" == H_view.upflg.flg) {
			this.get_Smarty().assign("bgcolor", "mediumaquamarine");
			this.get_Smarty().assign("pagename", "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB");
			this.get_Smarty().assign("execnt", H_permit.length);
			this.get_Smarty().assign("message", "\u632F\u66FF\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F");

			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().display("./update_finish.tpl");
		} else if ("part" == H_view.upflg.flg) {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("errmessage", "\u4E00\u90E8\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u3092\u5B9F\u884C\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("errmsg", "\u4EE5\u4E0B\u306E\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002<br>\u5185\u5BB9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044");
			this.get_Smarty().assign("pagename", "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB");
			var H_temp = O_model.makeUniqueArray(H_view.unperm);
			this.get_Smarty().assign("errcnt", H_temp.length);
			this.get_Smarty().assign("H_err", H_temp);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().display("update_finish.tpl");
		} else if ("fail" == H_view.upflg.flg) {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("errmsg", "\u632F\u66FF\u306E\u30AD\u30E3\u30F3\u30BB\u30EB\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u632F\u66FF\u30AD\u30E3\u30F3\u30BB\u30EB");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().display("update_finish.tpl");
		} else {
			this.get_Smarty().assign("O_form", O_renderer.toArray());
			this.get_Smarty().assign("H_order", H_permit);
			this.get_Smarty().assign("H_err", H_unperm);
			this.get_Smarty().assign("allcnt", H_permit.length);
			this.get_Smarty().assign("errcnt", H_unperm.length);
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};