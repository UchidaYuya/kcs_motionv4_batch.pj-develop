//
//Shop管理記録Model
//
//@uses ModelBase
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2009/01/08
//
//
//
//ShopメニューModel
//
//@uses ModelBase
//@package ShopMenu
//@author houshiyama
//@since 2009/01/08
//

require("model/ModelBase.php");

//
//__construct
//
//@author houshiyama
//@since 2009/01/08
//
//@param mixed $O_db
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2009/01/08
//
//@access public
//@return void
//
class FlatMenuModel extends ModelBase {
	constructor() {
		super();
	}

	getFlatEverySecondMonth(pactid) {
		var sql = "select flatid from bill_flat_esm_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};