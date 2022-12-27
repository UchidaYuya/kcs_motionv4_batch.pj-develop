//
//内線設定（extension_setting_tb）を扱うModel
//
//更新履歴：
//2011/10/13 宝子山浩平 作成
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2011/10/13
//@uses ModelBase
//
//
//
//内線設定（extension_setting_tb）を扱うModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2011/10/13
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2011/10/13
//
//@param mixed $O_db
//@access public
//@return void
//
//
//指定pactidの設定一欄取得
//
//@author houshiyama
//@since 2011/10/12
//
//@param mixed $pactid
//@access public
//@return void
//
//
//設定があるかチェック
//
//@author nakanita
//@since 2011/10/14
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//extension_setting_tb更新
//
//@author nakanita
//@since 2011/10/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $H_data
//@access public
//@return void
//
//
//指定キャリアの設定削除
//
//@author houshiyama
//@since 2011/10/21
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2011/10/13
//
//@access public
//@return void
//
class ExtensionSettingTbModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPactSetting(pactid) {
		var sql = "select carid,* from extension_setting_tb " + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryKeyAssoc(sql);
	}

	checkExistsSetting(pactid, carid = undefined) {
		var sql = "select count(pactid) from extension_setting_tb" + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true);

		if (carid) {
			sql += " and carid=" + this.getDB().dbQuote(carid, "integer", true);
		}

		if (this.getDB().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	saveExtensionSetting(pactid, carid, H_data) {
		if (this.checkExistsSetting(pactid, carid)) {
			var sql = "update extension_setting_tb set" + " min_no=" + this.getDB().dbQuote(H_data.min_no, "integer", true) + ",max_no=" + this.getDB().dbQuote(H_data.max_no, "integer", true) + ",digit_number=" + this.getDB().dbQuote(H_data.digit_number, "integer", true) + ",fixdate=" + this.getDB().dbQuote(this.getDateUtil().getNow(), "timestamp", true) + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and " + " carid=" + this.getDB().dbQuote(carid, "integer", true);
		} else {
			sql = "insert into extension_setting_tb values(" + this.getDB().dbQuote(pactid, "integer", true) + "," + this.getDB().dbQuote(carid, "integer", true) + "," + this.getDB().dbQuote(H_data.min_no, "integer", true) + "," + this.getDB().dbQuote(H_data.max_no, "integer", true) + "," + this.getDB().dbQuote(H_data.digit_number, "integer", true) + "," + this.getDB().dbQuote(this.getDateUtil().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(this.getDateUtil().getNow(), "timestamp", true) + ")";
		}

		return this.getDB().query(sql);
	}

	clearExtensionSetting(pactid, carid) {
		if (this.checkExistsSetting(pactid, carid)) {
			var sql = "delete from extension_setting_tb" + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and " + " carid=" + this.getDB().dbQuote(carid, "integer", true);
			return this.getDB().query(sql);
		}

		return true;
	}

	__destruct() {
		super.__destruct();
	}

};