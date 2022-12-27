//
//注文更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/07/02
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//
//OrderFormModel(form作成用class)OrderModifyModelは設計で話をしていた段階で
//親子関係ではなく、それぞれの担当機能を持った兄弟(ツリーにすると同列)なので継承しちゃいかんと思うのです。 iga
//class OrderModifyModel extends OrderFormModel{

require("OrderMainModel.php");

require("OrderUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $site_flg(呼出し元がお客様or販売店を判断)
//@access public
//@return void
//
//
//mt_transfer_tbにinsertする
//
//@author igarashi
//@since 2008/05/30
//
//@param $H_info
//
//@access public
//@return string
//
//
//mt_history_tbにinsertする
//
//@author igarashi
//@since 2008/05/30
//
//@param $H_info
//
//@access public
//@return string
//
//
//mt_order_tbをupdateする<br>
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
//mt_order_sub_tbをupdateする<br>
//承認ページ用
//
//@author miyazawa
//@since 2008/09/06
//
//@param mixed $H_sess
//@access public
//@return
//
//
//mt_order_teldetail_tbをupdateする<br>
//承認ページ用
//
//@author miyazawa
//@since 2008/09/06
//
//@param mixed $H_sess
//@access public
//@return
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
class OrderModifyModelBase extends OrderMainModel {
	constructor(O_db0, H_g_sess, site_flg = OrderModifyModelBase.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	insertOrderTransferTable(H_info) {
		var sql = "INSERT INTO mt_transfer_tb (" + "orderid, ordersubid, shopid, transfer_status, transfer_date, transfer_level) " + "VALUE(" + H_info.orderid + " ," + H_info.ordersubid + ", " + H_info.shopid + ", " + H_info.transfer_status + ", " + H_info.transfer_date + ", " + H_info.transfer_level + ")";

		if (false == ("object" === typeof this.get_DB.query(sql))) {
			this.O_Out.errorOut(0, "OrderModifyModel::mt_transfer_tb\u3078\u306Einsert\u306B\u5931\u6557", false, "../Menu/menu.php");
			return false;
		}

		return true;
	}

	insertOrderHistoryTable(H_info) {
		var sql = "INSERT INTO VALUE(orderid, chpostid, chpostname, chname, chdate, answercomment) " + "VALUES(" + H_info.orderid + ", " + H_info.chpostid + ", " + H_info.chpostname + ", " + H_info.chname + ", " + H_info.chdate + H_info.answercomment + ")";

		if (false == ("object" === typeof this.get_DB().exec(sql))) {
			this.O_Out.errorOut(0, "OrderModyfyModel::order_history_tb\u3078\u306Einsert\u306B\u5931\u6557", false, "../Menu/menu.php");
			return false;
		}

		return true;
	}

	updateOrderTable(H_info) {
		if (true == (undefined !== H_info)) {
			var max = H_info.length;
			var idx = 0;
			var sql = "UPDATE " + OrderModifyModelBase.ORD_TB + " SET ";

			for (var key in H_info) {
				var val = H_info[key];

				if (key != "orderid") //オーダーIDはインサートに必要なだけなので上書きされない
					//DBQuoteの第3引数はnot nullか否か。
					{
						sql += key + "=" + this.get_DB().dbquote(val, this.A_ordcol[key][0], this.A_ordcol[key][1]);

						if (idx < max) {
							sql += ", ";
						}

						idx++;
					}
			}

			sql = rtrim(sql);
			sql = rtrim(sql, "\\,");
			sql += " WHERE orderid=" + H_info.orderid;

			if (false == ("object" === typeof this.get_DB().query(sql))) {
				return true;
			}

			var str = "OrderModifyModel::mt_order_tb\u306Eupdate\u5931\u6557";
		} else {
			str = "OrderModifyModel::mt_order_tb\u306Eupdate\u7528\u306E\u60C5\u5831\u304C\u5B58\u5728\u3057\u307E\u305B\u3093";
		}

		this.get_DB().rollback();
		this.O_Out.errorOut(0, str, false, "../Menu/menu.php");
	}

	updateSubTable(H_info) {
		if (true == (undefined !== H_info)) {
			var max = H_info.length;
			var idx = 0;
			var sql = "UPDATE " + OrderModifyModelBase.ORD_SUB_TB + " SET ";

			for (var key in H_info) {
				var val = H_info[key];

				if (key != "orderid") //オーダーIDはインサートに必要なだけなので上書きされない
					//DBQuoteの第3引数はnot nullか否か。
					{
						sql += key + "=" + this.get_DB().dbquote(val, this.A_subcol[key][0], this.A_subcol[key][1]);

						if (idx < max) {
							sql += ", ";
						}

						idx++;
					}
			}

			sql = rtrim(sql);
			sql = rtrim(sql, "\\,");
			sql += " WHERE orderid=" + H_info.orderid + " AND machineflg = true";

			if (false == ("object" === typeof this.get_DB().query(sql))) {
				return true;
			}

			var str = "OrderModifyModel::mt_order_sub_tb\u306Eupdate\u5931\u6557";
		} else {
			str = "OrderModifyModel::mt_order_sub_tb\u306Eupdate\u7528\u306E\u60C5\u5831\u304C\u5B58\u5728\u3057\u307E\u305B\u3093";
		}

		this.get_DB().rollback();
		this.O_Out.errorOut(0, str, false, "../Menu/menu.php");
	}

	updateDetTable(H_info) {
		if (true == (undefined !== H_info)) //オーダーID取って元配列からは削除して、それから回す
			{
				var orderid = H_info.orderid;
				delete H_info.orderid;
				var sql = "";

				for (var detail_sort in H_info) {
					var data = H_info[detail_sort];
					var max = data.length;
					var idx = 0;
					var tmpsql = "UPDATE " + OrderModifyModelBase.ORD_DET_TB + " SET ";

					for (var key in data) {
						var val = data[key];

						if (key != "orderid") //オーダーIDはインサートに必要なだけなので上書きされない
							//DBQuoteの第3引数はnot nullか否か。
							{
								tmpsql += key + "=" + this.get_DB().dbquote(val, this.A_detcol[key][0], this.A_detcol[key][1]);

								if (idx < max) {
									tmpsql += ", ";
								}

								idx++;
							}
					}

					tmpsql = rtrim(tmpsql);
					tmpsql = rtrim(tmpsql, "\\,");
					tmpsql += " WHERE orderid=" + orderid + " AND detail_sort=" + detail_sort + ";";
					sql += tmpsql;
				}

				if (false == ("object" === typeof this.get_DB().query(sql))) {
					return true;
				}

				var str = "OrderModifyModel::mt_order_teldetail_tb\u306Eupdate\u5931\u6557";
			} else {
			str = "OrderModifyModel::mt_order_teldetail_tb\u306Eupdate\u7528\u306E\u60C5\u5831\u304C\u5B58\u5728\u3057\u307E\u305B\u3093";
		}

		this.get_DB().rollback();
		this.O_Out.errorOut(0, str, false, "../Menu/menu.php");
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