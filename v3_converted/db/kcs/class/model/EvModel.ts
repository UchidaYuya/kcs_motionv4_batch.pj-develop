//
//EvTbに関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2010/08/06
//
//
//
//EvTbに関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2010/08/06
//

require("MtSetting.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/01
//
//@param object $O_DB
//@access public
//@return void
//
//
//指定されたEvが存在するか確認
//
//@author ishizaki
//@since 2010/08/06
//
//@param string $evid
//@param integer $pactid
//@access public
//@return boolean
//
class EvModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	isExistEv(evid, pactid) {
		var sql = "SELECT " + "count(*) " + "FROM " + "ev_tb " + "WHERE " + "evid = " + this.getDB().dbQuote(evid, "text", true) + " AND " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(sql) ? true : false;
	}

};