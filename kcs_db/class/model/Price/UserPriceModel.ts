//価格表メニュー用Model

import PriceModel from '../PriceModel';
import MtAuthority from '../../MtAuthority';

export default class UserPriceModel extends PriceModel {
	PostID: number | undefined;
	PactID: string;
	O_Auth!: MtAuthority;
	setPostID(postid: number) {
		this.PostID = postid;
	}

	constructor(pactid: string, postid = undefined) {
		super();
		this.PactID = pactid;

		if (postid) {
			this.PostID = postid;
		}

		if (undefined !== this.PostID) {
			this.O_Auth = MtAuthority.singleton(this.PactID);
		}
	}

	checkPriceAuthType() {
		if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_admin")) {
			return "fnc_mt_price_admin";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_shop")) {
			return "fnc_mt_price_shop";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_pact")) {
			return "fnc_mt_price_pact";
		} else if (true === this.O_Auth.chkPactFuncIni("fnc_mt_price_post")) {
			return "fnc_mt_price_post";
		}

		return false;
	}

	async getNowPrice(productid: string, carid: number, type: string , buytype1: string, buytype2: string, paycnt: string, buyselid: number, shopid: number, groupid: number, price_auth_type = undefined, pactid = undefined, postid = undefined) //手入力の場合は等がないのでエラー回避のためif文を追加
	{
		this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice(" + productid + ", " + carid + ", " + type + ", " + buytype1 + ", " + buytype2 + ", " + paycnt + ", " + buyselid + ", " + shopid + ", " + groupid + ")");
		let H_price: any = Array();

		if (productid != undefined && carid != undefined && type != undefined && true == !isNaN(Number(buytype1)) && true == !isNaN(Number(buytype2))&& true == !isNaN(Number(paycnt)) && true == !isNaN(Number(buyselid)) && true == !isNaN(Number(shopid)) && true == !isNaN(Number(groupid))) //引数追加 20090722miya
			{
				const ppid = this.getPPID(carid, type);
				const pricelistid = await this.getPricelistID(ppid, shopid, groupid, price_auth_type, pactid, postid);

				if ("" != pricelistid) {
					var select_sql = "SELECT downmoney, totalprice, buyselid FROM price_detail_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + "buytype1 = " + this.getDB().dbQuote(buytype1, "integer", true) + " AND " + "buytype2 = " + this.getDB().dbQuote(buytype2, "integer", true) + " AND " + "paycnt = " + this.getDB().dbQuote(paycnt, "integer", true) + " AND " + "buyselid = " + this.getDB().dbQuote(buyselid, "integer", true) + " AND " + "productid = ";

					if (true == Array.isArray(productid)) {
						var count_productid = productid.length;

						for (var i = 0; i < count_productid; i++) {
							var select_sql_x = select_sql + this.getDB().dbQuote(productid[i], "integer", true);
							this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()sql->" + select_sql_x);
							H_price[productid[i]] = this.getDB().queryRowHash(select_sql_x);
						}
					} else {
						select_sql += this.getDB().dbQuote(productid, "integer", true);
						this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()sql->" + select_sql);
						H_price = this.getDB().queryRowHash(select_sql);
					}
				} else {
					this.getOut().debugOut(`model/Price/UserPriceModel::getNowPrice()${pricelistid}がない`);
					return false;
				}
			} else {
			this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()手入力扱い");
		}

		return H_price;
	}

	getNowPriceFromPriceDetailID(price_detailid: any, shopid: any, groupid: any) {
		const ppid = this.getPPIDfromPrceDetailID(price_detailid);
		const pricelistid = this.getPricelistID(ppid, shopid, groupid);
		const select_sql = "SELECT " + "nowprice.downmoney, " + "nowprice.totalprice, " + "nowprice.buyselid " + "FROM " + "price_detail_tb nowprice " + "INNER JOIN " + "price_detail_tb oldprice ON " + "nowprice.buytype1 = oldprice.buytype1 AND " + "nowprice.buytype2 = oldprice.buytype2 AND " + "nowprice.paycnt = oldprice.paycnt AND " + "nowprice.buyselid = oldprice.buyselid AND " + "nowprice.productid = oldprice.productid " + "WHERE " + "nowprice.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + "oldprice.price_detailid = " + this.getDB().dbQuote(price_detailid, "integer", true);
		return this.getDB().queryRowHash(select_sql);
	}

	getPricelistID(ppid: any, shopid: number, groupid: number, price_auth_type: any = undefined, pactid: any = undefined, postid: any = undefined) {
		if (!pactid && this.PactID) {
			pactid = this.PactID;
		}

		if (!postid && this.PostID) {
			postid = this.PostID;
		}

		if (!price_auth_type) {
			price_auth_type = this.checkPriceAuthType();
		}

		let join_sql = "";
		let where_sql = "plt.delflg = FALSE AND ";
		let where_shop = "prt.shopid";

		if ("fnc_mt_price_admin" === String(price_auth_type)) {
			pactid = 0;
			postid = 0;
			shopid = 0;
			var defaultflg = true;
			where_shop = "plt.shopid";
		} else if ("fnc_mt_price_shop" === String(price_auth_type)) {
			postid = 0;
			postid = 0;
			defaultflg = true;
			where_shop = "plt.shopid";
		} else if ("fnc_mt_price_pact" === String(price_auth_type)) {
			postid = 0;
			defaultflg = false;
			join_sql = "INNER JOIN " + "price_relation_tb prt ON prt.pricelistid = plt.pricelistid ";
			where_sql += "prt.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "plt.dateto >= " + this.getDB().dbQuote(this.getDB().getToday(), "string", true) + " AND " + "prt.postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND ";
		} else if ("fnc_mt_price_post" === String(price_auth_type)) {
			defaultflg = false;
			join_sql = "INNER JOIN " + "price_relation_tb prt ON prt.pricelistid = plt.pricelistid ";
			where_sql += "prt.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "plt.dateto >= " + this.getDB().dbQuote(this.getDB().getToday(), "string", true) + " AND " + "prt.postid = " + this.getDB().dbQuote(postid, "integer", true) + " AND ";
		} else {
			return undefined;
		}

		const select_sql = "SELECT " + "plt.pricelistid " + "FROM " + "pricelist_tb plt " + join_sql + "WHERE " + where_sql + where_shop + " = " + this.getDB().dbQuote(shopid, "integer", true) + " AND " + "plt.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "plt.ppid = " + this.getDB().dbQuote(ppid, "integer", true) + " AND " + "plt.datefrom <= " + this.getDB().dbQuote(this.getDB().getToday(), "string", true) + " AND " + "plt.defaultflg = " + this.getDB().dbQuote(defaultflg, "boolean", true) + " ORDER BY plt.datefrom DESC, plt.fixdate DESC, plt.pricelistid DESC LIMIT 1";
		return this.getDB().queryOne(select_sql);
	}

	async getStocklist(shopid: number) {
		const select_sql = "SELECT " + "stock_a.productid, stock_a.status, product_branch_tb.property " + "FROM " + "stock_tb stock_a " + "INNER JOIN " + "product_branch_tb ON product_branch_tb.productid = stock_a.productid AND product_branch_tb.branchid = stock_a.branchid, " + "(SELECT productid, max(status) AS status FROM stock_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " GROUP BY productid) stock_b " + "WHERE " + "stock_a.productid = stock_b.productid AND stock_a.status = stock_b.status AND stock_a.shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		const A_temp = await this.getDB().queryHash(select_sql);
		const H_temp = Array();
		const listcnt = A_temp.length;

		for (var cnt = 0; cnt < listcnt; cnt++) {
			H_temp[A_temp[cnt].productid] = A_temp[cnt].status;
		}

		return H_temp;
	}

	getCarrierShop(carid: number) {
		if (!this.PactID) {
			this.errorOut(0, "PactID がセットされていません");
		}

		if (!this.PostID) {
			this.errorOut(0, "PostID がセットされていません");
		}

		const select_sql = "SELECT shop_relation_tb.shopid, shop_tb.groupid FROM shop_relation_tb INNER JOIN shop_tb ON shop_relation_tb.shopid = shop_tb.shopid WHERE shop_relation_tb.postid = " + this.getDB().dbQuote(this.PostID, "integer", true) + " AND shop_relation_tb.pactid = " + this.getDB().dbQuote(this.PactID, "integer", true) + " AND shop_relation_tb.carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryRowHash(select_sql);
	}

	getOrderableCarrier(pactid: number, postid: number) {
		const select_sql = "SELECT carid FROM shop_relation_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND postid = " + this.getDB().dbQuote(postid, "integer", true) + " ORDER BY carid";
		return this.getDB().queryCol(select_sql);
	}

	returnMailStatus(pricelistid: number) {
		const sql = "SELECT " + "mailstatus " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(sql);
	}

};
