//SUO割引額調整(model)
//2008/03/31
import TweakModel from "../TweakModel";
import MtTableUtil from "../../MtTableUtil";
import MtScriptAmbient from "../../MtScriptAmbient";

export default class TweakDetailsSUOModel extends TweakModel {
	O_msa: undefined;

	constructor(O_msa: MtScriptAmbient) {
		super(O_msa);
		this.O_msa = undefined;
	}

	async tweakTellistOfBaseDocomo(pactid: number, yyyymm: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var A_corp_cd = await this.getTweakableCorpCd(pactid, this.getSetting().get("car_docomo"));
		var sql = "SELECT telno FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND (code IN('" + this.getSetting().get("A_suo_docomo_basecode").join("','") + "') AND charge < 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL AND " + post_tb + ".pint1 IN (" + A_corp_cd.join(", ") + ")) GROUP BY telno ORDER BY telno";
		this.infoOut("実行:tweakTellistOfBaseDocomo:" + pactid + ":" + yyyymm, 0);
		this.infoOut(sql, 0);
		return this.get_DB().queryCol(sql);
	}

	searchTagetcodeDocomo(pactid: number, yyyymm: string, telno: string, docomo_code: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getSetting().get("car_docomo") + " AND " + "code = " + this.getDB().dbQuote(docomo_code, "text", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "charge < 0";
		this.infoOut("実行:searchTagetcodeDocomo:" + pactid + ":" + yyyymm + ":" + telno + ":" + docomo_code, 0);
		this.infoOut(sql, 0);
		return this.getDB().queryHash(sql);
	}

	sumChargeDocomoBasecode(pactid: number, yyyymm: string, telno: string, docomo_code: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT SUM(charge) AS charge FROM " + tel_details_tb + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getSetting().get("car_docomo") + " AND " + "code = " + this.getDB().dbQuote(docomo_code, "text", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "charge >= 0";
		this.infoOut("実行:sumChargeDocomoBasecode:" + pactid + ":" + yyyymm + ":" + telno + ":" + docomo_code, 0);
		this.infoOut(sql, 0);
		return this.getDB().queryOne(sql);
	}
};
