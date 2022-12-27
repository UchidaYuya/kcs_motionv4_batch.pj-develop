//
//ショップ：価格表
//
//@uses PriceRegistBaseModel
//@package Price
//@subpackage Model
//@filesource
//@author katsushi
//@since 2008/07/29
//
//
//
//ショップ価格表Model
//
//@uses ModelBase
//@package Price
//@subpackage Model
//@author katsushi
//@since 2008/07/29
//

require("model/PriceRegistBaseModel.php");

require("model/Order/ShopOrderMenuModel.php");

//
//__construct
//
//@author katsushi
//@since 2008/07/29
//
//@access public
//@return void
//
//
//registPriceRelation
//typeがpactの場合は、第三引数をpactidの配列で渡す。postの場合は変数で
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $type
//@param mixed $pricelistid
//@param mixed $pactid
//@param mixed $shopid
//@param mixed $A_postid
//@access public
//@return void
//
//
//getSelectedRelationlist
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $pricelist
//@param mixed $shopid
//@access public
//@return void
//
//
//販売店の価格表一覧抜き出し
//
//@author ishizaki
//@since 2008/08/07
//
//@param mixed $type
//@param mixed $shopid
//@param mixed $groupid
//@param string $add_where
//@access public
//@return void
//
//
//getShopidFromPricelistID
//
//@author ishizaki
//@since 2008/11/04
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPublishedPactCount
//
//@author ishizaki
//@since 2009/01/05
//
//@param mixed $pricelistid
//@param mixed $shopid
//@access public
//@return void
//
//
//現在の時刻を返す
//
//@author ishizaki
//@since 2009/05/14
//
//@access public
//@return void
//
//
//今日の日付を返す
//
//@author ishizaki
//@since 2009/05/14
//
//@access public
//@return void
//
//
//chkPriceListId
//
//@author katsushi
//@since 2008/09/02
//
//@param mixed $groupid
//@param mixed $pricelistid
//@param mixed $delflg
//@param mixed $edit
//@access public
//@return void
//
//
//包括子のショップIDチェック
//
//@author kitamura
//@since 2009/11/06
//
//@access public
//@return boolean
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/29
//
//@access public
//@return void
//
class ShopPriceModel extends PriceRegistBaseModel {
	constructor() {
		super();
	}

	registPriceRelation(type, pricelistid, pactid, shopid, A_postid = undefined) //モードの指定が不正ならば早々に退散
	//既にある関連付けを削除
	//タイプによって関連づけをする
	{
		if ("post" != type && "pact" != type) {
			return -1;
		}

		this.getDB().beginTransaction();
		var delete_sql = "DELETE FROM price_relation_tb WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		this.getDB().exec(delete_sql);

		if ("post" === type) {
			if (0 < A_postid.length) {
				for (var postid in A_postid) {
					var value = A_postid[postid];
					var insert_sql = "INSERT INTO price_relation_tb (pricelistid, pactid, postid, shopid) VALUES (" + this.getDB().dbQuote(pricelistid, "integer", true) + ", " + this.getDB().dbQuote(pactid, "integer", true) + ", " + this.getDB().dbQuote(postid, "integer", true) + ", " + this.getDB().dbQuote(shopid, "integer", true) + ")";
					this.getDB().exec(insert_sql);
				}
			}
		} else if ("pact" === type) {
			if (0 < pactid.length) {
				for (var pactid in pactid) {
					var value = pactid[pactid];
					insert_sql = "INSERT INTO price_relation_tb (pricelistid, pactid, postid, shopid) VALUES (" + this.getDB().dbQuote(pricelistid, "integer", true) + ", " + this.getDB().dbQuote(pactid, "integer", true) + ", 0, " + this.getDB().dbQuote(shopid, "integer", true) + ")";
					this.getDB().exec(insert_sql);
				}
			}
		}

		this.getDB().commit();
		return 0;
	}

	getSelectedRelationlist(pricelistid, shopid) {
		var select_sql = "SELECT pricelistid, pactid, postid, shopid FROM price_relation_tb WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		return this.getDB().queryHash(select_sql, "integer", true);
	}

	getShopPriceList(type, shopid, groupid, add_where = "") {
		var select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.shopid, " + "shop_tb.name AS shopname, " + "pricelist_tb.carid, " + "carrier_tb.carname, " + "pricelist_tb.pricename, " + "price_pattern_tb.ppname, " + "(CASE WHEN current_date < datefrom THEN -1 WHEN current_date > dateto THEN 2 ELSE 1 END) AS status, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.defaultflg, " + "pricelist_tb.author " + "FROM " + "pricelist_tb " + "INNER JOIN " + "price_pattern_tb ON pricelist_tb.ppid = price_pattern_tb.ppid " + "INNER JOIN " + "carrier_tb ON pricelist_tb.carid = carrier_tb.carid " + "INNER JOIN " + "shop_tb ON pricelist_tb.shopid = shop_tb.shopid " + "WHERE " + add_where + "pricelist_tb.shopid IN(" + this.getDB().dbQuote(shopid, "integer", true) + ", 0) AND " + "pricelist_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "pricelist_tb.delflg = false " + "ORDER BY " + "pricelist_tb.shopid, pricelist_tb.carid, pricelist_tb.ppid, pricelist_tb.datefrom DESC, pricelist_tb.fixdate DESC";

		if (type == "assoc") {
			return this.getDB().queryAssoc(select_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(select_sql);
		} else {
			return this.getDB().queryHash(select_sql);
		}
	}

	getShopidFromPricelistID(pricelistid) {
		var sql = "SELECT shopid FROM pricelist_tb WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getPublishedPactCount(pricelistid, shopid) {
		var select_sql = "SELECT " + "price_relation_tb.pactid " + "FROM " + "price_relation_tb " + "WHERE " + "price_relation_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + "price_relation_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "GROUP BY " + "price_relation_tb.pactid";
		return this.getDB().queryCol(select_sql);
	}

	getNow() {
		return this.getDB().getNow();
	}

	getToday() {
		return this.getDB().getToday();
	}

	chkPriceListId(shopid, pricelistid, delflg = false, edit = false) {
		var where = "";

		if (delflg === false) {
			where = " AND pricelist_tb.delflg = false";
		}

		var view_where = " OR ( pricelist_tb.shopid = 0 AND pricelist_tb.groupid = (SELECT groupid FROM shop_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + ")) ";

		if (true === edit) {
			view_where = "";
		}

		var support = "";

		if (true === ShopOrderMenuModel.checkUnifyShop(shopid)) {
			support = " OR pricelist_tb.shopid in ( " + Object.keys(ShopOrderMenuModel.getChildShopID(shopid, "", true, true)).join(",") + ") ";
		}

		var sql = "SELECT count(*) FROM " + "pricelist_tb " + "WHERE " + "((pricelist_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + ") " + view_where + support + " )" + " AND pricelist_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + where;
		var ret = this.getDB().queryOne(sql);

		if (ret > 0) {
			return true;
		}

		return false;
	}

	chkChildShopId(shopid, child_shopid) {
		var sql = "SELECT COUNT(*) FROM support_shop_tb WHERE " + " parentshop = " + this.getDB().dbQuote(shopid, "integer", true) + " AND childshop = " + this.getDB().dbQuote(child_shopid, "integer", true);
		var res = this.getDB().queryOne(sql);

		if (res > 0) {
			return true;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};