//===========================================================================
//機能：電気自動車の再計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：電気自動車の再計算プロセス
error_reporting(E_ALL);

require("lib/update_bill_item.php");

const G_PROCNAME_RECALC_EV = "ev_recalc";
const G_OPENTIME_RECALC_EV = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：定数名を設定する
class ProcessRecalcEv extends ProcessRecalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "\u96FB\u6C17\u81EA\u52D5\u8ECA\u518D\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9");
	}

	initName() {
		this.m_O_name.initEv();
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcEv(G_PROCNAME_RECALC_EV, log, G_OPENTIME_RECALC_EV);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw die(1);
}

if (false == proc.isRequest()) {
	throw die(0);
}

if (false == proc.execute()) {
	throw die(1);
}

throw die(0);