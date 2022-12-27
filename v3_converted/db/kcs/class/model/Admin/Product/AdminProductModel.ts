//
//管理者：商品マスター
//
//@package Product
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/08
//
//
//
//価格表メニュー用Model
//
//@package Product
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/08
//

require("model/ProductModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//管理者の商品マスター一覧を取得
//
//@author ishizaki
//@since 2008/07/09
//
//@param mixed $groupid
//@param mixed $productname
//@param mixed $carid
//@param mixed $cirid
//@param mixed $delflg
//@access public
//@return void
//
//
//changeDelflg
//
//@author ishizaki
//@since 2008/07/16
//
//@param mixed $productid
//@param mixed $delflg
//@access public
//@return void
//
//
//addProductRelation
//
//@author ishizaki
//@since 2008/07/17
//
//@param mixed $ppi
//@param mixed $pi
//@access public
//@return void
//
//
//delProductRelation
//
//@author ishizaki
//@since 2008/07/18
//
//@param mixed $ppi
//@param mixed $pi
//@access public
//@return void
//
//public function getAdminDetaillist($productid){
//		$H_sql = $this->makeBranch($productid);
//		var_dump(implode(" ", $H_sql));
//		$H_detaillist = $this->getDB()->queryHash(implode(" ", $H_sql));
//		var_dump($H_detaillist);
//	}
//
//dataRestore
//
//@author katsushi
//@since 2008/07/23
//
//@param mixed $H_data
//@access private
//@return void
//
//
//insertProduct
//
//@author katsushi
//@since 2008/07/19
//
//@param mixed $groupid
//@param mixed $H_data
//@access public
//@return void
//
//
//updateProduct
//
//@author katsushi
//@since 2008/07/23
//
//@param mixed $groupid
//@param mixed $productid
//@param mixed $H_data
//@access public
//@return void
//
//
//getProductListPPID
//
//@author katsushi
//@since 2008/08/05
//
//@param mixed $groupid
//@param mixed $ppid
//@access public
//@return void
//
//
//getProductStock
//
//@author katsushi
//@since 2008/08/06
//
//@param mixed $productid
//@param mixed $groupid
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class AdminProductModel extends ProductModel {
	constructor() {
		super();
	}

	getAdminProductlist(groupid, H_search, limit, page) //表示数
	//ページ
	{
		var select_sql = "SELECT " + "product_tb.productid, " + "product_tb.productname, " + "carrier_tb.carname, " + "circuit_tb.cirname, " + "product_tb.maker, " + "product_tb.type, " + "product_tb.delflg, " + "count(*) OVER() AS cnt " + "FROM " + "product_tb " + "INNER JOIN " + "carrier_tb ON product_tb.carid = carrier_tb.carid " + "INNER JOIN " + "circuit_tb ON product_tb.cirid = circuit_tb.cirid " + "WHERE " + "product_tb.groupid = " + this.getDB().dbQuote(groupid, "integer", true);

		if (!!H_search.productname) {
			select_sql += " AND product_tb.productname iLIKE '%" + this.getDB().escape(H_search.productname) + "%'";
		}

		if (!!H_search.carid) {
			select_sql += " AND carrier_tb.carid = " + this.getDB().dbQuote(H_search.carid, "integer", true);
		}

		if (!!H_search.cirid) {
			select_sql += " AND circuit_tb.cirid = " + this.getDB().dbQuote(H_search.cirid, "integer", true);
		}

		if (!H_search.delflg) {
			select_sql += " AND product_tb.delflg = " + this.getDB().dbQuote(H_search.delflg, "boolean", true);
		}

		if (!!H_search.type) {
			select_sql += " AND product_tb.type = " + this.getDB().dbQuote(H_search.type, "text", true);
		}

		select_sql += " ORDER BY product_tb.productname";
		select_sql += " LIMIT " + limit;
		page--;

		if (page < 0) {
			page = 0;
		}

		select_sql += " OFFSET " + page * limit;
		return this.getDB().queryHash(select_sql);
	}

	changeDelflg(groupid, productid, delflg) {
		var update_sql = "UPDATE product_tb SET delflg = " + this.getDB().dbQuote(delflg, "boolean", true) + " WHERE " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "AND productid = " + this.getDB().dbQuote(productid, "integer", true);
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (1 != res) {
			this.getOut().errorOut(0, "\u8D77\u3053\u308A\u3048\u308B\u306F\u305A\u306E\u7121\u3044" + res + "\u4EF6\u306E\u66F4\u65B0", true);
			this.getDB().rollback();
		} else {
			this.getDB().commit();
		}
	}

	addProductRelation(ppi, pi) {
		var insert_sql = "INSERT INTO product_relation_tb ( productparentid, productid, recdate) VALUES ( " + this.getDB().dbQuote(ppi, "integer", true) + ", " + this.getDB().dbQuote(pi, "integer", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";
		var res = this.getDB().exec(insert_sql, false);

		if (true === PEAR.isError(res)) {
			return -1;
		}

		return 1;
	}

	delProductRelation(ppi, pi) {
		var delete_sql = "DELETE FROM product_relation_tb WHERE productparentid = " + this.getDB().dbQuote(ppi, "integer", true) + " AND productid = " + this.getDB().dbQuote(pi, "integer", true);
		var res = this.getDB().exec(delete_sql, false);

		if (true === PEAR.isError(res)) {
			return -1;
		}

		return 1;
	}

	dataRestore(H_data) //プランの整形
	//パケットの整形
	//オプションの整形
	//割引サービスの整形
	//smart_type
	//if(isset($H_data["smart_type"]) == true && count($H_data["smart_type"]) > 0){
	//			$H_data["smart_type"] = serialize(array_keys($H_data["smart_type"]));
	//		}
	//		else{
	//			$H_data["smart_type"] = null;
	//		}
	//日付1の整形
	//日付2の整形
	{
		if (undefined !== H_data.plan == true && Array.isArray(H_data.plan) == true && H_data.plan.length > 0) {
			H_data.plan = serialize(Object.keys(H_data.plan));
		} else {
			H_data.plan = undefined;
		}

		if (undefined !== H_data.packet == true && Array.isArray(H_data.packet) == true && H_data.packet.length > 0) {
			H_data.packet = serialize(Object.keys(H_data.packet));
		} else {
			H_data.packet = undefined;
		}

		if (undefined !== H_data.option == true && Array.isArray(H_data.option) == true && H_data.option.length > 0) {
			H_data.option = serialize(Object.keys(H_data.option));
		} else {
			H_data.option = undefined;
		}

		if (undefined !== H_data.service == true && Array.isArray(H_data.service) == true && H_data.service.length > 0) {
			H_data.service = serialize(Object.keys(H_data.service));
		} else {
			H_data.service = undefined;
		}

		if (undefined !== H_data.date1 == true && is_numeric(H_data.date1.Y) == true && is_numeric(H_data.date1.m) == true && is_numeric(H_data.date1.d) == true) {
			H_data.date1 = date("Y-m-d H:i:s", mktime(0, 0, 0, H_data.date1.m, H_data.date1.d, H_data.date1.Y));
		} else {
			H_data.date1 = undefined;
		}

		if (undefined !== H_data.date2 == true && is_numeric(H_data.date2.Y) == true && is_numeric(H_data.date2.m) == true && is_numeric(H_data.date2.d) == true) {
			H_data.date2 = date("Y-m-d H:i:s", mktime(0, 0, 0, H_data.date2.m, H_data.date2.d, H_data.date2.Y));
		} else {
			H_data.date2 = undefined;
		}

		return H_data;
	}

	insertProduct(groupid, H_data) {
		H_data = this.dataRestore(H_data);
		var sql = "insert into product_tb(" + "productname," + "carid," + "cirid," + "seriesname," + "comment," + "modelnumber," + "product_url," + "img_s," + "img_l," + "type," + "maker," + "fixdate," + "text1," + "text2," + "text3," + "text4," + "text5," + "int1," + "int2," + "int3," + "date1," + "date2," + "plan," + "packet," + "option," + "service," + "groupid," + "smart_type," + "ppid) " + "values (" + this.getDB().dbQuote(rtrim(H_data.productname), "text", true) + "," + this.getDB().dbQuote(H_data.carid, "integer") + "," + this.getDB().dbQuote(H_data.cirid, "integer") + "," + this.getDB().dbQuote(H_data.seriesname, "text") + "," + this.getDB().dbQuote(H_data.comment, "text") + "," + this.getDB().dbQuote(H_data.modelnumber, "text") + "," + this.getDB().dbQuote(H_data.product_url, "text") + "," + this.getDB().dbQuote(H_data.img_s, "text") + "," + this.getDB().dbQuote(H_data.img_l, "text") + "," + this.getDB().dbQuote(H_data.type, "text") + "," + this.getDB().dbQuote(H_data.maker, "text") + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(H_data.text1, "text") + "," + this.getDB().dbQuote(H_data.text2, "text") + "," + this.getDB().dbQuote(H_data.text3, "text") + "," + this.getDB().dbQuote(H_data.text4, "text") + "," + this.getDB().dbQuote(H_data.text5, "text") + "," + this.getDB().dbQuote(H_data.int1, "text") + "," + this.getDB().dbQuote(H_data.int2, "text") + "," + this.getDB().dbQuote(H_data.int3, "text") + "," + this.getDB().dbQuote(H_data.date1, "timestamp") + "," + this.getDB().dbQuote(H_data.date2, "timestamp") + "," + this.getDB().dbQuote(H_data.plan, "text") + "," + this.getDB().dbQuote(H_data.packet, "text") + "," + this.getDB().dbQuote(H_data.option, "text") + "," + this.getDB().dbQuote(H_data.service, "text") + "," + this.getDB().dbQuote(groupid, "integer", true) + "," + this.getDB().dbQuote(H_data.smart_type, "text") + "," + this.getDB().dbQuote(H_data.ppid, "integer") + ")";
		return this.getDB().exec(sql);
	}

	updateProduct(groupid, productid, H_data) {
		H_data = this.dataRestore(H_data);
		var sql = "update product_tb set " + "productname = " + this.getDB().dbQuote(rtrim(H_data.productname), "text", true) + "," + "carid = " + this.getDB().dbQuote(H_data.carid, "integer") + "," + "cirid = " + this.getDB().dbQuote(H_data.cirid, "integer") + "," + "seriesname = " + this.getDB().dbQuote(H_data.seriesname, "text") + "," + "comment = " + this.getDB().dbQuote(H_data.comment, "text") + "," + "modelnumber = " + this.getDB().dbQuote(H_data.modelnumber, "text") + "," + "product_url = " + this.getDB().dbQuote(H_data.product_url, "text") + "," + "img_s = " + this.getDB().dbQuote(H_data.img_s, "text") + "," + "img_l = " + this.getDB().dbQuote(H_data.img_l, "text") + "," + "type = " + this.getDB().dbQuote(H_data.type, "text") + "," + "maker = " + this.getDB().dbQuote(H_data.maker, "text") + "," + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + "text1 = " + this.getDB().dbQuote(H_data.text1, "text") + "," + "text2 = " + this.getDB().dbQuote(H_data.text2, "text") + "," + "text3 = " + this.getDB().dbQuote(H_data.text3, "text") + "," + "text4 = " + this.getDB().dbQuote(H_data.text4, "text") + "," + "text5 = " + this.getDB().dbQuote(H_data.text5, "text") + "," + "int1 = " + this.getDB().dbQuote(H_data.int1, "text") + "," + "int2 = " + this.getDB().dbQuote(H_data.int2, "text") + "," + "int3 = " + this.getDB().dbQuote(H_data.int3, "text") + "," + "date1 = " + this.getDB().dbQuote(H_data.date1, "timestamp") + "," + "date2 = " + this.getDB().dbQuote(H_data.date2, "timestamp") + "," + "plan = " + this.getDB().dbQuote(H_data.plan, "text") + "," + "packet = " + this.getDB().dbQuote(H_data.packet, "text") + "," + "option = " + this.getDB().dbQuote(H_data.option, "text") + "," + "service =" + this.getDB().dbQuote(H_data.service, "text") + "," + "smart_type = " + this.getDB().dbQuote(H_data.smart_type, "text") + "," + "ppid =" + this.getDB().dbQuote(H_data.ppid, "integer") + " " + "where " + "groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and productid = " + this.getDB().dbQuote(productid, "integer", true);
		return this.getDB().exec(sql);
	}

	getProductListPPID(groupid, ppid) {
		var sql = "select productid,productname from product_tb where groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " and delflg = false and ppid = " + this.getDB().dbQuote(ppid, "integer", true) + " order by productname";
		return this.getDB().queryAssoc(sql);
	}

	getProductStock(productid, groupid) {
		var sql = "select " + "st.productid || '-' || st.branchid as masterid," + "br.property," + "sh.postcode," + "sh.name," + "st.status," + "st.reserve," + "st.layaway," + "st.stock," + "st.shipcnt " + "from " + "stock_tb st inner join shop_tb sh on st.shopid = sh.shopid " + "inner join product_branch_tb br on br.productid = st.productid and br.branchid = st.branchid " + "where " + "st.delflg = false " + "and br.delflg = false " + "and sh.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " " + "and st.productid = " + this.getDB().dbQuote(productid, "integer", true) + " " + "order by " + "st.productid," + "st.branchid";
		return this.getDB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};