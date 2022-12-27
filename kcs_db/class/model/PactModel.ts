import ModelBase from './ModelBase';

export default class PactModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPactIdFromUser(userid: string) {
		if (isNaN(Number(userid))) {
			this.getOut().errorOut(0, "PactModel::getPactIdFromUser() useridが不正", false);
		}

		var sql = "select " + "pactid " + "from " + "user_tb " + "where " + "userid = " + userid;
		return this.getDB().queryOne(sql);
	}

	getPactIdCompNameFromPact() {
		var sql = "select pactid,compname " + "from pact_tb " + "where delflg=false " + "order by pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactListFromShop(shopid: string) {
		if (isNaN(Number(shopid)) == false) {
			this.getOut().errorOut(0, "PactModel::getPactListFromShop() shopidが不正", false);
		}

		var sql = "select pact.pactid, pact.userid_ini, pact.compname " + "from pact_tb pact " + "inner join pact_rel_shop_tb shrel on pact.pactid=shrel.pactid " + "where shrel.shopid=" + shopid + " " + "and pact.delflg=false " + "order by pact.pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactListFromShopMember(memid: string) {
		if (isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "PactModel::getPactListFromShop() shopidが不正", false);
		}

		var sql = "select pact.pactid, pact.userid_ini, pact.compname, pact.groupid " + "from pact_tb pact " + "inner join joker_member_rel_pact_tb jkmem on pact.pactid=jkmem.pactid " + "where jkmem.memid=" + memid + " " + "and pact.delflg=false " + "order by pact.pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactHash(type: string, shopid: any, where_car:string = "") {
		if ("" != where_car) {
			where_car = " AND srel.carid = " + this.getDB().dbQuote(where_car, "integer", true) + " ";
		}

		var pact_sql = "select " + "pa.pactid," + "pa.compname " + "from " + "shop_relation_tb srel inner join pact_tb pa on srel.pactid = pa.pactid " + "where " + "srel.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "AND pa.delflg = false " + where_car + "group by pa.pactid,pa.compname " + "order by pa.pactid";

		if (type == "assoc") {
			return this.getDB().queryAssoc(pact_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(pact_sql);
		} else {
			return this.getDB().queryHash(pact_sql);
		}
	}

	getCompname(pactid: string) {
		var select_sql = "SELECT compname FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPactType(pactid: string) {
		var select_sql = "SELECT type FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getGroupId(pactid: string, array = false) {
		var sql = "select " + "sh.groupid " + "from " + "shop_tb sh inner join pact_rel_shop_tb prs on sh.shopid = prs.shopid " + "where " + "prs.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + "group by " + "sh.groupid " + "order by " + "sh.groupid";

		if (array === true) {
			var A_ret = this.getDB().queryCol(sql);

			if (Array.isArray(A_ret) == true) {
				return A_ret;
			}

			return [A_ret];
		}

		return this.getDB().queryOne(sql);
	}

	getAllPactId() {
		var sql = "select pactid from pact_tb order by pactid";
		return this.getDB().queryCol(sql);
	}

	getAllEvPact() {
		var sql = "select * from pact_tb where coalesce(ev_pactcode,'') != '' and ev_agentid is not null;";
		return this.getDB().queryHash(sql);
	}

	getPactCodeFromPactId(pactid: any) {
		var sql = "select ev_pactcode from pact_tb where pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getPactidRootPostIdFromAgentIdPactcode(ev_agentid: any, ev_pactcode: any) {
		var sql = "SELECT " + "pact.pactid, rootpost.postid  " + "FROM " + "pact_tb AS pact " + "INNER JOIN  " + "(SELECT pactid, postidparent AS postid FROM post_relation_tb where level = 0 AND postidparent = postidchild) AS rootpost ON pact.pactid = rootpost.pactid " + "WHERE " + "pact.ev_agentid = " + this.getDB().dbQuote(ev_agentid, "integer", true) + " AND " + "pact.ev_pactcode = " + this.getDB().dbQuote(ev_pactcode, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getPactIdFromAgentIdPactcode(ev_agentid: any, ev_pactcode: any) {
		var sql = "select pactid from pact_tb " + " where " + "ev_agentid = " + this.getDB().dbQuote(ev_agentid, "integer", true) + " and " + "ev_pactcode = " + this.getDB().dbQuote(ev_pactcode, "text", true);
		return this.getDB().queryOne(sql);
	}

	getUseridIniFromPactid(pactid: any) {
		var sql = "SELECT userid_ini FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getPactSerach(offset: number, limit: number, select:any = Array(), search:any = Array(), option: {} | any[] = Array()) //$select=array()の値
	
	{
		var db = this.get_DB();
		var sql_search = Array();
		sql_search.push("(pact.pactid != 0)");

		if (undefined !== search.groupid) {
			sql_search.push("(pact.groupid = " + db.dbQuote(search.groupid, "integer", true) + ")");
		}

		if (!!search.type) {
			sql_search.push("pact.type = " + db.dbQuote(search.type, "string", true));
		}

		let s:any = {
			pactid: "pact.pactid"
		};

		for (var name in s) {
			var column = s[name];

			if (!!search[name]) {
				sql_search.push("(" + column + " = " + db.dbQuote(search[name], "integer", true) + ")");
			}
		}

		if (undefined !== search.fncid) {
			var temp = "";
			var con = "";
			{
				let _tmp_0 = search.fncid;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					temp += con;
					temp += this.get_DB().dbQuote(value, "integer", true);
					con = ",";
				}
			}
			sql_search.push("pact.pactid IN (SELECT pactid FROM fnc_relation_tb WHERE fncid IN (" + temp + ") GROUP BY pactid)");
		}


		s = {
			compname:  "pact.compname",
			userid_ini: "pact.userid_ini"
		};

		for (var name in s) {
			var column = s[name];

			if (!!search[name]) {
				sql_search.push("(" + column + " like " + db.dbQuote("%" + search[name] + "%", "string", true) + ")");
			}
		}

		var sql_select = "";

		if (!!select) {
			sql_select = "," + select.join(",");
		}

		var sql_join = "";
		var sql = "SELECT" + " pact.groupid" + ",pact.userid_ini" + ",pact.pactid" + ",pact.compname" + ",pact.type" + sql_select + ",count(*) over() as pcnt" + " FROM" + " pact_tb pact" + sql_join + " WHERE" + " " + sql_search.join(" AND ") + " ORDER BY" + " pact.pactid";
		db.setLimit(limit, (offset - 1) * limit);
		return db.queryHash(sql);
	}
};