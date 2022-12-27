//
//注文用Model基底クラス
//
//更新履歴：<br>
//2008/04/01 宮澤龍彦 作成
//
//@package Order
//@subpackage Model
//@author miyazawa
//@filesource
//@since 2008/04/01
//@uses ModelBase
//@uses Authority
//@uses TableMake
//@uses Post
//@uses TreeAJAX
//@uses ListAJAX
//
//
//
//注文フォーム用Model基底クラス
//
//@uses ModelBase
//@package
//@author miyazawa
//@since 2008/04/01
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("Post.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

require("OrderUtil.php");

require("OrderModelBase.php");

//
//インサート用現在時刻
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//入力前の状態と入力後の状態に差があるか確認し、差があるものだけ配列に入れて返す
//
//@author igarashi
//@since 2008/06/04
//
//@access public
//@return mixed
//
//
//カゴのupdate
//
//@author miyazawa
//@since 2008/09/08
//
//@access public
//@return mixed
//
//
//入力前の状態と入力後の状態に差があるか確認し、差があるものだけ配列に入れて返す<br>
//二次元配列版
//
//@author igarashi
//@since 2008/06/04
//
//@access public
//@return mixed
//
//
//注文パターンの名とテンプレートファイル名を取得
//
//@author miyazawa
//@since 2008/05/21
//
//@param mixed $H_Dir
//@access public
//@return
//
//
//最新のorderid（NEXTVAL）を取得<br>
//
//
//@author miyazawa
//@since 2008/07/01
//
//@access public
//@return string
//
//
//部署名の取得
//
//@author miyazawa
//@since 2008/07/14
//
//@param mixed $postid
//@access public
//@return string
//
//
//ppidの取得
//
//@author miyazawa
//@since 2008/07/14
//
//@param text $type
//@param int $carid
//@param int $cirid
//@access public
//@return string
//
//
//オーダーIDからPactidを引く<br>
//有効な価格表を引くためのpostidをmt_order_tb.postidではなくmt_order_tb.chpostid（電話の登録部署ではなく注文者の部署）にした 20081027miya<BR>
//もとい、chpostidは最終更新部署IDだった！　カラムapplypostidを追加してそっちに変更……この関数使われてない様だが一応修正しておく 20090113miya
//
//@author ishizaki
//@since 2008/09/12
//
//@param mixed $orderid
//@access public
//@return void
//
//
//買い方取得
//
//@author igarashi
//@since 2008/06/09
//
//@param int $carid
//@param boolean $eng
//@access public
//@return hash
//
//
//部署とキャリアから販売店取得
//
//@author miyazawa
//@since 2009/01/09
//
//@param int $postid
//@param int $carid
//@access public
//@return hash
//
//
//部署とキャリアから販売店担当者IDを取得
//
//@author miyazawa
//@since 2009/01/09
//
//@param int $postid
//@param int $carid
//@access public
//@return hash
//
//
//mt_order_sub_tbから電話と付属品それぞれの合計を取得する
//
//@author miyazawa
//@since 2009/10/14
//
//@param int $orderid
//@access public
//@return hash
//
//
//getBulkSubNumber
//
//@author web
//@since 2013/07/10
//
//@param mixed $orderid
//@access public
//@return void
//
//
//mt_transfer_charge_shop_tbに電話と付属品それぞれの合計を入れる
//
//@author miyazawa
//@since 2009/10/14
//
//@param int $orderid
//@param int $shopid
//@param mixed $H_cnt
//@access public
//@return hash
//
//
//orderidからpactid,pacttype取得
//
//@author miyazawa
//@since 2010/03/26
//
//@param int orderid
//@access public
//@return hash
//
//
//setFjpModel
//
//@author igarashi
//@since 2011/06/13
//
//@param mixed $fjp
//@access public
//@return void
//
//
//getRegisteredExtensionNo
//
//@author igarashi
//@since 2011/10/17
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@access public
//@return void
//
//
//getOtherCarrierList
//
//@author web
//@since 2012/09/11
//
//@access public
//@return void
//
//
//getDefaultBill
//
//@author web
//@since 2013/04/04
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getBillData
//
//@author web
//@since 2013/04/05
//
//@param mixed $O_view
//@param mixed $pactid
//@access public
//@return void
//
//
//getBillModel
//
//@author web
//@since 2013/04/04
//
//@access protected
//@return void
//
//
//getView
//
//@author web
//@since 2013/04/09
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderMainModel extends OrderModelBase {
	static ORD_TB = "mt_order_tb";
	static ORD_DET_TB = "mt_order_teldetail_tb";
	static ORD_SUB_TB = "mt_order_sub_tb";
	static MT_RECOGID = 123;

	constructor(O_db0, H_g_sess: {} | any[], site_flg = OrderMainModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
		this.NowTime = this.get_db().getNow();
		this.A_ordcol = {
			orderid: ["int", true],
			orderid_view: ["text", true],
			pactid: ["int", true],
			postid: ["int", true],
			postname: ["text", false],
			pacttype: ["text", true],
			ordertype: ["text", true],
			status: ["int", true],
			chargerid: ["int", true],
			chargername: ["text", true],
			chargermail: ["text", true],
			shopid: ["int", true],
			shopmemid: ["int", true],
			salesshopid: ["int", true],
			actorder: ["boolean", true],
			actordershopid: ["int", false],
			recdate: ["date", true],
			carid: ["int", true],
			cirid: ["int", true],
			pointradio: ["text", true],
			point: ["int", false],
			applyprice: ["int", false],
			billradio: ["text", true],
			parent: ["text", false],
			billaddress: ["text", false],
			dateradio: ["text", true],
			datefrom: ["date", false],
			dateto: ["date", false],
			datechangeradio: ["text", false],
			datechange: ["date", false],
			fee: ["text", false],
			sendhow: ["text", false],
			sendname: ["text", false],
			sendpost: ["text", false],
			zip1: ["text", false],
			zip2: ["text", false],
			addr1: ["text", false],
			addr2: ["text", false],
			building: ["text", false],
			sendtel: ["text", false],
			note: ["text", false],
			reason: ["text", false],
			shopnote: ["text", false],
			transfer: ["text", false],
			buyselid: ["int", false],
			chpostid: ["int", false],
			chpostname: ["text", false],
			nextpostid: ["int", false],
			nextpostname: ["text", false],
			anspost: ["text", false],
			ansuser: ["text", false],
			ansdate: ["date", false],
			receipt: ["int", false],
			telcnt: ["int", false],
			terminal_del: ["boolean", false],
			service: ["text", false],
			misctype: ["text", false],
			refercharge: ["int", false],
			applymail: ["text", false],
			recogmail: ["text", false],
			applypostid: ["integer", false],
			applyuserid: ["integer", false],
			destinationcode: ["text", false],
			salepost: ["text", false],
			knowledge: ["text", false],
			certificate: ["text", false],
			certificatelimit: ["text", false],
			matterno: ["text", false],
			disfee: ["text", false],
			disfeecharge: ["integer", false],
			worldtel: ["text", false],
			accountcomment: ["text", false],
			existcircuit: ["text", false],
			tdbcode: ["text", false],
			webreliefservice: ["text", false],
			smartphonetype: ["int", false],
			recogcode: ["text", false],
			pbpostcode: ["text", false],
			cfbpostcode: ["text", false],
			ioecode: ["text", false],
			coecode: ["text", false],
			commflag: ["text", false],
			recoguserid: ["int", false],
			pbpostcode_first: ["text", false],
			pbpostcode_second: ["text", false],
			cfbpostcode_first: ["text", false],
			cfbpostcode_second: ["text", false],
			pbpostname: ["text", false],
			cfbpostname: ["text", false],
			billname: ["text", false],
			billpost: ["text", false],
			receiptname: ["text", false],
			billzip1: ["text", false],
			billzip2: ["text", false],
			billaddr1: ["text", false],
			billaddr2: ["text", false],
			billbuild: ["text", false],
			billtel: ["text", false],
			billhow: ["text", false],
			division: ["int", false],
			is_not_delete_tel: ["bool", false]
		};
		this.A_subcol = {
			orderid: ["int", true],
			ordersubid: ["int", true],
			lineno: ["int", false],
			substatus: ["int", false],
			salesshopid: ["int", false],
			expectflg: ["int", false],
			expectdate: ["date", false],
			fixdate: ["date", false],
			memory: ["text", false],
			recovery: ["text", false],
			number: ["int", false],
			productid: ["int", false],
			productname: ["text", false],
			property: ["text", false],
			detail_sort: ["int", false],
			machineflg: ["boolean", true],
			anspassprice: ["int", false],
			taxprice: ["int", false],
			subtotal: ["int", false],
			fixedsubtotal: ["int", false],
			branchid: ["int", false],
			pricelistid: ["int", false],
			recdate: ["date", false],
			orgnumber: [int, false]
		};
		this.A_detcol = {
			orderid: ["int", true],
			ordersubid: ["int", true],
			arid: ["int", false],
			telno: ["text", false],
			contractor: ["text", false],
			holdername: ["text", false],
			userid: ["int", false],
			planradio: ["text", false],
			plan: ["int", false],
			packetradio: ["text", false],
			packet: ["int", false],
			option: ["text", false],
			waribiki: ["text", false],
			discounttel: ["text", false],
			passwd: ["text", false],
			pay_startdate: ["date", false],
			pay_monthly_sum: ["int", false],
			pay_frequency: ["int", false],
			mail: ["text", false],
			telusername: ["text", false],
			employeecode: ["text", false],
			text1: ["text", false],
			text2: ["text", false],
			text3: ["text", false],
			text4: ["text", false],
			text5: ["text", false],
			text6: ["text", false],
			text7: ["text", false],
			text8: ["text", false],
			text9: ["text", false],
			text10: ["text", false],
			text11: ["text", false],
			text12: ["text", false],
			text13: ["text", false],
			text14: ["text", false],
			text15: ["text", false],
			int1: ["int", false],
			int2: ["int", false],
			int3: ["int", false],
			int4: ["int", false],
			int5: ["int", false],
			int6: ["int", false],
			date1: ["date", false],
			date2: ["date", false],
			date3: ["date", false],
			date4: ["date", false],
			date5: ["date", false],
			date6: ["date", false],
			mail1: ["text", false],
			mail2: ["text", false],
			mail3: ["text", false],
			url1: ["text", false],
			url2: ["text", false],
			url3: ["text", false],
			select1: ["text", false],
			select2: ["text", false],
			select3: ["text", false],
			select4: ["text", false],
			select5: ["text", false],
			select6: ["text", false],
			select7: ["text", false],
			select8: ["text", false],
			select9: ["text", false],
			select10: ["text", false],
			memo: ["text", false],
			kousiradio: ["text", false],
			kousi: ["int", false],
			detail_sort: ["int", false],
			machineflg: ["boolean", true],
			buytype1: ["int", false],
			buytype2: ["int", false],
			formercarid: ["int", false],
			mnpno: ["text", false],
			number: ["int", false],
			telno_view: ["text", false],
			substatus: ["int", false],
			registdate: ["date", false],
			contractdate: ["date", false],
			bef_plan: ["int", false],
			bef_packet: ["int", false],
			postid: ["int", false],
			productid: ["int", false],
			simcardno: ["text", false],
			serialno: ["text", false],
			extensionno: ["text", false],
			mnp_enable_date: ["date", false]
		};
	}

	checkUpdateColumns(H_old, H_new) //20100305
	//端末1台の時、H_newはarray=>array型(2次元配列)
	//端末2台の時、H_newはarray=>array=>array型（3次元配列）
	//端末台数に関わらず、H_oldはarray=>array型(2次元配列）
	//本来、端末1台ずつ情報を渡してチェックさせる。2台同時に渡されても動かない
	//1台ずつ渡せばdetail_sortをつかって端末の個別uploadもできるから…
	//なので、checkUpdateColumnsを台数回呼ぶか、(text1などの端末別情報がなければぜったいこっち）
	//planなどの受注単位情報なら代表台目（主に1台目）だけのチェックをする（3次元配列の2時限目から渡す）
	//
	//上記の問題はRecogFormProcから電話詳細情報は台数回呼ぶことで解決した。また、RecogFormModelのmakeUpdateNewDataにもRecogFormProcから件数を渡すようにした 20100318miya
	//確認する配列の要素数が違ったら失敗
	//if(count($H_old) != count($H_new)){
	//$this->warningOut(0, "OrderModelBase::checkUpdateColumns  要素数が異なります", false, "../Menu/menu.php");
	//return false;
	//}
	//差分チェック
	//違いが一つもなかったらtrueを返す
	{
		for (var key in H_old) //oldにあるキーがnewになければ失敗
		{
			var val = H_old[key];

			if (!Array.isArray(H_new) || !(key in H_new)) //return false;
				{
					this.warningOut(0, "OrderModelBase::checkUpdateColumns  \u30AD\u30FC\u304C\u5B58\u5728\u3057\u307E\u305B\u3093" + key, false, "../Menu/menu.php");
					continue;
				}

			if (H_new[key] !== val) //型も見ないと「001」「0001」が同じに扱われるので「!=」を「!==」に修正 20091106miya
				{
					if (("" == H_new[key] || undefined == H_new[key]) && ("" == val || undefined == val)) //空白・nullの差は無視 20100319miya
						{} else {
						H_diff[key] = H_new[key];
					}
				}
		}

		if (false == (undefined !== H_diff) || H_diff.length < 1) {
			this.warningOut(0, "OrderModelBase::checkUpdateColumns  \u5DEE\u5206\u306A\u3057", false, "../Menu/menu.php");
			return true;
		}

		if (undefined !== H_diff.transfer) {
			if ("\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09\u2192\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09" == H_diff.transfer) {
				H_diff.ordertype = "Tpc";
			} else if ("\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09\u2192\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09" == H_diff.transfer) {
				H_diff.ordertype = "Tcp";
			} else if ("\u6CD5\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09\u2192\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09" == H_diff.transfer) {
				H_diff.ordertype = "Tcc";
			} else //万が一どれにも引っかからない場合はエラーにしてしまう（お金が絡むので注文させない）20090226miya
				//戻るボタンの飛び先が間違っていた 20100128miya
				{
					this.errorOut(5, "\u6CE8\u6587\u7A2E\u5225\u304C\u4E0D\u6B63\u3067\u3059", false, "../menu.php");
					return undefined;
				}
		}

		return H_diff;
	}

	checkUpdateProduct(H_sess, H_old, H_new) //orderid
	//参考金額 20100625miya
	//付属品以外
	//今入っている注文データから付属品をデリートするSQL
	//現在のステータス取得
	//detail_sortを取得
	//$dsort_sql = "SELECT MAX(detail_sort + 1) FROM (SELECT detail_sort FROM mt_order_sub_tb WHERE machineflg=false AND orderid=" . $orderid . " UNION ALL SELECT detail_sort FROM mt_order_teldetail_tb WHERE orderid=" . $orderid . ") as dsort";
	//付属品のデータ
	//$acce_sort = $H_sess[self::PUB]["telcount"];
	//$delsub_sqlで現在入っている付属品が消えるので、先にsubの中の販売店で入力した値を保持しておく 20090224miya
	//付属品の場合、手入力の分も入れる
	//追加なので「.=」 20100702miya
	//実行
	//今入っている注文データから付属品をデリート
	//付属品インサートしなおし
	{
		var orderid = H_sess[OrderMainModel.PUB].orderid;
		var refercharge = 0;

		if (true == (undefined !== H_old.tel.productname) && true == (undefined !== H_new.tel.productname)) //新旧の商品が異なっていたら販売店で入れた価格、ポイントはすべて消す 20090224miya
			//付属品リフレッシュフラグ
			//電話の台数
			//税率
			//$taxrate = $this->O_Set->excise_tax;
			//単価
			//一括と割賦で価格を取る方法変えなければいけなかった、申請時（OrderModifyModel）はできてたので揃えた 20100625miya
			//税金
			//$taxprice = (int)$anspassprice * $taxrate;
			//小計
			//$telsubtotal = (int)$anspassprice * $number;	// subtotalだったのをtelsubtotalに修正 20100625miya
			//subtotalだったのをtelsubtotalに修正 20100625miya
			//参考金額（この後付属品の小計も加算する）20100625miya
			//機種の色
			//受注内容変更でカゴの中身書き換えたときにここも変更 20100625miya
			//$updsub_sql.= "anspassprice=" . $this->get_DB()->dbQuote( (int)$anspassprice, "integer", false ) . " ";	// 受注内容変更でカゴの中身書き換えたときにここも変更 20100625miya
			//受注内容変更でカゴの中身書き換えたときにここも変更 20100625miya
			//mt_order_tbへのアップデートSQL
			//後から追加されるので「;」打っておく 20100702miya
			{
				var acce_refresh_flg = false;

				if (H_old.tel.productname != H_new.tel.productname) //割賦ご利用ポイント
					//割賦代金
					//販売店価格
					//販売店ポイント
					//販売店価格
					//販売店ポイント
					//割賦月額
					//実行
					{
						acce_refresh_flg = true;
						var refresh_ord_sql = "UPDATE mt_order_tb SET ";
						refresh_ord_sql += "pay_point=null, ";
						refresh_ord_sql += "paymentprice=null ";
						refresh_ord_sql += "WHERE orderid=" + orderid;
						var refresh_sub_sql = "UPDATE mt_order_sub_tb SET ";
						refresh_sub_sql += "saleprice=null, ";
						refresh_sub_sql += "shoppoint=null ";
						refresh_sub_sql += "WHERE orderid=" + orderid;
						var refresh_det_sql = "UPDATE mt_order_teldetail_tb SET ";
						refresh_det_sql += "saleprice=null, ";
						refresh_det_sql += "shoppoint=null, ";
						refresh_det_sql += "pay_monthly_sum=null ";
						refresh_det_sql += "WHERE orderid=" + orderid;
						this.get_DB().exec(refresh_ord_sql);
						this.get_DB().exec(refresh_sub_sql);
						this.get_DB().exec(refresh_det_sql);
					}

				var upddet_sql = "UPDATE mt_order_teldetail_tb SET ";

				if ("" == H_new.tel.productid) {
					upddet_sql += "productid=null, ";
				} else if (true == (undefined !== H_new.tel.productid) && true == is_numeric(H_new.tel.productid)) {
					upddet_sql += "productid=" + this.get_DB().dbQuote(H_new.tel.productid, "integer", false) + ", ";
				}

				upddet_sql += "pay_monthly_sum=" + this.get_DB().dbQuote(H_new.tel.onepay, "integer", false) + ", ";
				upddet_sql += "pay_frequency=" + this.get_DB().dbQuote(H_new.tel.paycnt, "integer", false) + ", ";
				upddet_sql += "buytype1=" + this.get_DB().dbQuote(H_new.tel.buytype1, "integer", false) + ", ";
				upddet_sql += "buytype2=" + this.get_DB().dbQuote(H_new.tel.buytype2, "integer", false) + " ";
				upddet_sql += "WHERE machineflg=true AND orderid=" + orderid;

				if (1 < +H_sess[OrderMainModel.PUB].telcount) //バグってたので修正（$telcountになってた）20090602miya
					{
						var number = +H_sess[OrderMainModel.PUB].telcount;
					} else {
					number = 1;
				}

				var taxrate = MtTax.getTaxRate() / 100;
				var anspassprice = undefined;

				if (H_new.tel.paycnt > 1) {
					if (H_new.tel.downmoney != undefined) //$anspassprice = $H_new["tel"]["downmoney"] != null;
						{
							anspassprice = H_new.tel.downmoney;
						} else {
						anspassprice = 0;
					}
				} else {
					anspassprice = H_new.tel.totalprice;
				}

				var taxprice = MtTax.taxPrice(anspassprice);
				var telsubtotal = MtRounding.tweek(anspassprice) * number;
				refercharge = telsubtotal;
				var property = "";

				if (H_sess.SELF.color != "") {
					property = H_sess.SELF.color;
				}

				if ("" != H_new.tel.productid && "" != property) {
					var branch_sql = "SELECT branchid FROM product_branch_tb WHERE productid=" + H_new.tel.productid + " AND property='" + property + "'";
					var branchid = this.get_DB().queryOne(branch_sql);
				}

				var updsub_sql = "UPDATE mt_order_sub_tb SET ";
				updsub_sql += "productname=" + this.get_DB().dbQuote(H_new.tel.productname, "text", false) + ", ";
				updsub_sql += "productid=" + this.get_DB().dbQuote(H_new.tel.productid, "integer", false) + ", ";
				updsub_sql += "branchid=" + this.get_DB().dbQuote(branchid, "integer", false) + ", ";
				updsub_sql += "taxprice=" + this.get_DB().dbQuote(taxprice, "integer", false) + ", ";
				updsub_sql += "subtotal=" + this.get_DB().dbQuote(telsubtotal, "integer", false) + ", ";
				updsub_sql += "fixedsubtotal=" + this.get_DB().dbQuote(telsubtotal, "integer", false) + ", ";
				updsub_sql += "anspassprice=" + this.get_DB().dbQuote(MtRounding.tweek(anspassprice), "integer", false) + " ";
				updsub_sql += "WHERE machineflg=true AND orderid=" + orderid;
				var updord_sql = "UPDATE mt_order_tb SET ";
				updord_sql += "buyselid=" + this.get_DB().dbQuote(H_new.tel.buyselid, "integer", false) + " ";
				updord_sql += "WHERE orderid=" + orderid + ";";
			}

		var A_beforedel_subcol = ["ordersubid", "lineno", "substatus", "salesshopid", "expectflg", "expectdate", "fixdate", "finishdate", "shoppoint", "memory", "recovery", "number", "productid", "detail_sort", "subcomment", "machineflg", "anspassprice", "saleprice", "deliverydate", "totalprice", "fixedtotal", "taxprice", "subtotal", "fixedtaxprice", "fixedsubtotal", "recdate", "productname", "property", "branchid", "pricelistid", "stockflg", "detail_sort"];
		var beforedel_sql = "SELECT " + join(",", A_beforedel_subcol) + " FROM mt_order_sub_tb WHERE machineflg=false AND orderid=" + orderid + " ORDER BY ordersubid";
		var H_beforedelacce = this.get_DB().queryHash(beforedel_sql);
		var delsub_sql = "DELETE FROM mt_order_sub_tb where machineflg=false AND orderid=" + orderid;
		var stat_sql = "SELECT status FROM mt_order_tb WHERE orderid=" + orderid;
		var status = this.get_DB().queryOne(stat_sql);
		var dsort_sql = "SELECT MAX(detail_sort + 1) FROM mt_order_teldetail_tb WHERE orderid=" + orderid;
		var detailsort = this.get_DB().queryOne(dsort_sql);
		var H_data = Array();
		var acce_i = 0;
		var acce_sort = detailsort;
		var H_oldacce = Array();

		if (false == acce_refresh_flg) {
			if (true == Array.isArray(H_old.acce)) {
				{
					let _tmp_0 = H_old.acce;

					for (var key in _tmp_0) {
						var val = _tmp_0[key];
						H_oldacce[val.productname] = {
							saleprice: val.saleprice,
							shoppoint: val.shoppoint,
							fixedsubtotal: val.fixedsubtotal
						};
					}
				}
			}
		}

		{
			let _tmp_1 = H_new.acce;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				if (true == (undefined !== H_sess.SELF["acce" + val.productid]) && 0 != H_sess.SELF["acce" + val.productid] || true == (undefined !== H_sess.SELF["acce" + val.productname]) && 0 != H_sess.SELF["acce" + val.productname]) //単価
					//数量 付属品のときは個々の数 20100630miya
					//参考金額に加算する 20100625miya
					//付属品のbranchidも入れる 20080105miya
					//orderid
					//ordersubid
					//lineno
					//substatus
					//salesshopid
					//expectflg
					//expectdate
					//fixdate
					//memory
					//recovery
					//numberには付属品は入力された数を、そうでなければ電話の台数を入れなければいけない（そうしないと付属品以外で複数台のときも1になってしまう） 20090602miya
					//productid
					//productname
					//property nullで上書きしてたので備考が消えてたのを修正 20090826miya
					//detail_sort
					//machineflg
					//anspassprice
					//taxprice
					//subtotal
					//fixedsubtotal
					//branchid
					//pricelistid
					//recdate
					//20130606
					//次の括弧の外にあったが、注文内容変更で付属品を抜いたとき、detail_sortとorderid,linenoが歯抜けになるので括弧の中に入れた 20090323miya
					{
						anspassprice = undefined;

						if (val.totalprice > 0) {
							anspassprice = val.totalprice;
						}

						taxprice = MtTax.taxPrice(anspassprice);

						if ("A" == H_sess[OrderMainModel.PUB].type) {
							if (true == is_numeric(val.productid)) {
								number = H_sess.SELF["acce" + val.productid];
							} else {
								number = H_sess.SELF["acce" + val.productname];
							}
						}

						var subtotal = MtRounding.tweek(anspassprice) * number;
						refercharge += subtotal;
						var acce_branchid = undefined;

						if ("" != val.productid) {
							var acce_branch_sql = "SELECT branchid FROM product_branch_tb WHERE productid=" + val.productid + " AND delflg=false";
							acce_branchid = this.get_DB().queryOne(acce_branch_sql);
						}

						A_row.push(this.get_DB().dbQuote(orderid, "integer", true));
						A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
						A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
						A_row.push(this.get_DB().dbQuote(status, "integer", true));
						A_row.push(this.get_DB().dbQuote(H_sess[OrderMainModel.PUB].shopid, "integer", false));
						A_row.push(0);
						A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
						A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
						A_row.push(this.get_DB().dbQuote(H_sess.SELF.memory, "text", false));
						A_row.push(this.get_DB().dbQuote(H_sess.SELF.recovery, "text", false));

						if ("A" == H_sess[OrderMainModel.PUB].type) {
							if (true == is_numeric(val.productid)) //number
								//number
								{
									A_row.push(this.get_DB().dbQuote(H_sess.SELF["acce" + val.productid], "integer", false));
									var orgNumber = this.get_DB().dbQuote(H_sess.SELF["acce" + val.productid], "integer", false);
								} else //number
								//number
								{
									A_row.push(this.get_DB().dbQuote(H_sess.SELF["acce" + val.productname], "integer", false));
									orgNumber = this.get_DB().dbQuote(H_sess.SELF["acce" + val.productname], "integer", false);
								}
						} else //number
							//number
							{
								A_row.push(this.get_DB().dbQuote(number, "integer", false));
								orgNumber = this.get_DB().dbQuote(number, "integer", false);
							}

						A_row.push(this.get_DB().dbQuote(val.productid, "integer", false));
						A_row.push(this.get_DB().dbQuote(val.productname, "text", false));
						A_row.push(this.get_DB().dbQuote(val.property, "text", false));
						A_row.push(this.get_DB().dbQuote(acce_sort, "integer", false));
						A_row.push("false");
						A_row.push(this.get_DB().dbQuote(anspassprice, "integer", false));
						A_row.push(this.get_DB().dbQuote(taxprice, "integer", false));
						A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
						A_row.push(this.get_DB().dbQuote(subtotal, "integer", false));
						A_row.push(this.get_DB().dbQuote(acce_branchid, "integer", false));
						A_row.push(this.get_DB().dbQuote(val.pricelistid, "integer", false));
						A_row.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", false));
						A_row.push(orgNumber);
						H_data.push(A_row);
						delete A_row;
						acce_i++;
						acce_sort++;
					}
			}
		}

		if ("A" == H_sess[OrderMainModel.PUB].type && (undefined != H_sess[OrderMainModel.PUB].free_acce && 0 < H_sess[OrderMainModel.PUB].free_acce.length)) {
			{
				let _tmp_2 = H_sess[OrderMainModel.PUB].free_acce;

				for (var free_key in _tmp_2) //productname 半角を全角に置換 20100630miya
				//0件だと消えるように修正 20090825miya
				{
					var free_val = _tmp_2[free_key];
					free_val.free_productname = str_replace(" ", "\u3000", free_val.free_productname);

					if (0 < free_val.free_count) //orderid
						//ordersubid
						//lineno
						//substatus
						//salesshopid
						//expectflg
						//expectdate
						//fixdate
						//memory
						//recovery
						//number
						//productid
						//productname 半角スペースを全角に置換 20100623miya
						//property
						//detail_sort
						//machineflg
						//anspassprice
						//taxprice
						//subtotal
						//fixedsubtotal
						//branchid
						//pricelistid
						//recdate
						//20130606
						{
							A_row.push(this.get_DB().dbQuote(orderid, "integer", true));
							A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
							A_row.push(this.get_DB().dbQuote(acce_i + 1, "integer", true));
							A_row.push(this.get_DB().dbQuote(status, "integer", true));
							A_row.push(this.get_DB().dbQuote(H_sess[OrderMainModel.PUB].shopid, "integer", false));
							A_row.push(0);
							A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
							A_row.push(this.get_DB().dbQuote(undefined, "timestamp", false));
							A_row.push(this.get_DB().dbQuote(H_sess.SELF.memory, "text", false));
							A_row.push(this.get_DB().dbQuote(H_sess.SELF.recovery, "text", false));
							A_row.push(this.get_DB().dbQuote(free_val.free_count, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(free_val.free_productname, "text", false));
							A_row.push(this.get_DB().dbQuote(free_val.free_property, "text", false));
							A_row.push(this.get_DB().dbQuote(acce_sort, "integer", false));
							A_row.push("false");
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(undefined, "integer", false));
							A_row.push(this.get_DB().dbQuote(MtDateUtil.getNow(), "timestamp", false));
							A_row.push(this.get_DB().dbQuote(free_val.free_count, "integer", false));
							H_data.push(A_row);
							delete A_row;
							acce_i++;
							acce_sort++;
						}
				}
			}
		} else if ("M" == H_sess[OrderMainModel.PUB].type) {
			var numCnt = 0;

			if (is_numeric(H_sess.SELF.number)) {
				numCnt = H_sess.SELF.number;
			}

			var miscnumbersql = "UPDATE mt_order_sub_tb " + "SET " + "orgnumber=" + this.get_DB().dbQuote(numCnt, "int", true) + " " + "WHERE " + "orderid=" + orderid + " AND detail_sort=0";
		}

		updord_sql += "UPDATE mt_order_tb SET ";
		updord_sql += "refercharge=" + this.get_DB().dbQuote(refercharge, "integer", false) + " ";
		updord_sql += "WHERE orderid=" + orderid;

		if (undefined != upddet_sql) //mt_order_teldetail_tbへのアップデート
			{
				this.get_DB().exec(upddet_sql);
			}

		if (undefined != updsub_sql) //mt_order_sub_tbへのアップデート
			{
				this.get_DB().exec(updsub_sql);
			}

		if (undefined != updord_sql) //mt_order_tbへのアップデート
			{
				this.get_DB().exec(updord_sql);
			}

		this.get_DB().exec(delsub_sql);

		if (true == (undefined !== H_data) && 0 < H_data.length) //付属品インサート
			//subの中の販売店で入力した値を戻す 20090224miya
			{
				for (var key in H_data) {
					var A_val = H_data[key];
					this.ordsub += "INSERT INTO mt_order_sub_tb (" + Object.keys(this.A_subcol).join(",") + ") " + "VALUES(" + A_val.join(",") + "); ";
				}

				this.get_DB().exec(this.ordsub);

				if (false == acce_refresh_flg) {
					if (true == Array.isArray(H_oldacce)) //実行
						{
							var acsql = "";

							for (var prname in H_oldacce) {
								var prval = H_oldacce[prname];
								acsql += "UPDATE mt_order_sub_tb SET ";
								acsql += "saleprice=" + this.get_DB().dbQuote(prval.saleprice, "integer", false) + ",";
								acsql += "shoppoint=" + this.get_DB().dbQuote(prval.shoppoint, "integer", false) + ",";
								acsql += "fixedsubtotal=" + this.get_DB().dbQuote(prval.fixedsubtotal, "integer", false) + " ";
								acsql += "WHERE orderid=" + orderid + " AND machineflg=false AND productname='" + prname + "'; ";
							}

							if ("" != acsql) {
								this.get_DB().exec(acsql);
							}
						}
				}
			}

		if (undefined !== miscnumbersql) {
			this.get_DB().exec(miscnumbersql);
		}

		if (true == Array.isArray(H_beforedelacce) && true == 0 < H_beforedelacce.length) {
			for (var akey in H_beforedelacce) {
				var aval = H_beforedelacce[akey];
				var backsql = "";

				if ("" != aval.ordersubid) {
					backsql = "UPDATE mt_order_sub_tb SET ";
					backsql += "expectdate=" + this.get_DB().dbQuote(aval.expectdate, "timestamp", false) + ",";
					backsql += "fixdate=" + this.get_DB().dbQuote(aval.fixdate, "timestamp", false) + ",";
					backsql += "finishdate=" + this.get_DB().dbQuote(aval.finishdate, "timestamp", false) + ",";
					backsql += "deliverydate=" + this.get_DB().dbQuote(aval.deliverydate, "timestamp", false) + ",";
					backsql += "fixedtotal=" + this.get_DB().dbQuote(aval.fixedtotal, "integer", false) + ",";
					backsql += "fixedtaxprice=" + this.get_DB().dbQuote(aval.fixedtaxprice, "integer", false) + ", ";
					backsql += "detail_sort=" + this.get_DB().dbQuote(aval.detail_sort, "int", true) + " ";
					backsql += " WHERE orderid=" + orderid + " AND machineflg=false AND ordersubid=" + aval.ordersubid;
				}

				if ("" != backsql) {
					this.get_DB().exec(backsql);
				}
			}
		}
	}

	checkUpdateColumns2D(H_old, H_new) //これ、ものすごく動かない気がする。 080702iga
	{
		if (H_old.length != H_new.length) {
			this.warningOut(0, "OrderModelBase::checkUpdateColumns  \u8981\u7D20\u6570\u304C\u7570\u306A\u308A\u307E\u3059", false, "../Menu/menu.php");
			return false;
		}

		for (var subid in H_old) {
			var subval = H_old[subid];

			if (subval.length != H_new[subid].length) {
				this.warningOut(0, "OrderModelBase::checkUpdateColumns  2\u6B21\u5143\u76EE\u306E\u8981\u7D20\u6570\u304C\u7570\u306A\u308A\u307E\u3059", false, "../Menu/menu.php");
				return false;
			}

			for (var key in subval) {
				var val = subval[key];

				if (false == (undefined !== H_new[subid][key])) {
					this.warningOut(0, "OrderModelBase::checkUpdateColumns  \u30AD\u30FC\u304C\u5B58\u5728\u3057\u307E\u305B\u3093" + key, false, "../Menu/menu.php");
					return false;
				}

				if (val != H_new[subid][key]) {
					H_diff[subid][key] = val;
				}
			}
		}

		if (false == (undefined !== H_diff) || H_diff.length < 1) {
			this.warningOut(0, "OrderModelBase::checkUpdateColumns  \u5DEE\u5206\u306A\u3057" + key, false, "../Menu/menu.php");
			return true;
		}

		return H_diff;
	}

	getOrderPatternName(H_Dir, actflg = false) //セッション消えたときのエラーキャッチ 20090812miya
	//英語化権限 20090210miya
	{
		if (false == (undefined !== H_Dir.type) || false == (undefined !== H_Dir.carid) || false == (undefined !== H_Dir.cirid)) {
			this.errorOut(8, "OrderMainModel::getOrderPatternName  \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u306A\u3044", false, "../Menu/menu.php");
		}

		if (undefined !== H_Dir.orderid && !(undefined !== this.H_G_Sess.pactid) && !(undefined !== this.H_G_Sess.postid)) {
			var sql = "SELECT pactid, postid FROM mt_order_tb WHERE orderid=" + H_Dir.orderid;
			var temp = this.get_DB().queryRowHash(sql);
			var pactid = temp.pactid;
			var postid = temp.postid;
		} else //代行注文では代行先の部署のpostidを取得する 20090709miya
			{
				if (!(undefined !== H_Dir.orderid) && "shop" == MT_SITE && undefined !== H_Dir.recogpostid) {
					pactid = this.H_G_Sess.pactid;
					postid = H_Dir.recogpostid;

					if (is_numeric(postid)) {
						postid = H_Dir.recogpostid;
						sql = "SELECT COUNT(*) FROM shop_relation_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND postid=" + this.get_DB().dbQuote(postid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(this.H_G_Sess.shopid, "int", true) + " AND carid=" + this.get_DB().dbQuote(H_Dir.carid, "int", true);

						if (1 > this.get_DB().queryOne(sql)) {
							postid = this.H_G_Sess.postid;
						}
					}
				} else if (undefined !== H_Dir.orderid && preg_match("/^\\/MTRecog/", _SERVER.PHP_SELF)) //承認先はorderから部署取らないとコケる
					{
						sql = "SELECT pactid, postid, applypostid, carid FROM mt_order_tb WHERE orderid=" + this.get_DB().dbQuote(H_Dir.orderid, "int", true);
						temp = this.get_DB().queryRowHash(sql);
						pactid = temp.pactid;
						postid = temp.applypostid;
						var relchksql = "SELECT count(*) FROM shop_relation_tb WHERE pactid=" + pactid + " AND postid=" + postid + " AND carid=" + temp.carid;

						if (1 > this.get_DB().queryOne(relchksql)) {
							postid = temp.postid;
						}
					} else {
					pactid = this.H_G_Sess.pactid;
					postid = this.H_G_Sess.postid;
				}
			}

		if ("ENG" == this.H_G_Sess.language) {
			var ptnname_str = "ptn.ptnname_eng AS ptnname,";
			var carname_str = "car.carname_eng AS carname ";
		} else {
			ptnname_str = "ptn.ptnname,";
			carname_str = "car.carname ";
		}

		sql = "SELECT " + "shcar.shopid," + "shcar.arid," + "shrel.memid," + ptnname_str + "ptn.tplfile," + "ptn.ppid," + carname_str + "FROM " + "mt_order_pattern_tb ptn INNER JOIN shop_relation_tb shrel ON shrel.carid=ptn.carid " + "INNER JOIN shop_carrier_tb shcar ON ptn.carid=shcar.carid " + "INNER JOIN carrier_tb car on ptn.carid=car.carid " + "WHERE " + "shrel.pactid = " + pactid + " " + "AND shrel.postid = " + postid + " " + "AND shrel.shopid = shcar.shopid " + "AND ptn.type='" + H_Dir.type + "' AND ptn.carid=" + H_Dir.carid + " AND ptn.cirid=" + H_Dir.cirid;
		return this.get_DB().queryRowHash(sql);
	}

	getNextOrderid() {
		var sql = "SELECT NEXTVAL('order_tb_orderid_seq');";
		return this.get_db().queryOne(sql);
	}

	getPostNameString(postid) {
		var H_post = PostModel.getPostData(postid);
		var postname = H_post.postname;

		if ("" != H_post.userpostid) {
			postname += "(" + H_post.userpostid + ")";
		}

		return postname;
	}

	getPpidFromOrderPtn(type, carid, cirid) {
		var ppid_sql = "SELECT ppid FROM mt_order_pattern_tb WHERE type='" + type + "' AND carid=" + carid + " AND cirid=" + cirid;
		return this.get_db().queryOne(ppid_sql);
	}

	getPactPostidFromOrderid(orderid) {
		return this.getDB().queryRowHash("SELECT pactid, applypostid AS postid FROM mt_order_tb WHERE orderid = " + this.getDB().dbQuote(orderid, "integer", true));
	}

	getPurchaseId(carid, eng = false, cirid = undefined) //英語化対応 20090311miya
	//$sql = "SELECT buyselid, " . $buyselnamestr . " FROM buyselect_tb " .
	//"WHERE ordviewflg=true AND carid=" .$carid. " ORDER BY sort";
	//20200607 hanashima 5G対応
	//ドコモとauで5Gの場合
	{
		if (true == eng) {
			var buyselnamestr = "buyselname_eng AS buyselname";
		} else {
			buyselnamestr = "buyselname";
		}

		var sql = "SELECT buyselid, " + buyselnamestr + " FROM buyselect_tb";

		if (cirid == 96 && carid == 1 || cirid == 97 && (carid = 3)) {
			sql += " WHERE ordviewflg=true AND carid=" + carid + " AND buyselname = '5G' ORDER BY sort";
		} else {
			sql += " WHERE ordviewflg=true AND carid=" + carid + " AND buyselname != '5G' ORDER BY sort";
		}

		return this.get_DB().queryAssoc(sql);
	}

	getShopIdFromPostId(postid, carid) {
		var sql = "SELECT shopid FROM shop_relation_tb " + "WHERE postid=" + postid + " AND carid=" + carid;
		return this.get_DB().queryOne(sql);
	}

	getMemIdFromPostId(postid, carid, shopid) {
		var sql = "SELECT memid FROM shop_relation_tb " + "WHERE postid=" + postid + " AND carid=" + carid + " " + "AND shopid=" + shopid;
		return this.get_DB().queryOne(sql);
	}

	getSubNumber(orderid) {
		var sql = "SELECT machineflg,SUM(number) FROM mt_order_sub_tb WHERE orderid=" + orderid + " GROUP BY machineflg";
		return this.get_DB().queryHash(sql);
	}

	getBulkSubNumber(orderid) {
		var sql = "SELECT machineflg,COUNT(detail_sort) as sum FROM mt_order_teldetail_tb WHERE orderid=" + orderid + " AND substatus!=230 GROUP BY machineflg";
		return this.get_DB().queryHash(sql);
	}

	putSubNumber(orderid, shopid, H_cnt = Array()) //既にデータがあるか
	//条件にshopidも必要だったので修正 20091124miya
	{
		var sql = "SELECT count(orderid) FROM mt_transfer_charge_shop_tb WHERE orderid=" + orderid + " AND shopid=" + shopid;
		var ret = this.get_DB().queryOne(sql);
		var maccnt = 0;
		var acccnt = 0;

		if (true == 0 < H_cnt.length) {
			for (var key in H_cnt) {
				var val = H_cnt[key];

				if (true == val.machineflg) {
					maccnt = val.sum;
				} else if (false == val.machineflg) {
					acccnt = val.sum;
				}
			}

			if ("" != ret && 1 == ret) {
				var put_sql = "UPDATE mt_transfer_charge_shop_tb SET maccnt=" + maccnt + ", acccnt=" + acccnt + " WHERE orderid=" + orderid;
			} else {
				put_sql = "INSERT INTO mt_transfer_charge_shop_tb(orderid,shopid,maccnt,acccnt,recdate) " + "VALUES(" + orderid + "," + shopid + "," + maccnt + "," + acccnt + ", '" + MtDateUtil.getNow() + "')";
			}

			this.get_DB().exec(put_sql);
		}
	}

	getPactFromOrder(orderid) {
		var sql = "SELECT pa.pactid,pa.type FROM pact_tb pa LEFT JOIN mt_order_tb ord ON pa.pactid=ord.pactid  " + "WHERE ord.orderid=" + orderid;
		return this.get_DB().queryRowHash(sql);
	}

	setfjpModelObject(fjp) {
		require("model/Order/fjpModel.php");

		if (fjp instanceof fjpModel) {
			this.O_fjp = fjp;
		}
	}

	getRegisteredExtensionNo(pactid, carid, telno) {
		var sql = "SELECT extensionno FROM tel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND telno=" + this.get_DB().dbQuote(telno, "text", true);
		return this.get_DB().queryOne(sql);
	}

	getOtherCarrierList(pactid, postid, mesflag = false, cirflag = false) {
		var sql = "select shopid from shop_relation_tb where postid=" + postid + " and carid=" + this.O_Set.car_other;
		var shopid = this.get_DB().queryOne(sql);
		this.O_Set.loadConfig("H_order_pattern");
		var carsql = "";
		var authcarrier = undefined;

		if (this.O_Set.existsKey("orderpattern_pact0")) {
			var defSetting = this.O_Set.orderpattern_pact0.othercarid;

			if (undefined !== defSetting.othercarid) {
				authcarrier = defSetting.othercarid;
			}
		}

		var key = "orderpattern_pact" + pactid;

		if (this.O_Set.existsKey(key)) {
			var pactSetting = this.O_Set[key];

			if (undefined !== pactSetting.othercarid) {
				authcarrier = pactSetting.othercarid;
			}
		}

		var col = "a.carname ";

		if (cirflag) {
			col = "a.carname || '(' || i.cirname || ')' ";
		}

		if (is_numeric(shopid) && (!!authcarrier || "0" === authcarrier)) {
			sql = "SELECT " + "a.carid || '-' || i.cirid, " + col + "FROM " + "carrier_tb a " + "INNER JOIN circuit_tb i ON a.carid=i.carid " + "INNER JOIN shop_carrier_tb sc ON a.carid=sc.carid " + "WHERE " + "sc.shopid=" + this.get_DB().dbQuote(shopid, "int", true) + " AND (i.cirname!='\u305D\u306E\u4ED6' OR (i.cirname='\u305D\u306E\u4ED6' AND a.carname='\u305D\u306E\u4ED6')) " + " AND a.carid NOT IN (0, " + this.O_Set.car_docomo + ", " + this.O_Set.car_willcom + ", " + this.O_Set.car_au + ", " + this.O_Set.car_softbank + ", " + this.O_Set.car_emobile + ", " + this.O_Set.car_smartphone + ") ";

			if ("0" !== authcarrier) {
				sql += " AND a.carid IN (" + authcarrier + ") ";
			}

			sql += " ORDER BY a.carid, i.cirid";

			if (mesflag) {
				return {
					"": "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
				} + this.get_DB().queryAssoc(sql);
			}

			return this.get_DB().queryAssoc(sql);
		}

		return Array();
	}

	getDefaultBill(O_view, pactid) {
		var bill = this.getBillModel(O_view);
		var data = bill.getDefaultBill(pactid);
		data.zip = data.zip1 + "-" + data.zip2;
		return data;
	}

	getBillData(O_view, pactid) {
		var bill = this.getBillModel(O_view);
		var data = bill.getBillData(pactid);
		data.zip = data.zip1 + "-" + data.zip2;
		return data;
	}

	getBillModel(viewObj = undefined) {
		require("model/Order/BillingModelBase.php");

		if (!this.billModel instanceof BillingModelBase) {
			this.billModel = new BillingModelBase();
		}

		if ("object" === typeof viewObj) {
			this.billModel.setView(viewObj);
		}

		return this.billModel;
	}

	getView() {
		return this.view;
	}

	__destruct() {
		super.__destruct();
	}

};