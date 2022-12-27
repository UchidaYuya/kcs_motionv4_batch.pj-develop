//
//顧客ID・科目ごとの変数項目マスターテーブル（summary_formula_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2009/02/18
//@uses ModelBase
//
//
//
//顧客ID・科目ごとの変数項目マスターテーブル（summary_formula_tb）からデータを取得するModel
//
//@uses ModelBase
//@package
//@author houshiyama
//@since 2009/02/18
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_db
//@access public
//@return void
//
//
//assetstypeidをキーにassetstypenameを値にして返す
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $pactid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author houshiyama
//@since 2009/02/18
//
//@access public
//@return void
//
class SummaryFormulaModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getSummaryFormulaKeyHash(pactid) {
		var sql = "select " + " '" + str + "' || code as code " + ",label " + " from " + " summary_formula_tb " + " where " + " pactid = " + pactid + " and " + " code not like 'kamoku%'";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};