import MtSetting from './MtSetting';
import MtExcept from './MtExcept';
import MtOutput from './MtOutput';
import Logger from './log';
import { Client } from 'pg';

export const DB_FETCHMODE_ASSOC = "DB_FETCHMODE_ASSOC";
export const DB_FETCHMODE_ORDERED = "DB_FETCHMODE_ORDERED";

const path = require('path');
const fs = require("fs");
const Readable = require('stream').Readable;
const copyFrom = require('pg-copy-streams').from;

export default class MtDBUtil {
	static SAVEPOINT_PREFIX = "MDB2_SAVEPOINT_";
	static LOGDIR = "/log/";
	static O_Instance: MtDBUtil | undefined;
	DataSourceName: string | undefined;
	O_Out: MtOutput;
	O_Conf: MtSetting;
	O_DataBaseHundle: Client;
	H_ExType: any;
	SqlCount: number;
	O_Recover: any;
	H_LogOpt: any;
	O_Trace: any;
	O_Debug: any;
	ResultType: any;
	tableInfo: any;
	A_dbquote_err: any;
	limit : number | undefined;
	offset : number | undefined;

	constructor() //MtOutput
	//エラースタック初期化
	//DSNの取得
	//DB接続
	//エラーチェック *ただしfactoryではここではエラーが起きない
	//リカバリー用（更新系SQL）ログオブジェクト生成
	//トレースログオブジェクト生成
	{
		this.O_Out = MtOutput.singleton();
		this.O_Conf = MtSetting.singleton();
		this.resetDbQuoteError();

		if (this.DataSourceName == undefined) //db.iniから情報を取得
		{
			this.O_Conf.loadConfig("db");
			var db_pass = fs.readFileSync(this.O_Conf.get("db_pass"), "utf-8").trim();
			this.DataSourceName = this.O_Conf.get("db_type") + "://" + this.O_Conf.get("db_user") + ":" + db_pass + "@" + this.O_Conf.get("db_host") + ":" + this.O_Conf.get("db_port") +  "/" + this.O_Conf.get("db_name");
		}
		this.O_DataBaseHundle = new Client({ connectionString : this.DataSourceName });
		this.O_DataBaseHundle.connect((err) => {
            if (err) {
                MtExcept.raise("DB接続失敗: " + err.stack, this.H_ExType)
            } else {
                console.log('DB接続: connected !')
            }
        })

		this.setResultType(true);
		this.H_ExType = {
			type: "DB"
		};
		this.SqlCount = 0;
		// this.O_Recover = Logger.log("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_recoverlog_file, process.PHP_SELF, this.H_LogOpt);
		this.O_Recover = Logger.log("file",0);

		if (this.O_Conf.get("db_trace_level") > 0) {
			this.H_LogOpt = {
				mode: 600,
				timeFormat: "%Y/%m/%d %X"
			};
			// this.O_Trace =	Logger.log("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_tracelog_file, process.PHP_SELF, this.H_LogOpt);
			this.O_Trace =	Logger.log("file", 0);

			if (this.O_Conf.get("db_trace_level") == 2) {
				// this.O_Debug = Logger.log("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_debuglog_file, process.PHP_SELF, this.H_LogOpt);
				this.O_Debug = Logger.log("file", 0);
			}
		}
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtDBUtil();
		}

		return this.O_Instance;
	}

	getDBH() {
		return this.O_DataBaseHundle;
	}

	setResultType(types: boolean) {
		this.ResultType = types;
	}

	getResultType() {
		return this.ResultType;
	}

	setOption(option: any, value: any) {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	getOption(option: any) {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	beginTransaction() {
		return this.O_DataBaseHundle.query("BEGIN");
	}

	beginNestedTransaction() {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	inTransaction(ignore_nested = false) {
		return false;
	}

	loadModule(module: string, property = undefined, phptype_specific = undefined) {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	chkLoadedModule(module: string | number) {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	disconnect() //エラーチェック
	{
		return this.O_DataBaseHundle.end();
	}

	commit(savepoint:any = undefined) //ログ出力
	//エラーチェック
	{
		return this.O_DataBaseHundle.query("COMMIT");
	}

	rollback(savepoint:any = undefined) //エラーチェック
	{
		return this.O_DataBaseHundle.query("COMMIT");
	}

	commitAll() //トランザクション中はすべて
	//カウンターをリセット
	{
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	rollbackAll() //トランザクション中はすべて
	//カウンターをリセット
	{
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	commitCurrent() //1が返ってくるときだけ・・・
	{
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	rollbackCurrent() //1が返ってくるときだけ・・・
	{
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	completeNestedTransaction(force_rollback = false) //エラーチェック
	{
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	resetNestedCounter() {
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	exceptRaise(msg: string) //WEBならロールバックする
	{
		this.O_Out.errorOut(0, msg);
	}

	traceOut(msg: string) //トレースログ出力
	{
		if (this.O_Conf.get("db_trace_level") > 0) {
			if (Array.isArray(msg) == true) {
				msg = "配列は出力されません";
			} else if ("object" === typeof msg == true) {
				msg = "オブジェクトは出力されません";
			}

			//this.O_Trace.log(msg.replace("/\n/", " "), 6);

			if (this.O_Conf.get("db_trace_level") == 2) {
			// 	this.O_Debug.log(debug_backtrace(), 7);
			}
		}
	}

	getQueryType(sql: string) {
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::getQueryType: 引数にSQLがない");
		}

		if (sql.match("/^\s*(update|insert|delete)/i")) {
			return "modify";
		}

		return "select";
	}

	async query(sql: string, errchk = true) //引数チェック
	//エラーチェック
	{

		if (this.getQueryType(sql) == "modify") //更新系のSQLの場合はexec()に渡す
		//エラーチェックしない場合はDBリザルトオブジェクトを返す
		{
			var O_result = await this.exec(sql, false)
			if (errchk === false) {
				return O_result;
			}
			
		} else //dbQuoteのエラーチェック
		//SQL実行
		//ログ出力
		//SQLカウンターのカウントアップ
		//エラーチェックしない場合はDBリザルトオブジェクトを返す
		{
			//console.log(222); 
			this.chkDbQuoteError(sql);
			O_result = this.O_DataBaseHundle.query(sql);
			// this.traceOut(sql);
			this.SqlCount++;

			if (errchk === false) {
				return O_result;
			}
		}

		if (!O_result) {
			this.exceptRaise("MtDBUtil::query: ");
		}

		return O_result;
	}

	async exec(sql: string , errchk = true) //引数チェック
	//SQL実行
	//ログ出力
	//更新系はリカバリーログにも出力
	//SQLカウンターのカウントアップ
	//エラーチェックしない場合はDBリザルトオブジェクトを返す
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::exec: 引数にSQLがない");
		}

		this.chkDbQuoteError(sql);
		var result = this.O_DataBaseHundle.query(sql);
		this.traceOut(sql);
		this.O_Recover.log(sql.replace("/\n/", " "), 6);
		this.SqlCount++;

		if (errchk === false) {
			return result;
		}

		if (!result) {
			this.exceptRaise("MtDBUtil::exec: ");
		}

		return result;
	}

	async queryAll(sql: string, fetchmode = DB_FETCHMODE_ORDERED, hashkey = false) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryAll: 引数にSQLがない");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryAll: 更新系のSQLは使用できません（" + sql + "）");
		}

		this.chkDbQuoteError(sql);

		var A_result = fetchmode == DB_FETCHMODE_ORDERED ? await this.O_DataBaseHundle.query({text: sql , rowMode: 'array'}) : await this.O_DataBaseHundle.query(sql);
		this.traceOut(sql);
		this.SqlCount++;

		if(hashkey){
			let tmpList = {};
			A_result.rows.forEach(row => {
				if(fetchmode == DB_FETCHMODE_ORDERED){
					tmpList[row[0]] = row;
				} else {
					tmpList[row[A_result.fields[0].name]] = row;
				}
			})
			return tmpList;
		}

		if (!A_result) {
			this.exceptRaise("MtDBUtil::queryAll: ");
		}

		return A_result.rows;
	}

	async queryRow(sql: string, fetchmode = DB_FETCHMODE_ORDERED) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryRow: 引数にSQLがない");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryRow: 更新系のSQLは使用できません（" + sql + "）");
		}

		this.chkDbQuoteError(sql);
		var A_result = fetchmode == DB_FETCHMODE_ORDERED ? await this.O_DataBaseHundle.query({text: sql , rowMode: 'array'}) : await this.O_DataBaseHundle.query(sql);
		this.traceOut(sql);
		this.SqlCount++;

		if (!A_result) {
			this.exceptRaise("MtDBUtil::queryRow: ");
		}

		return A_result.rows;
	}

	async queryOne(sql: string) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryOne: 引数にSQLがない");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryRow: 更新系のSQLは使用できません（" + sql + "）");
		}

		this.chkDbQuoteError(sql);
		var result = await this.O_DataBaseHundle.query({text: sql , rowMode: 'array'});
		this.traceOut(sql);
		this.SqlCount++;

		if (!result) {
			this.exceptRaise("MtDBUtil::queryOne: ");
		}

		if(result.rows.length == 0){
			return null;
		} else {
			return result.rows[0][0];
		}
	}

	async queryCol(sql: string, col = 0) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryCol: 引数にSQLがない");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryCol: 更新系のSQLは使用できません（" + sql + "）");
		}

		this.chkDbQuoteError(sql);
		var A_result = await this.O_DataBaseHundle.query({ text: sql , rowMode: 'array' });
		this.traceOut(sql);
		this.SqlCount++;

		if (!A_result) {
			this.exceptRaise("MtDBUtil::queryCol: " );
		}

		let tmpList = Array();
		A_result.rows.forEach(row => {
			tmpList.push(row[col]);
		})
		return tmpList;
	}

	queryHash(sql:string) //SQL実行
	{
		return this.queryAll(sql, DB_FETCHMODE_ASSOC, false);
	}

	queryAssoc(sql:string) //SQL実行
	{
		return this.queryAll(sql, DB_FETCHMODE_ORDERED, true);
	}

	queryKeyAssoc(sql:string) //SQL実行
	{
		return this.queryAll(sql, DB_FETCHMODE_ASSOC, true);
	}

	queryRowHash(sql:string) //SQL実行
	{
		return this.queryRow(sql, DB_FETCHMODE_ASSOC);
	}

	escape(value: string, escape_wildcards = false) //ログ出力
	//$this->traceOut($value);
	{
		//let str = (value as string).replace("'", "''");
		//if(escape_wildcards){
	//		str = (str as string).replace("%", "\\%")?.replace("_", "\\_");
	//	}
		return value;
	}

	async nextID(seqname:string) //ログ出力
	//エラーチェック
	{
		if ("string" === typeof seqname == false || seqname == "") {
			this.exceptRaise("MtDBUtil::nextID: シーケンス名がない");
		}

		var result = await this.queryOne(`select nextval( "${seqname}" )`);
		this.traceOut(seqname + ": " + result);

		if (!result) {
			this.exceptRaise("MtDBUtil::nextID: ");
		}

		return result;
	}

	setLimit(limit: number, offset: number) {
		this.limit = limit;
		this.offset = offset;
	}

	prepare(sql:string) //ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::prepare: 引数にSQLがない");
		}

		this.traceOut(sql);
		this.SqlCount++;

		return sql;
	}

	async execute(O_sql: any, A_value: any[], errchk = true) //ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェックしないならそのまま返す
	{
		if (undefined !== O_sql == false) {
			this.exceptRaise("MtDBUtil::execute: SQLステートメントがない");
		}

		if (Array.isArray(A_value) == false) {
			this.exceptRaise("MtDBUtil::execute: 置換用配列がない");
		}

		var O_result = await this.O_DataBaseHundle.query({text : O_sql, values : A_value});
		this.traceOut(JSON.stringify(A_value));
		this.SqlCount++;

		if (errchk === false) {
			return O_result;
		}

		if (!O_result) {
			this.exceptRaise("MtDBUtil::execute: " );
		}

		return O_result;
	}

	executeMultiple(O_sql: string, A_value: any[], errchk = true) {
		if (undefined !== O_sql == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: SQLステートメントがない");
		}

		if (Array.isArray(A_value) == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: 置換用配列がない");
		}

		if (Array.isArray(A_value[0]) == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: 置換用配列が2次元配列ではない");
		}

		var cnt = 0;

		for (var i = 0; i < A_value.length; i++) //$result = $O_sql->execute($A_value[$i]);
		//ログ出力
		{
			var O_result = this.execute(O_sql, A_value[i], false);
			this.traceOut(JSON.stringify(A_value[i]));

			if (!O_result) //エラーチェックしないならそのまま返す
				{
					if (errchk === false) {
						return O_result;
					}

					this.exceptRaise("MtDBUtil::executeMultiple: " );
				} else {
				cnt++;
			}
		}

		return cnt;
	}

	async pgCopyFromArray(tablename: string, A_rows: any, delimiter = undefined, null_as = undefined) //引数の配列はもう使わないので削除
	{
		const header = Object.keys(A_rows[0]);
		const copyString = `COPY ${tablename} (${header.join(',')}) FROM STDIN`;
		const stream = this.O_DataBaseHundle.query(copyFrom(copyString));
    	const rs = new Readable;
    	let currentIndex = 0;
    	rs._read = function () {
      		if (currentIndex === A_rows.length) {
       			rs.push(null);
      		} else {
        		const row = A_rows[currentIndex];
				const rowString = Object.values(row).join('\t') + '\n';
       			rs.push(rowString);
        		currentIndex = currentIndex+1;
      		}
    	}

		const process = new Promise<void>((resolve, reject) => {
			rs.on('error', reject)
			stream.on('error', reject)
			rs.on('data', (row) => {
				// processing
			})
			rs.on('end', resolve)
			rs.pipe(stream);
		})
		await process

		return true;
	}

	getSqlCount() {
		return this.SqlCount;
	}

	call(funcname: string, args: any) //MDB2のメソッドを呼び出す
	//ログ出力
	//if(PEAR::isError($result) == true){
	//$this->exceptRaise("MtDBUtil::__call(" . $funcname . "): " . $result->getUserinfo());
	//}
	//エラーオブジェクトが特定できないのでエラーチェックなしで返す
	//$this->exceptRaise("MtDBUtilエラー: メソッド名[" . $funcname . "]がない");
	{
		
	}

	resetDbQuoteError() {
		this.A_dbquote_err = Array();
	}

	addDbQuoteError(err = "") {
		this.A_dbquote_err.push(err);
	}

	getDbQuoteError() {
		return this.A_dbquote_err;
	}

	getDbQuoteErrorCount() {
		return this.getDbQuoteError().length;
	}

	chkDbQuoteError(sql = "") {
		if (this.getDbQuoteErrorCount() == 0) {
			return true;
		}

		var A_err = this.getDbQuoteError();
		this.resetDbQuoteError();
		this.exceptRaise("DBUtil::dbQuote: " + A_err.join(", ") + " ::作成したSQL:: " + sql);
	}

	dbQuote(data: any, type: string, notnull = false, mess = "") {
		const btrace:any = [{file : '', line : 0}];
		if (undefined !== type == false) {
			// var btrace = debug_backtrace();
			mess = "[" + path.basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
			this.addDbQuoteError("typeがない");
		}

		if (type == "integer" || type == "int" || type == "float") {
			if (notnull === true && data !== 0 && data == "") {
			// 	btrace = debug_backtrace();
				mess = "[" + path.basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				this.addDbQuoteError("not nullなのにデータがない(int) " + mess);
				return undefined;
			}

			if (data === 0) {
				return 0;
			}

			if (data == "") {
				return "NULL";
			}

			if (!isNaN(Number(data)) == false) {
			// 	btrace = debug_backtrace();
				mess = "[" + path.basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				this.addDbQuoteError("integerなのに数値以外(" + data + ") " + mess);
				return undefined;
			} else {
				return data; //.trim();
			}
		} else if (type == "char" || type == "varchar" || type == "string" || type == "str" || type == "text") {
			if (data == "") {
				if (notnull == true) {
					return "''";
				} else {
					return "NULL";
				}
			} else {
				return "'" + this.escape(data) + "'";
			}
		} else if (type == "timestamp" || type == "date" || type == "time") {
			if (data == "") {
				if (notnull == true) {
					return "''";
				} else {
					return "NULL";
				}
			} else {
				return "'" + this.escape(data) + "'";
			}
		} else if (type == "boolean" || type == "bool") {
			if (notnull == true && (data === "" || data === undefined)) {
				// btrace = debug_backtrace();
				// mess = "[" + path.basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				// this.addDbQuoteError("not nullなのにデータがない " + mess);
				return undefined;
			}

			if (data == 1 || data == "TRUE" || data == "true" || data === true) {
				return "TRUE";
			} else if (data == 0 || data == "FALSE" || data == "false" || data === false) {
				return "FALSE";
			} else {
				return "NULL";
			}
		} else {
			return data;
		}
	}

	execInsertUpdate(tablename: string, A_data:any) //インサートの件数
	//アップデートの件数
	//テーブルのカラム一覧
	//テーブルのprimary,unique key の一覧
	//NotNULLの一覧
	//テーブル情報の取得
	//var_dump($A_tableinfo);
	//引数の配列をループ
	{
		
		// 呼び出されている個所はないので、メソッドだけ用意しておく。
	}

	getNow() //DBから取得する場合の処理
	//処理は遅くなるが本当はこれがベスト
	//$sql = "select current_timestamp";
	//return $this->queryOne($sql);
	//PHPの関数で取得
	{
		return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	}

	getToday() //DBから取得する場合の処理
	//処理は遅くなるが本当はこれがベスト
	//$sql = "select current_date";
	//return $this->queryOne($sql);
	//PHPの関数で取得
	{
		return new Date().toJSON().slice(0,10).replace(/-/g,'-');
	}

	getHash(sql : string){

	}
};