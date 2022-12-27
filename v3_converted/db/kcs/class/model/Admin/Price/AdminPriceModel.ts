//
//管理者：価格表
//
//@uses PriceRegistBaseModel
//@package Price
//@subpackage Model
//@filesource
//@author katsushi
//@since 2008/07/29
//
//
//
//管理者価格表Model
//
//@uses ModelBase
//@package Price
//@subpackage Model
//@author katsushi
//@since 2008/07/29
//

require("model/PriceRegistBaseModel.php");

//
//__construct
//
//@author katsushi
//@since 2008/07/29
//
//@access public
//@return void
//
//
//getAdminAllPricelistOutline
//
//@author ishizaki
//@since 2008/08/05
//
//@param mixed $groupid
//@access public
//@return void
//
//
//getPriceRelation
//
//@author katsushi
//@since 2008/08/13
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/29
//
//@access public
//@return void
//
class AdminPriceModel extends PriceRegistBaseModel {
	constructor() {
		super();
	}

	getAdminAllPricelistOutline(groupid) {
		var select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.carid, " + "carrier_tb.carname, " + "pricelist_tb.ppid, " + "price_pattern_tb.ppname, " + "pricelist_tb.pricename, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.defaultflg," + "case when pricelist_tb.datefrom > current_date then 'still' when pricelist_tb.dateto < current_date then 'fin' else 'ok' end as state " + "FROM " + "pricelist_tb " + "INNER JOIN " + "price_pattern_tb ON price_pattern_tb.ppid = pricelist_tb.ppid " + "INNER JOIN " + "carrier_tb ON carrier_tb.carid = pricelist_tb.carid " + "WHERE " + "pricelist_tb.delflg = false AND " + "pricelist_tb.shopid = 0 AND " + "pricelist_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "ORDER BY " + "pricelist_tb.shopid, pricelist_tb.carid, pricelist_tb.ppid, pricelist_tb.fixdate DESC";
		return this.getDB().queryHash(select_sql);
	}

	getPriceRelation(pricelistid) {
		var sql = "select * from (" + "select " + "p.pactid," + "p.userid_ini," + "p.compname," + "null as postname," + "null as postid," + "s.name as shopname " + "from " + "price_relation_tb rel inner join pact_tb p on rel.pactid=p.pactid " + "inner join shop_tb s on rel.shopid=s.shopid " + "where " + "p.delflg = false " + "and s.delflg = false " + "and rel.postid = 0 " + "and rel.pricelistid = " + pricelistid + " " + "union " + "select " + "p.pactid," + "p.userid_ini," + "p.compname," + "po.postname," + "po.postid," + "s.name as shopname " + "from " + "price_relation_tb rel inner join shop_relation_tb sr on rel.shopid=sr.shopid and rel.postid=sr.postid and rel.pactid=sr.pactid " + "inner join pact_tb p on rel.pactid=p.pactid " + "inner join shop_tb s on rel.shopid=s.shopid " + "inner join post_tb po on rel.postid=po.postid " + "where " + "p.delflg = false " + "and s.delflg = false " + "and rel.pricelistid = " + pricelistid + ") as tbl " + "order by " + "pactid," + "postid";
		return this.getDB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};