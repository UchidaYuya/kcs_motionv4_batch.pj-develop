//
//受注集計用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/05/22
//@uses OrderListModelBase
//@uses OrderUtil
//
//
//
//受注集計用Model
//
//@package Order
//@subpackage Model
//@author miyazawa
//@since 2008/05/22
//@uses ManagementModel
//

require("model/Order/AdminOrderListModel.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/06/23
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//包括販売店かをチェックする<br>
//包括販売店ならtrueを返す。それ以外はfalse
//
//@param $shopid
//
//@access public
//@return boolean
//
//
//包括販売店なら配下の販売店idを返す
//
//@author 伊達
//@since 20171030
//
//@param $shopid
//@param $flg
//
//@access public
//@return array
//
//
//集計対象のshopidをSESSIONからとるか包括配下を使うか選ぶ
//
//@author igarashi
//@since 2008/10/21
//
//@param $H_sess
//@param $A_shopid
//
//@access public
//@return array
//
//
//getPostId
//
//@author igarashi
//@since 2008/10/01
//
//@param mixed $A_shopid
//@access public
//@return void
//
//
//販売店の管理ログに書き込む
//
//@author igarashi
//@since 2009/01/28
//
//@param mixed $H_sess
//@param string $mode
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
class ShopOrderListModel extends AdminOrderListModel {
	static SITE_SHOP = 1;
	static SITE_ADMIN = 2;

	constructor(O_db0) {
		this.siteflg = ShopOrderListModel.SITE_SHOP;
		super(O_db0);
	}

	checkUnifyShop(shopid) {
		var sql = "SELECT count(parentshop) FROM support_shop_tb " + "WHERE parentshop=" + shopid;
		var result = true;

		if (0 == this.get_DB().queryOne(sql)) {
			result = false;
		}

		return result;
	}

	getChildShopID(shopid, shopname, flg) //$A_shopid = array($shopid=>$shopname);
	//		if(true == $flg){
	//			$sql = "SELECT childshop FROM support_shop_tb ".
	//				"WHERE parentshop=" .$shopid;
	//			$A_temp = $this->get_DB()->queryCol($sql);
	//			$sql = "SELECT shopid, name FROM shop_tb ".
	//				"WHERE shopid IN (" .implode(", ", $A_temp). ")";
	//			$A_shopid += $this->get_DB()->queryKeyAssoc($sql);
	//		}
	//		return $A_shopid;
	//包括販売店なら配下も返す
	{
		var val = this.get_DB().dbQuote(shopid, "integer", true);
		var where = " sh.shopid = " + val;

		if (flg == true) {
			where += " OR sp.parentshop = " + val;
		}

		var sql = "SELECT" + " sh.shopid" + ",'[' || sh.postcode || '] ' || sh.name as name" + " FROM" + " shop_tb sh" + " LEFT JOIN support_shop_tb sp ON sp.childshop = sh.shopid AND sp.parentshop = " + val + " WHERE" + where + " ORDER BY sh.postcode";
		return this.get_DB().queryKeyAssoc(sql);
	}

	getWhereShopID(H_sess, A_shopid, shopid, flg = false) //販売店が選ばれてない かつ 包括販売店なら配下の販売店を全て集計
	{
		if ("0" == H_sess.shopsel && true == flg) {
			var A_selshop = Object.keys(A_shopid);
		} else if ("0" != H_sess.shopsel && true == flg) {
			A_selshop = [H_sess.shopsel];
		} else {
			A_selshop = [shopid];
		}

		return A_selshop;
	}

	getPostId(A_shopid) {
		A_shopid = Object.keys(A_shopid);
		H_post[0] = "\u5168\u3066";
		var sql = "SELECT " + "ord.pactid," + "pa.compname " + "FROM " + "mt_order_tb ord " + "INNER JOIN mt_transfer_tb tf ON ord.orderid=tf.orderid " + "LEFT JOIN pact_tb pa ON ord.pactid=pa.pactid " + "WHERE " + "(ord.status >= " + this.O_order.st_shipfin + " and ord.status < " + this.O_order.st_cancel + ") " + "AND ord.ordertype IN ('" + this.O_order.type_new + "','" + this.O_order.type_mnp + "', '" + this.O_order.type_chn + "', '" + this.O_order.type_del + "', '" + this.O_order.type_shi + "') " + "AND ((ord.shopid IN (" + A_shopid.join(", ") + ") OR tf.fromshopid IN (" + A_shopid.join(", ") + ")) " + "OR (tf.toshopid IN (" + A_shopid.join(", ") + ") AND tf.transfer_status = 'both') " + "OR (tf.fromshopid IN (" + A_shopid.join(", ") + ") AND tf.transfer_status = 'work')) " + "GROUP BY " + "ord.pactid," + "pa.compname " + "ORDER BY " + "pa.compname";
		H_post += this.get_DB().queryAssoc(sql);
		return H_post;
	}

	writeShopMngLog(H_g_sess, H_sess) //コメントがある場合だけインサート
	{
		if (0 == H_sess.SELF.pactsel) {
			var lockpact = "\u5168\u3066";
		} else if (true == (undefined !== H_sess.SELF.pactsel) && "" != H_sess.SELF.pactsel) {
			var sql = "SELECT compname FROM pact_tb WHERE pactid=" + H_sess.SELF.pactsel;
			lockpact = this.get_DB().queryOne(sql);
		}

		if ("" != lockpact) {
			var comment = lockpact + "\u306E\u53D7\u6CE8\u96C6\u8A08\u3092\u95B2\u89A7";
		}

		var H_data = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: this.O_Sess.memid,
			comment2: comment,
			kind: "MTOrder",
			type: "\u53D7\u6CE8\u66F4\u65B0",
			joker_flg: this.O_Sess.joker
		};

		if ("" != comment) {
			this.getOut().writeShopMngLog(H_data);
		}
	}

	__destruct() {
		super.__destruct();
	}

};