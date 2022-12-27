//===========================================================================
//機能：最新の回線数をrecent_telcnt_tbに保存する(ドコモ専用)
//ホットライン型顧客だけは、ドコモ以外も処理する
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：最新の回線数をrecent_telcnt_tbに保存する
//ホットライン型顧客だけは、ドコモ以外も処理する

require("script_db.php");

//キャリアIDから「その他」の回線種別(null可)への変換表
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：recent_telcnt_tbの回線数を更新する
//引数：顧客ID
//テーブル番号
//ホットラインならtrue
//返値：成功したらtrueを返す
//機能：recent_telcnt_tbの回線数の追加を行う
//引数：顧客ID
//テーブル番号
//キャリアID
//そのキャリアでの「その他」の回線種別(null可)
//返値：成功したらtrueを返す
class UpdateRecentTelcntDocomo extends ScriptDBAdaptor {
	UpdateRecentTelcntDocomo(listener, db, table_no) //キャリアIDから「その他」の回線種別への変換表を作る
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		var A_carid = this.m_db.getHash("select carid,carname from carrier_tb order by carid;");
		var sql = "select cirid,carid,cirname";
		sql += " from circuit_tb";
		sql += " order by carid,cirid";
		sql += ";";
		var A_cirid = this.m_db.getHash(sql);
		this.m_H_cirid_other = Array();

		for (var line_carid of Object.values(A_carid)) {
			var carid = line_carid.carid;
			var cirid = undefined;

			if (G_CARRIER_ALL == carid) //「すべて」のキャリアは処理しない
				{
					continue;
				}

			var A_cirname = Array();
			A_cirname.push("\u4E0D\u660E");
			A_cirname.push("\u305D\u306E\u4ED6");

			for (var H_line of Object.values(A_cirid)) {
				if (strcmp(carid, H_line.carid)) continue;

				if (-1 !== A_cirname.indexOf(H_line.cirname)) {
					cirid = H_line.cirid;
					break;
				}
			}

			this.m_H_cirid_other[carid] = cirid;

			if (!(undefined !== cirid)) {
				this.putError(G_SCRIPT_INFO, "\u300C\u305D\u306E\u4ED6\u300D\u306E\u56DE\u7DDA\u7A2E\u5225\u304C\u898B\u3064\u304B\u3089\u306A\u3044:" + line_carid.carname);
			}
		}
	}

	execute(pactid, table_no, is_hotline) //既存レコードを削除
	{
		var sql = "delete from recent_telcnt_tb";
		sql += " where pactid=" + pactid;

		if (!is_hotline) //ホットラインでなければ、ドコモだけ削除する
			{
				sql += " and cirid in (";
				sql += " select cirid from circuit_tb";
				sql += " where carid=" + G_CARRIER_DOCOMO;
				sql += ")";
			}

		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);

		if (is_hotline) {
			{
				let _tmp_0 = this.m_H_cirid_other;

				for (var carid in _tmp_0) {
					var cirid = _tmp_0[carid];
					if (!this.do_execute(pactid, table_no, is_hotline, carid, cirid)) return false;
				}
			}
		} else //ホットライン以外は、ドコモだけを追加する
			{
				if (!this.do_execute(pactid, table_no, is_hotline, G_CARRIER_DOCOMO, G_CIRCUIT_DOCOMO_OTHER)) return false;
			}

		return true;
	}

	do_execute(pactid, table_no, is_hotline, carid, cirid_other) {
		var tel_tb = is_hotline ? "tel_" + table_no + "_tb" : "tel_tb";
		var sql = "insert into recent_telcnt_tb(pactid,cirid,telcnt)";
		sql += " select sub_tb.pactid as pactid";
		if (undefined !== cirid_other) sql += " ,coalesce(tel2_tb.cirid2," + cirid_other + ") as cirid";else sql += " ,tel2_tb.cirid2 as cirid";
		sql += " ,count(sub_tb.telno) as telcnt";
		sql += " from (";
		sql += " select pactid,carid,telno";
		sql += " from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += " group by pactid,carid,telno";
		sql += " ) as sub_tb";
		sql += " left join (";
		sql += " select pactid,carid,telno,cirid as cirid2";
		sql += " from " + tel_tb;
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		if (!(undefined !== cirid_other)) sql += " and cirid is not null";
		sql += " group by pactid,carid,telno,cirid2";
		sql += " ) as tel2_tb";
		sql += " on sub_tb.pactid=tel2_tb.pactid";
		sql += " and sub_tb.carid=tel2_tb.carid";
		sql += " and sub_tb.telno=tel2_tb.telno";
		sql += " group by sub_tb.pactid,cirid";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};