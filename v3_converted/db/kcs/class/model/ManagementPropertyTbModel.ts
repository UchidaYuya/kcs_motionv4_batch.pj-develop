//
//管理情報のユーザ設定項目（management_property_tb）に関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/08/28
//
//
//
//管理情報のユーザ設定項目（management_property_tb）に関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/28
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
//getManagementPropertyData
//管理項目の編集
//@author igarashi
//@since 2009/06/26
//
//@param mixed $pactid
//@param mixed $mid
//@access public
//@return void
//
//
//getManagementPropertyDataForRequired
//
//@author igarashi
//@since 2009/06/26
//
//@param mixed $pactid
//@param mixed $mid
//@access public
//@return void
//
//
//設定項目配列のユーザー定義ソート用関数
//
//@author houshiyama
//@since 2008/04/24
//
//@param mixed $val1
//@param mixed $val2
//@access private
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
class ManagementPropertyTbModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getManagementPropertyData(pactid, mid, telhide = false) //S225 hanashima 20201023
	//uksort( $H_data, array( $this, "comparePropertyArray" ) );
	{
		var sql = "select col,colname from management_property_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and mid=" + this.get_DB().dbQuote(mid, "integer", true);

		if (telhide) {
			sql += " and telhide= false";
		}

		sql += " ORDER BY sort";
		var H_data = this.get_DB().queryKeyAssoc(sql);
		return H_data;
	}

	getManagementPropertyDataForEdit(pactid, mid) {
		var sql = "SELECT col,colname, ordviewflg,requiredflg,sort,ordrequiredflg,telhide FROM management_property_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND mid=" + this.get_DB().dbQuote(mid, "integer", true);
		var H_data = this.get_DB().queryKeyAssoc(sql);
		uksort(H_data, [this, "comparePropertyArray"]);
		return H_data;
	}

	getManagementPropertyDataForRequired(pactid, mid) //sortでソートするようにしました 20190124
	//uksort($H_data, array($this, "comparePropertyArray"));
	{
		var sql = "SELECT col,colname, requiredflg, ordrequiredflg FROM management_property_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND mid=" + this.get_DB().dbQuote(mid, "integer", true) + " ORDER BY sort";
		var H_data = this.get_DB().queryKeyAssoc(sql);
		return H_data;
	}

	comparePropertyArray(val1, val2) //同ジャンル
	{
		if (val1.replace(/(\d)/g, "") == val2.replace(/(\d)/g, "")) //末尾の番号で比較
			{
				if (val1.replace(/(\D)/g, "") < val2.replace(/(\D)/g, "")) {
					return -1;
				} else {
					return 1;
				}
			} else //まずはtext優先
			{
				if (preg_match("/^text/", val1) == true && preg_match("/^text/", val2) == false) {
					return -1;
				}

				if (preg_match("/^int/", val1) == true && preg_match("/^text|^int/", val2) == false) {
					return -1;
				}

				if (preg_match("/^date/", val1) == true && preg_match("/^text|^int|^date/", val2) == false) {
					return -1;
				}

				if (preg_match("/^mail/", val1) == true && preg_match("/^text|^int|^date|^mail/", val2) == false) {
					return -1;
				}

				if (preg_match("/^url/", val1) == true && preg_match("/^text|^int|^date|^mail|^url/", val2) == false) {
					return -1;
				}

				if (preg_match("/^select/", val1) == true && preg_match("/^text|^int|^date|^mail|^url|^select/", val2) == false) {
					return -1;
				} else {
					return 1;
				}
			}
	}

	__destruct() {
		super.__destruct();
	}

};