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
//addNewInquiry
//
//@author ishizaki
//@since 2008/10/07
//
//@param mixed $fncid
//@param mixed $H_Post
//@param mixed $pactid
//@param mixed $userid
//@param mixed $groupid
//@access public
//@return void
//
//
//addInquiry
//
//@author ishizaki
//@since 2008/10/20
//
//@param mixed $id
//@param mixed $H_Post
//@param mixed $O_gs
//@param mixed $O_gs
//@param mixed $O_gs
//@param 0 $0
//@param mixed $O_gs
//@param mixed $O_gs
//@param mixed $O_gs
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
class UserFAQModel extends FAQModel {
	static FILENAME = "model/FAQ/UserFAQModel";

	constructor() {
		super();
	}

	addNewInquiry(fncid, H_Post, pactid, userid, groupid) {
		this.getDB().beginTransaction();
		var inquiryid = this.getDB().nextID("inquiry_tb_inquiryid");
		var res = this.insertNewInquiry(inquiryid, fncid, H_Post, pactid, userid, groupid);

		if (false == res) {
			this.getDB().rollback();
			return false;
		}

		res = this.insertNewInquiryDetail(inquiryid, H_Post, userid, undefined, groupid);

		if (false == res) {
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		return inquiryid;
	}

	addInquiry(id, H_Post, pactid, userid, groupid) {
		this.getDB().beginTransaction();
		var viewid = this.getDB().queryOne("SELECT MAX(viewid) FROM inquiry_detail_tb WHERE inquiryid = " + this.getDB().dbQuote(id, "integer", true));

		if (true == is_null(viewid) || 0 > viewid) {
			this.getDB().rollback();
			return false;
		}

		viewid++;
		H_Post.viewid = viewid;
		var res = this.updateInquiryFixdate(id);
		res = this.insertNewInquiryDetail(id, H_Post, userid, undefined, groupid);

		if (false == res) {
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};