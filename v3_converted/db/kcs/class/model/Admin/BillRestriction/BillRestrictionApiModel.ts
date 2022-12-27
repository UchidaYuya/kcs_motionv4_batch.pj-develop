//
//AdminOrderMenuModel
//
//@uses ModelBase
//@package
//@author web
//@since 2018/09/11
//

require("model/ModelBase.php");

const FNC_BILL_RESTRICTION = 270;
const FNC_BILL_RESTRICTION_CANCEL = 271;

//
//__construct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
//
//isGroupCheck
//対象のpactidが対象グループが調べよう
//@author web
//@since 2019/05/15
//
//@param mixed $groupid
//@param mixed $pactid
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
class BillRestrictionApiModel extends ModelBase {
	constructor() {
		super();
	}

	isGroupCheck(groupid, pactid) {
		if (groupid == 0) {
			return true;
		}

		var db = this.get_DB();
		var sql = "SELECT pact.pactid FROM pact_tb AS pact" + " JOIN fnc_relation_tb fnc ON " + " fnc.fncid=" + FNC_BILL_RESTRICTION + " AND fnc.pactid=pact.pactid" + " WHERE " + " pact.groupid=" + db.dbQuote(groupid, "integer", true) + " AND pact.pactid=" + db.dbQuote(pactid, "integer", true);
		var res = db.queryOne(sql);
		return !!res;
	}

	__destruct() {
		super.__destruct();
	}

};