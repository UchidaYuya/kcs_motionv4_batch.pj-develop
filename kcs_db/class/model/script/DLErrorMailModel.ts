//請求DLエラーメール
//2009/07/03 宮澤 作成
import ModelBase from "../../model/ModelBase";
import MtDateUtil from "../../MtDateUtil";

const FNCID_PACT_CLAMP = 205;

export default class DLErrorMailModel extends ModelBase {
	constructor() {
		super();
	}

	getDLErrorList() //その会社・キャリアの担当販売店ID、会社のタイプ（M/H）も一緒に取得する
	{
		var sql = "SELECT cl.pactid, cl.carid, cl.error_type, cl.message, cl.recdate, rs.shopid, pa.type, pa.compname, ca.carname";
		sql += " FROM clamp_error_tb cl LEFT JOIN pact_rel_shop_tb rs ON cl.pactid=rs.pactid AND cl.carid=rs.carid";
		sql += " INNER JOIN pact_tb pa ON cl.pactid=pa.pactid";
		sql += " INNER JOIN carrier_tb ca ON cl.carid=ca.carid";
		sql += " WHERE is_send = FALSE ORDER BY pactid, carid, recdate";
		return this.getDB().queryHash(sql);
	}

	getDLErrorMemMail(shopid) //ショップ代表の送信先アドレスを得る
	{
		var sql = "SELECT mem.mail FROM shop_member_tb mem INNER JOIN shop_tb sh ON mem.memid=sh.memid WHERE mem.type='SU' AND mem.shopid=" + shopid;
		return this.getDB().queryOne(sql);
	}

	getDLErrorMemName(pactid, postid, shopid, carid) //ショップ代表の送信先担当者名を得る
	{
		var sql = "SELECT name FROM shop_member_tb mem INNER JOIN shop_relation_tb rel ON mem.shopid=rel.shopid AND mem.memid=rel.memid";
		sql += " WHERE rel.pactid=" + pactid;
		sql += " AND rel.postid=" + postid;
		sql += " AND rel.shopid=" + shopid;
		sql += " AND rel.carid=" + carid;
		return this.getDB().queryOne(sql);
	}

	getRelPostid(pactid, shopid, carid, level) //$levelで指定した階層の、そのショップに関連付けられた部署IDを一つだけ取得
	{
		var sql = "SELECT postidparent,level FROM post_relation_tb WHERE pactid=" + pactid;
		sql += " AND postidparent IN (SELECT postid FROM shop_relation_tb WHERE shopid=" + shopid + " AND pactid=" + pactid + " AND carid=" + carid + ")";
		sql += " AND level=" + level;
		return this.getDB().queryOne(sql);
	}

	updateErrorStatus(H_status = Array()) {
		if (true == 0 < H_status.length) {
			var sql = "";
			var now = MtDateUtil.getNow();

			for (var val of H_status) {
				sql = "UPDATE clamp_error_tb SET is_send=true, fixdate = '" + now + "'";
// 2022cvt_016
				sql += " WHERE is_send=false AND pactid=" + val.pactid + " AND carid=" + val.carid + " AND error_type='" + val.error_type + "' AND message='" + val.message + "';";
				this.getDB().exec(sql);
			}
		}
	}

	async getHandInfo() {
		var sql = "select pactid,carid from clamp_tb" + " where pactid in (" + " select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + ")" + " order by pactid,carid" + ";";
		var result = await this.getDB().queryHash(sql);
		var H_rval = Array();

		for (var H_line of result) {
			var carid = H_line.carid;
			var pactid = H_line.pactid;
			if (!(undefined !== H_rval[pactid])) H_rval[pactid] = Array();
			if (!(-1 !== H_rval[pactid].indexOf(carid))) H_rval[pactid].push(carid);
		}

		return H_rval;
	}

	async getHandAddr() {
		var sql = "select pactid,mail from user_tb" + " where type='SU'" + " and pactid in (" + " select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + " )" + " order by pactid,userid" + ";";
		var result = await this.getDB().queryHash(sql);
		var H_rval = Array();

		for (var H_line of result) {
			var addr = H_line.mail;
			var pactid = H_line.pactid;
			if (!addr.length) continue;
			if (!(undefined !== H_rval[pactid])) H_rval[pactid] = Array();
			if (!(-1 !== H_rval[pactid].indexOf(addr))) H_rval[pactid].push(addr);
		}

		return H_rval;
	}
};
