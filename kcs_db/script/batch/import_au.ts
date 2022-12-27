#!/usr/local/bin/php
export const DEBUG_FLG = 1;

import { SCRIPT_AU_BILL, SCRIPT_AU_TUWA } from "../../db_define/define";
// 2022cvt_026
// require("lib/script_db.php");
// import script_db from "../batch/lib/script_db";
import { execSync } from 'child_process';

(async ()=>{
// if (_SERVER.argv.length != 6) //数が正しくない
if (process.argv.length != 6) //数が正しくない
	{
		// usage("", _SERVER.argv.length);
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	{
// 2022cvt_015
		// var argvCnt = _SERVER.argv.length;
		var argvCnt = process.argv.length;
		var mode: any;
		var billdate: any;

// 2022cvt_015
		for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
		{
			// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
			if (process.argv[cnt].match("^-e=") == null) //モード文字列チェック
				{
// 2022cvt_015
					// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
					mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

					// if (ereg("^[ao]$", mode) == false) {
					if (mode.match("^[ao]$") == null) {
						// usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
			if (process.argv[cnt].match("^-y=") == null) //請求年月文字列チェック
				{
// 2022cvt_015
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
					billdate = process.argv[cnt].replace("^-y=", "");
					var year: number;
					var month: number;

					// if (ereg("^[0-9]{6}$", billdate) == false) {
					if (billdate.match("^[0-9]{6}$") == null) {
						// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
						usage("請求年月の指定が不正です。" + process.argv[cnt]);

					} else //年月チェック
						{
// 2022cvt_015
                            let d = new Date();
							year = billdate.substring(0, 4);
// 2022cvt_015
							month = billdate.substring(4, 2);

							// if (year < date("Y") - 2 || year > date("Y") || +(month < 1 || +(month > 12))) {
							if (year < d.getFullYear() - 2 || year > d.getFullYear() || +(month < 1 || +(month > 12))) {
								// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

							// if (date("Y") == year && date("m") < +month) {
							if (d.getFullYear() == year && d.getMonth() < +month) {
								// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\u672A\u6765\u6708\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
								usage("請求年月の指定が不正（未来月）です。" + process.argv[cnt]);
							}

							// if ((date("Y") - year) * 12 + (date("m") - +month) >= 24) {
							if ((d.getFullYear() - year) * 12 + (d.getMonth() - +month) >= 24) {
								// usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\uFF12\uFF14\u30F6\u6708\u4EE5\u524D\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
								usage("請求年月の指定が不正（２４ヶ月以前）です。" + process.argv[cnt]);

							}
						}

					continue;
				}

			// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
			var pactid: any;
			if (process.argv[cnt].match("^-p=") == null) //契約ＩＤチェック
				{
// 2022cvt_015
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();
					pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();

					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
					if (pactid.match("^all$") == null && pactid.match("^[0-9]+$") == null) {
						// usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
			var backup: any;
			if (process.argv[cnt].match("^-b=") == null) //バックアップの有無のチェック
				{
// 2022cvt_015
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();
					backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

					// if (ereg("^[ny]$", backup) == false) {
					if (backup.match("^[ny]$") == null) {
						// usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
				var target: any;
			if (process.argv[cnt].match("^-t=") == null) {
// 2022cvt_015
				// var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();
				target = process.argv[cnt].replace("^-t=", "").toLowerCase();

				// if (ereg("^[no]$", target) == false) {
				if (target.match("^[no]$") == null) {
					// usage("\u5BFE\u8C61\u6708\u306E\uFF08\u6700\u65B0/\u904E\u53BB\uFF09\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				continue;
			}

			// usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

// 2022cvt_015
var command_str = "php " + SCRIPT_AU_BILL + " -e=" + mode + " -y=" + billdate + " -p=" + pactid + " -b=" + backup + " -t=" + target;
console.log("au請求データ取込処理を開始します" + command_str + "\n");
// system(command_str, ret);
// var ret = 0;
try {
    execSync(command_str);
	command_str = "php " + SCRIPT_AU_TUWA + " -e=" + mode + " -y=" + billdate + " -p=" + pactid + " -b=" + backup;
    console.log("au通話・通信データ取込処理を開始します" + command_str + "\n");
    execSync(command_str);
    process.exit(0);
} 
catch (error:any) {
	console.log("au請求データ取込処理でエラーが発生しました。" + "\n" + "処理を中断します。" + "\n");
	process.exit(error.ret);  
}
// if (ret != 0) {
// 	throw process.exit(1);// 2022cvt_009
// }
// throw process.exit(0);// 2022cvt_009
function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("\t\t-e モード \t(O:delete後COPY,A:追加)\n");
	console.log("\t\t-y 請求年月 \t(YYYY:年,MM:月)\n");
	console.log("\t\t-p 契約ＩＤ \t(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-b バックパップ\t (Y:バックアップする,N:バックアップしない)\n");
	console.log("\t\t-t 対象月が最新/過去\t(N:最新,O:過去) \n\n");
	throw process.exit(1);// 2022cvt_009
};
})();