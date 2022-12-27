//===========================================================================
//機能：カード　集計計算プロセス
//
//作成：石崎
//更新	20090611	森原	pgpoolのINSERTロック解除
//===========================================================================
//ログファイル
//$log_listener_typeView =& new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
//DBハンドル作成
//引数格納
//処理後引数
//処理タイプ一覧
//cardcoid を軸としたコードの一覧
//実行時刻
//請求系テーブル番号
//引数処理=====================
//引数受け取り
//処理後の引数配列をチェック、未入力引数にデフォルト値を入力
//指定された日付から、使用するデータベースの名前を求める
//使用する請求系テーブルの番号
//二重起動防止ロックをかける既に起動中は強制終了
//メイン処理
//二重起動アンロック
//機能：
//引数：処理する顧客の一覧,請求年,請求月,現在時間,実行引数,使用テーブルNo. ,ログディレクトリ
//戻値：処理できなかった顧客の一覧
//2007/02/26 石崎
ini_set("output_buffering", "Off");
ini_set("output_handler", "");
error_reporting(E_ALL);

require("lib/script_common.php");

require(BAT_DIR + "/lib/script_db.php");

require(BAT_DIR + "/lib/card_calc_commands.php");

chdir(BAT_DIR);
var dbLogDir = G_LOG;
var dbLogFile = G_LOG + "card_calc_" + date("Ym") + ".log";
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
A_argv = _SERVER.argv;
var first_arg = true;

for (var argv of Object.values(A_argv)) //一番目の引数をムシ
//$typeと$value の型は正しい組合せか
{
	if (first_arg == true) {
		first_arg = false;
		continue;
	}

	if (strpos(argv, "=") == false) {
		go_usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u306B = \u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", argv);
	} else {
		var type, value;
		[type, value] = argv.split("=");
		var type_match = 0;

		for (var key in H_setting) {
			var mode = H_setting[key];

			if (key == type) {
				type_match++;
			}
		}

		if (type_match != 1) {
			go_usage("\u4E88\u671F\u305B\u306C\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u3067\u3059", argv);
		}
	}

	switch (H_setting[key].type) {
		case "int":
			if (ereg("[0-9]", value) == false) {
				go_usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u3068\u5024\u306E\u7D44\u5408\u305B\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093", argv);
			}

	}

	if (type == "-y") {
		if (value.length != 6) {
			go_usage("\u6307\u5B9A\u3055\u308C\u305F\u65E5\u4ED8\u306E\u5024\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093", argv);
		}
	}

	if (type == "-m") {
		if (value == 1 or value == 0 == false) {
			go_usage("m\u3067\u6307\u5B9A\u3067\u304D\u308B\u306E\u306F\u30010\uFF08\u975E\u554F\u3044\u5408\u308F\u305B\u30E2\u30FC\u30C9\uFF091\uFF08\u554F\u3044\u5408\u308F\u305B\u30E2\u30FC\u30C9\uFF09\u306E\u3044\u3065\u308C\u304B\u3067\u3059", argv);
		}
	}

	if (undefined !== H_argx[type] == true) {
		go_usage("\u540C\u3058\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u306F\u3001\u8907\u6570\u56DE\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093", argv);
	}

	H_argx[type] = value;
}

if (undefined !== H_argx["-m"] == false) {
	H_argx["-m"] = 1;
}

if (undefined !== H_argx["-p"] == false) {
	H_argx["-p"] = 0;
}

if (undefined !== H_argx["-y"] == false) {
	H_argx["-y"] = date("Ym");
}

if (undefined !== H_argx["-c"] == false) {
	H_argx["-c"] = 0;
}

if (H_argx["-m"] == 1) //print "\n\n";
	//print "m=";
	//print "p=";
	{
		fwrite(STDOUT, "\n\n");
		fwrite(STDOUT, "\u4E0B\u8A18\u306E\u30D1\u30E9\u30E1\u30FC\u30BF\u3092\u7528\u3044\u3066\u96C6\u8A08\u51E6\u7406\u3092\u884C\u3044\u307E\u3059\n");
		fwrite(STDOUT, "-m=");

		if (H_argx["-m"] == 0) {
			fwrite(STDOUT, "0 \u78BA\u8A8D\u306A\u3057\u30E2\u30FC\u30C9(0:00-8:00\u307E\u3067\u3057\u304B\u5B9F\u884C\u3067\u304D\u307E\u305B\u3093)\n");
		} else {
			fwrite(STDOUT, "1 \u78BA\u8A8D\u3042\u308A\u30E2\u30FC\u30C9(24\u6642\u9593\u5B9F\u884C\u3059\u308B\u3053\u3068\u304C\u51FA\u6765\u307E\u3059)\n");
		}

		fwrite(STDOUT, "-p=");

		if (H_argx["-p"] == 0) {
			fwrite(STDOUT, "0\uFF08\u5168\u9867\u5BA2\uFF09\n");
		} else {
			fwrite(STDOUT, H_argx["-p"] + "\n");
		}

		fwrite(STDOUT, "-y=" + H_argx["-y"] + "\n");
		fwrite(STDOUT, "-c=");

		if (H_argx["-c"] == 0) {
			fwrite(STDOUT, "0\uFF08\u5168\u4F1A\u793E\uFF09\n");
		} else {
			fwrite(STDOUT, H_argx["-c"] + "\n");
		}

		fwrite(STDOUT, "\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F\uFF08N/y\uFF09> ");
		var stdin = fopen("php://stdin", "r");
		var line = fgets(stdin, 64).trim();

		if (line == "y" or line == "Y" == false) {
			fwrite(STDOUT, line + "\uFF1A\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\n\n");
			throw die(0);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "\u5F15\u6570\u51E6\u7406\u5B8C\u4E86\u3000\u4E0B\u8A18\u306E\u30D1\u30E9\u30E1\u30FC\u30BF\u3067\u96C6\u8A08\u51E6\u7406\u3092\u958B\u59CB");
logh.putError(G_SCRIPT_INFO, "-m=" + H_argx["-m"]);
logh.putError(G_SCRIPT_INFO, "-p=" + H_argx["-p"]);
logh.putError(G_SCRIPT_INFO, "-y=" + H_argx["-y"]);
logh.putError(G_SCRIPT_INFO, "-c=" + H_argx["-c"]);
var year = H_argx["-y"].substr(0, 4);
var month = H_argx["-y"].substr(4, 2);
var getTableNo = new TableNo();
var useMonth = getTableNo.get(year, month);

if (lock(true, dbh, nowtime) == false) {
	logh.putError(G_SCRIPT_ERROR, "card_calc.php \u307E\u305F\u306F\u3001card_recalc.php \u304C\u8D77\u52D5\u4E2D\u3067\u3059");
	throw die(1);
}

var A_pactList = get_state(H_argx, useMonth);
var A_an_patcList = do_pact(A_pactList, year, month, nowtime, H_argx, useMonth, dbLogDir);
lock(false, dbh, nowtime);
throw die(0);

function do_pact(A_pactList, year, month, nowtime, H_argx, useMonth, dbLogDir) //時間外で処理を中断するか否か
//顧客一覧から一顧客づつ処理
{
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var outside_hours = true;
	var pact_count = A_pactList.length;

	if (pact_count < 1) {
		logh.putError(G_SCRIPT_INFO, "\u5BFE\u8C61\u3068\u306A\u308B\u9867\u5BA2\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
		return;
	} else {
		logh.putError(G_SCRIPT_INFO, "\u5BFE\u8C61\u9867\u5BA2\u6570 " + pact_count + "\u4EF6");
	}

	for (var pactid_num of Object.values(A_pactList)) //カード単位での集計
	//請求履歴テーブルに集計時間を挿入
	//20090611森原 PGPOOL_NO_INSERT_LOCK 追加
	//$dbh->rollback();
	{
		if (H_argx["-m"] == 0) //0:00-8:00（実行時間内）かを判別
			{
				outside_hours = get_time();
			}

		if (outside_hours == false) {
			fwrite(STDOUT, "\u5B9F\u884C\u6642\u9593\u5916\u306E\u305F\u3081\u96C6\u8A08\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\n\n");
			logh.putError(G_SCRIPT_INFO, "\u5B9F\u884C\u6642\u9593\u5916\u306E\u305F\u3081\u96C6\u8A08\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002");
			return;
		}

		dbh.begin();
		logh.putError(G_SCRIPT_INFO, "pactid = " + pactid_num + " \u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");

		if (calc_card(pactid_num, nowtime, H_argx, useMonth, dbLogDir) == false) //失敗した場合は次のループへ
			{
				continue;
			}

		if (calc_post(pactid_num, nowtime, H_argx, useMonth, dbLogDir) == false) //失敗した場合は次のループへ
			{
				continue;
			}

		logh.putError(G_SCRIPT_INFO, "pactid = " + pactid_num + " \u306E\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
		write_state(pactid_num, nowtime, H_argx);
		var insert_sql = PGPOOL_NO_INSERT_LOCK + "INSERT INTO card_bill_history_tb values(" + pactid_num + "," + H_argx["-y"].substr(0, 4) + "," + H_argx["-y"].substr(4, 2) + "," + H_argx["-c"] + ",'card_calc','" + nowtime + "','2C')";
		logh.putError(G_SCRIPT_INFO, "\u8ACB\u6C42\u30C6\u30FC\u30D6\u30EB\u306B\u7D42\u4E86\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u633F\u5165\u3057\u307E\u3059\uFF1A" + pactid_num + ":" + H_argx["-y"] + ":" + H_argx["-c"] + ":" + "card_calc" + ":" + nowtime + ":2C");
		var res = dbh.query(insert_sql);
		dbh.commit();
	}
};

echo("\n");