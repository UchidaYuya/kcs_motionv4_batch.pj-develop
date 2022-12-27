//
//お問い合わせの基底モデル
//
//更新履歴
//2008/08/27	石崎公久	作成
//
//@uses ModelBase
//@uses PostModel
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//お問い合わせの基底モデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("model/ModelBase.php");

require("model/PostModel.php");

//
//コンストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//getFAQListAtShop
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $fncid
//@param mixed $groupid
//@access public
//@return void
//
//
//getFAQlist
//
//部署単位での引き抜きには未対応：引数は用意しておく
//
//@author ishizaki
//@since 2008/09/04
//
//@param mixed $fncid
//@access public
//@return void
//
//
//getFncidExcludePathNull
//
//@author ishizaki
//@since 2008/11/18
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//insertNewFAQ
//
//@author ishizaki
//@since 2008/10/27
//
//@param mixed $faqid
//@param mixed $H_Post
//@param mixed $shopid
//@param mixed $memid
//@param mixed $groupid
//@param mixed $shopname
//@param mixed $loginname
//@access public
//@return void
//
//
//deleteFAQRelation
//
//@author ishizaki
//@since 2008/10/28
//
//@param mixed $faqid
//@access public
//@return void
//
//
//insertNewFAQRelation
//
//@author ishizaki
//@since 2008/10/28
//
//@param mixed $faqid
//@param mixed $pactid
//@param mixed $postid
//@param mixed $groupid
//@access public
//@return void
//
//
//chengeFnc
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@param mixed $fnc
//@access public
//@return void
//
//
//changeStatus
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@param mixed $status
//@access public
//@return void
//
//
//changePubliclevel
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@param mixed $publiclevel
//@access public
//@return void
//
//
//getInquiryParam
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@access public
//@return void
//
//
//getAbleCariaToMyShop
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $shopid
//@access public
//@return void
//
//
//添付ファイルのパスを取得
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@param mixed $pactid
//@param mixed $groupid
//@access public
//@return void
//
//
//getAttachmentName
//
//@author ishizaki
//@since 2008/10/23
//
//@param mixed $id
//@param mixed $pactid
//@param mixed $groupid
//@access public
//@return void
//
//
//getShopAttachment
//
//@author ishizaki
//@since 2008/11/07
//
//@param mixed $id
//@param mixed $groupid
//@access public
//@return void
//
//
//getAdminAttachment
//
//@author ishizaki
//@since 2008/11/10
//
//@param mixed $id
//@param mixed $groupid
//@access public
//@return void
//
//
//getFncFromInquiry
//
//@author ishizaki
//@since 2008/10/28
//
//@param mixed $inquiryid
//@access public
//@return void
//
//
//setFncName
//
//@author ishizaki
//@since 2008/10/29
//
//@param mixed $A_fncid
//@access public
//@return void
//
//
//getInquiryDetail
//
//@author ishizaki
//@since 2008/10/20
//
//@param mixed $id
//@param mixed $H_param
//@access public
//@return void
//
//
//getInquiryDetailLine
//
//@author ishizaki
//@since 2008/10/21
//
//@param mixed $detailid
//@param mixed $H_param
//@access public
//@return void
//
//
//FAQの詳細を表示
//
//@author ishizaki
//@since 2008/10/19
//
//@param mixed $id
//@access public
//@return void
//
//
//getFAQTarget
//
//@author ishizaki
//@since 2008/11/18
//
//@param mixed $id
//@param mixed $H_param
//@access public
//@return void
//
//
//getFAQAttchment
//
//@author ishizaki
//@since 2008/11/06
//
//@param mixed $id
//@param mixed $H_param
//@access public
//@return void
//
//
//getShopFAQAttchment
//
//@author ishizaki
//@since 2008/11/07
//
//@param mixed $id
//@param mixed $groupid
//@access public
//@return void
//
//
//getAdminFAQAttchment
//
//@author ishizaki
//@since 2008/11/10
//
//@param mixed $id
//@param mixed $groupid
//@access public
//@return void
//
//
//会社権限のfncidリストを受け取りキャリア注文権限だけ抜き出してハッシュで返す
//
//@author ishizaki
//@since 2008/08/28
//
//@param mixed $A_auth 顧客IDの権限一覧
//@param mixed $A_car 部署に割り当てられているキャリアリスト
//@access public
//@return void
//
//
//FAQ & お問い合わせ一覧を抜く
//
//$H_paramの渡し方に注意。必須のパラメータが足りない時はfalseを返却します。<br>
//authtype : 1.ユーザ 2.ショップ 3.管理者<br>
//groupid : ここが0の場合は、グローバル管理者扱いで全てのお問い合わせが対象となります。FAQは自分が作成した物のみ<br>
//pactid : ユーザのみ必須
//postid : ユーザのみ必須
//secondflag : ユーザの時のみ確認し TRUE の時は第二階層権限扱い
//
//@author ishizaki
//@since 2008/10/10
//
//@param mixed $H_param
//@access public
//@return void
//
//
//getInquiryListParam
//
//@author ishizaki
//@since 2008/10/28
//
//@param mixed $id
//@param mixed $H_param
//@access public
//@return void
//
//
//お問い合わせの最終更新日を更新（ディテールを更新したときについでに掛けるのが主な使い方）
//
//@author ishizaki
//@since 2008/10/29
//
//@param mixed $id
//@access public
//@return void
//
//
//新規お問い合わせ
//
//@author ishizaki
//@since 2008/09/11
//
//@access public
//@param mixed $inquiryid
//@param mixed $fncid
//@param mixed $H_Post
//@param mixed $pactid
//@param mixed $userid
//@param mixed $groupid
//@access public
//@return void
//
//
//insertNewInquiryDetail
//
//@author ishizaki
//@since 2008/10/07
//
//@param mixed $inquiryid
//@param mixed $H_Post
//@param mixed $userid
//@param mixed $shopid
//@param mixed $groupid
//@access public
//@return void
//
//
//editInquiry
//
//@author ishizaki
//@since 2008/10/21
//
//@param mixed $detailid
//@param mixed $H_Post
//@access public
//@return void
//
//
//引数に渡されたグループIDの管理者のメールアドレスを取得
//
//@author ishizaki
//@since 2008/11/03
//
//@param mixed $groupid
//@param mixed $type trueだとグループID 0の管理者のメールアドレスも返す(array)
//@access public
//@return void
//
//
//returnCarrierFncid
//
//@author ishizaki
//@since 2008/11/03
//
//@access public
//@return void
//
//
//returnShopFnc
//
//@author ishizaki
//@since 2008/11/03
//
//@access public
//@return void
//
//
//getShopMail
//
//@author ishizaki
//@since 2008/11/03
//
//@param mixed $postid
//@param mixed $fncid
//@access public
//@return void
//
//
//_unique
//
//@author
//@since 2010/10/20
//
//@param mixed $array
//@access protected
//@return void
//
//
//getNormalShopmember
//
//@author
//@since 2010/10/20
//
//@param mixed $postid
//@param mixed $fncid
//@access public
//@return void
//
//
//getSuperShopmember
//
//@author
//@since 2010/10/20
//
//@param mixed $postid
//@param mixed $fncid
//@access public
//@return void
//
//
//getShopmemidMail
//
//@author ishizaki
//@since 2008/11/11
//
//@param mixed $memid
//@access public
//@return void
//
//
//returnFncid
//
//@author ishizaki
//@since 2008/11/03
//
//@param mixed $id
//@access public
//@return void
//
//
//getInquiryOwnerMail
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $id
//@access public
//@return void
//
//
//deleteFAQ
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $fid
//@access public
//@return void
//
//
//updateFAQ
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $H_Post
//@param mixed $shopid
//@param mixed $memid
//@param mixed $groupid
//@param mixed $shopname
//@param mixed $loginname
//@access public
//@return void
//
//
//getFunctionList
//
//@author ishizaki
//@since 2008/10/30
//
//@access public
//@return void
//
//
//getOrderCar
//
//@author ishizaki
//@since 2008/11/04
//
//@access public
//@return void
//
//
//getPactHash
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $groupid
//@access public
//@return void
//
//
//getUsermail
//
//@author ishizaki
//@since 2008/11/11
//
//@param mixed $userid
//@access public
//@return void
//
//
//getSecondRoot
//
//@author ishizaki
//@since 2008/11/12
//
//@param mixed $userid
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
class FAQModel extends ModelBase {
	static FILENAME = "model/FAQModel";
	static LIMIT = 30;

	constructor() {
		super();
		this.getSetting().loadConfig("faq");
		this.getSetting().loadConfig("H_fnc_car");
	}

	getFAQListAtGroupid(fncid, groupid) {
		var groupid_sql = "";

		if (groupid !== 0) {
			groupid_sql = " AND faq_tb.groupid IN (0, " + this.getDB().dbQuote(groupid, "integer", true) + ") ";
		}

		var sql = "SELECT " + "faq_tb.faqid, " + "faq_tb.faqname, " + "faq_tb.fixdate, " + "faq_tb.note " + "FROM " + "faq_tb " + "WHERE " + "faq_tb.fncid = " + this.getDB().dbQuote(fncid, "integer", true) + " AND " + "faq_tb.delflg = FALSE " + groupid_sql + "ORDER BY faq_tb.note DESC, faq_tb.fixdate DESC";
		return this.getDB().queryHash(sql);
	}

	getFAQlist(fncid, groupid, pactid, H_car_shop = undefined, post = undefined) {
		var add_sql = "";
		this.getOut().debugOut(FAQModel.FILENAME + "::getFAQlist(" + fncid + ")", false);
		var sql = "SELECT " + "faq_tb.faqid, " + "faq_tb.faqname, " + "faq_tb.fixdate, " + "faq_tb.note " + "FROM " + "faq_tb " + "WHERE " + "faq_tb.fncid = " + this.getDB().dbQuote(fncid, "integer", true) + " AND " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = TRUE AND " + "faq_tb.groupid IN(0, " + this.getDB().dbQuote(groupid, "integer", true) + ") " + "UNION " + "SELECT " + "faq_tb.faqid, " + "faq_tb.faqname, " + "faq_tb.fixdate, " + "faq_tb.note " + "FROM " + "faq_tb " + "INNER JOIN " + "faq_rel_pact_tb ON faq_tb.faqid = faq_rel_pact_tb.faqid " + "WHERE " + "faq_tb.fncid = " + this.getDB().dbQuote(fncid, "integer", true) + " AND " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = FALSE AND " + "faq_tb.groupid IN(0, " + this.getDB().dbQuote(groupid, "integer", true) + ") AND " + "faq_rel_pact_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + "ORDER BY note DESC, fixdate DESC";
		this.getOut().debugOut(FAQModel.FILENAME + "::getFAQlist():sql->" + sql + "", false);
		return this.getDB().queryHash(sql);
	}

	getFncidExcludePathNull(A_auth) {
		var sql = "SELECT " + "fncid " + "FROM " + "function_tb " + "WHERE " + "fncid IN (" + A_auth.join(",") + ") AND path IS NOT NULL order by show_order, fncid";
		return this.getDB().queryCol(sql);
	}

	insertNewFAQ(faqid, H_Post, shopid, memid, groupid, shopname, loginname) {
		var attachment = undefined;

		if (false == is_null(H_Post.attachment) || "" != H_Post.attachment) {
			attachment = H_Post.attachment;
		}

		var attachmentname = undefined;

		if (false == is_null(H_Post.attachmentname) || "" != H_Post.attachmentname) {
			attachmentname = H_Post.attachmentname;
		}

		var defaultflg = false;

		if ("0" === H_Post.publictype) {
			defaultflg = true;
		}

		var sql = "INSERT INTO faq_tb VALUES (" + this.getDB().dbQuote(faqid, "integer", true) + ", " + this.getDB().dbQuote(stripslashes(H_Post.title), "text", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(H_Post.fnc, "integer", true) + ", " + this.getDB().dbQuote(stripslashes(H_Post.question), "text", true) + ", " + this.getDB().dbQuote(stripslashes(H_Post.answer), "text", true) + ", " + this.getDB().dbQuote(attachment, "text", true) + ", " + this.getDB().dbQuote(attachmentname, "text", true) + ", " + this.getDB().dbQuote(H_Post.note, "integer", true) + ", " + this.getDB().dbQuote(shopid, "integer", true) + ", " + this.getDB().dbQuote(groupid, "integer", true) + ", " + "FALSE, " + this.getDB().dbQuote(loginname, "text", true) + ", " + this.getDB().dbQuote(memid, "integer", true) + ", " + this.getDB().dbQuote(shopname, "text", true) + ", " + this.getDB().dbQuote(defaultflg, "boolean", true) + ", " + this.getDB().dbQuote(memid, "integer", true) + ", " + this.getDB().dbQuote(shopid, "integer", true) + ") ";
		return this.getDB().exec(sql);
	}

	deleteFAQRelation(faqid) {
		var sql = "DELETE FROM faq_rel_pact_tb WHERE faqid = " + this.getDB().dbQuote(faqid, "integer", true);
		return this.getDB().exec(sql);
	}

	insertNewFAQRelation(faqid, pactid, postid, groupid) {
		var sql = "INSERT INTO " + "faq_rel_pact_tb " + "VALUES(" + this.getDB().dbQuote(faqid, "integer", true) + ", " + this.getDB().dbQuote(pactid, "integer", true) + ", " + this.getDB().dbQuote(postid, "integer", true) + ", " + this.getDB().dbQuote(groupid, "integer", true) + ")";
		return this.getDB().exec(sql);
	}

	changeFnc(id, fnc) {
		var sql = "UPDATE " + "inquiry_tb " + "SET " + "fncid = " + this.getDB().dbQuote(fnc, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "WHERE " + "inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		this.getDB().exec(sql);
	}

	changeStatus(id, status) {
		var sql = "UPDATE " + "inquiry_tb " + "SET " + "inquirystatus = " + this.getDB().dbQuote(status, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "WHERE " + "inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		this.getDB().exec(sql);
	}

	changePubliclevel(id, publiclevel) {
		var sql = "UPDATE " + "inquiry_tb " + "SET " + "publiclevel = " + this.getDB().dbQuote(publiclevel, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "WHERE " + "inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		this.getDB().exec(sql);
	}

	getInquiryParam(id) {
		var sql = "SELECT " + "inquiry_tb.pactid, " + "inquiry_tb.userid, " + "inquiry_tb.inquirystatus, " + "post_tb.postid, " + "inquiry_tb.fncid, " + "inquiry_tb.publiclevel, " + "inquiry_tb.inquirystatus " + "FROM " + "inquiry_tb " + "LEFT JOIN " + "user_tb ON user_tb.userid = inquiry_tb.userid " + "LEFT JOIN " + "post_tb ON user_tb.postid = post_tb.postid " + "WHERE " + "inquiry_tb.inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getAbleCariaToMyShop(pactid, postid, shopid) {
		var sql = "SELECT " + "carid " + "FROM " + "shop_relation_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND " + "shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		return this.getDB().queryCol(sql);
	}

	getAttachmentFIlepath(id, pactid, groupid) {
		var sql = "SELECT " + "inquiry_detail_tb.attachment " + "FROM " + "inquiry_detail_tb " + "INNER JOIN " + "inquiry_tb ON inquiry_tb.inquiryid = inquiry_detail_tb.inquiryid " + "WHERE " + "inquiry_detail_tb.inquiry_detailid = " + this.getDB().dbQuote(id, "integer", true) + " AND " + "inquiry_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "inquiry_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getAttachmentName(id, pactid, groupid) {
		var sql = "SELECT " + "inquiry_detail_tb.attachmentname " + "FROM " + "inquiry_detail_tb " + "INNER JOIN " + "inquiry_tb ON inquiry_tb.inquiryid = inquiry_detail_tb.inquiryid " + "WHERE " + "inquiry_detail_tb.inquiry_detailid = " + this.getDB().dbQuote(id, "integer", true) + " AND " + "inquiry_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "inquiry_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getShopAttachment(id, groupid) {
		var sql = "SELECT " + "inquiry_detail_tb.attachment, inquiry_detail_tb.attachmentname " + "FROM " + "inquiry_detail_tb " + "INNER JOIN " + "inquiry_tb ON inquiry_tb.inquiryid = inquiry_detail_tb.inquiryid " + "WHERE " + "inquiry_detail_tb.inquiry_detailid = " + this.getDB().dbQuote(id, "integer", true) + " AND " + "inquiry_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getAdminAttachment(id, groupid) {
		var where = "";

		if (0 != groupid) {
			where = " AND " + "inquiry_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true);
		}

		var sql = "SELECT " + "inquiry_detail_tb.attachment, inquiry_detail_tb.attachmentname " + "FROM " + "inquiry_detail_tb " + "INNER JOIN " + "inquiry_tb ON inquiry_tb.inquiryid = inquiry_detail_tb.inquiryid " + "WHERE " + "inquiry_detail_tb.inquiry_detailid = " + this.getDB().dbQuote(id, "integer", true) + where;
		return this.getDB().queryRowHash(sql);
	}

	getFncFromInquiry(inquiryid) {
		var sql = "SELECT fncid FROM inquiry_tb WHERE inquiryid = " + this.getDB().dbQuote(inquiryid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	setFncName(A_fncid) {
		var sql = "SELECT fncid, fncname FROM function_tb WHERE fncid IN(" + A_fncid.join(",") + ") ORDER BY fncid";
		var H_tmp = this.getDB().queryAssoc(sql);
		H_tmp["0"] = "\u305D\u306E\u4ED6";
		return H_tmp;
	}

	getInquiryDetail(id, H_param = undefined) {
		var sql = "SELECT " + "inquiry_detail_tb.inquiry_detailid, " + "inquiry_detail_tb.inquiryid, " + "inquiry_tb.inquirystatus, " + "inquiry_detail_tb.inquiryname, " + "inquiry_detail_tb.authtype, " + "inquiry_detail_tb.contents, " + "inquiry_detail_tb.userid, " + "inquiry_detail_tb.groupid, " + "user_tb.username, " + "post_tb.postname, " + "inquiry_detail_tb.shopid, " + "inquiry_detail_tb.memid, " + "shop_tb.name AS shopname, " + "shop_member_tb.name AS memname, " + "inquiry_detail_tb.anonymous, " + "inquiry_detail_tb.viewid, " + "inquiry_detail_tb.attachment, " + "inquiry_detail_tb.attachmentname " + "FROM " + "inquiry_detail_tb " + "INNER JOIN " + "inquiry_tb ON inquiry_tb.inquiryid = inquiry_detail_tb.inquiryid " + "LEFT JOIN " + "user_tb ON inquiry_detail_tb.userid = user_tb.userid " + "LEFT JOIN " + "post_tb ON user_tb.postid = post_tb.postid " + "LEFT JOIN " + "shop_tb ON inquiry_detail_tb.shopid = shop_tb.shopid " + "LEFT JOIN " + "shop_member_tb ON shop_member_tb.memid = inquiry_detail_tb.memid " + "WHERE " + "inquiry_detail_tb.inquiryid = " + this.getDB().dbQuote(id, "integer", true) + " " + "ORDER BY " + "inquiry_detail_tb.viewid";
		var AH_data = this.getDB().queryHash(sql);
		var cnt_data = AH_data.length;

		if (1 > cnt_data) {
			return false;
		}

		for (var i = 0; i < cnt_data; i++) {
			if (1 == H_param.authtype) {
				if ((true === H_param.su || AH_data[i].userid == H_param.userid) && AH_data[i].authtype == 1) {
					AH_data[i].edit = true;
				}

				if (false === H_param.su && H_param.userid != AH_data[i].userid && true == AH_data[i].anonymous) {
					AH_data[i].authname = "";
					AH_data[i].postname = "";
				} else {
					if (1 == AH_data[i].authtype) {
						AH_data[i].authname = AH_data[i].username;
						AH_data[i].postname = AH_data[i].postname;
					} else if (2 == AH_data[i].authtype) {
						AH_data[i].authname = AH_data[i].memname;
						AH_data[i].postname = AH_data[i].shopname;
					} else {
						AH_data[i].authname = AH_data[i].shopname;
						AH_data[i].postname = "";
					}
				}
			} else if (2 == H_param.authtype) {
				if (AH_data[i].authtype != 3) {
					AH_data[i].edit = true;
				}
			} else if (3 == H_param.authtype) //groupid 0でないなら、groupid 0の書き込みは編集出来ない
				{
					if (0 != H_param.groupid) {
						if (0 != AH_data[i].groupid) {
							AH_data[i].edit = true;
						}
					} else {
						AH_data[i].edit = true;
					}
				}
		}

		return AH_data;
	}

	getInquiryDetailLine(detailid, H_param) {
		var sql = "SELECT " + "inquiry_detail_tb.inquiry_detailid, " + "inquiry_detail_tb.inquiryid, " + "inquiry_detail_tb.inquiryname, " + "inquiry_detail_tb.attachment, " + "inquiry_detail_tb.attachmentname, " + "inquiry_detail_tb.authtype, " + "inquiry_detail_tb.contents, " + "inquiry_detail_tb.anonymous " + "FROM " + "inquiry_detail_tb " + "WHERE " + "inquiry_detail_tb.inquiry_detailid = " + this.getDB().dbQuote(detailid, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getFAQDetail(id, H_param) {
		var sql = "SELECT " + "faq_tb.faqid, " + "faq_tb.faqname, " + "faq_tb.recdate, " + "faq_tb.fixdate, " + "faq_tb.fncid, " + "faq_tb.question, " + "faq_tb.answer, " + "faq_tb.attachment, " + "faq_tb.attachmentname, " + "faq_tb.note, " + "faq_tb.shopid, " + "faq_tb.groupid, " + "faq_tb.authname, " + "faq_tb.memid, " + "sshm.name AS memname, " + "ssh.name AS shopname, " + "eshm.name AS lastmemname, " + "esh.name AS lastshopname, " + "faq_tb.authpostname, " + "function_tb.fncname, " + "faq_tb.defaultflg " + "FROM " + "faq_tb " + "LEFT JOIN " + "shop_member_tb sshm ON faq_tb.memid = sshm.memid " + "LEFT JOIN " + "shop_member_tb eshm ON faq_tb.lastmemid = eshm.memid " + "LEFT JOIN " + "shop_tb ssh ON faq_tb.shopid = ssh.shopid " + "LEFT JOIN " + "shop_tb esh ON faq_tb.shopid = esh.shopid " + "LEFT JOIN " + "function_tb ON faq_tb.fncid = function_tb.fncid " + "WHERE " + "faq_tb.faqid = " + this.getDB().dbQuote(id, "integer", true) + " " + "AND " + "faq_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

	getFAQTarget(id, H_param) {
		var sql = "SELECT " + "pact_tb.compname " + "FROM " + "faq_rel_pact_tb " + "INNER JOIN " + "pact_tb ON faq_rel_pact_tb.pactid = pact_tb.pactid " + "WHERE " + "faq_rel_pact_tb.faqid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryHash(sql);
	}

	getFAQAttchment(id, pactid, groupid) {
		var sql = "SELECT " + "faq_tb.attachment, faq_tb.attachmentname " + "FROM " + "faq_tb " + "LEFT JOIN " + "faq_rel_pact_tb ON faq_tb.faqid = faq_rel_pact_tb.faqid " + "WHERE " + "(faq_tb.defaultflg = TRUE OR " + "(faq_tb.defaultflg = FALSE AND faq_rel_pact_tb.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + ")" + ") AND " + "faq_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "faq_tb.faqid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getShopFAQAttchment(id, groupid) {
		var sql = "SELECT " + "faq_tb.attachment, faq_tb.attachmentname " + "FROM " + "faq_tb " + "WHERE " + "faq_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "faq_tb.faqid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getAdminFAQAttchment(id, groupid) {
		var where = "";

		if (0 != groupid) {
			where = " AND " + "faq_tb.faqid = " + this.getDB().dbQuote(id, "integer", true);
		}

		var sql = "SELECT " + "faq_tb.attachment, faq_tb.attachmentname " + "FROM " + "faq_tb " + "WHERE " + "faq_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + where;
		return this.getDB().queryRowHash(sql);
	}

	getOrderable(A_auth, A_car, version = 1) {
		this.getOut().debugOut(FAQModel.FILENAME + "::getOrderable(" + fncid + ")", false);
		var H_auth = Array();

		if (1 == version) {
			if (true == (-1 !== A_auth.indexOf(26)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["26"]))) {
				H_auth["26"] = {
					fncid: 26,
					fncname: "docomo"
				};
			}

			if (true == (-1 !== A_auth.indexOf(27)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["27"]))) {
				H_auth["27"] = {
					fncid: 27,
					fncname: "au"
				};
			}

			if (true == (-1 !== A_auth.indexOf(28)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["28"]))) {
				H_auth["28"] = {
					fncid: 28,
					fncname: "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF"
				};
			}

			if (true == (-1 !== A_auth.indexOf(85)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["85"]))) {
				H_auth["85"] = {
					fncid: 85,
					fncname: "Y!mobile(\u65E7EMOBILE)"
				};
			}

			if (true == (-1 !== A_auth.indexOf(39)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["39"]))) {
				H_auth["39"] = {
					fncid: 39,
					fncname: "Y!mobile(\u65E7WILLCOM)"
				};
			}

			if (true == (-1 !== A_auth.indexOf(138)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["138"]))) {
				H_auth["138"] = {
					fncid: 138,
					fncname: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
				};
			}

			if (1 > H_auth.length) {
				return false;
			}
		} else if (2 == version) {
			if (true == (-1 !== A_auth.indexOf(26)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["26"]))) {
				H_auth["26"] = "docomo";
			}

			if (true == (-1 !== A_auth.indexOf(27)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["27"]))) {
				H_auth["27"] = "au";
			}

			if (true == (-1 !== A_auth.indexOf(28)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["28"]))) {
				H_auth["28"] = "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF";
			}

			if (true == (-1 !== A_auth.indexOf(85)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["85"]))) {
				H_auth["85"] = "Y!mobile(\u65E7EMOBILE)";
			}

			if (true == (-1 !== A_auth.indexOf(39)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["39"]))) {
				H_auth["39"] = "Y!mobile(\u65E7WILLCOM)";
			}

			if (true == (-1 !== A_auth.indexOf(138)) && true == (-1 !== A_car.indexOf(+this.getSetting().H_fnc_car["138"]))) {
				H_auth["138"] = "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3";
			}

			if (1 > H_auth.length) {
				return false;
			}
		}

		return H_auth;
	}

	getInquiryList(H_param) //where句
	//件数を取得
	//一件もなかったら
	{
		this.getOut().debugOutEx(FAQModel.FILENAME + "::getInquiryList(H_param)", false);
		this.getOut().debugOutEx(H_param, false);
		var inquiry_where_sql = "";
		var faq_rel_where_sql = "";
		var faq_where_sql = "";
		var A_not_faq = Array();
		var fnc_sql = "";
		var last_where = "";
		var offset = (H_param.nowpage - 1) * FAQModel.LIMIT;

		if (1 == H_param.authtype) //ユーザパターン：必須パラメータチェック
			//公開レベルによる絞り込みの制御
			{
				if (false == (undefined !== H_param.groupid) || "" == H_param.groupid) {
					return false;
				} else if (false == (undefined !== H_param.pactid) || "" == H_param.pactid) {
					return false;
				} else if (false == (undefined !== H_param.postid) || "" == H_param.postid) {
					return false;
				} else if (false == (undefined !== H_param.userid) || "" == H_param.userid) {
					return false;
				}

				inquiry_where_sql = "AND inquiry_tb.pactid = " + this.getDB().dbQuote(H_param.pactid, "integer", true) + " " + "AND inquiry_tb.fncid IN (" + H_param.fncidlist.join(",") + ") ";
				faq_rel_where_sql = " AND faq_rel_pact_tb.pactid =" + this.getDB().dbQuote(H_param.pactid, "integer", true) + " ";
				faq_where_sql = "AND faq_tb.fncid IN (" + H_param.fncidlist.join(",") + ") ";

				if (false === H_param.su) //SUでない場合は、公開レベルの絞り込みが必要な可能性がある
					//第二部署権限があるか
					{
						if (false === H_param.secondroot) //SUでなく第二部署権限もない場合は、自分の書き込みか公開の書き込みのみ
							{
								inquiry_where_sql += " AND (inquiry_tb.publiclevel = 0 OR inquiry_tb.userid = " + this.getDB().dbQuote(H_param.userid, "integer", true) + ") ";
							} else //第二部署権限がある企業の本当のルート部署（Level0）
							{
								if (false === H_param.rootpostid) {
									inquiry_where_sql += "AND ( inquiry_tb.publiclevel = 0 OR inquiry_tb.userid = " + this.getDB().dbQuote(H_param.userid, "integer", true) + ") ";
								} else //第二部署にいる場合はその階層以下からのお問い合わせが全て観れる（第二ルート）
									{
										if (H_param.rootpostid == H_param.postid) {
											var O_post = new PostModel();
											var A_postid = O_post.getChildList(H_param.pactid, H_param.postid);
											inquiry_where_sql += "AND ( inquiry_tb.publiclevel = 0 OR post_tb.postid IN( " + A_postid.join(", ") + ")) ";
										} else {
											inquiry_where_sql += "AND ( inquiry_tb.publiclevel = 0 OR inquiry_tb.userid = " + this.getDB().dbQuote(H_param.userid, "integer", true) + ") ";
										}
									}
							}
					}
			} else if (2 == H_param.authtype) {
			inquiry_where_sql += " AND inquiry_tb.fncid in(" + H_param.fnc.join(", ") + ") AND inquiry_tb.pactid in(select pactid from shop_relation_tb where shopid = " + this.getDB().dbQuote(H_param.shopid, "integer", true) + " group by pactid) ";
			faq_where_sql += " AND faq_tb.shopid = " + this.getDB().dbQuote(H_param.shopid, "integer", true) + " " + " AND faq_tb.fncid in(" + H_param.fnc.join(", ") + ") ";
		}

		if ("" != H_param.search.searchtext) {
			var x = "SELECT inquiryid FROM inquiry_detail_tb WHERE inquiryname like '%" + H_param.search.searchtext + "%' OR contents like '%" + H_param.search.searchtext + "%'";
			var A_inquiryid = this.getDB().queryCol(x);
			x = "SELECT faqid FROM faq_tb WHERE faqname like '%" + H_param.search.searchtext + "%' OR question like '%" + H_param.search.searchtext + "%' OR answer like '%" + H_param.search.searchtext + "%'";
			var A_faqid = this.getDB().queryCol(x);

			if (1 > A_faqid.length && 1 > A_inquiryid.length) {
				return Array();
			}

			if (0 < A_inquiryid.length) {
				inquiry_where_sql += " AND inquiry_tb.inquiryid in (" + A_inquiryid.join(",") + ") ";
			} else {
				inquiry_where_sql += " AND inquiry_tb.inquiryid in (-1) ";
			}

			if (0 < A_faqid.length) {
				faq_where_sql += " AND faq_tb.faqid in (" + A_faqid.join(",") + ") ";
			} else {
				faq_where_sql += " AND faq_tb.faqid in (-1) ";
			}
		}

		if ("" != H_param.search.kubun) {
			if ("" != last_where) {
				last_where += " AND ";
			} else {
				last_where = " WHERE ";
			}

			last_where += " fncid = " + this.getDB().dbQuote(H_param.search.kubun, "integer", true) + " ";
		}

		if ("" != H_param.search.status) {
			if ("" != last_where) {
				last_where += " AND ";
			} else {
				last_where = " WHERE ";
			}

			last_where += " status = " + this.getDB().dbQuote(H_param.search.status, "integer", true) + " ";
		} else {
			if (false === (undefined !== H_param.search)) {
				if ("" != last_where) {
					last_where += " AND ";
				} else {
					last_where = " WHERE ";
				}

				last_where += " status = 0 ";
			}
		}

		var datefrom = "";

		if ("" != H_param.search.datefrom.Y && "" != H_param.search.datefrom.m && "" != H_param.search.datefrom.d) {
			datefrom = H_param.search.datefrom.Y + "-" + H_param.search.datefrom.m + "-" + H_param.search.datefrom.d;
		}

		var dateto = "";

		if ("" != H_param.search.dateto.Y && "" != H_param.search.dateto.m && "" != H_param.search.dateto.d) {
			dateto = H_param.search.dateto.Y + "-" + H_param.search.dateto.m + "-" + H_param.search.dateto.d;
		}

		if ("" != datefrom || "" != dateto) {
			if ("" == datefrom) {
				datefrom = "1900-01-01";
			}

			if ("" == dateto) {
				dateto = "9999-12-31 23:59:59";
			} else {
				dateto += " 23:59:59";
			}

			if ("" != last_where) {
				last_where += " AND ";
			} else {
				last_where = " WHERE ";
			}

			last_where += "fixdate BETWEEN '" + datefrom + "' AND '" + dateto + "' ";
		}

		if ("" != H_param.search.compname) {
			x = "SELECT pactid FROM pact_tb WHERE compname like '%" + H_param.search.compname + "%'";

			if (0 != H_param.groupid) {
				x += " AND groupid = " + this.getDB().dbQuote(H_param.groupid, "integer", true);
			}

			var A_pactlist = this.getDB().queryCol(x);

			if (1 > A_pactlist.length) {
				return Array();
			}

			if ("" != last_where) {
				last_where += " AND ";
			} else {
				last_where = " WHERE ";
			}

			last_where += "pactid IN(" + A_pactlist.join(",") + ")";
		}

		if (3 === H_param.authtype && 0 === H_param.groupid) {
			var inquiry_groupid = "";
			var faq_groupid = "";
		} else {
			inquiry_groupid = "AND inquiry_tb.groupid in (0, " + this.getDB().dbQuote(H_param.groupid, "integer", true) + ") ";
			faq_groupid = " AND faq_tb.groupid in (0, " + this.getDB().dbQuote(H_param.groupid, "integer", true) + ") ";
		}

		var sql = "SELECT count(*) FROM " + " (SELECT " + "inquiry_tb.fncid AS fncid, " + "inquiry_tb.pactid AS pactid, " + "NULL AS title, " + "inquiry_tb.inquiryid AS id, " + "inquiry_tb.userid AS authuserid, " + "pact_tb.compname AS compname, " + "inquiry_tb.publiclevel AS publiclevel, " + "NULL AS shopid, " + "inquiry_tb.fixdate AS fixdate, " + "inquiry_tb.inquirystatus AS status " + "FROM " + "inquiry_tb " + "INNER JOIN " + "pact_tb ON pact_tb.pactid = inquiry_tb.pactid " + "LEFT JOIN " + "user_tb ON user_tb.pactid = inquiry_tb.pactid AND user_tb.userid = inquiry_tb.userid " + "LEFT JOIN " + "post_tb ON post_tb.pactid = user_tb.pactid AND post_tb.postid = user_tb.postid " + "WHERE " + "inquiry_tb.delflg = false " + inquiry_groupid + inquiry_where_sql + inquiry_fnc_sql + "UNION " + "SELECT " + "faq_tb.fncid AS fncid, " + "NULL AS pactid, " + "faq_tb.faqname AS title, " + "faq_tb.faqid AS id, " + "NULL AS authuserid, " + "NULL AS compname, " + "1 AS publiclevel, " + "faq_tb.shopid AS shopid, " + "faq_tb.fixdate AS fixdate, " + "100 AS status " + "FROM " + "faq_tb " + "LEFT JOIN " + "shop_member_tb ON faq_tb.memid = shop_member_tb.memid " + "LEFT JOIN " + "shop_tb ON shop_tb.shopid = faq_tb.shopid " + "WHERE " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = TRUE " + faq_groupid + faq_where_sql + "UNION " + "SELECT " + "faq_tb.fncid AS fncid, " + "NULL AS pactid, " + "faq_tb.faqname AS title, " + "faq_tb.faqid AS id, " + "NULL AS authuserid, " + "NULL AS compname, " + "1 AS publiclevel, " + "faq_tb.shopid AS shopid, " + "faq_tb.fixdate AS fixdate, " + "100 AS status " + "FROM " + "faq_tb " + "LEFT JOIN " + "shop_member_tb ON faq_tb.memid = shop_member_tb.memid " + "LEFT JOIN " + "shop_tb ON shop_tb.shopid = faq_tb.shopid " + "INNER JOIN " + "faq_rel_pact_tb ON faq_tb.faqid = faq_rel_pact_tb.faqid " + "WHERE " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = FALSE " + faq_groupid + faq_where_sql + faq_rel_where_sql + ") AS ABCDE " + last_where;
		var max_count = this.getDB().queryOne(sql);

		if (1 > max_count) {
			return Array();
		} else {
			while (true) {
				if (offset > max_count) {
					offset -= FAQModel.LIMIT;
					H_param.nowpage--;
				} else {
					break;
				}
			}
		}

		sql = "SELECT fncid, pactid, title, id, userid, compname, shoppername, adminname, shoppertype, publiclevel, shopid, groupid, fixdate, status FROM " + " (SELECT " + "inquiry_tb.fncid AS fncid, " + "inquiry_tb.pactid AS pactid, " + "NULL AS title, " + "inquiry_tb.inquiryid AS id, " + "inquiry_tb.userid AS userid, " + "pact_tb.compname AS compname, " + "NULL AS shoppername, " + "NULL AS adminname, " + "NULL AS shoppertype, " + "inquiry_tb.publiclevel AS publiclevel, " + "NULL AS shopid, " + "inquiry_tb.groupid AS groupid, " + "inquiry_tb.fixdate AS fixdate, " + "inquiry_tb.inquirystatus AS status " + "FROM " + "inquiry_tb " + "INNER JOIN " + "pact_tb ON pact_tb.pactid = inquiry_tb.pactid " + "LEFT JOIN " + "user_tb ON user_tb.pactid = inquiry_tb.pactid AND user_tb.userid = inquiry_tb.userid " + "LEFT JOIN " + "post_tb ON post_tb.pactid = user_tb.pactid AND post_tb.postid = user_tb.postid " + "WHERE " + "inquiry_tb.delflg = false " + inquiry_groupid + inquiry_where_sql + inquiry_fnc_sql + "UNION " + "SELECT " + "faq_tb.fncid AS fncid, " + "NULL AS pactid, " + "faq_tb.faqname AS title, " + "faq_tb.faqid AS id, " + "NULL AS userid, " + "NULL AS compname, " + "shop_member_tb.name AS shoppername, " + "shop_tb.name AS adminname, " + "shop_tb.type AS shoppertype, " + "1 AS publiclevel, " + "faq_tb.shopid AS shopid, " + "faq_tb.groupid AS groupid, " + "faq_tb.fixdate AS fixdate, " + "100 AS status " + "FROM " + "faq_tb " + "LEFT JOIN " + "shop_member_tb ON faq_tb.memid = shop_member_tb.memid " + "LEFT JOIN " + "shop_tb ON shop_tb.shopid = faq_tb.shopid " + "WHERE " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = TRUE " + faq_groupid + faq_where_sql + "UNION " + "SELECT " + "faq_tb.fncid AS fncid, " + "NULL AS pactid, " + "faq_tb.faqname AS title, " + "faq_tb.faqid AS id, " + "NULL AS userid, " + "NULL AS compname, " + "shop_member_tb.name AS shoppername, " + "shop_tb.name AS adminname, " + "shop_tb.type AS shoppertype, " + "1 AS publiclevel, " + "faq_tb.shopid AS shopid, " + "faq_tb.groupid AS groupid, " + "faq_tb.fixdate AS fixdate, " + "100 AS status " + "FROM " + "faq_tb " + "LEFT JOIN " + "shop_member_tb ON faq_tb.memid = shop_member_tb.memid " + "LEFT JOIN " + "shop_tb ON shop_tb.shopid = faq_tb.shopid " + "INNER JOIN " + "faq_rel_pact_tb ON faq_tb.faqid = faq_rel_pact_tb.faqid " + "WHERE " + "faq_tb.delflg = FALSE AND " + "faq_tb.defaultflg = FALSE " + faq_groupid + faq_where_sql + faq_rel_where_sql + ") AS ABCDE " + last_where + " ORDER BY status,fixdate DESC OFFSET " + this.getDB().dbQuote(offset, "integer", true) + " LIMIT " + FAQModel.LIMIT;
		this.getOut().debugOutEx(FAQModel.FILENAME + "::getInquiryList()" + sql, false);
		var H_tmp = this.getDB().queryHash(sql);
		var tmp_count = H_tmp.length;

		if (1 > tmp_count) {
			return Array();
		}

		sql = "SELECT fncid, fncname FROM function_tb";
		var H_fnc = this.getDB().queryAssoc(sql);
		var H_return = Array();
		var A_fnction = Array();

		for (var value of Object.values(H_tmp)) //IDの査定
		//FAQ、お問い合わせの元々のID
		{
			if (value.status == 100) {
				var id = "FAQ" + value.id;
			} else {
				id = value.id;
			}

			H_return[id] = Array();
			H_return[id].fid = value.id;
			H_return[id].id = id;

			if (0 == value.fncid) {
				H_return[id].kubun = "\u305D\u306E\u4ED6";
			} else {
				H_return[id].kubun = H_fnc[value.fncid];
			}

			H_return[id].compname = value.compname;
			H_return[id].fixdate = value.fixdate;

			if (100 == value.status) //販売店は自分のショップのFAQを編集削除できる
				{
					if ("A" == value.shoppertype) {
						H_return[id].title = value.title;
						H_return[id].postname = undefined;
						H_return[id].authname = value.adminname;
					} else {
						H_return[id].title = value.title;
						H_return[id].postname = value.adminname;
						H_return[id].authname = value.shoppername;
					}

					if (2 == H_param.authtype) {
						if (H_param.shopid == value.shopid) {
							H_return[id].edit = true;
						}
					}

					if (3 == H_param.authtype) {
						if (0 != H_param.groupid) {
							if (0 != value.groupid) {
								H_return[id].edit = true;
							}
						} else {
							H_return[id].edit = true;
						}
					}
				} else {
				var H_inquiry = this.getInquiryListParam(value.id, H_param);
				H_return[id].title = H_inquiry.title;
				H_return[id].postname = H_inquiry.postname;
				H_return[id].authname = H_inquiry.authname;
			}

			H_return[id].status = value.status;
		}

		H_return.max_count = max_count;
		H_return.nowpage = H_param.nowpage;
		return H_return;
	}

	getInquiryListParam(id, H_param) {
		var sql = "SELECT " + "inquiry_detail_tb.inquiryname AS title, " + "post_tb.postname AS postname, " + "user_tb.username AS username, " + "shop_member_tb.name AS shoppername, " + "shop_tb.name AS adminname, " + "inquiry_detail_tb.authtype AS authtype, " + "inquiry_detail_tb.anonymous AS anonymous, " + "inquiry_detail_tb.userid AS userid, " + "post_tb.postid AS postid " + "FROM " + "inquiry_detail_tb " + "LEFT JOIN " + "user_tb ON inquiry_detail_tb.userid = user_tb.userid " + "LEFT JOIN " + "post_tb ON user_tb.postid = post_tb.postid " + "LEFT JOIN " + "shop_member_tb ON inquiry_detail_tb.memid = shop_member_tb.memid " + "LEFT JOIN " + "shop_tb on shop_tb.shopid = inquiry_detail_tb.shopid " + "WHERE " + "inquiry_detail_tb.inquiryid = " + this.getDB().dbQuote(id, "integer", true) + " " + "ORDER BY inquiry_detail_tb.inquiry_detailid";
		var H_temp = this.getDB().queryHash(sql);
		var count_tmp = H_temp.length;

		if (1 > count_tmp) {
			return false;
		}

		if (true == H_param.secondroot && H_param.rootpostid == H_param.postid) {
			var O_post = new PostModel();
			var A_postid = O_post.getChildList(H_param.pactid, H_param.postid);
		}

		var H_inq = Array();

		for (var i = 0; i < count_tmp; i++) //匿名あつかい
		{
			if (true == H_temp[i].anonymous) //SUではない
				{
					if (false == H_param.su && 1 == H_param.authtype) //第二なし
						{
							if (false == H_param.secondroot) //書き込み主と自分が違う
								{
									if (H_param.userid != H_temp[i].userid) //NULLの場合はユーザが削除されている場合なのでNULLのまま
										{
											H_temp[i].postname = "";

											if (false === is_null(H_temp[i].username)) {
												H_temp[i].username = "";
											}
										}
								} else //第二ルートユーザではない
								{
									if (H_param.rootpostid != H_param.postid) //自分の書いた書き込みではない
										{
											if (H_param.userid != H_temp[i].userid) //NULLの場合はユーザが削除されている場合なのでNULLのまま
												{
													H_temp[i].postname = "";

													if (false === is_null(H_temp[i].username)) {
														H_temp[i].username = "";
													}
												}
										} else {
										if (false == (-1 !== A_postid.indexOf(H_temp[i].postid)) && false == is_null(H_temp[i].postid)) //NULLの場合はユーザが削除されている場合なのでNULLのまま
											{
												H_temp[i].postname = "";

												if (false === is_null(H_temp[i].username)) {
													H_temp[i].username = "";
												}
											}
									}
								}
						}
				}

			if (false == (undefined !== H_inq.title)) {
				H_inq.title = H_temp[i].title;

				if (1 == H_temp[i].authtype) {
					if (true === is_null(H_temp[i].username)) {
						H_inq.authname = "\u203B\u3053\u306E\u30E6\u30FC\u30B6\u306F\u524A\u9664\u3055\u308C\u307E\u3057\u305F";
					} else {
						H_inq.authname = H_temp[i].username;
					}

					H_inq.postname = H_temp[i].postname;
				} else if (2 == H_temp[i].authtype) {
					H_inq.postname = H_temp[i].adminname;
					H_inq.authname = H_temp[i].shoppername;
				} else if (3 == H_temp[i].authtype) {
					H_inq.postname = "";
					H_inq.authname = H_temp[i].adminname;
				}
			} else {
				H_inq.title += "\n" + H_temp[i].title;

				if (1 == H_temp[i].authtype) {
					H_inq.postname += "\n" + H_temp[i].postname;
					H_inq.authname += "\n" + H_temp[i].username;
				} else if (2 == H_temp[i].authtype) {
					H_inq.postname += "\n" + H_temp[i].adminname;
					H_inq.authname += "\n" + H_temp[i].shoppername;
				} else if (3 == H_temp[i].authtype) {
					H_inq.postname += "\n";
					H_inq.authname += "\n" + H_temp[i].adminname;
				}
			}
		}

		return H_inq;
	}

	updateInquiryFixdate(id) {
		var sql = "UPDATE " + "inquiry_tb " + "SET " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " " + "WHERE " + "inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().exec(sql);
	}

	insertNewInquiry(inquiryid, fncid, H_Post, pactid, userid, groupid) {
		this.getOut().debugOut("model/FAQModel::insertNewInquiry(" + inquiryid + ", " + fncid + ", " + H_Post + ", " + pactid + ", " + userid + ", " + groupid + ")", false);
		this.getOut().debugOutEx(H_Post, false);
		var sql = "INSERT INTO inquiry_tb (" + "inquiryid, " + "recdate, " + "fixdate, " + "fncid, " + "publiclevel, " + "inquirystatus, " + "pactid, " + "userid, " + "groupid " + ") VALUES ( " + this.getDB().dbQuote(inquiryid, "integer", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(fncid, "integer", true) + ", " + this.getDB().dbQuote(H_Post.publiclevel, "integer", true) + ", " + "0, " + this.getDB().dbQuote(pactid, "integer", true) + ", " + this.getDB().dbQuote(userid, "integer", true) + ", " + this.getDb().dbQuote(groupid, "integer", true) + ")";
		this.getOut().debugOut("model/FAQModel::insertNewInquiry() >> sql:" + sql, false);
		var res = this.getDB().exec(sql);
		this.getOut().debugOut("model/FAQModel::insertNewInquiry() res\u2193", false);
		this.getOut().debugOutEx(res, false);

		if (true == PEAR.isError(res)) {
			this.getOut().debugOut("model/FAQModel::insertNewInquiry() res:\u4E0D\u6B63\u306A\u623B\u308A\u5024", false);
			return false;
		}

		return true;
	}

	insertNewInquiryDetail(inquiryid, H_Post, userid, shopid, groupid) {
		var anonymous = false;

		if (true == (undefined !== H_Post.anonymous[0]) && 1 == H_Post.anonymous[0]) {
			anonymous = true;
		}

		var viewid = 1;

		if (true == (undefined !== H_Post.viewid)) {
			viewid = H_Post.viewid;
		}

		var authtype = 1;

		if (true == (undefined !== H_Post.authtype)) {
			authtype = H_Post.authtype;
		}

		var memid = undefined;

		if (1 != authtype) {
			memid = userid;
			userid = undefined;
		}

		var attachment = undefined;
		var attachmentname = undefined;

		if (true == (undefined !== H_Post.attachment) && "" != H_Post.attachment && (true == (undefined !== H_Post.attachmentname) && "" != H_Post.attachmentname)) {
			attachment = H_Post.attachment;
			attachmentname = H_Post.attachmentname;
		}

		this.getOut().debugOut("model/FAQModel::insertNewInquiryDetail(" + inquiryid + ", " + H_Post + ", " + userid + ", " + shopid + ", " + groupid + ")", false);
		var sql = "INSERT INTO inquiry_detail_tb (" + "inquiryid, " + "inquiryname, " + "recdate, " + "fixdate, " + "authtype, " + "contents, " + "userid, " + "shopid, " + "memid, " + "groupid, " + "anonymous, " + "delflg, " + "viewid, " + "attachment, " + "attachmentname " + ") VALUES (" + this.getDB().dbQuote(inquiryid, "integer", true) + ", " + this.getDB().dbQuote(stripslashes(H_Post.inquiryname), "text", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(authtype, "integer", true) + ", " + this.getDB().dbQuote(stripslashes(H_Post.contents), "text", true) + ", " + this.getDB().dbQuote(userid, "integer") + ", " + this.getDB().dbQuote(shopid, "integer") + ", " + this.getDB().dbQuote(memid, "integer") + ", " + this.getDB().dbQuote(groupid, "integer", true) + ", " + this.getDB().dbQuote(anonymous, "boolean", true) + ", " + "false, " + this.getDB().dbQuote(viewid, "integer", true) + ", " + this.getDB().dbQuote(attachment, "text") + ", " + this.getDB().dbQuote(attachmentname, "text") + ")";
		this.getOut().debugOut("model/FAQModel::insertNewInquiryDetail() >> sql:" + sql, false);
		var res = this.getDB().exec(sql);
		this.getOut().debugOut("model/FAQModel::insertNewInquiryDetail() res\u2193", false);
		this.getOut().debugOutEx(res, false);

		if (true == PEAR.isError(res)) {
			this.getOut().debugOut("model/FAQModel::insertNewInquiryDetail() res:\u4E0D\u6B63\u306A\u623B\u308A\u5024", false);
			return false;
		}

		return true;
	}

	editInquiry(detailid, H_Post) {
		this.getDB().beginTransaction();
		var anonymous = false;

		if (true == (undefined !== H_Post.anonymous[0]) && 1 == H_Post.anonymous[0]) {
			anonymous = true;
		}

		var attachment_set = "";

		if (true == (undefined !== H_Post.attachment) && "" != H_Post.attachment && true == (undefined !== H_Post.attachmentname) && "" != H_Post.attachmentname) {
			attachment_set = ", " + "attachment = " + this.getDB().dbQuote(H_Post.attachment, "text", true) + ", " + "attachmentname = " + this.getDB().dbQuote(H_Post.attachmentname, "text", true) + " ";
		}

		var sql = "UPDATE " + "inquiry_detail_tb " + "SET " + "inquiryname = " + this.getDB().dbQuote(stripslashes(H_Post.inquiryname), "text", true) + ", " + "anonymous = " + this.getDB().dbQuote(anonymous, "boolean", true) + ", " + "contents = " + this.getDB().dbQuote(stripslashes(H_Post.contents), "text", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " " + attachment_set + "WHERE " + "inquiry_detailid = " + this.getDB().dbQuote(detailid, "integer", true);
		var res = this.getDB().exec(sql);

		if (true == PEAR.isError(res)) {
			this.getOut().debugOut("model/FAQModel::insertNewInquiryDetail() res:\u4E0D\u6B63\u306A\u623B\u308A\u5024", false);
			this.getDB().rollback();
			return false;
		} else {
			this.getDB().commit();
			return true;
		}
	}

	getAdminMail(groupid, type = true) {
		if (true === type) {
			groupid += ",0";
		}

		var sql = "SELECT shop_tb.name || ' ' || shop_member_tb.name AS to_name, shop_member_tb.mail AS to, shop_tb.groupid AS groupid FROM shop_tb INNER JOIN shop_member_tb ON shop_tb.memid = shop_member_tb.memid " + "WHERE shop_tb.groupid IN (" + groupid + ") AND shop_tb.type = 'A'";
		return this.getDB().queryHash(sql);
	}

	returnCarrierFncid() {
		return this.getSetting().A_order_auth;
	}

	returnShopFnc() {
		var A_tmp = this.returnCarrierFncid();
		return A_tmp;
	}

	getShopMail(postid, fncid) {
		var a = this.getNormalShopmember(postid, fncid);
		var b = this.getSuperShopmember(postid, fncid);
		var array = array_merge(b, a);
		return this._unique(array);
	}

	_unique(array) {
		var temp = Array();
		var list = Array();
		var count = count(array);

		for (var i = 0; i < count; i++) {
			if (!(-1 !== temp.indexOf(array[i].to))) {
				list.push(array[i]);
				temp.push(array[i].to);
			}
		}

		return list;
	}

	getNormalShopmember(postid, fncid) {
		var whereSql = "";

		if (-1 !== this.returnShopFnc().indexOf(fncid)) {
			var where_sql = "AND shop_relation_tb.carid = " + this.getSetting().H_fnc_car[fncid] + " ";
		}

		var sql = "SELECT " + "shop_tb.name || ' ' || shop_member_tb.name AS to_name, shop_member_tb.mail AS to " + "FROM " + "shop_tb " + "INNER JOIN " + "shop_relation_tb ON shop_tb.shopid = shop_relation_tb.shopid " + "INNER JOIN " + "shop_member_tb ON shop_relation_tb.memid = shop_member_tb.memid " + "WHERE " + "shop_relation_tb.postid = " + this.getDB().dbQuote(postid, "integer", true) + " " + where_sql + "GROUP BY " + "shop_tb.name, shop_member_tb.name, shop_member_tb.mail, shop_member_tb.memid " + "ORDER BY " + "shop_member_tb.memid";
		return this.getDB().queryHash(sql);
	}

	getSuperShopmember(postid, fncid) {
		var whereSql = "";

		if (-1 !== this.returnShopFnc().indexOf(fncid)) {
			var where_sql = "AND sr.carid = " + this.getSetting().H_fnc_car[fncid] + " ";
		}

		var sql = "SELECT " + "s.name || ' ' || sm.name AS to_name, sm.mail AS to " + "FROM " + "shop_tb AS s " + "INNER JOIN " + "shop_relation_tb AS sr ON s.shopid =sr.shopid " + "INNER JOIN " + "shop_member_tb AS sm ON sr.shopid = sm.shopid " + "WHERE " + "sr.postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND sm.type = 'SU' " + where_sql + "GROUP BY " + "s.name, sm.name, sm.mail,s.shopid " + "ORDER BY " + "s.shopid";
		return this.getDB().queryHash(sql);
	}

	getShopmemidMail(memid) {
		var sql = "SELECT " + "shop_tb.name || ' ' || shop_member_tb.name AS to_name, shop_member_tb.mail AS to " + "FROM " + "shop_member_tb " + "INNER JOIN " + "shop_tb ON shop_tb.shopid = shop_member_tb.shopid " + "WHERE " + "shop_member_tb.memid = " + this.getDB().dbQuote(memid, "integer", true);
		return this.getDB().queryHash(sql);
	}

	returnFncid(id) {
		var sql = "SELECT " + "fncid " + "FROM " + "inquiry_tb " + "WHERE " + "inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getInquiryOwnerMail(id) {
		var sql = "SELECT " + "pact_tb.compname || ' ' || post_tb.postname || ' ' || user_tb.username AS to_name, user_tb.mail AS to, pact_tb.groupid AS groupid, pact_tb.pactid AS pactid, pact_tb.userid_ini AS userid_ini " + "FROM " + "inquiry_tb " + "INNER JOIN " + "user_tb ON user_tb.userid = inquiry_tb.userid " + "INNER JOIN " + "pact_tb ON user_tb.pactid = pact_tb.pactid " + "INNER JOIN " + "post_tb ON user_tb.postid = post_tb.postid " + "WHERE " + "inquiry_tb.inquiryid = " + this.getDB().dbQuote(id, "integer", true);
		return this.getDB().queryHash(sql);
	}

	deleteFAQ(fid) {
		var sql = "UPDATE " + "faq_tb " + "SET " + "delflg = TRUE, " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "WHERE " + "faqid = " + this.getDB().dbQuote(fid, "integer", true);
		return this.getDB().exec(sql);
	}

	updateFAQ(H_Post, shopid, memid, groupid, shopname, loginname) {
		var defaultflg = false;

		if ("0" === H_Post.publictype) {
			defaultflg = true;
		}

		var set_sql = "";

		if ("" != H_Post.attachment && "" != H_Post.attachmentname) {
			set_sql = "attachment = " + this.getDB().dbQuote(H_Post.attachment, "text", true) + ", " + "attachmentname = " + this.getDB().dbQuote(H_Post.attachmentname, "text", true) + ", ";
		}

		var sql = "UPDATE " + "faq_tb " + "SET " + "faqname = " + this.getDB().dbQuote(stripslashes(H_Post.title), "text", true) + ", " + set_sql + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + "fncid = " + this.getDB().dbQuote(H_Post.fnc, "integer", true) + ", " + "question = " + this.getDB().dbQuote(stripslashes(H_Post.question), "text", true) + ", " + "answer = " + this.getDB().dbQuote(stripslashes(H_Post.answer), "text", true) + ", " + "lastmemid = " + this.getDB().dbQuote(memid, "integer", true) + ", " + "lastshopid = " + this.getDB().dbQuote(shopid, "integer", true) + ", " + "defaultflg = " + this.getDB().dbQuote(defaultflg, "boolean", true) + " " + "WHERE " + "faqid = " + this.getDB().dbQuote(H_Post.faqid, "integer", true);
		this.getDB().exec(sql);
	}

	getFunctionList(type = false) {
		var sql = "SELECT fncid, fncname FROM function_tb WHERE path IS NOT NULL AND enable = TRUE AND type = 'US' AND fncid NOT IN (" + this.getSetting().A_exclude_fnc.join(",") + ") ORDER BY show_order, fncid";
		var H_tmp = this.getDB().queryHash(sql);
		var tmp_count = H_tmp.length;

		if (0 > tmp_count) {
			return Array();
		}

		var H_fnclist = Array();

		for (var i = 0; i < tmp_count; i++) {
			H_fnclist[H_tmp[i].fncid] = H_tmp[i];
		}

		H_fnclist["0"] = {
			fncid: 0,
			fncname: "\u305D\u306E\u4ED6"
		};

		if (true === type) {
			return H_fnclist;
		}

		var cnt = 3 - H_fnclist.length % 3;

		if (3 != cnt) {
			for (var x = 0; x < cnt; x++) {
				H_fnclist.push(Array());
			}
		}

		return array_chunk(H_fnclist, 3);
	}

	getOrderCar() {
		H_auth["26"] = "docomo";
		H_auth["27"] = "au";
		H_auth["28"] = "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF";
		H_auth["85"] = "Y!mobile(\u65E7EMOBILE)";
		H_auth["39"] = "Y!mobile(\u65E7WILLCOM)";
		H_auth["138"] = "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3";
		return H_auth;
	}

	getPactHash(groupid = undefined) {
		var where_sql = "";

		if (false == is_null(groupid) && 0 != groupid) {
			where_sql = " WHERE groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " ";
		}

		var sql = "select " + "pactid, compname " + "from " + "pact_tb " + where_sql + "order by pactid";
		return this.getDB().queryAssoc(sql);
	}

	getUsermail(userid) {
		var sql = "SELECT " + "function_tb.fncname " + "FROM " + "user_tb " + "INNER JOIN " + "fnc_relation_tb ON user_tb.pactid = fnc_relation_tb.pactid " + "INNER JOIN " + "function_tb on fnc_relation_tb.fncid = function_tb.fncid " + "WHERE " + "function_tb.ininame = 'fnc_not_view_root' AND user_tb.userid = " + this.getDB().dbQuote(userid, "integer", true);
		var secondroot = this.getDB().queryOne(sql);

		if (true === is_null(secondroot)) {
			secondroot = false;
		} else {
			secondroot = true;
		}

		sql = "SELECT " + "user_tb.mail AS to, " + "pact_tb.compname AS compname, " + "post_tb.postname AS postname, " + "user_tb.username AS username " + "FROM " + "user_tb " + "INNER JOIN " + "post_tb ON post_tb.postid = user_tb.postid " + "INNER JOIN " + "pact_tb ON pact_tb.pactid = user_tb.pactid " + "WHERE " + "user_tb.userid = " + this.getDB().dbQuote(userid, "integer", true);
		var A_tmp = this.getDB().queryRowHash(sql);

		if (true === secondroot) {
			var postname2 = this.getSecondRoot(userid);

			if (false !== postname2) {
				if (A_tmp.postname == postname2) {
					A_tmp.to_name = postname2 + " " + A_tmp.username;
				} else {
					A_tmp.to_name = postname2 + " " + A_tmp.postname + " " + A_tmp.username;
				}
			} else {
				if (A_tmp.postname == A_tmp.compname) {
					A_tmp.to_name = A_tmp.compname + " " + A_tmp.username;
				} else {
					A_tmp.to_name = A_tmp.compname + " " + A_tmp.postname + " " + A_tmp.username;
				}
			}
		} else {
			if (A_tmp.postname == A_tmp.compname) {
				A_tmp.to_name = A_tmp.compname + " " + A_tmp.username;
			} else {
				A_tmp.to_name = A_tmp.compname + " " + A_tmp.postname + " " + A_tmp.username;
			}
		}

		return A_tmp;
	}

	getSecondRoot(userid) {
		var postid = this.getDB().queryOne("SELECT postid FROM user_tb WHERE userid = " + this.getDB().dbQuote(userid, "integer", true));
		var O_Post = new PostModel();
		var A_postid = O_Post.getParentList(postid);

		if (false == (undefined !== A_postid[1])) {
			return false;
		}

		var sql = "SELECT " + "postname " + "FROM " + "post_tb " + "WHERE " + "postid = " + this.getDB().dbQuote(A_postid[1], "integer", true);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};