#!/usr/local/bin/php
//DBハンドル作成
//インサート用日付
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("convert_v3_function.php");

GLOBALS.dbh = new ScriptDB(log_listener);
var sql = "select fr.* from fnc_relation_tb fr inner join function_tb ft on fr.fncid=ft.fncid " + " where pactid=61 " + " order by fr.pactid,fr.userid,ft.show_order";
var A_fnc = GLOBALS.dbh.getHash(sql);
var basetime = date("Y-m-d H:i:s");
var A_basetime = split("-| |:", basetime);

for (var cnt = 0; cnt < A_fnc.length; cnt++) //お気に入りテーブルへのインサート
//既にそのお気に入りが登録されてないか調べる
{
	var fav_chk = "select count(pactid) from favorite_usermenu_tb " + " where " + " pactid=" + A_fnc[cnt].pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=" + A_fnc[cnt].fncid;
	var favcnt = GLOBALS.dbh.getOne(fav_chk);

	if (favcnt < 1) {
		var recdate = date("Y-m-d H:i:s", mktime(A_basetime[3], A_basetime[4], A_basetime[5] + cnt, A_basetime[1], A_basetime[2], A_basetime[0]));
		sql = "insert into favorite_usermenu_tb values(" + A_fnc[cnt].pactid + "," + A_fnc[cnt].userid + "," + A_fnc[cnt].fncid + ",'" + recdate + "')";
		var res = GLOBALS.dbh.query(sql);
	}
}

GLOBALS.dbh.commit();