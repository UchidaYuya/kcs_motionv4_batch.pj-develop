//===========================================================================
//機能：WEB側プロセス管理プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//一時停止時の待機秒数
//---------------------------------------------------------------------------
//V3形式のMtSetting型は定数が衝突するので、衝突しない設定ファイル型
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
import { ProcessBase, ProcessLog } from "../batch/lib/process_base";
// require("lib/process_base.php");

// 2022cvt_026
import { download_docomo_type, __write_log } from "../batch/lib/download_docomo";
// require("lib/download_docomo.php");

import { G_LOG, G_LOG_ADMIN_DOCOMO_WEB, PATH_SEPARATOR, sprintf } from "../../db_define/define";

import * as fs from "fs";
import loadIniFile from "read-ini-file";
import { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_BATCH, G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "./lib/script_log";
import { setTimeout } from "timers/promises";
import { G_CARRIER_DOCOMO } from "./lib/script_common";
import include_path from "../../../script/include_path";

const G_PROCNAME_ADMIN_DOCOMO_WEB = "admin_docomo_web";
const G_OPENTIME_ADMIN_DOCOMO_WEB = "0000,2400";
const SLEEP_SEC = 60;

//array(設定項目 => 設定内容);
//機能：コンストラクタ
//機能：項目名があればtrueを返す
//引数：設定項目
//機能：値を返す
//引数：設定項目
//設定項目が無かった場合に返す値
//機能：ファイルを読み出す
//引数：ファイル名
export class IniSettingType {
	m_H_param: Array<any>;

	constructor() {
		this.m_H_param = Array();
	}

	isOk(key: string) {
		return undefined !== this.m_H_param[key];
	}

	get(key: string, def: boolean = false) {
		return undefined !== this.m_H_param[key] ? this.m_H_param[key] : def;
	}

	read(fname: string) //インクルードパスの中でファイルを探す
	{
// 2022cvt_015
		var delim = ":";
		if (undefined !== global[PATH_SEPARATOR]) delim = PATH_SEPARATOR;
// 2022cvt_015
		var A_dir = include_path.toString().split(delim);

// 2022cvt_015
		for (var dir of A_dir) {
			if (!dir.length) {
				continue;
			}
			if ("/" !== dir[dir.length - 1]) {
				dir += "/";
			}

			if (fs.existsSync(dir + fname)) {
			// if (file_exists(dir + fname)) {
				fname = dir + fname;
				break;
			}
		}

		if (!fs.existsSync(fname)) {
			return;
		}
		// if (!file_exists(fname)) return;
// 2022cvt_015
		var H_param = loadIniFile.sync(fname);

// 2022cvt_015
		for (var key in H_param) {
// 2022cvt_015
			var value = H_param[key];
			this.m_H_param[key] = value;
		}
	}

};

export class ProcessAdminDocomoWeb extends ProcessBase {
	m_db_temp!: ScriptDB;
	m_listener!: ScriptLogBase;
	m_db: any;
	m_args: any;
	m_A_id_in: Array<any> = Array();
	m_A_id_out = Array();
	m_oneshot: boolean = true;
	m_index: number = 0;
	m_check_admin: number = 0;
	m_ignore_preadmin: boolean = false;
	m_ignore_days: number = 3;
	m_is_ini: boolean = true;
	m_proxy_host: string = "";
	m_proxy_port: string = "";
	m_proxy_param: { [key: string]: any } = {};
	m_sleep_change: number = 60 * 5;
	m_limit_change_all: number = 30;
	m_limit_change: number = 3;
	m_H_change: Array<any> = Array();
	m_A_change_error: Array<any> = Array();
	m_A_change_thru: Array<any> = Array();
	m_log_level_change: number = G_SCRIPT_DEBUG;
	m_debugflag: boolean = false;
	m_listener_process!: ProcessLog;

	constructor(procname: string, logpath: string, opentime: any) //proxyパスワード
	//サイト構成変更関連の値を初期化する
	//5分待機する
	//クランプIDは30個まで許容する
	//クランプIDあたり3回だけ許容する
	//復帰はDEBUG扱い
	{
		super(procname, logpath, opentime);
		// this.ProcessBase(procname, logpath, opentime);

// 2022cvt_022
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
		// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener!, global.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		this.m_args.addSetting({
			c: {
// 2022cvt_016
				type: "string"
			},
			C: {
// 2022cvt_016
				type: "string"
			},
			x: {
// 2022cvt_016
				type: "int"
			},
			X: {
// 2022cvt_016
				type: "int"
			},
			s: {
// 2022cvt_016
				type: "int"
			},
			S: {
// 2022cvt_016
				type: "int"
			},
			H: {
// 2022cvt_016
				type: "string"
			},
			P: {
// 2022cvt_016
				type: "string"
			}
		});
		this.m_A_id_in = Array();
		this.m_A_id_out = Array();
		this.m_oneshot = true;
		this.m_index = 0;
		this.m_check_admin = 0;
		this.m_ignore_preadmin = false;
		this.m_ignore_days = 3;
		this.m_is_ini = true;
		this.m_proxy_host = "";
		this.m_proxy_port = "";
		this.m_proxy_param = Array();
		this.m_sleep_change = 60 * 5;
		this.m_limit_change_all = 30;
		this.m_limit_change = 3;
		this.m_H_change = Array();
		this.m_A_change_error = Array();
		this.m_A_change_thru = Array();
		this.m_log_level_change = G_SCRIPT_DEBUG;
	}

	getProcname() {
		return "WEB側プロセス管理プロセス(ドコモ専用)";
	}

	commitArg(args: { [key: string]: any }) {
		if (!this.commitArg(args)) {
			return false;
		}

		switch (args.key) {
			case "c":
				this.m_A_id_in = args.value.split(",");
				break;

			case "C":
				this.m_A_id_out = args.value.split(",");
				break;

			case "x":
				this.m_oneshot = args.value;
				break;

			case "X":
				this.m_index = args.value;
				break;

			case "s":
				this.m_ignore_preadmin = args.value;
				break;

			case "S":
				this.m_ignore_days = args.value;
				break;

			case "H":
				this.m_proxy_host = args.value;
				this.m_is_ini = false;
				break;

			case "P":
				this.m_proxy_port = args.value;
				this.m_is_ini = false;
				break;
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		var rval = this.getUsage();
		rval.push(["-c=clamp_id[,clamp_id ... ]", "ダウンロードするクランプID(すべて)"]);
		rval.push(["-C=clamp_id[,clamp_id ... ]", "除外するクランプID(無し)"]);
		rval.push(["-x={0|1}", "実行可能時間の間は動作し続けるか(0)"]);
		rval.push(["-X=0...", "プロセス番号(0)"]);
		rval.push(["-s={0|1}", "管理用DLがまだでもDLするなら1(0)"]);
		rval.push(["-S=0,1,2,3...", "何日間DLが無ければログインを中止するか/0なら常にログイン(3)"]);
		rval.push(["-H=addr", "プロキシのアドレス(common.iniの値を使用)"]);
		rval.push(["-P=port", "プロキシのポート(common.iniの値を使用)"]);
		return rval;
	}

	getManual() {
// 2022cvt_015
		var rval = this.getManual();
		rval += "ダウンロードするクランプID:";
		if (this.m_A_id_in.length) {
			rval += this.m_A_id_in.join(",");
		} else {
			rval += "すべて";
		}
		rval += "\n";
		rval += "除外するクランプID:";
		if (this.m_A_id_out.length) {
			rval += this.m_A_id_out.join(",");
		} else {
			rval += "無し";
		}
		rval += "\n";
		if (this.m_oneshot) {
			rval += "一回だけ実行\n";
		} else {
			rval += "実行可能時間の間は動作し続ける\n";
		}
		rval += "プロセス番号:" + this.m_index + "\n";
		rval += (this.m_ignore_preadmin ? "管理用DLがまだでもDLする" : "管理用DLがまだならDLしない") + "\n";
		if (this.m_ignore_days <= 0) {
			rval += "最終DL日にかかわらず常にログインする" + "\n";
		} else {
			rval += "最終DL日から" + this.m_ignore_days + "日たったらログインしない" + "\n";
		}

		if (this.m_is_ini) {
			rval += "プロキシはcommon.iniから読み出す\n";
		} else {
			if (this.m_proxy_host.length && this.m_proxy_port.length) {
				rval += "プロキシは" + this.m_proxy_host + ":" + this.m_proxy_port + "\n";
			} else {
				rval += "プロキシは使用しない\n";
			}
		}

		return rval;
	}

	beginDB() {
		this.m_db.begin();
// 2022cvt_022
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
			this.m_db_temp!.begin();
		}
		return true;
	}

	endDB(status: boolean) {
		if (this.m_debugflag) {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db_temp!.rollback();
			}
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db_temp!.rollback();
			}
			this.m_db.rollback();
		} else {
// 2022cvt_022
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
				this.m_db_temp!.commit();
			}
			this.m_db.commit();
		}

		return true;
	}

	end(status: boolean) //基底型の同名メソッドを呼び出す
	{
		if (!super.end(status)) {
			return false;
		}

		if (this.m_A_change_error.length) {
// 2022cvt_015
			var msg = "サイト構成変更によりファイルダウンロードに失敗";
			msg += "/clampid:=" + this.m_A_change_error.join(",");
			this.putError(G_SCRIPT_WARNING, msg);
		}

		if (this.m_A_change_thru.length) {
			msg = "サイト構成変更を検出したが、再試行で成功";
			msg += "(特別な処理は不要)";
			msg += "/clampid:=" + this.m_A_change_thru.join(",");
			this.putError(this.m_log_level_change, msg);
		}

		return true;
	}

	async do_execute() //実行中フラグをclampweb_function_tbに記入したらtrue
	//返値
	//管理者の試行を行ったらtrue
	//必要ならプロキシの設定を読み出す
	{
// 2022cvt_015
		var O_db = this.m_db_temp;
// 2022cvt_015
		var is_execute = false;
// 2022cvt_015
		var status = true;
// 2022cvt_015
		var is_try_admin = { "value": false };

		if (this.m_is_ini) //proxyユーザーの取得
			{
// 2022cvt_015
				var O_setting = new IniSettingType();
				O_setting.read("common.ini");
				this.m_proxy_host = O_setting.get("PROXY");
				this.m_proxy_port = O_setting.get("PROXY_PORT");
// 2022cvt_015
				var temp = O_setting.get("PROXY_USER");

				if (temp != "") {
					this.m_proxy_param.proxy_user = temp;
				}

				temp = O_setting.get("PROXY_PASSWORD");

				if (temp != "") {
					this.m_proxy_param.proxy_password = temp;
				}
			}

// 2022cvt_015
		var msg = "プロキシ使用せず";

		if (this.m_proxy_host.length && this.m_proxy_port.length) {
			msg = "プロキシは" + this.m_proxy_host + ":" + this.m_proxy_port;

			if (undefined !== this.m_proxy_param.proxy_user) {
				msg += ":" + this.m_proxy_param.proxy_user;
			}

			if (undefined !== this.m_proxy_param.proxy_password) {
				msg += ":" + this.m_proxy_param.proxy_password;
			}
		}

		this.putError(G_SCRIPT_DEBUG, msg);

		while (true) //ダウンロードを実行したらtrue
		//実行可能時間を超えていないか確認
		//ダウンロード処理
		{
// 2022cvt_015
			var is_empty = { "value": true };

			if (!this.isOpen()) {
				if (!is_execute) this.putError(G_SCRIPT_WARNING, "前回実行されたadmin_docomo_webが終了していなかったので" + "ダウンロードが一切行えなかった");
				break;
			}

			this.beginDB();
			O_db!.lock("clampweb_function_tb");
// 2022cvt_015
			var sql = "select command from clampweb_function_tb;";
// 2022cvt_015
			var result = await O_db!.getAll(sql);
// 2022cvt_015
			var is_stop = false;
// 2022cvt_015
			var is_run = false;
// 2022cvt_015
			var is_reset = false;

// 2022cvt_015
			for (var A_line of result) {
// 2022cvt_022
				if (!"stop".localeCompare(A_line[0])) {
					is_stop = true;
				}
				// if (!strcmp("stop", A_line[0])) is_stop = true;
// 2022cvt_022
				if (!("run" + this.m_index).localeCompare(A_line[0])) {
					is_run = true;
				}
				// if (!strcmp("run" + this.m_index, A_line[0])) is_run = true;
// 2022cvt_022
				if (!"reset".localeCompare(A_line[0])) {
					is_reset = true;
				}
				// if (!strcmp("reset", A_line[0])) is_reset = true;
			}

			if (is_stop) //停止指示があるのでループを抜ける
				{
					this.endDB(true);
					this.putError(G_SCRIPT_INFO, "終了指示受領");
					break;
				}

			if (is_execute) this.endDB(true);else {
				if (is_run) {
					this.endDB(true);
					await setTimeout(SLEEP_SEC);
					// sleep(SLEEP_SEC);
					continue;
				} else //実行中フラグをclampweb_function_tbに追加する
					{
						sql = "insert into clampweb_function_tb" + "(command,fixdate)" + "values(" + "'run" + this.m_index + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db!.query(sql);
						this.endDB(true);
						is_execute = true;
					}
			}

			if (!this.download(O_db!, is_reset, is_try_admin, is_empty)) {
				status = false;
				break;
			}

			if (is_empty.value && this.m_oneshot) {
				break;
			}
		}

		if (is_execute) //実行中フラグをclampweb_function_tbから削除する
			{
				this.beginDB();
				O_db!.lock("clampweb_function_tb");
				sql = "delete from clampweb_function_tb" + " where command='run" + this.m_index + "'" + ";";
				this.putError(G_SCRIPT_SQL, sql);
				O_db!.query(sql);
				this.endDB(true);
			}

		return status;
	}

	async download(O_db: ScriptDB, is_reset: boolean, is_try_admin: { [key: string]: boolean }, is_empty: { [key: string]: boolean }) //試行期間切り替え
// 2022cvt_016
	//{fname}[year][month][type][fidx]
	//DL管理用ならtrue
	//日次ダウンロードをおこなうならtrue
	{
		if (is_reset) {
			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
// 2022cvt_015
			var status = this.reset(O_db, is_try_admin);
			this.endDB(status);
			this.unlockWeb(O_db);
			if (!status) {
				return false;
			}
		}

// 2022cvt_015
		var id = { value: "" };
// 2022cvt_015
		var password = { value: "" };
// 2022cvt_015
		var cookie1 = { value: "" };
// 2022cvt_015
		var pin = { value: "" };
// 2022cvt_015
		var is_hotline = { value: false };
// 2022cvt_015
		var A_info = Array();
		this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
		this.beginDB();
// 2022cvt_015
		var is_admin = { value: false };
// 2022cvt_015
		var is_daily = { value: false };
		status = await this.findId(O_db, is_try_admin, id, password, cookie1, pin, is_hotline, is_admin, is_daily, A_info);
// 2022cvt_015
		var A_info_orig = A_info;
		this.endDB(status);
		this.unlockWeb(O_db);
		if (!status) return false;

		if (!id.value.length) //ダウンロード可能なアカウントが残っていないので待機して戻る
			{
				if (!this.m_oneshot) {
					setTimeout(SLEEP_SEC);
					// sleep(SLEEP_SEC);
				}
				return true;
			}

// 2022cvt_015
		var status3: boolean = false;
		for (var cnt = 0; cnt <= this.m_limit_change; ++cnt) //毎時56分から後なら待機する(以前は57分だった)
		//ダウンロード実行
		//使わなくなっている
		//ログインが割り込まれたらtrueになる
		//ログインに失敗したらtrueになる
		//サイト構成変更ならtrueになる
		//申込が不十分ならtrueになる
		//二段階認証が有効だが端末登録がまだならtrueになる
		//二段階認証の端末が無効になったらtrueになる
		//ネットワーク暗証番号が不正ならtrueになる
		//IDがロックされていたらtrue
		//日次ダウンロードしたファイル
		//サイト構成変更を検出していないか上限に達したので、ループを抜ける
		{
			while (56 <= new Date().getMinutes()) {
				setTimeout(10);
				// sleep(10);
			}

// 2022cvt_015
			var is_login = { "value": false };
// 2022cvt_015
			var is_break = { "value": false };
// 2022cvt_015
			var is_fail = { "value": false };
// 2022cvt_015
			var is_change = { "value": false };
// 2022cvt_015
			var is_unfinished = { "value": false };
// 2022cvt_015
			var is_unregisted = { "value": false };
// 2022cvt_015
			var is_badcookie = { "value": false };
// 2022cvt_015
			var is_badpin = { "value": false };
// 2022cvt_015
			var is_lock = { "value": false };
// 2022cvt_015
			var A_daily = Array();
			A_info = A_info_orig;
			status = true;

			try {
				status = await this.doDownload(O_db, id, password, cookie1, pin, is_hotline, A_info, is_login, is_break, is_fail, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_daily, A_daily, is_lock, is_admin);
			} catch (e) {
				this.putError(G_SCRIPT_INFO, "例外発生(" + id.value + ")" + e.getMessage());
				is_change.value = true;
			}

			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
// 2022cvt_015
			var status2 = await this.storeFile(O_db, is_try_admin, id, password, A_info, is_login, is_break, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_admin, is_fail, is_daily, A_daily, is_lock);
			this.endDB(status2);
			this.unlockWeb(O_db);

			if (is_fail.value) //ログインに失敗した
				//何もせずに、ループを抜ける
				{} else if (is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value) //申込が不十分か、端末登録がまだ
				//何もせずに、ループを抜ける
				{} else if (is_change.value) //サイト構成変更を検出した
				{
					if (!(undefined !== this.m_H_change[id.value])) {
						this.m_H_change[id.value] = 0;
					}
					this.m_H_change[id.value] = this.m_H_change[id.value] + 1;
					if (!(-1 !== this.m_A_change_error.indexOf(id.value))) {
						this.m_A_change_error.push(id.value);
					}

					if (this.m_H_change.length <= this.m_limit_change_all && this.m_H_change[id.value] <= this.m_limit_change) //上限に達していないので、スリープの後に再試行する
						{
							setTimeout(this.m_sleep_change);
							continue;
						}
				} else //サイト構成変更を検出しなかった
				{
					if (-1 !== this.m_A_change_error.indexOf(id.value)) //このIDで前回にサイト構成変更が起こっている
						{
							this.m_A_change_thru.push(id.value);
// 2022cvt_015
							var A_temp = Array();

// 2022cvt_022
// 2022cvt_015
							for (var eid of this.m_A_change_error) {
								if (id.value.localeCompare(eid)) {
									A_temp.push(eid);
								}
							}

							this.m_A_change_error = A_temp;
						}
				}

			is_empty.value = false;
			status3 = status && status2;
			break;
		}

		return status3;
	}

	reset(O_db: ScriptDB, is_try_admin: { [key: string]: boolean }) //起動時にクランプIDが明示されたら何もしない
	//リセット指示を削除する
	//管理用ログインでのログイン結果を初期化する
	{
		if (this.m_A_id_in.length) {
			return true;
		}
// 2022cvt_015
		var sql = "update clampweb_index_tb set is_try=false";
		sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
// 2022cvt_015
		var in_out = this.getInOut();
		if (in_out.length) sql += " where " + in_out;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		sql = "delete from clampweb_function_tb" + " where command='reset'" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		this.m_check_admin = 0;
		return true;
	}

	async findId(O_db: ScriptDB, is_try_admin: { [key: string]: boolean }, id: { [key: string]: string }, password: { [key: string]: string }, cookie1: { [key: string]: string }, pin: { [key: string]: string }, is_hotline: { [key: string]: boolean }, is_admin: { [key: string]: boolean }, is_daily: { [key: string]: boolean }, A_info: Array<any>) //clampweb_index_tbから、is_tryとis_runnningがfalseのidを一つ取り出す
// 2022cvt_016
	//ただし、clampweb_type_tbに、is_readyがfalseのレコードがある事
	//ただし、実行するクランプIDを指定した場合は、is_tryは見ない
// 2022cvt_016
	//ただし、日次ダウンロードする場合は、clampweb_type_tbを見ない
	//それ以外はクランプID順
	//clampweb_index_tbから、パスワードとis_hotlineとis_dailyを取り出す
	//ダウンロードが必要な年月・ファイル種別を取り出す
	//管理用アカウントでダウンロード済みの年月を取り出す
	//is_runningをtrueにする
	{
// 2022cvt_015
		var sql = "select index_tb.env as env" + ",index_tb.clampid as id" + ",index_tb.is_hotline" + ",(case when true=index_tb.is_admin then 1 else 0 end)";
		sql += " from clampweb_index_tb as index_tb";
		sql += " left join (";
// 2022cvt_016
		sql += " select env,pactid,detailno from clampweb_type_tb";
		sql += " where coalesce(is_ready,false)=false";
		sql += " and " + this.getYearMonth();
		sql += " group by env,pactid,detailno";
// 2022cvt_016
		sql += ") as type_tb";
// 2022cvt_016
		sql += " on index_tb.env=type_tb.env";
// 2022cvt_016
		sql += " and index_tb.pactid=type_tb.pactid";
// 2022cvt_016
		sql += " and index_tb.detailno=type_tb.detailno";
		sql += " where coalesce(is_running,false)=false";
		if (!this.m_A_id_in.length) {
			sql += " and (coalesce(is_try,false)=false" + " or (coalesce(is_admin,false)=true and index_tb.detailno=0)" + " or coalesce(is_daily,false)=true)";
		}
		if (is_try_admin.value) {
			sql += " and (coalesce(is_admin,false)=false" + " or index_tb.detailno!=0)";
		}
		sql += " and coalesce(is_fail,false)=false";
		sql += " and length(coalesce(index_tb.clampid,''))>0";
		sql += " and length(coalesce(index_tb.clamppassword,''))>0";
// 2022cvt_016
		sql += " and (type_tb.env is not null" + " or coalesce(is_daily,false)=true)";
// 2022cvt_015
		var in_out = this.getInOut("index_tb");
		if (in_out.length) {
			sql += " and " + in_out;
		}
		sql += " group by index_tb.env,index_tb.clampid" + ",index_tb.is_hotline,index_tb.is_admin";
		sql += " order by index_tb.env" + ",coalesce(index_tb.is_admin,false) desc" + ",coalesce(index_tb.is_hotline,false)" + ",index_tb.clampid";
		sql += " limit 1";
		sql += ";";
// 2022cvt_015
		var result = await O_db.getAll(sql);
		if (0 == result.length || 0 == result[0][1].length) {
			return true;
		}
		id.value = result[0][1];
		is_admin.value = result[0][3];
		sql = "select clamppassword";
		sql += ",(case when coalesce(is_hotline,false)=true then 1 else 0 end)";
		sql += ",(case when coalesce(is_daily,false)=true then 1 else 0 end)";
		sql += ",coalesce(cookie1,'') as cookie1";
		sql += ",coalesce(pin,'') as pin";
		sql += " from clampweb_index_tb";
		sql += " where clampid='" + this.m_db.escape(id.value) + "'";
		if (!this.m_A_id_in.length) {
			sql += " and (coalesce(is_try,false)=false" + " or coalesce(is_admin,false)=true" + " or coalesce(is_daily,false)=true)";
		}
		sql += " and coalesce(is_running,false)=false";
		sql += " and coalesce(is_fail,false)=false";
		sql += " and length(coalesce(clampid,''))>0";
		sql += " and length(coalesce(clamppassword,''))>0";
		sql += ";";
		result = await O_db.getAll(sql);
		password.value = "";
		cookie1.value = "";
		pin.value = "";
		is_hotline.value = false;
		is_daily.value = false;

// 2022cvt_015
		for (var A_line of result) {
// 2022cvt_022
			if (password.value.length && password.value.localeCompare(A_line[0])) {
				this.putError(G_SCRIPT_WARNING, "クランプパスワード混在(処理続行)" + id.value);
			}
			password.value = A_line[0];
// 2022cvt_022
			if (cookie1.value.length && cookie1.value.localeCompare(A_line[3])) {
				this.putError(G_SCRIPT_WARNING, "二段階認証クッキー混在(処理続行)" + id.value);
			}
			cookie1.value = A_line[3];
// 2022cvt_022
			if (pin.value.length && pin.value.localeCompare(A_line[4])) {
				this.putError(G_SCRIPT_WARNING, "ネットワーク暗証番号混在(処理続行)" + id.value);
			}
			pin.value = A_line[4];
			is_hotline.value = is_hotline.value || A_line[1];
			is_daily.value = is_daily.value || A_line[2];
		}

		A_info = Array();
// 2022cvt_016
		sql = "select type_tb.year,type_tb.month,type_tb.type";
// 2022cvt_016
		sql += " from clampweb_type_tb as type_tb";
		sql += " left join clampweb_index_tb as index_tb";
// 2022cvt_016
		sql += " on type_tb.env=index_tb.env";
// 2022cvt_016
		sql += " and type_tb.pactid=index_tb.pactid";
// 2022cvt_016
		sql += " and type_tb.detailno=index_tb.detailno";
		sql += " left join clampweb_ready_tb as ready_tb";
// 2022cvt_016
		sql += " on type_tb.env=ready_tb.env";
// 2022cvt_016
		sql += " and type_tb.pactid=ready_tb.pactid";
// 2022cvt_016
		sql += " and type_tb.detailno=ready_tb.detailno";
// 2022cvt_016
		sql += " and type_tb.year=ready_tb.year";
// 2022cvt_016
		sql += " and type_tb.month=ready_tb.month";
		sql += " where index_tb.clampid='" + O_db.escape(id.value) + "'";
// 2022cvt_016
		sql += " and coalesce(type_tb.is_ready,false)=false";
// 2022cvt_016
		sql += " and " + this.getYearMonth("type_tb");

		if (0 < this.m_ignore_days && !is_admin.value) //最後のDLから指定日数が経過したらDLしない
			{
				sql += " and '" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'<=(" + "coalesce(ready_tb.dldate,'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "') + '" + this.m_ignore_days + " days'" + ")";
			}

// 2022cvt_016
		sql += " group by type_tb.year,type_tb.month,type_tb.type";
// 2022cvt_016
		sql += " order by type_tb.year,type_tb.month,type_tb.type";
		sql += ";";
		result = await O_db.getAll(sql);
// 2022cvt_015
		var A_admin_ym = Array();
		if (!this.getReqYM(O_db, id, A_admin_ym, is_admin)) {
			return false;
		}

// 2022cvt_015
		for (var H_line of result) {
// 2022cvt_015
			var year = H_line[0];
// 2022cvt_015
			var month = H_line[1];
// 2022cvt_016
// 2022cvt_015
			var type = H_line[2];

			if (!is_admin.value && !this.m_ignore_preadmin) //管理用でDLできていない年月はDLしない
				{
// 2022cvt_015
					var is_ready = false;

// 2022cvt_015
					for (var H_line of A_admin_ym) {
						if (H_line.year == year && H_line.month == month) {
							is_ready = true;
							break;
						}
					}

					if (!is_ready) continue;
				}

			if (!(undefined !== A_info[year])) {
				A_info[year] = Array();
			}
			if (!(undefined !== A_info[year][month])) {
				A_info[year][month] = Array();
			}
// 2022cvt_016
			if (!(undefined !== A_info[year][month][type])) {
				A_info[year][month][type] = Array();
			}
		}

		sql = "update clampweb_index_tb set is_running=true";
		sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
		sql += " where clampid='" + O_db.escape(id.value) + "'";
		sql += " and clamppassword='" + O_db.escape(password.value) + "'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		return true;
	}

	async doDownload(O_db: ScriptDB, id: { [key: string]: string }, password: { [key: string]: string }, cookie1: { [key: string]: string }, pin: { [key: string]: string }, is_hotline: { [key: string]: boolean }, A_info: Array<any>, is_login: { [key: string]: boolean }, is_break: { [key: string]: boolean }, is_fail: { [key: string]: boolean }, is_change: { [key:string]: boolean }, is_unfinished: { [key:string]: boolean }, is_unregisted: { [key:string]: boolean }, is_badcookie: { [key:string]: boolean }, is_badpin: { [key:string]: boolean }, is_daily: { [key: string]: boolean }, A_daily: Array<any>, is_lock: { [key:string]: boolean }, is_admin: { [key: string]: boolean }) //ダウンロードすべきファイルがなければ正常終了
	//最終ログイン日時を記録する
	//情報料以外と情報料と請求書情報で三回ループする
	//is_dailyなら請求内訳と料金明細を追加
	{
		__write_log("\n" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));

		__write_log("\tid=" + id.value);

		is_break.value = false;
		is_change.value = false;
		is_unfinished.value = false;
		is_unregisted.value = false;
		is_badcookie.value = false;
		is_badpin.value = false;
		if (!A_info.length && !is_daily.value) return true;
		this.putError(G_SCRIPT_DEBUG, "ダウンロード処理開始:" + id.value + "/" + (is_hotline.value ? "H" : "V"));
		// this.putError(G_SCRIPT_DEBUG, "メモリ使用量" + memory_get_usage());
// 2022cvt_016
// 2022cvt_015
		var O_clamp = new download_docomo_type(this.m_listener, this.m_proxy_host, this.m_proxy_port, this.m_proxy_param);
// 2022cvt_015
		var login_status = O_clamp.login(id.value, password.value, cookie1.value, pin.value);
		is_lock.value = 5 == login_status;

		if (6 == login_status) //申込が不十分
			{
				is_unfinished.value = true;
				return true;
			}

		if (7 == login_status) //端末登録がまだ
			{
				is_unregisted.value = true;
				return true;
			}

		if (8 == login_status) //端末登録が無効になった
			{
				is_badcookie.value = true;
				return true;
			}

		if (2 == login_status) //ログインが割り込まれた
			{
				is_break.value = true;
				return true;
			}

		if (4 == login_status || 3 == login_status || login_status && is_admin.value) //ログイン中にHTTPS通信が切断された
			{
				is_change.value = true;
				return true;
			}

		if (0 != login_status) {
			this.putError(G_SCRIPT_INFO, "ログイン失敗" + login_status + "/復帰動作開始" + id.value);
			// O_clamp = null;
			return this.recover(O_db, id, password, is_hotline, is_fail, login_status);
		}

		this.putError(G_SCRIPT_INFO, "ログイン成功" + id.value);
		is_login.value = true;
// 2022cvt_015
		var sql = "delete from clampweb_login_tb" + " where clampid='" + O_db.escape(id.value) + "'" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		sql = "insert into clampweb_login_tb" + "(clampid,fixdate)values('" + O_db.escape(id.value) + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "')" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);

// 2022cvt_015
		for (var cnt = 0; cnt < 3; ++cnt) //情報料ならダウンロードの準備をする
		{
// 2022cvt_015
			var is_details = 0 == cnt;
// 2022cvt_015
			var is_info = 1 == cnt;
// 2022cvt_015
			var is_bill = 2 == cnt;

			if (is_info) {
				if (4 == O_clamp.prepare_info()) //ネットワーク暗証番号不正
					{
						is_badpin.value = true;
						return true;
					}
			}

			if (is_bill) O_clamp.prepare_bill();

// 2022cvt_015
			for (var year in A_info) {
// 2022cvt_015
				var A_month = A_info[year];

// 2022cvt_015
				for (var month in A_month) //2007年7月より古いデータは処理しない
				{
// 2022cvt_016
// 2022cvt_015
					var A_type = A_month[month];
					if (parseInt(year) < 2007 || 2007 == parseInt(year) && parseInt(month) < 7) continue;
					if (is_details) O_clamp.prepare_details();

// 2022cvt_016
// 2022cvt_015
					for (var type in A_type) //情報料以外か情報料に応じてスキップする
					{
// 2022cvt_016
// 2022cvt_015
						var dummy = A_type[type];

						if (is_details) {
// 2022cvt_016
							if (!(-1 !== O_clamp.get_type_details().indexOf(type)) && !(-1 !== O_clamp.get_type_comm().indexOf(type))) continue;
						} else if (is_info) {
// 2022cvt_016
							if (!(-1 !== O_clamp.get_type_info().indexOf(type))) continue;
						} else if (is_bill) {
// 2022cvt_016
							if (!(-1 !== O_clamp.get_type_bill().indexOf(type))) continue;
						}

// 2022cvt_015
						var tempdir = this.m_listener_process!.m_path;
						if ("/" != tempdir![tempdir!.length - 1]) tempdir += "/";
// 2022cvt_021
// 2022cvt_016
// 2022cvt_015
						var tgtname = tempdir! + this.m_index + "_" + id.value + "_" + sprintf("%04d%02d", year, month) + type + "%02d.cla";
// 2022cvt_015
						var A_files = Array();
// 2022cvt_016
// 2022cvt_015
						var rval = await O_clamp.get_file(A_files, parseInt(year), parseInt(month), type, tgtname, tempdir);

						if (4 == rval) //ネットワーク暗証番号不正
							{
								is_badpin.value = true;
								return true;
							} else if (3 == rval) //サイト構成変更?
							{
								is_change.value = true;
							} else if (2 == rval) //ログインが割り込まれた
							{
								is_break.value = true;
							}

// 2022cvt_015
						for (var fname of A_files) {
							if (!this.processGzip(fname, "true")) {
								this.putError(G_SCRIPT_ERROR, `GZIP圧縮失敗${fname}`);
								// O_clamp = null;
								return false;
							}

// 2022cvt_016
							A_info[year][month][type].push(fname + ".gz");
						}

						if (is_break.value || is_change.value) {
							// O_clamp = null;
							return true;
						}
					}
				}
			}
		}

		if (is_daily.value) //wayが0なら請求内訳,1なら料金明細
			{
// 2022cvt_015
				for (var way = 0; way < 2; ++way) //ダウンロード可能な年月を取り出す
				{
// 2022cvt_016
// 2022cvt_015
					var A_type2 = way ? O_clamp.get_type_daily() : O_clamp.get_type_p();
// 2022cvt_015
					var A_A_ym = Array();

					if (way) {
						if (4 == O_clamp.prepare_daily(A_A_ym)) //ネットワーク暗証番号不正
							{
								is_badpin.value = true;
								return true;
							}
					} else {
						O_clamp.prepare_p(A_A_ym);
					}

					if (!A_A_ym.length) {
						this.putError(G_SCRIPT_INFO, "日次情報" + (way ? "料金明細" : "請求内訳") + "年月無し" + id);
					} else //最新のデータを取り出す
						{
// 2022cvt_015
							var A_ym = A_A_ym[A_A_ym.length - 1];
// 2022cvt_015
							year = A_ym.year;
// 2022cvt_015
							month = A_ym.month;

// 2022cvt_016
// 2022cvt_015
							for (var type2 of A_type2) {
								tempdir = this.m_listener_process!.m_path;
								if ("/" != tempdir![tempdir!.length - 1]) tempdir += "/";
// 2022cvt_021
// 2022cvt_016
								tgtname = tempdir! + this.m_index + "_" + id.value + "_" + sprintf("%04d%02d", year, month) + type2 + "%02d.cla";
								A_files = Array();
// 2022cvt_016
								rval = await O_clamp.get_file(A_files, parseInt(year), parseInt(month), type2, tgtname, tempdir);

								if (4 == rval) //ネットワーク暗証番号不正
									{
										is_badpin.value = true;
										return true;
									} else if (3 == rval) //サイト構成変更?
									{
										is_change.value = true;
									} else if (2 == rval) //ログインが割り込まれた
									{
										is_break.value = true;
									}

// 2022cvt_015
								var A_gz = Array();

// 2022cvt_015
								for (var fname of A_files) {
									if (!this.processGzip(fname, "true")) {
										this.putError(G_SCRIPT_ERROR, `GZIP圧縮失敗${fname}`);
										// O_clamp = null;
										return false;
									}

									A_gz.push(fname + ".gz");
								}

// 2022cvt_015
								var A_item = {
									year: year,
									month: month,
// 2022cvt_016
									type: type2,
									fname: A_gz
								};
								A_daily.push(A_item);

								if (is_break || is_change) {
									// O_clamp = null;
									return true;
								}
							}
						}
				}
			}

		// O_clamp = null;
		return true;
	}

	async getReqYM(O_db: ScriptDB, id: { [key: string]: string }, A_ym: any[], is_admin: { [key: string]: boolean }) //管理用なら、すべてログインさせる
	//clampweb_ready_tbから、管理用IDのレコードを取り出す
	{
		A_ym = Array();

		if (is_admin.value) {
			return true;
		}

// 2022cvt_015
		var sql = "select index_tb.clampid";
		sql += " from clampweb_index_tb as index_tb";
		sql += " where coalesce(index_tb.is_admin,false)=true";
		sql += " and length(coalesce(index_tb.clampid,''))>0";
		sql += " and length(coalesce(index_tb.clamppassword,''))>0";
		sql += " order by detailno";
		sql += " limit 1";
		sql += ";";
// 2022cvt_015
		var result = await O_db.getAll(sql);

		if (0 == result.length) {
			this.putError(G_SCRIPT_WARNING, "ログイン検査用アカウントが存在しない");
			return true;
		}

// 2022cvt_015
		var admin_id = result[0][0];
		sql = "select ready_tb.year,ready_tb.month";
		sql += " from clampweb_index_tb as index_tb";
		sql += " left join clampweb_ready_tb as ready_tb";
		sql += " on index_tb.env=ready_tb.env";
		sql += " and index_tb.pactid=ready_tb.pactid";
		sql += " and index_tb.detailno=ready_tb.detailno";
		sql += " where index_tb.clampid='" + O_db.escape(admin_id) + "'";
		sql += " and ready_tb.dldate is not null";
		sql += " group by ready_tb.year,ready_tb.month";
		sql += " order by ready_tb.year,ready_tb.month";
		sql += ";";
		result = await O_db.getAll(sql);

// 2022cvt_015
		for (var A_line of result) {
// 2022cvt_015
			var year = A_line[0];
// 2022cvt_015
			var month = A_line[1];
			A_ym.push({
				year: year,
				month: month
			});
		}

		return true;
	}

	async recover(O_db: ScriptDB, id: { [key: string]: string }, password: { [key: string]: string }, is_hotline: { [key: string]: boolean }, is_fail: { [key: string]: boolean }, login_status_orig: number) {
// 2022cvt_015
		var login_fault = false;

		if (1 == this.m_check_admin) {
			login_fault = true;
		} else if (2 == this.m_check_admin) {
			login_fault = false;
		} else //検査用アカウントのIDとパスワードを取得
			//ここではclampweb_index_tbをロックしない
			//検査用アカウントでログイン
			{
// 2022cvt_015
				var sql = "select index_tb.clampid,index_tb.clamppassword,index_tb.cookie1,pin";
				sql += " from clampweb_index_tb as index_tb";
				sql += " where coalesce(index_tb.is_admin,false)=true";
				sql += " and length(coalesce(index_tb.clampid,''))>0";
				sql += " and length(coalesce(index_tb.clamppassword,''))>0";
				sql += " order by detailno";
				sql += " limit 1";
				sql += ";";
// 2022cvt_015
				var result = await O_db.getAll(sql);

				if (0 == result.length) {
					this.putError(G_SCRIPT_WARNING, "ログイン検査用アカウントが存在しない");
					login_fault = true;
				}

// 2022cvt_015
				var admin_id = result[0][0];
// 2022cvt_015
				var admin_password = result[0][1];
// 2022cvt_015
				var admin_cookie1 = result[0][2];
// 2022cvt_015
				var admin_pin = result[0][3];

				if (!login_fault) {
					try {
// 2022cvt_016
// 2022cvt_015
						var O_clamp: download_docomo_type = new download_docomo_type(this.m_listener, this.m_proxy_host, this.m_proxy_port, this.m_proxy_param);
// 2022cvt_015
						var login_status = O_clamp.login(admin_id, admin_password, admin_cookie1, admin_pin);
						// O_clamp = null;
					} catch (e) {
						login_status = 4;
					}

					if (0 != login_status) {
						this.putError(G_SCRIPT_WARNING, "ログイン検査用アカウントでのログインができなかった/" + "クランプサイトが作業中の可能性" + admin_id);
						login_fault = true;
					}
				}

				this.m_check_admin = login_fault ? 1 : 2;
			}

		if (login_fault) {
			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
			sql = "update clampweb_index_tb set is_try=true";
			sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
			this.endDB(true);
			this.unlockWeb(O_db);
			return false;
		} else //ホットライン・V2とも、error_tbにメッセージ追加
			//警告メールにメッセージ出力
			//ログイン失敗フラグを立てる
			{
				this.beginDB();
				sql = "select env,pactid from clampweb_index_tb" + " where clampid='" + O_db.escape(id.value) + "'" + " group by env,pactid" + ";";
				result = await O_db.getAll(sql);

				if (0 == result.length) {
					this.putError(G_SCRIPT_WARNING, `ホットライン型顧客のエラー出力先が確定できず/${id.value}`);
				} else {
					O_db.lock("clampweb_error_tb");

// 2022cvt_015
					for (var A_line of result) {
// 2022cvt_015
						var env = A_line[0];
// 2022cvt_015
						var pactid = A_line[1];
// 2022cvt_015
						var message = "login";
						sql = "insert into clampweb_error_tb" + "(env,pactid,carid,message,fixdate)" + "values(" + env + "," + pactid + "," + G_CARRIER_DOCOMO + ",'" + O_db.escape(message) + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
					}
				}

				this.endDB(true);
				sql = "select env,pactid,compname from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id.value) + "'";
				sql += " group by env,pactid,compname";
				sql += ";";
				result = await O_db.getAll(sql);
// 2022cvt_015
				var msg = `ログイン失敗/${id.value}`;
				if (5 == login_status_orig) msg = `IDがロックされていたためログイン失敗/${id.value}`;else if (1 == login_status_orig) msg = `ID・パスワードが違うためログイン失敗/${id.value}`;

// 2022cvt_015
				for (var A_line of result) {
					msg += "/" + A_line[2] + "(" + A_line[0] + ":" + A_line[1] + ")";
				}

// 2022cvt_015
				var status = G_SCRIPT_INFO;
				if (5 == login_status_orig || 3 == login_status_orig) status = G_SCRIPT_WARNING;
				this.putError(status, msg);
				is_fail.value = true;
			}

		return true;
	}

	async storeFile(O_db: ScriptDB, is_try_admin: { [key: string]: boolean }, id: { [key: string]: string }, password: { [key: string]: string }, A_info: Array<any>, is_login: { [key: string]: boolean }, is_break: { [key: string]: boolean }, is_change: { [key: string]: boolean }, is_unfinished: { [key: string]: boolean }, is_unregisted: { [key: string]: boolean }, is_badcookie: { [key: string]: boolean }, is_badpin: { [key: string]: boolean }, is_admin: { [key: string]: boolean }, is_fail: { [key: string]: boolean }, is_daily: { [key: string]: boolean }, A_daily: Array<any>, is_lock: { [key: string]: boolean }) //ダウンロードが必要な環境・年月・ファイル種別を取得
	//必要なものだけを格納
	//一個でもファイルをインポートしたらtrue
	//すべてのファイルを削除
	//管理用を試行したらフラグを立てる
	{
// 2022cvt_015
		var sqlym = this.getYearMonth();
// 2022cvt_016
// 2022cvt_015
		var sql = "select type_tb.env,type_tb.pactid,type_tb.detailno";
// 2022cvt_016
		sql += ",type_tb.year,type_tb.month,type_tb.type";
// 2022cvt_016
		sql += " from clampweb_type_tb as type_tb";
		sql += " left join clampweb_index_tb as index_tb";
// 2022cvt_016
		sql += " on type_tb.env=index_tb.env";
// 2022cvt_016
		sql += " and type_tb.pactid=index_tb.pactid";
// 2022cvt_016
		sql += " and type_tb.detailno=index_tb.detailno";
		sql += " where index_tb.clampid='" + O_db.escape(id.value) + "'";
// 2022cvt_016
		sql += " and coalesce(type_tb.is_ready,false)=false";
		sql += " and " + sqlym;
		sql += ";";
// 2022cvt_015
		var result = Array();

		if (is_break.value || is_change.value || is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value) //ログインが割り込まれたか、サイト構成変更されたので、
			//ダウンロード済みのファイルは保存せずに削除する
			//ログインが割り込まれた場合は警告を出す
			{
// 2022cvt_015
				var errmsg = "";
				if (is_change.value) errmsg += "サイト構成変更";
				if (is_break.value) errmsg += "ログインが割り込まれた";
				if (is_unfinished.value) errmsg += "申込が未完成なのでMyDocomoから申込が必要";
				if (is_unregisted.value) errmsg += "二段階認証が有効だが端末登録されていない";
				if (is_badcookie.value) errmsg += "二段階認証の端末クッキーが無効になった(再登録が必要)";
				if (is_badpin.value) errmsg = "ネットワーク暗証番号が不正";
				errmsg += "/clampid:=" + id.value;
				sql = "select pactid from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id.value) + "'";
				sql += " group by pactid";
				sql += " order by pactid";
				sql += ";";
// 2022cvt_015
				var A_pactid = await O_db.getHash(sql);

// 2022cvt_015
				for (var H_pactid of A_pactid) errmsg += "/pactid:=" + H_pactid.pactid;

				if (is_break.value || is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value) {
					this.putError(G_SCRIPT_WARNING, errmsg);
				}
			} else {
			result = await O_db.getAll(sql);
		}

// 2022cvt_015
		var is_in_all = false;

// 2022cvt_015
		for (var A_line of result) {
// 2022cvt_015
			var env = A_line[0];
// 2022cvt_015
			var pactid = A_line[1];
// 2022cvt_015
			var detailno = A_line[2];
// 2022cvt_015
			var year = A_line[3];
// 2022cvt_015
			var month = A_line[4];
// 2022cvt_016
// 2022cvt_015
			var type = A_line[5];

// 2022cvt_016
			if (undefined !== A_info[year] && undefined !== A_info[year][month] && undefined !== A_info[year][month][type]) //一個でもファイルをインポートしたらtrue
				{
// 2022cvt_016
// 2022cvt_015
					var A_fname = A_info[year][month][type];
					if (0 == A_fname.length) continue;
// 2022cvt_015
					var is_in = false;
// 2022cvt_015
					var fidx = 0;

// 2022cvt_015
					for (var fname of A_fname) //ファイルをインポート
					{
// 2022cvt_015
						var fid = O_db.loImport(fname);

						if (!fid) {
							this.putError(G_SCRIPT_ERROR, "loImport");
							return false;
						}

// 2022cvt_016
						sql = "insert into clampweb_details_tb" + "(env,pactid,detailno,year," + "month,type,idx,fid,fixdate)" + "values(" + env + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + O_db.escape(type) + "'" + "," + fidx + "," + fid + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
						++fidx;
						is_in = true;
						is_in_all = true;
					}

// 2022cvt_016
					if (is_in) //clampweb_type_tbのis_readyをtrueに設定
						//clampweb_ready_tbのdldateを更新
						{
// 2022cvt_016
							sql = "update clampweb_type_tb set is_ready=true";
							sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
							sql += " where env=" + env;
							sql += " and pactid=" + pactid;
							sql += " and detailno=" + detailno;
							sql += " and year=" + year;
							sql += " and month=" + month;
// 2022cvt_016
							sql += " and type='" + O_db.escape(type) + "'";
							sql += ";";
							this.putError(G_SCRIPT_SQL, sql);
							O_db.query(sql);
							sql = "select count(*) from clampweb_ready_tb";
							sql += " where env=" + env;
							sql += " and pactid=" + pactid;
							sql += " and detailno=" + detailno;
							sql += " and year=" + year;
							sql += " and month=" + month;
							sql += ";";

							if (0 < await O_db.getOne(sql)) //更新
								{
									sql = "update clampweb_ready_tb";
									sql += " set dldate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
									sql += " ,fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
									sql += " where env=" + env;
									sql += " and pactid=" + pactid;
									sql += " and detailno=" + detailno;
									sql += " and year=" + year;
									sql += " and month=" + month;
									sql += ";";
									this.putError(G_SCRIPT_SQL, sql);
									O_db.query(sql);
								} else //追加
								{
									sql = "insert into clampweb_ready_tb";
									sql += "(env,pactid,detailno,year," + "month,dldate,fixdate)";
									sql += "values";
									sql += "(" + env;
									sql += "," + pactid;
									sql += "," + detailno;
									sql += "," + year;
									sql += "," + month;
									sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
									sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
									sql += ")";
									sql += ";";
									this.putError(G_SCRIPT_SQL, sql);
									O_db.query(sql);
								}
						}
				}
		}

// 2022cvt_015
		for (var year2 in A_info) {
// 2022cvt_015
			var A_month = A_info[year2];

// 2022cvt_015
			for (var month2 in A_month) {
// 2022cvt_016
// 2022cvt_015
				var A_type = A_month[month2];

// 2022cvt_016
// 2022cvt_015
				for (var type2 in A_type) {
// 2022cvt_016
// 2022cvt_015
					var A_fname = A_type[type2];

// 2022cvt_015
					for (var fname of A_fname) {
						if (fs.existsSync(fname)) {
						// if (file_exists(fname)) {
							fs.unlinkSync(fname);
							// fs.unlink(fname);// 2022cvt_007
						} else {
							this.putError(is_change.value || is_break.value || is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value ? G_SCRIPT_BATCH : G_SCRIPT_WARNING, "削除するファイルが見つからない(処理続行)" + fname);
						}
					}
				}
			}
		}

		if (is_daily.value && A_daily.length) //日次ファイルを保存する
			//保存が必要な環境・顧客ID・クランプ連番を取り出す
			//日次のgzファイルを削除する
			{
				sql = "select env,pactid,detailno from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id.value) + "'";
				sql += " and coalesce(is_daily,false)=true";
				sql += ";";

				if (is_break.value || is_change.value || is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value) //ログインが割り込まれたかサイト構成変更を検出したので保存しない
					{
// 2022cvt_015
						var A_pact = Array();
					} else {
					A_pact = await O_db.getHash(sql);
				}

// 2022cvt_015
				for (var H_pact of A_pact) {
// 2022cvt_015
					for (var H_daily of A_daily) //clampweb_daily_tbから、同一年月種別のレコードを削除する
					//clampweb_daily_tbに、レコードを挿入する
					{
						sql = "select fid from clampweb_daily_tb";
						sql += " where env=" + H_pact.env;
						sql += " and pactid=" + H_pact.pactid;
						sql += " and detailno=" + H_pact.detailno;
						sql += " and year=" + H_daily.year;
						sql += " and month=" + H_daily.month;
// 2022cvt_016
						sql += " and type='" + O_db.escape(H_daily.type) + "'";
						sql += ";";
// 2022cvt_015
						var A_fid = await O_db.getHash(sql);

// 2022cvt_015
						for (var H_fid of A_fid) //削除に失敗しても処理を続ける
						{
							O_db.loUnlink(H_fid.fid, false);
						}

						sql = "delete from clampweb_daily_tb";
						sql += " where env=" + H_pact.env;
						sql += " and pactid=" + H_pact.pactid;
						sql += " and detailno=" + H_pact.detailno;
						sql += " and year=" + H_daily.year;
						sql += " and month=" + H_daily.month;
// 2022cvt_016
						sql += " and type='" + O_db.escape(H_daily.type) + "'";
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
// 2022cvt_015
						var idx = 0;

// 2022cvt_015
						for (var fname of H_daily.fname) //ファイルをインポート
						{
							fid = O_db.loImport(fname);

							if (!fid.length) {
								this.putError(G_SCRIPT_ERROR, "loImport");
								return false;
							}

// 2022cvt_016
							sql = "insert into clampweb_daily_tb" + "(env,pactid,detailno,year," + "month,type,idx,fid,fixdate)" + "values(" + H_pact.env + "," + H_pact.pactid + "," + H_pact.detailno + "," + H_daily.year + "," + H_daily.month + ",'" + O_db.escape(H_daily.type) + "'" + "," + idx + "," + fid + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							O_db.query(sql);
							++idx;
							is_in_all = true;
						}
					}
				}

// 2022cvt_015
				for (var H_item of A_daily) {
// 2022cvt_015
					for (var fname of H_item.fname) {
						if (fs.existsSync(fname)) {
						// if (file_exists(fname)) {
							fs.unlinkSync(fname);
							// fs.unlink(fname);// 2022cvt_007
						} else {
							this.putError(is_change.value || is_break.value || is_unfinished.value || is_unregisted.value || is_badcookie.value || is_badpin.value ? G_SCRIPT_BATCH : G_SCRIPT_WARNING, "削除するファイルが見つからない(処理続行)" + fname);
						}
					}
				}
			}

		sql = "update clampweb_index_tb set is_running=false";
		if (!this.m_A_id_in.length) sql += ",is_try=true";
		sql += ",is_fail=" + (is_fail.value && !is_lock.value ? "true" : "false");
		sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
		sql += " where clampid='" + O_db.escape(id.value) + "'";
		sql += " and clamppassword='" + O_db.escape(password.value) + "'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		if (is_admin.value) is_try_admin.value = true;

		if (is_admin.value && is_in_all) {
			sql = "update clampweb_index_tb set is_try=false";
			sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += " where clampid!='" + O_db.escape(id.value) + "'";
			sql += " and coalesce(is_admin,false)=false";
			sql += " and coalesce(is_running,false)=false";
			sql += " and coalesce(is_try,false)=true";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
		}

		if (this.m_A_id_in.length || is_daily.value) this.m_A_id_out.push("" + id.value);
		return true;
	}

	getInOut(table_name = "") {
// 2022cvt_015
		var sql = "";
// 2022cvt_015
		var A_id = this.m_A_id_in;

		if (A_id.length) {
			if (table_name.length) sql += table_name + ".";
			sql += "clampid in (";

// 2022cvt_015
			for (var cnt = 0; cnt < A_id.length; ++cnt) {
				if (cnt) sql += ",";
				sql += "'" + this.m_db.escape(A_id[cnt]) + "'";
			}

			sql += ")";
		}

		A_id = this.m_A_id_out;

		if (A_id.length) {
			if (sql.length) sql += " and ";
			if (table_name.length) sql += table_name + ".";
			sql += "clampid not in (";

			for (cnt = 0; cnt < A_id.length; ++cnt) {
				if (cnt) sql += ",";
				sql += "'" + this.m_db.escape(A_id[cnt]) + "'";
			}

			sql += ")";
		}

		return sql;
	}

	getYearMonth(table_name = "") {
		if (table_name.length) table_name = table_name + ".";
// 2022cvt_017
// 2022cvt_015
		var year = new Date().getFullYear();
// 2022cvt_018
// 2022cvt_015
		var month = new Date().getMonth() + 1;
// 2022cvt_015
		var sqlym = "";

// 2022cvt_015
		for (var cnt = 0; cnt < 4; ++cnt) {
			if (sqlym.length) sqlym += " or";
			sqlym += " (" + table_name + "year=" + year + " and " + table_name + "month=" + month + ")";
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		sqlym = "(" + sqlym + ")";
		return sqlym;
	}

};

(() => {
// checkClient(G_CLIENT_BOTH);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_WEB) log = G_LOG_ADMIN_DOCOMO_WEB;
// 2022cvt_015
var proc = new ProcessAdminDocomoWeb(G_PROCNAME_ADMIN_DOCOMO_WEB, log, G_OPENTIME_ADMIN_DOCOMO_WEB);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
})();
