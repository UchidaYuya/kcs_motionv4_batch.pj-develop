//
//商品マスター
//
//更新履歴
//2008/07/08	石崎公久	作成
//2009/01/15	関連づけ一覧のソートを商品名でソート
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/08
//
//
//
//商品マスター
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/08
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("model/PostModel.php");

require("model/PlanModel.php");

require("model/PacketModel.php");

require("model/OptionModel.php");

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
//getProductName
//
//@author ishizaki
//@since 2008/07/15
//
//@param mixed $productid
//@access public
//@return void
//
//
//getProductNameList
//
//@author katsushi
//@since 2008/08/07
//
//@param array $A_productid
//@access public
//@return void
//
//
//getProductNameAndCiridList
//
//@author hanashima
//@since 2020/06/10
//
//@param array $A_productid
//@access public
//@return void
//
//
//getProductDetail
//
//@author ishizaki
//@since 2008/07/15
//
//@param mixed $groupid
//@param mixed $productid
//@access public
//@return void
//
//
//getProductDetailFull
//
//@author katsushi
//@since 2008/07/25
//
//@param mixed $groupid
//@param mixed $productid
//@access public
//@return void
//
//
//商品マスター＆枝番のデータをゲットできるSQLの基本形を返す
//
//SQLを各々の句(SELECT句など)をハッシュに格納されて返される<br>
//条件に追加がある場合は返されたハッシュに追記すれば良い
//
//@author ishizaki
//@since 2008/07/09
//
//@param mixed $productid
//@access public
//@return array
//
//
//enableProductList
//
//@author ishizaki
//@since 2008/07/17
//
//@param mixed $groupid
//@access public
//@return void
//
//
//渡されたproductidに紐づいた子プロダクトの一覧を返す
//
//@author ishizaki
//@since 2008/08/20
//
//@param mixed $productid
//@access public
//@return void
//
//
//enableProductListTel
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $groupid
//@param int $carid
//@access public
//@return void
//
//
//enableProductListAcc
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $groupid
//@param int $carid
//@access public
//@return void
//
//
//checkProductProperty
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $productid
//@param mixed $property
//@access public
//@return void
//
//
//enableJoinedProductList
//
//@author ishizaki
//@since 2008/07/17
//
//@param mixed $groupid
//@access public
//@return void
//
//
//enableStockList
//
//@author ishizaki
//@since 2008/07/24
//
//@param mixed $groupid
//@param mixed $shopid
//@param mixed $productname
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getStockDetails
//
//@author ishizaki
//@since 2008/07/23
//
//@param mixed $shopid
//@param mixed $productid
//@param mixed $branchi
//@access public
//@return void
//
//
//キャリア（と回線）で絞られたシリーズ配列を返す
//電話だけ
//
//@author houshiyama
//@since 2008/07/25
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//機種取得
//procudtidをキー、productnameを値にして返す
//電話だけ
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $carid
//@param string $cirid
//@param string $seriesname
//@access public
//@return void
//
//
//機種取得
//procudtid:productnameをキー、productnameを値にして返す
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $carid
//@param string $cirid
//@param string $seriesname
//@access public
//@return void
//
//
//色取得
//branchidをキー、propertyを値にして返す
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $productid
//@access public
//@return void
//
//
//色取得
//branchid:propertyをキー、propertyを値にして返す
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $productid
//@access public
//@return void
//
//
//付属品取得
//productidをキー、productnameを値にして返す
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $productid
//@access public
//@return void
//
//
//chkProductId
//
//@author katsushi
//@since 2008/09/02
//
//@param mixed $groupid
//@param mixed $productid
//@param mixed $enableflg
//@access public
//@return void
//
//
//getProductIdFromName
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $groupid
//@param mixed $productname
//@param mixed $delflg
//@access public
//@return void
//
//
//productidからsearchcaridを取得
//
//@author houshiyama
//@since 2009/06/05
//
//@param mixed $productid
//@access public
//@return void
//
//
//productidからsearchciridを取得
//
//@author houshiyama
//@since 2009/06/05
//
//@param mixed $productid
//@access public
//@return void
//
//
//productidからseriesを取得
//
//@author houshiyama
//@since 2009/06/05
//
//@param mixed $productid
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
class ProductModel extends ModelBase {
	constructor() {
		super();
	}

	getProductName(productid) {
		return this.getDB().queryOne("SELECT productname FROM product_tb WHERE productid = " + this.getDB().dbQuote(productid, "integer", true));
	}

	getProductNameList(A_productid: {} | any[]) {
		var sql = "select productid, productname from product_tb where productid in (" + A_productid.join(",") + ")";
		return this.getDB().queryAssoc(sql);
	}

	getProductNameAndCiridList(A_productid: {} | any[]) {
		var sql = "select productid, productname, cirid from product_tb where productid in (" + A_productid.join(",") + ")";
		return this.getDB().queryAssoc(sql);
	}

	getProductDetail(groupid, productid) {
		var select_sql = "SELECT * FROM product_tb WHERE groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND productid = " + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().queryRowHash(select_sql);
	}

	getProductDetailFull(groupid, productid) {
		var sql = "select " + "prd.productid," + "prd.productname," + "pp.ppname," + "car.carname," + "cir.cirname," + "prd.seriesname," + "prd.comment," + "prd.modelnumber," + "prd.product_url," + "prd.img_s," + "prd.img_l," + "prd.type," + "prd.maker," + "prd.delflg," + "prd.fixdate," + "prd.text1," + "prd.text2," + "prd.text3," + "prd.text4," + "prd.text5," + "prd.int1," + "prd.int2," + "prd.int3," + "prd.date1," + "prd.date2," + "prd.plan," + "prd.packet," + "prd.option," + "prd.service," + "prd.groupid," + "prd.smart_type " + "from " + "product_tb prd inner join carrier_tb car on prd.carid=car.carid " + "inner join circuit_tb cir on prd.cirid=cir.cirid " + "inner join price_pattern_tb pp on prd.ppid=pp.ppid " + "where " + "prd.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and prd.productid = " + this.getDB().dbQuote(productid, "integer", true);
		var H_product = this.getDB().queryRowHash(sql);

		if (!H_product.plan == false) {
			var O_plan = new PlanModel();
			H_product.plan = O_plan.getPlanNameArray(unserialize(H_product.plan));
		}

		if (!H_product.packet == false) {
			var O_packet = new PacketModel();
			H_product.packet = O_packet.getPacketNameArray(unserialize(H_product.packet));
		}

		if (!H_product.option == false) {
			var O_option = new OptionModel();
			H_product.option = O_option.getOptionNameArray(unserialize(H_product.option));
		}

		if (!H_product.service == false) {
			O_option = new OptionModel();
			H_product.service = O_option.getOptionNameArray(unserialize(H_product.service));
		}

		return H_product;
	}

	makeBranch(groupid, productid) {
		H_sql.select = "SELECT product_tb.productid, product_branch_tb.branchid, product_branch_tb.property, product_branch_tb.delflg ";
		H_sql.from = "FROM product_tb ";
		H_sql.join = "INNER JOIN product_branch_tb ON product_tb.productid = product_branch_tb.productid ";
		H_sql.where = "WHERE product_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND product_tb.productid = " + this.getDB().dbQuote(productid, "integer", true);
		H_sql.groupby = " ";
		H_sql.orderby = "ORDER BY product_tb.productid, product_branch_tb.branchid IS NULL DESC, product_branch_tb.branchid";
		return H_sql;
	}

	enableProductList(groupid, carid = 1) {
		if (true == is_null(carid) || false == is_numeric(carid)) {
			carid = 1;
		}

		var select_sql = "SELECT productid, productname FROM product_tb WHERE groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND delflg = false ";
		return this.getDB().queryHash(select_sql);
	}

	getSubproductListByProductid(productid) {
		var select_sql = "SELECT product_relation_tb.productid FROM product_relation_tb INNER JOIN product_tb ON product_relation_tb.productid = product_tb.productid WHERE product_tb.delflg = false AND product_relation_tb.productparentid = " + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().queryCol(select_sql);
	}

	enableProductListTel(groupid, carid = 1, productname = "") //名前で検索
	{
		if (true == is_null(carid) || false == is_numeric(carid)) {
			carid = 1;
		}

		var where = Array();
		var where_sql = "";

		if (productname != "") {
			where.push("productname ilike " + this.getDB().dbQuote("%" + productname + "%", "text"));
		}

		if (!!where) {
			where_sql = " AND " + where.join(" AND ");
		}

		var select_sql = "SELECT productid, productname FROM product_tb" + " WHERE" + " groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND delflg = false" + " AND type = '\u96FB\u8A71'" + where_sql + " ORDER BY productname";
		return this.getDB().queryHash(select_sql);
	}

	enableProductListAcc(groupid, carid = 1, productname = "") //名前で検索
	{
		if (true == is_null(carid) || false == is_numeric(carid)) {
			carid = 1;
		}

		var where = Array();
		var where_sql = "";

		if (productname != "") {
			where.push("productname ilike " + this.getDB().dbQuote("%" + productname + "%", "text"));
		}

		if (!!where) {
			where_sql = " AND " + where.join(" AND ");
		}

		var select_sql = "SELECT productid, productname FROM product_tb" + " WHERE" + " groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND delflg = false" + " AND type = '\u4ED8\u5C5E\u54C1'" + where_sql + " ORDER BY productname";
		return this.getDB().queryHash(select_sql);
	}

	checkProductProperty(productid, property) {
		var select_sql = "SELECT property FROM product_branch_tb WHERE productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND property = " + this.getDB().dbQuote(property, "text", true);
		return this.getDB().queryHash(select_sql);
	}

	enableJoinedProductList(groupid, carid = 1) {
		if (true == is_null(carid) || false == is_numeric(carid)) {
			carid = 1;
		}

		var select_sql = "SELECT ppt.productid as productparentid, ppt.productname as productparentname, cpt.productid as productid, cpt.productname as productname FROM product_relation_tb INNER JOIN product_tb ppt ON product_relation_tb.productparentid = ppt.productid INNER JOIN product_tb cpt ON product_relation_tb.productid = cpt.productid WHERE ppt.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND ppt.delflg = false AND cpt.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND ppt.carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND cpt.carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND cpt.delflg = false ORDER BY ppt.productname, product_relation_tb.recdate ";
		return this.getDB().queryHash(select_sql);
	}

	enableStockList(groupid, shopid, productname, carid, cirid) //$select_sql =	"SELECT " .
	//							"product_tb.productid, " .
	//							"product_branch_tb.branchid, " .
	//							"product_tb.productname, " .
	//							"product_branch_tb.property, " .
	//							"carrier_tb.carname, " .
	//							"shop_tb.name AS shopname, " .
	//							"circuit_tb.cirname, " .
	//							"product_tb.maker, " .
	//							"product_tb.type, " .
	//							"stock_tb.shopid, " .
	//							"stock_tb.status, " .
	//							"stock_tb.reserve, " .
	//							"stock_tb.layaway, " .
	//							"stock_tb.stock, " .
	//							"stock_tb.shipcnt, " .
	//							"stock_tb.delflg " .
	//						"FROM " .
	//							"product_tb " .
	//						"INNER JOIN " .
	//							"product_branch_tb ON product_tb.productid = product_branch_tb.productid " .
	//						"INNER JOIN " .
	//							"carrier_tb ON product_tb.carid = carrier_tb.carid " .
	//						"INNER JOIN " .
	//							"circuit_tb ON product_tb.carid = circuit_tb.carid AND product_tb.cirid = circuit_tb.cirid " .
	//						"LEFT JOIN " .
	//							"stock_tb ON product_tb.productid = stock_tb.productid AND product_branch_tb.branchid = stock_tb .branchid " .
	//						"LEFT JOIN " .
	//							"shop_tb ON stock_tb.shopid = shop_tb.shopid " .
	//						"WHERE " .
	//								"product_tb.groupid = " . $this->getDB()->dbQuote($groupid, "integer", true) ." AND " .
	//								"product_tb.delflg = false AND " .
	//								"product_branch_tb.delflg = false AND " .
	//								"( stock_tb.shopid IN(" . implode(",", $shopid) . ") OR stock_tb.shopid IS NULL ) " .
	//								$where_sql .
	//						"ORDER BY " .
	//							"product_tb.productid, product_branch_tb.branchid ";
	{
		var where_sql = "";

		if (false == !productname) {
			where_sql += " AND product_tb.productname LIKE '%" + this.getDB().escape(productname) + "%'";
		}

		if (false == is_null(carid)) {
			where_sql += " AND product_tb.carid = " + this.getDB().dbQuote(carid, "integer", true) + " ";
		}

		if (false == is_null(cirid)) {
			where_sql += " AND product_tb.cirid = " + this.getDB().dbQuote(cirid, "integer", true) + " ";
		}

		var select_sql = "SELECT " + "HOGE.productid AS productid, " + "HOGE.branchid AS branchid,  " + "HOGE.productname AS productname, " + "HOGE.property AS property, " + "HOGE.carname AS carname, " + "HOGE.cirname AS cirname, " + "HOGE.maker AS maker, " + "HOGE.type AS type, " + "shop_tb.shopid AS shopid, " + "shop_tb.name AS shopname, " + "stock_tb.status AS status, " + "stock_tb.reserve AS reserve, " + "stock_tb.layaway AS layaway, " + "stock_tb.stock AS stock, " + "stock_tb.shipcnt AS shipcnt, " + "stock_tb.delflg AS delflg " + "FROM ( " + "SELECT " + "product_tb.productid AS productid, " + "product_branch_tb.branchid AS branchid, " + "product_tb.productname AS productname, " + "product_branch_tb.property AS property, " + "carrier_tb.carname AS carname, " + "circuit_tb.cirname AS cirname, " + "product_tb.maker AS maker, " + "product_tb.type AS type, " + "product_tb.groupid AS groupid " + "FROM " + "product_tb " + "INNER JOIN " + "product_branch_tb ON product_tb.productid = product_branch_tb.productid " + "INNER JOIN " + "carrier_tb ON product_tb.carid = carrier_tb.carid " + "INNER JOIN " + "circuit_tb ON product_tb.carid = circuit_tb.carid AND product_tb.cirid = circuit_tb.cirid " + "WHERE " + "product_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "product_tb.delflg = false AND product_branch_tb.delflg = false " + where_sql + ") HOGE " + "INNER JOIN " + "shop_tb ON shop_tb.groupid = HOGE.groupid " + "LEFT JOIN " + "stock_tb ON HOGE.productid = stock_tb.productid AND HOGE.branchid = stock_tb.branchid AND shop_tb.shopid = stock_tb.shopid " + "WHERE " + "shop_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "ORDER BY HOGE.productid, HOGE.branchid ";
		return this.getDB().queryHash(select_sql);
	}

	getStockDetail(shopid, productid, branchid) {
		var select_sql = "SELECT " + "product_tb.productname, " + "product_branch_tb.property, " + "stock_tb.status, " + "stock_tb.reserve, " + "stock_tb.layaway, " + "stock_tb.stock, " + "stock_tb.shipcnt " + "FROM " + "product_tb " + "INNER JOIN " + "product_branch_tb ON product_tb.productid = product_branch_tb.productid " + "LEFT JOIN " + "stock_tb ON product_branch_tb.productid = stock_tb.productid AND product_branch_tb.branchid = stock_tb.branchid " + "WHERE " + "product_tb.productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "product_branch_tb.branchid = " + this.getDB().dbQuote(branchid, "integer", true) + " AND " + "(stock_tb.shopid IS NULL OR stock_tb.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + ")";
		return this.getDB().queryRowHash(select_sql);
	}

	getSeriesHash(groupid, carid, cirid = "") //キャリアのみ指定
	{
		var sql = "select seriesname,seriesname from product_tb " + " where " + " groupid=" + this.get_DB().dbQuote(groupid, "integer", true) + " and type='\u96FB\u8A71'";

		if ("" == cirid) {
			sql += " and carid=" + carid;
		} else {
			sql += " and carid=" + carid + " and cirid=" + cirid;
		}

		sql += " group by seriesname ";
		sql += " order by seriesname";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getProductKeyHash(groupid, carid, cirid = "", seriesname = "") //回線指定あり
	{
		var sql = "select productid,productname from product_tb " + " where " + " groupid=" + this.get_DB().dbQuote(groupid, "integer", true) + " and type='\u96FB\u8A71'" + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);

		if ("" != cirid) {
			sql += " and " + " cirid=" + this.get_DB().dbQuote(cirid, "integer", true);
		}

		if ("" !== cirid && "" === seriesname) {
			sql += " and " + " seriesname=" + this.get_DB().dbQuote(seriesname, "text", true);
		}

		sql += " order by seriesname";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getProductIdNameKeyHash(groupid, carid, cirid = "", seriesname = "") //回線指定あり
	{
		var sql = "select productid||':'||productname as productid,productname from product_tb " + " where " + " groupid=" + this.get_DB().dbQuote(groupid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);

		if ("" != cirid) {
			sql += " and " + " cirid=" + this.get_DB().dbQuote(cirid, "integer", true);
		}

		if ("" != seriesname) {
			sql += " and " + " seriesname=" + this.get_DB().dbQuote(seriesname, "text", true);
		}

		sql += " order by seriesname,productname";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getBranchKeyHash(productid) {
		var sql = "select branchid,property from product_branch_tb " + " where " + " productid=" + this.get_DB().dbQuote(productid, "integer", true) + " order by property";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getBranchIdNameKeyHash(productid) {
		var sql = "select branchid||':'||property as branchid,property from product_branch_tb " + " where " + " productid=" + this.get_DB().dbQuote(productid, "integer", true) + " order by property";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getAccessoryKeyHash(productid) {
		var sql = "select pt.productid,pt.productname " + " from " + " product_tb as pt " + " left outer join product_relation_tb as prt on pt.productid = prt.productparentid " + " where " + " prt.productid=" + this.get_DB().dbQuote(productid, "integer", true) + " and " + " pt.type=" + this.get_DB().dbQuote("\u4ED8\u5C5E\u54C1", "text", true);
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	chkProductId(groupid, productid, ppid = undefined, delflg = false) {
		var where = "";

		if (delflg === false) {
			where += " and delflg = false";
		}

		if (ppid != undefined && is_numeric(ppid) == true) {
			where += " and ppid = " + this.getDB().dbQuote(ppid, "integer", undefined);
		}

		var sql = "select count(*) from product_tb where " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and productid = " + this.getDB().dbQuote(productid, "integer", true) + where;
		var ret = this.getDB().queryOne(sql);

		if (ret > 0) {
			return true;
		}

		return false;
	}

	getProductIdFromName(groupid, productname, ppid = undefined, delflg = false) {
		var where = "";

		if (delflg === false) {
			where += " and delflg = false";
		}

		if (ppid != undefined && is_numeric(ppid) == true) {
			where += " and ppid = " + this.getDB().dbQuote(ppid, "integer", undefined);
		}

		var sql = "select productid from product_tb where " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and productname = " + this.getDB().dbQuote(productname, "text", true) + where;
		return this.getDB().queryCol(sql);
	}

	getSearchcaridFromProductid(productid) {
		var sql = "select carid from product_tb " + " where " + " productid=" + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getSearchciridFromProductid(productid) {
		var sql = "select cirid from product_tb " + " where " + " productid=" + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getSeriesnameFromProductid(productid) {
		var sql = "select seriesname from product_tb " + " where " + " productid=" + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};