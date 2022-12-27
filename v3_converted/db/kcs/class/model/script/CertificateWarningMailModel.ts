//
//証明書期限切れ警告メール
//
//更新履歴：<br>
//2010/06/17 宮澤龍彦 作成
//
//@package CertificateWarningMail
//@subpackage Model
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//
//
//
//価格表お知らせメール
//
//@package CertificateWarningMail
//@subpackage Model
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//

require("model/ModelBase.php");

//
//コンストラクト
//
//@author miyazawa
//@since 2010/06/17
//
//@access public
//@return void
//
//
//
//証明書期限が1ヶ月を切ったものを取得
//
//@author miyazawa
//@since 2010/06/17
//
//@access public
//@return void
//
//
//
//証明書期限切れメール送信先リスト取得
//
//@author miyazawa
//@since 2010/06/17
//
//@param $H_dir
//@param $H_g_sess
//@param $rootpostid
//
//@access public
//@return mixed
//
//
//
//デストラクト　親のを呼ぶだけ
//
//@author miyazawa
//@since 2010/06/17
//
//@access public
//@return void
//
//
class CertificateWarningMailModel extends ModelBase {
	constructor() {
		super();
	}

	getPrsi() {
		var nextmonth = date("Y-m-d", strtotime("+1 month"));
		var sql = "SELECT prsi.pactid, prsi.postid, prsi.shopid, prsi.signeddate, pact.compname, post.postname, shop.name AS shopname, shop.groupid, " + "prsi.idv_signeddate_0, " + "prsi.idv_signeddate_1, " + "prsi.idv_signeddate_2, " + "prsi.idv_signeddate_3, " + "prsi.idv_signeddate_4, " + "prsi.idv_signeddate_5, " + "prsi.idv_signeddate_6, " + "prsi.idv_signeddate_7, " + "prsi.idv_signeddate_8, " + "prsi.idv_signeddate_9 " + "FROM post_rel_shop_info_tb prsi " + "LEFT JOIN pact_tb pact ON prsi.pactid = pact.pactid " + "LEFT JOIN post_tb post ON prsi.postid = post.postid " + "LEFT JOIN shop_tb shop ON prsi.shopid = shop.shopid " + "WHERE " + "(prsi.signeddate IS NOT NULL AND prsi.signeddate < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_0 IS NOT NULL AND prsi.idv_signeddate_0 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_1 IS NOT NULL AND prsi.idv_signeddate_1 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_2 IS NOT NULL AND prsi.idv_signeddate_2 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_3 IS NOT NULL AND prsi.idv_signeddate_3 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_4 IS NOT NULL AND prsi.idv_signeddate_4 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_5 IS NOT NULL AND prsi.idv_signeddate_5 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_6 IS NOT NULL AND prsi.idv_signeddate_6 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_7 IS NOT NULL AND prsi.idv_signeddate_7 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_8 IS NOT NULL AND prsi.idv_signeddate_8 < '" + nextmonth + "') OR" + "(prsi.idv_signeddate_9 IS NOT NULL AND prsi.idv_signeddate_9 < '" + nextmonth + "') ";
		return this.getDB().queryHash(sql);
	}

	getShopAddress(shopid, postid) //メール送信用
	//ショップ管理者
	//KCSだったらルートの担当者/第二階層の担当者
	//HotlineだったらHLの担当者
	//キャリアで区別はしない
	{
		var A_mail = Array();
		var sql = "SELECT mail FROM shop_member_tb WHERE type='SU' AND shopid=" + shopid;
		var shopadminmail = this.get_DB().queryOne(sql);
		sql = "SELECT mail FROM shop_member_tb  WHERE memid IN (SELECT DISTINCT memid FROM shop_relation_tb WHERE shopid=" + shopid + " AND postid=" + postid + ")";
		A_mail = this.get_DB().queryCol(sql);

		if (undefined != shopadminmail) {
			A_mail.push(shopadminmail);
		}

		A_mail = array_unique(A_mail);
		return A_mail;
	}

	__destruct() {
		super.__destruct();
	}

};