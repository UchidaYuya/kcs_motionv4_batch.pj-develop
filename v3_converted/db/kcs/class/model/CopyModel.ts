//
//コピーテーブル（copy_tb,copy_X_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author maeda
//@filesource
//@since 2008/07/01
//@uses ModelBase
//
//
//
//コピーテーブル（copy_tb,copy_X_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/07/01
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $O_db
//@access public
//@return void
//
//
//登録されている購買ＩＤを取得する
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $pactid : 契約ＩＤ
//@param mixed $copycoid : 購買キャリアＩＤ
//@param mixed $delFlg : 削除フラグ
//@param mixed $tableno : 対象テーブルＮＯ
//@access public
//@return void
//
//
//購買ＩＤの削除フラグを切り替える
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $pactid ：契約ＩＤ
//@param mixed $copycoid ：購買キャリアＩＤ
//@param mixed $A_copyid ：購買ＩＤリスト
//@param mixed $flag ：削除フラグ値
//@param mixed $tableno ：対象テーブルＮＯ
//@access public
//@return void
//
//
//親のデストラクタを必ず呼ぶ
//
//@author maeda
//@since 2008/07/01
//
//@access public
//@return void
//
class CopyModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCopyid(pactid, copycoid, delFlg = false, tableno = undefined) //現在テーブル
	{
		var A_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "copy_tb";
			} else {
			tableName = "copy_" + tableno + "_tb";
		}

		var sql = "select copyid " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and copycoid = " + copycoid + " " + "and delete_flg = " + delFlg + " " + "order by copyid";
		A_dbData = this.get_DB().queryCol(sql);
		return A_dbData;
	}

	chgDelFlg(pactid, copycoid, A_copyid, flag, tableno = undefined) //現在テーブル
	{
		if (undefined == tableno) //過去テーブル
			{
				var tableName = "copy_tb";
			} else {
			tableName = "copy_" + tableno + "_tb";
		}

		var sql = "update " + tableName + " " + "set delete_flg = " + flag + " " + "where pactid = " + pactid + " " + "and copycoid = " + copycoid + " " + "and copyid in ('" + A_copyid.join("','") + "')";
		return this.getDB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};