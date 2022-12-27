import ErrorUtil from './ErrorUtil';
import { DB_FETCHMODE_ASSOC } from './MtDBUtil';
import Logger from "./log"
import { Client } from 'pg';
import { KCS_DIR } from '../conf/batch_setting';

export default class DBUtil {
	O_err: ErrorUtil;
	O_dbh: Client;

	constructor(transaction = false) //ErrorUtilの呼出 なぜかうまく呼べないのでオブジェクト新規作成
	//$this->O_err = new ErrorUtil();
	//DB設定の読み込み
	//DB接続
	{
		Logger.initialize();
		if (global.GO_errlog == false) {
			global.GO_errlog = new ErrorUtil();
		}

		this.O_err = global.GO_errlog;
		this.O_dbh = new Client({ connectionString : global.G_dsn });
		this.O_dbh.connect();

		if (transaction == true) {
			this.O_dbh.autoCommit(false);
		}

		if (global.G_traceflg == 1) {
			if (undefined !== global.GO_tracelog == false || global.GO_tracelog == false) {
				global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
			}

			global.GO_tracelog.log("Connect", 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}
	}

	async query(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@query@ SQLがありません");
		}

		var O_result = await this.O_dbh.query(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
				global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
			}
			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}
		if (O_result == null) //pgpoolの状態を調べ、落ちていたら再読み込み 20070925miya
		{
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@query@ " + O_result.message + "(" + O_result.userinfo + ")");
		} else {
			if (sql.match("/^\\s*(delete|update|insert)/i")) {
				O_result = this.O_dbh.affectedRows();
			}

			return O_result;
		}
	}

	async limitQuery(sql: string, from = -1, cnt = 0, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@limitQuery@ SQLがありません");
		}

		if (from < 0 || cnt <= 0) {
			this.O_err.errorOut(1, "@limitQuery@ from(第2引数),count(第3引数)が必要です");
		}

		var O_result = await this.O_dbh.limitQuery(sql, from, cnt);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
				global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
			}

			global.GO_tracelog.log("limit:" + from + "," + cnt + ":" +  sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (O_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@limitQuery@ " + O_result.message + "(" + O_result.userinfo + ")");
		} else {
			return O_result;
		}
	}

	async getAll(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getAll@ SQLがありませ");
		}

		var H_result = await this.O_dbh.getAll(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return H_result;
		}

		if (H_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getAll@ " + H_result.message + "(" + H_result.userinfo + ")");
		} else {
			return H_result;
		}
	}

	getRow(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getRow@ SQLがありません");
		}

		var A_result = this.O_dbh.getRow(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return A_result;
		}

		if (A_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getRow@ " + A_result.message + "(" + A_result.userinfo + ")");
		} else {
			return A_result;
		}
	}

	getOne(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getOne@ SQLがありません");
		}

		var result = this.O_dbh.getOne(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getOne@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	getCol(sql = "", col = 0, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getCol@ SQLがありません");
		}

		var A_result = this.O_dbh.getCol(sql, col);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 7) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return A_result;
		}

		if (A_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getCol@ " + A_result.message + "(" + A_result.userinfo + ")");
		} else {
			return A_result;
		}
	}

	getHash(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getHash@ SQLがありません");
		} else if (sql.match("/^\\s*(delete|update|insert)/i")) {
			this.O_err.errorOut(1, "@getHash@ 更新クエリは使用できません");
		}

		var O_result = this.O_dbh.query(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (O_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		// while (A_row = O_result.fetchRow(DB_FETCHMODE_ASSOC))
		for (const A_row1 of O_result ) {
			A_result.push(A_row1);
		}

		O_result.free();
		return A_result;
	}

	getSimpleHash(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getSimpleHash@ SQLがありません");
		} else if (sql.match("/^\\s*(delete|update|insert)/i")) {
			this.O_err.errorOut(1, "@getSimpleHash@ 更新クエリは使用できません");
		}

		var O_result = this.O_dbh.query(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (O_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		// while (A_rows = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
		for (const A_row2 of O_result ) {
			A_row2.reset();
			var key = A_row2.current();
			A_row2.shift();
			A_result[key] = A_row2.shift();
		}

		O_result.free();
		return A_result;
	}

	getKeyHash(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getKeyHash@ SQLがありません");
		} else if (sql.match("/^\\s*(delete|update|insert)/i")) {
			this.O_err.errorOut(1, "@getKeyHash@ 更新クエリは使用できません");
		}

		var O_result = this.O_dbh.query(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (O_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getKeyHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		// while (A_row = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
		for (const A_row3 of O_result )	{
			A_row3.reset();
			var key = A_row3.current();
			A_row3.shift();
			A_result[key] = A_row3;
		}

		O_result.free();
		return A_result;
	}

	getRowHash(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getRowHash@ SQLがありません");
		} else if (sql.match("/^\\s*(delete|update|insert)/i")) {
			this.O_err.errorOut(1, "@getRowHash@ 更新クエリは使用できません");
		}

		var O_result = this.O_dbh.query(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (O_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var H_result = O_result.fetchRow(DB_FETCHMODE_ASSOC);
		O_result.free();
		return H_result;
	}

	getAssoc(sql = "", A_force_array = false, params = "", fetchmode = 0, group = false, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getAssoc@ SQLがありません");
		}

		var H_result = this.O_dbh.getAssoc(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			
			}

			global.GO_tracelog.log(sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return H_result;
		}

		if (H_result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getAssoc@ " + H_result.message + "(" + H_result.userinfo + ")");
		} else {
			return H_result;
		}
	}

	escapeSimple(str: any, errchk = true) //配列ならそのまま返す
	//トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (Array.isArray(str) == true) {
			return str;
		}

		var result = this.O_dbh.escapeSimple(str);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log(str.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", 1);
				//global.GO_debuglog = Logger;
			}

			// global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@escapeSimple@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	nextId(seqname: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (seqname == "") {
			this.O_err.errorOut(1, "@nextId@ シーケンス名指定されていません");
		}

		var result = this.O_dbh.nextId(seqname);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("nextId:" + seqname, 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				// global.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@nextId@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	prepare(sql: string, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@prepare@ SQLがありません");
		}

		var O_sql = this.O_dbh.prepare(sql);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("prepare: " + sql.replace("/\n/", " "), 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_sql;
		}

		if (O_sql == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@prepare@ " + O_sql.message + "(" + O_sql.userinfo + ")");
		} else {
			return O_sql;
		}
	}

	execute(O_sql: any, A_word: boolean, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (A_word == false) {
			this.O_err.errorOut(1, "@execute@ 置換用配列がありません");
		}

		var result = this.O_dbh.execute(O_sql, A_word);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("execute: " + result, 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;			
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@execute@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	executeMultiple(O_sql: any, H_word: boolean, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (H_word == false) {
			this.O_err.errorOut(1, "@executeMultiple@ 置換用連想配列がありません");
		}

		var result = this.O_dbh.executeMultiple(O_sql, H_word);

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("executeMultiple: " + result, 6);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (result == null) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@executeMultiple@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	commit() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.commit();

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
				global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/tracelog.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("Commit", 1);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				// global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (this.O_dbh == null) {
			this.O_err.errorOut(1, "@commit@ " + this.O_dbh.errorMessage(this.O_dbh));
		}
	}

	rollback() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.rollback();

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("RollBack", 1);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (this.O_dbh == null) {
			this.O_err.errorOut(1, "@rollback@ " + this.O_dbh.errorMessage(this.O_dbh));
		}
	}

	disconnect() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.disconnect();

		if (global.G_traceflg == 1) {
			if (global.GO_tracelog == false) {
			 global.GO_tracelog = Logger.singleton("file", KCS_DIR + "/log/trace.log", "", global.GH_logopt);
				 //global.GO_tracelog = Logger;
			}

			global.GO_tracelog.log("Disconnect", 1);
		} else if (global.G_traceflg == 2) {
			if (global.GO_debuglog == false) {
				global.GO_debuglog = Logger.singleton("file", KCS_DIR + "/log/debug.log", "", global.GH_logopt);
				//global.GO_debuglog = Logger;
			}

		// 	global.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (this.O_dbh == null) {
			this.O_err.errorOut(1, "@disconnect@ " + this.O_dbh.errorMessage(this.O_dbh));
		}
	}

	pgpoolChecker() //失敗した場合（pgpoolが落ちているか予期せぬエラー）
	{
		var sql = "show pool_status;";
		var A_rtn = this.O_dbh.getHash(sql, false);

		if ("object" === typeof A_rtn != true) //マスターＤＢかセカンダリＤＢが落ちている場合
			{
				var cnt = 0;

				for (var tmp of A_rtn) {
					if (tmp.item == "server_status") {
						var A_status = (tmp.value).split(" ");
					}

					cnt++;
				}

				if (A_status[3] == "down" || A_status[7] == "down") {
					return false;
				} else {
					return true;
				}
			} else {
			return false;
		}

		return false;
	}

};