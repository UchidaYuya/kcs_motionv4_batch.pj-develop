export const SCRIPT_NAMEJ = "エニーユーザーインポートメイン";
import { BAT_DIR, DATA_LOG_DIR } from "../../db_define/define";
// 2022cvt_026
// require("lib/script_db.php");
import { ScriptDB } from "../batch/lib/script_db";
// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL,G_SCRIPT_WARNING, G_SCRIPT_ERROR, ScriptLogBase, ScriptLogFile, ScriptLogAdaptor, G_SCRIPT_BEGIN, G_SCRIPT_END } from "../batch/lib/script_log";
import { execSync } from 'child_process';

export const LOG_DELIM = " ";
export const PHP = "php";
export const IMPORT_ANYFU_BILL = BAT_DIR + "/import_anyfu_bill.php";
export const IMPORT_ANYFU_TUWA = BAT_DIR + "/import_anyfu_tuwa.php";
export const IMPORT_ANYUSER_BILL = BAT_DIR + "/import_anyuser_bill.php";
export const GEN_ANYUSER = BAT_DIR + "/gen_anyuser.php";
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
/// 2022cvt_016
log_listener.putListener(log_listener_type2);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

// if (_SERVER.argv.length != 6) //数が正しくない
if (process.argv.length != 6) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);// 2022cvt_009
	}

// 2022cvt_015
// var argvCnt = _SERVER.argv.length;
var argvCnt = process.argv.length;

// 2022cvt_015
for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
{
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
	if (process.argv[cnt].match("^-e=") == null) //モード文字列チェック
		{
// 2022cvt_015
			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
			var mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

			// if (ereg("^[ao]$", mode) == false) {
			if (mode.match("^[ao]$") == null) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

		var billdate: any;
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
	if (process.argv[cnt].match("^-y=") == null) //請求年月文字列チェック
		{
// 2022cvt_015
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
			billdate = process.argv[cnt].replace("^-y=", "");
			var year: any;
			var month: any;

			// if (ereg("^[0-9]{6}$", billdate) == false) {
			if (billdate.match("^[0-9]{6}$") == null) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
// 2022cvt_015
					year = billdate.substring(0, 4);
// 2022cvt_015
					month = billdate.substring(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

// 2022cvt_015
            let d = new Date();
			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);
			var diffmon = (d.getFullYear() - year) * 12 + (d.getMonth() - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

		var pactid_in: any;
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
	if (process.argv[cnt].match("^-p=") == null) //契約ＩＤチェック
		{
// 2022cvt_015
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();
			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();

			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
			if (pactid_in.match("^all$") == null && pactid_in.match("^[0-9]+$") == null) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
	if (process.argv[cnt].match("^-b=") == null) //バックアップの有無のチェック
		{
// 2022cvt_015
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();
			var backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

			// if (ereg("^[ny]$", backup) == false) {
			if (backup.match("^[ny]$") == null) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
	if (process.argv[cnt].match("^-t=") == null) //バックアップの有無のチェック
		{
// 2022cvt_015
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
			var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();

			// if (ereg("^[no]$", teltable) == false) {
			if (teltable.match("^[no]$") == null) {
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
var co_arg3 = "";

// 2022cvt_015
// for (var i = 1; i < _SERVER.argv.length; i++) //anyfu請求用の引数.
for (var i = 1; i < process.argv.length; i++) //anyfu請求用の引数.

//anyuser請求用、通話用の引数、-t を除く.
{
	co_arg += " ";
	// co_arg += _SERVER.argv[i];
	co_arg += process.argv[i];

	// if (ereg("^-t=", _SERVER.argv[i]) == false) {
	if (process.argv[i].match("^-t=") == null) {
		co_arg2 += " ";

		// if (ereg("^-b=", _SERVER.argv[i])) //バックアップは行わない
		if (process.argv[i].match("^-b=")) //バックアップは行わない
			{
				co_arg2 += "-b=N";
			} else {
			// co_arg2 += _SERVER.argv[i];
			co_arg2 += process.argv[i];
		}
	}

	// if (ereg("^-t=", _SERVER.argv[i]) == false && ereg("^-e=", _SERVER.argv[i]) == false) {
	if (process.argv[i].match("^-t=") == null && process.argv[i].match("^-e=") == null) {
		co_arg3 += " ";

		// if (ereg("^-b=", _SERVER.argv[i])) //バックアップは行わない
		if (process.argv[i].match("^-b=")) //バックアップは行わない
			{
				co_arg3 += "-b=N";
			} else {
			// co_arg3 += _SERVER.argv[i];
			co_arg3 += process.argv[i];
		}
	}
}

// 2022cvt_015
var cmd = (PHP + " " + IMPORT_ANYFU_BILL + co_arg);
cmd = (PHP + " " + IMPORT_ANYUSER_BILL + co_arg2);
cmd = (PHP + " " + GEN_ANYUSER + co_arg3);
cmd = (PHP + " " + IMPORT_ANYFU_TUWA + co_arg2);
// system(cmd, status);
// var status = 0;
try {
    execSync(cmd);
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
    process.exit(0);
} 
catch (error:any) {
	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	process.exit(error.status);  
}

// if (status != 0) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
// 	throw process.exit(1);// 2022cvt_009
// }
// cmd = escapeshellcmd(PHP + " " + IMPORT_ANYUSER_BILL + co_arg2);
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
// cmd = escapeshellcmd(PHP + " " + GEN_ANYUSER + co_arg3);
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
// cmd = escapeshellcmd(PHP + " " + IMPORT_ANYFU_TUWA + co_arg2);
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
// logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
// throw process.exit(0);// 2022cvt_009

function usage(comment: string, db: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("\t\t-e モード \t(O:delete後COPY,A:追加)\n");
	console.log("\t\t-y 請求年月 \t(YYYY:年,MM:月)\n");
	console.log("\t\t-p 契約ＩＤ \t(all全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("\t\t-t 当月データ\t(N:データは今月のもの,O:データは先月のもの)\n\n");
	throw process.exit(1);// 2022cvt_009
};

})();