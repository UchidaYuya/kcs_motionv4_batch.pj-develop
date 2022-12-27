//機能：ホットラインエラーメール送信プロセス
//
//作成：森原

import { G_CLAMP_ENV, G_IS_TRY } from "../../conf/batch_setting";
import { G_LOG, G_LOG_ADMIN_DOCOMO_DB, G_MAIL_BCC, G_MAIL_FROM, G_MAIL_TO, G_SMTP_HOST, G_SMTP_PORT } from "../../db_define/define";
import { ProcessBase } from "./lib/process_base";
import { G_CARRIER_DOCOMO } from "./lib/script_common";
import TableNo, { ScriptDB, ScriptDBAdaptor } from "./lib/script_db";
import { G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "./lib/script_log";

export const G_PROCNAME_SEND_HOTLINE_MAIL = "send_hotline_mail";
export const G_OPENTIME_SEND_HOTLINE_MAIL = "0000,2400";
export const FNCID_PACT_CLAMP = 205;
const Iconv  = require('iconv').Iconv;

export class FunctionSendHotlineMail extends ScriptDBAdaptor {
	m_db_temp: ScriptDB;
	m_A_shop_in: any[];
	m_A_shop_out: any[];
	m_stop_mail: boolean;
	m_stop_bcc: boolean;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, db_temp: ScriptDB, A_shop_in: any[], A_shop_out: any[], stop_mail: boolean, stop_bcc: boolean) {
		super(listener, db, table_no);
		this.m_db_temp = db_temp;
		this.m_A_shop_in = A_shop_in;
		this.m_A_shop_out = A_shop_out;
		this.m_stop_mail = stop_mail;
		this.m_stop_bcc = stop_bcc;
	}

	getShopAllList() {
// 2022cvt_015
		var sql = "select shopid,name,postcode from shop_tb";
		sql += " where 1=1";

		if (this.m_A_shop_in.length) {
			sql += " and shopid in (" + this.m_A_shop_in.join(",") + ")";
		}

		if (this.m_A_shop_out.length) {
			sql += " and shopid not in (" + this.m_A_shop_out.join(",") + ")";
		}

		sql += " order by shopid";
		sql += ";";
		return this.m_db.getHash(sql);
	}

	async executeShop(H_pact_body: {} | any[], H_group: {} | any[], H_shop: any) //手動入力されたクランプIDのある顧客IDを取り出す
	{
		var A_pactid_hand = await this.getHandPactid();
		var H_shop_orig = H_shop;
		H_shop = this.getShopInfo(H_shop);

		if (!H_shop.addr.length) {
			this.putError(G_SCRIPT_WARNING, "メールアドレス見つからず" + H_shop.shopid + ":" + H_shop.name);
			return true;
		}

		var A_body = Array();

		for (var H_pact of H_shop.pact) //顧客のエラーを取り出す
		{
			var H_body: any = this.getPactError(H_pact.pactid, H_pact.pactcode);
			if (!Array.isArray(H_body) || !H_body.length) continue;
			H_body = this.getMemberName(H_body, H_shop.shopid);

			if (-1 !== A_pactid_hand.indexOf(H_pact.pactid)) //手動入力された顧客なら、顧客単位のエラーに追加する
				{
					if (!(undefined !== H_pact_body[H_pact.pactid])) H_pact_body[H_pact.pactid] = Array();
					H_pact_body[H_pact.pactid].push(H_body);
				} else if (H_body.is_hotline) //ホットラインなら、このショップに追加する
				{
					A_body.push(H_body);
				} else //ホットラインでなければ、グループのエラーとして保存する
				{
					var groupid = H_body.groupid;
					if (!groupid.length) continue;
					if (!(undefined !== H_group[groupid])) H_group[groupid] = Array();
					H_group[groupid].push({
						body: H_body,
						shop: H_shop
					});
				}
		}

		if (!A_body.length) return true;
		var A_msg = Array();
		this.addBodyAllHeader(A_msg);
		this.addBodyShopHeader(A_msg, H_shop);

		for (var H_body of Object.values(A_body)) this.addBodyPactError(A_msg, H_body);

		return this.sendMail(A_msg, H_shop.addr, H_shop.shopid);
	}

	executeGroup(H_group: {} | any[]) //全グループの送信先アドレスを取り出す
	{
		var H_addr = this.getAdminAddr();

		for (var groupid in H_group) //メールを送信する
		{
			var A_body_shop = H_group[groupid];
			if (!A_body_shop.length) continue;

			if (!(undefined !== H_addr[groupid])) {
				this.putError(G_SCRIPT_WARNING, "代理店の管理用メールアドレス見つからず" + "/groupid:=" + groupid);
				continue;
			}

			var A_msg = Array();
			this.addBodyAllHeader(A_msg);

			for (var H_body_shop of A_body_shop) {
				var H_body = H_body_shop.body;
				var H_shop = Array();
				if (undefined !== H_body_shop.shop) H_shop = H_body_shop.shop;
				if (H_shop.length) this.addBodyShopHeader(A_msg, H_shop);
				this.addBodyPactError(A_msg, H_body);
			}

			for (var mailaddr of Object.values(H_addr[groupid])) {
				if (!this.sendMail(A_msg, mailaddr, -1)) return false;
			}
		}

		return true;
	}

	executePact(H_pact_body: {} | any[]) //メールアドレスを取り出す
	{
		var H_all_addr = this.getPactAddr();

		for (var pactid in H_pact_body) //管理者メールアドレスに対してループする
		{
			var A_body = H_pact_body[pactid];

			if (!(undefined !== H_all_addr[pactid]) || !Array.isArray(H_all_addr[pactid]) || !H_all_addr[pactid].length) {
				this.putError(G_SCRIPT_WARNING, "ドコモプレミアクラブの情報が手動入力されているが、" + "管理者のメールアドレスが登録されていない" + "/pactid:=" + pactid);
				continue;
			}

			var A_msg = Array();
			this.addBodyAllHeader(A_msg);

			for (var H_body of Object.values(A_body)) {
				this.addBodyPactError(A_msg, H_body);
			}

			for (var addr of Object.values(H_all_addr[pactid])) {
				if (!this.sendMail(A_msg, addr, -1)) return false;
			}
		}

		return true;
	}

	async getHandPactid() {
		const sql = "select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + ";";
		const result = await this.m_db.getAll(sql);
		var A_pactid = Array();

		for (var A_line of result) {
			var pactid = A_line[0];
			if (!pactid.length || isNaN(Number(pactid))) continue;
			A_pactid.push(pactid);
		}

		return A_pactid;
	}

	async getPactAddr() {
		const sql = "select pactid,mail from user_tb" + " where pactid in (" + "select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + " )" + " and type='SU'" + " and mail is not null" + " order by pactid,userid" + ";";
		const result = await this.m_db.getAll(sql);
		const H_addr = Array();

		for (var A_line of result) {
			var pactid = A_line[0];
			var addr = A_line[1];
			if (!addr.length) continue;
			if (!pactid.length || isNaN(Number(pactid))) continue;
			if (!(undefined !== H_addr[pactid])) H_addr[pactid] = Array();
			if (!(-1 !== H_addr[pactid].indexOf(addr))) H_addr[pactid].push(addr);
		}

		return H_addr;
	}

	async getAdminAddr() {
		var sql = "select shop_tb.groupid as groupid" + ",coalesce(shop_member_tb.mail,'') as mail" + " from shop_tb" + " left join shop_member_tb" + " on shop_tb.memid=shop_member_tb.memid" + " where shop_tb.type='A'" + " and coalesce(shop_member_tb.mail,'')!=''" + " order by shop_tb.groupid" + ";";
		var result = await this.m_db.getHash(sql);
		var H_addr = Array();

		for (var H_line of result) {
			var key = H_line.groupid;
			var addr = H_line.mail;
			if (!(undefined !== H_addr[key])) H_addr[key] = Array();
			var is_in = false;

			for (var check of H_addr[key]) if (!check.localeCompare(addr)) is_in = true;

			if (is_in) continue;
			H_addr[key].push(addr);
		}

		return H_addr;
	}

	async getShopInfo(H_shop: any) //shop_tb.memid->shop_member_tb.mailのメールアドレスを取り出す
	{
		var sql = "select mail from shop_tb";
		sql += " left join shop_member_tb";
		sql += " on shop_tb.shopid=shop_member_tb.shopid";
		sql += " and shop_tb.memid=shop_member_tb.memid";
		sql += " and shop_member_tb.type='SU'";
		sql += " where shop_tb.shopid=" + H_shop.shopid;
		sql += ";";
		var result = await this.m_db.getAll(sql);
		var mailaddr = "";
		if (result.length) mailaddr = result[0][0];
		H_shop.addr = mailaddr;
		sql = "select shop_relation_tb.pactid,pact_rel_shop_tb.pactcode";
		sql += " from shop_relation_tb";
		sql += " left join pact_rel_shop_tb";
		sql += " on shop_relation_tb.pactid=pact_rel_shop_tb.pactid";
		sql += " and shop_relation_tb.shopid=pact_rel_shop_tb.shopid";
		sql += " and shop_relation_tb.carid=pact_rel_shop_tb.carid";
		sql += " left join post_relation_tb";
		sql += " on shop_relation_tb.pactid=post_relation_tb.pactid";
		sql += " and shop_relation_tb.postid=post_relation_tb.postidparent";
		sql += " where shop_relation_tb.shopid=" + H_shop.shopid;
		sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
		sql += " and post_relation_tb.level=0";
		sql += ";";
		const result_pact_rel_shop = await this.m_db.getAll(sql);
		H_shop.pact = Array();

		for (var A_pact of result_pact_rel_shop) {
			H_shop.pact.push({
				pactid: A_pact[0],
				pactcode: A_pact[1]
			});
		}

		return H_shop;
	}

	async getPactError(pactid: string, pactcode: string) //この顧客のDB側のエラーメッセージを取り出して、DBからは消す

	{
		var H_error = Array();
		var sql = " from clampdb_error_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += ";";
		var result = await this.m_db.getAll("select message,fixdate " + sql);
		this.putError(G_SCRIPT_SQL, "delete " + sql);
		this.m_db.query("delete " + sql);

		for (var line of result) {
			var message = line[0];
			if (!(undefined !== H_error[message])) H_error[message] = Array();
			H_error[message].push(line[1]);
		}

		sql = " from clampweb_error_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and env=" + G_CLAMP_ENV;
		sql += ";";
		result = await this.m_db_temp.getAll("select message,fixdate " + sql);
		this.putError(G_SCRIPT_SQL, "delete " + sql);
		this.m_db_temp.query("delete " + sql);

		for (var line of result) {
			message = line[0];
			if (!(undefined !== H_error[message])) H_error[message] = Array();
			H_error[message].push(line[1]);
		}

		var A_time_login = Array();
		var A_time_prtelno = Array();

		for (var key in H_error) {
			var A_time = H_error[key];
			if (!A_time.length) continue;
			A_time.sort();
			if (key.localeCompare("login") < 0) A_time_login.push({
				time: A_time
			});
			var pos = key.localeCompare("prtelno");

			if (0 === pos) {
				var A_key = key.split("/");
				if (3 == A_key.length) A_time_prtelno.push({
					time: A_time,
					year: A_key[1],
					month: A_key[2]
				});else A_time_prtelno.push({
					time: A_time
				});
			}
		}

		if (0 == A_time_login.length && 0 == A_time_prtelno.length) return Array();
		var compname = "";
		var postname = "";
		var postid = "";
		var is_hotline = false;
		sql = "select pact_tb.userid_ini,pact_tb.compname,post_tb.postname";
		sql += ",post_tb.postid";
		sql += ",case when coalesce(pact_tb.type,'')='H' then 1" + " else 0 end";
		sql += ",pact_tb.groupid";
		sql += " from pact_tb";
		sql += " left join post_tb";
		sql += " on pact_tb.pactid=post_tb.pactid";
		sql += " left join post_relation_tb as rel_tb";
		sql += " on post_tb.pactid=rel_tb.pactid";
		sql += " and post_tb.postid=rel_tb.postidparent";
		sql += " where pact_tb.pactid=" + pactid;
		sql += " and rel_tb.level=0";
		sql += " limit 1";
		sql += ";";
		result = await this.m_db.getAll(sql);

		if (result.length) {
			var line = result[0];
			if (!pactcode.length) pactcode = line[0];
			compname = line[1];
			postname = line[2];
			postid = line[3];
			is_hotline = line[4];
			var groupid = line[5];
		}

		if (!postid.length) {
			this.putError(G_SCRIPT_WARNING, "トップの部署見つからず" + pactid);
			return Array();
		}

		return {
			pactid: pactid,
			postid: postid,
			groupid: groupid,
			pactcode: pactcode,
			time_login: A_time_login,
			time_prtelno: A_time_prtelno,
			compname: compname,
			postname: postname,
			is_hotline: is_hotline,
			memname: ""
		};
	}

	getMemberName(H_body: any, shopid) {
		if (!H_body.length || !(undefined !== H_body.pactid) || !(undefined !== H_body.postid)) return H_body;
		var sql = "select name from shop_relation_tb";
		sql += " left join shop_member_tb";
		sql += " on shop_member_tb.shopid=shop_relation_tb.shopid";
		sql += " and shop_member_tb.memid=shop_relation_tb.memid";
		sql += " where shop_relation_tb.pactid=" + H_body.pactid;
		sql += " and shop_relation_tb.postid=" + H_body.postid;
		sql += " and shop_relation_tb.shopid=" + shopid;
		sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
		sql += " limit 1";
		sql += ";";
		var result = this.m_db.getAll(sql);
		H_body.memname = result[0][0];
		return H_body;
	}

	addBodyAllHeader(A_msg: any) {
		A_msg.push("ビジネスプレミアクラブ" + " データ自動取り込み処理において、");
		A_msg.push("以下の問題が発生しました。");
		A_msg.push("");
		A_msg.push("NTT DoCoMo ビジネスプレミアクラブ");
		A_msg.push(" (http://www.mydocomo.com/web/houjin/home/index.html)");
	}

	addBodyShopHeader(A_msg: any, H_shop: any) {
		var shopname = "";
		var shoppostcode = "";
		if (undefined !== H_shop.name) shopname = H_shop.name;
		if (undefined !== H_shop.postcode) shoppostcode = H_shop.postcode;
		A_msg.push("");
		A_msg.push("販売店名：" + shopname);
		A_msg.push("販売店部門コード：" + shoppostcode);
	}

	addBodyPactError(A_msg: any, H_body) //ログイン失敗と親番号見つからずで、二回繰り返す
	{
		var H_keys = {
			time_login: "ドコモショップ画面より、" + "正しいID,パスワードを入力し直して下さい。",
			time_prtelno: "契約親電話番号に変更が無いかご確認下さい。"
		};

		for (var key in H_keys) //該当するエラーがなければ何もしない
		{
			var msg = H_keys[key];
			if (!H_body[key].length) continue;
			var A_time = H_body[key];
			var A_ym = Array();
			var time = "";

			for (var H_param of A_time) //年月があれば取り出す
			{
				if (undefined !== H_param.year && H_param.month) {
					A_ym.push([H_param.year, H_param.month]);
				}

				if (H_param.time.length) {
					var tm = H_param.time[H_param.time.length - 1];
					if ("" == time) time = tm;else if (time < tm) time = tm;
				}
			}

			A_msg.push("");
			A_msg.push(msg);
			A_msg.push("最新確認時刻：" + time);
			A_msg.push("顧客コード：" + H_body.pactcode);
			A_msg.push("顧客会社名：" + H_body.compname);
			A_msg.push("顧客部署名：" + H_body.postname);
			A_msg.push("担当者：" + H_body.memname);

			if (A_ym.length) {
				var msg = "";

				for (var A_info of Object.values(A_ym)) {
					if (msg.length) msg += " ";else msg += "問題発生年月：";
					msg += A_info[0] + "年";
					msg += A_info[1] + "月";
				}

				A_msg.push(msg);
			}
		}
	}

	sendMail(A_msg: any, mailaddr, shopid) //try環境ならメールは送信しない
	{
		var A_bcc = G_MAIL_BCC.split(",");
		if (this.m_stop_bcc) A_bcc = Array();
		var subject = "ビジネスプレミアクラブ データ取り込みエラー";

		if (this.m_stop_mail) {
			this.putError(G_SCRIPT_INFO, "メール送信せず" + "/to:=" + mailaddr + "/bcc:=" + A_bcc.join(",") + "/subject:=" + subject);
			// echo("メール送信せず(内容は以下の通り)\nTo:" + mailaddr + "\n" + "Bcc:" + A_bcc.join("/") + "\n");

			// for (var msg of Object.values(A_msg)) echo(msg + "\n");

			return true;
		}

		if (G_IS_TRY) //try環境ではエラーメールは内部用にのみ送信する
			{
				A_msg.push("");
				A_msg.push("TRY環境であったので外部には送信されませんでした。");
				A_msg.push("本番環境であれば以下のメールアドレスに送信されます。");
				A_msg.push(mailaddr);
				mailaddr = G_MAIL_TO;
				A_bcc = Array();
				subject = "(try)" + subject;
			}

		var from = G_MAIL_FROM;
		// var O_mail = Mail.factory("smtp", {
		// 	host: G_SMTP_HOST,
		// 	port: G_SMTP_PORT
		// }); 一旦コメンアウト
		var O_mail
		var msg = A_msg.join("\n");
		const iconv = new Iconv('JIS', 'UTF-8');
		msg = iconv.convert(msg);
		var H_headers: any = {
			Date: new Date(),
			To: mailaddr,
			From: from
		};
		if (A_bcc.length) H_headers.Bcc = A_bcc.join(",");
		H_headers["Return-Path"] = from;
		H_headers["MIME-Version"] = "1.0";
		// H_headers.Subject = mb_encode_mimeheader(subject, "ISO-2022-JP-MS"); 一旦コメンアウト
		H_headers.Subject = subject;
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var A_send_to = [mailaddr];

		for (var bcc of Object.values(A_bcc)) A_send_to.push(bcc);

		var rval = O_mail.send(A_send_to, H_headers, msg);

		if (!rval) {
			this.putError(G_SCRIPT_WARNING, "メール送信できず" + mailaddr);
			return false;
		}

		this.putError(G_SCRIPT_INFO, "メール送信完了" + shopid);
		return true;
	}

};
export class ProcessSendHotlineMail extends ProcessBase {
	m_db_temp: ScriptDB;
	m_A_shop_in: any[];
	m_A_shop_out: any[];
	m_stop_mail: boolean;
	m_stop_bcc: boolean;
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);

		if (global.G_dsn != global.G_dsn_temp) {
			this.m_db_temp = new ScriptDB(this.m_listener, global.G_dsn_temp);
		} else this.m_db_temp = this.m_db

		this.m_args.addSetting({
			s: {
				type: "string"
			},
			S: {
				type: "string"
			},
			x: {
				type: "int"
			},
			X: {
				type: "int"
			}
		});
		this.m_A_shop_in = Array();
		this.m_A_shop_out = Array();
		this.m_stop_mail = false;
		this.m_stop_bcc = false;
	}

	getProcname() {
		return "ホットラインエラーメール送信プロセス";
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "s":
				this.m_A_shop_in = args.value.split(",");
				break;

			case "S":
				this.m_A_shop_out = args.value.split(",");
				break;

			case "x":
				this.m_stop_mail = args.value;
				break;

			case "X":
				this.m_stop_bcc = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		const rval = super.getUsage();
		rval.push(["-s=shop_id[,shop_id ... ]", "処理するショップID(すべて)"]);
		rval.push(["-S=shop_id[,shop_id ... ]", "処理しないショップID(すべて)"]);
		rval.push(["-x={0|1}", "メール送信を行わないなら1(0)"]);
		rval.push(["-X={0|1}", "BCCを付けないなら1(0)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "処理するショップID:";
		if (this.m_A_shop_in.length) rval += this.m_A_shop_in.join(",");else rval += "すべて";
		rval += "\n";
		rval += "除外するショップID:";
		if (this.m_A_shop_out.length) rval += this.m_A_shop_out.join(",");else rval += "無し";
		rval += "\n";
		rval += "メール送信" + (this.m_stop_mail ? "しない" : "する") + "\n";
		rval += "BCC追加" + (this.m_stop_bcc ? "しない" : "する") + "\n";
		return rval;
	}

	beginDB() {
		this.m_db.begin();
		if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	async do_execute_c() //送信機能インスタンスを作成する
	{
		var O_func = new FunctionSendHotlineMail(this.m_listener, this.m_db, this.m_table_no, this.m_db_temp, this.m_A_shop_in, this.m_A_shop_out, this.m_stop_mail, this.m_stop_bcc);
		var A_shop = await O_func.getShopAllList();
		var H_group = Array();
		var H_pact_body = Array();

		for (var H_shop of Object.values(A_shop)) {
			if (!this.beginDB()) return false;
			var status = await O_func.executeShop(H_pact_body, H_group, H_shop);
			if (!this.endDB(status)) return false;
			if (!status) return false;
		}

		if (!this.beginDB()) return false;
		status = O_func.executeGroup(H_group);

		if (status) {
			status = O_func.executePact(H_pact_body);
		}

		if (!this.endDB(status)) return false;
		return status;
	}

};

var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessSendHotlineMail(G_PROCNAME_SEND_HOTLINE_MAIL, log, G_OPENTIME_SEND_HOTLINE_MAIL);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
