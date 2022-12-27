//===========================================================================
//機能：最新回線数更新プロセス(alert.phpから機能分離)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：最新回線数更新プロセス(alert.phpから機能分離)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recent_telcnt_docomo.php");

const G_PROCNAME_RECENT_TELCNT = "recent_telcnt";
const G_OPENTIME_RECENT_TELCNT = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecentTelcnt extends ProcessCarid {
	ProcessRecentTelcnt(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "\u6700\u65B0\u56DE\u7DDA\u6570\u66F4\u65B0\u30D7\u30ED\u30BB\u30B9";
	}

	executePactid(pactid, logpath) //ホットラインか
	{
		var is_hotline = false;
		var sql = "select count(*) from pact_tb";
		sql += " where pactid=" + pactid;
		sql += " and coalesce(type,'')='H'";
		sql += ";";
		if (0 < this.m_db.getOne(sql)) is_hotline = true;
		var no = this.getTableNo();
		var telcnt = new UpdateRecentTelcntDocomo(this.m_listener, this.m_db, this.m_table_no);
		if (!telcnt.execute(pactid, no, is_hotline)) return false;
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessRecentTelcnt(G_PROCNAME_RECENT_TELCNT, log, G_OPENTIME_RECENT_TELCNT);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);