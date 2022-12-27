#!/usr/local/bin/php -q
//バッチと共通の方法でDB接続を行う.
///kcs/script/batch ディレクトリで動作する.
//設定ファイルの読み込み -- 2008/12/02 KCS_DIR/conf 以下に移動した
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//$log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, $dbLogFile);
//標準出力に出力
//ログListener にログファイル名、ログ出力タイプを渡す
//$log_listener->PutListener($log_listener_type);
//DBハンドル作成
//SQL文を実行
//メッセージ作成
//メール送信
//PEAR::Mail版
//ヘッダの生成
//本文の文字コード変更
//送信
//$res = $O_mail->send(array($mail_to), $H_headers, $msg);
echo("\n");

require("Mail.php");

require("lib/script_db.php");

require("lib/script_log.php");

require(KCS_DIR + "/conf/memcnt.conf");

var log_listener = new ScriptLogBase(0);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var sql = "select sum(secure_use_num) as memcnt from secure_charge_tb ";
sql += "where use_month_date = to_char((current_date - interval '1 month'),'yyyymm') ";
var H_result = dbh.getHash(sql, true);

if (H_result[0].memcnt != "") {
	var memcnt1 = H_result[0].memcnt;
} else {
	memcnt1 = 0;
}

sql = "select sum(secure_use_num) as memcnt from secure_charge_tb ";
sql += "where use_month_date = to_char((current_date - interval '1 month'),'yyyymm') ";
sql += "and pactid not in (99,133,134,1594) ";
H_result = dbh.getHash(sql, true);

if (H_result[0].memcnt != "") {
	var memcnt2 = H_result[0].memcnt;
} else {
	memcnt2 = 0;
}

var msg = "\u304A\u4E16\u8A71\u306B\u306A\u3063\u3066\u304A\u308A\u307E\u3059\u3002\n";
msg += "\u5148\u6708\u306E\u5229\u7528\u72B6\u6CC1\u306F\u4E0B\u8A18\u306B\u306A\u308A\u307E\u3059\u3002\n";
msg += "\u5229\u7528\u4EBA\u6570\uFF1A" + memcnt1 + " \u4EBA\n";
msg += "\u3046\u3061\u8AB2\u91D1\u5BFE\u8C61\uFF1A" + memcnt2 + " \u4EBA\n";
msg += "\u4EE5\u4E0A\u3001\u3088\u308D\u3057\u304F\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059\u3002\n";
var subject = mb_convert_encoding("KCS\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u767B\u9332\u4EBA\u6570", "JIS", "UTF-8");
H_params.host = mail_server_ip;
H_params.port = mail_server_port;
var O_mail = Mail.factory("smtp", H_params);
H_headers["Return-Path"] = return_path;
H_headers.To = mail_to;
H_headers.From = mb_encode_mimeheader(mb_convert_encoding(mail_from_name, "JIS", "UTF-8"), "JIS") + " <" + mail_from + ">";
H_headers.Subject = mb_encode_mimeheader(subject, "JIS");
H_headers["MIME-Version"] = "1.0";
H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
H_headers["Content-Transfer-Encoding"] = "7bit";
H_headers["X-Mailer"] = "Motion Mailer";
H_headers.Date = date("r");
msg = mb_convert_encoding(msg, "JIS", "UTF-8");
var res = O_mail.send(split(";", mail_to), H_headers, msg);

if (PEAR.isError(res)) {
	echo(res.getMessage() + "\n");
}