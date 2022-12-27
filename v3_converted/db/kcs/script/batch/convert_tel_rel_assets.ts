//ローカルログファイル名
const DEBUG_FLG = 1;

require("lib/script_db.php");

require("lib/script_log.php");

var LocalLogFile = KCS_DIR + "/log/batch/convert_tel_rel_assets.log";
var log_listener = new ScriptLogBase(0);
var db = new ScriptDB(log_listener);
if (DEBUG_FLG) logging("START: \u91CD\u8907\u4E3B\u7AEF\u672B\u524A\u9664\u3092\u958B\u59CB\u3057\u307E\u3059\u3002", false);
db.begin();

for (var i = 0; i < 25; i++) {
	if (0 === i) {
		var tra_tb = "tel_rel_assets_tb";
		var ass_tb = "assets_tb";
	} else {
		tra_tb = "tel_rel_assets_" + str_pad(i, 2, "0", STR_PAD_LEFT) + "_tb";
		ass_tb = "assets_" + str_pad(i, 2, "0", STR_PAD_LEFT) + "_tb";
	}

	var list_sql = "select pactid,telno,carid from " + tra_tb + " where main_flg='t' and pactid in (90,98,99,1000006) group by pactid, telno, carid having count(*) >= 2";
	var A_list = db.getHash(list_sql);

	for (var j = 0; j < A_list.length; j++) {
		var get_sql = "select tra.assetsid,tra.pactid,tra.telno,tra.carid,ass.recdate " + " from " + tra_tb + " tra left join " + ass_tb + " ass on tra.pactid=ass.pactid and tra.assetsid=ass.assetsid " + " where tra.pactid=" + A_list[j].pactid + " and tra.telno='" + A_list[j].telno + "' and tra.carid=" + A_list[j].carid + " order by ass.recdate desc";
		var A_res = db.getHash(get_sql);

		for (var k = 0; k < A_res.length; k++) {
			if (k === 0) {
				continue;
			}

			var H_row = A_res[k];
			var up_sql = "update " + tra_tb + " set main_flg=false " + " where " + " pactid=" + H_row.pactid + " and " + " telno='" + H_row.telno + "' and " + " carid=" + H_row.carid + " and " + " assetsid=" + H_row.assetsid;
			if (DEBUG_FLG) logging("INFO: " + up_sql, false);
			var res = db.query(up_sql);

			if (res !== 1) {
				if (DEBUG_FLG) logging("ERROR: " + up_sql, false);
				if (DEBUG_FLG) logging("ERROR: \u66F4\u65B0\u6570 " + res, false);
				db.rollback();
				echo("error \n");
				throw die();
			}
		}
	}
}

db.commit();
if (DEBUG_FLG) logging("END: \u91CD\u8907\u4E3B\u7AEF\u672B\u524A\u9664\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002", false);

function logging(lstr, clear_txt) //日時をエラー内容の前に出力
//1行目の出力の前にlogファイルの中身を削除
{
	var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";

	if (clear_txt == true) {
		var lfp = fopen(GLOBALS.LocalLogFile, "w");
	} else {
		lfp = fopen(GLOBALS.LocalLogFile, "a");
	}

	flock(lfp, LOCK_EX);
	fwrite(lfp, log_buf);
	flock(lfp, LOCK_UN);
	fclose(lfp);
	return;
};