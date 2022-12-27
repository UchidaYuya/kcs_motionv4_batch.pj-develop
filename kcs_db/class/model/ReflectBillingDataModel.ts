//
//請求明細からプラン・パケット反映

import ModelBase from "../model/ModelBase";
import MtDBUtil from "../MtDBUtil";
import MtOutput from "../MtOutput";
import MtTableUtil from "../MtTableUtil";
export default class ReflectBillingDataModel extends ModelBase {
	_isInitialize: boolean;
	_functionList: string[];
	_pactIdList: any[] | undefined;
	_dataList: any;
	constructor() {
		super();
		this._isInitialize = false;
		this._functionList = ["211", "212", "213"];
	}

	static KEY_FNCID = 211;
	static SEARCH_ARIA = 100;
	static OVER_ID = 3000;
	static ORDER_STATUS_START = 120;
	static ORDER_STATUS_END = 220;
	static NO_PACKET_DOCOMO = "パケットパックなし";
	static NO_PACKET_AU = "パケットなし";

	async initialize(pactid: string) {
		if (pactid !== "all" && pactid !== "ALL" && isNaN(Number(pactid))) {
			throw new Error("PactId は数字、または all(ALL) を指定してください");
		}

		var sql = "SELECT pactid FROM fnc_relation_tb WHERE fncid = " + ReflectBillingDataModel.KEY_FNCID + " ";

		if (!(pactid === "all" || pactid === "ALL")) {
			sql += "AND pactid = " + pactid;
		}

		var data = await this.getDB().queryCol(sql);
		var dataLength = data.length;

		if (dataLength < 1) {
			throw new Error("指定されたPactidには、請求明細からのプランパケット変更権限を所持している企業がありません\n");
		}

		this._pactIdList = data;
		sql = "SELECT pactid, fncid FROM fnc_relation_tb " + "WHERE pactid IN (" + this._pactIdList.join(", ") + ") " + "AND fncid IN (" + this._functionList.join(", ") + ") ";
		data = await this.getDB().queryHash(sql);
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

	async searchPlan(pactid: number, carid: number, telno: string, tableno: any, arid: any, cirid: any, buyselid: any) {
		var planList = await this.getPlanList(carid, cirid, buyselid);

		if (!planList.length) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") のプラン候補が0件のため、プランを絞れませんでした\n");
		}

		var newPlanList: any = Array();
		
		for (var plan of planList) {
			if (!plan.search_str1) {
				this.infoOut("planid(" + plan.planid + ") に検索文字列1が設定されていない\n", 1);
				continue;
			}

			var response = this.searchForBillhistory(pactid, carid, telno, tableno, plan.search_str1, plan.search_str2);

			if (response) {
				newPlanList[plan.planid] = response;
			}
		}

		if (newPlanList.length < 1) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") の新プランが0件のため、プランを絞れませんでした\n");
		} else if ((newPlanList.length > 1)) {
			newPlanList.sort();
			var cnt = 0;
			for (var key in newPlanList) {
				var value = newPlanList[key];
				var key1;
				if (cnt == 0) {
					key1 = key;
					var value1 = value;
					cnt++;
					continue;
				} else if (value == value1) {
					throw new Error("Pactid(" + pactid + ") telno(" + telno + ") のプラン候補が1件に絞り込めませんでした\n");
				}

				return key1;
			}
		}

		for (var key in newPlanList) {
			var value = newPlanList[key];
			return key;
		}

	}

	getPlanList(carid, cirid, buyselid) {
		var sql = "SELECT " + "planid, search_str1, search_str2 " + "FROM " + "plan_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "arid = " + ReflectBillingDataModel.SEARCH_ARIA + " AND " + "planid > " + ReflectBillingDataModel.OVER_ID + " AND " + "cirid = " + this.getDB().dbQuote(cirid, "integer", true) + " AND " + "buyselid = " + this.getDB().dbQuote(buyselid, "integer", true);
		return this.getDB().queryHash(sql);
	}

	updatePlan(pactid: any, carid: number, telno: any, planid: any, tableno: MtTableUtil | undefined) {
		if (!tableno) {
			var tableName = "tel_tb";
		} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var now = this.getDB().getNow();
		var sql = "UPDATE " + tableName + " SET " + "planid = " + this.getDB().dbQuote(planid, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(now, "text", true) + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().exec(sql);
	}

	async searchPacket(pactid, carid, telno, tableno, arid, cirid, buyselid) {
		var packetList = await this.getPacketList(carid, cirid);

		if (!packetList.length) {
			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") のパケット候補が0件のため、パケットを絞れませんでした\n");
		}

		var newPacketList: any = Array();

		for (var packet of packetList) {
			var response = this.searchForBillhistory(pactid, carid, telno, tableno, packet.search_str1, packet.search_str2);

			if (response) {
				newPacketList[packet.packetid] = response;
			}
		}
		
		if (newPacketList.length < 1) {
			var temp = await this.getNoPacketId(carid, cirid);

			if (temp.length == 1) {
				this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") の明細にはマッチするパケット候補がなかったためパケットなしを設定します。\n");
				return temp[0].packetid;
			}

			throw new Error("Pactid(" + pactid + ") telno(" + telno + ") のパケットなしが存在しませんでした\n");
		} else if ((newPacketList.length> 1)) {
			newPacketList.sort();
			var cnt = 0;

			for (let key in newPacketList) {
				var value = newPacketList[key];
				if (cnt == 0) {
					var key1;
					key1 = key;
					var value1 = value;
					cnt++;
					continue;
				} else if (value == value1) {
					throw new Error("Pactid(" + pactid + ") telno(" + telno + ") のパケット候補が1件に絞り込めませんでした\n");
				}

				return key1;
			}
		}

		for (let key in newPacketList) {
			var value = newPacketList[key];
			return key;
		}

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

	updatePacket(pactid: any, carid: number, telno: any, packetid: any, tableno: MtTableUtil | undefined) {
		if (!tableno) {
			var tableName = "tel_tb";
		} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var now = this.getDB().getNow();
		var sql = "UPDATE " + tableName + " SET " + "packetid = " + this.getDB().dbQuote(packetid, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(now, "text", true) + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().exec(sql);
	}

	searchOrder(pactid, carid, telno) {
		var year = +new Date().getFullYear();
		var month = +new Date().getMonth();
		month--;

		if (month == 0) {
			month = 12;
			year--;
		}

		var sql = "SELECT " + "count(*) " + "FROM " + "mt_order_tb AS morder " + "INNER JOIN " + "mt_order_teldetail_tb AS detail ON morder.orderid = detail.orderid " + "WHERE " + "morder.ansdate >= '" + year + "-" + month + "-01' AND " + "morder.status >= " + ReflectBillingDataModel.ORDER_STATUS_START + " AND " + "morder.status <= " + ReflectBillingDataModel.ORDER_STATUS_END + " AND " + "detail.telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "morder.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "morder.carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	searchForBillhistory(pactid: number, carid: number, telno: string, tableno: string, str1: string, str2: any) {
		var tablename = "billhistory_";
		var columnname = "details1";

		if (carid == 3) {
			tablename = "tel_details_";
			columnname = "codename";
		}

		var strList = str1.split(",");
		var add: any = Array();
		var key = strList.shift();

		do {
			add.push(" " + columnname + " like '%" + key + "%' ");
		} while (key = strList.shift());

		add = "(" + add.join(" OR ") + ")";

		if (str2) {
			strList = str1.split(",");
			var add2: any = Array();
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
