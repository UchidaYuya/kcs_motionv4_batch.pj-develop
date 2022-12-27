//
//FlatEverySecondMonthModModel
//
//@uses FlatEverySecondMonthAddModel
//@package
//@author web
//@since 2015/09/24
//

require("model/Admin/Regist/FlatEverySecondMonthAddModel.php");

//
//__construct
//
//@author date
//@since 2015/09/24
//
//@access public
//@return void
//
//
//getFlatId
//平準化IDの取得
//@author web
//@since 2015/09/25
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getEsmData
//
//@author date
//@since 2015/09/24
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getParentTel
//親番号の取得
//@author date
//@since 2015/09/24
//
//@param mixed $flatid
//@access public
//@return void
//
//
//makeAddSQL
//SQLの作成
//@author web
//@since 2015/09/16
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2015/09/24
//
//@access public
//@return void
//
class FlatEverySecondMonthDeleteModel extends FlatEverySecondMonthAddModel {
	constructor() {
		super();
	}

	getFlatId(pactid) {
		var sql = "select flatid from bill_flat_esm_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	getEsmData(pactid) {
		var sql = "select * from bill_flat_esm_tb where pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		var res = this.getDB().queryRowHash(sql);
		return res;
	}

	getParentTelData(flatid) {
		var sql = "select mcntype,prtelno,prtelname from bill_flat_prtel_tb" + " where" + " flatid = " + this.getDB().dbQuote(flatid, "integer", true) + " and flattype = " + this.getDB().dbQuote(1, "integer", true);
		var res = this.getDB().queryHash(sql);
		return res;
	}

	makeDeleteSQL(H_sess) {
		var flatid = this.getFlatId(H_sess.pactid);
		var flattype = 1;
		var res = Array();
		res.push("delete from bill_flat_prtel_tb where flatid=" + this.get_DB().dbQuote(flatid, "integer", true));
		res.push("delete from bill_flat_exclude_tb where flatid=" + this.get_DB().dbQuote(flatid, "integer", true));
		res.push("delete from bill_flat_esm_tb where flatid=" + this.get_DB().dbQuote(flatid, "integer", true));
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};