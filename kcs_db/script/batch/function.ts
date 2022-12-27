//@author houshiyama
//@since 2008/09/03
import { DEBUG_FLG } from "./import_au";
import { G_SCRIPT_WARNING, STDOUT } from "./lib/script_log";

const fs = require('fs');
const SCRIPT_NAME = "function.ts";

function usage(comment) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -p={PACTID}\n");
	console.log("\t\t-p 契約ＩＤ \t(PACTID:指定した契約ＩＤを実行)\n");
	console.log("\t\t-m 実行モード（省略したらf\n");
	console.log("\t\t \t\t\t\tf:ファイルにSQL文書くだけ\n");
	console.log("\t\t\t\t\t \td:ファイルにSQL文書きつつ実行\n");
	throw process.exit(1);// 2022cvt_009
};

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
				db.putError(G_SCRIPT_WARNING, "多重動作");
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
	var tm = 	new Date();
	var yyyy = tm.getFullYear();
	var mm = tm.getMonth();
	if (mm < 10) mm = 0 + mm;
	var dd = tm.getDay();
	if (dd < 10) dd = 0 + dd;
	var hh = tm.getHours();
	if (hh < 10) hh = 0 + hh;
	var nn = tm.getMinutes();
	if (nn < 10) nn = 0 + nn;
	var ss = tm.getSeconds();
	if (ss < 10) ss = 0 + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function logging(lstr:string) {
	var log_buf = new Date() + " : " + lstr + "\n";
const lfp = fs.createWriteStream(global.LocalLogFile);
	// var lfp = fopen(global.LocalLogFile, "a");
	
	// flock(lfp, LOCK_EX);
	const lockfile = require('proper-lockfile');
	lockfile.lock(global.LocalLogFile);	 	 
	fs.writeFileSync(lfp, log_buf);
	// fclose(lfp);
	lfp.end()	 
	return;
};

function execFunction(mode, sql, fp) //ファイルに書き出す
//その場で実行モードならば
{
	fs.writeFileSync(fp, sql + ";\n");

	if ("d" == mode) {
		var res = global.dbh.query(sql);

		if (res == false || res != 1) {
			fs.writeFileSync(STDOUT, "ERROR: sqlエラー:" + sql + "\n");
			if (DEBUG_FLG) logging("ERROR: sqlsqlエラー:" + sql + "\n");
			global.dbh.rollback();
			throw process.exit();// 2022cvt_009
		}
	}
};
