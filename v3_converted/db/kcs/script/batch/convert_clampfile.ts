//古い形式のclampfile_tbから、clampwebとclampdbのレコードを作成する
//$sql .= " where pactid not in ()";//####
error_reporting(E_ALL);

require("lib/script_log.php");

require("lib/script_db.php");

var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
var table_no = new TableNo();
var db = new ScriptDB(err);
db.begin();
echo("begin;\n");
var sql = "select pactid from pact_tb";
sql += " order by pactid";
sql += ";";
var result_pactid = db.getAll(sql);

for (var A_line_pactid of Object.values(result_pactid)) {
	var pactid = A_line_pactid[0];
	var year = date("Y");
	var month = date("n");

	for (var cnt = 0; cnt < 4; ++cnt) {
		--month;

		if (0 == month) {
			month = 12;
			--year;
		}
	}

	for (cnt = 0;; cnt < 4; ++cnt) {
		sql = "select pactid,detailno,type";
		sql += " from clampfile_tb";
		sql += " where year=" + year;
		sql += " and month=" + month;
		sql += " and status in(8)";
		sql += " and pactid =" + pactid;
		sql += " order by pactid,detailno,type";
		sql += ";";
		var result = db.getAll(sql);
		var cur_pactid = "";
		var cur_detailno = "";
		var A_cur_type = Array();

		for (var A_line of Object.values(result)) {
			pactid = A_line[0];
			var detailno = A_line[1];
			var type = A_line[2];

			if (strcmp(cur_pactid, pactid) || strcmp(cur_detailno, detailno)) {
				if (A_cur_type.length) execute(db, cur_pactid, cur_detailno, year, month, A_cur_type);
				A_cur_type = Array();
				cur_pactid = pactid;
				cur_detailno = detailno;
			}

			A_cur_type.push(type);
		}

		if (A_cur_type.length) execute(db, cur_pactid, cur_detailno, year, month, A_cur_type);
		++month;

		if (12 < month) {
			month = 1;
			++year;
		}
	}
}

db.rollback();
echo("commit;\n");

function execute(db, pactid, detailno, year, month, A_type) //clampdb_index_tb
//clampdb_type_tb
{
	var sql = "insert into clampdb_index_tb";
	sql += "(pactid,detailno,year,month,fixdate)";
	sql += "values(" + pactid;
	sql += "," + detailno;
	sql += "," + year;
	sql += "," + month;
	sql += ",'" + date("Y-m-d H:i:s") + "')";
	sql += ";";
	echo(`${sql}\n`);

	for (var type of Object.values(A_type)) {
		sql = "insert into clampdb_type_tb";
		sql += "(pactid,detailno,year,month,type,is_ready,fixdate)";
		sql += "values(" + pactid;
		sql += "," + detailno;
		sql += "," + year;
		sql += "," + month;
		sql += ",'" + type + "'";
		sql += ",true";
		sql += ",'" + date("Y-m-d H:i:s") + "')";
		sql += ";";
		echo(`${sql}\n`);
	}
};