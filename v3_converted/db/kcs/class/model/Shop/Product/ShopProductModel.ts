//
//ショップ：在庫マスター
//
//@package Product
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//
//ショップ：在庫マスター
//
//@package Product
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/18
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
//updateInsertStockDetail
//
//@author ishizaki
//@since 2008/07/23
//
//@param mixed $shopid
//@param mixed $productid
//@param mixed $branchid
//@access public
//@return void
//
//
//在庫状況の更新　トランザクションは張りません falseが返ったら更新エラーなのでロールバック
//
//@author ishizaki
//@since 2008/08/21
//
//@param mixed $productid
//@param mixed $branchid
//@param mixed $shopid
//@param mixed $reserve
//@param mixed $layaway
//@param mixed $shipcnt
//@param mixed $stock
//@access public
//@return void
//
//
//changeDelflg
//
//@author ishizaki
//@since 2008/07/24
//
//@param mixed $productid
//@param mixed $branchid
//@param mixed $shopid
//@param mixed $delflg
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
class ShopProductModel extends ProductModel {
	constructor() {
		super();
	}

	updateInsertStockDetail(shopid, productid, branchid, status, reserve, layaway, stock) {
		status = this.getSetting().A_stock_status[status];
		var update_sql = "UPDATE " + "stock_tb " + "SET " + "status = " + this.getDB().dbQuote(status, "text", true) + ", " + "reserve = reserve + " + this.getDB().dbQuote(reserve, "integer", true) + ", " + "layaway = layaway + " + this.getDB().dbQuote(layaway, "integer", true) + ", " + "stock = stock +" + this.getDB().dbQuote(stock, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " " + "WHERE " + "shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " AND " + "productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "branchid = " + this.getDB().dbQuote(branchid, "integer", true);
		var insert_sql = "INSERT INTO stock_tb (" + "productid, branchid, shopid, status, reserve, layaway, stock, shipcnt, orderview, delflg, fixdate " + ") VALUES ( " + this.getDB().dbQuote(productid, "integer", true) + ", " + this.getDB().dbQuote(branchid, "integer", true) + ", " + this.getDB().dbQuote(shopid, "integer", true) + ", " + this.getDB().dbQuote(status, "text", true) + ", " + this.getDB().dbQuote(reserve, "integer", true) + ", " + this.getDB().dbQuote(layaway, "integer", true) + ", " + this.getDB().dbQuote(stock, "integer", true) + ", " + "0, " + "true, " + "false, " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " " + ")";
		var rollback = false;
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (0 === res) {
			res = this.getDB().exec(insert_sql);

			if (true == PEAR.isError(res)) {
				rollback = true;
			}
		}

		if (true == rollback) {
			this.getDB().rollback();
		} else {
			this.getDB().commit();
		}
	}

	updateInsertStockQuant(productid, branchid, shopid, reserve, layaway, shipcnt, stock, status = undefined) {
		var select_sql = "SELECT count(*) FROM stock_tb WHERE productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND branchid = " + this.getDB().dbQuote(branchid, "integer", true) + " AND shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		var res = this.getDB().queryOne(select_sql);

		if (0 < res) {
			var add_status = " ";

			if (false == is_null(status) && true == is_numeric(status)) {
				status = this.getSetting().A_stock_status[status];
				add_status = ", status = " + this.getDB().dbQuote(status, "text", true) + " ";
			}

			var update_sql = "UPDATE stock_tb SET " + "reserve = reserve + " + this.getDB().dbQuote(reserve, "integer", true) + ", " + "layaway = layaway + " + this.getDB().dbQuote(layaway, "integer", true) + ", " + "shipcnt = shipcnt + " + this.getDB().dbQuote(shipcnt, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ", " + "stock = stock + " + this.getDB().dbQuote(stock, "integer", true) + add_status + "WHERE " + "productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "branchid = " + this.getDB().dbQuote(branchid, "integer", true) + " AND " + "shopid = " + this.getDB().dbQuote(shopid, "integer", true);
			res = this.getDB().exec(update_sql);

			if (1 == res) {
				return true;
			} else {
				return false;
			}
		} else {
			if (true == is_null(status)) {
				status = 3;
			}

			status = this.getSetting().A_stock_status[status];
			var insert_sql = "INSERT INTO stock_tb (" + "productid, " + "branchid, " + "shopid, " + "status, " + "reserve, " + "layaway, " + "shipcnt, " + "stock, " + "orderview, " + "delflg, " + "fixdate " + ") VALUES (" + this.getDB().dbQuote(productid, "integer", true) + ", " + this.getDB().dbQuote(branchid, "integer", true) + ", " + this.getDB().dbQuote(shopid, "integer", true) + ", " + this.getDB().dbQuote(status, "text", true) + ", " + this.getDB().dbQuote(reserve, "integer", true) + ", " + this.getDB().dbQuote(layaway, "integer", true) + ", " + this.getDB().dbQuote(shipcnt, "integer", true) + ", " + this.getDB().dbQuote(stock, "integer", true) + ", " + "true, " + "false, " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";
			res = this.getDB().exec(insert_sql);

			if (true == PEAR.isError(res)) {
				return false;
			} else {
				return true;
			}
		}

		return false;
	}

	changeDelflg(productid, branchid, shopid, delflg) //var_dump($productid, $branchid, $shopid, $delflg);
	{
		var update_sql = "UPDATE " + "stock_tb " + "SET " + "delflg = " + this.getDB().dbQuote(delflg, "boolean", true) + " WHERE " + "productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "branchid = " + this.getDB().dbQuote(branchid, "integer", true) + " AND " + "shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (1 != res) //$this->getOut()->errorOut(0, "起こりえるはずの無い" . $res . "件の更新", true);
			{
				this.getDB().rollback();
				return false;
			} else {
			this.getDB().commit();
		}
	}

	__destruct() {
		super.__destruct();
	}

};