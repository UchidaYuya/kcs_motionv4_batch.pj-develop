//回線種別（circuit）からデータを取得するModel

import ModelBase from "./ModelBase";

export default class CircuitModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCircuitKeyHash(carid: number) {
		const sql = "select cirid,cirname from circuit_tb where carid=" + carid + " order by sort";
		const H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCircuitEngKeyHash(carid: number) {
		const sql = "select cirid,cirname_eng from circuit_tb where carid=" + carid + " order by sort";
		const H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCircuitCarrier(A_carid: string[]) {
		const sql = "select carid,cirid,cirname from circuit_tb where carid in (" + A_carid.join(",") + ") order by carid,sort";
		return this.getDB().queryHash(sql);
	}

	getCarid(cirid: number) {
		const sql = "select carid from circuit_tb where cirid = " + cirid;
		return this.getDB().queryOne(sql);
	}

	getPactAllCircuitKeyHash(pactid: number) {
		const sql = "select " + " ci.cirname" + " ,ci.cirname as cir" + " from " + " circuit_tb as ci " + " where " + " carid in (select ca.carid from carrier_tb as ca " + "\t\tleft outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null)) " + " group by ci.cirname" + " order by ci.cirname";
		const H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getPactAllCircuitEngKeyHash(pactid: number) {
		const sql = "select " + " ci.cirname_eng" + " ,ci.cirname_eng as cir" + " from " + " circuit_tb as ci " + " where " + " carid in (select ca.carid from carrier_tb as ca " + "\t\tleft outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null)) " + " group by ci.cirname_eng" + " order by ci.cirname_eng";
		const H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCiridOfOthersNamed() {
		const sql = "SELECT cirid FROM circuit_tb WHERE cirname='その他' ORDER BY carid, cirid";
		return this.get_DB().queryCol(sql);
	}
};
