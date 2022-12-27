//===========================================================================
//機能：テーブル順送りプロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：テーブル順送りプロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/changeover_db.php");

const G_PROCNAME_CHANGEOVER = "changeover";
const G_OPENTIME_CHANGEOVER = "0000,2400";

//子プロセスを作るならtrue
//テーブルの削除とコピーを行うならtrue
//その他の処理を行うならtrue
//テーブルの削除とコピーを全社一括で行わない/行う/のみ
//削除前のファイルを残すならtrue
//pg_pool利用時のプライマリかセカンダリ
//子プロセスでエラーが発生したらtrue
//全社一括コピーが成功していればtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：全社一括のコピーを行う
//引数：作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessChangeover extends ProcessDefault {
	ProcessChangeover(procname, logpath, opentime) //delflgがtrueでも処理する
	//デフォルト動作では子プロセスを作る
	//デフォルト動作ではテーブルの削除とコピーと、後処理の両方を行う
	//デフォルト動作では全社一括コピーを行う
	//デフォルトでファイルを残す
	//起動時オプション
	{
		this.ProcessDefault(procname, logpath, opentime);
		this.m_is_skip_delflg = false;
		this.m_is_fork = true;
		this.m_is_exec_copy = true;
		this.m_is_exec_other = true;
		this.m_is_copy_once = 1;
		this.m_is_save = true;
		this.m_args.addSetting({
			x: {
				type: "int"
			},
			e: {
				type: "int"
			},
			E: {
				type: "int"
			},
			X: {
				type: "int"
			},
			s: {
				type: "int"
			}
		});
		this.m_dsn_pool = "";
		this.m_is_fail = false;
		this.m_is_ready_copy = false;
	}

	getProcname() {
		return "\u30C6\u30FC\u30D6\u30EB\u9806\u9001\u308A\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "x":
				this.m_is_fork = args.value;
				break;

			case "e":
				this.m_is_exec_copy = args.value;
				break;

			case "E":
				this.m_is_exec_other = args.value;
				break;

			case "X":
				this.m_is_copy_once = args.value;
				break;

			case "s":
				this.m_is_save = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-x={0|1}", "\u5B50\u30D7\u30ED\u30BB\u30B9\u3092\u751F\u6210\u3059\u308B\u304B(1)"]);
		rval.push(["-e={0|1}", "\u30C6\u30FC\u30D6\u30EB\u306E\u524A\u9664\u3068\u30B3\u30D4\u30FC\u3092\u884C\u3046\u304B(1)"]);
		rval.push(["-E={0|1}", "\u30C6\u30FC\u30D6\u30EB\u306E\u524A\u9664\u3068\u30B3\u30D4\u30FC\u4EE5\u5916\u306E\u5F8C\u51E6\u7406\u3092\u884C\u3046\u304B(1)"]);
		rval.push(["-X={0|1|2}", "\u524A\u9664\u3068\u30B3\u30D4\u30FC\u3092\u5168\u793E\u4E00\u62EC\u3067" + "{\u884C\u308F\u306A\u3044|\u884C\u3046|\u884C\u3044\u3001\u305D\u308C\u4EE5\u5916\u306E\u51E6\u7406\u3092\u884C\u308F\u306A\u3044}(1)"]);
		rval.push(["-s={0|1}", "\u524A\u9664\u524D\u306B\u30D5\u30A1\u30A4\u30EB\u306B\u6B8B\u3059\u304B(1)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u5B50\u30D7\u30ED\u30BB\u30B9\u3092\u751F\u6210";
		rval += this.m_is_fork ? "\u3059\u308B" : "\u3057\u306A\u3044";
		rval += "\n";
		rval += "\u30C6\u30FC\u30D6\u30EB\u306E\u524A\u9664\u3068\u30B3\u30D4\u30FC\u3092" + (this.m_is_exec_copy ? "\u884C\u3046" : "\u884C\u308F\u306A\u3044") + "\n";
		rval += "\u30C6\u30FC\u30D6\u30EB\u306E\u524A\u9664\u3068\u30B3\u30D4\u30FC\u4EE5\u964D\u306E\u5F8C\u51E6\u7406\u3092" + (this.m_is_exec_other ? "\u884C\u3046" : "\u884C\u308F\u306A\u3044") + "\n";
		rval += "\u30C6\u30FC\u30D6\u30EB\u306E\u524A\u9664\u3068\u30B3\u30D4\u30FC\u3092\u5168\u793E\u4E00\u62EC\u3067";

		switch (this.m_is_copy_once) {
			case 0:
				rval += "\u53EF\u80FD\u3067\u3082\u884C\u308F\u306A\u3044";
				break;

			case 1:
				rval += "\u53EF\u80FD\u306A\u3089\u884C\u3046";
				break;

			default:
				rval += "\u53EF\u80FD\u306A\u3089\u884C\u3044\u3001\u305D\u308C\u4EE5\u5916\u306E\u51E6\u7406\u3092\u884C\u308F\u306A\u3044";
				break;
		}

		rval += "\n";
		rval += (this.m_is_save ? "\u30C6\u30FC\u30D6\u30EB\u4FDD\u5B58" : "\u30C6\u30FC\u30D6\u30EB\u4FDD\u5B58\u305B\u305A") + "\n";
		return rval;
	}

	do_execute() //pg_poolを利用しているなら、copy文専用の接続先DSNを決定する
	//全社一括処理が可能なら、処理する
	{
		var status = true;

		if ("undefined" !== typeof G_USE_PG_POOL_DSN && G_USE_PG_POOL_DSN) //生きているクラスタを見つけるためにpool_statusを読み出す
			//pool_statusが存在しない場合に備えて、別個のトランザクション
			{
				this.putError(G_SCRIPT_INFO, "pg_pool\u5229\u7528\u4E2D");
				if (!this.beginDB()) return false;
				var result = this.m_db.query("show pool_status;", false);

				if (DB.isError(result)) {
					this.putError(G_SCRIPT_WARNING, "\u8A2D\u5B9A\u3067\u306Fpg_pool\u3092\u4F7F\u7528\u3057\u3066\u3044\u308B\u304C\u3001" + "pool_status\u304C\u5B58\u5728\u3057\u306A\u3044/" + "\u901A\u5E38\u306E\u63A5\u7D9A\u5148\u306BCOPY\u6587\u3092\u5B9F\u884C\u3059\u308B");
				} else //DBから取得した内容をハッシュに取得する
					//server_statusかbackend_statusを取得する
					//masterが接続可能ならtrue
					//secondaryが接続可能ならtrue
					//server_statusの書式が変更になったらtrue
					//ver1でもver2でもなければtrue
					{
						var line;
						var A_line = Array();

						while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) A_line.push(line);

						result.free();
						var server_status = "";
						var backend_status0 = "";
						var backend_status1 = "";

						for (var H_line of Object.values(A_line)) {
							if (!(undefined !== H_line.item) || !(undefined !== H_line.value)) continue;
							if (!strcmp(H_line.item, "server_status")) server_status = H_line.value;
							if (!strcmp(H_line.item, "backend status0")) backend_status0 = H_line.value;
							if (!strcmp(H_line.item, "backend status1")) backend_status1 = H_line.value;
						}

						var is_master = false;
						var is_secondary = false;
						var is_bad = false;
						var is_empty = false;

						if (server_status.length) //pgpool ver1の書式が有効である
							//server_statusを空白で分割し、生きているクラスタを捜す
							{
								var A_status = split(" ", server_status);
								if (!(undefined !== A_status[3])) is_bad = true;else {
									if (!strcasecmp("up", A_status[3])) is_master = true;else if (strcasecmp("down", A_status[3])) is_bad = true;
								}
								if (!(undefined !== A_status[7])) is_bad = true;else {
									if (!strcasecmp("up", A_status[7])) is_secondary = true;else if (strcasecmp("down", A_status[7])) is_bad = true;
								}
							} else if (backend_status0.length && backend_status1.length) //pgpool ver2の書式が有効である
							{
								if (!strcmp(backend_status0, "2")) is_master = true;
								if (!strcmp(backend_status1, "2")) is_secondary = true;
							} else is_empty = true;

						if (is_empty) this.putError(G_SCRIPT_WARNING, "show pool_status\u306Bserver_status\u3068" + "backend_status\u306E\u4E21\u65B9\u304C\u5B58\u5728\u3057\u306A\u3044/" + "\u901A\u5E38\u306E\u63A5\u7D9A\u5148\u306BCOPY\u6587\u3092\u5B9F\u884C\u3059\u308B");else if (is_bad) this.putError(G_SCRIPT_WARNING, "show pool_status\u306Eserver_status\u304Bbackend_status\u306E" + "\u66F8\u5F0F\u304C\u5909\u66F4\u3055\u308C\u305F/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/" + "\u901A\u5E38\u306E\u63A5\u7D9A\u5148\u306BCOPY\u6587\u3092\u5B9F\u884C\u3059\u308B");else {
							if (is_master) {
								this.m_dsn_pool = GLOBALS.G_dsn_pg_pool_master;
								this.putError(G_SCRIPT_INFO, "show pool_status\u306Eserver_status\u304Bbackend_status\u3067" + "master\u3092\u63A5\u7D9A\u5148\u306B\u9078\u3093\u3060/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/");
							} else if (is_secondary) {
								this.m_dsn_pool = GLOBALS.G_dsn_pg_pool_secondary;
								this.putError(G_SCRIPT_INFO, "show pool_status\u306Eserver_status\u304Bbackend_status\u3067" + "secondary\u3092\u63A5\u7D9A\u5148\u306B\u9078\u3093\u3060/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/");
							} else this.putError(G_SCRIPT_WARNING, "show pool_status\u306Eserver_status\u304Bbackend_status\u3067" + "\u4E21\u65B9\u30C0\u30A6\u30F3\u3057\u3066\u3044\u308B/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/" + "\u901A\u5E38\u306E\u63A5\u7D9A\u5148\u306BCOPY\u6587\u3092\u5B9F\u884C\u3059\u308B");
						}
					}

				if (!this.endDB(false)) return false;
			} else {
			this.putError(G_SCRIPT_INFO, "pg_pool\u3092\u5229\u7528\u3057\u3066\u3044\u306A\u3044");
		}

		if (!this.m_pactid.length && 0 != this.m_is_copy_once) //顧客用のログを準備する
			//実際の処理を行う
			//ログを元に戻す
			//全社一括以外の処理を行わないなら処理を終了する
			{
				status = true;
				this.m_current_pactid = 0;
				var log = new ProcessLog();
				log.setPath(this.m_listener, this.m_curpath, 0 + "_" + sprintf("%04d%02d", this.m_year, this.m_month) + "/");
				this.m_listener.m_A_listener = Array();
				this.m_listener.putListener(log);
				this.m_listener.putListener(this.m_listener_error);
				if (!this.beginDB()) return false;
				this.putError(G_SCRIPT_BEGIN, "\u5168\u793E\u4E00\u62EC\u51E6\u7406\u958B\u59CB");
				status = this.executeOnce(log.m_path);
				this.putError(G_SCRIPT_END, "\u5168\u793E\u4E00\u62EC\u51E6\u7406\u7D42\u4E86" + (status ? "\u6B63\u5E38\u7D42\u4E86" : "\u7570\u5E38\u7D42\u4E86"));
				status &= this.endDB(status);
				this.m_listener.m_A_listener = Array();
				this.m_listener.putListener(this.m_listener_process);
				this.m_listener.putListener(this.m_listener_error);
				delete log;

				if (2 <= this.m_is_copy_once) {
					this.putError(G_SCRIPT_INFO, "\u5168\u793E\u4E00\u62EC\u4EE5\u5916\u306E\u51E6\u7406\u306F\u884C\u308F\u306A\u3044");
					return status;
				}
			}

		return status && ProcessDefault.do_execute();
	}

	executeOnce(logpath) {
		if (this.m_is_fork) //子プロセスを生成する
			//子プロセスでは子プロセスは生成しない
			//子プロセス実行
			//正常終了した場合のみ、コピー実行済みフラグをtrueにする
			{
				var arg = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: logpath
				}, {
					key: "k",
					value: 0
				}, {
					key: "y",
					value: sprintf("%04d%02d", this.m_year, this.m_month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}, {
					key: "x",
					value: 0
				}, {
					key: "e",
					value: this.m_is_exec_copy ? 1 : 0
				}, {
					key: "E",
					value: 0
				}, {
					key: "X",
					value: 2
				}, {
					key: "s",
					value: this.m_is_save ? 1 : 0
				}];
				var proc = new ScriptCommand(this.m_listener, false);
				var status = proc.execute(G_PHP + " changeover.php", arg, Array());
				delete proc;
				if (status) this.m_is_ready_copy = true;
			} else //テーブルの削除とコピーを全社一括で処理する
			{
				var change = new ChangeoverDB(this.m_listener, this.m_db, this.m_table_no, logpath, this.m_is_save, this.m_is_exec_copy, false, this.m_dsn_pool);
				if (!change.begin(0, this.m_year, this.m_month)) return false;
				if (!change.execute(undefined, logpath)) return false;
				if (!change.end()) return false;
				this.m_is_ready_copy = true;
			}

		return true;
	}

	executePactid(pactid, logpath) {
		if (this.m_is_fork) //子プロセスを生成する
			//全社一括コピーが終わっていれば、コピー実行フラグを落とす
			//子プロセスでは子プロセスは生成しない
			//子プロセス実行
			{
				var is_exec_copy = this.m_is_exec_copy;
				if (this.m_is_ready_copy) is_exec_copy = false;
				var arg = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: logpath
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
					value: sprintf("%04d%02d", this.m_year, this.m_month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}, {
					key: "x",
					value: 0
				}, {
					key: "e",
					value: is_exec_copy ? 1 : 0
				}, {
					key: "E",
					value: this.m_is_exec_other ? 1 : 0
				}, {
					key: "X",
					value: 0
				}, {
					key: "s",
					value: this.m_is_save ? 1 : 0
				}];
				var proc = new ScriptCommand(this.m_listener, false);
				var status = proc.execute(G_PHP + " changeover.php", arg, Array());
				delete proc;

				if (!status) {
					this.m_is_fail = true;
					var sql = PGPOOL_NO_INSERT_LOCK + "insert into changeover_error_tb" + "(pactid,year,month,recdate)" + "values" + "(" + pactid + "," + this.m_year + "," + this.m_month + ",'" + date("Y-m-d H:i:s") + "'" + ");";
					this.putError(G_SCRIPT_SQL, sql);
					var result = this.m_db.query(sql, false);

					if (DB.isError(result)) {
						if (is_a(result, "db_error")) sql = result.userinfo;
						this.putError(G_SCRIPT_WARNING, "SQL\u5B9F\u884C\u5931\u6557:" + sql);
					}
				}
			} else //全社一括コピーが終わっていれば、コピー実行フラグを落とす
			{
				is_exec_copy = this.m_is_exec_copy;
				if (this.m_is_ready_copy) is_exec_copy = false;
				var change = new ChangeoverDB(this.m_listener, this.m_db, this.m_table_no, logpath, this.m_is_save, is_exec_copy, this.m_is_exec_other, this.m_dsn_pool);
				if (!change.begin(pactid, this.m_year, this.m_month)) return false;
				if (!change.execute(undefined, logpath)) return false;
				if (!change.end()) return false;
			}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessChangeover(G_PROCNAME_CHANGEOVER, log, G_OPENTIME_CHANGEOVER);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
if (proc.m_is_fork && !proc.m_is_fail) proc.putError(G_SCRIPT_WARNING, "\u6B63\u5E38\u7D42\u4E86");
throw die(0);