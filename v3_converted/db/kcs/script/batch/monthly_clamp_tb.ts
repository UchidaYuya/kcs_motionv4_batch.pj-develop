//===========================================================================
//機能：月次のclamp_tb初期化バッチ
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：月次のclamp_tb初期化バッチ
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_MONTHLY_CLAMP_TB = "monthly_clamp_tb";
const G_OPENTIME_MONTHLY_CLAMP_TB = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//各条件の処理を行う
class ProcessMonthlyClampTb extends ProcessCarid {
	constructor(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "\u6708\u6B21\u306Eclamp_tb\u521D\u671F\u5316\u30D0\u30C3\u30C1";
	}

	do_execute() //WHERE節を作る
	//トランザクション終了
	{
		if (!this.m_carid.length) this.m_carid = G_CARRIER_ALL;
		if (!this.beginDB()) return false;
		var status = true;
		var sql_where = " where exists(" + " select * from billdata_delete_setting_tb" + " where billdata_delete_setting_tb.pactid=clamp_tb.pactid" + " and billdata_delete_setting_tb.carid=clamp_tb.carid" + ")";
		if (G_CARRIER_ALL != this.m_carid) sql_where += " and carid=" + this.m_carid;
		if (this.m_pactid.length) sql_where += " and pactid=" + this.m_pactid;
		if (this.m_A_skippactid.length) sql_where += " and pactid not in (" + this.m_A_skippactid.join(",") + ")";
		var sql = "select * from clamp_tb" + sql_where + " order by pactid,carid,detailno;";
		var fname = this.m_curpath + "clamp_tb.delete";

		if (!this.m_db.backup(fname, sql)) {
			this.putError(G_WSCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u4FDD\u5B58\u5931\u6557" + fname + " " + sql);
			return false;
		}

		sql = "delete from clamp_tb" + sql_where + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		if (!this.endDB(status)) return false;
		return status;
	}

	execute_pactid(pactid, carid, year, month) //削除前に
	{
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessMonthlyClampTb(G_PROCNAME_MONTHLY_CLAMP_TB, log, G_OPENTIME_MONTHLY_CLAMP_TB);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);