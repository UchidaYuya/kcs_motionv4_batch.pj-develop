//
//注文の請求先一覧用モデル
//
//@uses BillingModelBase
//@package
//@author web
//@since 2013/03/22
//

require("model/Order/BillingModelBase.php");

//
//__construct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//setPageData
//
//@author web
//@since 2013/04/16
//
//@access protected
//@return void
//
//
//社内の請求先一覧取得
//
//@author web
//@since 2013/04/16
//
//@access public
//@return void
//
//
//部署に紐付いた請求先一覧取得
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//getPageLink
//
//@author web
//@since 2013/04/16
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
class BillingMenuModel extends BillingModelBase {
	constructor() {
		super();
		this.limit = 10;
		this.offset = 0;
		this.page = 1;
		this.listCnt = 0;
		this.limit = 10;
		this.offseet = 0;
	}

	setPageData() {
		var lSess = this.getView().gSess().getSelfAll();
		var offset = 1;

		if (is_numeric(lSess.p) || 0 < lSess.p) {
			this.page = lSess.p;
		}

		if (is_numeric(lSess.limit) || 0 < lSess.limit) {
			this.limit = lSess.limit;
		}

		this.getView().assign("limit", this.limit);
		this.offset = this.limit * (this.page - 1);

		if (0 > this.offset) {
			this.offset = 0;
		}
	}

	getMenuList() {
		this.setPageData();
		var lang = this.getView().getLangLists("billhow");
		var sql = "SELECT COUNT(b.id) " + "FROM " + "order_billing_tb b " + "WHERE " + "b.pactid=" + this.get_DB().dbQuote(this.pactid, "int", true);
		this.listCnt = this.get_DB().queryOne(sql);
		sql = "SELECT b.id, b.billname, b.billpost, b.receiptname, b.zip1, b.zip2, b.addr1, b.addr2, b.building, b.billtel, b.defaultflg, " + "CASE b.billhow " + "WHEN 'bank' THEN '" + lang.bank[this.getView().gSess().language] + "' " + "WHEN 'cash' THEN '" + lang.cash[this.getView().gSess().language] + "' " + "WHEN 'card' THEN '" + lang.card[this.getView().gSess().language] + "' " + "WHEN 'misc' THEN '" + lang.misc[this.getView().gSess().language] + "' " + "END AS billhow " + "FROM " + "order_billing_tb b " + "WHERE " + "b.pactid=" + this.get_DB().dbQuote(this.pactid, "int", true) + " " + "ORDER BY " + "b.billpost, b.receiptname, b.zip1, b.zip2, b.addr1, b.addr2, b.building, b.billtel " + "LIMIT " + this.limit + " " + "OFFSET " + this.offset;
		return this.get_DB().queryHash(sql);
	}

	getList() {
		this.setPageData();
		var lang = this.getView().getLangLists("billhow");
		var language = this.getView().gSess().language;

		if (is_null(language)) {
			language = "JPN";
		}

		var sql = "SELECT COUNT(b.id) " + "FROM " + "order_billing_tb b " + "WHERE " + "pactid=" + this.get_DB().dbQuote(this.pactid, "int", true);
		this.listCnt = this.get_DB().queryOne(sql);
		sql = "SELECT b.id, b.billname, b.billpost, b.receiptname, b.zip1, b.zip2, b.addr1, b.addr2, b.building, b.billtel, b.defaultflg, " + "CASE b.billhow " + "WHEN 'bank' THEN '" + lang.bank[language] + "' " + "WHEN 'cash' THEN '" + lang.cash[language] + "' " + "WHEN 'card' THEN '" + lang.card[language] + "' " + "WHEN 'misc' THEN '" + lang.misc[language] + "' " + "END AS billhow " + "FROM " + "order_billing_tb b " + "WHERE " + "b.pactid=" + this.get_DB().dbQuote(this.pactid, "int", true) + " " + "ORDER BY " + "b.billpost, b.receiptname, b.zip1, b.zip2, b.addr1, b.addr2, b.building, b.billtel " + "LIMIT " + this.limit + " " + "OFFSET " + this.offset;
		return this.get_DB().queryHash(sql);
	}

	getPageLink() {
		require("OrderUtil.php");

		var orderUtil = new OrderUtil();

		if ("ENG" == this.getView().gSess().language) {
			this.getView().assign("pageLink", orderUtil.getPageLinkEng(this.listCnt, this.limit, this.pgae));
		} else {
			this.getView().assign("pageLink", orderUtil.getPageLink(this.listCnt, this.limit, this.page));
		}
	}

	__destruct() {
		super.__destruct();
	}

};