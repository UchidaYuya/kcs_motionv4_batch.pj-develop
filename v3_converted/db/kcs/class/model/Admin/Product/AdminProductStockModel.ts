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

require("model/Admin/Product/AdminProductModel.php");

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
//getAdminDetaillist
//
//@author ishizaki
//@since 2008/07/10
//
//@param mixed $groupid
//@param mixed $productid
//@access public
//@return void
//
//
//getBranchProperty
//
//@author ishizaki
//@since 2008/07/16
//
//@param mixed $groupid
//@param mixed $productid
//@param mixed $branchid
//@access public
//@return void
//
//
//insertProductBranch
//
//@author ishizaki
//@since 2008/07/15
//
//@param mixed $productid
//@param mixed $property
//@access public
//@return void
//
//
//updateProductBranchProperty
//
//@author ishizaki
//@since 2008/07/16
//
//@param mixed $productid
//@param mixed $branchid
//@param mixed $property
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
//@param mixed $branchid
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
class AdminProductStockModel extends AdminProductModel {
	constructor() {
		super();
	}

	getAdminDetaillist(groupid, productid) {
		var H_sql = this.makeBranch(groupid, productid);
		return this.getDB().queryHash(H_sql.join(" "));
	}

	getBranchProperty(groupid, productid, branchid) {
		var H_sql = this.makeBranch(groupid, productid);
		H_sql.where += " AND product_branch_tb.branchid = " + this.getDB().dbQuote(branchid, "integer", true);
		var H_temp = this.getDB().queryRowHash(H_sql.join(" "));
		return H_temp.property;
	}

	insertProductBranch(productid, property) {
		var select_sql = "SELECT MAX(branchid) FROM product_branch_tb WHERE productid = " + this.getDB().dbQuote(productid, "integer", true);
		var max_branchid = this.getDB().queryOne(select_sql);

		if (true === is_null(max_branchid)) {
			max_branchid = 0;
		}

		max_branchid++;
		var insert_sql = "INSERT INTO product_branch_tb (productid, branchid, property, delflg) VALUES (" + this.getDB().dbQuote(productid, "integer", true) + ", " + this.getDB().dbQuote(max_branchid, "integer", true) + ", " + this.getDB().dbQuote(property, "text", true) + ", false) ";
		var res = this.getDB().exec(insert_sql, true);

		if (true == PEAR.isError(res)) {
			this.insertProductBranch(productid, property);
		}
	}

	updateProductBranchProperty(productid, branchid, property) {
		var update_sql = "UPDATE product_branch_tb SET property = " + this.getDB().dbQuote(property, "text", true) + " WHERE " + "productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "branchid = " + this.getDB().dbQuote(branchid, "integer", true);
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (1 != res) {
			this.getOut().errorOut(0, "\u8D77\u3053\u308A\u3048\u308B\u306F\u305A\u306E\u7121\u3044" + res + "\u4EF6\u306E\u66F4\u65B0", true);
			this.getDB().rollback();
		}

		this.getDB().commit();
	}

	changeDelflg(productid, branchid, delflg) {
		var update_sql = "UPDATE product_branch_tb SET delflg = " + this.getDB().dbQuote(delflg, "boolean", true) + " WHERE " + "productid = " + this.getDB().dbQuote(productid, "integer", true) + " AND " + "branchid = " + this.getDB().dbQuote(branchid, "integer", true);
		this.getDB().beginTransaction();
		var res = this.getDB().exec(update_sql);

		if (1 != res) {
			this.getOut().errorOut(0, "\u8D77\u3053\u308A\u3048\u308B\u306F\u305A\u306E\u7121\u3044" + res + "\u4EF6\u306E\u66F4\u65B0", true);
			this.getDB().rollback();
		}

		this.getDB().commit();
	}

	__destruct() {
		super.__destruct();
	}

};