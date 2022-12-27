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
import MtOutput from './MtOutput';
import MtSetting from './MtSetting';
import { KCS_DIR } from '../conf/batch_setting';

const fs = require("fs"); 
const lockfile = require('proper-lockfile');
const Iconv  = require('iconv').Iconv;
const nodemailer = require('nodemailer');

export default class MtMailUtil {
	static SUFFIX = ".mlog";
	static DELIMITER = "_";
	static MAIL_ENCODE = "JIS";
	static FNC_PACT_LOGIN = 206;
	O_Out: MtOutput;
	O_Conf: MtSetting;
	m_UseReturnPathFlag: boolean;
	Logdir: any;
	SendFlg: any;
	O_Auth: any;
	O_Mail: any;

	constructor() //メールハンドル作成
	{
		this.m_UseReturnPathFlag = true;
		this.O_Conf = MtSetting.singleton();
		this.O_Conf.loadConfig("mail");
		this.O_Out = MtOutput.singleton();
		this.Logdir = KCS_DIR + this.O_Conf.get("mail_save_path");
		this.SendFlg = this.O_Conf.get("mail_send");

		const options: any = {};
		let proto;
		if (this.O_Conf.get("mail_localsend") == 1) {
			if (this.O_Conf.get("mail_sendmail_path") == "") //エラー
				{
					this.O_Out.errorOut(0, "メール送信エラー: sendmailのパスが取得できません\n", 0);
					return process.exit();
				}

			options.sendmail_path = this.O_Conf.get("mail_sendmail_path");
			options.sendmail_args = this.O_Conf.get("mail_sendmail_args");
			proto = "sendmail";
		} else {
			if (this.O_Conf.get("mail_smtp_host") == "" || this.O_Conf.get("mail_smtp_port") == "") //エラー
				{
					this.O_Out.errorOut(0, "メール送信エラー: メール送信サーバーが指定されていません\n", 0);
					return process.exit();
				}

			options.host = this.O_Conf.get("mail_smtp_host");
			options.port = this.O_Conf.get("mail_smtp_port");
			proto = "smtp";
		}

		try {
			this.O_Mail = nodemailer.createTransport(options);
		} catch (err) {
			this.O_Out.errorOut(0, "メール送信エラー:" + err + "\n", 0);
			return process.exit();
	  	}
	}

	setUseReturnPathFlag(flag: boolean) {
		this.m_UseReturnPathFlag = flag;
	}

	async send(to: string, message: string, from = "", subj = "", from_name = "", to_name = "") //ヘッダの生成
	//宛先を成形してヘッダに追加
	//宛先
	//個別ログイン用のURLに変更
	//メッセージの文字コード変換
	//メール送信
	//メールバックアップ
	{
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);

		const mail = {
			from, // 送信元メールアドレス
			to, // 送信先メールアドレス
			subject: subj,
			text: message,
			html: message,
		};
		
		try {
			const result = await this.O_Mail.sendMail(mail);
			this.saveMailLog(mail, message);
			return true;
		} catch (err) {
			this.O_Out.errorOut(0, "メール送信に失敗しました", 0);
			return false;
		}
	}

	async multiSend(A_to:any, message: string, from = "", subj = "", from_name = "") //ヘッダの生成
	//メッセージの文字コード変換
	//宛先リストの生成
	{
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);
		var A_to_list: any = Array();

		for (var i = 0; i < A_to.length; i++) //宛先を成形してヘッダに追加
		//メール送信
		{

			if (A_to[i].to != "") //メールバックアップ
			{
				const mailinfo = {
					from,
					subject : subj,
					to : A_to[i].to,
					text: message,
				}
				await this.mailSend(mailinfo);
				this.saveMailLog(mailinfo, message);
				A_to_list.push(A_to[i].to);
			}
		}

		if (!!this.O_Conf.get("mail_bcc_addr")) //BCC用のメッセージを生成
		//BCC用のToを設定
		//BCC宛にメール送信
		//BCCメールのバックアップ
		{
		}
	}

	async multiSend2(A_to: {} | any[], message: string, from = "", subj = "", from_name = "") //ヘッダの生成
	//メッセージの文字コード変換
	//ヘッダーの作成
	//ヘッダーに追加するぽよ
	//送信を行う
	{		
		message = this.convertPactLoginURL(message);
		message = this.encodeMessage(message);

		const mailinfo = {
			from,
			subject : subj,
			text: message,
			to: ''
		}

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
						//tmp[value.type] += mb_encode_mimeheader(value.name, MtMailUtil.MAIL_ENCODE, "B", "\n") + " <" + value.mail + ">";
					} else {
						tmp[value.type] += value.mail;
					}
				}
		}

		for (var key in tmp) {
			var value = tmp[key];
			//H_headers[key] = value;
		}

		for (var value of Object.values(A_to)) //メール送信
		{
			if (!!value.mail) //メールバックアップ
				{
					mailinfo.to = value.mail;
					await this.mailSend(mailinfo);
					this.saveMailLog(mailinfo, message);
				}
		}
	}

	async mailSend(mailinfo: any) //メール送信フラグを見る
	{
		if (this.SendFlg == 1) {
			try {
				var ret = await this.O_Mail.sendMail(mailinfo);
				if (Array.isArray(mailinfo.to) == true) {
					var msg = mailinfo.to.join(",");
				} else {
					msg = mailinfo.to;
				}
				this.O_Out.infoOut("メール送信実行: " + msg + "\n", 0);
				return true;
			} catch (err) {
				this.O_Out.errorOut(0, "メール送信に失敗しました", 0);
				return false;
			}
		}
	}

	encodeMessage(message: string) //メッセージの文字コード変換
	{
		const iconv = new Iconv(MtMailUtil.MAIL_ENCODE);

		return iconv.convert(message);;
	}

	makeHeaders(from: any = "", from_name: any = "", subj: any = "") //グループ化対応 20090806miya
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
		var H_headers:any = Array();
		return H_headers;
	}

	addPhpSelf(message = "") {
		return message + "\n" + Iconv(this.O_Conf.get("common_encoding"), MtMailUtil.MAIL_ENCODE, "送信プログラム: ") + "\n";
	}

	makeBccMessage(message: string, A_to_list: string) {
		var bccmsg = "\n";
		bccmsg += "=================================================\n";
		bccmsg += Iconv(this.O_Conf.get("common_encoding"), MtMailUtil.MAIL_ENCODE, "送信先一覧");
		bccmsg += "=================================================\n";

		for (var i = 0; i < A_to_list.length; i++) {
			bccmsg += Iconv(this.O_Conf.get("common_encoding"), MtMailUtil.MAIL_ENCODE, A_to_list[i])  + "\n";
		}

		return message + "\n" + bccmsg;
	}

	saveMailLog(H_headers:any, message = "") //ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		if (this.O_Conf.get("mail_save") == 1 || this.O_Conf.get("mail_send") == "") //ディレクトリの存在チェック
			//オープンとロックが出来るまで永久ループ
			//ヘッダの書き込み
			//メッセージの書き込み
			{
				if (fs.existsSync(this.Logdir) == false) {
					this.O_Out.errorOut(0, "メールログディレクトリがありません" + this.Logdir + "\n", 0);
					return false;
				}

				var sendtime = Date.now() / 1000;

				for (var i = 1; ; i++) {
					var fp = fs.createWriteStream(this.Logdir + sendtime + MtMailUtil.DELIMITER + i + MtMailUtil.SUFFIX, "x");
				
					var lock = lockfile.lock(fp);

					if (fp != false && lock == true) {
						break;
					}
				}

				for (var key in H_headers) {
					var val = H_headers[key];
					// fputs(fp, key + ": " + mb_decode_mimeheader(val) + "\n");
				}

				// fputs(fp, mb_convert_encoding(message, this.O_Conf.common_encoding, MtMailUtil.MAIL_ENCODE) + "\n");
				fp.end();
			}
	}

	sendByFlg(to: string, message: string, from = "", subj = "", from_name = "", to_name = "", flg = "error_mail_send") //ヘッダの生成
	//宛先を成形してヘッダに追加
	//宛先
	//メッセージの文字コード変換
	//送信フラグを書き換える
	//メール送信
	//送信フラグを元に戻す
	//メールバックアップ
	{
		message = this.encodeMessage(message);
		const mailinfo = {
			from,
			subject : subj,
			text: message,
			to
		}
		
		this.getSendFlg(flg);
		this.mailSend(mailinfo);
		this.SendFlg = this.O_Conf.get("mail_send");
		this.saveMailLog(mailinfo, message);
	}

	getSendFlg(flg: string) //どのフラグを見て送信を切り替えるかの決定（今のところエラーのみ）
	//送信フラグを書き換える
	{
		var flgtype = this.O_Conf[flg];

		if (flgtype == 1) {
			this.SendFlg = flgtype;
		}
	}

	convertPactLoginURL(message: string) //O_Authがなければ処理しない(batchは未実行)
	{
		return message;
	}
};