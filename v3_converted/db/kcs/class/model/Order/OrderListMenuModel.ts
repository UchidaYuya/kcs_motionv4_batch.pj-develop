//
//注文履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/05/22
//@uses OrderListModelBase
//@uses OrderUtil
//
//
//
//注文履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@author miyazawa
//@since 2008/05/22
//@uses ManagementModel
//

require("model/Order/OrderListModelBase.php");

require("OrderUtil.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//debagmode
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/05/26
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//注文一覧のデータを生成する <br>
//
//注文一覧取得<br>
//
//@author miyazawa
//@since 2008/05/28
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param mixed $download
//@param array $H_g_sess
//@access public
//@return array
//
//
//注文履歴一覧取得時のSQL文のselect句作成
//
//@author miyazawa
//@since 2008/05/29
//
//@access protected
//@return array
//
//
//Group By句のSQL文を作成する
//
//@author miyazawa
//@since 2008/05/29
//
//@param mixed $sort
//@access private
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author miyazawa
//@since 2008/05/29
//
//@param mixed $sort
//@access private
//@return string
//
//
//受領確認を済に、受注ステータスを受領確認済みにする
//
//@authre igarashi
//@since 2008/08/08
//
//@param $H_sess
//
//@access public
//@return none
//
//
//キャリアごとのオーダーがあるかどうかを取得<BR>
//（注：正しいorderの件数ではない。1件でもあればDLボタンを表示するため）
//
//@authre miyazawa
//@since 2008/11/13
//
//@param $H_sess
//
//@access public
//@return none
//
//
//getOrderRegistData
//
//@author
//@since 2010/09/30
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@access public
//@return void
//
//
//registOrder
//
//@author
//@since 2010/09/30
//
//@param mixed $H_order
//@access public
//@return void
//
//
//makeRegistOrderArray
//
//@author
//@since 2010/09/30
//
//@param mixed $H_order
//@access private
//@return void
//
//
//insertErrorInfo
//
//@author
//@since 2010/10/07
//
//@param mixed $errcode
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class OrderListMenuModel extends OrderListModelBase {
	static FNC_TEL_MNG = 104;

	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
		this.debagmode = false;
	}

	getList(H_sess: {} | any[], A_post: {} | any[], download = false, H_g_sess: {} | any[]) //検索条件
	//ステータスを条件句に整形
	//S179注文履歴検索 20141216 date
	//キャリアで検索
	//S179注文履歴検索 20141216 date
	//注文種別で検索
	//S179注文履歴検索 20141216 date
	//申請日のfromで検索
	//S179注文履歴検索 20141216 date
	//申請日のtoで検索
	//申請部署
	//入力担当者
	//オーダー番号
	//電話番号
	//// 対象年月のＳＱＬ文を作成
	//		if($H_sess[self::PUB]["search"]["cym"] != "" && $H_sess[self::PUB]["search"]["cym"] != "all") {
	//			$now_str = date("Y-m-d", mktime(0, 0, 0, substr($H_sess[self::PUB]["search"]["cym"], 4, 2), 1, substr($H_sess[self::PUB]["search"]["cym"], 0, 4)));
	//			$end_str = date("Y-m-d", mktime(0, 0, 0, substr($H_sess[self::PUB]["search"]["cym"], 4, 2)+1, 0, substr($H_sess[self::PUB]["search"]["cym"], 0, 4)));
	//			$current_month = "AND (date(ord.recdate) BETWEEN '" . $now_str . "' AND '" . $end_str . "') ";
	//		}
	//		else{
	//			$current_month = "";
	//		}
	//用途
	//WHERE句をつなげる
	//$wheresql = $status_str . $carrier_str . $ordertype_str . $postcd_str . $charger_str . $orderno_str . $telno_str . $current_month . $division_str;
	//条件にpactidを追加 20090318miya
	//sql文をunionで合体させる
	//ダウンロードでは使用しない
	{
		var A_listsql = Array();
		var A_cntsql = Array();
		var A_data = Array();
		var mid = "";
		var H_search = H_sess[OrderListMenuModel.PUB].search.post;

		if (H_search.status.length > 0) {
			if (this.O_fjp.checkAuth("co") && "10" == H_search.status[0]) {
				H_search.status[0] += ", 5";
			}

			if (this.O_fjp.checkAuth("co") && "20" == H_search.status[1]) {
				H_search.status[1] += ", 7";
			}

			var status_str = "AND (" + "ord.status IN (" + join(",", H_search.status) + ") " + "OR (sub.substatus IN (" + join(",", H_search.status) + ") AND NOT (ord.ordertype = 'A' AND sub.machineflg = true )) " + "OR (de.substatus IN (" + join(",", H_search.status) + ") AND ord.ordertype != 'A') " + ") ";
		} else {
			status_str = "AND ord.status = -1 ";
		}

		if (H_search.carrier.length > 0) //キャリアとその他に分ける
			//キャリア選択
			{
				var carrier = Array();
				var bOther = false;
				var carrier_str = "";

				for (var car of Object.values(H_search.carrier)) {
					if (car == 0) {
						bOther = true;
					} else {
						carrier.push(car);
					}
				}

				if (!!carrier) {
					carrier_str = "ord.carid IN (" + join(",", carrier) + ") ";
				}

				if (bOther) {
					if (!!carrier_str) {
						carrier_str += "OR ";
					}

					carrier_str += "ord.carid NOT IN( " + this.O_Set.car_docomo + ", " + this.O_Set.car_willcom + ", " + this.O_Set.car_au + ", " + this.O_Set.car_softbank + ", " + this.O_Set.car_emobile + ") ";
				}

				carrier_str = "AND (" + carrier_str + ") ";
			} else {
			carrier_str = "AND ord.carid = -1 ";
		}

		if (H_search.ordertype.length > 0) //S189名義変更統合
			{
				var ordertypes = Array();
				{
					let _tmp_0 = H_search.ordertype;

					for (var key in _tmp_0) {
						var value = _tmp_0[key];
						ordertypes = array_merge(ordertypes, value.split(","));
					}
				}
				var ordertype_str = "AND ord.ordertype IN ('" + join("','", ordertypes) + "') ";
			} else {
			ordertype_str = "AND ord.ordertype = '' ";
		}

		if (H_search.fromdate.Y != "" && H_search.fromdate.m != "" && H_search.fromdate.d != "") {
			var fromdate = H_search.fromdate.Y + "-" + H_search.fromdate.m + "-" + H_search.fromdate.d;
			var fromdate_str = "AND '" + fromdate + "' <= (date(ord.recdate)) ";
		} else {
			fromdate_str = "";
		}

		if (H_search.todate.Y != "" && H_search.todate.m != "" && H_search.todate.d != "") {
			var todate = H_search.todate.Y + "-" + H_search.todate.m + "-" + H_search.todate.d;
			var todate_str = "AND '" + todate + "' >= (date(ord.recdate)) ";
		} else {
			todate_str = "";
		}

		if (H_search.postcd != "") //chpostnameからpostnameに変更 20090113miya
			{
				var postcd_str = "AND ord.postname LIKE '%" + H_search.postcd + "%' ";
			} else {
			postcd_str = "";
		}

		if (H_search.charger != "") {
			var charger_str = "AND ord.chargername LIKE '%" + H_search.charger + "%' ";
		} else {
			charger_str = "";
		}

		if (H_search.orderno != "") {
			H_search.orderno = mb_convert_kana(H_search.orderno, "a");
			var ordnumber = H_search.orderno.replace(/^.*-/g, "");
			ordnumber = ordnumber.replace(/[^0-9]/g, "");
			var orderno_str = "AND ord.orderid =" + Math.round(ordnumber) + " ";
		} else {
			orderno_str = "";
		}

		if (H_search.telno != "" && H_search.telno.replace(/^-/g, "") != "") {
			var telno_str = "AND de.telno LIKE '%" + H_search.telno.replace(/-/g, "") + "%' ";
		} else {
			telno_str = "";
		}

		if (H_search.division != "") {
			var division_str = "AND ord.division = " + H_search.division;
		} else {
			division_str = "";
		}

		var wheresql = status_str + carrier_str + ordertype_str + postcd_str + charger_str + orderno_str + telno_str + fromdate_str + todate_str + division_str;
		wheresql += " AND ord.pactid=" + H_g_sess.pactid + " ";

		if (undefined !== H_sess[OrderListMenuModel.PUB].search.post == false) {
			H_sess[OrderListMenuModel.PUB].search.post = Array();
		}

		if (undefined !== H_sess[OrderListMenuModel.PUB].search.post.mid == true) {
			mid = H_sess[OrderListMenuModel.PUB].search.post.mid;
		}

		{
			A_cntsql.push(this.makeOrderListCntSQL(A_post, H_sess[OrderListMenuModel.PUB].search.post));
		}
		A_listsql.push(this.makeOrderListSQL(A_post));

		if (A_listsql.length > 0) //ダウンロードでは使用しない
			{
				if (false == download) {
					var cntsql = "SELECT (" + A_cntsql.join(") + (") + wheresql + ")";
				}

				var listsql = A_listsql.join(" UNION ") + wheresql + this.makeGroupBySQL() + this.makeOrderBySQL(H_sess[OrderListMenuModel.PUB].search.sort);
			}

		this.wheresql = wheresql;

		if (false == download) {
			A_data[0] = this.get_DB().queryOne(cntsql);
			this.get_DB().setLimit(H_sess[OrderListMenuModel.PUB].search.limit, (H_sess[OrderListMenuModel.PUB].search.offset - 1) * H_sess[OrderListMenuModel.PUB].search.limit);
		}

		A_data[1] = this.get_DB().queryHash(listsql);

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeOrderSelectSQL() //英語化権限 20090210miya
	{
		if ("ENG" == this.H_G_Sess.language) {
			var forcustomer_str = "mt_status_tb.forcustomer_eng AS status";
			var carname_str = "car.carname_eng AS carname";
			var ptnname_str = "ptn.ptnname_eng AS ptnname";
		} else //$ptnname_str = "ptn.ptnname";
			{
				forcustomer_str = "mt_status_tb.forcustomer AS status";
				carname_str = "car.carname";
				ptnname_str = "CASE " + "WHEN ord.ordertype='S' AND ord.cirid=1 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1A\u30E0\u30FC\u30D0 => FOMA' " + "WHEN ord.ordertype='S' AND ord.cirid=9 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1ACDMA1x => WIN' " + "ELSE ptn.ptnname " + "END as ptnname";
			}

		var A_col = ["ord.status AS status_no", forcustomer_str, "mt_status_tb.customercolor AS statcolor", carname_str, ptnname_str, "ord.postname", "ord.chargername", "ord.recdate", "ord.anspost", "ord.ansuser", "ord.ansdate", "ord.nextpostid", "ord.nextpostname", "CASE WHEN max(sub.deliverydate) < max(de.deliverydate) THEN max(de.deliverydate) ELSE max(sub.deliverydate) END AS deliverydate", "max(sub.fixdate) AS fixdate", "ord.orderid", "ord.orderid_view", "shop_tb.postcode", "ord.receipt", "ord.telcnt", "ord.attachedfile", "ord.attachedshop", "ord.chargerid", "ord.recoguserid", "u.username", "ord.division"];
		return A_col.join(",");
	}

	makeGroupBySQL() //英語化権限 20090210miya
	{
		if ("ENG" == this.H_G_Sess.language) {
			var forcustomer_str = "mt_status_tb.forcustomer_eng";
			var carname_str = "car.carname_eng";
			var ptnname_str = "ptn.ptnname_eng";
		} else //$ptnname_str = "ptn.ptnname";
			{
				forcustomer_str = "mt_status_tb.forcustomer";
				carname_str = "car.carname";
				ptnname_str = "CASE " + "WHEN ord.ordertype='S' AND ord.cirid=1 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1A\u30E0\u30FC\u30D0 => FOMA' " + "WHEN ord.ordertype='S' AND ord.cirid=9 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1ACDMA1x => WIN' " + "ELSE ptn.ptnname " + "END";
			}

		var A_col = ["ord.status", forcustomer_str, "mt_status_tb.customercolor", carname_str, ptnname_str, "ord.postname", "ord.chargername", "ord.recdate", "ord.anspost", "ord.ansuser", "ord.ansdate", "ord.nextpostid", "ord.nextpostname", "ord.orderid", "ord.orderid_view", "shop_tb.postcode", "ord.receipt", "ord.telcnt", "ord.attachedfile", "ord.attachedshop", "ord.chargerid", "ord.recoguserid", "u.username", "ord.division"];
		return " GROUP BY " + A_col.join(",");
	}

	makeOrderBySQL(sort) //英語化権限 20090210miya
	//状態、申請内容、申請部署、入力担当者、申請日、回答部署、回答者、回答日、次の回答部署、予定日時、最終更新日、台数
	{
		var A_sort = split("\\|", sort);

		if ("ENG" == this.H_G_Sess.language) {
			var ptnname_str = "ptn.ptnname_eng";
		} else //$ptnname_str = "ptn.ptnname";
			{
				ptnname_str = "ptnname";
			}

		var A_col = ["ord.status", ptnname_str, "ord.postname", "ord.chargername", "ord.recdate", "ord.anspost", "ord.ansuser", "ord.ansdate", "ord.nextpostname", "deliverydate", "fixdate", "ord.telcnt", "ord.division"];
		var sql = " ORDER BY " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] == 0) {
			sql += ",ord.recdate desc";
		}

		return sql;
	}

	updateReceipt(H_sess) //受領確認ボタンが押されてなければ処理しない
	//update文を作って実行
	//失敗してたらrollback
	//ここまで追加 090325
	{
		if (false == (undefined !== H_sess.SELF.receipt)) {
			return undefined;
		}

		var H_receipt = Array();
		{
			let _tmp_1 = H_sess.SELF.receipt;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				if (true == ereg("^reccheck", key)) {
					H_receipt.push(val);
				}
			}
		}
		var A_sql = Array();
		this.get_DB().beginTransaction();
		var errflg = false;

		for (var val of Object.values(H_receipt)) //ここから追加 090325
		{
			var sql = "UPDATE mt_order_tb " + "SET " + "receipt=2, " + "status=200 " + "WHERE " + "orderid=" + val;

			if (true == PEAR.isError(this.get_DB().exec(sql))) {
				errflg = true;
			}

			sql = "UPDATE mt_order_sub_tb " + "SET " + "substatus=200 " + "WHERE " + "orderid=" + val;

			if (true == PEAR.isError(this.get_DB().exec(sql))) {
				errflg = true;
			}

			sql = "UPDATE mt_order_teldetail_tb " + "SET " + "substatus=200 " + "WHERE " + "orderid=" + val;

			if (true == PEAR.isError(this.get_DB().exec(sql))) {
				errflg = true;
			}
		}

		if (true == errflg) {
			this.get_DB().rollback();
		} else {
			this.get_DB().commit();
		}
	}

	eachCarrierOrder() //20150107
	{
		var wheresql = "";

		if ("" != this.wheresql) {
			wheresql = this.wheresql;

			if (true == preg_match("/^AND/", wheresql)) {
				wheresql = wheresql.replace(/^AND/g, "WHERE");
			}
		}

		var carcnt_sql = "SELECT ord.carid, count(ord.orderid) FROM " + "mt_order_tb ord LEFT JOIN status_tb ON ord.status=status_tb.status " + "LEFT JOIN order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "LEFT JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN mt_order_teldetail_tb de ON de.orderid=ord.orderid " + "LEFT JOIN mt_order_sub_tb sub ON sub.orderid=ord.orderid ";
		carcnt_sql = carcnt_sql + wheresql;
		carcnt_sql = carcnt_sql + "GROUP BY ord.carid";
		var H_carcnt = this.get_DB().queryAssoc(carcnt_sql);
		return H_carcnt;
	}

	getOrderRegistData(H_g_sess, H_sess) //スーパーユーザーのみ処理
	{
		H_result.disp = false;
		H_result.data = Array();

		if (H_g_sess.su) //受注完了時、「自動登録しない」のみ処理
			{
				var sql = "SELECT " + "orderregisttype " + "FROM " + "pact_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_g_sess.pactid, "int", true);

				if (0 == this.get_DB().queryOne(sql)) //処理するオーダー情報を取得
					//処理済以降で電話管理に登録されていない電話があればボタンを表示
					{
						sql = "SELECT " + "o.orderid, o.shopid, o.shopmemid, t.detail_sort, t.expectdate, " + "t.deliverydate, t.registdate, t.contractdate, t.telorderdate, t.telcontractdate, " + "t.pay_frequency, t.pay_startdate, t.pay_startdate, t.finishdate, o.dateradio, " + "o.dateto, t.planradio, t.packetradio, t.simcardno, t.serialno, " + "o.ordertype, o.postid, o.pactid " + "FROM " + "mt_order_teldetail_tb t " + "INNER JOIN mt_order_tb o ON t.orderid=o.orderid " + "WHERE " + "o.pactid=" + this.get_DB().dbQuote(H_g_sess.pactid, "int", true) + " AND t.registflg=false " + " AND t.substatus >= 120 AND t.substatus <= 210 " + " AND o.ordertype NOT IN ('A', 'Tpc') " + "ORDER BY " + "o.shopid, o.shopmemid, o.orderid";
						H_result.data = this.get_DB().queryHash(sql);

						if (0 < H_result.data.length) //電話管理の権限があれば表示
							{
								sql = "SELECT " + "COUNT(fncid) " + "FROM " + "fnc_relation_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_g_sess.pactid, "int", true) + " AND userid=" + this.get_DB().dbQuote(H_g_sess.userid, "int", true) + " AND fncid=" + this.get_DB().dbQuote(OrderListMenuModel.FNC_TEL_MNG, "int", true);

								if (0 < this.get_DB().queryOne(sql)) {
									H_result.disp = true;
								}
							}
					}
			}

		return H_result;
	}

	registOrder(H_regist) {
		if (Array() == H_regist) {
			return false;
		}

		var today = MtDateUtil.getToday();
		var nowtime = MtDateUtil.getNow();
		var tomonth = today.substr(5, 2);
		var beforemonth = str_pad(tomonth - 1, 2, "0", STR_PAD_LEFT);

		require("model/Order/ShopOrderSubStatusModel.php");

		for (var value of Object.values(H_regist)) //販売店かメンバーが変わればobj生成し直し
		//第4引数がtrueだとステータスによる電話管理反映のチェックが無効になる
		//registflgでしかチェックしないことになるので注意
		{
			if (value.shopid != H_shopinfo.shopid || value.shopmemid != value.shopmemid) {
				var H_shopinfo = {
					shopid: value.shopid,
					memid: value.shopmemid
				};
				var O_order = new ShopOrderSubStatusModel(O_db0, H_shopinfo);
				O_order.setfjpModelObject(this.O_fjp);
				O_order.setRegistType(value.pactid, "user");
				O_order.setShopUser(false);
			}

			var H_info = this.makeDummySession(value);
			H_order.order = O_order.getOrderInfo(Array(), value.orderid, value.shopid, Array());
			var postid = O_order.checkPostId(H_order.order.order.postid, H_order.order.order.pactid, true);
			O_order.setPostID(postid);
			var H_sql = O_order.makeUpdateSQLCtrl(H_shopinfo, H_info, H_order, true);

			if (!!H_sql) //今月分
				{
					var result = O_order.execUpdateStatusHand(H_sql.sql, this.debagmode);

					if (undefined !== result.errsql) {
						this.insertErrorInfo(value, result.errsql, nowtime);
					}

					if (value.finishdate.substr(5, 2) < tomonth) {
						{
							let _tmp_2 = H_sql.sql[value.orderid];

							for (var key in _tmp_2) {
								var val = _tmp_2[key];

								if (1 == preg_match("/\\stel_tb\\s/", val)) {
									H_psql.sql[key] = val.replace(/\stel_tb\s/g, " tel_" + beforemonth + "_tb ");
								}

								if (1 == preg_match("/\\sassets_tb\\s/", val)) {
									H_psql.sql[key] = val.replace(/\sassets_tb\s/g, " assets_" + beforemonth + "_tb ");
								}
							}
						}
						var presult = O_order.execUpdateStatusHand(H_psql, this.debagmode);

						if (undefined !== presult.errsql) {
							this.insertErrorInfo(value, presult.errsql, nowtime);
						}
					}

					var message = "\u96FB\u8A71\u7BA1\u7406\u306B\u767B\u9332\u3057\u307E\u3057\u305F";
				}
		}

		return message;
	}

	makeDummySession(H_order) {
		if (-1 !== ["N", "Nmnp", "C", "S"].indexOf(H_order.ordertype)) {
			var sql = "SELECT " + "detail_sort " + "FROM " + "mt_order_sub_tb " + "WHERE " + "machineflg=false" + " AND orderid=" + this.get_DB().dbQuote(H_order.orderid, "int", true) + " AND substatus>=120" + " AND substatus<=210";
			var A_sort = this.get_DB().queryCol(sql);
			var uptarget = array_merge([H_order.detail_sort], A_sort);
		} else {
			uptarget = [H_order.detail_sort];
		}

		var contractup = "0";

		if (!!H_order.contractdate) {
			contractup = "1";
		}

		var registup = "0";

		if (!!H_order.telorderdate) {
			registup = "1";
		}

		var endsel = "";

		if (!!H_order.deliverdate) {
			endsel = "specifies";
		}

		var expectup = "";

		if (!!H_order.expectdate) {
			endsel = "undesig";
		}

		return {
			"/MTOrder": {
				orderid: H_order.orderid
			},
			SELF: {
				uptarget: uptarget,
				endsel: endsel,
				deliverydate: {
					Y: H_order.deliverydate.substr(0, 4),
					m: H_order.deliverydate.substr(5, 2),
					d: H_order.deliverydate.substr(8, 2),
					h: H_order.deliverydate.substr(11, 2)
				},
				expectup: expectup,
				expectdate: {
					Y: H_order.expectdate.substr(0, 4),
					m: H_order.expectdate.substr(5, 2),
					d: H_order.expectdate.substr(8, 2),
					h: H_order.expectdate.substr(11, 2)
				},
				contractup: contractup,
				contractdate: {
					Y: H_order.contractdate.substr(0, 4),
					m: H_order.contractdate.substr(5, 2),
					d: H_order.contractdate.substr(8, 2)
				},
				registup: registup,
				registdate: {
					Y: H_order.registdate.substr(0, 4),
					m: H_order.registdate.substr(5, 2),
					d: H_order.registdate.substr(8, 2)
				},
				pay_frequency: H_order.pay_frequency,
				pay_startdate: H_order.pay_startdate,
				pay_monthly_sum: H_order.pay_monthly_sum,
				status: "210",
				confirm: "confirm",
				subcomment: "",
				execsub: ""
			}
		};
	}

	insertErrorInfo(order, errcode, nowtime) {
		var sql = "INSERT INTO mt_order_regist_tel_tb (orderid, detail_sort, shopid, pactid, ordertype, content, recdate) " + "VALUES(" + this.get_DB().dbQuote(order.orderid, "int", true) + ", " + this.get_DB().dbQuote(order.detail_sort, "int", true) + ", " + this.get_DB().dbQuote(order.shopid, "int", true) + ", " + this.get_DB().dbQuote(order.pactid, "int", true) + ", " + this.get_DB().dbQuote(order.ordertype, "text", true) + ", " + this.get_DB().dbQuote(errcode, "text", true) + ", " + this.get_DB().dbQuote(nowtime, "timestamp", true) + " " + ")";
		this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};