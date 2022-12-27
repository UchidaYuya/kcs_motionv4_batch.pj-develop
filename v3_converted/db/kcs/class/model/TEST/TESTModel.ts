//
//テストModel
//
//@uses ModelBase
//@package TEST
//@filesource
//@author katsushi
//@since 2008/06/25
//
//
//
//テストModel
//
//@uses ModelBase
//@package TEST
//@author katsushi
//@since 2008/06/25
//

require("model/ModelBase.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getPact
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getOption
//
//@author katsushi
//@since 2008/06/25
//
//@param mixed $where
//@param mixed $order
//@param mixed $limit
//@access public
//@return void
//
//
//makeLimitSQL
//
//@author katsushi
//@since 2008/06/25
//
//@param mixed $limit
//@param mixed $offset
//@access public
//@return void
//
//
//makeOrderBySQL
//
//@author katsushi
//@since 2008/06/25
//
//@param mixed $column
//@param mixed $type
//@access public
//@return void
//
//
//makeWhereSQL
//
//@author katsushi
//@since 2008/06/25
//
//@param mixed $column
//@param mixed $query
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
class TESTModel extends ModelBase {
	constructor() {
		super();
	}

	getPact() {
		var sql = "select " + "pactid," + "userid_ini," + "compname," + "crg_post," + "chargername," + "mail," + "recdate," + "type," + "case when delflg = true then '\u524A\u9664' else '\u6709\u52B9' end as delflg " + "from " + "pact_tb " + "order by " + "pactid";
		return this.getDB().queryHash(sql);
	}

	getOption(where, order, limit) {
		var base_sql = "select " + "#SELECT# " + "from " + "option_tb o inner join carrier_tb ca on o.carid=ca.carid " + "inner join circuit_tb ci on o.cirid=ci.cirid ";
		var cnt_sql = str_replace("#SELECT#", "count(*)", base_sql) + where;
		var cnt = this.getDB().queryOne(cnt_sql);
		var sql = str_replace("#SELECT#", "o.opid, o.opname, ca.carname, ci.cirname, case when viewflg=true then '\u8868\u793A' else '\u975E\u8868\u793A' end as viewflg", base_sql) + where + " " + order + " " + limit;
		return [cnt, this.getDB().queryHash(sql)];
	}

	makeLimitSQL(limit, offset) {
		if (is_numeric(limit) == false) {
			limit = 20;
		}

		if (is_numeric(offset) == false) {
			offset = 0;
		} else {
			offset = limit * (offset - 1);
		}

		return "limit " + limit + " offset " + offset;
	}

	makeOrderBySQL(column, type) {
		if (column == "") {
			column = "opid";
		}

		if (type == "") {
			type = "asc";
		}

		return "order by " + column + " " + type;
	}

	makeWhereSQL(column, query) {
		if (column == "" || query == "") {
			return undefined;
		}

		return "where " + column + " like '%" + query + "%'";
	}

	__destruct() {
		super.__destruct();
	}

};