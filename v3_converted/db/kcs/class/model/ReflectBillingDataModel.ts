//
//請求明細からプラン・パケット反映
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2012/01/31
//@filesource
//
//
//
//請求明細からプラン・パケット反映
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2012/01/31
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtTableUtil.php");

require("model/ModelBase.php");

//
//initialize
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@access public
//@return void
//
//
//権限タイプの判別
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@access public
//@return void
//
//
//処理対象となる企業一覧
//
//@author web
//@since 2012/02/10
//
//@access public
//@return void
//
//
//処理対象となる電話リスト
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $tableno
//@access public
//@return void
//
//
//現在の tel_tb の電話リスト
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//明細から請求付きのプランを判断
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $tableno
//@param mixed $arid
//@param mixed $cirid
//@param mixed $buyselid
//@access public
//@return void
//
//
//プランの候補一覧
//
//@author web
//@since 2012/02/10
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $buyselid
//@access public
//@return void
//
//
//プランの更新
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $planid
//@param mixed $tableno
//@access public
//@return void
//
//
//明細から候補となるパケットを検索
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $tableno
//@param mixed $arid
//@param mixed $cirid
//@param mixed $buyselid
//@access public
//@return void
//
//
//パケット候補一覧
//
//@author web
//@since 2012/02/10
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getNoPacketId
//
//@author web
//@since 2012/05/10
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//パケットを更新
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $packetid
//@param mixed $tableno
//@access public
//@return void
//
//
//前月一日から今迄で、承認を通過、受注キャンセルになっていない電話かどうか
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@access public
//@return void
//
//
//billhistory_xx_tb に文字列検索を行う
//
//@author web
//@since 2012/02/10
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@param mixed $tableno
//@param mixed $str1
//@param mixed $str2
//@access public
//@return void
//
class ReflectBillingDataModel extends ModelBase {
	constructor() {
		super(...arguments);
		this._isInitialize = false;
		this._functionList = ["211", "212", "213"];
	}

	static KEY_FNCID = 211;
	static SEARCH_ARIA = 100;
	static OVER_ID = 3000;
	static ORDER_STATUS_START = 120;
	static ORDER_STATUS_END = 220;
	static NO_PACKET_DOCOMO = "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057";
	static NO_PACKET_AU = "\u30D1\u30B1\u30C3\u30C8\u306A\u3057";

	initialize(pactid) {
		if (pactid !== "all" && pactid !== "ALL" && !is_numeric(pactid)) {
			throw new Error("PactId \u306F\u6570\u5B57\u3001\u307E\u305F\u306F all(ALL) \u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
		}

		var sql = "SELECT pactid FROM fnc_relation_tb WHERE fncid = " + ReflectBillingDataModel.KEY_FNCID + " ";

		if (!(pactid === "all" || pactid === "ALL")) {
			sql += "AND pactid = " + pactid;
		}

		var data = this.getDB().queryCol(sql);
		var dataLength = data.length;

		if (dataLength < 1) {
			throw new Error("\u6307\u5B9A\u3055\u308C\u305FPactid\u306B\u306F\u3001\u8ACB\u6C42\u660E\u7D30\u304B\u3089\u306E\u30D7\u30E9\u30F3\u30D1\u30B1\u30C3\u30C8\u5909\u66F4\u6A29\u9650\u3092\u6240\u6301\u3057\u3066\u3044\u308B\u4F01\u696D\u304C\u3042\u308A\u307E\u305B\u3093\n");
		}

		this._pactIdList = data;
		sql = "SELECT pactid, fncid FROM fnc_relation_tb " + "WHERE pactid IN (" + this._pactIdList.join(", ") + ") " + "AND fncid IN (" + this._functionList.join(", ") + ") ";
		data = this.getDB().queryHash(sql);
		dataLength = data.length;
		var dataList = Array();

		for (var i = 0; i < dataLength; i++) {
			var line = data[i];

			if (!(undefined !== dataList[line.pactid])) {
				dataList[line.pactid] = Array();
			}

			dataList[line.pactid].push(line.fncid);
		}

		this._dataList = dataList;
		this._isInitialize = true;
		return this;
	}

	getFunctionType(pactid) {
		if (this._isInitialize) {
			if (-1 !== this._dataList[pactid].indexOf(213)) {
				return 3;
			}

			if (-1 !== this._dataList[pactid].indexOf(212)) {
				return 2;
			}

			return 1;
		}

		return undefined;
	}

	getPactIdList() {
		if (this._isInitialize) {
			return this._pactIdList;
		}

		return undefined;
	}

	getTelnoList(pactid, carid, tableno) {
		if (1 === carid) {
			var billTableName = "billhistory_";
		} else {
			billTableName = "tel_details_";
		}

		var sql = "SELECT " + "tel.telno, tel.planid, tel.packetid, tel.cirid, tel.arid, tel.buyselid " + "FROM " + "(" + "SELECT " + "telno, carid, pactid " + "FROM " + billTableName + tableno + "_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " " + "GROUP BY " + "telno, carid, pactid" + ") AS bh " + "INNER JOIN " + "tel_" + tableno + "_tb AS tel ON bh.telno = tel.telno AND bh.carid = tel.carid AND bh.pactid = tel.pactid ";
		return this.getDB().queryHash(sql);
	}

	getTelnoListNow(pactid, carid) {
		var sql = "SELECT " + "telno, planid, packetid, cirid, arid, buyselid " + "FROM " + "tel_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryKeyAssoc(sql);
	}

	searchPlan(pactid, carid, telno, tableno, arid, cirid, buyselid) {
		var planList = this.getPlanList(carid, cirid, buyselid);

		if (!planList.length) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u5019\u88DC\u304C0\u4EF6\u306E\u305F\u3081\u3001\u30D7\u30E9\u30F3\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n");
		}

		var newPlanList = Array();

		for (var plan of Object.values(planList)) {
			if (is_null(plan.search_str1)) {
				this.infoOut("planid(" + plan.planid + ") \u306B\u691C\u7D22\u6587\u5B57\u52171\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\n", 1);
				continue;
			}

			var response = this.searchForBillhistory(pactid, carid, telno, tableno, plan.search_str1, plan.search_str2);

			if (!is_null(response)) {
				newPlanList[plan.planid] = response;
			}
		}

		if (newPlanList.length < 1) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u65B0\u30D7\u30E9\u30F3\u304C0\u4EF6\u306E\u305F\u3081\u3001\u30D7\u30E9\u30F3\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n");
		} else if ((newPlanList > 1).length) {
			arsort(newPlanList);
			var cnt = 0;

			for (var key in newPlanList) {
				var value = newPlanList[key];

				if (cnt == 0) {
					var key1 = key;
					var value1 = value;
					cnt++;
					continue;
				} else if (value == value1) {
					throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u5019\u88DC\u304C1\u4EF6\u306B\u7D5E\u308A\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\n");
				}

				return key1;
			}
		}

		for (var key in newPlanList) {
			var value = newPlanList[key];
		}

		return key;
	}

	getPlanList(carid, cirid, buyselid) {
		var sql = "SELECT " + "planid, search_str1, search_str2 " + "FROM " + "plan_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "arid = " + ReflectBillingDataModel.SEARCH_ARIA + " AND " + "planid > " + ReflectBillingDataModel.OVER_ID + " AND " + "cirid = " + this.getDB().dbQuote(cirid, "integer", true) + " AND " + "buyselid = " + this.getDB().dbQuote(buyselid, "integer", true);
		return this.getDB().queryHash(sql);
	}

	updatePlan(pactid, carid, telno, planid, tableno = undefined) {
		if (is_null(tableno)) {
			var tableName = "tel_tb";
		} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var now = this.getDB().getNow();
		var sql = "UPDATE " + tableName + " SET " + "planid = " + this.getDB().dbQuote(planid, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(now, "text", true) + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().exec(sql);
	}

	searchPacket(pactid, carid, telno, tableno, arid, cirid, buyselid) {
		var packetList = this.getPacketList(carid, cirid);

		if (!packetList.length) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u304C0\u4EF6\u306E\u305F\u3081\u3001\u30D1\u30B1\u30C3\u30C8\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n");
		}

		var newPacketList = Array();

		for (var packet of Object.values(packetList)) {
			var response = this.searchForBillhistory(pactid, carid, telno, tableno, packet.search_str1, packet.search_str2);

			if (!is_null(response)) {
				newPacketList[packet.packetid] = response;
			}
		}

		if (newPacketList.length < 1) {
			var temp = this.getNoPacketId(carid, cirid);

			if (temp.length == 1) {
				this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u660E\u7D30\u306B\u306F\u30DE\u30C3\u30C1\u3059\u308B\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u304C\u306A\u304B\u3063\u305F\u305F\u3081\u30D1\u30B1\u30C3\u30C8\u306A\u3057\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002\n");
				return temp[0].packetid;
			}

			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u306A\u3057\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n");
		} else if ((newPacketList > 1).length) {
			arsort(newPacketList);
			var cnt = 0;

			for (var key in newPacketList) {
				var value = newPacketList[key];

				if (cnt == 0) {
					var key1 = key;
					var value1 = value;
					cnt++;
					continue;
				} else if (value == value1) {
					throw new Error("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u304C1\u4EF6\u306B\u7D5E\u308A\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\n");
				}

				return key1;
			}
		}

		for (var key in newPacketList) {
			var value = newPacketList[key];
		}

		return key;
	}

	getPacketList(carid, cirid) {
		var sql = "SELECT " + "packetid, search_str1, search_str2 " + "FROM " + "packet_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "arid = " + ReflectBillingDataModel.SEARCH_ARIA + " AND " + "packetid > " + ReflectBillingDataModel.OVER_ID + " AND " + "cirid = " + this.getDB().dbQuote(cirid, "integer", true) + " AND " + "(search_str1 is not null AND search_str1 != '')";
		return this.getDB().queryHash(sql);
	}

	getNoPacketId(carid, cirid) {
		if (carid == 3) {
			var nopact = ReflectBillingDataModel.NO_PACKET_AU;
		} else {
			nopact = ReflectBillingDataModel.NO_PACKET_DOCOMO;
		}

		var sql = "SELECT " + "packetid " + "FROM " + "packet_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "arid = " + ReflectBillingDataModel.SEARCH_ARIA + " AND " + "packetid > " + ReflectBillingDataModel.OVER_ID + " AND " + "cirid = " + this.getDB().dbQuote(cirid, "integer", true) + " AND " + "packetname = '" + nopact + "'";
		return this.getDB().queryHash(sql);
	}

	updatePacket(pactid, carid, telno, packetid, tableno = undefined) {
		if (is_null(tableno)) {
			var tableName = "tel_tb";
		} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var now = this.getDB().getNow();
		var sql = "UPDATE " + tableName + " SET " + "packetid = " + this.getDB().dbQuote(packetid, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(now, "text", true) + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().exec(sql);
	}

	searchOrder(pactid, carid, telno) {
		var year = +date("Y");
		var month = +date("m");
		month--;

		if (month == 0) {
			month = 12;
			year--;
		}

		var sql = "SELECT " + "count(*) " + "FROM " + "mt_order_tb AS morder " + "INNER JOIN " + "mt_order_teldetail_tb AS detail ON morder.orderid = detail.orderid " + "WHERE " + "morder.ansdate >= '" + year + "-" + month + "-01' AND " + "morder.status >= " + ReflectBillingDataModel.ORDER_STATUS_START + " AND " + "morder.status <= " + ReflectBillingDataModel.ORDER_STATUS_END + " AND " + "detail.telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "morder.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "morder.carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	searchForBillhistory(pactid, carid, telno, tableno, str1, str2) {
		var tablename = "billhistory_";
		var columnname = "details1";

		if (carid == 3) {
			tablename = "tel_details_";
			columnname = "codename";
		}

		var strList = str1.split(",");
		var add = Array();
		var key = strList.shift();

		do {
			add.push(" " + columnname + " like '%" + key + "%' ");
		} while (key = strList.shift());

		add = "(" + add.join(" OR ") + ")";

		if (!is_null(str2)) {
			strList = str1.split(",");
			var add2 = Array();
			key = strList.shift();

			do {
				add2.push(" " + columnname + " like '%" + key + "%' ");
			} while (key = strList.shift());

			add2 = "(" + add2.join(" OR ") + ")";
			add = "(" + add + " AND " + add2 + ")";
		}

		var sql = "SELECT sum(detailno) FROM " + tablename + tableno + "_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true) + " AND ";
		sql += add;
		return this.getDB().queryOne(sql);
	}

};