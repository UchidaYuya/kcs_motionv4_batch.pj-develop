//ショップメンバーについたアンダーバーを取る
//2008/11/27	T.Naka
////////////////////////////////////////////////////////////////
//共通ログファイル名
//$dbLogFile = DATA_LOG_DIR . "/billbat.log";
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//$log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, $dbLogFile);
//標準出力に出力
//ログListener にログファイル名、ログ出力タイプを渡す
//$log_listener->PutListener($log_listener_type);
//DBハンドル作成
//エラー出力用ハンドル
//$logh = new ScriptLogAdaptor($log_listener, true);
//全てのショップについて処理を行う
//トランザクション開始
//$dbh->rollback();	// DEBUG * もとにもどす
//本番実行！
////////////////////////////////////////////////////////////////

require("lib/script_db.php");

require("lib/script_log.php");

var log_listener = new ScriptLogBase(0);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var sql = "select * from shop_tb order by shopid";
var H_shop = dbh.getHash(sql, true);
dbh.begin();

for (var A_shop of Object.values(H_shop)) {
	doEachShop(dbh, A_shop);
}

dbh.commit();
throw die(0);

function doEachShop(dbh, A_shop) ////////////////////////////////////////////////////////////
//各ユーザーに、規則的にログインIDを振り直す
{
	var shopid = A_shop.shopid;
	var memid = A_shop.memid;
	print("BEGIN: -- shopid=" + shopid + ",\u300C" + A_shop.name + "\u300D\u51E6\u7406\u958B\u59CB --\n");
	var sql = "select * from shop_member_tb " + "where shopid=" + shopid + " and type != 'SU' order by memid";
	var H_us = dbh.getHash(sql, true);
	var idx = 0;

	for (var A_us of Object.values(H_us)) //ログインIDから_を取り除く
	//print "loginid1=" . $loginid . "\n";
	{
		++idx;
		var loginid = A_us.loginid;

		if (preg_match("/_/", loginid)) //print "loginid2=" . $loginid . "\n";
			{
				loginid = loginid.replace(/_/g, "");
				sql = "update shop_member_tb set loginid='" + loginid + "' " + "where shopid=" + A_us.shopid + " and memid=" + A_us.memid;
				print("SQL: " + sql + "\n");
				dbh.query(sql);
			}
	}
};