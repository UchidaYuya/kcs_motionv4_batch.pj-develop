//
//承認詳細Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/08/08
//@uses OrderModel
//@uses OrderUtil
//
//
//
//承認詳細Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/08/08
//

require("OrderUtil.php");

require("OrderDetailFormModel.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author igarashi
//@since 2008/08/08
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//update時に比較するため注文データを整形する（元々のデータ）
//
//@author miyazawa
//@since 2008/09/02
//
//@param mixed $H_order
//@access public
//@return mixed
//
//
//update時に比較するため注文データを整形する（新しいCGIパラメータ）
//
//@author miyazawa
//@since 2008/09/02
//
//@param mixed $H_param
//@param mixed $H_product
//@param string $tbl
//@param integer $telcnt プラン変更は電話詳細情報が1件しか来ないので件数渡す必要あり 20100318miya
//@access public
//@return mixed
//
//
//電話詳細情報が消える現象をキャッチ
//
//@author miyazawa
//@since 2010/03/18
//
//@param mixed $H_olddet
//@param mixed $H_upddet
//@access public
//@return mixed
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/04
//
//@access public
//@return void
//
class RecogFormModel extends OrderDetailFormModel {
	constructor(O_db0, H_g_sess, site_flg = RecogFormModel.SITE_USER) //mt_order_tbで更新するカラム
	//mt_order_sub_tbで更新するカラム
	//mt_order_det_tbで更新するカラム
	//詳細情報として画面から電話ごとのCGIパラメータを受け取るカラム
	{
		super(O_db0, H_g_sess, site_flg);
		this.A_ordupdcol = {
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
			transfer: ["text", false],
			terminal_del: ["boolean", false],
			service: ["text", false],
			misctype: ["text", false],
			disfee: ["text", false],
			disfeecharge: ["int", false],
			webreliefservice: ["text", false],
			smartphonetype: ["int", false],
			recogcode: ["text", false],
			pbpostcode: ["text", false],
			pbpostcode_first: ["text", false],
			pbpostcode_second: ["text", false],
			cfbpostcode: ["text", false],
			cfbpostcode_first: ["text", false],
			cfbpostcode_second: ["text", false],
			ioecode: ["text", false],
			coecode: ["text", false],
			commflag: ["text", false],
			recoguserid: ["text", false],
			chargermail: ["text", false],
			is_not_delete_tel: ["bool", false]
		};
		this.A_subupdcol = {
			memory: ["text", false],
			recovery: ["text", false],
			property: ["text", false],
			branchid: ["int", false],
			productname: ["text", false]
		};
		this.A_detupdcol = {
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
			mnpno: ["text", false],
			mnp_enable_date: ["date", false]
		};
		this.A_detupdcol_cgi = ["mail", "telusername", "employeecode", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "select1", "select2", "select3", "select4", "select5", "select6", "select7", "select8", "select9", "select10", "memo", "kousiradio", "kousi", "mnpno", "mnp_enable_date"];
	}

	makeUpdateOldData(H_order: {} | any[], tbl) {
		var H_old = Array();

		if (tbl == "ord") //mt_order_tbで更新するカラムを回す
			{
				var A_collist = this.A_ordupdcol;

				for (var col in A_collist) {
					var quote = A_collist[col];
					H_old[col] = H_order.order[col];
				}
			} else if (tbl == "sub") //mt_order_tbで更新するカラムを回す
			{
				A_collist = this.A_subupdcol;

				for (var col in A_collist) {
					var quote = A_collist[col];
					H_old[col] = H_order.sub[0][col];
				}
			} else if (tbl == "det") {
			A_collist = this.A_detupdcol;
			{
				let _tmp_0 = H_order.sub;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (true == val.machineflg) //mt_order_teldetail_tbで更新するカラムを回す
						//break;	// 電話が複数件でsubが2行以上あると件数分のH_oldが出来てしまうので1回で抜ける 20090327miya
						//これがあるせいで逆に複数件で更新できなくなっていた 20090529miya
						{
							for (var col in A_collist) //公私分計
							{
								var quote = A_collist[col];

								if (col == "kousi") {
									H_old[key][col] = val.kousiid;
								} else {
									H_old[key][col] = val[col];
								}
							}
						}
				}
			}
		} else {
			return false;
		}

		return H_old;
	}

	makeUpdateNewData(H_sess: {} | any[], H_product: {} | any[] = Array(), tbl, telcnt = undefined) {
		var H_param = H_sess.SELF;
		var H_new = Array();

		if (tbl == "ord") //mt_order_tbで更新するカラムを回す
			{
				var A_collist = this.A_ordupdcol;

				for (var col in A_collist) //日付を整形しておく
				{
					var quote = A_collist[col];

					if (col == "datefrom") {
						if (Array.isArray(H_param[col]) == true && H_param[col].Y != "") {
							H_param[col] = OrderUtil.adjustdate(H_param[col].Y, H_param[col].m, H_param[col].d, H_param[col].H + 0);
						} else {
							H_param[col] = undefined;
						}
					}

					if (col == "dateto") {
						if (Array.isArray(H_param[col]) == true && H_param[col].Y != "") {
							H_param[col] = OrderUtil.adjustdate(H_param[col].Y, H_param[col].m, H_param[col].d, H_param[col].H + 0);
						} else {
							H_param[col] = undefined;
						}
					}

					if (col == "datechange") {
						if (Array.isArray(H_param[col]) == true && H_param[col].Y != "") //時間の取得(AUの場合、時間の名前が違うので修正・・)	20171003date
							{
								var hour = undefined !== H_param[col].H ? H_param[col].H : H_param.datechangeH;
								H_param[col] = OrderUtil.adjustdate(H_param[col].Y, H_param[col].m, H_param[col].d, hour);
							} else {
							H_param[col] = undefined;
						}
					}

					if (col == "terminal_del" && H_param[col] == "do") {
						H_param[col] = true;
					} else if (H_param[col] == "dont") {
						H_param[col] = false;
					}

					if (col == "terminal_del") {
						if (!(undefined !== H_param[col]) || is_null(H_param[col])) {
							H_param[col] = true;
						}
					}

					if (col == "service" && Array.isArray(H_param[col]) == true) {
						H_param[col] = serialize(H_param[col]);
					}

					if (col == "disfee" && H_param[col] != "charge") {
						H_param.disfeecharge = undefined;
					}

					var A_reason_mongon = ["\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u7533\u8ACB/\u6CE8\u6587\u5185\u5BB9\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u5099\u8003\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "Leave any comments for the store in the Content of Order/Request column.", "Leave any comments for the store in the Notes column."];

					if (col == "reason" && true == (-1 !== A_reason_mongon.indexOf(H_param[col]))) {
						H_param.reason = undefined;
					}

					if ("smartphonetype" == col) {
						H_param.smartphonetype = undefined;

						if (is_numeric(H_product.tel.productid)) {
							H_param.smartphonetype = this.convertSmartPhoneTypeId(H_product.tel.productid);
						}
					}

					if ("recogcode" == col) {
						H_param[col] = H_param.h_recogcode;
					}

					if ("recoguserid" == col) {
						H_param[col] = H_param.h_recoguserid;
					}

					if ("recoguserid" == col) {
						H_param[col] = H_param.h_recoguserid;
					}

					if ("pbpostcode" == col) {
						H_param[col] = H_param.pbpostcode_first + H_param.pbpostcode_second;
					}

					if ("cfbpostcode" == col) {
						H_param[col] = H_param.cfbpostcode_first + H_param.cfbpostcode_second;
					}

					if ("commflag" == col) {
						H_param[col] = H_param.fjpcommflag;
					}

					if ("is_not_delete_tel" == col) //値が設定されているかを確認しよう(残す残さないを設定する権限がない場合、値がない)
						{
							if (undefined !== H_param.is_not_delete_tel) //残す残さない権限が設定されており、フォームが存在している
								{
									H_param[col] = H_param.is_not_delete_tel === "1" ? true : false;
								} else //フォームがないため値がない。そのため、更新しない(nullに設定すると更新されない)
								{
									H_param[col] = undefined;
								}
						}

					H_new[col] = H_param[col];
				}
			} else if (tbl == "sub") //mt_order_tbで更新するカラムを回す
			{
				A_collist = this.A_subupdcol;

				for (var col in A_collist) {
					var quote = A_collist[col];

					if ("M" != H_sess[RecogFormModel.PUB].type && "productname" == col) {
						continue;
					}

					if (col == "property") //色のbranchid
						{
							H_param[col] = H_param.color;

							if (true == (undefined !== H_product.tel.productid)) {
								if (true == (undefined !== H_param.color) && "" != H_param.color) {
									var branch_sql = "SELECT branchid FROM product_branch_tb WHERE productid=" + H_product.tel.productid + " AND property='" + H_param.color + "'";
									var branchid = this.get_DB().queryOne(branch_sql);
								} else {
									branchid = undefined;
								}

								H_param.branchid = branchid;
							}
						}

					H_new[col] = H_param[col];
				}
			} else if (tbl == "det") //オプションに統合しておく
			//件数
			//プラン変更は電話詳細情報が1件しか来ないので件数渡す必要あり 20100318miya
			//件数分回す
			{
				A_collist = this.A_detupdcol;

				if (Array.isArray(H_param.vodalive) == true) {
					if (Array.isArray(H_param.option) == true) {
						H_param.option = H_param.option + H_param.vodalive;
					} else {
						H_param.option = H_param.vodalive;
					}
				}

				if (Array.isArray(H_param.vodayuryo) == true) {
					if (Array.isArray(H_param.option) == true) {
						H_param.option = H_param.option + H_param.vodayuryo;
					} else {
						H_param.option = H_param.vodayuryo;
					}
				}

				if (Array.isArray(H_param.option) == true) {
					H_param.option = serialize(H_param.option);
				}

				if (Array.isArray(H_param.waribiki) == true) {
					H_param.waribiki = serialize(H_param.waribiki);
				}

				var A_discounttel = Array();
				A_discounttel.push(H_param.discounttel1);
				A_discounttel.push(H_param.discounttel2);
				A_discounttel.push(H_param.discounttel3);
				A_discounttel.push(H_param.discounttel4);
				A_discounttel.push(H_param.discounttel5);

				if (undefined !== A_discounttel == true) {
					H_param.discounttel = serialize(A_discounttel);
				} else {
					H_param.discounttel = undefined;
				}

				var A_no = Array();

				if (true == is_numeric(telcnt)) //件数がなかった場合（ありえないとは思うが）に備えて残しておく 20100318miya
					{
						for (var no = 0; no < telcnt; no++) {
							A_no.push(no);
						}
					} else {
					for (var key in H_param) //何件分来てるか調べて配列に入れる
					{
						var val = H_param[key];

						if (true == ereg("_([0-9])$", key)) {
							var tmp = ereg_replace("_([0-9])$", "", key);
							no = ereg_replace(tmp + "_", "", key);

							if (false == (-1 !== A_no.indexOf(no))) {
								A_no.push(no);
							}
						}
					}

					if (A_no.length < 1) {
						A_no = [0];
					}
				}

				for (var no of Object.values(A_no)) //mt_order_teldetail_tbで更新するカラムを回す
				{
					for (var col in A_collist) {
						var quote = A_collist[col];

						if (true == (-1 !== this.A_detupdcol_cgi.indexOf(col))) //日付整形
							{
								var data = H_param[col + "_" + no];

								if (true == ereg("^date", col)) {
									if (Array.isArray(data) == true && data.Y != "") {
										data = OrderUtil.adjustdate(data.Y, data.m, data.d, data.H + 0);
									} else {
										data = undefined;
									}
								} else if (quote[0] == "date") //mnp_enable_dateはここ
									//quote0がdateだったら日付整形するにようにした(なんで今までそうなってなかったのか・・)
									{
										if (data.Y + data.m + data.d != "") {
											data = sprintf("%04d-%02d-%02d", data.Y, data.m, data.d);
										} else {
											data = undefined;
										}
									}
							} else {
							data = H_param[col];
						}

						H_new[no][col] = data;
					}
				}
			} else {
			return false;
		}

		return H_new;
	}

	checkNullUpdateDetail(H_olddet, H_upddet) //// 電話一件のとき全部空でUPDATEするためのテスト配列
	//$H_upddet = array();
	//$H_upddet[0] = array(
	//			"mail"=>null,
	//			"telusername"=>null,
	//			"employeecode"=>null,
	//			"text1"=>null,
	//			"text2"=>null,
	//			"text3"=>null,
	//			"text4"=>null,
	//			"text5"=>null,
	//			"text6"=>null,
	//			"text7"=>null,
	//			"text8"=>null,
	//			"text9"=>null,
	//			"text10"=>null,
	//			"text11"=>null,
	//			"text12"=>null,
	//			"text13"=>null,
	//			"text14"=>null,
	//			"text15"=>null,
	//			"int1"=>null,
	//			"int2"=>null,
	//			"int3"=>null,
	//			"int4"=>null,
	//			"int5"=>null,
	//			"int6"=>null,
	//			"date1"=>null,
	//			"date2"=>null,
	//			"date3"=>null,
	//			"date4"=>null,
	//			"date5"=>null,
	//			"date6"=>null,
	//			"mail1"=>null,
	//			"mail2"=>null,
	//			"mail3"=>null,
	//			"url1"=>null,
	//			"url2"=>null,
	//			"url3"=>null,
	//			"memo"=>null,
	//			"kousiradio"=>null,
	//			"kousi"=>null,
	//			"mnpno"=>null
	//);
	{
		var A_chk = Array();

		if (true == Array.isArray(H_olddet) && true == Array.isArray(H_upddet)) //一個もmodがなかったらおかしい
			{
				for (var key in H_olddet) {
					var val = H_olddet[key];

					for (var col in val) {
						var quote = val[col];

						if (true == (-1 !== this.A_detupdcol_cgi.indexOf(col))) //電話詳細情報をnullに書き換えようとしていたら
							{
								if (undefined != quote && "" != quote) {
									if (undefined == H_upddet[key][col] || "" == H_upddet[key][col]) {
										A_chk.push("del");
									} else {
										A_chk.push("mod");
									}
								}
							}
					}
				}

				if (true == 0 < A_chk.length && false == (-1 !== A_chk.indexOf("mod"))) {
					this.errorOut(8, "OrderModelBase::checkNullUpdateDetail  \u96FB\u8A71\u60C5\u5831\u3092\u5168\u3066null\u3067\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3057\u3088\u3046\u3068\u3057\u3066\u3044\u307E\u3059", false, "../menu.php");
					return false;
				} else {
					return H_upddet;
				}
			}

		this.errorOut(8, "OrderModelBase::checkNullUpdateDetail  \u66F4\u65B0\u60C5\u5831\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093", false, "../menu.php");
		return false;
	}

	__destruct() {
		super.__destruct();
	}

};