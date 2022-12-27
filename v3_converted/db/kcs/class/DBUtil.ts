//
//   DBユーティリティクラス
//
//   作成日：2004/04/12
//   作成者：上杉勝史
//

require("DB.php");

require("ErrorUtil.php");

require("common.conf");

//class DBUtil extends DB{
//
// コンストラクタ
// 
// [引　数] $transaction : トランザクションの開始
// [返り値] なし
//
//
// DBクラスqueryのオーバーロード
// 
// [引　数] $sql		: SQL
// [返り値] $result	: DBリザルトオブジェクト
//
//
// DBクラスlimitQueryのオーバーロード
// 
// [引　数] $sql		: SQL
// [引　数] $from	: 開始行番号
// [引　数] $cnt		: 取得行数
// [返り値] $result	: DBリザルトオブジェクト
//
//
// DBクラスgetAllのオーバーロード
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の第１カラムをキーとした連想配列
//
//
// DBクラスgetRowのオーバーロード
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の第１行目の配列
//
//
// DBクラスgetOneのオーバーロード
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の第１行目の第１カラム
//
//
// DBクラスgetColのオーバーロード
// 
// [引　数] $sql		: SQL
// 		   $col		: カラム番号
// [返り値] $result	: SQL結果の配列
//
//
// 結果を配列に返すメソッド
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の配列
//
//
// 結果を第一カラムをキーにした連想配列に返すメソッド
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の連想配列
//
//
// 結果を第一カラムをキーにした連想配列に返すメソッド
// 
// [引　数] $sql		: SQL
// [返り値] $result	: SQL結果の連想配列
//
//
// 結果を１行だけ配列に返すメソッド
// 
// [引　数] $sql		: SQL
// [返り値] $H_result: SQL結果の配列
//
//
// DBクラスgetAssocのオーバーロード
// 
// [引　数] $sql			: SQL
//		   $force_array	: ???
//		   $params		: ???
//		   $fetchmode	: ???
//		   $group		: ???
// [返り値] $result		: SQL結果の配列
//
//
// DBクラスescapeSimpleのオーバーロード
// 
// [引　数] $str			: 評価する文字列
// [返り値] $result		: DBエスケープされた文字列
//
//
// DBクラスnextIdのオーバーロード
// 
// [引　数] $seqname		: シーケンス名
// [返り値] $result		: 指定したシーケンスの次の番号
//
//
// DBクラスprepareのオーバーロード
// 
// [引　数] $sql		: SQL
// [返り値] $O_sth	: コンパイル済SQL
//
//
// DBクラスexecuteのオーバーロード
// 
// [引　数] $O_sql	: コンパイル済SQL
//		   $A_word	: プレースホルダ置換用配列
// [返り値] $result	: 成功(true),失敗ならエラー
//
//
// DBクラスexecuteMultipleのオーバーロード
// 
// [引　数] $O_sql	: コンパイル済SQL
//		   $H_word	: プレースホルダ置換用連想配列
// [返り値] $result	: 成功(true),失敗ならエラー
//
//
// DBクラスcommitのオーバーロード
// 
// [引　数] なし
// [返り値] なし
//
//
// DBクラスrollbackのオーバーロード
// 
// [引　数] なし
// [返り値] なし
//
//
// DBクラスdisconnectのオーバーロード
// 
// [引　数] なし
// [返り値] なし
//
//
// pgpoolの状態を見る
// 
// [引　数] なし
// [返り値] DBが両方とも稼動していたらtrue/DBが落ちていたらfalse
// 作成 20070925miya
//
class DBUtil {
	DBUtil(transaction = false) //ErrorUtilの呼出 なぜかうまく呼べないのでオブジェクト新規作成
	//$this->O_err = new ErrorUtil();
	//DB設定の読み込み
	//DB接続
	{
		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}

		this.O_err = GLOBALS.GO_errlog;

		require("db.conf");

		this.O_dbh = DB.connect(GLOBALS.G_dsn, GLOBALS.GH_dboption);

		if (transaction == true) {
			this.O_dbh.autoCommit(false);
		}

		if (GLOBALS.G_traceflg == 1) {
			if (undefined !== GLOBALS.GO_tracelog == false || GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("Connect", 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (DB.isError(this.O_dbh) == true) //エラー処理
			{
				this.O_err.errorOut(2, "DB\u63A5\u7D9A\u5931\u6557: " + DB.errorMessage(this.O_dbh));
			}
	}

	query(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@query@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var O_result = this.O_dbh.query(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == true) //pgpoolの状態を調べ、落ちていたら再読み込み 20070925miya
			//$pgpool_status = $this->O_dbh->pgpoolChecker();
			//if ($pgpool_status == false) {
			//query($sql);
			//exit();
			//}
			{
				this.O_dbh.rollback();
				this.O_err.errorOut(1, "@query@ " + O_result.message + "(" + O_result.userinfo + ")");
			} else {
			if (preg_match("/^\\s*(delete|update|insert)/i", sql)) {
				O_result = this.O_dbh.affectedRows();
			}

			return O_result;
		}
	}

	limitQuery(sql, from = -1, cnt = 0, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@limitQuery@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		if (from < 0 || cnt <= 0) {
			this.O_err.errorOut(1, "@limitQuery@ from(\u7B2C2\u5F15\u6570),count(\u7B2C3\u5F15\u6570)\u304C\u5FC5\u8981\u3067\u3059");
		}

		var O_result = this.O_dbh.limitQuery(sql, from, cnt);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("limit:" + from + "," + cnt + ":" + preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == ture) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@limitQuery@ " + O_result.message + "(" + O_result.userinfo + ")");
		} else {
			return O_result;
		}
	}

	getAll(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getAll@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var H_result = this.O_dbh.getAll(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return H_result;
		}

		if (DB.isError(H_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getAll@ " + H_result.message + "(" + H_result.userinfo + ")");
		} else {
			return H_result;
		}
	}

	getRow(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getRow@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var A_result = this.O_dbh.getRow(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return A_result;
		}

		if (DB.isError(A_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getRow@ " + A_result.message + "(" + A_result.userinfo + ")");
		} else {
			return A_result;
		}
	}

	getOne(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getOne@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var result = this.O_dbh.getOne(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (DB.isError(result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getOne@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	getCol(sql = "", col = 0, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getCol@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var A_result = this.O_dbh.getCol(sql, col);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 7) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return A_result;
		}

		if (DB.isError(A_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getCol@ " + A_result.message + "(" + A_result.userinfo + ")");
		} else {
			return A_result;
		}
	}

	getHash(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getHash@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		} else if (preg_match("/^\\s*(delete|update|insert)/i", sql)) {
			this.O_err.errorOut(1, "@getHash@ \u66F4\u65B0\u30AF\u30A8\u30EA\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093");
		}

		var O_result = this.O_dbh.query(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		while (A_rows = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			A_result.push(A_rows);
		}

		O_result.free();
		return A_result;
	}

	getSimpleHash(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getSimpleHash@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		} else if (preg_match("/^\\s*(delete|update|insert)/i", sql)) {
			this.O_err.errorOut(1, "@getSimpleHash@ \u66F4\u65B0\u30AF\u30A8\u30EA\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093");
		}

		var O_result = this.O_dbh.query(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		while (A_rows = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			reset(A_rows);
			var key = current(A_rows);
			A_rows.shift();
			A_result[key] = A_rows.shift();
		}

		O_result.free();
		return A_result;
	}

	getKeyHash(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getKeyHash@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		} else if (preg_match("/^\\s*(delete|update|insert)/i", sql)) {
			this.O_err.errorOut(1, "@getKeyHash@ \u66F4\u65B0\u30AF\u30A8\u30EA\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093");
		}

		var O_result = this.O_dbh.query(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getKeyHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var A_result = Array();

		while (A_rows = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			reset(A_rows);
			var key = current(A_rows);
			A_rows.shift();
			A_result[key] = A_rows;
		}

		O_result.free();
		return A_result;
	}

	getRowHash(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getRowHash@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		} else if (preg_match("/^\\s*(delete|update|insert)/i", sql)) {
			this.O_err.errorOut(1, "@getRowHash@ \u66F4\u65B0\u30AF\u30A8\u30EA\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093");
		}

		var O_result = this.O_dbh.query(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_result;
		}

		if (DB.isError(O_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getHash@ " + O_result.message + "(" + O_result.userinfo + ")");
		}

		var H_result = O_result.fetchRow(DB_FETCHMODE_ASSOC);
		O_result.free();
		return H_result;
	}

	getAssoc(sql = "", A_force_array = false, params = "", fetchmode = 0, group = false, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@getAssoc@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var H_result = this.O_dbh.getAssoc(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return H_result;
		}

		if (DB.isError(H_result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@getAssoc@ " + H_result.message + "(" + H_result.userinfo + ")");
		} else {
			return H_result;
		}
	}

	escapeSimple(str, errchk = true) //配列ならそのまま返す
	//トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (Array.isArray(str) == true) {
			return str;
		}

		var result = this.O_dbh.escapeSimple(str);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log(preg_replace("/\n/", " ", str), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (DB.isError(result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@escapeSimple@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	nextId(seqname, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (seqname == "") {
			this.O_err.errorOut(1, "@nextId@ \u30B7\u30FC\u30B1\u30F3\u30B9\u540D\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		var result = this.O_dbh.nextId(seqname);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("nextId:" + seqname, 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (DB.isError(result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@nextId@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	prepare(sql, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (sql == "") {
			this.O_err.errorOut(1, "@prepare@ SQL\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var O_sql = this.O_dbh.prepare(sql);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("prepare: " + preg_replace("/\n/", " ", sql), 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return O_sql;
		}

		if (DB.isError(O_sql) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@prepare@ " + O_sql.message + "(" + O_sql.userinfo + ")");
		} else {
			return O_sql;
		}
	}

	execute(O_sql, A_word, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (A_word == false) {
			this.O_err.errorOut(1, "@execute@ \u7F6E\u63DB\u7528\u914D\u5217\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var result = this.O_dbh.execute(O_sql, A_word);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("execute: " + result, 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (DB.isError(result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@execute@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	executeMultiple(O_sql, H_word, errchk = true) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		if (H_word == false) {
			this.O_err.errorOut(1, "@executeMultiple@ \u7F6E\u63DB\u7528\u9023\u60F3\u914D\u5217\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		var result = this.O_dbh.executeMultiple(O_sql, H_word);

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("executeMultiple: " + result, 6);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (errchk == false) {
			return result;
		}

		if (DB.isError(result) == true) {
			this.O_dbh.rollback();
			this.O_err.errorOut(1, "@executeMultiple@ " + result.message + "(" + result.userinfo + ")");
		} else {
			return result;
		}
	}

	commit() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.commit();

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/tracelog.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("Commit", 1);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (DB.isError(this.O_dbh) == true) {
			this.O_err.errorOut(1, "@commit@ " + DB.errorMessage(this.O_dbh));
		}
	}

	rollback() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.rollback();

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("RollBack", 1);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (DB.isError(this.O_dbh) == true) {
			this.O_err.errorOut(1, "@rollback@ " + DB.errorMessage(this.O_dbh));
		}
	}

	disconnect() //トレースフラグが1ならトレース、2ならバックトレースログを吐く
	{
		this.O_dbh.disconnect();

		if (GLOBALS.G_traceflg == 1) {
			if (GLOBALS.GO_tracelog == false) {
				GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_tracelog.log("Disconnect", 1);
		} else if (GLOBALS.G_traceflg == 2) {
			if (GLOBALS.GO_debuglog == false) {
				GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
			}

			GLOBALS.GO_debuglog.log(debug_backtrace(), 7);
		}

		if (DB.isError(this.O_dbh) == true) {
			this.O_err.errorOut(1, "@disconnect@ " + DB.errorMessage(this.O_dbh));
		}
	}

	pgpoolChecker() //失敗した場合（pgpoolが落ちているか予期せぬエラー）
	{
		var sql = "show pool_status;";
		var A_rtn = this.O_dbh.getHash(sql, false);

		if ("object" === typeof A_rtn != true) //マスターＤＢかセカンダリＤＢが落ちている場合
			{
				var cnt = 0;

				for (var tmp of Object.values(A_rtn)) {
					if (tmp.item == "server_status") {
						var A_status = split(" ", tmp.value);
					}

					cnt++;
				}

				if (A_status[3] == "down" || A_status[7] == "down") {
					return false;
				} else {
					return true;
				}
			} else {
			return false;
		}

		return false;
	}

};