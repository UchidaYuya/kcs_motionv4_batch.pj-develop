//
//回線種別（circuit）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//キャリア（carrier_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $O_db
//@access public
//@return void
//
//
//ciridをキーにcirnameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return void
//
//
//ciridをキーにcirname_engを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return void
//
//
//getCircuitCarrier
//
//@author katsushi
//@since 2008/07/09
//
//@param array $A_carid
//@access public
//@return void
//
//
//getCarid
//
//@author katsushi
//@since 2008/07/15
//
//@param mixed $cirid
//@access public
//@return void
//
//
//ciridをキーにcirnameを値にして返す（全てのcirid）
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $carid
//@access public
//@return void
//
//
//ciridをキーにcirname_engを値にして返す（全てのcirid）
//
//@author houshiyama
//@since 2009/09/08
//
//@param mixed $pactid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/21
//
//@access public
//@return void
//
class CircuitModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCircuitKeyHash(carid) {
		var sql = "select cirid,cirname from circuit_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCircuitEngKeyHash(carid) {
		var sql = "select cirid,cirname_eng from circuit_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCircuitCarrier(A_carid: {} | any[]) {
		var sql = "select carid,cirid,cirname from circuit_tb where carid in (" + A_carid.join(",") + ") order by carid,sort";
		return this.getDB().queryHash(sql);
	}

	getCarid(cirid) {
		var sql = "select carid from circuit_tb where cirid = " + cirid;
		return this.getDB().queryOne(sql);
	}

	getPactAllCircuitKeyHash(pactid) {
		var sql = "select " + " ci.cirname" + " ,ci.cirname as cir" + " from " + " circuit_tb as ci " + " where " + " carid in (select ca.carid from carrier_tb as ca " + "\t\tleft outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null)) " + " group by ci.cirname" + " order by ci.cirname";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getPactAllCircuitEngKeyHash(pactid) {
		var sql = "select " + " ci.cirname_eng" + " ,ci.cirname_eng as cir" + " from " + " circuit_tb as ci " + " where " + " carid in (select ca.carid from carrier_tb as ca " + "\t\tleft outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null)) " + " group by ci.cirname_eng" + " order by ci.cirname_eng";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCiridOfOthersNamed() {
		var sql = "SELECT cirid FROM circuit_tb WHERE cirname='\u305D\u306E\u4ED6' ORDER BY carid, cirid";
		return this.get_DB().queryCol(sql);
	}

	__destruct() {
		super.__destruct();
	}

};