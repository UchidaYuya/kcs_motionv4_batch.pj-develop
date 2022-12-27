//
//カード会社（card_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/14
//@uses ModelBase
//
//
//
//カード会社（card_co_tb）からデータを取得するModel
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
//@param mixed $tb（card_tb系のテーブル名）
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
class CardCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCardCoKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select cardcoid,cardconame from card_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCardCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）
	{
		var sql = "select cardcoid,cardconame_eng from card_co_tb ";

		if (true == default) {
			sql += " where defaultflg=true";
		}

		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseCardCoKeyHash(pactid, A_post, tb, coid = undefined) {
		var sql = "select ca.cardcoid,co.cardconame " + " from " + tb + " as ca " + " left join card_co_tb as co on ca.cardcoid=co.cardcoid " + " where " + " (ca.pactid=" + pactid + " and " + " ca.postid in (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " or co.cardcoid=" + coid;
		}

		sql += " group by ca.cardcoid,co.cardconame,co.sort" + " order by co.sort";
		var A_data = this.get_DB().queryAssoc(sql);
		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};