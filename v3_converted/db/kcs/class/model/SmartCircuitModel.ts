//
//端末種別（smart_circuit_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/08/04
//@uses ModelBase
//
//
//
//端末種別（smart_circuit_tb）からデータを取得するModel
//
//@uses ModelBase
//@package
//@author houshiyama
//@since 2008/08/04
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/08/04
//
//@param mixed $O_db
//@access public
//@return void
//
//
//smpciridをキーにsmpcirnameを値にして返す
//
//@author houshiyama
//@since 2008/08/04
//
//@access public
//@return void
//
//
//getSmartCircuitNameHash
//
//@author
//@since 2011/01/21
//
//@access public
//@return void
//
//
//smpciridをキーにsmpcirnameを値にして返す（英語）
//
//@author houshiyama
//@since 2008/08/04
//
//@access public
//@return void
//
//
//getSmartCircuitNameHash (英語)
//
//@author
//@since 2011/01/21
//
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author houshiyama
//@since 2008/08/04
//
//@access public
//@return void
//
class SmartCircuitModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getSmartCircuitKeyHash() {
		var sql = "select smpcirid,smpcirname from smart_circuit_tb order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getSmartCircuitNameHash() {
		var sql = "select smpcirname, smpcirname from smart_circuit_tb order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getSmartCircuitKeyHashEng() {
		var sql = "select smpcirid,smpcirname_eng from smart_circuit_tb order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getSmartCircuitNameHashEng() {
		var sql = "select smpcirname, smpcirname_eng from smart_circuit_tb order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};