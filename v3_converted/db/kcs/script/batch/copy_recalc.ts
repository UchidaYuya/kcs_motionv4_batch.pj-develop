//===========================================================================
//機能：コピーの再計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：コピーの再計算プロセス
error_reporting(E_ALL);

require("lib/update_bill_item.php");

const G_PROCNAME_RECALC_COPY = "copy_recalc";
const G_OPENTIME_RECALC_COPY = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：定数名を設定する
class ProcessRecalcCopy extends ProcessRecalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "\u30B3\u30D4\u30FC\u518D\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9");
	}

	initName() {
		this.m_O_name.initCopy();
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcCopy(G_PROCNAME_RECALC_COPY, log, G_OPENTIME_RECALC_COPY);
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