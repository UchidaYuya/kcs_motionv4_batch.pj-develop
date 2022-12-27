require("model/ModelBase.php");

//
//__construct
//
//@author web
//@since 2015/09/28
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getExclude
//
//@author web
//@since 2015/09/28
//
//@param mixed $pactid
//@param mixed $flattype
//@param mixed $mcntype
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2015/09/28
//
//@access public
//@return void
//
class FlatExemptDownloadModel extends ModelBase {
	constructor(O_db) {
		super(O_db);
	}

	getExclude(pactid, flattype, mcntype) {
		var sql = "select flatid from bill_flat_esm_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var flatid = this.get_DB().queryOne(sql);

		if (!flatid) {
			return Array();
		}

		sql = "select telno_view from bill_flat_exclude_tb where" + " flatid=" + this.get_DB().dbQuote(flatid, "integer", true) + " and flattype=" + this.get_DB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.get_DB().dbQuote(mcntype, "integer", true);
		return this.get_DB().queryCol(sql);
	}

	__destruct() {
		super.__destruct();
	}

};