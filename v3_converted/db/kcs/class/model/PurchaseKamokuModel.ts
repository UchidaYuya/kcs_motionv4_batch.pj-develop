//
//購買科目テーブル（purchase_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/18
//@uses ModelBase
//
//
//
//購買科目テーブル（purchase_kamoku_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/18
//@uses ModelBase
//

require("ModelBase.php");

require("MtAuthority.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/04/18
//
//@param mixed $O_db
//@access public
//@return void
//
//
//kamokuidをキーにkamokunameを値にして返す
//
//@author houshiyama
//@since 2008/04/18
//
//@param mixed $pactid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/18
//
//@access public
//@return void
//
class PurchaseKamokuModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPurchKamokuKeyHash(pactid = 0) //ASP権限を見てチェック
	//自分のpactidの設定が無ければpact=0を取る
	{
		var O_auth = MtAuthority.singleton(pactid);
		var where = "";

		if (O_auth.chkPactFuncIni("fnc_asp") == false) {
			where = " and kamokuid not in (2,3) ";
		}

		var sql = "select (kamokuid+1),kamokuname from purchase_kamoku_tb " + " where pactid=" + pactid + where + " order by pactid desc,kamokuid";
		var A_data = this.get_DB().queryAssoc(sql);

		if (A_data.length < 1) {
			sql = "select (kamokuid+1),kamokuname from purchase_kamoku_tb " + " where pactid=0 " + where + " order by pactid desc,kamokuid";
			A_data = this.get_DB().queryAssoc(sql);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};