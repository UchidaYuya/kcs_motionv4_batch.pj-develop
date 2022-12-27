//価格表お知らせメール


import ModelBase from '../ModelBase';

export default class PriceMailModel extends ModelBase {
	constructor() {
		super();
	}

	getPactlistOfPricetype(pricetype: string) {
		const sql = "SELECT " + "pact_tb.pactid, pact_tb.groupid " + "FROM " + "pact_tb " + "INNER JOIN " + "fnc_relation_tb ON pact_tb.pactid = fnc_relation_tb.pactid " + "INNER JOIN " + "function_tb ON fnc_relation_tb.fncid = function_tb.fncid " + "WHERE " + "function_tb.ininame = " + this.getDB().dbQuote(pricetype, "text", true) + "GROUP BY " + "pact_tb.pactid, pact_tb.groupid " + "ORDER BY " + "pact_tb.pactid";
		return this.getDB().queryHash(sql);
	}

	async getUserlistInThisPact(pactid: number, H_mail: any[]) {
		const sql = "SELECT " + "user_tb.userid, user_tb.mail, pact_tb.groupid, user_tb.username, pact_tb.type, pact_tb.pactid, pact_tb.userid_ini " + "FROM " + "user_tb " + "INNER JOIN " + "pact_tb ON user_tb.pactid = pact_tb.pactid " + "WHERE " + "user_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "user_tb.mail IS NOT NULL AND " + "user_tb.mail != '' AND " + "user_tb.acceptmail3 = 1";
		const AH_temp = await this.getDB().queryHash(sql);
		const count_temp = AH_temp.length;

		for (let cnt = 0; cnt < count_temp; cnt++) {
			H_mail[AH_temp[cnt].userid] = Array();
			H_mail[AH_temp[cnt].userid].userid = AH_temp[cnt].userid;
			H_mail[AH_temp[cnt].userid].username = AH_temp[cnt].username;
			H_mail[AH_temp[cnt].userid].mail = AH_temp[cnt].mail;
			H_mail[AH_temp[cnt].userid].groupid = AH_temp[cnt].groupid;
			H_mail[AH_temp[cnt].userid].type = AH_temp[cnt].type;
			H_mail[AH_temp[cnt].userid].pactid = AH_temp[cnt].pactid;
			H_mail[AH_temp[cnt].userid].userid_ini = AH_temp[cnt].userid_ini;
		}
	}

	async getUserlistInThisPost(postid: number, H_mail: any[]) {
		const sql = "SELECT " + "user_tb.userid, user_tb.mail, pact_tb.groupid, user_tb.username, pact_tb.type, pact_tb.pactid, pact_tb.userid_ini " + "FROM " + "user_tb " + "INNER JOIN " + "pact_tb ON user_tb.pactid = pact_tb.pactid " + "WHERE " + "user_tb.postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND " + "user_tb.mail IS NOT NULL AND " + "user_tb.mail != '' AND " + "user_tb.acceptmail3 = 1";
		const AH_temp = await this.getDB().queryHash(sql);
		const count_temp = AH_temp.length;

		for (let cnt = 0; cnt < count_temp; cnt++) {
			H_mail[AH_temp[cnt].userid] = Array();
			H_mail[AH_temp[cnt].userid].userid = AH_temp[cnt].userid;
			H_mail[AH_temp[cnt].userid].username = AH_temp[cnt].username;
			H_mail[AH_temp[cnt].userid].mail = AH_temp[cnt].mail;
			H_mail[AH_temp[cnt].userid].groupid = AH_temp[cnt].groupid;
			H_mail[AH_temp[cnt].userid].type = AH_temp[cnt].type;
			H_mail[AH_temp[cnt].userid].pactid = AH_temp[cnt].pactid;
			H_mail[AH_temp[cnt].userid].userid_ini = AH_temp[cnt].userid_ini;
		}
	}

	checkDisPricelist(A_pricelist: any) {
		var sql = "SELECT " + "pricelistid " + "FROM " + "pricelist_tb " + "WHERE " + "datefrom <= " + this.getDB().dbQuote(this.getDB().getToday(), "date", true) + " AND " + "dateto >= " + this.getDB().dbQuote(this.getDB().getToday(), "date", true) + " AND " + "mailstatus = 1 AND " + "pricelistid NOT IN ( " + A_pricelist.join(",") + ") ";
		return this.getDB().queryRowHash(sql);
	}

	async updateMailStatus(A_pricelist: any, status: number) {
		A_pricelist = A_pricelist.filter(function (value: string, index: number, self: string) {return self.indexOf(value) === index;});
		const sql = "UPDATE " + "pricelist_tb " + "SET " + "mailstatus = " + this.getDB().dbQuote(status, "integer", true) + " " + "WHERE " + "pricelistid IN ( " + A_pricelist.join(",") + ") ";
		this.getDB().beginTransaction();
		const res = await this.getDB().exec(sql);

		if (res > 0) {
			this.getDB().commit();
		} else {
			this.getDB().rollback();
		}
	}

};
