//===========================================================================
//機能：電話利用グラフのために統計情報を電話ごとに集計する
//
//作成：中西
//日付：2009/01/13	新規作成
//===========================================================================

require("script_db.php");

require("script_common.php");

//コンストラクター
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：既存のsim_trend_X_tbとsim_top_telno_X_tbからレコードを削除する
//引数：顧客ID
//キャリアID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tb内に 'tuwasum' と 'packetsum' を作る
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//現在の日付を返す
//DBに書き込む現在日時に使用する
//機能：sim_trend_X_tbから、電話番号が空白のレコードを除外するSQL文を返す
//引数：顧客ID
//テーブル番号
//プレフィックス("tel_tb."を想定)
//返値：ANDで始まるSQL文の一部
class updateTrendGraph extends ScriptDBAdaptor {
	updateTrendGraph(listener, db, table_no) {
		this.ScriptDBAdaptor(listener, db, table_no);
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
		var tm = localtime(Date.now() / 1000, true);
		var yyyy = tm.tm_year + 1900;
		var mm = tm.tm_mon + 1;
		if (mm < 10) mm = "0" + mm;
		var dd = tm.tm_mday + 0;
		if (dd < 10) dd = "0" + dd;
		var hh = tm.tm_hour + 0;
		if (hh < 10) hh = "0" + hh;
		var nn = tm.tm_min + 0;
		if (nn < 10) nn = "0" + nn;
		var ss = tm.tm_sec + 0;
		if (ss < 10) ss = "0" + ss;
		return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
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