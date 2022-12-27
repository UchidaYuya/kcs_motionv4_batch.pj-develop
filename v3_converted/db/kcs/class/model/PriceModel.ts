//
//価格表系基底
//
//更新履歴
//2008/06/26	石崎公久	作成
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//
//
//
//価格表系基底
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("model/ModelBase.php");

require("model/FuncModel.php");

//
//コンストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//getPPID
//
//@author ishizaki
//@since 2008/08/04
//
//@param mixed $carid
//@param mixed $type
//@access public
//@return void
//
//
//getPPIDfromPricelistID
//
//@author ishizaki
//@since 2008/08/21
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPPIDfromPrceDetailID
//
//@author ishizaki
//@since 2008/08/21
//
//@param mixed $price_detailid
//@access public
//@return void
//
//
//getPPName
//
//@author ishizaki
//@since 2008/08/06
//
//@param mixed $ppid
//@access public
//@return void
//
//
//getPriceList
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPriceListData
//
//@author ishizaki
//@since 2008/07/02
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getNewestDefaultPricelist
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $groupid
//@param int $shopid
//@access public
//@return void
//
//
//changePricelistDelflag
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $pricelistid
//@param mixed $delflag
//@access public
//@return void
//
//
//getAdminPricelist
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $type
//@param mixed $shopid
//@param mixed $groupid
//@param string $add_where
//@access public
//@return void
//
//
//指定されたキャリアの価格表パターンの一覧を取得
//
//@author ishizaki
//@since 2008/07/01
//
//@param mixed $carid
//@param mixed $shopid
//@param mixed $groupid
//@access public
//@return void
//
//
//getPriceTemplate
//
//@author ishizaki
//@since 2008/08/01
//
//@param mixed $ppid
//@access public
//@return void
//
//
//getPriceHeader
//
//@author ishizaki
//@since 2008/07/03
//
//@access public
//@return void
//
//
//getPriceFooter
//
//@author ishizaki
//@since 2008/07/03
//
//@access public
//@return void
//
//
//getPriceComment
//
//@author morihara
//@since 2010/06/15
//
//@access public
//@return array
//
//
//addPriceComment
//
//@author morihara
//@since 2010/06/15
//
//@access public
//@return array
//
//
//getPactHadShopPriceFunction
//
//@author ishizaki
//@since 2008/08/06
//
//@param mixed $type
//@param mixed $A_pactidlist
//@access public
//@return void
//
//
//getCaridFromPPID
//
//@author ishizaki
//@since 2008/08/06
//
//@param mixed $ppid
//@access public
//@return void
//
//
//getCaridFromPricelistID
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getAllPricelistOutline
//
//@author ishizaki
//@since 2008/08/05
//
//@param mixed $groupid
//@param int $shopid
//@access public
//@return void
//
//
//getPublishedPactCount
//
//@author ishizaki
//@since 2008/08/08
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//judgeUnableDeletePricelist
//
//@author ishizaki
//@since 2008/08/08
//
//@param mixed $shopid
//@access public
//@return void
//
//
//getShopIDFromPricelistID
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPriceListName
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPriceListSimple
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPriceMemoSimple
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//getPriceDetailSimple
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
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
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class PriceModel extends ModelBase {
	static AdminMode = "fnc_mt_price_admin";
	static ShopMode = "fnc_mt_price_shop";
	static PactMode = "fnc_mt_price_pact";
	static PostMode = "fnc_mt_price_post";

	constructor() {
		super();
	}

	getPPID(carid, type = undefined) {
		if (true == is_null(type)) {
			var select_sql = "SELECT type,ppid FROM mt_order_pattern_tb WHERE carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND ppid IS NOT NULL AND type IN('N', 'A') GROUP BY type,ppid";
			var A_tmp = this.getDB().queryHash(select_sql);
			var H_tmp = Array();

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

	getPPIDfromPricelistID(pricelistid) {
		var select_sql = "SELECT ppid FROM pricelist_tb WHERE pricelistid = " + pricelistid;
		return this.getDB().queryOne(select_sql);
	}

	getPPIDfromPrceDetailID(price_detailid) {
		var select_sql = "SELECT pricelist_tb.ppid FROM pricelist_tb INNER JOIN price_detail_tb ON pricelist_tb.pricelistid = price_detail_tb.pricelistid  WHERE price_detail_tb.price_detailid =" + this.getDB().dbQuote(price_detailid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPPName(ppid) {
		var select_sql = "SELECT ppname FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceList(pricelistid, buytype1 = undefined, buytype2 = undefined, cir = undefined) //取得したパターン一覧で、掲載可能な価格表IDを取得
	{
		var H_pricelist_memo = this.getPriceMemoSimple(pricelistid, "productid_hash_notdelete");

		require("model/CircuitModel.php");

		var circuitModel = new CircuitModel();
		var otherCirids = circuitModel.getCiridOfOthersNamed();

		if (!is_null(cir)) {
			if (!(-1 !== otherCirids.indexOf(cir))) {
				for (var key in H_pricelist_memo) {
					var value = H_pricelist_memo[key];

					if (cir != value.cirid) {
						delete H_pricelist_memo[key];
					}
				}
			}
		}

		var AH_pricelist_detail = this.getPriceDetailSimple(pricelistid);
		var count_pricelist_detail = AH_pricelist_detail.length;

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

	getPriceListData(pricelistid, buytype1 = undefined, buytype2 = undefined) {
		var buytype_sql = "";

		if (false == is_null(buytype1) && (true == is_null(buytype2) || buytype1 > buytype2)) {
			buytype_sql = "price_detail_tb.buytype1 >= " + this.getDB().dbQuote(buytype1, "integer", true) + " AND ";
		} else if (false == is_null(buytype1) && false == is_null(buytype2) && buytype1 <= buytype2) {
			buytype_sql = "price_detail_tb.buytype1 >= " + this.getDB().dbQuote(buytype1, "integer", true) + " AND price_detail_tb.buytype2 <= " + this.getDB().dbQuote(buytype2, "integer", true) + " AND ";
		}

		var select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.shopid, " + "pricelist_tb.carid, " + "product_tb.cirid, " + "pricelist_tb.ppid, " + "pricelist_tb.pricename, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.groupid, " + "product_tb.productid, " + "product_tb.productname, " + "product_tb.product_url, " + "price_detail_tb.price_detailid, " + "price_detail_tb.buytype1, " + "price_detail_tb.buytype2, " + "price_detail_tb.paycnt, " + "price_detail_tb.downmoney, " + "price_detail_tb.onepay, " + "price_detail_tb.totalprice, " + "price_detail_tb.buyselid, " + "pricelist_memo_tb.memo " + "FROM " + "pricelist_tb " + "INNER JOIN " + "pricelist_memo_tb ON pricelist_tb.pricelistid = pricelist_memo_tb.pricelistid " + "INNER JOIN " + "product_tb ON pricelist_memo_tb.productid = product_tb.productid " + "LEFT JOIN " + "price_detail_tb ON pricelist_tb.pricelistid = price_detail_tb.pricelistid " + "WHERE " + "pricelist_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + buytype_sql + " pricelist_tb.delflg = false AND product_tb.delflg = false " + "ORDER BY pricelist_memo_tb.sort";
		return this.getDB().queryHash(select_sql);
	}

	getNewestDefaultPricelist(groupid, shopid = 0) {
		var select_sql = "SELECT ppid FROM pricelist_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND defaultflg = true GROUP BY ppid ORDER BY ppid";
		var A_ppidlist = this.getDB().queryCol(select_sql);
		var H_ppid_name = Array();
		var count_ppidlist = A_ppidlist.length;

		for (var cnt = 0; cnt < count_ppidlist; cnt++) {
			select_sql = "SELECT pricelistid, pricename FROM pricelist_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND ppid = " + this.getDB().dbQuote(A_ppidlist[cnt], "integer", true) + " AND defaultflg = true AND CURRENT_DATE >= datefrom AND delflg = false ORDER BY datefrom DESC, pricelistid DESC LIMIT 1";
			H_ppid_name = H_ppid_name + this.getDB().queryAssoc(select_sql);
		}

		return H_ppid_name;
	}

	changePricelistDelflag(pricelistid, delflag) {
		var update_sql = "UPDATE pricelist_tb SET delflg = " + this.getDB().dbQuote(delflag, "boolean", true) + ", fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (res !== 1) {
			this.getDB().rollback();
			return -1;
		}

		this.getDB().commit();
		return 1;
	}

	getAdminPricelist(type, groupid, add_where = "") {
		var select_sql = "SELECT " + "pricelist_tb.pricelistid, " + "pricelist_tb.shopid, " + "pricelist_tb.carid, " + "carrier_tb.carname, " + "pricelist_tb.pricename, " + "price_pattern_tb.ppname, " + "(CASE WHEN current_date < datefrom THEN -1 WHEN current_date > dateto THEN 2 ELSE 1 END) AS status, " + "pricelist_tb.datefrom, " + "pricelist_tb.dateto, " + "pricelist_tb.defaultflg " + "FROM " + "pricelist_tb " + "INNER JOIN " + "price_pattern_tb ON pricelist_tb.ppid = price_pattern_tb.ppid " + "INNER JOIN " + "carrier_tb ON pricelist_tb.carid = carrier_tb.carid " + "WHERE " + add_where + "pricelist_tb.shopid = 0 AND " + "pricelist_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "pricelist_tb.delflg = false " + "ORDER BY " + "pricelist_tb.fixdate DESC";

		if (type == "assoc") {
			return this.getDB().queryAssoc(select_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(select_sql);
		} else {
			return this.getDB().queryHash(select_sql);
		}
	}

	getCarPattern(carid) {
		var select_sql = "SELECT " + "pricepattern " + "FROM " + "pricelist_tb " + "WHERE " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " GROUP BY pricepattern";
		return this.getDB().queryHash(select_sql);
	}

	getPriceTemplate(ppid) {
		return this.getDB().queryOne("SELECT usertplfile FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true));
	}

	getPriceHeader(pricelistid) {
		var select_sql = "SELECT " + "listheader " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceFooter(pricelistid) {
		var select_sql = "SELECT " + "listfooter " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceComment(pricelistid) {
		var select_sql = "SELECT " + "sortcomment,listcomment " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		var A_rval = this.getDB().queryHash(select_sql);
		if (0 == A_rval.length) return Array();
		return A_rval[0];
	}

	addPriceComment(H_src: {} | any[], H_comment: {} | any[]) //コメントが無ければ元の価格表をそのまま返す
	//まだコメントを追加していなければ、末尾に追加する
	{
		if (0 == H_comment.length || false == (undefined !== H_comment.sortcomment) || false == is_numeric(H_comment.sortcomment) || false == (undefined !== H_comment.listcomment)) return H_src;
		var H_tgt = Array();

		for (var H_line of Object.values(H_src)) //まだコメントを追加しておらず、
		//コメントの出現順が価格表の行の出現順より小さいか等しければ、
		//その行より前にコメントを追加する
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

	getPactHadShopPriceFunction(type, A_pactidlist = undefined) {
		var O_Func = new FuncModel();
		return O_Func.getPactHadFunction(type, [PriceModel.PactMode, PriceModel.PostMode], A_pactidlist);
	}

	getCaridFromPPID(ppid) {
		var select_sql = "SELECT carid FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getCaridFromPricelistID(pricelistid) {
		var select_sql = "SELECT carid FROM pricelist_tb WHERE pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getAllPricelistOutline(groupid, shopid = 0) {}

	getPublishedPactCount(pricelistid) {
		var select_sql = "SELECT " + "price_relation_tb.pactid " + "FROM " + "price_relation_tb " + "WHERE " + "price_relation_tb.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " " + "GROUP BY " + "price_relation_tb.pactid";
		return this.getDB().queryCol(select_sql);
	}

	judgeUnableDeletePricelist(shopid) {
		var select_sql = "SELECT " + "pricelistid " + "FROM " + "pricelist_tb " + "WHERE " + "pricelist_tb.defaultflg = true AND " + "pricelist_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND " + "current_date < pricelist_tb.datefrom " + "ORDER BY " + "pricelist_tb.datefrom " + "DESC LIMIT 1";
		return this.getDb().queryOne(select_sql);
	}

	getShopIDFromPricelistID(pricelistid) {
		var select_sql = "SELECT " + "shopid " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPriceListName(pricelistid) {
		var sql = "select pricename from pricelist_tb where pricelistid = " + pricelistid;
		return this.getDB().queryOne(sql);
	}

	getPriceListSimple(pricelistid) {
		var sql = "select * from pricelist_tb where delflg = false and pricelistid = " + pricelistid;
		return this.getDB().queryRowHash(sql);
	}

	getPriceMemoSimple(pricelistid, type = undefined) {
		if ("productid_hash_notdelete" === type) {
			var sql = "SELECT " + "pricelist_memo_tb.productid, " + "pricelist_memo_tb.memo, " + "product_tb.productname, " + "product_tb.carid, " + "product_tb.cirid, " + "product_tb.product_url, " + "pricelist_memo_tb.sort " + "FROM " + "pricelist_memo_tb " + "INNER JOIN " + "product_tb ON pricelist_memo_tb.productid = product_tb.productid " + "WHERE " + "pricelist_memo_tb.pricelistid = " + pricelistid + " AND " + "product_tb.delflg = false " + "ORDER BY " + "pricelist_memo_tb.sort";
			var A_temp = this.getDB().queryHash(sql);
			var H_temp = Array();
			var count_tmp = A_temp.length;

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
			sql = "select * from pricelist_memo_tb where pricelistid = " + pricelistid + " order by sort";
			return this.getDB().queryHash(sql);
		}
	}

	getPriceDetailSimple(pricelistid) {
		var sql = "select * from price_detail_tb where pricelistid = " + pricelistid + " order by price_detailid";
		return this.getDB().queryHash(sql);
	}

	chkPriceListId(groupid, pricelistid, delflg = false) {
		var where = "";

		if (delflg === false) {
			where = " and delflg = false";
		}

		var sql = "select count(*) from pricelist_tb where " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + where;
		var ret = this.getDB().queryOne(sql);

		if (ret > 0) {
			return true;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};