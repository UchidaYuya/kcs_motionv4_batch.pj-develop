//
//購買請求用モデル
//
//@package Bill
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/02/20
//@uses ModelBase
//@uses PurchaseCoModel
//
//
//
//購買請求用モデル
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ModelBase
//@uses PurchaseCoModel
//

require("model/Bill/BillModelBase.php");

require("model/PurchaseCoModel.php");

require("model/PurchaseKamokuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//購買先一覧データ取得
//
//@author houshiyama
//@since 2008/05/08
//
//@param string $lang	言語追加 20090702miya
//@access public
//@return void
//
//
//請求あり購買先一覧データ取得
//
//@author houshiyama
//@since 2008/03/10
//
//@param array $H_sess
//@param string $lang	言語追加 20090702miya
//@access public
//@return array
//
//
//購買科目データ取得
//
//@author houshiyama
//@since 2008/03/10
//
//@param mixed $select
//@param int $pactid
//@param string $lang	言語追加 20090702miya
//@access public
//@return array
//
//
//purchase_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $purchid
//@param mixed $purchcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//購買部署単位請求情報取得
//
//@author houshiyama
//@since 2008/04/17
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $sort
//@param mixed $mode
//@access public
//@return void
//
//
//請求部署単位のselect句作成
//
//@author houshiyama
//@since 2008/04/15
//
//@access private
//@return void
//
//
//購買購買ID単位請求情報取得自のFROM句作成
//
//@author houshiyama
//@since 2008/05/07
//
//@access protected
//@return void
//
//
//購買購買ID単位請求情報取得自のWhere句作成
//
//@author houshiyama
//@since 2008/04/17
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//請求購買ID単位の時のOrder句作成
//
//@author houshiyama
//@since 2008/04/23
//
//@param mixed $sort
//@access protected
//@return void
//
//
//再計算中か調べる
//
//@author houshiyama
//@since 2008/05/13
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//集計日時取得
//
//@author houshiyama
//@since 2008/05/13
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class BillPurchaseModel extends BillModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getPurchCoData(lang = "JPN") {
		var H_co = PurchaseCoModel.getPurchCoKeyHash(false, lang);
		return H_co;
	}

	getBillPurchCoData(H_sess, lang = "JPN") //テーブル名の決定
	//全てを追加
	//現在表示中の購買先追加
	{
		var H_co = PurchaseCoModel.getPurchCoKeyHash(false, lang);
		this.setTableName(H_sess[BillPurchaseModel.PUB].cym);
		var sql = "select purchcoid" + " from " + this.H_Tb.purchase_post_bill_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and " + " postid=" + H_sess[BillPurchaseModel.PUB].current_postid + " and " + " flag='1' " + " and " + " coalesce(purchid_num,0)>0" + " group by purchcoid";
		var A_coid = this.get_DB().queryCol(sql);
		A_coid.push(0);

		if (-1 !== A_coid.indexOf(H_sess.SELF.purchcoid) === false) {
			A_coid.push(H_sess.SELF.purchcoid);
		}

		var A_data = Array();

		for (var key in H_co) {
			var val = H_co[key];

			if (-1 !== A_coid.indexOf(key) === true) {
				A_data[key] = val;
			}
		}

		return A_data;
	}

	getKamokuData(select = false, pactid = 0, lang = "JPN") {
		var O_model = new PurchaseKamokuModel();

		if (true === select) {
			if ("ENG" == lang) {
				var A_data = {
					"": "--please select--"
				};
			} else {
				A_data = {
					"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}

			A_data += O_model.getPurchKamokuKeyHash(pactid, lang);
		} else {
			A_data = O_model.getPurchKamokuKeyHash(pactid, lang);
		}

		return A_data;
	}

	makeCommonPurchWhere(purchid, purchcoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and purchid=" + this.get_db().dbQuote(purchid, "text", true) + " and purchcoid=" + this.get_db().dbQuote(purchcoid, "integer", true) + " and dummy_flg=false";

		if (delflg !== undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeBillDataSQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeBillSelectSQL() + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "pb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort);
		return sql;
	}

	makeBillSelectSQL() {
		var A_col = ["pb.pactid", "pb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "pb.purchid", "pb.purchcoid", "purchase_co_tb.purchconame", "pt.username", "pb.charge+pb.excise as charge", "pb.excise", "pb.aspcharge", "pb.aspexcise", "pb.kamoku2 as green_charge", "pb.charge+pb.excise+pb.aspcharge+pb.aspexcise as all_charge", "pb.excise+pb.aspexcise as all_excise", "pb.itemsum", "pb.kamoku1", "pb.kamoku2", "pb.kamoku3", "pb.kamoku4", "pb.kamoku5", "pb.kamoku6", "pb.kamoku7", "pb.kamoku8", "pb.kamoku9", "pb.kamoku10"];
		return A_col.join(",");
	}

	makeBillFromSQL() {
		var sql = this.H_Tb.purchase_bill_tb + " as pb " + " left join " + this.H_Tb.post_tb + " on pb.postid=" + this.H_Tb.post_tb + ".postid" + " left join " + this.H_Tb.purchase_tb + " as pt on pb.pactid=pt.pactid" + " and pb.purchid=pt.purchid and pb.purchcoid=pt.purchcoid" + " left join purchase_co_tb on pb.purchcoid=purchase_co_tb.purchcoid";
		return sql;
	}

	makeBillWhereSQL(H_post) //請求元
	{
		var A_where = Array();

		if (undefined !== H_post.purchcoid === true && H_post.purchcoid !== "0") {
			A_where.push("pb.purchcoid=" + H_post.purchcoid);
		}

		if (undefined !== H_post.notpurchcoid === true && H_post.notpurchcoid !== "0") {
			A_where.push("pb.purchcoid!=" + H_post.notpurchcoid);
		}

		if (undefined !== H_post.purchcoid_list === true) {
			A_where.push("pb.purchcoid in (" + H_post.purchcoid_list.join(",") + ")");
		}

		if (undefined !== H_post.purchid === true && H_post.purchid !== "") {
			A_where.push("pb.purchid like '%" + H_post.purchid + "%'");
		}

		if (undefined !== H_post.username === true && H_post.username !== "") {
			A_where.push("pt.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.kamoku === true && H_post.kamoku !== "" && undefined !== H_post.kamokuprice === true && H_post.kamokuprice !== "") {
			A_where.push("pb.kamoku" + H_post.kamoku + H_post.kamokuprice_condition + H_post.kamokuprice);
		}

		if (undefined !== H_post.slipno === true && H_post.slipno !== "") {
			var str = "pb.purchid in (select purchid from " + this.H_Tb.purchase_details_tb + " as pd \n\t\t\t\t\twhere pd.slipno like '%" + H_post.slipno + "%')";
			A_where.push(str);
		}

		if (undefined !== H_post.itemcode === true && H_post.itemcode !== "") {
			str = "pb.purchid in (select purchid from " + this.H_Tb.purchase_details_tb + " as pd \n\t\t\t\t\twhere pd.itemcode like '%" + H_post.itemcode + "%')";
			A_where.push(str);
		}

		if (A_where.length > 0) {
			str = "(" + A_where.join(" and ") + ")";
		}

		return str;
	}

	makeBillOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pb.purchid", "pt.username", "purchase_co_tb.purchconame", "pb.itemsum", "charge", "green_charge", "pb.aspcharge", "all_charge"];

		if ("00" === A_sort[0]) {
			var sql = " order by " + A_col[0];
		} else {
			sql = " order by " + A_col[A_sort[0]];
		}

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] !== "0") {
			sql += "," + this.H_Tb.post_tb + ".userpostid ";
		}

		if (A_sort[0] !== "2") {
			sql += ",pb.purchid ";
		}

		if (A_sort[0] !== "4") {
			sql += ",purchase_co_tb.purchconame ";
		}

		return sql;
	}

	checkInRecalc(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from purchase_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	getRecalcDateTime(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from purchase_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "integer", true) + " and month=" + this.get_DB().dbQuote(month, "integer", true) + " and status like '2%'" + " order by recdate desc;";
		var last_history = this.get_db().queryOne(sql);
		return last_history;
	}

	__destruct() {
		super.__destruct();
	}

};