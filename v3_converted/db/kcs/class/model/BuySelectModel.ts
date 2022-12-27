//
//購入方式テーブル（buyselect_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//購入方式テーブル（buyselect_tb）からデータを取得するModel
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
//buyselidをキーにbuyselnameを値にして返す
//
//@author houshiyama
//@since 2008/05/28
//
//@param mixed $carid
//@access public
//@return void
//
//
//buyselidをキーにbuyselname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $carid
//@access public
//@return void
//
//
//buyselidを引数にbuyselnameを返す
//
//@author miyazawa
//@since 2008/08/30
//
//@param mixed $buyselid
//@access public
//@return string
//
//
//buyselidを引数にbuyselname_engを返す
//
//@author miyazawa
//@since 2009/03/30
//
//@param mixed $buyselid
//@access public
//@return string
//
//
//telnoを引数にbuyselnameを返す
//
//@author ishizaki
//@since 2008/09/09
//
//@param mixed $telno
//@access public
//@return void
//
//
//telnoを引数にbuyselname_engを返す
//
//@author miyazawa
//@since 2009/03/30
//
//@param mixed $telno
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
class BuySelectModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getBuySelectKeyHash(carid) {
		var sql = "select buyselid,buyselname from buyselect_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getBuySelectEngKeyHash(carid) {
		var sql = "select buyselid,buyselname_eng from buyselect_tb where carid=" + carid + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getBuySelectName(buyselid = "") {
		var buyselname = undefined;

		if (buyselid != "") {
			var sql = "SELECT buyselname FROM buyselect_tb WHERE buyselid=" + buyselid;
			buyselname = this.get_DB().queryOne(sql);
		}

		return buyselname;
	}

	getBuySelectNameEng(buyselid = "") {
		var buyselname = undefined;

		if (buyselid != "") {
			var sql = "SELECT buyselname_eng AS buyselname FROM buyselect_tb WHERE buyselid=" + buyselid;
			buyselname = this.get_DB().queryOne(sql);
		}

		return buyselname;
	}

	getBuySelectNameFromTelno(telno) {
		var sql = "SELECT buyselect_tb.buyselname FROM tel_tb INNER JOIN buyselect_tb ON tel_tb.buyselid = buyselect_tb.buyselid WHERE tel_tb.telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().queryOne(sql);
	}

	getBuySelectNameFromTelnoEng(telno) {
		var sql = "SELECT buyselect_tb.buyselname_eng AS buyselname FROM tel_tb INNER JOIN buyselect_tb ON tel_tb.buyselid = buyselect_tb.buyselid WHERE tel_tb.telno = " + this.getDB().dbQuote(telno, "text", true);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};