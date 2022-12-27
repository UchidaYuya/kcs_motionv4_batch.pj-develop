//
//部署管理のユーザ設定項目（post_property_tb）に関するモデル
//
//@uses ModelBase
//@package
//@author houshiyama
//@since 2009/02/20
//
//
//
//部署管理のユーザ設定項目（post_property_tb）に関するモデル
//
//PostPropertyModel
//
//@uses ModelBase
//@package
//@author houshiyama
//@since 2009/02/20
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/05/28
//
//@param object $O_DB
//@access public
//@return void
//
//
//指定した管理種別のユーザ設定項目一覧を取得する
//
//@author nakanita
//@since 2008/08/28
//
//@param mixed $pactid
//@param mixed $mid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author nakanita
//@since 2008/08/28
//
//@access public
//@return void
//
class PostPropertyModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPostPropertyData(pactid) {
		var sql = "select colid,colname from post_property_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var H_data = this.get_DB().queryKeyAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};