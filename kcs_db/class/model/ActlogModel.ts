//ユーザーの行動履歴を記録する

import { KCS_DIR } from "../../conf/batch_setting";
import MtExcept from "../MtExcept";
import MtSession from "../MtSession";
import ModelBase from "./ModelBase";

const fs = require("fs");
export default class ActlogModel extends ModelBase {
	static O_Instance: ActlogModel;
	A_ExceptDirs!: any[];

	constructor() {
		super();
		this.getExceptDirs();
	}

	static singleton() //まだインスタンスが生成されていなければ
	{
		if (this.O_Instance == undefined) {
			this.O_Instance = new ActlogModel();
		}

		return this.O_Instance;
	}

	getExceptDirs() {
		var exfname = KCS_DIR + "/conf/actlog_except.txt";

		if (false == fs.existsSync(exfname)) {
			MtExcept.raise("Actlog除外ファイル" + exfname + "が読み取れません.");
		}

		var exfile = fs.createReadStream(exfname, "r");

		if (exfile == false) {
			MtExcept.raise("Actlog除外ファイル" + exfile + "のオープン失敗.");
		}

		this.A_ExceptDirs = Array();
		var line = fs.createReadStream(exfile);
		while (line != undefined) {
			// if (feof(exfile)) {
			// 	break;
			// }

			line = line.trim();

			if (line == "") {
				continue;
			}

			if (line.match("/^#/")) //行頭の # はコメント
				{
					continue;
				}

			line = "/" + line.replace(/\//g, "\\/") + "/";
			this.A_ExceptDirs.push(line);
		}

		exfile.end();
	}

	setActlog(memo: string, phpself: string, sessflag = false, forced = true) //強制書き込みoffの場合
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of this.A_ExceptDirs) {
					if (phpself.match(reg)) {
						return;
					}
				}
			}

		var sess: any = MtSession.singleton();

		if (!sess.pactid || sess.pactid == "") //$this->getOut()->debugOut("setActlog:ログインセッションが無い");
			{
				return;
			}

		if (!sess.postid || sess.postid == "") {
			return;
		}

		if (!sess.userid || sess.userid == "") {
			return;
		}

		if (sessflag == true) {
			var sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		var now_time = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
		var sql = "insert into actlog_tb(recdate, pactid, postid, userid, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.pactid + "," + sess.postid + "," + sess.userid + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string") + ")";
		return this.get_DB().exec(sql);
	}

	setShopActlog(memo: string, phpself: string, sessflag = false, forced = true) //強制書き込みoffの場合
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of this.A_ExceptDirs) {
					if (phpself.match(reg)) {
						return;
					}
				}
			}

		var sess: any = MtSession.singleton();

		if (!sess.groupid || sess.groupid == "") //$this->getOut()->debugOut("setShopActlog:ログインセッションが無い");
			{
				return;
			}

		if (!sess.shopid || sess.shopid == "") {
			return;
		}

		if (!sess.memid || sess.memid == "") {
			return;
		}

		if (sessflag == true) {
			var sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		var now_time = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
		var sql = "insert into shop_actlog_tb(recdate, groupid, shopid, memid, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.groupid + "," + sess.shopid + "," + sess.memid + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string")  + ")";
		return this.get_DB().exec(sql);
	}

	setAdminActlog(memo: string, phpself: string, sessflag = false, forced = true) //強制書き込みoffの場合
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of this.A_ExceptDirs) {
					if (phpself.match(reg)) {
						return;
					}
				}
			}

		var sess = MtSession.singleton();

		if (!sess.admin_groupid || sess.admin_groupid == "") //$this->getOut()->debugOut("setShopActlog:ログインセッションが無い");
			{
				return;
			}

		if (!sess.admin_shopid || sess.admin_shopid == "") {
			return;
		}
		let sess_serial;
		if (sessflag == true) {
			sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		const now_time = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
		const sql = "insert into admin_actlog_tb(recdate, groupid, shopid, personname, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.admin_groupid + "," + sess.admin_shopid + "," + this.get_DB().dbQuote(sess.admin_personname, "string") + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string") + ")";
		return this.get_DB().exec(sql);
	}
};
