//
//カード科目テーブル（card_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/07/03
//@uses ModelBase
//
//
//
//カード科目テーブル（card_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/07/03
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $O_db
//@access public
//@return void
//
//
//kamokuidをキーにkamokunameを値にして返す
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $default
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/07/03
//
//@access public
//@return void
//
class CardKamokuModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCardKamokuKeyHash(pactid = 0) //自分のpactidの設定が無ければpact=0を取る
	{
		var where = "";
		var sql = "select (kamokuid+1),kamokuname from card_kamoku_tb " + " where pactid=" + pactid + " order by pactid desc,kamokuid";
		var A_data = this.get_DB().queryAssoc(sql);

		if (A_data.length < 1) {
			sql = "select (kamokuid+1),kamokuname from card_kamoku_tb " + " where pactid=0 " + " order by pactid desc,kamokuid";
			A_data = this.get_DB().queryAssoc(sql);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};