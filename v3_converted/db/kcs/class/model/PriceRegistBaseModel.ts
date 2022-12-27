require("PriceModel.php");

//
//__construct
//
//@author katsushi
//@since 2008/08/05
//
//@access public
//@return void
//
//
//getPricePattern
//
//@author katsushi
//@since 2008/08/05
//
//@access public
//@return void
//
//
//getPriceTemplate
//
//@author katsushi
//@since 2008/08/07
//
//@param mixed $ppid
//@access public
//@return void
//
//
//insertPriceListAll
//
//@author katsushi
//@since 2008/08/08
//
//@param mixed $H_data
//@access public
//@return void
//
//
//updatePriceListAll
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@param array $H_pricelist
//@param array $H_data
//@access public
//@return void
//
//
//insertPriceList
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@param array $H_pricelist
//@access public
//@return void
//
//
//updatePriceList
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@param array $H_pricelist
//@access public
//@return void
//
//
//deletePriceMemoDetail
//
//@author katsushi
//@since 2008/08/10
//
//@param mixed $pricelistid
//@access public
//@return void
//
//
//insertPriceMemoDetail
//
//@author katsushi
//@since 2008/08/08
//
//@param integer $pricelistid
//@param mixed $H_data
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/08/05
//
//@access public
//@return void
//
class PriceRegistBaseModel extends PriceModel {
	constructor() {
		super();
	}

	getPricePatternAssoc() {
		var sql = "select ppid,ppname from price_pattern_tb where ppid > 0 order by ppid";
		return this.getDB().queryAssoc(sql);
	}

	getAdminPriceTemplate(ppid) {
		return this.getDB().queryOne("SELECT admintplfile FROM price_pattern_tb WHERE ppid = " + this.getDB().dbQuote(ppid, "integer", true));
	}

	insertPriceListAll(H_pricelist: {} | any[], H_data: {} | any[]) //シーケンス取得
	//pricelist_tbへのインサート
	{
		var pricelistid = this.getDB().nextID("pricelist_tb_pricelistid");
		this.getDB().beginTransaction();
		var res = this.insertPriceList(pricelistid, H_pricelist);

		if (res < 1) //エラー
			{
				this.getDB().rollback();
				throw die();
			}

		this.insertPriceMemoDetail(pricelistid, H_data);
		this.getDB().commit();
	}

	updatePriceListAll(pricelistid, H_pricelist: {} | any[], H_data: {} | any[]) //pricelist_tbのupdate
	//pricelist_memo_tb, price_detail_tb
	{
		this.getDB().beginTransaction();
		var res = this.updatePriceList(pricelistid, H_pricelist);

		if (res < 1) //エラー
			{
				this.getDB().rollback();
				throw die();
			}

		this.deletePriceMemoDetail(pricelistid);
		this.insertPriceMemoDetail(pricelistid, H_data);
		this.getDB().commit();
	}

	insertPriceList(pricelistid, H_pricelist: {} | any[]) {
		var sql = "insert into pricelist_tb(" + "pricelistid," + "shopid," + "carid," + "ppid," + "pricename," + "datefrom," + "dateto," + "listheader," + "listfooter," + "delflg," + "fixdate," + "groupid," + "defaultflg," + "author," + "recdate, " + "mailstatus, " + "sortcomment, " + "listcomment  " + ") " + "values (" + this.getDB().dbQuote(pricelistid, "integer", true) + "," + this.getDB().dbQuote(H_pricelist.shopid, "integer", true) + "," + this.getDB().dbQuote(H_pricelist.carid, "integer", true) + "," + this.getDB().dbQuote(H_pricelist.ppid, "integer", true) + "," + this.getDB().dbQuote(H_pricelist.pricename, "text", true) + "," + this.getDB().dbQuote(H_pricelist.datefrom, "timestamp", true) + "," + this.getDB().dbQuote(H_pricelist.dateto, "timestamp") + "," + this.getDB().dbQuote(H_pricelist.listheader, "text") + "," + this.getDB().dbQuote(H_pricelist.listfooter, "text") + "," + this.getDB().dbQuote(false, "boolean", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(H_pricelist.groupid, "integer", true) + "," + this.getDB().dbQuote(H_pricelist.defaultflg, "boolean", true) + "," + this.getDB().dbQuote(H_pricelist.author, "text", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + this.getDB().dbQuote(H_pricelist.mailstatus, "integer", true) + ", " + this.getDB().dbQuote(H_pricelist.sortcomment, "integer") + ", " + this.getDB().dbQuote(H_pricelist.listcomment, "text") + ")";
		return this.getDB().exec(sql);
	}

	updatePriceList(pricelistid, H_pricelist: {} | any[]) {
		var sql = "update pricelist_tb set " + "carid = " + this.getDB().dbQuote(H_pricelist.carid, "integer", true) + "," + "ppid = " + this.getDB().dbQuote(H_pricelist.ppid, "integer", true) + "," + "pricename = " + this.getDB().dbQuote(H_pricelist.pricename, "text", true) + "," + "datefrom = " + this.getDB().dbQuote(H_pricelist.datefrom, "timestamp", true) + "," + "dateto = " + this.getDB().dbQuote(H_pricelist.dateto, "timestamp") + "," + "listheader = " + this.getDB().dbQuote(H_pricelist.listheader, "text") + "," + "listfooter = " + this.getDB().dbQuote(H_pricelist.listfooter, "text") + "," + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + "defaultflg = " + this.getDB().dbQuote(H_pricelist.defaultflg, "boolean", true) + "," + "mailstatus = " + this.getDB().dbQuote(H_pricelist.mailstatus, "integer", true) + "," + "author = " + this.getDB().dbQuote(H_pricelist.author, "text", true) + " " + "," + "sortcomment = " + this.getDB().dbQuote(H_pricelist.sortcomment, "integer") + " " + "," + "listcomment = " + this.getDB().dbQuote(H_pricelist.listcomment, "text") + " " + "where " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().exec(sql);
	}

	deletePriceMemoDetail(pricelistid) {
		var sql = "delete from pricelist_memo_tb where pricelistid = " + pricelistid;
		var res = this.getDB().exec(sql);
		sql = "delete from price_detail_tb where pricelistid = " + pricelistid;
		res = this.getDB().exec(sql);
	}

	insertPriceMemoDetail(pricelistid, H_data) {
		for (var productid in H_data) //memo
		//detail
		{
			var H_val = H_data[productid];
			var sql = "insert into pricelist_memo_tb(" + "pricelistid," + "productid," + "memo," + "sort" + ") " + "values(" + this.getDB().dbQuote(pricelistid, "integer", true) + "," + this.getDB().dbQuote(productid, "integer", true) + "," + this.getDB().dbQuote(H_val.memo, "text") + "," + this.getDB().dbQuote(H_val.sort, "integer") + ")";
			var res = this.getDB().exec(sql);
			delete H_val.sort;
			delete H_val.memo;

			for (var i = 0; i < H_val.length; i++) //インサートするデータのチェック一つでも数値以外のものがあればインサートしない
			{
				var data_check = true;
				{
					let _tmp_0 = H_val[i];

					for (var k in _tmp_0) {
						var v = _tmp_0[k];

						if (is_numeric(v) == false) {
							data_check = false;
							break;
						}
					}
				}

				if (data_check == false) {
					continue;
				}

				sql = "insert into price_detail_tb(" + "productid," + "pricelistid," + "buytype1," + "buytype2," + "paycnt," + "downmoney," + "onepay," + "totalprice," + "buyselid" + ") " + "values(" + this.getDB().dbQuote(productid, "integer", true) + "," + this.getDB().dbQuote(pricelistid, "integer", true) + "," + this.getDB().dbQuote(H_val[i].buytype1, "integer", true) + "," + this.getDB().dbQuote(H_val[i].buytype2, "integer", true) + "," + this.getDB().dbQuote(H_val[i].paycnt, "integer", true) + "," + this.getDB().dbQuote(H_val[i].downmoney, "integer", true) + "," + this.getDB().dbQuote(H_val[i].onepay, "integer", true) + "," + this.getDB().dbQuote(H_val[i].totalprice, "integer", true) + "," + this.getDB().dbQuote(H_val[i].buyselid, "integer", true) + ")";
				res = this.getDB().exec(sql);
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};