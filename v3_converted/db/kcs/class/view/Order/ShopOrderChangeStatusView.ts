//
//受注ステータス一括更新
//
//更新履歴：<br>
//2008/07/03 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/00/07
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//受注ステータス一括更新
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/08/07
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderDetailViewBase.php");

require("OrderUtil.php");

require("model/Order/ShopOrderDetailModel.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return void
//
//
//一括状態更新、振替、振替キャンセル用にparamチェックを上書き
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return none
//
//
//ページ個別のパラメータチェック
//
//@author igarashi
//@since 2008/08/07
//
//@access protected
//@return none
//
//入力フォームを作成する
//
// @author igarashi
// @since 2008/08/07
//
// @param $subcnt(表示するオーダーに含まれるsubの件数)
// @access public
// @return none
//
//QuickFormのデフォルト値を返す
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return hash
//
//
//QuickFormのruleを作成、適用する
//
//@author igarashi
//@since 2008/08/07
//
//@public function
//@return none
//
//
//QuickFormにデフォルト値を入れる
//
//@author igarashi
//@since 2008/08/07
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
//errorNonPermit
//
//@author igarashi
//@since 2009/10/01
//
//@access public
//@return void
//
//
//Smarty表示
//
//@author igarashi
//@since 2008/08/07
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
class ShopOrderChangeStatusView extends ShopOrderDetailViewBase {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParam() //一括ステータス変更、振替専用のcheckCGIParam。中でPeculiarも呼んでます
	{
		this.checkLumpProcCGIParam();
		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderChangeStatusView.PUB, this.H_Dir);
	}

	checkCGIParamPeculiar() {
		if (true == (undefined !== _POST.memselect)) {
			this.H_Local.memselect = _POST.memselect;
		}

		if (true == (undefined !== _POST.lumpstatus)) {
			this.H_Local.lumpstatus = _POST.lumpstatus;
		}

		if (true == (undefined !== _POST.dayswitch)) {
			this.H_Local.dayswitch = _POST.dayswitch;
		}

		if (true == (undefined !== _POST.expectdate)) {
			this.H_Local.expectdate = _POST.expectdate;
		}

		if (true == (undefined !== _POST.deliverydate)) //一括ステータス変更は日付が入っていれば常に更新対象になるようにしておく
			{
				this.H_Local.deliverydate = _POST.deliverydate;
				this.H_Local.allproc = "10";
			}

		if (true == (undefined !== _POST.comment)) {
			this.H_Local.comment = _POST.comment;
		}

		if (true == (undefined !== _POST.confirm)) {
			this.H_Local.confirm = _POST.confirm;
		}

		if (true == (undefined !== _POST.exitsub)) {
			this.H_Local.exitsub = _POST.exitsub;
		}
	}

	makeShopOrderChangeStatusForm(H_form) {
		var A_switch = {
			arrival: ["\u672A\u5B9A", {
				onClick: "disableExdate()"
			}],
			spec: ["\u6307\u5B9A\u3059\u308B", {
				onClick: "disableExdate()"
			}]
		};
		var A_form = [{
			name: "memselect",
			label: "\u66F4\u65B0\u8005",
			inputtype: "select",
			data: H_form.shopmem
		}, {
			name: "lumpstatus",
			label: "\u72B6\u614B",
			inputtype: "select",
			options: {
				onChange: "disableConstdate(this)"
			},
			data: H_form.status
		}, {
			name: "dayswitch",
			label: "",
			inputtype: "radio",
			data: A_switch
		}, {
			name: "expectdate",
			label: "\u51E6\u7406\u65E5",
			inputtype: "date",
			data: this.O_order.getDateHourFormat(1, 1, 10, 17)
		}, {
			name: "deliverydate",
			label: "\u7D0D\u54C1\u65E5",
			inputtype: "date",
			data: this.O_order.getDateHourFormat(1, 1, 10, 17)
		}, {
			name: "comment",
			label: "\u30B3\u30E1\u30F3\u30C8",
			inputtype: "text"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "submit"
		}, {
			name: "cansel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "submit"
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
			shopselect: "1",
			saleform: "work"
		};
		return this.H_def_form;
	}

	setFormRule() {
		this.H_view.FormUtil.addRuleWrapper("lumpstatus", "\u72B6\u614B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
		this.H_view.FormUtil.setDefaultWarningNote();
	}

	setDefaultsForm(H_defaults) {
		this.H_view.FormUtil.setDefaultsWrapper(H_defaults);
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"": "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4"
			};
		}

		return H_link;
	}

	errorNonPermit() {
		this.getOut().errorOut(19, "\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3067\u304D\u308B\u30AA\u30FC\u30C0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093", false);
	}

	displaySmarty(H_g_sess, H_view) {
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		var H_permit = O_model.makeUniqueArray(H_view.permit);
		var H_unperm = O_model.makeUniqueArray(H_view.unperm);
		this.get_Smarty().assign("title", "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4");
		this.get_Smarty().assign("shop_person", H_g_sess.personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);

		if ("exec" == H_view.upflg.flg) {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("message", "\u53D7\u6CE8\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().display("update_finish.tpl");
		} else if ("part" == H_view.upflg.flg) {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			} else {
				this.get_Smarty().assign("backurl", "./menu.php");
			}

			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("errmsg", "\u53D7\u6CE8\u60C5\u5831\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("missmsg", "\u4EE5\u4E0B\u306E\u53D7\u6CE8\u60C5\u5831\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5185\u5BB9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044");
			this.get_Smarty().assign("pagename", "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
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
			this.get_Smarty().assign("errmsg", "\u53D7\u6CE8\u60C5\u5831\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u4E00\u62EC\u53D7\u6CE8\u30B9\u30C6\u30FC\u30BF\u30B9\u5909\u66F4");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().display("update_finish.tpl");
		} else {
			if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
				this.get_Smarty().assign("backurl", "rapid.php");
			}

			this.get_Smarty().assign("O_form", O_renderer.toArray());
			this.get_Smarty().assign("H_permit", H_permit);
			this.get_Smarty().assign("allcnt", H_permit.length);
			this.get_Smarty().assign("H_err", H_unperm);
			this.get_Smarty().assign("errcnt", H_unperm.length);
			this.get_Smarty().assign("memname", H_view.memname);
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};