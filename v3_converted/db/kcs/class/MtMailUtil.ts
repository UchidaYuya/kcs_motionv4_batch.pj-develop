//
//メール送信クラスライブラリ
//
//更新履歴：<br>
//2008/03/12 上杉勝史 作成
//
//@package Base
//@subpackage Mail
//@author katsushi
//@filesource
//@since 2008/03/12
//
//
//
//メール送信クラスライブラリ
//
//@package Base
//@subpackage Mail
//@author katsushi
//@since 2008/03/12
//

require("MtOutput.php");

require("MtSetting.php");

require("Mail.php");

require("MtSession.php");

require("MtDBUtil.php");

//
//O_mail
//
//@var mixed
//@access private
//
//
//設定一覧
//
//@var mixed
//@access protected
//
//
//O_Out
//
//@var object
//@access private
//
//
//O_Auth
//
//@var object
//@access private
//
//
//Logdir
//
//@var mixed
//@access private
//
//
//メールを送信するか否か環境設定から決定
//
//@var mixed
//@access private
//
//
//セッション グループ化対応のため追加 20090724miya
//
//@var mixed
//@access private
//
//
//m_UseReturnPathFlag
//メールヘッダーにreturn pathを追加するかどうか
//@var mixed
//@access private
//
//
//コンストラクタ
//
//@author katsushi
//@since 2008/02/25
//
//@param MtOutput $O_output
//@access public
//@return void
//
//
//setUseReturnPathFlag
//return pathをヘッダーに追加するかどうか
//@author date
//@since 2016/12/21
//
//@param bool $flag
//@access public
//@return void
//
//
//mail送信
//
//@author katsushi
//@since 2008/02/25
//
//@param string $to
//@earam string $message
//@param string $from
//@param string $subj
//@param string $from_name
//@param string $to_name
//@access public
//@return boolean
//
//
//複数の宛先にまとめてメール送信
//
//@author katsushi
//@since 2008/03/11
//
//@param array $A_to
//@param string $message
//@param string $from
//@param string $subj
//@param string $from_name
//@access public
//@return void
//
//引数 $A_to の内容
//<code>
//$A_to = array( array("to" => "宛先アドレス",
//"to_name" => "宛先名（省略可能)"),
//array("to" => "info@kcs-next-dev.com",
//"to_name" => "KCS Motion管理者")
//);
//</code>
//
//
//複数の宛先にまとめてメール送信(CC対応版)
//A_toの全てのユーザーに送られる。
//MultiSendと違い、指定されたTo、CC全てにメールする
//
//@author date
//@since 20170519
//
//@param array $A_to
//@param string $message
//@param string $from
//@param string $subj
//@param string $from_name
//@access public
//@return void
//
//引数 $A_to の内容
//<code>
//$A_to = array(
//array(
//"type" => "To"
//"mail" => "宛先アドレス",
//"name" => "宛先名（省略可能)"
//),
//array(
//"type" => "To"
//"mail" => "宛先アドレス2",
//"name" => "宛先名2（省略可能)"
//),
//array(
//"type" => "Cc"
//"mail" => "info2@kcs-next-dev.com",
//"name" => "KCS Motion管理者"
//)
//array(
//"type" => "Cc"
//"mail" => "info2@kcs-next-dev.com",
//"name" => "KCS Motion管理者2"
//)
//);
//</code>
//
//
//実際のメール送信
//
//@author katsushi
//@since 2008/03/11
//
//@param mixed $to
//@param array $H_headers
//@param string $message
//@access private
//@return void
//@uses Mail::send
//
//
//メッセージのエンコード
//
//@author katsushi
//@since 2008/03/11
//
//@param mstring $message
//@access protected
//@return string
//
//
//メールヘッダの生成
//
//@author katsushi
//@since 2008/03/11
//
//@param string $from
//@param string $subj
//@param string $from_name
//@access protected
//@return array
//
//
//ヘッダに"To"を追加する<br>
//宛先名がある場合は　宛先名<送信先アドレス>の形式に整形
//
//@author katsushi
//@since 2008/03/11
//
//@param array $H_headers
//@param string $to
//@param string $to_name
//@access protected
//@return void
//
//
//送信リストにBCCで管理者宛のメールを追加する
//
//@author katsushi
//@since 2008/03/11
//
//@param array $A_to_list
//@access protected
//@return void
//
//
//メールの中身に送信したプログラム名（PHP_SELF）を追加する
//
//@author katsushi
//@since 2008/03/12
//
//@param string $message
//@access protected
//@return string
//
//
//BCCへの送信者一覧をメッセージに追加する
//
//@author katsushi
//@since 2008/03/11
//
//@param string $message
//@param array $A_to_list
//@access protected
//@return string
//
//
//メールの送信記録、バックアップを記録する<br>
//エラーで止まらないように関数に"@"を付与
//
//@author katsushi
//@since 2008/03/11
//
//@param array $H_headers
//@param string $message
//@access private
//@return void
//
//
//errormail送信
//
//@author houshiyama
//@since 2008/11/14
//
//@param string $to
//@earam string $message
//@param string $from
//@param string $subj
//@param string $from_name
//@param string $to_name
//@access public
//@return boolean
//
//
//エラーメール等の送信フラグを取得する
//
//@author houshiyama
//@since 2008/11/14
//
//@access private
//@return void
//
//
//convertPactLogin
//
//@author
//@since 2010/10/28
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/03/14
//
//@access public
//@return void
//
class MtMailUtil {
	static SUFFIX = ".mlog";
	static DELIMITER = "_";
	static MAIL_ENCODE = "JIS";
	static FNC_PACT_LOGIN = 206;

	constructor() //メールハンドル作成
	{
		this.m_UseReturnPathFlag = true;
		this.O_Conf = MtSetting.singleton();
		this.O_Conf.loadConfig("mail");
		this.O_Out = MtOutput.singleton();
		this.Logdir = this.O_Conf.KCS_DIR + this.O_Conf.mail_save_path;
		this.SendFlg = this.O_Conf.mail_send;

		if (this.O_Out.getSite() != MtOutput.SITE_BATCH) //バッチの場合セッションは無い 20091106naka
			//グループ化対応のため追加 20090724miya
			//販売店とバッチはO_Authの作成しない
			//if(isset($this->O_Sess->pactid) && !empty($this->O_Sess->pactid)){
			{
				this.O_Sess = MtSession.singleton();

				if (is_numeric(this.O_Sess.pactid) && 0 !== this.O_Sess.pactid) {
					this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
				}
			}

		if (this.O_Conf.mail_localsend == 1) {
			if (this.O_Conf.mail_sendmail_path == "") //エラー
				{
					this.O_Out.errorOut(0, "\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC: sendmail\u306E\u30D1\u30B9\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\n", 0);
					return false;
				}

			H_params.sendmail_path = this.O_Conf.mail_sendmail_path;
			H_params.sendmail_args = this.O_Conf.mail_sendmail_args;
			var proto = "sendmail";
		} else {
			if (this.O_Conf.mail_smtp_host == "" || this.O_Conf.mail_smtp_port == "") //エラー
				{
					this.O_Out.errorOut(0, "\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC: \u30E1\u30FC\u30EB\u9001\u4FE1\u30B5\u30FC\u30D0\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n", 0);
					return false;
				}

			H_params.host = this.O_Conf.mail_smtp_host;
			H_params.port = this.O_Conf.mail_smtp_port;
			proto = "smtp";
		}

		this.O_Mail = Mail.factory(proto, H_params);

		if (PEAR.isError(this.O_Mail)) //エラー
			{
				this.O_Out.errorOut(0, "\u30E1\u30FC\u30EB\u9001\u4FE1\u30A8\u30E9\u30FC:" + PEAR_Error.getMessage() + "\n", 0);
				return false;
			}
	}

	setUseReturnPathFlag(flag) {
		this.m_UseReturnPathFlag = flag;
	}

	send(to, message, from = "", subj = "", from_name = "", to_name = "") //ヘッダの生成
	//宛先を成形してヘッダに追加
	//宛先
	//個別ログイン用のURLに変更
	//メッセージの文字コード変換
	//メール送信
	//メールバックアップ
	{
		var H_headers = this.makeHeaders(from, from_name, subj);
		this.addHeaderMailTo(H_headers, to, to_name);
		var A_to_list = Array();

		if (to != "") {
			A_to_list.push(to);
		}

		this.addBcc(A_to_list);
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);
		this.mailSend(A_to_list, H_headers, message);
		this.saveMailLog(H_headers, message);
	}

	multiSend(A_to: {} | any[], message, from = "", subj = "", from_name = "") //ヘッダの生成
	//メッセージの文字コード変換
	//宛先リストの生成
	{
		var H_headers = this.makeHeaders(from, from_name, subj);
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);
		var A_to_list = Array();

		for (var i = 0; i < A_to.length; i++) //宛先を成形してヘッダに追加
		//メール送信
		{
			this.addHeaderMailTo(H_headers, A_to[i].to, A_to[i].to_name);

			if (A_to[i].to != "") //メールバックアップ
				{
					this.mailSend(A_to[i].to, H_headers, message);
					this.saveMailLog(H_headers, message);
				}

			A_to_list.push(H_headers.To);
		}

		if (!!this.O_Conf.mail_bcc_addr) //BCC用のメッセージを生成
			//BCC用のToを設定
			//BCC宛にメール送信
			//BCCメールのバックアップ
			{
				message = this.makeBccMessage(message, A_to_list);
				this.addHeaderMailTo(H_headers, this.O_Conf.mail_bcc_addr);
				this.mailSend(this.O_Conf.mail_bcc_addr, H_headers, message);
				this.saveMailLog(H_headers, message);
			}
	}

	multiSend2(A_to: {} | any[], message, from = "", subj = "", from_name = "") //ヘッダの生成
	//メッセージの文字コード変換
	//ヘッダーの作成
	//ヘッダーに追加するぽよ
	//送信を行う
	{
		var H_headers = this.makeHeaders(from, from_name, subj);
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);
		var tmp = Array();

		for (var value of Object.values(A_to)) //Bccは足さない
		//アドレスを足していく
		{
			if (value.type == "Bcc") {
				continue;
			}

			if (!value.type || !value.mail) {
				continue;
			}

			if (undefined !== tmp[value.type]) {
				tmp[value.type] += ", ";
			} else {
				tmp[value.type] = "";
			}

			if (undefined !== value.mail) //宛先名の成形
				{
					if (value.name != "") {
						tmp[value.type] += mb_encode_mimeheader(value.name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + value.mail + ">";
					} else {
						tmp[value.type] += value.mail;
					}
				}
		}

		for (var key in tmp) {
			var value = tmp[key];
			H_headers[key] = value;
		}

		for (var value of Object.values(A_to)) //メール送信
		{
			if (!!value.mail) //メールバックアップ
				{
					this.mailSend(value.mail, H_headers, message, true);
					this.saveMailLog(H_headers, message);
				}
		}
	}

	mailSend(to, H_headers: {} | any[], message) //メール送信フラグを見る
	{
		if (this.SendFlg == 1) {
			var ret = this.O_Mail.send(to, H_headers, message);

			if (Array.isArray(to) == true) {
				var msg = to.join(",");
			} else {
				msg = to;
			}

			this.O_Out.infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5B9F\u884C: " + msg + "\n", 0);

			if (PEAR.isError(ret)) //エラー
				{
					this.O_Out.errorOut(0, "\u30E1\u30FC\u30EB\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F", 0);
					return false;
				}
		}
	}

	encodeMessage(message) //メッセージの文字コード変換
	{
		return mb_convert_encoding(message, MtMailUtil.MAIL_ENCODE);
	}

	makeHeaders(from = "", from_name = "", subj = "") //グループ化対応 20090806miya
	//conf/mail.iniの設定をグループごとに上書きする
	//; デフォルトのFrom
	//mail_def_from = "info@kcs-next-dev.com"
	//; デフォルトのFrom名称
	//mail_def_from_name = "KCS Motionサービス運営係"
	//; デフォルトのSubject
	//mail_def_subj = "KCS Motionからのお知らせ"
	//; BCCアドレス
	//;mail_bcc_addr = "bcc@kcs-next-dev.com"
	//mail_bcc_addr = ""
	//; デフォルトのReturn-Path
	//mail_def_return_path = "info@kcs-next-dev.com"
	//送信元アドレス
	{
		var H_headers = Array();

		if (from == "") {
			if ("" != this.O_Sess.groupid && true == this.O_Conf.existsKey("mail_def_from_" + this.O_Sess.groupid)) {
				from = this.O_Conf["mail_def_from_" + this.O_Sess.groupid];
			} else {
				from = this.O_Conf.mail_def_from;
			}
		}

		if (subj == "") {
			if ("" != this.O_Sess.groupid && true == this.O_Conf.existsKey("mail_def_subj_" + this.O_Sess.groupid)) {
				subj = this.O_Conf["mail_def_subj_" + this.O_Sess.groupid];
			} else {
				subj = this.O_Conf.mail_def_subj;
			}
		}

		if (from_name == "") {
			if ("" != this.O_Sess.groupid && true == this.O_Conf.existsKey("mail_def_from_name_" + this.O_Sess.groupid)) {
				from_name = this.O_Conf["mail_def_from_name_" + this.O_Sess.groupid];
			} else {
				from_name = this.O_Conf.mail_def_from_name;
			}
		}

		if (this.m_UseReturnPathFlag) {
			if (this.O_Conf.mail_def_return_path == "") {
				H_headers["Return-Path"] = from;
			} else {
				if (undefined != this.O_Sess && "" != this.O_Sess.groupid && true == this.O_Conf.existsKey("mail_def_return_path_" + this.O_Sess.groupid)) {
					H_headers["Return-Path"] = this.O_Conf["mail_def_return_path_" + this.O_Sess.groupid];
				} else {
					H_headers["Return-Path"] = this.O_Conf.mail_def_return_path;
				}
			}
		}

		if (from_name != "") {
			var A_from = from.split(",");

			if (A_from.length >= 2) {
				H_headers.From = mb_encode_mimeheader(from_name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + A_from.shift() + ">, ";
				H_headers.From += A_from.join(",");
			} else {
				H_headers.From = mb_encode_mimeheader(from_name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + from + ">";
			}
		} else {
			H_headers.From = from;
		}

		H_headers.Date = date("r");
		H_headers.Subject = mb_encode_mimeheader(subj, "ISO-2022-JP-MS");
		H_headers["MIME-Version"] = "1.0";
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = this.O_Conf.mail_xmailer;
		return H_headers;
	}

	addHeaderMailTo(H_headers: {} | any[], to, to_name = "") //宛先名の成形
	{
		if (to_name != "") {
			if ("number" === typeof strpos(",", to) === true) {
				var A_to_tmp = to.split(",");
				H_headers.To = mb_encode_mimeheader(to_name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + A_to_tmp.shift() + ">, " + A_to_tmp.join(", ");
			} else {
				H_headers.To = mb_encode_mimeheader(to_name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + to + ">";
			}
		} else {
			H_headers.To = to;
		}
	}

	addBcc(A_to_list: {} | any[]) //BCC宛を追加
	{
		if (this.O_Conf.mail_bcc_addr != "" && -1 !== A_to_list.indexOf(this.O_Conf.mail_bcc_addr) == false) {
			A_to_list.push(this.O_Conf.mail_bcc_addr);
		}
	}

	addPhpSelf(message = "") {
		return message + "\n" + mb_convert_encoding("\u9001\u4FE1\u30D7\u30ED\u30B0\u30E9\u30E0: ", MtMailUtil.MAIL_ENCODE, this.O_Conf.common_encoding) + _SERVER.PHP_SELF + "\n";
	}

	makeBccMessage(message, A_to_list: {} | any[]) {
		var bccmsg = "\n";
		bccmsg += "=================================================\n";
		bccmsg += mb_convert_encoding("\u9001\u4FE1\u5148\u4E00\u89A7\n", MtMailUtil.MAIL_ENCODE, this.O_Conf.common_encoding);
		bccmsg += "=================================================\n";

		for (var i = 0; i < A_to_list.length; i++) {
			bccmsg += mb_convert_encoding(mb_decode_mimeheader(A_to_list[i]), MtMailUtil.MAIL_ENCODE, this.O_Conf.common_encoding) + "\n";
		}

		return message + "\n" + bccmsg;
	}

	saveMailLog(H_headers: {} | any[], message = "") //ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		if (this.O_Conf.mail_save == 1 || this.O_Conf.mail_send == "") //ディレクトリの存在チェック
			//オープンとロックが出来るまで永久ループ
			//ヘッダの書き込み
			//メッセージの書き込み
			{
				if (is_dir(this.Logdir) == false) {
					this.O_Out.errorOut(0, "\u30E1\u30FC\u30EB\u30ED\u30B0\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u3042\u308A\u307E\u305B\u3093" + this.Logdir + "\n", 0);
					return false;
				}

				var sendtime = Date.now() / 1000;

				for (var i = 1; ; i++) {
					var fp = fopen(this.Logdir + sendtime + MtMailUtil.DELIMITER + i + MtMailUtil.SUFFIX, "x");
					var lock = flock(fp, LOCK_EX);

					if (fp != false && lock == true) {
						break;
					}
				}

				for (var key in H_headers) {
					var val = H_headers[key];
					fputs(fp, key + ": " + mb_decode_mimeheader(val) + "\n");
				}

				fputs(fp, mb_convert_encoding(message, this.O_Conf.common_encoding, MtMailUtil.MAIL_ENCODE) + "\n");
				fclose(fp);
			}
	}

	sendByFlg(to, message, from = "", subj = "", from_name = "", to_name = "", flg = "error_mail_send") //ヘッダの生成
	//宛先を成形してヘッダに追加
	//宛先
	//メッセージの文字コード変換
	//送信フラグを書き換える
	//メール送信
	//送信フラグを元に戻す
	//メールバックアップ
	{
		var H_headers = this.makeHeaders(from, from_name, subj);
		this.addHeaderMailTo(H_headers, to, to_name);
		var A_to_list = Array();

		if (to != "") {
			A_to_list.push(to);
		}

		this.addBcc(A_to_list);
		message = this.encodeMessage(message);
		this.getSendFlg(flg);
		this.mailSend(A_to_list, H_headers, message);
		this.SendFlg = this.O_Conf.mail_send;
		this.saveMailLog(H_headers, message);
	}

	getSendFlg(flg) //どのフラグを見て送信を切り替えるかの決定（今のところエラーのみ）
	//送信フラグを書き換える
	{
		var flgtype = this.O_Conf[flg];

		if (flgtype == 1) {
			this.SendFlg = flgtype;
		}
	}

	convertPactLoginURL(message) //O_Authがなければ処理しない(batchは未実行)
	{
		if ("object" === typeof this.O_Auth) //個別ログイン権限がなければ処理しない
			{
				if (this.O_Auth.chkPactFuncId(MtMailUtil.FNC_PACT_LOGIN)) //置換参照用
					//メール本文用
					//kcsとdtはURLにグループ名をたす
					//fjpとcosmo
					{
						var O_db = MtDBUtil.singleton();
						var sql = "SELECT userid_ini FROM pact_tb WHERE pactid=" + O_db.dbQuote(this.O_Sess.pactid, "int", true);
						var userid_ini = O_db.queryOne(sql);

						if (!!userid_ini) {
							userid_ini += "/";
						}

						var replaceurl = "https:\\/\\/" + _SERVER.SERVER_NAME + "\\/";
						var url = "https://" + _SERVER.SERVER_NAME + "/";

						if ("1" == this.O_Sess.groupid) {
							var group = this.O_Conf.groupid1 + "/";
						} else if ("3" == this.O_Sess.groupid) {
							if (this.O_Conf.existsKey(groupid3_is_original_domain) && true != this.O_Conf.groupid3_is_original_domain) {
								replaceurl += this.O_Conf.groupid3 + "\\/";
							}

							group = this.O_Conf.groupid3 + "/";
						} else if ("4" == this.O_Sess.groupid) {
							if (this.O_Conf.existsKey(groupid4_is_original_domain) && true != this.O_Conf.groupid4_is_original_domain) {
								replaceurl += this.O_Conf.groupid4 + "\\/";
							}

							group = this.O_Conf.groupid4 + "/";
						} else if ("5" == this.O_Sess.groupid) {
							if (this.O_Conf.existsKey(groupid5_is_original_domain) && true != this.O_Conf.groupid5_is_original_domain) {
								replaceurl += this.O_Conf.groupid5 + "\\/";
							}

							group = this.O_Conf.groupid5 + "/";
						} else if ("100" == this.O_Sess.groupid) {
							if (this.O_Conf.existsKey(groupid100_is_original_domain) && true != this.O_Conf.groupid100_is_original_domain) {
								replaceurl += this.O_Conf.groupid100 + "\\/";
							}

							group = this.O_Conf.groupid100 + "/";
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

	__destruct() {}

};