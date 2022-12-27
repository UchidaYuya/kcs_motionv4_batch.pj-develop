//
//受注詳細お客様情報編集View
//
//更新履歴：<br>
//2008/07/23 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/07/23
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//受注詳細お客様情報編集View
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/07/23
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderDetailViewBase.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/07/23
//
//@access public
//@return void
//
//
//ページ個別のパラメータチェック
//
//@author igarashi
//@since 2008/07/31
//
//@access protected
//@return none
//
//
//
//
//
//
//
//
//
//
//入力フォームを作成する
//
//@author igarashi
//@since 2008/07/15
//
//@param $subcnt(表示するオーダーに含まれるsubの件数)
//@access public
//@return none
//
//
//QuickFormのルールを設定する<br>
//お客様情報編集用
//
//@author igarashi
//@since 2008/09/03
//
//@access public
//@return none
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
class ShopOrderEditUserInfoView extends ShopOrderDetailViewBase {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParamPeculiar() //更新時に使うカラム
	//出荷先コードを戻した 20100401miya
	//企業コード追加 20100416miya
	{
		var A_upcol = ["destinationcode", "matterno", "knowledge", "existcircuit", "salepost", "shopnote", "certificate", "worldtel", "accountcomment", "tdbcode"];
		var sess = this.getLocalSession();

		if (true == (undefined !== _GET.cnt)) {
			this.H_Dir.count = _GET.cnt;
		} else if (false == (undefined !== sess[ShopOrderEditUserInfoView.PUB].count)) {
			this.getOut().errorOut(5, "ShopOrderEditUserInfoView::\u4EF6\u6570\u304C\u53D6\u5F97\u3067\u304D\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (true == (undefined !== _POST.confirm)) {
			this.H_Local.update.confirm = _POST.confirm;
		} else {
			delete this.H_Local.update.confirm;
		}

		if (true == (undefined !== _POST.execsub)) {
			this.H_Local.update.execsub = _POST.execsub;
		}

		var idx = 0;
		var cnt = 0;

		if (0 < _POST.length) {
			for (var key in _POST) {
				var val = _POST[key];

				if (true == (-1 !== A_upcol.indexOf(key))) {
					this.H_Local.update[key] = val;
				} else if (false != strstr(key, "free_")) {
					this.H_Local.free_up[idx][key] = val;
					cnt++;

					if (3 < cnt) {
						idx++;
						cnt = 0;
					}
				}
			}
		}
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u304A\u5BA2\u69D8\u60C5\u5831\u7DE8\u96C6"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u304A\u5BA2\u69D8\u60C5\u5831\u7DE8\u96C6"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u304A\u5BA2\u69D8\u60C5\u5831\u7DE8\u96C6"
			};
		}

		return H_link;
	}

	makeShopOrderUserInfoForm(subcnt) {
		var A_opt = {
			size: "18",
			maxlength: "20"
		};
		var A_optcom = {
			size: "35"
		};
		var A_form = [{
			name: "matterno",
			label: "\u30A2\u30AB\u30A6\u30F3\u30C8\u533A\u5206",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "existcircuit",
			label: "\u65E2\u8A2D\u56DE\u7DDA",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "worldtel",
			label: "\u56FD\u969B\u96FB\u8A71",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "accountcomment",
			label: "\u30A2\u30AB\u30A6\u30F3\u30C8\u533A\u5206\u30B3\u30E1\u30F3\u30C8",
			inputtype: "textarea",
			options: {
				cols: 30,
				rows: 4
			}
		}, {
			name: "destinationcode",
			label: "\u51FA\u8377\u5148\u30B3\u30FC\u30C9",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "salepost",
			label: "\u58F2\u4E0A\u90E8\u9580",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "shopnote",
			label: "\u8CA9\u58F2\u5E97\u9023\u7D61\u30E1\u30E2",
			inputtype: "textarea",
			options: {
				cols: 50,
				rows: 5
			}
		}, {
			name: "certificate",
			label: "\u8A3C\u660E\u66F8",
			inputtype: "textarea",
			options: {
				cols: 55,
				rows: 5
			}
		}, {
			name: "knowledge",
			label: "\u5099\u8003",
			inputtype: "textarea",
			options: {
				cols: 35,
				rows: 13
			}
		}, {
			name: "tdbcode",
			label: "\u4F01\u696D\u30B3\u30FC\u30C9",
			inputtype: "text",
			options: A_optcom
		}, {
			name: "confirm",
			label: "\u78BA\u8A8D\u753B\u9762\u3078",
			inputtype: "submit"
		}, {
			name: "execsub",
			label: "\u66F4\u65B0\u3059\u308B",
			inputtype: "submit"
		}];
		var A_free = Array();
		var idx = 0;

		for (var loop = 0; loop < subcnt; loop++) {
			A_free[idx] = {
				name: "free_one" + loop,
				label: "",
				inputtype: "text",
				options: A_opt
			};
			A_free[idx + 1] = {
				name: "free_two" + loop,
				label: "",
				inputtype: "text",
				options: A_opt
			};
			A_free[idx + 2] = {
				name: "free_the" + loop,
				label: "",
				inputtype: "text",
				options: A_opt
			};
			A_free[idx + 3] = {
				name: "free_for" + loop,
				label: "",
				inputtype: "text",
				options: A_opt
			};
			idx += 4;
		}

		A_form = array_merge(A_form, A_free);
		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
	}

	setFormRule() {
		this.H_view.FormUtil.addRuleWrapper("costprice", "\u6E1B\u4FA1\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
	}

	displaySmarty(H_g_sess, H_sess, H_view) {
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("shop_person", H_g_sess.personname);
		this.get_Smarty().assign("count", H_sess["/MTOrder"].count);

		if ("exec" == H_view.upflg) {
			this.get_Smarty().assign("bgcolor", "indianred");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8\u8A73\u7D30\uFF1A\u304A\u5BA2\u69D8\u60C5\u5831");
			this.get_Smarty().assign("message", "\u304A\u5BA2\u69D8\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("backurl", "./order_detail.php");
			this.get_Smarty().assign("title", "\u304A\u5BA2\u69D8\u60C5\u5831\u7DE8\u96C6");
			this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
			this.get_Smarty().display("update_finish.tpl");
		} else if (false == H_view.upflg || true == Array.isArray(H_view.upflg)) {
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8:\u30B5\u30D6\u72B6\u614B\u66F4\u65B0");
			this.get_Smarty().assign("errmsg", "\u4EE5\u4E0B\u306E\u53D7\u6CE8\u60C5\u5831\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg);
			this.get_Smarty().assign("misscnt", H_view.upflg.length);
			this.get_Smarty().assign("backurl", "./order_detail.php");
			this.get_Smarty().display("update_finish.tpl");
		} else {
			this.get_Smarty().assign("O_form", O_renderer.toArray());
			this.get_Smarty().assign("H_order", H_view.order.order);
			this.get_Smarty().assign("H_machine", H_view.order.machine);
			this.get_Smarty().assign("H_user", H_view.order.user);
			this.get_Smarty().assign("H_transto", H_view.order.transto);
			this.get_Smarty().assign("H_transfrom", H_view.order.transfrom);
			this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
			this.get_Smarty().assign("title", "\u304A\u5BA2\u69D8\u60C5\u5831\u7DE8\u96C6");
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};