//
//ポイント表示メニュー用Model
//
//@package SUO
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@uses TweakPointModel
//
//
//
//ポイント表示メニュー用Model
//
//@package SUO
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@uses TweakPointModel
//

require("model/TweakModel.php");

require("model/PostModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/04/20
//
//@access public
//@return void
//
//
//getPointList
//
//@author ishizaki
//@since 2008/06/04
//
//@param mixed $pactid
//@param mixed $A_post_list
//@access public
//@return void
//
//
//getBilldate
//
//@author ishizaki
//@since 2008/06/04
//
//@param mixed $pactid
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class TweakPointMenuModel extends TweakModel {
	constructor() {
		super();
	}

	getPointList(pactid, A_post_list) {
		var billdate = this.getBilldate(pactid);

		if ("" != billdate) {
			var sql = "SELECT " + "post_tb.postname, " + "post_tb.userpostid, " + "tweak_point_tb.d_allpoint, " + "tweak_point_tb.d_thispoint, " + "tweak_point_tb.d_usedpoint, " + "tweak_point_tb.au_allpoint, " + "tweak_point_tb.au_thispoint, " + "tweak_point_tb.au_usedpoint " + "FROM " + "tweak_point_tb " + "INNER JOIN " + "post_tb ON tweak_point_tb.pactid = post_tb.pactid AND tweak_point_tb.postid = post_tb.userpostid " + "WHERE " + "tweak_point_tb.postid in('" + A_post_list.join("','") + "') AND tweak_point_tb.pactid = " + pactid + " AND " + "tweak_point_tb.billdate = '" + billdate + "' " + "ORDER BY post_tb.pint1, post_tb.userpostid";
			return this.getDB().queryHash(sql);
		}

		return Array();
	}

	getBilldate(pactid) {
		var sql = "SELECT " + "MAX(billdate) " + "FROM " + "tweak_point_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer");
		return this.getDB().queryOne(sql);
	}

	changePostidUserpostid(A_post_list, pactid) {
		var yyyy, mm;
		var A_userpost_list = Array();
		var O_post = new PostModel();
		[yyyy, mm] = this.getBilldate(pactid).split("-");
		var yyyymm = yyyy + mm;

		for (var key in A_post_list) {
			var value = A_post_list[key];
			var tmp = O_post.getPostData(value, MtTableUtil.getTableNo(yyyymm));
			A_userpost_list.push(tmp.userpostid);
		}

		return A_userpost_list;
	}

	__destruct() {
		super.__destruct();
	}

};