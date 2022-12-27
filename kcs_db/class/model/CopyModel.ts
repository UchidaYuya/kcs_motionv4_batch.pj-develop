
import ModelBase from '../model/ModelBase';

export class CopyModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	async getCopyid(pactid, copycoid: string, delFlg = false, tableno = undefined) //現在テーブル
	{
		var A_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "copy_tb";
			} else {
			tableName = "copy_" + tableno + "_tb";
		}

		var sql = "select copyid " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and copycoid = " + copycoid + " " + "and delete_flg = " + delFlg + " " + "order by copyid";
		A_dbData = await this.get_DB().queryCol(sql);
		return A_dbData;
	}

	chgDelFlg(pactid: string, copycoid: string, A_copyid: any, flag: boolean, tableno = undefined) //現在テーブル
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

	// __destruct() {
	// 	super.__destruct();
	// }

};
