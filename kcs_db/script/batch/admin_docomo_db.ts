//===========================================================================
//機能：DB側プロセス管理プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//一時停止時の待機秒数
//この権限があればV3型シミュレーションを行う
//---------------------------------------------------------------------------
//機能：DB側プロセス管理プロセス(ドコモ専用)
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
import { G_CLAMP_DOCOMO_FIN, G_LOG, G_LOG_ADMIN_DOCOMO_DB, sprintf } from "../../db_define/define";
import { ProcessDefault, ProcessLog } from "./lib/process_base";
import { G_CARRIER_DOCOMO, G_CLAMP_DOCOMO_BILL_TYPE, G_CLAMP_DOCOMO_COMM_TYPE, G_CLAMP_DOCOMO_INFO_TYPE, G_CLAMP_DOCOMO_TEL_TYPE, G_CLIENT_DB, G_DOCOMO_ALERT_CSV, G_PHP } from "./lib/script_common";
import { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_DEBUG, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "./lib/script_log";
import { setTimeout } from "timers/promises";
import { G_CLAMP_ENV } from "../../conf/batch_setting";
import * as fs from "fs";
import { execSync } from "child_process";
import { ScriptCommand } from "./lib/script_command";
// require("lib/process_base.php");

const G_PROCNAME_ADMIN_DOCOMO_DB = "admin_docomo_db";
const G_OPENTIME_ADMIN_DOCOMO_DB = "0000,2400";
const SLEEP_SEC = 60;
const AUTH_V3_SIM = 120;

class ProcessAdminDocomoDB extends ProcessDefault {
	m_db_temp: ScriptDB;
	m_forceflag: boolean;
	m_clearflag: boolean;
	m_mode: string[];
	m_restore_error: boolean;
	m_stop_mail: boolean;
	m_waitflag: boolean;
	m_A_pactid_hotline: any[];
	m_oneshot: boolean;
	m_is_compress_log: boolean;
	m_csv_name: any;

	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);

// 2022cvt_022
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
			// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
				this.m_db_temp = new ScriptDB(this.m_listener, global.G_dsn_temp);
			} else this.m_db_temp = this.m_db;
		this.m_forceflag = false;
		this.m_clearflag = false;
		this.m_mode = ["i", "I", "c", "C", "t", "T"];
		this.m_restore_error = true;
		this.m_stop_mail = true;
		this.m_waitflag = false;
		this.m_A_pactid_hotline = Array();
		this.m_oneshot = true;
		this.m_is_compress_log = true;
		this.init();
	}

	async ini() {
		// 2022cvt_022

			this.m_args.addSetting({
				f: {
		// 2022cvt_016
					type: "int"
				},
				e: {
		// 2022cvt_016
					type: "int"
				},
				i: {
		// 2022cvt_016
					type: "string"
				},
				R: {
		// 2022cvt_016
					type: "int"
				},
				C: {
		// 2022cvt_016
					type: "string"
				},
				E: {
		// 2022cvt_016
					type: "int"
				},
				x: {
		// 2022cvt_016
					type: "int"
				},
				X: {
		// 2022cvt_016
					type: "int"
				},
				G: {
		// 2022cvt_016
					type: "int"
				}
			});
		// 2022cvt_016
		// 2022cvt_015
			var sql = "select pactid from pact_tb where type='H' order by pactid;";
		// 2022cvt_015
			var result = await this.m_db.getAll(sql);

// 2022cvt_015
		for (var A_line of result) {
			this.m_A_pactid_hotline.push(A_line[0]);
		}

		this.m_oneshot = true;
		this.m_is_compress_log = true;
	}

	getProcname() {
		return "DB側プロセス管理プロセス(ドコモ専用)";
	}

	commitArg(args: { [x: string]: any; key?: any; value?: any; }) {
		if (!this.commitArg(args)) return false;

		switch (args.key) {
			case "f":
				this.m_forceflag = args.value;
				break;

			case "e":
				this.m_clearflag = args.value;
				break;

			case "i":
// 2022cvt_015
				var remain = args.value;
				this.m_mode = Array();

				while (remain.length) {
// 2022cvt_015
					var c = remain.substring(0, 1);
					remain = remain.substring(1);

					switch (c) {
						case "i":
						case "I":
						case "c":
						case "C":
						case "t":
						case "T":
						case "s":
						case "S":
							if (!(-1 !== this.m_mode.indexOf(c))) this.m_mode.push(c);
							break;

						case "r":
						case "R":
							break;

						case ",":
							break;

						default:
							this.putError(G_SCRIPT_WARNING, "不明な-iオプション" + c);
							return false;
					}
				}

				break;

			case "R":
				this.m_restore_error = args.value;
				break;

			case "C":
				this.m_csv_name = args.value;
				break;

			case "E":
				this.m_stop_mail = !args.value;
				break;

			case "x":
				this.m_waitflag = args.value;
				break;

			case "X":
				this.m_oneshot = args.value;
				break;

			case "G":
				this.m_is_compress_log = args.value;
				break;
		}

		return true;
	}

	commitArgsAfter() {
		if (!this.commitArgsAfter()) return false;

		if (0 == this.m_csv_name.length) {
// 2022cvt_020
			this.m_csv_name = G_DOCOMO_ALERT_CSV.replace("%s", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""));
			// this.m_csv_name = str_replace("%s", date("YmdHis"), G_DOCOMO_ALERT_CSV);
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		var rval = this.getUsage();
		rval.push(["-f={0|1}", "送付先コードのテストを省略するか(0)"]);
		rval.push(["-e={0|1}", "インポート前にDBからレコードを削除するか(0)"]);
		rval.push(["-i=i,c,t,T,s,S,r,R", "実行内容(iIcCtT)↓"]);
		rval.push(["-", "i:インポート(V2型顧客)"]);
		rval.push(["-", "I:インポート(ホットライン型顧客)"]);
		rval.push(["-", "c:計算等(V2型顧客)"]);
		rval.push(["-", "C:計算等(ホットライン型顧客)"]);
		rval.push(["-", "t:統計情報抽出(V2型顧客)"]);
		rval.push(["-", "T:統計情報抽出(ホットライン型顧客)"]);
		rval.push(["-", "s:シミュレーション(V2型顧客)"]);
		rval.push(["-", "S:シミュレーション(ホットライン型顧客)"]);
		rval.push(["-R={0|1}", "実行前にclampfileのエラーステータスを消すか(1)"]);
		rval.push(["-C=fname", "ドコモCSVファイル名"]);
		rval.push(["-E={0|1}", "ショップあてメールを送信するか(0)"]);
		rval.push(["-x={0|1}", "batchlog_tbにレコードができるのを待つか(0)"]);
		rval.push(["-X={0|1}", "実行可能時間の間は動作し続けるか(0)"]);
		rval.push(["-G={0|1}", "ログを圧縮するなら1(1)"]);
		return rval;
	}

	getManual() {
// 2022cvt_015
		var rval = this.getManual();
		rval += "送付先コードチェック";
		if (this.m_forceflag) rval += "せず";
		rval += "\n";
		rval += "インポート前にDBからレコードを削除";
		rval += this.m_clearflag ? "する" : "しない";
		rval += "\n";
		rval += "動作";
		if (-1 !== this.m_mode.indexOf("i")) rval += "/インポートV2";
		if (-1 !== this.m_mode.indexOf("I")) rval += "/インポートホット";
		if (-1 !== this.m_mode.indexOf("c")) rval += "/計算等V2";
		if (-1 !== this.m_mode.indexOf("C")) rval += "/計算等ホット";
		if (-1 !== this.m_mode.indexOf("t")) rval += "/統計V2";
		if (-1 !== this.m_mode.indexOf("T")) rval += "/統計ホット";
		if (-1 !== this.m_mode.indexOf("s")) rval += "/シミュV2";
		if (-1 !== this.m_mode.indexOf("S")) rval += "/シミュホット";
		rval += "\n";
		rval += "実行前にclampfileのエラーステータスをインポート完了に";
		rval += this.m_restore_error ? "戻す" : "戻さない";
		rval += "\n";
		rval += "ドコモCSVファイル名:" + this.m_csv_name + "\n";
		rval += "ショップあてメールを送信";
		rval += this.m_stop_mail ? "しない" : "する";
		rval += "\n";
		rval += "batchlog_tbのレコードを" + (this.m_waitflag ? "待つ" : "待たない") + "\n";
		if (this.m_oneshot) rval += "一回だけ実行\n";else rval += "実行可能時間の間は動作し続ける\n";
		rval += "ログを圧縮" + (this.m_is_compress_log ? "する" : "しない") + "\n";
		return rval;
	}

	beginDB() {
		this.m_db.begin();
// 2022cvt_022
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
			this.m_db_temp.begin();
		}
		// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp))
		return true;
	}

	endDB(status: boolean) {
		if (this.m_debugflag) {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db_temp.rollback();
			}
			// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp))
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db.rollback();
			}
			// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();

		} else {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db.commit();
			}
			// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.commit();
		}

		return true;
	}

	begin_log(pactid: string, year: string, month: string, log: ScriptLogBase) {
// 2022cvt_021
		log.setPath(this.m_listener, this.m_curpath, pactid + "_" + sprintf("%04d%02d", year, month) + "/");
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(log);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	end_log() {
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	async do_execute() {
		while (this.isOpen()) //V2とホットラインの二回実行する
		//一回だけ実行するなら終了する
		{
// 2022cvt_015
			for (var cnt = 0; cnt < 2; ++cnt) //インポートを行う
			{
// 2022cvt_015
				var req_hotline = 0 == cnt ? false : true;
				if (!this.do_import(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_calc(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_trend(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_recom(req_hotline)) return false;
				if (!this.isOpen()) return true;
			}

			if (this.m_oneshot) break;
			await setTimeout(SLEEP_SEC);
			// sleep(SLEEP_SEC);
		}

		return true;
	}

	async do_import(req_hotline: boolean) //ロック開始
// 2022cvt_016
	//clampweb_type_tbから、ダウンロードが完了している顧客IDを取り出す
	//clampweb_daily_tbから、存在する顧客IDを取り出す
	//ロック終了
	//月次と日次のpactidを合成する
	{
// 2022cvt_015
		var is_v2 = -1 !== this.m_mode.indexOf("i") && !req_hotline;
// 2022cvt_015
		var is_hotline = -1 !== this.m_mode.indexOf("I") && req_hotline;
		if (!is_v2 && !is_hotline) return true;
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
// 2022cvt_016
// 2022cvt_015
		var sql = "select pactid from clampweb_type_tb";
		sql += " where coalesce(is_ready,false)=true";
		sql += " and env=" + G_CLAMP_ENV;
		if (this.m_pactid.length) sql += " and pactid=" + this.m_pactid;
		if (this.m_A_skippactid.length) sql += " and pactid not in (" + this.m_A_skippactid.join(",") + ")";
		sql += " and pactid in (";
		sql += "select pactid from clampweb_index_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (is_hotline) sql += " and coalesce(is_hotline,false)=true";
		if (is_v2) sql += " and coalesce(is_hotline,false)=false";
		sql += ")";
		sql += " group by pactid";
		sql += " order by pactid";
		sql += ";";
// 2022cvt_015
		var A_result = await this.m_db_temp.getAll(sql);
// 2022cvt_015
		var A_monthly = Array();

// 2022cvt_015
		for (var A_line of A_result) A_monthly.push(A_line[0]);

		sql = "select pactid from clampweb_daily_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (this.m_pactid.length) sql += " and pactid=" + this.m_pactid;
		if (this.m_A_skippactid.length) sql += " and pactid not in (" + this.m_A_skippactid.join(",") + ")";
		sql += " and pactid in (";
		sql += "select pactid from clampweb_index_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (is_hotline) sql += " and coalesce(is_hotline,false)=true";
		if (is_v2) sql += " and coalesce(is_hotline,false)=false";
		sql += ")";
		sql += " group by pactid";
		sql += " order by pactid";
		sql += ";";
		A_result = await this.m_db_temp.getAll(sql);
// 2022cvt_015
		var A_daily = Array();

// 2022cvt_015
		for (var A_line of A_result) A_daily.push(A_line[0]);

		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
// 2022cvt_015
		var A_pactid = A_monthly;

// 2022cvt_015
		for (var pactid of A_daily) if (!(-1 !== A_pactid.indexOf(pactid))) A_pactid.push(pactid);

// 2022cvt_015
		for (var pactid of A_pactid) //実行可能時間を超えていれば終了
		{
			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "インポート実行中に実行可能時間オーバー" + pactid);
				break;
			}

			if (-1 !== A_monthly.indexOf(pactid)) if (!this.do_import_pactid(pactid)) return false;
			if (-1 !== A_daily.indexOf(pactid)) if (!this.do_import_daily(pactid)) return false;
		}

		return true;
	}

	do_import_daily(pactid: any) ////ロック開始
	//ロック終了
	{
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
// 2022cvt_015
		var status = this.do_import_daily_in_lock(pactid);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
		return status;
	}

	async do_import_daily_in_lock(pactid: string) //clampweb_daily_tbから、処理可能なファイル種別を取り出す
// 2022cvt_016
	//{fname,type...}[year][month][detailno][type]
	//インポートを行う
	{
// 2022cvt_016
// 2022cvt_015
		var sql = "select detailno,year,month,type,idx,fid";
		sql += " from clampweb_daily_tb";
		sql += " where pactid=" + pactid;
		sql += " and env=" + G_CLAMP_ENV;
// 2022cvt_016
		sql += " order by detailno,year,month,type,idx,fid";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db_temp.getHash(sql);
// 2022cvt_015
		var A_info = Array();

// 2022cvt_015
		for (var H_line of result) {
// 2022cvt_015
			var year = H_line.year;
			if (!(undefined !== A_info[year])) A_info[year] = Array();
// 2022cvt_015
			var month = H_line.month;
			if (!(undefined !== A_info[year][month])) A_info[year][month] = Array();
// 2022cvt_015
			var detailno = H_line.detailno;
			if (!(undefined !== A_info[year][month][detailno])) A_info[year][month][detailno] = Array();
// 2022cvt_016
// 2022cvt_015
			var type = H_line.type;
// 2022cvt_016
			if (!(undefined !== A_info[year][month][detailno][type])) A_info[year][month][detailno][type] = Array();
// 2022cvt_016
			A_info[year][month][detailno][type].push(H_line);
		}

// 2022cvt_015
		for (var year_2 in A_info) {
// 2022cvt_015
			var H_month = A_info[year_2];

// 2022cvt_015
			for (var month_2 in H_month) //ディレクトリを作成して、ログ出力先を切り替える
			//ディレクトリが無ければ作成する
			//ファイルをエクスポートして、削除する
			//該当のレコードをclampweb_daily_tbから削除する
			//ログを元に戻す
			{
// 2022cvt_015
				var H_details = H_month[month_2];
// 2022cvt_015
				var log = new ProcessLog(0);

				if (!this.begin_log(pactid, year, month, log)) {
					return false;
				}

// 2022cvt_015
				var path = G_CLAMP_DOCOMO_FIN;
// 2022cvt_020
				path = path.replace("/fin/", "/");
				// path = str_replace("/fin/", "/", path);
// 2022cvt_020
				path = path.replace("/docomo/", "/docomo_daily/");
				// path = str_replace("/docomo/", "/docomo_daily/", path);
// 2022cvt_020
				path = path.replace("@p", pactid);
				// path = str_replace("@p", pactid, path);
// 2022cvt_021
// 2022cvt_020
				path = path.replace("@y", sprintf("%04d%02d", year, month));
				// path = str_replace("@y", sprintf("%04d%02d", year, month), path);
// 2022cvt_015
				var dir = "";
// 2022cvt_015
				var remain = path;

				while (remain.length) {
// 2022cvt_015
					var idx = remain.indexOf("/");
					if (-1 == idx) break;
					// if (false === (idx = strpos(remain, "/"))) break;
					dir += remain.substring(0, idx + 1);
					remain = remain.substring(idx + 1);
					if (fs.existsSync(dir)) continue;
					// if (file_exists(dir)) continue;

					try {
						fs.mkdirSync(dir);
					} catch (e) {
						this.putError(G_SCRIPT_WARNING, "ディレクトリ作成失敗" + dir);
						return false;
					}
				}

// 2022cvt_015
				for (var detailno_2 in H_details) {
// 2022cvt_016
// 2022cvt_015
					var H_type = H_details[detailno_2];

// 2022cvt_016
// 2022cvt_015
					for (var type_2 in H_type) //出力先ディレクトリから該当の種別のファイルを削除する
					{
// 2022cvt_016
// 2022cvt_015
						var A_line = H_type[type_2];
// 2022cvt_016
// 2022cvt_015
						var fname = type_2 + "_" + detailno_2 + "_" + year_2 + "_" + month_2 + "_" + "*" + ".csv";
// 2022cvt_015
						var flist = Array();
						execSync("ls -1 " + path + fname + " 2> /dev/null");
						// exec("ls -1 " + path + fname + " 2> /dev/null", flist);

// 2022cvt_015
						for (var fname_2 of flist) {
							fs.unlinkSync(fname_2);// 2022cvt_007
						}

// 2022cvt_015
						for (var H_line of A_line) //ファイル名を決定する
						//エクスポートする
						{
// 2022cvt_016
							fname = H_line.type + "_" + H_line.detailno + "_" + H_line.year + "_" + H_line.month + "_" + ("0" + new Date().getDate()).slice(-2) + "_" + H_line.idx + ".csv";

							if (!this.m_db_temp.loExport(path + fname + ".gz", H_line.fid, false)) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "loExport:" + H_line.fid + ":" + path + fname + ".gz");
									return false;
								}

							if (!this.processGzip(path + fname + ".gz", "false")) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "gzip:" + path + fname + ".gz");
									return false;
								}

							this.m_db_temp.loUnlink(H_line.fid, false);
						}
					}
				}

				sql = "delete from clampweb_daily_tb";
				sql += " where pactid=" + pactid;
				sql += " and env=" + G_CLAMP_ENV;
				sql += " and year=" + year;
				sql += " and month=" + month;
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);

				if (!this.end_log()) {
					return false;
				}

				// delete log;
			}
		}

		return true;
	}

	async do_import_pactid(pactid: string) ////ロック開始
	//clampweb_details_tbから、処理可能なファイル種別を取り出す
// 2022cvt_016
	//{fname}[detailno][year][month][type][idx]
	//ロック終了
	//インポートを実行する
	//{"$year,$month,$detailno" => 子プロセス実行結果}
	////ロック開始
	//ロック終了
	{
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
// 2022cvt_015
		var A_info = Array();
// 2022cvt_016
// 2022cvt_015
		var sql = "select detailno,year,month,type,idx,fid";
		sql += " from clampweb_details_tb";
		sql += " where pactid=" + pactid;
		sql += " and env=" + G_CLAMP_ENV;
// 2022cvt_016
		sql += " order by detailno,year,month,type,idx,fid";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db_temp.getAll(sql);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);

// 2022cvt_015
		for (var A_line of result) {
// 2022cvt_015
			var detailno = A_line[0];
// 2022cvt_015
			var year = A_line[1];
// 2022cvt_015
			var month = A_line[2];
// 2022cvt_016
// 2022cvt_015
			var type = A_line[3];
// 2022cvt_015
			var idx = A_line[4];
// 2022cvt_015
			var fid = A_line[5];
			if (!(undefined !== A_info[detailno])) A_info[detailno] = Array();
			if (!(undefined !== A_info[detailno][year])) A_info[detailno][year] = Array();
			if (!(undefined !== A_info[detailno][year][month])) A_info[detailno][year][month] = Array();
// 2022cvt_016
			if (!(undefined !== A_info[detailno][year][month][type])) A_info[detailno][year][month][type] = Array();
// 2022cvt_016
			A_info[detailno][year][month][type].push(fid);
		}

// 2022cvt_015
		var H_return_status = Array();
		if (!this.do_import_pactid_exec(pactid, A_info, H_return_status)) return false;
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
// 2022cvt_015
		var status = this.do_import_pactid_store(pactid, A_info, H_return_status);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
		return status;
	}

	async do_import_pactid_exec(pactid: string, A_info: any[], H_return_status: any[]) //取り出したファイルをインポートする
	{
// 2022cvt_015
		for (var detailno in A_info) {
// 2022cvt_015
			var A_detailno = A_info[detailno];

// 2022cvt_015
			for (var year in A_detailno) {
// 2022cvt_015
				var A_year = A_detailno[year];

// 2022cvt_015
				for (var month in A_year) //年月が古すぎる場合、インポートせずに無視する
				//必要なら、changeoverを実行する
				//ロック開始
				//ロック終了
				//インポートを実行する
				//ASP利用料挿入
				{
// 2022cvt_015
					var A_month = A_year[month];
// 2022cvt_015
					var diff_month = 12 * (new Date().getFullYear() - parseInt(year)) + (new Date().getMonth() + 1 - parseInt(month));
					// var diff_month = 12 * (date("Y") - year) + (date("n") - month);

					if (4 < diff_month) //インポートには成功した事にする
						//(ラージオブジェクトは削除される)
						{
							this.putError(G_SCRIPT_WARNING, "古すぎるファイルがあったので" + "インポートせずに無視" + "/pactid:=" + pactid + "/detailno:=" + detailno + "/year:=" + year + "/month:=" + month);
							H_return_status[year + "," + month + "," + detailno] = 1;
							continue;
						}

// 2022cvt_015
					var log = new ProcessLog(0);
					if (!this.begin_log(pactid, year, month, log)) return false;
// 2022cvt_015
					var path = log.m_path;
					if (path) {
						if ("/" != path[path.length - 1]) path += "/";
					}
// 2022cvt_015
					var fname = path + "*.cla.gz";
// 2022cvt_015
					var flist = Array();
					execSync(`ls -1 ${fname} 2> /dev/null`);
					// exec(`ls -1 ${fname} 2> /dev/null`, flist);

// 2022cvt_015
					for (var fname_2 of flist) {
							fs.unlinkSync(fname_2);
						// fs.unlink(fname);// 2022cvt_007
					}

					fname = path + "*.cla";
					flist = Array();
					execSync(`ls -1 ${fname} 2> /dev/null`);
					// exec(`ls -1 ${fname} 2> /dev/null`, flist);

// 2022cvt_015
					for (var fname_2 of flist) {
						fs.unlinkSync(fname_2);
						// fs.unlink(fname);// 2022cvt_007
					}

					if (!this.do_changeover(pactid, parseInt(year), parseInt(month), log)) return false;
					this.beginDB();

// 2022cvt_016
// 2022cvt_015
					for (var type in A_month) {
// 2022cvt_016
// 2022cvt_015
						var A_type = A_month[type];
// 2022cvt_015
						var cnt = 0;

// 2022cvt_016
// 2022cvt_015
						for (var fid of A_type) {
// 2022cvt_016
// 2022cvt_015
							var tgtname = path + type + "_" + detailno + "_" + year + "_" + month + "_" + cnt + ".cla.gz";
							++cnt;

							if (!this.m_db_temp.loExport(tgtname, fid, false)) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "loExport:" + fid);
									return false;
								}
						}
					}

					this.endDB(true);
// 2022cvt_015
					var arg = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
// 2022cvt_021
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}, {
						key: "f",
						value: this.m_forceflag ? 1 : 0
					}, {
						key: "e",
						value: this.m_clearflag ? 1 : 0
					}, {
						key: "M",
						value: 2
					}, {
						key: "E",
						value: this.m_stop_mail ? 0 : 1
					}, {
						key: "s",
						value: log.m_path
					}];
// 2022cvt_015
					var proc = new ScriptCommand(this.m_listener, false);
					if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) proc.m_stop_warning = true;
// 2022cvt_015
					var status = proc.execute(G_PHP + " import_docomo.php", arg, Array());
					arg = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
// 2022cvt_021
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}, {
						key: "c",
						value: G_CARRIER_DOCOMO
					}];
					// delete proc;
					await setTimeout(3);
					// sleep(3);
					H_return_status[year + "," + month + "," + detailno] = status;

					if (!status) {
						if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) this.putError(G_SCRIPT_INFO, "インポート失敗" + pactid + "/" + year + "/" + month + "/" + detailno);else this.putError(G_SCRIPT_WARNING, "インポート失敗" + pactid + "/" + year + "/" + month + "/" + detailno);
					}

					arg = [{
						key: "e",
						value: "O"
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
// 2022cvt_021
						value: sprintf("%04d%02d", year, month)
					}];
					proc = new ScriptCommand(this.m_listener, false);

					if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) {
						proc.m_stop_warning = true;
					}

					status = proc.execute(G_PHP + " ../FlatEverySecondMonth.php", arg, Array());
					// delete proc;
					await setTimeout(3);
					// sleep(3);

					if (!status) {
						if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) this.putError(G_SCRIPT_INFO, "インポート失敗(平準化)" + pactid + "/" + year + "/" + month + "/" + detailno);else this.putError(G_SCRIPT_WARNING, "インポート失敗(平準化)" + pactid + "/" + year + "/" + month + "/" + detailno);
					}

					if (!this.end_log()) return false;
					// delete log;
				}
			}
		}

		return true;
	}

	async do_changeover(pactid: string, year: number, month: number, log: ProcessLog) //部署情報があるか確認
	{
// 2022cvt_015
		var sql = "select count(*) from post_" + this.m_table_no.get(year, month) + "_tb where pactid=" + pactid + ";";
		if (await this.m_db.getOne(sql)) return true;
		this.putError(G_SCRIPT_INFO, "changeover実行" + pactid + "/" + year + "/" + month);
// 2022cvt_015
		var arg_changeover = [{
			key: "m",
			value: 0
		}, {
			key: "l",
			value: log.m_path
		}, {
			key: "k",
			value: 0
		}, {
			key: "p",
			value: pactid
		}, {
			key: "y",
// 2022cvt_021
			value: sprintf("%04d%02d", year.toString(), month.toString())
		}, {
			key: "r",
			value: this.m_repeatflag ? 1 : 0
		}, {
			key: "d",
			value: this.m_debugflag ? 1 : 0
		}];
// 2022cvt_015
		var proc = new ScriptCommand(this.m_listener, false);

		if (!proc.execute(G_PHP + " changeover.php", arg_changeover, Array())) {
			this.putError(G_SCRIPT_WARNING, "changeover実行失敗" + pactid + "/" + year + "/" + month);
			return false;
		}

		return true;
	}

	do_import_pactid_store(pactid: string | any[], A_info: any[], H_return_status: any[]) {
// 2022cvt_016
// 2022cvt_015
		var A_type_details = G_CLAMP_DOCOMO_TEL_TYPE.split(",");
// 2022cvt_016
// 2022cvt_015
		var A_type_comm = G_CLAMP_DOCOMO_COMM_TYPE.split(",");
// 2022cvt_016
// 2022cvt_015
		var A_type_info = G_CLAMP_DOCOMO_INFO_TYPE.split(",");
// 2022cvt_016
// 2022cvt_015
		var A_type_bill = G_CLAMP_DOCOMO_BILL_TYPE.split(",");

// 2022cvt_015
		for (var detailno in A_info) {
// 2022cvt_015
			var A_detailno = A_info[detailno];

// 2022cvt_015
			for (var year in A_detailno) {
// 2022cvt_015
				var A_year = A_detailno[year];

// 2022cvt_015
				for (var month in A_year) //請求明細を取り出したらtrue
				//通信明細を取り出したらtrue
				//情報料明細を取り出したらtrue
				//請求書情報を取り出したらtrue
				//clampdb_index_tbのis_details,comm,info,billをtrueにする
				//また、それ以後の処理フラグをfalseに戻す
				{
// 2022cvt_015
					var A_month = A_year[month];
// 2022cvt_015
					var is_details = false;
// 2022cvt_015
					var is_comm = false;
// 2022cvt_015
					var is_info = false;
// 2022cvt_015
					var is_bill = false;
// 2022cvt_015
					var key = year + "," + month + "," + detailno;

					if (!(undefined !== H_return_status[key]) || !H_return_status[key]) //インポートができなかったので、ファイルを残しておく
						{
							this.putError(G_SCRIPT_INFO, "インポートに失敗したのでラージオブジェクト削除せず" + pactid + "/" + year + "/" + month + "/" + detailno);
							continue;
						}

// 2022cvt_016
// 2022cvt_015
					for (var type in A_month) //WEB側DBからラージオブジェクトを削除する
					//clampweb_details_tbから不要になったレコードを削除する
// 2022cvt_016
					//clampweb_type_tbから不要になったレコードを削除する
// 2022cvt_016
					//clampdb_type_tbの該当するis_readyをtrueにする
					//処理が終わったファイル種別のフラグを立てる
					{
// 2022cvt_016
// 2022cvt_015
						var A_type = A_month[type];

// 2022cvt_016
// 2022cvt_015
						for (var fid of A_type) {
							if (!this.m_db_temp.loUnlink(fid, false)) //失敗しても処理を続ける
								{
									this.putError(G_SCRIPT_WARNING, "loUnlink" + fid);
								}
						}

// 2022cvt_015
						var sqlwhere = "";
						sqlwhere += " where pactid=" + pactid;
						sqlwhere += " and detailno=" + detailno;
						sqlwhere += " and year=" + year;
						sqlwhere += " and month=" + month;
// 2022cvt_016
						sqlwhere += " and type='" + this.m_db_temp.escape(type) + "'";
// 2022cvt_015
						var sql = "delete from clampweb_details_tb";
						sql += sqlwhere;
						sql += " and env=" + G_CLAMP_ENV;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
// 2022cvt_016
						sql = "delete from clampweb_type_tb";
						sql += sqlwhere;
						sql += " and env=" + G_CLAMP_ENV;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
// 2022cvt_016
						sql = "update clampdb_type_tb";
						sql += " set is_ready=true";
						sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
						sql += sqlwhere;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db.query(sql);
// 2022cvt_016
						if (-1 !== A_type_details.indexOf(type)) is_details = true;
// 2022cvt_016
						if (-1 !== A_type_comm.indexOf(type)) is_comm = true;
// 2022cvt_016
						if (-1 !== A_type_info.indexOf(type)) is_info = true;
// 2022cvt_016
						if (-1 !== A_type_bill.indexOf(type)) is_bill = true;
					}

// 2022cvt_015
					var H_to: { [key: string]: any } = {};
					if (is_details) H_to.is_details = true;
					if (is_comm) H_to.is_comm = true;
					if (is_info) H_to.is_info = true;
					if (is_bill) H_to.is_bill = true;

					if (is_details || is_comm) {
						H_to.is_calc = false;
						H_to.is_trend = false;
						H_to.is_recom = false;
					}

					if (!this.update_clampdb_index_tb(pactid, detailno, year, month, {}, H_to)) return false;
				}
			}
		}

		return true;
	}

	update_clampdb_index_tb(pactid: string | any[], detailno: string | any[], year: string | any[], month: string | any[], H_from: { is_calc?: boolean; is_details?: boolean, is_trend?: false, is_comm?: true, is_recom?: false }, H_to: { is_calc?: boolean; is_trend?: boolean; is_recom?: boolean; }) {
// 2022cvt_015
		var sql = "update clampdb_index_tb";
		sql += " set fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";

// 2022cvt_015
		for (var key in H_to) {
// 2022cvt_015
			var value = H_to[key];
			sql += "," + key + "=" + (value ? "true" : "false");
		}

// 2022cvt_015
		var H_cond: { [key: string]: any } = {};
		if (pactid.length) H_cond.pactid = pactid;
		if (detailno.length) H_cond.detailno = detailno;
		if (year.length) H_cond.year = year;
		if (month.length) H_cond.month = month;
// 2022cvt_015
		var is_where = true;

// 2022cvt_015
		for (var key in H_cond) {
// 2022cvt_015
			var value = H_cond[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " " + key + "=" + value;
		}

// 2022cvt_015
		for (var key in H_from) {
// 2022cvt_015
			var value = H_from[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;

			if (Array.isArray(value)) {
				sql += "(";
// 2022cvt_015
				var is_or = false;

// 2022cvt_015
				for (var local_key in value) {
// 2022cvt_015
					var local_value = value[local_key];
					if (is_or) sql += " or";
					is_or = true;
					sql += " coalesce(" + local_key + ",false)=" + (local_value ? "true" : "false");
				}

				sql += ")";
			} else sql += " coalesce(" + key + ",false)=" + (value ? "true" : "false");
		}

		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async get_clampdb_index_tb(H_result: any[], H_from: { [x: string]: any; is_calc?: boolean; is_details?: boolean; is_trend?: boolean; is_comm?: boolean; is_recom?: boolean; }, A_is_v2: boolean[], A_is_hotline: any[]) //顧客で絞り込み
	//最大で過去四ヶ月に制限する
	//顧客・年月の順にソート
	{
// 2022cvt_015
		var sql = "select index_tb.pactid,index_tb.year,index_tb.month";
		sql += " from clampdb_index_tb as index_tb";
		sql += " left join pact_tb";
		sql += " on index_tb.pactid=pact_tb.pactid";
// 2022cvt_015
		var is_where = true;

		if (this.m_pactid.length) {
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " index_tb.pactid=" + this.m_pactid;
		}

		if (this.m_A_skippactid.length) {
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " index_tb.pactid not in (" + this.m_A_skippactid.join(",") + ")";
		}

// 2022cvt_015
		for (var key in H_from) {
// 2022cvt_015
			var value = H_from[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;

			if (Array.isArray(value)) {
				sql += "(";
// 2022cvt_015
				var is_or = false;

// 2022cvt_015
				for (var local_key in value) {
// 2022cvt_015
					var local_value = value[local_key];
					if (is_or) sql += " or";
					is_or = true;
					sql += " coalesce(index_tb." + local_key + ",false)=" + (local_value ? "true" : "false");
				}

				sql += ")";
			} else sql += " coalesce(index_tb." + key + ",false)=" + (value ? "true" : "false");
		}

// 2022cvt_015
		var year = this.m_year;
// 2022cvt_015
		var month = this.m_month;
		if (is_where) sql += " where";else sql += " and";
		is_where = false;
		sql += " (";

// 2022cvt_015
		for (var cnt = 0; cnt < 4; ++cnt) //V2とホットラインで絞り込み
		{
			if (cnt) sql += " or";
			sql += "(";
			sql += "index_tb.year=" + year + " and index_tb.month=" + month;
// 2022cvt_016
// 2022cvt_015
			var A_types = Array();
// 2022cvt_016
			if (A_is_v2[cnt ? 1 : 0]) A_types.push("'M'");
// 2022cvt_016
			if (A_is_hotline[cnt ? 1 : 0]) A_types.push("'H'");
// 2022cvt_016
			if (A_types.length) sql += " and pact_tb.type in (" + A_types.join(",") + ")";else sql += " and 1=0";
			sql += ")";
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		sql += ")";
		sql += " group by index_tb.pactid,index_tb.year,index_tb.month";
		sql += " order by index_tb.pactid,index_tb.year,index_tb.month";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getAll(sql);
		H_result = Array();
// 2022cvt_015
		var cur_pactid = "";
// 2022cvt_015
		var A_ym = Array();

// 2022cvt_015
		for (var A_line of result) {
// 2022cvt_015
			var pactid = A_line[0];

// 2022cvt_022
			if (pactid.localeCompare(cur_pactid)) {
			// if (strcmp(pactid, cur_pactid)) {
				if (A_ym.length && cur_pactid.length) H_result[cur_pactid] = A_ym;
				A_ym = Array();
				cur_pactid = pactid;
			}

// 2022cvt_015
			var ym = [A_line[1], A_line[2]];
			A_ym.push(ym);
		}

		if (A_ym.length && cur_pactid.length) H_result[cur_pactid] = A_ym;
		return true;
	}

	do_calc(req_hotline: boolean) //請求明細がダウンロード済みであり、計算等がまだの顧客を取り出す
	{
// 2022cvt_015
		var is_v2 = -1 !== this.m_mode.indexOf("c") && !req_hotline;
// 2022cvt_015
		var is_hotline = -1 !== this.m_mode.indexOf("C") && req_hotline;
// 2022cvt_015
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_calc: false,
			is_details: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;

// 2022cvt_015
		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
// 2022cvt_015
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "計算中に実行可能時間オーバー" + pactid);
				break;
			}

// 2022cvt_015
			for (var A_line of A_ym) //ディレクトリを作成して、ログ出力先を切り替える
			//ホットライン電話追加を行う
			//計算等実行済みフラグを立てる
			{
// 2022cvt_015
				var year = A_line[0];
// 2022cvt_015
				var month = A_line[1];
				this.putError(G_SCRIPT_INFO, "計算等実行" + pactid + "/" + year + "/" + month);
// 2022cvt_015
				var log = new ProcessLog(0);
				if (!this.begin_log(pactid, year, month, log)) return false;
// 2022cvt_015
				var common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
// 2022cvt_021
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
// 2022cvt_015
				var status = true;
// 2022cvt_015
				var proc = new ScriptCommand(this.m_listener, false);
// 2022cvt_015
				var arg = [{
					key: "C",
					value: this.m_csv_name
				}];
				if (status && !proc.execute(G_PHP + " insert_tel_docomo.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}, {
					key: "C",
					value: this.m_csv_name
				}];
				if (status && !proc.execute(G_PHP + " alert.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " recent_telcnt.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " decorate_comm.php", arg, common)) status = false;
				arg = Array();
				if (status && !proc.execute(G_PHP + " calc.php", arg, common)) status = false;
				// delete proc;
				if (!this.end_log()) return false;
				// delete log;

				if (status) //ロック開始
					//ロック終了
					{
						this.beginDB();
						status = this.update_clampdb_index_tb(pactid, "", year, month, {
							is_calc: false,
							is_details: true
						}, {
							is_calc: true
						});
						this.endDB(status);
						if (!status) return false;
					} else {
					this.putError(G_SCRIPT_WARNING, "計算等実行失敗" + pactid + "/" + year + "/" + month);
				}
			}
		}

		return true;
	}

	do_trend(req_hotline: boolean) //請求明細がダウンロード済みであり、統計情報抽出がまだの顧客を取り出す
	//{"$pactid,$year,$month"}
	//処理が必要な顧客に対してループ
	//predata実行時にtrend_mainを実行した条件を保存する
	//通話明細がダウンロード済みであり、統計情報抽出がまだの顧客を取り出す
	//統計情報抽出済みフラグを立てる
	{
// 2022cvt_015
		var is_v2 = -1 !== this.m_mode.indexOf("t") && !req_hotline;
// 2022cvt_015
		var is_hotline = -1 !== this.m_mode.indexOf("T") && req_hotline;
// 2022cvt_015
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_trend: false,
			is_details: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;
// 2022cvt_015
		var A_store = Array();

// 2022cvt_015
		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
// 2022cvt_015
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "統計情報抽出中に実行可能時間オーバー(請求明細)" + pactid);
				break;
			}

// 2022cvt_015
			for (var A_line of A_ym) //ディレクトリを作成して、ログ出力先を切り替える
			//predataを実行する
			//統計情報抽出済みフラグを立てるために保存する
			{
// 2022cvt_015
				var year = A_line[0];
// 2022cvt_015
				var month = A_line[1];
				this.putError(G_SCRIPT_INFO, "統計情報抽出(請求明細)" + pactid + "/" + year + "/" + month);
// 2022cvt_015
				var log = new ProcessLog(0);
				if (!this.begin_log(pactid, year, month, log)) return false;
// 2022cvt_015
				var common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
// 2022cvt_021
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
// 2022cvt_015
				var status = true;
// 2022cvt_015
				var proc = new ScriptCommand(this.m_listener, false);
// 2022cvt_015
				var arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " predata.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " trend_main.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " trend_graph.php", arg, common)) status = false;
				// delete proc;
				if (!this.end_log()) return false;
				// delete log;

				if (status) {
					A_store.push(`${pactid},${year},${month}`);
				} else {
					this.putError(G_SCRIPT_WARNING, "統計情報抽出(請求明細)" + pactid + "/" + year + "/" + month);
				}
			}
		}

// 2022cvt_015
		var A_store_predata = A_store;
		H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_trend: false,
			is_comm: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;

// 2022cvt_015
		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
// 2022cvt_015
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "統計情報抽出中に実行可能時間オーバー(通話明細)" + pactid);
				break;
			}

// 2022cvt_015
			for (var A_line of A_ym) //ディレクトリを作成して、ログ出力先を切り替える
			//当該条件でtrend_mainを実行していなければ、trend_mainを実行する
			//統計情報抽出済みフラグを立てるために保存する
			{
				year = A_line[0];
				month = A_line[1];
				this.putError(G_SCRIPT_INFO, "統計情報抽出(通話明細)" + pactid + "/" + year + "/" + month);
				log = new ProcessLog(0);
				if (!this.begin_log(pactid, year, month, log)) return false;
				common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
// 2022cvt_021
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
				status = true;
				proc = new ScriptCommand(this.m_listener, false);

				if (!(-1 !== A_store_predata.indexOf(`${pactid},${year},${month}`))) //trend_mainを実行する
					{
						arg = [{
							key: "c",
							value: G_CARRIER_DOCOMO
						}];
						if (status && !proc.execute(G_PHP + " trend_main.php", arg, common)) status = false;
						arg = [{
							key: "c",
							value: G_CARRIER_DOCOMO
						}];
						if (status && !proc.execute(G_PHP + " trend_graph.php", arg, common)) status = false;
					}

				// delete proc;
				if (!this.end_log()) return false;
				// delete log;

				if (status) {
					A_store.push(`${pactid},${year},${month}`);
				} else {
					this.putError(G_SCRIPT_WARNING, "統計情報抽出(通話明細)" + pactid + "/" + year + "/" + month);
				}
			}
		}

// 2022cvt_015
		for (var keys of A_store) //ロック開始
		//ロック終了
		{
// 2022cvt_015
			var A_keys = keys.split(",");

			if (A_keys.length < 3) {
				this.putError(G_SCRIPT_WARNING, "internal:do_trend(0)");
				continue;
			}

// 2022cvt_015
			var pactid_2 = A_keys[0];
			year = A_keys[1];
			month = A_keys[2];

			if (!pactid_2.length || !year.length || !month.length) {
				this.putError(G_SCRIPT_WARNING, "internal:do_trend(1)");
				continue;
			}

			this.beginDB();
			status = true;
			if (status && !this.update_clampdb_index_tb(pactid_2, "", year, month, {
				is_trend: false,
				is_details: true
			}, {
				is_trend: true
			})) status = false;
			if (status && !this.update_clampdb_index_tb(pactid_2, "", year, month, {
				is_trend: false,
				is_comm: true
			}, {
				is_trend: true
			})) status = false;
			this.endDB(status);
			if (!status) return false;
		}

		return true;
	}

	async do_recom(req_hotline: boolean) {
// 2022cvt_015
		var is_v2 = -1 !== this.m_mode.indexOf("s") && !req_hotline;
// 2022cvt_015
		var is_hotline = -1 !== this.m_mode.indexOf("S") && req_hotline;
		if (!is_v2 && !is_hotline) return true;
// 2022cvt_015
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_recom: false,
			is_calc: true
		}, [is_v2, is_v2], [is_hotline, is_hotline])) return false;

// 2022cvt_015
		for (var pactid in H_result) //実行可能時間を超えていれば終了
		//ディレクトリを作成して、ログ出力先を切り替える
		//V3型顧客かどうかを調べる
		//シミュレーションを実行する
		//ログを元に戻す
		{
// 2022cvt_015
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "シミュレーション実行中に実行可能時間オーバー" + pactid);
				break;
			}

// 2022cvt_015
			var year = "";
// 2022cvt_015
			var month = "";

// 2022cvt_015
			for (var A_line of A_ym) {
				year = A_line[0];
				month = A_line[1];
			}

			if (!year.length || !month.length) continue;
			this.putError(G_SCRIPT_INFO, "シミュレーション実行" + pactid + "/" + year + "/" + month);
// 2022cvt_015
			var log = new ProcessLog(0);
			if (!this.begin_log(pactid, year, month, log)) return false;
// 2022cvt_015
			var no = this.m_table_no.get(parseInt(year), parseInt(month));
// 2022cvt_015
			var sql = "select count(*) as count from trend_" + no + "_tb";
			sql += " where pactid=" + pactid;
			sql += ";";
// 2022cvt_015
			var is_trend = 0 < await this.m_db.getOne(sql);
			sql = "select count(*) from fnc_relation_tb where fncid=" + AUTH_V3_SIM + " and pactid=" + pactid + ";";
// 2022cvt_015
			var is_v3_sim = 0 < await this.m_db.getOne(sql);

			if (is_v3_sim) //V3型顧客のシミュレーションを行う
				{
// 2022cvt_015
					var common = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
// 2022cvt_021
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}];
// 2022cvt_015
					var status = true;
// 2022cvt_015
					var proc = new ScriptCommand(this.m_listener, false);
// 2022cvt_015
					var arg = [{
						key: "c",
						value: G_CARRIER_DOCOMO
					}];
					if (!proc.execute(G_PHP + " recom3.php", arg, common)) status = false;
					// delete proc;
				} else //V2型顧客のシミュレーションを行う
				{
					common = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
// 2022cvt_021
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}];
					status = true;
					proc = new ScriptCommand(this.m_listener, false);

					if (is_trend) //統計情報あり(統計情報の有無によって処理に違いはない)
						{
							arg = [{
								key: "c",
								value: G_CARRIER_DOCOMO
							}];
							if (!proc.execute(G_PHP + " recom.php", arg, common)) status = false;
						} else //統計情報なし(統計情報の有無によって処理に違いはない)
						{
							arg = [{
								key: "c",
								value: G_CARRIER_DOCOMO
							}];
							if (!proc.execute(G_PHP + " recom.php", arg, common)) status = false;
						}

					// delete proc;
				}

			if (!this.end_log()) return false;
			// delete log;

			if (status) //ロック開始
				//シミュレーション実行済みフラグを立てる
				//ロック終了
				{
					this.beginDB();
					status = this.update_clampdb_index_tb(pactid, "", "", "", {
						is_recom: false,
						is_calc: true
					}, {
						is_recom: true
					});
					this.endDB(status);
					if (!status) return false;
				} else this.putError(G_SCRIPT_WARNING, "シミュレーション実行失敗" + pactid + "/" + year + "/" + month);
		}

		return true;
	}

	compressLog() {
		if (!this.m_is_compress_log) return true;
		this.putError(G_SCRIPT_DEBUG, "ログ圧縮開始");
// 2022cvt_015
		var A_file = Array();
		if (!this.compressLogLevel(A_file, this.m_listener_process!.m_path!, 0)) return false;

// 2022cvt_015
		for (var fname of A_file) {
			if (!this.processGzip(fname, "true")) return false;
		}

		return true;
	}

	compressLogLevel(A_file: any[], path: string, level: number) {
// 2022cvt_015
		var fname;
		if (30 < level) return false;
		++level;
// 2022cvt_015
		var O_dir = fs.readdirSync(path);
		// var O_dir = openDir(path);// 2022cvt_004

		for (fname of O_dir) {
		// while (false !== (fname = fs.readdir(O_dir))) {// 2022cvt_005
			if ("." === fname || ".." == fname) continue;
// 2022cvt_015
			var fullpath = path + fname;
			if (fs.statSync(fullpath).isSymbolicLink()) continue;
			// if (is_link(fullpath)) continue;

			if (fs.existsSync(fullpath)) {// 2022cvt_003
				if (!this.compressLogLevel(A_file, fullpath + "/", level)) return false;
			}

// 2022cvt_028
			if (fs.statSync(fullpath).isFile()) {
			// if (is_file(fullpath)) {
				if (this.compressLogIsTarget(fullpath)) A_file.push(fullpath);
			}
		}

		// closedir(O_dir);
		return true;
	}

	compressLogIsTarget(fullpath: string) {
// 2022cvt_019
		if (fullpath.match("/\\.(insert|delete|log)(|\\.[0-9]+)$/")) return true;
		// if (preg_match("/\\.(insert|delete|log)(|\\.[0-9]+)$/", fullpath)) return true;
		return false;
	}

};

(async () => {
// checkClient(G_CLIENT_DB);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
// 2022cvt_015
var proc = new ProcessAdminDocomoDB(G_PROCNAME_ADMIN_DOCOMO_DB, log, G_OPENTIME_ADMIN_DOCOMO_DB);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009

if (proc.m_waitflag) {
// 2022cvt_015
	var is_exec = false;
// 2022cvt_015
	var sql = "select count(*) from batchlog_tb";
	sql += " where log='admin_docomo_ok'";
	sql += " and status='begin'";
	sql += " and recdate>'" + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + ("0" + new Date().getDate()).slice(-2) + "'";
	// sql += " and recdate>'" + date("Y") + "-" + date("n") + "-" + date("d") + "'";
	sql += ";";

	while (true) {
		if (!proc.isOpen()) break;

		if (await proc.m_db.getOne(sql)) {
// 2022cvt_015
			var status = proc.execute();
			proc.compressLog();
			is_exec = true;
			break;
		}

		await setTimeout(60);
		// sleep(60);
	}

	if (!is_exec) proc.putError(G_SCRIPT_WARNING, "実行可能時間中にbatchlog_tbのadmin_docomo_okがbeginにならなかった");else {
		sql = "update batchlog_tb set status='done'";
		sql += " where log='admin_docomo_ok'";
		sql += " and status='begin'";
		sql += " and recdate>'" + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + ("0" + new Date().getDate()).slice(-2) + "'";
		sql += ";";
		proc.beginDB();
		proc.m_db.query(sql);
		proc.endDB(true);
	}
} else {
	status = proc.execute();
	proc.compressLog();
	if (!status) throw process.exit(1);// 2022cvt_009
}

throw process.exit(0);// 2022cvt_009
})();
