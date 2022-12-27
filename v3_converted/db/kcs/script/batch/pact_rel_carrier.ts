//===========================================================================
//機能：会社にひもづくキャリアを電話から調べてpact_rel_carrier_tbに追加する
//
//作成：中西		2006/08/07	初版
//===========================================================================
//このスクリプトの日本語処理名
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//開始メッセージ
//引数を得る
//print_r( $A_pacts );
//コミットポイント開始
//各pactについての処理
//終了メッセージ
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u4F1A\u793E\u306B\u3072\u3082\u3065\u304F\u30AD\u30E3\u30EA\u30A2\u8A2D\u5B9A";
const SCRIPTNAME = "pact_rel_carrier.php";

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");
var argvCnt = _SERVER.argv.length;
var pactid_in = "";

for (var cnt = 1; cnt < argvCnt; cnt++) //-p=pactid 契約ＩＤを取得
{
	if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
			pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[0-9]+$", pactid_in) == false) {
				print("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059.\n");
				throw die(1);
			}
		}
}

var A_pacts = Array();

if (pactid_in == "") //全pactを列挙する
	{
		var sql = "select pactid from pact_tb order by pactid";
		var H_result = dbh.getHash(sql, true);

		for (cnt = 0;; cnt < H_result.length; cnt++) {
			A_pacts.push(H_result[cnt].pactid);
		}
	} else {
	A_pacts.push(pactid_in);
}

dbh.begin();

for (var pactid of Object.values(A_pacts)) //過去テーブルも含めて存在するキャリアを列挙する
//結果をハッシュに保存
//すでにpact_rel_carrier_tbに存在するかどうか調べる
//存在していたデータは削除する
//Insert文を出力する
//print_r( $H_pact_car );
{
	sql = "";

	for (var i = 1; i <= 12; i++) {
		if (i == 0) {
			var mon = "_";
		}

		if (i < 10) {
			mon = "_0" + i;
		} else {
			mon = "_" + i;
		}

		sql += "select pactid, carid from tel" + mon + "_tb " + "where pactid=" + pactid + " group by pactid, carid";

		if (i < 12) {
			sql += " union ";
		}
	}

	H_result = dbh.getHash(sql, true);
	var H_pact_car = Array();

	for (cnt = 0;; cnt < H_result.length; cnt++) //print "DEBUG: " . $pid ." | ". $cid ."\n";
	{
		var pid = H_result[cnt].pactid;
		var cid = H_result[cnt].carid;
		H_pact_car[pid][cid] = 1;
	}

	sql = "select pactid, carid from pact_rel_carrier_tb";
	H_result = dbh.getHash(sql, true);

	for (cnt = 0;; cnt < H_result.length; cnt++) {
		pid = H_result[cnt].pactid;
		cid = H_result[cnt].carid;

		if (undefined !== H_pact_car[pid]) {
			if (undefined !== H_pact_car[pid][cid] && H_pact_car[pid][cid] == 1) //print "DEBUG: unset pactid=". $pactid .", " . $pid ."::". $cid ."\n";
				{
					delete H_pact_car[pid][cid];
				}
		}
	}

	for (var A_row of Object.values(H_pact_car)) {
		for (var key in A_row) //print $sql . "\n";
		{
			var val = A_row[key];
			sql = "insert into pact_rel_carrier_tb(pactid,carid) values (" + pactid + "," + key + ")";
			var return_sql = dbh.query(sql);

			if (return_sql != 1) //その場で終了
				{
					logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "pact_rel_carrier_tb \u306B\u30A4\u30F3\u30B5\u30FC\u30C8\u5931\u6557, " + sql);
					dbh.rollback();
					throw die(1);
				}

			logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + "\u8FFD\u52A0 pact_rel_carrier_tb(" + pactid + ", " + key + ")");
		}
	}
}

dbh.commit();
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);