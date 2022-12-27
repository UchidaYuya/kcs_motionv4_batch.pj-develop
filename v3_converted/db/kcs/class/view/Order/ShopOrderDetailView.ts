//
//受注用Viewのクラス
//
//更新履歴：<br>
//2008/06/30 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//受注用Viewのクラス
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("OrderUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderDetailViewBase.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
//
//ページ個別のCGIparamチェック
//
//@author igarashi
//@since 2008/07/23
//
//@return none
//
//
//在庫減算の対象配列をSESSIONに入れる
//同じ文を2カ所に書きたくなかっただけ
//
//@author igarashi
//@since 2008/09/02
//
//@access private
//@return none
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
//入力フォームを作成する
//
// @author igarashi
// @since 2008/07/15
//
// @param $subcnt(表示するオーダーに含まれるsubの件数)
// @access public
// @return none
//
//quickFormのルールを設定する<br>
//受注詳細用
//
//@author igarashi
//@since 2008/09/03
//
//@access public
//@return none
//
//
//k76納品日メール<br>
//受注詳細用
//
//@author igarashi
//@since 2015/02/18
//
//@access public
//@return none
//
//
//_で連結されたordersubidとdetail_sortを切り離して配列に入れて返す
//
//@author igarashi
//@since 2008/09/02
//
//@param $key(orderidとsortがくっついた文字列)
//
//@access protected
//@return array
//
//
//viewPrintButton
//
//@author igarashi
//@since 2011/12/21
//
//@access public
//@return void
//
//
//viewPrintDeliveryButton
//
//@author date
//@since 2014/09/22
//
//@access public
//@return void
//
//
//getSub
//
//@author date
//@since 2014/09/22
//
//@access public
//@return array
//
//
//Smarty表示
//
//@author igarashi
//@since 2008/07/16
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
class ShopOrderDetailView extends ShopOrderDetailViewBase {
	static INI_NAME = "order_by_category";

	constructor(H_param = Array()) {
		super(H_param);
		this.O_Set.loadConfig("subtract_point_from_subtotal");
		this.carrior_list = this.O_Set.A_carrior_list;
	}

	registSubtractPointFromSubtotal(carid) {
		var m = this.carrior_list.length;
		this.get_Smarty().assign("subtract_point_from_subtotal", false);

		if (m > 0) {
			for (var i = 0; i < m; i++) {
				carrior_list[i] = +this.carrior_list[i];
			}

			if (-1 !== carrior_list.indexOf(carid)) {
				this.get_Smarty().assign("subtract_point_from_subtotal", true);
			}
		}
	}

	checkCGIParamPeculiar() //改番
	{
		var sess = this.getLocalSession();
		var A_upcol = ["termprice", "pay_monthly_sum", "pay_point", "comment", "slipno", "message", "endmail", "status", "settlement", "pay_frequency", "area", "allproc", "registup", "contractup", "endsel", "expectup", "allreserve"];
		var A_stock = this.O_order.A_empty;

		for (var key in _POST) //サブ単位で処理するよう指定されたものを取得する
		{
			var val = _POST[key];

			if (true == ereg("stock[0-9]_[0-9]", key)) {
				var H_perge = this.pergeSubandSort(key);
				A_stock[H_perge.sort] = H_perge;
			}
		}

		if (!_POST == true) {
			this.clearKaiban();
		}

		if (true == (undefined !== _POST.confirm) && "" != _POST.confirm) {
			this.H_Local.confirm = _POST.confirm;
			this.setStockTarget(A_stock);
		}

		if (true == (undefined !== _POST.execsub) && "" != _POST.execsub) {
			this.H_Local.execsub = _POST.execsub;
			this.setStockTarget(A_stock);
		}

		if (true == (undefined !== _POST.endsel) && "specifies" == _POST.endsel) {
			if (true == (undefined !== _POST.deliverydate)) //k76 納品日の予定日確定日 20150303 date
				{
					this.H_Local.deliverydate = _POST.deliverydate;
					this.H_Local.deliverydate_type_all = _POST.deliverydate_type_all;
				}
		}

		if (true == (undefined !== _POST.deliverydate_type)) {
			this.H_Local.deliverydate_type = _POST.deliverydate_type;
		}

		if (true == (undefined !== _POST.expectup) && "desig" == _POST.expectup) {
			if (true == (undefined !== _POST.expectdate)) {
				this.H_Local.expectdate = _POST.expectdate;
			}
		}

		if (true == (undefined !== _POST.registup) && 1 == _POST.registup) {
			if (true == (undefined !== _POST.registdate)) {
				this.H_Local.registdate = _POST.registdate;
			}
		}

		if (true == (undefined !== _POST.contractup) && 1 == _POST.contractup) {
			if (true == (undefined !== _POST.contractdate)) {
				this.H_Local.contractdate = _POST.contractdate;
			}
		}

		if (true == (undefined !== _POST.billtotal)) {
			if (0 <= +_POST.billtotal) {
				this.H_Local.billtotal = +_POST.billtotal;
			} else {
				this.H_Local.billtotal = 0;
			}
		}

		if (true == (undefined !== _POST.billtotal2)) {
			if (0 <= +_POST.billtotal2) {
				this.H_Local.billtotal2 = +_POST.billtotal2;
			} else {
				this.H_Local.billtotal2 = 0;
			}
		}

		if (true == (undefined !== _POST.billsubtotal)) {
			this.H_Local.billsubtotal = +_POST.billsubtotal;
		}

		if (true == (undefined !== _POST.inputtel)) {
			this.H_Local.inputtel = _POST.inputtel;
		}

		if ("dummy" != _POST.smarttypehidden) {
			this.H_Local.smarttypehidden = _POST.smarttypehidden;
		} else {
			if (!(undefined !== this.H_Local.smarttypehidden)) {
				this.H_Local.smarttypehidden = "";
			}
		}

		if (undefined !== _POST.pagename) {
			this.H_Local.pagename = _POST.pagename;
		} else {
			this.H_Local.pagename = "";
		}

		if (undefined !== _POST.send_deliverydate) {
			this.H_Local.send_deliverydate = _POST.send_deliverydate;
		} else {
			if (undefined !== sess.SELF.send_deliverydate) {
				this.H_Local.send_deliverydate = sess.SELF.send_deliverydate;
			} else {
				this.H_Local.send_deliverydate = "false";
			}
		}

		if (undefined !== _POST.kaiban) {
			this.H_Local.kaiban = _POST.kaiban;
			this.H_Dir.kaiban[_POST.kaiban] = true;
		}

		if (undefined !== _POST.kaiban_delete) {
			this.H_Local.kaiban_delete = _POST.kaiban_delete;
			delete this.H_Dir.kaiban[_POST.kaiban_delete];
		}

		if (true == (undefined !== _POST.phone_management_leave) && _POST.phone_management_leave == 1) {
			this.H_Local.phone_management_leave = true;
		} else {
			this.H_Local.phone_management_leave = false;
		}

		if (0 < _POST.length) {
			for (var key in _POST) {
				var val = _POST[key];
				var num = key.replace(/[^0-9]/g, "");

				if (true == (-1 !== A_upcol.indexOf(key))) {
					this.H_Local[key] = val;
				} else if (true == ereg("price[0-9]", key)) {
					this.H_Local.price[num] = val.trim();
				} else if (true == ereg("^point[0-9]", key)) {
					this.H_Local.point[num] = val.trim();
				} else if (true == ereg("expoint[0-9]", key)) {
					this.H_Local.expoint[num] = val.trim();
				} else if (true == ereg("telno[0-9]", key)) {
					this.H_Local.telno[num] = val.trim();
				} else if (true == ereg("serial[0-9]", key)) {
					this.H_Local.serial[num] = val.trim();
				} else if (true == ereg("simno[0-9]", key)) {
					this.H_Local.simno[num] = val.trim();
				} else if (true == ereg("pay_startdate[0-9]", key)) {
					this.H_Local.pay_startdate[num] = val;
				} else if (true == ereg("area[0-9]", key)) {
					this.H_Local.area[num] = val;
				} else if (true == preg_match("/text[0-9]|int[0-9]|mail[0-9]|url[0-9]|date[0-9]|select[0-9]/", key)) {
					var start = strrpos(key, "_");
					this.H_Local.telproperty[key.substr(0, start)][key.substr(start + 1, key.length)] = val;
				} else if (true == ereg("extensionno[0-9]", key)) {
					this.H_Local.extensionno[num] = val;
				}
			}
		}
	}

	clearKaiban() {
		delete this.H_Dir.kaiban;
		this.O_Sess.setPub(ShopOrderDetailView.PUB, this.H_Dir);
	}

	setStockTarget(A_stock) //在庫計算の対象を取得
	{
		if (0 < A_stock.length) {
			this.H_Local.stock = A_stock;
		}
	}

	makePankuzuLinkHash() {
		if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
			var H_link = {
				"/Shop/MTOrder/rapid.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u53D7\u6CE8\u8A73\u7D30"
			};
		} else if (this.O_Sess.docomo_only == true) {
			H_link = {
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"": "\u53D7\u6CE8\u8A73\u7D30"
			};
		} else {
			H_link = {
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"": "\u53D7\u6CE8\u8A73\u7D30"
			};
		}

		return H_link;
	}

	makeShopOrderDetailForm(H_sess, H_info, shopid, H_date) //ラジオボタンの改行を指定しておく
	//$O_order = new OrderUtil();
	//文字サイズ変えてみる
	//改行したい
	//ポイントがNULLの場合があるので、0いれとく
	//AUは36回払いが選べる
	//ドコモも36回行けるようになったよ(´・ω・`)
	//k90 「受注完了メール送信グレーアウト」会社権限追加 hanashima 20201118
	//K76 納品日メール date 20150128
	//s209 解約、名義変更でも表示されるようにしたい 20160602伊達
	//detail_register
	{
		var H_sub = this.getSub(H_info);
		var H_dateopt = {
			language: "ja",
			minYear: "1900",
			maxYear: "2100",
			format: "Y\u5E74m\u6708d\u65E5h\u6642"
		};
		var ordertype = H_info.order.order.ordertype;
		var H_radio = {
			after: ["\u672A\u5B9A", {
				id: "selnot",
				onClick: "disableDeliveryDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			specifies: ["\u6307\u5B9A\u3059\u308B", {
				id: "selspec",
				onClick: "disableDeliveryDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}]
		};
		var H_exradio = {
			undecid: ["\u672A\u5B9A", {
				id: "expnot",
				onClick: "disableExpectDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}],
			desig: ["\u6307\u5B9A\u3059\u308B", {
				id: "expspec",
				onClick: "disableExpectDate(\"" + H_date.y + "\", \"" + H_date.m + "\", \"" + H_date.d + "\")"
			}]
		};
		var H_stctag = {
			reserve: ["\u5168\u3066\u53D6\u7F6E<br>", {
				id: "allres"
			}],
			regular: ["\u5168\u3066\u901A\u5E38<br>", {
				id: "allreg"
			}],
			stcindi: ["\u500B\u5225\u306B\u5F93\u3046", {
				id: "allind"
			}]
		};

		if (this.O_order.type_acc != H_info.order.order.ordertype && false == (-1 !== this.O_order.A_plancourse.indexOf(H_info.order.order.ordertype))) {
			var mode = "all";
		} else {
			mode = "part";
		}

		{
			let _tmp_0 = H_info.status;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];
				H_info.status[key][0] = "<span style=\"font-size:12px\">" + val[0] + "</span>";
			}
		}
		H_info.status[170][0] += "<br>";

		require("model/SmartCircuitModel.php");

		var O_smart = new SmartCircuitModel();

		if (!H_info.order.order.point) {
			var order_point = 0;
		} else {
			order_point = H_info.order.order.point;
		}

		if (-1 !== [1, 3].indexOf(H_info.order.order.carid)) {
			var pay_count_data = {
				"1": "\u5272\u8CE6\u306A\u3057(\u4E00\u62EC\u652F\u6255\u3044)",
				"12": "12\u56DE",
				"24": "24\u56DE",
				"36": "36\u56DE"
			};
		} else {
			pay_count_data = {
				"1": "\u5272\u8CE6\u306A\u3057(\u4E00\u62EC\u652F\u6255\u3044)",
				"12": "12\u56DE",
				"24": "24\u56DE"
			};
		}

		var A_form = [{
			name: "memoedit",
			label: "\u304A\u5BA2\u69D8\u60C5\u5831\u3092\u7DE8\u96C6\u3059\u308B",
			inputtype: "submit",
			options: {
				action: "./edit_userinfo.php"
			}
		}, {
			name: "cancel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "submit"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "submit"
		}, {
			name: "confirm",
			label: "\u78BA\u8A8D",
			inputtype: "button",
			options: {
				id: "confirm",
				onClick: "fwdOrderDetail(1, \"" + ordertype + "\")"
			}
		}, {
			name: "execsub",
			label: "\u66F4\u65B0",
			inputtype: "button",
			options: {
				id: "execsub",
				onClick: "fwdOrderDetail(2, \"" + ordertype + "\")"
			}
		}, {
			name: "return",
			label: "\u623B\u308B",
			inputtype: "submit"
		}, {
			name: "calc",
			label: "\u8A08\u7B97",
			inputtype: "button",
			options: {
				onClick: "calcRegister(" + H_info.linecnt + ", " + H_info.flg.taxflg + ", " + H_info.order.order.carid + ")"
			}
		}, {
			name: "set_point",
			label: "\u30DD\u30A4\u30F3\u30C8\u53CD\u6620",
			inputtype: "button",
			options: {
				onClick: "setPoint('" + H_info.order.order.pointradio + "', " + order_point + "," + H_info.linecnt + ", " + H_info.flg.taxflg + ", " + H_info.order.order.carid + ")"
			}
		}, {
			name: "termprice",
			label: "\u7AEF\u672B\u4EE3\u91D1",
			inputtype: "text",
			options: {
				maxlength: "8"
			}
		}, {
			name: "pay_monthly_sum",
			label: "\u5272\u8CE6\u6708\u984D",
			inputtype: "text",
			options: {
				size: "7",
				maxlength: "8"
			}
		}, {
			name: "pay_point",
			label: "\u5272\u8CE6\u3054\u5229\u7528\u30DD\u30A4\u30F3\u30C8",
			inputtype: "text",
			options: {
				size: "7",
				id: "pay_point",
				maxlength: "8"
			}
		}, {
			name: "comment",
			label: "\u30B3\u30E1\u30F3\u30C8",
			inputtype: "textarea",
			options: {
				cols: 40,
				rows: 3
			}
		}, {
			name: "slipno",
			label: "\u9001\u308A\u72B6\u756A\u53F7",
			inputtype: "text",
			options: {
				size: 45,
				maxlenth: "300"
			}
		}, {
			name: "message",
			label: "\u304A\u5BA2\u69D8\u3078\u306E\u4F1D\u8A00",
			inputtype: "textarea",
			options: {
				cols: 40,
				rows: 3
			}
		}, {
			name: "limit",
			label: "\u4EF6\u8868\u793A",
			inputtype: "text",
			options: {
				size: 4,
				maxlength: "3"
			}
		}, {
			name: "phone_management_leave",
			label: "\u96FB\u8A71\u7BA1\u7406\u306B\u6B8B\u3059",
			inputtype: "checkbox"
		}, {
			name: "allproc",
			label: "",
			inputtype: "checkbox",
			options: {
				onClick: "checkAllProcCtrl(\"execno\", \"" + mode + "\", \"" + H_view.istrans + "\")",
				id: "allproc"
			}
		}, {
			name: "registup",
			label: "\u96FB\u8A71\u7BA1\u7406\u306E\u8CFC\u5165\u65E5\u3092\u4E0A\u66F8\u304D\u3059\u308B",
			inputtype: "checkbox",
			options: {
				id: "registup",
				onClick: "disableRegistDate()"
			}
		}, {
			name: "contractup",
			label: "\u96FB\u8A71\u7BA1\u7406\u306E\u5951\u7D04\u65E5\u3092\u4E0A\u66F8\u304D\u3059\u308B",
			inputtype: "checkbox",
			options: {
				id: "contractup",
				onClick: "disableContractDate()"
			}
		}, {
			name: "allreserve",
			label: "",
			inputtype: "radio",
			data: H_stctag
		}, {
			name: "status",
			label: "\u30B9\u30C6\u30FC\u30BF\u30B9",
			inputtype: "radio",
			data: H_info.status,
			options: {
				id: "status"
			}
		}, {
			name: "settlement",
			label: "\u6C7A\u6E08\u65B9\u6CD5",
			inputtype: "radio",
			data: H_info.settlement,
			options: {
				id: "settlement"
			}
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
			name: "pay_frequency",
			label: "",
			inputtype: "select",
			data: pay_count_data
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
			name: "smarttype",
			label: "\u7AEF\u672B\u7A2E\u5225",
			inputtype: "select",
			data: {
				"": "\u9078\u629E\u306A\u3057"
			} + O_smart.getSmartCircuitKeyHash(),
			options: {
				id: "smarttype",
				onChange: "setSmartType()"
			}
		}, {
			name: "csrfid",
			inputtype: "hidden"
		}];

		if (-1 !== H_info.user_auth.indexOf("fnc_order_finish_mail_gray_out")) {
			A_form.push({
				name: "endmail",
				label: "\u53D7\u6CE8\u5B8C\u4E86\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3059\u308B",
				inputtype: "checkbox",
				options: ["disabled"]
			});
		} else {
			A_form.push({
				name: "endmail",
				label: "\u53D7\u6CE8\u5B8C\u4E86\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3059\u308B",
				inputtype: "checkbox"
			});
		}

		var A_form_deliverydate_type = Array();
		var deliverydate_type_select = {
			"0": "\u672A\u5B9A",
			"1": "\u4E88\u5B9A\u65E5",
			"2": "\u51FA\u8377\u5B8C\u4E86"
		};
		A_form_deliverydate_type.push({
			name: "deliverydate_type_all",
			label: "\u3066\u3059\u3068",
			inputtype: "select",
			data: deliverydate_type_select
		});

		if (!!H_sub) {
			for (var H_it of Object.values(H_sub)) //disable付けますか。
			{
				var disable = true;

				if (H_it.substatus == "230") //キャンセルの場合はdisable
					{
						disable = true;
					} else if (!!H_it.deliverydate) //キャンセルではない
					{
						if (H_it.deliverydate_type == 2) //確定日として登録されているのでdisable
							{
								disable = true;
							} else //選択なしor予定日なので選択可能
							{
								disable = false;
							}
					}

				var tmp = {
					name: "deliverydate_type[" + H_it.detail_sort + "]",
					inputtype: "select",
					data: deliverydate_type_select
				};

				if (disable == true) {
					tmp.options = {
						disabled: "true"
					};
				}

				A_form_deliverydate_type.push(tmp);
			}
		}

		var A_temp = this.O_order.A_empty;
		var A_opt = {
			size: "5",
			maxlength: "7"
		};
		var idx = loop = 0;
		var A_machinebuyview = this.O_order.A_machinebuyview;
		A_machinebuyview.push(this.O_order.type_mis);
		A_machinebuyview.push(this.O_order.type_del);
		A_machinebuyview.push(this.O_order.type_tpc);
		A_machinebuyview.push(this.O_order.type_tcp);
		A_machinebuyview.push(this.O_order.type_tcc);

		if (true == (-1 !== A_machinebuyview.indexOf(H_info.order.order.ordertype))) //
			//
			{
				{
					let _tmp_1 = H_info.order.machine;

					for (var key in _tmp_1) //価格・ポイント・税額を台数分
					{
						var val = _tmp_1[key];
						A_temp[idx] = {
							name: "price" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "price" + loop,
								maxlength: "6"
							}
						};
						A_temp[idx + 1] = {
							name: "point" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "point" + loop,
								maxlength: "6"
							}
						};
						A_temp[idx + 3] = {
							name: "expoint" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "expoint" + loop,
								maxlength: "6"
							}
						};

						if (true == (undefined !== H_info.order.transto.gif[key]) && undefined != H_info.order.transto.gif[key]) {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, true, true)`
								}
							};
						} else if (undefined == H_info.order.transto.gif[key] && undefined == H_info.order.order.transfer_type || H_info.order.order.shopid == shopid) {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, true, false)`
								}
							};
						} else {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, false, true)`
								}
							};
						}

						idx += 4;
						loop++;
					}
				}
				{
					let _tmp_2 = H_info.order.acce;

					for (var key in _tmp_2) //価格・ポイント・税額を台数分
					{
						var val = _tmp_2[key];
						A_temp[idx] = {
							name: "price" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "price" + loop,
								maxlength: "6"
							}
						};
						A_temp[idx + 1] = {
							name: "point" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "point" + loop,
								maxlength: "6"
							}
						};
						A_temp[idx + 3] = {
							name: "expoint" + loop,
							label: "dummy",
							inputtype: "text",
							options: A_opt + {
								id: "expoint" + loop,
								maxlength: "6"
							}
						};

						if (true == (undefined !== H_info.order.transto.gif[key]) && undefined != H_info.order.transto.gif[key]) {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, true, true)`
								}
							};
						} else if (undefined == H_info.order.transto.gif[key] && undefined == H_info.order.order.transfer_type || H_info.order.order.shopid == shopid) {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, true, false)`
								}
							};
						} else {
							A_temp[idx + 2] = {
								name: "regcheck" + loop,
								label: "dummy",
								inputtype: "checkbox",
								options: {
									id: "regcheck" + loop,
									onClick: `disableRegisterEdit(${loop}, false, true)`
								}
							};
						}

						idx += 4;
						loop++;
					}
				}
			}

		var A_deliveryprint = this.O_order.A_empty;
		loop = 0;

		if (true == (-1 !== A_machinebuyview.indexOf(H_info.order.order.ordertype))) {
			for (var H_it of Object.values(H_sub)) {
				loop = H_it.detail_sort;

				if (H_it.substatus == "230") //キャンセル
					{
						A_deliveryprint[loop] = {
							name: "deliveryprint_check" + loop,
							label: "dummy",
							inputtype: "checkbox",
							options: {
								id: "deliveryprint_check" + loop,
								disabled: "true"
							}
						};
					} else {
					A_deliveryprint[loop] = {
						name: "deliveryprint_check" + loop,
						label: "dummy",
						inputtype: "checkbox",
						options: {
							id: "deliveryprint_check" + loop
						}
					};
				}
			}

			loop++;
			A_deliveryprint[loop] = {
				name: "deliveryprint_check_all",
				label: "dummy",
				inputtype: "checkbox",
				options: {
					id: "deliveryprint_check_all",
					onClick: `checkDeliveryPrintAll(${loop})`
				}
			};
		}

		var kaiban_order_type = [this.O_order.type_new, this.O_order.type_mnp, this.O_order.type_chn, this.O_order.type_shi, this.O_order.type_mis];
		idx = 0;
		var A_indiv = this.O_order.A_empty;

		for (loop = 0;; loop < H_info.telline; loop++) //電話番号・製造番号・SIM番号・割賦開始月を台数分
		{
			if (this.O_order.st_sub_prcfin > H_info.order.machine[loop].substatus) {
				var substat = H_info.order.machine[loop].substatus;

				if (true == (-1 !== this.O_order.A_machinebuyview.indexOf(H_info.order.order.ordertype))) {
					if (true == (undefined !== H_info.order.transto.gif[loop]) && undefined != H_info.order.transto.gif[loop]) {
						A_indiv[idx] = {
							name: "indicheck" + loop,
							label: "",
							inputtype: "checkbox",
							options: {
								onClick: `disableIndivEdit(${loop}, true, '${ordertype}', ${substat}, true)`
							}
						};
					} else if (undefined == H_info.order.transto.gif && undefined == H_info.order.order.transfer_type || H_info.order.order.shopid == shopid) {
						A_indiv[idx] = {
							name: "indicheck" + loop,
							label: "",
							inputtype: "checkbox",
							options: {
								onClick: `disableIndivEdit(${loop}, true, '${ordertype}', ${substat}, false)`
							}
						};
					} else {
						A_indiv[idx] = {
							name: "indicheck" + loop,
							label: "",
							inputtype: "checkbox",
							options: {
								onClick: `disableIndivEdit(${loop}, false, '${ordertype}', ${substat}, true)`
							}
						};
					}
				}

				A_indiv[idx + 1] = {
					name: "telno" + loop,
					label: "",
					inputtype: "text",
					options: {
						maxlength: "15"
					}
				};
				A_indiv[idx + 2] = {
					name: "area" + loop,
					label: "",
					inputtype: "select",
					data: H_info.area
				};
				A_indiv[idx + 6] = {
					name: "extensionno" + loop,
					label: "",
					inputtype: "text",
					options: {
						maxlength: "15"
					}
				};
			}

			if (this.O_order.type_mnp == ordertype || this.O_order.type_new == ordertype || this.O_order.type_chn == ordertype || this.O_order.type_shi == ordertype || this.O_order.type_mis == ordertype) {
				A_indiv[idx + 3] = {
					name: "serial" + loop,
					label: "",
					inputtype: "text",
					options: {
						maxlength: "30"
					}
				};
				A_indiv[idx + 4] = {
					name: "simno" + loop,
					label: "",
					inputtype: "text",
					options: {
						maxlength: "32"
					}
				};
			}

			if (true == (-1 !== this.O_order.A_machinebuyview.indexOf(ordertype))) {
				A_indiv[idx + 5] = {
					name: "pay_startdate" + loop,
					label: "",
					inputtype: "date",
					data: this.O_order.getMonthFormat(20, 1)
				};
			}

			if (-1 !== kaiban_order_type.indexOf(ordertype)) {
				var tel_detail = H_info.order.machine[loop];
				var kaiban_input = this.H_Dir.kaiban[tel_detail.detail_sort];
				var kaiban_delete = false;
				var kaiban_enable = false;

				if (undefined !== kaiban_input == true && kaiban_input == true || is_null(tel_detail.kaiban_telno) == false) //改番ボタンが押されている、kaiban_telnoがNULLではない時、入力、取消しが行える
					{
						if (!A_indiv[idx + 1]) {
							A_indiv[idx + 1] = {
								name: "telno" + loop,
								label: "",
								inputtype: "text",
								options: {
									maxlength: "15"
								}
							};
						}

						kaiban_delete = true;
					} else //ステータスによりボタンのオンオフ決める
					{
						if (tel_detail.substatus < this.O_order.st_sub_prcfin) //新規
							{
								if (ordertype != this.O_order.type_new) {
									kaiban_enable = true;
								}
							} else {
							kaiban_enable = true;
						}
					}

				if (H_info.tel_regist[tel_detail.detail_sort] == 0) //この注文の電話番号は解約、または電話管理からの削除により存在しない
					{
						kaiban_enable = false;
					}

				if (kaiban_enable == true || kaiban_delete == true) //改番ボタンオンオフ
					{
						if (kaiban_enable) //改番ボタンオン
							{
								A_indiv[idx + 7] = {
									name: "kaiban" + loop,
									label: "\u6539\u756A",
									inputtype: "button",
									options: {
										id: "kaiban" + loop,
										onClick: "fwdKaiban(" + tel_detail.detail_sort + ")"
									}
								};
							} else //改番ボタンオフ
							{
								A_indiv[idx + 7] = {
									name: "kaiban" + loop,
									label: "\u6539\u756A",
									inputtype: "button",
									options: {
										id: "kaiban" + loop,
										onClick: "fwdKaiban(" + tel_detail.detail_sort + ")",
										0: "disabled"
									}
								};
							}

						if (kaiban_delete) //取消しボタンオン
							{
								A_indiv[idx + 8] = {
									name: "kaiban_delete" + loop,
									label: "\u53D6\u6D88",
									inputtype: "button",
									options: {
										id: "kaiban_delete" + loop,
										onClick: "fwdKaibanDelete(" + tel_detail.detail_sort + ")"
									}
								};
							} else //取消しボタンオフ
							{
								A_indiv[idx + 8] = {
									name: "kaiban_delete" + loop,
									label: "\u53D6\u6D88",
									inputtype: "button",
									options: {
										id: "kaiban_delete" + loop,
										onClick: "fwdKaibanDelete(" + tel_detail.detail_sort + ")",
										0: "disabled"
									}
								};
							}
					}
			}

			idx += 9;
		}

		var A_exec = this.O_order.A_empty;
		var H_merge = array_merge(H_info.order.machine, H_info.order.acce);

		for (var key in H_merge) {
			var val = H_merge[key];
			A_exec.push({
				name: "stock" + val.ordersubid + "_" + val.detail_sort,
				label: "",
				inputtype: "checkbox",
				options: {
					id: "stock[" + val.detail_sort + "]"
				}
			});
			var sort = val.detail_sort;
			var sub = val.ordersubid;
		}

		var A_prop = this.O_order.A_empty;

		if (true == (undefined !== H_info.property.data)) {
			{
				let _tmp_3 = H_info.property.data;

				for (var key in _tmp_3) {
					var val = _tmp_3[key];

					for (var ckey in val) {
						var cval = val[ckey];

						if (true == preg_match("/^text|^int|^url|^mail/", ckey)) {
							A_prop.push({
								name: key + "_" + ckey,
								label: H_info.property.colname[ckey],
								inputtype: "text"
							});
						} else if (true == preg_match("/^select/", ckey)) //20141121プルダウン追加
							//書式は「title:item1,item2,item3」
							//titleの部分
							//itemの部分
							{
								var temp = H_info.property.colname[ckey].split(":");
								var itemname = temp[0];
								temp = temp[1].split(",");
								var selectval = Array();

								if (!is_null(H_info.property.data[key])) {
									var select = H_info.property.data[key][ckey];

									if (!(-1 !== temp.indexOf(select))) {
										selectval[select] = select;
									}
								}

								selectval[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";

								for (var k in temp) {
									var v = temp[k];
									selectval[v] = v;
								}

								A_prop.push({
									name: key + "_" + ckey,
									label: itemname,
									inputtype: "select",
									data: selectval
								});
							} else {
							A_prop.push({
								name: key + "_" + ckey,
								label: H_info.property.colname[ckey],
								inputtype: "date",
								data: this.O_order.getDateFormat(undefined, 11)
							});
						}
					}
				}
			}
		}

		A_form = array_merge(A_form, A_temp, A_indiv, A_exec, A_prop, A_deliveryprint, A_form_deliverydate_type);
		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
	}

	setFormRule(H_sess, H_view, H_prop) //端末と付属品をくっつける
	//出荷済み以降のみ制限
	//電話管理ユーザー拡張項目
	{
		this.H_view.FormUtil.addRuleWrapper("termprice", "\u7AEF\u672B\u4EE3\u91D1\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
		this.H_view.FormUtil.addRuleWrapper("pay_monthly_sum", "\u5272\u8CE6\u6708\u984D\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
		this.H_view.FormUtil.addRuleWrapper("pay_point", "\u5272\u8CE6\u4F7F\u7528\u30DD\u30A4\u30F3\u30C8\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");

		if (0 < H_view.machine.length) {
			if (0 < H_view.acce.length) //端末と付属品の同時注文
				{
					var H_order = array_merge(H_view.machine, H_view.acce);
				} else //端末だけならこっち
				{
					H_order = H_view.machine;
				}
		} else //端末がないなら付属品だけ
			{
				H_order = H_view.acce;
			}

		var status_check = +(H_sess.status >= this.O_order.st_sub_prcfin) && +(H_sess.status <= this.O_order.st_complete);

		if (0 < H_view.machine.length) {
			for (var val of Object.values(H_view.machine)) {
				if (this.O_order.type_new == H_view.order.ordertype && status_check == true || undefined !== val.telno == true && status_check && +(val.substatus >= this.O_order.st_sub_prcfin) && +(val.substatus <= this.O_order.st_complete)) {
					if (true == val.machineflg) {
						this.H_view.FormUtil.addRuleWrapper("telno" + val.detail_sort, "\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
						this.H_view.FormUtil.addRuleWrapper("telno" + val.detail_sort, "\u96FB\u8A71\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u8A18\u53F7\u306E\u307F\u3067\u3059", "regex", "/^[A-Za-z0-9\\!\\#$\\%\\&\\(\\)\\-\\=\\^\\~\\|\\@\\`\\[\\{\\+\\*\\]\\}\\,\\<\\.\\>\\/\\?\\_\\s]+$/", "client");
					}
				}
			}
		}

		if (status_check == true) {
			if (true == (-1 !== this.O_order.A_machinebuyview.indexOf(H_view.order.ordertype))) {
				this.H_view.FormUtil.addRuleWrapper("termprice", "\u7AEF\u672B\u4EE3\u91D1\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
			}
		}

		for (var val of Object.values(H_order)) {
			this.H_view.FormUtil.addRuleWrapper("price" + val.detail_sort, "\u4FA1\u683C\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
			this.H_view.FormUtil.addRuleWrapper("point" + val.detail_sort, "\u30DD\u30A4\u30F3\u30C8\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
			this.H_view.FormUtil.addRuleWrapper("expoint" + val.detail_sort, "\u30DD\u30A4\u30F3\u30C8\uFF08\u7A0E\u8FBC\u307F\uFF09\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
			this.H_view.FormUtil.addRuleWrapper("serial" + val.detail_sort, "\u88FD\u9020\u756A\u53F7\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "regex", "/^[0-9\\a-z\\A-Z\\-]+$/", "client");
		}

		if (true == (undefined !== H_prop.data)) {
			{
				let _tmp_4 = H_prop.data;

				for (var key in _tmp_4) {
					var val = _tmp_4[key];

					for (var ckey in val) {
						var cval = val[ckey];

						if (true == preg_match("/^int/", ckey)) {
							this.H_view.FormUtil.addRuleWrapper(key + "_" + ckey, "\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "numeric", undefined, "client");
						} else if (true == preg_match("/^mail/", ckey)) {
							this.H_view.FormUtil.addRuleWrapper(key + "_" + ckey, "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "email", undefined, "client");
						} else if (true == preg_match("/^date/", ckey)) {
							this.H_view.FormUtil.addRuleWrapper(key + "_" + ckey, "\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u66F4\u65B0\u306F\u3067\u304D\u307E\u305B\u3093", "QRCheckdate", undefined, "client");
						} else if (true == preg_match("/^url/", ckey)) {
							var format = "/^(file|ldap|http|https|ftp):\\/\\/(([-a-z0-9])+\\.)+([a-z]{2,6}|([a-z\\/]+[a-z\\/]{2,6}))$/";
							this.H_view.FormUtil.addRuleWrapper(key + "_" + ckey, "URL\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "regex", format, undefined, "client");
						}
					}
				}
			}
		}
	}

	setFormRuleByRecvDeliveryMail(H_sess, H_view, rule_options) //$this->H_view["FormUtil"]->addRuleWrapper( "deliverydate_type", "このユーザーはメールが設定されていません。", "QRRecvDeliveryMail_1", $rule_options, "client");
	//$this->H_view["FormUtil"]->addRuleWrapper( "deliverydate_type", "このユーザーは販売店からのメールを受取る設定にされていません。", "QRRecvDeliveryMail_2", $rule_options, "client");
	{}

	pergeSubandSort(key) {
		var temp = key.replace(/[a-z]/g, "");
		var pos = strpos(temp, "_");
		var subid = temp.substr(0, pos);
		var sort = strstr(temp, "_").replace(/_/g, "");
		return {
			subid: subid,
			sort: sort
		};
	}

	viewPrintButton() {
		this.get_Smarty().assign("printButton", true);
	}

	viewPrintDeliveryButton(H_view) {
		var H_sub = this.getSub(H_view);
		var temp = Array();
		var loop = 0;

		for (var H_it of Object.values(H_sub)) {
			loop = H_it.detail_sort;
			var product_name = H_view.order.order.carname + " ";

			if ("M" != detail.ordertype) {
				product_name += H_it.productname;

				if (true == H_it.machineflg) {
					product_name += "(" + H_it.property + ")";
				}
			} else {
				product_name += "\u305D\u306E\u4ED6\u3054\u6CE8\u6587";
			}

			var names_max_length = 46;
			var length = mb_strwidth(product_name, "UTF-8");

			if (length <= names_max_length) {
				temp[loop] = 1;
			} else {
				temp[loop] = +(length / names_max_length);

				if (length % names_max_length > 0) {
					temp[loop]++;
				}
			}
		}

		this.get_Smarty().assign("printProductnameLines", temp);
		this.get_Smarty().assign("printDeliveryButton", true);
	}

	getSub(H_view) //一括プラン変更はこっち
	{
		if (this.O_order.type_blp == H_view.order.order.ordertype) {
			return H_view.order.blp;
		} else if (undefined != H_view.order.machine) {
			return array_merge(H_view.order.machine, H_view.order.acce);
		} else {
			return H_view.order.acce;
		}

		return undefined;
	}

	displaySmarty(H_g_sess, H_sess, H_view) //$this->get_Smarty()->assign("tax", $H_view["excisetax"]);
	//$this->get_Smarty()->assign("shop_name", $H_g_sess["shopname"]);
	//2014-09-05
	//戻り先
	//更新処理成功
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("title", "\u53D7\u6CE8\u8A73\u7D30");
		this.get_Smarty().assign("tax", MtTax.getTaxRate());
		this.get_Smarty().assign("taxflg", H_view.flg.taxflg);
		this.get_Smarty().assign("linecnt", H_view.linecnt);
		this.get_Smarty().assign("shop_person", H_g_sess.shopname + " " + H_g_sess.personname);
		this.get_Smarty().assign("sum_tel", H_view.sum_tel);
		this.get_Smarty().assign("sum_tel_only", H_view.sum_tel_only);
		this.get_Smarty().assign("sum_stat", H_view.sum_stat);
		this.get_Smarty().assign("sum_comment", H_view.sum_comment);
		this.get_Smarty().assign("hidden_orderid", H_view.order.order.orderid);

		if (!!H_sess.SELF.smarttypehidden || "0" == H_sess.SELF.smarttypehidden) {
			this.get_Smarty().assign("smarttype", H_sess.SELF.smarttypehidden);
		} else {
			this.get_Smarty().assign("smarttype", "dummy");
		}

		this.get_Smarty().assign("smarttypename", H_view.smarttypename);
		this.get_Smarty().assign("smarttypeedit", H_view.smarttypeedit);
		this.get_Smarty().assign("saleprice_errorflag", H_view.saleprice_errorflag);
		var backurl = "./order_detail.php?o=" + H_view.order.order.orderid;

		if ("exec" == H_view.upflg.flg) {
			this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
			this.get_Smarty().assign("backurl", backurl);
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("message", "\u53D7\u6CE8\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8\u8A73\u7D30");
			this.get_Smarty().assign("printflg", "output");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().display("update_finish.tpl");
		} else if ("part" == H_view.upflg.flg) {
			this.get_Smarty().assign("backurl", backurl);
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("errmsg", "\u53D7\u6CE8\u60C5\u5831\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8\u8A73\u7D30");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().display("update_finish.tpl");
		} else if ("fail" == H_view.upflg.flg) {
			this.get_Smarty().assign("backurl", backurl);
			this.get_Smarty().assign("bgcolor", "aquamarine");
			this.get_Smarty().assign("errmsg", "\u53D7\u6CE8\u60C5\u5831\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			this.get_Smarty().assign("pagename", "\u53D7\u6CE8\u8A73\u7D30");
			this.get_Smarty().assign("errcnt", H_view.err.length);
			this.get_Smarty().assign("H_err", H_view.err);
			this.get_Smarty().assign("misscnt", H_view.upflg.err.length);
			this.get_Smarty().assign("H_miss", H_view.upflg.err);
			this.get_Smarty().display("update_finish.tpl");
		} else //assaign
			//一括プラン変更はこっち
			//電話番号別表示の有無。一括プラン変更は表示しない。smartphoneの付属品は表示しない
			//$this->get_Smarty()->assign("H_check", array_keys($H_view["order"]["transto"]["gif"]));
			//K76 納品日メール 伊達 20150128
			//改番するかどうか
			//警告日
			{
				var a = MtSetting.singleton();

				if (undefined !== _SESSION["/Shop/MTOrder/rapid"]) {
					this.get_Smarty().assign("backurl", "rapid.php");
				}

				try {
					a.loadConfig(ShopOrderDetailView.INI_NAME);
					this.get_Smarty().assign("division", true);
				} catch (e) {
					this.get_Smarty().assign("division", false);
				}

				if ("M" == H_view.order.order.pacttype) {
					this.get_Smarty().assign("showflg", true);
				} else {
					this.get_Smarty().assign("showflg", false);
				}

				if (this.O_order.type_blp == H_view.order.order.ordertype) {
					var H_sub = H_view.order.blp;
				} else if (undefined != H_view.order.machine) {
					H_sub = array_merge(H_view.order.machine, H_view.order.acce);
				} else {
					H_sub = H_view.order.acce;
				}

				this.get_Smarty().assign("H_sub", H_sub);
				var showmacinfo = true;

				if (this.O_order.type_acc == H_view.order.order.ordertype || this.O_order.type_blp == H_view.order.order.ordertype) {
					showmacinfo = false;
				}

				var showextension = H_view.showextension;

				if (this.O_order.type_blp == H_view.order.order.ordertype) {
					showextension = false;
				}

				if (is_numeric(H_view.order.order.telcnt) && 0 < H_view.order.order.telcnt) {
					this.get_Smarty().assign("extensionloop", H_view.order.order.telcnt);
				} else {
					this.get_Smarty().assign("extensionloop", 1);
				}

				this.get_Smarty().assign("H_transhop", H_view.transhop);
				this.get_Smarty().assign("showmacinfo", showmacinfo);
				this.get_Smarty().assign("showextension", showextension);
				this.get_Smarty().assign("showfjp", H_view.showfjp);
				this.get_Smarty().assign("extensionArray", H_view.extensionno);
				this.get_Smarty().assign("H_shoplist", H_view.shoplist);
				this.get_Smarty().assign("postcode", H_view.postcode);
				this.get_Smarty().assign("H_order", H_view.order.order);
				this.get_Smarty().assign("H_transto", H_view.order.transto.gif);
				this.get_Smarty().assign("H_transfrom", H_view.order.transfrom.gif);
				this.get_Smarty().assign("H_option", H_view.order.option);
				this.get_Smarty().assign("H_waribiki", H_view.order.waribiki);
				this.get_Smarty().assign("H_service", H_view.order.service);
				this.get_Smarty().assign("optcnt", H_view.order.option.length);
				this.get_Smarty().assign("H_discnt", H_view.order.discnt);
				this.get_Smarty().assign("H_machine", H_view.order.machine);
				this.get_Smarty().assign("H_acc", H_view.order.acce);
				this.get_Smarty().assign("H_regist", H_view.order.regist);
				this.get_Smarty().assign("count", H_view.count);
				this.get_Smarty().assign("pntrate", H_view.pnt_rate);
				this.get_Smarty().assign("mac_num", H_view.mac_num);
				this.get_Smarty().assign("H_user", H_view.order.user);
				this.get_Smarty().assign("H_distel", H_view.discounttel);
				this.get_Smarty().assign("shopid", H_g_sess.shopid);
				this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
				this.get_Smarty().assign("H_hist", H_view.history);
				this.get_Smarty().assign("histcnt", H_view.history.length);
				this.get_Smarty().assign("statusflg", H_view.statusview);
				this.get_Smarty().assign("H_err", H_view.errmsg);
				this.get_Smarty().assign("receipt", H_view.order.order.receipt);
				this.get_Smarty().assign("H_property", H_view.property);
				this.get_Smarty().assign("H_managedate", H_view.orderdate);
				this.get_Smarty().assign("istrans", H_view.istrans);
				this.get_Smarty().assign("H_area", H_view.area);
				this.get_Smarty().assign("telexists", H_view.exists);
				this.get_Smarty().assign("billView", this.billView.assignBillView());
				this.get_Smarty().assign("lang", this.billView.getLangLists());
				this.get_Smarty().assign("kaiban_input", this.H_Dir.kaiban);
				this.get_Smarty().assign("tel_regist", this.H_view.tel_regist);
				this.get_Smarty().assign("user_auth", H_view.user_auth);

				if (-1 !== H_view.user_auth.indexOf("fnc_recv_delivery_mail")) {
					if (undefined !== H_sess.SELF.send_deliverydate) {
						this.get_Smarty().assign("send_deliverydate", H_sess.SELF.send_deliverydate);
					}

					var send_deliverydate_enable = "false";

					for (var key in H_sub) //送信されていますか
					{
						var value = H_sub[key];

						if (value.deliverydate_type == 2) {
							if (value.send_deliverydate_flg == false) {
								send_deliverydate_enable = "true";
							}
						} else {
							send_deliverydate_enable = "true";
						}
					}

					this.get_Smarty().assign("send_deliverydate_enable", send_deliverydate_enable);
				} else {
					this.get_Smarty().assign("send_deliverydate_enable", "false");
				}

				var kaiban_order_type = [this.O_order.type_new, this.O_order.type_mnp, this.O_order.type_chn, this.O_order.type_shi, this.O_order.type_mis];

				if (-1 !== kaiban_order_type.indexOf(H_view.order.order.ordertype)) {
					this.get_Smarty().assign("kaiban_order", "true");
				} else {
					this.get_Smarty().assign("kaiban_order", "false");
				}

				this.get_Smarty().assign("shop_expectdate_alart", this.O_Set.shop_expectdate_alart);
				this.get_Smarty().display(this.getDefaultTemplate());
			}
	}

	__destruct() {
		super.__destruct();
	}

};