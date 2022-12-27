//ショップメンバーをV3に移行するためのバッチ
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
//memidが同一であるメンバーを探す=>これを代表ユーザーと見なす
////////////////////////////////////////////////////////////
//今回作成した以外のメンバーからはSUタイプを剥奪する、SUは常に１件だけだ
//対象がどのくらいあるのか表示する
//SU->US に戻す
////////////////////////////////////////////////////////////
//各ユーザーに、規則的にログインIDを振る
{
	var shopid = A_shop.shopid;
	var memid = A_shop.memid;
	print("BEGIN: -- shopid=" + shopid + ",\u300C" + A_shop.name + "\u300D\u51E6\u7406\u958B\u59CB --\n");
	var sql = "select * from shop_member_tb where shopid=" + shopid + " and memid='" + memid + "'";
	var H_member = dbh.getHash(sql, true);
	var cnt = H_member.length;

	if (cnt == 0) {
		print("ERROR: shopid=" + shopid + ", memid=" + memid + " : \u540C\u4E00\u30ED\u30B0\u30A4\u30F3\u30E6\u30FC\u30B6\u30FC\u304C\u5B58\u5728\u3057\u306A\u3044.\n");
		return;
	} else if (cnt > 1) {
		print("ERROR: shopid=" + shopid + ", memid=" + memid + " : \u4EE3\u8868\u30E6\u30FC\u30B6\u30FC\u304C\u8907\u6570\u5B58\u5728.\n");
		return;
	}

	sql = "update shop_member_tb set " + "loginid='" + A_shop.loginid + "', " + "passwd='" + A_shop.passwd + "', " + "type='SU' " + "where shopid=" + shopid + " and memid=" + memid;
	print("SQL: " + sql + "\n");
	dbh.query(sql);
	sql = "select * from shop_member_tb " + "where shopid=" + shopid + " and memid != " + memid;
	var H_su = dbh.getHash(sql, true);

	for (var A_su of Object.values(H_su)) {
		print("INFO: \u3053\u306E\u30E6\u30FC\u30B6\u30FC\u304B\u3089SU\u5265\u596A\u3057\u307E\u3057\u305F: " + A_su.shopid + ", " + A_su.memid + ", " + A_su.loginid + ", " + A_su.name + "\n");
	}

	sql = "update shop_member_tb set " + "type='US' " + "where shopid=" + shopid + " and memid != " + memid;
	print("SQL: " + sql + "\n");
	dbh.query(sql);
	sql = "select * from shop_member_tb " + "where shopid=" + shopid + " and type!='SU' order by memid";
	var H_us = dbh.getHash(sql, true);
	var idx = 0;

	for (var A_us of Object.values(H_us)) //新たなログインIDは、ショップのログインID + _数字 とした
	{
		++idx;
		var loginid = A_shop.loginid + "_" + idx;
		sql = "update shop_member_tb set loginid='" + loginid + "' " + "where shopid=" + A_us.shopid + " and memid=" + A_us.memid;
		print("SQL: " + sql + "\n");
		dbh.query(sql);
	}
};