//===========================================================================
//機能：クランプダウンロード日次処理開始プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：クランプダウンロード日次処理開始プロセス(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/clampfile_tb.php");

const G_PROCNAME_BEGIN_CLAMP_DOCOMO = "begin_clamp_docomo";
const G_OPENTIME_BEGIN_CLAMP_DOCOMO = "0000,2400";

//clamptemp_tbの接続用
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessBeginClampDocomo extends ProcessDefault {
	ProcessBeginClampDocomo(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;
	}

	getProcname() {
		return "\u30AF\u30E9\u30F3\u30D7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u65E5\u6B21\u51E6\u7406\u958B\u59CB\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	beginDB() {
		this.m_db.begin();
		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollback\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9");
		} else if (!status) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	executePactid(pactid, logpath) //clamptemp_tbを削除する
	//実際のコピー部分
	{
		var clamptemp = new ClampFileTb(this.m_listener, this.m_db_temp, this.m_table_no, "clamptemp_tb", ".cla.gz");
		if (!clamptemp.init(pactid, G_CARRIER_DOCOMO, this.m_year, this.m_month)) return false;
		if (!clamptemp.unlink(false)) return false;
		var sql = "select type,detailno from clampfile_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(this.m_year);
		sql += " and month=" + this.m_db.escape(this.m_month);
		sql += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO);
		sql += " and status=" + this.m_db.escape(G_CLAMPFILE_STATUS_START);
		sql += " order by detailno,type";
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
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
			sql += ",'" + date("Y-m-d H:i:s") + "'";
			sql += ",'" + date("Y-m-d H:i:s") + "'";
			sql += "," + line.detailno;
			sql += ")";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db_temp.query(sql);
		}

		return true;
	}

};

checkClient(G_CLIENT_BOTH);
var proc = new ProcessBeginClampDocomo(G_PROCNAME_BEGIN_CLAMP_DOCOMO, G_LOG, G_OPENTIME_BEGIN_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);