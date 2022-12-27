//
//受注振替view
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
//受注振替view
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
//入力フォームを作成する
//
// @author igarashi
// @since 2008/08/03
//
// @param $subcnt(表示するオーダーに含まれるsubの件数)
// @access public
// @return none
//
//QuickFormのデフォルト値を返す
//
//@author igarashi
//@since 2008/08/06
//
//@access public
//@return hash
//
//
//QuickFormのuleを作成、適用する
//
//@author igarashi
//@since 2008/08/06
//
//@public function
//@return none
//
//
//QuickFormにデフォルト値を入れる
//
//@author igarashi
//@since 2008/08/03
//
//@param $H_view セットしたい値の配列
//
//@access public
//@return none
//
//
//
//
//
//
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
class ShopOrderTransferView extends ShopOrderDetailViewBase {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParam() //一括ステータス変更、振替専用のcheckCGIParam。中でPeculiarも呼んでます
	{
		this.checkLumpProcCGIParam();
		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderTransferView.PUB, this.H_Dir);
	}

	checkCGIParamPeculiar() //他にpostがあれば全部突っ込む
	{
		if (true == (undefined !== _POST)) {
			this.H_Local = _POST;
		}

		if (true == (undefined !== _GET.confirm)) {
			this.H_Local.confirm = _GET.confirm;
		}
	}

	makeShopOrderTransferForm(H_order, H_trans) {
		var backurl = "menu.php";

		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			backurl = "rapid.php";
		}

		var A_form = [{
			name: "shopselect",
			label: "\u632F\u66FF\u5148\u8CA9\u58F2\u5E97",
			inputtype: "select",
			options: {
				id: "shopselect"
			},
			data: H_trans
		}, {
			name: "saleform",
			label: "\u632F\u66FF\u65B9\u6CD5",
			inputtype: "radio",
			data: {
				work: ["\u958B\u901A\u4F5C\u696D\u306E\u307F"],
				both: ["\u958B\u901A\u4F5C\u696D\u3068\u58F2\u4E0A\u3068\u3082"]
			}
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "submit"
		}, {
			name: "cansel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "javascript:window.location=\"./" + backurl + "\""
			}
		}, {
			name: "confirm",
			label: "\u78BA\u8A8D\u753B\u9762\u3078",
			inputtype: "submit"
		}, {
			name: "exitsub",
			label: "\u66F4\u65B0\u3059\u308B",
			inputtype: "submit"
		}];
		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
	}

	getDefaultForm() {
		this.H_def_form = {
			shopselect: "0",
			saleform: "work"
		};
		return this.H_def_form;
	}

	setFormRule() {
		this.H_view.FormUtil.addRuleWrapper("shopselect", "\u632F\u66FF\u5148\u8CA9\u58F2\u5E97\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
		this.H_view.FormUtil.setDefaultWarningNote();
	}

	setDefaultsForm(H_defaults) {
		this.H_view.FormUtil.setDefaultsWrapper(H_defaults);
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u53D7\u6CE8\u632F\u66FF"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"": "\u53D7\u6CE8\u632F\u66FF"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u53D7\u6CE8\u632F\u66FF"
			};
		}

		return H_link;
	}

	displaySmarty(H_g_sess, H_view) //更新成功
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		this.get_Smarty().assign("title", "\u632F\u66FF");
		this.get_Smarty().assign("shop_person", H_g_sess.personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
		this.get_Smarty().assign("H_unperm", H_view.unperm);
		this.get_Smarty().assign("H_reperm", H_view.reperm);

		if ("exec" == H_view.upflg.flg) //再振替、販売店元への振替は別項目として結果表示するほうが良いかも・・
			//再振替、販売店元への振替は別項目として結果表示するほうが良いかも・・
			{
				this.get_Smarty().assign("bgcolor", "mediumaquamarine");
				this.get_Smarty().assign("pagename", "\u53D7\u6CE8\u632F\u66FF");
				var execnt = H_view.permit.length + H_view.reperm.length;
				+H_view.reperm_new.length;

				if (1 <= execnt) {
					this.get_Smarty().assign("execnt", execnt);
					this.get_Smarty().assign("message", "\u632F\u66FF\u51E6\u7406\u3092\u5B9F\u884C\u3057\u307E\u3057\u305F");
				}

				this.get_Smarty().assign("H_err", O_model.makeUniqueArray(H_view.unperm));

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
			this.get_Smarty().assign("errmessage", "\u4E00\u90E8\u306E\u632F\u66FF\u51E6\u7406\u3092\u5B9F\u884C\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u632F\u66FF");
			this.get_Smarty().assign("errmsg", "\u4EE5\u4E0B\u306E\u53D7\u6CE8\u306B\u3064\u3044\u3066\u306F\u51E6\u7406\u3092\u884C\u3048\u307E\u305B\u3093\u3067\u3057\u305F\u3002<br>\u5185\u5BB9\u3092\u78BA\u8A8D\u3057\u3066\u4E0B\u3055\u3044");
			var H_temp = O_model.makeUniqueArray(H_view.unperm);
			this.get_Smarty().assign("errcnt", H_temp.length);
			this.get_Smarty().assign("H_err", H_temp);

			if (false != H_view.upflg.err) {
				this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
				this.get_Smarty().assign("H_miss", H_view.upflg.err);
			}

			this.get_Smarty().display("./update_finish.tpl");
		} else if ("fail" == H_view.upflg.flg) {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("message", "\u53D7\u6CE8\u632F\u66FF\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u632F\u66FF");
			this.get_Smarty().assign("errmsg", "\u5185\u5BB9\u3092\u78BA\u8A8D\u3057\u3066\u4E0B\u3055\u3044");
			this.get_Smarty().display("./update_finish.tpl");
		} else {
			this.get_Smarty().assign("O_form", O_renderer.toArray());
			var H_perm = O_model.makeUniqueArray(H_view.permit);
			var H_unperm = O_model.makeUniqueArray(H_view.unperm);
			this.get_Smarty().assign("H_order", H_perm);
			this.get_Smarty().assign("H_err", H_unperm);
			this.get_Smarty().assign("allcnt", H_perm.length);
			this.get_Smarty().assign("errcnt", H_unperm.length);
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};