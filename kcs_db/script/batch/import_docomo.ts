
import { ProcessDefault,  } from './lib/process_base';
import { ImportDocomoTel } from './lib/import_docomo_tel';
import ImportDocomoComm from './lib/import_docomo_comm';
import { ImportDocomoInfo } from './lib/import_docomo_info';
import { ImportDocomoBill } from './lib/import_docomo_bill';
// import {  } from './lib/hotline_mail';
import { G_CLAMP_DOCOMO_FIN, sprintf, G_LOG, G_LOG_HAND  } from '../../db_define/define';
import { G_CARRIER_DOCOMO, G_CLAMPFILE_STATUS_DOWNLOAD, G_CLAMP_DOCOMO_COMM_TYPE } from './lib/script_common';
import { G_SCRIPT_WARNING, G_SCRIPT_SQL, G_SCRIPT_INFO, ScriptLogBase } from './lib/script_log';
import { TableInserter } from './lib/script_db';

import { ImportDocomoTelno } from './lib/import_docomo_base';
import { execSync } from 'child_process';
import * as PATH from 'path';
import * as fs from 'fs';
import { setTimeout } from 'timers/promises'

const G_PROCNAME_IMPORT_DOCOMO = "import_docomo";
const G_OPENTIME_IMPORT_DOCOMO = "0000,2400";
const G_PROCNAME_IMPORT_DOCOMO_WAIT = "load_docomo";

class ProcessImportDocomo extends ProcessDefault {

	ProcessDefault: any;

	m_forceflag: any;
	m_defaultadd: any;
	m_gzflag: any;
	m_clearflag: any;
	m_waitflag: any;
	m_A_type: any;
	m_moveflag:any;
	m_stop_mail: any;
	m_A_send_keys: any;
	m_A_utiwake_insert: any;

	m_addtelflag: any;
	m_srcpath: any

	m_cur_filename: any;

	ProcessImportDocomo(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime, true);
		this.m_args.addSetting({
			f: {
				type: "int"
			},
			a: {
				type: "int"
			},
			g: {
				type: "int"
			},
			e: {
				type: "int"
			},
			s: {
				type: "string"
			},
			w: {
				type: "int"
			},
			t: {
				type: "string"
			},
			M: {
				type: "int"
			},
			E: {
				type: "int"
			}
		});
		this.m_forceflag = false;
		this.m_defaultadd = true;
		this.m_gzflag = true;
		this.m_clearflag = false;
		this.m_waitflag = false;
		this.m_A_type = Array();
		this.m_moveflag = true;
		this.m_stop_mail = true;
		this.m_A_send_keys = Array();
		this.m_A_utiwake_insert = Array();
	}

	getProcname() {
		// return "\u30AF\u30E9\u30F3\u30D7\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
		return "クランプファイルインポートプロセス(ドコモ専用)";
	}

	commitArg(args) {
		// if (!ProcessDefault.commitArg(args)) return false;
		if (!this.commitArg(args)) return false;

		switch (args.key) {
			case "f":
				this.m_forceflag = args.value;
				break;

			case "a":
				this.m_addtelflag = args.value;
				this.m_defaultadd = false;
				break;

			case "g":
				this.m_gzflag = args.value;
				break;

			case "e":
				this.m_clearflag = args.value;
				break;

			case "s":
				this.m_srcpath = args.value;

				if (0 == this.m_srcpath.length) //「-s=」オプションなら/kcs/data/@y/docomo/@p/から読み出す
					{
						// this.m_srcpath = str_replace("/fin/", "/", G_CLAMP_DOCOMO_FIN);
						this.m_srcpath =  G_CLAMP_DOCOMO_FIN.replace("/fin/", "/");
					}

				break;

			case "w":
				this.m_waitflag = args.value;
				break;

			case "t":
				if (args.value.length) {
					var result = args.value.split(",");

					// for (var line of Object.values(result)) if (line.length) this.m_A_type.push(line);
					for (var line of result) if (line.length) this.m_A_type.push(line);
				}

				break;

			case "M":
				this.m_moveflag = args.value;
				break;

			case "E":
				this.m_stop_mail = !args.value;
				break;
		}

		return true;
	}

	getUsage() {
		// var rval = ProcessDefault.getUsage();
		var rval = this.getUsage();
		// rval.push(["-f={0|1}", "\u9001\u4ED8\u5148\u30B3\u30FC\u30C9\u306E\u30C6\u30B9\u30C8\u3092\u7701\u7565\u3059\u308B\u304B(0)"]);
		// rval.push(["-a={0|1}", "tel_tb\u306B\u8FFD\u52A0\u3059\u308B\u304B(-y\u304C\u73FE\u5728\u306A\u30891,\u3067\u306A\u3051\u308C\u30700)"]);
		// rval.push(["-g={0|1}", "gzip\u5727\u7E2E\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u304B(1)"]);
		// rval.push(["-e={0|1}", "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3059\u308B\u304B(0)"]);
		// rval.push(["-s=path", "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0\u306E\u30D1\u30B9(null\u306A\u3089clampfile_tb)(null)"]);
		// rval.push(["-w={0|1}", "DB\u633F\u5165\u30D7\u30ED\u30BB\u30B9\u306E\u5B8C\u4E86\u307E\u3067\u5F85\u3064\u304B(0)"]);

		// rval.push(["-t=type[,type...]", "DB\u304B\u3089\u8AAD\u307F\u51FA\u3059\u5834\u5408\u306B\u3001\u8AAD\u307F\u51FA\u3059type"]);
		// rval.push(["-M={0|1|2}", "\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u305F\u30D5\u30A1\u30A4\u30EB\u3092{\u79FB\u52D5\u3057\u306A\u3044|\u3059\u308B|\u30B3\u30D4\u30FC}(1)"]);
		// rval.push(["-E={0|1}", "\u30B7\u30E7\u30C3\u30D7\u3042\u3066\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3059\u308B\u304B(0)"]);

		rval.push(["-f={0|1}", "送付先コードのテストを省略するか(0)"]);
		rval.push(["-a={0|1}", "tel_tbに追加するか(-yが現在なら1,でなければ0)"]);
		rval.push(["-g={0|1}", "gzip圧縮されたファイルか(1)"]);
		rval.push(["-e={0|1}", "インポート前にDBからレコードを削除するか(0)"]);
		rval.push(["-s=path", "ソースフォルダのパス(nullならclampfile_tb)(null)"]);
		rval.push(["-w={0|1}", "DB挿入プロセスの完了まで待つか(0)"]);

		rval.push(["-t=type[,type...]", "DBから読み出す場合に、読み出すtype"]);
		rval.push(["-M={0|1|2}", "インポートしたファイルを{移動しない|する|コピー}(1)"]);
		rval.push(["-E={0|1}", "ショップあてメールを送信するか(0)"]);
		return rval;
	}

	getManual() {
		// var rval = ProcessDefault.getManual();
		var rval = this.getManual();
		// rval += "\u9001\u4ED8\u5148\u30B3\u30FC\u30C9\u30C1\u30A7\u30C3\u30AF";
		rval += "送付先コードチェック";
		// if (this.m_forceflag) rval += "\u305B\u305A";
		if (this.m_forceflag) rval += "せず";
		rval += "\n";

		var d = new Date();

		if (this.m_defaultadd) {
			// if (date("Y") == this.m_year && date("n") == this.m_month) this.m_addtelflag = true;else this.m_addtelflag = false;
			if (d.getFullYear() == this.m_year && new Date().getMonth()+1 == this.m_month) this.m_addtelflag = true;else this.m_addtelflag = false;
		}

		// rval += "tel_tb\u306B\u96FB\u8A71\u8FFD\u52A0";
		// rval += this.m_addtelflag ? "\u3059\u308B" : "\u3057\u306A\u3044";
		rval += "tel_tbに電話追加";
		rval += this.m_addtelflag ? "する" : "しない";
		rval += "\n";
		// rval += (this.m_gzflag ? "\u5727\u7E2E\u30D5\u30A1\u30A4\u30EB" : "\u751F\u30D5\u30A1\u30A4\u30EB") + "\n";
		// rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664";
		// rval += this.m_clearflag ? "\u3059\u308B" : "\u3057\u306A\u3044";
		rval += (this.m_gzflag ? "圧縮ファイル" : "生ファイル") + "\n";
		rval += "インポート前にDBからレコードを削除";
		rval += this.m_clearflag ? "する" : "しない";
		rval += "\n";

		if (0 == this.m_srcpath.length) {
		// 	rval += "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0\u306A\u3057/clampfile_tb\u304B\u3089\u8AAD\u307F\u51FA\u3059\n";
		// } else rval += "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0" + this.m_srcpath + "\n";
		rval += "ソースフォルダなし/clampfile_tbから読み出す\n";
		} else rval += "ソースフォルダ" + this.m_srcpath + "\n";

		// rval += "DB\u633F\u5165\u30D7\u30ED\u30BB\u30B9\u3092";
		// rval += this.m_waitflag ? "\u5F85\u3064" : "\u5F85\u305F\u306A\u3044";
		rval += "DB挿入プロセスを";
		rval += this.m_waitflag ? "待つ" : "待たない";
		rval += "\n";

		if (this.m_A_type.length) {
			// rval += "DB\u304B\u3089\u8AAD\u307F\u51FA\u3059type";
			rval += "DBから読み出すtype";

			// for (var type of Object.values(this.m_A_type)) rval += "," + type;
			for (var type of this.m_A_type) rval += "," + type;

			rval += "\n";
		}

		// rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u6210\u529F\u3057\u305F\u30D5\u30A1\u30A4\u30EB\u3092";
		rval += "インポートに成功したファイルを";

		switch (this.m_moveflag) {
			case 0:
				// rval += "\u79FB\u52D5\u3057\u306A\u3044";
				rval += "移動しない";
				break;

			case 1:
				// rval += "\u79FB\u52D5\u3059\u308B";
				rval += "移動する";
				break;

			default:
				// rval += "\u30B3\u30D4\u30FC\u3059\u308B";
				rval += "コピーする";
				break;
		}

		rval += "\n";
		// rval += "\u30B7\u30E7\u30C3\u30D7\u3042\u3066\u30E1\u30FC\u30EB\u3092\u9001\u4FE1";
		rval += "ショップあてメールを送信";
		// rval += this.m_stop_mail ? "\u3057\u306A\u3044" : "\u3059\u308B";
		rval += this.m_stop_mail ? "しない" : "する";
		rval += "\n";
		return rval;
	}

	getCurrentFilename() {
		return this.m_cur_filename;
	}

	async wait() {
		if (!this.m_waitflag) return true;
		if (this.m_srcpath.length) return true;

		while (true) //一定期間スリープして再試行
		{
			if (this.isOpen()) return false;
			var sql = "select count(*) from clamptask_tb";
			sql += " where status=1";
			sql += " and command='" + this.m_db.escape(G_PROCNAME_IMPORT_DOCOMO_WAIT) + "'";
			sql += ";";
			if (0 == await this.m_db.getOne(sql)) break;
			// sleep(10);
			await setTimeout(10);
		}

		return true;
	}

	async executePactid(pactid, logpath) //ソースフォルダがなければ、clampfile_tbからファイルを取得
	//インポート実行
	{
		var srcpath = this.m_srcpath;

		if (this.m_srcpath.length) {
			// srcpath = str_replace("@p", pactid, srcpath);
			srcpath = srcpath.replaceAll("@p", pactid);

			// srcpath = str_replace("@y", sprintf("%04d%02d", this.m_year, this.m_month), srcpath);
			srcpath = srcpath.replaceAll("@y", sprintf("%04d%02d", this.m_year.toString(), this.m_month.toString()));
		} else {
			srcpath = logpath;
			var sql = "select type,fid,detailno from clampfile_tb";
			sql += " where pactid=" + this.m_db.escape(pactid);
			// sql += " and year=" + this.m_db.escape(this.m_year);
			sql += " and year=" + this.m_db.escape(this.m_year.toString());
			sql += " and month=" + this.m_db.escape(this.m_month.toString());
			sql += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO.toString());
			sql += " and status=" + this.m_db.escape(G_CLAMPFILE_STATUS_DOWNLOAD.toString());

			// if (count(this.m_A_type)) {
			if (count(this.m_A_type)) {
				sql += " and type in (";
				var comma = false;

				// for (var type of Object.values(this.m_A_type)) {
				for (var type of this.m_A_type) {
					if (comma) sql += ",";
					comma = true;
					sql += "'" + this.m_db.escape(type) + "'";
				}

				sql += ")";
			}

			sql += ";";
			// var result = this.m_db.getHash(sql);
			var result = await this.m_db.getHash(sql);

			var count;

			// for (var line of Object.values(result)) //ファイル連番
			for (var line of result) //ファイル連番
			{
				var type = line.type;
				var A_fid = line.fid.split(",");
				count = 0;

				// for (var fid of Object.values(A_fid)) {
				for (var fid of A_fid) {

					var fname = srcpath + type + line.detailno + sprintf("%02d", count.toString());
					fname += ".cla.gz";

					if (!this.m_db.loExport(fname, fid)) {
						// this.putError(G_SCRIPT_WARNING, "\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u7121\u3057" + fid);
						this.putError(G_SCRIPT_WARNING, "ラージオブジェクト無し" + fid);
						return false;
					}

					++count;
				}
			}
		}

		var status = this.import(pactid, logpath, srcpath);
		return status;
	}

	async import(pactid, logpath, srcpath) //既存テーブルを削除
	//インポートが成功したファイル名の配列
	//請求明細インポート
	//通話料明細インポート
	//情報料明細インポート
	//請求書情報インポート
	//親番号をまとめて検査
	{
		var no = this.getTableNo();
		var d = new Date();
		// var is_overflow_tel = this.m_year < date("Y") - 2 || this.m_year == date("Y") - 2 && this.m_month <= date("n");
		var is_overflow_tel = this.m_year < d.getFullYear() - 2 || this.m_year == d.getFullYear() - 2 && this.m_month <= new Date().getMonth()+1;
		var is_overflow_comm = 12 < no;
		var is_overflow_info = 12 < no;
		var is_overflow_bill = 12 < no;

		if (is_overflow_tel || is_overflow_comm || is_overflow_info || is_overflow_bill) {
			// var errmsg = "12/24\u30F6\u6708\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u3088\u3046\u3068\u3057\u305F";
			var errmsg = "12/24ヶ月以上前のデータをインポートしようとした";
			errmsg += this.m_year + "/" + this.m_month;
			// if (is_overflow_tel) errmsg += "/\u8ACB\u6C42";
			// if (is_overflow_comm) errmsg += "/\u901A\u8A71";
			// if (is_overflow_info) errmsg += "/\u60C5\u5831\u6599";
			// if (is_overflow_bill) errmsg += "/\u8ACB\u6C42\u66F8\u60C5\u5831";
			// errmsg += "/\u8A72\u5F53\u30D5\u30A1\u30A4\u30EB\u306F\u7121\u8996\u3055\u308C\u308B";
			if (is_overflow_tel) errmsg += "/請求";
			if (is_overflow_comm) errmsg += "/通話";
			if (is_overflow_info) errmsg += "/情報料";
			if (is_overflow_bill) errmsg += "/請求書情報";
			errmsg += "/該当ファイルは無視される";
			this.putError(G_SCRIPT_WARNING, errmsg);
		}

		var is_hotline = false;
		var sql = "select count(*) from pact_tb";
		sql += " where pactid=" + pactid;
		sql += " and coalesce(type,'')='H'";
		sql += ";";
		if (0 < await this.m_db.getOne(sql)) is_hotline = true;
		var A_parent_error = Array();

		var ins_tel = new TableInserter(this.m_listener, this.m_db, logpath + "tel_tb.insert", true);
		var ins_tel_X = new TableInserter(this.m_listener, this.m_db, logpath + "tel_" + no + "_tb.insert", true);
		var telno = new ImportDocomoTelno(this.m_listener, this.m_db, this.m_table_no, this.m_addtelflag, ins_tel, ins_tel_X);
		var ins_details = new TableInserter(this.m_listener, this.m_db, logpath + "tel_details_" + no + "_tb.insert", true);
		var details = new ImportDocomoTel(this.m_listener, this.m_db, this.m_table_no, telno, true, this.m_forceflag, ins_details, A_parent_error, logpath + "tel_detaisl_" + no + "_tb_hand.delete");
		await details.asyncConstructor();		
		var ins_comm = new TableInserter(this.m_listener, this.m_db, logpath + "commhistory_" + no + "_tb.insert", true);
		var ins_comm_from = new TableInserter(this.m_listener, this.m_db, logpath + "kousi_fromtel_master_tb.insert", true);
		var ins_comm_to = new TableInserter(this.m_listener, this.m_db, logpath + "kousi_totel_master_tb.insert", true);
		var comm = new ImportDocomoComm(this.m_listener, this.m_db, this.m_table_no, telno, true, this.m_forceflag, ins_comm, ins_comm_from, ins_comm_to, A_parent_error);
		var ins_info = new TableInserter(this.m_listener, this.m_db, logpath + "infohistory_" + no + "_tb.insert", true);
		var info = new ImportDocomoInfo(this.m_listener, this.m_db, this.m_table_no, telno, true, this.m_forceflag, ins_info, A_parent_error);
		var ins_bill = new TableInserter(this.m_listener, this.m_db, logpath + "billhistory_" + no + "_tb.insert", true);
		var bill = new ImportDocomoBill(this.m_listener, this.m_db, this.m_table_no, telno, true, this.m_forceflag, ins_bill, A_parent_error);

		if (this.m_clearflag) {
			if (!is_overflow_tel) {
				if (!details.delete(pactid, this.m_year, this.m_month, logpath + "tel_details_" + no + "_tb.delete")) return false;
			}

			if (!is_overflow_comm) {
				if (!comm.delete(pactid, this.m_year, this.m_month, logpath + "commhistory_" + no + "_tb.delete", logpath + "kousi_fromtel_master_tb.delete", logpath + "kousi_totel_master_tb.delete")) return false;
			}

			if (!is_overflow_info) {
				if (!info.delete(pactid, this.m_year, this.m_month, logpath + "infohistory_" + no + "_tb.delete")) return false;
			}

			if (!is_overflow_bill) {
				if (!bill.delete(pactid, this.m_year, this.m_month, logpath + "billhistory_" + no + "_tb.delete")) return false;
			}
		}

		if (!is_overflow_tel) //tel_amount_bill_tbの削除は、削除フラグにかかわらず実行する
			{
				var sqlfrom = " from tel_amount_bill_tb";
				sqlfrom += " where pactid=" + this.m_db.escape(pactid);
				// sqlfrom += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO);
				sqlfrom += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO.toString());
				// sqlfrom += " and year=" + this.m_db.escape(this.m_year);
				sqlfrom += " and year=" + this.m_db.escape(this.m_year.toString());
				// sqlfrom += " and month=" + this.m_db.escape(this.m_month);
				sqlfrom += " and month=" + this.m_db.escape(this.m_month.toString());
				var fname = logpath + "tel_amount_bill_tb.delete";
				if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
				sql = "delete" + sqlfrom;
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}

		if (!is_overflow_tel) {
			if (!telno.begin(pactid, this.m_year, this.m_month)) return false;
			if (!details.begin(pactid, this.m_year, this.m_month)) return false;
		}

		if (!is_overflow_comm) {
			// if (!comm.begin(pactid, this.m_year, this.m_month)) return false;
			if (!comm.begin(pactid, this.m_year, this.m_month)) return false;
		}

		if (!is_overflow_info) {
			if (!info.begin(pactid, this.m_year, this.m_month)) return false;
		}

		if (!is_overflow_bill) {
			if (!bill.begin(pactid, this.m_year, this.m_month)) return false;
		}

		if (this.m_gzflag) {
			fname = srcpath + "*.cla.gz";
			var flist = Array();
			// exec(`ls -1 ${fname} 2> /dev/null`, flist);
			execSync(`ls -1 ${fname} 2> /dev/null`);
			// if (flist.length) if (!this.processGzip(fname, false)) return false;
			if (flist.length) if (!this.processGzip(fname, 'false')) return false;
		}

		var A_ready = Array();
		flist = Array();
		// exec("ls -1 " + srcpath + "MB*.cla 2> /dev/null", flist);
		execSync("ls -1 " + srcpath + "MB*.cla 2> /dev/null");

		// for (var name of Object.values(flist)) {
		for (var name of flist) {
			this.m_cur_filename = name;
			var detailno = name.replace(/.*MB(\d+)\d\d\.cla.*/gi, "$1");

			if (!is_overflow_tel) {
				details.setDetailno(detailno);
				if (!details.read(name)) return false;
			}

			A_ready.push(name);
			this.m_cur_filename = "";
		}

		var A_type = G_CLAMP_DOCOMO_COMM_TYPE.split(",");

		// for (var type of Object.values(A_type)) {
		for (var type of A_type) {
			if (!is_overflow_comm) {
				if (!comm.setType(type, this.m_year, this.m_month)) return false;
			}

			flist = Array();
			// exec("ls -1 " + srcpath + type + "*.cla 2> /dev/null", flist);
			execSync("ls -1 " + srcpath + type + "*.cla 2> /dev/null");

			// for (var name of Object.values(flist)) {
			for (var name of flist) {
				this.m_cur_filename = name;
				// detailno = preg_replace("/.*" + type + "(\\d+)\\d\\d\\.cla.*/i", "$1", name);
				detailno = name.replace("/.*" + type + "(\\d+)\\d\\d\\.cla.*/i", "$1");

				if (!is_overflow_comm) {
					comm.setDetailno(detailno);
					if (!comm.read(name)) return false;
				}

				A_ready.push(name);
				this.m_cur_filename = "";
			}
		}

		flist = Array();
		// exec("ls -1 " + srcpath + "RMI*.cla 2> /dev/null", flist);
		execSync("ls -1 " + srcpath + "RMI*.cla 2> /dev/null");

		// for (var name of Object.values(flist)) {
		for (var name of flist) {
			this.m_cur_filename = name;
			detailno = name.replace(/.*RMI(\d+)\d\d\.cla.*/gi, "$1");

			if (!is_overflow_info) {
				info.setDetailno(detailno);
				if (!info.read(name)) return false;
			}

			A_ready.push(name);
			this.m_cur_filename = "";
		}

		flist = Array();
		// exec("ls -1 " + srcpath + "BL*.cla 2> /dev/null", flist);
		execSync("ls -1 " + srcpath + "BL*.cla 2> /dev/null");

		// for (var name of Object.values(flist)) {
		for (var name of flist) {
			this.m_cur_filename = name;
			detailno = name.replace(/.*BL(\d+)\d\d\.cla.*/gi, "$1");

			if (!is_overflow_bill) {
				bill.setDetailno(detailno);
				if (!bill.read(name)) return false;
			}

			A_ready.push(name);
			this.m_cur_filename = "";
		}

		// var parent_accept = false;
		var parent_accept;
		// var parent_error = false;
		var parent_error;
		parent_accept ||= details.m_parent_accept;
		parent_accept ||= comm.m_parent_accept;
		parent_accept ||= info.m_parent_accept;
		parent_accept ||= bill.m_parent_accept;
		parent_error ||= details.m_parent_error;
		parent_error ||= comm.m_parent_error;
		parent_error ||= info.m_parent_error;
		parent_error ||= bill.m_parent_error;

		if (parent_error) {
			if (parent_accept) {
				// this.putError(G_SCRIPT_INFO, "\u89AA\u756A\u53F7\u5408\u81F4\u305B\u305A/\u5408\u81F4\u3057\u305F\u89AA\u756A\u53F7\u304C\u3042\u3063\u305F\u306E\u3067\u30A4\u30F3\u30DD\u30FC\u30C8\u5B9F\u884C");
				this.putError(G_SCRIPT_INFO, "親番号合致せず/合致した親番号があったのでインポート実行");
			} else //ホットライン・V2ともにerror_tbへ追加する
				{
					// this.putError(G_SCRIPT_WARNING, "\u89AA\u756A\u53F7\u4E00\u4EF6\u3082\u5408\u81F4\u305B\u305A/\u30A4\u30F3\u30DD\u30FC\u30C8\u305B\u305A\u306B\u51E6\u7406\u7D42\u4E86" + "/pactid=" + pactid + "/year=" + this.m_year + "/month=" + this.m_month);
					this.putError(G_SCRIPT_WARNING, "親番号一件も合致せず/インポートせずに処理終了" + "/pactid=" + pactid + "/year=" + this.m_year + "/month=" + this.m_month);
					this.m_A_send_keys.push({
						pactid: pactid,
						year: this.m_year,
						month: this.m_month
					});
					return false;
				}
		}

		var A_key = details.getUtiwakeInsert();

		// for (var key of Object.values(A_key)) if (!(-1 !== this.m_A_utiwake_insert.indexOf(key))) this.m_A_utiwake_insert.push(key);
		for (var key of A_key) if (!(-1 !== this.m_A_utiwake_insert.indexOf(key))) this.m_A_utiwake_insert.push(key);

		if (details.isUtiwakeFail()) {
			return false;
		}

		if (this.m_moveflag) {
			var tgt = G_CLAMP_DOCOMO_FIN;
			// tgt = str_replace("@p", pactid, tgt);
			tgt = tgt.replace("@p", pactid);

			// tgt = str_replace("@y", sprintf("%04d%02d", this.m_year, this.m_month), tgt);
			tgt = tgt.replace("@y", sprintf("%04d%02d", this.m_year.toString(), this.m_month.toString()));
			var dir = "";
			var remain = tgt;

			while (remain.length) {
				var idx;
				// if (false === (idx = strpos(remain, "/"))) break;
				idx = remain.indexOf("/")
				if (false === idx) break;
				// dir += remain.substr(0, idx + 1);
				dir += remain.substring(0, idx! + 1);
				// remain = remain.substr(idx + 1);
				remain = remain.substring(idx! + 1);
				// if (file_exists(dir)) continue;
				if (fs.existsSync(dir)) continue;

				// if (!mkdir(dir)) {
				try {
					fs.mkdirSync(dir)
				} catch (e) {
					// this.putError(G_SCRIPT_WARNING, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\u5931\u6557" + dir);
					this.putError(G_SCRIPT_WARNING, "ディレクトリ作成失敗" + dir);
					return false;
				}
			}

			var path = PATH.parse(name)
			// for (var name of Object.values(A_ready)) {
			for (var name of A_ready) {
				this.m_cur_filename = name;

				if (1 == this.m_moveflag) {
					// if (!rename(name, tgt + basename(name))) {

					try{
						fs.renameSync(name, tgt + path.base)
					} catch {
						this.putError(G_SCRIPT_WARNING, "ファイル移動失敗" + name + "->" + tgt);
						return false;
					}
					// if (!fs.renameSync(name, tgt + path.base)) {
					// 	// this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5931\u6557" + name + "->" + tgt);
					// 	this.putError(G_SCRIPT_WARNING, "ファイル移動失敗" + name + "->" + tgt);
					// 	return false;
					// }

				path = PATH.parse('/Users/Refsnes/demo_path.js')
				//path.dirname('/Users/Refsnes/demo_path.js');
				// } else if (strcmp(realpath(dirname(name)), realpath(dirname(tgt)))) {
				} else if(fs.realpathSync(tgt).localeCompare( fs.realpathSync(name) )){
					// if (!copy(name, tgt + basename(name))) {
					//if (!fs.copyFileSync(name, tgt + basename(name))) {
					try{
						fs.copyFileSync(name, tgt + path.base)
					} catch {
						this.putError(G_SCRIPT_WARNING, "ファイルコピー失敗" + name + "->" + tgt);
						return false;
					}
					// if (!fs.copyFileSync(name, tgt + path.base)) {
					// 	// this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u5931\u6557" + name + "->" + tgt);
					// 	this.putError(G_SCRIPT_WARNING, "ファイルコピー失敗" + name + "->" + tgt);
					// 	return false;
					// }
				}

				this.m_cur_filename = "";
			}
		}

		if (!is_hotline) //ホットラインの場合には電話の追加を行わない
			{
				if (!is_overflow_tel) {
					if (!telno.end()) return false;
				}
			}

		if (!is_overflow_tel) {
			if (!details.end()) return false;
			// sql = "insert into tel_amount_bill_tb" + "(pactid,carid,prtelno,charge,year,month,recdate)" + " select root_tb.pactid" + "," + this.m_db.escape(G_CARRIER_DOCOMO) + " as carid" + ",root_tb.prtelno as prtelno" + ",sum(root_tb.charge) as charge" + "," + this.m_db.escape(this.m_year) + " as year" + "," + this.m_db.escape(this.m_month) + " as month" + ",'" + date("Y-m-d H:i:s") + "' as recdate" + " from tel_details_" + no + "_tb as root_tb" + " left join utiwake_tb" + " on root_tb.carid=utiwake_tb.carid" + " and root_tb.code=utiwake_tb.code" + " where root_tb.pactid=" + this.m_db.escape(pactid) + " and root_tb.carid=" + this.m_db.escape(G_CARRIER_DOCOMO) + " and root_tb.prtelno is not null" + " and root_tb.prtelno!=''" + " and root_tb.code not in ('ASP','ASX')" + " and utiwake_tb.code!='0'" + " group by root_tb.pactid,root_tb.prtelno" + ";";
			sql = "insert into tel_amount_bill_tb" + "(pactid,carid,prtelno,charge,year,month,recdate)" + " select root_tb.pactid" + "," + this.m_db.escape(G_CARRIER_DOCOMO.toString()) + " as carid" + ",root_tb.prtelno as prtelno" + ",sum(root_tb.charge) as charge" + "," + this.m_db.escape(this.m_year.toString()) + " as year" + "," + this.m_db.escape(this.m_month.toString()) + " as month" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "' as recdate" + " from tel_details_" + no + "_tb as root_tb" + " left join utiwake_tb" + " on root_tb.carid=utiwake_tb.carid" + " and root_tb.code=utiwake_tb.code" + " where root_tb.pactid=" + this.m_db.escape(pactid) + " and root_tb.carid=" + this.m_db.escape(G_CARRIER_DOCOMO.toString()) + " and root_tb.prtelno is not null" + " and root_tb.prtelno!=''" + " and root_tb.code not in ('ASP','ASX')" + " and utiwake_tb.code!='0'" + " group by root_tb.pactid,root_tb.prtelno" + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		if (!is_overflow_comm) {
			if (!comm.end()) return false;
		}

		if (!is_overflow_info) {
			if (!info.end()) return false;
		}

		if (!is_overflow_bill) {
			if (!bill.end()) return false;
		}

		return true;
	}

	sendErrorMessageAfter() {
		if (this.m_stop_mail) return;
		this.beginDB();

		// for (var H_keys of Object.values(this.m_A_send_keys)) this.sendErrorMessage(H_keys.pactid, H_keys.year, H_keys.month);
		for (var H_keys of this.m_A_send_keys) this.sendErrorMessage(H_keys.pactid, H_keys.year, H_keys.month);

		this.endDB(true);
	}

	sendErrorMessage(pactid, year, month) {
		var message = "prtelno" + "/" + year + "/" + month;
		// var sql = "insert into clampdb_error_tb" + "(pactid,carid,message,fixdate)" + "values(" + pactid + "," + G_CARRIER_DOCOMO + ",'" + this.m_db.escape(message) + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
		var sql = "insert into clampdb_error_tb" + "(pactid,carid,message,fixdate)" + "values(" + pactid + "," + G_CARRIER_DOCOMO + ",'" + this.m_db.escape(message) + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
	}

	async insertUtiwake() {
		if (!this.m_A_utiwake_insert.length) return;
		this.beginDB();

		// for (var key of Object.values(this.m_A_utiwake_insert)) {
		for (var key of this.m_A_utiwake_insert) {
			var code = key.substring(1);
			var sql = "select count(*) from utiwake_tb" + " where carid=" + G_CARRIER_DOCOMO + " and code='" + this.m_db.escape(code) + "'" + ";";
			if (await this.m_db.getOne(sql)) continue;
			// sql = "insert into utiwake_tb" + "(code,name,kamoku,codetype,carid,fixdate,recdate)" + "values" + "('" + this.m_db.escape(code) + "'" + ",'\u4EEE\u767B\u9332" + this.m_db.escape(code) + "'" + ",'6'" + ",'4'" + "," + this.m_db.escape(G_CARRIER_DOCOMO) + ",'" + date("Y-m-d H:i:s") + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
			sql = "insert into utiwake_tb" + "(code,name,kamoku,codetype,carid,fixdate,recdate)" + "values" + "('" + this.m_db.escape(code) + "'" + ",'仮登録" + this.m_db.escape(code) + "'" + ",'6'" + ",'4'" + "," + this.m_db.escape(G_CARRIER_DOCOMO.toString()) + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		this.endDB(true);
	}

};

(async () => {
	// checkClient(G_CLIENT_DB);
	var log = G_LOG;
	if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
	var proc = new ProcessImportDocomo(G_PROCNAME_IMPORT_DOCOMO, log, G_OPENTIME_IMPORT_DOCOMO);
	if (!proc.readArgs(undefined)) throw process.exit(1);
	if (!proc.wait()) throw process.exit(0);
	var status = await proc.execute();
	proc.sendErrorMessageAfter();
	proc.insertUtiwake();
	throw process.exit(status ? 0 : 1);
})();