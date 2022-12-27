//===========================================================================
//機能：ASP利用料挿入プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：ASP利用料挿入プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_asp_charge.php");

const G_PROCNAME_ASP_CHARGE = "asp_charge";
const G_OPENTIME_ASP_CHARGE = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessAspCharge extends ProcessCarid {
	ProcessAspCharge(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "ASP\u5229\u7528\u6599\u633F\u5165\u30D7\u30ED\u30BB\u30B9";
	}

	executePactid(pactid, logpath) //既存レコードを削除する
	{
		var no = this.getTableNo();
		var O_ins = new TableInserter(this.m_listener, this.m_db, logpath + "tel_details_" + no + "_tb.insert", true);
		var O_asp_charge = new UpdateAspCharge(this.m_listener, this.m_db, this.m_table_no, O_ins);
		if (!O_asp_charge.delete(pactid, this.m_carid, this.m_year, this.m_month, logpath + "tel_details_" + no + "_tb.delete")) return false;
		if (!O_asp_charge.execute(pactid, this.m_carid, this.m_year, this.m_month)) return false;
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessAspCharge(G_PROCNAME_ASP_CHARGE, log, G_OPENTIME_ASP_CHARGE);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);