
const SCRIPT_NAMEJ = "NTT東日本インポートメイン";

import { execSync } from 'child_process';
import { ScriptDB } from '../batch/lib/script_db';
import { ScriptLogBase, ScriptLogFile, G_SCRIPT_ALL, G_SCRIPT_WARNING, G_SCRIPT_ERROR, ScriptLogAdaptor, G_SCRIPT_BEGIN, G_SCRIPT_END} from '../batch/lib/script_log';
import { DATA_LOG_DIR, IMPORT_NTTWEST_BILL, IMPORT_NTTWEST_TUWA } from '../../db_define/define';

(() => {

	const LOG_DELIM = " ";
	const PHP = "php";

	var dbLogFile = DATA_LOG_DIR + "/billbat.log";

	var log_listener = new ScriptLogBase(0);

	var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);

	var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
	log_listener.putListener(log_listener_type);
	log_listener.putListener(log_listener_type2);

	var dbh = new ScriptDB(log_listener);

	var logh = new ScriptLogAdaptor(log_listener, true);
	logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

	if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}


	// var argvCnt = _SERVER.argv.length;
	var argvCnt = process.argv.length;

	var pactid_in;

	var billdate;


	for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
	{
		// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		if (process.argv[cnt].match(/^-e=/))
		{

			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
			var mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

			// if (ereg("^[ao]$", mode) == false) {
			if (mode.match(/^[ao]$/)) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

		// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		if (process.argv[cnt].match(/^-y=/))
		{

			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
			billdate = process.argv[cnt].replace(/^-y=/, "");

			// if (ereg("^[0-9]{6}$", billdate) == false) {
			if (billdate.match(/^[0-9]{6}$/)) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
			{

				var year = billdate.substring(0, 4);

				var month = billdate.substring(4, 2);

				if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
							usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
				}
			}


			var d = new Date();
			var diffmon = (d.getFullYear() - year) * 12 + (d.getMonth() + 1 - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

		// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		if (process.argv[cnt].match(/^-p=/))
		{

			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();
			pactid_in = process.argv[cnt].replace(/^-p=/, "").toLowerCase();

			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
			if (pactid_in.match(/^all$/) && pactid_in.match(/^[0-9]+$/)) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

		// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match(/^-b=/))
		{

			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();
			var backup = process.argv[cnt].replace(/^-b=/, "").toLowerCase();

			// if (ereg("^[ny]$", backup) == false) {
			if (backup.match(/^[ny]$/)) {
				
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

		// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match(/^-t=/)) //バックアップの有無のチェック
		{

			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
			var teltable = process.argv[cnt].replace(/^-t=/, "").toLowerCase();

			// if (ereg("^[no]$", teltable) == false) {
			if (teltable.match(/^[no]$/)) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

		usage("", dbh);
	}


	var co_arg = "";

	var co_arg2 = "";


	for (var i = 1 + 1; i < process.argv.length; i++) //請求用の引数.
	//通話用の引数、-t を除く.
	{
		co_arg += " ";
		co_arg += process.argv[i];

		// if (ereg("^-t=", process.argv[i]) == false) {
		if (process.argv[i].match(/^-t=/)) {
			co_arg2 += " ";
			co_arg2 += process.argv[i];
		}
	}


	var cmd = (PHP + " " + IMPORT_NTTWEST_BILL + co_arg);
	// system(cmd, status);
	try {
		execSync(cmd);
	} catch (error) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		process.exit(error.status);
	}

	// if (status != 0) {
	// 	logh.putError(SCRIPT_LOG.G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	throw process.exit(1);
	// }

	cmd = (PHP + " " + IMPORT_NTTWEST_TUWA + co_arg2);
	// system(cmd, status);

	var status = 0

	try {
		execSync(cmd);
	} catch (error) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		process.exit(error.status);
	}
	// if (status != 0) {
	// 	logh.putError(SCRIPT_LOG.G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	
	// }

	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	throw process.exit(0);

	function usage(comment: any, db: ScriptDB) {
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
