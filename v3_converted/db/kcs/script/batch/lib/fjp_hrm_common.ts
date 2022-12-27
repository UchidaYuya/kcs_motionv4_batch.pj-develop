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
if (!(undefined !== fjp_stop_error_reporting)) error_reporting(E_ALL);

require("lib/script_log.php");

const FJP_SAVEPOINT_NAME = "savepoint_fjp_hrm";
const FJP_FUNCID_MASTER = 208;
const FJP_FNCID_ORDER = 123;
const FJP_MAIL_FJP = 1;
const FJP_MAIL_KCS = 2;
const FJP_MAIL_MOTION = 4;
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
const FJP_IMPORT_POST_MODE_4 = "FJP_IMPORT_POST_MODE_4";
const FJP_IMPORT_POST_MODE_400 = "FJP_IMPORT_POST_MODE_400";
const FJP_IMPORT_POST_MODE_6 = "FJP_IMPORT_POST_MODE_6";

//機能：コンストラクタ
//機能：エラーを受け取る
//引数：種別
//顧客ID
//メッセージ
//機能：実行結果を受け取る
//引数：値その1
//値その2
//メッセージ
class FJPErrorHandlerBaseType {
	constructor() //何もしない
	{}

	put(type, pactid, msg) //何もしない
	{}

	putResult(arg1, arg2, msg) //何もしない
	{}

};

//バッファ
//実行結果
//機能：コンストラクタ
//機能：現在のバッファを返す
//備考：バッファは以下の形式
//array(
//array(
//"type" => 種別,
//"pactid" => 顧客ID,
//"msg" => 本文,
//),
//...
//);
//機能：現在の実行結果を受け取る
//返値：array(
//"type" => 値その1,
//"pactid" => 値その2,
//"msg" => メッセージ,
//);
//ただし、putResultが呼ばれていないと空配列を返す
//機能：エラーを受け取る
//引数：種別
//顧客ID
//メッセージ
//機能：実行結果を受け取る
//引数：値その1
//値その2
//メッセージ
class FJPErrorHandlerBufferType extends FJPErrorHandlerBaseType {
	constructor() {
		this.m_A_buffer = Array();
		this.m_H_result = Array();
	}

	get() {
		return this.m_A_buffer;
	}

	getResult() {
		return this.m_H_result;
	}

	put(type, pactid, msg) {
		this.m_A_buffer.push({
			type: type,
			pactid: pactid,
			msg: msg
		});
	}

	putResult(arg1, arg2, msg) {
		this.m_H_result = {
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
class FJPErrorHandlerChildProcType extends FJPErrorHandlerBaseType {
	constructor(debug_mode) {
		super();
		this.m_debug_mode = debug_mode;
	}

	put(type, pactid, msg) {
		if (this.m_debug_mode) //種別とメッセージを表示する
			{
				fputs(STDOUT, type + " " + pactid + " " + msg + "\n");
			} else //開始記号 種別 顧客ID エンコード後文字数 元文字数 内容 終了記号
			{
				var enc = urlencode(msg);
				fputs(STDOUT, FJP_MAIL_PROC_BEGIN + type + " " + pactid + " " + enc.length + " " + msg.length + " " + enc + FJP_MAIL_PROC_END + "\n");
			}
	}

	putResult(arg1, arg2, msg) {
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
//array("type" => 種別, "pactid" => 顧客ID, "msg => 本文)を返す
//返値：成功したらtrueを返す
class FJPChildProcType {
	constructor(O_log: ScriptLogBase, O_handler: FJPErrorHandlerBaseType) {
		this.m_O_log = O_log;
		this.m_O_handler = O_handler;
	}

	exec(cmd, return_var) {
		var A_out = Array();
		return_var = 0;
		exec(cmd, A_out, return_var);
		if (!this.parse(A_out)) return false;
		return true;
	}

	parse(A_out: {} | any[]) {
		var rval = true;

		for (var cnt = 0; cnt < A_out.length; ++cnt) {
			var H_line = Array();
			var line = A_out[cnt];
			var is_result = false;

			if (this.parseLine(line, H_line, is_result)) {
				if (is_result) this.m_O_handler.putResult(H_line.type, H_line.pactid, H_line.msg);else this.m_O_handler.put(H_line.type, H_line.pactid, H_line.msg);
			} else //行の解釈に失敗した
				{
					rval = false;
					this.m_O_log.put(G_SCRIPT_DEBUG, "\u5B50\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u306E\u4E0D\u6B63\u306A\u30E1\u30C3\u30BB\u30FC\u30B8:" + line);
					this.m_O_handler.put(FJP_MAIL_MOTION | FJP_MAIL_KCS, FJP_MAIL_ALLPACT, line);
				}
		}

		return rval;
	}

	parseLine(line, H_line: {} | any[], is_result) //開始記号を消す
	//終了記号を消す
	//種別を取り出す
	//顧客IDを取り出す
	//エンコード後の文字数を取り出す
	//元の文字数を取り出す
	{
		H_line = Array();
		is_result = false;
		var pos = strpos(line, FJP_MAIL_PROC_BEGIN_RESULT);

		if (0 === pos) {
			line = line.substr(FJP_MAIL_PROC_BEGIN_RESULT.length);
			is_result = true;
		} else {
			pos = strpos(line, FJP_MAIL_PROC_BEGIN);
			if (0 !== pos) return false;
			line = line.substr(FJP_MAIL_PROC_BEGIN.length);
		}

		pos = strpos(line, FJP_MAIL_PROC_END);
		if (line.length - FJP_MAIL_PROC_END.length !== pos) return false;
		line = line.substr(0, line.length - FJP_MAIL_PROC_END.length);
		pos = strpos(line, " ");
		if (false === pos || 0 === pos) return false;
		var pre = line.substr(0, pos);
		line = line.substr(pos + 1);
		if (!is_numeric(pre)) return false;
		H_line.type = pre;
		pos = strpos(line, " ");
		if (false === pos || 0 === pos) return false;
		pre = line.substr(0, pos);
		line = line.substr(pos + 1);
		if (!is_numeric(pre)) return false;
		H_line.pactid = pre;
		pos = strpos(line, " ");
		if (false === pos || 0 === pos) return false;
		pre = line.substr(0, pos);
		line = line.substr(pos + 1);
		if (!is_numeric(pre)) return false;
		var length_enc = pre;
		pos = strpos(line, " ");
		if (false === pos || 0 === pos) return false;
		pre = line.substr(0, pos);
		line = line.substr(pos + 1);
		if (!is_numeric(pre)) return false;
		if (length_enc != line.length) return false;
		line = urldecode(line);
		if (pre != line.length) return false;
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
class FJPProcessLog extends ScriptLogBase {
	constructor() {
		super(0);
	}

	setPath(listener, path, procname) {
		if (!file_exists(path)) {
			var msg = `ログパス不正${path}`;
			if (undefined !== listener) listener.put(G_SCRIPT_DEBUG, msg);else fwrite_conv(this.toLabel(G_SCRIPT_DEBUG) + msg + "\n");
			return false;
		}

		if (procname.length) {
			if (!file_exists(path + procname) && !mkdir(path + procname, 777, true)) {
				msg = `ログディレクトリ作成失敗${path}${procname}`;
				if (undefined !== listener) listener.put(G_SCRIPT_DEBUG, msg);else fwrite_conv(this.toLabel(G_SCRIPT_DEBUG) + msg + "\n");
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

//子プロセスが標準出力に何か出したら不正終了
//ScriptLog型が出していない場合のログ種別
//ログをWARNINGとして出力しないならtrue
//機能：コンストラクタ
//引数：エラー処理型
//子プロセスが標準出力に何か出したら不正終了するならtrue
//ScriptLog型が出していない場合のログ種別
//機能：外部コマンドを実行する
//引数：コマンド名
//引数配列({key,value,addkey}の配列)
//追加引数
//返値：深刻なエラーが発生したらfalseを返す
//機能：外部コマンドを実行する
//引数：コマンド名
//コマンドラインオプション
//返値：深刻なエラーが発生したらfalseを返す
//機能：外部コマンドを実行する
//引数：コマンドライン文字列
//返値：深刻なエラーが発生したらfalseを返す
//機能：コマンドに使用する文字をエスケープする
//引数：変換元の文字列
//返値：変換後の文字列
class ScriptCommandSafe extends ScriptLogAdaptor {
	constructor(listener, stdout_fault = false, unknown_type = G_SCRIPT_WARNING) {
		this.ScriptLogAdaptor(listener, false);
		this.m_stdout_fault = stdout_fault;
		this.m_unknown_type = unknown_type;
		this.m_stop_warning = false;
	}

	execute(cmd, A_args, A_addargs) {
		var A_newargs = Array();
		var all_args = [A_args, A_addargs];

		for (var one_args of Object.values(all_args)) {
			for (var args of Object.values(one_args)) {
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

	executeRaw(cmd, A_args) {
		var line = cmd;

		for (var arg of Object.values(A_args)) line += " " + this.escape(arg);

		return this.executeCommand(line);
	}

	executeCommand(line) //実行結果がエラーならログ出力
	{
		var A_rval = Array();
		var rval = undefined;
		exec(line, A_rval, rval);
		var A_temp = Array();

		for (var msg of Object.values(A_rval)) {
			if (msg.length) A_temp.push(msg);
		}

		A_rval = A_temp;
		var status = true;

		if (0 != rval) {
			if (this.m_stop_warning) this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);else this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);
			status = false;
		}

		for (var msg of Object.values(A_rval)) {
			mb_detect_order("UTF-8");
			var enc = mb_detect_encoding(msg);
			var msg = mb_convert_encoding(msg, "UTF-8", enc);
			if (this.m_stdout_fault) status = false;
			if (this.m_listener.isLabel(msg)) this.m_listener.put(this.m_unknown_type, msg);else if (0 != this.m_unknown_type) this.putError(this.m_unknown_type, `未定義出力 ${msg}`);
		}

		return status;
	}

	escape(var) {
		return escapeshellcmd(escapeshellarg(var));
	}

};

//エラーハンドラ
//エラーをハンドラに渡さないならtrue
//先頭の読み飛ばす行数
//機能：コンストラクタ
//引数：エラーハンドラ
//エラーをハンドラに渡さないならtrue
//先頭の読み飛ばす行数
//機能：エラーハンドラにメッセージを出力する
//引数：種別
//顧客ID
//メッセージ
//機能：ファイルを読み出す
//引数：ファイル名
//返値：処理に失敗したらfalseを返す
//機能：エスケープ文字を処理する
//引数：行を構成するすべてのセルを処理して返す
//機能：エスケープ文字を処理して返す
//引数：セル
//機能：ファイル処理の準備をする
//返値：処理に失敗したらfalseを返す
//機能：ファイルの行を解釈する
//引数：行を構成する行
//行番号
//返値：処理に失敗したらfalseを返す
//機能：ファイルの全体を解釈する
//返値：処理に失敗したらfalseを返す
class FJPCSVReaderBaseType {
	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore, skip_lines) {
		this.m_O_handler = O_handler;
		this.m_is_ignore = is_ignore;
		this.m_skip_lines = skip_lines;
	}

	putError(type, pactid, msg) {
		if (this.m_is_ignore) return;
		this.m_O_handler.put(type, pactid, msg);
	}

	read(fname) //ファイル処理の準備をする
	//ファイルを閉じる
	//最後に、ファイル全体を処理する
	{
		var rval = true;
		if (!this.beginFile()) rval = false;
		var fp = fopen(fname, "rb");

		if (false === fp) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u307E\u305B\u3093" + basename(fname));
			this.putError(FJP_MAIL_MOTION | FJP_MAIL_KCS, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u306E\u6240\u5728" + fname);
			return false;
		}

		for (var lineno = 0; false !== (A_cell = fgetcsv(fp, 0, ",", "\"")); ++lineno) {
			this.escapeLine(A_cell);
			if (lineno < this.m_skip_lines) continue;
			if (!this.feedLine(A_cell, lineno)) rval = false;
		}

		fclose(fp);
		if (!this.endFile()) rval = false;
		return rval;
	}

	escapeLine(A_cell: {} | any[]) {
		for (var cnt = 0; cnt < A_cell.length; ++cnt) A_cell[cnt] = this.escapeCell(A_cell[cnt]);
	}

	escapeCell(cell) {
		return cell;
	}

	beginFile() //派生型で処理する
	{
		return true;
	}

	feedLine(A_cell: {} | any[], lineno) //派生型で処理する
	{
		return true;
	}

	endFile() //派生型で処理する
	{
		return true;
	}

};

//全社の情報
//KCSモーションのpactid => 各社の情報
//読み出し中バッファ(読み出しが完了すれば内容は無い)
//機能：コンストラクタ
//引数：エラーハンドラ
//エラーをハンドラに渡さないならtrue
//機能：全社共通の設定を返す
//機能：KCSモーションの顧客IDを全て返す
//機能：KCSモーションの顧客IDを全て返す(スキップ機能付)
//引数：含めるID(空配列なら全て)
//含めないID
//機能：KCSモーションの顧客IDを渡して、設定を返す
//返値：その顧客IDの設定が無ければ空配列を返す
//-----------------------------------------------------------------------
//機能：ファイルの行を解釈する
//引数：行を構成する行
//行番号
//返値：処理に失敗したらfalseを返す
//機能：ファイル処理の準備をする
//返値：処理に失敗したらfalseを返す
//機能：ファイルの、全社の設定の一行目を処理する
//返値：処理に失敗したらfalseを返す
//機能：ファイルの、各社の設定の一行目を処理する
//返値：処理に失敗したらfalseを返す
//機能：ファイルの、各社の設定の二行目を処理する
//返値：処理に失敗したらfalseを返す
class FJPSettingType extends FJPCSVReaderBaseType {
	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore) {
		super(O_handler, is_ignore, 0);
		this.m_A_buffer = Array();
		this.m_H_all = Array();
		this.m_H_setting = Array();
	}

	getSettingAll() {
		return this.m_H_all;
	}

	getPactIDAll() {
		var A_pactid = Array();
		{
			let _tmp_0 = this.m_H_setting;

			for (var pactid in _tmp_0) {
				var H_dummy = _tmp_0[pactid];
				A_pactid.push(pactid);
			}
		}
		return A_pactid;
	}

	getPactIDSkip(A_in: {} | any[], A_out: {} | any[]) {
		var A_pactid = this.getPactIDAll();
		var A_rval = Array();

		for (var pactid of Object.values(A_pactid)) {
			if (A_in.length && !(-1 !== A_in.indexOf(pactid))) continue;
			if (-1 !== A_out.indexOf(pactid)) continue;
			A_rval.push(pactid);
		}

		return A_rval;
	}

	getSetting(pactid) {
		if (undefined !== this.m_H_setting[pactid]) return this.m_H_setting[pactid];
		return Array();
	}

	feedLine(A_cell: {} | any[], lineno) //セルが無ければ無視する
	{
		if (!A_cell.length) return true;
		if (1 == A_cell.length && !A_cell[0].length) return true;

		switch (A_cell[0]) {
			case "0":
				return this.feedLine0(A_cell, lineno);

			case "1":
				return this.feedLine1(A_cell, lineno);

			case "2":
				return this.feedLine2(A_cell, lineno);

			default:
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u6700\u521D\u306E\u30BB\u30EB\u304C0,1,2\u306E\u3044\u305A\u308C\u3067\u3082\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
		}

		return true;
	}

	beginFile() {
		this.m_A_buffer = Array();
		return true;
	}

	feedLine0(A_cell: {} | any[], lineno) //総個数
	//無視する職制順コードは無くても良い
	{
		var limit = 6;

		if (A_cell.length < limit) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE(\u5168\u4F53\u8A2D\u5B9A)" + "\u306E\u30BB\u30EB\u306E\u500B\u6570\u306F\u6700\u4F4E" + limit + "\u500B\u5FC5\u8981\u3067\u3059\u3002");
			return false;
		}

		var idx = 1;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
			}

			this.m_H_all.fname_user = A_cell[idx];
		}

		idx = 2;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
			}

			this.m_H_all.fname_lock = A_cell[idx];
		}

		idx = 3;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
			}

			this.m_H_all.fname_post = A_cell[idx];
		}

		idx = 4;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u7D66\u4E0E\u8CA0\u62C5\u8077\u5236)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
			}

			this.m_H_all.column_id = A_cell[idx];
		}

		idx = 5;

		if (idx < A_cell.length) {
			if (!A_cell[idx].length) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u7D66\u4E0E\u8CA0\u62C5\u8077\u5236\u540D)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
				return false;
			}

			this.m_H_all.column_name = A_cell[idx];
		}

		idx = 6;
		this.m_H_all.A_ignore = Array();

		if (idx < A_cell.length) //内容が空でも問題ない
			{
				var A_code = A_cell[idx].split(",");

				for (var code of Object.values(A_code)) {
					if (!code.length) continue;
					var code = "P" + code;
					if (!(-1 !== this.m_H_all.A_ignore.indexOf(code))) this.m_H_all.A_ignore.push(code);
				}
			}

		idx = 7;
		this.m_H_all.A_skip_postcode = Array();

		if (idx < A_cell.length) //内容が空でも問題ない
			{
				A_code = A_cell[idx].split(",");

				for (var code of Object.values(A_code)) {
					if (!code.length) continue;
					code = "P" + code;
					if (!(-1 !== this.m_H_all.A_skip_postcode.indexOf(code))) this.m_H_all.A_skip_postcode.push(code);
				}
			}

		return true;
	}

	feedLine1(A_cell: {} | any[], lineno) //バッファに中身が無い事を確認する
	{
		if (this.m_A_buffer.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306F\u3001\u5404\u9867\u5BA2\u306E1\u884C\u76EE\u304C\u9023\u7D9A\u3057\u3066\u3044\u307E\u3059\u3002");
			return false;
		}

		this.m_A_buffer = A_cell;
		return true;
	}

	feedLine2(A_cell: {} | any[], lineno) //一行目のデータがある事を確認する
	//人事マスタの会社コード
	//管理者の権限IDセット
	//各社の、無視する職制順コード
	//バッファを初期化する
	{
		if (!this.m_A_buffer.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u624B\u524D\u306B\u3001\u5404\u9867\u5BA2\u306E1\u884C\u76EE\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		var limit = 8;

		if (this.m_A_buffer.length < limit) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E\u30BB\u30EB\u306E\u500B\u6570\u306F\u6700\u4F4E" + limit + "\u500B\u5FC5\u8981\u3067\u3059\u3002");
			return false;
		}

		var idx = 1;

		if (!is_numeric(this.m_A_buffer[idx])) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u9867\u5BA2ID)" + "\u306E\u5185\u5BB9\u304C\u6574\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		var pactid = this.m_A_buffer[idx];
		this.m_H_setting[pactid] = Array();
		idx = 2;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306E\u4F1A\u793E\u30B3\u30FC\u30C9)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		var A_code = this.m_A_buffer[idx].split(",");
		this.m_H_setting[pactid].A_code_user = Array();

		for (var code of Object.values(A_code)) {
			if (!code.length) continue;
			var code = "C" + code;
			if (!(-1 !== this.m_H_setting[pactid].A_code_user.indexOf(code))) this.m_H_setting[pactid].A_code_user.push(code);
		}

		if (!this.m_H_setting[pactid].A_code_user.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306E\u4F1A\u793E\u30B3\u30FC\u30C9)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		idx = 3;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u8077\u5236\u30DE\u30B9\u30BF\u306E\u4F1A\u793E\u30B3\u30FC\u30C9)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		A_code = this.m_A_buffer[idx].split(",");
		this.m_H_setting[pactid].A_code_post = Array();

		for (var code of Object.values(A_code)) {
			if (!code.length) continue;
			code = "C" + code;
			if (!(-1 !== this.m_H_setting[pactid].A_code_post.indexOf(code))) this.m_H_setting[pactid].A_code_post.push(code);
		}

		if (!this.m_H_setting[pactid].A_code_post.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u8077\u5236\u30DE\u30B9\u30BF\u306E\u4F1A\u793E\u30B3\u30FC\u30C9)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		idx = 4;

		if (!is_numeric(this.m_A_buffer[idx])) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u7BA1\u7406\u8005\u8B58\u5225\u7528\u6A29\u9650ID)" + "\u306E\u5185\u5BB9\u304C\u6574\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		this.m_H_setting[pactid].fncid_admin = this.m_A_buffer[idx];
		idx = 5;
		var A_fncid = this.m_A_buffer[idx].split(" ");
		this.m_H_setting[pactid].A_fncid_admin = Array();

		for (var fncid of Object.values(A_fncid)) {
			if (!is_numeric(fncid)) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u7BA1\u7406\u8005\u7528\u6A29\u9650\u30BB\u30C3\u30C8)" + "\u306B\u6574\u6570\u4EE5\u5916\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002");
				return false;
			}

			if (!(-1 !== this.m_H_setting[pactid].A_fncid_admin.indexOf(fncid))) this.m_H_setting[pactid].A_fncid_admin.push(fncid);
		}

		if (!this.m_H_setting[pactid].A_fncid_admin.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u7BA1\u7406\u8005\u7528\u6A29\u9650\u30BB\u30C3\u30C8)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		idx = 6;
		A_fncid = this.m_A_buffer[idx].split(" ");
		this.m_H_setting[pactid].A_fncid_user = Array();

		for (var fncid of Object.values(A_fncid)) {
			if (!is_numeric(fncid)) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u7BA1\u7406\u8005\u7528\u6A29\u9650\u30BB\u30C3\u30C8)" + "\u306B\u6574\u6570\u4EE5\u5916\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002");
				return false;
			}

			if (!(-1 !== this.m_H_setting[pactid].A_fncid_user.indexOf(fncid))) this.m_H_setting[pactid].A_fncid_user.push(fncid);
		}

		if (!this.m_H_setting[pactid].A_fncid_user.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 0) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u500B\u76EE\u306E\u30BB\u30EB(\u7BA1\u7406\u8005\u7528\u6A29\u9650\u30BB\u30C3\u30C8)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		idx = 7;

		if (!this.m_A_buffer[idx].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E" + (idx + 1) + "\u756A\u76EE\u306E\u30BB\u30EB(\u4E0D\u660E\u306A\u90E8\u7F72\u30B3\u30FC\u30C9)" + "\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093\u3002");
			return false;
		}

		this.m_H_setting[pactid].postcode_unknown = this.m_A_buffer[idx];
		idx = 8;
		this.m_H_setting[pactid].A_ignore = Array();

		if (idx < this.m_A_buffer.length) //内容が空でも問題ない
			{
				A_code = this.m_A_buffer[idx].split(",");

				for (var code of Object.values(A_code)) {
					if (!code.length) continue;
					code = "P" + code;
					if (!(-1 !== this.m_H_setting[pactid].A_ignore.indexOf(code))) this.m_H_setting[pactid].A_ignore.push(code);
				}
			}

		idx = 9;
		this.m_H_setting[pactid].is_unknown_tel = true;

		if (idx < this.m_A_buffer.length) {
			this.m_H_setting[pactid].is_unknown_tel = "0" !== this.m_A_buffer[idx];
		}

		var A_postcode_protected = Array();

		for (var cnt = 1; cnt < A_cell.length; ++cnt) {
			if (!A_cell[cnt].length) continue;
			var cell = "P" + A_cell[cnt];
			if (!(-1 !== A_postcode_protected.indexOf(cell))) A_postcode_protected.push(cell);
		}

		this.m_H_setting[pactid].A_postcode_protected = A_postcode_protected;
		this.m_A_buffer = Array();
		return true;
	}

};

//KCSモーションの顧客IDのうち、処理するもの(空配列ならすべて)
//KCSモーションの顧客IDのうち、無視するもの
//マスタの会社コード(先頭にC)のうち、処理するもの(空配列ならすべて)
//マスタの会社コード(先頭にC)のうち、無視するもの
//KCSモーションの顧客ID => array(マスタの会社コード(先頭にCがつく))
//マスタの会社コード(先頭にCがつく) => array(KCSモーションの顧客ID)
//m_H_pactid_pactcodeと同じデータだが、ファイル処理時の高速処理用
//KCSモーションの顧客ID => array(出現済のマスタの会社コード(先頭にCがつく))
//すべての出現済会社コード
//対応関係が存在しなかった、マスタファイルの会社コード(先頭にC)
//ファイルの読み出しで一件でも問題が発生していればtrue
//機能：コンストラクタ
//引数：エラーハンドラ
//エラーをハンドラに渡さないならtrue
//先頭の読み飛ばす行数
//機能：処理するIDと無視するIDを設定する
//引数：KCSモーションの顧客IDのうち、処理するもの(空配列ならすべて)
//KCSモーションの顧客IDのうち、無視するもの
//マスタの会社コード(先頭にC)のうち、処理するもの(空配列ならすべて)
//マスタの会社コード(先頭にC)のうち、無視するもの
//機能：KCSモーションの顧客IDとマスタファイルの会社コードの対応を追加する
//引数：KCSモーションの顧客ID
//マスタファイルの会社コード(先頭にCがつく)(配列可)
//引数：顧客のデータがあればtrueを返す
//備考：一部の会社コードが欠損していてもtrueを返す
//-----------------------------------------------------------------------
//機能：ファイルの読み出しに失敗していればtrueを返す
//機能：KCSモーションの顧客IDに対応する、マスタの会社コードを返す
//返値：array(マスタの会社コード(先頭にC))
//備考：そのような顧客が無ければ空配列を返す
//機能：マスタの会社コードの一部しかなかった顧客を帰す
//返値：array(
//KCSモーションの会社ID => array(
//存在しなかった、マスタファイルの会社コード(先頭にC),
//...
//),
//...
//);
//-----------------------------------------------------------------------
//機能：ファイルの読み出しに失敗したことを記録する
//機能：マスタファイルの会社コードから、KCSモーションの顧客IDに変換する
//引数：マスタファイルの会社コード(先頭にC)
//KCSモーションの顧客IDを配列に入れて返す
//不明な会社コードだった場合に、それが一回目ならtrueを返す
//返値：変換に失敗したらfalseを返す
//機能：データに不整合が無いか確認する
//引数：ファイルの種別(人事か職制か)
//返値：不整合があればfalseを返す
class FJPMasterBaseType extends FJPCSVReaderBaseType {
	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore, skip_lines) {
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

	setSkip(A_pactid_in: {} | any[], A_pactid_out: {} | any[], A_pactcode_in: {} | any[], A_pactcode_out: {} | any[]) {
		this.m_A_pactid_in = A_pactid_in;
		this.m_A_pactid_out = A_pactid_out;
		this.m_A_pactcode_in = A_pactcode_in;
		this.m_A_pactcode_out = A_pactcode_out;
	}

	addPact(pactid, pactcode) {
		if (Array.isArray(pactcode)) {
			for (var code of Object.values(pactcode)) this.addPact(pactid, code);

			return;
		}

		if (!(undefined !== this.m_H_pactid_pactcode[pactid])) this.m_H_pactid_pactcode[pactid] = Array();
		if (!(-1 !== this.m_H_pactid_pactcode[pactid].indexOf(pactcode))) this.m_H_pactid_pactcode[pactid].push(pactcode);
		if (!(undefined !== this.m_H_pactcode_pactid[pactcode])) this.m_H_pactcode_pactid[pactcode] = Array();
		if (!(-1 !== this.m_H_pactcode_pactid[pactcode].indexOf(pactid))) this.m_H_pactcode_pactid[pactcode].push(pactid);
	}

	isIn(pactid) {
		return undefined !== this.m_H_pactid_pactcode_ready[pactid] && 0 < this.m_H_pactid_pactcode_ready[pactid].length;
	}

	isFail() {
		return this.m_is_fail;
	}

	getPactCode(pactid) {
		if (undefined !== this.m_H_pactid_pactcode[pactid]) return this.m_H_pactid_pactcode[pactid];
		return Array();
	}

	getPactCodeLack() {
		var H_rval = Array();
		{
			let _tmp_1 = this.m_H_pactid_pactcode_ready;

			for (var pactid in _tmp_1) {
				var A_ready = _tmp_1[pactid];
				var A_all = this.m_H_pactid_pactcode[pactid];
				var A_bad = Array();

				for (var code of Object.values(A_all)) if (!(-1 !== A_ready.indexOf(code))) A_bad.push(code);

				if (A_bad.length) H_rval[pactid] = A_bad;
			}
		}
		return H_rval;
	}

	setFail(is_fail = true) {
		this.m_is_fail = is_fail;
	}

	convertPact(pactcode, A_pactid: {} | any[], is_first) //会社コードを無視するか
	//スキップする顧客IDを除く
	//出現済の会社コードを記録する
	{
		A_pactid = Array();
		is_first = false;

		if (-1 !== this.m_A_pactcode_out.indexOf(pactcode)) {
			return true;
		}

		if (this.m_A_pactcode_in.length && !(-1 !== this.m_A_pactcode_in.indexOf(pactcode))) {
			return true;
		}

		if (-1 !== this.m_A_pactcode_bad.indexOf(pactcode)) return false;

		if (!(undefined !== this.m_H_pactcode_pactid[pactcode])) {
			is_first = true;
			this.m_A_pactcode_bad.push(pactcode);
			return false;
		}

		A_pactid = this.m_H_pactcode_pactid[pactcode];
		var A_temp = Array();

		for (var pactid of Object.values(A_pactid)) {
			if (-1 !== this.m_A_pactid_out.indexOf(pactid)) continue;
			if (this.m_A_pactid_in.length && !(-1 !== this.m_A_pactid_in.indexOf(pactid))) continue;
			A_temp.push(pactid);
		}

		A_pactid = A_temp;

		if (!(-1 !== this.m_A_pactcode_ready.indexOf(pactcode))) {
			this.m_A_pactcode_ready.push(pactcode);

			for (var pactid of Object.values(A_pactid)) {
				if (!(undefined !== this.m_H_pactid_pactcode_ready[pactid])) this.m_H_pactid_pactcode_ready[pactid] = Array();
				if (!(-1 !== this.m_H_pactid_pactcode_ready[pactid].indexOf(pactcode))) this.m_H_pactid_pactcode_ready[pactid].push(pactcode);
			}
		}

		return true;
	}

	errorCheck(type) {
		var rval = true;
		var H_lack = this.getPactCodeLack();

		for (var pactid in H_lack) {
			var A_pactcode = H_lack[pactid];
			var msg = type + "\u306E\u4F1A\u793EID\u304C" + pactid + "\u306E\u3001\u4E00\u90E8\u306E\u4F1A\u793E\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093";

			for (var pactcode of Object.values(A_pactcode)) msg += "," + pactcode.substr(1);

			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
			rval = false;
		}

		return rval;
	}

};

//全社の設定
//array(
//KCSモーションの顧客ID => array(
//"U" . 従業員番号 => array(
//"employeecode" => 従業員番号 ←先頭にUがつかない
//"username" => 氏名,
//"mail" => メールアドレス,
//"is_admin" => 管理職ならtrue,
//"userpostid" => 部署コード ←先頭にPがつかない,
//"salary_id" => 給与負担元コード,
//"salary_name" => 給与負担元名称,
//"executive_no" => 幹部社員従業員番号,
//"executive_name" => 幹部社員氏名,
//"executive_mail" => 幹部社員メールアドレス,
//"office_code" => 事業所コード,
//"office_name" => 事業所名,
//"building_name" => ビル名,
//),
//...
//),
//...
//);
//職制コードの取り込み方法
//機能：コンストラクタ
//引数：エラーハンドラ
//エラーをハンドラに渡さないならtrue
//職制コードの取り込み方法
//機能：顧客の情報を返す
//引数：KCSモーションの顧客ID
//-----------------------------------------------------------------------
//機能：ファイルの行を解釈する
//引数：行を構成する行
//行番号
//返値：処理に失敗したらfalseを返す
//機能：ファイル処理の後処理を行う
//返値：処理に失敗したらfalseを返す
class FJPMasterUserType extends FJPMasterBaseType {
	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore, userpostid_mode) //先頭行は読み飛ばさない
	{
		super(O_handler, is_ignore, 0);
		this.m_H_master = Array();
		this.m_userpostid_mode = userpostid_mode;
	}

	get(pactid) {
		if (!(undefined !== this.m_H_master[pactid])) return Array();
		return this.m_H_master[pactid];
	}

	feedLine(A_cell: {} | any[], lineno) //エラーメッセージの共通部分を作る
	//会社コードから顧客IDに変換する
	//氏名
	//メールアドレス
	//部署コード
	//管理職ならtrue
	//給与負担元コード
	{
		var common = "";
		if (0 < A_cell.length) common += "(\u4F1A\u793E\u30B3\u30FC\u30C9\u306F" + A_cell[0] + ")";
		if (1 < A_cell.length) common += "(\u5F93\u696D\u54E1\u756A\u53F7\u306F" + A_cell[1] + ")";
		if (2 < A_cell.length) common += "(\u6C0F\u540D\u306F" + A_cell[2] + ")";
		var limit = FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode ? 18 : 15;

		if (A_cell.length < limit) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u30BB\u30EB\u306E\u500B\u6570\u304C" + limit + "\u500B\u3088\u308A\u5C11\u306A\u3044\u3067\u3059\u3002" + common);
			this.setFail();
			return true;
		}

		if (!A_cell[0].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u4F1A\u793E\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var pactcode = "C" + A_cell[0];
		var A_pactid = Array();
		var is_first = false;

		if (!this.convertPact(pactcode, A_pactid, is_first)) {
			if (is_first) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u4F1A\u793E\u30B3\u30FC\u30C9" + "\u304C\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u4E2D\u306B\u3042\u308A\u307E\u305B\u3093\u3002" + common);
				this.setFail();
			}

			return true;
		}

		if (!A_cell[1].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u5F93\u696D\u54E1\u756A\u53F7\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var employee = A_cell[1];

		if (!A_cell[2].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u6C0F\u540D\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var name = A_cell[2];
		var addr = A_cell[4].toLowerCase();

		if (!A_cell[5].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var userpostid = A_cell[5];

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //職制コードは6桁である
			{
				if (6 != userpostid.length) {
					this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C6\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + common);
					this.setFail();
					return true;
				}
			} else //職制コードは4桁である
			{
				if (4 != userpostid.length) {
					this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C4\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + common);
					this.setFail();
					return true;
				}

				if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode) {
					userpostid = "00" + userpostid;
				}
			}

		if (!A_cell[11].length || !is_numeric(A_cell[11])) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u7BA1\u7406\u8077/\u4E00\u822C\u8077\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var is_admin = 1 == A_cell[11];
		var salary_id = "";
		if (A_cell[7].length) salary_id = A_cell[7];

		if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode && 4 == salary_id.length) {
			salary_id = "00" + salary_id;
		}

		var salary_name = "";
		if (A_cell[8].length) salary_name = A_cell[8];
		var executive_no = "";
		if (A_cell[12].length) executive_no = A_cell[12];
		var executive_name = "";
		if (A_cell[13].length) executive_name = A_cell[13];
		var executive_mail = "";
		if (A_cell[14].length) executive_mail = A_cell[14].toLowerCase();
		var office_code = "";
		var office_name = "";
		var building_name = "";

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //事業所コード
			{
				if (A_cell[15].length) office_code = A_cell[15];
				if (A_cell[16].length) office_name = A_cell[16];
				if (A_cell[17].length) building_name = A_cell[17];
			}

		for (var pactid of Object.values(A_pactid)) {
			if (!(undefined !== this.m_H_master[pactid])) {
				this.m_H_master[pactid] = Array();
			}

			if (!(undefined !== this.m_H_master[pactid]["U" + employee])) {
				var H_insert = {
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
		if (!this.errorCheck("\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB")) this.setFail();
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
	constructor(O_handler: FJPErrorHandlerBaseType, is_ignore, userpostid_mode) //先頭行を読み飛ばさない
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
		krsort(H_length);
		this.m_H_length = H_length;
	}

	addIgnoreAll(A_ignore: {} | any[], A_skip_postcode: {} | any[]) {
		for (var ignore of Object.values(A_ignore)) if (!(-1 !== this.m_A_ignore.indexOf(ignore))) this.m_A_ignore.push(ignore);

		for (var code of Object.values(A_skip_postcode)) if (!(-1 !== this.m_A_skip_postcode.indexOf(code))) this.m_A_skip_postcode.push(code);
	}

	addIgnore(pactid, A_ignore: {} | any[]) {
		if (!(undefined !== this.m_H_ignore[pactid])) this.m_H_ignore[pactid] = Array();

		for (var ignore of Object.values(A_ignore)) if (!(-1 !== this.m_H_ignore[pactid].indexOf(ignore))) this.m_H_ignore[pactid].push(ignore);
	}

	createFile(pactid, fname) //ファイルを出力する
	//一行目は空行を出力する
	//二行目以降を出力する
	{
		var fp = fopen(fname, "wt");

		if (false === fp) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + basename(fname));
			this.putError(FJP_MAIL_MOTION | FJP_MAIL_KCS, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u306E\u6240\u5728" + fname);
			return false;
		}

		var rval = true;
		fwrite(fp, "\n");

		if (undefined !== this.m_H_master[pactid]) {
			{
				let _tmp_2 = this.m_H_master[pactid];

				for (var keycode in _tmp_2) {
					var H_param = _tmp_2[keycode];
					rval += this.createLine(fp, pactid, keycode, H_param, this.m_H_master[pactid]);
				}
			}
		}

		fclose(fp);
		return rval;
	}

	createLine(fp, pactid, keycode, H_param: {} | any[], H_master: {} | any[]) {
		var line = "";
		var quote = "\"";
		var comma = ",";
		line += quote + this.escapeCreate(H_param.userpostid) + quote;
		line += comma + quote;
		if (undefined !== H_param.parent && undefined !== H_master[H_param.parent]) line += this.escapeCreate(H_master[H_param.parent].userpostid);
		line += quote;
		line += comma + quote + this.escapeCreate(H_param.postname) + quote;
		line += comma + quote + H_param.level_out + quote;
		line += comma;
		line += comma;
		line += "\n";
		fwrite(fp, line);
		return true;
	}

	escapeCreate(var) //ダブルクォートを二重化する
	{
		var = str_replace("\"", "\"\"", var);
		return var;
	}

	feedLine(A_cell: {} | any[], lineno) //無視する職制コードなら処理しない
	//会社コードから顧客IDに変換する
	//職制順コード
	//先頭に"P"を付ける
	//職制漢字略名称
	//レベルコード
	//結果を保存する
	{
		if (0 < A_cell.length) {
			var postcode = "P" + A_cell[0];
			if (-1 !== this.m_A_skip_postcode.indexOf(postcode)) return true;
		}

		var common = "";
		if (1 < A_cell.length) common += "(\u4F1A\u793E\u30B3\u30FC\u30C9\u306F" + A_cell[1] + ")";
		if (0 < A_cell.length) common += "(\u8077\u5236\u30B3\u30FC\u30C9\u306F" + A_cell[0] + ")";
		if (8 < A_cell.length) common += "(\u30EC\u30D9\u30EB\u30B3\u30FC\u30C9\u306F" + A_cell[8] + ")";

		if (9 != A_cell.length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u30BB\u30EB\u306E\u500B\u6570\u304C9\u500B\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		if (!A_cell[1].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u4F1A\u793E\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var pactcode = "C" + A_cell[1];
		var A_pactid = Array();
		var is_first = false;

		if (!this.convertPact(pactcode, A_pactid, is_first)) {
			if (is_first) {
				this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u4F1A\u793E\u30B3\u30FC\u30C9" + "\u304C\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u4E2D\u306B\u3042\u308A\u307E\u305B\u3093\u3002" + common);
				this.setFail();
			}

			return true;
		}

		if (!A_cell[0].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var userpostid = A_cell[0];

		if (FJP_IMPORT_POST_MODE_6 == this.m_userpostid_mode) //職制コードは6桁である
			{
				if (6 != userpostid.length) {
					this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C6\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + common);
					this.setFail();
					return true;
				}
			} else //職制コードは4桁である
			{
				if (4 != userpostid.length) {
					this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u30B3\u30FC\u30C9\u304C4\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + common);
					this.setFail();
					return true;
				}

				if (FJP_IMPORT_POST_MODE_400 == this.m_userpostid_mode) {
					userpostid = "00" + userpostid;
				}
			}

		if (!A_cell[3].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u9806\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var keycode = "P" + A_cell[3];

		if (!A_cell[4].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u8077\u5236\u6F22\u5B57\u7565\u540D\u79F0\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var postname = A_cell[4];

		if (!A_cell[8].length) {
			this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E" + (lineno + 1) + "\u884C\u76EE" + "\u306E\u30EC\u30D9\u30EB\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002" + common);
			this.setFail();
			return true;
		}

		var levelcode = A_cell[8];

		for (var pactid of Object.values(A_pactid)) //職制順コードが無視する値ならスキップする
		{
			if (-1 !== this.m_A_ignore.indexOf(keycode)) continue;
			if (undefined !== this.m_H_ignore[pactid] && -1 !== this.m_H_ignore[pactid].indexOf(keycode)) continue;
			if (!(undefined !== this.m_H_master[pactid])) this.m_H_master[pactid] = Array();
			if (undefined !== this.m_H_master[pactid][keycode]) return true;
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

			for (var pactid in _tmp_5) //全部署に対してループし、親部署を設定する
			//中間ファイル用のレベルを設定する
			{
				var H_master = _tmp_5[pactid];

				for (var keycode in H_master) //自部署のレベルを取り出す
				//レベル毎の文字数マスタ(降順)に対してループする
				{
					var H_param = H_master[keycode];
					var level = H_param.level_in;
					var parent = keycode;
					{
						let _tmp_3 = this.m_H_length;

						for (var length_key in _tmp_3) //自部署の職制順コードと同じならスキップする
						{
							var length_value = _tmp_3[length_key];
							if (level <= length_key) continue;

							for (var cnt = length_value + 1; cnt < parent.length; ++cnt) //指定文字数より右側をゼロで埋める
							{
								parent[cnt] = "0";
							}

							if (parent === keycode) continue;

							if (undefined !== H_master[parent]) //親が見つかった
								{
									this.m_H_master[pactid][keycode].parent = parent;
									break;
								}
						}
					}
				}

				var H_parent = [""];

				for (var cur_level = 1; cur_level < 128; ++cur_level) //配下の部署が無くなったら処理を打ち切る
				{
					var H_child = Array();
					{
						let _tmp_4 = this.m_H_master[pactid];

						for (var keycode in _tmp_4) {
							var H_param = _tmp_4[keycode];

							if (-1 !== H_parent.indexOf(H_param.parent)) {
								H_child.push(keycode);
								this.m_H_master[pactid][keycode].level_out = cur_level;
							}
						}
					}
					H_parent = H_child;
					if (!H_parent.length) break;
				}

				if (H_parent.length) {
					var msg = "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u968E\u5C64\u304C\u6DF1\u3059\u304E\u307E\u3059";
					msg += "(KCS\u30E2\u30FC\u30B7\u30E7\u30F3\u306E\u9867\u5BA2ID\u306F" + pactid + ")";
					this.putError(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.setFail();
				}
			}
		}
		if (!this.errorCheck("\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB")) this.setFail();
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
	constructor(O_log: ScriptLogBase, debug_mode, debug_addr = "") {
		this.m_O_log = O_log;
		this.m_debug_mode = debug_mode;
		this.m_debug_addr = debug_addr;
		if (!this.m_debug_addr.length) this.m_debug_addr = G_MAIL_TO;
	}

	send(A_buffer: {} | any[], A_param: {} | any[], H_pact: {} | any[], H_sub) {
		var rval = true;

		for (var H_param of Object.values(A_param)) //デバッグモードが画面ダンプなら、表示して終わる
		//デバッグモードが送信先切り替えなら、切り替える
		{
			var label_type = "\u5B9B\u5148\u4E0D\u660E";
			if (FJP_MAIL_MOTION == H_param.type) label_type = "\u30D0\u30C3\u30C1\u30A8\u30E9\u30FC\u5B9B";else if (FJP_MAIL_KCS == H_param.type) label_type = "KCS\u7BA1\u7406\u8005\u5B9B";else if (FJP_MAIL_FJP == H_param.type) label_type = "FJP\u7BA1\u7406\u8005\u5B9B";
			var A_msg = this.selectBuffer(A_buffer, H_param.type);
			if (!A_msg.length) continue;

			if (!this.addCompName(A_msg, H_pact)) {
				rval = false;
				continue;
			}

			var subject = H_param.subject;

			for (var from in H_sub) {
				var to = H_sub[from];
				subject = str_replace(from, to, subject);
			}

			if (FJP_MAIL_SEND_DUMP == this.m_debug_mode) {
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: ""
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "Bcc:" + H_param.bcc.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u30E1\u30FC\u30EB\u30EC\u30D9\u30EB:" + label_type
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u9001\u4FE1\u5148:" + H_param.to.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8:" + subject
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9\u3060\u3063\u305F\u306E\u3067\u30E1\u30FC\u30EB\u9001\u4FE1\u305B\u305A"
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "-----------------------------------------"
				});
				if (!this.dump(A_msg)) rval = false;
				continue;
			}

			var from = G_MAIL_FROM;
			if (undefined !== H_param.from && H_param.from.length) from = H_param.from;
			var A_to = H_param.to;
			var A_bcc = H_param.bcc;
			subject = subject;

			if (FJP_MAIL_SEND_DEBUG == this.m_debug_mode) {
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: ""
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "Bcc:" + A_bcc.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u30E1\u30FC\u30EB\u30EC\u30D9\u30EB:" + label_type
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u672C\u6765\u306E\u9001\u4FE1\u5148:" + A_to.join(",")
				});
				A_msg.unshift({
					pactid: 0,
					type: 0,
					msg: "\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9\u3060\u3063\u305F\u306E\u3067\u9001\u4FE1\u5148\u5207\u308A\u66FF\u3048"
				});
				A_to = [this.m_debug_addr];
				A_bcc = Array();
				subject += "(\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9)";
			}

			if (!this.exec(A_msg, A_to, A_bcc, subject, from)) rval = false;
		}

		return rval;
	}

	dump(A_msg: {} | any[]) {
		for (var H_msg of Object.values(A_msg)) echo(H_msg.msg + "\n");

		return true;
	}

	exec(A_msg: {} | any[], A_to: {} | any[], A_bcc: {} | any[], subject, from) {
		var rval = true;

		for (var to of Object.values(A_to)) {
			var O_mail = Mail.factory("smtp", {
				host: G_SMTP_HOST,
				port: G_SMTP_PORT
			});
			var msg = "";

			for (var H_msg of Object.values(A_msg)) msg += H_msg.msg + "\n";

			msg = mb_convert_encoding(msg, "JIS", "UTF-8");
			var H_headers = {
				Date: date("r"),
				To: to,
				From: from,
				"Return-Path": from,
				"MIME-Version": "1.0",
				Subject: mb_encode_mimeheader(subject, "ISO-2022-JP-MS"),
				"Content-Type": "text/plain; charset=\"ISO-2022-JP\"",
				"Content-Transfer-Encoding": "7bit",
				"X-Mailer": "Motion Mailer v2"
			};
			if (A_bcc.length) H_headers.Bcc = A_bcc.join(",");
			var A_send_to = [to];

			for (var bcc of Object.values(A_bcc)) A_send_to.push(bcc);

			var status = O_mail.send(A_send_to, H_headers, msg);
			var param = "";
			param += "/\u884C\u6570:" + A_msg.length;
			param += "/\u30D0\u30A4\u30C8\u6570:" + msg.length;
			param += "/to:" + to;
			param += "/bcc:" + A_bcc.join(",");
			param += "/from:" + from;

			if (PEAR.isError(status)) {
				rval = false;
				this.m_O_log.put(G_SCRIPT_WARNING, "\u30E1\u30FC\u30EB\u9001\u4FE1\u5931\u6557" + param);
			} else {
				this.m_O_log.put(G_SCRIPT_DEBUG, "\u30E1\u30FC\u30EB\u9001\u4FE1\u6210\u529F" + param);
			}
		}

		return rval;
	}

	selectBuffer(A_buffer: {} | any[], type) {
		var A_msg = Array();

		for (var H_buffer of Object.values(A_buffer)) if (type & H_buffer.type) A_msg.push(H_buffer);

		return A_msg;
	}

	addCompName(A_msg: {} | any[], H_pact: {} | any[]) {
		for (var cnt = 0; cnt < A_msg.length; ++cnt) {
			var pactid = A_msg[cnt].pactid;
			var compname = this.getCompName(pactid, H_pact);
			A_msg[cnt].msg = this.addCompNameLine(A_msg[cnt].msg, compname);
		}

		return true;
	}

	addCompNameLine(msg, compname) //末尾が改行なら改行文字を削除する
	{
		var A_lf = ["\r\n", "\n", "\r"];

		while (true) {
			var len = msg.length;
			if (!len) break;

			for (var cnt = 0; cnt < A_lf.length; ++cnt) {
				var lf = A_lf[cnt];

				if (lf === msg.substr(len - lf.length, lf.length)) {
					msg = msg.substr(0, len - lf.length);
					break;
				}
			}

			if (A_lf.length == cnt) break;
		}

		return msg + compname;
	}

	getCompName(pactid, H_pact: {} | any[]) {
		if (!pactid) return "";
		if (!(undefined !== H_pact[pactid])) return "(\u4F1A\u793EID\u306F" + pactid + ")";
		return "(\u4F1A\u793EID\u306F" + pactid + ":\u4F1A\u793E\u540D\u306F" + H_pact[pactid] + ")";
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
	constructor(listener, db) {
		super(listener, db);
	}

	insert(H_line) {
		{
			let _tmp_6 = this.m_A_const;

			for (var key in _tmp_6) {
				var value = _tmp_6[key];
				if (!(key in H_line)) H_line[key] = value;
			}
		}
		var sql = "insert into " + this.m_table_name;
		sql += "(";
		var comma = false;

		for (var col of Object.values(this.m_A_col)) {
			if (comma) sql += ",";
			comma = true;
			sql += col[0];
		}

		sql += ")values(";
		comma = false;

		for (var col of Object.values(this.m_A_col)) {
			if (comma) sql += ",";
			comma = true;
			var colname = col[0];

			if (undefined !== H_line[colname]) {
				if (this.is_quote(col[1])) sql += "'";
				var var = this.m_db.escape(H_line[colname]);

				if (0 == strcmp("now()", var)) {
					var = this.getTimestamp(var);
				}

				sql += var;
				if (this.is_quote(col[1])) sql += "'";
			} else sql += "null";
		}

		sql += ")";
		if (this.m_is_no_insert_lock) sql = PGPOOL_NO_INSERT_LOCK + sql;
		this.putError(G_SCRIPT_SQL, sql);
		var result = this.m_db.query(sql, false);
		if (DB.isError(result)) return false;
		return true;
	}

	is_quote(name) {
		if (0 === strpos(name, "int")) return false;
		if (0 === strpos(name, "bool")) return false;

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
	constructor(listener, db, fname, erase, static = true) {
		super(listener, db, fname, erase, static);
	}

	end() {
		if (this.m_fp) {
			fclose(this.m_fp);
			this.m_fp = undefined;
		}

		if (this.m_debug) {
			this.putError(G_SCRIPT_INFO, "DB\u633F\u5165\u5B9F\u884C\u305B\u305A(" + this.m_filename + "/" + this.m_table_name + ")");
			return true;
		}

		var A_buffer = Array();
		var fp = fopen(this.m_filename, "rt");

		if (!fp) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u8AAD\u307F\u51FA\u3057\u30AA\u30FC\u30D7\u30F3\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
			return false;
		}

		for (var cnt = 0; !feof(fp); ++cnt, ++cnt) {
			var line = fgets(fp, 64 * 1024);
			if (0 == line.length) continue;
			A_buffer.push(line);

			if (this.m_interval <= A_buffer.length) {
				if (false === pg_copy_from(this.m_db.m_db.connection, this.m_table_name, A_buffer)) {
					this.putError(G_SCRIPT_DEBUG, `pg_copy_from失敗 ${cnt} ` + this.m_table_name);
					return false;
				}

				A_buffer = Array();
			}
		}

		if (A_buffer.length) {
			if (false === pg_copy_from(this.m_db.m_db.connection, this.m_table_name, A_buffer)) {
				this.putError(G_SCRIPT_DEBUG, `pg_copy_from失敗(2) ${cnt} ` + this.m_table_name);
				return false;
			}
		}

		fclose(fp);
		fp = undefined;
		return true;
	}

};

const FJP_WAYTYPE_CUR = 0;
const FJP_WAYTYPE_CUR_NEW = 1;

//ログ
//データベース
//テーブル番号
//エラーハンドラ
//給与負担職制のカラム名
//給与負担職制名のカラム名
//不明部署へ電話を移動させたら現在日付を設定するカラム名
//機能：コンストラクタ
//引数：ログインスタンス
//データベースインスタンス
//テーブル番号インスタンス
//エラーハンドラインスタンス
//機能：ログインスタンスを入れ替える
//機能：給与負担職制のカラム名を設定する
//引数：給与負担職制のカラム名
//給与負担職制名のカラム名
//-----------------------------------------------------------------------
//queryに関する機能
//機能：queryを実行して、失敗したらエラーメッセージを返す
//引数：実行するSQL文
//備考：成功したら空文字列を返す
//機能：queryを実行して、失敗したらエラーメッセージを記録してfalseを返す
//引数：実行するSQL文
//ログに残すがメール送信はしないならtrue
//機能：getOneを安全に呼び出す
//返値：失敗したらfalseを返す
//機能：getHashを安全に呼び出す
//返値：失敗したらfalseを返す
//機能：getAllを安全に呼び出す
//返値：失敗したらfalseを返す
//機能：デバッグメッセージを残す
//引数：メッセージ
//顧客ID
//機能：ログだけを残す
//引数：レベル
//内容
//機能：メールだけを送信する
//引数：送信先
//顧客ID
//内容
//機能：トランザクションを開始する
//機能：トランザクションを終了する
//引数：コミットするならtrue
//機能：セーブポイントを開始する
//引数：セーブポイントの名称
//機能：セーブポイントを終了する
//引数：コミットするならtrue
//セーブポイントの名称
//機能：SQLの構成要素をエスケープして返す
//-----------------------------------------------------------------------
//SQL文組み立て
//機能：テーブル番号を返す
//引数：年
//月
//機能：recdateに入れる日付をシングルクオートでくくって返す
//引数：タイムゾーンを付けるならtrue
//機能：recdateに入れる日付をシングルクオートでくくって返す(時刻無し)
//引数：タイムゾーンを付けるならtrue
//機能：テーブル名を作って返す
//引数：テーブル名(tel_tbやtel_X_tbならtel_%)
//テーブル番号(現在なら空文字列)
//テーブル番号が配列の時に、強制的に現在とするなら0
//備考：テーブル番号が配列なら、$table_no["table_no"]を使う
//機能：SQLのWHERE条件を作って返す
//引数：array(カラム名 => 値)
//前後にシングルクオートが必要なカラム名
//テーブル名
//備考：先頭はANDから始まるので、必ず真となる条件を先頭に付ける
//機能：SQLのON部分を作って返す
//引数：左側のテーブル名
//右側のテーブル名
//接続に用いる条件
//機能：booleanを数値に変換するSQLを返す
//備考：先頭や末尾に空白が付いていない
//カッコで囲っていない
//asで名前を付けてない
//-----------------------------------------------------------------------
//集約実行系
//機能：一個の顧客の処理を行う
//引数：この会社の人事マスタ
//現在のみか、現在+過去最新月か
//過去最新月のテーブル番号
//全社共通の設定
//KCSモーションの会社ID
//会社毎の設定
//ログディレクトリ(右端はパス区切り文字)
//データの挿入に高速版を用いるならtrue
//返値：失敗したらfalseを返す
//機能：executePactから呼び出されるメール送信・ログ出力機能
//引数：ステータス
//顧客ID
//実行しようとした内容
//エラー内容(失敗した時のみ使用する)
//追加する情報
//備考：ステータスは以下のいずれか
//"ok"		成功
//"fail"		失敗で、共通のメッセージを付ける
//"skip"		処理の必要が無い
//"fail_msg"	失敗で、共通のメッセージを付けない
//-----------------------------------------------------------------------
//取得系
//機能：fjp_hrm_status_index_tbのシーケンスを採番する
//機能：useridを採番する
//機能：顧客IDを含む実行パラメータを作成し、必要な情報を読み出す
//引数：顧客パラメータに追加して返す
//顧客ID
//現在のみなら0/現在+過去最新月なら1
//テーブル番号
//不明部署の部署コード
//管理者が持つ筈の権限ID
//ログディレクトリ(右端はパス区切り文字)
//データ挿入に高速版を使うならtrue
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：顧客IDを含む実行パラメータを作成する
//引数：顧客パラメータに追加して返す
//顧客ID
//現在のみなら0/現在+過去最新月なら1
//テーブル番号
//返値：失敗したらfalseを返す
//機能：ルートの部署IDを追加して返す
//引数：顧客パラメータに追加して返す
//現在なら0/過去最新月なら1
//返値：失敗したらfalseを返す
//機能：不明部署の部署IDを追加して返す
//引数：顧客パラメータに追加して返す
//現在なら0/過去最新月なら1
//不明部署の部署コード
//返値：失敗したらfalseを返す
//機能：ある権限を持つユーザの一覧を追加して返す
//引数：顧客パラメータに追加して返す
//権限ID
//返値：失敗したらfalseを返す
//機能：ユーザ情報を一括読み出しする
//引数：顧客パラメータに追加して返す
//返値：失敗したらfalseを返す
//機能：保護ユーザ情報を読み出す
//引数：顧客パラメータに追加して返す
//返値：失敗したらfalseを返す
//機能：保護部署を追加して返す
//引数：顧客パラメータに追加して返す
//現在なら0/過去最新月なら1
//返値：失敗したらfalseを返す
//機能：挿入インスタンスを作成する
//引数：顧客パラメータ
//ログディレクトリ(右端はパス区切り文字)
//高速版を使うならtrue
//返値：失敗したらfalseを返す
//機能：挿入インスタンスのうち、ユーザに関わる部分を閉じる
//引数：顧客パラメータ
//返値：失敗したらfalseを返す
//-----------------------------------------------------------------------
//予約の削除
//機能：予約の削除を行う
//引数：顧客パラメータ
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：予約の削除を、tel_rel_tel_reserve_tbに対して行う
//引数：顧客パラメータ
//返値：失敗したらfalseを返す
//備考：tel_reserve_tbに対して削除を行うよりも前に呼び出す事
//機能：予約の削除を、assets_reserve_tbに対して行う
//引数：顧客パラメータ
//返値：失敗したらfalseを返す
//備考：tel_rel_assets_reserve_tbに対して削除を行うよりも前に呼び出す事
//機能：予約の削除を、tel_rel_assets_reserve_tbに対して行う
//引数：顧客パラメータ
//返値：失敗したらfalseを返す
//備考：tel_reserve_tbに対して削除を行うよりも前に呼び出す事
//機能：予約の削除を、tel_reserve_tbに対して行う
//引数：顧客パラメータ
//返値：失敗したらfalseを返す
//-----------------------------------------------------------------------
//ユーザ系
//ユーザの追加-----------------------------------------------------------
//機能：ユーザを追加する
//引数：顧客パラメータ
//ユーザIDを返す
//ユーザパラメータ
//部署ID
//追加する権限
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//備考：このメソッドの後に、endInserterUserを呼び出す事
//機能：ユーザを追加する
//引数：顧客パラメータ
//ユーザパラメータ
//ユーザID
//部署ID
//返値：失敗したらfalseを返す
//機能：ユーザの権限を追加する
//引数：顧客パラメータ
//ユーザID
//新しい権限
//返値：失敗したらfalseを返す
//備考：事前にaddUserUserを呼び出しておく事
//ユーザの幹部・一般の切り替え-------------------------------------------
//機能：ユーザの役職切り替えが必要ならtrueを返す
//引数：顧客パラメータ
//マスタのユーザ
//機能：ユーザの役職を切り替える
//引数：顧客パラメータ
//ユーザパラメータ
//新しい権限
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：ユーザの役職を切り替える
//引数：顧客パラメータ
//ユーザパラメータ
//新しい権限
//返値：失敗したらfalseを返す
//ユーザ情報の変更-------------------------------------------------------
//機能：ユーザ情報の変更が必要な要素を探す
//引数：顧客パラメータ
//ユーザパラメータ
//"P" . 変更しようとしているユーザのemployeecode
//ユーザが元から存在したらtrue/新規に追加したらfalse
//ユーザID
//変更が必要な情報を返す
//返値：変更が必要ならtrueを返す
//機能：ユーザ情報の反映を行う
//引数：顧客パラメータ
//ユーザパラメータ
//ユーザが元から存在したらtrue/新規に追加したらfalse
//ユーザID
//変更が必要な情報
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：ユーザ情報の変更が必要なカラムを探す(ユーザテーブル)
//引数：ユーザパラメータその1
//ユーザパラメータその2
//変更が必要なカラムを返す
//返値：変更が必要ならtrueを返す
//機能：ユーザ情報の変更で、ユーザテーブルの氏名を更新する
//引数：顧客パラメータ
//ユーザパラメータ
//変更が必要なカラム(mail,username)
//返値：失敗したらfalseを返す
//機能：電話の給与負担元コード・名称の更新を行う
//引数：顧客パラメータ
//ユーザパラメータ
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//ユーザの所属部署変更---------------------------------------------------
//ユーザの所属部署変更が必要ならtrueを返す
//引数：顧客パラメータ
//ユーザパラメータ
//"P" . 変更しようとしているユーザのemployeecode
//ユーザが元から存在したらtrue/新規に追加したらfalse
//変更が必要な情報を返す
//返値：変更が必要ならtrueを返す
//機能：ユーザの所属部署変更を行う
//引数：顧客パラメータ
//ユーザパラメータ
//array(部署ID, 部署ID)
//ユーザが元から存在したらtrue/新規に追加したらfalse
//変更が必要な情報
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：ユーザの所属部署変更が必要ならtrueを返す
//引数：ユーザパラメータその1
//ユーザパラメータその2
//機能：ユーザの所属部署変更で、ユーザテーブルの部署を変更する
//引数：顧客パラメータ
//ユーザパラメータ
//部署ID
//返値：失敗したらfalseを返す
//ユーザ情報の、電話と端末への設定---------------------------------------
//機能：ユーザ情報の、電話と端末への設定を行う
//引数：顧客パラメータ
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//ユーザの削除-----------------------------------------------------------
//機能：ユーザの削除を行う
//引数：顧客パラメータ
//ユーザパラメータ
//オーダーがあって削除できないならtrueを返す(個人承認)
//オーダーがあって削除できないならtrueを返す(部署承認)
//オーダーがあって削除できないならtrueを返す(自分の注文)
//エラーパラメータを返す
//返値：承認待ちのオーダーがあればfalseを返す
//機能：ユーザ削除の前に、個人承認者になっているオーダーが無いか確認する
//引数：顧客パラメータ
//ユーザパラメータ
//オーダーがあって削除できないならtrueを返す
//返値：承認待ちのオーダーがあればfalseを返す
//備考：承認待ちのオーダーがあれば削除してはならない
//機能：ユーザ削除の前に、部署承認者になっているオーダーが無いか確認する
//引数：顧客パラメータ
//ユーザパラメータ
//オーダーがあって削除できないならtrueを返す
//返値：承認待ちのオーダーがあればfalseを返す
//備考：承認待ちのオーダーがあれば削除してはならない
//機能：販売店受注済まで行っていないオーダーをキャンセルする
//引数：顧客パラメータ
//ユーザパラメータ
//オーダーがあって削除できないならtrueを返す(自分の注文)
//返値：失敗したらfalseを返す
//機能：権限を削除する
//引数：顧客パラメータ
//ユーザパラメータ
//返値：失敗したらfalseを返す
//機能：ユーザを削除する
//引数：顧客パラメータ
//ユーザパラメータ
//返値：失敗したらfalseを返す
//機能：電話と端末への一括設定を行う
//かつては削除ユーザの電話と端末の設定だった
//引数：顧客パラメータ
//エラーパラメータを返す
//職制マスタに無い利用者の電話を不明部署に移動するならtrue
//返値：失敗したらfalseを返す
//ユーザ機能の共通部分---------------------------------------------------
//機能：部署コードから部署IDを取り出す
//引数：顧客パラメータ
//ユーザパラメータ
//getUserGetPostで取得した部署情報
//array(table_type => 部署ID)を返す
//array(table_type => 部署が存在したらtrue)を返す
//エラーパラメータを返す
//返値：現在・過去最新月のうち、どちらかでも見つからなければfalseを返す
//機能：ユーザ追加・部署移動の部署情報を、現在と過去最新月の両方取得する
//引数：顧客パラメータ
//部署情報を返す
//エラーパラメータを返す
//返値：失敗したらfalseを返す
//機能：ユーザ追加・部署移動のための部署情報を一括取得する
//引数：顧客パラメータ
//部署情報を返す
//現在なら0/過去最新月なら1
//返値：失敗したらfalseを返す
//機能：ユーザIDをユーザテーブルから取得するSQL文を作って返す
//引数：顧客パラメータ
//ユーザパラメータ
//-----------------------------------------------------------------------
//事前チェックが使う機能
//機能：全顧客で事前チェックを行う
//引数：問題のあった顧客IDを返す
//処理するpactid
//処理しないpactid
//処理するテーブル番号(空文字列なら現在)
//返値：失敗したらfalseを返す
//機能：事前チェックを行う
//引数：一件でも問題があればtrueを返す
//処理するpactid
//処理するテーブル番号(空文字列なら現在)
//返値：失敗したらfalseを返す
//機能：FJP権限のある顧客IDを配列にして返す
//返値：array(顧客ID, ...);
//機能：重複存在するuserpostidのリストを返す
//引数：顧客ID
//テーブル番号(空文字列なら現在)
//返値：array(重複存在するuserpostid, ...);
//機能：userpostidが存在しない部署数を返す
//引数：顧客ID
//テーブル番号(空文字列なら現在)
//返値：userpostidが存在しない部署数
//機能：重複存在するemployeecodeのリストを返す
//引数：顧客ID
//返値：array(
//"U" . 重複存在するemployeecode => array(
//username,
//...
//),
//);
//返値：array(重複存在するemployeecode, ...);
//機能：employeecodeが存在しないユーザ数を返す
//引数：顧客ID
//返値：employeecodeが存在しないユーザ数
//機能：employeecodeとuseridが食い違っている電話の情報を返す
//引数：顧客ID
//テーブル番号(空文字列なら現在)
//返値：array(
//array(
//telno => 電話番号,
//carid => キャリアID,
//carname => キャリア名,
//employeecode_tel => tel_X_tbのemployeecode,
//employeecode_user => user_tbのemployeecode,
//),
//...
//);
//機能：employeecodeが食い違っている端末の情報を返す
//引数：顧客ID
//現在なら0/過去最新月なら1
//返値：array(
//array(
//telno => 電話番号,
//carid => キャリアID,
//carname => キャリア名,
//productname => 端末の製品名,
//assetsid => 端末ID,
//employeecode_assets => assets_X_tbのemployeecode,
//employeecode_user => user_tbのemployeecode,
//),
//...
//);
//機能：usernameが食い違っている電話の情報を返す
//引数：顧客ID
//現在なら0/過去最新月なら1
//返値：array(
//array(
//telno => 電話番号,
//carid => キャリアID,
//carname => キャリア名,
//username_tel => tel_X_tbのusername,
//username_user => user_tbのusername,
//),
//...
//);
//機能：mailが食い違っている電話の情報を返す
//引数：顧客ID
//現在なら0/過去最新月なら1
//返値：array(
//array(
//telno => 電話番号,
//carid => キャリアID,
//carname => キャリア名,
//mail_tel => tel_X_tbのmail,
//mail_user => user_tbのmail,
//),
//...
//);
//機能：usernameが食い違っている端末の情報を返す
//引数：顧客ID
//現在なら0/過去最新月なら1
//返値：array(
//array(
//telno => 電話番号,
//carid => キャリアID,
//carname => キャリア名,
//productname => 端末の製品名,
//assetsid => 端末ID,
//username_assets => assets_X_tbのusername,
//username_user => user_tbのusername,
//),
//...
//);
//-----------------------------------------------------------------------
//マスタインポートバッチ以外で使う機能
//ファイルコピーの保存・更新・読み出し-----------------------------------
//機能：fjp_hrm_file_copy_tbから、インポートが可能な最新ファイルを返す
//返値：array(
//"dstname" => コピー先人事ファイル名,
//"srctime" => コピー元人事ファイルのタイムスタンプ,
//"dstpost" => コピー先職制ファイル名
//"srcpost" => コピー元職制ファイルのタイムスタンプ,
//"recdate" => コピーした日時
//);
//ただし、インポート可能なファイルがなければarray();
//SQLの実行に失敗したらfalseを返す
//機能：基準日時より古くてインポート可能なファイル情報をすべて返す
//引数：基準日時(クォート無し)
//返値：array(
//array(
//"dstname" => コピー先人事ファイル名,
//"srctime" => コピー元人事ファイルのタイムスタンプ,
//"dstpost" => コピー先職制ファイル名
//"srcpost" => コピー元職制ファイルのタイムスタンプ,
//"recdate" => コピーした日時
//),
//...
//);
//SQLの実行に失敗したらfalseを返す
//機能：jp_hrm_file_status_tbを、インポート成功か失敗に書き換える
//引数：基準日時(クォート無し)
//成功ならtrue
//返値：失敗したらfalseを返す
//機能：fjp_hrm_file_copy_tbのステータスを書き換える
//引数：基準日時(クォート無し)
//更新後のステータス
//array(更新前のステータス)空配列ならすべて
//基準日時なら0/基準日時よりも過去なら1(基準日時を含まない)
//返値：失敗したらfalseを返す
//機能：fjp_hrm_file_copy_tbにレコードを追加する
//引数：0なら成功/1ならファイル無し/2なら時間切れ/3ならエラー
//人事ファイルのタイムスタンプ(YYYY/MM/DD HH:MM:SS)クォート無し
//コピー後の人事マスタファイル名
//職制ファイルのタイムスタンプ(YYYY/MM/DD HH:MM:SS)クォート無し
//コピー後の職制マスタファイル名
//記録日時(クォート無し)省略したら現在日時
//返値：失敗したらfalseを返す
//実行結果の保存・読み出し・更新-----------------------------------------
//機能：fjp_hrm_status_index_tbから、最後のステータスを取り出して返す
//引数：バッチ種別(省略したら取込バッチ)
//バッチ種別が取込の時に、waytypeがマイナスを除外するならtrue
//返値：array(
//"status" => 0なら成功/1なら失敗
//"waytype" => 0なら現在のみ/1なら現在+過去最新月
//);
//ただし、実行ステータスが一件もなければarray();
//SQLの実行に失敗したらfalseを返す
//機能：fjp_hrm_status_index_tbとdetails_tbに値を入れる
//引数：取込バッチなら0/事前チェックバッチなら1
//実行ステータス(成功なら0/失敗なら1)
//取込バッチの実行方法(事前チェックバッチなら0固定)
//エラーハンドラの内容
//挿入に使うファイル名(フルパス)
//シーケンスの値(省略可能)
//返値：失敗したらfalseを返す
//備考：details_tbへの挿入に失敗したらプロセスが終了する
//機能：fjp_hrm_status_index_tbから、メール送信が必要なレコードを読み出す
//引数：exectypeの種類(0なら取込/1なら事前チェック/2ならファイルコピー)
//statusの種類(0なら成功/1なら失敗)
//is_sendの種類(true, false)
//array(uniqueid)
//返値：array(
//array(
//"uniqueid" => 連番,
//"exectype" => バッチの種類,
//"recdate" => 実行日,
//"fixdate" => 変更日,
//"status" => 0なら成功/0以外なら失敗
//"waytype" => 0なら現在/1なら現在+過去最新月/取込以外なら0
//"is_send" => メール送信済ならtrue
//),
//...
//);
//SQLの実行に失敗したらfalseを返す
//機能：fjp_hrm_status_details_tbから、特定の連番のレコードを読み出す
//引数：uniqueid
//返値：array(
//array(
//"uniqueid" => 渡された連番,
//"detailno" => 枝番,
//"pactid" => 問題が起きた顧客ID,
//"is_fjp" => FJP宛に送信する必要があればtrue
//"is_kcs" => KCS宛に送信する必要があればtrue
//"is_motion" => バッチエラー宛に送信する必要があればtrue
//"message" => 本文,
//),
//...
//);
//SQLの実行に失敗したらfalseを返す
//機能：fjp_hrm_status_index_tbの、is_sendを書き換える
//引数：uniqueid
//is_sendの値
//返値：失敗したらfalseを返す
//その他-----------------------------------------------------------------
//機能：fjp_hrm_addr_tbからアドレス一覧を取り出して返す
//返値：array(
//メールアドレス,
//...
//);
//SQLの実行に失敗したらfalseを返す
//機能：fjp_hrm_shcedule_tbからスケジュール一覧を取り出して返す
//返値：array(
//array(
//"execdate" => 1～30と32(32は月末)
//"waytype" => 0なら現在のみ/1なら現在+最新月
//),
//...
//);
//SQLの実行に失敗したらfalseを返す
//機能：顧客IDから顧客名へのハッシュを返す
class FJPModelType {
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

	setColumn(id, name) {
		this.m_column_id = id;
		this.m_column_name = name;
	}

	querySafe(sql) {
		var result = this.m_O_db.query(sql, false);
		if (!DB.isError(result)) return "";
		var errmsg = "unknown_db_query_error:" + sql;

		if (is_a(result, "db_error")) {
			errmsg = result.userinfo;
		}

		errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.m_O_log.put(G_SCRIPT_DEBUG, "querySafe:\u5931\u6557:" + errmsg);
		return errmsg;
	}

	querySafeLog(sql, is_log_only = false) {
		var result = this.querySafe(sql);
		if (!result.length) return true;

		if (!is_log_only) {
			this.m_O_handler.put(FJP_MAIL_MOTION, FJP_MAIL_ALLPACT, "querySafe:\u5931\u6557:" + result);
		}

		return false;
	}

	getOneSafeLog(sql) {
		var result = this.m_O_db.getOne(sql, false);
		if (!DB.isError(result)) return result;
		var errmsg = "getOne:\u5931\u6557:" + sql;
		if (is_a(result, "db_error")) errmsg = result.userinfo;
		errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getOne:\u5931\u6557:" + errmsg);
		return false;
	}

	getHashSafeLog(sql) {
		var result = this.m_O_db.getHash(sql, false);
		if (!DB.isError(result)) return result;
		var errmsg = "getHash:\u5931\u6557:" + sql;
		if (is_a(result, "db_error")) errmsg = result.userinfo;
		errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getHash:\u5931\u6557:" + errmsg);
		return false;
	}

	getAllSafeLog(sql) {
		var result = this.m_O_db.getAll(sql, false);
		if (!DB.isError(result)) return result;
		var errmsg = "getAll:\u5931\u6557:" + sql;
		if (is_a(result, "db_error")) errmsg = result.userinfo;
		errmsg = str_replace("\n", "\\n", errmsg);
		errmsg += ":" + sql;
		this.putDebug("getAll:\u5931\u6557:" + errmsg);
		return false;
	}

	putDebug(errmsg, pactid = FJP_MAIL_ALLPACT) {
		this.m_O_log.put(G_SCRIPT_DEBUG, errmsg);
		this.m_O_handler.put(FJP_MAIL_MOTION, pactid, errmsg);
	}

	putLog(type, msg) {
		this.m_O_log.put(type, msg);
	}

	putMail(way, pactid, errmsg) {
		this.m_O_handler.put(way, pactid, errmsg);
	}

	beginAll() {
		this.m_O_log.put(G_SCRIPT_DEBUG, "\u30C8\u30E9\u30F3\u30B6\u30AF\u30B7\u30E7\u30F3\u958B\u59CB");
		this.m_O_db.begin();
	}

	endAll(is_commit) {
		if (is_commit) {
			this.m_O_db.commit();
			this.m_O_log.put(G_SCRIPT_DEBUG, "\u30C8\u30E9\u30F3\u30B6\u30AF\u30B7\u30E7\u30F3\u53CD\u6620");
		} else {
			this.m_O_db.rollback();
			this.m_O_log.put(G_SCRIPT_DEBUG, "\u30C8\u30E9\u30F3\u30B6\u30AF\u30B7\u30E7\u30F3\u7834\u68C4");
		}
	}

	begin(name = FJP_SAVEPOINT_NAME) {
		this.m_O_db.query("savepoint " + name + ";");
	}

	end(is_commit, name = FJP_SAVEPOINT_NAME) {
		if (is_commit) {
			this.m_O_db.query("release savepoint " + name + ";");
		} else {
			this.m_O_db.query("rollback to savepoint " + name + ";");
		}
	}

	escape(var) {
		return this.m_O_db.escape(var);
	}

	getTableNo(year, month) {
		return this.m_O_table_no.get(year, month);
	}

	getCurrent(is_timezone = false) {
		var cur = date("Y/m/d H:i:s") + (is_timezone ? "+09" : "");
		cur = this.escape(cur);
		return "'" + cur + "'";
	}

	getCurrentWithoutTime(is_timezone = false) {
		var cur = date("Y/m/d") + " 00:00:00" + (is_timezone ? "+09" : "");
		cur = this.escape(cur);
		return "'" + cur + "'";
	}

	getTableName(name, table_no, table_type = 1) {
		if (Array.isArray(table_no)) {
			if (1 == table_type && undefined !== table_no.table_no) table_no = table_no.table_no;else table_no = "";
		}

		if (!table_no.length) return str_replace("%", "tb", name);else return str_replace("%", table_no + "_tb", name);
	}

	getSQLWhere(H_param: {} | any[], A_string: {} | any[], table_name = "") {
		var sql = " ";

		for (var key in H_param) {
			var value = H_param[key];
			sql += " and ";
			if (table_name.length) sql += table_name + ".";
			sql += key + "=";
			if (-1 !== A_string.indexOf(key)) sql += "'";
			sql += this.escape(value);
			if (-1 !== A_string.indexOf(key)) sql += "'";
		}

		sql += " ";
		return sql;
	}

	getSQLOn(left, right, A_column: {} | any[]) {
		var sql = " ";

		for (var cnt = 0; cnt < A_column.length; ++cnt) {
			var column = A_column[cnt];
			sql += cnt ? "and " : "on ";
			sql += left + "." + column + "=" + right + "." + column + " ";
		}

		return sql;
	}

	getSQLBooleanToInt(name) {
		return "case when " + name + " then 1 else 0 end";
	}

	executePact(H_master_pact: {} | any[], waytype, table_no, H_setting_all: {} | any[], pactid, H_setting_pact: {} | any[], logdir, is_fast) //現在のDBの内容を読み出す-------------------------------------------
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
		var H_err = Array();
		var return_var = true;
		var msg_pact = "\u9867\u5BA2ID\u306F" + pactid;
		var A_msg_param = [msg_pact];
		var cmd = "DB\u304B\u3089\u306E\u60C5\u5831\u53D6\u5F97";
		this.begin();
		var H_tgtpact = Array();

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
		cmd = "\u4E88\u7D04\u60C5\u5831\u306E\u7834\u68C4";
		this.begin();

		if (!this.deleteReserve(H_tgtpact, H_err)) //トランザクション破棄
			//処理は続ける
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				return_var = false;
			} else //トランザクション反映
			{
				this.end(true);
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

		cmd = "\u8FFD\u52A0\u30FB\u66F4\u65B0\u5F8C\u306E\u90E8\u7F72\u60C5\u5831\u306E\u53D6\u5F97";
		A_msg_param = [msg_pact];
		this.begin();
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

		for (var usercode in H_master_pact) {
			var H_master_user = H_master_pact[usercode];
			var A_postid = Array();
			var H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //現在か過去最新月に存在しない部署がある
				//メッセージを残す
				//職制を不明部署とする(先頭に"P"が付かない)
				{
					var msg = "";

					for (var type in H_is_in) {
						var is_in = H_is_in[type];
						if (is_in) continue;
						if (msg.length) msg += "\u3068";
						msg += type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728";
					}

					msg = "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306E\u5F93\u696D\u54E1\u756A\u53F7" + usercode.substr(1) + "\u306E\u8077\u5236\u30B3\u30FC\u30C9" + H_master_user.userpostid + "\u304C\u8077\u5236\u30DE\u30B9\u30BF\u306B\u5B58\u5728\u305B\u305A\u3001" + msg + "\u306E\u90E8\u7F72\u30C6\u30FC\u30D6\u30EB\u306B\u3082\u5B58\u5728\u3057\u306A\u304B\u3063\u305F\u306E\u3067\u3001" + "\u4E0D\u660E\u90E8\u7F72" + H_setting_pact.postcode_unknown + "\u306E\u6240\u5C5E\u3068\u3057\u307E\u3057\u305F(" + msg_pact + ")";
					this.putMail(FJP_MAIL_ALL, pactid, msg);
					this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
					H_master_pact[usercode].userpostid = H_setting_pact.postcode_unknown;
				}
		}

		var H_usercode_userid = Array();

		for (var usercode in H_master_pact) //トランザクション開始
		//部署IDを取り出す
		//ユーザが存在するか？
		//トランザクション反映
		{
			var H_master_user = H_master_pact[usercode];
			var msg_user = "(\u5F93\u696D\u54E1\u756A\u53F7\u306F" + usercode.substr(1) + ")";
			this.begin();
			cmd = "\u8FFD\u52A0\u6E08\u306E\u90E8\u7F72\u60C5\u5831\u306E\u53C2\u7167(\u8FFD\u52A0)";
			A_msg_param = [msg_pact, msg_user, "(\u8077\u5236\u30B3\u30FC\u30C9\u306F" + H_master_user.userpostid + ")"];
			A_postid = Array();
			H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					return_var = false;
					continue;
				} else {
				this.executePactLog("ok_skip", pactid, cmd, H_err, A_msg_param);
			}

			if (!(undefined !== H_tgtpact.user[usercode])) //ユーザが存在しないので追加する
				{
					var userid = false;
					cmd = "\u30E6\u30FC\u30B6\u306E\u8FFD\u52A0";
					A_msg_param = [msg_pact, msg_user];
					var A_id = H_master_user.is_admin ? H_setting_pact.A_fncid_admin : H_setting_pact.A_fncid_user;

					if (!this.addUser(H_tgtpact, userid, H_master_user, A_postid[0], A_id, H_err)) //トランザクション破棄
						{
							this.end(false);
							this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
							return_var = false;
							continue;
						} else {
						this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
					}

					H_usercode_userid[usercode] = userid;
				} else //ユーザは存在する
				//権限が食い違えば権限変更を行う
				{
					var H_db_user = H_tgtpact.user[usercode];

					if (this.isChangeAdmin(H_tgtpact, H_master_user)) {
						cmd = "\u30E6\u30FC\u30B6\u306E\u6A29\u9650\u5909\u66F4";
						A_msg_param = [msg_pact, msg_user];
						A_id = H_master_user.is_admin ? H_setting_pact.A_fncid_admin : H_setting_pact.A_fncid_user;

						if (!this.changeAdmin(H_tgtpact, H_master_user, A_id, H_err)) //トランザクション破棄
							{
								this.end(false);
								this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
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
		cmd = "\u30D0\u30C3\u30D5\u30A1\u4E0A\u306E\u30E6\u30FC\u30B6\u30FB\u6A29\u9650\u306EDB\u53CD\u6620";
		this.begin();

		if (!this.endInserterUser(H_tgtpact)) //トランザクション破棄
			//処理は続ける
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				return_var = false;
			} else //トランザクション反映
			{
				this.end(true);
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

		for (var usercode in H_master_pact) //トランザクション開始
		//部署IDを取り出す
		//ユーザが元から存在するか？
		//ユーザ情報が食い違えば情報変更を行う
		//トランザクション反映
		{
			var H_master_user = H_master_pact[usercode];
			msg_user = "(\u5F93\u696D\u54E1\u756A\u53F7\u306F" + usercode.substr(1) + ")";
			this.begin();
			cmd = "\u8FFD\u52A0\u6E08\u306E\u90E8\u7F72\u60C5\u5831\u306E\u53C2\u7167(\u79FB\u52D5)";
			A_msg_param = [msg_pact, msg_user, "(\u8077\u5236\u30B3\u30FC\u30C9\u306F" + H_master_user.userpostid + ")"];
			A_postid = Array();
			H_is_in = Array();

			if (!this.userPostID2PostID(H_tgtpact, H_master_user, A_userpostid2postid, A_postid, H_is_in, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					return_var = false;
					continue;
				} else {
				this.executePactLog("ok_skip", pactid, cmd, H_err, A_msg_param);
			}

			var is_ready_user = true;
			userid = false;

			if (!(undefined !== H_tgtpact.user[usercode])) //新規追加した
				{
					is_ready_user = false;
					userid = H_usercode_userid[usercode];
				} else //元から存在した
				{
					H_db_user = H_tgtpact.user[usercode];
					userid = H_db_user.userid;
				}

			var H_change = Array();

			if (this.isChangeUser(H_tgtpact, H_master_user, usercode, is_ready_user, userid, H_change)) {
				cmd = "\u30E6\u30FC\u30B6\u306E\u8A2D\u5B9A\u5909\u66F4";
				A_msg_param = [msg_pact, msg_user];

				if (!this.changeUser(H_tgtpact, H_master_user, is_ready_user, userid, H_change, H_err)) //トランザクション破棄
					{
						this.end(false);
						this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
						return_var = false;
						continue;
					} else {
					this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
				}
			}

			H_change = Array();

			if (this.isMoveUser(H_tgtpact, H_master_user, usercode, is_ready_user, H_change)) {
				cmd = "\u30E6\u30FC\u30B6\u306E\u90E8\u7F72\u79FB\u52D5";
				A_msg_param = [msg_pact, msg_user];

				if (!this.moveUser(H_tgtpact, H_master_user, A_postid, is_ready_user, H_change, H_err)) //トランザクション破棄
					{
						this.end(false);
						this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
						return_var = false;
						continue;
					} else {
					this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
				}
			}

			cmd = "\u96FB\u8A71\u306E\u7D66\u4E0E\u8CA0\u62C5\u5143\u30B3\u30FC\u30C9\u30FB\u540D\u79F0\u306E\u66F4\u65B0";

			if (!this.changeUserSalary(H_tgtpact, H_master_user, H_err)) //トランザクション破棄
				{
					this.end(false);
					this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
					return_var = false;
					continue;
				} else {
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

			this.end(true);
		}

		cmd = "\u30E6\u30FC\u30B6\u306E\u524A\u9664";
		var table_type = 0;
		{
			let _tmp_7 = H_tgtpact.user;

			for (var usercode in _tmp_7) //削除不能ユーザならスキップする
			{
				var H_db_user = _tmp_7[usercode];
				msg_user = "(\u5F93\u696D\u54E1\u756A\u53F7\u306F" + usercode.substr(1) + ")";
				A_msg_param = [msg_pact, msg_user];

				if (H_db_user.is_admin || -1 !== H_tgtpact.user_fix.indexOf(usercode)) {
					this.executePactLog("skip", pactid, cmd, H_err, A_msg_param);
					continue;
				}

				if (undefined !== H_db_user.userpostid) {
					var postcode = "P" + H_db_user.userpostid;

					if (-1 !== H_setting_pact.A_postcode_protected.indexOf(postcode) || !strcmp(postcode, "P" + H_setting_pact.postcode_unknown) || undefined !== H_tgtpact["top_userpostid" + table_type] && !strcmp(postcode, "P" + H_tgtpact["top_userpostid" + table_type])) {
						this.executePactLog("skip", pactid, cmd, H_err, A_msg_param);
						continue;
					}
				}

				if (!(undefined !== H_master_pact[usercode])) //トランザクション開始
					//人事マスタに存在しないので削除する
					{
						this.begin();
						var is_fix_person = false;
						var is_fix_post = false;
						var is_fix_own = false;

						if (!this.deleteUser(H_tgtpact, H_db_user, is_fix_person, is_fix_post, is_fix_own, H_err)) //トランザクション破棄
							{
								this.end(false);
								this.executePactLog("fail_msg", pactid, cmd, H_err, A_msg_param);
								return_var = false;
								continue;
							} else //トランザクション反映
							{
								this.end(true);
								var type = "ok";
								if (is_fix_person) type = "fix_order_person";
								if (is_fix_post) type = "fix_order_post";
								if (is_fix_own) type = "fix_order_own";
								this.executePactLog(type, pactid, cmd, H_err, A_msg_param);
							}
					}
			}
		}
		cmd = "\u96FB\u8A71\u3068\u7AEF\u672B\u3078\u306E\u30E6\u30FC\u30B6\u60C5\u5831\u306E\u8A2D\u5B9A";
		A_msg_param = [msg_pact];
		this.begin();

		if (!this.changeUserMoveUserTelAssets(H_tgtpact, H_err)) //トランザクション破棄
			//処理は続ける
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				return_var = false;
			} else //トランザクション反映
			{
				this.end(true);
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

		cmd = "\u96FB\u8A71\u3068\u7AEF\u672B\u3078\u306E\u4E00\u62EC\u8A2D\u5B9A";
		this.begin();

		if (!this.deleteUserTelAssets(H_tgtpact, H_err, H_setting_pact.is_unknown_tel)) //トランザクション破棄
			//処理は続ける
			{
				this.end(false);
				this.executePactLog("fail", pactid, cmd, H_err, A_msg_param);
				return_var = false;
			} else //トランザクション反映
			{
				this.end(true);
				this.executePactLog("ok", pactid, cmd, H_err, A_msg_param);
			}

		return return_var;
	}

	executePactLog(status, pactid, cmd, H_err: {} | any[], A_msg_param: {} | any[]) {
		var msg = cmd;
		var param = "";
		param = A_msg_param.join("");

		switch (status) {
			case "ok_skip":
				break;

			case "ok":
				msg += "\u306B\u6210\u529F\u3057\u307E\u3057\u305F";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			case "fail":
			case "fail_msg":
				msg += "\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
				if (!strcmp("fail", status)) msg = FJP_ERRMSG_COMMON + "(" + msg + ")";
				if (undefined !== H_err.errmsg && H_err.errmsg.length) msg += "(" + H_err.errmsg + ")";
				if (undefined !== H_err.errparam && H_err.errparam.length) msg += "(" + H_err.errparam + ")";
				msg += param;
				this.putMail(FJP_MAIL_ALL, pactid, msg);
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			case "skip":
				msg += "\u306E\u5FC5\u8981\u304C\u7121\u304B\u3063\u305F\u306E\u3067\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3057\u305F";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			case "fix_order_person":
				msg += "\u306F\u3001\u6CE8\u6587\u306E\u500B\u4EBA\u627F\u8A8D\u8005\u3067\u3042\u3063\u305F\u306E\u3067" + "\u30E6\u30FC\u30B6\u3092\u524A\u9664\u3057\u307E\u305B\u3093\u3067\u3057\u305F";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			case "fix_order_post":
				msg += "\u306F\u3001\u627F\u8A8D\u90E8\u7F72\u306E\u6700\u5F8C\u306E\u627F\u8A8D\u6A29\u9650\u4FDD\u6709\u8005\u3060\u3063\u305F\u306E\u3067" + "\u30E6\u30FC\u30B6\u3092\u524A\u9664\u3057\u307E\u305B\u3093\u3067\u3057\u305F";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			case "fix_order_own":
				msg += "\u306F\u3001\u627F\u8A8D\u5F85\u3061\u306E\u3042\u308B\u6CE8\u6587\u8005\u3060\u3063\u305F\u306E\u3067" + "\u30E6\u30FC\u30B6\u3092\u524A\u9664\u3057\u307E\u305B\u3093\u3067\u3057\u305F";
				msg += param;
				this.putLog(G_SCRIPT_DEBUG, msg + "(pactid\u306F" + pactid + ")");
				break;

			default:
				this.putMail(FJP_MAIL_MOTION, pactid, "executePactLog::\u4E0D\u660E\u306Astatus:" + status + "/" + cmd + param);
				break;
		}

		H_err = Array();
	}

	getSeqStatusIndex() {
		var sql = "select nextval('fjp_hrm_status_index_tb_seq');";
		return this.getOneSafeLog(sql);
	}

	getSeqUserID() {
		var sql = "select nextval('user_tb_userid_seq');";
		return this.getOneSafeLog(sql);
	}

	getTgtPact(H_tgtpact: {} | any[], pactid, waytype, table_no, postcode_unknown, fncid_admin, logdir, is_fast, H_err: {} | any[]) //パラメータを作成する
	//不明部署の部署IDを読み出す
	//管理者のユーザIDを読み出す
	//挿入インスタンスを作成する
	{
		H_err.errmsg = "";
		if (!this.createTgtPact(H_tgtpact, pactid, waytype, table_no)) return false;

		for (var cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u30EB\u30FC\u30C8\u90E8\u7F72\u306E\u53D6\u308A\u51FA\u3057";
			if (!this.getTopPostID(H_tgtpact, cnt)) return false;
		}

		for (cnt = 0;; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u4E0D\u660E\u306A\u90E8\u7F72(" + postcode_unknown + ")\u306E\u53D6\u308A\u51FA\u3057";
			if (!this.getUnknownPostID(H_tgtpact, cnt, postcode_unknown)) return false;
		}

		H_err.errmsg = "\u7BA1\u7406\u8005\u6A29\u9650\u3092\u6301\u3064\u30E6\u30FC\u30B6\u306E\u8AAD\u307F\u51FA\u3057";
		if (!this.getAdminEmployeeCode(H_tgtpact, fncid_admin)) return false;
		H_err.errmsg = "\u65E2\u5B58\u306E\u30E6\u30FC\u30B6\u60C5\u5831\u306E\u8AAD\u307F\u51FA\u3057";
		if (!this.getUserAll(H_tgtpact)) return false;
		H_err.errmsg = "\u4FDD\u8B77\u30E6\u30FC\u30B6\u306E\u8AAD\u307F\u51FA\u3057";
		if (!this.getUserFix(H_tgtpact)) return false;

		for (cnt = 0;; cnt < 2; ++cnt) {
			H_err.errmsg = (cnt ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u4FDD\u8B77\u90E8\u7F72\u306E\u53D6\u308A\u51FA\u3057";
			if (!this.getFixPostID(H_tgtpact, cnt)) return false;
		}

		H_err.errmsg = "\u30C7\u30FC\u30BF\u633F\u5165\u306E\u6E96\u5099";
		if (!this.createInserter(H_tgtpact, logdir, is_fast)) return false;
		return true;
	}

	createTgtPact(H_tgtpact: {} | any[], pactid, waytype, table_no) {
		H_tgtpact.pactid = pactid;
		H_tgtpact.waytype = waytype;
		H_tgtpact.table_no = table_no;
		return true;
	}

	getTopPostID(H_tgtpact: {} | any[], table_type) //ルートの部署のuserpostidを取り出す
	{
		H_tgtpact["top" + table_type] = "";
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) return true;
		var rel = this.getTableName("post_relation_%", H_tgtpact, table_type);
		var sql = "select postidparent" + " from " + rel + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			level: 0
		}, Array()) + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		if (undefined !== result[0] && undefined !== result[0][0]) H_tgtpact["top" + table_type] = result[0][0];else return false;
		sql = "select userpostid from " + this.getTableName("post_%", H_tgtpact, table_type) + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			postid: result[0][0]
		}, Array()) + ";";
		result = this.getAllSafeLog(sql);
		if (false === result) return false;
		if (undefined !== result[0] && undefined !== result[0][0]) H_tgtpact["top_userpostid" + table_type] = result[0][0];else return false;
		return true;
	}

	getUnknownPostID(H_tgtpact: {} | any[], table_type, postcode_unknown) {
		H_tgtpact["unknown" + table_type] = "";
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) return true;
		var name = this.getTableName("post_%", H_tgtpact, table_type);
		var sql = "select postid" + " from " + name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			userpostid: postcode_unknown
		}, ["userpostid"]) + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		if (undefined !== result[0] && undefined !== result[0][0]) H_tgtpact["unknown" + table_type] = result[0][0];else return false;
		return true;
	}

	getAdminEmployeeCode(H_tgtpact: {} | any[], fncid) {
		var sql = "select employeecode from user_tb where userid in (" + "select userid from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			fncid: fncid
		}, Array()) + " group by userid" + ")" + " group by employeecode" + ";";
		var A_code = Array();
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;

		for (var A_line of Object.values(result)) A_code.push("U" + A_line[0]);

		H_tgtpact.adminuser = A_code;
		return true;
	}

	getUserAll(H_tgtpact: {} | any[]) {
		var sql = "select" + " user_tb.employeecode as employeecode" + ",user_tb.username as username" + ",user_tb.postid as postid" + ",post_tb.userpostid as userpostid" + ",user_tb.mail as mail" + ",coalesce(user_tb.type,'') as type" + ",user_tb.userid as userid" + " from user_tb" + " left join post_tb" + " " + this.getSQLOn("user_tb", "post_tb", ["pactid", "postid"]) + " where 1=1 " + this.getSQLWhere({
			"user_tb.pactid": H_tgtpact.pactid
		}, Array()) + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return false;
		var H_user = Array();

		for (var H_line of Object.values(result)) {
			H_line.is_admin = 0 != strcmp("US", H_line.type);
			H_user["U" + H_line.employeecode] = H_line;
		}

		H_tgtpact.user = H_user;
		return true;
	}

	getUserFix(H_tgtpact: {} | any[]) {
		var sql = "select" + " employeecode" + " from user_tb" + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			"coalesce(fix_flag,false)": "true"
		}, Array()) + " group by employeecode" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return false;
		var H_user = Array();

		for (var H_line of Object.values(result)) {
			if (!H_line.employeecode.length) continue;
			H_user.push("U" + H_line.employeecode);
		}

		H_tgtpact.user_fix = H_user;
		return true;
	}

	getFixPostID(H_tgtpact: {} | any[], table_type) {
		H_tgtpact["post_fix" + table_type] = Array();
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) return true;
		var name = this.getTableName("post_%", H_tgtpact, table_type);
		var sql = "select userpostid" + " from " + name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			"coalesce(fix_flag,false)": "true"
		}, Array()) + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;

		for (var H_line of Object.values(result)) H_tgtpact["post_fix" + table_type].push("P" + H_line[0]);

		return true;
	}

	createInserter(H_tgtpact: {} | any[], logdir, is_fast) {
		H_tgtpact.inserter = Array();
		var H_param = {
			user: "user_tb",
			fnc: "fnc_relation_tb"
		};

		for (var key in H_param) {
			var table_name = H_param[key];
			H_tgtpact.inserter[key] = is_fast ? new TableInserterSafe(this.m_O_log, this.m_O_db, logdir + table_name + ".insert", true) : new TableInserterSlowSafe(this.m_O_log, this.m_O_db);
			if (!H_tgtpact.inserter[key].begin(table_name)) return false;
			H_tgtpact.inserter[key].setUnlock();
		}

		return true;
	}

	endInserterUser(H_tgtpact: {} | any[]) //必ず、ユーザ→権限の順に書き込む
	{
		var A_key = ["user", "fnc"];

		for (var key of Object.values(A_key)) {
			if (!(undefined !== H_tgtpact.inserter[key])) continue;
			if (!H_tgtpact.inserter[key].end()) return false;
		}

		return true;
	}

	deleteReserve(H_tgtpact: {} | any[], H_err: {} | any[]) //tel_rel_tel_reserve_tbから削除する
	{
		H_err.errmsg = "\u4E88\u7D04\u6E08\u306E\u96FB\u8A71\u30FB\u96FB\u8A71\u9023\u4FC2\u60C5\u5831\u306E\u524A\u9664";
		if (!this.deleteReserveTelRelTel(H_tgtpact)) return false;
		H_err.errmsg = "\u4E88\u7D04\u6E08\u306E\u7AEF\u672B\u60C5\u5831\u306E\u524A\u9664";
		if (!this.deleteReserveAssets(H_tgtpact)) return false;
		H_err.errmsg = "\u4E88\u7D04\u6E08\u306E\u96FB\u8A71\u30FB\u7AEF\u672B\u9023\u4FC2\u60C5\u5831\u306E\u524A\u9664";
		if (!this.deleteReserveTelRelAssets(H_tgtpact)) return false;
		H_err.errmsg = "\u4E88\u7D04\u6E08\u306E\u96FB\u8A71\u60C5\u5831\u306E\u524A\u9664";
		if (!this.deleteReserveTel(H_tgtpact)) return false;
		return true;
	}

	deleteReserveTelRelTel(H_tgtpact: {} | any[]) {
		var sql = "delete from tel_rel_tel_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + " and tel_reserve_tb.pactid" + "=tel_rel_tel_reserve_tb.pactid" + " and tel_reserve_tb.telno" + "=tel_rel_tel_reserve_tb.telno" + " and tel_reserve_tb.carid" + "=tel_rel_tel_reserve_tb.carid" + " and tel_reserve_tb.add_edit_flg" + "=tel_rel_tel_reserve_tb.add_edit_flg" + " and tel_reserve_tb.reserve_date" + "=tel_rel_tel_reserve_tb.reserve_date" + " )" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveAssets(H_tgtpact: {} | any[]) {
		var sql = "delete from assets_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_rel_assets_reserve_tb" + " left join tel_reserve_tb" + " on tel_rel_assets_reserve_tb.pactid" + "=tel_reserve_tb.pactid" + " and tel_rel_assets_reserve_tb.telno" + "=tel_reserve_tb.telno" + " and tel_rel_assets_reserve_tb.carid" + "=tel_reserve_tb.carid" + " and tel_rel_assets_reserve_tb.add_edit_flg" + "=tel_reserve_tb.add_edit_flg" + " and tel_rel_assets_reserve_tb.reserve_date" + "=tel_reserve_tb.reserve_date" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.telno is not null" + " and tel_reserve_tb.order_flg=false" + " and tel_rel_assets_reserve_tb.pactid" + "=assets_reserve_tb.pactid" + " and tel_rel_assets_reserve_tb.assetsid" + "=assets_reserve_tb.assetsid" + " and tel_rel_assets_reserve_tb.add_edit_flg" + "=assets_reserve_tb.add_edit_flg" + " and tel_rel_assets_reserve_tb.reserve_date" + "=assets_reserve_tb.reserve_date" + ")" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveTelRelAssets(H_tgtpact: {} | any[]) {
		var sql = "delete from tel_rel_assets_reserve_tb" + " where pactid=" + H_tgtpact.pactid + " and exists(" + " select * from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + " and tel_reserve_tb.pactid" + "=tel_rel_assets_reserve_tb.pactid" + " and tel_reserve_tb.telno" + "=tel_rel_assets_reserve_tb.telno" + " and tel_reserve_tb.carid" + "=tel_rel_assets_reserve_tb.carid" + " and tel_reserve_tb.add_edit_flg" + "=tel_rel_assets_reserve_tb.add_edit_flg" + " and tel_reserve_tb.reserve_date" + "=tel_rel_assets_reserve_tb.reserve_date" + ")" + ";";
		return this.querySafeLog(sql);
	}

	deleteReserveTel(H_tgtpact: {} | any[]) {
		var sql = "delete from tel_reserve_tb" + " where tel_reserve_tb.pactid=" + H_tgtpact.pactid + " and tel_reserve_tb.order_flg=false" + ";";
		return this.querySafeLog(sql);
	}

	addUser(H_tgtpact: {} | any[], userid, H_tgtuser: {} | any[], postid, A_id: {} | any[], H_err: {} | any[]) //ユーザIDを採番する
	{
		H_err.errmsg = "\u30E6\u30FC\u30B6\u9023\u756A\u306E\u63A1\u756A";
		userid = this.getSeqUserID();
		if (false === userid) return false;
		H_err.errmsg = "\u30E6\u30FC\u30B6\u306E\u8FFD\u52A0";
		if (!this.addUserUser(H_tgtpact, H_tgtuser, userid, postid)) return false;
		H_err.errmsg = "\u30E6\u30FC\u30B6\u306E\u6A29\u9650\u306E\u8FFD\u52A0";
		if (!this.addUserFunc(H_tgtpact, userid, A_id)) return false;
		return true;
	}

	addUserUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], userid, postid) //ユーザを追加する
	//passwordはホットライン時代のmd5を使ってエンコードしている
	//ログイン画面で、md5形式なら新しい形式に読み替える機能がある
	{
		return H_tgtpact.inserter.user.insert({
			pactid: H_tgtpact.pactid,
			userid: userid,
			username: H_tgtuser.username,
			postid: postid,
			loginid: H_tgtuser.employeecode,
			passwd: md5(H_tgtuser.employeecode),
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

	addUserFunc(H_tgtpact: {} | any[], userid, A_id: {} | any[]) {
		for (var fncid of Object.values(A_id)) {
			if (!H_tgtpact.inserter.fnc.insert({
				pactid: H_tgtpact.pactid,
				userid: userid,
				fncid: fncid
			})) return false;
		}

		return true;
	}

	isChangeAdmin(H_tgtpact: {} | any[], H_master_user: {} | any[]) {
		var is_admin = -1 !== H_tgtpact.adminuser.indexOf("U" + H_master_user.employeecode);
		return is_admin != H_master_user.is_admin;
	}

	changeAdmin(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_id: {} | any[], H_err: {} | any[]) //ユーザの役職を切り替える
	{
		H_err.errmsg = "\u30E6\u30FC\u30B6\u306E\u6A29\u9650\u306E\u5207\u308A\u66FF\u3048";
		if (!this.changeAdminUser(H_tgtpact, H_tgtuser, A_id)) return false;
		return true;
	}

	changeAdminUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_id: {} | any[]) //既存の権限を削除する
	{
		var sql = "delete from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and userid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		if (!this.querySafeLog(sql)) return false;
		sql = this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser);
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		var A_userid = Array();

		for (var A_line of Object.values(result)) A_userid.push(A_line[0]);

		for (var userid of Object.values(A_userid)) {
			if (!this.addUserFunc(H_tgtpact, userid, A_id)) return false;
		}

		return true;
	}

	isChangeUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], usercode, is_ready_user, userid, H_change: {} | any[]) //ユーザ
	{
		H_change = Array();

		if (is_ready_user) //元からユーザが存在した場合のみ検査する
			{
				var A_change = Array();

				if (undefined !== H_tgtpact.user[usercode] && this.isChangeUserUser(H_tgtpact.user[usercode], H_tgtuser, A_change)) {
					H_change.user = A_change;
				}
			}

		return H_change.length;
	}

	changeUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_ready_user, userid, H_change: {} | any[], H_err) //ユーザを更新する
	{
		if (is_ready_user && undefined !== H_change.user) {
			var A_change = H_change.user;
			H_err.errmsg = "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3078\u306E\u30E6\u30FC\u30B6\u60C5\u5831\u306E\u5909\u66F4";
			if (!this.changeUserUser(H_tgtpact, H_tgtuser, A_change)) return false;
		}

		return true;
	}

	isChangeUserUser(H_user1: {} | any[], H_user2: {} | any[], A_change: {} | any[]) {
		A_change = Array();
		var A_column = ["username", "mail"];

		for (var column of Object.values(A_column)) if (strcmp(H_user1[column], H_user2[column])) A_change.push(column);

		return A_change.length;
	}

	changeUserUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_change: {} | any[]) {
		if (!A_change.length) return true;
		var username = this.escape(H_tgtuser.username);
		var mail = this.escape(H_tgtuser.mail);
		var sql = "update user_tb" + " set fixdate=" + this.getCurrent();
		if (-1 !== A_change.indexOf("username")) sql += ",username='" + username + "'";
		if (-1 !== A_change.indexOf("mail")) sql += ",mail='" + mail + "'";
		sql += " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]);
		sql += ";";
		if (!this.querySafeLog(sql)) return false;
		return true;
	}

	changeUserSalary(H_tgtpact: {} | any[], H_tgtuser: {} | any[], H_err: {} | any[]) {
		for (var table_type = 0; table_type < 2; ++table_type) {
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) continue;
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u7D66\u4E0E\u8CA0\u62C5\u5143\u30B3\u30FC\u30C9\u30FB\u540D\u79F0\u306E\u66F4\u65B0";
			var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_id + "=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + ",salary_source_code=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + "," + this.m_column_name + "=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + ",salary_source_name=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + ",executive_no=" + "'" + this.escape(H_tgtuser.executive_no) + "'" + ",executive_name=" + "'" + this.escape(H_tgtuser.executive_name) + "'" + ",executive_mail=" + "'" + this.escape(H_tgtuser.executive_mail) + "'" + ",employee_class=" + this.escape(H_tgtuser.employee_class) + ",office_code=" + "'" + this.escape(H_tgtuser.office_code) + "'" + ",office_name=" + "'" + this.escape(H_tgtuser.office_name) + "'" + ",building_name=" + "'" + this.escape(H_tgtuser.building_name) + "'" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode=" + "'" + this.escape(H_tgtuser.employeecode) + "'" + " and (" + " coalesce(" + this.m_column_id + ",'')!=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + " or" + " coalesce(salary_source_code,'')!=" + "'" + this.escape(H_tgtuser.salary_id) + "'" + " or" + " coalesce(" + this.m_column_name + ",'')!=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + " or" + " coalesce(salary_source_name,'')!=" + "'" + this.escape(H_tgtuser.salary_name) + "'" + " or" + " coalesce(executive_no,'')!=" + "'" + this.escape(H_tgtuser.executive_no) + "'" + " or" + " coalesce(executive_name,'')!=" + "'" + this.escape(H_tgtuser.executive_name) + "'" + " or" + " coalesce(executive_mail,'')!=" + "'" + this.escape(H_tgtuser.executive_mail) + "'" + " or" + " coalesce(employee_class,0)!=" + this.escape(H_tgtuser.employee_class) + " or" + " coalesce(office_code,'')!=" + "'" + this.escape(H_tgtuser.office_code) + "'" + " or" + " coalesce(office_name,'')!=" + "'" + this.escape(H_tgtuser.office_name) + "'" + " or" + " coalesce(building_name,'')!=" + "'" + this.escape(H_tgtuser.building_name) + "'" + ")" + ";";
			if (!this.querySafeLog(sql)) return false;
		}

		return true;
	}

	isMoveUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], userid, is_ready_user, H_change: {} | any[]) //ユーザで部署移動が必要か確認する
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

	moveUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_postid: {} | any[], is_ready_user, H_change: {} | any[], H_err: {} | any[]) //ユーザテーブルを更新する
	{
		if (is_ready_user && undefined !== H_change.user && H_change.user) {
			H_err.errmsg = "\u30E6\u30FC\u30B6\u306E\u6240\u5C5E\u90E8\u7F72\u5909\u66F4";
			if (!this.moveUserUser(H_tgtpact, H_tgtuser, A_postid[0])) return false;
		}

		return true;
	}

	isMoveUserUser(H_user1: {} | any[], H_user2: {} | any[]) {
		return strcmp(H_user1.userpostid, H_user2.userpostid);
	}

	moveUserUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], postid) {
		var sql = "update user_tb" + " set fixdate=" + this.getCurrent() + ",postid=" + postid + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + " and postid!=" + postid + ";";
		if (!this.querySafeLog(sql)) return false;
		return true;
	}

	changeUserMoveUserTelAssets(H_tgtpact: {} | any[], H_err: {} | any[]) {
		for (var table_type = 0; table_type < 2; ++table_type) //電話を更新する(user_tbから、commflagと無関係に)
		{
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) continue;
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			var tel_rel_assets_x_tb = this.getTableName("tel_rel_assets_%", H_tgtpact, table_type);
			var assets_x_tb = this.getTableName("assets_%", H_tgtpact, table_type);
			var user_tb = "user_tb";
			var post_x_tb = this.getTableName("post_%", H_tgtpact, table_type);
			var second = this.escape("000");
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u30E6\u30FC\u30B6\u60C5\u5831\u306E\u66F4\u65B0";
			var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",username=" + user_tb + ".username" + ",mail=" + user_tb + ".mail" + ",userid=" + user_tb + ".userid" + " from " + user_tb + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + ";";
			if (!this.querySafeLog(sql)) return false;
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u90E8\u7F72\u306E\u66F4\u65B0(1\u306E\u524D\u534A)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",cfbpostcode_first=" + post_x_tb + ".userpostid" + ",cfbpostcode_second='" + second + "'" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + " and coalesce(" + tel_x_tb + ".commflag,'')='auto'" + " and coalesce(" + tel_x_tb + ".cfbpostcode_first,'')" + "!=" + post_x_tb + ".userpostid" + ";";
			if (!this.querySafeLog(sql)) return false;
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u90E8\u7F72\u306E\u66F4\u65B0(1\u306E\u5F8C\u534A)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",cfbpostcode=coalesce(cfbpostcode_first,'')" + "||coalesce(cfbpostcode_second,'')" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + " and coalesce(" + tel_x_tb + ".commflag,'')='auto'" + " and coalesce(" + tel_x_tb + ".cfbpostcode,'')" + "!=(coalesce(" + tel_x_tb + ".cfbpostcode_first,'')" + "||coalesce(" + tel_x_tb + ".cfbpostcode_second,''))" + ";";
			if (!this.querySafeLog(sql)) return false;
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u90E8\u7F72\u306E\u66F4\u65B0(2)";
			sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + post_x_tb + ".postid" + " from " + user_tb + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".pactid=" + user_tb + ".pactid" + " and " + tel_x_tb + ".employeecode=" + user_tb + ".employeecode" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + ";";
			if (!this.querySafeLog(sql)) return false;
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u7AEF\u672B\u306E\u30E6\u30FC\u30B6\u60C5\u5831\u306E\u66F4\u65B0";
			sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",username=" + user_tb + ".username" + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " left join " + user_tb + this.getSQLOn(tel_x_tb, user_tb, ["pactid", "employeecode"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + ";";
			if (!this.querySafeLog(sql)) return false;
			H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u7AEF\u672B\u306E\u90E8\u7F72\u306E\u66F4\u65B0";
			sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + post_x_tb + ".postid" + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " left join " + user_tb + this.getSQLOn(tel_x_tb, user_tb, ["pactid", "employeecode"]) + " left join " + post_x_tb + this.getSQLOn(user_tb, post_x_tb, ["pactid", "postid"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and " + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + user_tb + ".userid is not null" + " and " + user_tb + ".employeecode is not null" + " and " + post_x_tb + ".postid is not null" + ";";
			if (!this.querySafeLog(sql)) return false;
		}

		return true;
	}

	deleteUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_fix_person, is_fix_post, is_fix_own, H_err: {} | any[]) //個人別承認者になっていないか確認する
	{
		H_err.errmsg = "\u30AA\u30FC\u30C0\u30FC\u306E\u500B\u4EBA\u627F\u8A8D\u8005\u306E\u78BA\u8A8D";
		if (!this.deleteUserOrderPerson(H_tgtpact, H_tgtuser, is_fix_person)) return false;

		if (is_fix_person) {
			return true;
		}

		H_err.errmsg = "\u30AA\u30FC\u30C0\u30FC\u306E\u90E8\u7F72\u306E\u6700\u5F8C\u306E\u627F\u8A8D\u8005\u306E\u78BA\u8A8D";
		if (!this.deleteUserOrderPost(H_tgtpact, H_tgtuser, is_fix_post)) return false;

		if (is_fix_post) {
			return true;
		}

		H_err.errmsg = "\u8CA9\u58F2\u5E97\u53D7\u6CE8\u6E08\u307E\u3067\u884C\u3063\u3066\u3044\u306A\u3044\u30AA\u30FC\u30C0\u30FC\u306E\u30AD\u30E3\u30F3\u30BB\u30EB";
		if (!this.deleteUserOrderCancel(H_tgtpact, H_tgtuser, is_fix_own)) return false;

		if (is_fix_own) {
			return true;
		}

		H_err.errmsg = "\u6A29\u9650\u306E\u524A\u9664";
		if (!this.deleteUserFnc(H_tgtpact, H_tgtuser)) return false;
		H_err.errmsg = "\u30E6\u30FC\u30B6\u306E\u524A\u9664";
		if (!this.deleteUserUser(H_tgtpact, H_tgtuser)) return false;
		return true;
	}

	deleteUserOrderPerson(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_fix) {
		is_fix = false;
		var sql = "select count(*) from mt_order_tb" + " where status in (5,7)" + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and recoguserid in(" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		var result = this.getOneSafeLog(sql);
		if (false === result) return false;
		is_fix = 0 < result;
		return true;
	}

	deleteUserOrderPost(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_fix) //削除するユーザのユーザIDと部署IDを取り出す
	{
		is_fix = false;
		var fncid = FJP_FNCID_ORDER;
		var sql = " select userid,postid from user_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return false;

		for (var H_line of Object.values(result)) //自分が部署承認者でなければスキップする
		{
			var userid = H_line.userid;
			var postid = H_line.postid;
			sql = "select count(*) from fnc_relation_tb" + " where pactid=" + H_tgtpact.pactid + " and userid=" + userid + " and fncid=" + fncid + ";";
			result = this.getOneSafeLog(sql);
			if (false === result) return false;
			if (0 == result) continue;
			sql = "select count(*) from user_tb" + " where pactid=" + H_tgtpact.pactid + " and postid=" + postid + " and userid!=" + userid + " and userid in (" + " select userid from fnc_relation_tb" + " where pactid=" + H_tgtpact.pactid + " and fncid=" + fncid + ")" + ";";
			result = this.getOneSafeLog(sql);
			if (false === result) return false;

			if (0 < result) //他に権限を持っているユーザがいるので削除できる
				{
					continue;
				}

			sql = "select count(*) from mt_order_tb" + " where pactid=" + H_tgtpact.pactid + " and status in (10,20)" + " and nextpostid is not null" + " and nextpostid=" + postid + ";";
			result = this.getOneSafeLog(sql);
			if (false === result) return false;

			if (0 < result) //承認待ちの注文があるので削除できない
				{
					is_fix = true;
					return true;
				}
		}

		return true;
	}

	deleteUserOrderCancel(H_tgtpact: {} | any[], H_tgtuser: {} | any[], is_fix) //そのようなオーダーがあるか確認する
	{
		is_fix = false;
		var sql = "select count(*) from mt_order_tb" + " where pactid=" + H_tgtpact.pactid + " and status<=49" + " and status!=30" + " and chargerid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		var result = this.getOneSafeLog(sql);
		if (false === result) return false;
		if (0 < result) is_fix = true;
		return true;
	}

	deleteUserFnc(H_tgtpact: {} | any[], H_tgtuser: {} | any[]) {
		var sql = "delete from fnc_relation_tb where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + " and userid in (" + this.getSQLUserIDFromEmployeeCode(H_tgtpact, H_tgtuser) + ")" + ";";
		if (!this.querySafeLog(sql)) return false;
		return true;
	}

	deleteUserUser(H_tgtpact: {} | any[], H_tgtuser: {} | any[]) {
		var sql = "delete from user_tb" + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + ";";
		var result = this.querySafe(sql);
		if (!result.length) return true;
		var pat = "/\\[nativecode=ERROR: *(-?[0-9]+)\\]/";
		var A_match = Array();
		preg_match(pat, result, A_match, PREG_OFFSET_CAPTURE);

		if (1 < A_match.length && undefined !== A_match[1][0] && A_match[1][0].length) {
			H_err.errparam = "\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9\u306F" + A_match[1][0];
		}

		return false;
	}

	deleteUserTelAssets(H_tgtpact: {} | any[], H_err: {} | any[], is_unknown_tel) {
		for (var table_type = 0; table_type < 2; ++table_type) {
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) continue;
			var tel_x_tb = this.getTableName("tel_%", H_tgtpact, table_type);
			var tel_rel_assets_x_tb = this.getTableName("tel_rel_assets_%", H_tgtpact, table_type);
			var assets_x_tb = this.getTableName("assets_%", H_tgtpact, table_type);
			var user_tb = "user_tb";

			if (is_unknown_tel) //職制マスタに無い利用者の電話を不明部署に移動する
				//FJP13の、修正前の動作
				//電話の部署を不明部署にする
				{
					H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u90E8\u7F72\u306E\u66F4\u65B0(\u524D)";
					var sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + H_tgtpact["unknown" + table_type] + "," + this.m_column_date + "=" + this.getCurrentWithoutTime() + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(employeecode,''))=0" + " and postid!=" + H_tgtpact["top" + table_type] + "))" + ";";
					if (!this.querySafeLog(sql)) return false;
					H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u4E0D\u660E\u90E8\u7F72\u4EE5\u5916\u306E\u96FB\u8A71\u306E\u8FFD\u52A0\u9805\u76EE\u65E5\u4ED81\u3092NULL\u306B\u66F4\u65B0" + "(\u524D)";
					sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_date + "=null" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and " + this.m_column_date + " is not null" + ";";
					if (!this.querySafeLog(sql)) return false;
					H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u7AEF\u672B\u306E\u90E8\u7F72\u306E\u66F4\u65B0(\u524D)";
					sql = "update " + assets_x_tb + " set fixdate=" + this.getCurrent() + ",postid=" + H_tgtpact["unknown" + table_type] + " from " + tel_x_tb + " left join " + tel_rel_assets_x_tb + this.getSQLOn(tel_x_tb, tel_rel_assets_x_tb, ["pactid", "telno", "carid"]) + " where " + assets_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + assets_x_tb + ".postid!=" + H_tgtpact["unknown" + table_type] + " and " + assets_x_tb + ".pactid=" + tel_rel_assets_x_tb + ".pactid" + " and " + assets_x_tb + ".assetsid=" + tel_rel_assets_x_tb + ".assetsid" + " and " + tel_x_tb + ".telno is not null" + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(" + tel_x_tb + ".employeecode,''))=0" + " and " + assets_x_tb + ".postid!=" + H_tgtpact["top" + table_type] + "))" + ";";
					if (!this.querySafeLog(sql)) return false;
				} else //職制マスタに無い利用者の電話を不明部署に移動しない
				//FJP13の、修正後の動作
				//不明利用者ではない電話回線は、追加項目日付1をNULLにする
				{
					var username_pre = "\u2605";
					var username_post = "(\u4EBA\u4E8B\u30C7\u30FC\u30BF\u306A\u3057)";
					H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u4E0D\u660E\u90E8\u7F72\u4EE5\u5916\u306E\u96FB\u8A71\u306E\u8FFD\u52A0\u9805\u76EE\u65E5\u4ED81\u3092NULL\u306B\u66F4\u65B0" + "(\u5F8C)";
					sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + "," + this.m_column_date + "=null" + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and " + this.m_column_date + " is not null" + " and (" + " username not like '" + username_pre + "%'" + " or" + " username not like '%" + username_post + "'" + " )" + ";";
					if (!this.querySafeLog(sql)) return false;
					H_err.errmsg = (table_type ? "\u904E\u53BB\u6700\u65B0\u6708" : "\u73FE\u5728") + "\u306E\u96FB\u8A71\u306E\u90E8\u7F72\u306E\u66F4\u65B0(\u5F8C)";
					sql = "update " + tel_x_tb + " set fixdate=" + this.getCurrent() + ",username='" + username_pre + "' || username" + " || '" + username_post + "'" + "," + this.m_column_date + "=" + this.getCurrentWithoutTime() + " where " + tel_x_tb + ".pactid=" + H_tgtpact.pactid + " and postid!=" + H_tgtpact["unknown" + table_type] + " and ((" + tel_x_tb + ".employeecode is not null" + " and length(" + tel_x_tb + ".employeecode)>0" + " and " + tel_x_tb + ".employeecode not in(" + " select employeecode from " + user_tb + " where pactid=" + H_tgtpact.pactid + " and employeecode is not null" + " group by employeecode" + ")" + ")or(" + "length(coalesce(employeecode,''))=0" + " and postid!=" + H_tgtpact["top" + table_type] + "))" + " and username not like '" + username_pre + "%'" + " and username not like '%" + username_post + "'" + ";";
					if (!this.querySafeLog(sql)) return false;
				}
		}

		return true;
	}

	userPostID2PostID(H_tgtpact: {} | any[], H_tgtuser: {} | any[], A_userpostid2postid: {} | any[], H_postid: {} | any[], H_is_in: {} | any[], H_err: {} | any[]) {
		var is_in = true;
		H_is_in = Array();

		for (var table_type = 0; table_type < 2; ++table_type) {
			if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) continue;
			var postcode = "P" + H_tgtuser.userpostid;

			if (!(undefined !== A_userpostid2postid[table_type][postcode])) {
				H_postid[table_type] = H_tgtpact["unknown" + table_type];
				H_is_in[table_type] = false;
				is_in = false;
			} else {
				H_postid[table_type] = A_userpostid2postid[table_type][postcode];
				H_is_in[table_type] = true;
			}
		}

		return is_in;
	}

	getUserPost(H_tgtpact: {} | any[], A_userpostid2postid: {} | any[], H_err: {} | any[]) {
		for (var cnt = 0; cnt < 2; ++cnt) {
			H_err.errmsg = "\u8FFD\u52A0\u30FB\u5909\u66F4\u5F8C\u306E\u90E8\u7F72\u60C5\u5831\u306E\u8AAD\u307F\u51FA\u3057";
			var H_userpostid2postid = Array();
			if (!this.getUserGetPost(H_tgtpact, H_userpostid2postid, cnt)) return false;
			A_userpostid2postid[cnt] = H_userpostid2postid;
		}

		return true;
	}

	getUserGetPost(H_tgtpact: {} | any[], H_userpostid2postid: {} | any[], table_type) {
		H_userpostid2postid = Array();
		if (table_type && FJP_WAYTYPE_CUR == H_tgtpact.waytype) return true;
		var table_name = this.getTableName("post_%", H_tgtpact, table_type);
		var sql = "select userpostid,postid from " + table_name + " where 1=1 " + this.getSQLWhere({
			pactid: H_tgtpact.pactid
		}, Array()) + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;

		for (var A_line of Object.values(result)) H_userpostid2postid["P" + A_line[0]] = A_line[1];

		return true;
	}

	getSQLUserIDFromEmployeeCode(H_tgtpact: {} | any[], H_tgtuser: {} | any[]) {
		return " select userid from user_tb where 1=1 " + " and userid is not null" + " and employeecode is not null" + this.getSQLWhere({
			pactid: H_tgtpact.pactid,
			employeecode: H_tgtuser.employeecode
		}, ["employeecode"]) + " group by userid";
	}

	executePreCheckAll(A_pactid_fail: {} | any[], A_pactid_in: {} | any[], A_pactid_out: {} | any[], A_table_no: {} | any[]) {
		A_pactid_fail = Array();
		var return_var = true;
		var A_pactid = this.getPreCheckPactID();

		for (var pactid of Object.values(A_pactid)) {
			if (A_pactid_in.length && !(-1 !== A_pactid_in.indexOf(pactid))) {
				this.putLog(G_SCRIPT_DEBUG, "\u5B9F\u884C\u30EA\u30B9\u30C8\u306B\u7121\u304B\u3063\u305F\u306E\u3067\u51E6\u7406\u305B\u305A" + pactid);
				continue;
			}

			if (A_pactid_out.length && -1 !== A_pactid_out.indexOf(pactid)) {
				this.putLog(G_SCRIPT_DEBUG, "\u9664\u5916\u30EA\u30B9\u30C8\u306B\u3042\u3063\u305F\u306E\u3067\u51E6\u7406\u305B\u305A" + pactid);
				continue;
			}

			var is_fail = false;

			if (!this.executePreCheck(is_fail, pactid, A_table_no)) {
				return false;
			}

			if (is_fail) A_pactid_fail.push(pactid);
		}

		return return_var;
	}

	executePreCheck(is_fail, pactid, A_table_no: {} | any[]) //端末の検査をスキップするならtrue
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
		var return_var = true;
		var H_table_no = Array();
		var is_skip_assets = true;

		for (var table_no of Object.values(A_table_no)) {
			H_table_no[table_no] = table_no.length ? table_no + "\u6708" : "\u6700\u65B0";
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			var A_list = this.getPreCheckUserPostIDDup(pactid, table_no);
			is_fail |= count(A_list);

			for (var userpostid of Object.values(A_list)) {
				var msg = table_no_label + "\u306E\u90E8\u7F72\u8A2D\u5B9A\u306B" + "\u90E8\u7F72\u30B3\u30FC\u30C9\u300C" + userpostid + "\u300D" + "\u304C\u8907\u6570\u5B58\u5728\u3057\u3066\u3044\u307E\u3059\u3002";
				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			var count = this.getPreCheckUserPostIDEmpty(pactid, table_no);
			if (!count) continue;
			is_fail = true;
			this.putMail(FJP_MAIL_ALL, pactid, table_no_label + "\u306E\u90E8\u7F72\u8A2D\u5B9A\u306B" + "\u90E8\u7F72\u30B3\u30FC\u30C9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u90E8\u7F72\u304C\u3042\u308A\u307E\u3059\u3002");
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			if (table_no.length) continue;
			A_list = this.getPreCheckEmployeeCodeDup(pactid);
			is_fail |= count(A_list);

			for (var code in A_list) {
				var A_username = A_list[code];
				msg = "\u30E6\u30FC\u30B6\u8A2D\u5B9A\u306B\u793E\u54E1\u756A\u53F7\u300C" + code.substr(1) + "\u300D\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002" + "\u793E\u54E1\u540D\u306F\u4EE5\u4E0B\u306E\u901A\u308A\u3067\u3059\u3002" + A_username.join(" ");
				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			if (table_no.length) continue;
			A_list = this.getPreCheckEmployeeCodeEmpty(pactid);
			if (!count(A_list)) continue;
			is_fail = true;
			msg = "\u30E6\u30FC\u30B6\u8A2D\u5B9A\u3067\u793E\u54E1\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u793E\u54E1\u304C\u5B58\u5728\u3057\u307E\u3059\u3002" + "\u793E\u54E1\u540D\u306F\u4EE5\u4E0B\u306E\u901A\u308A\u3067\u3059\u3002" + A_list.join(" ");
			this.putMail(FJP_MAIL_ALL, pactid, msg);
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			A_list = this.getPreCheckTelUserID(pactid, table_no);
			is_fail |= count(A_list);

			for (var H_list of Object.values(A_list)) {
				msg = table_no_label + "\u306E";
				msg += H_list.carname + "\u306E";
				msg += "\u300C" + H_list.telno + "\u300D" + "\u306F\u3001";

				if (H_list.employeecode_tel.length) {
					msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_tel + "\u300D\u3067\u3059\u304C\u3001";

					if (H_list.employeecode_user.length) {
						msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_user + "\u300D\u306E\u6240\u6709\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else {
						msg += "\u8AB0\u306E\u6240\u6709\u306B\u3082\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002";
					}
				} else {
					msg += "\u793E\u54E1\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u304C\u3001";

					if (H_list.employeecode_user.length) {
						msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_user + "\u300D\u306E\u6240\u6709\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			A_list = Array();
			if (!is_skip_assets) A_list = this.getPreCheckAssetsUserID(pactid, table_no);
			is_fail |= count(A_list);

			for (var H_list of Object.values(A_list)) {
				msg = table_no_label + "\u306E";
				msg += H_list.carname + "\u306E";
				msg += "\u300C" + H_list.telno + "\u300D" + "\u306E";
				msg += "\u7AEF\u672B\u300C" + H_list.productname + "\u300D" + "(assetsid:" + H_list.assetsid + ")" + "\u306F\u3001";

				if (H_list.employeecode_assets.length) {
					msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_assets + "\u300D\u3067\u3059\u304C\u3001";

					if (H_list.employeecode_user.length) {
						msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_user + "\u300D\u306E\u6240\u6709\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else {
						msg += "\u8AB0\u306E\u6240\u6709\u306B\u3082\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002";
					}
				} else {
					msg += "\u793E\u54E1\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u304C\u3001";

					if (H_list.employeecode_user.length) {
						msg += "\u793E\u54E1\u756A\u53F7\u300C" + H_list.employeecode_user + "\u300D\u306E\u6240\u6709\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			A_list = this.getPreCheckTelUserName(pactid, table_no);
			is_fail |= count(A_list);

			for (var H_list of Object.values(A_list)) {
				msg = table_no_label + "\u306E";
				msg += H_list.carname + "\u306E";
				msg += "\u300C" + H_list.telno + "\u300D" + "\u306F\u3001";

				if (H_list.username_tel.length) {
					msg += "\u793E\u54E1\u540D\u300C" + H_list.username_tel + "\u300D\u3067\u3059\u304C\u3001";

					if (H_list.username_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u793E\u54E1\u540D\u304C\u300C" + H_list.username_user + "\u300D\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F\u793E\u54E1\u540D\u304C\u3042\u308A\u307E\u305B\u3093\u3002";
					}
				} else {
					msg += "\u793E\u54E1\u540D\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u304C\u3001";

					if (H_list.username_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u793E\u54E1\u540D\u304C\u300C" + H_list.username_user + "\u300D\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			A_list = this.getPreCheckTelMail(pactid, table_no);
			is_fail |= count(A_list);

			for (var H_list of Object.values(A_list)) {
				msg = table_no_label + "\u306E";
				msg += H_list.carname + "\u306E";
				msg += "\u300C" + H_list.telno + "\u300D" + "\u306F\u3001";

				if (H_list.mail_tel.length) {
					msg += "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u300C" + H_list.mail_tel + "\u300D\u3067\u3059\u304C\u3001";

					if (H_list.mail_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F\u300C" + H_list.mail_user + "\u300D\u3067\u3059\u3002";
					} else {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u3042\u308A\u307E\u305B\u3093\u3002";
					}
				} else {
					msg += "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u304C\u3001";

					if (H_list.mail_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u300C" + H_list.mail_user + "\u300D\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		for (var table_no in H_table_no) {
			var table_no_label = H_table_no[table_no];
			A_list = Array();
			if (!is_skip_assets) A_list = this.getPreCheckAssetsUserName(pactid, table_no);
			is_fail |= count(A_list);

			for (var H_list of Object.values(A_list)) {
				msg = table_no_label + "\u306E";
				msg += H_list.carname + "\u306E";
				msg += "\u300C" + H_list.telno + "\u300D" + "\u306E";
				msg += "\u7AEF\u672B\u300C" + H_list.productname + "\u300D" + "(assetsid:" + H_list.assetsid + ")" + "\u306F\u3001";

				if (H_list.username_assets.length) {
					msg += "\u793E\u54E1\u540D\u300C" + H_list.username_assets + "\u300D\u3067\u3059\u304C\u3001";

					if (H_list.username_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u793E\u54E1\u540D\u304C\u300C" + H_list.username_user + "\u300D\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F\u793E\u54E1\u540D\u304C\u3042\u308A\u307E\u305B\u3093\u3002";
					}
				} else {
					msg += "\u793E\u54E1\u540D\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u304C\u3001";

					if (H_list.username_user.length) {
						msg += "\u30E6\u30FC\u30B6\u30C6\u30FC\u30D6\u30EB\u3067\u306F" + "\u793E\u54E1\u540D\u304C\u300C" + H_list.username_user + "\u300D\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002";
					} else continue;
				}

				this.putMail(FJP_MAIL_ALL, pactid, msg);
			}
		}

		return return_var;
	}

	getPreCheckPactID() {
		var sql = "select pactid from fnc_relation_tb" + " where fncid=" + FJP_FUNCID_MASTER + " group by pactid" + " order by pactid" + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		var A_pactid = Array();

		for (var A_line of Object.values(result)) A_pactid.push(A_line[0]);

		return A_pactid;
	}

	getPreCheckUserPostIDDup(pactid, table_no) {
		var name = this.getTableName("post_%", table_no);
		var sql = "select userpostid from " + name + " where pactid=" + pactid + " and userpostid is not null" + " and userpostid!=''" + " group by userpostid" + " having count(userpostid)>1" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return result;
		var A_result = Array();

		for (var H_line of Object.values(result)) A_result.push(H_line.userpostid);

		return A_result;
	}

	getPreCheckUserPostIDEmpty(pactid, table_no) {
		var name = this.getTableName("post_%", table_no);
		var sql = "select count(*) from " + name + " where pactid=" + pactid + " and coalesce(userpostid,'')=''" + ";";
		return this.getOneSafeLog(sql);
	}

	getPreCheckEmployeeCodeDup(pactid) {
		var name = "user_tb";
		var sql = "select username,employeecode from " + name + " where pactid=" + pactid + " and employeecode in (" + "select employeecode from " + name + " where pactid=" + pactid + " and employeecode is not null" + " and employeecode!=''" + " group by employeecode" + " having count(employeecode)>1" + ")" + " order by employeecode,username" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return result;
		var H_result = Array();

		for (var H_line of Object.values(result)) {
			var key = "U" + H_line.employeecode;
			if (!(undefined !== H_result[key])) H_result[key] = Array();
			H_result[key].push(H_line.username);
		}

		return H_result;
	}

	getPreCheckEmployeeCodeEmpty(pactid) {
		var name = "user_tb";
		var sql = "select username from " + name + " where pactid=" + pactid + " and coalesce(employeecode,'')=''" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return result;
		var A_result = Array();

		for (var H_line of Object.values(result)) A_result.push(H_line.username);

		return A_result;
	}

	getPreCheckTelUserID(pactid, table_no) //commflagがautoでなければ対象外とする
	{
		var tel_tb = this.getTableName("tel_%", table_no);
		var user_tb = "user_tb";
		var carrier_tb = "carrier_tb";
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".employeecode as employeecode_tel" + "," + user_tb + ".employeecode as employeecode_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (coalesce(" + tel_tb + ".employeecode,'')!=''" + " or coalesce(" + user_tb + ".employeecode,'')!='')" + " and coalesce(" + tel_tb + ".employeecode,'')" + "!=coalesce(" + user_tb + ".employeecode,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckAssetsUserID(pactid, table_no) //端末と紐付く電話のcommflagがautoでなければ対象外とする
	{
		var tel_tb = this.getTableName("tel_%", table_no);
		var tel_rel_assets_tb = this.getTableName("tel_rel_assets_%", table_no);
		var assets_tb = this.getTableName("assets_%", table_no);
		var user_tb = "user_tb";
		var carrier_tb = "carrier_tb";
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + assets_tb + ".productname as productname" + "," + assets_tb + ".assetsid as assetsid" + "," + assets_tb + ".employeecode as employeecode_assets" + "," + user_tb + ".employeecode as employeecode_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " left join " + tel_rel_assets_tb + this.getSQLOn(tel_tb, tel_rel_assets_tb, ["pactid", "telno", "carid"]) + " and " + tel_rel_assets_tb + ".main_flg=true" + " left join " + assets_tb + this.getSQLOn(tel_rel_assets_tb, assets_tb, ["pactid", "assetsid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and " + assets_tb + ".assetsid is not null" + " and (coalesce(" + assets_tb + ".employeecode,'')!=''" + " or coalesce(" + user_tb + ".employeecode,'')!='')" + " and coalesce(" + assets_tb + ".employeecode,'')" + "!=coalesce(" + user_tb + ".employeecode,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckTelUserName(pactid, table_no) //commflagがautoでなければ対象外とする
	{
		var tel_tb = this.getTableName("tel_%", table_no);
		var user_tb = "user_tb";
		var carrier_tb = "carrier_tb";
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".username as username_tel" + "," + user_tb + ".username as username_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where 1=1" + " and " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (" + " replace(" + "replace(coalesce(" + tel_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + " or " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + ")" + " and" + " replace(" + "replace(coalesce(" + tel_tb + ".username,'')," + "' ',''),'\u3000','')" + " != " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckTelMail(pactid, table_no) //commflagがautoでなければ対象外とする
	{
		var tel_tb = this.getTableName("tel_%", table_no);
		var user_tb = "user_tb";
		var carrier_tb = "carrier_tb";
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + tel_tb + ".mail as mail_tel" + "," + user_tb + ".mail as mail_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and (" + " coalesce(" + tel_tb + ".mail,'')!=''" + " or" + " coalesce(" + user_tb + ".mail,'')!=''" + ")" + " and" + " coalesce(" + tel_tb + ".mail,'')" + "!=" + " coalesce(" + user_tb + ".mail,'')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getPreCheckAssetsUserName(pactid, table_no) //端末と紐付く電話のcommflagがautoでなければ対象外とする
	{
		var tel_tb = this.getTableName("tel_%", table_no);
		var tel_rel_assets_tb = this.getTableName("tel_rel_assets_%", table_no);
		var assets_tb = this.getTableName("assets_%", table_no);
		var user_tb = "user_tb";
		var carrier_tb = "carrier_tb";
		var sql = "select" + " " + tel_tb + ".telno as telno" + "," + tel_tb + ".carid as carid" + "," + carrier_tb + ".carname as carname" + "," + assets_tb + ".productname as productname" + "," + assets_tb + ".assetsid as assetsid" + "," + assets_tb + ".username as username_assets" + "," + user_tb + ".username as username_user" + " from " + tel_tb + " left join " + user_tb + this.getSQLOn(tel_tb, user_tb, ["pactid", "userid"]) + " left join " + carrier_tb + this.getSQLOn(tel_tb, carrier_tb, ["carid"]) + " left join " + tel_rel_assets_tb + this.getSQLOn(tel_tb, tel_rel_assets_tb, ["pactid", "telno", "carid"]) + " and " + tel_rel_assets_tb + ".main_flg=true" + " left join " + assets_tb + this.getSQLOn(tel_rel_assets_tb, assets_tb, ["pactid", "assetsid"]) + " where " + tel_tb + ".pactid=" + pactid + " and " + user_tb + ".userid is not null" + " and " + assets_tb + ".assetsid is not null" + " and (" + " replace(" + "replace(coalesce(" + assets_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + " or " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')!=''" + ")" + " and" + " replace(" + "replace(coalesce(" + assets_tb + ".username,'')," + "' ',''),'\u3000','')" + " != " + " replace(" + "replace(coalesce(" + user_tb + ".username,'')," + "' ',''),'\u3000','')" + " and coalesce(" + tel_tb + ".commflag,'')='auto'" + ";";
		return this.getHashSafeLog(sql);
	}

	getHRMFileInfo() {
		var sql = "select dstname,srctime,dstpost,srcpost,recdate" + " from fjp_hrm_file_copy_tb" + " where status=0" + " order by recdate desc" + " limit 1" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return false;
		if (!result.length) return Array();
		return result[0];
	}

	getHRMFileInfoOld(recdate) {
		var sql = "select dstname,srctime,dstpost,srcpost,recdate" + " from fjp_hrm_file_copy_tb" + " where status=0" + " and recdate<'" + this.escape(recdate) + "'" + " order by recdate" + ";";
		return this.getHashSafeLog(sql);
	}

	updateHRMFileInfoImport(recdate, is_ok) //取り込んだファイルのステータスを切り替える
	{
		if (!this.updateHRMFileInfo(recdate, is_ok ? FJP_FILE_COPY_STATUS_IMPORT_FIN : FJP_FILE_COPY_STATUS_IMPORT_FAIL, Array(), false)) return false;
		return this.updateHRMFileInfo(recdate, FJP_FILE_COPY_STATUS_OLD, [0], true);
	}

	updateHRMFileInfo(recdate, status, A_status, is_last) {
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

	insertHRMFileInfo(status, srctime, dstname, srcpost, dstpost, recdate = "") {
		if (!recdate.length) recdate = this.getCurrent();else {
			if (recdate.length) recdate = this.escape(recdate);
			if ("'" != recdate[0]) recdate = "'" + recdate;
			if ("'" != recdate[recdate.length - 1]) recdate += "'";
		}
		var sql = "insert into fjp_hrm_file_copy_tb" + "(recdate,status,srctime,dstname,srcpost,dstpost)values" + "(" + recdate + "," + status + ",'" + this.escape(srctime) + "+09'" + ",'" + this.escape(dstname) + "'" + ",'" + this.escape(srcpost) + "+09'" + ",'" + this.escape(dstpost) + "'" + ")" + ";";
		return this.querySafeLog(sql);
	}

	getHRMLastStatus(exectype = 0, is_exclude_minus = true) {
		var sql = "select status,waytype from fjp_hrm_status_index_tb" + " where exectype=" + exectype + (0 == exectype && is_exclude_minus ? " and waytype>=0" : "") + " order by recdate desc" + " limit 1" + ";";
		var result = this.getHashSafeLog(sql);
		if (false === result) return false;
		if (!result.length || !result[0].length) return Array();
		return result[0];
	}

	insertHRMStatus(exectype, status, waytype, A_buffer: {} | any[], fname, seq = "") //シーケンスを採番する
	{
		if (!seq.length) seq = this.getSeqStatusIndex();
		if (false === seq) return false;
		var cur = this.getCurrent();
		var sql = "insert into fjp_hrm_status_index_tb" + "(uniqueid,exectype,recdate,fixdate,status,waytype,is_send)" + "values" + "(" + seq + "," + exectype + "," + cur + "," + cur + "," + status + "," + waytype + ",false" + ");";
		if (!this.querySafeLog(sql)) return false;
		var O_ins = fname.length ? new TableInserterSafe(this.m_O_log, this.m_O_db, fname, true) : new TableInserterSlowSafe(this.m_O_log, this.m_O_db);
		O_ins.setUnlock();
		if (!O_ins.begin("fjp_hrm_status_details_tb")) return false;
		var detailno = 0;

		for (var H_buffer of Object.values(A_buffer)) {
			var type = H_buffer.type + 0;
			var pactid = H_buffer.pactid + 0;
			var msg = H_buffer.message;

			if (!O_ins.insert({
				uniqueid: seq,
				detailno: detailno,
				pactid: pactid,
				is_fjp: FJP_MAIL_FJP & type ? "true" : "false",
				is_kcs: FJP_MAIL_KCS & type ? "true" : "false",
				is_motion: FJP_MAIL_MOTION & type ? "true" : "false",
				message: msg
			})) {
				this.putDebug("pg_insert\u5931\u6557");
				return false;
			}

			++detailno;
		}

		if (!O_ins.end()) {
			this.putDebug("pg_copy\u5931\u6557");
			return false;
		}

		return true;
	}

	getHRMStatusIndex(A_exectype: {} | any[], A_status: {} | any[] = Array(), A_is_send: {} | any[] = [false], A_uniqueid: {} | any[] = Array()) {
		var sql = "select uniqueid,exectype,recdate,fixdate,status,waytype" + "," + this.getSQLBooleanToInt("is_send") + " as is_send" + " from fjp_hrm_status_index_tb" + " where 1=1";
		if (A_exectype.length) sql += " and exectype in (" + A_exectype.join(",") + ")";
		if (A_status.length) sql += " and status in (" + A_status.join(",") + ")";

		if (A_is_send.length) {
			sql += " and (";

			for (var cnt = 0; cnt < A_is_send.length; ++cnt) {
				if (cnt) sql += " or";
				sql += " is_send=" + (A_is_send[cnt] ? "true" : "false");
			}

			sql += ")";
		}

		if (A_uniqueid.length) sql += " and uniqueid in (" + A_uniqueid.join(",") + ")";
		sql += " order by recdate";
		sql += ";";
		return this.getHashSafeLog(sql);
	}

	getHRMStatusDetails(uniqueid) {
		var sql = "select uniqueid,detailno,pactid,message" + "," + this.getSQLBooleanToInt("is_fjp") + " as is_fjp" + "," + this.getSQLBooleanToInt("is_kcs") + " as is_kcs" + "," + this.getSQLBooleanToInt("is_motion") + " as is_motion" + " from fjp_hrm_status_details_tb" + " where uniqueid=" + uniqueid + " order by detailno" + ";";
		return this.getHashSafeLog(sql);
	}

	updateHRMStatusIndexIsSend(uniqueid, is_send = true) {
		var sql = "update fjp_hrm_status_index_tb" + " set fixdate=" + this.getCurrent() + ",is_send=" + (is_send ? "true" : "false") + " where uniqueid=" + uniqueid + ";";
		return this.querySafeLog(sql);
	}

	getHRMAddr() {
		var sql = "select addr from fjp_hrm_addr_tb" + " order by detailno" + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		var A_addr = Array();

		for (var A_line of Object.values(result)) {
			var addr = A_line[0];
			if (!addr.length) continue;
			A_addr.push(addr);
		}

		return A_addr;
	}

	getHRMSchedule() {
		var sql = "select execdate,waytype from fjp_hrm_schedule_tb" + " order by execdate" + ";";
		return this.getHashSafeLog(sql);
	}

	getPactCompName() {
		var sql = "select pactid,compname from pact_tb" + " order by pactid" + ";";
		var result = this.getAllSafeLog(sql);
		if (false === result) return false;
		var H_pact = Array();

		for (var H_line of Object.values(result)) H_pact[H_line[0]] = H_line[1];

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
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, O_handler: FJPErrorHandlerBaseType, logdir) {
		this.m_O_log = O_log;
		this.m_O_db = O_db;
		this.m_O_table_no = O_table_no;
		this.m_O_handler = O_handler;
		this.m_logdir = logdir;
	}

	getLogDir() {
		return this.m_logdir;
	}

	putLog(type, msg) {
		this.m_O_log.put(type, msg);
	}

	getLog() {
		return this.m_O_log;
	}

	getTableNo(year, month) {
		return this.m_O_table_no.get(year, month);
	}

	getTableNoIns() {
		return this.m_O_table_no;
	}

	putHandler(type, pactid, msg) {
		this.m_O_handler.put(type, pactid, msg);
	}

	putHandlerResult(arg1, arg2, msg) {
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
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year, month, logdir, is_standalone, fname_setting) //エラーハンドラを作る
	//基底型のコンストラクタを呼び出す
	//値を保存する
	//設定ファイルインスタンスを作る
	//設定ファイル名を作る
	{
		var O_handler = new FJPErrorHandlerChildProcType(is_standalone);
		super(O_log, O_db, O_table_no, O_handler, logdir);
		this.m_year = year;
		this.m_month = month;
		var is_ignore = false;
		this.m_O_setting = new FJPSettingType(O_handler, is_ignore);

		if (!fname_setting.length) {
			var dir = this.addDelim(KCS_DIR);
			dir = this.addDelim(dir + FJP_SETTING_DIR);
			fname_setting = dir + FJP_SETTING_NAME;
		}

		this.m_is_fail_setting = !this.m_O_setting.read(fname_setting);

		if (this.m_is_fail_setting) {
			this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u51FA\u3057\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
		}
	}

	addDelim(dir, delim = "/") {
		if (!dir.length) return dir;
		if (strcmp(delim, dir[dir.length - 1])) dir += "/";
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

	getSettingPactIDSkip(A_in: {} | any[], A_out: {} | any[]) {
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
class FJPProcCopyType extends FJPProcChildBaseType {
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year, month, logdir, is_standalone, fname_setting, copy_mode, is_delete_lock, dir_from, dir_to) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		this.m_copy_mode = copy_mode;
		this.m_is_delete_lock = is_delete_lock;
		this.m_dir_from = this.touchDir(dir_from.length ? dir_from : FJP_DIR_FROM);
		this.m_dir_to = this.touchDir(dir_to.length ? dir_to : FJP_DIR_TO_PRE + "%Y%M" + FJP_DIR_TO_POST);

		if (!this.isFailSetting()) {
			this.putLog(G_SCRIPT_DEBUG, "\u30B3\u30D4\u30FC\u5143\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA" + this.m_dir_from);
			this.putLog(G_SCRIPT_DEBUG, "\u30B3\u30D4\u30FC\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA" + this.m_dir_to);
			var H_setting = this.getSettingAll();
			this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB" + this.m_dir_from + H_setting.fname_lock);
			this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB" + this.m_dir_from + H_setting.fname_user);
			this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB" + this.m_dir_from + H_setting.fname_post);
		}
	}

	isReadyLock() {
		if (this.isFailSetting()) return false;
		var H_setting = this.getSettingAll();
		if (!file_exists(this.m_dir_from + H_setting.fname_lock)) return false;
		this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u691C\u51FA");
		return true;
	}

	execute(is_timeout) {
		if (this.isFailSetting()) {
			this.putHandlerResult(1, 0, "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u4E0D\u6B63");
			return false;
		}

		var H_setting = this.getSettingAll();

		if (is_timeout) {
			this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30B9\u30C6\u30FC\u30BF\u30B9\u30D5\u30A1\u30A4\u30EB\u304C\u6642\u9593\u5185\u306B\u4F5C\u6210\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F" + H_setting.fname_lock);
			this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u524D\u306B\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8" + H_setting.fname_lock);
			this.putHandlerResult(1, 0, "\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8");

			if (!this.insertTimeOut()) {
				return false;
			}

			return true;
		} else {
			if (!this.executeCopy()) {
				this.putHandlerResult(1, 0, "\u30B3\u30D4\u30FC\u5931\u6557");
				return false;
			}
		}

		this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u306E\u30B3\u30D4\u30FC\u306B\u6210\u529F\u3057\u307E\u3057\u305F");
		this.putHandlerResult(0, 0, "\u6B63\u5E38\u7D42\u4E86");
		return true;
	}

	executeCopy() {
		if (this.isFailSetting()) return false;
		var status = 0;
		var srctime_user = "2000-01-01";
		var dstname_user = "";
		var srctime_post = srctime_user;
		var dstname_post = dstname_user;
		if (!this.moveFile(status, srctime_user, dstname_user, srctime_post, dstname_post)) return false;
		return this.insertStatus(status, srctime_user, dstname_user, srctime_post, dstname_post);
	}

	insertTimeOut() {
		if (this.isFailSetting()) return false;
		return this.insertStatus(2, "2000-01-01", "", "2000-01-01", "");
	}

	touchDir(dir) {
		var H_ym = this.getYearMonth();
		if (1 == H_ym.month.length) H_ym.month = "0" + H_ym.month;
		dir = str_replace("%Y", H_ym.year, dir);
		dir = str_replace("%M", H_ym.month, dir);
		return dir;
	}

	moveFile(status, srctime_user, dstname_user, srctime_post, dstname_post) //コピー先のファイル名を採番する
	//コピー先のディレクトリが存在しなければ作成する
	//コピー元のファイル情報を取得する
	//コピーを行う
	{
		status = 3;
		var H_setting = this.getSettingAll();
		var tgtname = date("YmdHis") + ".csv";

		if (!file_exists(this.m_dir_to)) {
			if (!mkdir(this.m_dir_to, 777, true)) {
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30B3\u30D4\u30FC\u5148\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
				this.putLog(G_SCRIPT_DEBUG, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\u306B\u5931\u6557" + this.m_dir_to);
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\u306B\u6210\u529F" + this.m_dir_to);
		} else {
			this.putLog(G_SCRIPT_DEBUG, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306F\u5B58\u5728\u3059\u308B" + this.m_dir_to);
		}

		dstname_user = this.m_dir_to + "U" + tgtname;
		dstname_post = this.m_dir_to + "P" + tgtname;
		var from_user = this.m_dir_from + H_setting.fname_user;
		var from_post = this.m_dir_from + H_setting.fname_post;

		if (!file_exists(from_user)) {
			status = 1;
			this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30B9\u30C6\u30FC\u30BF\u30B9\u30D5\u30A1\u30A4\u30EB\u306F\u3042\u308B\u3082\u306E\u306E" + "\u30B3\u30D4\u30FC\u3059\u308B\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F" + basename(from_user));
			this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306F\u3042\u308B\u304C\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044" + H_setting.fname_user);
			return false;
		}

		if (!file_exists(from_post)) {
			status = 1;
			this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30B9\u30C6\u30FC\u30BF\u30B9\u30D5\u30A1\u30A4\u30EB\u306F\u3042\u308B\u3082\u306E\u306E" + "\u30B3\u30D4\u30FC\u3059\u308B\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F" + basename(from_post));
			this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306F\u3042\u308B\u304C\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044" + H_setting.fname_post);
			return false;
		}

		this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u691C\u51FA" + from_user);
		this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u691C\u51FA" + from_post);
		var tm = filemtime(from_user);
		srctime_user = date("Y/m/d H:i:s", tm);
		tm = filemtime(from_post);
		srctime_post = date("Y/m/d H:i:s", tm);

		switch (this.m_copy_mode) {
			case 0:
				return false;
				break;

			case 1:
				if (!rename(from_user, dstname_user)) {
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u306B\u5931\u6557" + " " + from_user + " " + dstname_user);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u306B\u6210\u529F" + from_user + " " + dstname_user);

				if (!rename(from_post, dstname_post)) {
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u306B\u5931\u6557" + " " + from_post + " " + dstname_post);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u306B\u6210\u529F" + from_post + " " + dstname_post);
				break;

			case 2:
				if (!copy(from_user, dstname_user)) {
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u306E\u30B3\u30D4\u30FC\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u306B\u5931\u6557" + " " + from_user + " " + dstname_user);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u4EBA\u4E8B\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u306B\u6210\u529F" + from_user + " " + dstname_user);

				if (!copy(from_post, dstname_post)) {
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u306E\u30B3\u30D4\u30FC\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u306B\u5931\u6557" + " " + from_post + " " + dstname_post);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u8077\u5236\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u306B\u6210\u529F" + from_post + " " + dstname_post);
				break;
		}

		if (this.m_is_delete_lock) //移動なので削除する
			{
				if (!unlink(this.m_dir_from + H_setting.fname_lock)) {
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u306B\u5931\u6557" + this.m_dir_from + H_setting.fname_lock);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u306B\u6210\u529F" + this.m_dir_from + H_setting.fname_lock);
			} else {
			this.putLog(G_SCRIPT_DEBUG, "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u306F\u524A\u9664\u305B\u305A" + this.m_dir_from + H_setting.fname_lock);
		}

		status = 0;
		return true;
	}

	insertStatus(status, srctime_user, dstname_user, srctime_post, dstname_post) //モデルを作成する
	//記録する
	{
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());
		var rval = O_model.insertHRMFileInfo(status, srctime_user, dstname_user, srctime_post, dstname_post);

		if (!rval) {
			this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, "\u30D5\u30A1\u30A4\u30EB\u306E\u30B3\u30D4\u30FC\u7D50\u679C\u306E\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F(DB\u3078\u306E\u8A18\u9332)");
			this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u60C5\u5831\u306EDB\u3078\u306E\u633F\u5165\u306B\u5931\u6557" + status + "/" + srctime_user + "/" + dstname_user + "/" + srctime_post + "/" + dstname_post);
		} else {
			this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u60C5\u5831\u306EDB\u3078\u306E\u633F\u5165\u306B\u6210\u529F" + status + "/" + srctime_user + "/" + dstname_user + "/" + srctime_post + "/" + dstname_post);
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
class FJPProcImportType extends FJPProcChildBaseType {
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year, month, logdir, is_standalone, fname_setting, fname_user, fname_post, is_ignore_schedule, waytype_ignore_schedule, diff_days, is_protect_file, A_code_in_user: {} | any[], A_code_out_user: {} | any[], A_code_in_post: {} | any[], A_code_out_post: {} | any[], is_save, A_pactid_in: {} | any[], A_pactid_out: {} | any[], waytype, userpostid_mode) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		this.m_fname_user = fname_user;
		this.m_fname_post = fname_post;
		this.m_is_ignore_schedule = is_ignore_schedule;
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
		this.m_waytype = waytype;
		this.m_userpostid_mode = userpostid_mode;
	}

	execute(is_skip_today) {
		var return_var = true;
		var is_error = false;
		is_skip_today = false;
		if (this.isFailSetting()) return false;
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());

		if (this.m_fname_user.length || this.m_fname_post.length) //起動時オプションで指定されたファイルをインポートする
			//ファイルがあるか確認する
			{
				if (1 & this.m_waytype && !this.m_fname_user.length) {
					var msg = FJP_ERRMSG_COMMON + "(\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				if (2 & this.m_waytype && !this.m_fname_post.length) {
					msg = FJP_ERRMSG_COMMON + "(\u8077\u5236\u30DE\u30B9\u30BF\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				var is_ok = this.executeFile(O_model, this.m_fname_user, this.m_fname_post, this.m_waytype_ignore_schedule, is_error);

				if (!is_ok) {
					msg = FJP_ERRMSG_COMMON + "(\u30D5\u30A1\u30A4\u30EB\u306E\u30A4\u30F3\u30DD\u30FC\u30C8)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
				}

				if (!this.finishFile(this.m_fname_user, this.m_fname_post, is_ok)) {
					msg = FJP_ERRMSG_COMMON + "(\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\u5F8C\u306E\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					is_ok = false;
				}

				this.putResult(!is_error);
			} else //DBからファイル名を取り出す
			//最新のファイルを取り出す
			//ステータスを書き換える前に、古いファイルを取得する
			//ステータスを書き換える
			//最新より古いファイルは削除する
			//インポート完了後のファイルを移動する
			//結果を出力する
			{
				var waytype = false;

				if (this.m_is_ignore_schedule) //スケジュールを無視してDBの最新ファイルをインポートする
					{
						waytype = this.m_waytype_ignore_schedule;
					} else //スケジュールに従いDBのファイルをインポートする
					{
						var A_schedule = O_model.getHRMSchedule();
						var H_result = O_model.getHRMLastStatus();

						if (false !== A_schedule && false !== H_result) {
							waytype = this.resolve(this.getToday(), A_schedule, H_result);
						}

						if (false === waytype) //インポートの実行日ではない
							{
								this.putLog(G_SCRIPT_DEBUG, "\u53D6\u8FBC\u5B9F\u884C\u65E5\u3067\u306F\u306A\u3044");
								this.putHandlerResult(-1, FJP_MAIL_ALLPACT, "\u53D6\u8FBC\u5B9F\u884C\u65E5\u3067\u306F\u306A\u3044");
								is_skip_today = true;
								return true;
							}
					}

				var H_file = O_model.getHRMFileInfo();

				if (false === H_file) //ファイルの取得に失敗した
					{
						msg = FJP_ERRMSG_COMMON + "(\u30A4\u30F3\u30DD\u30FC\u30C8\u3067\u304D\u308B\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u305F)";
						this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
						this.putLog(G_SCRIPT_DEBUG, msg);
						this.putResult(false);
						return false;
					}

				if (!H_file.length) //インポートできるファイルが存在しない
					{
						msg = FJP_ERRMSG_COMMON + "(\u30A4\u30F3\u30DD\u30FC\u30C8\u3067\u304D\u308B\u30D5\u30A1\u30A4\u30EB\u304C\u7121\u3044)";
						this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
						this.putLog(G_SCRIPT_DEBUG, msg);
						this.putResult(false);
						return false;
					}

				is_ok = this.executeFile(O_model, H_file.dstname, H_file.dstpost, waytype, is_error);

				if (!is_ok) {
					msg = FJP_ERRMSG_COMMON + "(\u30D5\u30A1\u30A4\u30EB\u306E\u30A4\u30F3\u30DD\u30FC\u30C8)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
				}

				this.putLog(G_SCRIPT_DEBUG, "\u30A4\u30F3\u30DD\u30FC\u30C8" + (is_ok ? "\u6210\u529F" : "\u5931\u6557"));
				var A_file = O_model.getHRMFileInfoOld(H_file.recdate);

				if (!O_model.updateHRMFileInfoImport(H_file.recdate, is_ok)) {
					msg = FJP_ERRMSG_COMMON + "(\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u66F4\u65B0)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u30B9\u30C6\u30FC\u30BF\u30B9\u66F4\u65B0\u6210\u529F");

				if (false === A_file) {
					msg = FJP_ERRMSG_COMMON + "(\u53D6\u308A\u8FBC\u3093\u3060\u30D5\u30A1\u30A4\u30EB\u3088\u308A\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u60C5\u5831\u306E\u53D6\u5F97)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				if (!this.deleteOld(A_file)) {
					msg = FJP_ERRMSG_COMMON + "(\u53D6\u308A\u8FBC\u3093\u3060\u30D5\u30A1\u30A4\u30EB\u3088\u308A\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u6210\u529F");

				if (!this.finishFile(H_file.dstname, H_file.dstpost, is_ok)) {
					msg = FJP_ERRMSG_COMMON + "(\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\u5F8C\u306E\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5)";
					this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putResult(false);
					return false;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\u5F8C\u306E\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u6210\u529F");
				this.putResult(!is_error);
			}

		return return_var;
	}

	executeFile(O_model: FJPModelType, fname_user, fname_post, waytype, is_error) //全社共通の設定を読み出す
	//年月からテーブル番号を作る
	//人事マスタを読み出す
	{
		is_error = false;
		var logdir = this.getLogDir();
		var H_setting_all = this.getSettingAll();
		var A_pactid_all = this.getSettingPactIDAll();
		var A_pactid_skip = this.getSettingPactIDSkip(this.m_A_pactid_in, this.m_A_pactid_out);
		O_model.setColumn(H_setting_all.column_id, H_setting_all.column_name);
		var H_ym = this.getYearMonth();
		var table_no = this.getTableNo(H_ym.year, H_ym.month);
		var O_user = undefined;

		if (1 & this.m_waytype) {
			O_user = new FJPMasterUserType(this.getHandler(), false, this.m_userpostid_mode);

			for (var pactid of Object.values(A_pactid_all)) {
				var H_setting = this.getSettingPact(pactid);
				if (!H_setting.length) continue;
				O_user.addPact(pactid, H_setting.A_code_user);
			}

			O_user.setSkip(this.m_A_pactid_in, this.m_A_pactid_out, this.m_A_code_in_user, this.m_A_code_out_user);

			if (!O_user.read(fname_user) || O_user.isFail()) {
				is_error = true;
				return false;
			}
		}

		var O_post = undefined;

		if (2 & this.m_waytype) {
			O_post = new FJPMasterPostType(this.getHandler(), false, this.m_userpostid_mode);
			O_post.addIgnoreAll(H_setting_all.A_ignore, H_setting_all.A_skip_postcode);

			for (var pactid of Object.values(A_pactid_all)) {
				H_setting = this.getSettingPact(pactid);
				O_post.addPact(pactid, H_setting.A_code_post);
				O_post.addIgnore(pactid, H_setting.A_ignore);
			}

			O_post.setSkip(this.m_A_pactid_in, this.m_A_pactid_out, this.m_A_code_in_post, this.m_A_code_out_post);

			if (!O_post.read(fname_post) || O_post.isFail()) {
				is_error = true;
				return false;
			}
		}

		var msg = "\u51E6\u7406\u3059\u308Bpactid:=" + A_pactid_skip.join(",");
		this.putLog(G_SCRIPT_DEBUG, msg);
		var return_var = false;

		for (var pactid of Object.values(A_pactid_skip)) //人事と職制のどちらかにデータが無ければ警告を出す
		//会社毎のログディレクトリを作成する
		//職制の取込を行う
		{
			H_setting = this.getSettingPact(pactid);
			var is_ok = true;

			if (undefined !== O_user && undefined !== O_post) {
				if (!O_user.isIn(pactid) && O_post.isIn(pactid)) {
					msg = "\u8077\u5236\u30DE\u30B9\u30BF\u306B\u3042\u308B\u9867\u5BA2\u306E\u30C7\u30FC\u30BF\u304C\u3001" + "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306B\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F" + "(pactid=" + pactid + ")";
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putHandler(FJP_MAIL_ALL, pactid, msg);
					continue;
				}

				if (!O_post.isIn(pactid) && O_user.isIn(pactid)) {
					msg = "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u306B\u3042\u308B\u9867\u5BA2\u306E\u30C7\u30FC\u30BF\u304C\u3001" + "\u8077\u5236\u30DE\u30B9\u30BF\u306B\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F" + "(pactid=" + pactid + ")";
					this.putLog(G_SCRIPT_DEBUG, msg);
					this.putHandler(FJP_MAIL_ALL, pactid, msg);
					continue;
				}
			}

			var is_in_user = undefined !== O_user && O_user.isIn(pactid);
			var is_in_post = undefined !== O_post && O_post.isIn(pactid);

			if (!(is_in_user || is_in_post)) {
				msg = "\u9867\u5BA2\u306E\u30C7\u30FC\u30BF\u304C\u3001" + "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30FB\u8077\u5236\u30DE\u30B9\u30BF\u306B\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F" + "(pactid=" + pactid + ")(\u30B9\u30AD\u30C3\u30D7)";
				this.putLog(G_SCRIPT_DEBUG, msg);
				continue;
			}

			this.putLog(G_SCRIPT_DEBUG, "\u9867\u5BA2\u51E6\u7406\u958B\u59CB:" + pactid);
			var O_log = this.getLog();
			var O_pact_log = new FJPProcessLog();
			O_pact_log.putListener(O_log);
			O_pact_log.setPath(O_log, logdir, pactid + "_" + sprintf("%04d%02d", H_ym.year, H_ym.month) + "/");
			O_model.setLogIns(O_pact_log);

			if (is_ok && undefined !== O_post) {
				is_ok = this.executePactPost(O_pact_log, pactid, O_post, H_setting_all, H_setting, waytype);
			}

			if (is_ok && undefined !== O_user) {
				if (this.m_is_save) //インポート前にこの会社の状態を保存する
					{
						var A_table = ["user_tb", "fnc_relation_tb", "tel_rel_tel_reserve_tb", "assets_reserve_tb", "tel_rel_assets_reserve_tb", "tel_reserve_tb", "tel_tb", "assets_tb"];

						if (FJP_WAYTYPE_CUR_NEW == waytype) {
							A_table.push("tel_" + table_no + "_tb");
							A_table.push("assets_" + table_no + "_tb");
						}

						var O_db = this.getDB();

						for (var table of Object.values(A_table)) {
							O_db.backup(O_pact_log.m_path + table + ".delete", "select * from " + table + " where pactid=" + pactid + ";");
						}
					}

				O_model.begin(FJP_SAVEPOINT_NAME + "executePact");
				var is_ok_import = O_model.executePact(O_user.get(pactid), waytype, table_no, H_setting_all, pactid, H_setting, O_pact_log.m_path, true);
				O_model.end(is_ok_import, FJP_SAVEPOINT_NAME + "executePact");
				is_ok &= is_ok_import;
			}

			O_model.setLogIns(O_log);
			delete O_pact_log;
			this.putLog(G_SCRIPT_DEBUG, "\u9867\u5BA2\u51E6\u7406\u7D42\u4E86:" + pactid + ":" + (is_ok ? "\u6210\u529F" : "\u5931\u6557"));
			return_var |= is_ok;
			if (!is_ok) is_error = true;
		}

		return return_var;
	}

	executePactPost(O_pact_log, pactid, O_post: FJPMasterPostType, H_setting_all: {} | any[], H_setting: {} | any[], waytype) //職制中間ファイルを作成する
	//職制バッチを呼び出す
	//中間ログファイルを読み出す
	{
		var dir = KCS_DIR + FJP_POST_DIR;
		dir = str_replace("%P", pactid, dir);
		dir = str_replace("%Y", sprintf("%04d%02d", date("Y"), date("m")), dir);

		if (!file_exists(dir)) {
			if (!mkdir(dir, 777, true)) {
				var msg = "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
				this.putHandler(FJP_MAIL_ALL, pactid, msg);
				msg += dir;
				this.putLog(G_SCRIPT_DEBUG, msg);
				return false;
			}
		}

		var fname = dir + FJP_POST_PROTECT;
		var fp = fopen(fname, "wt");

		if (false === fp) {
			msg = "\u30D5\u30A1\u30A4\u30EB\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
			this.putHandler(FJP_MAIL_ALL, pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		}

		for (var code of Object.values(H_setting.A_postcode_protected)) //先頭のPを取る
		{
			var code = code.substr(1);
			fwrite(fp, code + "\n");
		}

		fclose(fp);
		fname = dir + FJP_POST_POST;

		if (!O_post.createFile(pactid, fname)) {
			return false;
		}

		fname = O_pact_log.m_path + "post.log";
		var O_proc = new ScriptCommandSafe(O_pact_log, false, G_SCRIPT_DEBUG);
		var A_arg = [{
			key: "n",
			value: FJP_WAYTYPE_CUR_NEW == waytype ? 1 : 0
		}, {
			key: "l",
			value: fname
		}, {
			key: "p",
			value: pactid
		}];
		var status = O_proc.execute(G_PHP + " " + FJP_POST_PROC, A_arg, Array());
		fp = false;
		if (file_exists(fname)) fp = fopen(fname, "rt");

		if (false === fp) {
			msg = FJP_POST_PROC + "\u3092\u5B9F\u884C\u3057\u307E\u3057\u305F\u304C\u3001" + "\u7D50\u679C\u30D5\u30A1\u30A4\u30EB\u304C\u4F5C\u6210\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F";
			this.putHandler(FJP_MAIL_ALL, pactid, msg);
			msg += fname;
			this.putLog(G_SCRIPT_DEBUG, msg);
			return false;
		} else {
			var line;
			var is_ok = false;
			var is_ng = false;

			while (false !== (line = fgets(fp))) {
				if (line.length && "\n" === line.substr(line.length - 1)) line = line.substr(0, line.length - 1);
				if (line.length && "\r" === line.substr(line.length - 1)) line = line.substr(0, line.length - 1);
				this.putLog(G_SCRIPT_DEBUG, "\u4E2D\u9593\u30D5\u30A1\u30A4\u30EB(pactid:=" + pactid + ")" + line);
				var A_line = line.split("\t");

				if (3 <= A_line.length && pactid == A_line[0] && "status" == A_line[1]) {
					if ("ok" === A_line[2]) is_ok = true;else if ("ng" === A_line[2]) is_ng = false;
				}
			}

			fclose(fp);

			if (is_ok) {
				msg = FJP_POST_PROC + "\u306E\u5B9F\u884C\u306B\u6210\u529F\u3057\u307E\u3057\u305F";
				msg += fname;
				this.putLog(G_SCRIPT_DEBUG, msg);
			} else if (is_ng) {
				msg = FJP_POST_PROC + "\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
				this.putHandler(FJP_MAIL_ALL, pactid, msg);
				msg += fname;
				this.putLog(G_SCRIPT_DEBUG, msg);
				return false;
			} else {
				msg = FJP_POST_PROC + "\u3092\u5B9F\u884C\u3057\u307E\u3057\u305F\u304C\u3001" + "\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u51FA\u529B\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F";
				this.putHandler(FJP_MAIL_ALL, pactid, msg);
				msg += fname;
				this.putLog(G_SCRIPT_DEBUG, msg);
				return false;
			}
		}

		return true;
	}

	finishFile(fname_user, fname_post, is_ok) //移動先ディレクトリを決定する
	//ファイルが保護されているか
	{
		var H_ym = this.getYearMonth();
		var dir = FJP_DIR_TO_PRE + sprintf("%04d%02d", H_ym.year, H_ym.month) + FJP_DIR_TO_POST + (is_ok ? FJP_DIR_TO_FIN : FJP_DIR_TO_FAIL);

		if (this.m_is_protect_file) //ファイルが保護されているので移動しない
			{
				this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u305B\u305A" + "\u79FB\u52D5\u5148\u306F" + dir);
				return true;
			}

		if (!file_exists(dir)) {
			if (!mkdir(dir, 777, true)) {
				this.putLog(G_SCRIPT_DEBUG, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\u5931\u6557" + dir);
				return false;
			}
		}

		var A_fname = Array();
		if (1 & this.m_waytype) A_fname.push(fname_user);
		if (2 & this.m_waytype) A_fname.push(fname_post);

		for (var fname of Object.values(A_fname)) {
			if (!rename(fname, dir + basename(fname))) {
				this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5931\u6557" + dir + basename(fname));
				return false;
			}

			this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u6210\u529F" + dir + basename(fname));
		}

		return true;
	}

	deleteOld(A_info: {} | any[]) {
		if (false === A_info) return false;

		for (var H_info of Object.values(A_info)) //ファイルが保護されているか
		{
			if (this.m_is_protect_file) //ファイルが保護されているので削除しない
				{
					this.putLog(G_SCRIPT_DEBUG, "\u30D5\u30A1\u30A4\u30EB\u524A\u9664\u305B\u305A" + H_info.dstname + " " + H_info.dstpost);
					continue;
				}

			var A_fname = Array();
			A_fname.push(H_info.dstname);
			A_fname.push(H_info.dstpost);

			for (var fname of Object.values(A_fname)) {
				if (!fname.length) continue;

				if (!file_exists(fname)) {
					this.putLog(G_SCRIPT_DEBUG, "\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044" + fname);
					continue;
				}

				if (!unlink(fname)) {
					this.putLog(G_SCRIPT_DEBUG, "\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u5931\u6557" + fname);
					continue;
				}

				this.putLog(G_SCRIPT_DEBUG, "\u53E4\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u6210\u529F" + fname);
			}
		}

		return true;
	}

	putResult(is_ok) {
		if (is_ok) //成功した
			{
				var msg = "\u53D6\u8FBC\u306B\u6210\u529F\u3057\u307E\u3057\u305F" + " " + date("Y/m/d H:i:s");
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putHandlerResult(0, FJP_MAIL_ALLPACT, "\u6B63\u5E38\u7D42\u4E86");
			} else //失敗した
			{
				msg = "\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + " " + date("Y/m/d H:i:s");
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putHandlerResult(1, FJP_MAIL_ALLPACT, "\u5931\u6557");
			}
	}

	getToday() {
		var H_ymd = {
			year: date("Y"),
			month: date("n"),
			date: date("j")
		};
		return this.moveDate(H_ymd, this.m_diff_days);
	}

	moveDate(H_ymd: {} | any[], diff) //タイムスタンプにする
	//補正日数を加算する
	//年月日をタイムスタンプから取り出す
	{
		var tm = mktime(0, 0, 0, H_ymd.month, H_ymd.date, H_ymd.year);
		tm += diff * 24 * 3600;
		return {
			year: date("Y", tm),
			month: date("n", tm),
			date: date("j", tm)
		};
	}

	getLastDate(H_ymd: {} | any[]) //翌月にする
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

	resolve(H_today: {} | any[], A_schedule: {} | any[], H_result: {} | any[]) //月末の日付を作る
	//月末のスケジュールがあり、今日が月末なら最高優先度
	//最後の実行結果が失敗なら、第三優先度
	{
		var H_last_date = this.getLastDate(H_today);
		var last_date = H_last_date.date;

		if (last_date == H_today.date) //今日は月末である
			{
				for (var H_schedule of Object.values(A_schedule)) {
					if (32 == H_schedule.execdate) //月末の実行指示がある
						{
							return H_schedule.waytype;
						}
				}
			}

		for (var H_schedule of Object.values(A_schedule)) {
			if (H_today.date == H_schedule.execdate) //今日の日付の実行指示がある
				{
					return H_schedule.waytype;
				}
		}

		if (false !== H_result && undefined !== H_result.status && undefined !== H_result.waytype && 0 != H_result.status) //最後の実行結果があり、失敗である
			{
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
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, year, month, logdir, is_standalone, fname_setting, waytype, A_pactid_in: {} | any[], A_pactid_out: {} | any[]) {
		super(O_log, O_db, O_table_no, year, month, logdir, is_standalone, fname_setting);
		this.m_waytype = waytype;
		this.m_A_pactid_in = A_pactid_in;
		this.m_A_pactid_out = A_pactid_out;
	}

	execute() //実行するテーブル名を作る
	{
		if (this.isFailSetting()) return false;
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.getHandler());
		var A_table_no = [""];
		var waytype_label = "\u6700\u65B0";

		if (FJP_WAYTYPE_CUR_NEW == this.m_waytype) {
			var H_ym = this.getYearMonth();
			var table_no = this.getTableNo(H_ym.year, H_ym.month);
			A_table_no.push(table_no);
			waytype_label = "\u6700\u65B0\u3068" + H_ym.year + "/" + H_ym.month + "\u306E\u30C7\u30FC\u30BF";
		} else if (2 == this.m_waytype) {
			for (var cnt = 1; cnt <= 24; ++cnt) {
				var v = cnt;
				if (v.length < 2) v = "0" + v;
				A_table_no.push(v);
			}

			waytype_label = "\u5168\u3066";
		}

		var A_pactid_fail = Array();

		if (!O_model.executePreCheckAll(A_pactid_fail, this.m_A_pactid_in, this.m_A_pactid_out, A_table_no)) //不正終了した
			{
				var msg = "\u4E88\u671F\u3057\u306A\u3044\u7406\u7531\u3067\u3001" + "\u4E8B\u524D\u691C\u67FB\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + "(" + date("Y/m/d H:i:s");
				msg += ")\u3002";
				msg += "\u5B9F\u884C\u5185\u5BB9\u306F" + waytype_label + "\u3067\u3059\u3002";
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putHandlerResult(1, FJP_MAIL_ALLPACT, "\u6B63\u5E38\u7D42\u4E86(\u554F\u984C\u3042\u308A)");
				return false;
			}

		if (A_pactid_fail.length) //正常終了し、検査に失敗した顧客がある
			{
				msg = "\u4E8B\u524D\u691C\u67FB\u3092\u884C\u3044\u307E\u3057\u305F" + "(" + date("Y/m/d H:i:s");
				msg += ")\u554F\u984C\u306E\u3042\u308B\u9867\u5BA2\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F";
				msg += "(pactid\u306F" + A_pactid_fail.join(",") + ")";
				msg += "\u5B9F\u884C\u5185\u5BB9\u306F" + waytype_label + "\u3067\u3059\u3002";
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				this.putHandlerResult(1, FJP_MAIL_ALLPACT, "\u6B63\u5E38\u7D42\u4E86(\u554F\u984C\u3042\u308A)");
				return true;
			}

		msg = "\u4E8B\u524D\u691C\u67FB\u306B\u6210\u529F\u3057\u307E\u3057\u305F" + "(" + date("Y/m/d H:i:s");
		msg += ")\u554F\u984C\u306E\u3042\u308B\u9867\u5BA2\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002";
		msg += "\u5B9F\u884C\u5185\u5BB9\u306F" + waytype_label + "\u3067\u3059\u3002";
		this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
		this.putLog(G_SCRIPT_DEBUG, msg);
		this.putHandlerResult(0, FJP_MAIL_ALLPACT, "\u6B63\u5E38\u7D42\u4E86(\u554F\u984C\u7121\u3057)");
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
class FJPProcParentType extends FJPProcBaseType {
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, logdir, command, label, exectype) {
		this.m_O_handler = new FJPErrorHandlerBufferType();
		super(O_log, O_db, O_table_no, this.m_O_handler, logdir);
		this.m_command = command;
		this.m_label = label;
		this.m_exectype = exectype;
	}

	executeChild(status, H_result: {} | any[], A_buffer: {} | any[]) //子プロセスのインスタンスを作る
	//プロセスを実行する
	//$H_resultが空配列なら、子プロセスが結果を書き込んでいない
	//$is_okがfalseなら、子プロセスから解釈不能なメッセージが出力された
	//$return_varは、子プロセスの返値(エラー判別には使わない)
	//$H_result["type"]が-1なら、何もしない
	{
		H_result = Array();
		A_buffer = Array();
		var O_child = new FJPChildProcType(this.getLog(), this.m_O_handler);
		var return_var = 0;
		var is_ok = O_child.exec(this.m_command, return_var);
		H_result = this.m_O_handler.getResult();

		if (undefined !== H_result.type && -1 == H_result.type) {
			var msg = this.m_label + "\u30D7\u30ED\u30BB\u30B9\u5B9F\u884C\u7D50\u679C" + H_result.type + "\u306A\u306E\u3067\u5B9F\u884C\u8A18\u9332\u3092\u6B8B\u3055\u305A\u7D42\u4E86" + " " + H_result.pactid + " " + H_result.msg;
			this.putLog(G_SCRIPT_DEBUG, msg);
			status = -1;
			return true;
		}

		status = 0;

		if (!H_result.length) //子プロセスが実行結果を出力しなかった(不正終了している)
			{
				msg = this.m_label;
				msg += "\u30D7\u30ED\u30BB\u30B9\u304C\u4E0D\u6B63\u7D42\u4E86\u3057\u307E\u3057\u305F";
				this.putHandler(FJP_MAIL_ALL, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_WARNING, msg);
				status = 1;
			} else //子プロセスが実行結果を出力した
			{
				msg = this.m_label + "\u30D7\u30ED\u30BB\u30B9\u5B9F\u884C\u7D50\u679C" + H_result.type + " " + H_result.pactid + " " + H_result.msg;
				this.putHandler(FJP_MAIL_KCS | FJP_MAIL_MOTION, FJP_MAIL_ALLPACT, msg);
				this.putLog(G_SCRIPT_DEBUG, msg);
				status = H_result.type;
			}

		A_buffer = this.m_O_handler.get();
		return true;
	}

	executeInsert(status, H_result: {} | any[], A_buffer: {} | any[]) //モデルを作成する
	//実行結果をメールとして保存する
	//改行が含まれる可能性があるので低速版を使う
	{
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.m_O_handler);

		for (var cnt = 0; cnt < A_buffer.length; ++cnt) {
			A_buffer[cnt] = {
				type: A_buffer[cnt].type,
				pactid: A_buffer[cnt].pactid,
				message: A_buffer[cnt].msg
			};
		}

		var waytype = -1;
		if (undefined !== H_result.pactid) waytype = H_result.pactid;
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
class FJPProcMailType extends FJPProcBaseType {
	constructor(O_log: ScriptLogBase, O_db: ScriptDB, O_table_no: TableNo, logdir, debug_mode, debug_addr, subject, is_fix_subject, A_bcc: {} | any[], A_addr_param: {} | any[], A_exectype: {} | any[], A_status: {} | any[], A_is_send: {} | any[], A_uniqueid: {} | any[]) {
		this.m_O_handler = new FJPErrorHandlerBufferType();
		super(O_log, O_db, O_table_no, this.m_O_handler, logdir);
		this.m_debug_mode = debug_mode;
		this.m_debug_addr = debug_addr;
		this.m_subject = subject;
		this.m_is_fix_subject = is_fix_subject;
		this.m_A_bcc = A_bcc;
		this.m_A_addr_param = A_addr_param;
		this.m_A_exectype = A_exectype;
		this.m_A_status = A_status;
		this.m_A_is_send = A_is_send;
		this.m_A_uniqueid = A_uniqueid;
	}

	execute() //ハンドラに出力されたメッセージをログに残す
	{
		var rval = this.doExecute();
		var A_buffer = this.m_O_handler.get();

		for (var H_buffer of Object.values(A_buffer)) {
			this.putLog(G_SCRIPT_WARNING, H_buffer.msg + " " + H_buffer.type + " " + H_buffer.pactid);
		}

		return rval;
	}

	doExecute() //モデルを作成する
	//社名一覧を取り出す
	//送信先アドレスを取得する
	//メール送信の親を読み出す
	{
		var O_model = new FJPModelType(this.getLog(), this.getDB(), this.getTableNoIns(), this.m_O_handler);
		var H_pact = O_model.getPactCompName();

		if (false === H_pact) {
			this.putLog(G_SCRIPT_WARNING, "\u793E\u540D\u4E00\u89A7\u306E\u53D6\u5F97\u306B\u5931\u6557");
			return false;
		}

		var O_mail = new FJPMailSenderType(this.getLog(), this.m_debug_mode, this.m_debug_addr);
		var A_addr = O_model.getHRMAddr();

		if (false === A_addr) {
			this.putLog(G_SCRIPT_WARNING, "\u9001\u4FE1\u5148FJP\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u53D6\u5F97\u306B\u5931\u6557");
			return false;
		}

		var A_param = Array();

		for (var H_param of Object.values(this.m_A_addr_param)) {
			if (!(undefined !== H_param.bcc)) H_param.bcc = this.m_A_bcc;
			if (!(undefined !== H_param.subject)) H_param.subject = this.m_subject;
			A_param.push(H_param);
		}

		A_param.push({
			type: FJP_MAIL_FJP,
			to: A_addr,
			bcc: this.m_A_bcc,
			subject: this.m_subject
		});

		for (var H_param of Object.values(A_param)) {
			this.putLog(G_SCRIPT_DEBUG, "\u30E1\u30FC\u30EB\u9001\u4FE1\u5148:" + H_param.type + ":" + H_param.to.join(",") + ":" + H_param.subject);
		}

		var A_index = O_model.getHRMStatusIndex(this.m_A_exectype, this.m_A_status, this.m_A_is_send, this.m_A_uniqueid);

		if (false === A_index) {
			this.putLog(G_SCRIPT_WARNING, "\u9001\u4FE1\u60C5\u5831(\u89AA)\u306E\u53D6\u5F97\u306B\u5931\u6557");
			return false;
		}

		var rval = true;

		for (var H_index of Object.values(A_index)) //メール送信の子を読み出す
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
			this.putLog(G_SCRIPT_DEBUG, "\u30E1\u30FC\u30EB\u306E\u89AA:" + H_index.uniqueid);
			var A_details = O_model.getHRMStatusDetails(H_index.uniqueid);

			if (false === A_details) {
				this.putLog(G_SCRIPT_WARNING, "\u9001\u4FE1\u60C5\u5831(\u5B50)\u306E\u53D6\u5F97\u306B\u5931\u6557" + H_index.uniqueid);
				return false;
			}

			var A_buffer = new FJPErrorHandlerBufferType();
			A_buffer.put(FJP_MAIL_ALL, 0, "\u8A73\u7D30\u306A\u5185\u5BB9\u306F\u3001" + "fjp_hrm_status_details_tb\u306E\u3001uniqueid\u304C" + H_index.uniqueid + "\u3067\u53C2\u7167\u3067\u304D\u307E\u3059\u3002");
			A_buffer = A_buffer.get();
			var H_sub = {
				"%1": this.m_is_fix_subject ? "" : this.getExecLabel(H_index.exectype),
				"%2": this.m_is_fix_subject ? "" : this.getStatusLabel(H_index.status)
			};
			O_mail.send(A_buffer, A_param, H_pact, H_sub);

			if (false === O_model.updateHRMStatusIndexIsSend(H_index.uniqueid)) {
				this.putLog(G_SCRIPT_WARNING, "\u9001\u4FE1\u60C5\u5831(\u89AA)\u306E\u66F4\u65B0\u306B\u5931\u6557" + H_index.uniqueid);
				return false;
			}
		}

		return true;
	}

	getExecLabel(exectype) {
		switch (exectype) {
			case 0:
				return "\u53D6\u8FBC\u6A5F\u80FD";

			case 1:
				return "\u4E8B\u524D\u30C1\u30A7\u30C3\u30AF";

			case 2:
				return "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30B3\u30D4\u30FC";
		}

		return "\u4E0D\u660E\u306A\u6A5F\u80FD";
	}

	getStatusLabel(status) {
		switch (status) {
			case 0:
				return "\u6B63\u5E38\u7D42\u4E86";

			default:
				return "\u4E0D\u6B63\u7D42\u4E86";
		}
	}

};