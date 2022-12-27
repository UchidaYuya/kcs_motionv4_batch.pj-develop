//	メール送信ユーティリティクラス
//
//	作成日：2004/04/08
//	作成者：上杉勝史

import Logger from "./log";
import { KCS_DIR } from "../conf/batch_setting";
const fs = require('fs');
const nodemailer = require('nodemailer');
export default class MailUtil {
	static FNC_PACT_LOGIN = '206';
	def_from:any;
	def_subj:any;
	def_from_name:any;
	def_return_path:any;
	bcc_addr:any;
	O_err:any;
	O_Mail: any;
	MailUtil() //設定ファイルで内部送信を指定した場合
	//メールハンドル作成
	{
		this.def_from = global.def_from;
		this.def_subj = global.def_subj;
		this.def_from_name = global.def_from_name;
		this.def_return_path = global.def_return_path;
		this.bcc_addr = global.bcc_addr;
		this.O_err = Logger.singleton("file", KCS_DIR + "/log/err.log", "", global.GH_logopt);

		const H_param:any = {};
		if (global.localsend == true) {
			if (undefined !== global.sendmail_path == false || undefined !== global.sendmail_args == false) //エラー
				{
					this.O_err.log("メール送信エラー:sendmailのパスが取得できません", 3);
					return false;
				}

			H_param.sendmail_path = global.sendmail_path;
			H_param.sendmail_args = global.sendmail_args;
// 2022cvt_015
			var proto = "sendmail";
		} else {
			if (undefined !== global.smtp_host == false || undefined !== global.smtp_port == false) //エラー
				{
					this.O_err.log("メール送信エラー:メール送信サーバーが指定されていません", 3);
					return false;
				}

			H_param.host = global.smtp_host;
			H_param.port = global.smtp_port;
			proto = "smtp";
		}

		try {
			this.O_Mail = nodemailer.createTransport(H_param);
		} catch (err) {
			return process.exit();
	  	}
	}

	async send(to: string, message: string, from = "", subj = "", from_name = "", to_name = "") //個別ログイン用にURL書換
	//ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		message = this.convertPactLoginURL(message);

		const mail = {
			from, // 送信元メールアドレス
			to, // 送信先メールアドレス
			subject: subj,
			text: message,
			html: message,
		};
		
		try {
			const result = await this.O_Mail.sendMail(mail);
			return true;
		} catch (err) {
			this.O_err.errorOut(0, "メール送信に失敗しました", 0);
			return false;
		}
	}

	async mailSend(mailinfo: any) //メール送信フラグを見る
	{
		try {
			var ret = await this.O_Mail.sendMail(mailinfo);
			if (Array.isArray(mailinfo.to) == true) {
				var msg = mailinfo.to.join(",");
			} else {
				msg = mailinfo.to;
			}
			this.O_err.infoOut("メール送信実行: " + msg + "\n", 0);
			return true;
		} catch (err) {
			this.O_err.errorOut(0, "メール送信に失敗しました", 0);
			return false;
		}
		
	}

	async multiSend(H_to: string | any[], message: string, from = "", subj = "", from_name = "") //個別ログイン用にURL書換
	//ファイル書き出しフラグがオン、またはメール送信フラグがオフならファイルに書き出す
	{
		message = this.convertPactLoginURL(message);
		var A_to_list: any = Array();

		for (var i = 0; i < H_to.length; i++) //宛先を成形してヘッダに追加
		//メール送信
		{

			if (H_to[i].to != "") //メールバックアップ
			{
				const mailinfo = {
					from,
					subject : subj,
					to : H_to[i].to,
					text: message,
				}
				await this.mailSend(mailinfo);
				A_to_list.push(H_to[i].to);
			}
		}
	}

	convertPactLoginURL(message: string) {
		return message;
	}

};
