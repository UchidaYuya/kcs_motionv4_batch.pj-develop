//
//購買先（purch_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author maeda
//@filesource
//@since 2008/04/30
//@uses ModelBase
//
//
//
//購買先（purchase_X_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/04/30
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/04/30
//
//@param mixed $O_db
//@access public
//@return void
//
//
//登録されている購買ＩＤを取得する
//
//@author maeda
//@since 2008/04/30
//
//@param mixed $pactid : 契約ＩＤ
//@param mixed $purchcoid : 購買キャリアＩＤ
//@param mixed $delFlg : 削除フラグ
//@param mixed $tableno : 対象テーブルＮＯ
//@access public
//@return void
//
//
//購買ＩＤの削除フラグを切り替える
//
//@author maeda
//@since 2008/05/07
//
//@param mixed $pactid ：契約ＩＤ
//@param mixed $purchcoid ：購買キャリアＩＤ
//@param mixed $A_purchid ：購買ＩＤリスト
//@param mixed $flag ：削除フラグ値
//@param mixed $tableno ：対象テーブルＮＯ
//@access public
//@return void
//
//
//親のデストラクタを必ず呼ぶ
//
//@author maeda
//@since 2008/04/30
//
//@access public
//@return void
//
class PurchaseModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPurchid(pactid, purchcoid, delFlg = false, tableno = undefined) //現在テーブル
	{
		var A_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "purchase_tb";
			} else {
			tableName = "purchase_" + tableno + "_tb";
		}

		var sql = "select purchid " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and purchcoid = " + purchcoid + " " + "and delete_flg = " + delFlg + " " + "order by purchid";
		A_dbData = this.get_DB().queryCol(sql);
		return A_dbData;
	}

	chgDelFlg(pactid, purchcoid, A_purchid, flag, tableno = undefined) //現在テーブル
	{
		if (undefined == tableno) //過去テーブル
			{
				var tableName = "purchase_tb";
			} else {
			tableName = "purchase_" + tableno + "_tb";
		}

		var sql = "update " + tableName + " " + "set delete_flg = " + flag + " " + "where pactid = " + pactid + " " + "and purchcoid = " + purchcoid + " " + "and purchid in ('" + A_purchid.join("','") + "')";
		return this.getDB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};