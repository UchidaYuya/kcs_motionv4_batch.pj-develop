//===========================================================================
//機能：tel_details_X_tbからtrend_X_tbを作る(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：tel_details_X_tbからtrend_X_tbを作る(ドコモ専用)

require("script_db.php");

require("script_common.php");

//データ挿入型
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入型
//機能：既存のtrend_X_tbからレコードを削除する
//引数：顧客ID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：trend_X_tbにレコードを作る
//引数：顧客ID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：trend_X_tbへの挿入を行う
//引数：plan_predata_tbのカラム名からFetchAdaptorへのハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：基本料割引率を求めるSQL文を作って返す
//備考：基本料割引率 := ( 基本料割引額 * 100 / 基本料 ) を四捨五入。
//基本料 := utiwake_tb.kamokuが0で、details_X_tb.chargeがプラス。
//基本料割引額 := utiwake_tb.kamokuが1
//+ utiwake_tb.kamokuが0で、chargeがマイナス。
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：通話通信料割引率を求めるSQL文を作って返す
//備考：通話通信料割引率 := ( 通話通信料割引額 * 100 / 通話通信料 )
//通話通信料 := utiwake_tb.kamokuが2(通話料)と4(通信料)のプラス
//通話通信料割引額 := utiwake_tb.kamokuが3(通話料割引)と5(通信料割引)
//+ utiwake_tb.kamokuが2(通話料)と4(通信料)のマイナス
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：標準通話料を求めるSQL文を作って返す
//備考：標準通話料 := 通話料 / plan_tb.tuwaratio
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：標準パケット数を求めるSQL文を作って返す(パケットパック考慮せず)
//備考：標準パケット数 := 通信料 / 0.3(FOMAなら0.2)
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：標準パケット数を求めるSQL文を作って返す(パケットパック考慮)
//備考：標準パケット数 := 通信料 / packet_tb.charge
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：標準パケット数を求めるSQL文を作って返す(新データプラン専用)
//備考：標準パケット数 := 通信料(2P6,2P7) / plan_tb.tusinratio
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：標準パケット数を求めるSQL文を作って返す(通話明細反映用)
//備考：標準パケット数 := commhistoryの'p'か'P'のbyte / 128
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：基本料合計・通話通信料合計・その他合計を求めるSQL文を作って返す
//備考：基本料合計 := sum(kamokuが0,1のcharge)
//通話通信料合計 := sum(kamokuが2,3,4,5,8のcharge)
//その他合計 := sum(kamokuが6のcharge)消費税は入れない
//いずれも、utiwake_tb.planflgでの絞り込みを行わないかわりに、
//details_X_tb.codeがASP,ASXでないものを選択する。
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：SQL文のWHERE節のうち、電話番号での絞り込み部分を作成する
//引数：テーブル名(末尾にピリオドをつけない事)
//電話番号を表すカラム名
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//テーブル番号
//顧客ID
//返値：空文字列か、「 AND」から始まるWHERE節の条件部分を返す
class UpdatePredataDocomo extends ScriptDBAdaptor {
	UpdatePredataDocomo(listener, db, table_no, inserter) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_inserter = inserter;
	}

	delete(pactid, year, month, A_telno, A_skip, fname) //trend_X_tbをバックアップ
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and code in (5)" + " and length(coalesce(telno,''))>0";
		sqlfrom += this.getSQLWhereTelno("", "telno", A_telno, A_skip, table_no, pactid);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, year, month, A_telno, A_skip) //挿入準備
	//fetchAdaptorを格納するハッシュ
	//基本料割引率
	//通話通信料割引率
	//標準通話料
	//標準パケット数(パケットパック考慮せず)
	//標準パケット数(パケットパック考慮)
	//標準パケット数(新データプラン専用)
	//標準パケット数(通話明細から読み出す)
	//基本料合計・通話通信料合計・その他合計
	{
		var table_no = this.getTableNo(year, month);
		if (!this.m_inserter.begin("trend_" + table_no + "_tb")) return false;
		var const = {
			pactid: pactid,
			carid: G_CARRIER_DOCOMO,
			recdate: "now()",
			code: 5
		};

		if (!this.m_inserter.setConst(const)) {
			this.putError(G_SCRIPT_ERROR, "inserter->setConst\u5931\u6557");
			return false;
		}

		var H_fetch = Array();
		H_fetch.disratiobasic = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.disratiobasic.query(this.getSQLDisratioBasic(pactid, table_no, A_telno, A_skip));
		H_fetch.disratiotalk = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.disratiotalk.query(this.getSQLDisratioTalk(pactid, table_no, A_telno, A_skip));
		H_fetch.stdtalk = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.stdtalk.query(this.getSQLStdTalk(pactid, table_no, A_telno, A_skip));
		H_fetch.stdcomm = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.stdcomm.query(this.getSQLStdComm(pactid, table_no, A_telno, A_skip));
		H_fetch.stdcommpacketpack = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.stdcommpacketpack.query(this.getSQLStdCommPacketPack(pactid, table_no, A_telno, A_skip));
		H_fetch.stdcommdataplannew = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.stdcommdataplannew.query(this.getSQLStdCommDataPlanNew(pactid, table_no, A_telno, A_skip));
		H_fetch.stdcommcommhistory = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.stdcommcommhistory.query(this.getSQLStdCommCommhistory(pactid, table_no, A_telno, A_skip));
		H_fetch.basic = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.basic.query(this.getSQLBasic(pactid, table_no, A_telno, A_skip));
		var status = this.do_execute(H_fetch);

		if (!this.m_inserter.end()) {
			this.putError(G_SCRIPT_ERROR, "inserter->end\u5931\u6557");
			status = false;
		}

		for (var fetch of Object.values(H_fetch)) fetch.free();

		return status;
	}

	do_execute(H_fetch) //基本料合計からレコードを取り出して、それに合致する値を取り出す
	{
		var param;
		var H_index = {
			disratiobasic: 0,
			disratiotalk: 1,
			stdtalk: 2,
			stdcomm: 3,
			basesum: 4,
			talksum: 5,
			othersum: 6
		};
		var keys = ["disratiobasic", "disratiotalk", "stdtalk", "stdcomm"];

		while (param = H_fetch.basic.fetchNext()) //trend_Xに追加する電話番号
		//パケットパックを考慮した値があれば、そちらを優先する
		{
			var telno = param.telno;

			for (var key of Object.values(keys)) {
				var line = H_fetch[key].fetch(telno);
				if (!(undefined !== line)) param[key] = 0;else param[key] = line[key];
			}

			line = H_fetch.stdcommpacketpack.fetch(telno);
			if (undefined !== line && undefined !== line.stdcomm) param.stdcomm = line.stdcomm;
			line = H_fetch.stdcommdataplannew.fetch(telno);
			if (undefined !== line && undefined !== line.stdcomm) param.stdcomm = line.stdcomm;
			line = H_fetch.stdcommcommhistory.fetch(telno);
			if (undefined !== line && undefined !== line.stdcomm) param.stdcomm = line.stdcomm;

			for (var name in H_index) {
				var key = H_index[name];
				var value = 0;
				if (undefined !== param[name]) value = param[name];
				var ins = {
					telno: telno,
					key: key,
					value: value
				};

				if (!this.m_inserter.insert(ins)) {
					this.putError(G_SCRIPT_WARNING, "inserter->insert");
					return false;
				}
			}
		}

		return true;
	}

	getSQLDisratioBasic(pactid, table_no, A_telno, A_skip) //取り出すカラムを指定(telnoとdisratiobasic)
	//sum(
	//cast(
	//sum(
	//cast(
	//coalesce(
	//round(
	//FROM節(tel_details_X_tb inner join utiwake_tb)
	//WHERE節(kamoku in (0,1) and pactid,carid,telno)
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(";
		sql += "coalesce(";
		sql += "cast(";
		sql += "sum(";
		sql += "case when utiwake_tb.kamoku=0 and details_tb.charge<0";
		sql += " then details_tb.charge";
		sql += " when utiwake_tb.kamoku=1";
		sql += " then details_tb.charge";
		sql += " end";
		sql += ") * -100 as real";
		sql += ")";
		sql += "/";
		sql += "cast(";
		sql += "sum(";
		sql += " case when details_tb.charge>0";
		sql += " then details_tb.charge";
		sql += " end";
		sql += ") as real";
		sql += ")";
		sql += ",0)";
		sql += ") as disratiobasic";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and (utiwake_tb.kamoku=0 or utiwake_tb.kamoku=1)";
		sql += " and details_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and utiwake_tb.planflg = true";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLDisratioTalk(pactid, table_no, A_telno, A_skip) //取り出すカラムを指定(telnoとdisratiotalk)
	//sum(
	//cast(
	//sum(
	//cast(
	//coalesce(
	//round(
	//FROM節(tel_details_X_tb inner join utiwake_tb)
	//WHERE節(kamoku in (2,3,4,5) and pactid,carid,telno)
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(";
		sql += "coalesce(";
		sql += "cast(";
		sql += "sum(";
		sql += "case";
		sql += " when utiwake_tb.kamoku = 3 then details_tb.charge";
		sql += " when utiwake_tb.kamoku = 5 then details_tb.charge";
		sql += " when utiwake_tb.kamoku = 2 and details_tb.charge < 0";
		sql += " then details_tb.charge";
		sql += " when utiwake_tb.kamoku = 4 and details_tb.charge < 0";
		sql += " then details_tb.charge";
		sql += " end";
		sql += ") * -100 as real";
		sql += ")";
		sql += "/";
		sql += "cast(";
		sql += "sum(";
		sql += "case";
		sql += " when utiwake_tb.kamoku = 2 and details_tb.charge > 0";
		sql += " then details_tb.charge";
		sql += " when utiwake_tb.kamoku = 4 and details_tb.charge > 0";
		sql += " then details_tb.charge";
		sql += " end";
		sql += ") as real";
		sql += ")";
		sql += ",0)";
		sql += ") as disratiotalk";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and (utiwake_tb.kamoku='2' or utiwake_tb.kamoku='3'";
		sql += " or utiwake_tb.kamoku='4' or utiwake_tb.kamoku='5' )";
		sql += " and details_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and utiwake_tb.planflg = true";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLStdTalk(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとstdtalk)
	//sum(
	//round(
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamoku=2 and pactid,carid,invflag,planflg
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(";
		sql += "sum(";
		sql += "details_tb.charge";
		sql += ")";
		sql += "/";
		sql += "plan_tb.tuwaratio";
		sql += ") as stdtalk";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb";
		sql += " on (plan_tb.planid=tel_tb.planid";
		sql += " and plan_tb.carid=tel_tb.carid)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(G_CARRIER_DOCOMO);
		sql += " and plan_tb.invflg = true";
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.kamoku = 2";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno, plan_tb.tuwaratio";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLStdComm(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとstdcomm)
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb
	//WHERE節(kamoku=4 and pactid,carid,planflg)
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(sum(details_tb.charge)/";
		sql += "(case when tel_tb.cirid=" + G_CIRCUIT_FOMA + " then " + G_PACKET_CHARGE_FOMA + " else " + G_PACKET_CHARGE + " end)";
		sql += ") as stdcomm";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(G_CARRIER_DOCOMO);
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.kamoku = 4";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno,tel_tb.cirid";
		sql += " order by details_tb.telno,tel_tb.cirid";
		sql += ";";
		return sql;
	}

	getSQLStdCommPacketPack(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとstdcomm)
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- packet_tb
	//WHERE節(kamoku=4 and pactid,carid,planflg,invflg)
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(sum(details_tb.charge) / packet_tb.charge)";
		sql += " as stdcomm";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " inner join packet_tb";
		sql += " on (packet_tb.packetid=tel_tb.packetid";
		sql += " and packet_tb.carid=tel_tb.carid)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(G_CARRIER_DOCOMO);
		sql += " and packet_tb.invflg = true";
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.kamoku = 4";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno, packet_tb.charge";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLStdCommDataPlanNew(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとstdcomm)
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(code=2P6... and pactid,carid,planflg,invflg,simway)
	//GROUP BYとORDER BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",round(sum(details_tb.charge) / plan_tb.tusinratio)";
		sql += " as stdcomm";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb";
		sql += " on (plan_tb.planid=tel_tb.planid";
		sql += " and plan_tb.carid=tel_tb.carid)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(G_CARRIER_DOCOMO);
		sql += " and plan_tb.invflg = true";
		sql += " and plan_tb.simway=" + this.escape(G_SIMWAY_DATA_NEW);
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.kamoku = 4";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno, plan_tb.tusinratio";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLStdCommCommhistory(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとstdcomm)
	//FROM節(commhistory_X_tb)
	//WHERE節(type='P' or 'p' and pactid,carid)
	//GROUP BYとORDER BY
	{
		var sql = "select commhistory_tb.telno as telno";
		sql += ",sum(trunc((commhistory_tb.byte+" + G_PACKET_SIZE + "-1)" + "/" + G_PACKET_SIZE + ")) as stdcomm";
		sql += " from commhistory_" + table_no + "_tb" + " as commhistory_tb";
		sql += " where commhistory_tb.pactid=" + this.escape(pactid);
		sql += " and commhistory_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and commhistory_tb.type in ('P','p')";
		sql += this.getSQLWhereTelno("commhistory_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by commhistory_tb.telno";
		sql += " order by commhistory_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLBasic(pactid, table_no, A_telno, A_skip) //取り出すカラム(telnoとbasicsum,talksum,othersum)
	//sum(
	//sum(
	//sum(
	//FROM節(tel_details_X_tb <- utiwake_tb)
	//WHERE節(pactid,carid)
	//ORDER BYとGROUP BY
	{
		var sql = "select details_tb.telno as telno";
		sql += ",sum(";
		sql += "case when utiwake_tb.kamoku in (0,1)";
		sql += " then details_tb.charge else 0 end";
		sql += ") as basesum";
		sql += ",sum(";
		sql += "case when utiwake_tb.kamoku in (2,3,4,5,8)";
		sql += " then details_tb.charge else 0 end";
		sql += ") as talksum";
		sql += ",sum(";
		sql += "case when utiwake_tb.kamoku in (6)";
		sql += " then details_tb.charge else 0 end";
		sql += ") as othersum";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid=utiwake_tb.carid";
		sql += " and details_tb.code=utiwake_tb.code)";
		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and details_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and details_tb.code not in('";
		sql += this.escape(G_CODE_ASP) + "','" + this.escape(G_CODE_ASX);
		sql += "')";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid);
		sql += " group by details_tb.telno";
		sql += " order by details_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLWhereTelno(table_name, key, A_telno, A_skip, table_no, pactid) //trend_X_tbから、請求情報手入力済の電話番号を除外する
	{
		var sql = "";
		var A_src = [[A_telno, ""], [A_skip, "not"]];

		for (var pair of Object.values(A_src)) {
			if (0 == pair[0].length) continue;
			sql += " and " + table_name;
			if (table_name.length) sql += ".";
			sql += key;
			sql += " " + pair[1] + " in(";
			var comma = false;

			for (var telno of Object.values(pair[0])) {
				if (comma) sql += ",";
				comma = true;
				sql += "'" + this.escape(telno) + "'";
			}

			sql += ")";
		}

		sql += " and " + table_name;
		if (table_name.length) sql += ".";
		sql += key;
		sql += " not in (";
		sql += " select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and hand_detail_flg=true";
		sql += " group by telno";
		sql += " )";
		return sql;
	}

};