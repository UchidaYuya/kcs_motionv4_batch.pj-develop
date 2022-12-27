
import {  } from './lib/script_db';
import { ScriptLogBase, ScriptLogFile, G_SCRIPT_INFO,G_SCRIPT_WARNING, G_SCRIPT_ERROR, G_SCRIPT_BEGIN, G_SCRIPT_END, ScriptLogAdaptor } from './lib/script_log';

import { DATA_LOG_DIR } from '../../db_define/define';
import { execSync } from 'child_process';

(() => {
	const LOG_DELIM = " ";
	const SCRIPTNAME = "import_ddi.php";
	
	var dbLogFile = DATA_LOG_DIR + "/billbat.log";
	
	var log_listener = new ScriptLogBase(0);
	
	var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
	log_listener.putListener(log_listener_type);
	
	var logh = new ScriptLogAdaptor(log_listener, true);

	var mode;
	var billdate;
	var pactid;
	var backup;
	var teltable;
	var anbun;

	// if (_SERVER.argv.length != 7) //数が正しい
	if (process.argv.length != 7 + 1) //数が正しい
		{
			usage("");
		} else //$argvCounter 0 はスクリプト名のため無視
		{
	
			// var argvCnt = _SERVER.argv.length;
			var argvCnt = process.argv.length;

	
			for (var argvCounter = 1 + 1; argvCounter < argvCnt; argvCounter++) //mode を取得
			{
				// if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				if (process.argv[argvCounter].match("^-e=")) //モード文字列チェック
					{
	
						// var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();
						mode = process.argv[argvCounter].replace("^-e=", "").toLowerCase();

						// if (ereg("^[ao]$", mode) == false) {
						if (mode.match("^[ao]$")) {
							// usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("モードの指定が不正です");
						}

						continue;
					}

				// if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				if ( process.argv[argvCounter].match("^-y=")) //請求年月文字列チェック
					{
	
						// var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);
						billdate =  process.argv[argvCounter].replace("^-y=", "");

						// if (ereg("^[0-9]{6}$", billdate) == false) {
						if (billdate.match("^[0-9]{6}$")) {
							// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("請求年月の指定が不正です");
						} else //年月チェック
							{
	
								// var year = billdate.substr(0, 4);
								var year = billdate.substring(0, 4);
	
								// var month = billdate.substr(4, 2);
								var month = billdate.substring(4, 2);

								if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
									// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
									usage("請求年月の指定が不正です");
								}
							}

						continue;
					}

				// if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				if (process.argv[argvCounter].match("^-p=")) //契約ＩＤチェック
					{
	
						// var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();
						pactid = process.argv[argvCounter].replace("^-p=", "").toLowerCase();

						// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						if (pactid.match("^all$") && pactid.match("^[0-9]+$")) {
							// usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("契約ＩＤの指定が不正です");
						}

						continue;
					}

				// if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				if (process.argv[argvCounter].match("^-b=")) //バックアップの有無のチェック
					{
	
						// var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();
						backup = process.argv[argvCounter].replace("^-b=", "").toLowerCase();

						// if (ereg("^[ny]$", backup) == false) {
						if (backup.match("^[ny]$")) {
							// usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("バックアップの指定が不正です");
						}

						continue;
					}

				// if (ereg("^-t=", _SERVER.argv[argvCounter]) == true) //電話テーブルの指定をチェック
				if (process.argv[argvCounter].match("^-t=")) //電話テーブルの指定をチェック
					{
	
						// var teltable = ereg_replace("^-t=", "", _SERVER.argv[argvCounter]).toLowerCase();
						teltable = process.argv[argvCounter].replace("^-t=", "").toLowerCase();

						// if (ereg("^[no]$", teltable) == false) {
						if (teltable.match("^[no]$")) {
							// usage("\u96FB\u8A71\u30C6\u30FC\u30D6\u30EB\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("電話テーブルの指定が不正です");
						}

						continue;
					}

				// if (ereg("^-a=", _SERVER.argv[argvCounter]) == true) //会社一括請求データを電話回線毎に按分するかをチェック
				if (process.argv[argvCounter].match("^-a=")) //会社一括請求データを電話回線毎に按分するかをチェック
					{
	
						// var anbun = ereg_replace("^-a=", "", _SERVER.argv[argvCounter]).toLowerCase();
						anbun = process.argv[argvCounter].replace("^-a=", "").toLowerCase();

						// if (ereg("^[ny]$", anbun) == false) {
						if (anbun.match("^[ny]$")) {
							// usage("\u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u6309\u5206\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							usage("会社一括請求データの按分指定が不正です");
						}

						continue;
					}

				usage("");
			}
		}

	// system(`php /kcs/script/batch/import_ddi_bill.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup} -t=${teltable} -a=${anbun}`, ret);
	try{
		execSync(`php /kcs/script/batch/import_ddi_bill.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup} -t=${teltable} -a=${anbun}`);
	}catch(error:any){
		console.log("DDIポケット請求データ取込処理でエラーが発生しました。" + "\n" + "処理を中断します。" + "\n");
		throw process.exit(error.status);
	}
	// if (ret != 0) {
	// 	// print("DDI\u30DD\u30B1\u30C3\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002" + "\n" + "\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002" + "\n");
	// 	console.log("DDIポケット請求データ取込処理でエラーが発生しました。" + "\n" + "処理を中断します。" + "\n");
	// 	throw process.exit(1);
	// }

	// passthru(`php /kcs/script/batch/import_ddi_tuwa.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup}`);
	execSync(`php /kcs/script/batch/import_ddi_tuwa.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup}`);
	

	function usage(comment) {
		// if (!("logh" in global)) logh = undefined;

		if (comment == "") {
			// comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
			comment = "パラメータが不正です";
		}

		// print("\n" + comment + "\n\n");
		// print("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O} -a={Y|N}\n");
		// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
		// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
		// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
		// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
		// print("\t\t-t \u96FB\u8A71\u30C6\u30FC\u30D6\u30EB (N:tel_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:tel_X_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8)\n");
		// print("\t\t-a \u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u6309\u5206 (Y:\u6309\u5206\u3059\u308B\uFF0D\u96FB\u8A71\u56DE\u7DDA\u6BCE\u306B\u8A08\u4E0A,N:\u6309\u5206\u3057\u306A\u3044\uFF0D\u30C0\u30DF\u30FC\u96FB\u8A71\u306B\u8A08\u4E0A)\n\n");

		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O} -a={Y|N}\n");
		console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
		console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
		console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
		console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
		console.log("		-t 電話テーブル (N:tel_tb へインサート,O:tel_X_tb へインサート)\n");
		console.log("		-a 会社一括請求データ按分 (Y:按分する－電話回線毎に計上,N:按分しない－ダミー電話に計上)\n\n");
		logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
		throw process.exit(1);
	};

})();
