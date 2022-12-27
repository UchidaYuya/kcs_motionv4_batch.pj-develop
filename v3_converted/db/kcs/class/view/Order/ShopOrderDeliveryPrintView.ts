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
//TCPDFの読み込み
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

require("view/Order/ShopOrderDetailViewBase.php");

require("tcpdf/config/lang/jpn.php");

require("tcpdf/tcpdf.php");

//発行日を入れる
//注文番号いれる(このフラグがない場合、伝票番号と記載する)
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
//getSubtractPointFromSubtotal
//
//@author web
//@since 2018/12/20
//
//@param mixed $carid
//@access public
//@return void
//
//
//checkCGIParam
//初期値とか決めるよ
//@author web
//@since 2018/12/20
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
//Smarty表示
//
//@author igarashi
//@since 2008/07/16
//
//@access public
//@return none
//
//
//makeHtmlForTitleFooter
//タイトルとふったーを取得する
//@author web
//@since 2018/12/19
//
//@param mixed $type
//@param mixed $slipno
//@access protected
//@return void
//
//
//makeHtmlForShop
//ショップ情報
//@author web
//@since 2018/12/19
//
//@param mixed $shop_info
//@access protected
//@return void
//
//
//makeHtmlForBill
//
//@author web
//@since 2018/12/19
//
//@param mixed $shop_info
//@access protected
//@return void
//
//
//writePDF_Delivery
//
//@author web
//@since 2018/12/19
//
//@param mixed $shop_info
//@param mixed $order
//@access protected
//@return void
//
//
//writePDF_Delivery
//
//@author web
//@since 2018/12/19
//
//@param mixed $shop_info
//@param mixed $order
//@access protected
//@return void
//
//
//outputPDF
//PDF出力
//@author web
//@since 2018/12/19
//
//@param mixed $shop_info
//@param mixed $order
//@access public
//@return void
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
class ShopOrderDeliveryPrintView extends ShopOrderDetailViewBase {
	static FLAG_DATE_OF_ISSUE = 1;
	static FLAG_ORDERID_OF_ORDER = 2;

	constructor(H_param = Array()) {
		super(H_param);
		this.O_Set.loadConfig("subtract_point_from_subtotal");
		this.carrior_list = this.O_Set.A_carrior_list;
	}

	getSubtractPointFromSubtotal(carid) {
		var m = this.carrior_list.length;

		if (m > 0) {
			for (var i = 0; i < m; i++) {
				carrior_list[i] = +this.carrior_list[i];
			}

			if (-1 !== carrior_list.indexOf(carid)) {
				return true;
			}
		}

		return false;
	}

	checkCGIParam() //$this->H_Local["groupid"] = 3;
	{
		if (is_null(this.H_Local)) {
			this.H_Local = Array();
		}

		if (undefined !== _POST.orderid) {
			this.H_Local.orderid = _POST.orderid;
		}

		if (undefined !== _POST.deliveryprint_check) {
			this.H_Local.print = _POST.deliveryprint_check.split(",");
		}

		this.H_Local.groupid = _SESSION.groupid;
		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderDeliveryPrintView.PUB, this.H_Dir);
	}

	checkCGIParamPeculiar() {}

	makeShopOrderDetailForm() //ラジオボタンの改行を指定しておく
	//グループIDで表示内容を決めよう
	//$A_form = array_merge($A_form, $A_deliveryprint);
	//デフォルト値の設定(groupidによっては、存在しない変数もあるがエラーにはならない(無視される))
	{
		var A_form = [{
			name: "submit",
			label: "\u5370\u5237",
			inputtype: "submit"
		}, {
			name: "cancel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "javascript:window.close()"
			}
		}];
		var item = {
			price_view: "\u91D1\u984D\u8868\u793A"
		};

		switch (this.H_Local.groupid) {
			case 1:
				item.delivery_view_2 = "\u7D0D\u54C1\u66F8";
				item.receipt_view_2 = "\u7D0D\u54C1\u66F8(\u63A7)\u517C \u53D7\u9818\u66F8";
				break;

			default:
				item.delivery_view = "\u7D0D\u54C1\u66F8";
				item.delivery_sub_view = "\u7D0D\u54C1\u66F8\u63A7\u3048";
				item.receipt_view = "\u53D7\u9818\u66F8";
				break;
		}

		for (var name in item) {
			var label = item[name];
			A_form.push({
				name: name,
				inputtype: "radio",
				options: {
					id: name
				},
				data: {
					yes: ["\u3059\u308B", {
						id: name + "_yes",
						lebel: "\u3059\u308B"
					}],
					no: ["\u3057\u306A\u3044", {
						id: name + "_no",
						label: "\u3057\u306A\u3044"
					}]
				}
			});
		}

		this.H_view.FormUtil = new QuickFormUtil("detailform");
		this.H_view.FormUtil.setFormElement(A_form);
		this.O_DetailForm = this.H_view.FormUtil.makeFormObject();
		this.H_view.FormUtil.setDefaultsWrapper({
			delivery_view: "yes"
		});
		this.H_view.FormUtil.setDefaultsWrapper({
			delivery_sub_view: "yes"
		});
		this.H_view.FormUtil.setDefaultsWrapper({
			receipt_view: "no"
		});
		this.H_view.FormUtil.setDefaultsWrapper({
			delivery_view_2: "yes"
		});
		this.H_view.FormUtil.setDefaultsWrapper({
			receipt_view_2: "yes"
		});
		this.H_view.FormUtil.setDefaultsWrapper({
			price_view: "no"
		});
	}

	setFormRule(H_sess, H_view, H_prop) {}

	displaySmarty() {
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("title", "\u7D0D\u54C1\u66F8\u6307\u793A\u753B\u9762");
		this.get_Smarty().assign("groupid", this.H_Local.groupid);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	makeHtmlForTitleFooter(type, slipno) {
		var res = {
			title: "",
			footer: ""
		};

		switch (type) {
			case "delivery":
				res.title = "\u7D0D  \u54C1  \u66F8";
				res.footer = "\u8CFC\u5165\u8A3C\u660E\u66F8\u3068\u3057\u3066\u3082\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u3059\u3002<br>" + "\u304A\u5BA2\u69D8\u6CE8\u6587\u756A\u53F7<br>" + "\u898B\u7A4D\u66F8\u756A\u53F7<br>";

				if (!!shop_info.slipno) {
					res.footer += "\u9001\u308A\u72B6:" + slipno + "<br>";
				}

				break;

			case "delivery_sub":
				res.title = "\u7D0D  \u54C1  \u66F8(\u63A7)";
				res.footer = "\u304A\u5BA2\u69D8\u6CE8\u6587\u756A\u53F7<br>" + "\u898B\u7A4D\u66F8\u756A\u53F7<br>";

				if (!!slipno) {
					res.footer += "\u9001\u308A\u72B6:" + slipno + "<br>";
				}

				break;

			case "receipt":
				res.title = "\u53D7  \u9818  \u66F8";
				res.footer = "\u4E0A\u8A18\u3001\u53D7\u9818\u3044\u305F\u3057\u307E\u3057\u305F\u3002\n\t\t\t\t\t\t<table border=\"1\" width=\"80\">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td align=\"centor\">\u53D7\u9818\u5370</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td height=\"50\"></td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>";
				break;

			case "delivery_2":
				res.title = "\u7D0D  \u54C1  \u66F8";
				break;

			case "receipt_2":
				res.title = "\u7D0D  \u54C1  \u66F8 (\u63A7)  \u517C  \u53D7  \u9818  \u66F8";
				break;
		}

		return res;
	}

	makeHtmlForDetails(carid, carname, ordertype, details) //内税か外税か
	//金額を表示するか否か
	//書き込んでいく
	{
		var res = {
			product_name: "",
			nums: "",
			price: "",
			price_2: ""
		};
		var in_tax = this.getSubtractPointFromSubtotal(carid);

		if (undefined !== _POST.price_view && _POST.price_view == "yes") {
			var price_view = true;
		} else {
			price_view = false;
		}

		for (var detail of Object.values(details)) //製品名を記述
		//製造番号
		//数量の改行
		////	金額
		//			if( $in_tax ){
		//				$value = MtTax::priceWithTax($detail["price"]) - $detail["shoppoint2"];
		//			} else {
		//				$value = MtTax::priceWithTax($detail["price"]) - $detail["shoppoint"];
		//			}
		{
			var br = 0;
			var temp = carname + " ";

			if ("M" != ordertype) {
				temp += detail.productname;

				if (true == detail.machineflg) {
					temp += "(" + detail.property + ")";
				}
			} else {
				temp += "\u305D\u306E\u4ED6\u3054\u6CE8\u6587";
			}

			var names_max_length = 46;
			var length = mb_strwidth(temp, "UTF-8");

			if (length <= names_max_length) {
				res.product_name += temp + "<br>";
				br = 1;
			} else {
				br = +(length / names_max_length);
				var products = Array();
				var cutstr1 = temp;
				var cutstr2 = "";

				for (var i = 0; i < br; i++) {
					cutstr2 = mb_strimwidth(cutstr1, 0, names_max_length, "", "UTF-8");
					products.push(cutstr2);
					var reg = "/^" + preg_quote(cutstr2) + "/";
					cutstr1 = preg_replace(reg, "", cutstr1);
				}

				if (!!cutstr1) {
					products.push(cutstr1);
				}

				res.product_name += products.join("<br>") + "<br>";
				br++;
			}

			if (detail.machineflg == true) {
				if (!detail.serialno) //空の場合は改行する
					{
						res.product_name += "<br>";
					} else //下の行にいれる
					{
						res.product_name += "&nbsp;&nbsp;&nbsp;&nbsp;\u88FD\u9020\u756A\u53F7:" + detail.serialno + "<br>";
					}

				br++;
			}

			if (detail.machineflg == true) {
				res.nums += "1";
			} else {
				res.nums += number_format(detail.number);
			}

			for (i = 0;; i < br; i++) {
				res.nums += "<br>";
			}

			if (in_tax) //税を掛けてからポイントを引く
				{
					var value = MtTax.priceWithTax(detail.price) - detail.point2;
				} else //税を掛ける前にポイントを引く
				{
					value = MtTax.priceWithTax(detail.price - detail.point);
				}

			if (carid == 1 && value < 0) {
				value = 0;
			}

			if (price_view == true) {
				res.price += number_format(value);

				if (detail.machineflg == true) //端末
					{
						res.price_2 += number_format(value);
					} else //付属品
					{
						value *= detail.number;
						res.price_2 += number_format(value);
					}
			}

			for (i = 0;; i < br; i++) {
				res.price += "<br>";
				res.price_2 += "<br>";
			}
		}

		return res;
	}

	makeHtmlForShop(shop_info) {
		var res = {
			shop: ""
		};
		res.shop = "\u3012" + shop_info.zip + "<br/>" + shop_info.pref + shop_info.addr + "<br>" + shop_info.build + "<br/>" + shop_info.companyname + "<br/>" + shop_info.shopname + "<br/>";
		return res;
	}

	makeHtmlForBill(shop_info) //請求先の取得
	{
		var res = {
			bill: ""
		};

		if (shop_info.sendhow == "\u6765\u5E97") {
			res.bill = shop_info.contractor;
		} else {
			res.bill = "\u3012" + shop_info.ord_zip1 + "-" + shop_info.ord_zip2 + "<br>";
			res.bill += shop_info.ord_addr1 + shop_info.ord_addr2 + "<br>";
			res.bill += shop_info.ord_building + "<br>";
			res.bill += "<br>";
			res.bill += shop_info.ord_sendname + "<br>";
			res.bill += shop_info.ord_sendpost + " \u69D8<br>";
		}

		return res;
	}

	createFormatPDF(shop_info, type, details, flag) //日付の記載
	//注文番号
	//請求先
	//販売店の情報
	//商品詳細
	//タイトルとフッターの取得
	//まとめる
	{
		var html_date = "";

		if (flag & ShopOrderDeliveryPrintView.FLAG_DATE_OF_ISSUE) //発行日を記載
			{
				html_date = date("\u767A\u884C\u65E5  Y\u5E74 n\u6708j\u65E5");
			} else //納品日を記載
			{
				var date = date_create(details[0].deliverydate);
				html_date = date_format(date, "\u7D0D\u54C1\u65E5  Y\u5E74 n\u6708j\u65E5");
			}

		if (flag & ShopOrderDeliveryPrintView.FLAG_ORDERID_OF_ORDER) //注文番号
			{
				var html_orderid = "\u6CE8\u6587\u756A\u53F7";
			} else {
			html_orderid = "\u4F1D\u7968\u756A\u53F7";
		}

		var html_bill = this.makeHtmlForBill(shop_info);
		var html_shop = this.makeHtmlForShop(shop_info);
		var html_details = this.makeHtmlForDetails(shop_info.carid, shop_info.carname, shop_info.ordertype, details);
		var html_title_footer = this.makeHtmlForTitleFooter(type, shop_info.slipno);
		var html = "<!DOCTYPE html>\n\t\t\t\t\t<html lang=\"ja\">\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t\t<meta charset=\"UTF-8\">\n\t\t\t\t\t\t\t<title>\u7D0D\u54C1\u66F8\u5370\u5237</title>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t<font size=\"10\">\n\t\t\t\t\t\t\t<table align=\"left\">\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td width=\"350\">" + html_bill.bill + "</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<br>\n                            \t\t<br>\n\t\t                            <br>" + html_shop.shop + "</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t</font>\n\t                <div style=\"text-align:center\">" + html_title_footer.title + "</div>\n    \t\t            <font size=\"10\">\n            \t\t        <div style=\"text-align:right\">" + html_date + "</div>\n                    \t\t<div style=\"text-align:left\">" + html_orderid + " " + shop_info.orderid + "</div>\n\t\t                    <br>\n\t\t                    <table cellspacing=\"0\" cellpadding=\"4\" border=\"1\" >\n\t\t\t\t\t\t\t\t<tr>\n                    \t    \t    <td align=\"center\" width=\"300\">\u5546\u54C1\u540D</td>\n                        \t\t    <td align=\"center\" width=\"70\">\u6570\u91CF</td>\n\t\t\t\t\t\t\t\t\t<td align=\"center\" width=\"80\">\u5358\u4FA1</td>\n\t                    \t        <td align=\"center\" width=\"80\">\u91D1\u984D</td>\n\t\t\t\t\t\t\t\t\t<td align=\"center\" width=\"70\">\u6458\u8981</td>\n            \t            \t</tr>\n\t                       \t \t<tr>\n        \t                    \t<td align=\"left\"  height=\"580\">" + html_details.product_name + "</td>\n\t\t\t\t\t\t\t\t<td align=\"centor\">" + html_details.nums + "</td>\n\t\t\t\t\t\t\t\t<td align=\"right\">" + html_details.price + "</td>\n\t\t\t\t\t\t\t\t<td align=\"right\">" + html_details.price_2 + "</td>\n\t\t\t\t\t\t\t\t<td align=\"centor\"></td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t<br><br>" + html_title_footer.footer + "</font>\n\t\t\t\t\t</body>\n\t\t\t\t</html>";
		return html;
	}

	writePDF_Delivery2(pdf, shop_info, order) //上記のとおり、受領いたしました
	{
		pdf.SetMargins(PDF_MARGIN_LEFT, 4, PDF_MARGIN_RIGHT);
		pdf.AddPage();
		var flag = ShopOrderDeliveryPrintView.FLAG_DATE_OF_ISSUE;
		flag |= ShopOrderDeliveryPrintView.FLAG_ORDERID_OF_ORDER;
		var html = this.createFormatPDF(shop_info, "delivery_2", order, flag);
		pdf.writeHTML(html, true, false, true, false, "");
		var y = 260;
		html = "<font size=\"10\">\u4E0A\u8A18\u306E\u3068\u304A\u308A\u3001\u7D0D\u54C1\u81F4\u3057\u307E\u3057\u305F\u3002</font>";
		pdf.SetXY(20, y);
		pdf.writeHTML(html, true, false, true, false, "");
	}

	writePDF_Receipt2(pdf, shop_info, order) //ページ追加
	//メイン作成
	//上記のとおり、受領いたしました
	//上記の通り受領いたした
	//年月日
	//署名などを書く欄
	{
		pdf.SetMargins(PDF_MARGIN_LEFT, 4, PDF_MARGIN_RIGHT);
		pdf.AddPage();
		var flag = ShopOrderDeliveryPrintView.FLAG_DATE_OF_ISSUE;
		flag |= ShopOrderDeliveryPrintView.FLAG_ORDERID_OF_ORDER;
		var html = this.createFormatPDF(shop_info, "receipt_2", order, flag);
		pdf.writeHTML(html, true, false, true, false, "");
		var y = 260;
		html = "<font size=\"10\">\u4E0A\u8A18\u306E\u3068\u304A\u308A\u3001\u53D7\u9818\u81F4\u3057\u307E\u3057\u305F\u3002</font>";
		pdf.SetXY(20, y);
		pdf.writeHTML(html, true, false, true, false, "");
		html = "<font size=\"10\">\u3000\u3000\u3000\u3000\u3000\u3000\u5E74\u3000\u3000\u3000\u3000\u3000\u6708\u3000\u3000\u3000\u3000\u3000\u65E5</font>";
		pdf.SetXY(20, y + 8);
		pdf.writeHTML(html, true, false, true, false, "");
		html = "<font size=\"8\">" + "<table border=\"1\" width=\"230\">" + "<tr>" + "<td align=\"centor\">\u53D7\u9818\u5370\u53C8\u306F\u3054\u7F72\u540D</td>" + "<td align=\"centor\">\u5F0A\u793E\u4F7F\u7528\u6B04</td>" + "</tr>" + "<tr>" + "<td width = \"115\" height=\"70\"></td>" + "<td width =\"115\" height=\"70\"></td>" + "</tr>" + "</table>" + "</font>";
		pdf.SetXY(104, y + 5);
		pdf.writeHTML(html, true, false, true, false, "");
	}

	outputPDF(shop_info, order) //PDF オブジェクトを作成し、以降の処理で操作します
	//set document information
	//$pdf->SetCreator(PDF_CREATOR);
	//$pdf->SetAuthor('Nicola Asuni');
	//$pdf->SetSubject('TCPDF Tutorial');
	//$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
	//ヘッダーとフッタを消す
	//set default monospaced font
	//set margins
	//set auto page breaks
	//$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
	//set image scale factor
	//set font
	//$pdf->SetFont("arialunicid0", "", 20);
	//$pdf->SetFont("kozminproregular", "", 20);
	//$font = $pdf->addTTFfont("/kcs/class/tcpdf_new/fonts/ipag.ttf");
	//		$pdf->SetFont($font, "", 20);
	//いらんかも
	//$this->order_detail = $this->getOrderDetail( $H_view );
	{
		var pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true);
		pdf.SetTitle("\u7D0D\u54C1\u66F8");
		pdf.setPrintHeader(false);
		pdf.setPrintFooter(false);
		pdf.SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		pdf.SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
		pdf.SetAutoPageBreak(false);
		pdf.setImageScale(PDF_IMAGE_SCALE_RATIO);
		pdf.SetFont("ipag", "", 20);

		switch (this.H_Local.groupid) {
			case 1:
				if (_POST.delivery_view_2 == "yes") {
					this.writePDF_Delivery2(pdf, shop_info, order);
				}

				if (_POST.receipt_view_2 == "yes") {
					this.writePDF_Receipt2(pdf, shop_info, order);
				}

				break;

			default:
				if (_POST.delivery_view == "yes") {
					pdf.SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
					pdf.AddPage();
					var html = this.createFormatPDF(shop_info, "delivery", order, 0);
					pdf.writeHTML(html, true, false, true, false, "");
				}

				if (_POST.delivery_sub_view == "yes") {
					pdf.SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
					pdf.AddPage();
					html = this.createFormatPDF(shop_info, "delivery_sub", order, 0);
					pdf.writeHTML(html, true, false, true, false, "");
				}

				if (_POST.receipt_view == "yes") {
					pdf.SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
					pdf.AddPage();
					html = this.createFormatPDF(shop_info, "receipt", order, 0);
					pdf.writeHTML(html, true, false, true, false, "");
				}

				break;
		}

		pdf.Output("Delivery_note.pdf", "I");
	}

	__destruct() {
		super.__destruct();
	}

};