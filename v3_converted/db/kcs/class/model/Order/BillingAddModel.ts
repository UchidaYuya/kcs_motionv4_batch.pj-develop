//
//請求先新規登録モデル
//
//@uses BillingModelBase
//@package
//@author web
//@since 2013/03/27
//

require("model/Order/BillingModelBase.php");

//
//__construct
//
//@author web
//@since 2013/03/27
//
//@access public
//@return void
//
//
//請求先情報インサート
//
//@author web
//@since 2013/03/28
//
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/27
//
//@access public
//@return void
//
class BillingAddModel extends BillingModelBase {
	constructor() {
		super();
	}

	insertBillData() {
		var lsess = this.getView().getLocalSession();
		var data = lsess.SELF;
		var sql = "SELECT NEXTVAL ('order_billing_tb_id_seq')";
		var id = this.get_DB().queryOne(sql);
		var now = this.get_DB().getNow();
		var defaultflg = false;

		if ("1" == data.defaultflg) {
			defaultflg = true;
		}

		this.sqls.push("INSERT INTO order_billing_tb " + "(id, pactid, billname, billpost, receiptname, zip1, zip2, addr1, addr2, building, billtel, billhow, defaultflg, fixdate, recdate) " + "VALUES(" + this.get_DB().dbQuote(id, "int", true) + ", " + this.get_DB().dbQuote(this.pactid, "int", true) + ", " + this.get_DB().dbQuote(data.billname, "text", true) + ", " + this.get_DB().dbQuote(data.billpost, "text", true) + ", " + this.get_DB().dbQuote(data.receiptname, "text", true) + ", " + this.get_DB().dbQuote(data.zip1, "text", true) + ", " + this.get_DB().dbQuote(data.zip2, "text", true) + ", " + this.get_DB().dbQuote(data.addr1, "text", true) + ", " + this.get_DB().dbQuote(data.addr2, "text", true) + ", " + this.get_DB().dbQuote(data.building, "text", true) + ", " + this.get_DB().dbQuote(data.billtel, "text", true) + ", " + this.get_DB().dbQuote(data.billhow, "text", true) + ", " + this.get_DB().dbQuote(defaultflg, "boolean", true) + ", " + this.get_DB().dbQuote(now, "text", true) + ", " + this.get_DB().dbQuote(now, "text", true) + ")");
		return this;
	}

	__destruct() {
		super.__destruct();
	}

};