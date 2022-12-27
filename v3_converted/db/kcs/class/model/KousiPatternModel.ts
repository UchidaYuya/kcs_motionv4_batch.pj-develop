//
//公私分計パターン（kousi_rel_pattern_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//公私分計パターン（kousi_rel_pattern_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $O_db
//@access public
//@return void
//
//
//patternidをキーにpatternnameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
class KousiPtnModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getKousiPtnKeyHash(pactid, carid) //SQL文
	{
		var sql = "select krp.patternid, kp.patternname " + "from kousi_rel_pact_tb krp inner join kousi_pattern_tb kp on krp.patternid = kp.patternid " + " where krp.pactid = " + pactid + " and " + " krp.carid = " + carid + " order by krp.patternid";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

};