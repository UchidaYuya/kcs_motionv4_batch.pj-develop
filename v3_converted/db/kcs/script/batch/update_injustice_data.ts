#!/usr/local/bin/php
//DBハンドル作成
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "check_injustice_data.php";

require("lib/script_db.php");

require("lib/script_log.php");

var dbh = new ScriptDB(log_listener);
if (DEBUG_FLG) logging("INFO : \u4E3B\u7AEF\u672B\u7121\u3057\u89E3\u6D88\u30B9\u30AF\u30EA\u30D7\u30C8", true);

for (var i = 0; i < 25; i++) //1番はじめのループにて、最新のテーブルをセット(_XXがないため)
//同一回線にて、主端末が未登録のデータをセット
{
	if (i == 0) {
		var tb = "tel_rel_assets_tb";
	} else {
		tb = "tel_rel_assets_" + str_pad(i, 2, "0", STR_PAD_LEFT) + "_tb";
	}

	var list = dbh.getHash("select pactid, telno, carid from " + tb + " where (pactid, telno, carid) in (select pactid, telno, carid from " + tb + " group by pactid, telno, carid having count(*) = 1) and main_flg = 'f';", true);
	if (DEBUG_FLG) logging("INFO : " + tb + " \u306E\u4E3B\u7AEF\u672B\u7121\u3057\u306F" + count(list) + "\u4EF6", false);
	dbh.begin();
	var err = false;

	for (var row of Object.values(list)) {
		var where = " where pactid=" + row.pactid + " and telno='" + row.telno + "' and carid=" + row.carid;
		var count = dbh.getOne("select count(*) from " + tb + where, true);

		if (count == 1) {
			var sql = "update " + tb + " set main_flg=true" + where;
			var res = dbh.query(sql, true);
			if (DEBUG_FLG) logging("SQL : " + sql, false);

			if (res != 1) {
				if (DEBUG_FLG) logging("ERROR : \u66F4\u65B0\u5931\u6557\uFF08" + sql + "\uFF09", false);
				dbh.rollback();
				err = true;
				break;
			}
		}
	}

	if (!err) {
		dbh.commit();
	}
}

function logging(lstr, clear_txt = false) //ローカルログファイル名
//日時をエラー内容の前に出力
//1行目の出力の前にlogファイルの中身を削除
{
	var localLogFile = KCS_DIR + "/log/batch/update_injustice_data.log";
	var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";

	if (clear_txt == true) {
		var lfp = fopen(localLogFile, "w");
	} else {
		lfp = fopen(localLogFile, "a");
	}

	flock(lfp, LOCK_EX);
	fwrite(lfp, log_buf);
	flock(lfp, LOCK_UN);
	fclose(lfp);
	return;
};