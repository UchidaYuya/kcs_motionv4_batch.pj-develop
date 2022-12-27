//機能：通話明細統計情報抽出の親プロセス
//作成：中西
const SCRIPT_NAMEJ = "統計情報メイン";

import { DATA_LOG_DIR } from "../../db_define/define";

import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

const { exec, execSync } = require('child_process');
const LOG_DELIM = " ";
const PHP = "php";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
log_listener.putListener(log_listener_type);
log_listener.putListener(log_listener_type2);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");
var pactid_in = "";
var billdate = "";
var argvCnt = process.argv.length;

for (var cnt = 0; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("-c=")) //モード文字列チェック
		{
			var mode = process.argv[cnt].replace("-c=", "").toLowerCase();
			if (mode.match("[0-9]+$")) {
				usage("ERROR: 請求年月の指定が不正です");
			}

			continue;
		}

	if (process.argv[cnt].match("-y=")) //請求年月文字列チェック
		{
			billdate = process.argv[cnt].replace("-y=", "");
			if (billdate.match("[0-9]{6}$") == null) {
				usage("ERROR: 請求年月の指定が不正です");
			} else //年月チェック
				{
					var year = parseInt(billdate.substr(0, 4));
					var month = parseInt(billdate.substr(4, 6));

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")");
					}
					var date_m: any = (new Date().getMonth()+1).toString().padStart(2, '0');
					var diffmon = (new Date().getFullYear() - year) * 12 + (date_m - month);

					if (diffmon < 0) {
						usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")");
					} else if (diffmon >= 24) {
						usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")");
					}
				}

			

			continue;
		}

	if (process.argv[cnt].match("-p=") != null) //契約ＩＤチェック
		{
			pactid_in = process.argv[cnt].replace("-p=", "").toLowerCase();
			if (!pactid_in.match("[0-9]+$")) {
				usage("ERROR: 契約ＩＤの指定が不正です");
			}

			continue;
		}

	usage("");
}


var co_arg = "";

for (var i = 2; i < process.argv.length; i++) //請求用の引数.
{
	co_arg += " ";
	co_arg += process.argv[i];
}

var co_arg2 = co_arg + " -m=0";
// var cmd = (PHP + " trend_main.php" + co_arg); //コンバットされないファイルです。
var cmd = (PHP + " trend_graph.php" + co_arg2); 

try {
	execSync(cmd);
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	
	// process.exit(0);
}
catch (error:any) {
	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	// process.exit(error.status);  
}

function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[1] + " -c={CARID} -p={PACTID} -y=YYYYMM\n");
	console.log("\t\t-c キャリアＩＤ 	(O:delete後COPY,A:追加)\n");
	console.log("\t\t-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-y 請求年月 	(YYYY:年,MM:月)\n\n");
	throw process.exit(1);
};
