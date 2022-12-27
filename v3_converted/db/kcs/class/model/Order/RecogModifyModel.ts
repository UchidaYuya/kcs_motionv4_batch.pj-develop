//
//注文更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/06/04
//

require("OrderUtil.php");

require("OrderModifyModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//order_tbをupdateする<br>
//承認ページ用
//
//@author igarashi
//@since 2008/06/03
//
//@param mixed $H_sess
//@access public
//@return
//
//
//order系テーブルのupdateを作成する<br>
//対応するのはwhere句でorderidとsuborderidを指定するものだけ
//
//@author igarashi
//@since 2008/06/04
//
//@param $H_info(更新したいカラム名をキーにした連想配列)
//@param $table(updateを作成する対象のtable名)
//
//@access public
//@return mixed
//
//
//updateを実行する<br>
//transaction、commitは呼出元で管理すること
//
//@author igarashi
//@since 2008/06/04
//
//@param $H_sql(sql文。配列で複数個渡されてもよい)
//@param $table 更新対象のtable名。
//
//@access public
//@return mixed
//
//
//渡された配列をtableに必要な情報ごとに分ける<br>
//
//@author igarashi
//@since 2008/06/04
//
//@param $H_sess(SESSION(globalもlocalも一緒に渡す))
//
//@access public
//@return hash
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class RecogModifyModel extends OrderModifyModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	updateOrderTable(H_info) {
		if (true == (undefined !== H_info)) {
			var sql = "UPDATE mt_order_tb SET " + "status=" + this.get_DB().DBQuote(H_info.status, "int", true) + ", recdate=" + this.get_DB().DBQuote(H_info.recdate, "date", true) + ", " + "pointradio=" + this.get_DB().DBQuote(H_info.pointradio, "bool", true) + ", point=" + this.get_DB().DBQuote(H_info.point, "int", false) + ", " + "applyprice=" + this.get_DB().DBQuote(H_info.applyprice, "int", false) + ", billradio=" + this.get_DB().DBQuote(H_info.billradio, "bool", true) + ", " + "parent=" + this.get_DB().DBQuote(H_info.parent, "text", false) + ", billaddress=" + this.get_DB().DBQuote(H_info.billaddress, "text", false) + ", " + "dateradio=" + this.get_DB().DBQuote(H_info.dateradio, "bool", true) + ", datefrom=" + this.get_DB().DBQuote(H_info.datefrom, "date", false) + ", " + "dateto=" + this.get_DB().DBQuote(H_info.dateto, "date", false) + ", datechangeradio=" + this.get_DB().DBQuote(H_info.datechangeradio, "bool", false) + ", " + "datechange=" + this.get_DB().DBQuote(H_info.datechange, "date", false) + ", fee=" + this.get_DB().DBQuote(H_info.fee, "bool", false) + ", " + "sendhow=" + this.get_DB().DBQuote(H_info.sendhow, "text", false) + ", sendname=" + this.get_DB().DBQuote(H_info.sendname, "text", false) + ", " + "zip=" + this.get_DB().DBQuote(H_info.zip, "text", false) + ", address1=" + this.get_DB().DBQuote(H_info.address1, "text", false) + ", " + "address2=" + this.get_DB().DBQuote(H_info.address2, "text", false) + ", building=" + this.get_DB().DBQuote(H_info.building, "text", false) + ", " + "sendtel=" + this.get_DB().DBQuote(H_info.sendtel, "text", false) + ", note=" + this.get_DB().DBQuote(H_info.note, "text", false) + ", " + "reason=" + this.get_DB().DBQuote(H_info.reason, "text", false) + ", purchase=" + this.get_DB().DBQuote(H_info.purchase, "text", false) + ", " + "chpostid=" + this.get_DB().DBQuote(H_info.chpostid, "int", false) + ", chposname=" + this.get_DB().DBQuote(H_info.chpostname, "text", false) + ", " + "nextpostid=" + this.get_DB().DBQuote(H_info.nextpostid, "int", false) + ", nextpostname=" + this.get_DB.DBQuote(H_info.nextpostname, "text", false) + ", " + "anspost=" + this.get_DB().DBQuote(H_info.anspost, "text", false) + ", ansuser=" + this.get_DB().DBQuote(H_info.ansuser, "text", false) + ", " + "ansdate=" + this.get_DB().DBQuote(H_info.ansdate, "date", false) + " " + "WHERE orderid=" + H_info.orderid;

			if (false == ("object" === typeof this.get_DB().query(sql))) {
				return true;
			}

			var str = "OrderModifyModel::order_tb\u306Eupdate\u5931\u6557";
		} else {
			str = "OrderModifyModel::order_tb\u306Eupdate\u7528\u306E\u60C5\u5831\u304C\u5B58\u5728\u3057\u307E\u305B\u3093";
		}

		this.get_DB().rollback();
		this.O_Out.errorOut(0, str, false);
	}

	makeUpdateSql(H_info, table) {
		var idx = 0;
		var sql = "UPDATE " + table + " SET ";

		for (var subval of Object.values(H_info)) {
			var lpend = subval.length;

			for (var val of Object.values(subval)) {
				if (true == ("number" === typeof val)) {
					sql += key + "=" + val;
				} else {
					sql += key + "='" + val + "'";
				}

				idx++;

				if (idx < lpend) {
					sql += ", ";
				}
			}

			H_sql[subval].ordersubid = sql += " WHERE orderid=" + subval.orderid + " AND ordersubid=" + H_subval.ordersubid;
		}

		if (1 == H_sql.length) {
			var H_sql = H_sql[0];
		}

		return H_sql;
	}

	execTableUpdate(H_sql, table) {
		for (var val of Object.values(H_sql)) {
			if (true != ("object" === typeof this.get_DB().query(val))) {
				this.get_DB().rollback();
				this.O_Out.errorOut(0, table + "\u306E\u66F4\u65B0\u306B\u5931\u6557", false);
				return false;
			}
		}

		return true;
	}

	divOrderSession(H_sess) {
		for (var key in H_sess) {
			var val = H_sess[key];

			if (true == (-1 !== this.A_ordcol.indexOf(key))) {
				H_div.order[key] = val;
			}

			if (true == (-1 !== this.A_subcol.indexOf(key))) {
				H_div.sub[key] = val;
			}

			if (true == (-1 !== this.A_detcol.indexOf(key))) {
				H_div.detail[key] = val;
			}
		}

		return H_div;
	}

	__destruct() {
		super.__destruct();
	}

};