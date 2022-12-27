//clampに関するモデル


import ModelBase from "./ModelBase";

import * as fs from "fs";
import { ScriptDB } from "../../script/batch/lib/script_db";
// const fs = require("fs")

export default class ClampModel extends ModelBase {
	static KEY_FILE_DIR = "/kcs/conf/au_dlkey";

	constructor(O_db: any = undefined) {
		super(O_db);
	}

	async getClampList(carid, pactid: string | undefined = undefined, A_loginStat = Array()) //契約ＩＤの指定がある場合
	{
		var sql = "select cl.pactid,cl.clampid,cl.clamppasswd,cl.detailno,cl.login_status,cl.code,cl.key_file,cl.key_pass," + "date(cl.pass_changedate) as pass_changedate,cl.pass_interval,pa.type,pa.compname " + "from clamp_tb cl inner join pact_tb pa on cl.pactid = pa.pactid " + "where cl.carid = " + carid + " ";

		if ("" != pactid) {
			sql += "and cl.pactid = " + pactid + " ";
		}

		if (0 != A_loginStat.length) {
			sql += "and cl.login_status in (" + A_loginStat.join(",") + ") ";
		}

		sql += "order by cl.pactid,cl.detailno";
		var H_result = await this.getDB().queryHash(sql);
		var recCnt = H_result.length;
		var H_clampData = Array();

		for (var recCounter = 0 + 1; recCounter < recCnt; recCounter++) //array(TYPE => array(PACTID => array(DETAILNO => CLAMPDATA)))
		{
			H_clampData[H_result[recCounter].type][H_result[recCounter].pactid][H_result[recCounter].detailno] = {
				clampid: H_result[recCounter].clampid,
				clamppasswd: H_result[recCounter].clamppasswd,
				login_status: H_result[recCounter].login_status,
				code: H_result[recCounter].code,
				key_file: H_result[recCounter].key_file,
				key_pass: H_result[recCounter].key_pass,
				pass_changedate: H_result[recCounter].pass_changedate,
				pass_interval: H_result[recCounter].pass_interval,
				compname: H_result[recCounter].compname
			};
		}

		return H_clampData;
	}

	getClamps(pactid, carid) {
		var sql = "SELECT " + "* " + "FROM " + "clamp_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " " + "ORDER BY " + "detailno";
		return this.getDB().queryHash(sql);
	}

	getClampRow(pactid, carid, detailno) {
		var sql = "SELECT " + "* " + "FROM " + "clamp_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND detailno = " + this.getDB().dbQuote(detailno, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	async getDownloadedList(carid) //レコード分処理する
	{
		var sql = "select pactid,year,month,type,date(dldate) as dldate from clamp_index_tb " + "where carid = " + carid;
		var H_result = await this.getDB().queryHash(sql);
		var recCnt = H_result.length;
		var H_downloadedData = Array();

		for (var recCounter = 0 + 1; recCounter < recCnt; recCounter++) {
			if (10 > H_result[recCounter].month) {
				var month = "0" + H_result[recCounter].month;
			} else {
				month = H_result[recCounter].month;
			}

			if (undefined !== H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month] == false) //array(PACTID => array(YYYYMM => TYPE)))
				{
					H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].type = [H_result[recCounter].type];
					H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].dldate = [H_result[recCounter].dldate];
				} else {
				H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].type.push(H_result[recCounter].type);
				H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].dldate.push(H_result[recCounter].dldate);
			}
		}

		return H_downloadedData;
	}

	updateStatus(pactid, detailno, carid, status) {
		var sql = "update clamp_tb set login_status = " + status + " " + "where pactid = " + pactid + " and " + "carid = " + carid + " and " + "detailno = " + detailno;
		return this.getDB().exec(sql);
	}

	updatePassChgDate(pactid, detailno, carid, now) {
		var sql = "update clamp_tb set pass_changedate = '" + now + "' " + "where pactid = " + pactid + " and " + "carid = " + carid + " and " + "detailno = " + detailno;
		return this.getDB().exec(sql);
	}

	getFailedList(carid, yyyy, mm) {
		var sql = "SELECT pactid,year,month,type FROM clamp_index_tb " + "WHERE carid = " + carid + " AND year='" + yyyy + "' AND month='" + mm + "' AND (is_details=false OR is_comm=false)";
		var H_failedData = this.getDB().queryHash(sql);
		return H_failedData;
	}

	async addClamp(pactid, carid, data) {
		var sql = "SELECT max(detailno) FROM clamp_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true);
		var detailno = await this.get_DB().queryOne(sql) + 1;
		var clamp: any;

		if (this.getSetting().get("car_docomo") == carid || this.getSetting().get("car_softbank") == carid) //auは情報が多い
			{
				clamp = {
					pactid: this.get_DB().dbQuote(pactid, "int", true),
					clampid: this.get_DB().dbQuote(data.clampid, "text", true),
					clamppasswd: this.get_DB().dbQuote(data.clamppasswd, "text", true),
					carid: this.get_DB().dbQuote(carid, "int", true),
					detailno: this.get_DB().dbQuote(detailno, "int", true)
				};
			} else if (this.getSetting().get("car_au") == carid) {
			clamp = {
				pactid: this.get_DB().dbQuote(pactid, "int", true),
				clampid: this.get_DB().dbQuote(data.clampid, "text", true),
				clamppasswd: this.get_DB().dbQuote(data.clamppasswd, "text", true),
				carid: this.get_DB().dbQuote(carid, "int", true),
				detailno: this.get_DB().dbQuote(detailno, "int", true),
				code: this.get_DB().dbQuote(data.code, "text", true),
				key_file: this.get_DB().dbQuote(this._getKeyFilePath(pactid) + data.key_file, "text", true),
				key_pass: this.get_DB().dbQuote(data.key_pass, "text", true)
			};
		}
		// sql = "INSERT INTO clamp_tb (" + ", ".join(Object.keys(clamp)) + ") " + "VALUES (" + ", ".join(clamp) + ")";
		sql = "INSERT INTO clamp_tb (" + Object.keys(clamp).join(",") + ") " + "VALUES (" + clamp.join(",") + ")";
		return this.get_DB().query(sql);
	}

	editClamp(pactid, carid, detailno, data) //パスワードは入力があった時だけ
	{
		var timestamp = this.get_DB().getNow();
		var sql = "UPDATE clamp_tb " + "SET " + "clampid=" + this.get_DB().dbQuote(data.clampid, "text", true) + " ";

		if (!!data.clamppasswd) {
			sql += ", clamppasswd=" + this.get_DB().dbQuote(data.clamppasswd, "text", true) + ", " + "pass_changedate=" + this.get_DB().dbQuote(timestamp, "date", true) + " ";
		}

		if (this.getSetting().get("car_au") == carid) {
			sql += ", code=" + this.get_DB().dbQuote(data.code, "text", true) + ", " + "key_file=" + this.get_DB().dbQuote(this._getKeyFilePath(pactid) + data.key_file, "text", true);

			if (!!data.clamppasswd) {
				sql += ", key_pass=" + this.get_DB().dbQuote(data.key_pass, "text", true);
			}
		}

		sql += "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND detailno=" + this.get_DB().dbQuote(detailno, "int", true);
		this.get_DB().beginTransaction();

		if (!this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	removeClamp(pactid, carid, detailno, data) {
		var sql = "DELETE FROM clamp_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND detailno=" + this.get_DB().dbQuote(detailno, "int", true);
		this.get_DB().beginTransaction();

		if (!this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	addParentTel(pactid, carid, data) {
		var sql = "INSERT INTO bill_prtel_tb " + "(pactid, carid, prtelno, prtelname) " + "VALUES (" + this.get_DB().dbQuote(pactid, "int", true) + ", " + this.get_DB().dbQuote(carid, "int", true) + ", " + this.get_DB().dbQuote(data.prtelno, "text", true) + ", " + this.get_DB().dbQuote(data.prtelname, "text", true) + ")";
		this.get_DB().query(sql);
	}

	editParentTel(pactid, carid, prtelno, data) {
		var sql = "UPDATE bill_prtel_tb " + "SET " + "prtelno=" + this.get_DB().dbQuote(data.prtelno, "text", true) + ", " + "prtelname=" + this.get_DB().dbQuote(data.prtelname, "text", true) + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);
		this.get_DB().beginTransaction();

		if (!this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	removeParentTel(pactid, carid, prtelno) {
		var sql = "DELETE FROM bill_prtel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);
		this.get_DB().beginTransaction();

		if (!this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	// addKeyFile(pactid) {
	// 	if (!fs.existsSync(ClampModel.KEY_FILE_DIR + "/pactid")) {// 2022cvt_003
	// 		mkdir(ClampModel.KEY_FILE_DIR + "/pactid");
	// 	}

	// 	if (is_uploaded_file(_FILES.key_file.tmp_name)) {
	// 		if (move_uploaded_file(_FILES.key_file.tmp_name, this._getKeyFilePath(pactid) + _FILES.key_file.name)) {
	// 			return true;
	// 		}
	// 	}

	// 	return false;
	// }

	removeKeyFile(pactid, file) {
		var file_path = this._getKeyFilePath(pactid);

		// if (!file_exists(file_path + file)) {
		if (!fs.existsSync(file_path + file)) {

			return 0;
		}

		try {
			fs.unlinkSync(file_path + file)
		} catch (e) {
			return 1;
		}
		return 2;
	}

	_getKeyFilePath(pactid) {
		return ClampModel.KEY_FILE_DIR + "/" + pactid + "/";
	}

	getKeyFileList(pactid, carid, mode) {
		if (fs.existsSync(ClampModel.KEY_FILE_DIR + "/" + pactid)) {// 2022cvt_003
			var file;
			var result: any;
			result = Array();
			// var dir = openDir(ClampModel.KEY_FILE_DIR + "/" + pactid);// 2022cvt_004
			var dir = fs.readdirSync(ClampModel.KEY_FILE_DIR + "/" + pactid);// 2022cvt_004

			// while (false !== (file = fs.readdir(dir))) {// 2022cvt_005
			for (file in dir) {// 2022cvt_005
				// if (!preg_match("/^\\./", file)) {
				if (!file.match("/^\\./")) {
					if ("hash" == mode) {
						result.push({
							key_file: file
						});
					} else {
						result[file] = file;
					}
				}
			}
		}

		return result;
	}

// 	convertPem(pactid, pass_phrase) {
// // 2022cvt_015
// 		var extension = pathinfo(_FILES.key_file.name, PATHINFO_EXTENSION);
// // 2022cvt_015
// 		var filename = pathinfo(_FILES.key_file.name, PATHINFO_FILENAME);

// // 2022cvt_015
// 		var up_dir = this._getKeyFilePath(pactid);

// 		if ("pfx" == extension) //変換
// 			//元ファイル削除
// 			//ファイル変換に失敗してたら消す
// 			{
// // 2022cvt_015
// 				var fp = popen("openssl pkcs12 -in " + up_dir + _FILES.key_file.name + " -out " + up_dir + filename + ".key", "w");
// 				fputs(fp, pass_phrase + "\n");
// 				fputs(fp, pass_phrase + "\n");
// 				fputs(fp, pass_phrase + "\n");
// 				pclose(fp);
// 				fp = popen("openssl rsa -in '" + up_dir + filename + ".key' -out '" + up_dir + filename + ".pem'", "w");
// 				fputs(fp, pass_phrase + "\n");
// 				pclose(fp);
// 				exec("openssl x509 -in '" + up_dir + filename + ".key'" + " >> '" + up_dir + filename + ".pem'");
// 				exec("rm -f '" + up_dir + filename + ".key'");
// 				exec("rm -f " + up_dir + _FILES.key_file.name);

// 				if (1 > filesize(up_dir + filename + ".pem")) {
// 					exec("rm -f '" + up_dir + filename + ".pem'");
// 					return false;
// 				}
// 			}

// 		return true;
// 	}

	updateCookie(pactid, carid, detailno, cookie) {
		var timestamp = this.get_DB().getNow();
		var sql = "update clamp_tb set cookie1=" + this.get_DB().dbQuote(cookie, "text", true) + " " + ",terminal_regist_date=" + this.get_DB().dbQuote(timestamp, "date", true) + " " + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " " + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " " + " and detailno=" + this.get_DB().dbQuote(detailno, "integer", true) + " " + ";";
		this.get_DB().query(sql);
	}
};
