require("model/ModelBase.php");

require("MtDateUtil.php");

//
//__construct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
//
//getFirstDay
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
//
//deleteOrder
//
//@author igarashi
//@since 2011/09/13
//
//@param mixed $keyday
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
class DeleteOrderModel extends ModelBase {
	constructor() {
		super();
	}

	getFirstDay() {
		var today = MtDateUtil.getToday();
		var month = +today.substr(5, 2);
		var year = +today.substr(0, 4);
		var result = date("Y-m-d", mktime(0, 0, 0, month, 1, year - 2));
		return result;
	}

	deleteOrder(keyday, files) //削除される注文番号を取得する
	//DBが更新されたのを確認したら注文のディレクトリも消す
	{
		this.getDB().beginTransaction();
		var sqls = Array();
		sqls.order_teldetail = "delete from mt_order_teldetail_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_sub = "delete from mt_order_sub_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_history = "delete from mt_order_history_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order_regist_tel = "delete from mt_order_regist_tel_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.transfer_charge_shop = "delete from mt_transfer_charge_shop_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.transfer = "delete from mt_transfer_tb where orderid in (select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true) + ")";
		sqls.order = "delete from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true);
		var sql_orderid = "select orderid from mt_order_tb where recdate < " + this.getDB().dbQuote(keyday, "date", true);
		var orderids = this.getDB().queryCol(sql_orderid);
		this.getDB().beginTransaction();

		for (var tableName in sqls) {
			var sql = sqls[tableName];
			var result = this.getDB().exec(sql, false);

			if (PEAR.isError(result)) {
				this.getDB().rollback();
				return false;
			}

			this.getOut().infoOut("mt_" + tableName + "_tb : " + result + "\u4EF6\u524A\u9664", 1);
		}

		this.getDB().commit();

		if (!!orderids) {
			var str = "\u4EE5\u4E0B\u306E\u6CE8\u6587\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n";

			for (var orderid of Object.values(orderids)) {
				str += "" + orderid;
				var path = files + "/" + orderid;

				if (is_dir(path)) {
					var output = undefined;
					var return_var = undefined;
					exec("rm -rf " + path, otput, return_var);
					str += "\t" + path;
					str += "\t" + return_var;
				}

				str += "\n";
			}

			this.getOut().infoOut(str, 1);
		}

		return true;
	}

	__destruct() {
		super.__destruct();
	}

};