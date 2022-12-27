//機能：最新回線数更新プロセス(alert.phpから機能分離)
//
//作成：森原


import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { ProcessCarid } from "./lib/process_base";
import UpdateRecentTelcntDocomo from "./lib/update_recent_telcnt_docomo";


const G_PROCNAME_RECENT_TELCNT = "recent_telcnt";
const G_OPENTIME_RECENT_TELCNT = "0000,2400";

export default class ProcessRecentTelcnt extends ProcessCarid {
	ProcessCarid: any;

	ProcessRecentTelcnt(procname: string, logpath: string, opentime: string) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "最新回線数更新プロセス";
	}

	async executePactid_c(pactid: number, logpath: string) //ホットラインか
	{
		var is_hotline = false;
		var sql = "select count(*) from pact_tb";
		sql += " where pactid=" + pactid;
		sql += " and coalesce(type,'')='H'";
		sql += ";";
		if (0 < await this.m_db.getOne(sql)) is_hotline = true;
		var no = this.getTableNo();
		var telcnt = new UpdateRecentTelcntDocomo(this.m_listener, this.m_db, this.m_table_no);
		if (!telcnt.execute(pactid, no, is_hotline)) return false;
		return true;
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessRecentTelcnt(G_PROCNAME_RECENT_TELCNT, log, G_OPENTIME_RECENT_TELCNT);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
