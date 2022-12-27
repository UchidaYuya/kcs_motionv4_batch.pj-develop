//Shopに関するモデル

import ModelBase from "./ModelBase";

export default class ShopModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getShopIdFromUser(memid: number) {
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "ShopModel::getShopIdFromUser() memidが不正", false);
		}

		const sql = "select " + "shopid " + "from " + "shop_member_tb " + "where " + "memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	getShopIdShopNameFromShop() {
		const sql = "select shopid, name " + "from shop_tb " + "where delflg=false " + "order by shopid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getIncludeShop(shopid: number) {
		const sql = "SELECT " + "childshop " + "FROM " + "support_shop_tb " + "WHERE " + "parentshop = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "ORDER BY childshop";
		return this.getDB().queryCol(sql);
	}

	async getIncludeShopWithName(shopid: number, self = false) {
		const sql = "SELECT " + "sp.childshop, '[' || sh.postcode || ']' || sh.name " + "FROM " + "support_shop_tb sp INNER JOIN shop_tb sh ON sp.childshop = sh.shopid " + "WHERE " + "sp.parentshop = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "ORDER BY sh.postcode";
		let H_result = await this.getDB().queryAssoc(sql);

		if (true == Array.isArray(H_result) && true == 0 < H_result.length && self == true) {
			var selfsql = "SELECT postcode, name FROM shop_tb WHERE shopid=" + shopid;
			var H_self = await this.getDB().queryRowHash(selfsql);
			H_result = {
				[shopid]: "[" + H_self.postcode + "]" + H_self.name
			} + H_result;
		}

		return H_result;
	}

	getShopnameList(A_shopid: any) {
		const sql = "SELECT " + "shopid, name AS shopname " + "FROM " + "shop_tb " + "WHERE " + "shopid IN (" + A_shopid.join(", ") + ") ";
		return this.getDB().queryAssoc(sql);
	}

	getShopFromPostcode(groupid: number, postcode: number) {
		const sql = "select * from shop_tb where groupid=" + this.getDB().dbQuote(groupid, "integer", true) + " and postcode = " + this.getDB().dbQuote(postcode, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getShopFromLoginid(groupid: number, loginid: number) {
		const sql = "select * from shop_tb where groupid=" + this.getDB().dbQuote(groupid, "integer", true) + " and loginid = " + this.getDB().dbQuote(loginid, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getShopFromShopid(shopid: number) {
		const sql = "select * from shop_tb where shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		return this.getDB().queryRowHash(sql);
	}
};
