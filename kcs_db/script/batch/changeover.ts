//===========================================================================
//機能：テーブル順送りプロセス
//
//作成：森原
//===========================================================================

import {ProcessDefault,ProcessLog} from "./lib/process_base";
import ChangeoverDB from "./lib/changeover_db";
import { DB_FETCHMODE_ASSOC } from "../../class/MtDBUtil";
import {ScriptCommand} from "../../script/batch/lib/script_command";
import { G_USE_PG_POOL_DSN, PGPOOL_NO_INSERT_LOCK } from "../../conf/batch_setting";
import { G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING } from "./lib/script_log";
import { G_CLIENT_DB, G_PHP } from "./lib/script_common";
import { G_LOG, G_LOG_ADMIN_DOCOMO_DB, sprintf } from "../../db_define/define";

const G_PROCNAME_CHANGEOVER = "changeover";
const G_OPENTIME_CHANGEOVER = "0000,2400";
export default class ProcessChangeover extends ProcessDefault {
	m_is_fork: boolean;
	m_is_exec_copy: boolean;
	m_is_exec_other: boolean;
	m_is_copy_once: number;
	m_is_save: boolean;
	m_dsn_pool: string;
	m_is_fail: boolean;
	m_is_ready_copy: boolean;
	constructor(procname: string, logpath: string, opentime: string) //delflgがtrueでも処理する
	{
		super(procname, logpath, opentime);
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
		return "テーブル順送りプロセス";
	}

	commitArg(args: any) {
		if (!super.commitArg(args)) return false;

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
		var rval = super.getUsage();
		rval.push(["-x={0|1}", "子プロセスを生成するか(1)"]);
		rval.push(["-e={0|1}", "テーブルの削除とコピーを行うか(1)"]);
		rval.push(["-E={0|1}", "テーブルの削除とコピー以外の後処理を行うか(1)"]);
		rval.push(["-X={0|1|2}", "削除とコピーを全社一括で" + "{{行わない|行う|行い、それ以外の処理を行わない}(1)"]);
		rval.push(["-s={0|1}", "削除前にファイルに残すか(1)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "子プロセスを生成";
		rval += this.m_is_fork ? "する" : "しない";
		rval += "\n";
		rval += "テーブルの削除とコピーを" + (this.m_is_exec_copy ? "行う" : "行わない") + "\n";
		rval += "テーブルの削除とコピー以降の後処理を" + (this.m_is_exec_other ? "行う" : "行わない") + "\n";
		rval += "テーブルの削除とコピーを全社一括で";

		switch (this.m_is_copy_once) {
			case 0:
				rval += "可能でも行わない";
				break;

			case 1:
				rval += "可能なら行う";
				break;

			default:
				rval += "可能なら行い、それ以外の処理を行わない";
				break;
		}

		rval += "\n";
		rval += (this.m_is_save ? "テーブル保存" : "テーブル保存せず") + "\n";
		return rval;
	}

	async do_execute() //pg_poolを利用しているなら、copy文専用の接続先DSNを決定する
	//全社一括処理が可能なら、処理する
	{
		var status = true;

		if ("undefined" !== typeof G_USE_PG_POOL_DSN && G_USE_PG_POOL_DSN) //生きているクラスタを見つけるためにpool_statusを読み出す
			//pool_statusが存在しない場合に備えて、別個のトランザクション
			{
				this.putError(G_SCRIPT_INFO, "pg_pool利用中");
				if (!this.beginDB()) return false;
				var result: any = await this.m_db.query("show pool_status;", false);

				// if (DB.isError(result)) {
				if(result == null){
					this.putError(G_SCRIPT_WARNING, "設定ではpg_poolを使用しているが、" + "pool_statusが存在しない/" + "通常の接続先にCOPY文を実行する");
				} else //DBから取得した内容をハッシュに取得する
					{
						var A_line = Array();

						for (const line of result ) A_line.push(line);
						result.free();
						var server_status = "";
						var backend_status0 = "";
						var backend_status1 = "";

						for (var H_line of A_line) {
							if (!(undefined !== H_line.item) || !(undefined !== H_line.value)) continue;
							if (!H_line.item.localeCompare("server_status")) server_status = H_line.value;
							if (!H_line.item.localeCompare("backend status0")) backend_status0 = H_line.value;
							if (!H_line.item.localeCompare("backend status1")) backend_status1 = H_line.value;
						}

						var is_master = false;
						var is_secondary = false;
						var is_bad = false;
						var is_empty = false;

						if (server_status.length) //pgpool ver1の書式が有効である
							//server_statusを空白で分割し、生きているクラスタを捜す
							{
								var A_status = server_status.split(" ");
								if (!(undefined !== A_status[3])) is_bad = true;else {
									// if (!strcasecmp("up", A_status[3])) is_master = true;else if (strcasecmp("down", A_status[3])) is_bad = true;
									if (!(A_status[3].toUpperCase() === ("up").toUpperCase())) is_master = true;else if (A_status[3].toUpperCase() === ("down").toUpperCase()) is_bad = true;
								}
								if (!(undefined !== A_status[7])) is_bad = true;else {
									if (!(A_status[7].toUpperCase() === ("up").toUpperCase())) is_secondary = true;else if (A_status[7].toUpperCase() === ("down").toUpperCase()) is_bad = true;
								}
							} else if (backend_status0.length && backend_status1.length) //pgpool ver2の書式が有効である
							{
								if (!backend_status0.localeCompare("2")) is_master = true;
								if (!backend_status1.localeCompare("2")) is_secondary = true;
							} else is_empty = true;

						if (is_empty) this.putError(G_SCRIPT_WARNING, "show pool_statusにserver_statusと" + "backend_statusの両方が存在しない/" + "通常の接続先にCOPY文を実行する");else if (is_bad) this.putError(G_SCRIPT_WARNING, "show pool_statusのserver_statusかbackend_statusの" + "書式が変更された/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/" + "通常の接続先にCOPY文を実行する");else {
							if (is_master) {
								this.m_dsn_pool = global.G_dsn_pg_pool_master;
								this.putError(G_SCRIPT_INFO, "show pool_statusのserver_statusかbackend_statusで" + "masterを接続先に選んだ/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/");
							} else if (is_secondary) {
								this.m_dsn_pool = global.G_dsn_pg_pool_secondary;
								this.putError(G_SCRIPT_INFO, "show pool_statusのserver_statusかbackend_statusで" + "secondaryを接続先に選んだ/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/");
							} else this.putError(G_SCRIPT_WARNING, "show pool_statusのserver_statusかbackend_statusで" + "両方ダウンしている/" + server_status + "/" + backend_status0 + "/" + backend_status1 + "/" + "通常の接続先にCOPY文を実行する");
						}
					}

				if (!this.endDB(false)) return false;
			} else {
			this.putError(G_SCRIPT_INFO, "pg_poolを利用していない");
		}

		if (!this.m_pactid.length && 0 != this.m_is_copy_once) //顧客用のログを準備する
			//実際の処理を行う
			//ログを元に戻す
			//全社一括以外の処理を行わないなら処理を終了する
			{
				status = true;
				this.m_current_pactid = 0;
				var log: any = new ProcessLog(0);
				log.setPath(this.m_listener, String(this.m_curpath), 0 + "_" + sprintf("%04d%02d", String(this.m_year), String(this.m_month)) + "/");
				this.m_listener.m_A_listener = Array();
				this.m_listener.putListener(log);
				this.m_listener.putListener(this.m_listener_error);
				if (!this.beginDB()) return false;
				this.putError(G_SCRIPT_BEGIN, "全社一括処理開始");
				status = this.executeOnce(log.m_path);
				this.putError(G_SCRIPT_END, "全社一括処理終了" + (status ? "正常終了" : "異常終了"));
				status = status && this.endDB(status);
				this.m_listener.m_A_listener = Array();
				this.m_listener.putListener(this.m_listener_process);
				this.m_listener.putListener(this.m_listener_error);
				log = undefined;

				if (2 <= this.m_is_copy_once) {
					this.putError(G_SCRIPT_INFO, "全社一括以外の処理は行わない");
					return status;
				}
			}

		return status && super.do_execute();
	}

	executeOnce(logpath: any) {
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
					value: sprintf("%04d%02d", String(this.m_year), String(this.m_month))
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
				var proc:any = new ScriptCommand(this.m_listener, false);
				var status = proc.execute(G_PHP + " changeover.php", arg, Array());
				proc = undefined;
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

	async executePactid(pactid: number, logpath: any) {
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
					value: sprintf("%04d%02d", String(this.m_year), String(this.m_month))
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
				var proc:any = new ScriptCommand(this.m_listener, false);
				var status = proc.execute(G_PHP + " changeover.php", arg, Array());
				proc = undefined;

				if (!status) {
					this.m_is_fail = true;
					var sql = PGPOOL_NO_INSERT_LOCK + "insert into changeover_error_tb" + "(pactid,year,month,recdate)" + "values" + "(" + pactid + "," + this.m_year + "," + this.m_month + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ");";
					this.putError(G_SCRIPT_SQL, sql);
					var result:any = await this.m_db.query(sql, false);

					if (!result) {
						if (Array.isArray([result, "db_error"])) sql = result.userinfo;
						this.putError(G_SCRIPT_WARNING, "SQL実行失敗:" + sql);
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

// checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessChangeover(G_PROCNAME_CHANGEOVER, log, G_OPENTIME_CHANGEOVER);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
if (proc.m_is_fork && !proc.m_is_fail) proc.putError(G_SCRIPT_WARNING, "正常終了");
throw process.exit(0);
