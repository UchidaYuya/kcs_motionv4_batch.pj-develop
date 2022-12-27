//---------------------------------------------------------------------------
//ログ出力
//---------------------------------------------------------------------------
//DB関連
//機能：強制的にディレクトリを作る
error_reporting(E_ALL);

require("lib/update_tel_bill.php");

require("lib/update_bill.php");

require("lib/update_alert.php");

require("lib/import_docomo_tel.php");

require("lib/import_docomo_comm.php");

require("lib/import_docomo_info.php");

require("lib/download_docomo.php");

require("lib/changeover_db.php");

require("lib/clampfile_tb.php");

require("lib/script_command.php");

require("lib/update_trend_docomo.php");

require("lib/process_base.php");

require("lib/update_predata_docomo.php");

require("lib/update_recom_docomo.php");

var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
var table_no = new TableNo();
var db = new ScriptDB(err);
var sql = "select year,month from clampfile_tb";
sql += " where status in (2,4) and length(fid)>0";
sql += " group by year,month";
sql += " order by year desc,month desc";
sql += ";";
var result = db.getHash(sql);
var A_ym = Array();

for (var line of Object.values(result)) {
	var item = [line.year, line.month];
	A_ym.push(item);
}

A_ym = [[2005, 2]];

for (var ym of Object.values(A_ym)) execute(db, ym[0], ym[1]);

function execute(db, year, month) //この後にpactid/fin
{
	var g_path = "/kcs/data/" + sprintf("%04d%02d", year, month) + "/";
	forcedir(g_path);
	g_path += "docomo/";
	forcedir(g_path);
	db.begin();
	var sql = "select pactid,type,detailno,fid from clampfile_tb";
	sql += " where status in (2,4) and length(fid)>0";
	sql += ` and year=${year} and month=${month}`;
	sql += " order by pactid,detailno,type";
	sql += ";";
	var result = db.getHash(sql);
	var current_pactid = -1;

	for (var line of Object.values(result)) {
		var path = g_path + line.pactid + "/";
		var post = "fin/";

		if (current_pactid != line.pactid) //ディレクトリがある事を確認
			{
				current_pactid = line.pactid;
				forcedir(path);
				forcedir(path + post);
			}

		path += post;
		var prename = path + line.type + line.detailno;
		var A_fid = line.fid.split(",");
		var cnt = 0;

		for (var fid of Object.values(A_fid)) {
			var fname = prename + sprintf("%02d", cnt) + ".cla.gz";

			if (!pg_lo_export(fid, fname)) {
				echo(`export fault ${fid} ${fname}\n`);
				db.rollback();
				throw die();
			}

			exec(`gzip -d ${fname}`);
			++cnt;
		}
	}

	db.rollback();
};

function forcedir(path) {
	if (file_exists(path) && is_dir(path)) return;
	mkdir(path);
};