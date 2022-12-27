
import ModelBase from "../ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";

export class DeleteSendBillMailModel extends ModelBase {

	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getNow() {
		return this.get_DB().getNow();
	}

	async deleteSQL(pactid: string) //2年後の日付を取得
	//削除対象のメール
	//削除対象のpactidが指定されている？
	//対象がないなら空を返す
	{
		// var sqls = Array();
		var sqls: { [key: string]: any } = {};
		var today = this.getNow();
		// var year = +today.substr(0, 4);
		var year = +today.substring(0, 4);
		// var month = +today.substr(5, 2);
		var month = +today.substring(5, 2);
		// var date = date("Y-m-d", mktime(0, 0, 0, month, 1, year - 2));
		var date = new Date(year - 2, month, 1, 0, 0, 0).toJSON().slice(0,10).replace(/-/g,'-');
		date = this.get_DB().dbQuote(date, "timestamp", true);
		var sql = "select id from bill_mail_history_tb where" + " recdate < " + date;

		if (pactid != "all") {
			sql += " and pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		}

		var mail_list = await this.get_DB().queryCol(sql);

		if (!mail_list) {
			return Array();
		}

		var text = mail_list.join(",");
		sqls.bill_mail_to_tb = "delete from bill_mail_to_tb where hid in (" + text + ")";
		sqls.bill_mail_history_tb = "delete from bill_mail_history_tb where id in (" + text + ")";
		return sqls;
	}

	update(pactid) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
		var sqls = this.deleteSQL(pactid);

		if (!sqls) {
			// this.getOut().infoOut("\u524A\u9664\u5BFE\u8C61\u306A\u3057\n", 1);
			this.getOut().infoOut("削除対象なし\n", 1);
		}

		for (var tableName in sqls) {
			var sql = sqls[tableName];
			// var result = this.getDB().exec(sql, false);
			var result = this.getDB().exec(sql, false);

			var dbh: any;
			// if (PEAR.isError(result)) {
			if (dbh.isError(result)) {
				this.getDB().rollback();
				return false;
			}

			// this.getOut().infoOut(tableName + ":" + result + "\u4EF6\u524A\u9664\n", 1);
			this.getOut().infoOut(tableName + ":" + result + "件削除\n", 1);
		}

		this.get_DB().commit();
		return true;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
