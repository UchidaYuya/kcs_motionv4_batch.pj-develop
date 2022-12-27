//
//Shop管理記録Model
//
//@uses ModelBase
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2009/01/08
//
//
//
//ShopメニューModel
//
//@uses ModelBase
//@package ShopMenu
//@author houshiyama
//@since 2009/01/08
//

require("model/ModelBase.php");

//
//__construct
//
//@author houshiyama
//@since 2009/01/08
//
//@param mixed $O_db
//@access public
//@return void
//
//
//管理記録一覧データを生成する <br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $H_sess（CGIパラメータ）
//@access public
//@return array
//
//
//shop_mnglog_tbへのSQL文のselect句を作成する
//
//@author houshiyama
//@since 2008/04/01
//
//@access private
//@return void
//
//
//management_log_tbへのSQL文のfrom句を作成する
//
//@author houshiyama
//@since 2008/04/01
//
//@access private
//@return void
//
//
//shop_mnglog_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/03/30
//
//@param array $H_sess
//@access private
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access private
//@return string
//
//
//__destruct
//
//@author houshiyama
//@since 2009/01/08
//
//@access public
//@return void
//
class ShopMnglogModel extends ModelBase {
	constructor() {
		super();
	}

	getList(H_sess: {} | any[]) //件数取得
	//データ取得
	{
		var A_listsql = Array();
		var A_cntsql = Array();
		var A_data = Array();
		var cntsql = "select count(sm.shopid) " + " from " + this.makeShopMnglogFromSQL() + " where " + this.makeShopMnglogWhereSQL(H_sess);
		var sql = "select " + this.makeShopMnglogSelectSQL(H_sess) + " from " + this.makeShopMnglogFromSQL() + " where " + this.makeShopMnglogWhereSQL(H_sess) + this.makeOrderBySQL(H_sess.sort);
		A_data[0] = this.get_DB().queryOne(cntsql);
		this.get_DB().setLimit(H_sess.limit, (H_sess.offset - 1) * H_sess.limit);
		A_data[1] = this.get_db().queryHash(sql);
		return A_data;
	}

	makeShopMnglogSelectSQL() {
		var A_col = ["sm.shopid", "sh.name as shopname", "sm.groupid", "sm.memid", "sm.name", "sm.postcode", "sm.comment1", "sm.comment2", "sm.kind", "sm.type", "sm.recdate"];
		return A_col.join(",");
	}

	makeShopMnglogFromSQL() {
		var str = " shop_mnglog_tb as sm " + " inner join shop_tb as sh on sm.shopid = sh.shopid ";
		return str;
	}

	makeShopMnglogWhereSQL(H_sess: {} | any[]) //年月
	//指定月の設定
	//検索条件を結合してSQL文にする
	{
		if ("admin" == H_sess.mode) {
			var A_where = ["sm.groupid=" + H_sess.groupid];
		} else {
			A_where = ["sm.groupid=" + H_sess.groupid, "sm.shopid=" + H_sess.shopid];
		}

		var cy = H_sess.cym.substr(0, 4);
		var cm = H_sess.cym.substr(4, 2);
		var endday = date("t", mktime(0, 0, 0, cm, 1, cy));
		var start = cy + "-" + cm + "-01";
		var end = cy + "-" + cm + "-" + endday;
		A_where.push("sm.recdate >= " + this.get_db().dbQuote(start + " 00:00:00", "timestamp", true));
		A_where.push("sm.recdate <= " + this.get_db().dbQuote(end + " 23:59:59", "timestamp", true));
		var sql = A_where.join(" and ");
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["shopname", "sm.comment2", "sm.name", "sm.recdate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",recdate desc ";
		}

		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};