//===========================================================================
//機能：夜間バッチの、親子プロセスの基底型
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//プロセス動作時間の制限型

require("script_db.php");

require("script_command.php");

//{許可開始時間,許可終了時間}*
//機能：コンストラクタ
//引数：エラー処理型
//機能：許可開始時間と終了時間を設定する
//引数：開始時間(hhmm)
//終了時間(hhmm)
//返値：深刻なエラーが発生したらfalseを返す
//機能：許可開始時間と終了時間をまとめて設定する
//引数：設定文字列(開始時間と終了時間をカンマでつないだもの)
//例：2100,2400,0000,0800 (PM9時からAM8時まで)
//区切り文字
//返値：深刻なエラーが発生したらfalseを返す
//機能：実行可能時分を設定する
//引数：設定文字列(hhmmで、実行可能な時間と分を設定する)
//返値：深刻なエラーが発生したらfalseを返す
//機能：営業時間内ならtrueを返す
//引数：時刻(hhmm)省略したら現在時刻
//返値：営業時間内ならtrueを返す
class ProcessTime extends ScriptLogAdaptor {
	ProcessTime(listener) {
		this.ScriptLogAdaptor(listener, true);
		this.m_A_time = Array();
	}

	insert(begin, end) {
		if (4 != begin.length || !ctype_digit(begin)) {
			this.putError(G_SCRIPT_WARNING, `開始時刻書式不正${begin}`);
			return false;
		}

		if (4 != end.length || !ctype_digit(end)) {
			this.putError(G_SCRIPT_WARNING, `終了時刻書式不正${end}`);
			return false;
		}

		if (begin == end) return true;

		if (end < begin) {
			this.putError(G_SCRIPT_WARNING, `開始時間・終了時間不正${begin}/${end}`);
			return false;
		}

		this.m_A_time.push([begin, end]);
		return true;
	}

	insertAll(param, delim = ",") {
		var A_param = param.split(delim);

		if (0 != A_param.length % 2) {
			this.putError(G_SCRIPT_WARNING, `トークン個数不正${param}`);
			return false;
		}

		for (var cnt = 0; cnt < A_param.length; cnt += 2) if (!this.insert(A_param[cnt], A_param[cnt + 1])) return false;

		return true;
	}

	insertSpace(param) {
		if (4 != param.length || !ctype_digit(param)) {
			this.putError(G_SCRIPT_WARNING, `実行可能時分不正${param}`);
			return false;
		}

		var begin_hh = date("H");
		var begin_mm = date("i");
		var end_hh = begin_hh + param.substr(0, 2);
		var end_mm = begin_mm + param.substr(2, 4);

		while (60 <= end_mm) {
			end_mm -= 60;
			++end_hh;
		}

		while (24 <= end_hh) {
			end_hh -= 24;
		}

		var begin = sprintf("%02d%02d", begin_hh, begin_mm);
		var end = sprintf("%02d%02d", end_hh, end_mm);

		if (begin == end && strcmp("0000", param)) //24時間すべてである
			{
				return this.insert("0000", "2400");
			} else if (begin <= end) //日付をまたいでいない
			{
				return this.insert(begin, end);
			} else //日付をまたいだ
			{
				return this.insert(end, "2400") && this.insert("0000", end);
			}
	}

	isOpen(cur = "") {
		if (0 == cur.length) cur = date("Hi");

		for (var time of Object.values(this.m_A_time)) if (time[0] <= cur && cur <= time[1]) return true;

		return false;
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
class ProcessLog extends ScriptLogBase {
	ProcessLog() {
		this.ScriptLogBase(0);
	}

	setPath(listener, path, procname) {
		if (!file_exists(path)) {
			var msg = `ログパス不正${path}`;
			if (undefined !== listener) listener.put(G_SCRIPT_ERROR, msg);else fwrite_conv(this.toLabel(G_SCRIPT_ERROR) + msg + "\n");
			return false;
		}

		if (procname.length) {
			if (!file_exists(path + procname) && !mkdir(path + procname)) {
				msg = `ログディレクトリ作成失敗${path}${procname}`;
				if (undefined !== listener) listener.put(G_SCRIPT_ERROR, msg);else fwrite_conv(this.toLabel(G_SCRIPT_ERROR) + msg + "\n");
				return false;
			}
		}

		this.m_path = path + procname;
		this.m_err = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, this.m_path + "error.log");
		this.putListener(this.m_err);
		this.m_info = new ScriptLogFile(G_SCRIPT_ALL & ~G_SCRIPT_DEBUG, this.m_path + "info.log");
		this.m_debug = new ScriptLogFile(G_SCRIPT_ALL, this.m_path + "debug.log");
		this.putListener(this.m_debug);
		this.m_sql = new ScriptLogFile(G_SCRIPT_SQL, this.m_path + "sql.log");
		return true;
	}

};

//プロセス名(ログ保存フォルダに使用する)
//現在のログ
//エラー用のログ
//このプロセスのログ
//DB型
//テーブルNo計算型
//ARGV処理型
//手動モードならtrue
//trueなら、DB更新を行わない
//ログ出力先のフォルダ名
//0/1/2->ロック無し/自プロセスとロック/全プロセスとロック
//動作可能時間制御を行うならtrue
//動作可能時間
//現在のログ出力先
//共通エラーログ
//処理中の顧客ID(顧客名のキャッシュ用)
//処理中の顧客名
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：GZIPの解凍・圧縮を行う
//引数：ファイルパス
//圧縮ならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ログ出力する
//機能：共通ログを出力する
//備考：this->m_listenerに対して共通ログ出力を行うと、
//このメソッドが呼び出される。
//引数：メッセージ種別
//メッセージ
//機能：共通ログを出力する
//引数：メッセージ
//機能：このプロセスの日本語処理名を返す
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：現在処理中のファイル名を返す
//備考：特定のファイル名が無い場合は空文字列を返す
//機能：ARGVを処理する
//引数：ARGV(nullならグローバルのARGVを使用する)
//最初の一個を無視するならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：内容のチェックを確認する
//備考：ARGVの中の未定義値を設定しても良い
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：ARGVの内容を反映させる
//返値：深刻なエラーが発生したらfalseを返す
//機能：ARGVの読み込み終了後に実行される
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：自インスタンスを初期化する
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：マニュアル時に、実行するか問い合わせる
//返値：実行すべきならtrueを返す
//機能：営業時間内ならtrueを返す
//機能：処理の前に呼ばれる
//返値：深刻なエラーが発生したらfalseを返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理の後に呼ばれる
//引数：do_executeの実行ステータス
//返値：深刻なエラーが発生したらfalseを返す
//機能：ロックの施錠と解除を行う
//引数：ロックをかけるならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：WEB側のclampweb_function_tbをロックする
//引数：DBインスタンス
//ロック文字列
//ロック検索文字列(LIKE用)
//返値：深刻なエラーが発生したらfalseを返す
//機能：WEB側のclampweb_function_tbのロックを解除する。
//引数：DBインスタンス
//削除レコードの検索文字列(LIKE用)
//返値：深刻なエラーが発生したらfalseを返す
//機能：呼び出す毎にユニークな文字列を返す
class ProcessBase {
	ProcessBase(procname, logpath, opentime) //この段階では、m_listener_processはnullのまま
	//初期設定
	{
		this.m_procname = procname;
		this.m_listener_error = new ScriptLogBase(0);
		var stdout = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
		this.m_listener_error.putListener(stdout);
		this.m_err_common = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, logpath + "error.log");
		this.m_listener_error.putListener(this.m_err_common);
		this.m_listener = new ScriptLogBase(0);
		this.m_listener.m_operator = this;
		this.m_listener.putListener(this.m_listener_error);
		this.m_db = new ScriptDB(this.m_listener);
		this.m_table_no = new TableNo();
		this.m_args = new ScriptArgs({
			m: {
				type: "int"
			},
			d: {
				type: "int"
			},
			l: {
				type: "string"
			},
			k: {
				type: "int"
			},
			o: {
				type: "string"
			},
			O: {
				type: "string"
			},
			h: Array()
		});
		this.m_manualflag = true;
		this.m_debugflag = false;
		this.m_logpath = logpath;
		this.m_lockflag = 1;
		this.m_opentime = new ProcessTime(this.m_listener);

		if (0 < opentime.length) {
			this.m_checktime = true;
			if (!this.m_opentime.insertAll(opentime)) throw die(1);
		} else this.m_checktime = false;
	}

	processGzip(path, is_comp) {
		var proc = new ScriptCommand(this.m_listener);
		var line = G_GZIP + " -f";
		if (!is_comp) line += " -d";
		line += " " + path;
		return proc.executeCommand(line);
	}

	putError(type, message) {
		if (G_SCRIPT_SQL & type) this.m_listener.put(type, message);else this.m_listener.put(type, this.m_procname + "::" + message);
		if (G_SCRIPT_ERROR & type) throw die(1);
	}

	putOperator(type, message) {
		var procname = this.getProcname();
		var pactid = this.getCurrentPactid();
		var pactname = "";
		if (0 == strcmp(pactid, this.m_cur_pactname_id)) pactname = this.m_cur_pactname;else if (undefined !== this.m_db && pactid) {
			var sql = "select compname from pact_tb";
			sql += " where pactid=" + pactid;
			sql += ";";
			pactname = this.m_db.getOne(sql);
			this.m_cur_pactname = pactname;
			this.m_cur_pactname_id = pactid;
		}
		var yyyymm = this.getCurrentMonth();
		var fname = this.getCurrentFilename();
		var subject = this.m_listener.toLabel(type) + ` ${procname} ${pactid} ${pactname} ${yyyymm} ${fname} ${message}`;
		this.putOperatorRaw(subject + "\n");
		this.putError(type, subject);
	}

	putOperatorRaw(subject) {
		var fp = fopen(G_OPERATOR_LOGFILE, "at");

		if (!fp) {
			fwrite_conv(subject);
			return;
		}

		fwrite_conv(subject, fp);
		fclose(fp);
	}

	getProcname() {
		return this.m_procname;
	}

	getCurrentPactid() {
		return 0;
	}

	getCurrentMonth() {
		return "";
	}

	getCurrentFilename() {
		return "";
	}

	readArgs(A_argv, skip_first = true) {
		if (!this.m_args.readAll(A_argv, skip_first)) {
			this.m_args.writeLog(this.m_listener);
			return false;
		}

		if (!this.checkArgs() || !this.commitArgs()) return false;
		this.m_args.writeLog(this.m_listener);
		return true;
	}

	checkArgs() {
		for (var arg of Object.values(this.m_args.m_A_args)) if (!this.checkArg(arg)) return false;

		return true;
	}

	checkArg(args) {
		return true;
	}

	commitArgs() {
		for (var arg of Object.values(this.m_args.m_A_args)) if (!this.commitArg(arg)) return false;

		return this.commitArgsAfter();
	}

	commitArgsAfter() {
		return true;
	}

	commitArg(args) {
		switch (args.key) {
			case "m":
				this.m_manualflag = args.value;
				break;

			case "d":
				this.m_debugflag = args.value;
				break;

			case "l":
				this.m_logpath = args.value;
				break;

			case "k":
				this.m_lockflag = args.value;
				break;

			case "o":
				if (0 == args.value.length) {
					this.m_checktime = false;
				} else {
					this.m_checktime = true;
					this.m_opentime.m_A_time = Array();
					if (!this.m_opentime.insertAll(args.value)) return false;
				}

				break;

			case "O":
				this.m_checktime = true;
				this.m_opentime.m_A_time = Array();
				if (!this.m_opentime.insertSpace(args.value)) return false;
				break;

			case "h":
				var A_usage = this.getUsage();
				var maxlength = 0;

				for (var usage of Object.values(A_usage)) {
					var len = usage[0].length;
					if (maxlength < len) maxlength = len;
				}

				++maxlength;
				var body = "";

				for (var usage of Object.values(A_usage)) {
					var line = "\t" + usage[0];

					while (line.length < maxlength) line += " ";

					line += usage[1];
					body += line + "\n";
				}

				console.log(body);
				throw die(0);
		}

		return true;
	}

	getUsage() {
		return [["-m={0|1}", "\u5B9F\u884C\u524D\u306B\u554F\u3044\u5408\u308F\u305B(1)"], ["-l=path", "\u30ED\u30B0\u51FA\u529B\u30D1\u30B9(\u53F3\u7AEF\u306F\u533A\u5207\u308A\u6587\u5B57/\u5B9F\u5728\u3059\u308B\u4E8B"], ["-k={0|1|2}", "\u30ED\u30C3\u30AF\u7121\u3057/\u81EA\u5206\u30ED\u30C3\u30AF/\u5168\u90E8\u30ED\u30C3\u30AF(1)"], ["-o=hhmm,hhmm,hhmm,hhmm", "\u52D5\u4F5C\u8A31\u53EF\u6642\u523B(\u958B\u59CB,\u7D42\u4E86...)"], ["-O=hhmm", "\u5B9F\u884C\u53EF\u80FD\u6642\u5206"], ["-h", "\u3053\u306E\u30D8\u30EB\u30D7\u3092\u8868\u793A\u3057\u3066\u7D42\u4E86"]];
	}

	getManual() {
		var rval = "";
		if (this.m_debugflag) rval += "\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9\n";
		rval += "\u30ED\u30B0\u4FDD\u5B58\u5148" + this.m_logpath + "\n";

		switch (this.m_lockflag) {
			case 0:
				rval += "\u30ED\u30C3\u30AF\u5236\u5FA1\u7121\u3057\n";
				break;

			case 1:
				rval += "\u30ED\u30C3\u30AF\u5236\u5FA1(\u81EA\u30D7\u30ED\u30BB\u30B9\u306E\u307F)\n";
				break;

			case 2:
				rval += "\u30ED\u30C3\u30AF\u5236\u5FA1(\u5168\u30D7\u30ED\u30BB\u30B9\u5BFE\u8C61)\n";
				break;
		}

		rval += "\u52D5\u4F5C\u8A31\u53EF\u6642\u523B";

		if (this.m_checktime) {
			for (var pair of Object.values(this.m_opentime.m_A_time)) rval += "/" + pair[0] + "-" + pair[1];
		} else rval += "\u305B\u305A";

		rval += "\n";
		return rval;
	}

	init() {
		this.m_listener_process = new ProcessLog();
		if (!this.m_listener_process.setPath(this.m_listener, this.m_logpath, this.m_procname + date("YmdHis") + "/")) return false;
		this.m_curpath = this.m_listener_process.m_path;
		this.m_listener_error.putListener(this.m_listener_process.m_err);
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	execute() {
		if (!this.askManual()) return true;

		if (!this.isOpen()) {
			this.putOperator(G_SCRIPT_WARNING, "\u52D5\u4F5C\u53EF\u80FD\u6642\u9593\u5916");
			throw die(1);
		}

		if (!this.init()) return false;
		this.putError(G_SCRIPT_BEGIN, "\u5B9F\u884C\u958B\u59CB");
		var manual = this.getManual();
		manual = manual.split("\n");

		for (var line of Object.values(manual)) if (line.length) this.putError(G_SCRIPT_INFO, line);

		if (!this.lock(true)) return false;

		if (!this.begin()) {
			if (!this.lock(false)) return false;
			return false;
		}

		var status = this.do_execute();
		status &= this.end(status);
		status &= this.lock(false);
		this.putError(G_SCRIPT_END, "\u5B9F\u884C\u5B8C\u4E86");
		return status;
	}

	askManual() {
		if (!this.m_manualflag) return true;
		fwrite_conv(this.getManual());
		fwrite_conv("\u5B9F\u884C\u3092\u7D99\u7D9A\u3057\u307E\u3059\u304B?(N/y)\n");
		var buf = fgets(STDIN);
		buf = buf.substr(0, 1);

		if (strcmp("y", buf) && strcmp("Y", buf)) {
			fwrite_conv("\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\n");
			return false;
		}

		return true;
	}

	isOpen() {
		if (!this.m_checktime) return true;
		return this.m_opentime.isOpen();
	}

	begin() {
		return true;
	}

	do_execute() {
		return true;
	}

	end(status) {
		return true;
	}

	lock(is_lock) {
		if (!this.m_lockflag) return true;
		var pre = "batch";

		if (is_lock) {
			var unique_key = "_" + this.getUniqueKey();
			var command_name = this.m_db.escape(pre + "_" + this.m_procname + unique_key);
			this.m_db.begin();
			var sql = "insert into clamptask_tb(command,status,recdate)";
			sql += "values('" + command_name + "'";
			sql += ",1,'" + date("Y-m-d H:i:s") + "')";
			sql += ";";
			this.m_db.query(sql);
			sql = "select * from clamptask_tb";

			if (2 == this.m_lockflag) //全プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "%") + "'";
				} else //自プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "_" + this.m_procname) + "%'";
				}

			sql += " and status=1";
			sql += ";";
			var result = this.m_db.getHash(sql);
			var is_match = false;

			for (var H_line of Object.values(result)) {
				var command = H_line.command;
				var pos = strpos(command, unique_key);
				if (false === pos) continue;
				if (unique_key.length + pos == command.length) is_match = true;
			}

			if (1 != result.length) is_match = false;

			if (!is_match) {
				sql = "delete from clamptask_tb" + " where command='" + this.m_db.escape(command_name) + "'" + ";";
				this.m_db.query(sql);
				this.m_db.commit();
			}

			this.m_db.commit();

			if (!is_match) {
				var msg = "";

				for (var cnt = 0; cnt < result.length; ++cnt) {
					let _tmp_0 = result[cnt];

					for (var key in _tmp_0) {
						var value = _tmp_0[key];
						msg += `/${key}=${value}`;
					}
				}

				this.putError(G_SCRIPT_ERROR, `多重動作${msg}`);
				return false;
			}
		} else {
			this.m_db.begin();
			this.m_db.lock("clamptask_tb");
			sql = "delete from clamptask_tb";
			sql += " where command like '" + this.m_db.escape(pre + "_" + this.m_procname) + "%'";
			sql += ";";
			this.m_db.query(sql);
			this.m_db.commit();
		}

		return true;
	}

	beginDB() {
		this.m_db.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollback\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9");
		} else if (!status) this.m_db.rollback();else this.m_db.commit();

		return true;
	}

	lockWeb(O_db, key, needle = "lock%") {
		var unique_key = "_" + this.getUniqueKey();

		while (true) {
			{
				O_db.begin();
				var sql = "insert into clampweb_function_tb";
				sql += " (command,fixdate)";
				sql += " values(";
				sql += "'" + O_db.escape(key + unique_key) + "'";
				sql += ",'" + date("Y-m-d H:i:s") + "'";
				sql += ")";
				sql += ";";
				O_db.query(sql);
				sql = "select * from clampweb_function_tb";
				sql += " where command like '" + O_db.escape(needle) + "'";
				sql += ";";
				var result = O_db.getHash(sql);
				O_db.commit();
				var is_match = false;

				for (var H_line of Object.values(result)) {
					var command = H_line.command;
					var pos = strpos(command, unique_key);
					if (false === pos) continue;
					if (unique_key.length + pos == command.length) is_match = true;
				}

				if (1 != result.length) is_match = false;
				if (is_match) break;
			}
			sleep(60);
		}

		return true;
	}

	unlockWeb(O_db, needle = "lock%") {
		O_db.begin();
		O_db.lock("clampweb_function_tb");
		var sql = "delete from clampweb_function_tb";
		sql += " where command like '" + O_db.escape(needle) + "'";
		sql += ";";
		O_db.query(sql);
		O_db.commit();
		return true;
	}

	getUniqueKey() {
		var rval = rand() + mt_rand();
		if ("function" === typeof getmypid) rval += getmypid();
		var fp = fopen("/proc/self/stat", "r");

		if (false !== fp) {
			var c;

			while (ctype_digit(c = fgetc(fp))) rval += c;

			fclose(fp);
		}

		return rval;
	}

};

//動作可能時刻を過ぎたら、以後の顧客の処理を中止するか
//顧客ID
//処理しない顧客ID
//年
//月
//ｎヶ月前の処理を行う
//特定顧客でエラーが発生しても継続動作するか
//処理中の顧客ID(共通ログ出力専用)
//delflgがtrueの顧客を処理しないならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//動作可能時刻を過ぎたら、以後の顧客の処理を中止するか
//機能：現在のテーブルNoを返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：ARGVの読み込み終了後に実行される
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を開始する
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を終了する
//引数：顧客ID
//executePactidの実行結果
//返値：深刻なエラーが発生したらfalseを返す
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
class ProcessDefault extends ProcessBase {
	ProcessDefault(procname, logpath, opentime, ignorepact = false) //デフォルト値の設定
	{
		this.ProcessBase(procname, logpath, opentime);
		this.m_ignorepact = ignorepact;
		this.m_args.addSetting({
			p: {
				type: "int"
			},
			y: {
				type: "int"
			},
			Y: {
				type: "int"
			},
			r: {
				type: "int"
			},
			P: {
				type: "string"
			},
			t: {
				type: "string"
			}
		});
		this.m_year = date("Y");
		this.m_month = date("n");
		this.m_last_month = 0;
		this.m_repeatflag = true;
		this.m_A_skippactid = Array();
		this.m_is_skip_delflg = true;
		this.m_pact_type = "a";
	}

	getTableNo() {
		return this.m_table_no.get(this.m_year, this.m_month);
	}

	checkArg(args) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "y":
				var src = args.value;

				if (6 != src.length) {
					this.putError(G_SCRIPT_ERROR, `起動年月不正${src}`);
					return false;
				}

				var yyyy = src.substr(0, 4);
				var mm = src.substr(4, 2);

				if (mm < 1 || 12 < mm) {
					this.putError(G_SCRIPT_ERROR, `起動月不正${src}`);
					return false;
				}

				if (yyyy < 2000 || 2100 < yyyy) {
					this.putError(G_SCRIPT_ERROR, `起動年不正${src}`);
					return false;
				}

				break;

			case "P":
				var result = args.value.split(",");

				for (var item of Object.values(result)) {
					if (!ctype_digit(item)) {
						this.putError(G_SCRIPT_ERROR, "\u30B9\u30AD\u30C3\u30D7\u9867\u5BA2ID\u4E0D\u6B63" + args.value);
						return false;
					}
				}

				break;

			case "t":
				if (!(-1 !== ["a", "m", "h"].indexOf(args.value))) {
					this.putError(G_SCRIPT_ERROR, "\u9867\u5BA2\u30BF\u30A4\u30D7\u4E0D\u6B63(\u4EE5\u4E0B\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068-t={a|m|h})");
					return false;
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!ProcessBase.commitArg(args)) return false;

		switch (args.key) {
			case "p":
				this.m_pactid = args.value;
				break;

			case "y":
				var src = args.value;
				this.m_year = 0 + src.substr(0, 4);
				this.m_month = 0 + src.substr(4, 2);
				break;

			case "Y":
				this.m_last_month = args.value;
				break;

			case "r":
				this.m_repeatflag = args.value;
				break;

			case "P":
				var result = args.value.split(",");

				for (var item of Object.values(result)) this.m_A_skippactid.push(item);

				break;

			case "t":
				this.m_pact_type = args.value;
				break;
		}

		return true;
	}

	commitArgsAfter() {
		for (var cnt = 0; cnt < this.m_last_month; ++cnt) {
			this.m_month = this.m_month - 1;

			if (0 == this.m_month) {
				this.m_month = 12;
				this.m_year = this.m_year - 1;
			}
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-p=pactid", "\u51E6\u7406\u5BFE\u8C61\u9867\u5BA2(\u5168\u9867\u5BA2)"]);
		rval.push(["-y=yyyymm", "\u51E6\u7406\u5BFE\u8C61\u5E74\u6708(\u73FE\u5728\u306E\u5E74\u6708)"]);
		rval.push(["-Y={0|1|2}", "n\u30F6\u6708\u524D\u306E\u51E6\u7406(\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u5C02\u7528)(0)"]);
		rval.push(["-r={0|1}", "\u7279\u5B9A\u9867\u5BA2\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u3066\u3082\u51E6\u7406\u7D99\u7D9A\u3059\u308B\u304B(1)"]);
		rval.push(["-t={a|m|h}", "\u9867\u5BA2\u30BF\u30A4\u30D7\u306E\u6307\u5B9A(all(a) \u30E2\u30FC\u30B7\u30E7\u30F3\u306E\u307F(m) \u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u306E\u307F(h))"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u9867\u5BA2";
		if (0 == this.m_pactid.length) rval += "\u5168\u90E8";else rval += this.m_pactid;
		rval += "\n";

		if (this.m_A_skippactid.length) {
			rval += "\u30B9\u30AD\u30C3\u30D7\u9867\u5BA2";

			for (var item of Object.values(this.m_A_skippactid)) rval += "," + item;

			rval += "\n";
		}

		switch (this.m_pact_type) {
			case "m":
				rval += "\u30E2\u30FC\u30B7\u30E7\u30F3\u30E6\u30FC\u30B6\u30FC\u306E\u307F\u5B9F\u884C\n";
				break;

			case "h":
				rval += "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u30E6\u30FC\u30B6\u30FC\u306E\u307F\u5B9F\u884C\n";
				break;
		}

		rval += "\u5E74\u6708" + this.m_year + "/" + this.m_month + "\n";
		if (0 < this.m_last_month) rval += this.m_last_month + "\u30F6\u6708\u524D\n";
		rval += "\u7279\u5B9A\u9867\u5BA2\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u305F\u5834\u5408";
		if (this.m_repeatflag) rval += "\u51E6\u7406\u7D99\u7D9A\u3059\u308B";else rval += "\u51E6\u7406\u7D99\u7D9A\u3057\u306A\u3044";
		rval += "\n";
		return rval;
	}

	do_execute() //実行すべき顧客IDリスト作成
	//顧客IDに対してループ
	{
		var A_pactid = Array();
		if (this.m_pactid.length) A_pactid = [this.m_pactid];else {
			var sql = "select pactid from pact_tb";
			sql += " where pactid!=0";
			if (this.m_is_skip_delflg) sql += " and delflg=false";

			if (0 < this.m_last_month) {
				sql += " and coalesce(type,'')='H'";
			}

			switch (this.m_pact_type) {
				case "h":
					sql += " and coalesce(type,'')='H'";
					break;

				case "m":
					sql += " and coalesce(type,'')='M'";
					break;
			}

			sql += " order by pactid";
			sql += ";";
			var result = this.m_db.getAll(sql);

			for (var line of Object.values(result)) A_pactid.push(line[0]);
		}
		var all_status = true;

		for (var pactid of Object.values(A_pactid)) //処理
		//ログを元に戻す
		{
			this.m_current_pactid = pactid;
			if (-1 !== this.m_A_skippactid.indexOf(pactid)) continue;

			if (this.m_ignorepact) {
				if (!this.isOpen()) break;
			}

			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, pactid + "_" + sprintf("%04d%02d", this.m_year, this.m_month) + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			if (!this.beginPactid(pactid)) return false;
			this.putError(G_SCRIPT_BEGIN, `顧客処理開始(${pactid})`);
			var status = this.executePactid(pactid, log.m_path);
			this.putError(G_SCRIPT_END, "\u9867\u5BA2\u51E6\u7406\u7D42\u4E86" + `(${pactid})` + (status ? "\u6B63\u5E38\u7D42\u4E86" : "\u7570\u5E38\u7D42\u4E86"));
			status &= this.endPactid(pactid, status);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status &= status;
			delete log;
			if (!this.m_repeatflag && !status) return status;
			this.m_current_pactid = 0;
		}

		return all_status;
	}

	beginPactid(pactid) {
		return this.beginDB();
	}

	executePactid(pactid, logpath) {
		return true;
	}

	endPactid(pactid, status) {
		return this.endDB(status);
	}

	getCurrentPactid() {
		return this.m_current_pactid;
	}

	getCurrentMonth() {
		return this.m_year + "/" + this.m_month;
	}

};

//処理するキャリアID
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
class ProcessCarid extends ProcessDefault {
	ProcessCarid(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);
		this.m_args.addSetting({
			c: {
				type: "int"
			}
		});
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "c":
				this.m_carid = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-c=carid", "\u51E6\u7406\u5BFE\u8C61\u30AD\u30E3\u30EA\u30A2ID(\u5168\u30AD\u30E3\u30EA\u30A2)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u30AD\u30E3\u30EA\u30A2";
		if (this.m_carid.length) rval += this.m_carid;else rval += "\u3059\u3079\u3066";
		rval += "\n";
		return rval;
	}

};