//===========================================================================
//バッチマネージャー
//2007/11/30	T.Nakanishi
//===========================================================================
////////////////////////////////////////////////////////////////
//正常
//終了
//エラー
//Dependのための構文解析
////////////////////////////////////////////////////////////////
//END TextReader
////////////////////////////////////////////////////////////////
//END BatchManager
////////////////////////////////////////////////////////////////
//Dependのための字句解析
//END SimpleLex
////////////////////////////////////////////////////////////////
//Main
//引数を得る
//リストオプションを取得
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//デバッグ時、標準出力に出してみる.
//エラー出力用ハンドル
//ファイル存在チェック
//リスト表示
//実行
//メール送信
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("Mail.php");

const ST_NORMAL = 0;
const ST_END = 9;
const ST_ERROR = 10;

require("batch_parse.php");

//入力ファイル
//現在読み込んでいる行数
//コンストラクター
//行を１行読み取る
class TextReader {
	TextReader(script) //変数の初期化
	{
		var line_cnt = 0;
		this.status = ST_NORMAL;
		this.input = fopen(script, "r");

		if (this.input == false) {
			this.status = ST_ERROR;
		}
	}

	readLn() //行数を数える
	//前後の空白を除く
	{
		this.line = fgets(this.input);

		if (feof(this.input)) {
			this.status = ST_END;
			return undefined;
		}

		this.line_cnt++;
		return this.line.trim();
	}

};

//テキスト読込クラス
//パースした実行内容をここに入れる
//現在読込中のバッチラベル名
//出現したラベルを記録する
//実行開始日
//スクリプトの稼働時間制限
//一週間の曜日
//スクリプト上の定数定義、Define
//コンストラクター
//パース実行
//実行前のチェック
//リスト表示 * 確認用
//実行
//１回実行
//ログ書き込み関数
//stat: 開始時には'begin'、終了時には'done'
//デバッグ表示
//メール送信
class BatchManager {
	BatchManager(dbh0, logh0) //変数の初期化
	//今日の日付を得る
	{
		this.ex = Array();
		this.all_labels = Array();
		this.status = ST_NORMAL;
		this.debug = false;
		this.dbh = dbh0;
		this.logh = logh0;
		this.A_DayWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		this.startdate = date("Y-m-d");
	}

	parse(script) {
		this.reader = new TextReader(script);

		if (this.reader.status == ST_ERROR) {
			print("ERROR: Cannot open script file \"" + script + "\"\n");
			this.status = ST_ERROR;
			return this.status;
		}

		while (true) //１つ以上空白の繰り返し
		//１つ以上空白の繰り返し
		//# 以降はコメントと見なして削除する
		//１トークン目で場合分け
		{
			var line = this.reader.readLn();

			if (this.reader.status == ST_END) //ファイル読み取り終了
				{
					break;
				}

			if (!line) //空白行は除く
				{
					continue;
				}

			if (preg_match("/^#/", line)) //行頭の # はコメント
				{
					continue;
				}

			var ln = preg_split("/[ \t]+/", line);

			if (ln.length < 2) //パラメーターが無い
				{
					print("ERROR: no paramater \"" + line + "\" at line " + this.reader.line_cnt + ".\n");
					continue;
				}

			var param = line.replace(/^[^ 	]*[ 	]+/g, "");
			param = param.replace(/[ 	]*#.*$/g, "");

			if (preg_match("/DO/i", ln[0])) {
				this.parseDo(param);
			} else if (preg_match("/DEPEND/i", ln[0])) {
				this.parseDepend(param);
			} else if (preg_match("/DATE/i", ln[0])) {
				this.parseDate(param);
			} else if (preg_match("/SKIP/i", ln[0])) {
				this.parseSkip(param);
			} else if (preg_match("/WEEK/i", ln[0])) {
				this.parseWeek(param);
			} else if (preg_match("/WAIT/i", ln[0])) {
				this.parseWait(param);
			} else if (preg_match("/UNTIL/i", ln[0])) {
				this.parseUntil(param);
			} else if (preg_match("/TIMELIMIT/i", ln[0])) {
				this.parseTimeLimit(param);
			} else if (preg_match("/DEFINE/i", ln[0])) {
				this.parseDefine(param);
			} else {
				print("ERROR: unknown syntax \"" + line + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
			}
		}

		return this.status;
	}

	parseDo(param) //第１パラメータはバッチのラベル名
	//第２パラメータ以降がそのままコマンドとなる
	//１つ以上空白の繰り返し
	//print "DEBUG: label=" . $this->label .", command=" . $command . "\n";
	//出現したラベルを記録する
	{
		var ln = preg_split("/[ \t]/", param);

		if (ln.length < 2) //コマンド未指定
			{
				print("ERROR: no command Do \"" + param + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
				return;
			}

		this.label = ln[0];
		var command = param.replace(/^[^ 	]*[ 	]+/g, "");

		if (undefined !== this.ex[this.label]) //そのラベルは既に使われている
			{
				print("ERROR: duplicate label \"" + this.label + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
			}

		this.ex[this.label].command = command;
		this.all_labels.push(this.label);
	}

	parseDepend(param) //( ) & | 区切り
	//配列ごと登録
	//ここで構文チェックを行う
	{
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		var ln = preg_split("/\\(|\\)|&|\\|/", param);
		var A_labels = Array();

		for (var b_label of Object.values(ln)) //空白を除く
		{
			var b_label = b_label.trim();

			if (b_label != "") {
				A_labels.push(b_label);
			}
		}

		this.ex[this.label].depend_labels = A_labels;
		var tiny_parser = new TinyParser(param);
		tiny_parser.check();

		if (tiny_parser.status == ST_ERROR) {
			print("ERROR: Depend Syntax error, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
		}

		this.ex[this.label].depend_source = param;
	}

	parseDate(param) //カンマ、空白、TAB区切り
	//配列ごと登録
	{
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		var ln = preg_split("/[, \t]+/", param);

		for (var day of Object.values(ln)) {
			if (day <= 0 || day > 31) {
				print("ERROR: Illigal date, \"" + param + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
				return;
			}
		}

		this.ex[this.label].date = ln;
	}

	parseSkip(param) //カンマ、空白、TAB区切り
	//配列ごと登録
	{
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		var ln = preg_split("/[, \t]+/", param);

		for (var day of Object.values(ln)) {
			if (day <= 0 || day > 31) {
				print("ERROR: Illigal date, \"" + param + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
				return;
			}
		}

		this.ex[this.label].skip = ln;
	}

	parseWeek(param) //カンマ、空白、TAB区切り
	//配列ごと登録
	{
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		var ln = preg_split("/[, \t]+/", param);

		for (var day of Object.values(ln)) {
			if (!(-1 !== this.A_DayWeek.indexOf(day))) {
				print("ERROR: Illigal day of week, \"" + param + "\" at line " + this.reader.line_cnt + ".\n");
				this.status = ST_ERROR;
				return;
			}
		}

		this.ex[this.label].week = ln;
	}

	parseWait(param) {
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		var w_time = param.trim();

		if (!preg_match("/^[0-9]{1,2}:[0-9]{1,2}$/", w_time)) {
			print("ERROR: Illegal time setting " + w_time + ", format(HH:MM), at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		this.ex[this.label].wait = w_time;
	}

	parseUntil(param) {
		if (!this.label) {
			print("ERROR: no batch specified, use Do syntax, at line " + this.reader.line_cnt + ".\n");
			return;
		}

		var u_time = param.trim();

		if (!preg_match("/^[0-9]{1,2}:[0-9]{1,2}$/", u_time)) {
			print("ERROR: Illegal time setting " + u_time + ", format(HH:MM), at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		this.ex[this.label].until = u_time;
	}

	parseTimeLimit(param) //時間制限を表す特殊なラベル
	//出現したラベルを記録する
	//制限時間を記録する
	{
		var l_time = param.trim();

		if (!preg_match("/^[0-9]{1,2}:[0-9]{1,2}$/", l_time)) {
			print("ERROR: Illegal time setting " + l_time + ", format(HH:MM), at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		this.label = "_TIME_LIMIT_";
		this.all_labels.push(this.label);
		this.time_limit = l_time;
	}

	parseDefine(param) //空白文字区切りで２つ取り出す
	//定数に設定
	{
		var key, value;
		[key, value] = preg_split("/[ \t]+/", param.trim());

		if (key == "") {
			print("ERROR: Define has not keyword, at line " + this.reader.line_cnt + ".\n");
			this.status = ST_ERROR;
			return;
		}

		this.H_def[key] = value;
	}

	precheck() //依存関係チェック
	{
		for (var b_label of Object.values(this.all_labels)) {
			if (!(undefined !== this.ex[b_label].depend_labels)) //依存関係なし
				{
					continue;
				}

			var depends = this.ex[b_label].depend_labels;

			for (var d_label of Object.values(depends)) //Dependに指定してあるバッチラベルが見つからなかった
			{
				if (!(-1 !== this.all_labels.indexOf(d_label))) {
					print("ERROR: \"" + d_label + "\" was not found, written in Depend syntax for \"" + d_label + "\".\n");
					this.status = ST_ERROR;
				}

				if (d_label == b_label) {
					print("ERROR: \"" + d_label + "\" was depended on itself.\n");
					this.status = ST_ERROR;
				}
			}
		}
	}

	prlist() {
		console.log(this.ex);
	}

	execute() //エラーがあると実行できない
	//実行完了までループ
	{
		if (this.status == ST_ERROR) {
			this.logh.putError(G_SCRIPT_ERROR, "batch_manager has not run." + this.startdate);
			return ST_ERROR;
		}

		this.logh.putError(G_SCRIPT_BEGIN, "batch_manager, " + this.startdate + " start");

		if (!this.debug) //24時間
			{
				var loop_max = 24 * 60;
			} else //デバッグ時には最大回数を少なくする
			{
				loop_max = 100;
			}

		while ((ret = this.execEach()) == ST_NORMAL) {
			if (--loop_max <= 0) //無限ループに陥らないよう最大回数をカウント
				{
					break;
				}

			if (!this.debug) //デバッグモードでなければ
				//一定時間ウエイトを入れる
				{
					sleep(60);
				}
		}
	}

	execEach() //ＤＢから現在のステータスを得る
	//実行済みカウント
	//時間制限が完了しているかどうか
	//実行完了チェック
	//print "DEBUG: timelimit指定=". $done_time_limit .", 全数all_labels=" . count($this->all_labels) . ", 実行完了数=". $done_count ."\n";
	//実行完了
	{
		var sql = "SELECT log from batchlog_tb WHERE recdate >= '" + this.startdate + "' AND status = 'done'";
		var A_log = this.dbh.getCol(sql);

		if (A_log.length == 0) {
			A_log = Array();
		}

		var done_count = 0;
		var done_time_limit = false;

		for (var b_label of Object.values(this.all_labels)) //すでに実行完了済みか？
		//コマンド実行
		//実行完了
		//実行完了したものにはフラグを立てる
		{
			if (undefined !== this.ex[b_label].done && this.ex[b_label].done == true) //実行済みを数える
				//時間制限が完了しているかどうかチェックする
				{
					done_count++;

					if (b_label == "_TIME_LIMIT_") {
						done_time_limit = true;
					}

					continue;
				}

			if (undefined !== this.ex[b_label].date) //日付指定があって
				//当日の指定がなければ実行しない
				{
					if (!(-1 !== this.ex[b_label].date.indexOf(date("d")))) //本日はもう実行しない
						{
							this.dbg_print(b_label + " is not set today, and skip.");
							this.ex[b_label].done = true;
							continue;
						}
				}

			if (undefined !== this.ex[b_label].skip) //スキップ日付指定があって
				//当日の指定があれば実行しない
				{
					if (-1 !== this.ex[b_label].skip.indexOf(date("d"))) //本日はもう実行しない
						{
							this.dbg_print(b_label + " is skipped today.");
							this.ex[b_label].done = true;
							continue;
						}
				}

			if (undefined !== this.ex[b_label].week) //スキップ日付指定があって
				//当日の指定があれば実行しない
				{
					if (!(-1 !== this.ex[b_label].week.indexOf(date("D")))) //本日はもう実行しない
						{
							this.dbg_print(b_label + " is skipped today of week.");
							this.ex[b_label].done = true;
							continue;
						}
				}

			if (undefined !== this.ex[b_label].wait) //待ち時間指定があって
				//まだ時間を超えていなければ何もしない
				{
					var tm = preg_split("/:/", this.ex[b_label].wait);

					if (date("H") < tm[0]) {
						this.dbg_print(b_label + " is not boom, " + tm[0] + ":" + tm[1] + " (hour)");
						continue;
					} else if (date("H") == tm[0] && date("i") < tm[1]) {
						this.dbg_print(b_label + " is not boom, " + tm[0] + ":" + tm[1] + " (min)");
						continue;
					}
				}

			if (undefined !== this.ex[b_label].until) //終了時間指定があって
				//もう時間を超えたなら何もしない
				{
					tm = preg_split("/:/", this.ex[b_label].until);

					if (date("H") > tm[0]) //本日はもう実行しない
						{
							this.dbg_print(b_label + " is over, " + tm[0] + ":" + tm[1] + " (hour)");
							this.ex[b_label].done = true;
							continue;
						} else if (date("H") == tm[0] && date("i") > tm[1]) //本日はもう実行しない
						{
							this.dbg_print(b_label + " is over, " + tm[0] + ":" + tm[1] + " (min)");
							this.ex[b_label].done = true;
							continue;
						}
				}

			if (undefined !== this.ex[b_label].depend_source) //依存関係があって
				//パーサに変数をセットする
				//表を登録する
				//シンタックスチェック、原理的には無いはずだが。
				{
					var param = this.ex[b_label].depend_source;
					var tiny_parser = new TinyParser(param);
					var labels = Array();

					for (var d_label of Object.values(this.ex[b_label].depend_labels)) //全てのlabel について、A_logにあればtrue, 無ければfalse という表を作る
					{
						labels[d_label] = -1 !== A_log.indexOf(d_label);
					}

					tiny_parser.H_names = labels;
					var result = tiny_parser.execute();

					if (tiny_parser.status == ST_ERROR) //本日はもう実行しない
						{
							this.dbg_print(b_label + ", Depend Syntax error.");
							this.status = ST_ERROR;
							this.ex[b_label].done = true;
							continue;
						}

					if (result == false) {
						this.dbg_print(b_label + " is depends on " + param + ", and skipped.");
						continue;
					}
				}

			if (b_label == "_TIME_LIMIT_") //時間制限を表す特殊なラベル
				//制限時間を超えていたら実行中止
				{
					tm = preg_split("/:/", this.time_limit);

					if (date("H") > tm[0]) {
						this.logh.putError(G_SCRIPT_ERROR, "time limit, over " + tm[0] + ":" + tm[1] + " (hour)");
						return ST_END;
					} else if (date("H") == tm[0] && date("i") > tm[1]) {
						this.logh.putError(G_SCRIPT_ERROR, "time limit, over " + tm[0] + ":" + tm[1] + " (min)");
						return ST_END;
					}

					continue;
				}

			if (-1 !== A_log.indexOf(b_label)) //本日はもう実行しない
				{
					this.dbg_print(b_label + " has already done " + this.startdate + ", then skipped.");
					this.ex[b_label].done = true;
					continue;
				}

			this.writelog(b_label, "begin");
			var command = this.ex[b_label].command;

			if (!this.debug) //デバッグモード
				//返り値を取得することで実行中ロックする
				//print_r( $A_rval );	// こうすれば結果が出力される
				{
					var A_rval = Array();
					var rval = undefined;
					exec(command, A_rval, rval);
				} else {
				this.dbg_print("Exec " + b_label + " > " + command);
			}

			this.writelog(b_label, "done");
			this.ex[b_label].done = true;
		}

		if (done_time_limit == true && this.all_labels.length > done_count - 1 || done_time_limit == false && this.all_labels.length > done_count) //まだ実行するものが残っている
			{
				return ST_NORMAL;
			}

		return ST_END;
	}

	writelog(logtxt, stat) //引数チェック
	{
		if (logtxt == "" || stat != "begin" && stat != "done") {
			return;
		}

		if (stat == "begin") {
			var sql = "INSERT INTO batchlog_tb (recdate, log, status) VALUES (";
			sql += "'" + date("Y-m-d H:i:s") + "',";
			sql += "'" + logtxt + "',";
			sql += "'" + stat + "'";
			sql += ")";
		} else if (stat == "done") {
			sql = "UPDATE batchlog_tb SET status = '" + stat + "', fixdate = '" + date("Y-m-d H:i:s") + "' ";
			sql += "WHERE log = '" + logtxt + "' ";
			sql += "AND recdate >= '" + date("Y-m-d") + "'";
		}

		this.dbh.query(sql);
		this.dbh.commit();
		this.logh.putError(G_SCRIPT_END, logtxt + " " + stat);
	}

	dbg_print(str) {
		if (this.debug) {
			print("DEBUG: " + str + "\n");
		}
	}

	mailsend() //最後に今日のログをすべて取得して動作レポートをメールで飛ばす
	//2009/03/06
	//定数 envname を得る
	{
		var sql = "SELECT recdate,log,status,fixdate FROM batchlog_tb WHERE recdate >= '" + this.startdate + "'" + " order by recdate";
		var A_log = this.dbh.getAll(sql);

		if (A_log.length < 1) {
			A_log = Array();
		}

		var mailcontent = "";

		for (var key in A_log) {
			var val = A_log[key];
			mailcontent += val[0] + "\t" + val[1] + "\t" + val[2] + "\t" + val[3] + "\n";
		}

		if (undefined !== this.H_def.envname) {
			var envname = "(" + this.H_def.envname + ")";
		} else //未設定であれば空
			{
				envname = "";
			}

		var mailsubject = "\u30D0\u30C3\u30C1\u30DE\u30CD\u30FC\u30B8\u30E3\u52D5\u4F5C\u7D50\u679C" + envname + " " + this.startdate;
		var O_mail = Mail.factory("smtp", {
			host: G_SMTP_HOST,
			port: G_SMTP_PORT
		});
		var H_headers = {
			Date: date("r"),
			To: G_MAILINGLIST,
			From: G_MAIL_FROM
		};
		H_headers["Return-Path"] = G_MAIL_FROM;
		H_headers["MIME-Version"] = "1.0";
		H_headers.Subject = mb_encode_mimeheader(mailsubject, "ISO-2022-JP-MS");
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";

		if (!this.debug) {
			O_mail.send([G_MAIL_TO], H_headers, mailcontent);
		} else {
			print("---- " + mailsubject + " ----\n");
			print(mailcontent);
		}
	}

};

class SimpleLex {
	SimpleLex(str0) {
		this.str = str0;
	}

	nextToken() //print "DEBUG: str=" . $this->str . "\n";
	//文字列終了
	{
		for (var pos = 0; pos < this.str.length; pos++) {
			var letter = this.str[pos];

			switch (letter) {
				case "(":
					this.str = this.str.substr(pos + 1);
					return "(";

				case ")":
					this.str = this.str.substr(pos + 1);
					return ")";

				case "&":
					this.str = this.str.substr(pos + 1);
					return "&";

				case "|":
					this.str = this.str.substr(pos + 1);
					return "|";

				case " ":
				case "\t":
					break;

				default:
					var ln = preg_split("/\\(|\\)|&|\\|/", this.str);
					this.str = this.str.substr(ln[0].length);
					return ln[0].trim();
			}
		}

		return undefined;
	}

};

var argCnt = _SERVER.argv.length;

if (argCnt <= 1) {
	print("Usage: batch_manager <script_file> [-l|d]\n");
	throw die(1);
}

var script_file = _SERVER.argv[1];
var opt_list = false;
var opt_debug = false;

if (argCnt >= 3) {
	if (ereg("^-l", _SERVER.argv[2])) //リスト
		{
			opt_list = true;
		} else if (ereg("^-d", _SERVER.argv[2])) //デバッグ
		{
			opt_debug = true;
		}
}

var dbLogFile = G_LOG + "/batmng" + date("Ym") + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_type);

if (opt_debug) {
	var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
	log_listener.PutListener(log_listener_type2);
}

var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (file_exists(script_file) == false) {
	var msg = "script file \"" + script_file + "\" does not exist.";
	print("ERROR: " + msg + "\n");
	logh.putError(G_SCRIPT_ERROR, "batch_manager, " + msg);
	throw die(1);
}

var parser = new BatchManager(dbh, logh);
parser.parse(script_file);
parser.precheck();

if (opt_list == true) //実際には実行せずに終了
	{
		parser.prlist();
		throw die(0);
	}

if (opt_debug == true) {
	parser.debug = true;
}

parser.execute();
parser.mailsend();
throw die(0);