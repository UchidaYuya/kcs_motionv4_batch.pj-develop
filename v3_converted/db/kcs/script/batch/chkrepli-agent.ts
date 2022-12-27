//===========================================================================
//機能：pgpoolのが起動しているかを監視
//pgpoolでレプリケーションされているか（縮退運転になっていないか）を監視（pgpool対応版）
//pgpool-II 対応 2010/08/26 s.maeda
//
//作成：前田
//===========================================================================
//ロックファイル存在チェック
//ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//処理開始をログ出力
//$logh->putError(G_SCRIPT_BEGIN, "ＶＡＣＵＵＭ開始");
//失敗した場合（pgpoolが落ちているか予期せぬエラー）
error_reporting(E_ALL);

require("Mail.php");

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
const SCRIPTNAME = "chkrepli.php";
const LOCKFILE = "/tmp/.chkreplication.lock";
const PLATFORM = "\uFF21\uFF2D\u74B0\u5883\u7E2E\u9000\u8B66\u544A";
const SMTP_HOST = "192.168.20.15";

if (file_exists(LOCKFILE) == true) //ロックファイルがある場合は即時終了
	//ロックファイルがなければ作成
	{
		throw die(0);
	} else {
	touch(LOCKFILE);
}

var dbLogFile = G_LOG + "/chkrepliphp.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var sql = "show pool_status;";
var A_rtn = dbh.getHash(sql, false);

if ("object" === typeof A_rtn == true) //print "err\n";
	//$subject = mb_convert_encoding(PLATFORM . "postgres+pgpool監視", "JIS", "UTF-8");
	//$H_headers["Subject"] = mb_encode_mimeheader($subject, "JIS");
	{
		var O_mail = Mail.factory("smtp", {
			host: SMTP_HOST,
			port: G_SMTP_PORT
		});
		var to = "error@kcs-next-dev.com";
		var from = "error@kcs-next-dev.com";
		var message = mb_convert_encoding("pgpool\u304C\u843D\u3061\u3066\u3044\u308B\u304B\u4E88\u671F\u305B\u306C\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\n\u76E3\u8996\u3092\u518D\u958B\u3059\u308B\u306B\u306F\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\uFF08" + LOCKFILE + "\uFF09\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044", "ISO-2022-JP", "UTF-8");
		var H_headers = {
			Date: date("r"),
			To: to,
			From: from
		};
		H_headers["Return-Path"] = from;
		H_headers["MIME-Version"] = "1.0";
		H_headers.Subject = mb_encode_mimeheader(PLATFORM + " postgres+pgpool\u76E3\u8996", "UTF-8");
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v3";
		var rval = O_mail.send([to], H_headers, message);
	} else //print "ok\n";
	//マスターＤＢかセカンダリＤＢが落ちている場合
	{
		var cnt = 0;

		for (var tmp of Object.values(A_rtn)) {
			if (tmp.item == "backend status0") {
				var master = tmp.value;
			} else if (tmp.item == "backend status1") {
				var second = tmp.value;
			}

			cnt++;
		}

		if (master != "2" || second != "2") //print "Replication Down\n";
			//$subject = mb_convert_encoding(PLATFORM . "postgres+pgpool" , "JIS", "UTF-8");
			//$subject = mb_convert_encoding(PLATFORM . "postgres+pgpool" . "\監" . "\視" , "JIS", "EUC-JP");
			//$H_headers["Subject"] = mb_encode_mimeheader($subject, "JIS");
			//問題なければロックファイルを削除
			{
				O_mail = Mail.factory("smtp", {
					host: SMTP_HOST,
					port: G_SMTP_PORT
				});
				to = "error@kcs-next-dev.com";
				from = "error@kcs-next-dev.com";
				message = mb_convert_encoding("\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u304C\u7E2E\u9000\u904B\u8EE2\u306B\u306A\u308A\u307E\u3057\u305F\u306E\u3067\u3001DB\u306E\u540C\u671F\u3092\u884C\u3046\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002\n\u540C\u671F\u5F8C\u3001\u76E3\u8996\u3092\u518D\u958B\u3059\u308B\u306B\u306F\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\uFF08" + LOCKFILE + "\uFF09\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044", "ISO-2022-JP", "UTF-8");
				H_headers = {
					Date: date("r"),
					To: to,
					From: from
				};
				H_headers["Return-Path"] = from;
				H_headers["MIME-Version"] = "1.0";
				H_headers.Subject = mb_encode_mimeheader(PLATFORM + " postgres+pgpool\u76E3\u8996", "UTF-8");
				H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
				H_headers["Content-Transfer-Encoding"] = "7bit";
				H_headers["X-Mailer"] = "Motion Mailer v3";
				rval = O_mail.send([to], H_headers, message);
			} else {
			unlink(LOCKFILE);
		}
	}

throw die(0);