//
//購買先（purch_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/14
//@uses ModelBase
//
//
//
//購買先（purch_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/14
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/04/14
//
//@param mixed $O_db
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す
//
//@author houshiyama
//@since 2008/04/14
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconame_engを値にして返す
//
//@author houshiyama
//@since 2009/09/09
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す（使用中のもののみ）
//
//@author houshiyama
//@since 2008/04/14
//
//@param mixed $pactid
//@param array $A_post
//@param mixed $tb（purch_tb系のテーブル名）
//@param mixed $coid（検索値）
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/14
//
//@access public
//@return void
//
class PurchaseCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPurchCoKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select purchcoid,purchconame from purchase_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getPurchCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select purchcoid,purchconame_eng from purchase_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUsePurchCoKeyHash(pactid, A_post, tb, coid = undefined) {
		var sql = "select pu.purchcoid,co.purchconame " + " from " + tb + " as pu " + " left join purchase_co_tb as co on pu.purchcoid=co.purchcoid " + " where " + " (pu.pactid=" + pactid + " and " + " pu.postid in (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " or co.purchcoid=" + coid;
		}

		sql += " group by pu.purchcoid,co.purchconame,co.sort" + " order by co.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};