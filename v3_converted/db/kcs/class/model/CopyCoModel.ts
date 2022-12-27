//
//コピー機先（copy_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ModelBase
//
//
//
//コピー機先（copy_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $O_db
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す
//
//@author houshiyama
//@since 2008/05/14
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
//@param mixed $tb（copy_tb系のテーブル名）
//@param mixed $coid（検索値）
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCopyCoKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select copycoid,copyconame from copy_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCopyCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select copycoid,copyconame_eng from copy_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseCopyCoKeyHash(pactid, A_post, tb, coid) {
		var sql = "select cp.copycoid,co.copyconame " + " from " + tb + " as cp " + " left join copy_co_tb as co on cp.copycoid=co.copycoid " + " where " + " (cp.pactid=" + pactid + " and " + " cp.postid in (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " or co.copycoid=" + coid;
		}

		sql += " group by cp.copycoid,co.copyconame,co.sort" + " order by co.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};