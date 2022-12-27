//
//個別出荷view
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
//個別出荷view
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

require("view/Order/ShopOrderDetailView.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/07/27
//
//@access public
//@return void
//
//
//各ページ別のCGIパラメータチェック
//
//@author igarashi
//@since 2008/07/27
//
//@access protected
//@return none
//
//
//checkUpTargetSelected
//
//@author igarashi
//@since 2009/07/09
//
//@access private
//@return void
//
//
//session名が同じだと受注詳細から引っ張ってしまうので、消したい物は消す。
//
//@author igarashi
//@since 2009/03/24
//
//@access private
//@return void
//
//
//パン屑リンクを作る
//
//@author igarashi
//@since 2008/09/17
//
//@access public
//@return hash
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
//setFormRule
//
//@author igarashi
//@since 2008/07/15
//
//@access public
//@return void
//
//
//渡された配列からQuickFormのradioボタン用データを生成する
//
//@author igarashi
//@since 2008/07/29
//
//@param $H_org (元データのハッシュ)
//@param $name ($H_orgのキー名.$H_org[$name]が生成する配列のキー名になる)
//@param $data ($H_orgのキー名.$H_result[$H_org[$name]]の中身になる)
//
//@access protected
//@return hush
//
//
//QuickFormにデフォルト値を入れる
//
//@author igarashi
//@since 2008/07/23
//
//@param $H_view セットしたい値の配列
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
class ShopOrderSubStatusView extends ShopOrderDetailView {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParamPeculiar() //Yがなければリセットする
	//前画面からdeliverydateがPOSTがきているため、この処理をしないとformのdeliverydateが上書きされてしまうため
	{
		var A_upcol = ["expectdate", "registdate", "contractdate", "deliverydate", "trans", "transflg", "purbalance", "substatus", "subcomment", "comflg", "expectup", "registup", "contractup", "endsel", "trswitch", "stock"];
		var sess = this.getLocalSession();
		this.initH_Local();
		this.H_Local.uptarget = this.O_order.A_empty;

		if (!(undefined !== _POST.deliverydate.Y)) {
			delete _POST.deliverydate;
		}

		if (0 < _POST.length) {
			for (var key in _POST) {
				var val = _POST[key];

				if (true == (-1 !== A_upcol.indexOf(key))) {
					if ("substatus" != key) {
						this.H_Local[key] = val;
					} else if ("substatus" == key) {
						this.H_Local.status = val;
					}
				} else if (true == preg_match("/^uptag/", key)) {
					var tmp = key.replace(/[^0-9]/g, "");
					this.H_Local.uptarget[+tmp] = tmp;
				}
			}
		}

		if (true == (undefined !== _POST.confirm) && "" != _POST.confirm) //}elseif(true == isset($this->H_Local["confirm"])){
			//unset($this->H_Local["confirm"]);
			{
				this.H_Local.confirm = _POST.confirm;
			}

		if (true == (undefined !== _POST.execsub) && "" != _POST.execsub) {
			this.checkUpTargetSelected();
			this.H_Local.execsub = _POST.execsub;
		}

		if (undefined !== _POST.pagename) {
			this.H_Local.pagename = _POST.pagename;
		} else {
			this.H_Local.pagename = "";
		}

		if (true == (undefined !== _POST.cancel) && "" != _POST.cancel) {
			delete this.H_Local.confirm;
		}
	}

	checkUpTargetSelected() {
		if (this.O_order.A_empty == this.H_Local.uptarget) {
			this.getOut().errorOut(5, "\u66F4\u65B0\u3059\u308B\u660E\u7D30\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}
	}

	initH_Local() {
		if (true == (undefined !== this.H_Local.status)) {
			delete this.H_Local.status;
		}
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u500B\u5225\u51FA\u8377\u72B6\u6CC1\u66F4\u65B0"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u500B\u5225\u51FA\u8377\u72B6\u6CC1\u66F4\u65B0"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30",
				"": "\u500B\u5225\u51FA\u8377\u72B6\u6CC1\u66F4\u65B0"
			};
		}

		return H_link;
	}

	makeShopOrderSubStatusForm(H_order, H_view, H_date) {
		var H_trans = {
			work: ["\u958B\u901A\u4F5C\u696D\u306E\u307F<br>", {
				id: "tr_work"
			}],
			both: ["\u958B\u901A\u4F5C\u696D\u3068\u58F2\u4E0A\u3068\u3082", {
				id: "tr_sale"
			}]
		};
		var H_trswitch = {
			trexec: ["\u632F\u66FF\u5B9F\u884C<br>", {
				onClick: "disableTransferSelect()"
			}],
			trcancel: ["\u632F\u66FF\u53D6\u6D88", {
				onClick: "disableTransferSelect()"
			}]
		};
		var H_radio = {
			not_update: ["\u66F4\u65B0\u3057\u306A\u3044", {
				onClick: "disableDeliveryDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			after: ["\u672A\u5B9A", {
				onClick: "disableDeliveryDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			specifies: ["\u6307\u5B9A\u3059\u308B", {
				onClick: "disableDeliveryDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}]
		};
		var H_exradio = {
			not_update: ["\u66F4\u65B0\u3057\u306A\u3044", {
				onClick: "disableExpectDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			undecid: ["\u672A\u5B9A", {
				onClick: "disableExpectDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			desig: ["\u6307\u5B9A\u3059\u308B", {
				onClick: "disableExpectDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}]
		};
		H_order.substat = this.makeRadioFormData(H_order.substat, "status", "forsub");
		var H_stctag = {
			reserve: ["\u53D6\u7F6E\u5728\u5EAB\u304B\u3089\u6E1B\u3089\u3059<br>", {
				id: "allres"
			}],
			regular: ["\u901A\u5E38\u306E\u5728\u5EAB\u304B\u3089\u6E1B\u3089\u3059<br>", {
				id: "allreg"
			}],
			stcindi: ["\u73FE\u5728\u306E\u8A2D\u5B9A\u3092\u6B8B\u3059", {
				id: "allind"
			}]
		};
		var A_form = [{
			name: "trans",
			label: "\u90E8\u5206\u632F\u66FF",
			inputtype: "select",
			data: H_order.transhop,
			options: {
				onChange: "disableSubTransfer(this)"
			}
		}, {
			name: "transflg",
			label: "\u90E8\u5206\u632F\u66FF",
			inputtype: "radio",
			data: H_trans,
			options: {
				id: "transwork"
			}
		}, {
			name: "stock",
			label: "\u5728\u5EAB",
			inputtype: "radio",
			data: H_stctag
		}, {
			name: "trswitch",
			label: "",
			inputtype: "radio",
			data: H_trswitch,
			options: {
				id: "trswitch"
			}
		}, {
			name: "substatus",
			label: "\u72B6\u614B",
			inputtype: "radio",
			data: H_order.substat,
			options: {
				id: "statselect"
			}
		}, {
			name: "comflg",
			label: "\u30B3\u30E1\u30F3\u30C8\u3092\u4E0A\u66F8\u304D\u3059\u308B",
			inputtype: "checkbox"
		}, {
			name: "subcomment",
			label: "\u30B3\u30E1\u30F3\u30C8",
			inputtype: "text",
			data: "",
			options: {
				size: "50",
				maxlength: "255"
			}
		}, {
			name: "registup",
			label: "\u96FB\u8A71\u7BA1\u7406\u306E\u8CFC\u5165\u65E5\u3092\u4E0A\u66F8\u304D\u3059\u308B",
			inputtype: "checkbox",
			options: {
				onClick: "disableRegistDate()",
				id: "registup"
			}
		}, {
			name: "contractup",
			label: "\u96FB\u8A71\u7BA1\u7406\u306E\u5951\u7D04\u65E5\u3092\u4E0A\u66F8\u304D\u3059\u308B",
			inputtype: "checkbox",
			options: {
				onClick: "disableContractDate()",
				id: "contructup"
			}
		}, {
			name: "deliverydate",
			label: "\u7D0D\u54C1\u65E5",
			inputtype: "date",
			data: this.O_order.getDateHourFormat(1, 1, 10, 17)
		}, {
			name: "expectdate",
			label: "\u51E6\u7406\u65E5",
			inputtype: "date",
			data: this.O_order.getDateHourFormat(1, 1, 10, 17)
		}, {
			name: "contractdate",
			label: "\u5951\u7D04\u65E5",
			inputtype: "date",
			data: this.O_order.getDateFormat("1979", 1)
		}, {
			name: "registdate",
			label: "\u8CFC\u5165\u65E5",
			inputtype: "date",
			data: this.O_order.getDateFormat(20, 1)
		}, {
			name: "endsel",
			label: "\u5165\u8377\u5F8C",
			inputtype: "radio",
			data: H_radio,
			options: {
				id: "endsel"
			}
		}, {
			name: "expectup",
			label: "\u51E6\u7406\u65E5",
			inputtype: "radio",
			data: H_exradio
		}, {
			name: "confirm",
			label: "\u78BA\u8A8D",
			inputtype: "button",
			options: {
				id: "confirm",
				onClick: "checkTargetBox()"
			}
		}, {
			name: "execsub",
			label: "\u66F4\u65B0",
			inputtype: "submit"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "submit"
		}];

		if (this.O_order.type_blp != H_view.order.order.ordertype) {
			{
				let _tmp_0 = H_view.order.machine;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if ("" != val.telno_view) {
						var label = val.telno_view;
					} else if ("" != val.telno) {
						label = val.telno;
					} else {
						label = "\u672A\u5165\u529B";
					}

					A_form.push({
						name: "uptag_" + val.detail_sort,
						label: label,
						inputtype: "checkbox"
					});
				}
			}
			{
				let _tmp_1 = H_view.order.acce;

				for (var key in _tmp_1) {
					var val = _tmp_1[key];
					A_form.push({
						name: "uptag_" + val.detail_sort,
						label: val.productname,
						inputtype: "checkbox"
					});
				}
			}
		} else {
			{
				let _tmp_2 = H_view.order.machine;

				for (var key in _tmp_2) {
					var val = _tmp_2[key];
					A_form.push({
						name: "uptag_" + val.arid,
						label: val.telno_view,
						inputtype: "checkbox"
					});
				}
			}
		}

		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
	}

	setFormRule() //$this->H_view["FormUtil"]->addRuleWrapper("status", "", "required", null, "client");
	{
		this.H_view.FormUtil.addRuleWrapper("purbalance", "\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
		this.H_view.FormUtil.addRuleWrapper("deliverydate", "\u7D0D\u54C1\u65E5\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059", new CheckdateRule(), undefined, "clienet");
		this.H_view.FormUtil.addRuleWrapper("expectdate", "\u51E6\u7406\u65E5\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059", new CheckdateRule(), undefined, "clienet");
		this.H_view.FormUtil.addRuleWrapper("registdate", "\u8CFC\u5165\u65E5\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059", new CheckdateRule(), undefined, "clienet");
		this.H_view.FormUtil.addRuleWrapper("contractdate", "\u5951\u7D04\u65E5\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059", new CheckdateRule(), undefined, "clienet");
	}

	makeRadioFormData(H_org, name, data) {
		var H_result = Array();
		var cnt = H_org.length;

		for (var idx = 0; idx < cnt; idx++) {
			H_result[H_org[idx][name]] = [H_org[idx][data]];
		}

		return H_result;
	}

	setDefaultsForm(H_defaults) {
		this.H_view.FormUtil.setDefaultsWrapper(H_defaults);
	}

	displaySmarty(H_g_sess, H_view) //k76 20150313 date
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		this.get_Smarty().assign("shop_person", H_g_sess.personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("title", "\u30B5\u30D6\u30B9\u30C6\u30FC\u30BF\u30B9\u66F4\u65B0");
		this.get_Smarty().assign("H_order", H_view.order.order);
		this.get_Smarty().assign("H_transto", H_view.order.transto.gif);
		this.get_Smarty().assign("H_transfrom", H_view.order.transfrom.gif);
		this.get_Smarty().assign("H_shoplist", H_view.shoplist);
		this.get_Smarty().assign("H_err", H_view.errmsg);
		this.get_Smarty().assign("H_managedate", H_view.orderdate);

		if (this.O_order.type_blp != H_view.order.order.ordertype) {
			if (undefined != H_view.order.machine) {
				this.get_Smarty().assign("H_merge", array_merge(H_view.order.machine, H_view.order.acce));
			} else {
				this.get_Smarty().assign("H_merge", H_view.order.acce);
			}
		} else {
			this.get_Smarty().assign("H_merge", H_view.order.blp);
		}

		var errcnt = H_view.err.length;
		this.get_Smarty().assign("user_auth", H_view.user_auth);

		if ("exec" == H_view.upflg.flg) {
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8:\u30B5\u30D6\u72B6\u614B\u66F4\u65B0");
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("errcnt", errcnt);
			this.get_Smarty().assign("message", "\u53D7\u6CE8\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("backurl", "./order_detail.php#jp_stat");
			this.get_Smarty().assign("printflg", "output");
			this.get_Smarty().display("update_finish.tpl");
		} else if ("part" == H_view.upflg.flg) {
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8:\u30B5\u30D6\u72B6\u614B\u66F4\u65B0");
			this.get_Smarty().assign("errmsg", "\u4EE5\u4E0B\u306E\u53D7\u6CE8\u60C5\u5831\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("errcnt", errcnt);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("backurl", "./order_detail.php#jp_stat");
			this.get_Smarty().display("update_finish.tpl");
		} else if ("fail" == H_view.upflg.flg) {
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8:\u30B5\u30D6\u72B6\u614B\u66F4\u65B0");
			this.get_Smarty().assign("errmsg", "\u4EE5\u4E0B\u306E\u53D7\u6CE8\u60C5\u5831\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("errcnt", errcnt);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("backurl", "./order_detail.php#jp_stat");
			this.get_Smarty().display("update_finish.tpl");
		} else {
			this.get_Smarty().assign("O_form", O_renderer.toArray());
			this.get_Smarty().assign("type", H_view.order.order.ordertype);
			this.get_Smarty().assign("H_order", H_view.order.order);
			this.get_Smarty().assign("H_sub", H_view.order.sub);
			this.get_Smarty().assign("sum_telno", H_view.sum_tel);
			this.get_Smarty().assign("sum_stat", H_view.sum_stat);
			this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
			this.get_Smarty().assign("H_err", H_view.errmsg);
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};