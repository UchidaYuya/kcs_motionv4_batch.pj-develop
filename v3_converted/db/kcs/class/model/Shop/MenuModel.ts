//
//メニューModel
//
//@uses ModelBase
//@package Menu
//@filesource
//@author katsushi
//@since 2008/06/17
//
//
//
//メニューModel
//
//@uses ModelBase
//@package Menu
//@author katsushi
//@since 2008/06/17
//

require("model/ModelBase.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/17
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getMenu
//
//@author katsushi
//@since 2008/06/17
//
//@param array $A_funcid
//@access public
//@return void
//
//
//getOrderableCarrier
//
//@author katsushi
//@since 2008/08/18
//
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//getOrderPattern
//
//@author katsushi
//@since 2008/08/18
//
//@param array $A_car
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class MenuModel extends ModelBase {
	constructor() {
		super();
	}

	getMenu(A_funcid: {} | any[]) {
		var sql = "select " + "fncid," + "fncname," + "memo," + "css," + "path," + "parent " + "from " + "shop_function_tb " + "where " + "type in ('US','SU') " + "and enable = true " + "and show = true " + "and (path is not null and path != '') " + "and fncid in (" + A_funcid.join(",") + ") " + "order by " + "show_order";
		return this.getDB().queryKeyAssoc(sql);
	}

	getOrderableCarrier(pactid, postid) {
		var select_sql = "SELECT " + "c.carid " + "FROM " + "shop_relation_tb s inner join carrier_tb c on s.carid=c.carid " + "WHERE " + "s.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + "AND s.postid = " + this.getDB().dbQuote(postid, "integer", true) + " " + "ORDER BY " + "c.sort," + "c.carid";
		return this.getDB().queryCol(select_sql);
	}

	getOrderPattern(A_car: {} | any[]) {
		if (is_null(A_car) || A_car.length == 0) //エラー回避の工夫
			{
				return Array();
			}

		var sql = "select " + "carid," + "cirid," + "ptnname," + "type," + "ppid," + "menucomment " + "from " + "mt_order_pattern_tb " + "where " + "carid in (" + A_car.join(",") + ") " + "and show = true " + "order by " + "carid," + "ptn_order";
		return this.getDB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};