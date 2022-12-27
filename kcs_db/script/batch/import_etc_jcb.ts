
import { match } from 'assert';
import { execSync } from 'child_process';
import { BAT_DIR } from '../../db_define/define';
import {  } from './lib/script_db';

const DEBUG_FLG = 1;
const SCRIPT_ETC_JCB_BILL = BAT_DIR + "/import_etc_jcbbill.php";
const SCRIPT_ETC_JCB_HIST = BAT_DIR + "/import_etc_jcbhist.php";

(() => {

	// var A_para = ["-e", "-y", "-p", "-b", "-t"];
	var A_para = 5;

	var d = new Date();

	var mode;
	var billdate;
	var pactid;
	var backup;
	var target;

	// if (_SERVER.argv.length != 6) //数が正しくない
	if (process.argv.length != 6 + 1) //数が正しくない
		{
			// usage("", _SERVER.argv.length);
			usage("");
		} else //数が正しい
		//$cnt 0 はスクリプト名のため無視
		//パラメータの指定が無かったものがあった時
		{
	
			// var argvCnt = _SERVER.argv.length;
			var argvCnt = process.argv.length;

	
			for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
			{
				// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
				if (process.argv[cnt].match("^-e=")) //モード文字列チェック
					{
	
						// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
						mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

						// if (ereg("^[ao]$", mode) == false) {
						if (mode.match("^[ao]$")) {
							// usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							usage("モードの指定が不正です。" + process.argv[cnt]);
						}

						A_para -= 1;
						continue;
					}

				// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
				if (process.argv[cnt].match("^-y=")) //請求年月文字列チェック
					{
	
						// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
						billdate = process.argv[cnt].replace("^-y=", "");

						// if (ereg("^[0-9]{6}$", billdate) == false) {
						if (billdate.match("^[0-9]{6}$")) {
							// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							usage("請求年月の指定が不正です。" + process.argv[cnt]);
						} else //年月チェック
							{
	
								// var year = billdate.substr(0, 4);
								var year = billdate.substring(0, 4);
	
								// var month = billdate.substr(4, 2);
								var month = billdate.substring(4, 2);

								// if (year < date("Y") - 2 || year > date("Y") || +(month < 1 || +(month > 12))) {
								if (year < d.getFullYear() - 2 || year > d.getFullYear() || +(month < 1 || +(month > 12))) {
									// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
									usage("請求年月の指定が不正です。" + process.argv[cnt]);
								}

								// if (date("Y") == year && date("m") < +month) {
								if (d.getFullYear() == year && d.getMonth() + 1 < +month) {
									// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\u672A\u6765\u6708\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
									usage("請求年月の指定が不正（未来月）です。" + process.argv[cnt]);
								}

								// if ((date("Y") - year) * 12 + (date("m") - +month) >= 24) {
								if ((d.getFullYear() - year) * 12 + (d.getMonth() + 1 - +month) >= 24) {
									// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\uFF12\uFF14\u30F6\u6708\u4EE5\u524D\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
									usage("請求年月の指定が不正（２４ヶ月以前）です。" + process.argv[cnt]);
								}
							}

							A_para -= 1;
						continue;
					}

				// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
				if (process.argv[cnt].match("^-p=")) //契約ＩＤチェック
					{
	
						// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();
						pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();

						// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						if (pactid.match("^all$") && pactid.match("^[0-9]+$")) {
							// usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							usage("会社コードの指定が不正です。" + process.argv[cnt]);
						}

						A_para -= 1;
						continue;
					}

				// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
				if (process.argv[cnt].match("^-b=")) //バックアップの有無のチェック
					{
	
						// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();
						backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

						// if (ereg("^[ny]$", backup) == false) {
						if (backup.match("^[ny]$")) {
							// usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							usage("バックアップの指定が不正です。" + process.argv[cnt]);
						}

						A_para -= 1;
						continue;
					}

				// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
				if (process.argv[cnt].match("^-t=")) {
	
					// var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
					target =  process.argv[cnt].replace("^-t=", "").toLowerCase();

					// if (ereg("^[no]$", target) == false) {
					if (target.match("^[no]$")) {
						// usage("\u5BFE\u8C61\u6708\u306E\uFF08\u6700\u65B0/\u904E\u53BB\uFF09\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
						usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

				// usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
				usage("パラメータの指定が不正です。" + process.argv[0]);
			}

			if (A_para != 0) {
				// usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
				usage("パラメータの指定が不正です。" + process.argv[0]);
			}
		}

	
	var command_str = "php " + SCRIPT_ETC_JCB_BILL + " -e=" + mode + " -y=" + billdate + " -p=" + pactid + " -b=" + backup + " -t=" + target;
	// print("JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059" + command_str + "\n");
	// system(command_str, ret);
	try{
		console.log("JCB法人ETCカードカード請求データ取込処理を開始します" + command_str + "\n");
		execSync(command_str);
	}catch(error:any){
		console.log("JCB法人ETCカードカード請求データ取込処理でエラーが発生しました。" + "\n" + "処理を中断します。" + "\n");
		throw process.exit(error.status);
	}

	// if (ret != 0) {
	// 	// print("JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002" + "\n" + "\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002" + "\n");
	// 	console.log("JCB法人ETCカードカード請求データ取込処理でエラーが発生しました。" + "\n" + "処理を中断します。" + "\n");
	// 	throw process.exit(1);
	// }

	command_str = "php " + SCRIPT_ETC_JCB_HIST + " -e=" + mode + " -y=" + billdate + " -p=" + pactid + " -b=" + backup + " -t=" + target;
	// print("JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u30AB\u30FC\u30C9\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059" + command_str + "\n");
	// passthru(command_str);
	try {
		console.log("JCB法人ETCカードカード利用明細データ取込処理を開始します" + command_str + "\n");
		execSync(command_str);
	} catch (error) {
		throw process.exit(error.status);
	}

	function usage(comment) {
		if (comment == "") {
			// comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
			comment = "パラメータが不正です";
		}

		// print("\n" + comment + "\n\n");
		// print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
		// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
		// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
		// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
		// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7\t (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
		// print("\t\t-t \u5BFE\u8C61\u6708\u304C\u6700\u65B0/\u904E\u53BB\t(N:\u6700\u65B0,O:\u904E\u53BB) \n\n");
		
		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
		console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
		console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
		console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
		console.log("		-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
		console.log("		-t 対象月が最新/過去	(N:最新,O:過去) \n\n");
		throw process.exit(1);
	};
})();
