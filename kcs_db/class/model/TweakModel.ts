//SUO調整系基底

//2008/04/01	石崎公久	作成
import TelModel from "./TelModel"

import MtTableUtil from "../MtTableUtil"
import MtPostUtil from "../MtPostUtil"
import ModelBase from "./ModelBase"
import PostModel from "./PostModel"
import MtScriptAmbient from "../MtScriptAmbient"

export default class TweakModel extends ModelBase {
	O_MtScriptAmbient: MtScriptAmbient;
	O_TelModel: TelModel;
	constructor(
		O_msa: MtScriptAmbient) {
		super();
		this.O_MtScriptAmbient = O_msa;
		this.O_TelModel = new TelModel();
	}

	getTelDetailsPointflag(pactid: number, yyyymm: string, carid: number) {
		return this.O_TelModel.getTelDetailsPointflagCar(pactid, yyyymm, carid);
	}

	async tweakDetailsTelno(pactid: number, yyyymm: string, carid: number) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var A_corp_cd = await this.getTweakableCorpCd(pactid, carid);
		var sql = "SELECT telno FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL AND " + post_tb + ".pint1 IN (" + (A_corp_cd).join(", ") + ")) GROUP BY telno ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	getTweakableCorpCd(pactid: number, carid: number) {
		var sql = "SELECT corp_cd FROM tweak_config_tb WHERE pactid = " + pactid;

		if (carid == this.getSetting().get("car_docomo")) {
			sql += " AND  docomo_tweak_flag = true";
		} else if (carid == this.getSetting().get("car_au")) {
			sql += " AND au_tweak_flag = true";
		}

		return this.get_DB().queryCol(sql);
	}

	tweakDeleteRecode(pactid: number, yyyymm: string, carid: number, H_value: { telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	getTelDetailsPointAU(pactid: number, yyyymm: string, carid: number) {
		return this.O_TelModel.getTelDetailsPointAU(pactid, yyyymm, carid);
	}

	getAuStage(charge: number, planid: any) //PacketWIN
	{
		if (true == (-1 !== this.getSetting().get("A_packet_win_single").indexOf(planid))) {
			return this.getSetting().get("suo_au_stage1");
		}

		if (charge >= this.getSetting().get("suo_au_stagecharge1") && charge < this.getSetting().get("suo_au_stagecharge2")) {
			return this.getSetting().get("suo_au_stage2");
		} else if (charge >= this.getSetting().get("suo_au_stagecharge2")) {
			return this.getSetting().get("suo_au_stage3");
		} else {
			return this.getSetting().get("suo_au_stage1");
		}
	}

	async getTweakConf(pactid: number) {
		var A_conf = await this.get_DB().queryHash("SELECT * FROM tweak_config_tb WHERE pactid = " + pactid);
		var H_conf = Array();

		for (var value of A_conf) {
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
		var addsql = " AND carid = " + carid + " ORDER BY telno, detailno ";
		return this.O_TelModel.getTelDetailsData(pactid, yyyymm, addsql);
	}

	delTelDetails(pactid: number, carid: number, yyyymm: string) {
		var addsql:any = " AND carid = " + carid;
		return this.O_TelModel.delTelDetailsData(pactid, yyyymm, addsql);
	}

	copyInsertTelDetails(yyyymm: string, A_details: any) {
		return this.O_TelModel.insertCopyTelDetailsData(yyyymm, A_details);
	}

	async getCOCDofTel(pactid: number, telno: string, carid: number, yyyymm: string) {
		var postid = await this.getTelPostid(pactid, telno, carid, yyyymm);

		if (false == postid) {
			return false;
		}

		postid = this.get_DB().dbQuote(postid, "integer", true);
		var sql = "SELECT postname, pint1 AS cocd FROM " + MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm)) + " WHERE postid = '" + postid + "'";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp;
		H_tmp.postname = A_tmp[0].postname;
		H_tmp.cocd = A_tmp[0].cocd;
		return H_tmp;
	}

	async checkViewPointOfPost(pactid: number, userid: string) //Tweakの設定取得
	//対応会社CDのポイントフラグがセットされていなかったらfalse
	{
		let level = this.getSetting().get("suo_cd_post_level");
		let postid = await this.getPostidOfUser(pactid, userid, level);

		if (false == postid) {
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

		var sql = "SELECT pint1 AS cocd FROM post_tb WHERE postid ='" + postid + "'";
		var cocd = await this.get_DB().queryOne(sql);
		var A_conf: any = this.getTweakConf(pactid);

		if (false == (undefined !== A_conf[cocd].point_mng)) {
			return false;
		}

		return A_conf[cocd].point_mng;
	}

	getPostidOfUser(pactid: number, userid: string, level = 0) {
		if (true == !level) {
			level = this.getSetting().get("suo_cd_post_level");
		}

		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromUser(userid, pactid, level);
	}

	getTelPostid(pactid: number, telno: string, carid: number, yyyymm: string) {
		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromTel(telno, pactid, carid, this.getSetting().get("suo_cd_post_level"), MtTableUtil.getTableNo(yyyymm));
	}

	getTelAddPoint(pactid: number, telno: number, carid: number, yyyymm: string) {
		return this.O_TelModel.getTelAddPoint(pactid, telno, carid, yyyymm);
	}

	async checkTweakPointTbData(pactid: number, yyyymm: string) {
		yyyymm = new Date().getFullYear() + "" + new Date().getMonth();
		var sql = "SELECT tp.postid FROM tweak_point_tb tp WHERE pactid = " + this.getDB().dbQuote(pactid, "integer") + " AND billdate = " + this.getDB().dbQuote(yyyymm, "date");
		const sql_data = await this.getDB().queryHash(sql);
		if (0 < sql_data.length) {
			return true;
		}

		return false;
	}

	async insertThisPoint(pactid: number, yyyymm: string, H_data: any[]) {
		let yyyymmtrue = yyyymm;
		let O_post = new PostModel();
		yyyymm = new Date().getFullYear() + "" + new Date().getMonth();
		let now = this.getDB().getNow();
		let sql = "INSERT INTO tweak_point_tb(" + "pactid," + "postid," + "billdate," + "d_thispoint," + "d_usedpoint," + "d_allpoint," + "au_thispoint," + "au_usedpoint," + "au_allpoint," + "recdate," + "fixdate" + ") VALUES(" + this.getDB().dbQuote(pactid, "integer") + "," + "?," + this.getDB().dbQuote(yyyymm, "date") + "," + "?," + "0," + "0," + "?," + "0," + "0," + this.getDB().dbQuote(now, "timestamp") + "," + this.getDB().dbQuote(now, "timestamp") + ")";
		let A_insertdata = Array();

		for (var postid in H_data)  //ユーザ部署IDベースに変更
		//array_push($A_insertdata, array($postid, $H_thispoint["docomo"], $H_thispoint["au"]));
		{
			let H_thispoint = H_data[postid];
			let H_userpost = await O_post.getPostData(Number(postid), MtTableUtil.getTableNo(yyyymmtrue));
			A_insertdata.push([H_userpost.userpostid, H_thispoint.docomo, H_thispoint.au]);
		}

		var O_prepare = this.getDB().prepare(sql);
		return this.getDB().executeMultiple(O_prepare, A_insertdata, false);
	}

	checkNullCocdPost(pactid: number, yyyymm: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT * FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid IN(" + this.getSetting().get("car_docomo") + "," + this.getSetting().get("car_au") + ")" + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewBaseDocomo(pactid: number, yyyymm: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND (code = '" + this.getSetting().get("A_suo_docomo_basecode")[0] + "' AND charge > 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = await this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakBaseDocomo(pactid: number, yyyymm: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND (code = '" + this.getSetting().get("A_suo_docomo_basecode")[0] + "' AND charge < 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakDetailsAU(pactid: number, yyyymm: string, A_tellist: any[]) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT tel.telno,tel.code,tel.codename,tel.charge,tel.detailno,tel.recdate,tel.tdcomment,uti.codetype FROM " + tel_details_tb + " tel " + "INNER JOIN utiwake_tb uti ON " + "tel.code = uti.code AND tel.carid  = uti.carid " + " WHERE " + " tel.pactid = " + pactid + " AND tel.carid = " + this.getSetting().get("car_au") + " AND tel.telno IN('" + A_tellist.join("','") + "') ORDER BY tel.telno,tel.detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakTaxAU(pactid: number, yyyymm: string, A_tellist: any[]) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND code = '" + this.getSetting().get("suo_au_taxcode") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	async tweakTaxDocomo(pactid: number, yyyymm: string, telnos : any = undefined) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND code = '" + this.getSetting().get("suo_docomo_taxcode") + "' " + " AND telno IN(";

		if (!telnos) {
			var A_corp_cd = await this.getTweakableCorpCd(pactid, this.getSetting().get("car_docomo"));
			sql += "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL AND " + post_tb + ".pint1 IN (" + A_corp_cd.join(", ") + ")";
		} else {
			sql += "'" + telnos.join("', '") + "'";
		}

		sql += ") ORDER BY telno, detailno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewTaxAU(pactid: number, yyyymm: string, A_tellist: any[]) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND taxkubun = '" + this.getSetting().get("suo_au_taxkubun") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = await this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	async tweakNewTotalAU(pactid: number, yyyymm: string, A_tellist: any[]) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " INNER JOIN utiwake_tb ON " + tel_details_tb + ".code = utiwake_tb.code AND " + tel_details_tb + ".carid = utiwake_tb.carid " + " WHERE " + " " + tel_details_tb + ".pactid = " + pactid + " AND " + tel_details_tb + ".carid = " + this.getSetting().get("car_au") + " AND utiwake_tb.codetype = " + this.get_DB().dbQuote(this.getSetting().get("suo_au_calc_total_codetype"), "text", true) + " AND " + tel_details_tb + ".telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + " INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY " + tel_details_tb + ".telno ORDER BY " + tel_details_tb + ".telno";
		var A_tmp = await this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakTotalAU(pactid: number, yyyymm: string, A_tellist: any[]) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, code, charge, detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND code = '" + this.getSetting().get("suo_au_totalcode") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	async tweakNewTaxDocomo(pactid: number, yyyymm: string, telnos:any = undefined) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND taxkubun = '" + this.getSetting().get("suo_docomo_taxkubun") + "' " + " AND telno IN(";

		if (!telnos) {
			var A_corp_cd = await this.getTweakableCorpCd(pactid, this.getSetting().get("car_docomo"));
			sql += "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL AND " + post_tb + ".pint1 IN (" + A_corp_cd.join(", ") + ")";
		} else {
			sql += "'" + telnos.join("', '") + "'";
		}

		sql += ") GROUP BY telno ORDER BY telno";
		var A_tmp = await this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	async tweakNewTaxOnesDocomo(pactid: number, yyyymm: string) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().get("excise_tax") + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND code NOT IN('" + this.getSetting().get("A_suo_docomo_taxkubun_notones").join("','") + "')" + " AND taxkubun = '" + this.getSetting().get("suo_docomo_taxkubun_ones") + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().get("suo_cd_post_level") + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = await this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	deleteTaxDocomo(pactid: number, yyyymm: string, H_value: { telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	deleteTaxAU(pactid: number, yyyymm: string, H_value: { telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTaxAU(pactid: number, yyyymm: string, H_value: { tweakcharge: string; telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTaxDocomo(pactid: number, yyyymm: string, H_value: { tweakcharge: string; telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTweakBaseDocomo(pactid: number, yyyymm: string, H_value: { tweakcharge: string; telno: string; code: string; charge: string; detailno: string; recdate: string; }|any) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_docomo") + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut("実行:updateTweakBaseDocomo:" + pactid + ":" + yyyymm, 0);
		this.infoOut(H_value, 0);
		this.infoOut("sql:" + sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTweakAU(pactid: number, yyyymm: string, H_value: { tweakcharge: string; codename: string; tdcomment: string; telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + ", codename = '" + H_value.codename + "' ,tdcomment = '" + H_value.tdcomment + "'" + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTotalAU(pactid: number, yyyymm: string, H_value: { tweakcharge: string; telno: string; code: string; charge: string; detailno: string; recdate: string; }) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().get("car_au") + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}
};
