//
//EV会社テーブル先（ev_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//
//
//
//コピー機先（ev_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//

require("ModelBase.php");

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
//coidをキーにconameを値にして返す
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconame_engを値にして返す
//
//@author miyazawa
//@since 2009/09/09
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す（使用中のもののみ）
//
//@author miyazawa
//@since 2008/04/14
//
//@param mixed $pactid
//@param array $A_post
//@param mixed $tb（ev_tb系のテーブル名）
//@param mixed $coid（検索値）
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
class EvCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getEvCoKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "SELECT evcoid,evconame FROM ev_co_tb ";

		if (true == default) {
			sql += " WHERE defaultflg=true";
		}

		sql += " ORDER BY sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getEvCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "SELECT evcoid,evconame_eng FROM ev_co_tb ";

		if (true == default) {
			sql += " WHERE defaultflg=true";
		}

		sql += " ORDER BY sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseEvCoKeyHash(pactid, A_post, tb, coid) {
		var sql = "SELECT ev.evcoid,co.evconame " + " FROM " + tb + " AS ev " + " LEFT JOIN ev_co_tb AS co on ev.evcoid=co.evcoid " + " WHERE " + " (ev.pactid=" + pactid + " AND " + " ev.postid IN (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " OR co.evcoid=" + coid;
		}

		sql += " GROUP BY ev.evcoid,co.evconame,co.sort" + " ORDER BY co.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};