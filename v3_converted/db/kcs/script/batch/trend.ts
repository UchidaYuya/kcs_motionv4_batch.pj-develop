//===========================================================================
//機能：通話明細統計情報抽出の親プロセス
//
//作成：中西
//===========================================================================
//このスクリプトの日本語処理名
//PHPのパス -- パスが通っているものとする.
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//$dbh = new ScriptDB($log_listener);
//エラー出力用ハンドル
//開始メッセージ
//パラメータチェック
//if(count($_SERVER["argv"]) != 6){
//	// 数が正しくない
//	usage("");
//	exit(1);
//}
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//子スクリプトに渡す引数の作成、このスクリプトに渡されたものと全く同じ引数を渡す.
//2回目はサイレントモードで実行
//trend_mainを実行.
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u7D71\u8A08\u60C5\u5831\u30E1\u30A4\u30F3";

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
const PHP = "php";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");
var pactid_in = "";
var billdate = "";
var argvCnt = _SERVER.argv.length;

for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (ereg("^-c=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{
			var mode = ereg_replace("^-c=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[0-9]+$", mode) == false) {
				usage("ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
			}

			continue;
		}

	if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
			billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
			} else //年月チェック
				{
					var year = billdate.substr(0, 4);
					var month = billdate.substr(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + billdate + ")");
					}
				}

			var diffmon = (date("Y") - year) * 12 + (date("m") - month);

			if (diffmon < 0) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")");
			} else if (diffmon >= 24) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\uFF12\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")");
			}

			continue;
		}

	if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
			pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
			}

			continue;
		}

	usage("");
}

var co_arg = "";

for (var i = 1; i < _SERVER.argv.length; i++) //請求用の引数.
{
	co_arg += " ";
	co_arg += _SERVER.argv[i];
}

var co_arg2 = co_arg + " -m=0";
var cmd = escapeshellcmd(PHP + " trend_main.php" + co_arg);
system(cmd, status);

if (status != 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	throw die(1);
}

cmd = escapeshellcmd(PHP + " trend_graph.php" + co_arg2);
system(cmd, status);

if (status != 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	throw die(1);
}

logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function usage(comment) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -c={CARID} -p={PACTID} -y=YYYYMM\n");
	print("\t\t-c \u30AD\u30E3\u30EA\u30A2\uFF29\uFF24 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n\n");
	throw die(1);
};