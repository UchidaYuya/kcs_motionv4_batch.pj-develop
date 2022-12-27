//=========================================
//
//clampweb_dtails_tb
//
//=========================================
var dbsh;
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

if (!(dbsh = pg_connect("host=localhost port=5432 dbname=check-kcsmotion-storage user=postgres password=6vj5wtLy"))) {
	echo("\u63A5\u7D9A\u5931\u6557\n");
}

var sql = "select * from clampweb_daily_tb order by pactid, detailno";

if (!(Row = pg_query(dbsh, sql))) {
	echo("select\u5931\u6557");
}

var webData = pg_fetch_all(Row);
var fileList = Array();

if (0 < webData.length && false !== webData) {
	for (var dataValue of Object.values(webData)) {
		if (!file_exists("/usr/chk_kcs/db/kcs/data/strage/check-kcsmotion-storage/" + dataValue.fid)) {
			fileList.push(dataValue.fid);
		}
	}
}

if (!(dirh = opendir("/usr/chk_kcs/db/kcs/data/strage/check-kcsmotion-storage/"))) {
	echo("\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u30AA\u30FC\u30D7\u30F3\u5931\u6557\n");
}

var sqlList = Array();

for (var fileName of Object.values(fileList)) {
	sqlList.push("delete from clampweb_daily_tb where fid='" + fileName + "'");
}

sql = "select fid, pactid, year, month, detailno, type from clampweb_details_tb order by pactid, detailno";

if (!(Row = pg_query(dbsh, sql))) {
	echo("select\u5931\u6557");
}

webData = pg_fetch_all(Row);
var codeList = Array();

if (0 < webData.length && false !== webData) {
	for (var dataValue of Object.values(webData)) {
		if (!file_exists("/usr/chk_kcs/db/kcs/data/strage/check-kcsmotion-storage/" + dataValue.fid)) {
			codeList.push(dataValue.fid);
		}
	}
}

var deleteDetails = deleteType = Array();

if (0 < codeList.length) {
	sql = "select fid, pactid, year, month, detailno, type from clampweb_details_tb where fid in ('" + codeList.join("','") + "') order by pactid, detailno";
	var Rows = pg_query(dbsh, sql);
	var deleteList = pg_fetch_all(Rows);

	for (var info of Object.values(deleteList)) {
		deleteType.push("delete from clampdb_type_tb where " + "pactid=" + info.pactid + " AND year=" + info.year + " AND month=" + info.month + " AND detailno=" + info.detailno + " AND type='" + info.type + "'");
		deleteDetails.push("delete from clampweb_details_tb where " + "pactid=" + info.pactid + " AND year=" + info.year + " AND month=" + info.month + " AND detailno=" + info.detailno + " AND type='" + info.type + "'");
	}
}

if (0 < sqlList.length) {
	for (var code of Object.values(sqlList)) {
		echo(code + "\n");
		pg_query(dbsh, code);
	}
}

if (0 < deleteDetails.length) {
	for (var code of Object.values(deleteDetails)) {
		echo(code + "\n");
		pg_query(dbsh, code);
	}
}

if (0 < deleteType.length) {
	var dbh;

	if (!(dbh = pg_connect("host=localhost port=5432 dbname=check-kcsmotion-storage user=postgres password=6vj5wtLy"))) {
		echo("DB\u63A5\u7D9A\u5931\u6557\n");
	}

	for (var code of Object.values(deleteType)) {
		echo(code + "\n");
		pg_query(dbh, code);
	}
}

if (undefined !== dbh) {
	pg_close(dbh);
}

pg_close(dbsh);