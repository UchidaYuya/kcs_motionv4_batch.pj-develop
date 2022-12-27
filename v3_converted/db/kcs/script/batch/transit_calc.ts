//===========================================================================
//機能：運輸の計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：運輸の計算プロセス
error_reporting(E_ALL);

require("lib/update_bill_item.php");

const G_PROCNAME_CALC_TRANSIT = "transit_calc";
const G_OPENTIME_CALC_TRANSIT = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：定数名を設定する
class ProcessCalcTransit extends ProcessCalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "\u904B\u8F38\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9");
	}

	initName() {
		this.m_O_name.initTransit();
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

var proc = new ProcessCalcTransit(G_PROCNAME_CALC_TRANSIT, log, G_OPENTIME_CALC_TRANSIT);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw die(1);
}

if (false == proc.execute()) {
	throw die(1);
}

throw die(0);