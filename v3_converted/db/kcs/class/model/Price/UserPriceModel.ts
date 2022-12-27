//
//価格表メニュー用Model
//
//@package Price
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//
//
//
//価格表メニュー用Model
//
//@package Price
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("model/PriceModel.php");

require("MtAuthority.php");

//
//setPostID
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $postid
//@access public
//@return void
//
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
//checkPriceAuthType
//
//@author ishizaki
//@since 2008/08/21
//
//@access public
//@return void
//
//
//getNowPrice
//
//@author ishizaki
//@since 2008/09/08
//
//@param mixed $productid
//@param mixed $carid
//@param mixed $type
//@param mixed $buytype1
//@param mixed $buytype2
//@param mixed $paycnt
//@param mixed $buyselid
//@param mixed $shopid
//@param mixed $groupid
//@param mixed $price_auth_type // getPricelistIDを呼ぶために追加 20090722miya
//@param mixed $pactid // getPricelistIDを呼ぶために追加 20090722miya
//@param mixed $postid // getPricelistIDを呼ぶために追加 20090722miya
//@access public
//@return void
//
//
//getNowPriceFromPriceDetailID
//
//@author ishizaki
//@since 2008/08/21
//
//@param mixed $price_detailid
//@param mixed $shopid
//@param mixed $groupid
//@access public
//@return void
//
//
//getPricelistID
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $carid
//@param mixed $pricepattern
//@param mixed $shopid
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//在庫一覧
//
//@author ishizaki
//@since 2008/08/01
//
//@param array $A_shoplist
//@access public
//@return void
//
//
//getCarrierShop
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $carid
//@access public
//@return void
//
//
//getAbleOrderCarrier
//現在の部署が注文可能なキャリアの一覧
//
//@author ishizaki
//@since 2008/08/04
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $shopid
//@access public
//@return void
//
//
//受け取った価格表のメール送信ステータスを返す
//
//0:送信しない、1:送信する、2:送信した
//
//@author ishizaki
//@since 2008/12/11
//
//@param mixed $pricelistid
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
class UserPriceModel extends PriceModel {
	setPostID(postid) {
		this.PostID = postid;
	}

	constructor(pactid, postid = undefined) {
		super();
		this.PactID = pactid;

		if (false === is_null(postid)) {
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

	getNowPrice(productid, carid, type, buytype1, buytype2, paycnt, buyselid, shopid, groupid, price_auth_type = undefined, pactid = undefined, postid = undefined) //手入力の場合は等がないのでエラー回避のためif文を追加
	{
		this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice(" + productid + ", " + carid + ", " + type + ", " + buytype1 + ", " + buytype2 + ", " + paycnt + ", " + buyselid + ", " + shopid + ", " + groupid + ")", false);
		var H_price = Array();

		if (productid != undefined && carid != undefined && type != undefined && true == is_numeric(buytype1) && true == is_numeric(buytype2) && true == is_numeric(paycnt) && true == is_numeric(buyselid) && true == is_numeric(shopid) && true == is_numeric(groupid)) //引数追加 20090722miya
			{
				var ppid = this.getPPID(carid, type);
				var pricelistid = this.getPricelistID(ppid, shopid, groupid, price_auth_type, pactid, postid);

				if ("" != pricelistid) {
					var select_sql = "SELECT downmoney, totalprice, buyselid FROM price_detail_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + "buytype1 = " + this.getDB().dbQuote(buytype1, "integer", true) + " AND " + "buytype2 = " + this.getDB().dbQuote(buytype2, "integer", true) + " AND " + "paycnt = " + this.getDB().dbQuote(paycnt, "integer", true) + " AND " + "buyselid = " + this.getDB().dbQuote(buyselid, "integer", true) + " AND " + "productid = ";

					if (true == Array.isArray(productid)) {
						var count_productid = productid.length;

						for (var i = 0; i < count_productid; i++) {
							var select_sql_x = select_sql + this.getDB().dbQuote(productid[i], "integer", true);
							this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()sql->" + select_sql_x, false);
							H_price[productid[i]] = this.getDB().queryRowHash(select_sql_x);
						}
					} else {
						select_sql += this.getDB().dbQuote(productid, "integer", true);
						this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()sql->" + select_sql, false);
						H_price = this.getDB().queryRowHash(select_sql);
					}
				} else {
					this.getOut().debugOut(`model/Price/UserPriceModel::getNowPrice()${pricelistidがない}`, false);
					return false;
				}
			} else {
			this.getOut().debugOut("model/Price/UserPriceModel::getNowPrice()\u624B\u5165\u529B\u6271\u3044", false);
		}

		return H_price;
	}

	getNowPriceFromPriceDetailID(price_detailid, shopid, groupid) {
		var ppid = this.getPPIDfromPrceDetailID(price_detailid);
		var pricelistid = this.getPricelistID(ppid, shopid, groupid);
		var select_sql = "SELECT " + "nowprice.downmoney, " + "nowprice.totalprice, " + "nowprice.buyselid " + "FROM " + "price_detail_tb nowprice " + "INNER JOIN " + "price_detail_tb oldprice ON " + "nowprice.buytype1 = oldprice.buytype1 AND " + "nowprice.buytype2 = oldprice.buytype2 AND " + "nowprice.paycnt = oldprice.paycnt AND " + "nowprice.buyselid = oldprice.buyselid AND " + "nowprice.productid = oldprice.productid " + "WHERE " + "nowprice.pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true) + " AND " + "oldprice.price_detailid = " + this.getDB().dbQuote(price_detailid, "integer", true);
		return this.getDB().queryRowHash(select_sql);
	}

	getPricelistID(ppid, shopid, groupid, price_auth_type = undefined, pactid = undefined, postid = undefined) {
		if (true == is_null(pactid) && false == is_null(this.PactID)) {
			pactid = this.PactID;
		}

		if (true == is_null(postid) && false == is_null(this.PostID)) {
			postid = this.PostID;
		}

		if (true == is_null(price_auth_type)) {
			price_auth_type = this.checkPriceAuthType();
		}

		var join_sql = "";
		var where_sql = "plt.delflg = FALSE AND ";
		var where_shop = "prt.shopid";

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

		var select_sql = "SELECT " + "plt.pricelistid " + "FROM " + "pricelist_tb plt " + join_sql + "WHERE " + where_sql + where_shop + " = " + this.getDB().dbQuote(shopid, "integer", true) + " AND " + "plt.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "plt.ppid = " + this.getDB().dbQuote(ppid, "integer", true) + " AND " + "plt.datefrom <= " + this.getDB().dbQuote(this.getDB().getToday(), "string", true) + " AND " + "plt.defaultflg = " + this.getDB().dbQuote(defaultflg, "boolean", true) + " ORDER BY plt.datefrom DESC, plt.fixdate DESC, plt.pricelistid DESC LIMIT 1";
		return this.getDB().queryOne(select_sql);
	}

	getStocklist(shopid) {
		var select_sql = "SELECT " + "stock_a.productid, stock_a.status, product_branch_tb.property " + "FROM " + "stock_tb stock_a " + "INNER JOIN " + "product_branch_tb ON product_branch_tb.productid = stock_a.productid AND product_branch_tb.branchid = stock_a.branchid, " + "(SELECT productid, max(status) AS status FROM stock_tb WHERE shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " GROUP BY productid) stock_b " + "WHERE " + "stock_a.productid = stock_b.productid AND stock_a.status = stock_b.status AND stock_a.shopid = " + this.getDB().dbQuote(shopid, "integer", true);
		var A_temp = this.getDB().queryHash(select_sql);
		var H_temp = Array();
		var listcnt = A_temp.length;

		for (var cnt = 0; cnt < listcnt; cnt++) {
			H_temp[A_temp[cnt].productid] = A_temp[cnt].status;
		}

		return H_temp;
	}

	getCarrierShop(carid) {
		if (true == is_null(this.PactID)) {
			this.errorOut(0, "PactID \u304C\u30BB\u30C3\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (true == is_null(this.PostID)) {
			this.errorOut(0, "PostID \u304C\u30BB\u30C3\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		var select_sql = "SELECT shop_relation_tb.shopid, shop_tb.groupid FROM shop_relation_tb INNER JOIN shop_tb ON shop_relation_tb.shopid = shop_tb.shopid WHERE shop_relation_tb.postid = " + this.getDB().dbQuote(this.PostID, "integer", true) + " AND shop_relation_tb.pactid = " + this.getDB().dbQuote(this.PactID, "integer", true) + " AND shop_relation_tb.carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryRowHash(select_sql);
	}

	getOrderableCarrier(pactid, postid) {
		var select_sql = "SELECT carid FROM shop_relation_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND postid = " + this.getDB().dbQuote(postid, "integer", true) + " ORDER BY carid";
		return this.getDB().queryCol(select_sql);
	}

	returnMailStatus(pricelistid) {
		var sql = "SELECT " + "mailstatus " + "FROM " + "pricelist_tb " + "WHERE " + "pricelistid = " + this.getDB().dbQuote(pricelistid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};