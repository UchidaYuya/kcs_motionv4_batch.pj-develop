//===========================================================================
//機能：clampfile_tbとclamptemp_tbの処理
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：clampfile_tbとclamptemp_tbの処理

require("script_db.php");

require("script_common.php");

//テーブル名(テーブル番号部分は%s)
//unlinkでは%sの置換が機能しなくなっている
//ラージオブジェクト保存時の拡張子
//顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//テーブル名(テーブル番号部分は%s)
//ラージオブジェクト保存時の拡張子
//機能：顧客ID・年月などで初期化する
//引数：顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：ラージオブジェクトと既存レコードをファイルに取り出す
//備考：begin～commitの中で使用する事
//引数：ファイルの保存先ディレクトリ
//返値：深刻なエラーが発生したらfalseを返す
//機能：既存のレコードを削除する
//備考：begin～commitの中で使用する事
//備考：ラージオブジェクトも削除する
//引数：年月を無視するならfalse
//返値：深刻なエラーが発生したらfalseを返す
class ClampFileTb extends ScriptDBAdaptor {
	ClampFileTb(listener, db, table_no, table_name, ext) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_table_name = table_name;
		this.m_ext = ext;
	}

	init(pactid, carid, year, month) {
		this.m_pactid = pactid;
		this.m_carid = carid;
		this.m_year = year;
		this.m_month = month;
		return true;
	}

	export(path) //既存レコードの保存
	{
		var no = this.getTableNo(this.m_year, this.m_month);
		var name = str_replace("%s", no, this.m_table_name);
		var sqlwhere = " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sqlwhere += " and carid=" + this.escape(this.m_carid);
		sqlwhere += " and year=" + this.escape(this.m_year);
		sqlwhere += " and month=" + this.escape(this.m_month);
		sqlwhere += " order by carid,type";
		var fname = path + name + ".delete";

		if (!this.m_db.backup(fname, "select * from " + name + sqlwhere + ";")) {
			this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u4FDD\u5B58\u5931\u6557" + fname + "/" + sqlwhere);
			return false;
		}

		var sql = "select carid,type,fid,detailno";
		sql += " from " + name + sqlwhere;
		sql += ";";
		var result = this.m_db.getHash(sql);
		var carid = "";
		var gpath = path;
		var count = 0;
		var type = "";

		for (var line of Object.values(result)) {
			if (0 == line.fid.length) continue;
			var A_fid = line.fid.split(",");
			if (0 == count(A_fid)) continue;

			if (strcmp(carid, line.carid)) {
				carid = line.carid;
				path = gpath + carid + "/";

				if (!mkdir(path)) {
					this.putError(G_SCRIPT_ERROR, `フォルダ作成失敗${path}`);
					return false;
				}
			}

			if (strcmp(type, line.type)) {
				count = 0;
				type = line.type;
			}

			for (var fid of Object.values(A_fid)) {
				fname = path + line.type + sprintf("%d", line.detailno) + sprintf("%02d", count) + this.m_ext;
				this.m_db.loExport(fname, fid);
				++count;
			}
		}

		return true;
	}

	unlink(check_year = true) //yearとmonthによる置換は行わない
	//ラージオブジェクトの削除
	//テーブルから既存のレコードの削除
	{
		var sqlwhere = " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sqlwhere += " and carid=" + this.escape(this.m_carid);

		if (check_year) {
			sqlwhere += " and year=" + this.escape(this.m_year);
			sqlwhere += " and month=" + this.escape(this.m_month);
		}

		var name = this.m_table_name;
		var sql = "select fid from " + name + sqlwhere;
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			if (0 == line.fid.length) continue;
			var A_fid = line.fid.split(",");

			for (var fid of Object.values(A_fid)) {
				this.m_db.loUnlink(fid);
			}
		}

		sql = "delete from " + name + sqlwhere + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};