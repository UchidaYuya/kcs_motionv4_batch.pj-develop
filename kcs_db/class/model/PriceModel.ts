//価格表系基底

import ModelBase from "./ModelBase";
import FuncModel from "./FuncModel";
import CircuitModel from "./CircuitModel";

export default class PriceModel extends ModelBase {
	static AdminMode = "fnc_mt_price_admin";
	static ShopMode = "fnc_mt_price_shop";
	static PactMode = "fnc_mt_price_pact";
	static PostMode = "fnc_mt_price_post";

	constructor() {
		super();
	}

	getPPID(carid: number, type: string | undefined = undefined) {
		let select_sql: string; 
		if (!type) {
			select_sql = "SELECT type,ppid FROM mt_order_pattern_tb WHERE carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND ppid IS NOT NULL AND type IN('N', 'A') GROUP BY type,ppid";
			const A_tmp = this.getDB().queryHash(select_sql);
			const H_tmp = Array();

			for (var key in A_tmp) {
				var value = A_tmp[key];
				H_tmp[value.type] = value.ppid;
			}

			return H_tmp;
		} else {
			select_sql = "SELECT ppid FROM mt_order_pattern_tb WHERE carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND ppid IS NOT NULL AND type = " + this.getDB().dbQuote(type, "text", true) + " GROUP BY ppid";
			return this.getDB().queryOne(select_sql);
		}
	}

	getPPIDfromPricelistID(pricelistid: number) {
		const select_sql = "SELECT ppid FROM pricelist_tb WHERE pricelistid = " + pricelistid;
		return this.getDB().queryOne(select_sql);
	}

	getPPIDfromPrceDetailID(price_detailid: number) {
		const select_sql = "SELECT pricelist_tb.ppid FROM pricelist_tb INNER JOIN price_detail_tb ON pricelist_tb.pricelistid = price_detail_tb.pricelistid  WHERE price_detail_tb.price_detailid =" + this.getDB().dbQuote(price_detailid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPPName(ppid: number) {
		const select_sql = "SELECT ppname FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	async getPriceList(pricelistid: number, buytype1 = undefined, buytype2 = undefined, cir = undefined) //取得したパターン一覧で、掲載可能な価格表IDを取得
	{
		const H_pricelist_memo = this.getPriceMemoSimple(pricelistid, "productid_hash_notdelete");

		require("model/CircuitModel.php");

		const circuitModel = new CircuitModel();
		const otherCirids = await circuitModel.getCiridOfOthersNamed();

		if (cir) {
			if (!(-1 !== otherCirids.indexOf(cir))) {
				for (var key in H_pricelist_memo) {
					var value = H_pricelist_memo[key];

					if (cir != value.cirid) {
						delete H_pricelist_memo[key];
					}
				}
			}
		}

		const AH_pricelist_detail = await this.getPriceDetailSimple(pricelistid);
		const count_pricelist_detail = AH_pricelist_detail.length;

		for (var cnt = 0; cnt < count_pricelist_detail; cnt++) {
			if (false == (undefined !== H_pricelist_memo[AH_pricelist_detail[cnt].productid])) {
				continue;
			}

			H_pricelist_memo[AH_pricelist_detail[cnt].productid][AH_pricelist_detail[cnt].buytype1][AH_pricelist_detail[cnt].buytype2][AH_pricelist_detail[cnt].paycnt][AH_pricelist_detail[cnt].buyselid].downmoney = AH_pricelist_detail[cnt].downmoney;
			H_pricelist_memo[AH_pricelist_detail[cnt].productid][AH_pricelist_detail[cnt].buytype1][AH_pricelist_detail[cnt].buytype2][AH_pricelist_detail[cnt].paycnt][AH_pricelist_detail[cnt].buyselid].onepay = AH_pricelist_detail[cnt].onepay;
			H_pricelist_memo[AH_pricelist_detail[cnt].productid][AH_pricelist_detail[cnt].buytype1][AH_pricelist_detail[cnt].buytype2][AH_pricelist_detail[cnt].paycnt][AH_pricelist_detail[cnt].buyselid].totalprice = AH_pricelist_detail[cnt].totalprice;
			H_pricelist_memo[AH_pricelist_detail[cnt].productid][AH_pricelist_detail[cnt].buytype1][AH_pricelist_detail[cnt].buytype2][AH_pricelist_detail[cnt].paycnt][AH_pricelist_detail[cnt].buyselid].price_detailid = AH_pricelist_detail[cnt].price_detailid;
		}

		return H_pricelist_memo;
	}

	getPriceListData(pricelistid: number, buytype1 = undefined, buytype2 = undefined) {
		let buytype_sql = "";

		if (buytype1 && (!buytype2 || buytype1 > buytype2)) {
			buytype_sql = "price_detail_tb.buytype1 >= " + this.getDB().dbQuote(buytype1, "integer", true) + " AND ";
		} else if (buytype1 && buytype2 && buytype1 <= buytype2) {
			buytype_sql = "price_detail_tb.buytype1 >= " + this.getDB().dbQuote(buytype1, "integer", true) + " AND price_detail_tb.buytype2 <= " + this.getDB().dbQuote(buytype2, "integer", true) + " AND ";
		}

		const select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.shopid, " + "pricelist_tb.carid, " + "product_tb.cirid, " + "pricelist_tb.ppid, " + "pricelist_tb.pricename, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.groupid, " + "product_tb.productid, " + "product_tb.productname, " + "product_tb.product_url, " + "price_detail_tb.price_detailid, " + "price_detail_tb.buytype1, " + "price_detail_tb.buytype2, " + "price_detail_tb.paycnt, " + "price_detail_tb.downmoney, " + "price_detail_tb.onepay, " + "price_detail_tb.totalprice, " + "price_detail_tb.buyselid, " + "pricelist_memo_tb.memo " + "FROM " + "pricelist_tb " + "INNER JOIN " + "pricelist_memo_tb ON pricelist_tb.pricelistid = pricelist_memo_tb.pricelistid " + "INNER JOIN " + "product_tb ON pricelist_memo_tb.productid = product_tb.productid " + "LEFT JOIN " + "price_detail_tb ON pricelist_tb.pricelistid = price_detail_tb.pricelistid " + "WHERE " + "pricelist_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + buytype_sql + " pricelist_tb.delflg = false AND product_tb.delflg = false " + "ORDER BY pricelist_memo_tb.sort";
		return this.getDB().queryHash(select_sql);
	}

	async getNewestDefaultPricelist(groupid: number, shopid = 0) {
		let select_sql = "SELECT ppid FROM pricelist_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND defaultflg = true GROUP BY ppid ORDER BY ppid";
		const A_ppidlist = await this.getDB().queryCol(select_sql);
		let H_ppid_name = Array();
		const count_ppidlist = A_ppidlist.length;

		for (var cnt = 0; cnt < count_ppidlist; cnt++) {
			select_sql = "SELECT pricelistid, pricename FROM pricelist_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND ppid = " + this.getDB().dbQuote(A_ppidlist[cnt], "integer", true) + " AND defaultflg = true AND CURRENT_DATE >= datefrom AND delflg = false ORDER BY datefrom DESC, pricelistid DESC LIMIT 1";
			H_ppid_name = H_ppid_name + await this.getDB().queryAssoc(select_sql);
		}

		return H_ppid_name;
	}

	async changePricelistDelflag(pricelistid: number, delflag: number) {
		const update_sql = "UPDATE pricelist_tb SET delflg = " + this.getDB().dbQuote(delflag, "boolean", true) + ", fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		this.getDB().beginTransaction();
		const res = await this.getDB().exec(update_sql);

		if (res !== 1) {
			this.getDB().rollback();
			return -1;
		}

		this.getDB().commit();
		return 1;
	}

	getAdminPricelist(type: string, groupid: number, add_where: string = "") {
		const select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.shopid, " + "pricelist_tb.carid, " + "carrier_tb.carname, " + "pricelist_tb.pricename, " + "price_pattern_tb.ppname, " + "(CASE WHEN current_date < datefrom THEN -1 WHEN current_date > dateto THEN 2 ELSE 1 END) AS status, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.defaultflg " + "FROM " + "pricelist_tb " + "INNER JOIN " + "price_pattern_tb ON pricelist_tb.ppid = price_pattern_tb.ppid " + "INNER JOIN " + "carrier_tb ON pricelist_tb.carid = carrier_tb.carid " + "WHERE " + add_where + "pricelist_tb.shopid = 0 AND " + "pricelist_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "pricelist_tb.delflg = false " + "ORDER BY " + "pricelist_tb.fixdate DESC";

		if (type == "assoc") {
			return this.getDB().queryAssoc(select_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(select_sql);
		} else {
			return this.getDB().queryHash(select_sql);
		}
	}

	getCarPattern(carid: number) {
		const select_sql = "SELECT " + "pricepattern " + "FROM " + "pricelist_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " GROUP BY pricepattern";
		return this.getDB().queryHash(select_sql);
	}

	getPriceTemplate(ppid: number) {
		return this.getDB().queryOne("SELECT usertplfile FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true));
	}

	getPriceHeader(pricelistid: number) {
		const select_sql = "SELECT " + "listheader " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceFooter(pricelistid: number) {
		const select_sql = "SELECT " + "listfooter " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	async getPriceComment(pricelistid: number) {
		const select_sql = "SELECT " + "sortcomment,listcomment " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		const A_rval = await this.getDB().queryHash(select_sql);
		if (0 == A_rval.length) return Array();
		return A_rval[0];
	}

	addPriceComment(H_src: {} | any[], H_comment: any) //コメントが無ければ元の価格表をそのまま返す
	//まだコメントを追加していなければ、末尾に追加する
	{
		if (0 == H_comment.length || false == (undefined !== H_comment.sortcomment) || false == !isNaN(Number(H_comment.sortcomment)) || false == (undefined !== H_comment.listcomment)) return H_src;
		const H_tgt = Array();

		for (let H_line of Object.values(H_src)) //まだコメントを追加しておらず、
		{
			if (0 != H_comment.length && undefined !== H_line.sort && H_comment.sortcomment <= H_line.sort) {
				H_tgt.push({
					is_comment: 1,
					comment: H_comment.listcomment
				});
				H_comment = Array();
			}

			H_tgt.push(H_line);
		}

		if (0 != H_comment.length) {
			H_tgt.push({
				is_comment: 1,
				comment: H_comment.listcomment
			});
		}

		return H_tgt;
	}

	getPactHadShopPriceFunction(type: string, A_pactidlist = undefined) {
		const O_Func = new FuncModel();
		return O_Func.getPactHadFunction(type, [PriceModel.PactMode, PriceModel.PostMode], A_pactidlist);
	}

	getCaridFromPPID(ppid: number) {
		const select_sql = "SELECT carid FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getCaridFromPricelistID(pricelistid: number) {
		const select_sql = "SELECT carid FROM pricelist_tb WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getAllPricelistOutline(groupid: number, shopid = 0) {}

	getPublishedPactCount(pricelistid: number) {
		const select_sql = "SELECT " + "price_relation_tb.pactid " + "FROM " + "price_relation_tb " + "WHERE " + "price_relation_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " " + "GROUP BY " + "price_relation_tb.pactid";
		return this.getDB().queryCol(select_sql);
	}

	judgeUnableDeletePricelist(shopid: number) {
		const select_sql = "SELECT " + "pricelistid " + "FROM " + "pricelist_tb " + "WHERE " + "pricelist_tb.defaultflg = true AND " + "pricelist_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND " + "current_date < pricelist_tb.datefrom " + "ORDER BY " + "pricelist_tb.datefrom " + "DESC LIMIT 1";
		return this.getDB().queryOne(select_sql);
	}

	getShopIDFromPricelistID(pricelistid: number) {
		const select_sql = "SELECT " + "shopid " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceListName(pricelistid: number) {
		const sql = "select pricename from pricelist_tb where pricelistid = " + pricelistid;
		return this.getDB().queryOne(sql);
	}

	getPriceListSimple(pricelistid: number) {
		const sql = "select * from pricelist_tb where delflg = false and pricelistid = " + pricelistid;
		return this.getDB().queryRowHash(sql);
	}

	async getPriceMemoSimple(pricelistid: number, type: string | undefined = undefined) {
		if ("productid_hash_notdelete" === type) {
			let sql = "SELECT " + "pricelist_memo_tb.productid, " + "pricelist_memo_tb.memo, " + "product_tb.productname, " + "product_tb.carid, " + "product_tb.cirid, " + "product_tb.product_url, " + "pricelist_memo_tb.sort " + "FROM " + "pricelist_memo_tb " + "INNER JOIN " + "product_tb ON pricelist_memo_tb.productid = product_tb.productid " + "WHERE " + "pricelist_memo_tb.pricelistid = " + pricelistid + " AND " + "product_tb.delflg = false " + "ORDER BY " + "pricelist_memo_tb.sort";
			const A_temp = await this.getDB().queryHash(sql);
			const H_temp = Array();
			const count_tmp = A_temp.length;

			for (var cnt = 0; cnt < count_tmp; cnt++) {
				H_temp[A_temp[cnt].productid].memo = A_temp[cnt].memo;
				H_temp[A_temp[cnt].productid].productname = A_temp[cnt].productname;
				H_temp[A_temp[cnt].productid].product_url = A_temp[cnt].product_url;
				H_temp[A_temp[cnt].productid].carid = A_temp[cnt].carid;
				H_temp[A_temp[cnt].productid].cirid = A_temp[cnt].cirid;
				H_temp[A_temp[cnt].productid].sort = A_temp[cnt].sort;
			}

			return H_temp;
		} else {
			const sql = "select * from pricelist_memo_tb where pricelistid = " + pricelistid + " order by sort";
			return this.getDB().queryHash(sql);
		}
	}

	getPriceDetailSimple(pricelistid: number) {
		const sql = "select * from price_detail_tb where pricelistid = " + pricelistid + " order by price_detailid";
		return this.getDB().queryHash(sql);
	}

	async chkPriceListId(groupid: number, pricelistid: number, delflg = false) {
		let where = "";

		if (delflg === false) {
			where = " and delflg = false";
		}

		const sql = "select count(*) from pricelist_tb where " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + where;
		const ret = await this.getDB().queryOne(sql);

		if (ret > 0) {
			return true;
		}

		return false;
	}

};
