//
//注文履歴ダウンロードView
//
//更新履歴：<br>
//2008/11/13 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/11/13
//@filesource
//@uses OrderListMenuView
//@uses QuickFormUtil
//
//
//
//error_reporting(E_ALL);
//
//注文履歴ダウンロードView
//
//@package Order
//@subpackage View
//@since 2008/11/13
//@uses OrderListMenuView
//@uses QuickFormUtil
//
//

require("view/Order/RecogMenuView.php");

require("DLUtil.php");

require("view/Order/BillingViewBase.php");

//csrf対策。
//fileidの確認を行うか設定を行う。checkCGIParam前に設定すること。
//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//
//
//
//CGIパラメータのチェックを行う<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//
//オーダーのデータを整形する<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $H_orderlist	オーダーのリスト
//@param model $O_model		OrderListDownloadModel
//@param mixed $H_property		電話詳細情報のカラム
//
//@access public
//@return mixed
//
//
//
//データのソート順を画面と同じにする<br>
//
//@author miyazawa
//@since 2008/11/17
//
//@param mixed $H_orderlist	// オーダーのリスト
//@param mixed $A_orderid	// オーダーIDのリスト
//
//@access public
//@return mixed
//
//
//
//ラベルを返す
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $H_property	電話詳細情報のカラム
//
//@access public
//@return mixed
//
//
//
//出力する
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $H_orderlist
//
//@access public
//@return void
//
//
//
//特殊文字を置換する
//
//@author miyazawa
//@since 2008/11/21
//
//@param string $str
//
//@access public
//@return void
//
//
//
//setfjpModelObject
//
//@author igarashi
//@since 2011/06/30
//
//@param mixed $fjp
//@access public
//@return void
//
//
// isSubtractPointFromSubtotal
// 
// @author date
// @since 2014/09/25
// 
// @param $carid
// @access public
// @return bool
//csrf対策
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
class OrderListDownloadView extends RecogMenuView {
	constructor() {
		super();
		this.use_tstamp = true;
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("subtract_point_from_subtotal");
		this.carrior_list = this.O_Set.A_carrior_list;
	}

	checkCGIParam() //CSRFチェック
	{
		if (this.use_tstamp == true) {
			if (this.H_Dir.tstamp != _GET.id || is_null(this.H_Dir.tstamp)) {
				this.errorOut(8, "\u6CE8\u6587\u5C65\u6B74DL\u3001CSRF\u30A8\u30E9\u30FC", false);
			}
		}

		delete this.H_Local.carid;

		if (true == (undefined !== _GET.c)) {
			this.H_Local.carid = _GET.c;
		}

		if (true == (undefined !== _GET.id)) {
			this.H_Local.fileid = _GET.id;
		} else {
			delete this.H_Local.fileid;
		}

		this.O_Sess.setPub(OrderListDownloadView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	adjustTypeAData(H_orderlist) {
		var orderid = undefined;

		for (var key in H_orderlist) //typeAを判定
		{
			var val = H_orderlist[key];

			if (undefined !== val.ordertype) {
				if (val.ordertype == "A") {
					if (val.orderid != orderid) {
						var taihi = undefined;
						orderid = val.orderid;
						var ordertype = val.ordertype;
						var recdate = val.recdate;
						var finishdate = val.finishdate;
					}
				}
			}

			if (orderid == val.orderid) {
				if (undefined !== taihi) //S179 商品種別 20150109date
					//S185 受領日入力　20150123 date
					{
						taihi.orderid = val.orderid;
						taihi.ordersubid = val.ordersubid;
						taihi.substatus = val.substatus;
						taihi.productname = val.productname;
						taihi.property = val.property;
						taihi.anspassprice = val.anspassprice;
						taihi.totalprice = val.totalprice;
						taihi.saleprice = val.saleprice;
						taihi.number = val.accnum;
						taihi.memory = val.memory;
						taihi.recovery = val.recovery;
						taihi.machineflg = val.machineflg;
						taihi.detail_sort = val.detail_sort;
						taihi.deliverydate = val.deliverydate;
						taihi.forcustomer = val.forcustomer;
						taihi.shoppoint3 = val.shoppoint3;
						taihi.classification = val.classification;
						taihi.receiptdate = val.receiptdate;
						taihi.recdate = recdate;
						taihi.ordertype = ordertype;
						taihi.finishdate = finishdate;
						H_result.push(taihi);
					}

				taihi = val;
			} else {
				H_result.push(val);
			}
		}

		return H_result;
	}

	adjustOrderData(H_orderlist, O_model: OrderListDownloadModel, H_property = Array(), A_auth = Array()) //データ中のカンマ等全角に置換するためのクラス生成（V2から引き継ぎ）
	//英語化権限 20090313miya
	//電話詳細情報
	{
		var H_result = Array();
		var H_sep = DLUtil.getDLProperty();
		var separator1 = H_sep.separator1;
		var separator2 = H_sep.separator2;
		var extension = H_sep.extension;
		var H_rep = {
			[separator1]: DLUtil.strConvert(separator),
			[separator2]: DLUtil.strConvert(separator2),
			"'": "\u2019",
			"\"": "\u201D",
			"\t": " "
		};

		if (true == this.H_Dir.eng) //オプション一覧を取得
			{
				var H_option = O_model.getOrderListOptionEng(this.H_Local.carid);
				var put_str = "Add";
				var stay_str = "No Change";
				var remove_str = "Remove";
				var nouse_str = "Do Not Redeem";
				var maximam_str = "Redeem All Points";
				var specify_str = "Specify Points";
				var bill_all_str = "Include in Lump-Sum Billing";
				var bill_sep_str = "Separate Billing";
				var mem_do_str = "Yes";
				var mem_dont_str = "No";
				var rec_do_str = "Yes";
				var rec_dont_str = "No";
				var ikkatsu_str = "Lump Sum";
				var genkin_str = "Cash";
				var seikyusyo_str = "By Invoice";
				var bunkatsu_str = "Installments";
				var yokugetsu_str = "Include in Your Bill along with Monthly Charges for the Following Month";
				var hand_str = "Direct Delivery";
				var delivery_str = "Courier";
				var raiten_str = "Pickup";
			} else //オプション一覧を取得
			{
				H_option = O_model.getOrderListOption(this.H_Local.carid);
				put_str = "\u3064\u3051\u308B";
				stay_str = "\u5909\u66F4\u306A\u3057";
				remove_str = "\u5916\u3059";
				nouse_str = "\u4F7F\u7528\u3057\u306A\u3044";
				maximam_str = "\u53EF\u80FD\u306A\u9650\u308A";
				specify_str = "\u30DD\u30A4\u30F3\u30C8\u6307\u5B9A";
				bill_all_str = "\u4E00\u62EC\u8ACB\u6C42\u7D44\u307F\u8FBC\u307F";
				bill_sep_str = "\u5225\u8ACB\u6C42";
				mem_do_str = "\u3059\u308B";
				mem_dont_str = "\u3057\u306A\u3044";
				rec_do_str = "\u3059\u308B";
				rec_dont_str = "\u3057\u306A\u3044";
				ikkatsu_str = "\u4E00\u62EC\u652F\u6255";
				genkin_str = "\u73FE\u91D1\u652F\u6255";
				seikyusyo_str = "\u8ACB\u6C42\u66F8\u767A\u884C";
				bunkatsu_str = "\u5206\u5272\u652F\u6255";
				yokugetsu_str = "\u7FCC\u6708\u3054\u5229\u7528\u5206\u3068\u5408\u308F\u305B\u3066\u3054\u8ACB\u6C42";
				hand_str = "\u304A\u5C4A\u3051";
				delivery_str = "\u5B85\u914D\u4FBF";
				raiten_str = "\u6765\u5E97";
			}

		if (true == Array.isArray(H_property) && true == 0 < H_property.length) {
			var A_cols = Object.keys(H_property);
		}

		for (var key in H_orderlist) //option整形
		//配列を元に戻す
		//waribiki整形
		//配列を元に戻す
		//point
		//項目不要なのにmaximam（可能な限り）がデフォルトで入ってたら消す
		//税込価格を算出
		//ダウンロードデータ管理権限があるが、ダウンロードデータマスクしない権限がない時
		//順番にセット
		//$A_row["registdate"] = $val["registdate"];
		//20101109iga
		//電話詳細情報
		//S179 商品種別 20141225 date
		//s216 使用者メールアドレス
		//S178 メールアドレス追加20141211date
		//s216 端末種別
		//$A_row["smpcirname"] =  $val["smart_type"]."_".$val["smpcirname"];
		{
			var val = H_orderlist[key];

			if (val.orderid != orderid) {
				MtTax.setDate(val.finishdate);
				var carid = val.carid;
				var orderid = val.orderid;
			} else {
				orderid = val.orderid;
			}

			val.option_org = val.option;
			val.option = unserialize(val.option);
			var A_opstr = Array();

			if (true == preg_match("/stay/", val.option_org) || true == preg_match("/put/", val.option_org) || true == preg_match("/remove/", val.option_org)) {
				if (Array.isArray(val.option) == true) {
					{
						let _tmp_0 = val.option;

						for (var ky in _tmp_0) {
							var vl = _tmp_0[ky];

							if (vl == "put") {
								var vl = put_str;
							} else if (vl == "stay") {
								vl = stay_str;
							} else if (vl == "remove") {
								vl = remove_str;
							}

							A_opstr.push(H_option[ky] + ":" + vl);
						}
					}
					val.option = join(separator2, A_opstr);
				}
			} else {
				if (Array.isArray(val.option) == true) {
					{
						let _tmp_1 = val.option;

						for (var ky in _tmp_1) {
							var vl = _tmp_1[ky];
							A_opstr.push(H_option[ky] + ":" + put_str);
						}
					}
					val.option = join(separator2, A_opstr);
				}
			}

			val.waribiki_org = val.waribiki;
			val.waribiki = unserialize(val.waribiki);
			var A_waristr = Array();

			if (true == preg_match("/stay/", val.waribiki_org) || true == preg_match("/put/", val.waribiki_org) || true == preg_match("/remove/", val.waribiki_org)) {
				if (Array.isArray(val.waribiki) == true) {
					{
						let _tmp_2 = val.waribiki;

						for (var ky in _tmp_2) {
							var vl = _tmp_2[ky];

							if (vl == "put") {
								vl = put_str;
							} else if (vl == "stay") {
								vl = stay_str;
							} else if (vl == "remove") {
								vl = remove_str;
							}

							A_waristr.push(H_option[ky] + ":" + vl);
						}
					}
					val.waribiki = join(separator2, A_waristr);
				}
			} else {
				if (Array.isArray(val.waribiki) == true) {
					{
						let _tmp_3 = val.waribiki;

						for (var ky in _tmp_3) {
							var vl = _tmp_3[ky];
							A_waristr.push(H_option[ky] + ":" + put_str);
						}
					}
					val.waribiki = join(separator2, A_waristr);
				}
			}

			if (val.pointradio == "nouse") //$val["point"] = NULL;
				{
					val.pointradio = nouse_str;
				} else if (val.pointradio == "maximam") //$val["point"] = NULL;	「可能な限り」でも販売店側でポイント数を入力できるので消さない
				{
					val.pointradio = maximam_str;
				} else if (val.pointradio == "specify") {
				val.pointradio = specify_str;
			}

			if (val.ordertype == "A" or val.ordertype == "M" or val.ordertype == undefined) {
				val.point = val.shoppoint3;
			} else {
				val.point = val.shoppoint + val.shoppoint2;
			}

			if (val.ordertype == "M" or val.ordertype == undefined) {
				val.number = val.accnum;
			} else {
				val.number = val.number;
			}

			val.posttaxprice = 0;

			if (val.number != undefined) //if($carid == 3){
				{
					if (this.isSubtractPointFromSubtotal(carid)) //iniファイルから参照するようにしました 2014/09/25 date
						{
							val.posttaxprice = (MtTax.priceWithTax(val.saleprice) - val.point / val.number) * val.number;

							if (carid == 1 && val.posttaxprice < 0) {
								val.posttaxprice = 0;
							}
						} else {
						val.posttaxprice = MtTax.priceWithTax(val.saleprice - val.point / val.number) * val.number;
					}
				}

			if (val.discounttel != "") {
				val.discounttel = unserialize(val.discounttel);

				for (var element of Object.values(val.discounttel)) //セパレータ抵触防止（配列）
				{
					var element = strtr(element, H_rep);
				}

				val.discounttel = join(separator2, val.discounttel);
			}

			if (val.billaddress != "") //セパレータ抵触防止
				{
					val.billaddress = strtr(val.billaddress, H_rep);
					val.billaddress = preg_replace("/\n/", "|", val.billaddress);
					val.billaddress = preg_replace("/\r/", "|", val.billaddress);
					val.billaddress = val.billaddress.replace(/\|\|/g, separator2);
				}

			if (val.note != "") {
				val.note = preg_replace("/\n/", "", val.note);
				val.note = preg_replace("/\r/", "", val.note);
			}

			if (val.billradio == "all") //billaddress除去
				{
					val.billradio = bill_all_str;
					val.billaddress = undefined;
				} else if (val.billradio == "sep") //parent除去
				{
					val.billradio = bill_sep_str;
					val.parent = undefined;
				} else if (val.billradio == "") //parent除去
				//billaddress除去
				{
					val.parent = undefined;
					val.billaddress = undefined;
				}

			if (val.memory == "do") {
				val.memory = mem_do_str;
			} else if (val.memory == "dont") {
				val.memory = mem_dont_str;
			}

			if (val.recovery == "do") {
				val.recovery = rec_do_str;
			} else if (val.recovery == "dont") {
				val.recovery = rec_dont_str;
			}

			if (true == this.H_Dir.eng) {
				if (val.fee == "\u4E00\u62EC\u652F\u6255") {
					val.fee = ikkatsu_str;
				} else if (val.fee == "\u73FE\u91D1\u652F\u6255") {
					val.fee = genkin_str;
				} else if (val.fee == "\u8ACB\u6C42\u66F8\u767A\u884C") {
					val.fee = seikyusyo_str;
				} else if (val.fee == "\u5206\u5272\u652F\u6255") {
					val.fee = bunkatsu_str;
				} else if (val.fee == "\u7FCC\u6708\u3054\u5229\u7528\u5206\u3068\u5408\u308F\u305B\u3066\u3054\u8ACB\u6C42") {
					val.fee = yokugetsu_str;
				}
			}

			if (true == this.H_Dir.eng) {
				if (val.sendhow == "\u304A\u5C4A\u3051") {
					val.sendhow = hand_str;
				} else if (val.sendhow == "\u5B85\u914D\u4FBF") {
					val.sendhow = delivery_str;
				} else if (val.sendhow == "\u6765\u5E97") {
					val.sendhow = raiten_str;
				}
			}

			if (true == this.H_Dir.eng) {
				if (val.webreliefservice == "\u30A6\u30A7\u30D6\u5229\u7528\u5236\u9650") {
					val.webreliefservice = "Restricted Web Filtering";
				} else if (val.webreliefservice == "\u30A6\u30A7\u30D6\u5229\u7528\u5236\u9650(\u5F31)") {
					val.webreliefservice = "Relaxed Web Filtering";
				} else if (val.webreliefservice == "\u30A6\u30A7\u30D6\u5229\u7528\u5236\u9650(\u5F31)\u30D7\u30E9\u30B9") {
					val.webreliefservice = "Relaxed Web Filtering Plus";
				} else if (val.webreliefservice == "Yahoo!\u304D\u3063\u305A") {
					val.webreliefservice = "Yahoo! Kids";
				} else if (val.webreliefservice == "\u52A0\u5165\u306A\u3057") {
					val.webreliefservice = "Not apply";
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.ansdate) == true) {
				var ansdate = mktime(val.ansdate.substr(11, 2), val.ansdate.substr(14, 2), val.ansdate.substr(17, 2), val.ansdate.substr(5, 2), val.ansdate.substr(8, 2), val.ansdate.substr(0, 4));
				val.ansdate = strftime("%Y/%m/%d %H:%M:%S", ansdate);

				if (preg_match("/00:00:00$/", val.ansdate) == true) {
					val.ansdate = val.ansdate.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.expectdate) == true) {
				var expectdate = mktime(val.expectdate.substr(11, 2), val.expectdate.substr(14, 2), val.expectdate.substr(17, 2), val.expectdate.substr(5, 2), val.expectdate.substr(8, 2), val.expectdate.substr(0, 4));
				val.expectdate = strftime("%Y/%m/%d %H:%M:%S", expectdate);

				if (preg_match("/00:00:00$/", val.expectdate) == true) {
					val.expectdate = val.expectdate.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.registdate) == true) {
				var registdate = mktime(val.registdate.substr(11, 2), val.registdate.substr(14, 2), val.registdate.substr(17, 2), val.registdate.substr(5, 2), val.registdate.substr(8, 2), val.registdate.substr(0, 4));
				val.registdate = strftime("%Y/%m/%d %H:%M:%S", registdate);

				if (preg_match("/00:00:00$/", val.registdate) == true) {
					val.registdate = val.registdate.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.datefrom) == true) {
				var datefrom = mktime(val.datefrom.substr(11, 2), val.datefrom.substr(14, 2), val.datefrom.substr(17, 2), val.datefrom.substr(5, 2), val.datefrom.substr(8, 2), val.datefrom.substr(0, 4));
				val.datefrom = strftime("%Y/%m/%d %H:%M:%S", datefrom);

				if (preg_match("/00:00:00$/", val.datefrom) == true) {
					val.datefrom = val.datefrom.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.dateto) == true) {
				var dateto = mktime(val.dateto.substr(11, 2), val.dateto.substr(14, 2), val.dateto.substr(17, 2), val.dateto.substr(5, 2), val.dateto.substr(8, 2), val.dateto.substr(0, 4));
				val.dateto = strftime("%Y/%m/%d %H:%M:%S", dateto);

				if (preg_match("/00:00:00$/", val.dateto) == true) {
					val.dateto = val.dateto.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.datechange) == true) {
				var datechange = mktime(val.datechange.substr(11, 2), val.datechange.substr(14, 2), val.datechange.substr(17, 2), val.datechange.substr(5, 2), val.datechange.substr(8, 2), val.datechange.substr(0, 4));
				val.datechange = strftime("%Y/%m/%d %H:%M:%S", datechange);

				if (preg_match("/00:00:00$/", val.datechange) == true) {
					val.datechange = val.datechange.substr(0, 10);
				}
			}

			if (preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val.deliverydate) == true) //入荷後の処理
				{
					if ("1999-01-01 00:00:00" == val.deliverydate) {
						val.deliverydate = "\u5165\u8377\u5F8C";

						if (true == this.H_Dir.eng) {
							val.deliverydate = "After shipment";
						}
					} else {
						var deliverydate = mktime(val.deliverydate.substr(11, 2), val.deliverydate.substr(14, 2), val.deliverydate.substr(17, 2), val.deliverydate.substr(5, 2), val.deliverydate.substr(8, 2), val.deliverydate.substr(0, 4));
						val.deliverydate = strftime("%Y/%m/%d %H:%M:%S", deliverydate);

						if (preg_match("/00:00:00$/", val.deliverydate) == true) {
							val.deliverydate = val.deliverydate.substr(0, 10);
						}
					}
				}

			if (val.substatus == 230 || -1 !== A_auth.indexOf("fnc_receipt") == false) {
				var receiptdate = "";
			} else {
				receiptdate = str_replace("-", "/", val.receiptdate);
			}

			if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) //マスクする
				{
					var telusername = "********";
					var employeecode = "*****";
					var chargermail = "********@********";
					var chargername = "********";
					var recogname = "********";
					var recogcode = "********";
					var mail = "********@********";
				} else //マスクしない
				{
					telusername = val.telusername;
					employeecode = val.employeecode;
					chargermail = val.chargermail;
					chargername = val.chargername;
					recogname = val.recogname;
					recogcode = val.recogcode;
					mail = val.mail;
				}

			A_row.orderid = val.orderid;
			A_row.ordersubid = val.ordersubid;
			A_row.pactid = val.pactid;
			A_row.postname = val.postname;

			if (!!val.telno_view) {
				A_row.telno_view = val.telno_view;
			} else if (!!val.no_view) {
				A_row.telno_view = val.no_view;
			} else {
				A_row.telno_view = val.telno;
			}

			A_row.telusername = telusername;
			A_row.employeecode = employeecode;
			A_row.carname = val.carname;
			A_row.ptnname = val.ptnname;
			A_row.forcustomer = val.forcustomer;
			A_row.mnpno = val.mnpno;
			A_row.shopid = val.shopid;
			A_row.ansdate = val.ansdate;
			A_row.deliverydate = val.deliverydate;
			A_row.expectdate = val.expectdate;
			A_row.cirname = val.cirname;
			A_row.chargername = chargername;
			A_row.contractor = val.contractor;
			A_row.compname = val.compname;
			A_row.productname = val.productname;
			A_row.property = val.property;
			A_row.buyselname = val.buyselname;
			A_row.pay_frequency = val.pay_frequency;
			A_row.pay_monthly_sum = val.pay_monthly_sum;
			A_row.anspassprice = val.anspassprice;
			A_row.totalprice = val.totalprice;
			A_row.planname = val.planname;
			A_row.packetname = val.packetname;
			A_row.passwd = val.passwd;
			A_row.number = val.number;
			A_row.pointradio = val.pointradio;
			A_row.point = val.point;
			A_row.parent = val.parent;
			A_row.saleprice = val.saleprice * val.number;
			A_row.posttaxprice = val.posttaxprice;
			A_row.billradio = val.billradio;
			A_row.fee = val.fee;
			A_row.datefrom = val.datefrom;
			A_row.dateto = val.dateto;
			A_row.datechange = val.datechange;
			A_row.billaddress = val.billaddress;
			A_row.note = val.note;
			A_row.sendhow = val.sendhow;
			A_row.sendname = val.sendname;
			A_row.sendaddress = val.zip1 + "-" + val.zip2 + " " + val.addr1 + " " + val.addr2 + " " + val.building + " " + val.sendpost;
			A_row.sendtel = val.sendtel;
			A_row.memory = val.memory;
			A_row.recovery = val.recovery;
			A_row.discounttel = val.discounttel;
			A_row.option = val.option;
			A_row.webreliefservice = val.webreliefservice;
			A_row.waribiki = val.waribiki;
			A_row.billhow = val.billhowview;
			A_row.billname = val.billname;
			A_row.billaddr = val.billzip1 + "-" + val.billzip2 + " " + val.billaddr1 + " " + val.billaddr2 + " " + val.billbuild + " " + val.billpost;
			A_row.billtel = val.billtel;
			A_row.recdate = !!val.recdate ? date("Y/m/d H:i:s", strtotime(val.recdate)) : "";

			if (true == Array.isArray(A_cols) && true == 0 < A_cols.length) {
				for (var col of Object.values(A_cols)) //日付整形
				{
					if (true == preg_match("/^date/", col) && "" != val[col] && true == preg_match("/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/", val[col])) {
						val[col] = mktime(val[col].substr(11, 2), val[col].substr(14, 2), val[col].substr(17, 2), val[col].substr(5, 2), val[col].substr(8, 2), val[col].substr(0, 4));
						val[col] = strftime("%Y/%m/%d", val[col]);
					}

					A_row[col] = val[col];
				}
			}

			A_row.recogcode = recogcode;
			A_row.recogname = recogname;
			A_row.pbpostcode = val.pbpostcode;
			A_row.pbpostname = val.pbpostname;
			A_row.cfbpostcode = val.cfbpostcode;
			A_row.cfbpostname = val.cfbpostname;
			A_row.ioecode = val.ioecode;
			A_row.coecode = val.coecode;

			if ("auto" == val.commflag) {
				A_row.commflag = "\u81EA\u52D5\u66F4\u65B0\u3059\u308B";
			} else if ("manual" == val.commflag) {
				A_row.commflag = "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044";
			} else {
				A_row.commflag = "";
			}

			A_row.division = val.division;
			A_row.classification = val.classification;
			A_row.mail = mail;
			A_row.chargermail = chargermail;

			if (!val.productid) //smart_circuit_tbから取得
				{
					A_row.smpcirname = val.smpcirname;
				} else //product_tbから取得
				{
					A_row.smpcirname = val.smart_type;
				}

			if (-1 !== A_auth.indexOf("fnc_receipt") == true) //S185 受領日
				{
					A_row.receiptdate = receiptdate;
				}

			if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
				A_row.mnp_enable_date = val.mnp_enable_date;
			}

			A_row.substatus = val.substatus;
			H_result.push(A_row);
		}

		return H_result;
	}

	sortOrderData(H_orderlist, A_orderid = Array(), H_search = undefined) //20150108 date
	{
		var status = undefined;

		if (!is_null(H_search)) //検索条件について 20150108 date
			{
				status = join(",", H_search.status);
				status = status.split(",");
			}

		if (true == Array.isArray(H_orderlist) && true == 0 < H_orderlist.length && true == Array.isArray(A_orderid) && true == 0 < A_orderid.length) //$A_orderidの順番に処理
			{
				var H_result = Array();
				var H_templist = H_orderlist;

				for (var orderid of Object.values(A_orderid)) //一覧データを$A_orderidの順番で$A_tempに入れて、終わったのはどんどん消す
				//$H_resultに入れていく
				{
					var A_temp = Array();
					var eda_count = 0;

					for (var tk in H_templist) {
						var tv = H_templist[tk];

						if (tv.orderid == orderid) //枝番
							//20150108 date、statusのチェック
							{
								tv.ordersubid = eda_count;
								eda_count++;

								if (!is_null(status)) //substatusをチェックすること
									//20150108に検索条件追加
									{
										if (-1 !== status.indexOf(tv.substatus)) //20150108
											{
												if (undefined !== tv.substatus) {
													delete tv.substatus;
												}

												A_temp.push(tv);
											}
									} else {
									if (undefined !== tv.substatus) {
										delete tv.substatus;
									}

									A_temp.push(tv);
								}

								delete H_templist[tk];
							}
					}

					if (true == 0 < A_temp.length) {
						for (var row of Object.values(A_temp)) {
							H_result.push(row);
						}
					}
				}
			}

		return H_result;
	}

	getLabelArray(H_property = Array(), A_auth = Array()) //英語化権限 20090313miya
	//用途区分
	//S179 商品種別追加 20141226date
	//メールアドレスを末尾に移動 20141226date
	//受領日	S185 20150119date
	{
		var langList = this.getBillView().getLangLists();

		if (true == this.H_Dir.eng) {
			var A_label = ["Order No.", "Suffix Number", "Customer ID", "\u2606\u767B\u9332\u90E8\u7F72", "Phone Number", "User", "Employee Number", "Carrier", "Order Type", "Status", "MNP Reservation No.", "Shop ID", "Order Date", "Date Scheduled", "Processed Date", "Service Type", "Requestor", "Subscriber Name", "Applicant", "Product Name", "Color", "Method of Purchase", "No. of Installments", "Installment Amount", "Deposit", "Amount", "Billing Plan", "Packet Pack", "Network PIN", "Qty", "Points", "Number of point", "Point withdrawal number", "\u2606\u4FA1\u683C\uFF08\u7A0E\u629C\uFF09", "\u2606\u8ACB\u6C42\u91D1\u984D\uFF08\u7A0E\u8FBC\uFF09", "Payment Method", "Payment Method for Contract Handling Fee", "Desired Date(FROM)", "Desired Date(TO)", "Start From", "Bill Recipient", "Note", "Delivery Method", "Ship to", "Shipping Address", "Contact Number ", "Memory Copy", "Collection of Old Handset", "Destination telephone number", "Option", "Safeguarding", "Discount Service", "Billing Method", "Billing to", "Billing Address", "Billing Contact Number", "\u2606\u7533\u8ACB\u65E5"];
		} else {
			A_label = ["\u53D7\u4ED8\u756A\u53F7", "\u679D\u756A", "\u9867\u5BA2ID", "\u767B\u9332\u90E8\u7F72", "\u643A\u5E2F\u756A\u53F7", "\u4F7F\u7528\u8005", "\u793E\u54E1\u756A\u53F7", "\u30AD\u30E3\u30EA\u30A2", "\u767A\u6CE8\u7A2E\u5225", "\u30B9\u30C6\u30FC\u30BF\u30B9", "MNP\u53D7\u4ED8\u756A\u53F7", "\u62C5\u5F53\u8CA9\u58F2\u5E97ID", "\u53D7\u6CE8\u65E5", "\u4E88\u5B9A\u65E5\u6642", "\u51E6\u7406\u65E5", "\u56DE\u7DDA\u7A2E\u5225", "\u9867\u5BA2\u5074\u5165\u529B\u62C5\u5F53\u8005\u540D", "\u5951\u7D04\u540D\u7FA9", "\u767A\u6CE8\u540D\u7FA9", "\u6A5F\u7A2E", "\u8272", "\u8CFC\u5165\u65B9\u5F0F", "\u5272\u8CE6\u56DE\u6570", "\u5272\u8CE6\u4EE3\u91D1", "\u982D\u91D1", "\u7AEF\u672B\u4EE3\u91D1", "\u6599\u91D1\u30D7\u30E9\u30F3", "\u30D1\u30B1\u30C3\u30C8\u5272\u5F15", "\u6697\u8A3C\u756A\u53F7", "\u53F0\u6570", "\u3054\u5229\u7528\u30DD\u30A4\u30F3\u30C8", "\u30DD\u30A4\u30F3\u30C8\u6570", "\u30DD\u30A4\u30F3\u30C8\u5F15\u304D\u843D\u3068\u3057\u756A\u53F7", "\u4FA1\u683C\uFF08\u7A0E\u629C\uFF09", "\u8ACB\u6C42\u91D1\u984D\uFF08\u7A0E\u8FBC\uFF09", "\u8ACB\u6C42\u65B9\u6CD5", "\u4E8B\u52D9\u624B\u6570\u6599\u306E\u652F\u6255\u3044\u65B9\u6CD5", "\u5E0C\u671B\u65E5\u6642\uFF08FROM\uFF09", "\u5E0C\u671B\u65E5\u6642\uFF08TO\uFF09", "\u5207\u66FF\u30FB\u5909\u66F4\u30FB\u89E3\u7D04\u5E0C\u671B\u65E5\u6642", "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148", "\u9867\u5BA2\u8A18\u5165\u306E\u5099\u8003", "\u7D0D\u54C1\u65B9\u6CD5", "\u7D0D\u54C1\u5148\u540D\u79F0", "\u7D0D\u54C1\u5148\u4F4F\u6240", "\u7D0D\u54C1\u5148\u96FB\u8A71\u756A\u53F7", "\u30E1\u30E2\u30EA\u30FC\u30B3\u30D4\u30FC", "\u65E7\u7AEF\u672B\u56DE\u53CE", "\u901A\u8A71\u76F8\u624B\u5148\u96FB\u8A71\u756A\u53F7", "\u30AA\u30D7\u30B7\u30E7\u30F3", "\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9", "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9", "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u65B9\u6CD5", "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148", "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148\u4F4F\u6240", "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148\u96FB\u8A71\u756A\u53F7", "\u7533\u8ACB\u65E5"];
		}

		if (true == Array.isArray(H_property) && true == 0 < H_property.length) {
			for (var col of Object.values(H_property)) {
				A_label.push(col);
			}
		}

		var A_temp = ["\u627F\u8A8D\u8005", "\u627F\u8A8D\u8005\u6C0F\u540D", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D", "\u8CFC\u5165\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0"];

		for (var val of Object.values(A_temp)) {
			A_label.push(val);
		}

		A_label.push("\u533A\u5206");
		A_label.push("\u5546\u54C1\u7A2E\u5225");

		if (true == this.H_Dir.eng) //メールアドレス入力欄 S178 20141211伊達
			//メールアドレス入力欄 S178 20141211d伊達
			//s216 商品種別と使用者メールアドレス追加 20170105
			{
				A_label.push("\u4F7F\u7528\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
				A_label.push("\u9867\u5BA2\u5165\u529B\u62C5\u5F53\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
				A_label.push("\u7AEF\u672B\u7A2E\u5225");
			} else //メールアドレス入力欄 S178 20141211伊達
			//メールアドレス入力欄 S178 20141211伊達
			//s216 商品種別と使用者メールアドレス追加 20170105
			{
				A_label.push("\u4F7F\u7528\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
				A_label.push("\u9867\u5BA2\u5165\u529B\u62C5\u5F53\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9");
				A_label.push("\u7AEF\u672B\u7A2E\u5225");
			}

		if (-1 !== A_auth.indexOf("fnc_receipt") == true) {
			A_label.push("\u53D7\u9818\u65E5");
		}

		if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
			A_label.push("MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5");
		}

		return A_label;
	}

	outOrderList(H_sub, H_property, A_auth = Array()) //データ中のカンマ等全角に置換するためのクラス生成（V2から引き継ぎ）
	//ラベルをかく
	//S227 hanashima 20201028
	{
		var A_label = this.getLabelArray(H_property, A_auth);
		var H_sep = DLUtil.getDLProperty();
		var extension = H_sep.extension;
		var sep1 = H_sep.separator1;
		var qt = "";

		if (H_sep.textize == "on") {
			qt = "\"";
		}

		if (true == this.H_Dir.eng) {
			var filename = "Request list_" + this.H_Local.fileid + "." + H_sep.extension;
		} else {
			filename = "\u7533\u8ACB\u4E00\u89A7_" + this.H_Local.fileid + "." + H_sep.extension;
		}

		header("Pragma: private");

		var __filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");

		header("Content-Disposition: attachment; filename=\"" + __filename + "\"");
		header("Content-type: application/octet-stream; name=\"" + filename + "\"");

		if ("write" == H_sep.title) //", "で連結していたのを半角スペース消して","にした 20091225miya
			{
				echo(mb_convert_encoding(qt + A_label.join(qt + sep1 + qt) + qt + "\r\n", "SJIS-win", "UTF-8"));
			}

		for (var key in H_sub) //", "で連結していたのを半角スペース消して","にした 20091225miya
		{
			var val = H_sub[key];
			var val = this.replaceDownloadString(val);
			echo(mb_convert_encoding(qt + val.join(qt + sep1 + qt) + qt + "\r\n", "SJIS-win", "UTF-8"));
		}

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}
	}

	replaceDownloadString(str) //"”’"に置換していた。どうも間違いだと思われるので"”"に直した	20100715miya
	//シングルクォート、ダブルクォートのstripslashes代わり（stripslashesをそのままかけるとこの関数の帰り先のimplodeでエラーになってしまう） 20100715miya
	{
		str = str.replace(/(')/g, "\u2019");
		str = str.replace(/(")/g, "\u201D");
		str = preg_replace("/(\r\n|\r|\n|\t)/", " ", str);
		str = str.replace(/(\\’)/g, "\u2019");
		str = str.replace(/(\\”)/g, "\u201D");
		return str;
	}

	setfjpModelObject(fjp) {
		require("model/Order/fjpModel.php");

		if (fjp instanceof fjpModel) {
			this.O_fjp = fjp;
		}
	}

	isSubtractPointFromSubtotal(carid) {
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

	setUseTimeStamp(use_flag) {
		this.use_tstamp = use_flag;
	}

	__destruct() {
		super.__destruct();
	}

};