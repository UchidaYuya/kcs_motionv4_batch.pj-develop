//===========================================================================
//機能：購買の再計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：購買の再計算プロセス
error_reporting(E_ALL);

require("lib/update_bill_item.php");

const G_PROCNAME_RECALC_PURCHASE = "purchase_recalc";
const G_OPENTIME_RECALC_PURCHASE = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：定数名を設定する
class ProcessRecalcPurchase extends ProcessRecalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "\u8CFC\u8CB7\u518D\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9");
	}

	initName() {
		this.m_O_name.initPurchase();
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcPurchase(G_PROCNAME_RECALC_PURCHASE, log, G_OPENTIME_RECALC_PURCHASE);
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