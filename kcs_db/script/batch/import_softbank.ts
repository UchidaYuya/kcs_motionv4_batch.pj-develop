export const SCRIPT_NAMEJ = "SoftBankインポートメイン";
import { execSync } from 'child_process';
// 2022cvt_026
//require("lib/script_db.php");
import { ScriptDB } from "../batch/lib/script_db";
// 2022cvt_026
//require("lib/script_log.php");
import {
	G_SCRIPT_ALL,
	G_SCRIPT_WARNING,
	G_SCRIPT_BEGIN,
	G_SCRIPT_ERROR,
	G_SCRIPT_END,
	ScriptLogBase,
	ScriptLogFile,
	ScriptLogAdaptor
} from "../batch/lib/script_log";
import { DATA_LOG_DIR } from "../../db_define/define";
import { IMPORT_SOFTBANK_BILL } from "../../db_define/define";
import { IMPORT_VODA_TUWA } from "../../db_define/define";

export const LOG_DELIM = " ";
export const PHP = "php";
(async ()=>{
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
// 2022cvt_015
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_016
log_listener.putListener(log_listener_type2);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);// 2022cvt_009
	}

// 2022cvt_015
var argvCnt = process.argv.length;

// 2022cvt_015
for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("^-e="))
	// if (ereg("^-e=",_SERVER.argv[cnt]) == true) //モード文字列チェック
		{
// 2022cvt_015
            var mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!mode.match("^[ao]$")) {
			// if (ereg("^[ao]$", mode) == false) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}
	var billdate;
	if (process.argv[cnt].match("^-y=")) //請求年月文字列チェック
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
// 2022cvt_015
			billdate = process.argv[cnt].replace("^-y=", "",);
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			// if (ereg("^[0-9]{6}$", billdate) == false) {
			if (!billdate.match("^[0-9]{6}$")) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
// 2022cvt_015
					var year = billdate.substring(0, 4);
// 2022cvt_015
					var month = billdate.substring(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

// 2022cvt_015
            let d = new Date();
            // var diffmon = (date("Y") - year) * 12 + (date("m") - month);
			var diffmon = ((d.getFullYear()) - year) * 12 + ((d.getMonth() + 1) - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	var pactid_in;
	if (process.argv[cnt].match("^-p=")) //契約ＩＤチェック
	// if (ereg("^-p=", process.argv[cnt]) == true) //契約ＩＤチェック
		{
// 2022cvt_015
			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!pactid_in.match("^all$") && !pactid_in.match("^[0-9]+$")) {
			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-b=")) //バックアップの有無のチェック
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
// 2022cvt_015
			var backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match("^[ny]$")) {
	        // if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-t=")) //バックアップの有無のチェック
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
// 2022cvt_015
			var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
			if (!teltable.match("^[no]$")) {
			// if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}

// 2022cvt_015
var co_arg = "";
// 2022cvt_015
var co_arg2 = "";

// 2022cvt_015
for (var i = 1 + 1; i < process.argv.length; i++) //請求用の引数.
//通話用の引数、-t を除く.
{
	co_arg += " ";
	co_arg += process.argv[i];

	if (!process.argv[i].match("^-t=")) {
	// if (ereg("^-t=", _SERVER.argv[i]) == false) {
		co_arg2 += " ";
		co_arg2 += process.argv[i];
	}
}

var cmd = (PHP + " " + IMPORT_SOFTBANK_BILL + co_arg);

try {
	execSync(cmd);
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
  process.exit(e.status);
}

cmd = (PHP + " " + IMPORT_VODA_TUWA + co_arg2);

try {
	execSync(cmd);
} catch (e) {
	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	process.exit(e.status);
}

// if (status != 0) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
// 	throw process.exit(1);// 2022cvt_009
// }

// cmd = (PHP + " " + IMPORT_VODA_TUWA + co_arg2);
// // system(cmd, status);
// var status = 0;
// try {
//     execSync(cmd);
//     process.exit(0);
// }
// catch (error:any) {
// 	process.exit(error.status);
// }


// if (status != 0) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
// 	throw process.exit(1);// 2022cvt_009
// }

logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);// 2022cvt_009

function usage(comment: string, db: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("  -e モード (O:delete後COPY,A:追加)\n");
	console.log("  -y 請求年月 (YYYY:年,MM:月)\n");
	console.log("  -p 契約ＩＤ (all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("  -b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("  -t 当月データ (N:データは今月のもの,O:データは先月のもの)\n\n");
	throw process.exit(1);// 2022cvt_009
};
})();
