//
//受注内容変更Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/08/08
//@uses OrderModel
//@uses OrderUtil
//
//
//
//受注内容変更Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/08/08
//

require("RecogFormModel.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/08/08
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//注文種別を返す
//
//@author igarashi
//@since 2008/10/10
//
//@param mixed $orderid
//@access public
//@return void
//
//
//受注変更履歴を書き込む
//
//@author igarashi
//@since 2009/02/17
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $status
//@access public
//@return void
//
//
//受注内容変更のルールを作る
//
//@author igarashi
//@since 2008/09/18
//
//@access public
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/04
//
//@access public
//@return void
//
class ShopOrderEditModel extends RecogFormModel {
	constructor(O_db0, H_g_sess, site_flg = ShopOrderEditModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	getShopOrderType(orderid) //エラーキャッチ 20090901miya
	{
		if ("" == orderid) {
			this.errorOut(8, "ShopOrderEditModel::getShopOrderType  \u5F15\u6570\u304C\u306A\u3044\uFF08\u30D6\u30E9\u30A6\u30B6\u30D0\u30C3\u30AF/\u5225\u7A93\uFF09", false, "../menu.php");
		}

		var sql = "SELECT ordertype FROM " + ShopOrderEditModel.ORD_TB + " " + "WHERE orderid=" + orderid;
		return this.get_DB().queryOne(sql);
	}

	UpdateOrderHistory(H_g_sess, H_sess, status) //エラーはロールバック。コミットは外でやる
	{
		var sql = "SELECT name FROM shop_member_tb " + "WHERE memid=" + H_sess.SELF.member;
		var memname = this.get_DB().queryOne(sql);
		sql = "INSERT INTO mt_order_history_tb " + "(orderid, chdate, shopid, shopname, shopperson, shopcomment, status) " + "VALUES(" + this.get_DB().dbQuote(H_sess[ShopOrderEditModel.PUB].orderid, "int", true) + ", " + this.get_DB().dbQuote(MtDateUtil.getNow(), "date", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", false) + ", " + this.get_DB().dbQuote(H_g_sess.shopname, "text", false) + ", " + this.get_DB().dbQuote(memname, "text", false) + ", " + this.get_DB().dbQuote(H_sess.SELF.comment, "text", false) + ", " + this.get_DB().dbQuote(status, "int", false) + " " + ")";

		if (true == PEAR.isError(this.get_DB().exec(sql))) {
			this.get_DB().rollback;
		}
	}

	getFormRule() {
		var A_rule = Array();
		A_rule.push({
			name: "comment",
			mess: "\u5909\u66F4\u7406\u7531\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});
		A_rule.push({
			name: "member",
			mess: "\u66F4\u65B0\u8005\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});
		return A_rule;
	}

	__destruct() {
		super.__destruct();
	}

};