//機能：FJP人事マスタの共通部分
//作成：森原
//===========================================================================
//FJPマスタ権限
//部署の承認権限
//メール送信先の種別
//FJP管理者宛に送信
//KCS管理者宛に送信
//バッチエラー宛に送信
//全部に送信
//メール送信時に全顧客とする値
//バッチの種別
//インポートバッチ
//事前チェックバッチ
//ファイルコピーバッチ
//メール送信バッチと上位バッチは含まない
//メール送信の方法
//通常送信
//メール送信せず標準出力に表示
//バッチエラー宛に送信
//ファイルコピーのステータス
//コピー成功
//ソース元のファイルがない
//ロックファイル生成されず
//その他のエラー
//インポート成功
//もっと新しいファイルがあるので無効
//インポート失敗
//プロセス間通信のキーワード
//職制の中間ファイル出力先ディレクトリ(KCS_DIRの後に続ける)(%Yは現在の年月)
//職制の保護部署ファイル名
//職制の中間ファイル名
//職制のバッチ名(自分から見た相対パス)
//職制コードの修正(2018/08)で追加された動作モード
//上からそれぞれ、在来4桁、00 + 4桁、新形式6桁
//機能：エラーハンドリングの基底型
//備考：実際の機能は派生型で実装する
//現在のみ
//現在＋過去最新月
//機能：データベースアクセス
// if (!(undefined !== fjp_stop_error_reporting)) error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("lib/script_log.php");
import { fwrite_conv, G_SCRIPT_ALL, G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../lib/script_log";
import TableNo, { ScriptDB, TableInserter, TableInserterSlow } from "../lib/script_db";
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as PATH from "path";
import { execSync } from "child_process";
import { G_MAIL_FROM, G_MAIL_TO, sprintf } from "../../../db_define/define";
import { parse } from "csv-parse";
import { FJP_DIR_FROM, FJP_DIR_TO_FAIL, FJP_DIR_TO_FIN, FJP_DIR_TO_POST, FJP_DIR_TO_PRE, FJP_ERRMSG_COMMON, FJP_SETTING_DIR, FJP_SETTING_NAME } from "./fjp_hrm_const";
import { KCS_DIR, PGPOOL_NO_INSERT_LOCK } from "../../../conf/batch_setting";
import { pg_copy_from } from "../../pg_function";
import MailUtil from "../../../class/MailUtil";
import { G_PHP } from "./script_common";
import * as crypto from "crypto";

const FJP_SAVEPOINT_NAME = "savepoint_fjp_hrm";
const FJP_FUNCID_MASTER = 208;
const FJP_FNCID_ORDER = 123;
const FJP_MAIL_FJP = 1;
export const FJP_MAIL_KCS = 2;
export const FJP_MAIL_MOTION = 4;
const FJP_MAIL_ALL = 7;
const FJP_MAIL_ALLPACT = 0;
const FJP_BATCH_IMPORT = 0;
const FJP_BATCH_PRECHECK = 1;
const FJP_BATCH_COPY = 2;
const FJP_MAIL_SEND_NORMAL = 0;
const FJP_MAIL_SEND_DUMP = 1;
const FJP_MAIL_SEND_DEBUG = 2;
const FJP_FILE_COPY_STATUS_COPY_FIN = 0;
const FJP_FILE_COPY_STATUS_FAIL_FIND = 1;
const FJP_FILE_COPY_STATUS_FAIL_TIMEOUT = 2;
const FJP_FILE_COPY_STATUS_FAIL_UNKNOWN = 3;
const FJP_FILE_COPY_STATUS_IMPORT_FIN = 4;
const FJP_FILE_COPY_STATUS_OLD = 5;
const FJP_FILE_COPY_STATUS_IMPORT_FAIL = 6;
const FJP_MAIL_PROC_BEGIN = "%%@@((";
const FJP_MAIL_PROC_END = "))@@%%";
const FJP_MAIL_PROC_BEGIN_RESULT = "%%@@((=";
const FJP_POST_DIR = "/data/%Y/POSTDATA/%P/";
const FJP_POST_PROTECT = "protect.txt";
const FJP_POST_POST = "post.csv";
const FJP_POST_PROC = "../ImportPostData.php";
export const FJP_IMPORT_POST_MODE_4 = "FJP_IMPORT_POST_MODE_4";
export const FJP_IMPORT_POST_MODE_400 = "FJP_IMPORT_POST_MODE_400";
export const FJP_IMPORT_POST_MODE_6 = "FJP_IMPORT_POST_MODE_6";

//機能：コンストラクタ
//機能：エラーを受け取る
//引数：種別
//顧客ID
//メッセージ
//機能：実行結果を受け取る
//引数：値その1
//値その2
//メッセージ
export class FJPErrorHandlerBaseType {
	constructor() //何もしない
	{ }

	// 2022cvt_016
	put(type: string, pactid: number, msg: string) //何もしない
	{ }

	putResult(arg1: any, arg2: any, msg: any) //何もしない
	{ }

	get() {
		return Array();
	}

	getResult() {
		return {};
	}

};

export class FJPErrorHandlerBufferType extends FJPErrorHandlerBaseType {
	m_A_buffer: any[];
	m_H_result: { type?: any; pactid?: any; msg?: any; };

	constructor() {
		super();
		this.m_A_buffer = Array();
		this.m_H_result = {};
	}

	get() {
		return this.m_A_buffer;
	}

	getResult() {
		return this.m_H_result;
	}

	// 2022cvt_016
	put(type: string, pactid: number, msg: string) {
		this.m_A_buffer.push({
			// 2022cvt_016
			type: type,
			pactid: pactid,
			msg: msg
		});
	}

	putResult(arg1: any, arg2: any, msg: any) {
		this.m_H_result = {
			// 2022cvt_016
			type: arg1,
			pactid: arg2,
			msg: msg
		};
	}

};

//デバッグモード
//機能：コンストラクタ
//引数：デバッグモードならtrue
//機能：エラーを受け取る
//引数：種別
//顧客ID
//メッセージ
//機能：実行結果を受け取る
//引数：値その1
//値その2
//メッセージ
export class FJPErrorHandlerChildProcType extends FJPErrorHandlerBaseType {
	m_debug_mode: boolean = false;

	constructor(debug_mode: boolean) {
		super();
		this.m_debug_mode = debug_mode;
	}

	// 2022cvt_016
	put(type: string, pactid: number, msg: string) {
		if (this.m_debug_mode) //種別とメッセージを表示する
		{
			// 2022cvt_016
			console.log(type + " " + pactid + " " + msg + "\n");
			// fputs(STDOUT, type + " " + pactid + " " + msg + "\n");
		} else //開始記号 種別 顧客ID エンコード後文字数 元文字数 内容 終了記号
		{
			// 2022cvt_015
			var enc = encodeURI(msg);
			// var enc = urlencode(msg);
			// 2022cvt_016
			console.log(FJP_MAIL_PROC_BEGIN + type + " " + pactid + " " + enc.length + " " + msg.length + " " + enc + FJP_MAIL_PROC_END + "\n");
			// fputs(STDOUT, FJP_MAIL_PROC_BEGIN + type + " " + pactid + " " + enc.length + " " + msg.length + " " + enc + FJP_MAIL_PROC_END + "\n");
		}
	}

	putResult(arg1: number, arg2: number, msg: string) {
		this.put("=" + arg1, arg2, msg);
	}

};

//ログリスナ
//子プロセスからのメッセージを受信するエラーハンドラ
//機能：コンストラクタ
//引数：ログリスナ
//子プロセスからのメッセージを受信するエラーハンドラ
//機能：子プロセスを実行する
//引数：実行するコマンドライン
//子プロセスの実行結果を返す
//返値：子プロセスが解析できない出力を行ったらfalseを返す
//機能：子プロセスの出力した内容を処理する
//引数：子プロセスが出力した全ての行
//返値：成功したらtrueを返す
//機能：一行を処理する
//引数：処理する行
// 2022cvt_016
//array("type" => 種別, "pactid" => 顧客ID, "msg => 本文)を返す
//返値：成功したらtrueを返す
export class FJPChildProcType {
	m_O_log: ScriptLogBase;
	m_O_handler: FJPErrorHandlerBaseType;

	constructor(O_log: ScriptLogBase, O_handler: FJPErrorHandlerBaseType) {
		this.m_O_log = O_log;
		this.m_O_handler = O_handler;
	}

	// 2022cvt_015
	exec(cmd: string, return_var: { [key: string]: number }) {
		return_var.value = 0;
		// 2022cvt_015
		var A_out = execSync(cmd);
		// exec(cmd, A_out, return_var);
		if (!this.parse(A_out.toString().split("\r\n"))) {
			return false;
		}
		return true;
	}

	parse(A_out: string[]) {
		// 2022cvt_015
		var rval = true;

		// 2022cvt_015
		for (var cnt = 0; cnt < A_out.length; ++cnt) {
			// 2022cvt_015
			var H_line: { [key: string]: any } = {};
			// 2022cvt_015
			var line = A_out[cnt];
			// 2022cvt_015
			var is_result = { "value": false };

			if (this.parseLine(line, H_line, is_result)) {
				// 2022cvt_016
				if (is_result.value) {
					this.m_O_handler.putResult(H_line.type, H_line.pactid, H_line.msg);
				} else {
					this.m_O_handler.put(H_line.type, H_line.pactid, H_line.msg);
				};
			} else //行の解釈に失敗した
			{
				rval = false;
				this.m_O_log.put(G_SCRIPT_DEBUG, "子プロセスからの不正なメッセージ:" + line);
				this.m_O_handler.put(FJP_MAIL_MOTION.toString() || FJP_MAIL_KCS.toString(), FJP_MAIL_ALL, line);
			}
		}

		return rval;
	}

	parseLine(line: string, H_line: { [key: string]: any }, is_result: { [key: string]: boolean }) //開始記号を消す
	//終了記号を消す
	//種別を取り出す
	//顧客IDを取り出す
	//エンコード後の文字数を取り出す
	//元の文字数を取り出す
	{
		H_line = Array();
		is_result.value = false;
		// 2022cvt_015
		var pos = line.indexOf(FJP_MAIL_PROC_BEGIN_RESULT);
		// var pos = strpos(line, FJP_MAIL_PROC_BEGIN_RESULT);

		if (0 === pos) {
			line = line.substring(FJP_MAIL_PROC_BEGIN_RESULT.length);
			is_result.value = true;
		} else {
			pos = line.indexOf(FJP_MAIL_PROC_BEGIN);
			// pos = strpos(line, FJP_MAIL_PROC_BEGIN);
			if (0 !== pos) {
				return false;
			}
			line = line.substring(FJP_MAIL_PROC_BEGIN.length);
		}

		pos = line.indexOf(FJP_MAIL_PROC_END);
		// pos = strpos(line, FJP_MAIL_PROC_END);
		if (line.length - FJP_MAIL_PROC_END.length !== pos) {
			return false;
		}
		line = line.substring(0, line.length - FJP_MAIL_PROC_END.length);
		pos = line.indexOf(" ");
		// pos = strpos(line, " ");
		if (-1 === pos || 0 === pos) {
			return false;
		}
		// 2022cvt_015
		var pre = parseInt(line.substring(0, pos));
		line = line.substring(pos + 1);
		if (isNaN(pre)) {
			return false;
		}
		// if (!is_numeric(pre)) return false;
		// 2022cvt_016
		H_line.type = pre;
		pos = line.indexOf(" ");
		// pos = strpos(line, " ");
		if (-1 === pos || 0 === pos) {
			return false;
		};
		pre = parseInt(line.substring(0, pos));
		line = line.substring(pos + 1);
		if (isNaN(pre)) {
			return false;
		}
		// if (!is_numeric(pre)) return false;
		H_line.pactid = pre;
		pos = line.indexOf(" ");
		// pos = strpos(line, " ");
		if (-1 === pos || 0 === pos) return false;
		pre = parseInt(line.substring(0, pos));
		line = line.substring(pos + 1);
		if (isNaN(pre)) {
			return false;
		}
		// if (!is_numeric(pre)) return false;
		// 2022cvt_015
		var length_enc = pre;
		pos = line.indexOf(" ");
		// pos = strpos(line, " ");
		if (-1 === pos || 0 === pos) {
			return false;
		}
		pre = parseInt(line.substring(0, pos));
		line = line.substring(pos + 1);
		if (isNaN(pre)) {
			return false;
		};
		// if (!is_numeric(pre)) return false;
		if (length_enc != line.length) {
			return false;
		}
		line = decodeURI(line);
		// line = urldecode(line);
		if (pre != line.length) {
			return false;
		}
		H_line.msg = line;
		return true;
	}

};

//出力先パス
//ERROR,WARNING出力先
//DEBUG以外のすべての出力先
//SQL出力先
//すべての出力先
//機能：コンストラクタ
//機能：ログ出力先のパスを設定する
//引数：現在のログ処理型(処理中のエラー出力にだけ使用する)
//ログ保存先フォルダ名(存在している事/右端はパス区切り文字)
//作成するフォルダ名(このフォルダを作って、そこにログファイル作成)
//返値：深刻なエラーが発生したらfalseを返す
export class FJPProcessLog extends ScriptLogBase {
	m_path: string = "";
	m_info!: ScriptLogFile;
	m_debug!: ScriptLogFile;
	m_sql!: ScriptLogFile;

	constructor() {
		super(0);
	}

	setPath(listener: { put: (arg0: any, arg1: string) => void; } | undefined, path: string, procname: string) {
		if (!fs.existsSync(path)) {
			// if (!file_exists(path)) {
			// 2022cvt_015
			var msg = `ログパス不正${path}`;
			if (undefined !== listener) {
				listener.put(G_SCRIPT_DEBUG, msg);
			} else {
				fwrite_conv(this.toLabel(G_SCRIPT_DEBUG) + msg + "\n");
			}
			return false;
		}

		if (procname.length) {
			try {
				fs.mkdirSync(path + procname, 777);
				if (!fs.existsSync(path + procname)) {};
			} catch (e) {
				msg = `ログディレクトリ作成失敗${path}${procname}`;
				if (undefined !== listener) {
					listener.put(G_SCRIPT_DEBUG, msg);
				} else {
					fwrite_conv(this.toLabel(G_SCRIPT_DEBUG) + msg + "\n");
				}
				return false;
			}
		}

		this.m_path = path + procname;
		this.m_err = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, this.m_path + "error.log");
		this.putListener(this.m_err);
		this.m_info = new ScriptLogFile(G_SCRIPT_ALL & ~G_SCRIPT_DEBUG, this.m_path + "info.log");
		this.putListener(this.m_info);
		this.m_debug = new ScriptLogFile(G_SCRIPT_ALL, this.m_path + "debug.log");
		this.putListener(this.m_debug);
		this.m_sql = new ScriptLogFile(G_SCRIPT_SQL, this.m_path + "sql.log");
		this.putListener(this.m_sql);
		return true;
	}

};

export class ScriptCommandSafe extends ScriptLogAdaptor {
	m_stdout_fault: boolean;
	m_unknown_type: number;
	m_stop_warning: boolean;

	// 2022cvt_016
	constructor(listener: ScriptLogBase, stdout_fault = false, unknown_type = G_SCRIPT_WARNING) {
		super(listener, false);
		// this.ScriptLogAdaptor(listener, false);
		this.m_stdout_fault = stdout_fault;
		// 2022cvt_016
		this.m_unknown_type = unknown_type;
		this.m_stop_warning = false;
	}

	execute(cmd: string, A_args: { key: string; value: any; }[], A_addargs: any[]) {
		// 2022cvt_015
		var A_newargs = Array();
		// 2022cvt_015
		var all_args = [A_args, A_addargs];

		// 2022cvt_015
		for (var one_args of all_args) {
			// 2022cvt_015
			for (var args of one_args) {
				// 2022cvt_015
				var arg = "";
				if (undefined !== args.key) arg += "-" + args.key;
				if (undefined !== args.addkey) arg += args.addkey;

				if (undefined !== args.value) {
					if (undefined !== args.key && args.key.length) arg += "=";
					arg += args.value;
				}

				if (arg.length) A_newargs.push(arg);
			}
		}

		return this.executeRaw(cmd, A_newargs);
	}

	executeRaw(cmd: string, A_args: any[]) {
		// 2022cvt_015
		// var line = cmd;

		// 2022cvt_015
		// for (var arg of A_args) {
		// 	line += " " + this.escape(arg);
		// };

		return this.executeCommand(cmd);
	}

	executeCommand(line: string) //実行結果がエラーならログ出力
	{
		// 2022cvt_015
		var A_rval;
		var rval = 0;
		// 2022cvt_015
		try {
			A_rval = execSync(line);
		} catch (a: any) {
			rval = a.status;
		}
		// exec(line, A_rval, rval);
		// 2022cvt_015
		var A_temp = Array();

		// 2022cvt_015
		for (var msg of A_rval.toString().split("\r\n")) {
			if (msg.length) A_temp.push(msg);
		}

		var A_rval_2 = A_temp;
		// 2022cvt_015
		var status = true;

		if (0 != rval) {
			if (this.m_stop_warning) {
				this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);
			} else {
				this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);
			}
			status = false;
		}

		// 2022cvt_015
		for (var msg of A_rval_2) {
			// mb_detect_order("UTF-8");
			// 2022cvt_015
			// var enc = mb_detect_encoding(msg);
			// var enc = Encoding.detect(msg);
			// 2022cvt_015
			//var text = Encoding.convert(msg, { from: enc, to: 'UTF8', type: 'string' });
			var text = Encoding.convert(msg, 'UTF8');
			// var msg = mb_convert_encoding(msg, "UTF-8", enc);
			if (this.m_stdout_fault) {
				status = false;
			}
			// 2022cvt_016

			if (this.m_listener.isLabel(msg)) {
				this.m_listener.put(this.m_unknown_type, msg);
			} else if (0 != this.m_unknown_type) {
				this.putError(this.m_unknown_type, `未定義出力 ${msg}`);
			}
			// if (this.m_listener.isLabel(msg)) else if (0 != this.m_unknown_type) this.putError(this.m_unknown_type, `未定義出力 ${msg}`);
		}

		return status;
	}

	// 2022cvt_015
	// 	escape(var_0) {
	// // 2022cvt_015
	// 		return escapeshellcmd(escapeshellarg(var_0));
	// 	}

};

export class FJPCSVReaderBaseType {
	m_O_handler: FJPErrorHandlerBaseType;
	m_is_ignore: any;
	m_skip_lines: any;

	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore: any, skip_lines: any) {
		this.m_O_handler = O_handler;
		this.m_is_ignore = is_ignore;
		this.m_skip_lines = skip_lines;
	}

	// 2022cvt_016
	putError(type: string, pactid: number, msg: string) {
		if (this.m_is_ignore) return;
		// 2022cvt_016
		this.m_O_handler.put(type, pactid, msg);
	}

	read(fname: string) //ファイル処理の準備をする
	//ファイルを閉じる
	//最後に、ファイル全体を処理する
	{
		// 2022cvt_015
		var rval = true;
		if (!this.beginFile()) rval = false;
		// 2022cvt_015
		var buffer;
		try {
			buffer = fs.readFileSync(fname, "utf8");
		} catch (e) {
			var path = PATH.parse(fname);
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ファイルが存在しません" + path.base);
			this.putError(FJP_MAIL_MOTION.toString() || FJP_MAIL_KCS.toString(), FJP_MAIL_ALL, "ファイルの所在" + fname);
			return false;
		}
		var options = { escape: "\\" }
		const rows = parse(buffer, options);
		// var fp = fopen(fname, "rb");

		// 2022cvt_015
		var index = 0;
		for (var row in rows) {
		// for (var lineno = 0; false !== (A_cell = fgetcsv(fp, 0, ",", "\"")); ++lineno) {
			index += 1;
			row = this.escapeLine(row);
			if (index < this.m_skip_lines) {
				continue;
			}
			if (!this.feedLine(row, index)) {
				rval = false;
			}
		}

		// fclose(fp);
		if (!this.endFile()) {
			rval = false;
		};
		return rval;
	}

	escapeLine(A_cell: string) {
		// 2022cvt_015
		for (var cnt = 0; cnt < A_cell.length; ++cnt) {
			var before = A_cell.slice(0, cnt - 1);
			var after = A_cell.slice(cnt - 1 + this.escapeCell(A_cell[cnt]).length);
			A_cell = before + this.escapeCell(A_cell[cnt]) + after;
			// A_cell[cnt] = this.escapeCell(A_cell[cnt]);
		}
		return A_cell;
	}

	escapeCell(cell: string) {
		return cell;
	}

	beginFile() //派生型で処理する
	{
		return true;
	}

	feedLine(A_cell: {} | any[], lineno: number) //派生型で処理する
	{
		return true;
	}

	endFile() //派生型で処理する
	{
		return true;
	}

};

export class FJPSettingType extends FJPCSVReaderBaseType {
	// O_handler!: FJPErrorHandlerChildProcType;
	m_A_buffer: Array<any>;
	m_H_all: { [key: string]: any };
	m_H_setting: Array<any>;

	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore: boolean) {
		super(O_handler, is_ignore, 0);
		this.m_A_buffer = Array();
		this.m_H_all = {};
		this.m_H_setting = Array();
	}

	getSettingAll() {
		return this.m_H_all;
	}

	getPactIDAll() {
		// 2022cvt_015
		var A_pactid = Array();
		{
			let _tmp_0 = this.m_H_setting;

			// 2022cvt_015
			for (var pactid in _tmp_0) {
				// 2022cvt_015
				var H_dummy = _tmp_0[pactid];
				A_pactid.push(pactid);
			}
		}
		return A_pactid;
	}

	getPactIDSkip(A_in: Array<any>, A_out: Array<any>) {
		// 2022cvt_015
		var A_pactid = this.getPactIDAll();
		// 2022cvt_015
		var A_rval = Array();

		// 2022cvt_015
		for (var pactid of A_pactid) {
			if (A_in.length && !(-1 !== A_in.indexOf(pactid))) {
				continue;
			}
			if (-1 !== A_out.indexOf(pactid)) {
				continue;
			}
			A_rval.push(pactid);
		}

		return A_rval;
	}

	getSetting(pactid: string | number) {
		if (undefined !== this.m_H_setting[pactid]) {
			return this.m_H_setting[pactid];
		}
		return Array();
	}

	feedLine(A_cell: Array<any>, lineno: number) //セルが無ければ無視する
	{
		if (!A_cell.length) {
			return true;
		}
		if (1 == A_cell.length && !A_cell[0].length) {
			return true;
		}

		switch (A_cell[0]) {
			case "0":
				return this.feedLine0(A_cell, lineno);

			case "1":
				return this.feedLine1(A_cell, lineno);

			case "2":
				return this.feedLine2(A_cell, lineno);

			default:
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の最初のセルが0,1,2のいずれでもありません。");
				return false;
		}

		return true;
	}

	beginFile() {
		this.m_A_buffer = Array();
		return true;
	}

	feedLine0(A_cell: Array<any>, lineno: number) //総個数
	//無視する職制順コードは無くても良い
	{
		// 2022cvt_015
		var limit = 6;

		if (A_cell.length < limit) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目(全体設定)" + "のセルの個数は最低" + limit + "個必要です。");
			return false;
		}

		// 2022cvt_015
		var idx = 1;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(人事マスタファイル)" + "の内容がありません。");
				return false;
			}

			this.m_H_all.fname_user = A_cell[idx];
		}

		idx = 2;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(ロックファイル)" + "の内容がありません。");
				return false;
			}

			this.m_H_all.fname_lock = A_cell[idx];
		}

		idx = 3;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(職制マスタファイル)" + "の内容がありません。");
				return false;
			}

			this.m_H_all.fname_post = A_cell[idx];
		}

		idx = 4;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(給与負担職制)" + "の内容がありません。");
				return false;
			}

			this.m_H_all.column_id = A_cell[idx];
		}

		idx = 5;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(給与負担職制名)" + "の内容がありません。");
				return false;
			}

			this.m_H_all.column_name = A_cell[idx];
		}

		idx = 6;
		this.m_H_all.A_ignore = Array();

		if (idx < A_cell.length) //内容が空でも問題ない
		{
			// 2022cvt_015
			var A_code = A_cell[idx].split(",");
			var code = "";

			// 2022cvt_015
			for (code of A_code) {
				if (!code.length) {
					continue;
				};
				// 2022cvt_015
				code = "P" + code;
				if (!(-1 !== this.m_H_all.A_ignore.indexOf(code))) {
					this.m_H_all.A_ignore.push(code);
				};
			}
		}

		idx = 7;
		this.m_H_all.A_skip_postcode = Array();

		if (idx < A_cell.length) //内容が空でも問題ない
		{
			A_code = A_cell[idx].split(",");

			// 2022cvt_015
			var code = "";
			for (code of A_code) {
				if (!code.length) {
					continue;
				}
				code = "P" + code;
				if (!(-1 !== this.m_H_all.A_skip_postcode.indexOf(code))) {
					this.m_H_all.A_skip_postcode.push(code);
				}
			}
		}

		return true;
	}

	feedLine1(A_cell: Array<any>, lineno: number) //バッファに中身が無い事を確認する
	{
		if (this.m_A_buffer.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "は、各顧客の1行目が連続しています。");
			return false;
		}

		this.m_A_buffer = A_cell;
		return true;
	}

	feedLine2(A_cell: Array<any>, lineno: number) //一行目のデータがある事を確認する
	//人事マスタの会社コード
	//管理者の権限IDセット
	//各社の、無視する職制順コード
	//バッファを初期化する
	{
		if (!this.m_A_buffer.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の手前に、各顧客の1行目がありません。");
			return false;
		}

		// 2022cvt_015
		var limit = 8;

		if (this.m_A_buffer.length < limit) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "のセルの個数は最低" + limit + "個必要です。");
			return false;
		}

		// 2022cvt_015
		var idx = 1;

		if (isNaN(this.m_A_buffer[idx])) {
			// if (!is_numeric(this.m_A_buffer[idx])) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(顧客ID)" + "の内容が整数ではありません。");
			return false;
		}

		// 2022cvt_015
		var pactid = this.m_A_buffer[idx];
		this.m_H_setting[pactid] = Array();
		idx = 2;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(人事マスタの会社コード)" + "の内容がありません。");
			return false;
		}

		// 2022cvt_015
		var A_code = this.m_A_buffer[idx].split(",");
		this.m_H_setting[pactid].A_code_user = Array();

		// 2022cvt_015
		var code = "";
		for (code of A_code) {
			if (!code.length) {
				continue;
			}
			// 2022cvt_015
			code = "C" + code;
			if (!(-1 !== this.m_H_setting[pactid].A_code_user.indexOf(code))) {
				this.m_H_setting[pactid].A_code_user.push(code);
			}
		}

		if (!this.m_H_setting[pactid].A_code_user.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(人事マスタの会社コード)" + "の内容がありません。");
			return false;
		}

		idx = 3;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(職制マスタの会社コード)" + "の内容がありません。");
			return false;
		}

		A_code = this.m_A_buffer[idx].split(",");
		this.m_H_setting[pactid].A_code_post = Array();

		// 2022cvt_015
		var code = "";
		for (code of A_code) {
			if (!code.length) {
				continue;
			}
			code = "C" + code;
			if (!(-1 !== this.m_H_setting[pactid].A_code_post.indexOf(code))) {
				this.m_H_setting[pactid].A_code_post.push(code);
			}
		}

		if (!this.m_H_setting[pactid].A_code_post.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(職制マスタの会社コード)" + "の内容がありません。");
			return false;
		}

		idx = 4;

		if (isNaN(this.m_A_buffer[idx])) {
			// if (!is_numeric(this.m_A_buffer[idx])) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(管理者識別用権限ID)" + "の内容が整数ではありません。");
			return false;
		}

		this.m_H_setting[pactid].fncid_admin = this.m_A_buffer[idx];
		idx = 5;
		// 2022cvt_015
		var A_fncid = this.m_A_buffer[idx].split(" ");
		this.m_H_setting[pactid].A_fncid_admin = Array();

		// 2022cvt_015
		for (var fncid of A_fncid) {
			if (isNaN(fncid)) {
				// if (!is_numeric(fncid)) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(管理者用権限セット)" + "に整数以外が含まれています。");
				return false;
			}

			if (!(-1 !== this.m_H_setting[pactid].A_fncid_admin.indexOf(fncid))) {
				this.m_H_setting[pactid].A_fncid_admin.push(fncid);
			}
		}

		if (!this.m_H_setting[pactid].A_fncid_admin.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(管理者用権限セット)" + "の内容がありません。");
			return false;
		}

		idx = 6;
		A_fncid = this.m_A_buffer[idx].split(" ");
		this.m_H_setting[pactid].A_fncid_user = Array();

		// 2022cvt_015
		for (var fncid of A_fncid) {
			if (isNaN(fncid)) {
				// if (!is_numeric(fncid)) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(管理者用権限セット)" + "に整数以外が含まれています。");
				return false;
			}

			if (!(-1 !== this.m_H_setting[pactid].A_fncid_user.indexOf(fncid))) {
				this.m_H_setting[pactid].A_fncid_user.push(fncid);
			}
		}

		if (!this.m_H_setting[pactid].A_fncid_user.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 0) + "行目" + "の" + (idx + 1) + "個目のセル(管理者用権限セット)" + "の内容がありません。");
			return false;
		}

		idx = 7;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの" + (lineno + 1) + "行目" + "の" + (idx + 1) + "番目のセル(不明な部署コード)" + "の内容がありません。");
			return false;
		}

		this.m_H_setting[pactid].postcode_unknown = this.m_A_buffer[idx];
		idx = 8;
		this.m_H_setting[pactid].A_ignore = Array();

		if (idx < this.m_A_buffer.length) //内容が空でも問題ない
		{
			A_code = this.m_A_buffer[idx].split(",");

			// 2022cvt_015
			var code = "";
			for (code of A_code) {
				if (!code.length) {
					continue;
				}
				code = "P" + code;
				if (!(-1 !== this.m_H_setting[pactid].A_ignore.indexOf(code))) {
					this.m_H_setting[pactid].A_ignore.push(code);
				}
			}
		}

		idx = 9;
		this.m_H_setting[pactid].is_unknown_tel = true;

		if (idx < this.m_A_buffer.length) {
			this.m_H_setting[pactid].is_unknown_tel = "0" !== this.m_A_buffer[idx];
		}

		// 2022cvt_015
		var A_postcode_protected = Array();

		// 2022cvt_015
		for (var cnt = 1; cnt < A_cell.length; ++cnt) {
			if (!A_cell[cnt].length) {
				continue;
			}
			// 2022cvt_015
			var cell = "P" + A_cell[cnt];
			if (!(-1 !== A_postcode_protected.indexOf(cell))) {
				A_postcode_protected.push(cell);
			}
		}

		this.m_H_setting[pactid].A_postcode_protected = A_postcode_protected;
		this.m_A_buffer = Array();
		return true;
	}

};

export class FJPMasterBaseType extends FJPCSVReaderBaseType {
	m_A_pactid_in: Array<any>;
	m_A_pactid_out: Array<any>;
	m_A_pactcode_in: Array<any>;
	m_A_pactcode_out: Array<any>;
	m_H_pactid_pactcode: Array<any>;
	m_H_pactcode_pactid: Array<any>;
	m_H_pactid_pactcode_ready: Array<any>;
	m_A_pactcode_ready: Array<any>;
	m_A_pactcode_bad: Array<any>;
	m_is_fail: boolean | number;

	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore: any, skip_lines: any) {
		super(O_handler, is_ignore, skip_lines);
		this.m_A_pactid_in = Array();
		this.m_A_pactid_out = Array();
		this.m_A_pactcode_in = Array();
		this.m_A_pactcode_out = Array();
		this.m_H_pactid_pactcode = Array();
		this.m_H_pactcode_pactid = Array();
		this.m_H_pactid_pactcode_ready = Array();
		this.m_A_pactcode_ready = Array();
		this.m_A_pactcode_bad = Array();
		this.m_is_fail = false;
	}

	setSkip(A_pactid_in: Array<any>, A_pactid_out: Array<any>, A_pactcode_in: Array<any>, A_pactcode_out: Array<any>) {
		this.m_A_pactid_in = A_pactid_in;
		this.m_A_pactid_out = A_pactid_out;
		this.m_A_pactcode_in = A_pactcode_in;
		this.m_A_pactcode_out = A_pactcode_out;
	}

	addPact(pactid: string | number, pactcode: string | number) {
		if (Array.isArray(pactcode)) {
			// 2022cvt_015
			for (var code of pactcode) {
				this.addPact(pactid, code);
			}

			return;
		}

		if (!(undefined !== this.m_H_pactid_pactcode[pactid])) {
			this.m_H_pactid_pactcode[pactid] = Array();
		}
		if (!(-1 !== this.m_H_pactid_pactcode[pactid].indexOf(pactcode))) {
			this.m_H_pactid_pactcode[pactid].push(pactcode);
		}
		if (!(undefined !== this.m_H_pactcode_pactid[pactcode])) {
			this.m_H_pactcode_pactid[pactcode] = Array();
		}
		if (!(-1 !== this.m_H_pactcode_pactid[pactcode].indexOf(pactid))) {
			this.m_H_pactcode_pactid[pactcode].push(pactid);
		}
	}

	isIn(pactid: string | number) {
		return undefined !== this.m_H_pactid_pactcode_ready[pactid] && 0 < this.m_H_pactid_pactcode_ready[pactid].length;
	}

	isFail() {
		return this.m_is_fail;
	}

	getPactCode(pactid: string | number) {
		if (undefined !== this.m_H_pactid_pactcode[pactid]) {
			return this.m_H_pactid_pactcode[pactid];
		}
		return Array();
	}

	getPactCodeLack() {
		// 2022cvt_015
		var H_rval = Array();
		{
			let _tmp_1 = this.m_H_pactid_pactcode_ready;

			// 2022cvt_015
			for (var pactid in _tmp_1) {
				// 2022cvt_015
				var A_ready = _tmp_1[pactid];
				// 2022cvt_015
				var A_all = this.m_H_pactid_pactcode[pactid];
				// 2022cvt_015
				var A_bad = Array();

				// 2022cvt_015
				for (var code of A_all) {
					if (!(-1 !== A_ready.indexOf(code))) {
						A_bad.push(code);
					}
				}

				if (A_bad.length) {
					H_rval[pactid] = A_bad;
				}
			}
		}
		return H_rval;
	}

	setFail(is_fail = true) {
		this.m_is_fail = is_fail;
	}

	convertPact(pactcode: string, A_pactid: Array<any>, is_first: { [key: string]: boolean }) //会社コードを無視するか
	//スキップする顧客IDを除く
	//出現済の会社コードを記録する
	{
		A_pactid = Array();
		is_first.value = false;

		if (-1 !== this.m_A_pactcode_out.indexOf(pactcode)) {
			return true;
		}

		if (this.m_A_pactcode_in.length && !(-1 !== this.m_A_pactcode_in.indexOf(pactcode))) {
			return true;
		}

		if (-1 !== this.m_A_pactcode_bad.indexOf(pactcode)) {
			return false;
		}

		if (!(undefined !== this.m_H_pactcode_pactid[pactcode])) {
			is_first.value = true;
			this.m_A_pactcode_bad.push(pactcode);
			return false;
		}

		A_pactid = this.m_H_pactcode_pactid[pactcode];
		// 2022cvt_015
		var A_temp = Array();

		// 2022cvt_015
		for (var pactid of A_pactid) {
			if (-1 !== this.m_A_pactid_out.indexOf(pactid)) {
				continue;
			}
			if (this.m_A_pactid_in.length && !(-1 !== this.m_A_pactid_in.indexOf(pactid))) {
				continue;
			}
			A_temp.push(pactid);
		}

		A_pactid = A_temp;

		if (!(-1 !== this.m_A_pactcode_ready.indexOf(pactcode))) {
			this.m_A_pactcode_ready.push(pactcode);

			// 2022cvt_015
			for (var pactid of A_pactid) {
				if (!(undefined !== this.m_H_pactid_pactcode_ready[pactid])) {
					this.m_H_pactid_pactcode_ready[pactid] = Array();
				};
				if (!(-1 !== this.m_H_pactid_pactcode_ready[pactid].indexOf(pactcode))) {
					this.m_H_pactid_pactcode_ready[pactid].push(pactcode);
				};
			}
		}

		return true;
	}

	// 2022cvt_016
	errorCheck(type: string) {
		// 2022cvt_015
		var rval = true;
		// 2022cvt_015
		var H_lack = this.getPactCodeLack();

		// 2022cvt_015
		for (var pactid in H_lack) {
			// 2022cvt_015
			var A_pactcode = H_lack[pactid];
			// 2022cvt_016
			// 2022cvt_015
			var msg = type + "の会社IDが" + pactid + "の、一部の会社コードがありません";

			// 2022cvt_015
			for (var pactcode of A_pactcode) {
				msg += "," + pactcode.substring(1);
			}

			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			rval = false;
		}

		return rval;
	}

};

export class FJPMasterUserType extends FJPMasterBaseType {
	m_H_master: Array<any>;
	m_userpostid_mode: string;

	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore: boolean, userpostid_mode: string) //先頭行は読み飛ばさない
	{
		super(O_handler, is_ignore, 0);
		this.m_H_master = Array();
		this.m_userpostid_mode = userpostid_mode;
	}

	get(pactid: string | number) {
		if (!(undefined !== this.m_H_master[pactid])) {
			return Array();
		}
		return this.m_H_master[pactid];
	}

	feedLine(A_cell: Array<any>, lineno: number) //エラーメッセージの共通部分を作る
	//会社コードから顧客IDに変換する
	//氏名
	//メールアドレス
	//部署コード
	//管理職ならtrue
	//給与負担元コード
	{
		// 2022cvt_015
		var common = "";
		if (0 < A_cell.length) common += "(会社コードは" + A_cell[0] + ")";
		if (1 < A_cell.length) common += "(従業員番号は" + A_cell[1] + ")";
		if (2 < A_cell.length) common += "(氏名は" + A_cell[2] + ")";
		// 2022cvt_015
		var limit = FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode ? 18 : 15;

		if (A_cell.length < limit) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "のセルの個数が" + limit + "個より少ないです。" + common);
			this.setFail();
			return true;
		}

		if (!A_cell[0].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の会社コードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var pactcode = "C" + A_cell[0];
		// 2022cvt_015
		var A_pactid = Array();
		// 2022cvt_015
		var is_first = { "value": false };

		if (!this.convertPact(pactcode, A_pactid, is_first)) {
			if (is_first.value) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の会社コード" + "が設定ファイル中にありません。" + common);
				this.setFail();
			}

			return true;
		}

		if (!A_cell[1].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の従業員番号がありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var employee = A_cell[1];

		if (!A_cell[2].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の氏名がありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var name = A_cell[2];
		// 2022cvt_015
		var addr = A_cell[4].toLowerCase();

		if (!A_cell[5].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の職制コードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var userpostid = A_cell[5];

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //職制コードは6桁である
		{
			if (6 != userpostid.length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の職制コードが6桁ではありません。" + common);
				this.setFail();
				return true;
			}
		} else //職制コードは4桁である
		{
			if (4 != userpostid.length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の職制コードが4桁ではありません。" + common);
				this.setFail();
				return true;
			}

			if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode) {
				userpostid = "00" + userpostid;
			}
		}

		if (!A_cell[11].length || isNaN(A_cell[11])) {
			// if (!A_cell[11].length || !is_numeric(A_cell[11])) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事マスタファイルの" + (lineno + 1) + "行目" + "の管理職/一般職がありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var is_admin = 1 == A_cell[11];
		// 2022cvt_015
		var salary_id = "";
		if (A_cell[7].length) salary_id = A_cell[7];

		if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode && 4 == salary_id.length) {
			salary_id = "00" + salary_id;
		}

		// 2022cvt_015
		var salary_name = "";
		if (A_cell[8].length) salary_name = A_cell[8];
		// 2022cvt_015
		var executive_no = "";
		if (A_cell[12].length) executive_no = A_cell[12];
		// 2022cvt_015
		var executive_name = "";
		if (A_cell[13].length) executive_name = A_cell[13];
		// 2022cvt_015
		var executive_mail = "";
		if (A_cell[14].length) executive_mail = A_cell[14].toLowerCase();
		// 2022cvt_015
		var office_code = "";
		// 2022cvt_015
		var office_name = "";
		// 2022cvt_015
		var building_name = "";

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //事業所コード
		{
			if (A_cell[15].length) {
				office_code = A_cell[15];
			}
			if (A_cell[16].length) {
				office_name = A_cell[16];
			}
			if (A_cell[17].length) {
				building_name = A_cell[17];
			}
		}

		// 2022cvt_015
		for (var pactid of A_pactid) {
			if (!(undefined !== this.m_H_master[pactid])) {
				this.m_H_master[pactid] = Array();
			}

			if (!(undefined !== this.m_H_master[pactid]["U" + employee])) {
				// 2022cvt_015
				var H_insert: { [key: string]: any } = {
					employeecode: employee,
					username: name,
					mail: addr,
					is_admin: is_admin,
					employee_class: is_admin ? 2 : 1,
					userpostid: userpostid,
					salary_id: salary_id,
					salary_name: salary_name,
					executive_no: executive_no,
					executive_name: executive_name,
					executive_mail: executive_mail
				};
				H_insert.office_code = office_code;
				H_insert.office_name = office_name;
				H_insert.building_name = building_name;
				this.m_H_master[pactid]["U" + employee] = H_insert;
			}
		}

		return true;
	}

	endFile() //共通のエラー処理を行う
	{
		if (!this.errorCheck("人事マスタファイル")) {
			this.setFail();
		}
		return true;
	}

};

//職制マスタファイルのレベルから、職制順コード文字数への変換表
//全社共通で、無視する職制順コード(先頭に"P")
//全社共通で、無視する職制コード(先頭に"P")
//KCSモーションの顧客IDから、無視する職制順コードへの変換表(先頭に"P")
//職制コードの取り込み方法
//職制マスタから読み出した内容
//array(
//KCSモーションの顧客ID => array(
//"P" . 職制順コード => array(
//"userpostid" => 職制コード,
//"postname" => 部署名,
//"level_out" => 中間ファイルに渡すレベル,
//"level_in" => 職制マスタから読み出したレベル,
//"parent" => 中間ファイルに渡す、親の職制順コード
//),
//...
//);
//データ行を読み込んだ時点では、以下のメンバは値が無い。
//level_out,parent
//機能：コンストラクタ
//引数：エラーハンドラ
//エラーをハンドラに渡さないならtrue
//職制コードの取り込み方法
//機能：職制マスタのレベルから、職制順コード文字数への変換表を設定する
//引数：array(職制マスタのレベル => 職制順コード文字数)
//機能：全社共通で、無視する職制順コードと職制コード(先頭にP)を追加する
//機能：各社の、無視する職制順コード(先頭にP)を追加する
//機能：指定したKCSモーションの顧客IDの中間ファイルを生成する
//引数：顧客ID
//ファイル名
//返値：処理に失敗したらfalseを返す
//-----------------------------------------------------------------------
//機能：中間ファイルに一行追加する
//引数：ファイルポインタ
//顧客ID
//"P" . 職制順コード
//部署情報
//全部署の情報
//返値：処理に失敗したらfalseを返す
//機能：中間ファイルに出力するためにエスケープして返す
//機能：ファイルの行を解釈する
//引数：行を構成する行
//行番号
//返値：処理に失敗したらfalseを返す
//機能：ファイル処理の後処理を行う
//返値：処理に失敗したらfalseを返す
class FJPMasterPostType extends FJPMasterBaseType {
	m_A_ignore: Array<any> = [];
	m_A_skip_postcode: Array<any> = [];
	m_H_ignore: Array<any> = [];
	m_H_master: Array<any> = [];
	m_userpostid_mode: string = "";
	m_H_length: { [key: string]: any } = {};

	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore: boolean, userpostid_mode: string) //先頭行を読み飛ばさない
	{
		super(O_handler, is_ignore, 0);

		if (FJP_IMPORT_POST_MODE_6 == userpostid_mode) //職制順コードは新形式の22桁方式
		{
			this.setLength({
				10: 10,
				30: 12,
				40: 14,
				50: 16,
				60: 18,
				70: 20,
				80: 22
			});
		} else //職制順コードは従来の10桁方式
		{
			this.setLength({
				2: 4,
				3: 6,
				4: 8,
				5: 10
			});
		}

		this.m_A_ignore = Array();
		this.m_A_skip_postcode = Array();
		this.m_H_ignore = Array();
		this.m_H_master = Array();
		this.m_userpostid_mode = userpostid_mode;
	}

	setLength(H_length: {} | any[]) //職制マスタのレベルは降順でソートする
	{
		// krsort(H_length);
		this.m_H_length = H_length;
	}

	addIgnoreAll(A_ignore: Array<any>, A_skip_postcode: Array<any>) {
		// 2022cvt_015
		for (var ignore of A_ignore) {
			if (!(-1 !== this.m_A_ignore.indexOf(ignore))) {
				this.m_A_ignore.push(ignore);
			}
		}

		// 2022cvt_015
		for (var code of A_skip_postcode) {
			if (!(-1 !== this.m_A_skip_postcode.indexOf(code))) {
				this.m_A_skip_postcode.push(code);
			}
		}
	}

	addIgnore(pactid: string | number, A_ignore: Array<any>) {
		if (!(undefined !== this.m_H_ignore[pactid])) {
			this.m_H_ignore[pactid] = Array();
		}

		// 2022cvt_015
		for (var ignore of A_ignore) {
			if (!(-1 !== this.m_H_ignore[pactid].indexOf(ignore))) {
				this.m_H_ignore[pactid].push(ignore);
			}
		}
	}

	createFile(pactid: string | number, fname: string) //ファイルを出力する
	//一行目は空行を出力する
	//二行目以降を出力する
	{
		// 2022cvt_015
		try {
			var fp = fs.openSync(fname, "wt");
		} catch (e) {
			var path = PATH.parse(fname);
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ファイル作成に失敗しました" + path.base);
			this.putError(FJP_MAIL_MOTION.toString() || FJP_MAIL_KCS.toString(), FJP_MAIL_ALL, "ファイルの所在" + fname);
			return false;
		}
		// var fp = fopen(fname, "wt");

		// 2022cvt_015
		var rval = (true).toString();
		fs.writeFileSync(fp, "\n");// 2022cvt_006

		if (undefined !== this.m_H_master[pactid]) {
			{
				let _tmp_2 = this.m_H_master[pactid];

				// 2022cvt_015
				for (var keycode in _tmp_2) {
					// 2022cvt_015
					var H_param = _tmp_2[keycode];
					rval += this.createLine(fp, pactid, keycode, H_param, this.m_H_master[pactid]);
					// rval += this.createLine(fp, pactid, keycode, H_param, this.m_H_master[pactid]);
				}
			}
		}

		// fclose(fp);
		fs.closeSync(fp);
		return rval;
	}

	createLine(fp: fs.PathOrFileDescriptor, pactid: string | number, keycode: string, H_param: { [key: string]: any }, H_master: {} | any[]) {
		// 2022cvt_015
		var line = "";
		// 2022cvt_015
		var quote = "\"";
		// 2022cvt_015
		var comma = ",";
		line += quote + this.escapeCreate(H_param.userpostid) + quote;
		line += comma + quote;
		if (undefined !== H_param.parent && undefined !== H_master[H_param.parent]) {
			line += this.escapeCreate(H_master[H_param.parent].userpostid);
		}
		line += quote;
		line += comma + quote + this.escapeCreate(H_param.postname) + quote;
		line += comma + quote + H_param.level_out + quote;
		line += comma;
		line += comma;
		line += "\n";
		fs.writeFileSync(fp, line);// 2022cvt_006
		return true;
	}

	// 2022cvt_015
	escapeCreate(var_0: string) //ダブルクォートを二重化する
	{
		// 2022cvt_020
		// 2022cvt_015
		var_0 = var_0.replace("\"", "\"\"");
		// var_0 = str_replace("\"", "\"\"", var_0);
		// 2022cvt_015
		return var_0;
	}

	feedLine(A_cell: Array<any>, lineno: number) //無視する職制コードなら処理しない
	//会社コードから顧客IDに変換する
	//職制順コード
	//先頭に"P"を付ける
	//職制漢字略名称
	//レベルコード
	//結果を保存する
	{
		if (0 < A_cell.length) {
			// 2022cvt_015
			var postcode = "P" + A_cell[0];
			if (-1 !== this.m_A_skip_postcode.indexOf(postcode)) {
				return true;
			}
		}

		// 2022cvt_015
		var common = "";
		if (1 < A_cell.length) common += "(会社コードは" + A_cell[1] + ")";
		if (0 < A_cell.length) common += "(職制コードは" + A_cell[0] + ")";
		if (8 < A_cell.length) common += "(レベルコードは" + A_cell[8] + ")";

		if (9 != A_cell.length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "のセルの個数が9個ではありません。" + common);
			this.setFail();
			return true;
		}

		if (!A_cell[1].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の会社コードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var pactcode = "C" + A_cell[1];
		// 2022cvt_015
		var A_pactid = Array();
		// 2022cvt_015
		var is_first = { "value": false };

		if (!this.convertPact(pactcode, A_pactid, is_first)) {
			if (is_first.value) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の会社コード" + "が設定ファイル中にありません。" + common);
				this.setFail();
			}

			return true;
		}

		if (!A_cell[0].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の職制コードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var userpostid = A_cell[0];

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //職制コードは6桁である
		{
			if (6 != userpostid.length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の職制コードが6桁ではありません。" + common);
				this.setFail();
				return true;
			}
		} else //職制コードは4桁である
		{
			if (4 != userpostid.length) {
				this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の職制コードが4桁ではありません。" + common);
				this.setFail();
				return true;
			}

			if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode) {
				userpostid = "00" + userpostid;
			}
		}

		if (!A_cell[3].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の職制順コードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var keycode = "P" + A_cell[3];

		if (!A_cell[4].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "の職制漢字略名称ありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var postname = A_cell[4];

		if (!A_cell[8].length) {
			this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制マスタファイルの" + (lineno + 1) + "行目" + "のレベルコードがありません。" + common);
			this.setFail();
			return true;
		}

		// 2022cvt_015
		var levelcode = A_cell[8];

		// 2022cvt_015
		for (var pactid of A_pactid) //職制順コードが無視する値ならスキップする
		{
			if (-1 !== this.m_A_ignore.indexOf(keycode)) {
				continue;
			}
			if (undefined !== this.m_H_ignore[pactid] && -1 !== this.m_H_ignore[pactid].indexOf(keycode)) {
				continue;
			}
			if (!(undefined !== this.m_H_master[pactid])) {
				this.m_H_master[pactid] = Array();
			}
			if (undefined !== this.m_H_master[pactid][keycode]) {
				return true;
			}
			this.m_H_master[pactid][keycode] = {
				userpostid: userpostid,
				postname: postname,
				level_in: levelcode,
				level_out: 9999,
				parent: ""
			};
		}

		return true;
	}

	endFile() //KCSモーションの顧客IDに対してループする
	//共通のエラー処理を行う
	{
		{
			let _tmp_5 = this.m_H_master;

			// 2022cvt_015
			for (var pactid in _tmp_5) //全部署に対してループし、親部署を設定する
			//中間ファイル用のレベルを設定する
			{
				// 2022cvt_015
				var H_master = _tmp_5[pactid];

				// 2022cvt_015
				for (var keycode in H_master) //自部署のレベルを取り出す
				//レベル毎の文字数マスタ(降順)に対してループする
				{
					// 2022cvt_015
					var H_param = H_master[keycode];
					// 2022cvt_015
					var level = H_param.level_in;
					// 2022cvt_015
					var parent = keycode;
					{
						let _tmp_3 = this.m_H_length;
						var keys = Object.keys(_tmp_3);
						keys.sort((a, b) => { return (a < b) ? -1 : 1 });

						// 2022cvt_015
						for (var length_key in keys) //自部署の職制順コードと同じならスキップする
						{
							// 2022cvt_015
							var length_value = _tmp_3[length_key];
							if (level <= length_key) {
								continue;
							}

							// 2022cvt_015
							var p_list = parent.split('');
							for (var cnt = length_value + 1; cnt < parent.length; ++cnt) //指定文字数より右側をゼロで埋める
							{
								p_list[cnt] = "0";
							}
							var parent = p_list.join('');

							if (parent === keycode) {
								continue;
							}

							if (undefined !== H_master[parent]) //親が見つかった
							{
								this.m_H_master[pactid][keycode].parent = parent;
								break;
							}
						}
					}
				}

				// 2022cvt_015
				var H_parent = [""];

				// 2022cvt_015
				for (var cur_level = 1; cur_level < 128; ++cur_level) //配下の部署が無くなったら処理を打ち切る
				{
					// 2022cvt_015
					var H_child = Array();
					{
						let _tmp_4 = this.m_H_master[pactid];

						// 2022cvt_015
						for (var keycode in _tmp_4) {
							// 2022cvt_015
							var H_param = _tmp_4[keycode];

							if (-1 !== H_parent.indexOf(H_param.parent)) {
								H_child.push(keycode);
								this.m_H_master[pactid][keycode].level_out = cur_level;
							}
						}
					}
					H_parent = H_child;
					if (!H_parent.length) {
						break;
					}
				}

				if (H_parent.length) {
					// 2022cvt_015
					var msg = "職制マスタファイルの階層が深すぎます";
					msg += "(KCSモーションの顧客IDは" + pactid + ")";
					this.putError(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
					this.setFail();
				}
			}
		}
		if (!this.errorCheck("職制マスタファイル")) {
			this.setFail();
		};
		return true;
	}

};

//デバッグモード
//0	そのまま送信
//1	送信せず、送信内容を画面に表示
//2	送信先をデバッグ用に切り替えて送信
//デバッグ用の送信先
//ログ出力先
//機能：コンストラクタ
//引数：ログ出力先
//デバッグモード
//デバッグ用アドレス(空文字列ならG_MAIL_TO)
//機能：メールを送信する
//引数：ハンドラに蓄積されたバッファ
//送信パラメータ
//array(pactid => compname)
//サブジェクトの更新パラメータ
//返値：失敗したらfalseを返す
//備考：送信パラメータは以下の形式
//array(
//array(
// 2022cvt_016
//"type" => 種別のマスク,
//"from" => 送信元のアドレス(省略したらG_MAIL_FROM),
//"to" => array(送信先のアドレス),
//"bcc" => array(Bccのアドレス),
//"subject" => メールのサブジェクト,
//),
//...
//);
//サブジェクトの更新パラメータは以下の形式
//array(
//探す文字列 => 置き換える文字列
//...
//);
//機能：メッセージを標準出力に表示する
//引数：送信する本文
//返値：失敗したらfalseを返す
//機能：メール送信を行う
//引数：送信する本文
//array(To:)
//array(Bcc:)
//サブジェクト
//fromアドレス
//返値：失敗したらfalseを返す
//機能：送信するメッセージを取り出す
//引数：ハンドラに蓄積されたバッファ
//種別のマスク,
//機能：送信するメッセージの顧客IDを本文に追加する
//引数：送信する内容
//array(pactid => compname)
//機能：メッセージの末尾に顧客名を追加して返す
//機能：顧客IDから顧客名を返す
//引数：顧客ID
//array(pactid => compname)
class FJPMailSenderType {
	m_O_log: ScriptLogBase;
	m_debug_mode: string;
	m_debug_addr: string;

	constructor(O_log: ScriptLogBase, debug_mode: string, debug_addr = "") {
		this.m_O_log = O_log;
		this.m_debug_mode = debug_mode;
		this.m_debug_addr = debug_addr;
		if (!this.m_debug_addr.length) this.m_debug_addr = G_MAIL_TO;
	}

	send(A_buffer: Array<any>, A_param: Array<any>, H_pact: {} | any[], H_sub: { [x: string]: any; "%1"?: string; "%2"?: string; }) {
		// 2022cvt_015
		var rval = true;

		// 2022cvt_015
		for (var H_param of A_param) //デバッグモードが画面ダンプなら、表示して終わる
		//デバッグモードが送信先切り替えなら、切り替える
		{
			// 2022cvt_016
			// 2022cvt_015
			var label_type = "宛先不明";
			// 2022cvt_016
			if (FJP_MAIL_MOTION == H_param.type) {
				label_type = "バッチエラー宛";
			} else if (FJP_MAIL_KCS == H_param.type) {
				label_type = "KCS管理者宛";
			} else if (FJP_MAIL_FJP == H_param.type) {
				label_type = "FJP管理者宛";
			}
			// 2022cvt_016
			// 2022cvt_015
			var A_msg = this.selectBuffer(A_buffer, H_param.type);
			if (!A_msg.length) {
				continue;
			};

			if (!this.addCompName(A_msg, H_pact)) {
				rval = false;
				continue;
			}

			// 2022cvt_015
			var subject = H_param.subject;

			// 2022cvt_015
			for (var from in H_sub) {
				// 2022cvt_015
				var to = H_sub[from];
				// 2022cvt_020
				subject = subject.replace(from, to);
				// subject = str_replace(from, to, subject);
			}

			if (FJP_MAIL_SEND_DUMP.toString() == this.m_debug_mode) {
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: ""
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "Bcc:" + H_param.bcc.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					// 2022cvt_016
					msg: "メールレベル:" + label_type
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "送信先:" + H_param.to.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "サブジェクト:" + subject
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "デバッグモードだったのでメール送信せず"
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "-----------------------------------------"
				});
				if (!this.dump(A_msg)) rval = false;
				continue;
			}

			// 2022cvt_015
			var from = G_MAIL_FROM;
			if (undefined !== H_param.from && H_param.from.length) {
				from = H_param.from;
			}
			// 2022cvt_015
			var A_to = H_param.to;
			// 2022cvt_015
			var A_bcc = H_param.bcc;
			subject = subject;

			if (FJP_MAIL_SEND_DEBUG.toString() == this.m_debug_mode) {
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: ""
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "Bcc:" + A_bcc.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					// 2022cvt_016
					msg: "メールレベル:" + label_type
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "本来の送信先:" + A_to.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					// 2022cvt_016
					type: 0,
					msg: "デバッグモードだったので送信先切り替え"
				});
				A_to = [this.m_debug_addr];
				A_bcc = Array();
				subject += "(デバッグモード)";
			}

			if (!this.exec(A_msg, A_to, A_bcc, subject, from)) {
				rval = false;
			}
		}

		return rval;
	}

	dump(A_msg: {} | any[]) {
		// 2022cvt_015
		// 		for (var H_msg of Object.values(A_msg)) echo(H_msg.msg + "\n");// 2022cvt_010

		return true;
	}

	async exec(A_msg: Array<any>, A_to: Array<any>, A_bcc: Array<any>, subject: string | undefined, from: string | undefined) {
		// 2022cvt_015
		var rval = true;

		// 2022cvt_015
		for (var to of A_to) {
			// 2022cvt_015
			var O_mail = new MailUtil();
			// Mail.factory("smtp", {
			// 	host: G_SMTP_HOST,
			// 	port: G_SMTP_PORT
			// });
			// 2022cvt_015
			var msg = "";

			// 2022cvt_015
			for (var H_msg of A_msg) {
				msg += H_msg.msg + "\n";
			}

			msg = Encoding.convert(msg, "JIS", "UTF8");
			// msg = mb_convert_encoding(msg, "JIS", "UTF-8");
			// 2022cvt_015
			// var H_headers: { [key: string]: any } = {
			// 	Date: date("r"),
			// 	To: to,
			// 	From: from,
			// 	"Return-Path": from,
			// 	"MIME-Version": "1.0",
			// 	Subject: mb_encode_mimeheader(subject, "ISO-2022-JP-MS"),
			// 	"Content-Type": "text/plain; charset=\"ISO-2022-JP\"",
			// 	"Content-Transfer-Encoding": "7bit",
			// 	"X-Mailer": "Motion Mailer v2"
			// };
			// if (A_bcc.length) {
			// 	H_headers.Bcc = A_bcc.join(",")
			// };
			// 2022cvt_015
			var A_send_to = [to];

			// 2022cvt_015
			for (var bcc of A_bcc) {
				A_send_to.push(bcc);
			};

			// 2022cvt_015
			var param = "";
			param += "/行数:" + A_msg.length;
			param += "/バイト数:" + msg.length;
			param += "/to:" + to;
			param += "/bcc:" + A_bcc.join(",");
			param += "/from:" + from;

			try {
				var status = await O_mail.multiSend(A_send_to, msg, from, subject)
				this.m_O_log.put(G_SCRIPT_DEBUG, "メール送信成功" + param);
				rval = true;
			} catch (err) {
				rval = false;
				this.m_O_log.put(G_SCRIPT_WARNING, "メール送信失敗" + param);
			}
			// var status = await O_mail.send(A_send_to, H_headers, msg);
			// 2022cvt_015
		}

		return rval;
	}

	// 2022cvt_016
	selectBuffer(A_buffer: Array<any>, type: number) {
		// 2022cvt_015
		var A_msg = Array();

		// 2022cvt_016
		// 2022cvt_015
		for (var H_buffer of A_buffer) {
			if (type & H_buffer.type) A_msg.push(H_buffer);
		};

		return A_msg;
	}

	addCompName(A_msg: Array<any>, H_pact: {} | any[]) {
		// 2022cvt_015
		for (var cnt = 0; cnt < A_msg.length; ++cnt) {
			// 2022cvt_015
			var pactid = A_msg[cnt].pactid;
			// 2022cvt_015
			var compname = this.getCompName(pactid, H_pact);
			A_msg[cnt].msg = this.addCompNameLine(A_msg[cnt].msg, compname);
		}

		return true;
	}

	addCompNameLine(msg: string, compname: string) //末尾が改行なら改行文字を削除する
	{
		// 2022cvt_015
		var A_lf = ["\r\n", "\n", "\r"];

		while (true) {
			// 2022cvt_015
			var len = msg.length;
			if (!len) {
				break;
			}

			// 2022cvt_015
			for (var cnt = 0; cnt < A_lf.length; ++cnt) {
				// 2022cvt_015
				var lf = A_lf[cnt];

				if (lf === msg.substring(len - lf.length, lf.length)) {
					msg = msg.substring(0, len - lf.length);
					break;
				}
			}

			if (A_lf.length == cnt) {
				break;
			}
		}

		return msg + compname;
	}

	getCompName(pactid: string, H_pact: {} | any[]) {
		if (!pactid) {
			return "";
		}
		if (!(undefined !== H_pact[pactid])) {
			return "(会社IDは" + pactid + ")";
		}
		return "(会社IDは" + pactid + ":会社名は" + H_pact[pactid] + ")";
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//DB型
//機能：テーブルに挿入する値を追加する
//引数：DBに挿入する値を格納したハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：型名を与えて、クォートで囲む必要があればtrueを返す
class TableInserterSlowSafe extends TableInserterSlow {

	constructor(listener: ScriptLogBase, db: ScriptDB) {
		super(listener, db);
	}

	async insert(H_line: { [x: string]: any; }) {
		{
			let _tmp_6 = this.m_A_const;

			// 2022cvt_015
			for (var key in _tmp_6) {
				// 2022cvt_015
				var value = _tmp_6[key];
				if (!(key in H_line)) {
					H_line[key] = value;
				}
			}
		}
		// 2022cvt_015
		var sql = "insert into " + this.m_table_name;
		sql += "(";
		// 2022cvt_015
		var comma = false;

		// 2022cvt_015
		for (var col of this.m_A_col) {
			if (comma) {
				sql += ",";
			}
			comma = true;
			sql += col[0];
		}

		sql += ")values(";
		comma = false;

		// 2022cvt_015
		for (var col of this.m_A_col) {
			if (comma) {
				sql += ",";
			}
			comma = true;
			// 2022cvt_015
			var colname = col[0];

			if (undefined !== H_line[colname]) {
				if (this.is_quote(col[1])) {
					sql += "'";
				}
				// 2022cvt_015
				var var_0 = this.m_db.escape(H_line[colname]);

				// 2022cvt_022
				// 2022cvt_015
				if (0 == "now()".localeCompare(var_0)) {
					// if (0 == strcmp("now()", var)) {
					// 2022cvt_015
					var_0 = this.getTimestamp();
				}

				// 2022cvt_015
				sql += var_0;
				if (this.is_quote(col[1])) {
					sql += "'";
				};
			} else {
				sql += "null";
			};
		}

		sql += ")";
		if (this.m_is_no_insert_lock) {
			sql = PGPOOL_NO_INSERT_LOCK + sql;
		}
		this.putError(G_SCRIPT_SQL, sql);
		// 2022cvt_015
		var result = await this.m_db.query(sql, false);
		if (this.m_db.isError()) {
			return false;
		}
		return true;
	}

	is_quote(name: string) {
		if (0 === name.localeCompare("int")) {
			return false;
		}
		if (0 === name.localeCompare("bool")) {
			return false;
		}

		switch (name.toLowerCase()) {
			case "integer":
			case "boolean":
			case "double":
			case "float":
			case "int":
				return false;

			default:
				return true;
		}
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//DB型
//ファイル名
//最初にファイルを削除するならtrue
//出力毎にファイルを開き直さないならtrue
//機能：テーブルに値を挿入する
//返値：深刻なエラーが発生したらfalseを返す
class TableInserterSafe extends TableInserter {

	constructor(listener: ScriptLogBase, db: ScriptDB, fname: string, erase: boolean, static_0 = true) {
		// super(listener, db, fname, erase, static_0);
		super(listener, db, fname, erase);
	}

	end() {
		if (this.m_fp) {
			// fclose(this.m_fp);
			this.m_fp = undefined;
		}

		if (this.m_debug) {
			this.putError(G_SCRIPT_INFO, "DB挿入実行せず(" + this.m_filename + "/" + this.m_table_name + ")");
			return true;
		}

		// 2022cvt_015
		var A_buffer = Array();
		// 2022cvt_015
		var buffer;
		try {
			buffer = fs.readFileSync(this.m_filename, "utf8");
		} catch (e) {
			this.putError(
				G_SCRIPT_DEBUG, "ファイル読み出しオープン失敗(" + this.m_filename + "/" + this.m_table_name + ")");
			return false;
		}
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE',
			type: 'string'
		});
		var lines = text.toString().split("\r\n");
		// var fp = fopen(this.m_filename, "rt");

		// 2022cvt_015
		var cnt = 0;
		for (var line in lines) {
		// for (var cnt = 0; !feof(fp); ++cnt, ++cnt) {
			// 2022cvt_015
			// var line = fgets(fp, 64 * 1024);
			// if (0 == line.length) continue;
			// A_buffer.push(line);

			cnt++;
			if (this.m_interval <= A_buffer.length) {
				if (false === pg_copy_from(this.m_db.m_db, this.m_table_name, A_buffer)) {
					this.putError(G_SCRIPT_DEBUG, `pg_copy_from失敗 ${cnt} ` + this.m_table_name);
					return false;
				}

				A_buffer = Array();
			}
		}

		if (A_buffer.length) {
			if (false === pg_copy_from(this.m_db.m_db, this.m_table_name, A_buffer)) {
				this.putError(G_SCRIPT_DEBUG, `pg_copy_from失敗(2) ${cnt} ` + this.m_table_name);
				return false;
			}
		}

		// fclose(fp);
		// fp = undefined;
		return true;
	}

};

export const FJP_WAYTYPE_CUR = 0;
export const FJP_WAYTYPE_CUR_NEW = 1;

export class FJPModelType {
	m_O_log: ScriptLogBase;
	m_O_db: ScriptDB;
	m_O_table_no: TableNo;
	m_O_handler: FJPErrorHandlerBaseType;
	m_column_id: string;
	m_column_name: string;
	m_column_date: string;

	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, O_handler: FJPErrorHandlerBaseType) {
		this.m_O_log = O_log;
		this.m_O_db = O_db;
		this.m_O_table_no = O_table_no;
		this.m_O_handler = O_handler;
		this.m_column_id = "text5";
		this.m_column_name = "text6";
		this.m_column_date = "date1";
	}

	setLogIns(O_log: ScriptLogBase) {
		this.m_O_log = O_log;
	}

	setColumn(id: string, name: string) {
		this.m_column_id = id;
		this.m_column_name = name;
	}

	querySafe(sql: string) {
		// 2022cvt_015
		var result = this.m_O_db.query(sql, false);
		if (!this.m_O_db.isError()) return "";
		// 2022cvt_015
		var errmsg = "unknown_db_query_error:" + sql;

		// if (Array.isArray(result)) {// 2022cvt_001
		// 	errmsg = result.userinfo;
		// }

		// 2022cvt_020
		errmsg = errmsg.replace("\n", "\\n");
		// errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.m_O_log.put(G_SCRIPT_DEBUG, "querySafe:失敗:" + errmsg);
		return errmsg;
	}

	querySafeLog(sql: string, is_log_only = false) {
		// 2022cvt_015
		var result = this.querySafe(sql);
		if (!result.length) {
			return true;
		}

		if (!is_log_only) {
			this.m_O_handler.put(FJP_MAIL_MOTION.toString(), FJP_MAIL_ALL, "querySafe:失敗:" + result);
		}

		return false;
	}

	async getOneSafeLog(sql: string): Promise<any> {
		// 2022cvt_015
		var result = await this.m_O_db.getOne(sql, false);
		if (!this.m_O_db.isError()) {
			return result;
		};
		// 2022cvt_015
		var errmsg = "getOne:失敗:" + sql;
		// if (Array.isArray(result, "db_error")) {
		// 	errmsg = result.userinfo;// 2022cvt_001
		// }
		// 2022cvt_020
		errmsg = errmsg.replace("\n", "\\n");
		// errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getOne:失敗:" + errmsg);
		return null;
	}

	async getHashSafeLog(sql: string): Promise<any[]> {
		// 2022cvt_015
		var result = await this.m_O_db.getHash(sql, false);
		if (!this.m_O_db.isError()) {
			return result;
		}
		// 2022cvt_015
		var errmsg = "getHash:失敗:" + sql;
		// if (Array.isArray(result, "db_error")) {
		// 	errmsg = result.userinfo;// 2022cvt_001
		// }
		// 2022cvt_020
		errmsg = errmsg.replace("\n", "\\n");
		// errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getHash:失敗:" + errmsg);
		return Array();
	}

	async getAllSafeLog(sql: string): Promise<any[]> {
		// 2022cvt_015
		var result = await this.m_O_db.getAll(sql, false);
		if (!this.m_O_db.isError()) return result;
		// 2022cvt_015
		var errmsg = "getAll:失敗:" + sql;
		// if (Array.isArray(result, "db_error")) {
		// 	errmsg = result.userinfo;// 2022cvt_001
		// }
		// 2022cvt_020
		errmsg = errmsg.replace("\n", "\\n");
		// errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getAll:失敗:" + errmsg);
		return Array();
	}

	putDebug(errmsg: string, pactid = FJP_MAIL_ALL) {
		this.m_O_log.put(G_SCRIPT_DEBUG, errmsg);
		this.m_O_handler.put(FJP_MAIL_MOTION.toString(), pactid, errmsg);
	}

	// 2022cvt_016
	putLog(type: number, msg: string) {
		// 2022cvt_016
		this.m_O_log.put(type, msg);
	}

	putMail(way: string, pactid: number, errmsg: string) {
		this.m_O_handler.put(way, pactid, errmsg);
	}

	beginAll() {
		this.m_O_log.put(G_SCRIPT_DEBUG, "トランザクション開始");
		this.m_O_db.begin();
	}

	endAll(is_commit: any) {
		if (is_commit) {
			this.m_O_db.commit();
			this.m_O_log.put(G_SCRIPT_DEBUG, "トランザクション反映");
		} else {
			this.m_O_db.rollback();
			this.m_O_log.put(G_SCRIPT_DEBUG, "トランザクション破棄");
		}
	}

	begin(name = FJP_SAVEPOINT_NAME) {
		this.m_O_db.query("savepoint " + name + ";");
	}

	end(is_commit: boolean, name = FJP_SAVEPOINT_NAME) {
		if (is_commit) {
			this.m_O_db.query("release savepoint " + name + ";");
		} else {
			this.m_O_db.query("rollback to savepoint " + name + ";");
		}
	}

	// 2022cvt_015
	escape(var_0: string) {
		// 2022cvt_015
		return this.m_O_db.escape(var_0);
	}

	getTableNo(year: number, month: number) {
		return this.m_O_table_no.get(year, month);
	}

	getCurrent(is_timezone = false) {
		// 2022cvt_015
		var cur = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace('-', '/') + (is_timezone ? "+09" : "");
		cur = this.escape(cur);
		return "'" + cur + "'";
	}

	getCurrentWithoutTime(is_timezone = false) {
		// 2022cvt_015
		var cur = new Date().toJSON().slice(0, 10).replace(/-/g, '-').replace("-", "/") + " 00:00:00" + (is_timezone ? "+09" : "");
		cur = this.escape(cur);
		return "'" + cur + "'";
	}

	// 2022cvt_016
	getTableName(name: string, table_no: string | { [key: string]: any }, table_type = 1) {
		if (table_no !== null && typeof table_no === 'object') {
			// 2022cvt_016
			if (1 == table_type && undefined !== table_no['table_no']) {
				table_no = table_no['table_no'];
			} else {
				table_no = "";
			}
		}

		// 2022cvt_020
		if (!table_no.length) {
			return name.replace("%", "tb");
			// return str_replace("%", "tb", name);
		} else {
			return name.replace("%", table_no + "_tb");
			// return str_replace("%", table_no + "_tb", name);
		}
	}

	getSQLWhere(H_param: {} | any[], A_string: Array<any>, table_name = "") {
		// 2022cvt_015
		var sql = " ";

		// 2022cvt_015
		for (var key in H_param) {
			// 2022cvt_015
			var value = H_param[key];
			sql += " and ";
			if (table_name.length) {
				sql += table_name + ".";
			}
			sql += key + "=";
			if (-1 !== A_string.indexOf(key)) {
				sql += "'";
			}
			sql += this.escape(value);
			if (-1 !== A_string.indexOf(key)) sql += "'";
		}

		sql += " ";
		return sql;
	}

	getSQLOn(left: string, right: string, A_column: Array<any>) {
		// 2022cvt_015
		var sql = " ";

		// 2022cvt_015
		for (var cnt = 0; cnt < A_column.length; ++cnt) {
			// 2022cvt_015
			var column = A_column[cnt];
			sql += cnt ? "and " : "on ";
			sql += left + "." + column + "=" + right + "." + column + " ";
		}

		return sql;
	}

	getSQLBooleanToInt(name: string) {
		return "case when " + name + " then 1 else 0 end";
	}

	// 2022cvt_016
	executePact(H_master_pact: {} | any[], waytype: any, table_no: any, H_setting_all: {} | any[], pactid: number, H_setting_pact: { [key: string]: any }, logdir: string, is_fast: boolean) //現在のDBの内容を読み出す-------------------------------------------
	//トランザクション開始
	//予約情報を破棄する-------------------------------------------------
	//トランザクション開始
	//追加・変更済の部署情報を取得する-----------------------------------
	//トランザクション開始
	//追加済の部署が存在するか確認する
	//ユーザの追加と権限変更を行う---------------------------------------
	//人事マスタのユーザに対してループする
	//バッファのユーザ情報をDBに書き込む
	//トランザクション開始
	//ユーザの情報変更と部署移動を行う-----------------------------------
	//人事マスタのユーザに対してループする
	//ユーザ削除を行う---------------------------------------------------
	//DBのユーザに対してループする
	//端末と電話へのユーザ情報の反映を行う-------------------------------
	//電話と端末へ、ユーザ情報を設定する
	//トランザクション開始
	//電話と端末へ、ユーザ情報を設定する
	//かつては削除ユーザの電話と端末への一括設定だった
	//トランザクション開始
	{
		// 2022cvt_015
		var H_err = Array();
		// 2022cvt_015
		var return_var = true;
		// 2022cvt_015
		var msg_pact = "顧客IDは" + pactid;
		// 2022cvt_015
		var A_msg_param = [msg_pact];
		// 2022cvt_015
		var cmd = "DBからの情報取得";
		this.begin();
		// 2022cvt_015
		var H_tgtpact: { [key: string]: any } = {};

		// 2022cvt_016
		if (!this.getTgtPact(H_tgtpact, pactid, waytype, table_no, H_setting_pact.postcode_unknown, H_setting_pact.fncid_admin, logdir, is_fast, H_err)) //トランザクション破棄
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			return false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		A_msg_param = [msg_pact];
		cmd = "予約情報の破棄";
		this.begin();

		if (!this.deleteReserve(H_tgtpact, H_err)) //トランザクション破棄
		//処理は続ける
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			// 2022cvt_015
			return_var = false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		cmd = "追加・更新後の部署情報の取得";
		A_msg_param = [msg_pact];
		this.begin();
		// 2022cvt_015
		var A_userpostid2postid = Array();

		if (!this.getUserPost(H_tgtpact, A_userpostid2postid, H_err)) //トランザクション破棄
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			return false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		// 2022cvt_015
		for (var usercode in H_master_pact) {
			// 2022cvt_015
			var H_master_user = H_master_pact[usercode];
			// 2022cvt_015
			var A_postid = Array();
			// 2022cvt_015
			var H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //現在か過去最新月に存在しない部署がある
			//メッセージを残す
			//職制を不明部署とする(先頭に"P"が付かない)
			{
				// 2022cvt_015
				var msg = "";

				// 2022cvt_016
				// 2022cvt_015
				for (var type in H_is_in) {
					// 2022cvt_016
					// 2022cvt_015
					var is_in = H_is_in[type];
					if (is_in) {
						continue;
					}
					if (msg.length) {
						msg += "と";
					}
					// 2022cvt_016
					msg += type ? "過去最新月" : "現在";
				}

				msg = "人事マスタの従業員番号" + usercode.substring(1) + "の職制コード" + H_master_user.userpostid + "が職制マスタに存在せず、" + msg + "の部署テーブルにも存在しなかったので、" + "不明部署" + H_setting_pact.postcode_unknown + "の所属としました(" + msg_pact + ")";
				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				H_master_pact[usercode].userpostid = H_setting_pact.postcode_unknown;
			}
		}

		// 2022cvt_015
		var H_usercode_userid = Array();

		// 2022cvt_015
		for (var usercode in H_master_pact) //トランザクション開始
		//部署IDを取り出す
		//ユーザが存在するか？
		//トランザクション反映
		{
			// 2022cvt_015
			var H_master_user = H_master_pact[usercode];
			// 2022cvt_015
			var msg_user = "(従業員番号は" + usercode.substring(1) + ")";
			this.begin();
			cmd = "追加済の部署情報の参照(追加)";
			A_msg_param = [msg_pact, msg_user, "(職制コードは" + H_master_user.userpostid + ")"];
			A_postid = Array();
			H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //トランザクション破棄
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				// 2022cvt_015
				return_var = false;
				continue;
			} else {
				this.executePactLog("ok_skip", pactid, cmd, H_err, A_msg_param);
			}

			if (!(undefined !== H_tgtpact.user[usercode])) //ユーザが存在しないので追加する
			{
				// 2022cvt_015
				var userid = { "value": "" };
				cmd = "ユーザの追加";
				A_msg_param = [msg_pact, msg_user];
				// 2022cvt_015
				var A_id = H_master_user.is_admin ? H_setting_pact.A_fncid_admin : H_setting_pact.A_fncid_user;

				if (!this.addUser(H_tgtpact, userid, H_master_user, A_postid[0], A_id, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					// 2022cvt_015
					return_var = false;
					continue;
				} else {
					this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
				}

				H_usercode_userid[usercode] = userid.value;
			} else //ユーザは存在する
			//権限が食い違えば権限変更を行う
			{
				// 2022cvt_015
				var H_db_user = H_tgtpact.user[usercode];

				if (this.isChangeAdmin(H_tgtpact, H_master_user)) {
					cmd = "ユーザの権限変更";
					A_msg_param = [msg_pact, msg_user];
					A_id = H_master_user.is_admin ? H_setting_pact.A_fncid_admin : H_setting_pact.A_fncid_user;

					if (!this.changeAdmin(H_tgtpact, H_master_user, A_id, H_err)) //トランザクション破棄
					{
						this.end(false);
						this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
						// 2022cvt_015
						return_var = false;
						continue;
					} else {
						this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
					}
				}
			}

			this.end(true);
		}

		A_msg_param = [msg_pact];
		cmd = "バッファ上のユーザ・権限のDB反映";
		this.begin();

		if (!this.endInserterUser(H_tgtpact)) //トランザクション破棄
		//処理は続ける
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			// 2022cvt_015
			return_var = false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		// 2022cvt_015
		for (var usercode in H_master_pact) //トランザクション開始
		//部署IDを取り出す
		//ユーザが元から存在するか？
		//ユーザ情報が食い違えば情報変更を行う
		//トランザクション反映
		{
			// 2022cvt_015
			var H_master_user = H_master_pact[usercode];
			msg_user = "(従業員番号は" + usercode.substring(1) + ")";
			this.begin();
			cmd = "追加済の部署情報の参照(移動)";
			A_msg_param = [msg_pact, msg_user, "(職制コードは" + H_master_user.userpostid + ")"];
			A_postid = Array();
			H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //トランザクション破棄
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				// 2022cvt_015
				return_var = false;
				continue;
			} else {
				this.executePactLog("ok_skip", pactid, cmd, H_err, A_msg_param);
			}

			// 2022cvt_015
			var is_ready_user = true;
			var userid_2 = "";

			if (!(undefined !== H_tgtpact.user[usercode])) //新規追加した
			{
				is_ready_user = false;
				userid_2 = H_usercode_userid[usercode];
			} else //元から存在した
			{
				H_db_user = H_tgtpact.user[usercode];
				userid_2 = H_db_user.userid;
			}

			// 2022cvt_015
			var H_change = Array();

			if (this.isChangeUser(H_tgtpact, H_master_user, usercode, is_ready_user, userid_2, H_change)) {
				cmd = "ユーザの設定変更";
				A_msg_param = [msg_pact, msg_user];

				if (!this.changeUser(H_tgtpact, H_master_user, is_ready_user, userid_2, H_change, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					// 2022cvt_015
					return_var = false;
					continue;
				} else {
					this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
				}
			}

			H_change = Array();

			if (this.isMoveUser(H_tgtpact, H_master_user, usercode, is_ready_user, H_change)) {
				cmd = "ユーザの部署移動";
				A_msg_param = [msg_pact, msg_user];

				if (!this.moveUser(H_tgtpact, H_master_user, A_postid, is_ready_user, H_change, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					// 2022cvt_015
					return_var = false;
					continue;
				} else {
					this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
				}
			}

			cmd = "電話の給与負担元コード・名称の更新";

			if (!this.changeUserSalary(H_tgtpact, H_master_user, H_err)) //トランザクション破棄
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				// 2022cvt_015
				return_var = false;
				continue;
			} else {
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

			this.end(true);
		}

		cmd = "ユーザの削除";
		// 2022cvt_016
		// 2022cvt_015
		var table_type = 0;
		{
			let _tmp_7 = H_tgtpact.user;

			// 2022cvt_015
			for (var usercode in _tmp_7) //削除不能ユーザならスキップする
			{
				// 2022cvt_015
				var H_db_user = _tmp_7[usercode];
				msg_user = "(従業員番号は" + usercode.substring(1) + ")";
				A_msg_param = [msg_pact, msg_user];

				if (H_db_user.is_admin || -1 !== H_tgtpact.user_fix.indexOf(usercode)) {
					this.executePactLog("skip", pactid, cmd, H_err, A_msg_param);
					continue;
				}

				if (undefined !== H_db_user.userpostid) {
					// 2022cvt_015
					var postcode = "P" + H_db_user.userpostid;

					// 2022cvt_022
					// 2022cvt_016
					if (-1 !== H_setting_pact.A_postcode_protected.indexOf(postcode) || !postcode.localeCompare("P" + H_setting_pact.postcode_unknown) || undefined !== H_tgtpact["top_userpostid" + table_type] && !postcode.localeCompare("P" + H_tgtpact["top_userpostid" + table_type])) {
						this.executePactLog("skip", pactid, cmd, H_err, A_msg_param);
						continue;
					}
					// if (-1 !== H_setting_pact.A_postcode_protected.indexOf(postcode) || !strcmp(postcode, "P" + H_setting_pact.postcode_unknown) || undefined !== H_tgtpact["top_userpostid" + table_type] && !strcmp(postcode, "P" + H_tgtpact["top_userpostid" + table_type])) {
					// 	this.executePactLog("skip", pactid, cmd, H_err, A_msg_param);
					// 	continue;
					// }
				}

				if (!(undefined !== H_master_pact[usercode])) //トランザクション開始
				//人事マスタに存在しないので削除する
				{
					this.begin();
					// 2022cvt_015
					var is_fix_person = { "value": false };
					// 2022cvt_015
					var is_fix_post = { "value": false };
					// 2022cvt_015
					var is_fix_own = { "value": false };

					if (!this.deleteUser(H_tgtpact, H_db_user, is_fix_person, is_fix_post, is_fix_own, H_err)) //トランザクション破棄
					{
						this.end(false);
						this.executePactLog("fail_msg", pactid, cmd, H_err, A_msg_param);
						// 2022cvt_015
						return_var = false;
						continue;
					} else //トランザクション反映
					{
						this.end(true);
						// 2022cvt_016
						// 2022cvt_015
						var type = "ok";
						// 2022cvt_016
						if (is_fix_person) type = "fix_order_person";
						// 2022cvt_016
						if (is_fix_post) type = "fix_order_post";
						// 2022cvt_016
						if (is_fix_own) type = "fix_order_own";
						// 2022cvt_016
						this.executePactLog(type, pactid, cmd, H_err, A_msg_param);
					}
				}
			}
		}
		cmd = "電話と端末へのユーザ情報の設定";
		A_msg_param = [msg_pact];
		this.begin();

		if (!this.changeUserMoveUserTelAssets(H_tgtpact, H_err)) //トランザクション破棄
		//処理は続ける
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			// 2022cvt_015
			return_var = false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		cmd = "電話と端末への一括設定";
		this.begin();

		if (!this.deleteUserTelAssets(H_tgtpact, H_err, H_setting_pact.is_unknown_tel)) //トランザクション破棄
		//処理は続ける
		{
			this.end(false);
			this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
			// 2022cvt_015
			return_var = false;
		} else //トランザクション反映
		{
			this.end(true);
			this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
		}

		// 2022cvt_015
		return return_var;
	}

	executePactLog(status: string, pactid: number, cmd: string, H_err: { [key: string]: any }, A_msg_param: Array<any>) {
		// 2022cvt_015
		var msg = cmd;
		// 2022cvt_015
		var param = "";
		param = A_msg_param.join("");

		switch (status) {
			case "ok_skip":
				break;

			case "ok":
				msg += "に成功しました";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			case "fail":
			case "fail_msg":
				msg += "に失敗しました";
				// 2022cvt_022
				if (!"fail".localeCompare(status)) {
					msg = FJP_ERRMSG_COMMON + "(" + msg + ")";
				}
				if (undefined !== H_err.errmsg && H_err.errmsg.length) {
					msg += "(" + H_err.errmsg + ")";
				}
				if (undefined !== H_err.errparam && H_err.errparam.length) {
					msg += "(" + H_err.errparam + ")";
				}
				msg += param;
				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			case "skip":
				msg += "の必要が無かったのでスキップしました";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			case "fix_order_person":
				msg += "は、注文の個人承認者であったので" + "ユーザを削除しませんでした";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			case "fix_order_post":
				msg += "は、承認部署の最後の承認権限保有者だったので" + "ユーザを削除しませんでした";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			case "fix_order_own":
				msg += "は、承認待ちのある注文者だったので" + "ユーザを削除しませんでした";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactidは" + pactid + ")");
				break;

			default:
				this.putMail(FJP_MAIL_MOTION.toString(), pactid, "executePactLog::不明なstatus:" + status + "/" + cmd + param);
				break;
		}

		H_err = Array();
	}

	getSeqStatusIndex() {
		// 2022cvt_015
		var sql = "select nextval('fjp_hrm_status_index_tb_seq');";
		return this.getOneSafeLog(sql);
	}

	getSeqUserID() {
		// 2022cvt_015
		var sql = "select nextval('user_tb_userid_seq');";
		return this.getOneSafeLog(sql);
	}

	// 2022cvt_016
	getTgtPact(H_tgtpact: {} | any[], pactid: number, waytype: any, table_no: any, postcode_unknown: string, fncid_admin: any, logdir: string, is_fast: boolean, H_err: { [key: string]: any }) //パラメータを作成する
	//不明部署の部署IDを読み出す
	//管理者のユーザIDを読み出す
	//挿入インスタンスを作成する
	{
		H_err.errmsg = "";
		// 2022cvt_016
		if (!this.createTgtPact(H_tgtpact, pactid, waytype, table_no)) {
			return false;
		}

		// 2022cvt_015
		for (var cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "過去最新月" : "現在") + "のルート部署の取り出し";
			if (!this.getTopPostID(H_tgtpact, cnt)) return false;
		}

		for (cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "過去最新月" : "現在") + "の不明な部署(" + postcode_unknown + ")の取り出し";
			if (!this.getUnknownPostID(H_tgtpact, cnt, postcode_unknown)) {
				return false;
			}
		}

		H_err.errmsg = "管理者権限を持つユーザの読み出し";
		if (!this.getAdminEmployeeCode(H_tgtpact, fncid_admin)) {
			return false;
		}
		H_err.errmsg = "既存のユーザ情報の読み出し";
		if (!this.getUserAll(H_tgtpact)) {
			return false;
		}
		H_err.errmsg = "保護ユーザの読み出し";
		if (!this.getUserFix(H_tgtpact)) {
			return false;
		}

		for (cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "過去最新月" : "現在") + "の保護部署の取り出し";
			if (!this.getFixPostID(H_tgtpact, cnt)) {
				return false;
			}
		}

		H_err.errmsg = "データ挿入の準備";
		if (!this.createInserter(H_tgtpact, logdir, is_fast)) {
			return false;
		}
		return true;
	}

	// 2022cvt_016
	createTgtPact(H_tgtpact: { [key: string]: any }, pactid: number, waytype: any, table_no: any) {
		H_tgtpact.pactid = pactid;
		// 2022cvt_016
		H_tgtpact.waytype = waytype;
		H_tgtpact.table_no = table_no;
		return true;
	}

	// 2022cvt_016
	async getTopPostID(H_tgtpact: { [key: string]: any }, table_type: number | undefined) //ルートの部署のuserpostidを取り出す
	{
		// 2022cvt_016
		H_tgtpact["top" + table_type] = "";
		// 2022cvt_016
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) return true;
		// 2022cvt_016
		// 2022cvt_015
		var rel = this.getTableName("post_relation_%", H_tgtpact, table_type);
		// 2022cvt_015
		var sql = "select postidparent" + " from " + rel + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			level: 0
		}, Array()) + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_016
		if (undefined !== result[0] && undefined !== result[0][0]) {
			H_tgtpact["top" + table_type] = result[0][0];
		} else {
			return false;
		}
		// 2022cvt_016
		sql = "select userpostid from " + this.getTableName("post_%", H_tgtpact, table_type) + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			postid: result[0][0]
		}, Array()) + ";";
		result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_016
		if (undefined !== result[0] && undefined !== result[0][0]) {
			H_tgtpact["top_userpostid" + table_type] = result[0][0];
		} else {
			return false;
		}
		return true;
	}

	// 2022cvt_016
	async getUnknownPostID(H_tgtpact: { [key: string]: any }, table_type: number | undefined, postcode_unknown: string) {
		// 2022cvt_016
		H_tgtpact["unknown" + table_type] = "";
		// 2022cvt_016
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
			return true;
		}
		// 2022cvt_016
		// 2022cvt_015
		var name = this.getTableName("post_%", H_tgtpact, table_type);
		// 2022cvt_015
		var sql = "select postid" + " from " + name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			userpostid: postcode_unknown
		}, ["userpostid"]) + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_016
		if (undefined !== result[0] && undefined !== result[0][0]) {
			H_tgtpact["unknown" + table_type] = result[0][0];
		} else {
			return false;
		}
		return true;
	}

	async getAdminEmployeeCode(H_tgtpact: { [key: string]: any }, fncid: any) {
		// 2022cvt_015
		var sql = "select employeecode from user_tb where userid in (" + "select userid from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			fncid: fncid
		}, Array()) + " group by userid" + ")" + " group by employeecode" + ";";
		// 2022cvt_015
		var A_code = Array();
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}

		// 2022cvt_015
		for (var A_line of result) {
			A_code.push("U" + A_line[0]);
		}

		H_tgtpact.adminuser = A_code;
		return true;
	}

	async getUserAll(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_016
		// 2022cvt_015
		var sql = "select" + " user_tb.employeecode as employeecode" + ",user_tb.username as username" + ",user_tb.postid as postid" + ",post_tb.userpostid as userpostid" + ",user_tb.mail as mail" + ",coalesce(user_tb.type,'') as type" + ",user_tb.userid as userid" + " from user_tb" + " left join post_tb" + " " + this.getSQLOn("user_tb", "post_tb", ["pactid", "postid"]) + " where 1=1 " + this.getSQLWhere({
			"user_tb.pactid": H_tgtpact.pactid
		}, Array()) + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) return false;
		// 2022cvt_015
		var H_user = Array();

		// 2022cvt_015
		for (var H_line of result) {
			// 2022cvt_022
			// 2022cvt_016
			H_line.is_admin = 0 != "US".localeCompare(H_line.type);
			H_user["U" + H_line.employeecode] = H_line;
		}

		H_tgtpact.user = H_user;
		return true;
	}

	async getUserFix(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "select" + " employeecode" + " from user_tb" + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			"coalesce(fix_flag,false)": "true"
		}, Array()) + " group by employeecode" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_015
		var H_user = Array();

		// 2022cvt_015
		for (var H_line of result) {
			if (!H_line.employeecode.length) {
				continue;
			}
			H_user.push("U" + H_line.employeecode);
		}

		H_tgtpact.user_fix = H_user;
		return true;
	}

	// 2022cvt_016
	async getFixPostID(H_tgtpact: { [key: string]: any }, table_type: number | undefined) {
		// 2022cvt_016
		H_tgtpact["post_fix" + table_type] = Array();
		// 2022cvt_016
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
			return true;
		}
		// 2022cvt_016
		// 2022cvt_015
		var name = this.getTableName("post_%", H_tgtpact, table_type);
		// 2022cvt_015
		var sql = "select userpostid" + " from " + name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			"coalesce(fix_flag,false)": "true"
		}, Array()) + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}

		// 2022cvt_016
		// 2022cvt_015
		for (var H_line of result) {
			H_tgtpact["post_fix" + table_type].push("P" + H_line[0]);
		}

		return true;
	}

	createInserter(H_tgtpact: { [key: string]: any }, logdir: string, is_fast: boolean) {
		H_tgtpact.inserter = Array();
		// 2022cvt_015
		var H_param = {
			user: "user_tb",
			fnc: "fnc_relation_tb"
		};

		// 2022cvt_015
		for (var key in H_param) {
			// 2022cvt_015
			var table_name = H_param[key];
			H_tgtpact.inserter[key] = is_fast ? new TableInserterSafe(this.m_O_log, this.m_O_db, logdir + table_name + ".insert", true) : new TableInserterSlowSafe(this.m_O_log, this.m_O_db);
			if (!H_tgtpact.inserter[key].begin(table_name)) {
				return false;
			}
			H_tgtpact.inserter[key].setUnlock();
		}

		return true;
	}

	endInserterUser(H_tgtpact: { [key: string]: any }) //必ず、ユーザ→権限の順に書き込む
	{
		// 2022cvt_015
		var A_key = ["user", "fnc"];

		// 2022cvt_015
		for (var key of A_key) {
			if (!(undefined !== H_tgtpact.inserter[key])) continue;
			if (!H_tgtpact.inserter[key].end()) return false;
		}

		return true;
	}

	deleteReserve(H_tgtpact: {} | any[], H_err: { [key: string]: any }) //tel_rel_tel_reserve_tbから削除する
	{
		H_err.errmsg = "予約済の電話・電話連係情報の削除";
		if (!this.deleteReserveTelRelTel(H_tgtpact)) {
			return false;
		}
		H_err.errmsg = "予約済の端末情報の削除";
		if (!this.deleteReserveAssets(H_tgtpact)) {
			return false;
		}
		H_err.errmsg = "予約済の電話・端末連係情報の削除";
		if (!this.deleteReserveTelRelAssets(H_tgtpact)) {
			return false;
		}
		H_err.errmsg = "予約済の電話情報の削除";
		if (!this.deleteReserveTel(H_tgtpact)) {
			return false;
		}
		return true;
	}

	deleteReserveTelRelTel(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "delete from tel_rel_tel_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + " and tel_reserve_tb.pactid" + "=tel_rel_tel_reserve_tb.pactid" + " and tel_reserve_tb.telno" + "=tel_rel_tel_reserve_tb.telno" + " and tel_reserve_tb.carid" + "=tel_rel_tel_reserve_tb.carid" + " and tel_reserve_tb.add_edit_flg" + "=tel_rel_tel_reserve_tb.add_edit_flg" + " and tel_reserve_tb.reserve_date" + "=tel_rel_tel_reserve_tb.reserve_date" + " )" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveAssets(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "delete from assets_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_rel_assets_reserve_tb" + " left join tel_reserve_tb" + " on tel_rel_assets_reserve_tb.pactid" + "=tel_reserve_tb.pactid" + " and tel_rel_assets_reserve_tb.telno" + "=tel_reserve_tb.telno" + " and tel_rel_assets_reserve_tb.carid" + "=tel_reserve_tb.carid" + " and tel_rel_assets_reserve_tb.add_edit_flg" + "=tel_reserve_tb.add_edit_flg" + " and tel_rel_assets_reserve_tb.reserve_date" + "=tel_reserve_tb.reserve_date" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.telno is not null" + " and tel_reserve_tb.order_flg=false" + " and tel_rel_assets_reserve_tb.pactid" + "=assets_reserve_tb.pactid" + " and tel_rel_assets_reserve_tb.assetsid" + "=assets_reserve_tb.assetsid" + " and tel_rel_assets_reserve_tb.add_edit_flg" + "=assets_reserve_tb.add_edit_flg" + " and tel_rel_assets_reserve_tb.reserve_date" + "=assets_reserve_tb.reserve_date" + ")" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveTelRelAssets(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "delete from tel_rel_assets_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + " and tel_reserve_tb.pactid" + "=tel_rel_assets_reserve_tb.pactid" + " and tel_reserve_tb.telno" + "=tel_rel_assets_reserve_tb.telno" + " and tel_reserve_tb.carid" + "=tel_rel_assets_reserve_tb.carid" + " and tel_reserve_tb.add_edit_flg" + "=tel_rel_assets_reserve_tb.add_edit_flg" + " and tel_reserve_tb.reserve_date" + "=tel_rel_assets_reserve_tb.reserve_date" + ")" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveTel(H_tgtpact: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "delete from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + ";";
		return this.querySafeLog(sql);
	}

	async addUser(H_tgtpact: {} | any[], userid: { [key: string]: string }, H_tgtuser: {} | any[], postid: any, A_id: Array<any>, H_err: { [key: string]: any }) //ユーザIDを採番する
	{
		H_err.errmsg = "ユーザ連番の採番";
		userid.value = await this.getSeqUserID();
		if (!userid.value) {
			return false;
		}
		H_err.errmsg = "ユーザの追加";
		if (!this.addUserUser(H_tgtpact, H_tgtuser, userid.value, postid)) {
			return false;
		}
		H_err.errmsg = "ユーザの権限の追加";
		if (!this.addUserFunc(H_tgtpact, userid.value, A_id)) {
			return false;
		}
		return true;
	}

	addUserUser(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, userid: string, postid: any) //ユーザを追加する
	//passwordはホットライン時代のmd5を使ってエンコードしている
	//ログイン画面で、md5形式なら新しい形式に読み替える機能がある
	{
		const md5 = crypto.createHash('md5');
		return H_tgtpact.inserter.user.insert({
			pactid: H_tgtpact.pactid,
			userid: userid,
			username: H_tgtuser.username,
			postid: postid,
			loginid: H_tgtuser.employeecode,
			passwd: md5.update(H_tgtuser.employeecode, 'binary').digest('hex'),
			// 2022cvt_016
			type: "US",
			mail: H_tgtuser.mail,
			recdate: "now()",
			fixdate: "now()",
			employeecode: H_tgtuser.employeecode,
			acceptmail1: 0,
			acceptmail2: 0,
			acceptmail3: 0,
			acceptmail4: 1,
			acceptmail5: 1
		});
	}

	addUserFunc(H_tgtpact: { [key: string]: any }, userid: string, A_id: Array<any>) {
		// 2022cvt_015
		for (var fncid of A_id) {
			if (!H_tgtpact.inserter.fnc.insert({
				pactid: H_tgtpact.pactid,
				userid: userid,
				fncid: fncid
			})) {
				return false;
			}
		}

		return true;
	}

	isChangeAdmin(H_tgtpact: { [key: string]: any }, H_master_user: { [key: string]: any }) {
		// 2022cvt_015
		var is_admin = -1 !== H_tgtpact.adminuser.indexOf("U" + H_master_user.employeecode);
		return is_admin != H_master_user.is_admin;
	}

	changeAdmin(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_id: Array<any>, H_err: { [key: string]: any }) //ユーザの役職を切り替える
	{
		H_err.errmsg = "ユーザの権限の切り替え";
		if (!this.changeAdminUser(H_tgtpact, H_tgtuser, A_id)) {
			return false;
		}
		return true;
	}

	async changeAdminUser(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[], A_id: Array<any>) //既存の権限を削除する
	{
		// 2022cvt_015
		var sql = "delete from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and userid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		if (!this.querySafeLog(sql)) {
			return false;
		}
		sql = this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser);
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (result == null) {
			return false;
		}
		// 2022cvt_015
		var A_userid = Array();

		// 2022cvt_015
		for (var A_line of result) {
			A_userid.push(A_line[0]);
		}

		// 2022cvt_015
		for (var userid of A_userid) {
			if (!this.addUserFunc(H_tgtpact, userid, A_id)) {
				return false;
			}
		}

		return true;
	}

	isChangeUser(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[], usercode: string, is_ready_user: boolean, userid: string, H_change: { [key: string]: any }) //ユーザ
	{
		H_change = Array();

		if (is_ready_user) //元からユーザが存在した場合のみ検査する
		{
			// 2022cvt_015
			var A_change = Array();

			if (undefined !== H_tgtpact.user[usercode] && this.isChangeUserUser(H_tgtpact.user[usercode], H_tgtuser, A_change)) {
				H_change.user = A_change;
			}
		}

		return H_change.length;
	}

	changeUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_ready_user: boolean, userid: string, H_change: { [key: string]: any }, H_err: { [key: string]: any }) //ユーザを更新する
	{
		if (is_ready_user && undefined !== H_change.user) {
			// 2022cvt_015
			var A_change = H_change.user;
			H_err.errmsg = "ユーザテーブルへのユーザ情報の変更";
			if (!this.changeUserUser(H_tgtpact, H_tgtuser, A_change)) {
				return false;
			}
		}

		return true;
	}

	isChangeUserUser(H_user1: {} | any[], H_user2: {} | any[], A_change: Array<any>) {
		A_change = Array();
		// 2022cvt_015
		var A_column = ["username", "mail"];

		// 2022cvt_022
		// 2022cvt_015
		for (var column of A_column) {
			if (H_user1[column].localeCompare(H_user2[column])) {
				A_change.push(column);
			};
		}

		return A_change.length;
	}

	changeUserUser(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, A_change: Array<any>) {
		if (!A_change.length) {
			return true;
		}
		// 2022cvt_015
		var username = this.escape(H_tgtuser.username);
		// 2022cvt_015
		var mail = this.escape(H_tgtuser.mail);
		// 2022cvt_015
		var sql = "update user_tb" + " set fixdate=" + this.getCurrent();
		if (-1 !== A_change.indexOf("username")) {
			sql += ",username='" + username + "'";
		}
		if (-1 !== A_change.indexOf("mail")) {
			sql += ",mail='" + mail + "'";
		}
		sql += " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]);
		sql += ";";
		if (!this.querySafeLog(sql)) {
			return false;
		}
		return true;
	}

	changeUserSalary(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, H_err: { [key: string]: any }) {
		// 2022cvt_016
		// 2022cvt_015
		for (var table_type = 0; table_type < 2; ++table_type) {
			// 2022cvt_016
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
				continue;
			}
			// 2022cvt_016
			// 2022cvt_015
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の給与負担元コード・名称の更新";
			// 2022cvt_015
			var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_id + "=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + ",salary_source_code=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + "," + this.m_column_name + "=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + ",salary_source_name=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + ",executive_no=" + "'" + this.escape(H_tgtuser.executive_no) + "'" + ",executive_name=" + "'" + this.escape(H_tgtuser.executive_name) + "'" + ",executive_mail=" + "'" + this.escape(H_tgtuser.executive_mail) + "'" + ",employee_class=" + this.escape(H_tgtuser.employee_class) + ",office_code=" + "'" + this.escape(H_tgtuser.office_code) + "'" + ",office_name=" + "'" + this.escape(H_tgtuser.office_name) + "'" + ",building_name=" + "'" + this.escape(H_tgtuser.building_name) + "'" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode=" + "'" + this.escape(H_tgtuser.employeecode) + "'" + " and (" + " coalesce(" + this.m_column_id + ",'')!=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + " or" + " coalesce(salary_source_code,'')!=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + " or" + " coalesce(" + this.m_column_name + ",'')!=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + " or" + " coalesce(salary_source_name,'')!=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + " or" + " coalesce(executive_no,'')!=" + "'" + this.escape(H_tgtuser.executive_no) + "'" + " or" + " coalesce(executive_name,'')!=" + "'" + this.escape(H_tgtuser.executive_name) + "'" + " or" + " coalesce(executive_mail,'')!=" + "'" + this.escape(H_tgtuser.executive_mail) + "'" + " or" + " coalesce(employee_class,0)!=" + this.escape(H_tgtuser.employee_class) + " or" + " coalesce(office_code,'')!=" + "'" + this.escape(H_tgtuser.office_code) + "'" + " or" + " coalesce(office_name,'')!=" + "'" + this.escape(H_tgtuser.office_name) + "'" + " or" + " coalesce(building_name,'')!=" + "'" + this.escape(H_tgtuser.building_name) + "'" + ")" + ";";
			if (!this.querySafeLog(sql)) {
				return false;
			}
		}

		return true;
	}

	isMoveUser(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[], userid, is_ready_user, H_change: { [key: string]: any }) //ユーザで部署移動が必要か確認する
	{
		H_change = Array();

		if (is_ready_user) //元からユーザが存在した場合のみ検査する
		{
			if (undefined !== H_tgtpact.user[userid] && this.isMoveUserUser(H_tgtpact.user[userid], H_tgtuser)) {
				H_change.user = true;
			}
		}

		return H_change.length;
	}

	moveUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_postid: {} | any[], is_ready_user, H_change: { [key: string]: any }, H_err: { [key: string]: any }) //ユーザテーブルを更新する
	{
		if (is_ready_user && undefined !== H_change.user && H_change.user) {
			H_err.errmsg = "ユーザの所属部署変更";
			if (!this.moveUserUser(H_tgtpact, H_tgtuser, A_postid[0])) {
				return false;
			}
		}

		return true;
	}

	isMoveUserUser(H_user1: { [key: string]: any }, H_user2: { [key: string]: any }) {
		// 2022cvt_022
		return H_user1.userpostid.localeCompare(H_user2.userpostid);
	}

	moveUserUser(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, postid) {
		// 2022cvt_015
		var sql = "update user_tb" + " set fixdate=" + this.getCurrent() + ",postid=" + postid + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + " and postid!=" + postid + ";";
		if (!this.querySafeLog(sql)) {
			return false;
		};
		return true;
	}

	changeUserMoveUserTelAssets(H_tgtpact: { [key: string]: any }, H_err: { [key: string]: any }) {
		// 2022cvt_016
		// 2022cvt_015
		for (var table_type = 0; table_type < 2; ++table_type) //電話を更新する(user_tbから、commflagと無関係に)
		{
			// 2022cvt_016
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
				continue;
			}
			// 2022cvt_016
			// 2022cvt_015
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			// 2022cvt_016
			// 2022cvt_015
			var tel_rel_assets_x_tb = this.getTableName("tel_rel_assets_%", H_tgtpact, table_type);
			// 2022cvt_016
			// 2022cvt_015
			var assets_x_tb = this.getTableName("assets_%", H_tgtpact, table_type);
			// 2022cvt_015
			var user_tb = "user_tb";
			// 2022cvt_016
			// 2022cvt_015
			var post_x_tb = this.getTableName("post_%", H_tgtpact, table_type);
			// 2022cvt_015
			var second = this.escape("000");
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話のユーザ情報の更新";
			// 2022cvt_015
			var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",username=" + user_tb + ".username" + ",mail=" + user_tb + ".mail" + ",userid=" + user_tb + ".userid" + " from " + user_tb + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + ";";
			if (!this.querySafeLog(sql)) {
				return false;
			};
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の部署の更新(1の前半)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",cfbpostcode_first=" + post_x_tb + ".userpostid" + ",cfbpostcode_second='" + second + "'" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + " and coalesce(" + tel_x_tb + ".commflag,'')='auto'" + " and coalesce(" + tel_x_tb + ".cfbpostcode_first,'')" + "!=" + post_x_tb + ".userpostid" + ";";
			if (!this.querySafeLog(sql)) return false;
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の部署の更新(1の後半)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",cfbpostcode=coalesce(cfbpostcode_first,'')" + "||coalesce(cfbpostcode_second,'')" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + " and coalesce(" + tel_x_tb + ".commflag,'')='auto'" + " and coalesce(" + tel_x_tb + ".cfbpostcode,'')" + "!=(coalesce(" + tel_x_tb + ".cfbpostcode_first,'')" + "||coalesce(" + tel_x_tb + ".cfbpostcode_second,''))" + ";";
			if (!this.querySafeLog(sql)) return false;
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の部署の更新(2)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + post_x_tb + ".postid" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + ";";
			if (!this.querySafeLog(sql)) {
				return false;
			};
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の端末のユーザ情報の更新";
			sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",username=" + user_tb + ".username" + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " left join " + user_tb + this.getSQLOn(tel_x_tb, user_tb, ["pactid", "employeecode"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + ";";
			if (!this.querySafeLog(sql)) {
				return false;
			}
			// 2022cvt_016
			H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の端末の部署の更新";
			sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + post_x_tb + ".postid" + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " left join " + user_tb + this.getSQLOn(tel_x_tb, user_tb, ["pactid", "employeecode"]) + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + ";";
			if (!this.querySafeLog(sql)) {
				return false;
			}
		}

		return true;
	}

	deleteUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_fix_person: { [key: string]: boolean }, is_fix_post: { [key: string]: boolean }, is_fix_own: { [key: string]: boolean }, H_err: { [key: string]: any }) //個人別承認者になっていないか確認する
	{
		H_err.errmsg = "オーダーの個人承認者の確認";
		if (!this.deleteUserOrderPerson(H_tgtpact, H_tgtuser, is_fix_person)) {
			return false;
		}

		if (is_fix_person.value) {
			return true;
		}

		H_err.errmsg = "オーダーの部署の最後の承認者の確認";
		if (!this.deleteUserOrderPost(H_tgtpact, H_tgtuser, is_fix_post.value)) {
			return false;
		}

		if (is_fix_post.value) {
			return true;
		}

		H_err.errmsg = "販売店受注済まで行っていないオーダーのキャンセル";
		if (!this.deleteUserOrderCancel(H_tgtpact, H_tgtuser, is_fix_own)) {
			return false;
		}

		if (is_fix_own.value) {
			return true;
		}

		H_err.errmsg = "権限の削除";
		if (!this.deleteUserFnc(H_tgtpact, H_tgtuser)) {
			return false;
		}
		H_err.errmsg = "ユーザの削除";
		if (!this.deleteUserUser(H_tgtpact, H_tgtuser)) {
			return false;
		}
		return true;
	}

	async deleteUserOrderPerson(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[], is_fix: { [key: string]: boolean }) {
		is_fix.value = false;
		// 2022cvt_015
		var sql = "select count(*) from mt_order_tb" + " where status in (5,7)" + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and recoguserid in(" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		// 2022cvt_015
		var result = await this.getOneSafeLog(sql);
		if (!result) {
			return false;
		}
		is_fix.value = 0 < result;
		return true;
	}

	async deleteUserOrderPost(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, is_fix: boolean) //削除するユーザのユーザIDと部署IDを取り出す
	{
		is_fix = false;
		// 2022cvt_015
		var fncid = FJP_FNCID_ORDER;
		// 2022cvt_015
		var sql = " select userid,postid from user_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return false;
		};

		// 2022cvt_015
		for (var H_line of result) //自分が部署承認者でなければスキップする
		{
			// 2022cvt_015
			var userid = H_line.userid;
			// 2022cvt_015
			var postid = H_line.postid;
			sql = "select count(*) from fnc_relation_tb" + " where pactid=" + H_tgtpact.pactid + " and userid=" + userid + " and fncid=" + fncid + ";";
			var result_2 = await this.getOneSafeLog(sql);
			if (!result_2){
				return false;
			};
			if (0 == result_2) {
				continue;
			};
			sql = "select count(*) from user_tb" + " where pactid=" + H_tgtpact.pactid + " and postid=" + postid + " and userid!=" + userid + " and userid in (" + " select userid from fnc_relation_tb" + " where pactid=" + H_tgtpact.pactid + " and fncid=" + fncid + ")" + ";";
			result_2 = await this.getOneSafeLog(sql);
			if (!result_2) {
				return false;
			};

			if (0 < result_2) //他に権限を持っているユーザがいるので削除できる
			{
				continue;
			}

			sql = "select count(*) from mt_order_tb" + " where pactid=" + H_tgtpact.pactid + " and status in (10,20)" + " and nextpostid is not null" + " and nextpostid=" + postid + ";";
			result_2 = await this.getOneSafeLog(sql);
			if (!result_2) {
				return false;
			}

			if (0 < result_2) //承認待ちの注文があるので削除できない
			{
				is_fix = true;
				return true;
			}
		}

		return true;
	}

	async deleteUserOrderCancel(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[], is_fix: { [key: string]: boolean }) //そのようなオーダーがあるか確認する
	{
		is_fix.value = false;
		// 2022cvt_015
		var sql = "select count(*) from mt_order_tb" + " where pactid=" + H_tgtpact.pactid + " and status<=49" + " and status!=30" + " and chargerid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		// 2022cvt_015
		var result = await this.getOneSafeLog(sql);
		if (!result) {
			return false;
		}
		if (0 < result) is_fix.value = true;
		return true;
	}

	deleteUserFnc(H_tgtpact: { [key: string]: any }, H_tgtuser: {} | any[]) {
		// 2022cvt_015
		var sql = "delete from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and userid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		if (!this.querySafeLog(sql)) {
			return false;
		};
		return true;
	}

	deleteUserUser(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }) {
		// 2022cvt_015
		var sql = "delete from user_tb" + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + ";";
		// 2022cvt_015
		var result = this.querySafe(sql);
		if (!result.length) {
			return true;
		};
		// 2022cvt_015
		var pat = "/\\[nativecode=ERROR: *(-?[0-9]+)\\]/";
		// 2022cvt_015
		var A_match = result.match(pat) || Array();
		// preg_match(pat, result, A_match, PREG_OFFSET_CAPTURE);

		// if (1 < A_match.length && undefined !== A_match[1][0] && A_match[1][0].length) {
		// 	H_err.errparam = "エラーコードは" + A_match[1][0];
		// }

		return false;
	}

	deleteUserTelAssets(H_tgtpact: { [key: string]: any }, H_err: { [key: string]: any }, is_unknown_tel: any) {
		// 2022cvt_016
		// 2022cvt_015
		for (var table_type = 0; table_type < 2; ++table_type) {
			// 2022cvt_016
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
				continue;
			}
			// 2022cvt_016
			// 2022cvt_015
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			// 2022cvt_016
			// 2022cvt_015
			var tel_rel_assets_x_tb = this.getTableName("tel_rel_assets_%", H_tgtpact, table_type);
			// 2022cvt_016
			// 2022cvt_015
			var assets_x_tb = this.getTableName("assets_%", H_tgtpact, table_type);
			// 2022cvt_015
			var user_tb = "user_tb";

			if (is_unknown_tel) //職制マスタに無い利用者の電話を不明部署に移動する
			//FJP13の、修正前の動作
			//電話の部署を不明部署にする
			{
				// 2022cvt_016
				H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の部署の更新(前)";
				// 2022cvt_016
				// 2022cvt_015
				var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + H_tgtpact["unknown" + table_type] + "," + this.m_column_date + "=" + this.getCurrentWithoutTime() + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(employeecode,''))=0" + " and postid!=" + H_tgtpact["top" + table_type] + "))" + ";";
				if (!this.querySafeLog(sql)) {
					return false;
				}
				// 2022cvt_016
				H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の不明部署以外の電話の追加項目日付1をNULLに更新" + "(前)";
				// 2022cvt_016
				sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_date + "=null" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and " + this.m_column_date + " is not null" + ";";
				if (!this.querySafeLog(sql)) {
					return false;
				}
				// 2022cvt_016
				H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の端末の部署の更新(前)";
				// 2022cvt_016
				sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + H_tgtpact["unknown" + table_type] + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".postid!=" + H_tgtpact["unknown" + table_type] + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(" + tel_x_tb + ".employeecode,''))=0" + " and " + assets_x_tb + ".postid!=" + H_tgtpact["top" + table_type] + "))" + ";";
				if (!this.querySafeLog(sql)) {
					return false;
				}
			} else //職制マスタに無い利用者の電話を不明部署に移動しない
			//FJP13の、修正後の動作
			//不明利用者ではない電話回線は、追加項目日付1をNULLにする
			{
				// 2022cvt_015
				var username_pre = "★";
				// 2022cvt_015
				var username_post = "(人事データなし)";
				// 2022cvt_016
				H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の不明部署以外の電話の追加項目日付1をNULLに更新" + "(後)";
				sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_date + "=null" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + this.m_column_date + " is not null" + " and (" + " username not like '" + username_pre + "%'" + " or" + " username not like '%" + username_post + "'" + " )" + ";";
				if (!this.querySafeLog(sql)) {
					return false;
				}
				// 2022cvt_016
				H_err.errmsg = (table_type ? "過去最新月" : "現在") + "の電話の部署の更新(後)";
				// 2022cvt_016
				sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",username='" + username_pre + "' || username" + " || '" + username_post + "'" + "," + this.m_column_date + "=" + this.getCurrentWithoutTime() + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(employeecode,''))=0" + " and postid!=" + H_tgtpact["top" + table_type] + "))" + " and username not like '" + username_pre + "%'" + " and username not like '%" + username_post + "'" + ";";
				if (!this.querySafeLog(sql)) return false;
			}
		}

		return true;
	}

	userPostID2PostID(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }, A_userpostid2postid: {} | any[], H_postid: {} | any[], H_is_in: {} | any[], H_err: {} | any[]) {
		// 2022cvt_015
		var is_in = true;
		H_is_in = Array();

		// 2022cvt_016
		// 2022cvt_015
		for (var table_type = 0; table_type < 2; ++table_type) {
			// 2022cvt_016
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
				continue;
			}
			// 2022cvt_015
			var postcode = "P" + H_tgtuser.userpostid;

			// 2022cvt_016
			if (!(undefined !== A_userpostid2postid[table_type][postcode])) {
				// 2022cvt_016
				H_postid[table_type] = H_tgtpact["unknown" + table_type];
				// 2022cvt_016
				H_is_in[table_type] = false;
				is_in = false;
			} else {
				// 2022cvt_016
				H_postid[table_type] = A_userpostid2postid[table_type][postcode];
				// 2022cvt_016
				H_is_in[table_type] = true;
			}
		}

		return is_in;
	}

	async getUserPost(H_tgtpact: {} | any[], A_userpostid2postid: {} | any[], H_err: { [key: string]: any }) {
		// 2022cvt_015
		for (var cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = "追加・変更後の部署情報の読み出し";
			// 2022cvt_015
			var H_userpostid2postid = Array();
			if (!(await this.getUserGetPost(H_tgtpact, H_userpostid2postid, cnt))) {
				return false;
			}
			A_userpostid2postid[cnt] = H_userpostid2postid;
		}

		return true;
	}

	// 2022cvt_016
	async getUserGetPost(H_tgtpact: { [key: string]: any }, H_userpostid2postid: {} | any[], table_type: number | undefined) {
		H_userpostid2postid = Array();
		// 2022cvt_016
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) {
			return true;
		}
		// 2022cvt_016
		// 2022cvt_015
		var table_name = this.getTableName("post_%", H_tgtpact, table_type);
		// 2022cvt_015
		var sql = "select userpostid,postid from " + table_name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}

		// 2022cvt_015
		for (var A_line of result) {
			H_userpostid2postid["P" + A_line[0]] = A_line[1];
		}

		return true;
	}

	getSQLUserIDFromEmployeeCode(H_tgtpact: { [key: string]: any }, H_tgtuser: { [key: string]: any }) {
		return " select userid from user_tb where 1=1 " + " and userid is not null" + " and employeecode is not null" + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + " group by userid";
	}

	async executePreCheckAll(A_pactid_fail: Array<any>, A_pactid_in: Array<any>, A_pactid_out: Array<any>, A_table_no: Array<any>) {
		A_pactid_fail = Array();
		// 2022cvt_015
		var return_var = true;
		// 2022cvt_015
		var A_pactid = await this.getPreCheckPactID();

		// 2022cvt_015
		for (var pactid of A_pactid) {
			if (A_pactid_in.length && !(-1 !== A_pactid_in.indexOf(pactid))) {
				this.putLog(G_SCRIPT_DEBUG, "実行リストに無かったので処理せず" + pactid);
				continue;
			}

			if (A_pactid_out.length && -1 !== A_pactid_out.indexOf(pactid)) {
				this.putLog(G_SCRIPT_DEBUG, "除外リストにあったので処理せず" + pactid);
				continue;
			}

			// 2022cvt_015
			var is_fail = { "value": false };

			if (!this.executePreCheck(is_fail, pactid, A_table_no)) {
				return false;
			}

			if (is_fail.value) {
				A_pactid_fail.push(pactid);
			}
		}

		// 2022cvt_015
		return return_var;
	}

	async executePreCheck(is_fail: { [key: string]: boolean | number }, pactid: number, A_table_no: Array<any>) //端末の検査をスキップするならtrue
	//テーブル番号に該当する解説文字列を作る
	//userpostidの重複
	//userpostidの不存在
	//employeecodeの重複
	//employeecodeの不存在
	//user_tbとtel_tbのemployeecode
	//user_tbとassets_tbのemployeecode
	//user_tbとtel_tbのusername
	//user_tbとtel_tbのmail
	//user_tbとassets_tbのusername
	{
		// 2022cvt_015
		var return_var = true;
		// 2022cvt_015
		var H_table_no = Array();
		// 2022cvt_015
		var is_skip_assets = true;

		// 2022cvt_015
		for (var table_no of A_table_no) {
			H_table_no[table_no] = table_no.length ? table_no + "月" : "最新";
		}

		// 2022cvt_015
		for (var table_no_1 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_1];
			// 2022cvt_015
			var A_list = await this.getPreCheckUserPostIDDup(pactid, table_no_1);
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var userpostid of A_list) {
				// 2022cvt_015
				var msg = table_no_label + "の部署設定に" + "部署コード「" + userpostid + "」" + "が複数存在しています。";
				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_2 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_2];
			// 2022cvt_015
			var count = await this.getPreCheckUserPostIDEmpty(pactid, table_no_2);
			if (!count) {
				continue;
			};
			is_fail.value = true;
			this.putMail(FJP_MAIL_ALL.toString(), pactid, table_no_label + "の部署設定に" + "部署コードが登録されていない部署があります。");
		}

		// 2022cvt_015
		for (var table_no_3 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_3];
			if (table_no_3.length) {
				continue;
			}
			A_list = await this.getPreCheckEmployeeCodeDup(pactid);
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var code in A_list) {
				// 2022cvt_015
				var A_username = A_list[code];
				msg = "ユーザ設定に社員番号「" + code.substring(1) + "」が複数存在します。" + "社員名は以下の通りです。" + A_username.join(" ");
				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_4 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_4];
			if (table_no.length) {
				continue;
			};
			A_list = await this.getPreCheckEmployeeCodeEmpty(pactid);
			if (!A_list.length) {
				continue;
			};
			is_fail.value = true;
			msg = "ユーザ設定で社員番号が登録されていない社員が存在します。" + "社員名は以下の通りです。" + A_list.join(" ");
			this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
		}

		// 2022cvt_015
		for (var table_no_5 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_5];
			A_list = await this.getPreCheckTelUserID(pactid, table_no_5);
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var H_list of A_list) {
				msg = table_no_label + "の";
				msg += H_list.carname + "の";
				msg += "「" + H_list.telno + "」" + "は、";

				if (H_list.employeecode_tel.length) {
					msg += "社員番号「" + H_list.employeecode_tel + "」ですが、";

					if (H_list.employeecode_user.length) {
						msg += "社員番号「" + H_list.employeecode_user + "」の所有になっています。";
					} else {
						msg += "誰の所有にもなっていません。";
					}
				} else {
					msg += "社員番号が登録されていませんが、";

					if (H_list.employeecode_user.length) {
						msg += "社員番号「" + H_list.employeecode_user + "」の所有になっています。";
					} else {
						continue;
					}
				}

				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_6 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_6];
			A_list = Array();
			if (!is_skip_assets) {
				A_list = await this.getPreCheckAssetsUserID(pactid, table_no_6);
			}
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var H_list of A_list) {
				msg = table_no_label + "の";
				msg += H_list.carname + "の";
				msg += "「" + H_list.telno + "」" + "の";
				msg += "端末「" + H_list.productname + "」" + "(assetsid:" + H_list.assetsid + ")" + "は、";

				if (H_list.employeecode_assets.length) {
					msg += "社員番号「" + H_list.employeecode_assets + "」ですが、";

					if (H_list.employeecode_user.length) {
						msg += "社員番号「" + H_list.employeecode_user + "」の所有になっています。";
					} else {
						msg += "誰の所有にもなっていません。";
					}
				} else {
					msg += "社員番号が登録されていませんが、";

					if (H_list.employeecode_user.length) {
						msg += "社員番号「" + H_list.employeecode_user + "」の所有になっています。";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_7 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_7];
			A_list = await this.getPreCheckTelUserName(pactid, table_no_7);
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var H_list of A_list) {
				msg = table_no_label + "の";
				msg += H_list.carname + "の";
				msg += "「" + H_list.telno + "」" + "は、";

				if (H_list.username_tel.length) {
					msg += "社員名「" + H_list.username_tel + "」ですが、";

					if (H_list.username_user.length) {
						msg += "ユーザテーブルでは" + "社員名が「" + H_list.username_user + "」になっています。";
					} else {
						msg += "ユーザテーブルでは社員名がありません。";
					}
				} else {
					msg += "社員名が登録されていませんが、";

					if (H_list.username_user.length) {
						msg += "ユーザテーブルでは" + "社員名が「" + H_list.username_user + "」になっています。";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_8 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_8];
			A_list = await this.getPreCheckTelMail(pactid, table_no_8);
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var H_list of A_list) {
				msg = table_no_label + "の";
				msg += H_list.carname + "の";
				msg += "「" + H_list.telno + "」" + "は、";

				if (H_list.mail_tel.length) {
					msg += "メールアドレスが「" + H_list.mail_tel + "」ですが、";

					if (H_list.mail_user.length) {
						msg += "ユーザテーブルでは「" + H_list.mail_user + "」です。";
					} else {
						msg += "ユーザテーブルでは" + "メールアドレスがありません。";
					}
				} else {
					msg += "メールアドレスが登録されていませんが、";

					if (H_list.mail_user.length) {
						msg += "ユーザテーブルでは" + "メールアドレスが「" + H_list.mail_user + "」になっています。";
					} else {
						continue;
					}
				}

				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		for (var table_no_9 in H_table_no) {
			// 2022cvt_015
			var table_no_label = H_table_no[table_no_9];
			A_list = Array();
			if (!is_skip_assets) {
				A_list = await this.getPreCheckAssetsUserName(pactid, table_no_9);
			}
			is_fail.value ||= A_list.length;

			// 2022cvt_015
			for (var H_list of A_list) {
				msg = table_no_label + "の";
				msg += H_list.carname + "の";
				msg += "「" + H_list.telno + "」" + "の";
				msg += "端末「" + H_list.productname + "」" + "(assetsid:" + H_list.assetsid + ")" + "は、";

				if (H_list.username_assets.length) {
					msg += "社員名「" + H_list.username_assets + "」ですが、";

					if (H_list.username_user.length) {
						msg += "ユーザテーブルでは" + "社員名が「" + H_list.username_user + "」になっています。";
					} else {
						msg += "ユーザテーブルでは社員名がありません。";
					}
				} else {
					msg += "社員名が登録されていませんが、";

					if (H_list.username_user.length) {
						msg += "ユーザテーブルでは" + "社員名が「" + H_list.username_user + "」になっています。";
					} else {
						continue;
					}
				}

				this.putMail(FJP_MAIL_ALL.toString(), pactid, msg);
			}
		}

		// 2022cvt_015
		return return_var;
	}

	async getPreCheckPactID() {
		// 2022cvt_015
		var sql = "select pactid from fnc_relation_tb" + " where fncid=" + FJP_FUNCID_MASTER + " group by pactid" + " order by pactid" + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return [];
		}
		// 2022cvt_015
		var A_pactid = Array();

		// 2022cvt_015
		for (var A_line of result) {
			A_pactid.push(A_line[0]);
		}

		return A_pactid;
	}

	async getPreCheckUserPostIDDup(pactid: number, table_no: string) {
		// 2022cvt_015
		var name = this.getTableName("post_%", table_no);
		// 2022cvt_015
		var sql = "select userpostid from " + name + " where pactid=" + pactid + " and userpostid is not null" + " and userpostid!=''" + " group by userpostid" + " having count(userpostid)>1" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return result;
		}
		// 2022cvt_015
		var A_result = Array();

		// 2022cvt_015
		for (var H_line of result) {

		} A_result.push(H_line.userpostid);

		return A_result;
	}

	getPreCheckUserPostIDEmpty(pactid: number, table_no: string | { [key: string]: any; }) {
		// 2022cvt_015
		var name = this.getTableName("post_%", table_no);
		// 2022cvt_015
		var sql = "select count(*) from " + name + " where pactid=" + pactid + " and coalesce(userpostid,'')=''" + ";";
		return this.getOneSafeLog(sql);
	}

	async getPreCheckEmployeeCodeDup(pactid: number) {
		// 2022cvt_015
		var name = "user_tb";
		// 2022cvt_015
		var sql = "select username,employeecode from " + name + " where pactid=" + pactid + " and employeecode in (" + "select employeecode from " + name + " where pactid=" + pactid + " and employeecode is not null" + " and employeecode!=''" + " group by employeecode" + " having count(employeecode)>1" + ")" + " order by employeecode,username" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return result;
		};
		// 2022cvt_015
		var H_result = Array();

		// 2022cvt_015
		for (var H_line of result) {
			// 2022cvt_015
			var key = "U" + H_line.employeecode;
			if (!(undefined !== H_result[key])) {
				H_result[key] = Array();
			};
			H_result[key].push(H_line.username);
		}

		return H_result;
	}

	async getPreCheckEmployeeCodeEmpty(pactid: number) {
		// 2022cvt_015
		var name = "user_tb";
		// 2022cvt_015
		var sql = "select username from " + name + " where pactid=" + pactid + " and coalesce(employeecode,'')=''" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return result;
		}
		// 2022cvt_015
		var A_result = Array();

		// 2022cvt_015
		for (var H_line of result) {
			A_result.push(H_line.username);
		}

		return A_result;
	}

	getPreCheckTelUserID(pactid: number, table_no: string | { [key: string]: any; }) //commflagがautoでなければ対象外とする
	{
		// 2022cvt_015
		var tel_tb = this.getTableName("tel_%", table_no);
		// 2022cvt_015
		var user_tb = "user_tb";
		// 2022cvt_015
		var carrier_tb = "carrier_tb";
		// 2022cvt_015
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".employeecode as employeecode_tel" + "," + user_tb + ".employeecode as employeecode_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (coalesce(" + tel_tb + ".employeecode,'')!=''" + " or coalesce(" + user_tb + ".employeecode,'')!='')" + " and coalesce(" + tel_tb + ".employeecode,'')" + "!=coalesce(" + user_tb + ".employeecode,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckAssetsUserID(pactid: number, table_no: string | { [key: string]: any; }) //端末と紐付く電話のcommflagがautoでなければ対象外とする
	{
		// 2022cvt_015
		var tel_tb = this.getTableName("tel_%", table_no);
		// 2022cvt_015
		var tel_rel_assets_tb = this.getTableName("tel_rel_assets_%", table_no);
		// 2022cvt_015
		var assets_tb = this.getTableName("assets_%", table_no);
		// 2022cvt_015
		var user_tb = "user_tb";
		// 2022cvt_015
		var carrier_tb = "carrier_tb";
		// 2022cvt_015
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + assets_tb + ".productname as productname" + "," + assets_tb + ".assetsid as assetsid" + "," + assets_tb + ".employeecode as employeecode_assets" + "," + user_tb + ".employeecode as employeecode_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " left join " + tel_rel_assets_tb + this.getSQLOn(tel_tb, tel_rel_assets_tb, ["pactid", "telno", "carid"]) + " and " + tel_rel_assets_tb + ".main_flg=true" + " left join " + assets_tb + this.getSQLOn(tel_rel_assets_tb, assets_tb, ["pactid", "assetsid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and " + assets_tb + ".assetsid is not null" + " and (coalesce(" + assets_tb + ".employeecode,'')!=''" + " or coalesce(" + user_tb + ".employeecode,'')!='')" + " and coalesce(" + assets_tb + ".employeecode,'')" + "!=coalesce(" + user_tb + ".employeecode,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckTelUserName(pactid: number, table_no: string | { [key: string]: any; }) //commflagがautoでなければ対象外とする
	{
		// 2022cvt_015
		var tel_tb = this.getTableName("tel_%", table_no);
		// 2022cvt_015
		var user_tb = "user_tb";
		// 2022cvt_015
		var carrier_tb = "carrier_tb";
		// 2022cvt_015
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".username as username_tel" + "," + user_tb + ".username as username_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where 1=1" + " and " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (" + " replace(" + "replace(coalesce(" + tel_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + " or " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + ")" + " and" + " replace(" + "replace(coalesce(" + tel_tb + ".username,'')," + "' ',''),'\u3000','')" + " != " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckTelMail(pactid: number, table_no: string | { [key: string]: any; }) //commflagがautoでなければ対象外とする
	{
		// 2022cvt_015
		var tel_tb = this.getTableName("tel_%", table_no);
		// 2022cvt_015
		var user_tb = "user_tb";
		// 2022cvt_015
		var carrier_tb = "carrier_tb";
		// 2022cvt_015
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".mail as mail_tel" + "," + user_tb + ".mail as mail_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (" + " coalesce(" + tel_tb + ".mail,'')!=''" + " or" + " coalesce(" + user_tb + ".mail,'')!=''" + ")" + " and" + " coalesce(" + tel_tb + ".mail,'')" + "!=" + " coalesce(" + user_tb + ".mail,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckAssetsUserName(pactid: number, table_no: string | { [key: string]: any; }) //端末と紐付く電話のcommflagがautoでなければ対象外とする
	{
		// 2022cvt_015
		var tel_tb = this.getTableName("tel_%", table_no);
		// 2022cvt_015
		var tel_rel_assets_tb = this.getTableName("tel_rel_assets_%", table_no);
		// 2022cvt_015
		var assets_tb = this.getTableName("assets_%", table_no);
		// 2022cvt_015
		var user_tb = "user_tb";
		// 2022cvt_015
		var carrier_tb = "carrier_tb";
		// 2022cvt_015
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + assets_tb + ".productname as productname" + "," + assets_tb + ".assetsid as assetsid" + "," + assets_tb + ".username as username_assets" + "," + user_tb + ".username as username_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " left join " + tel_rel_assets_tb + this.getSQLOn(tel_tb, tel_rel_assets_tb, ["pactid", "telno", "carid"]) + " and " + tel_rel_assets_tb + ".main_flg=true" + " left join " + assets_tb + this.getSQLOn(tel_rel_assets_tb, assets_tb, ["pactid", "assetsid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and " + assets_tb + ".assetsid is not null" + " and (" + " replace(" + "replace(coalesce(" + assets_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + " or " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + ")" + " and" + " replace(" + "replace(coalesce(" + assets_tb + ".username,'')," + "' ',''),'\u3000','')" + " != " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	async getHRMFileInfo() {
		// 2022cvt_015
		var sql = "select dstname,srctime,dstpost,srcpost,recdate" + " from fjp_hrm_file_copy_tb" + " where status=0" + " order by recdate desc" + " limit 1" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return false;
		}
		if (!result.length) {
			return Array();
		}
		return result[0];
	}

	getHRMFileInfoOld(recdate: string) {
		// 2022cvt_015
		var sql = "select dstname,srctime,dstpost,srcpost,recdate" + " from fjp_hrm_file_copy_tb" + " where status=0" + " and recdate<'" + this.escape(recdate) + "'" + " order by recdate" + ";";
		return this.getHashSafeLog(sql);
	}

	updateHRMFileInfoImport(recdate: string, is_ok: boolean) //取り込んだファイルのステータスを切り替える
	{
		if (!this.updateHRMFileInfo(recdate, is_ok ? FJP_FILE_COPY_STATUS_IMPORT_FIN : FJP_FILE_COPY_STATUS_IMPORT_FAIL, Array(), false)) {
			return false;
		};
		return this.updateHRMFileInfo(recdate, FJP_FILE_COPY_STATUS_OLD, [0], true);
	}

	updateHRMFileInfo(recdate: string, status: string | number, A_status: any[], is_last: boolean) {
		// 2022cvt_015
		var sql = "update fjp_hrm_file_copy_tb";
		sql += " set status=" + status;
		sql += " where 1=1";
		if (A_status.length) sql += " and status in (" + A_status.join(",") + ")";

		if (is_last) {
			sql += " and recdate<'" + this.escape(recdate) + "'";
		} else {
			sql += " and recdate='" + this.escape(recdate) + "'";
		}

		sql += ";";
		return this.querySafeLog(sql);
	}

	insertHRMFileInfo(status: number, srctime: string, dstname: string, srcpost: string, dstpost: string, recdate = "") {
		if (!recdate.length) {
			recdate = this.getCurrent();
		} else {
			if (recdate.length) {
				recdate = this.escape(recdate);
			}
			if ("'" != recdate[0]) {
				recdate = "'" + recdate;
			}
			if ("'" != recdate[recdate.length - 1]) {
				recdate += "'";
			}
		}
		// 2022cvt_015
		var sql = "insert into fjp_hrm_file_copy_tb" + "(recdate,status,srctime,dstname,srcpost,dstpost)values" + "(" + recdate + "," + status + ",'" + this.escape(srctime) + "+09'" + ",'" + this.escape(dstname) + "'" + ",'" + this.escape(srcpost) + "+09'" + ",'" + this.escape(dstpost) + "'" + ")" + ";";
		return this.querySafeLog(sql);
	}

	// 2022cvt_016
	async getHRMLastStatus(exectype = 0, is_exclude_minus = true) {
		// 2022cvt_016
		// 2022cvt_015
		var sql = "select status,waytype from fjp_hrm_status_index_tb" + " where exectype=" + exectype + (0 == exectype && is_exclude_minus ? " and waytype>=0" : "") + " order by recdate desc" + " limit 1" + ";";
		// 2022cvt_015
		var result = await this.getHashSafeLog(sql);
		if (!result) {
			return false;
		}
		if (!result.length || !result[0].length) {
			return Array();
		}
		return result[0];
	}

	// 2022cvt_016
	async insertHRMStatus(exectype: string, status: string, waytype: string | number, A_buffer: Array<any>, fname: string, seq = "") //シーケンスを採番する
	{
		var seq_1: boolean = false;
		if (!seq.length) {
			seq_1 = await this.getSeqStatusIndex();
		}
		if (false === seq_1) {
			return false;
		}
		// 2022cvt_015
		var cur = this.getCurrent();
		// 2022cvt_016
		// 2022cvt_015
		var sql = "insert into fjp_hrm_status_index_tb" + "(uniqueid,exectype,recdate,fixdate,status,waytype,is_send)" + "values" + "(" + seq + "," + exectype + "," + cur + "," + cur + "," + status + "," + waytype + ",false" + ");";
		if (!this.querySafeLog(sql)) {
			return false;
		}
		// 2022cvt_015
		var O_ins = fname.length ? new TableInserterSafe(this.m_O_log, this.m_O_db, fname, true) : new TableInserterSlowSafe(this.m_O_log, this.m_O_db);
		O_ins.setUnlock();
		if (!O_ins.begin("fjp_hrm_status_details_tb")) {
			return false;
		}
		// 2022cvt_015
		var detailno = 0;

		// 2022cvt_015
		for (var H_buffer of A_buffer) {
			// 2022cvt_016
			// 2022cvt_015
			var type = H_buffer.type + 0;
			// 2022cvt_015
			var pactid = H_buffer.pactid + 0;
			// 2022cvt_015
			var msg = H_buffer.message;

			if (!O_ins.insert({
				uniqueid: seq,
				detailno: detailno.toString(),
				pactid: pactid,
				// 2022cvt_016
				is_fjp: FJP_MAIL_FJP & type ? "true" : "false",
				// 2022cvt_016
				is_kcs: FJP_MAIL_KCS & type ? "true" : "false",
				// 2022cvt_016
				is_motion: FJP_MAIL_MOTION & type ? "true" : "false",
				message: msg
			})) {
				this.putDebug("pg_insert失敗");
				return false;
			}

			++detailno;
		}

		if (!O_ins.end()) {
			this.putDebug("pg_copy失敗");
			return false;
		}

		return true;
	}

	// 2022cvt_016
	async getHRMStatusIndex(A_exectype: { [key: string]: any }, A_status: { [key: string]: any } = {}, A_is_send: { [key: string]: any }, A_uniqueid: { [key: string]: any } = {}) {
		// 2022cvt_016
		// 2022cvt_015
		var sql = "select uniqueid,exectype,recdate,fixdate,status,waytype" + "," + this.getSQLBooleanToInt("is_send") + " as is_send" + " from fjp_hrm_status_index_tb" + " where 1=1";
		// 2022cvt_016
		if (A_exectype.length) {
			sql += " and exectype in (" + A_exectype.join(",") + ")";
		}
		if (A_status.length) {
			sql += " and status in (" + A_status.join(",") + ")";
		}

		if (A_is_send.length) {
			sql += " and (";

			// 2022cvt_015
			for (var cnt = 0; cnt < A_is_send.length; ++cnt) {
				if (cnt) {
					sql += " or";
				}
				sql += " is_send=" + (A_is_send[cnt] ? "true" : "false");
			}

			sql += ")";
		}

		if (A_uniqueid.length) {
			sql += " and uniqueid in (" + A_uniqueid.join(",") + ")";
		}
		sql += " order by recdate";
		sql += ";";
		return await this.getHashSafeLog(sql);
	}

	async getHRMStatusDetails(uniqueid: string) {
		// 2022cvt_015
		var sql = "select uniqueid,detailno,pactid,message" + "," + this.getSQLBooleanToInt("is_fjp") + " as is_fjp" + "," + this.getSQLBooleanToInt("is_kcs") + " as is_kcs" + "," + this.getSQLBooleanToInt("is_motion") + " as is_motion" + " from fjp_hrm_status_details_tb" + " where uniqueid=" + uniqueid + " order by detailno" + ";";
		return await this.getHashSafeLog(sql);
	}

	updateHRMStatusIndexIsSend(uniqueid, is_send = true) {
		// 2022cvt_015
		var sql = "update fjp_hrm_status_index_tb" + " set fixdate=" + this.getCurrent() + ",is_send=" + (is_send ? "true" : "false") + " where uniqueid=" + uniqueid + ";";
		return this.querySafeLog(sql);
	}

	async getHRMAddr() {
		// 2022cvt_015
		var sql = "select addr from fjp_hrm_addr_tb" + " order by detailno" + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_015
		var A_addr = Array();

		// 2022cvt_015
		for (var A_line of result) {
			// 2022cvt_015
			var addr = A_line[0];
			if (!addr.length) {
				continue;
			}
			A_addr.push(addr);
		}

		return A_addr;
	}

	async getHRMSchedule() {
		// 2022cvt_016
		// 2022cvt_015
		var sql = "select execdate,waytype from fjp_hrm_schedule_tb" + " order by execdate" + ";";
		return await this.getHashSafeLog(sql);
	}

	async getPactCompName() {
		// 2022cvt_015
		var sql = "select pactid,compname from pact_tb" + " order by pactid" + ";";
		// 2022cvt_015
		var result = await this.getAllSafeLog(sql);
		if (!result) {
			return false;
		}
		// 2022cvt_015
		var H_pact = Array();

		// 2022cvt_015
		for (var H_line of result) {
			H_pact[H_line[0]] = H_line[1];
		}

		return H_pact;
	}

};

//ログ
//データベース
//テーブル番号
//エラーハンドラ
//ログディレクトリ
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//エラーハンドラインスタンス
//ログディレクトリ
//機能：ログディレクトリを返す
//機能：ログを出力する
//引数：レベル
//内容
//機能：ログインスタンスを返す
//機能：テーブル番号を返す
//引数：年
//月
//機能：テーブル番号インスタンスを返す
//機能：エラーをハンドラに渡す
//引数：種別
//顧客ID
//メッセージ
//機能：実行結果をハンドラに渡す
//引数：値その1
//値その2
//メッセージ
//機能：ハンドラを返す
//機能：DBを返す
class FJPProcBaseType {
	m_O_log: ScriptLogBase;
	m_O_db: ScriptDB;
	m_O_table_no: TableNo;
	m_O_handler: FJPErrorHandlerBaseType;
	m_logdir: any;

	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, O_handler: FJPErrorHandlerBaseType, logdir: any) {
		this.m_O_log = O_log;
		this.m_O_db = O_db;
		this.m_O_table_no = O_table_no;
		this.m_O_handler = O_handler;
		this.m_logdir = logdir;
	}

	getLogDir() {
		return this.m_logdir;
	}

	// 2022cvt_016
	putLog(type: number, msg: string) {
		// 2022cvt_016
		this.m_O_log.put(type, msg);
	}

	getLog() {
		return this.m_O_log;
	}

	getTableNo(year: number, month: number) {
		return this.m_O_table_no.get(year, month);
	}

	getTableNoIns() {
		return this.m_O_table_no;
	}

	// 2022cvt_016
	putHandler(type: string, pactid: number, msg: string) {
		// 2022cvt_016
		this.m_O_handler.put(type, pactid, msg);
	}

	putHandlerResult(arg1: number, arg2: number, msg: string) {
		this.m_O_handler.putResult(arg1, arg2, msg);
	}

	getHandler() {
		return this.m_O_handler;
	}

	getDB() {
		return this.m_O_db;
	}

};

//設定ファイル
//設定ファイルの読み出しに失敗したらtrue
//年
//月
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//年
//月
//ログディレクトリ
//子プロセスではなく単独実行ならtrue
//設定ファイルのファイル名(省略したらデフォルト値)
//機能：文字列の右端がパス区切り文字でなければパス区切り文字を追加する
//引数：ディレクトリ
//パス区切り文字
//機能：設定ファイルの読み出しに失敗していたらtrueを返す
//機能：全社共通の設定を返す
//返値：FJPSettingType::getSettingAll()と同じ
//機能：ある顧客IDの設定を返す
//引数：顧客ID
//返値：FJPSettingType::getSetting()と同じ
//機能：KCSモーションの顧客IDを全て返す
//機能：KCSモーションの顧客IDを全て返す(スキップ機能付)
//引数：含めるID(空配列なら全て)
//含めないID
//機能：現在の年月を返す
class FJPProcChildBaseType extends FJPProcBaseType {
	m_year: string;
	m_month: string;
	m_O_setting: FJPSettingType;
	m_is_fail_setting: boolean;

	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year: string, month: string, logdir: any, is_standalone: boolean, fname_setting: string) //エラーハンドラを作る
	//基底型のコンストラクタを呼び出す
	//値を保存する
	//設定ファイルインスタンスを作る
	//設定ファイル名を作る
	{
		// 2022cvt_015
		var O_handler = new FJPErrorHandlerChildProcType(is_standalone);
		super(O_log, O_db, O_table_no, O_handler, logdir);
		this.m_year = year;
		this.m_month = month;
		// 2022cvt_015
		var is_ignore = false;
		this.m_O_setting = new FJPSettingType(O_handler, is_ignore);

		if (!fname_setting.length) {
			// 2022cvt_015
			var dir = this.addDelim(KCS_DIR);
			dir = this.addDelim(dir + FJP_SETTING_DIR);
			fname_setting = dir + FJP_SETTING_NAME;
		}

		this.m_is_fail_setting = !this.m_O_setting.read(fname_setting);

		if (this.m_is_fail_setting) {
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "設定ファイルの読み出しに失敗しました");
		}
	}

	addDelim(dir: string | any[], delim = "/") {
		if (!dir.length) {
			return dir;
		}
		// 2022cvt_022
		if (delim.localeCompare(dir[dir.length - 1])) {
			dir += "/";
		};
		return dir;
	}

	isFailSetting() {
		return this.m_is_fail_setting;
	}

	getSettingAll() {
		return this.m_O_setting.getSettingAll();
	}

	getSettingPact(pactid) {
		return this.m_O_setting.getSetting(pactid);
	}

	getSettingPactIDAll() {
		return this.m_O_setting.getPactIDAll();
	}

	getSettingPactIDSkip(A_in: Array<any>, A_out: Array<any>) {
		return this.m_O_setting.getPactIDSkip(A_in, A_out);
	}

	getYearMonth() {
		return {
			year: this.m_year,
			month: this.m_month
		};
	}

};

//コピー元のディレクトリ
//コピー先のディレクトリ
//0ならチェックのみ/1なら移動/2ならコピー
//ロックファイルを削除するならtrue
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//年
//月
//ログディレクトリ
//子プロセスではなく単独実行ならtrue
//設定ファイルのファイル名(省略したらデフォルト値)
//0ならチェックのみ/1なら移動/2ならコピー
//ロックファイルを削除するならtrue
//コピー元のディレクトリ(省略したらデフォルト値)
//コピー先のディレクトリ(省略したらデフォルト値)
//機能：ロックファイルが存在すればtrueを返す
//機能：ロックファイルを探した後に、すべての処理を行う
//引数：ロックファイルを探したままタイムアウトしたらtrue
//返値：失敗したらfalseを返す
//機能：データファイルをコピーする
//返値：失敗したらfalseを返す
//機能：タイムアウトした事をDBに記録する
//返値：失敗したらfalseを返す
//-----------------------------------------------------------------------
//機能：ディレクトリ名の%Yと%Mを現在の年月に置き換えて返す
//機能：データファイルのコピーを行う
//引数：ステータスを返す(0なら成功/1ならファイル無し/3ならエラー)
//人事ファイルのタイムスタンプを返す
//コピー先の人事ファイル名をフルパスで返す
//職制ファイルのタイムスタンプを返す
//コピー先の職制ファイル名をフルパスで返す
//返値：失敗したらfalseを返す
//機能：ステータスをDBに書き込む
//引数：0なら成功/1ならファイル無し/2なら時間切れ/3ならエラー
//人事ファイルのタイムスタンプ(YYYY/MM/DD HH:MM:SS)クォート無し
//コピー後の人事ファイル名
//職制ファイルのタイムスタンプ(YYYY/MM/DD HH:MM:SS)クォート無し
//コピー後の職制ファイル名
//返値：失敗したらfalseを返す
export default class FJPProcCopyType extends FJPProcChildBaseType {
	m_copy_mode: number;
	m_is_delete_lock: boolean;
	m_dir_from: any;
	m_dir_to: any;

	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year: string, month: string, logdir: any, is_standalone: boolean, fname_setting: string, copy_mode: number, is_delete_lock: boolean, dir_from: string, dir_to: string) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		this.m_copy_mode = copy_mode;
		this.m_is_delete_lock = is_delete_lock;
		this.m_dir_from = this.touchDir(dir_from.length ? dir_from : FJP_DIR_FROM);
		this.m_dir_to = this.touchDir(dir_to.length ? dir_to : FJP_DIR_TO_PRE + "%Y%M" + FJP_DIR_TO_POST);

		if (!this.isFailSetting()) {
			this.putLog(G_SCRIPT_DEBUG, "コピー元ディレクトリ" + this.m_dir_from);
			this.putLog(G_SCRIPT_DEBUG, "コピー先ディレクトリ" + this.m_dir_to);
			// 2022cvt_015
			var H_setting = this.getSettingAll();
			this.putLog(G_SCRIPT_DEBUG, "ロックファイル" + this.m_dir_from + H_setting.fname_lock);
			this.putLog(G_SCRIPT_DEBUG, "人事マスタファイル" + this.m_dir_from + H_setting.fname_user);
			this.putLog(G_SCRIPT_DEBUG, "職制マスタファイル" + this.m_dir_from + H_setting.fname_post);
		}
	}

	isReadyLock() {
		if (this.isFailSetting()) {
			return false;
		}
		// 2022cvt_015
		var H_setting = this.getSettingAll();
		if (!fs.existsSync(this.m_dir_from + H_setting.fname_lock)) {
			return false;
		}
		this.putLog(G_SCRIPT_DEBUG, "ロックファイル検出");
		return true;
	}

	execute(is_timeout: any) {
		if (this.isFailSetting()) {
			this.putHandlerResult(1, 0, "設定ファイル不正");
			return false;
		}

		// 2022cvt_015
		var H_setting = this.getSettingAll();

		if (is_timeout) {
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ステータスファイルが時間内に作成されませんでした" + H_setting.fname_lock);
			this.putLog(G_SCRIPT_DEBUG, "ロックファイル作成前にタイムアウト" + H_setting.fname_lock);
			this.putHandlerResult(1, 0, "タイムアウト");

			if (!this.insertTimeOut()) {
				return false;
			}

			return true;
		} else {
			if (!this.executeCopy()) {
				this.putHandlerResult(1, 0, "コピー失敗");
				return false;
			}
		}

		this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ファイルのコピーに成功しました");
		this.putHandlerResult(0, 0, "正常終了");
		return true;
	}

	executeCopy() {
		if (this.isFailSetting()) {
			return false;
		}
		// 2022cvt_015
		var status = { "value": 0 };
		// 2022cvt_015
		var srctime_user = { "value": "2000-01-01" };
		// 2022cvt_015
		var dstname_user = { "value": "" };
		// 2022cvt_015
		var srctime_post = { "value": srctime_user.value };
		// 2022cvt_015
		var dstname_post = { "value": dstname_user.value };
		if (!this.moveFile(status, srctime_user, dstname_user, srctime_post, dstname_post)) {
			return false;
		}
		return this.insertStatus(status.value, srctime_user.value, dstname_user.value, srctime_post.value, dstname_post.value);
	}

	insertTimeOut() {
		if (this.isFailSetting()) {
			return false;
		}
		return this.insertStatus(2, "2000-01-01", "", "2000-01-01", "");
	}

	touchDir(dir: string) {
		// 2022cvt_015
		var H_ym = this.getYearMonth();
		if (1 == H_ym.month.length) H_ym.month = "0" + H_ym.month;
		// 2022cvt_020
		dir = dir.replace("%Y", H_ym.year);
		// dir = str_replace("%Y", H_ym.year, dir);
		// 2022cvt_020
		dir = dir.replace("%M", H_ym.month);
		// dir = str_replace("%M", H_ym.month, dir);
		return dir;
	}

	moveFile(status: { [key: string]: number }, srctime_user: { [key: string]: string }, dstname_user: { [key: string]: string }, srctime_post: { [key: string]: string }, dstname_post: { [key: string]: string }) //コピー先のファイル名を採番する
	//コピー先のディレクトリが存在しなければ作成する
	//コピー元のファイル情報を取得する
	//コピーを行う
	{
		status.value = 3;
		// 2022cvt_015
		var H_setting = this.getSettingAll();
		// 2022cvt_015
		var tgtname = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".csv";

		if (!fs.existsSync(this.m_dir_to)) {
			try {
				fs.mkdirSync(this.m_dir_to, 777);
			} catch (e) {
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "コピー先のディレクトリの作成に失敗しました");
				this.putLog(G_SCRIPT_DEBUG, "ディレクトリ作成に失敗" + this.m_dir_to);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "ディレクトリ作成に成功" + this.m_dir_to);
		} else {
			this.putLog(G_SCRIPT_DEBUG, "ディレクトリは存在する" + this.m_dir_to);
		}

		dstname_user.value = this.m_dir_to + "U" + tgtname;
		dstname_post.value = this.m_dir_to + "P" + tgtname;
		// 2022cvt_015
		var from_user = this.m_dir_from + H_setting.fname_user;
		// 2022cvt_015
		var from_post = this.m_dir_from + H_setting.fname_post;

		if (!fs.existsSync(from_user)) {
		// if (!file_exists(from_user)) {
			status.value = 1;
			var path = PATH.parse(from_user);
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ステータスファイルはあるものの" + "コピーする人事マスタファイルがありませんでした" + path.base);
			this.putLog(G_SCRIPT_DEBUG, "ロックファイルはあるが人事マスタファイルが存在しない" + H_setting.fname_user);
			return false;
		}

		if (!fs.existsSync(from_post)) {
			status.value = 1;
			var path = PATH.parse(from_post);
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ステータスファイルはあるものの" + "コピーする職制マスタファイルがありませんでした" + path.base);
			this.putLog(G_SCRIPT_DEBUG, "ロックファイルはあるが職制マスタファイルが存在しない" + H_setting.fname_post);
			return false;
		}

		this.putLog(G_SCRIPT_DEBUG, "人事ファイル検出" + from_user);
		this.putLog(G_SCRIPT_DEBUG, "職制ファイル検出" + from_post);
		// 2022cvt_015
		// var tm = filemtime(from_user);
		var finfo = fs.lstatSync(from_user);
		srctime_user.value = finfo.mtime.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
		// srctime_user = date("Y/m/d H:i:s", tm);
		var finfo = fs.lstatSync(from_post);
		// tm = filemtime(from_post);
		srctime_post.value = finfo.mtime.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
		// srctime_post = date("Y/m/d H:i:s", tm);

		switch (this.m_copy_mode) {
			case 0:
				return false;
				break;

			case 1:
				try {
					fs.renameSync(from_user, dstname_user.value);
				} catch (e) {
					this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事ファイルの移動に失敗しました");
					this.putLog(G_SCRIPT_DEBUG, "人事ファイル移動に失敗" + " " + from_user + " " + dstname_user.value);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "人事ファイル移動に成功" + from_user + " " + dstname_user.value);

				try {
					fs.renameSync(from_post, dstname_post.value);
				} catch (e) {
					this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制ファイルの移動に失敗しました");
					this.putLog(G_SCRIPT_DEBUG, "職制ファイル移動に失敗" + " " + from_post + " " + dstname_post.value);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "職制ファイル移動に成功" + from_post + " " + dstname_post.value);
				break;

			case 2:
				try {
					fs.copyFileSync(from_user, dstname_user.value);
				} catch (e) {
					this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "人事ファイルのコピーに失敗しました");
					this.putLog(G_SCRIPT_DEBUG, "人事ファイルコピーに失敗" + " " + from_user + " " + dstname_user.value);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "人事ファイルコピーに成功" + from_user + " " + dstname_user.value);

				try {
					fs.copyFileSync(from_post, dstname_post.value);
				} catch (e) {
					this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "職制ファイルのコピーに失敗しました");
					this.putLog(G_SCRIPT_DEBUG, "職制ファイルコピーに失敗" + " " + from_post + " " + dstname_post.value);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "職制ファイルコピーに成功" + from_post + " " + dstname_post.value);
				break;
		}

		if (this.m_is_delete_lock) //移動なので削除する
		{
			try {
				fs.unlinkSync(this.m_dir_from + H_setting.fname_lock)
			} catch (e) {
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ロックファイルの削除に失敗しました");
				this.putLog(G_SCRIPT_DEBUG, "ロックファイルの削除に失敗" + this.m_dir_from + H_setting.fname_lock);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "ロックファイルの削除に成功" + this.m_dir_from + H_setting.fname_lock);
		} else {
			this.putLog(G_SCRIPT_DEBUG, "ロックファイルは削除せず" + this.m_dir_from + H_setting.fname_lock);
		}

		status.value = 0;
		return true;
	}

	insertStatus(status: number, srctime_user: string, dstname_user: string, srctime_post: string, dstname_post: string) //モデルを作成する
	//記録する
	{
		// 2022cvt_015
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());
		// 2022cvt_015
		var rval = O_model.insertHRMFileInfo(status, srctime_user, dstname_user, srctime_post, dstname_post);

		if (!rval) {
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, "ファイルのコピー結果の保存に失敗しました(DBへの記録)");
			this.putLog(G_SCRIPT_DEBUG, "ファイルコピー情報のDBへの挿入に失敗" + status + "/" + srctime_user + "/" + dstname_user + "/" + srctime_post + "/" + dstname_post);
		} else {
			this.putLog(G_SCRIPT_DEBUG, "ファイルコピー情報のDBへの挿入に成功" + status + "/" + srctime_user + "/" + dstname_user + "/" + srctime_post + "/" + dstname_post);
		}

		return rval;
	}

};

//人事マスタのファイル名(空文字列ならDBから読み出す)
//職制マスタのファイル名(空文字列ならDBから読み出す)
//DBからファイルを読む場合に、スケジュールを無視するならtrue
//スケジュールを無視する場合の、処理内容
//補正日数
//ファイルを移動・削除しないならtrue
//実行する会社コード(省略したら全社)(人事) ←先頭に"C"をつける
//実行しない会社コード(省略したら全社)(人事) ←先頭に"C"をつける
//実行する会社コード(省略したら全社)(職制) ←先頭に"C"をつける
//実行しない会社コード(省略したら全社)(職制) ←先頭に"C"をつける
//インポート前の状態を保存するならrue
//実行する会社ID(省略したら全社)
//実行しない会社ID(省略したら全社)
//人事なら1/職制なら2/人事・職制なら3
//職制コードの取り込み方法
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//年
//月
//ログディレクトリ
//子プロセスではなく単独実行ならtrue
//設定ファイルのファイル名(省略したらデフォルト値)
//人事マスタのファイル名(空文字列ならDBから読み出す)
//DBからファイルを読む場合に、スケジュールを無視するならtrue
//スケジュールを無視する場合の、処理内容
//補正日数
//ファイルを移動・削除しないならtrue(デバッグモード用)
//実行する会社コード(省略したら全社) ←先頭に"C"をつける
//実行しない会社コード(省略したら全社) ←先頭に"C"をつける
//インポート前の状態を保存するならtrue
//実行する会社ID(省略したら全社)
//実行しない会社ID(省略したら全社)
//職制コードの取り込み方法
//機能：インポートを行う
//引数：今日が何もしない日ならtrueを返す
//返値：失敗したらfalseを返す
//-----------------------------------------------------------------------
//機能：指定されたファイルをインポートする
//引数：モデル
//人事ファイル名
//職制ファイル名
//実行種別
//一社でも失敗したらtrueを返す
//返値：失敗したらfalseを返す
//機能：職制の取込を行う
//引数：顧客毎のログインスタンス
//顧客ID
//職制マスタ
//全社の設定
//顧客の設定
//現在か現在＋過去最新月か
//返値：エラーが発生したらfalseを返す
//機能：指定されたファイルを移動させる
//引数：人事ファイル名
//職制ファイル名
//成功ならtrue
//返値：失敗したらfalseを返す
//機能：指定されたファイルを削除する
//引数：FJPModelType::getHRMFileInfoOld()の返値
//返値：失敗したらfalseを返す
//機能：プロセス全体の成功・失敗を出力する
//-----------------------------------------------------------------------
//機能：今日の日付を返す
//返値：array(
//"year" => 年,
//"month" => 月,
//"date" => 日,
//);
//備考：補正日数の影響を受ける
//機能：日付を受け取って、日数だけ移動させて返す
//引数：getTodayが返す形式の日付
//補正日数
//返値：getTodayが返す形式の日付
//機能：今日の日付を受け取って、月末の日付にする
//引数：getTodayが返す形式の日付
//返値：getTodayが返す形式の日付
//機能：DBから読み出した内容と今日の日付から、実行すべき内容を返す
//引数：今日の日付
//FJPModelType::getHRMSchedule()の返値
//FJPModelType::getHRMLastStatus()の返値
//返値：実行方法を返す
//実行日で無ければfalseを返す
//備考：実行方法の優先順位は月末>当日>最後の失敗
export class FJPProcImportType extends FJPProcChildBaseType {
	m_fname_user: string;
	m_fname_post: string;
	m_is_ignore_schedule: string;
	m_waytype_ignore_schedule: boolean;
	m_diff_days: number;
	m_is_protect_file: string;
	m_A_code_in_user: Array<any>;
	m_A_code_out_user: Array<any>;
	m_A_code_in_post: Array<any>;
	m_A_code_out_post: Array<any>;
	m_is_save: string;
	m_A_pactid_in: Array<any>;
	m_A_pactid_out: Array<any>;
	m_waytype: number;
	m_userpostid_mode: string;

	// 2022cvt_016
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year: string, month: string, logdir: any, is_standalone: boolean, fname_setting: string, fname_user: string, fname_post: string, is_ignore_schedule: string, waytype_ignore_schedule: boolean, diff_days: number, is_protect_file: string, A_code_in_user: Array<any>, A_code_out_user: Array<any>, A_code_in_post: Array<any>, A_code_out_post: Array<any>, is_save: string, A_pactid_in: Array<any>, A_pactid_out: Array<any>, waytype: number, userpostid_mode: string) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		this.m_fname_user = fname_user;
		this.m_fname_post = fname_post;
		this.m_is_ignore_schedule = is_ignore_schedule;
		// 2022cvt_016
		this.m_waytype_ignore_schedule = waytype_ignore_schedule;
		this.m_diff_days = diff_days;
		this.m_is_protect_file = is_protect_file;
		this.m_A_code_in_user = A_code_in_user;
		this.m_A_code_out_user = A_code_out_user;
		this.m_A_code_in_post = A_code_in_post;
		this.m_A_code_out_post = A_code_out_post;
		this.m_is_save = is_save;
		this.m_A_pactid_in = A_pactid_in;
		this.m_A_pactid_out = A_pactid_out;
		// 2022cvt_016
		this.m_waytype = waytype;
		this.m_userpostid_mode = userpostid_mode;
	}

	async execute() {
		// 2022cvt_015
		var return_var = true;
		// 2022cvt_015
		var is_error = { "value": false };
		if (this.isFailSetting()) {
			return false;
		}
		// 2022cvt_015
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());

		if (this.m_fname_user.length || this.m_fname_post.length) //起動時オプションで指定されたファイルをインポートする
		//ファイルがあるか確認する
		{
			// 2022cvt_016
			if ((1 & this.m_waytype) && !this.m_fname_user.length) {
				// 2022cvt_015
				var msg = FJP_ERRMSG_COMMON + "(人事マスタのファイル名が指定されていない)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			// 2022cvt_016
			if (2 & this.m_waytype && !this.m_fname_post.length) {
				msg = FJP_ERRMSG_COMMON + "(職制マスタのファイル名が指定されていない)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			// 2022cvt_016
			// 2022cvt_015
			var is_ok = this.executeFile(O_model, this.m_fname_user, this.m_fname_post, this.m_waytype_ignore_schedule, is_error);

			if (!is_ok) {
				msg = FJP_ERRMSG_COMMON + "(ファイルのインポート)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
			}

			if (!this.finishFile(this.m_fname_user, this.m_fname_post, is_ok)) {
				msg = FJP_ERRMSG_COMMON + "(インポート完了後のファイル移動)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				is_ok = false;
			}

			this.putResult(!is_error.value);
		} else //DBからファイル名を取り出す
		//最新のファイルを取り出す
		//ステータスを書き換える前に、古いファイルを取得する
		//ステータスを書き換える
		//最新より古いファイルは削除する
		//インポート完了後のファイルを移動する
		//結果を出力する
		{
			// 2022cvt_016
			// 2022cvt_015
			var waytype = false;

			if (this.m_is_ignore_schedule) //スケジュールを無視してDBの最新ファイルをインポートする
			{
				// 2022cvt_016
				waytype = this.m_waytype_ignore_schedule;
			} else //スケジュールに従いDBのファイルをインポートする
			{
				// 2022cvt_015
				var A_schedule = await O_model.getHRMSchedule();
				// 2022cvt_015
				var H_result = await O_model.getHRMLastStatus();

				if (A_schedule && H_result) {
					// 2022cvt_016
					waytype = this.resolve(this.getToday(), A_schedule, H_result);
				}

				// 2022cvt_016
				if (false === waytype) //インポートの実行日ではない
				{
					this.putLog(G_SCRIPT_DEBUG, "取込実行日ではない");
					this.putHandlerResult(-1, FJP_MAIL_ALL, "取込実行日ではない");
					return true;
				}
			}

			// 2022cvt_015
			var H_file = await O_model.getHRMFileInfo();

			if (!H_file) //ファイルの取得に失敗した
			{
				msg = FJP_ERRMSG_COMMON + "(インポートできるファイルの取得に失敗した)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			if (!H_file.length) //インポートできるファイルが存在しない
			{
				msg = FJP_ERRMSG_COMMON + "(インポートできるファイルが無い)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			// 2022cvt_016
			is_ok = this.executeFile(O_model, H_file.dstname, H_file.dstpost, waytype, is_error);

			if (!is_ok) {
				msg = FJP_ERRMSG_COMMON + "(ファイルのインポート)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
			}

			this.putLog(G_SCRIPT_DEBUG, "インポート" + (is_ok ? "成功" : "失敗"));
			// 2022cvt_015
			var A_file = await O_model.getHRMFileInfoOld(H_file.recdate);

			if (!O_model.updateHRMFileInfoImport(H_file.recdate, is_ok)) {
				msg = FJP_ERRMSG_COMMON + "(ステータスの更新)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "ステータス更新成功");

			if (!A_file) {
				msg = FJP_ERRMSG_COMMON + "(取り込んだファイルより古いファイル情報の取得)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			if (!this.deleteOld(A_file)) {
				msg = FJP_ERRMSG_COMMON + "(取り込んだファイルより古いファイルの削除)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "古いファイルの削除成功");

			if (!this.finishFile(H_file.dstname, H_file.dstpost, is_ok)) {
				msg = FJP_ERRMSG_COMMON + "(インポート完了後のファイル移動)";
				this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putResult(false);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "インポート完了後のファイル移動成功");
			this.putResult(!is_error.value);
		}

		// 2022cvt_015
		return return_var;
	}

	// 2022cvt_016
	executeFile(O_model: FJPModelType, fname_user: string, fname_post: string, waytype: number | boolean, is_error: { [key: string]: boolean }) //全社共通の設定を読み出す
	//年月からテーブル番号を作る
	//人事マスタを読み出す
	{
		is_error.value = false;
		// 2022cvt_015
		var logdir = this.getLogDir();
		// 2022cvt_015
		var H_setting_all = this.getSettingAll();
		// 2022cvt_015
		var A_pactid_all = this.getSettingPactIDAll();
		// 2022cvt_015
		var A_pactid_skip = this.getSettingPactIDSkip(this.m_A_pactid_in, this.m_A_pactid_out);
		O_model.setColumn(H_setting_all.column_id, H_setting_all.column_name);
		// 2022cvt_015
		var H_ym = this.getYearMonth();
		// 2022cvt_015
		var table_no = this.getTableNo(parseInt(H_ym.year), parseInt(H_ym.month));
		// 2022cvt_015
		var O_user!: FJPMasterUserType;

		// 2022cvt_016
		if (1 & this.m_waytype) {
			O_user = new FJPMasterUserType(this.getHandler(), false, this.m_userpostid_mode);

			// 2022cvt_015
			for (var pactid of A_pactid_all) {
				// 2022cvt_015
				var H_setting = this.getSettingPact(pactid);
				if (!H_setting.length) {
					continue;
				}
				O_user.addPact(pactid, H_setting.A_code_user);
			}

			O_user.setSkip(this.m_A_pactid_in, this.m_A_pactid_out, this.m_A_code_in_user, this.m_A_code_out_user);

			if (!O_user.read(fname_user) || O_user.isFail()) {
				is_error.value = true;
				return false;
			}
		}

		// 2022cvt_015
		var O_post!: FJPMasterPostType;

		// 2022cvt_016
		if (2 & this.m_waytype) {
			O_post = new FJPMasterPostType(this.getHandler(), false, this.m_userpostid_mode);
			O_post.addIgnoreAll(H_setting_all.A_ignore, H_setting_all.A_skip_postcode);

			// 2022cvt_015
			for (var pactid of A_pactid_all) {
				H_setting = this.getSettingPact(pactid);
				O_post.addPact(pactid, H_setting.A_code_post);
				O_post.addIgnore(pactid, H_setting.A_ignore);
			}

			O_post.setSkip(this.m_A_pactid_in, this.m_A_pactid_out, this.m_A_code_in_post, this.m_A_code_out_post);

			if (!O_post.read(fname_post) || O_post.isFail()) {
				is_error.value = true;
				return false;
			}
		}

		// 2022cvt_015
		var msg = "処理するpactid:=" + A_pactid_skip.join(",");
		this.putLog(G_SCRIPT_DEBUG, msg);
		// 2022cvt_015
		var return_var = false;

		// 2022cvt_015
		for (var pactid of A_pactid_skip) //人事と職制のどちらかにデータが無ければ警告を出す
		//会社毎のログディレクトリを作成する
		//職制の取込を行う
		{
			H_setting = this.getSettingPact(pactid);
			// 2022cvt_015
			var is_ok = true;

			if (undefined !== O_user && undefined !== O_post) {
				if (!O_user!.isIn(pactid) && O_post!.isIn(pactid)) {
					msg = "職制マスタにある顧客のデータが、" + "人事マスタにありませんでした" + "(pactid=" + pactid + ")";
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
					continue;
				}

				if (!O_post!.isIn(pactid) && O_user!.isIn(pactid)) {
					msg = "人事マスタにある顧客のデータが、" + "職制マスタにありませんでした" + "(pactid=" + pactid + ")";
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
					continue;
				}
			}

			// 2022cvt_015
			var is_in_user = null !== O_user && O_user!.isIn(pactid);
			// 2022cvt_015
			var is_in_post = null !== O_post && O_post!.isIn(pactid);

			if (!(is_in_user || is_in_post)) {
				msg = "顧客のデータが、" + "人事マスタ・職制マスタにありませんでした" + "(pactid=" + pactid + ")(スキップ)";
				this.putLog(G_SCRIPT_DEBUG, msg);
				continue;
			}

			this.putLog(G_SCRIPT_DEBUG, "顧客処理開始:" + pactid);
			// 2022cvt_015
			var O_log = this.getLog();
			// 2022cvt_015
			var O_pact_log = new FJPProcessLog();
			O_pact_log.putListener(O_log);
			// 2022cvt_021
			O_pact_log.setPath(O_log, logdir, pactid + "_" + sprintf("%04d%02d", H_ym.year, H_ym.month) + "/");
			O_model.setLogIns(O_pact_log);

			if (is_ok && undefined !== O_post) {
				// 2022cvt_016
				is_ok = this.executePactPost(O_pact_log, pactid, O_post!, H_setting_all, H_setting, waytype);
			}

			if (is_ok && undefined !== O_user) {
				if (this.m_is_save) //インポート前にこの会社の状態を保存する
				{
					// 2022cvt_015
					var A_table = ["user_tb", "fnc_relation_tb", "tel_rel_tel_reserve_tb", "assets_reserve_tb", "tel_rel_assets_reserve_tb", "tel_reserve_tb", "tel_tb", "assets_tb"];

					// 2022cvt_016
					if (FJP_WAYTYPE_CUR_NEW == waytype) {
						A_table.push("tel_" + table_no + "_tb");
						A_table.push("assets_" + table_no + "_tb");
					}

					// 2022cvt_015
					var O_db = this.getDB();

					// 2022cvt_015
					for (var table of A_table) {
						O_db.backup(O_pact_log.m_path + table + ".delete", "select * from " + table + " where pactid=" + pactid + ";");
					}
				}

				O_model.begin(FJP_SAVEPOINT_NAME + "executePact");
				// 2022cvt_016
				// 2022cvt_015
				var is_ok_import = O_model.executePact(O_user!.get(pactid), waytype, table_no, H_setting_all, pactid, H_setting, O_pact_log.m_path, true);
				O_model.end(is_ok_import, FJP_SAVEPOINT_NAME + "executePact");
				is_ok &&= is_ok_import;
			}

			O_model.setLogIns(O_log);
			// delete O_pact_log;
			this.putLog(G_SCRIPT_DEBUG, "顧客処理終了:" + pactid + ":" + (is_ok ? "成功" : "失敗"));
			// 2022cvt_015
			return_var ||= is_ok;
			if (!is_ok) {
				is_error.value = true;
			}
		}

		// 2022cvt_015
		return return_var;
	}

	// 2022cvt_016
	executePactPost(O_pact_log: ScriptLogBase, pactid: number, O_post: FJPMasterPostType, H_setting_all: {} | any[], H_setting: { [key: string]: any }, waytype: number | boolean) //職制中間ファイルを作成する
	//職制バッチを呼び出す
	//中間ログファイルを読み出す
	{
		// 2022cvt_015
		var dir = KCS_DIR + FJP_POST_DIR;
		// 2022cvt_020
		dir = dir.replace("%P", pactid.toString());
		// 2022cvt_021
		// 2022cvt_020
		dir = dir.replace("%Y", sprintf("%04d%02d", (new Date().getFullYear()).toString(), (new Date().getMonth() + 1).toString()));

		if (!fs.existsSync(dir)) {
			try {
				fs.mkdirSync(dir, 777)
			} catch (e) {
				// 2022cvt_015
				var msg = "ディレクトリの作成に失敗しました";
				this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
				msg += dir;
				this.putLog(G_SCRIPT_DEBUG, msg);
				return false;
			}
		}

		// 2022cvt_015
		var fname = dir + FJP_POST_PROTECT;
		// 2022cvt_015
		try {
			var fp = fs.openSync(fname, "wt");
		} catch (e) {
			msg = "ディレクトリの作成に失敗しました";
			this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		}
		// var fp = fopen(fname, "wt");

		// 2022cvt_015
		for (var code of H_setting.A_postcode_protected) //先頭のPを取る
		{
			// 2022cvt_015
			var code = code.substring(1);
			fs.writeFileSync(fp, code + "\n");// 2022cvt_006
		}

		// fclose(fp);
		fs.closeSync(fp);
		fname = dir + FJP_POST_POST;

		if (!O_post.createFile(pactid, fname)) {
			return false;
		}

		fname = O_pact_log.m_path + "post.log";
		// 2022cvt_015
		var O_proc = new ScriptCommandSafe(O_pact_log, false, G_SCRIPT_DEBUG);
		// 2022cvt_015
		var A_arg = [{
			key: "n",
			// 2022cvt_016
			value: FJP_WAYTYPE_CUR_NEW == waytype ? 1 : 0
		}, {
			key: "l",
			value: fname
		}, {
			key: "p",
			value: pactid
		}];
		// 2022cvt_015
		var status = O_proc.execute(G_PHP + " " + FJP_POST_PROC, A_arg, Array());
		var text = "";
		try {
			var buffer = fs.readFileSync(fname);
			var is_ok = false;
			// 2022cvt_015
			var is_ng = false;

			var text = Encoding.convert(buffer, {
				to: 'SJIS',
				from: 'UNICODE',
				type: 'string'
			})
			var lines = text.toString().split("\r\n");

			for (var line of lines) {
			// while (false !== (line = fgets(fp))) {
				if (line.length && "\n" === line.substring(line.length - 1)) {
					line = line.substring(0, line.length - 1);
				}
				if (line.length && "\r" === line.substring(line.length - 1)) {
					line = line.substring(0, line.length - 1);
				}
				this.putLog(G_SCRIPT_DEBUG, "中間ファイル(pactid:=" + pactid + ")" + line);
				// 2022cvt_015
				var A_line = line.split("\t");

				if (3 <= A_line.length && pactid.toString() == A_line[0] && "status" == A_line[1]) {
					if ("ok" === A_line[2]) {
						is_ok = true;
					} else if ("ng" === A_line[2]) {
						is_ng = false;
					}
				}
			}
		} catch (e) {
			msg = FJP_POST_PROC + "を実行しましたが、" + "結果ファイルが作成されませんでした";
			this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		}

			// fclose(fp);

		if (is_ok) {
			msg = FJP_POST_PROC + "の実行に成功しました";
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
		} else if (is_ng) {
			msg = FJP_POST_PROC + "の実行に失敗しました";
			this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		} else {
			msg = FJP_POST_PROC + "を実行しましたが、" + "ステータスが出力されませんでした";
			this.putHandler(FJP_MAIL_ALL.toString(), pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		}

		return true;
	}

	finishFile(fname_user: string, fname_post: string, is_ok: boolean) //移動先ディレクトリを決定する
	//ファイルが保護されているか
	{
		// 2022cvt_015
		var H_ym = this.getYearMonth();
		// 2022cvt_021
		// 2022cvt_015
		var dir = FJP_DIR_TO_PRE + sprintf("%04d%02d", H_ym.year, H_ym.month) + FJP_DIR_TO_POST + (is_ok ? FJP_DIR_TO_FIN : FJP_DIR_TO_FAIL);

		if (this.m_is_protect_file) //ファイルが保護されているので移動しない
		{
			this.putLog(G_SCRIPT_DEBUG, "ファイル移動せず" + "移動先は" + dir);
			return true;
		}

		if (!fs.existsSync(dir)) {
		// if (!file_exists(dir)) {
			try {
				fs.mkdirSync(dir, 777)
			} catch (e) {
				this.putLog(G_SCRIPT_DEBUG, "ディレクトリ作成失敗" + dir);
				return false;
			}
		}

		// 2022cvt_015
		var A_fname = Array();
		// 2022cvt_016
		if (1 & this.m_waytype) {
			A_fname.push(fname_user);
		}
		// 2022cvt_016
		if (2 & this.m_waytype) {
			A_fname.push(fname_post);
		}

		// 2022cvt_015
		for (var fname of A_fname) {
			var path = PATH.parse(fname);
			try {
				fs.renameSync(fname, dir + path.base);
			} catch (e) {
				this.putLog(G_SCRIPT_DEBUG, "ディレクトリ作成失敗" + dir + path.base);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "ファイル移動成功" + dir + path.base);
		}

		return true;
	}

	deleteOld(A_info: Array<any>) {
		if (!A_info) {
			return false;
		}

		// 2022cvt_015
		for (var H_info of A_info) //ファイルが保護されているか
		{
			if (this.m_is_protect_file) //ファイルが保護されているので削除しない
			{
				this.putLog(G_SCRIPT_DEBUG, "ファイル削除せず" + H_info.dstname + " " + H_info.dstpost);
				continue;
			}

			// 2022cvt_015
			var A_fname = Array();
			A_fname.push(H_info.dstname);
			A_fname.push(H_info.dstpost);

			// 2022cvt_015
			for (var fname of A_fname) {
				if (!fname.length) {
					continue;
				}

				if (!fs.existsSync(fname)) {
				// if (!file_exists(fname)) {
					this.putLog(G_SCRIPT_DEBUG, "古いファイルが存在しない" + fname);
					continue;
				}

				try {
					fs.unlinkSync(fname);
				} catch (e) {
					this.putLog(G_SCRIPT_DEBUG, "古いファイルの削除失敗" + fname);
					continue;
				}

				this.putLog(G_SCRIPT_DEBUG, "古いファイルの削除成功" + fname);
			}
		}

		return true;
	}

	putResult(is_ok: boolean) {
		if (is_ok) //成功した
		{
			// 2022cvt_015
			var msg = "取込に成功しました" + " " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_DEBUG, msg);
			this.putHandlerResult(0, FJP_MAIL_ALL, "正常終了");
		} else //失敗した
		{
			msg = "取込に失敗しました" + " " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_DEBUG, msg);
			this.putHandlerResult(1, FJP_MAIL_ALL, "失敗");
		}
	}

	getToday() {
		// 2022cvt_015
		var H_ymd = {
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			date:  new Date().toJSON().slice(0,10).replace(/-/g,',')
		};
		return this.moveDate(H_ymd, this.m_diff_days);
	}

	moveDate(H_ymd: { [key: string]: any }, diff: number) //タイムスタンプにする
	//補正日数を加算する
	//年月日をタイムスタンプから取り出す
	{
		// 2022cvt_015
		var tm = new Date(H_ymd.year, H_ymd.month, H_ymd.date, 0,  0, 0);
		// var tm = mktime(0, 0, 0, H_ymd.month, H_ymd.date, H_ymd.year);
		tm.setDate(tm.getDate() + diff);
		return {
			year: tm.getFullYear(),
			month: tm.getMonth() + 1,
			date: tm.getDate()
		};
	}

	getLastDate(H_ymd: { [key: string]: any }) //翌月にする
	//一日前の日付を返す
	{
		H_ymd.month = 1 + H_ymd.month;

		if (13 == H_ymd.month) {
			H_ymd.year = 1 + H_ymd.year;
			H_ymd.month = 1;
		}

		H_ymd.date = 1;
		return this.moveDate(H_ymd, -1);
	}

	resolve(H_today: { [key: string]: any }, A_schedule: Array<any>, H_result: { [key: string]: any }) //月末の日付を作る
	//月末のスケジュールがあり、今日が月末なら最高優先度
	//最後の実行結果が失敗なら、第三優先度
	{
		// 2022cvt_015
		var H_last_date = this.getLastDate(H_today);
		// 2022cvt_015
		var last_date = H_last_date.date;

		if (last_date == H_today.date) //今日は月末である
		{
			// 2022cvt_015
			for (var H_schedule of A_schedule) {
				if (32 == H_schedule.execdate) //月末の実行指示がある
				{
					// 2022cvt_016
					return H_schedule.waytype;
				}
			}
		}

		// 2022cvt_015
		for (var H_schedule of A_schedule) {
			if (H_today.date == H_schedule.execdate) //今日の日付の実行指示がある
			{
				// 2022cvt_016
				return H_schedule.waytype;
			}
		}

		// 2022cvt_016
		if (H_result && undefined !== H_result.status && undefined !== H_result.waytype && 0 != H_result.status) //最後の実行結果があり、失敗である
		{
			// 2022cvt_016
			return H_result.waytype;
		}

		return false;
	}

};

//0なら現在のみ/1なら現在＋過去最新月
//処理する顧客ID(省略したら全顧客)
//除外する顧客ID(省略したら全顧客)
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//年
//月
//ログディレクトリ
//子プロセスではなく単独実行ならtrue
//設定ファイルのファイル名(省略したらデフォルト値)
//0なら現在のみ/1なら現在＋過去最新月/2ならすべて
//処理する顧客ID(省略したら全顧客)
//除外する顧客ID(省略したら全顧客)
//機能：事前チェックを行う
//返値：失敗したらfalseを返す
class FJPProcCheckType extends FJPProcChildBaseType {
	m_waytype: number;
	m_A_pactid_in: Array<any>;
	m_A_pactid_out: Array<any>;

	// 2022cvt_016
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year: string, month: string, logdir: any, is_standalone: boolean, fname_setting: string, waytype: number, A_pactid_in: Array<any>, A_pactid_out: Array<any>) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		// 2022cvt_016
		this.m_waytype = waytype;
		this.m_A_pactid_in = A_pactid_in;
		this.m_A_pactid_out = A_pactid_out;
	}

	execute() //実行するテーブル名を作る
	{
		if (this.isFailSetting()) {
			return false;
		}
		// 2022cvt_015
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());
		// 2022cvt_015
		var A_table_no: Array<any> = [""];
		// 2022cvt_016
		// 2022cvt_015
		var waytype_label = "最新";

		// 2022cvt_016
		if (FJP_WAYTYPE_CUR_NEW == this.m_waytype) {
			// 2022cvt_015
			var H_ym = this.getYearMonth();
			// 2022cvt_015
			var table_no = this.getTableNo(parseInt(H_ym.year), parseInt(H_ym.month));
			A_table_no.push(table_no);
			// 2022cvt_016
			waytype_label = "最新と" + H_ym.year + "/" + H_ym.month + "のデータ";
			// 2022cvt_016
		} else if (2 == this.m_waytype) {
			// 2022cvt_015
			for (var cnt = 1; cnt <= 24; ++cnt) {
				// 2022cvt_015
				var v = cnt.toString();
				if (v.length < 2) {
					v = "0" + v;
				}
				A_table_no.push(v);
			}

			// 2022cvt_016
			waytype_label = "全て";
		}

		// 2022cvt_015
		var A_pactid_fail = Array();

		if (!O_model.executePreCheckAll(A_pactid_fail, this.m_A_pactid_in, this.m_A_pactid_out, A_table_no)) //不正終了した
		{
			// 2022cvt_015
			var msg = "予期しない理由で、" + "事前検査に失敗しました" + "(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
			msg += ")。";
			// 2022cvt_016
			msg += "実行内容は" + waytype_label + "です。";
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_DEBUG, msg);
			this.putHandlerResult(1, FJP_MAIL_ALL, "正常終了(問題あり)");
			return false;
		}

		if (A_pactid_fail.length) //正常終了し、検査に失敗した顧客がある
		{
			msg = "事前検査を行いました" + "(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
			msg += ")問題のある顧客が見つかりました";
			msg += "(pactidは" + A_pactid_fail.join(",") + ")";
			// 2022cvt_016
			msg += "実行内容は" + waytype_label + "です。";
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_DEBUG, msg);
			this.putHandlerResult(1, FJP_MAIL_ALL, "正常終了(問題あり)");
			return true;
		}

		msg = "事前検査に成功しました" + "(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/");
		msg += ")問題のある顧客はありませんでした。";
		// 2022cvt_016
		msg += "実行内容は" + waytype_label + "です。";
		this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
		this.putLog(G_SCRIPT_DEBUG, msg);
		this.putHandlerResult(0, FJP_MAIL_ALL, "正常終了(問題無し)");
		return true;
	}

};

//エラーハンドラ
//実行コマンド
//実行コマンドの解説
//バッチ種別
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//ログディレクトリ
//実行コマンド
//実行コマンドの解説
//バッチ種別
//取込バッチの実行方法(取込バッチ以外はゼロ固定)
//機能：子プロセスを実行する
//引数：エラーなら1/成功なら0/結果を無視するなら-1を返す
//子プロセスの実行結果を返す
//子プロセスが標準出力に出力した内容を返す
//返値：失敗したらfalseを返す
//機能：子プロセスの実行結果をDBに書き込む
//引数：エラーなら1/成功なら0/結果を無視するなら-1
//子プロセスの実行結果
//子プロセスが標準出力に出力した内容
//返値：失敗したらfalseを返す
export class FJPProcParentType extends FJPProcBaseType {
	m_command: string;
	m_label: string;
	m_exectype: string;

	// 2022cvt_016
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, logdir: any, command: string, label: string, exectype: string) {
		var errorHandle = new FJPErrorHandlerBufferType();
		super(O_log, O_db, O_table_no, errorHandle, logdir);
		this.m_O_handler = errorHandle;
		this.m_command = command;
		this.m_label = label;
		// 2022cvt_016
		this.m_exectype = exectype;
	}

	executeChild(status: number, H_result: { [key: string]: any }, A_buffer: {} | any[]) //子プロセスのインスタンスを作る
	//プロセスを実行する
	//$H_resultが空配列なら、子プロセスが結果を書き込んでいない
	//$is_okがfalseなら、子プロセスから解釈不能なメッセージが出力された
	// 2022cvt_015
	//$return_varは、子プロセスの返値(エラー判別には使わない)
	// 2022cvt_016
	//$H_result["type"]が-1なら、何もしない
	{
		H_result = Array();
		A_buffer = Array();
		// 2022cvt_015
		var O_child = new FJPChildProcType(this.getLog(), this.m_O_handler);
		// 2022cvt_015
		var return_var = { "value": 0 };
		// 2022cvt_015
		var is_ok = O_child.exec(this.m_command, return_var);
		H_result = this.m_O_handler.getResult();

		// 2022cvt_016
		if (undefined !== H_result.type && -1 == H_result.type) {
			// 2022cvt_016
			// 2022cvt_015
			var msg = this.m_label + "プロセス実行結果" + H_result.type + "なので実行記録を残さず終了" + " " + H_result.pactid + " " + H_result.msg;
			this.putLog(G_SCRIPT_DEBUG, msg);
			status = -1;
			return true;
		}

		status = 0;

		if (!H_result.length) //子プロセスが実行結果を出力しなかった(不正終了している)
		{
			msg = this.m_label;
			msg += "プロセスが不正終了しました";
			this.putHandler(FJP_MAIL_ALL.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_WARNING, msg);
			status = 1;
		} else //子プロセスが実行結果を出力した
		{
			// 2022cvt_016
			msg = this.m_label + "プロセス実行結果" + H_result.type + " " + H_result.pactid + " " + H_result.msg;
			this.putHandler(FJP_MAIL_KCS.toString() || FJP_MAIL_MOTION.toString(), FJP_MAIL_ALL, msg);
			this.putLog(G_SCRIPT_DEBUG, msg);
			// 2022cvt_016
			status = H_result.type;
		}

		A_buffer = this.m_O_handler.get();
		return true;
	}

	executeInsert(status: string, H_result: { [key: string]: any }, A_buffer: Array<any>) //モデルを作成する
	//実行結果をメールとして保存する
	//改行が含まれる可能性があるので低速版を使う
	{
		// 2022cvt_015
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.m_O_handler);

		// 2022cvt_015
		for (var cnt = 0; cnt < A_buffer.length; ++cnt) {
			A_buffer[cnt] = {
				// 2022cvt_016
				type: A_buffer[cnt].type,
				pactid: A_buffer[cnt].pactid,
				message: A_buffer[cnt].msg
			};
		}

		// 2022cvt_016
		// 2022cvt_015
		var waytype = -1;
		// 2022cvt_016
		if (undefined !== H_result.pactid) {
			waytype = H_result.pactid;
		}
		// 2022cvt_016
		return O_model.insertHRMStatus(this.m_exectype, status, waytype, A_buffer, "");
	}

};

//エラーハンドラ(通常は使用しない)
//デバッグモード
//0	そのまま送信
//1	送信せず、送信内容を画面に表示
//2	送信先をデバッグ用に切り替えて送信
//デバッグ用の送信先
//メールのサブジェクト
//メールのBcc
//送信先情報
//送信対象にするバッチ種別
//送信対象にするステータス
//送信対象にする送信済ステータス
//送信対象にするユニークID
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//ログディレクトリ
//デバッグモード
//デバッグ用の送信先(空文字列ならG_MAIL_TO)
//DBから読み出したアドレスへのメールのサブジェクト
//サブジェクトの前後に解説を追加しないならtrue
//DBから読み出したアドレスへのメールのBcc
//送信先情報
//送信対象にするバッチ種別
//送信対象にするステータス
//送信対象にする送信済ステータス
//送信対象にするユニークID
//備考：送信先情報は以下の形式
//array(
//array(
// 2022cvt_016
//"type" => 送信種別,
//"to" => array(To:のアドレス...),
//"bcc" => array(Bcc:のアドレス),
//"subject" => サブジェクト,
//),
//...
//);
//ただし、bccとsubjectは省略可能
//その場合はDBから読み出したアドレスと同じ
//機能：メールを送信する
//返値：失敗したらfalseを返す
//機能：メールを送信する
//返値：失敗したらfalseを返す
//機能：バッチ種別の解説文字列を返す
//引数：バッチ種別
//引数：実行ステータスの解説文字列を返す
//引数：fjp_hrm_status_index_tbのstatus
export class FJPProcMailType extends FJPProcBaseType {
	m_debug_mode: string;
	m_debug_addr: string;
	m_subject: { [key: string]: any };
	m_is_fix_subject: { [key: string]: any };
	m_A_bcc: { [key: string]: any };
	m_A_addr_param: Array<any>;
	m_A_exectype: { [key: string]: any };
	m_A_status: { [key: string]: any };
	m_A_is_send: { [key: string]: any };
	m_A_uniqueid: { [key: string]: any };

	// 2022cvt_016
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, logdir: any, debug_mode: string, debug_addr: string, subject: { [key: string]: any; }, is_fix_subject: { [key: string]: any; }, A_bcc: {} | any[], A_addr_param: Array<any>, A_exectype: {} | any[], A_status: {} | any[], A_is_send: {} | any[], A_uniqueid: {} | any[]) {
		var errorHandle = new FJPErrorHandlerBufferType();
		super(O_log, O_db, O_table_no, errorHandle, logdir);
		this.m_O_handler = errorHandle;
		this.m_debug_mode = debug_mode;
		this.m_debug_addr = debug_addr;
		this.m_subject = subject;
		this.m_is_fix_subject = is_fix_subject;
		this.m_A_bcc = A_bcc;
		this.m_A_addr_param = A_addr_param;
		// 2022cvt_016
		this.m_A_exectype = A_exectype;
		this.m_A_status = A_status;
		this.m_A_is_send = A_is_send;
		this.m_A_uniqueid = A_uniqueid;
	}

	execute() //ハンドラに出力されたメッセージをログに残す
	{
		// 2022cvt_015
		var rval = this.doExecute();
		// 2022cvt_015
		var A_buffer = this.m_O_handler.get();

		// 2022cvt_015
		for (var H_buffer of A_buffer) {
			// 2022cvt_016
			this.putLog(G_SCRIPT_WARNING, H_buffer.msg + " " + H_buffer.type + " " + H_buffer.pactid);
		}

		return rval;
	}

	async doExecute() //モデルを作成する
	//社名一覧を取り出す
	//送信先アドレスを取得する
	//メール送信の親を読み出す
	{
		// 2022cvt_015
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.m_O_handler);
		// 2022cvt_015
		var H_pact = await O_model.getPactCompName();

		if (false === H_pact) {
			this.putLog(G_SCRIPT_WARNING, "社名一覧の取得に失敗");
			return false;
		}

		// 2022cvt_015
		var O_mail = new FJPMailSenderType(this.getLog(), this.m_debug_mode, this.m_debug_addr);
		// 2022cvt_015
		var A_addr = await O_model.getHRMAddr();

		if (false === A_addr) {
			this.putLog(G_SCRIPT_WARNING, "送信先FJPメールアドレスの取得に失敗");
			return false;
		}

		// 2022cvt_015
		var A_param = Array();

		// 2022cvt_015
		for (var H_param of this.m_A_addr_param) {
			if (!(undefined !== H_param.bcc)) {
				H_param.bcc = this.m_A_bcc;
			}
			if (!(undefined !== H_param.subject)) {
				H_param.subject = this.m_subject;
			}
			A_param.push(H_param);
		}

		A_param.push({
			// 2022cvt_016
			type: FJP_MAIL_FJP,
			to: A_addr,
			bcc: this.m_A_bcc,
			subject: this.m_subject
		});

		// 2022cvt_015
		for (var H_param of A_param) {
			// 2022cvt_016
			this.putLog(G_SCRIPT_DEBUG, "メール送信先:" + H_param.type + ":" + H_param.to.join(",") + ":" + H_param.subject);
		}

		// 2022cvt_016
		// 2022cvt_015
		var A_index = await O_model.getHRMStatusIndex(this.m_A_exectype, this.m_A_status, this.m_A_is_send, this.m_A_uniqueid);

		if (!A_index) {
			this.putLog(G_SCRIPT_WARNING, "送信情報(親)の取得に失敗");
			return false;
		}

		// 2022cvt_015
		var rval = true;

		// 2022cvt_015
		for (var H_index of A_index) //メール送信の子を読み出す
		//メール本文は送らず、uniqueidのみをメール本文に含める
		//foreach ($A_details as $H_details)
		//{
		//$A_buffer->put(
		//(($H_details["is_fjp"]? FJP_MAIL_FJP: 0)
		//| ($H_details["is_kcs"]? FJP_MAIL_KCS: 0)
		//| ($H_details["is_motion"]? FJP_MAIL_MOTION: 0)),
		//$H_details["pactid"],
		//$H_details["message"]);
		//}
		//メールを送信する
		//メール送信済フラグを立てる
		{
			this.putLog(G_SCRIPT_DEBUG, "メールの親:" + H_index.uniqueid);
			// 2022cvt_015
			var A_details = await O_model.getHRMStatusDetails(H_index.uniqueid);

			if (!A_details) {
				this.putLog(G_SCRIPT_WARNING, "送信情報(子)の取得に失敗" + H_index.uniqueid);
				return false;
			}

			// 2022cvt_015
			var A_buffer = new FJPErrorHandlerBufferType();
			A_buffer.put(FJP_MAIL_ALL.toString(), 0, "詳細な内容は、" + "fjp_hrm_status_details_tbの、uniqueidが" + H_index.uniqueid + "で参照できます。");
			var A_buffer_2 = A_buffer.get();
			// 2022cvt_015
			var H_sub = {
				// 2022cvt_016
				"%1": this.m_is_fix_subject ? "" : this.getExecLabel(H_index.exectype),
				"%2": this.m_is_fix_subject ? "" : this.getStatusLabel(H_index.status)
			};
			O_mail.send(A_buffer_2, A_param, H_pact, H_sub);

			if (false === O_model.updateHRMStatusIndexIsSend(H_index.uniqueid)) {
				this.putLog(G_SCRIPT_WARNING, "送信情報(親)の更新に失敗" + H_index.uniqueid);
				return false;
			}
		}

		return true;
	}

	// 2022cvt_016
	getExecLabel(exectype: any) {
		// 2022cvt_016
		switch (exectype) {
			case 0:
				return "取込機能";

			case 1:
				return "事前チェック";

			case 2:
				return "人事マスタコピー";
		}

		return "不明な機能";
	}

	getStatusLabel(status: any) {
		switch (status) {
			case 0:
				return "正常終了";

			default:
				return "不正終了";
		}
	}

};
