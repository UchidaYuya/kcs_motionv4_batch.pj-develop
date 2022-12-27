//
//AdminメニューModel
//
//@uses ModelBase
//@package AdminMenu
//@filesource
//@author miyazawa
//@since 2009/09/08
//
//
//
//AdminメニューModel
//
//@uses ModelBase
//@package AdminMenu
//@author miyazawa
//@since 2009/09/08
//

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2009/09/08
//
//@param mixed $O_db
//@access public
//@return void
//
//
//権限取得
//
//@author miyazawa
//@since 2009/09/08
//
//@param array $A_funcid
//@access public
//@return void
//
//
//メニュー取得
//
//@author miyazawa
//@since 2009/09/08
//
//@param array $A_funcid
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/26
//
//@access public
//@return void
//
class AdminMenuModel extends ModelBase {
	constructor() {
		super();
	}

	getAuth(memid) {
		var sql = "SELECT " + "fncid " + "FROM " + "admin_fnc_relation_tb " + "WHERE " + "memid = " + memid;
		return this.getDB().queryCol(sql);
	}

	getMenu(groupid, A_funcid: {} | any[]) {
		var sql = "SELECT " + "fncid," + "fncname," + "memo," + "css," + "path," + "parent, " + "ininame, " + "menucolor " + "FROM " + "admin_function_tb " + "WHERE " + "type IN ('US','SU') " + "AND enable = true " + "AND show = true " + "AND (path IS NOT NULL AND path != '') " + "AND fncid IN (" + A_funcid.join(",") + ") " + "ORDER BY " + "show_order";
		return this.getDB().queryKeyAssoc(sql);
	}

	__destruct() {
		super.__destruct();
	}

};