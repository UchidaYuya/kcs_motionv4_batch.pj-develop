//
//	メール送信ユーティリティクラス
//
//	作成日：2004/04/08
//	作成者：上杉勝史
//

require("Mail.php");

require("mail.conf");

require("Log.php");

require("common.conf");

require("Authority.php");

require("DBUtil.php");

require("MtSetting.php");

require("MtSession.php");

//個別ログイン権限
//メールオブジェクト
//デフォルト送信元
//デフォルト件名
//デフォルト送信元名
//デフォルトエラー送信先
//BCCアドレス
//BCCアドレス
//
// コンストラクタ
// 
// [引　数] なし
// [返り値] なし
//
//
// メール送信 (ヘッダ、本文とも文字コード変換も行う)
// 
// [引　数] $to			: 送信先メールアドレス
//		   $message		: メール本文
//		   $from		: 送信元(指定ない場合はデフォルト値設定)
//		   $subj		: 件名(指定ない場合はデフォルト値設定)
//		   $from_name	: 送信元名
//		   $to_name		: 送信先名
// [返り値] なし
//
//
// メール複数送信 (ヘッダ、本文とも文字コード変換も行う)
// 
// [引　数] $H_to		: 送信先メールアドレスと送信先名の他次元連想配列
//		   $message		: メール本文
//		   $from		: 送信元(指定ない場合はデフォルト値設定)
//		   $subj		: 件名(指定ない場合はデフォルト値設定)
//		   $from_name	: 送信元名
// [返り値] なし
//
//
//convertPactLoginURL
//
//@author
//@since 2010/10/28
//
//@param mixed $message
//@access public
//@return void
//
class MailUtil {
	static FNC_PACT_LOGIN = 206;

	MailUtil() //設定ファイルで内部送信を指定した場合
	//メールハンドル作成
	{
		this.def_from = GLOBALS.def_from;
		this.def_subj = GLOBALS.def_subj;
		this.def_from_name = GLOBALS.def_from_name;
		this.def_return_path = GLOBALS.def_return_path;
		this.bcc_addr = GLOBALS.bcc_addr;
		this.O_err = Log.singleton("file", KCS_DIR + "/log/err.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);

		if (GLOBALS.localsend == true) {
			if (undefined !== GLOBALS.sendmail_path == false || undefined !== GLOBALS.sendmail_args == false) //エラー
				{
					this.O_err.log("\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC:sendmail\u306E\u30D1\u30B9\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", 3);
					return false;
				}

			H_params.sendmail_path = GLOBALS.sendmail_path;
			H_params.sendmail_args = GLOBALS.sendmail_args;
			var proto = "sendmail";
		} else {
			if (undefined !== GLOBALS.smtp_host == false || undefined !== GLOBALS.smtp_port == false) //エラー
				{
					this.O_err.log("\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC:\u30E1\u30FC\u30EB\u9001\u4FE1\u30B5\u30FC\u30D0\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 3);
					return false;
				}

			H_params.host = GLOBALS.smtp_host;
			H_params.port = GLOBALS.smtp_port;
			proto = "smtp";
		}

		this.O_mail = Mail.factory(proto, H_params);

		if (PEAR.isError(this.O_mail)) //エラー
			{
				this.O_err.log("\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC:" + PEAR_Error.getMessage(), 3);
				return false;
			}
	}

	send(to, message, from = "", subj = "", from_name = "", to_name = "") //個別ログイン用にURL書換
	//ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		if (from == "") from = this.def_from;
		if (subj == "") subj = this.def_subj;
		if (from_name == "") from_name = this.def_from_name;

		if (this.def_return_path == "") {
			var return_path = from;
		} else {
			return_path = this.def_return_path;
		}

		H_headers["Return-Path"] = return_path;
		H_headers.Date = date("r");
		message = this.convertPactLoginURL(message);
		message = mb_convert_encoding(message, "JIS");

		if (to_name != "") {
			H_headers.To = mb_encode_mimeheader(to_name, "JIS") + " <" + to + ">";
		} else {
			H_headers.To = to;
		}

		var A_to = Array();

		if (to != "") {
			A_to.push(to);
		}

		if (to != this.bcc_addr && this.bcc_addr != "") //bcc_addrが空だったら追加しないようにした 20071210miya
			{
				A_to.push(this.bcc_addr);
			}

		if (from_name != "") {
			var A_from = split(",", from);

			if (A_from.length >= 2) {
				H_headers.From = mb_encode_mimeheader(from_name, "JIS") + " <" + A_from.shift() + ">, ";
				H_headers.From += join(",", A_from);
			} else {
				H_headers.From = mb_encode_mimeheader(from_name, "JIS") + " <" + from + ">";
			}
		} else {
			H_headers.From = from;
		}

		H_headers.Subject = mb_encode_mimeheader(subj, "ISO-2022-JP-MS");
		H_headers["MIME-Version"] = "1.0";
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";

		if (GLOBALS.G_mailsave == 1 || GLOBALS.G_mailsend == 0) {
			var dir = KCS_DIR + "/log/mail/";
			var sufix = ".mlog";
			var dlm = "_";
			var sendtime = Date.now() / 1000;

			for (var i = 1; ; i++) {
				var fp = fopen(dir + sendtime + dlm + i + sufix, "x");
				var lock = flock(fp, LOCK_EX);

				if (fp != false && lock == true) {
					break;
				}
			}

			for (var key in H_headers) {
				var val = H_headers[key];
				fputs(fp, key + ": " + mb_decode_mimeheader(val) + "\n");
			}

			fputs(fp, mb_convert_encoding(message, "UTF-8", "JIS") + "\n");
			fclose(fp);
		}

		if (GLOBALS.G_mailsend == 1) //トレースフラグが1ならトレース、2ならバックトレースログを吐く
			{
				var ret = this.O_mail.send(A_to, H_headers, message);

				if (GLOBALS.G_traceflg == 1) {
					if (GLOBALS.GO_tracelog == false) {
						GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
					}

					GLOBALS.GO_tracelog.log("MailSend:" + to, 6);
				} else if (GLOBALS.G_traceflg == 2) {
					if (GLOBALS.GO_debuglog == false) {
						GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
					}

					GLOBALS.GO_debuglog.log(debug_backtrace(), 1);
				}

				if (PEAR.isError(ret)) //エラー
					{
						this.O_err.log("\u30E1\u30FC\u30EB\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + ret.getMessage(), 3);
						return false;
					}
			}
	}

	multiSend(H_to, message, from = "", subj = "", from_name = "") //個別ログイン用にURL書換
	//ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		if (from == "") from = this.def_from;
		if (subj == "") subj = this.def_subj;
		if (from_name == "") from_name = this.def_from_name;

		if (this.def_return_path == "") {
			var return_path = from;
		} else {
			return_path = this.def_return_path;
		}

		H_headers["Return-Path"] = return_path;
		H_headers.Date = date("r");
		message = this.convertPactLoginURL(message);
		message = mb_convert_encoding(message, "JIS", "UTF-8");
		H_headers.To = "";

		if (from_name != "") {
			var A_from = split(",", from);

			if (A_from.length >= 2) {
				H_headers.From = mb_encode_mimeheader(from_name, "JIS") + " <" + A_from.shift() + ">, ";
				H_headers.From += join(",", A_from);
			} else {
				H_headers.From = mb_encode_mimeheader(from_name, "JIS") + " <" + from + ">";
			}
		} else {
			H_headers.From = from;
		}

		H_headers.Subject = mb_encode_mimeheader(subj, "ISO-2022-JP-MS");
		H_headers["MIME-Version"] = "1.0";
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var A_tolist = Array();

		for (var to_cnt = 0; to_cnt < H_to.length; to_cnt++) //ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
		{
			if (H_to[to_cnt].to_name != "") {
				if (preg_match("/,/", H_to[to_cnt].to) == true) {
					var A_to_lst = preg_split("/,/", H_to[to_cnt].to);
					H_headers.To = mb_encode_mimeheader(H_to[to_cnt].to_name, "JIS") + " <" + A_to_lst.shift() + ">, " + join(", ", A_to_lst);
				} else {
					H_headers.To = mb_encode_mimeheader(H_to[to_cnt].to_name, "JIS") + " <" + H_to[to_cnt].to + ">";
				}
			} else {
				H_headers.To = H_to[to_cnt].to;
			}

			A_tolist.push(H_headers.To);

			if (GLOBALS.G_mailsave == 1 || GLOBALS.G_mailsend == 0) {
				var dir = KCS_DIR + "/log/mail/";
				var sufix = ".mlog";
				var dlm = "_";
				var sendtime = Date.now() / 1000;

				for (var i = 1; ; i++) {
					var fp = fopen(dir + sendtime + dlm + i + sufix, "x");
					var lock = flock(fp, LOCK_EX);

					if (fp != false && lock == true) {
						break;
					}
				}

				for (var key in H_headers) {
					var val = H_headers[key];
					fputs(fp, key + ": " + mb_decode_mimeheader(val) + "\n");
				}

				fputs(fp, mb_convert_encoding(message, "UTF-8", "JIS") + "\n");
				fclose(fp);
			}

			if (GLOBALS.G_mailsend == 1) {
				if (H_to[to_cnt].to != "") {
					var ret = this.O_mail.send(H_to[to_cnt].to, H_headers, message);
				}

				if (GLOBALS.G_traceflg == 1) {
					if (GLOBALS.GO_tracelog == false) {
						GLOBALS.GO_tracelog = Log.singleton("file", KCS_DIR + "/log/trace.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
					}

					GLOBALS.GO_tracelog.log("MailSend:" + to, 6);
				} else if (GLOBALS.G_traceflg == 2) {
					if (GLOBALS.GO_debuglog == false) {
						GLOBALS.GO_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, GLOBALS.GH_logopt);
					}

					GLOBALS.GO_debuglog.log(debug_backtrace(), 1);
				}

				if (PEAR.isError(ret)) //エラー
					{
						this.O_err.log("\u30E1\u30FC\u30EB\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + ret.getMessage(), 3);
						return false;
					}
			}
		}

		var bccmsg = mb_convert_encoding("=================================================\n\u9001\u4FE1\u5148\u4E00\u89A7\n=================================================\n", "JIS");

		for (var all = 0; all < A_tolist.length; all++) {
			bccmsg += mb_convert_encoding(mb_decode_mimeheader(A_tolist[all]), "JIS") + "\n";
		}

		message = message + "\n" + bccmsg;
		H_headers.To = this.bcc_addr;

		if (GLOBALS.G_mailsave == 1 || GLOBALS.G_mailsend == 0) {
			dir = KCS_DIR + "/log/mail/";
			sufix = ".mlog";
			dlm = "_";
			sendtime = Date.now() / 1000;

			for (i = 1;; ; i++) {
				fp = fopen(dir + sendtime + dlm + i + sufix, "x");
				lock = flock(fp, LOCK_EX);

				if (fp != false && lock == true) {
					break;
				}
			}

			for (var key in H_headers) {
				var val = H_headers[key];
				fputs(fp, key + ": " + mb_decode_mimeheader(val) + "\n");
			}

			fputs(fp, mb_convert_encoding(message, "UTF-8", "JIS") + "\n");
			fclose(fp);
		}
	}

	convertPactLoginURL(message) {
		var pactid = GLOBALS._SESSION.pactid;

		if (!!pactid) {
			var O_Auth = new Authority();

			if (O_Auth.chkPactAuth(MailUtil.FNC_PACT_LOGIN, pactid, true)) //置換参照用
				//メール本文用
				//kcsとdtはURLにグループ名をたす
				//fjpとcosmo
				{
					var sql = "SELECT userid_ini FROM pact_tb WHERE pactid=" + pactid;
					var userid_ini = GLOBALS.GO_db.getOne(sql);

					if (!!userid_ini) {
						userid_ini += "/";
					}

					var replaceurl = "https:\\/\\/" + _SERVER.SERVER_NAME + "\\/";
					var url = "https://" + _SERVER.SERVER_NAME + "/";

					if ("1" == GLOBALS._SESSION.groupid) {
						if (GLOBALS.O_conf.existsKey(groupid1)) {
							var group = GLOBALS.O_conf.groupid1 + "/";
						}
					} else if ("3" == GLOBALS._SESSION.groupid) {
						if (GLOBALS.O_conf.existsKey(groupid3)) {
							replaceurl += GLOBALS.O_conf.groupid3 + "\\/";
						}

						group = GLOBALS.O_conf.groupid3 + "/";
					} else if ("4" == GLOBALS._SESSION.groupid) {
						if (GLOBALS.O_conf.existsKey(groupid4)) {
							replaceurl += GLOBALS.O_conf.groupid4 + "\\/";
						}

						group = GLOBALS.O_conf.groupid4 + "/";
					} else if ("5" == GLOBALS._SESSION.groupid) {
						if (GLOBALS.O_conf.existsKey(groupid5)) {
							replaceurl += GLOBALS.O_conf.groupid5 + "\\/";
						}

						group = GLOBALS.O_conf.groupid5 + "/";
					} else if ("100" == GLOBALS._SESSION.groupid) {
						if (GLOBALS.O_conf.existsKey(groupid100)) {
							replaceurl += GLOBALS.O_conf.groupid100 + "\\/";
						}

						group = GLOBALS.O_conf.groupid100 + "/";
					}

					var A_message = message.split("\n");
					message = "";

					for (var val of Object.values(A_message)) {
						message += preg_replace("/^" + replaceurl + "$/", url + group + userid_ini, val) + "\n";
					}
				}
		}

		return message;
	}

};