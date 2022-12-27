//===========================================================================
//機能：電話利用グラフのために統計情報を電話ごとに集計する
//
//作成：中西
//日付：2009/01/13	新規作成
//===========================================================================

import { ScriptDBAdaptor } from "./script_db";
import { G_SCRIPT_SQL } from "./script_log";

export default class updateTrendGraph extends ScriptDBAdaptor {
	constructor(listener, db, table_no) {
		super(listener, db, table_no);
	}

	delete(pactid, carid, year, month) //sim_trend_X_tbから既存のレコードを削除
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from sim_trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid) + " and code in (" + "'tuwasum'," + "'packetsum'" + ")" + " and length(coalesce(telno,''))>0" + this.getSQLWhereTelno(pactid, carid, table_no);
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, carid, year, month) //現在の日付を得る
	//print "DEBUG: ". $sql . "\n";
	//print "DEBUG: ". $sql . "\n";
	{
		var table_no = this.getTableNo(year, month);
		var sim_trend_X_tb = "sim_trend_" + table_no + "_tb";
		var nowtime = this.getTimestamp();
		this.m_db.begin();
		var sql = "insert into " + sim_trend_X_tb + " select pactid, carid, telno, 'tuwasum', 0, sum(value), '" + nowtime + "'" + " from " + sim_trend_X_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='tuwasec'" + " group by pactid, carid, telno";
		this.m_db.query(sql);
		sql = "insert into " + sim_trend_X_tb + " select pactid, carid, telno, 'packetsum', 0, sum(value), '" + nowtime + "'" + " from " + sim_trend_X_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='packetcnt'" + " group by pactid, carid, telno";
		this.m_db.query(sql);
		this.m_db.commit();
		return true;
	}

	getTimestamp() {
		var tm_time = new Date().toISOString().replace('T',' ');
		var tm = tm_time.substring(0, tm_time.length - 5) + ' +09';
		return tm;
	}

	getSQLWhereTelno(pactid, carid, table_no, prefix = "") {
		var sql = " and " + prefix + "telno in (";
		sql += " select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += " and length(telno)>0";
		sql += " group by telno";
		sql += " )";
		return sql;
	}

};
