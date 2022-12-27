
import {ProcessDefault} from '../batch/lib/process_base';
import { ClampFileTb } from '../batch/lib/clampfile_tb';
import { ScriptDB } from '../batch/lib/script_db';
import { G_SCRIPT_INFO, G_SCRIPT_SQL } from '../batch/lib/script_log';
import { G_CARRIER_DOCOMO, G_CLAMPFILE_STATUS_START } from '../batch/lib/script_common';
import { G_LOG } from '../../db_define/define';

const G_PROCNAME_BEGIN_CLAMP_DOCOMO = "begin_clamp_docomo";
const G_OPENTIME_BEGIN_CLAMP_DOCOMO = "0000,2400";

class ProcessBeginClampDocomo extends ProcessDefault {

	m_db_temp: any;
	ProcessDefault: any;
	
	ProcessBeginClampDocomo(procname: string, logpath: any, opentime: any) {
		this.ProcessDefault(procname, logpath, opentime);

		// if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) {
			this.m_db_temp = new ScriptDB(this.m_listener, global.G_dsn_temp);
		} else this.m_db_temp = this.m_db;
	}

	getProcname() {
		return "クランプダウンロード日次処理開始プロセス(ドコモ専用)";
	}

	beginDB() {
		this.m_db.begin();
		if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) this.m_db_temp.begin();
		return true;
	}

	endDB(status: any) {
		if (this.m_debugflag) {
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (JSON.stringify(global.G_dsn).localeCompare(JSON.stringify(global.G_dsn_temp))) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	async executePactid(pactid: any, logpath: any) //clamptemp_tbを削除する
	//実際のコピー部分
	{
		// var clamptemp = new ClampFileTb(this.m_listener, this.m_db_temp, this.m_table_no, "clamptemp_tb", ".cla.gz");
		var clamptemp = new ClampFileTb(this.m_listener, this.m_db_temp, this.m_table_no, "clamptemp_tb", ".cla.gz");
		if (!clamptemp.init(pactid, G_CARRIER_DOCOMO, this.m_year, this.m_month)) return false;
		if (!clamptemp.unlink(false)) return false;
		var sql = "select type,detailno from clampfile_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(this.m_year.toString());
		sql += " and month=" + this.m_db.escape(this.m_month.toString());
		sql += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO.toString());
		sql += " and status=" + this.m_db.escape(G_CLAMPFILE_STATUS_START.toString());
		sql += " order by detailno,type";
		sql += ";";
		var result = await this.m_db.getHash(sql);

		// for (var line of Object.values(result) as any) {
		for (var line of result) {
			sql = "insert into clamptemp_tb";
			sql += "(pactid,year,month,carid,type,fid,status,recdate,fixdate";
			sql += ",detailno)values";
			sql += "(" + pactid;
			sql += "," + this.m_year;
			sql += "," + this.m_month;
			sql += "," + G_CARRIER_DOCOMO;
			sql += ",'" + line.type + "'";
			sql += "," + "''";
			sql += "," + G_CLAMPFILE_STATUS_START;
			// sql += ",'" + date("Y-m-d H:i:s") + "'";
			sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += "," + line.detailno;
			sql += ")";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db_temp.query(sql);
		}

		return true;
	}

};

(() => {
// checkClient(script_common.G_CLIENT_BOTH);
var proc = new ProcessBeginClampDocomo(G_PROCNAME_BEGIN_CLAMP_DOCOMO, G_LOG, G_OPENTIME_BEGIN_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
});