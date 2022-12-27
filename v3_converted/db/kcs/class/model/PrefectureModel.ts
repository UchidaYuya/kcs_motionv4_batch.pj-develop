//
//都道府県テーブル（prefecture_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2009/04/02
//@uses ModelBase
//
//
//
//都道府県テーブル（prefecture_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2009/04/02
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
//prefをキーにareanameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
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
class PrefectureModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPrefecture(language = "JPN") {
		if ("ENG" == language) {
			var sql = "SELECT pref,pref_eng FROM prefecture_tb ORDER BY sort";
		} else {
			sql = "SELECT pref,pref FROM prefecture_tb ORDER BY sort";
		}

		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};