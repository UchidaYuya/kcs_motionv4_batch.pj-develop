//===========================================================================
//機能：各プロセスのラッパ
//備考：コマンドラインの第二引数以降でPHPを呼び出し、
//その子プロセスからの標準出力への出力を、メール送信する。
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：メール送信ログ処理型
//子プロセスを実行する
//実行すべきphpファイル名
error_reporting(E_ALL);

require("Mail.php");

require("lib/script_command.php");

require("lib/script_common.php");

const G_PHP_TLS12 = "/usr/local/bin/php_tls12";

//メール本文
//メールタイトル
//TLS1.2を使うならtrue
//機能：コンストラクタ
//引数：処理するメッセージ種別
//機能：メッセージを整形せずに出力する
//備考：改行文字は付与しない
//引数：メッセージ
//機能：メールを送信する
class ScriptLogMail extends ScriptLogBase {
	constructor() {
		super(...arguments);
		this.m_tls12 = false;
	}

	ScriptLogMail(type) {
		this.ScriptLogBase(type);
		this.m_A_body = Array();
	}

	putRaw(message) {
		this.m_A_body.push(message);
	}

	send() //配列->文字列
	//encodingを取得
	//echo $enc . "\n";	// DEBUG
	//本文をJISに変換
	//本文の先頭に追加 -> JISに変換
	//echo $body . "\n";	// DEBUG
	//メールのタイトル
	//文字化け対応伊達 20170828
	{
		if (0 == this.m_A_body.length) return;
		var is_fail = false;

		for (var line of Object.values(this.m_A_body)) {
			if (false !== strpos(line, "\u6B63\u5E38\u7D42\u4E86")) continue;
			is_fail = true;
			break;
		}

		var body = this.m_A_body.join("");
		mb_detect_order("UTF-8");
		var enc = mb_detect_encoding(body);
		body = mb_convert_encoding(body, "JIS", enc);
		var title = is_fail ? "\u30D0\u30C3\u30C1\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u767A\u751F" : "\u30D0\u30C3\u30C1\u51E6\u7406\u6B63\u5E38\u7D42\u4E86";
		body = mb_convert_encoding(title + "(" + G_MAIL_TYPE + ")\n\n", "JIS", "UTF-8") + body;
		var O_mail = Mail.factory("smtp", {
			host: G_SMTP_HOST,
			port: G_SMTP_PORT
		});
		var H_headers = {
			Date: date("r"),
			To: G_MAILINGLIST,
			From: G_MAIL_FROM
		};
		H_headers["Return-Path"] = G_MAIL_FROM;
		H_headers["MIME-Version"] = "1.0";
		var subject = G_MAIL_SUBJECT;

		if (!is_fail) //正常終了を付加
			{
				subject += "(\u6B63\u5E38\u7D42\u4E86)";
			}

		if (this.m_Title != "") //引数で指定したタイトルを付加 2009/12/10
			{
				subject += this.m_Title;
			}

		H_headers.Subject = mb_encode_mimeheader(subject, "ISO-2022-JP-MS");
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var rval = O_mail.send([G_MAIL_TO], H_headers, body);

		if (PEAR.isError(rval)) {
			fwrite_conv("\u30E1\u30FC\u30EB\u9001\u4FE1\u5931\u6557\n");
			console.log(rval);
			throw die(1);
		}
	}

};

if (_SERVER.argv.length < 2) {
	fwrite_conv("usage: php mail_sender.php [-t=\u4ED8\u52A0\u30BF\u30A4\u30C8\u30EB] [-2] \u5B9F\u884C\u3057\u305F\u3044php\u30D5\u30A1\u30A4\u30EB [-\u30AA\u30D7\u30B7\u30E7\u30F3]\n");
	fwrite_conv("mail_sender.php\u3068\u5B9F\u884C\u3057\u305F\u3044php\u30D5\u30A1\u30A4\u30EB\u306F\u540C\u3058\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\n");
	throw die(0);
}

var listener = new ScriptLogMail(G_SCRIPT_ALL);
var proc = new ScriptCommand(listener);
var A_args = Array();
var cnt = 0;
var exec_php = "";

for (var arg of Object.values(_SERVER.argv)) {
	switch (cnt) {
		case 0:
			break;

		default:
			if (exec_php == "") //-t= の場合、メールのタイトルを取得する // 2009/12/10 T.Naka
				{
					if (preg_match("/^-t=/", arg)) {
						listener.m_Title = arg.substr("-t=".length);
					} else if (preg_match("/^-2/", arg)) {
						listener.m_tls12 = true;
					} else //次に来た引数を実行phpファイル名とする.
						{
							exec_php = arg;
						}
				} else //子プロセスの引数をそのまま取得
				{
					A_args.push(arg);
				}

			break;
	}

	++cnt;
}

proc.executeRaw((listener.m_tls12 ? G_PHP_TLS12 : G_PHP) + " " + exec_php, A_args);
listener.send();
throw die(0);