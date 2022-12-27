//===========================================================================
//機能：カード　再集計計算プロセス
//
//作成：石崎
//===========================================================================
//ログファイル
//DBハンドル作成
//引数格納
//処理後引数
//処理タイプ一覧
//cardcoid を軸としたコードの一覧
//実行時刻
//請求系テーブル番号
//二重起動防止ロック
//再計算待ちを一件ずつ処理
//二重起動アンロック
//機能：card_bill_history_tb から再計算待ちレコードを取得
//引数：
//戻値：再計算待ちレコードをハッシュで返却
//2007/03/02 石崎
error_reporting(E_ALL);

require("lib/script_common.php");

require(BAT_DIR + "/lib/script_db.php");

require(BAT_DIR + "/lib/card_calc_commands.php");

chdir(BAT_DIR);
var dbLogDir = G_LOG;
var dbLogFile = G_LOG + "card_recalc" + date("Ym") + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var A_argv = Array();
var H_argx = Array();
var H_setting = {
	"-m": {
		type: "int"
	},
	"-p": {
		type: "int"
	},
	"-y": {
		type: "int"
	},
	"-c": {
		type: "int"
	}
};
var H_all_code = Array();
var nowtime = date("Y-m-d H:i:s");
var use_table_month = 0;

if (lock(true, dbh, nowtime) == false) {
	logh.putError(G_SCRIPT_ERROR, "card_calc.php \u307E\u305F\u306F\u3001card_recalc.php \u304C\u8D77\u52D5\u4E2D\u3067\u3059");
	throw die(1);
}

var H_recalc_list = get_recalc();
logh.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u5F85\u3061\u30EC\u30B3\u30FC\u30C9\u3092\u53D6\u5F97 " + H_recalc_list.length + "\u4EF6");

for (var value of Object.values(H_recalc_list)) //必要パラメータを作成
{
	H_argx["-m"] = 1;
	H_argx["-p"] = value.pactid;
	H_argx["-y"] = value.year + value.month;
	H_argx["-c"] = value.cardcoid;
	logh.putError(G_SCRIPT_INFO, "\u6B21\u306E\u30D1\u30E9\u30E1\u30FC\u30BF\u3067\u518D\u8A08\u7B97\u3000-m=" + H_argx["-m"] + ": -p=" + H_argx["-p"] + ": -y=" + H_argx["-y"] + ": -c=" + H_argx["-c"]);
	var getTableNo = new TableNo();
	var useMonth = getTableNo.get(value.year, value.month);
	dbh.begin();

	if (calc_card(value.pactid, nowtime, H_argx, useMonth, dbLogDir) == true) {
		if (calc_post(value.pactid, nowtime, H_argx, useMonth, dbLogDir) == false) //失敗sたら次のループ
			{
				continue;
			}
	}

	logh.putError(G_SCRIPT_INFO, "\u518D\u8A08\u7B97\u7D42\u4E86\uFF1A\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3057\u307E\u3059");
	var update_sql = "UPDATE card_bill_history_tb SET status = '2' where pactid = " + value.pactid + " and year = " + value.year + " and month = " + value.month + " and cardcoid = " + value.cardcoid + " and status = '" + value.status + "'";
	dbh.query(update_sql);
	dbh.commit();
}

lock(false, dbh, nowtime);
throw die(0);

function get_recalc() {
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var sql_str = "SELECT pactid, year, month, cardcoid, status FROM " + "card_bill_history_tb where status = '0'";
	return dbh.getHash(sql_str);
};

echo("\n");