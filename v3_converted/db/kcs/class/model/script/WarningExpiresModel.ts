//
//販売店お客様情報
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
//販売店お客様情報
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
//getWarningExpireCorpList
//
//@author ishizaki
//@since 2008/08/22
//
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
class WarningExpiresModel extends ModelBase {
	constructor() {
		super();
	}

	getWarningExpireCorpList() {
		var select_sql = "SELECT " + "pact_tb.compname, " + "post_tb.postname, " + "post_rel_shop_info_tb.signeddate, " + "shop_member_tb.mail, " + "post_relation_tb.level, " + "shop_tb.groupid " + "FROM " + "post_rel_shop_info_tb " + "INNER JOIN " + "pact_tb ON pact_tb.pactid = post_rel_shop_info_tb.pactid " + "INNER JOIN " + "post_tb ON post_tb.postid = post_rel_shop_info_tb.postid " + "INNER JOIN " + "post_relation_tb ON post_relation_tb.postidchild = post_tb.postid " + "INNER JOIN " + "shop_tb ON shop_tb.shopid = post_rel_shop_info_tb.shopid " + "INNER JOIN " + "shop_member_tb ON shop_member_tb.shopid = post_rel_shop_info_tb.shopid AND shop_member_tb.memid = shop_tb.memid " + "WHERE " + "post_rel_shop_info_tb.signeddate <= CURRENT_TIMESTAMP + '1 MONTH' AND " + "post_relation_tb.level <= 1 " + "ORDER BY " + "post_rel_shop_info_tb.pactid, post_rel_shop_info_tb.postid, post_rel_shop_info_tb.shopid";
		return this.getDB().queryHash(select_sql);
	}

	__destruct() {
		super.__destruct();
	}

};