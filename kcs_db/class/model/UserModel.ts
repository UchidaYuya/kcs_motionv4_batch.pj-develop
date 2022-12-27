//Userに関するモデル
//@author nakanita
//@since 2008/05/28

import ModelBase from "./ModelBase";
export default class UserModel extends ModelBase {
	m_pactid:number
	m_userid:number
	m_user: any
	constructor(O_db = undefined) {
		super(O_db);
		this.m_pactid = 0;
		this.m_userid = 0;
		this.m_user = undefined;
	}

	getUserList(pactid: number) {
		if (!isNaN(Number(pactid)) == false) {
			this.getOut().errorOut(0, "ShopModel::getUserList() pactidが不正", false);
		}

		var sql = "select po.postid,po.postname,po.userpostid,us.userid,us.username,us.loginid,us.type,pact.userid_ini " + "from post_tb po " + "inner join user_tb us on po.postid = us.postid " + "inner join pact_tb pact on pact.pactid = po.pactid and pact.pactid = us.pactid " + "where us.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " " + "order by us.type,po.userpostid,us.userid";
		return this.getDB().queryHash(sql);
	}

	getUserKeyHash(pactid: number, postid: number, userid = "") {
		var sql = "select userid,username from user_tb " + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and ( postid=" + this.get_DB().dbQuote(postid, "integer", true) + " ";

		if (userid != "") {
			sql += " or userid = " + this.get_DB().dbQuote(userid, "integer", true) + " ";
		}

		sql += " ) ORDER BY userid";
		return this.get_DB().queryAssoc(sql);
	}

	async checkUserExist(userid: number) {
		var sql = "select count(userid) from user_tb" + " where userid=" + this.getDB().dbQuote(userid, "integer", true);
		var res = await this.getDB().queryOne(sql);

		if (res > 0) {
			return true;
		} else {
			return false;
		}
	}

	async initialize(pactid: number, userid: number) //ユーザーテーブル読み込み
	{
		this.m_pactid = 0;
		this.m_userid = 0;
		var sql = "select * from user_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and userid=" + this.get_DB().dbQuote(userid, "integer", true);
		this.m_user = await this.get_DB().queryRowHash(sql);

		if (!(undefined !== this.m_user)) //ユーザーない
			{
				this.m_user = undefined;
				return false;
			}

		this.m_pactid = pactid;
		this.m_userid = userid;
		return true;
	}

	receiveMailFromShop() {
		if (undefined !== this.m_user) {
			return this.m_user.acceptmail5 == 0 ? false : true;
		}

		return true;
	}

	// getColumn(name: ?string = undefined) {
	getColumn(name: string | undefined) {
		if (!name) {
			return this.m_user;
		}

		return this.m_user[name];
	}
};
