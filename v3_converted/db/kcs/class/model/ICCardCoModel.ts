//
//交通費キャリア（copy_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/07
//@uses ModelBase
//
//
//
//交通費キャリア（copy_co_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/07/07
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author miyazawa
//@since 2010/07/07
//
//@param mixed $O_db
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す
//
//@author miyazawa
//@since 2010/07/07
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconame_engを値にして返す
//
//@author miyazawa
//@since 2010/07/07
//
//@param mixed $default
//@access public
//@return void
//
//
//coidをキーにconameを値にして返す（使用中のもののみ）
//
//@author miyazawa
//@since 2010/07/07
//
//@param mixed $pactid
//@param array $A_post
//@param mixed $tb（iccard_tb系のテーブル名）
//@param mixed $coid（検索値）
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author miyazawa
//@since 2010/07/07
//
//@access public
//@return void
//
class ICCardCoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getICCardCoKeyHash(default = true) //デフォルトフラグ（基本見る）現状iccard_co_tbにデフォルトフラグはないのでコメントアウト
	//if( true == $default ){
	//$sql .= " where defaultflg=true";
	//}
	{
		var sql = "select iccardcoid,iccardconame from iccard_co_tb ";
		sql += " WHERE iccardcoid != 0";
		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getICCardCoEngKeyHash(default = true) //デフォルトフラグ（基本見る）現状iccard_co_tbにデフォルトフラグはないのでコメントアウト
	//if( true == $default ){
	//$sql .= " where defaultflg=true";
	//}
	{
		var sql = "select iccardcoid,iccardconame_eng from iccard_co_tb ";
		sql += " WHERE iccardcoid != 0";
		sql += " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseICCardCoKeyHash(pactid, A_post, tb, coid) {
		var sql = "select ic.iccardcoid,co.iccardconame " + " from " + tb + " as cp " + " left join iccard_co_tb as co on ic.iccardcoid=co.iccardcoid " + " where " + " (ic.pactid=" + pactid + " and " + " ic.postid in (" + A_post.join(",") + "))";

		if (coid != undefined) {
			sql += " or co.iccardcoid=" + coid;
		}

		sql += " group by ic.iccardcoid,co.iccardconame,co.sort" + " order by co.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};