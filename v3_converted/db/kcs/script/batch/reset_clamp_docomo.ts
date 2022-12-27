//===========================================================================
//機能：クランプダウンロード試行期間切り替えプロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：クランプダウンロード試行期間切り替えプロセス(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_RESET_CLAMP_DOCOMO = "reset_clamp_docomo";
const G_OPENTIME_RESET_CLAMP_DOCOMO = "0000,2400";

//一時DBの接続用
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：処理の前に呼ばれる
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理の後に呼ばれる
//引数：do_executeの実行ステータス
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：リセットを行う
//引数：DBインスタンス
//返値：深刻なエラーが発生したらfalseを返す
class ProcessResetClampDocomo extends ProcessBase {
	ProcessResetClampDocomo(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;
	}

	getProcname() {
		return "\u30AF\u30E9\u30F3\u30D7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A66\u884C\u671F\u9593\u5207\u308A\u66FF\u3048\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	begin() {
		if (!ProcessDefault.begin()) return false;
		return this.lockWeb(this.m_db_temp, "lock_regist_" + G_CLAMP_ENV);
	}

	end(status) {
		if (!this.unlockWeb(this.m_db_temp)) return false;
		return ProcessDefault.end(status);
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

	do_execute() {
		if (!this.beginDB()) return false;
		var status = this.resetClamp(this.m_db_temp);
		return this.endDB(status);
	}

	resetClamp(O_db) {
		var sql = "select count(*) from clampweb_function_tb" + " where command='reset'" + ";";

		if (0 == O_db.getOne(sql)) {
			sql = "insert into clampweb_function_tb" + "(command,fixdate)" + "values(" + "'reset'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
		}

		return true;
	}

};

checkClient(G_CLIENT_BOTH);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_WEB) log = G_LOG_ADMIN_DOCOMO_WEB;
var proc = new ProcessResetClampDocomo(G_PROCNAME_RESET_CLAMP_DOCOMO, log, G_OPENTIME_RESET_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);