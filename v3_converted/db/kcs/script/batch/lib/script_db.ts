//===========================================================================
//機能：スクリプト用データベースアクセスクラス
//
//作成：森原
//===========================================================================
//pgpoolのinsertロック解除コメント
//---------------------------------------------------------------------------
//機能：テーブルNo計算型

require("DB.php");

require("script_log.php");

require("script_common.php");

const PGPOOL_NO_INSERT_LOCK = "/*NO INSERT LOCK*/";

//現在の年
//現在の月
//機能：コンストラクタ
//引数：現在の年(省略したら現在)
//現在の月(省略したら現在)
//機能：テーブルNoを返す
//引数：年
//月
//返値：テーブルNo
class TableNo {
	TableNo(curyear = undefined, curmonth = undefined) {
		if (!(undefined !== curyear)) curyear = date("Y");
		if (!(undefined !== curmonth)) curmonth = date("n");
		this.m_cur_year = curyear;
		this.m_cur_month = curmonth;
	}

	get(year, month) {
		var diff = 12 * (this.m_cur_year - year) + this.m_cur_month - month + 1;

		if (diff < 13) {
			if (1 == month) return 12;else {
				var rval = month - 1;
				if (rval < 10) rval = "0" + rval;
				return rval;
			}
		} else {
			if (1 == month) return 24;else return month - 1 + 12;
		}
	}

};

//PEARのDB
//機能：コンストラクタ
//引数：エラー処理型
//DSN文字列
//機能：query(戻り値が参照型)
//備考：空白 + [UPDATE/DELETE/INSERT]の場合は、処理した行数を返す
//$checkがfalseの場合は、実行結果をそのまま返す
//処理した行数を返すと、PHPの警告が表示される
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：DB::result
//機能：query(戻り値が値型)
//###### query_by_valは削除予定である
//備考：UPDATE/DELETE/INSERTの場合は、処理した行数を返す
//SELECTを実行した場合は、PHPの警告が表示される
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：DB::result
//機能：直前に実行したdelete,update,insertの件数を取得する
//返値：実行後の件数を返す
//機能：getAll
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：検索結果
//機能：getHash
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：検索結果
//機能：DBからレコードを取得して、DB_FETCHMODE_OBJECTで返す
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：検索結果
//機能：getOne
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：検索結果
//機能：getCol
//引数：SQL
//デフォルトのエラー処理を行うならtrue
//返値：検索結果
//機能：escapeSimple
//引数：処理する文字列
//返値：エスケープ処理した文字列
//機能：beginする
//機能：rollbackする
//機能：commitする
//機能：テーブルをロックする
//引数：ロックするテーブル名
//機能：テーブルのカラム名を配列で返す
//引数：SQL
//返値：カラム名の配列
//機能：テーブルのカラム名と、その型を返す
//引数：SQL
//返値：{カラム名,型名}*
//機能：テーブルの内容をファイルに落とす
//引数：ファイル名
//テーブル名
//返値：深刻なエラーがおきたらfalseを返す
//機能：テーブルの特定部分だけをファイルに落とす
//引数：ファイル名
//SQL文(select * from table_name where ...)
//返値：深刻なエラーがおきたらfalseを返す
//機能：バックアップ用に文字列を変換する
//備考：protected
//引数：変換する値
//カラムの型
//返値：変換した値
//機能：ラージオブジェクトをDBにインポートする
//備考：begin～commitブロックの中で使用する事
//引数：ファイルパス
//返値：ラージオブジェクトのOID
//機能：ラージオブジェクトをDBからエクスポートする
//備考：begin～commitブロックの中で使用する事
//引数：ファイルパス
//ラージオブジェクトのOID
//trueなら失敗時にプロセス終了する
//備考：失敗したらfalseを返す
//機能：ラージオブジェクトをDBから削除する
//備考：begin～commitブロックの中で使用する事
//引数：ラージオブジェクトのOID
//trueなら失敗時にプロセス終了する
class ScriptDB extends ScriptLogAdaptor {
	ScriptDB(listener, dsn = "") {
		this.ScriptLogAdaptor(listener, true);
		if (0 == dsn.length) dsn = GLOBALS.G_dsn;
		this.m_db = DB.connect(dsn);

		if (DB.isError(this.m_db)) {
			this.putError(G_SCRIPT_INFO, `connect(${dsn})`);
			this.putError(G_SCRIPT_ERROR, "connect");
		}

		this.m_db.autoCommit(false);
	}

	query(sql, check = true) {
		var result = this.m_db.query(sql);
		if (!check) return result;

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `query(${sql})`);
		}

		if (preg_match("/^\\s(delete|update|insert)/i", str_replace(PGPOOL_NO_INSERT_LOCK, "", sql))) return this.m_db.affectedRows();
		return result;
	}

	query_by_val(sql, check = true) {
		var result = this.m_db.query(sql);
		if (!check) return result;

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `query(${sql})`);
		}

		if (preg_match("/^\\s*(delete|update|insert)/i", str_replace(PGPOOL_NO_INSERT_LOCK, "", sql))) return this.m_db.affectedRows();
		return result;
	}

	affectedRows() {
		return this.m_db.affectedRows();
	}

	getAll(sql, check = true) {
		var result = this.m_db.getAll(sql);
		if (!check) return result;

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getAll(${sql})`);
		}

		return result;
	}

	getHash(sql, check = true) {
		var O_result = this.m_db.query(sql);

		if (DB.isError(O_result)) {
			if (!check) return O_result;
			if (is_a(O_result, "db_error")) sql = O_result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getHash(${sql})`);
		}

		var A_result = Array();

		while (line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) A_result.push(line);

		O_result.free();
		return A_result;
	}

	getObject(sql, check = true) {
		var O_result = this.m_db.query(sql);

		if (DB.isError(O_result)) {
			if (!check) return O_result;
			if (is_a(O_result, "db_error")) sql = O_result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getObject(${sql})`);
		}

		var A_result = Array();

		while (line = O_result.fetchRow(DB_FETCHMODE_OBJECT)) A_result.push(line);

		O_result.free();
		return A_result;
	}

	getOne(sql, check = true) {
		var result = this.m_db.getOne(sql);
		if (!check) return result;

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getOne(${sql})`);
		}

		return result;
	}

	getCol(sql, check = true) {
		var result = this.m_db.getCol(sql);
		if (!check) return result;

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getCol(${sql})`);
		}

		return result;
	}

	escape(sql) {
		return this.m_db.escapeSimple(sql);
	}

	begin() {
		this.query("begin;");
		if (DB.isError(this.m_db)) this.putError(G_SCRIPT_ERROR, "begin");
	}

	rollback() {
		this.query("rollback;");
		if (DB.isError(this.m_db)) this.putError(G_SCRIPT_ERROR, "rollback");
	}

	commit() {
		this.query("commit;");
		if (DB.isError(this.m_db)) this.putError(G_SCRIPT_ERROR, "commit");
	}

	lock(table_name) //2007/06/22 * DEBUG * pg_poolの二重化が外れるため抑制 by T.Naka
	//$this->query("lock $table_name in row exclusive mode;");
	//if (DB::isError($this->m_db))
	//$this->putError(G_SCRIPT_ERROR, "lock $table_name");
	{}

	tableInfo(sql) {
		var result = this.m_db.query(sql);

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `tableInfo(query)(${sql})`);
		}

		var info = this.m_db.tableInfo(result);
		result.free();
		var rval = Array();

		for (var line of Object.values(info)) rval.push(line.name);

		return rval;
	}

	getQuote(sql) {
		var result = this.m_db.query(sql);

		if (DB.isError(result)) {
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `getQuote(query)(${sql})`);
		}

		var info = this.m_db.tableInfo(result);
		result.free();
		var rval = Array();

		for (var line of Object.values(info)) rval.push([line.name, line.type]);

		return rval;
	}

	backupAll(fname, table_name) //copy to filenameを使わないようにした
	//pg_poolの二重化対策
	//binaryでなければ大丈夫かも知れないが念のため
	{
		return this.backup(fname, `select * from ${table_name};`);
	}

	backup(fname, sql) {
		var fp = fopen(fname, "wt");

		if (!fp) {
			this.putError(G_SCRIPT_ERROR, "backup/\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557" + fname + "/" + sql);
			return false;
		}

		var result = this.m_db.query(sql);

		if (DB.isError(result)) {
			fclose(fp);
			if (is_a(result, "db_error")) sql = result.userinfo;
			this.m_db.rollback();
			this.putError(G_SCRIPT_ERROR, `backup(${sql})`);
		}

		var info = this.m_db.tableInfo(result);

		while (src = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			var line = "";
			var comma = false;

			for (var colinfo of Object.values(info)) {
				if (comma) line += "\t";
				comma = true;
				if (!(undefined !== src[colinfo.name])) line += "\\N";else {
					line += this.backupEscape(src[colinfo.name], colinfo.type);
				}
			}

			line += "\n";

			if (line.length != fwrite(fp, line)) {
				this.putError(G_SCRIPT_ERROR, "backup/\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557" + fname + "/" + sql);
				result.free();
				fclose(fp);
				return false;
			}
		}

		result.free();
		fclose(fp);
		return true;
	}

	backupEscape(var, type) {
		var = str_replace("\\", "\\\\", var);
		var = str_replace("\t", "\\\t", var);
		return var;
	}

	loImport(path) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//SQL文先頭の空白文字はpgpool経由で両方のDBに反映するために必要
	//if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/DB接続がpostgresではない" . get_class($this->m_db));
	//		}
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$oid = pg_lo_create($this->m_db->connection);
	//		if ( ! $oid)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗create");
	//		}
	//		$tgt = pg_lo_open($this->m_db->connection, $oid, "w");
	//		if ( ! $tgt)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗lo_open($oid)");
	//		}
	//		$src = fopen($path, "rb");
	//		if ( ! $src)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗fopen($path)");
	//		}
	//		$bufsize = 1024 * 64;
	//		while (true)
	//		{
	//			$buf = fread($src, $bufsize);
	//			$len = strlen($buf);
	//			if (0 == $len) break;
	//			if ($len != pg_lo_write($tgt, $buf))
	//			{
	//				$this->putError(G_SCRIPT_ERROR,
	//					"loImport/インポート失敗lo_write($len)");
	//			}
	//		}
	//		if ( ! fclose($src))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗fclose($path)");
	//		}
	//		if ( ! pg_lo_close($tgt))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗lo_close($oid)");
	//		}
	//		return $oid;
	//####
	{
		var sql = "/* */ select nextval('largeobject_index');";
		var result = pg_query(this.m_db.connection, sql);
		var row = pg_fetch_array(result);

		if (!(undefined !== row[0])) {
			this.putError(G_SCRIPT_ERROR, "loImport/\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557/oid\u53D6\u5F97\u5931\u6557pg_fetch_array");
		}

		var oid = row[0];
		pg_free_result(result);

		if (0 == oid.length) {
			this.putError(G_SCRIPT_ERROR, "loImport/\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557/oid\u53D6\u5F97\u5931\u6557largeobject_index");
		}

		var fname = G_LARGEOBJECT_PATH + this.m_db.dsn.database + "/" + oid;

		if (!copy(path, fname)) {
			this.putError(G_SCRIPT_ERROR, `loImport/インポート失敗/ファイルコピー失敗/${fname}/${path}/${oid}`);
		}

		this.putError(G_SCRIPT_DEBUG, `loImport/ファイルコピー成功(${oid})${fname}`);
		return oid;
	}

	loExport(path, oid, check = true) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loExport/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$sql = "select count(loid) from pg_catalog.pg_largeobject";
	//		$sql .= " where loid=" . $oid;
	//		$sql .= ";";
	//		if (0 == $this->getOne($sql)) return false;
	//		if ( ! pg_loexport($oid, $path, $this->m_db->connection))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loExport/エクスポート失敗($path)$oid");
	//			return false;
	//		}
	//		return true;
	//####
	{
		var fname = G_LARGEOBJECT_PATH + this.m_db.dsn.database + "/" + oid;

		if (!copy(fname, path)) {
			if (!check) return false;
			this.putError(G_SCRIPT_ERROR, `loExport/インポート失敗/ファイルコピー失敗/${path}/${fname}/${oid}`);
			return false;
		}

		return true;
	}

	loUnlink(oid, check = true) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loUnlink/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$sql = "select count(loid) from pg_catalog.pg_largeobject";
	//		$sql .= " where loid=" . $oid;
	//		$sql .= ";";
	//		if (0 == $this->getOne($sql)) return;
	//		if ( ! pg_lounlink($this->m_db->connection, $oid))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loUnlink/削除失敗(oid=$oid)");
	//		}
	//####
	{
		var fname = G_LARGEOBJECT_PATH + this.m_db.dsn.database + "/" + oid;

		if (!unlink(fname)) {
			if (!check) return false;
			this.putError(G_SCRIPT_ERROR, `loUnlink/ファイル削除失敗(${oid})${fname}`);
		} else {
			this.putError(G_SCRIPT_DEBUG, `loUnlink/ファイル削除成功(${oid})${fname}`);
		}

		return true;
	}

};

//データベース
//テーブル番号計算型
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//ERROR種別でログ出力した時、exitするならtrue
//機能：escapeSimple
//引数：処理する文字列
//返値：エスケープ処理した文字列
//機能：テーブルNoを返す
//引数：年
//月
//返値：テーブルNo
class ScriptDBAdaptor extends ScriptLogAdaptor {
	ScriptDBAdaptor(listener, db, table_no, exit_on_error = true) {
		this.ScriptLogAdaptor(listener, exit_on_error);
		this.m_db = db;
		this.m_table_no = table_no;
	}

	escape(var) {
		return this.m_db.escape(var);
	}

	getTableNo(year, month) {
		return this.m_table_no.get(year, month);
	}

};

//DB型インスタンス
//挿入先テーブル名
//{テーブルのカラム名,型名}の配列
//毎回の挿入時に追加される固定値のハッシュ
//trueなら追加しない(動作は派生型に依存する)
//pgpoolのinsertをロックしないならtrue
//機能：デバッグモードを設定する
//備考：動作は派生型に依存する
//引数：trueなら追加しない
//備考：pgpoolのinsertをロックしないよう設定する
//機能：コンストラクタ
//引数：エラー処理型
//DB型
//機能：挿入開始前に呼ぶ
//引数：テーブル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：毎回の挿入時に追加される固定値を設定する
//引数：毎回の挿入時に追加される固定値のハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：テーブルに挿入する値を追加する
//引数：DBに挿入する値を格納したハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：テーブルに値を挿入する
//返値：深刻なエラーが発生したらfalseを返す
//機能：現在の日付を返す
//機能：insertRawで使用する空の配列を返す
//引数：配列要素に「\\N」を入れるならfalse
//機能：insertRawで使用する配列の添え字を返す
//引数：カラム名
//返値：添え字(カラム名が見つからなければ-1を返す)
//機能：テーブルに挿入する値を追加する
//備考：setConstの値は反映されない
//引数：DBに挿入する1レコード分の配列
//配列要素に「\\N」を入れるならfalse
//返値：深刻なエラーが発生したらfalseを返す
class TableInserterBase extends ScriptLogAdaptor {
	setDebug(debug) {
		this.m_debug = debug;
	}

	setUnlock() {
		this.m_is_no_insert_lock = true;
	}

	TableInserterBase(listener, db) {
		this.ScriptLogAdaptor(listener, true);
		this.m_db = db;
		this.m_A_const = Array();
		this.m_A_col = Array();
		this.m_is_no_insert_lock = false;
	}

	begin(table_name) {
		this.m_table_name = table_name;
		var sql = `select * from ${table_name} where 1=0;`;
		this.m_A_col = this.m_db.getQuote(sql);
		return true;
	}

	setConst(const) {
		this.m_A_const = const;
		return true;
	}

	insert(H_line) {
		return true;
	}

	end() {
		return true;
	}

	getTimestamp() {
		var tm = localtime(mktime(), true);
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

	getEmpty(is_escape) {
		var rval = Array();

		for (var col of Object.values(this.m_A_col)) {
			var var = undefined;
			if (!is_escape) var = "\\N";
			rval.push(var);
		}

		return rval;
	}

	getIndex(name) {
		var idx = 0;

		for (var col of Object.values(this.m_A_col)) {
			if (0 == strcmp(name, col[0])) return idx;
			++idx;
		}

		return -1;
	}

	insertRaw(A_line, is_escape) {
		return true;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//DB型
//機能：テーブルに挿入する値を追加する
//引数：DBに挿入する値を格納したハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：型名を与えて、クォートで囲む必要があればtrueを返す
class TableInserterSlow extends TableInserterBase {
	TableInserterSlow(listener, db) {
		this.TableInserterBase(listener, db);
	}

	insert(H_line) {
		{
			let _tmp_0 = this.m_A_const;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				if (!(key in H_line)) H_line[key] = value;
			}
		}
		var sql = "insert into " + this.m_table_name;
		sql += "(";
		var comma = false;

		for (var col of Object.values(this.m_A_col)) {
			if (comma) sql += ",";
			comma = true;
			sql += col[0];
		}

		sql += ")values(";
		comma = false;

		for (var col of Object.values(this.m_A_col)) {
			if (comma) sql += ",";
			comma = true;
			var colname = col[0];

			if (undefined !== H_line[colname]) {
				if (this.is_quote(col[1])) sql += "'";
				var var = this.m_db.escape(H_line[colname]);

				if (0 == strcmp("now()", var)) {
					var = this.getTimestamp(var);
				}

				sql += var;
				if (this.is_quote(col[1])) sql += "'";
			} else sql += "null";
		}

		sql += ")";
		if (this.m_is_no_insert_lock) sql = PGPOOL_NO_INSERT_LOCK + sql;
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	is_quote(name) {
		switch (name.toLowerCase()) {
			case "integer":
			case "boolean":
			case "double":
			case "float":
			case "int":
				return false;

			default:
				return true;
		}
	}

};

//ファイル名
//最初にファイルを削除するならtrue
//出力毎にファイルを開き直さないならtrue
//ファイルポインタ
//一回のコピー操作で処理する行数
//機能：コンストラクタ
//引数：エラー処理型
//DB型
//ファイル名
//最初にファイルを削除するならtrue
//出力毎にファイルを開き直さないならtrue
//機能：挿入開始前に呼ぶ
//引数：テーブル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：テーブルに挿入する値を追加する
//引数：DBに挿入する値を格納したハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：挿入内容を文字列に変換する
//引数：変換した文字列を返す
//変換する値を格納したハッシュ
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBに追加する値をエスケープする
//引数：追加する値
//返値：エスケープした値
//機能：文字列をエスケープする
//機能：ファイルに一行追加する
//引数：出力する行
//返値：深刻なエラーが発生したらfalseを返す
//機能：テーブルに挿入する値を追加する
//備考：setConstの値は反映されない
//引数：DBに挿入する1レコード分の配列
//配列要素に「\\N」を入れるならfalse
//返値：深刻なエラーが発生したらfalseを返す
//機能：テーブルに値を挿入する
//返値：深刻なエラーが発生したらfalseを返す
class TableInserter extends TableInserterBase {
	TableInserter(listener, db, fname, erase, static = true) {
		this.TableInserterBase(listener, db);
		this.m_filename = fname;
		this.m_erase = erase;
		this.m_static = static;
		this.m_interval = 1024;
	}

	begin(table_name) {
		if (!TableInserterBase.begin(table_name)) return false;

		if (this.m_erase || !file_exists(this.m_filename)) {
			var fp = fopen(this.m_filename, "wb");

			if (!fp) {
				this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u6D88\u53BB\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}

			fclose(fp);
		}

		if (this.m_static) {
			this.m_fp = fopen(this.m_filename, "wt");

			if (!this.m_fp) {
				this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}
		}

		return true;
	}

	insert(H_line) {
		var line = "";
		if (!this.toLine(line, H_line)) return false;
		if (!this.putLine(line + "\n")) return false;
		return true;
	}

	toLine(line, H_line) {
		var comma = false;

		for (var col of Object.values(this.m_A_col)) {
			var colname = col[0];
			if (comma) line += "\t";
			comma = true;

			if (undefined !== H_line[colname]) {
				line += this.escape(H_line[colname]);
			} else if (undefined !== this.m_A_const[colname]) {
				line += this.escape(this.m_A_const[colname]);
			} else line += "\\N";
		}

		return true;
	}

	escape(var) {
		if (!(undefined !== var)) return "\\N";

		if (0 == strcmp("now()", var)) {
			var = this.getTimestamp(var);
		}

		return this.escapeStr(var);
	}

	escapeStr(var) //20071206iga
	{
		var = str_replace("\\", "\\\\", var);
		var = str_replace("\t", "\\\t", var);
		var = str_replace("LFkaigyoLF", "\\n", var);
		return var;
	}

	putLine(line) {
		if (this.m_fp) var fp = this.m_fp;else {
			fp = fopen(this.m_filename, "at");

			if (!fp) {
				this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}
		}

		if (line.length != fwrite(fp, line)) {
			this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
			fclose(fp);
			return false;
		}

		if (!this.m_fp) fclose(fp);
		return true;
	}

	insertRaw(A_line, is_escape) {
		var line = "";

		if (is_escape) {
			var comma = false;

			for (var cell of Object.values(A_line)) {
				if (comma) line += "\t";
				comma = true;
				line += this.escape(cell);
			}
		} else line = A_line.join("\t");

		if (!this.putLine(line + "\n")) return false;
		return true;
	}

	end() {
		if (this.m_fp) {
			fclose(this.m_fp);
			this.m_fp = undefined;
		}

		if (this.m_debug) {
			this.putError(G_SCRIPT_INFO, "DB\u633F\u5165\u5B9F\u884C\u305B\u305A(" + this.m_filename + "/" + this.m_table_name + ")");
			return true;
		}

		var A_buffer = Array();
		var fp = fopen(this.m_filename, "rt");

		if (!fp) {
			this.putError(G_SCRIPT_ERROR, "\u30D5\u30A1\u30A4\u30EB\u8AAD\u307F\u51FA\u3057\u30AA\u30FC\u30D7\u30F3\u5931\u6557(" + this.m_filename + "/" + this.m_table_name + ")");
			return false;
		}

		var gcnt = 0;

		for (var cnt = 0; !feof(fp); ++cnt, ++gcnt) {
			var line = fgets(fp, 64 * 1024);
			if (0 == line.length) continue;
			A_buffer.push(line);

			if (this.m_interval <= A_buffer.length) {
				if (false === pg_copy_from(this.m_db.m_db.connection, this.m_table_name, A_buffer)) {
					this.putError(G_SCRIPT_ERROR, `pg_copy_from失敗 ${gcnt} ` + this.m_table_name);
				}

				A_buffer = Array();
			}
		}

		if (A_buffer.length) {
			if (false === pg_copy_from(this.m_db.m_db.connection, this.m_table_name, A_buffer)) {
				this.putError(G_SCRIPT_ERROR, `pg_copy_from失敗(2) ${gcnt} ` + this.m_table_name);
			}
		}

		fclose(fp);
		fp = undefined;
		return true;
	}

};

//DBインスタンス
//キーとなるカラム名
//query結果
//結果が残っていなければtrue
//事前に取り出したカラム
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//キーとなるカラム名
//ERROR種別でログ出力した時、exitするならtrue
//機能：SQL文を与えてqueryする
//引数：SQL文
//機能：外部でqueryした結果をセットする
//引数：queryした結果
//機能：結果をクリアする
//機能：キーを与えて、合致するレコードを取り出す
//引数：キーの値
//返値：レコードを返す(取り出せるレコードが残っていなければnullを返す)
//機能：キーにかかわらず、次のレコードを取り出す
//返値：レコードを返す(取り出せるレコードが残っていなければnullを返す)
//機能：取り出せるカラムが残っていなければtrueを返す
class FetchAdaptor extends ScriptLogAdaptor {
	FetchAdaptor(listener, db, key, exit_on_error = true) {
		this.ScriptLogAdaptor(listener, exit_on_error);
		this.m_db = db;
		this.m_key = key;
	}

	query(sql) {
		this.free();
		this.m_result = this.m_db.query(sql);
		this.m_eof = undefined !== result ? false : true;
	}

	set(result) {
		this.free();
		this.m_result = result;
		this.m_eof = undefined !== result ? false : true;
	}

	free() {
		if (undefined !== this.m_result) this.m_result.free();
		delete this.m_result;
		this.m_eof = true;
		delete this.m_fetch;
	}

	fetch(value) //最後まで取り出したが、合致する値がなかった
	//最後まで取り出したが合致するレコードがなかった
	{
		if (undefined !== this.m_fetch) //↓新しい値を取りに行く
			{
				if (0 == strcmp(this.m_fetch[this.m_key], value)) //フェッチずみの値があるのでそれを返す
					{
						var rval = this.m_fetch;
						delete this.m_fetch;
						return rval;
					} else if (0 < strcmp(this.m_fetch[this.m_key], value)) //フェッチずみレコードは今のキーよりも大きい
					//(ので、将来的にフェッチずみレコードが使える可能性がある)
					{
						return undefined;
					}

				delete this.m_fetch;
			}

		if (!(undefined !== this.m_result)) return undefined;

		while (this.m_fetch = this.m_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (0 == strcmp(this.m_fetch[this.m_key], value)) //合致する値があった
				{
					rval = this.m_fetch;
					delete this.m_fetch;
					return rval;
				} else if (0 < strcmp(this.m_fetch[this.m_key], value)) //キーより大きい値をフェッチしてしまった
				{
					return undefined;
				}
		}

		delete this.m_fetch;
		this.m_eof = true;
		return undefined;
	}

	fetchNext() {
		if (undefined !== this.m_fetch) {
			var rval = this.m_fetch;
			delete this.m_fetch;
			return rval;
		}

		return this.m_result.fetchRow(DB_FETCHMODE_ASSOC);
	}

	eof() {
		if (!(undefined !== this.m_result) && !(undefined !== this.m_fetch)) return true;
		return this.m_eof;
	}

};