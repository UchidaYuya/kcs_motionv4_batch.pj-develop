
import {  } from './lib/script_db';
import { G_SCRIPT_BEGIN, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_DEBUG, G_SCRIPT_WARNING } from './lib/script_log';
import { G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from './lib/script_common';
import { DATA_DIR, DATA_EXP_DIR,  } from '../../db_define/define'

import { expDataByCursor } from '../pg_function';

import * as fs from 'fs';

export default class importNTTComModelBase {
	// static SCRIPT_NAMEJ = "NTTCom\u756A\u660E\u901A\u660EOCN\u8ACB\u6C42\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
	static SCRIPT_NAMEJ = "NTTCom番明通明OCN請求ファイルインポート";
	static SCRIPTNAME = "import_nttcom_proc";
	static NTTCOM_DIR = "NTT_com/ocn";
	static FIN_DIR = "fin";
	static FILE_EXT = "thi";
	static LOG_DELIM = " ";
	static KIND_MANAGE = "01";
	static KIND_BILL = "11";
	static KIND_TOTAL = "51";
	static KIND_EOF = "91";
	static NTTCOM_KIND = "wld";
	static NTTCOM_FIX_KIND = "fix";
	static FNC_ASP = 2;
	static NTTCOM_CARID = 14;
	static NTTCOM_ARID = 45;
	static NTTCOM_CIRID = 31;
	static NTTCOM_FIX_CARID = 9;
	static NTTCOM_FIX_ARID = 36;
	static NTTCOM_FIX_CIRID = 21;
	static TYPE_NOD = 1;
	static TYPE_TKD = 2;
	static REF_TYOSEI = "comtyosei";
	// static CODE_WARI = "\u5272\u5F15\u984D";
	static CODE_WARI = "割引額";
	static REF_ASP = G_CODE_ASP;
	// static REF_ASP_NAME = "ASP\u4F7F\u7528\u6599";
	static REF_ASP_NAME = "ASP使用料";
	static REF_ASX = G_CODE_ASX;
	static REF_ASX_NAME = "ASP使用料消費税";
	static EXCISE_RATE = G_EXCISE_RATE;

	O_base: any;
	H_argv: any;
	A_pactid = Array();

	datadir: any;
	billname: any;
	totalbill:any;
	billdir: any;
	carid: any;
	A_telnoX: any;
	H_telXinfo: any;
	dummytelno: any;
	dummypost: any;
	H_eracepact: any;
	A_pactDone: any;
	A_pactfail: any;

	arid: any;
	cirid: any;
	carkind: any;

	constructor(O_base) {
		this.O_base = O_base;
		this.H_argv = this.O_base.getArgv();
		this.A_pactid = Array();
	}

	outLog(str, flg = false) {
		if (true == flg) {
			// print("\n" + str + "\n\n");
			console.log("\n" + str + "\n\n");
		}

		this.getLog().putError(G_SCRIPT_BEGIN, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + str);
	}

	outError(str) {
		if (true == (undefined !== this.H_argv.targetpact) && true == (undefined !== this.H_argv.billdate)) {
			this.getLog().putError(G_SCRIPT_ERROR, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + this.H_argv.targetpact + importNTTComModelBase.LOG_DELIM + importNTTComModelBase.LOG_DELIM + this.H_argv.billdate + importNTTComModelBase.LOG_DELIM + str);
		} else {
			this.getLog().putError(G_SCRIPT_ERROR, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + str);
		}
	}

	outInfo(str) {
		this.getLog().putError(G_SCRIPT_INFO, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + this.H_argv.targetpact + importNTTComModelBase.LOG_DELIM + importNTTComModelBase.LOG_DELIM + this.H_argv.billdate + importNTTComModelBase.LOG_DELIM + str);
	}

	outDebug(str) {
		this.getLog().putError(G_SCRIPT_DEBUG, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + this.H_argv.targetpact + importNTTComModelBase.LOG_DELIM + importNTTComModelBase.LOG_DELIM + this.H_argv.billdate + importNTTComModelBase.LOG_DELIM + str);
	}

	outWarning(str) {
		this.getLog().putError(G_SCRIPT_WARNING, importNTTComModelBase.SCRIPT_NAMEJ + importNTTComModelBase.LOG_DELIM + this.H_argv.targetpact + importNTTComModelBase.LOG_DELIM + importNTTComModelBase.LOG_DELIM + this.H_argv.billdate + importNTTComModelBase.LOG_DELIM + str);
	}

	lock(is_lock) {
		if (undefined == this.getDB()) {
			return false;
		}

		var pre = "nttcom";

		if (true == is_lock) //$this->getDB()->query($sql);
			{
				this.getDB().begin();
				this.getDB().lock("clamptask_tb");
				var sql = "SELECT count(*) FROM clamptask_tb " + "WHERE command like '" + this.getDB().escape("%" + pre + "%") + "' " + "AND status = 1;";
				var count = this.getDB().getOne(sql);

				if (0 != count) {
					this.getDB().rollback();
					return false;
				}

				sql = "INSERT INTO clamptask_tb(command, status, recdate) " + "VALUES(" + "'" + this.getDB().escape(pre + "_" + importNTTComModelBase.SCRIPTNAME) + "', 1, 'now()');";
				this.getDB().commit();
			}

		return true;
	}

	checkDataDir(H_argv) {
		var tmpdir = DATA_DIR + "/" + H_argv.billdate + "/" + importNTTComModelBase.NTTCOM_DIR;

		if (false == fs.existsSync(tmpdir)) {
			// this.outLog("\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA (" + tmpdir + ")\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")", true);
			this.outLog("請求データファイルディレクトリ (" + tmpdir + ")が見つかりません(" + this.billname + ")", true);
			return false;
		}

		this.datadir = tmpdir;
		return true;
	}

	checkBillFileData(line, manage = false) {
		if (true == manage) {
			var kind = line.substring(11, 2);

			if (importNTTComModelBase.KIND_MANAGE != kind) {
				// this.outWarning("\u30D5\u30A1\u30A4\u30EB\u5185\u5BB9\u304C\u4ED5\u69D8\u3068\u7570\u306A\u308A\u307E\u3059\uFF081\u884C\u76EE\u304C\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u4EE5\u5916)(" + this.billname + ")");
				this.outWarning("ファイル内容が仕様と異なります（1行目が管理レコード以外)(" + this.billname + ")");
				return false;
			}
		}

		var date = line.substring(17, 6);

		if (this.H_argv.billdate != date) {
			// this.outWarning("\u8ACB\u6C42\u30D5\u30A1\u30A4\u30EB\u306E\u65E5\u4ED8\u304C\u6307\u5B9A\u3057\u305F\u5024\u3068\u7570\u306A\u308A\u307E\u3059(" + date + "!=" + this.H_argv.billdate + ")(" + this.billname + ")");
			this.outWarning("請求ファイルの日付が指定した値と異なります(" + date + "!=" + this.H_argv.billdate + ")(" + this.billname + ")");
			return false;
		}

		return true;
	}

	checkEOFRecord(line, pactid, filename) {
		var total = +line.substring(17, 12);

		if (this.totalbill != total) {
			// this.outWarning("\u8ACB\u6C42\u30D5\u30A1\u30A4\u30EB\u306E\u5408\u8A08\u984D\u3068\u53D6\u8FBC\u307F\u7D50\u679C\u304C\u7570\u306A\u308A\u307E\u3059(" + total + "!=" + this.totalbill + ")" + this.billname + ")");
			this.outWarning("請求ファイルの合計額と取込み結果が異なります(" + total + "!=" + this.totalbill + ")" + this.billname + ")");
			return false;
		}

		return true;
	}

	checkLockScript() {
		if (false == this.lock(true)) {
			// this.outError("2\u91CD\u8D77\u52D5\u3067\u3059\u3002\u524D\u56DE\u3001\u30A8\u30E9\u30FC\u3067\u7D42\u4E86\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059", true);
			this.outError("2重起動です。前回、エラーで終了している可能性があります");
			throw process.exit(1);// 2022cvt_009
		}

		return true;
	}

	checkLineLength(filename, line, length) {
		if (line.length != length) {
			// this.outWarning(filename + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + length + ")(" + this.billname + ")");
			this.outWarning(filename + "の一行の長さが異常(" + line.length + "!=" + length + ")(" + this.billname + ")");
			return false;
		}

		return true;
	}

	classifyBillData(data, kind = "") //$H_bill["code"] = substr($data, 0, 2);
	//網種別があれば足す
	{
		var H_bill: {[key: string]: any } = {};
		H_bill.code = data.substring(2, 4);
		H_bill.bill = +data.substring(6, 10);
		H_bill.rest = data.substring(16, 3);
		H_bill.taxtype = data.substring(19, 2);

		if ("" != kind) {
			H_bill.code = kind + H_bill.code;
		}

		return H_bill;
	}

	doBackup() {
		// var outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("teldetailX") + date("YmdHis") + "exp";
		var outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("teldetailX") + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + "exp";
		var sql = "SELECT * FROM " + this.O_base.getTable("teldetailX");
		this.getDB().begin();

		// if (0 != doCopyExp(sql, outfile, this.getDB())) {
			if (0 != expDataByCursor(sql, outfile, this.getDB())) {
			// this.outWarning(this.O_base.getTable("teldetail") + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + this.billname + ")");
			this.outWarning(this.O_base.getTable("teldetail") + "のデータエクスポートに失敗しました(" + this.billname + ")");
			this.getDB().rollback();
			this.lock(false,);
			throw process.exit(1);// 2022cvt_009
		}

		// outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("commhistory") + date("YmdHis") + "exp";
		outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("commhistory") + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + "exp";
		sql = "SELECT * FROM " + this.O_base.getTable("commhistory");

		// if (0 != doCopyExp(sql, outfile, this.getDB())) {
		if (0 != expDataByCursor(sql, outfile, this.getDB())) {
			// this.outWarning(this.O_base.getTable("commhistory") + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + this.billname + ")");
			this.outWarning(this.O_base.getTable("commhistory") + "のデータエクスポートに失敗しました(" + this.billname + ")");
			this.getDB().rollback();
			this.lock(false);
			throw process.exit(1);// 2022cvt_009
		}

		// outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("telx") + date("YmdHis") + "exp";
		outfile = DATA_EXP_DIR + "/" + this.O_base.getTable("telx") + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + "exp";
		sql = "SELECT * FROM " + this.O_base.getTable("telX");

		// if (0 != doCopyExp(sql, outfile, this.getDB())) {
		if (0 != expDataByCursor(sql, outfile, this.getDB())) {
			// this.outWarning(this.O_base.getTable("telX") + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + this.billname + ")");
			this.outWarning(this.O_base.getTable("telX") + "のデータエクスポートに失敗しました(" + this.billname + ")");
			this.getDB().rollback();
			this.lock(false);
			throw process.exit(1);// 2022cvt_009
		}

		this.getDB().commit();
		return true;
	}

	execBackup(flg: string) {
		if ("y" == flg) {
			// this.outInfo("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u958B\u59CB");
			this.outInfo("バックアップ処理開始");

			// if (true == doBackup()) {
			if (true == this.doBackup()) {
				// this.outInfo("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u7D42\u4E86");
				this.outInfo("バックアップ処理終了");
			} else {
				// this.outError("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u5931\u6557");
				this.outError("バックアップ失敗");
				throw process.exit(1);// 2022cvt_009
			}
		}
	}

	getBillDir() {
		return this.billdir;
	}

	getDataDir() {
		return this.datadir;
	}

	getDB() {
		return this.O_base.getDB();
	}

	getLog() {
		return this.O_base.getLog();
	}

	getMinimamCarrierPost(telno) {
		var sql = "SELECT postid FROM " + this.O_base.getTable("telx") + " WHERE telno='" + telno + "' " + "ORDER BY carid";
		return this.getDB().getOne(sql, true);
	}

	getTargetPact(pactid: string) {
		if ("all" == pactid) {
			var filename;
			// var dirh = openDir(this.datadir);
			var dirh = fs.readdirSync(this.datadir);

			// while (filename = fs.readdir(dirh)) {
			for (filename in dirh) {
				if (fs.existsSync(this.datadir + "/" + filename)) {
					var datafile;
					// var dir_type_h = openDir(this.datadir + "/" + filename);
					var dir_type_h = fs.readdirSync(this.datadir + "/" + filename);

					// while (datafile = fs.readdir(dir_type_h)) {
					for (datafile in dir_type_h) {
						if (fs.existsSync(this.datadir + "/" + filename + "/" + datafile)) {
							// if (is_numeric(datafile) && !(-1 !== this.A_pactid.indexOf(datafile))) {
							if (!isNaN(Number(datafile)) && !(-1 !== this.A_pactid.indexOf(datafile))) {
								this.A_pactid.push(datafile);
							}
						}
					}
				}

// 				clearstatcache();
			}

			// closedir(dirh);
		} else {
			this.A_pactid.push(pactid);
		}

		if (0 == this.A_pactid.length) {
			// this.outError("Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C1\u3064\u3082\u3042\u308A\u307E\u305B\u3093(" + this.billname + ")", true);
			this.outError("Pact用データディレクトリが1つもありません(" + this.billname + ")");
			return false;
		}

		return true;
	}

	getUtiwakeCode(carid, plus = undefined) {
		var sql = "SELECT code, name, kananame FROM utiwake_tb WHERE carid=" + carid;

		if (undefined != plus) {
			sql += plus;
		}

		return this.getDB().getHash(sql, true);
	}

	getPact() {
		var sql = "SELECT pactid, compname FROM pact_tb WHERE type='M' ORDER BY pactid";
		var H_result = this.getDB().getHash(sql, true);
		var pactcnt = H_result.length;

		var H_pactid;

		for (var i = 0 + 1; i < pactcnt; i++) {
			H_pactid[H_result[i].pactid] = H_result[i].compname;
		}

		return H_pactid;
	}

	getUtiwake(plus = undefined, carid = "") //網種別を除く
	//foreach($H_result as $key=>$val){
	//			$H_result[$key]["code"] = preg_replace("/[0-9]-/", "", $val["code"]);
	//		}
	{
		if ("" == carid) {
			carid = this.carid;
		}

		var sql = "SELECT code, name FROM utiwake_tb WHERE carid=" + carid;

		if (undefined != plus) {
			sql += plus;
		}

		var H_result = this.getDB().getHash(sql, true);
		return H_result;
	}

	getFileName(A_billFile, cnt: number) //拡張子いらないらしいのでやめた
	//		if(1 == ($cnt)){
	//			$fileName = substr($A_billFile[0], 0, (strlen($A_billFile[0]) - 4));
	//		}
	//		// 下３桁のシーケンス番号を削って返す
	//		elseif(1 < $cnt){
	//			$fileName = substr($A_billFile[0], 0, (strlen($A_billFile[0]) - 7));
	//		}
	//下３桁のシーケンス番号を削って返す
	{
		if (1 < cnt) {
			var fileName = A_billFile[0].substring(0, A_billFile[0].length - 3);
		} else {
			fileName = A_billFile[0];
		}

		return fileName;
	}

	getBillNo(carid, pactid) //$sql = "SELECT prtelno FROM bill_prtel_tb WHERE carid=" .$carid. " AND prtelname='" .$name. "'";
	{
		var sql = "SELECT prtelno FROM bill_prtel_tb WHERE carid=" + carid + " AND pactid=" + pactid;
		return this.getDB().getOne(sql, true);
	}

	getBillCode(carid, pactid) {
		var sql = "SELECT prtelno FROM bill_prtel_tb WHERE carid=" + carid + " AND pactid=" + pactid;
		var H_result = this.getDB().getHash(sql, true);
		var A_code = Array();
		var cnt = H_result.length;

		for (var i = 0 + 1; i < cnt; i++) {
			A_code.push(H_result[i].prtelno);
		}

		return A_code;
	}

	getHashCode(H_utiwake) {
		var H_result = Array();

		// for (var val of Object.values(H_utiwake)) {
		for (var val of H_utiwake) {
			H_result[val.code] = val.name;
		}

		return H_result;
	}

	getTelInfo(carid, pactid) {
		var sql = "SELECT " + "carid " + "FROM " + this.O_base.getTable("telX") + " " + "WHERE " + "pactid=" + pactid + " AND carid != " + carid + " " + "GROUP BY " + "carid";
		var H_carrier = this.getDB().getCol(sql, true);
		this.A_telnoX = Array();

		// for (var carrier of Object.values(H_carrier)) {
		for (var carrier of H_carrier) {
			sql = "SELECT " + "telno, userid, kousiflg, kousiptn, username, employeecode, mail, machine, color, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, " + "int1, int2, int3, date1, date2, memo, username_kana, kousi_fix_flg, " + "mail1, mail2, mail3, url1, url2, url3 " + "FROM " + this.O_base.getTable("telX") + " " + "WHERE " + "pactid=" + pactid + " AND carid = " + carrier;
			var H_result = this.getDB().getHash(sql, true);

			for (var key in H_result) {
				var val = H_result[key];
				this.A_telnoX.push(val.telno);
				this.H_telXinfo[val.telno] = true;
			}
		}
	}

	getDummyTel(carid, pactid, name) {
		var sql = "SELECT " + "postid, telno " + "FROM dummy_tel_tb " + "WHERE " + "pactid=" + pactid + " " + " AND carid=" + carid;
		var dummy = this.getDB().getHash(sql, true);

		if (true == (undefined !== dummy[0])) {
			this.dummytelno = dummy[0].telno;
			this.dummypost = dummy[0].postid;
		}
	}

	getEraceFlag() {
		return this.H_eracepact;
	}

	moveFinishDir(billtype, pactid) {
		var pactdir = this.datadir + "/" + billtype + "/" + pactid;
		var findir = pactdir + "/" + importNTTComModelBase.FIN_DIR;

		// if (true == is_file(findir)) {
		if (true == fs.statSync(findir).isFile()) {
			// this.outWarning(findir + "\u306F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
			this.outWarning(findir + "はディレクトリではありません");
		}

		if (false == fs.existsSync(findir)) {
			// if (false == mkdir(findir)) {
			fs.mkdirSync(findir)
			// 	this.outWarning(findir + "\u306E\u4F5C\u6210\u306B\u5931\u6557");
			this.outWarning(findir + "の作成に失敗");
			// 	return false;
			// }
		}

		// var dirh = openDir(pactdir);
		var dirh = fs.readdirSync(pactdir);

		// while (fname = fs.readdir(dirh)) {
		for (var fname in dirh) {
			var fpath = pactdir + "/" + fname;

			// if (is_file(fpath)) {
			if (fs.statSync(fpath).isFile()) {
				// if (false == rename(fpath, findir + "/" + fname)) {
				fs.renameSync(fpath, findir + "/" + fname)
					// this.outWarning(fname + "\u306E\u79FB\u52D5\u5931\u6557");
					this.outWarning(fname + "の移動失敗");
				// 	return false;
				// }
			}

// 			clearstatcache();
		}

		// closedir(dirh);
		return true;
	}

	outResult() {
		if (0 < this.A_pactDone.length) {
			// print("COMPLETE_PACTS," + this.A_pactDone.join(", ") + "\n");
			console.log("COMPLETE_PACTS," + this.A_pactDone.join(", ") + "\n");
		} else {
			// this.outInfo("\u8AAD\u8FBC\u306B\u6210\u529F\u3057\u305Fpact\u304C\u3072\u3068\u3064\u3082\u306A\u304B\u3063\u305F");
			this.outInfo("読込に成功したpactがひとつもなかった");
		}

		if (0 < this.A_pactfail.length) {
			// print("FAILED_PACTS," + this.A_pactfail.join(", ") + "\n");
			console.log("FAILED_PACTS," + this.A_pactfail.join(", ") + "\n");
		}

		// this.outInfo("\u51E6\u7406\u7D42\u4E86");
		this.outInfo("処理終了");
	}

	setCarrierID(carid) {
		this.carid = carid;

		switch (carid) {
			case importNTTComModelBase.NTTCOM_CARID:
				this.arid = importNTTComModelBase.NTTCOM_ARID;
				this.cirid = importNTTComModelBase.NTTCOM_CIRID;
				this.carkind = importNTTComModelBase.NTTCOM_KIND;
				break;

			case importNTTComModelBase.NTTCOM_FIX_CARID:
				this.arid = importNTTComModelBase.NTTCOM_FIX_ARID;
				this.cirid = importNTTComModelBase.NTTCOM_FIX_CIRID;
				this.carkind = importNTTComModelBase.NTTCOM_FIX_KIND;
		}
	}

	setDataDir(dir) {
		this.datadir = dir;
	}

	setEraceFlag(carid, pact) {
		this.H_eracepact[carid][pact] = true;
	}

// 	__destruct() {}

};
