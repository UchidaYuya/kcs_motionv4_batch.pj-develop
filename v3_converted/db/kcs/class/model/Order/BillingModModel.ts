//
//請求先編集モデル
//
//@uses BillingModelBase
//@package
//@author web
//@since 2013/04/01
//

require("model/Order/BillingModelBase.php");

//
//__construct
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//請求先情報を更新
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//makeCheckedPost
//
//@author web
//@since 2013/04/04
//
//@param mixed $data
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
class BillingModModel extends BillingModelBase {
	constructor() {
		super();
	}

	updateBillData() {
		var lsess = this.getView().getLocalSession();
		var data = lsess.SELF;

		if (undefined !== data.defaultflg) {
			var defaultflg = true;
		}

		var sql = "UPDATE order_billing_tb " + "SET " + "billpost=" + this.get_DB().dbQuote(data.billpost, "text", true) + ", " + "billname=" + this.get_DB().dbQuote(data.billname, "text", true) + ", " + "receiptname=" + this.get_DB().dbQuote(data.receiptname, "text", true) + ", " + "zip1=" + this.get_DB().dbQuote(data.zip1, "text", true) + ", " + "zip2=" + this.get_DB().dbQuote(data.zip2, "text", true) + ", " + "addr1=" + this.get_DB().dbQuote(data.addr1, "text", true) + ", " + "addr2=" + this.get_DB().dbQuote(data.addr2, "text", true) + ", " + "building=" + this.get_DB().dbQuote(data.building, "text", true) + ", " + "billhow=" + this.get_DB().dbQuote(data.billhow, "text", true) + ", " + "billtel=" + this.get_DB().dbQuote(data.billtel, "text", true) + ", " + "fixdate=" + this.get_DB().dbQuote(this.get_DB().getNow(), "timestamp", true);

		if (undefined !== defaultflg) {
			sql += ", defaultflg=" + this.get_DB().dbQuote(defaultflg, "boolean", true);
		}

		sql += " WHERE " + "id=" + this.get_DB().dbQuote(data.id, "int", true);
		this.sqls.push(sql);
		return this;
	}

	makeCheckedPost(data) {
		if (Array.isArray(data)) {
			for (var postid of Object.values(data)) {
				result[postid] = 1;
			}
		}

		return result;
	}

	__destruct() {
		super.__destruct();
	}

};