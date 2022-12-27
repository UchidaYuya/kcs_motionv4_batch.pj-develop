//===========================================================================
//機能：請求情報ファイルインポートプロセス（DDI POCKET専用）
//
//作成：前田
//
//[更新履歴]
//１つめのバッチでエラーの場合は２つめを呼ばない 2004.12.07 by 上杉顕一郎
//
//===========================================================================
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//$dbh = new ScriptDB($log_listener);
//エラー出力用ハンドル
//パラメータチェック
//数が正しくない
//UPDATE 2004.12.07	上杉顕一郎
//DDI 請求情報ファイルインポート
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
const SCRIPTNAME = "import_ddi.php";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 7) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //mode を取得
		{
			if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				{
					var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ao]$", mode) == false) {
						usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					} else //年月チェック
						{
							var year = billdate.substr(0, 4);
							var month = billdate.substr(4, 2);

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							}
						}

					continue;
				}

			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				{
					var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ny]$", backup) == false) {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-t=", _SERVER.argv[argvCounter]) == true) //電話テーブルの指定をチェック
				{
					var teltable = ereg_replace("^-t=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[no]$", teltable) == false) {
						usage("\u96FB\u8A71\u30C6\u30FC\u30D6\u30EB\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-a=", _SERVER.argv[argvCounter]) == true) //会社一括請求データを電話回線毎に按分するかをチェック
				{
					var anbun = ereg_replace("^-a=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ny]$", anbun) == false) {
						usage("\u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u6309\u5206\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			usage("");
		}
	}

system(`php /kcs/script/batch/import_ddi_bill.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup} -t=${teltable} -a=${anbun}`, ret);

if (ret != 0) {
	print("DDI\u30DD\u30B1\u30C3\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002" + "\n" + "\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002" + "\n");
	throw die(1);
}

passthru(`php /kcs/script/batch/import_ddi_tuwa.php -e=${mode} -y=${billdate} -p=${pactid} -b=${backup}`);

function usage(comment) {
	if (!("logh" in global)) logh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O} -a={Y|N}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-t \u96FB\u8A71\u30C6\u30FC\u30D6\u30EB (N:tel_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:tel_X_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8)\n");
	print("\t\t-a \u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u6309\u5206 (Y:\u6309\u5206\u3059\u308B\uFF0D\u96FB\u8A71\u56DE\u7DDA\u6BCE\u306B\u8A08\u4E0A,N:\u6309\u5206\u3057\u306A\u3044\uFF0D\u30C0\u30DF\u30FC\u96FB\u8A71\u306B\u8A08\u4E0A)\n\n");
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};