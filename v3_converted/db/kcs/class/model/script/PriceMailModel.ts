//
//価格表お知らせメール
//
//更新履歴：<br>
//2008/08/20 石崎 作成
//
//@package Shop
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/20
//
//
//
//価格表お知らせメール
//
//@package Shop
//@subpackage Model
//@author ishizaki
//@since 2008/08/20
//

require("model/ModelBase.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/03/07
//
//@access public
//@return void
//
//
//getPactlistOfPricetype
//
//@author ishizaki
//@since 2008/12/10
//
//@param String $pricetype
//@access public
//@return void
//
//
//getUserlistInThisPact
//
//@author ishizaki
//@since 2008/12/11
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getUserlistInThisPost
//
//@author ishizaki
//@since 2008/12/12
//
//@param mixed $postid
//@param mixed $H_mail
//@access public
//@return void
//
//
//公開中かつメール送信フラグ有りなのにも関わらずメール送信先が無い価格表
//
//@author ishizaki
//@since 2008/12/12
//
//@param mixed $A_pricelist
//@access public
//@return void
//
//
//メールステータスの更新
//
//@author ishizaki
//@since 2008/12/12
//
//@param mixed $A_pricelist
//@param mixed $status
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class PriceMailModel extends ModelBase {
	constructor() {
		super();
	}

	getPactlistOfPricetype(pricetype) {
		var sql = "SELECT " + "pact_tb.pactid, pact_tb.groupid " + "FROM " + "pact_tb " + "INNER JOIN " + "fnc_relation_tb ON pact_tb.pactid = fnc_relation_tb.pactid " + "INNER JOIN " + "function_tb ON fnc_relation_tb.fncid = function_tb.fncid " + "WHERE " + "function_tb.ininame = " + this.getDB().dbQuote(pricetype, "text", true) + "GROUP BY " + "pact_tb.pactid, pact_tb.groupid " + "ORDER BY " + "pact_tb.pactid";
		return this.getDB().queryHash(sql);
	}

	getUserlistInThisPact(pactid, H_mail) {
		var sql = "SELECT " + "user_tb.userid, user_tb.mail, pact_tb.groupid, user_tb.username, pact_tb.type, pact_tb.pactid, pact_tb.userid_ini " + "FROM " + "user_tb " + "INNER JOIN " + "pact_tb ON user_tb.pactid = pact_tb.pactid " + "WHERE " + "user_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "user_tb.mail IS NOT NULL AND " + "user_tb.mail != '' AND " + "user_tb.acceptmail3 = 1";
		var AH_temp = this.getDB().queryHash(sql);
		var count_temp = AH_temp.length;

		for (var cnt = 0; cnt < count_temp; cnt++) {
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

	getUserlistInThisPost(postid, H_mail) {
		var sql = "SELECT " + "user_tb.userid, user_tb.mail, pact_tb.groupid, user_tb.username, pact_tb.type, pact_tb.pactid, pact_tb.userid_ini " + "FROM " + "user_tb " + "INNER JOIN " + "pact_tb ON user_tb.pactid = pact_tb.pactid " + "WHERE " + "user_tb.postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND " + "user_tb.mail IS NOT NULL AND " + "user_tb.mail != '' AND " + "user_tb.acceptmail3 = 1";
		var AH_temp = this.getDB().queryHash(sql);
		var count_temp = AH_temp.length;

		for (var cnt = 0; cnt < count_temp; cnt++) {
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

	checkDisPricelist(A_pricelist) {
		var sql = "SELECT " + "pricelistid " + "FROM " + "pricelist_tb " + "WHERE " + "datefrom <= " + this.getDB().dbQuote(this.getDB().getToday(), "date", true) + " AND " + "dateto >= " + this.getDB().dbQuote(this.getDB().getToday(), "date", true) + " AND " + "mailstatus = 1 AND " + "pricelistid NOT IN ( " + A_pricelist.join(",") + ") ";
		return this.getDB().queryRowHash(sql);
	}

	updateMailStatus(A_pricelist, status) {
		A_pricelist = array_unique(A_pricelist);
		var count_pricelist = A_pricelist.length;
		var sql = "UPDATE " + "pricelist_tb " + "SET " + "mailstatus = " + this.getDB().dbQuote(status, "integer", true) + " " + "WHERE " + "pricelistid IN ( " + A_pricelist.join(",") + ") ";
		this.getDB().beginTransaction();
		var res = this.getDB().exec(sql);

		if (res > 0) {
			this.getDB().commit();
		} else {
			this.getDB().rollback();
		}
	}

	__destruct() {
		super.__destruct();
	}

};