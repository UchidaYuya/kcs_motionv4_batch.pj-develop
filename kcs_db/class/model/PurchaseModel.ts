
// require("ModelBase.php");
import ModelBase from '../model/ModelBase';

export class PurchaseModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	async getPurchid(pactid: any, purchcoid: any, delFlg = false, tableno: any = undefined) //現在テーブル
	{
		var A_dbData = Array();

		if (undefined == tableno) //過去テーブル
		{
			var tableName = "purchase_tb";
		} else {
			tableName = "purchase_" + tableno + "_tb";
		}

		var sql = "select purchid " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and purchcoid = " + purchcoid + " " + "and delete_flg = " + delFlg + " " + "order by purchid";
		A_dbData = await this.get_DB().queryCol(sql);
		return A_dbData;
	}

	chgDelFlg(pactid: any, purchcoid: any, A_purchid: any, flag: any, tableno: any = undefined) //現在テーブル
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

	// __destruct() {
	// 	super.__destruct();
	// }

};
