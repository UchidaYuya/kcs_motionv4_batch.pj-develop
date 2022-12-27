//
//Shopに関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/02
//
//
//
//Shopに関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/02
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/05/02
//
//@param object $O_DB
//@access public
//@return void
//
//
//ユーザーIDからshopidを調べる
//
//@author nakanita
//@since 2008/05/02
//
//@param integer $userid
//@access public
//@return void
//
//
//shop_tb より登録されているshopid、ショップ名を取得
//
//@author nakanita
//@since 2008/05/02
//
//@access public
//@return shopidをキー、ショップ名を値とした連想配列
//
//
//引数のショップIDの子供IDを配列で返す
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $shopid
//@access public
//@return void
//
//
//引数のショップIDの子供IDを販売店id=>販売店名の配列で返す<BR>
//$self == trueで引数のショップIDの情報も頭に追加する
//
//@author miyazawa
//@since 2008/12/12
//
//@param int $shopid
//@param boolean $self
//@access public
//@return mixed
//
//
//販売店IDを受け取り、ショップIDをキーとした販売店名のハッシュで返す
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $A_shopid
//@access public
//@return void
//
//
//getShopFromPostcode
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $groupid
//@param mixed $postcode
//@access public
//@return void
//
//
//getShopFromLoginid
//
//@author katsushi
//@since 2009/01/15
//
//@param mixed $groupid
//@param mixed $loginid
//@access public
//@return void
//
//
//getShopFromShopid
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $shopid
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
class ShopModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getShopIdFromUser(memid) {
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "ShopModel::getShopIdFromUser() memid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "shopid " + "from " + "shop_member_tb " + "where " + "memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	getShopIdShopNameFromShop() {
		var sql = "select shopid, name " + "from shop_tb " + "where delflg=false " + "order by shopid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getIncludeShop(shopid) {
		var sql = "SELECT " + "childshop " + "FROM " + "support_shop_tb " + "WHERE " + "parentshop = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "ORDER BY childshop";
		return this.getDB().queryCol(sql);
	}

	getIncludeShopWithName(shopid, self = false) {
		var sql = "SELECT " + "sp.childshop, '[' || sh.postcode || ']' || sh.name " + "FROM " + "support_shop_tb sp INNER JOIN shop_tb sh ON sp.childshop = sh.shopid " + "WHERE " + "sp.parentshop = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "ORDER BY sh.postcode";
		var H_result = this.getDB().queryAssoc(sql);

		if (true == Array.isArray(H_result) && true == 0 < H_result.length && self == true) {
			var selfsql = "SELECT postcode, name FROM shop_tb WHERE shopid=" + shopid;
			var H_self = this.getDB().queryRowHash(selfsql);
			H_result = {
				[shopid]: "[" + H_self.postcode + "]" + H_self.name
			} + H_result;
		}

		return H_result;
	}

	getShopnameList(A_shopid) {
		var sql = "SELECT " + "shopid, name AS shopname " + "FROM " + "shop_tb " + "WHERE " + "shopid IN (" + A_shopid.join(", ") + ") ";
		return this.getDB().queryAssoc(sql);
	}

	getShopFromPostcode(groupid, postcode) {
		var sql = "select * from shop_tb where groupid=" + this.getDB().dbQuote(groupid, "integer", true) + " and postcode = " + this.getDB().dbQuote(postcode, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getShopFromLoginid(groupid, loginid) {
		var sql = "select * from shop_tb where groupid=" + this.getDB().dbQuote(groupid, "integer", true) + " and loginid = " + this.getDB().dbQuote(loginid, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getShopFromShopid(shopid) {
		var sql = "select * from shop_tb where shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};