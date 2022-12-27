//
//ユーザ側　共通問い合わせモデル
//
//@package FAQ
//@used FAQModel
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//ユーザ側　共通問い合わせモデル
//
//@package FAQ
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("model/FAQ/FAQModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//getOrderableList
//
//@author ishizaki
//@since 2008/10/30
//
//@param mixed $shopid
//@access public
//@return void
//
//
//addNewFAQ
//
//@author ishizaki
//@since 2008/10/27
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
//getPactAuthUnchainPactid
//
//@author ishizaki
//@since 2008/10/23
//
//@access public
//@return void
//
//
//addInquiryFromAdmin
//
//@author ishizaki
//@since 2008/11/09
//
//@param mixed $id
//@param mixed $H_Post
//@param mixed $shopid
//@param mixed $groupid
//@access public
//@return void
//
//
//updateFAQAdmin
//
//@author ishizaki
//@since 2008/11/09
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
//デストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class AdminFAQModel extends FAQModel {
	static FILENAME = "model/FAQ/Admin/AdminFAQModel";

	constructor() {
		super();
	}

	getOrderableList() {
		var H_auth = Array();
		H_auth["26"] = {
			fncid: 26,
			fncname: "docomo"
		};
		H_auth["27"] = {
			fncid: 27,
			fncname: "au"
		};
		H_auth["28"] = {
			fncid: 28,
			fncname: "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF"
		};
		H_auth["85"] = {
			fncid: 85,
			fncname: "Y!mobile(\u65E7EMOBILE)"
		};
		H_auth["39"] = {
			fncid: 39,
			fncname: "Y!mobile(\u65E7WILLCOM)"
		};
		H_auth["138"] = {
			fncid: 138,
			fncname: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
		};
		return H_auth;
	}

	addNewFAQ(H_Post, shopid, groupid) {
		this.getDB().beginTransaction();
		var faqid = this.getDB().nextID("faq_tb_faqid");
		var memid = this.getDB().queryOne("SELECT memid FROM shop_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true));
		var res = this.insertNewFAQ(faqid, H_Post, shopid, memid, groupid, undefined, undefined);

		if (1 !== res) {
			this.getDB().rollback();
			this.getOut().errorOut(0, "faq_tb\u3078\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u306E\u5931\u6557");
			return false;
		}

		if ("1" === H_Post.publictype) {
			var max = H_Post.pactid.length;

			if (max < 1) {
				this.getDB().rollback();
				this.getOut().errorOut(0, "\u8907\u6570\u4F01\u696D\u3078\u306E\u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u5F35\u308B\u306F\u305A\u306A\u306E\u306B\u3001\u8A72\u5F53\u3059\u308B\u4F01\u696D\u304C\u306A\u3044");
				return false;
			}

			this.deleteFAQRelation(faqid);
			{
				let _tmp_0 = H_Post.pactid;

				for (var tmp_pactid in _tmp_0) {
					var tmp = _tmp_0[tmp_pactid];
					res = this.insertNewFAQRelation(faqid, tmp_pactid, 0, groupid);

					if (1 !== res) {
						this.getDB().rollback();
						this.getOut().errorOut(0, "faq_rel_pact_tb\u3078\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u306E\u5931\u6557");
						return false;
					}
				}
			}
		}

		this.getDB().commit();
	}

	getPactAuthUnchainPactid() {
		var sql = "SELECT fncid FROM function_tb WHERE type = 'CO' AND enable = TRUE";
		return this.getDB().queryCol(sql);
	}

	addInquiryFromAdmin(id, H_Post, shopid, groupid) {
		this.getDB().beginTransaction();
		var viewid = this.getDB().queryOne("SELECT MAX(viewid) FROM inquiry_detail_tb WHERE inquiryid = " + this.getDB().dbQuote(id, "integer", true));

		if (true == is_null(viewid) || 0 > viewid) {
			this.getDB().rollback();
			return false;
		}

		viewid++;
		H_Post.viewid = viewid;
		H_Post.authtype = 3;
		var memid = this.getDB().queryOne("SELECT memid FROM shop_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true));
		var res = this.updateInquiryFixdate(id);
		res = this.insertNewInquiryDetail(id, H_Post, memid, shopid, groupid);

		if (false == res) {
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		return true;
	}

	updateFAQAdmin(H_Post, shopid, groupid) {
		this.getDB().beginTransaction();
		this.deleteFAQRelation(H_Post.faqid);
		var memid = this.getDB().queryOne("SELECT memid FROM shop_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true));
		this.updateFAQ(H_Post, shopid, memid, groupid, undefined, undefined);

		if ("1" === H_Post.publictype) {
			var max = H_Post.pactid.length;

			if (max < 1) {
				this.getDB().rollback();
				this.getOut().errorOut(0, "\u8907\u6570\u4F01\u696D\u3078\u306E\u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u5F35\u308B\u306F\u305A\u306A\u306E\u306B\u3001\u8A72\u5F53\u3059\u308B\u4F01\u696D\u304C\u306A\u3044");
				return false;
			}

			{
				let _tmp_1 = H_Post.pactid;

				for (var tmp_pactid in _tmp_1) {
					var tmp = _tmp_1[tmp_pactid];
					var res = this.insertNewFAQRelation(H_Post.faqid, tmp_pactid, 0, groupid);

					if (1 !== res) {
						this.getDB().rollback();
						this.getOut().errorOut(0, "faq_rel_pact_tb\u3078\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u306E\u5931\u6557");
						return false;
					}
				}
			}
		}

		this.getDB().commit();
	}

	__destruct() {
		super.__destruct();
	}

};