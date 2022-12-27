//
//ユニーク文字列テーブル（unique_string_tb）を扱うModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2012/05/02
//@uses ModelBase
//
//
//
//エリアテーブル（unique_string_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2012/05/02
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2012/05/02
//
//@param mixed $O_db
//@access public
//@return void
//
//
//sessionidから行取得
//
//@author web
//@since 2012/05/02
//
//@param mixed $sessionid
//@access public
//@return void
//
//
//uniqueidから行取得
//
//@author web
//@since 2012/05/07
//
//@param mixed $uniqueid
//@access public
//@return void
//
//
//新規登録
//
//@author web
//@since 2012/05/02
//
//@param mixed $sessionid
//@param mixed $uniqueid
//@access public
//@return void
//
//
//更新
//
//@author web
//@since 2012/05/02
//
//@param mixed $sessionid
//@param mixed $uniqueid
//@access public
//@return void
//
//
//削除
//
//@author web
//@since 2012/05/15
//
//@param mixed $sessionid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2012/05/02
//
//@access public
//@return void
//
class UniqueStringModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getRowFromSessionId(sessionid) {
		var sql = "select * from unique_string_tb" + " where sessionid=" + this.getDB().dbQuote(sessionid, "text", true);
		var res = this.getDB().queryRowHash(sql);
		return res;
	}

	getRowFromUniqueId(uniqueid) {
		var sql = "select * from unique_string_tb" + " where uniqueid=" + this.getDB().dbQuote(uniqueid, "text", true);
		var res = this.getDB().queryRowHash(sql);
		return res;
	}

	insertRow(sessionid, uniqueid) {
		var sql = "insert into unique_string_tb values (" + this.getDB().dbQuote(sessionid, "text", true) + "," + this.getDB().dbQuote(uniqueid, "text", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";
		return this.getDB().query(sql);
	}

	updateRow(sessionid, uniqueid) {
		var sql = "update unique_string_tb set " + "uniqueid=" + this.getDB().dbQuote(uniqueid, "text", true) + "," + "fixdate=" + this.get_DB().dbQuote(this.getDB().getNow(), "timestamp", true) + " where " + "sessionid=" + this.get_DB().dbQuote(sessionid, "text", true);
		return this.getDB().query(sql);
	}

	deleteRow(sessionid) {
		var sql = "delete from unique_string_tb " + " where " + "sessionid=" + this.get_DB().dbQuote(sessionid, "text", true);
		return this.getDB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};