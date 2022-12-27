//
//交通費申請画面Model
//
//@package ICCard
//@subpackage Model
//@author miyazawa
//@since 2010/04/27
//@uses ModelBase
//
//
//
//交通費申請画面Model
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/04/27
//@uses ModelBase
//

require("model/ModelBase.php");

//
//コンストラクタ
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $O_db
//@access public
//@return void
//
//
//権限一覧のゲッター
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
//
//明細データを取得して返す
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_param
//@access public
//@return array
//
//
//getViewUserInfo
//
//@author
//@since 2011/01/14
//
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
class ICCardPrintOutModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getUseHistory(pactid, userid, H_param = Array()) {
		if (true == (undefined !== H_param.table_no) && "" != H_param.table_no) {
			var hist_tablename = "iccard_history_" + String(H_param.table_no + "_tb");
			var card_tablename = "iccard_" + String(H_param.table_no + "_tb");
			var fixflg_str = "";
		} else {
			hist_tablename = "iccard_history_tb";
			card_tablename = "iccard_tb";
			fixflg_str = "AND hist.fixflg != false ";
		}

		if (true == (undefined !== H_param.sort_key) && "" != H_param.sort_key) {
			var sort = "";

			switch (H_param.sort_key) {
				case "3":
					sort = "cast(hist.usedate as date)";
					break;

				case "4":
					sort = "date_part('dow',hist.usedate)";
					break;

				case "5":
					sort = "hist.iccardtype";
					break;

				case "6":
					sort = "hist.type";
					break;

				case "7":
					sort = "hist.start";
					break;

				case "8":
					sort = "hist.destination";
					break;

				case "9":
					sort = "hist.in_facility";
					break;

				case "10":
					sort = "hist.waytype";
					break;

				case "11":
					sort = "hist.visit";
					break;

				case "12":
					sort = "hist.charge";
					break;

				case "13":
					sort = "(case when coalesce(hist.fixflg,false) then 1 else 0 end)";
					break;

				case "14":
					sort = "hist.note";
					break;

				default:
					sort = "cast(hist.usedate as date)";
			}

			if ("" != sort && true == (undefined !== H_param.sort_desc) && "" != H_param.sort_desc) {
				if (true == H_param.sort_desc) {
					sort = sort + " DESC, cast(hist.usedate as date) DESC, hist.detailno DESC";
				} else {
					sort = sort + " ASC, cast(hist.usedate as date) ASC, hist.detailno ASC";
				}
			} else {
				sort = sort + " ASC, cast(hist.usedate as date) ASC, hist.detailno ASC";
			}
		} else {
			sort = "cast(hist.usedate as date) ASC, hist.detailno ASC";
		}

		var sql = "SELECT \n\t\t\t\t\thist.iccardtype   ,\n\t\t\t\t\thist.type         ,\n\t\t\t\t\thist.start        ,\n\t\t\t\t\thist.in_facility  ,\n\t\t\t\t\thist.out_facility ,\n\t\t\t\t\thist.destination  ,\n\t\t\t\t\thist.waytype      ,\n\t\t\t\t\thist.visit        ,\n\t\t\t\t\thist.charge       ,\n\t\t\t\t\thist.uniqueid     ,\n\t\t\t\t\thist.note         ,\n\t\t\t\t\thist.usedate       \n\t\t\t\tFROM " + hist_tablename + " hist ";
		sql += "LEFT JOIN " + card_tablename + " card  ON hist.pactid=card.pactid AND hist.iccardcoid=" + H_param.cardcoid + " AND hist.iccardid=card.iccardid AND hist.handflg=card.handflg ";
		sql += "WHERE ";
		sql += "hist.pactid=" + pactid + " AND hist.iccardcoid=" + H_param.cardcoid + " AND (card.userid=" + userid + " AND card.userid IS NOT NULL) AND hist.delflg != true " + fixflg_str;
		sql += "ORDER BY " + sort;
		var H_data = this.get_DB().queryHash(sql);
		return H_data;
	}

	getViewUserInfo(pactid, userid, H_param) {
		if (true == (undefined !== H_param.table_no) && "" != H_param.table_no) {
			var tablename = "iccard_" + String(H_param.table_no + "_tb");
		} else {
			tablename = "iccard_tb";
		}

		var sql = "SELECT username " + "FROM " + tablename + " " + "WHERE userid=" + this.get_DB().dbQuote(userid, "int", true) + " AND iccardcoid=" + this.get_DB().dbQuote(H_param.cardcoid, "int", true) + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true);
		return this.get_DB().queryRowHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};