
const SCRIPT_NAMEJ = "FUSION標準インポートメイン";

import { ScriptDB } from './lib/script_db';
import { ScriptLogBase, ScriptLogFile, G_SCRIPT_ALL, G_SCRIPT_WARNING, G_SCRIPT_ERROR, ScriptLogAdaptor, G_SCRIPT_BEGIN, G_SCRIPT_END } from './lib/script_log';

import { BAT_DIR, DATA_LOG_DIR } from '../../db_define/define';
import { execSync } from 'child_process';

(() => {
	const LOG_DELIM = " ";
	const PHP = "php";
	const IMPORT_FUSION_STANDARD_BILL = BAT_DIR + "/import_fusion_standard_bill.php";
	const IMPORT_FUSION_STANDARD_TUWA = BAT_DIR + "/import_fusion_standard_tuwa.php";

	var dbLogFile = DATA_LOG_DIR + "/billbat.log";

	var log_listener = new ScriptLogBase(0);

	var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);

	var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
	log_listener.putListener(log_listener_type);
	log_listener.putListener(log_listener_type2);

	var dbh = new ScriptDB(log_listener);

	var logh = new ScriptLogAdaptor(log_listener, true);
	// logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");
	logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

	var d = new Date();

	// if (_SERVER.argv.length != 6) //数が正しくない
	if (process.argv.length != 6) //数が正しくない
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
		if (process.argv[cnt].match("^-e=")) //モード文字列チェック
			{

				// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
				var mode =  process.argv[cnt].replace("^-e=", "").toLowerCase();

				// if (ereg("^[ao]$", mode) == false) {
				if ( mode.match("^[ao]$")) {
					// usage("ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
					usage("ERROR: モードの指定が不正です", dbh);
				}

				continue;
			}

		// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		if (process.argv[cnt].match("^-y=")) //請求年月文字列チェック
			{

				// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
				billdate = process.argv[cnt].replace("^-y=", "");

				// if (ereg("^[0-9]{6}$", billdate) == false) {
				if (billdate.match("^[0-9]{6}$")) {
					// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
					usage("ERROR: 請求年月の指定が不正です", dbh);
				} else //年月チェック
					{

						// var year = billdate.substr(0, 4);
						var year = billdate.substring(0, 4);

						// var month = billdate.substr(4, 2);
						var month = billdate.substring(4, 2);

						if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
							// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + billdate + ")", dbh);
							usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
						}
					}


				// var diffmon = (date("Y") - year) * 12 + (date("m") - month);
				var diffmon = (d.getFullYear() - year) * 12 + (d.getMonth() + 1 - month);

				if (diffmon < 0) {
					// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
					usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
				} else if (diffmon >= 24) {
					// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\uFF12\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
					usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
				}

				continue;
			}

		// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		if (process.argv[cnt].match("^-p=")) //契約ＩＤチェック
			{

				// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();
				pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();

				// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				if (pactid_in.match("^all$") && pactid_in.match("^[0-9]+$")) {
					// usage("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
					usage("ERROR: 契約ＩＤの指定が不正です", dbh);
				}

				continue;
			}

		// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match("^-b=")) //バックアップの有無のチェック
			{

				// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();
				var backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

				// if (ereg("^[ny]$", backup) == false) {
				if (backup.match("^[ny]$")) {
					// usage("ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
					usage("ERROR: バックアップの指定が不正です", dbh);
				}

				continue;
			}

		// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match("^-t=")) //バックアップの有無のチェック
			{

				// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
				var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();

				// if (ereg("^[no]$", teltable) == false) {
				if (teltable.match("^[no]$")) {
					// usage("ERROR: \u4ECA\u6708\u306E\u30C7\u30FC\u30BF\u304B\u3069\u3046\u304B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
					usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
				}

				continue;
			}

		usage("", dbh);
	}


	var co_arg = "";

	var co_arg2 = "";


	// for (var i = 1; i < _SERVER.argv.length; i++) //請求用の引数.
	for (var i = 1 + 1; i < process.argv.length; i++) //請求用の引数.
	//通話用の引数、-t を除く.
	{
		co_arg += " ";
		// co_arg += _SERVER.argv[i];
		co_arg += process.argv[i];

		// if (ereg("^-t=", _SERVER.argv[i]) == false) {
		if (process.argv[i].match("^-t=")) {
			co_arg2 += " ";
			// co_arg2 += _SERVER.argv[i];
			co_arg2 += process.argv[i];
		}
	}


	var cmd = (PHP + " " + IMPORT_FUSION_STANDARD_BILL + co_arg);
	// system(cmd, status);

	var status = 0;

	try {
		execSync(cmd);
	}
	catch(error: any){
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		process.exit(error.status);
	}

	// if (status != 0) {
	// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	// 	throw process.exit(1);
	// }

	cmd = (PHP + " " + IMPORT_FUSION_STANDARD_TUWA + co_arg2);
	// system(cmd, status);
	try {
		execSync(cmd);
	}
	catch(error: any){
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		process.exit(error.status);
	}

	// if (status != 0) {
	// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	// 	throw process.exit(1);
	// }

	// logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	throw process.exit(0);

	function usage(comment, db: ScriptDB) {
		if (comment == "") {
			// comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
			comment = "パラメータが不正です";
		}
		// print("\n" + comment + "\n\n");
		// print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
		// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
		// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
		// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
		// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
		// print("\t\t-t \u5F53\u6708\u30C7\u30FC\u30BF\t(N:\u30C7\u30FC\u30BF\u306F\u4ECA\u6708\u306E\u3082\u306E,O:\u30C7\u30FC\u30BF\u306F\u5148\u6708\u306E\u3082\u306E)\n\n");
		// throw process.exit(1);

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