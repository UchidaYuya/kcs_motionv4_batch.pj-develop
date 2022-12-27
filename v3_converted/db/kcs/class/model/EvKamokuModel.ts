//
//EV科目テーブル（ev_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//
//
//
//EV科目テーブル（ev_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//

require("ModelBase.php");

require("MtAuthority.php");

//
//コンストラクタ
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $O_db
//@access public
//@return void
//
//
//kamokuidをキーにkamokunameを値にして返す
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $default
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2010/07/15
//
//@access public
//@return void
//
class EvKamokuModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getEvKamokuKeyHash(pactid = 0) //ASP権限を見てチェック
	//自分のpactidの設定が無ければpact=0を取る
	{
		var O_auth = MtAuthority.singleton(pactid);
		var where = "";

		if (O_auth.chkPactFuncIni("fnc_asp") == false) {
			where = " AND kamokuid NOT IN (1,2) ";
		}

		var sql = "SELECT (kamokuid+1),kamokuname FROM ev_kamoku_tb " + " WHERE pactid=" + pactid + where + " ORDER BY pactid DESC, kamokuid";
		var A_data = this.get_DB().queryAssoc(sql);

		if (A_data.length < 1) {
			sql = "SELECT (kamokuid+1),kamokuname FROM ev_kamoku_tb " + " WHERE pactid=0 " + where + " ORDER BY pactid desc,kamokuid";
			A_data = this.get_DB().queryAssoc(sql);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};