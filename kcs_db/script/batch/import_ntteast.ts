//===========================================================================
//機能：請求情報インポートプロセス（NTT東日本専用）
//
//作成：中西
//===========================================================================
//このスクリプトの日本語処理名
//PHPのパス -- パスが通っているものとする.
//---------------------------------------------------------------------------

// 2022cvt_026
// require("lib/script_db.php");
import { execSync } from "child_process";
import { DATA_LOG_DIR, IMPORT_NTTEAST_BILL, IMPORT_NTTEAST_TUWA } from "../../db_define/define";
import { ScriptDB } from "./lib/script_db";

// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

(() => {
const SCRIPT_NAMEJ = "NTT東日本インポートメイン";

const LOG_DELIM = " ";
const PHP = "php";
// 共通ログファイル名
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// ログListener を作成
var log_listener = new ScriptLogBase(0);
// ログファイル名、ログ出力タイプを設定
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 標準出力に出してみる.
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
// ログListener にログファイル名、ログ出力タイプを渡す
log_listener.putListener(log_listener_type);
log_listener.putListener(log_listener_type2);
// DBハンドル作成
var dbh = new ScriptDB(log_listener);
// エラー出力用ハンドル
var logh = new ScriptLogAdaptor(log_listener, true);

// 開始メッセージ
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

// パラメータチェック
if (process.argv.length != 6 + 1) {
		// 数が正しくない
		usage("", dbh);
		throw process.exit(1);
	}

var argvCnt = process.argv.length;
var year = 0;
var month = 0;
var billdate = "";
var pactid_in = "";

// $cnt 0 はスクリプト名のため無視
for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("-e=")) {
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		// mode を取得
		var mode = process.argv[cnt].replace("-e=", "").toLowerCase();
		// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

		// モード文字列チェック
		if (!mode.match("^[ao]$")) {
		// if (ereg("^[ao]$", mode) == false) {
			usage("ERROR: モードの指定が不正です", dbh);
		}
		continue;
	}

	// 請求年月を取得
	if (process.argv[cnt].match("-y=")) {
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		billdate = process.argv[cnt].replace("-y=", "");
		// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

		// 請求年月文字列チェック
		if (!billdate.match("^[0-9]{6}$")) {
		// if (ereg("^[0-9]{6}$", billdate) == false) {
			usage("ERROR: 請求年月の指定が不正です", dbh);
		} else {
			year = parseInt(billdate.substring(0, 4));
			month = parseInt(billdate.substring(4, 6));
			// 年月チェック
			if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
				usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
			}
		}

		var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month);
		// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

		if (diffmon < 0) {
			usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
		} else if (diffmon >= 24) {
			usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
		}

		continue;
	}

	// 契約ＩＤを取得
	if (process.argv[cnt].match("-p=")) {
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		pactid_in = process.argv[cnt].replace("-p=", "").toLowerCase();
		// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

		// 契約ＩＤチェック
		if (!pactid_in.match("^all$") && !pactid_in.match("^[0-9]+$")) {
		// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
			usage("ERROR: 契約ＩＤの指定が不正です", dbh);
		}

		continue;
	}

	// バックアップの有無を取得
	if (process.argv[cnt].match("-b=")) {
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		var backup = process.argv[cnt].replace("-b=", "").toLowerCase();
		// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

		// バックアップの有無のチェック
		if (!backup.match("^[ny]$")) {
		// if (ereg("^[ny]$", backup) == false) {
			usage("ERROR: バックアップの指定が不正です", dbh);
		}

		continue;
	}
	// 今月のデータか否かを取得
	if (process.argv[cnt].match("-t=")) {
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		var teltable = process.argv[cnt].replace("-t=", "").toLowerCase();
		// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

		if (!teltable.match("^[no]$")) {
		// if (ereg("^[no]$", teltable) == false) {
			usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
		}

		continue;
	}

	// パラメータの指定が不正の場合のみここを通る
	usage("", dbh);
}

// 子スクリプトに渡す引数の作成、このスクリプトに渡されたものと全く同じ引数を渡す.
var co_arg = "";
var co_arg2 = "";

for (var i = 1 + 1; i < process.argv.length; i++) {
	// 請求用の引数.
	co_arg += " ";
	co_arg += process.argv[i];

	// 通話用の引数、-t を除く.
	if (!process.argv[i].match("-t=")) {
	// if (ereg("^-t=", _SERVER.argv[i]) == false) {
		co_arg2 += " ";
		co_arg2 += process.argv[i];
		// co_arg2 += _SERVER.argv[i];
	}
}
var cmd = PHP + " " + IMPORT_NTTEAST_BILL + co_arg;
// system(cmd, status);

var status = 0;
console.log(PHP);
console.log(IMPORT_NTTEAST_BILL)
var cmd = PHP + " " + IMPORT_NTTEAST_BILL + co_arg;
console.log(cmd)
try {
	// 請求を実行.
	execSync(cmd);
} catch (e) {
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	throw process.exit(e.status);
}

// cmd = escapeshellcmd(PHP + " " + IMPORT_NTTEAST_TUWA + co_arg2);
// system(cmd, status);
var status = 0;
var cmd = PHP + " " + IMPORT_NTTEAST_TUWA + co_arg2;
console.log(cmd);
try {
	// 通話を実行.
	execSync(cmd);
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	throw process.exit(1);
}
// 終了メッセージ
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明
// [引　数] $comment 表示メッセージ
// [返り値] 終了コード　1（失敗）
function usage(comment: string, db: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n");
	throw process.exit(1);
};
})();
