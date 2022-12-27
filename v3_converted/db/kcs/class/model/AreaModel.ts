//
//エリアテーブル（area_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//エリアテーブル（area_tb）からデータを取得するModel
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
//areaidをキーにareanameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return void
//
//
//areaidをキーにareaname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $carid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/21
//
//@access public
//@return void
//
class AreaModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getAreaKeyHash(carid) {
		var sql = "select arid,arname from area_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getAreaEngKeyHash(carid) {
		var sql = "select arid,arname_eng from area_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};