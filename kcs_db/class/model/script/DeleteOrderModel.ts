
import ModelBase from '../ModelBase';
import MtDateUtil from '../../MtDateUtil';
import { execSync } from 'child_process';

import * as fs from 'fs';
import { ScriptDB } from '../../../script/batch/lib/script_db';

export class DeleteOrderModel extends ModelBase {

	constructor() {
		super();
	}

	getFirstDay() {
		var today = MtDateUtil.getToday();
		// var month = +today.substr(5, 2);
		var month = +today.substring(5, 2);
		// var year = +today.substr(0, 4);
		var year = +today.substring(0, 4);
		// var result = date("Y-m-d", mktime(0, 0, 0, month, 1, year - 2));
		var result = new Date(year-2,month,1,0,0,0).toJSON().slice(0,10).replace(/-/g,'-');
		return result;
	}

	async deleteOrder(keyday: string, files: any[]) //削除される注文番号を取得する
	//DBが更新されたのを確認したら注文のディレクトリも消す
	{
		this.getDB().beginTransaction();
		// var sqls = Array();
		var sqls: { [key: string]: any } = {};
		sqls.order_teldetail = "delete from mt_order_teldetail_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_sub = "delete from mt_order_sub_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_history = "delete from mt_order_history_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_regist_tel = "delete from mt_order_regist_tel_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.transfer_charge_shop = "delete from mt_transfer_charge_shop_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.transfer = "delete from mt_transfer_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order = "delete from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true);
		var sql_orderid = "select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true);
		var orderids = await this.getDB().queryCol(sql_orderid);
		this.getDB().beginTransaction();

		for (var tableName in sqls) {
			var sql = sqls[tableName];
			var result = this.getDB().exec(sql, false);

			var dbh: any;
			// if (PEAR.isError(result)) {
			if (dbh.isError(result)) {
				this.getDB().rollback();
				return false;
			}

			// this.getOut().infoOut("mt_" + tableName + "_tb : " + result + "\u4EF6\u524A\u9664", 1);
			this.getOut().infoOut("mt_" + tableName + "_tb : " + result + "件削除", 1);
		}

		this.getDB().commit();

		if (orderids) {
			// var str = "\u4EE5\u4E0B\u306E\u6CE8\u6587\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n";
			var str = "以下の注文を削除しました\n";

			// for (var orderid of Object.values(orderids)) {
			for (var orderid of orderids) {
				str += "" + orderid;
				var path = files + "/" + orderid;

				if (fs.existsSync(path)) {// 2022cvt_003
					var output = undefined;
					var return_var = undefined;
					// exec("rm -rf " + path, otput, return_var);
					execSync("rm -rf " + path);

					str += "\t" + path;
					str += "\t" + return_var;
				}

				str += "\n";
			}

			this.getOut().infoOut(str, 1);
		}

		return true;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
