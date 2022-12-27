//
//運送会社（tran_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ModelBase
//
//
//
//運送会社（tran_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $O_db
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconame_engを値にして返す
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す（使用中のもののみ）
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $pactid
//@param array $A_post
//@param mixed $tb（tran_tb系のテーブル名）
//@param mixed $coid（検索値）
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2010/02/19
//
//@access public
//@return void
//
class HealthcareCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getHealthcareCoKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select healthcoid,healthconame from healthcare_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getTranCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select trancoid,tranconame_eng from transit_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseHealthcareCoKeyHash(pactid, A_post, tb, coid = undefined) {
		var sql = "select hlt.healthcoid,co.healthconame " + " from " + tb + " as hlt " + " left join healthcare_co_tb as co on hlt.healthcoid=co.healthcoid " + " where " + " (hlt.pactid=" + pactid + " and " + " hlt.postid in (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " or co.healthcoid=" + coid;
		}

		sql += " group by hlt.healthcoid,co.healthconame,co.sort" + " order by co.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};