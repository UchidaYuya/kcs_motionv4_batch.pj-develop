//ログListener を作成
//DBハンドル作成
//テーブルの数分ループ

require("lib/script_db.php");

require("lib/script_log.php");

var log_listener = new ScriptLogBase(0);
GLOBALS.dbh = new ScriptDB(log_listener);
var rfp = fopen("/kcs_db/log/convertV3/recover_del_rel.sql", "w");
var afp = fopen("/kcs_db/log/convertV3/recover_del_ass.sql", "w");

for (var cnt = 0; cnt < 25; cnt++) //端末が複数の物を取得
//リレーション情報取得
{
	if (0 === cnt) {
		var rel_tb = "tel_rel_assets_tb";
		var ass_tb = "assets_tb";
	} else {
		var num = str_pad(cnt, 2, "0", STR_PAD_LEFT);
		rel_tb = "tel_rel_assets_" + num + "_tb";
		ass_tb = "assets_" + num + "_tb";
	}

	var sql = "select pactid,telno,carid from " + rel_tb + " where pactid=53" + " group by pactid,telno,carid" + " having count(pactid) = 2";
	var A_dup = GLOBALS.dbh.getHash(sql);

	for (var dcnt = 0; dcnt < A_dup.length; dcnt++) {
		var dsql = "select * from " + rel_tb + " where " + " pactid=" + A_dup[dcnt].pactid + " and telno='" + A_dup[dcnt].telno + "'" + " and carid=" + A_dup[dcnt].carid + " order by assetsid";
		var A_rel = GLOBALS.dbh.getHash(dsql);
		var A_main = Array();
		var A_ass = Array();

		for (var rcnt = 0; rcnt < A_rel.length; rcnt++) {
			if (true == A_rel[rcnt].main_flg) {
				A_main.push(A_rel[rcnt]);
				var asql = "select * from " + ass_tb + " where assetsid=" + A_rel[rcnt].assetsid;
				var A_tmp = GLOBALS.dbh.getHash(asql);
				A_ass.push(A_tmp[0]);
			}
		}

		if (A_main.length > 1) {
			var A_diff = array_diff(A_ass[0], A_ass[1]);
			delete A_diff.assetsid;
			delete A_diff.recdate;
			delete A_diff.fixdate;

			if (!A_diff) {
				var rdel = "delete from " + rel_tb + " where assetsid=" + A_ass[1].assetsid;
				var adel = "delete from " + ass_tb + " where assetsid=" + A_ass[1].assetsid;
				fwrite(rfp, rdel + ";\n");
				fwrite(afp, adel + ";\n");
			}
		}
	}
}

fclose(rfp);
fclose(afp);