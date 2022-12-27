#!/usr/local/bin/php
//スクリプト名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//他に起動中のバッチが無いかチェック
//他のバッチが起動中ならば強制終了
//ファイルオープン
//ファイルオープン失敗
//以下コピペしてきた汎用関数
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const SCRIPT_NAME = "convert_s77.php";
const LOG_DIR = KCS_DIR + "/log/convertTelfunction";
const TELADM = 104;
const TELMODADM = 155;
const DETMODADM = 156;
const ASSMODADM = 157;
var A_column = ["pactid", "userid", "fncid"];
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var LocalLogFile = LOG_DIR + "/convert" + date("Y-m-d") + ".log";
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var b_sql = "select count(command) from clamptask_tb where command !='batch_" + SCRIPT_NAME + "'";
var b_cnt = dbh.getOne(b_sql);

if (b_cnt > 0) {
	fwrite(STDOUT, "\u4ED6\u306B\u8D77\u52D5\u4E2D\u306E\u30D0\u30C3\u30C1\u304C\u3042\u308A\u307E\u3059\n\u5168\u3066\u306E\u30D0\u30C3\u30C1\u304C\u7D42\u4E86\u3057\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\n");
	logging("\u4ED6\u306B\u8D77\u52D5\u4E2D\u306E\u30D0\u30C3\u30C1\u304C\u3042\u308A\u307E\u3059\n\u5168\u3066\u306E\u30D0\u30C3\u30C1\u304C\u7D42\u4E86\u3057\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\n");
	throw die(1);
}

if (lock(true, dbh) == false) {
	fwrite(STDOUT, " \u96FB\u8A71\u7BA1\u7406\u6A29\u9650\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	logging(" \u96FB\u8A71\u7BA1\u7406\u6A29\u9650\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	throw die(1);
}

var get_uid = "select pactid,userid from fnc_relation_tb " + "where " + "fncid=" + TELADM + " " + "and userid not in (select userid from fnc_relation_tb where fncid in (" + TELMODADM + "," + DETMODADM + "," + ASSMODADM + ")) " + "group by pactid,userid " + "order by pactid,userid";
var A_uid = dbh.getHash(get_uid, true);
var filename = LOG_DIR + "/copy" + date("Y-m-d") + ".sql";
var fp = fopen(filename, "w");

if (fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	return false;
}

for (var cnt = 0; cnt < A_uid.length; cnt++) {
	var base_str = A_uid[cnt].pactid + "\t" + A_uid[cnt].userid + "\t";
	fwrite(fp, base_str + TELMODADM + "\n");
	fwrite(fp, base_str + DETMODADM + "\n");
	fwrite(fp, base_str + ASSMODADM + "\n");
}

if (doCopyInsert("fnc_relation_tb", filename, A_column, dbh) != 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u96FB\u8A71\u7BA1\u7406\u6A29\u9650\u30B3\u30F3\u30D0\u30FC\u30C8\u5931\u6557");
	return false;
}

lock(false, dbh);

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_NAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "\u591A\u91CD\u52D5\u4F5C");
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + pre + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function logging(lstr) {
	var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";
	var lfp = fopen(GLOBALS.LocalLogFile, "a");
	flock(lfp, LOCK_EX);
	fwrite(lfp, log_buf);
	fclose(lfp);
	return;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
				fclose(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};