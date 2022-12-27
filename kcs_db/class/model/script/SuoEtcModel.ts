import MtTableUtil from "../../MtTableUtil";

// 2022cvt_026
// require("MtPostUtil.php");
import MtPostUtil from "../../MtPostUtil";

// 2022cvt_026
// require("MtDBUtil.php");
import MtDBUtil from "../../MtDBUtil";

// 2022cvt_026
// require("MtOutput.php");
import MtOutput from "../../MtOutput";

// 2022cvt_026
// require("MtSetting.php");
import MtSetting from "../../MtSetting";

// 2022cvt_026
// require("model/ModelBase.php");
import ModelBase from "../../model/ModelBase";

import MtScriptAmbient from "../../MtScriptAmbient";

import TelModel from "../TelModel";

export default class SuoEtcModel extends ModelBase {
	O_MtScriptAmbient: MtScriptAmbient | null;
	O_TelModel: TelModel | undefined;

	constructor(O_msa: MtScriptAmbient | null = null) {
		super();
		this.O_MtScriptAmbient = O_msa;
	}

	getTelDetailsPointflag(pactid: any, yyyymm: any, carid: any) {
		return this.O_TelModel!.getTelDetailsPointflagCar(pactid, yyyymm, carid);
	}

	tweakDetailsTelno(pactid: string, yyyymm: any, carid: string) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	tweakDeleteRecode(pactid: number, yyyymm: string, carid: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	getTelDetailsPointAU(pactid: number, yyyymm: string, carid: number) {
		return this.O_TelModel!.getTelDetailsPointAU(pactid, yyyymm, carid);
	}

	getAuStage(charge, planid) //PacketWIN
	{
		if (true == (-1 !== this.getSetting().get("A_packet_win_single").indexOf(planid))) {
			return this.getSetting().get("suo_au_stage1");
		}

		if (charge >= this.getSetting().get("suo_au_stagecharge1")! && charge < this.getSetting().get("suo_au_stagecharge2")!) {
			return this.getSetting().get("suo_au_stage2");
		} else if (charge >= this.getSetting().get("suo_au_stagecharge2")!) {
			return this.getSetting().get("suo_au_stage3");
		} else {
			return this.getSetting().get("suo_au_stage1");
		}
	}

	async getTweakConf(pactid: string | number) {
// 2022cvt_015
		var A_conf = await this.get_DB().queryHash("SELECT * FROM tweak_config_tb WHERE pactid = " + pactid);
// 2022cvt_015
		var H_conf = Array();

// 2022cvt_015
		for (var value of A_conf) {
// 2022cvt_015
			var corp_cd = value.corp_cd;
			delete value.pactid;
			delete value.corp_cd;
			H_conf[corp_cd] = value;
		}

		if (1 > H_conf.length) {
			return false;
		}

		return H_conf;
	}

	getTelDetails(pactid: number, carid: number, yyyymm: string) {
// 2022cvt_015
		var addsql = " AND carid = " + carid + " ORDER BY telno, detailno ";
		return this.O_TelModel!.getTelDetailsData(pactid, yyyymm, addsql);
	}

	delTelDetails(pactid: number, carid: number, yyyymm: string) {
// 2022cvt_015
		var addsql = " AND carid = " + carid;
		return this.O_TelModel!.delTelDetailsData(pactid, yyyymm, addsql);
	}

	copyInsertTelDetails(yyyymm: string, A_details: string) {
		return this.O_TelModel!.insertCopyTelDetailsData(yyyymm, A_details);
	}

	async getCOCDofTel(pactid: number, telno: string, carid: number, yyyymm: string) {
// 2022cvt_015
		var postid = await this.getTelPostid(pactid, telno, carid, yyyymm);

		if (false == postid) {
			return false;
		}

		postid = this.get_DB().dbQuote(postid, "integer", true);
// 2022cvt_015
		var sql = "SELECT postname, pint1 AS cocd FROM " + MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm)) + " WHERE postid = " + postid;
// 2022cvt_015
		var H_tmp = { postname: "", cocd: "" }
		var A_tmp = this.get_DB().queryHash(sql);
		H_tmp.postname = A_tmp[0].postname;
		H_tmp.cocd = A_tmp[0].cocd;
		return H_tmp;
	}

	async checkViewPointOfPost(pactid: number, userid: string) //Tweakの設定取得
	//対応会社CDのポイントフラグがセットされていなかったらfalse
	{
// 2022cvt_015
		var level = this.getSetting().get("suo_cd_post_level");
// 2022cvt_015
		var postid = await this.getPostidOfUser(pactid, userid, level);

		if (false == postid) {
// 2022cvt_015
			for (var cnt = level - 1; cnt >= 0; cnt--) {
				postid = await this.getPostidOfUser(pactid, userid, cnt);

				if (false != postid) {
					level = cnt;
					break;
				}
			}
		}

		if (level == 0) {
			return true;
		}

// 2022cvt_015
		var sql = "SELECT pint1 AS cocd FROM post_tb WHERE postid =" + postid;
// 2022cvt_015
		var cocd = await this.get_DB().queryOne(sql);
// 2022cvt_015
		var A_conf = this.getTweakConf(pactid);

		if (false == (undefined !== A_conf[cocd].point_mng)) {
			return false;
		}

		return A_conf[cocd].point_mng;
	}

	getPostidOfUser(pactid: number, userid: string, level: number | undefined) {
		if (true == !level) {
			level = this.getSetting().get("suo_cd_post_level");
		}

// 2022cvt_015
		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromUser(userid, pactid, level);
	}

	getTelPostid(pactid: number, telno: string, carid: number, yyyymm: string) {
// 2022cvt_015
		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromTel(telno, pactid, carid, this.getSetting().get("suo_cd_post_level"), MtTableUtil.getTableNo(yyyymm));
	}

	getTelAddPoint(pactid: number, telno: number, carid: number, yyyymm: string) {
		return this.O_TelModel!.getTelAddPoint(pactid, telno, carid, yyyymm);
	}

	async checkTweakPointTbData(pactid: number, yyyymm: number) {
		var yyyymm2 = new Date(parseInt(yyyymm.toString().substring(0, 4)), parseInt(yyyymm.toString().substring(4, 2)), 1, 0, 0, 0).toJSON().slice(0,10).replace(/-/g,'-');
		// yyyymm = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2), 1, yyyymm.substr(0, 4)));
// 2022cvt_015
		var sql = "SELECT tp.postid FROM tweak_point_tb tp WHERE pactid = " + this.getDB().dbQuote(pactid, "integer") + " AND billdate = " + this.getDB().dbQuote(yyyymm2, "date");
		let sql_queryHash = await this.getDB().queryHash(sql);
		if (0 < sql_queryHash.length) {
			return true;
		}

		return false;
	}

	insertThisPoint(pactid: number, yyyymm: number, H_data: Array<any>) {
		var yyyymm2 = new Date(parseInt(yyyymm.toString().substring(0, 4)), parseInt(yyyymm.toString().substring(4, 2)), 1, 0, 0, 0).toJSON().slice(0,10).replace(/-/g,'-');
		// yyyymm = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2), 1, yyyymm.substr(0, 4)));
// 2022cvt_015
		var now = this.getDB().getNow();
// 2022cvt_015
		var sql = "INSERT INTO tweak_point_tb(" + "pactid," + "postid," + "billdate," + "d_thispoint," + "d_usedpoint," + "d_allpoint," + "au_thispoint," + "au_usedpoint," + "au_allpoint," + "recdate," + "fixdate" + ") VALUES(" + this.getDB().dbQuote(pactid, "integer") + "," + "?," + this.getDB().dbQuote(yyyymm2, "date") + "," + "?," + "0," + "0," + "?," + "0," + "0," + this.getDB().dbQuote(now, "timestamp") + "," + this.getDB().dbQuote(now, "timestamp") + ")";
// 2022cvt_015
		var A_insertdata = Array();

// 2022cvt_015
		for (var postid in H_data) {
// 2022cvt_015
			var H_thispoint = H_data[postid];
			A_insertdata.push([postid, H_thispoint.docomo, H_thispoint.au]);
		}

// 2022cvt_015
		var O_prepare = this.getDB().prepare(sql);
		return this.getDB().executeMultiple(O_prepare, A_insertdata, false);
	}

	checkNullCocdPost(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT * FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid IN(" + this.getSetting().get("car_docomo") + "," + this.getSetting().get("car_au") + ")" + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewBaseDocomo(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND (code = '" + this.getSetting().get("A_suo_docomo_basecode")[0] + "' AND charge > 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
// 2022cvt_015
		var A_tmp = await this.get_DB().queryHash(sql);
// 2022cvt_015
		var H_tmp = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakBaseDocomo(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND (code = '" + this.getSetting().get("A_suo_docomo_basecode")[0] + "' AND charge < 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakDetailsAU(pactid: number, yyyymm: number, A_tellist: Array<any>) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_016
// 2022cvt_015
		var sql = "SELECT tel.telno,tel.code,tel.codename,tel.charge,tel.detailno,tel.recdate,tel.tdcomment,uti.codetype FROM " + tel_details_tb + " tel " + "INNER JOIN utiwake_tb uti ON " + "tel.code = uti.code AND tel.carid  = uti.carid " + " WHERE " + " tel.pactid = " + pactid + " AND tel.carid = " + this.getSetting().get("car_au") + " AND tel.telno IN('" + A_tellist.join("','") + "') ORDER BY tel.telno,tel.detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakTaxAU(pactid: number, yyyymm: number, A_tellist: Array<any>) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND code = '" + this.getSetting().get("suo_au_taxcode") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakTaxDocomo(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND code = '" + this.getSetting().get("suo_docomo_taxcode") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewTaxAU(pactid: number, yyyymm: number, A_tellist: Array<any>) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND taxkubun = '" + this.getSetting().get("suo_au_taxkubun") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
// 2022cvt_015
		var A_tmp = await this.get_DB().queryHash(sql);
// 2022cvt_015
		var H_tmp = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	async tweakNewTotalAU(pactid: number, yyyymm: number, A_tellist: Array<any>) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_016
// 2022cvt_015
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " INNER JOIN utiwake_tb ON " + tel_details_tb + ".code = utiwake_tb.code AND " + tel_details_tb + ".carid = utiwake_tb.carid " + " WHERE " + " " + tel_details_tb + ".pactid = " + pactid + " AND " + tel_details_tb + ".carid = " + this.getSetting().get("car_au") + " AND utiwake_tb.codetype = " + this.getSetting().get("suo_au_calc_total_codetype") + " AND " + tel_details_tb + ".telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + " INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY " + tel_details_tb + ".telno ORDER BY " + tel_details_tb + ".telno";
// 2022cvt_015
		var A_tmp = await this.get_DB().queryHash(sql);
// 2022cvt_015
		var H_tmp = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakTotalAU(pactid: number, yyyymm: number, A_tellist: Array<any>) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno, code, charge, detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND code = '" + this.getSetting().get("suo_au_totalcode") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewTaxDocomo(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND taxkubun = '" + this.getSetting().get("suo_docomo_taxkubun") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
// 2022cvt_015
		var A_tmp = await this.get_DB().queryHash(sql);
// 2022cvt_015
		var H_tmp = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	async tweakNewTaxOnesDocomo(pactid: number, yyyymm: number) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND code NOT IN('" + this.getSetting().get("A_suo_docomo_taxkubun_notones").join("','") + "')" + " AND taxkubun = '" + this.getSetting().get("suo_docomo_taxkubun_ones") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
// 2022cvt_015
		var A_tmp = await this.get_DB().queryHash(sql);
// 2022cvt_015
		var H_tmp = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	deleteTaxDocomo(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	deleteTaxAU(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTaxAU(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTaxDocomo(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTweakBaseDocomo(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTweakAU(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + ", codename = '" + H_value.codename + "' ,tdcomment = '" + H_value.tdcomment + "'" + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTotalAU(pactid: number, yyyymm: number, H_value: { [key: string]: any }) {
// 2022cvt_015
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
// 2022cvt_015
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
