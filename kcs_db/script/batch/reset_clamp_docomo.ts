//===========================================================================
//機能：クランプダウンロード試行期間切り替えプロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：クランプダウンロード試行期間切り替えプロセス(ドコモ専用)


import { G_CLAMP_ENV } from "../../conf/batch_setting";
import { G_LOG, G_LOG_ADMIN_DOCOMO_WEB } from "../../db_define/define";
import { ProcessBase, ProcessDefault } from "./lib/process_base";
import { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_INFO, G_SCRIPT_SQL } from "./lib/script_log";


export const G_PROCNAME_RESET_CLAMP_DOCOMO = "reset_clamp_docomo";
export const G_OPENTIME_RESET_CLAMP_DOCOMO = "0000,2400";


export default class ProcessResetClampDocomo extends ProcessBase {
	m_db_temp: ScriptDB;

	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);

		if (global.G_dsn != global.G_dsn_temp) {
			this.m_db_temp = new ScriptDB(this.m_listener, global.G_dsn_temp);
		} else this.m_db_temp = this.m_db;
	}

	getProcname() {
		return "クランプダウンロード試行期間切り替えプロセス(ドコモ専用)";
	}

	begin_0() {
		if (!super.begin()) return false;
		return this.lockWeb(this.m_db_temp, "lock_regist_" + G_CLAMP_ENV);
	}

	end(status: boolean) {
		if (!this.unlockWeb(this.m_db_temp)) return false;
		return super.end(status);
	}

	beginDB() {
		this.m_db.begin();
		if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.begin();
		return true;
	}

	endDB(status: boolean) {
		if (this.m_debugflag) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	async do_execute() {
		if (!this.beginDB()) return false;
		var status = this.resetClamp(this.m_db_temp);
		return this.endDB(status);
	}

	resetClamp(O_db) {
		var sql = "select count(*) from clampweb_function_tb" + " where command='reset'" + ";";

		if (0 == O_db.getOne(sql)) {
			sql = "insert into clampweb_function_tb" + "(command,fixdate)" + "values(" + "'reset'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
		}

		return true;
	}

};

// checkClient(G_CLIENT_BOTH);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_WEB) log = G_LOG_ADMIN_DOCOMO_WEB;
// 2022cvt_015
var proc = new ProcessResetClampDocomo(G_PROCNAME_RESET_CLAMP_DOCOMO, log, G_OPENTIME_RESET_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
