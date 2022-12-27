//機能：mail_sender.phpのラッパ
//備考：送り先が違うだけ
//au、SBのエラーメールを管理者に飛ばすために作成した
//
//作成：宮澤

import { G_MAIL_ADMIN, G_MAIL_SUBJECT, G_MAIL_TYPE } from '../../conf/batch_setting';
import { G_MAIL_FROM, G_SMTP_HOST, G_SMTP_PORT } from '../../db_define/define';
import {ScriptCommand} from './lib/script_command';
import { G_PHP } from './lib/script_common';
import { fwrite_conv, G_SCRIPT_ALL, ScriptLogBase } from './lib/script_log';

const Iconv  = require('iconv').Iconv;
export default class ScriptLogMail extends ScriptLogBase {
	m_A_body: any[];
	m_Title: string | undefined;
	constructor(type: number) {
		super(type);
		this.m_A_body = Array();
	}

	putRaw(message: string) {
		this.m_A_body.push(message);
	}

	send() //配列->文字列
	
	{
		if (0 == this.m_A_body.length) return;
		var is_fail = false;

		for (var line of Object.values(this.m_A_body)) {
			if (false !== line.indexOf("正常終了")) continue;
			is_fail = true;
			break;
		}

		let body = this.m_A_body.join("");
		// mb_detect_order("UTF-8");
		const iconv = new Iconv('UTF-8', 'JIS');
		const enc = iconv.convert(body);

		const iconv2 = new Iconv(enc, 'JIS');
		body = iconv2.convert(body);
		var title = is_fail ? "バッチ処理でエラー発生": "バッチ処理正常終了";

		const iconv3 = new Iconv("UTF-8", 'JIS');
		body = iconv3.convert(title + "(" + G_MAIL_TYPE + ")\n\n") + body;
		// var O_mail = Mail.factory("smtp", {
		// 	host: G_SMTP_HOST,
		// 	port: G_SMTP_PORT
		// }); 一旦コメンアウト
		var O_mail
		var H_headers: any = {
			Date: new Date(),
			To: G_MAIL_ADMIN,
			From: G_MAIL_FROM
		};
		H_headers["Return-Path"] = G_MAIL_FROM;
		H_headers["MIME-Version"] = "1.0";
		var subject = G_MAIL_SUBJECT;

		if (!is_fail) //正常終了を付加
			{
				subject += "(正常終了)";
			}

		if (this.m_Title != "") //引数で指定したタイトルを付加 2009/12/10
			{
				subject += this.m_Title;
			}

		// H_headers.Subject = mb_encode_mimeheader(subject, "ISO-2022-JP-MS"); 一旦コメンアウト
		H_headers.Subject = subject;
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var rval = O_mail.send([G_MAIL_ADMIN], H_headers, body);

		if (!rval) {
			fwrite_conv("メール送信失敗\n");
			console.log(rval);
			throw process.exit(1);
		}
	}

};

if (process.argv.length < 2) {
	fwrite_conv("usage: php mail_sender.php [-t=付加タイトル] 実行したいphpファイル [-オプション]\n");
	fwrite_conv("mail_sender.phpと実行したいphpファイルは同じディレクトリ\n");
	throw process.exit(0);
}

const listener = new ScriptLogMail(G_SCRIPT_ALL);
const proc = new ScriptCommand(listener, true);
const A_args = Array();
let cnt = 0;
let exec_php = "";

for (var arg of process.argv) {
	switch (cnt) {
		case 0:
			break;

		default:
			if (exec_php == "") //-t= の場合、メールのタイトルを取得する // 2009/12/10 T.Naka
				{
					if (arg.match("/^-t=/")) {
						listener.m_Title = arg.substr("-t=".length);
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

proc.executeRaw(G_PHP + " " + exec_php, A_args);
listener.send();
throw process.exit(0);
