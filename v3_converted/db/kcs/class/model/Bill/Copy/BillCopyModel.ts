//
//コピー機請求用モデル
//
//@package Bill
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/07/10
//@uses ModelBase
//@uses CopyCoModel
//
//
//
//コピー機請求用モデル
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/07/10
//@uses ModelBase
//@uses CopyCoModel
//

require("model/Bill/BillModelBase.php");

require("model/CopyCoModel.php");

require("model/CopyKamokuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/10
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//コピー機先一覧データ取得
//
//@author houshiyama
//@since 2008/07/10
//
//@access public
//@return void
//
//
//請求ありコピー機先一覧データ取得
//
//@author houshiyama
//@since 2008/07/10
//
//@param array $H_sess
//@access public
//@return array
//
//
//コピー機科目データ取得
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $select
//@param int $pactid
//@access public
//@return array
//
//
//copy_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $copyid
//@param mixed $copycoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//コピー機部署単位請求情報取得
//
//@author houshiyama
//@since 2008/07/10
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
//@since 2008/07/10
//
//@access private
//@return void
//
//
//コピー機コピー機ID単位請求情報取得自のFROM句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@access protected
//@return void
//
//
//コピー機コピー機ID単位請求情報取得自のWhere句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//請求コピー機ID単位の時のOrder句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $sort
//@access protected
//@return void
//
//
//再計算中か調べる
//
//@author houshiyama
//@since 2008/07/10
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
//@since 2008/07/10
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
//@since 2008/07/10
//
//@access public
//@return void
//
class BillCopyModel extends BillModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getCopyCoData() {
		var H_co = CopyCoModel.getCopyCoKeyHash(false);
		return H_co;
	}

	getBillCopyCoData(H_sess) //テーブル名の決定
	//全てを追加
	//現在表示中のコピー機先追加
	{
		var H_co = CopyCoModel.getCopyCoKeyHash(false);
		this.setTableName(H_sess[BillCopyModel.PUB].cym);
		var sql = "select copycoid" + " from " + this.H_Tb.copy_post_bill_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and " + " postid=" + H_sess[BillCopyModel.PUB].current_postid + " and " + " flag='1' " + " and " + " coalesce(copyid_num,0)>0" + " group by copycoid";
		var A_coid = this.get_DB().queryCol(sql);
		A_coid.push(0);

		if (-1 !== A_coid.indexOf(H_sess.SELF.copycoid) === false) {
			A_coid.push(H_sess.SELF.copycoid);
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

	getKamokuData(select = false, pactid = 0) {
		var O_model = new CopyKamokuModel();

		if (true === select) {
			var A_data = {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
			A_data += O_model.getCopyKamokuKeyHash(pactid);
		} else {
			A_data = O_model.getCopyKamokuKeyHash(pactid);
		}

		return A_data;
	}

	makeCommonCopyWhere(copyid, copycoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and copyid=" + this.get_db().dbQuote(copyid, "text", true) + " and copycoid=" + this.get_db().dbQuote(copycoid, "integer", true) + " and dummy_flg=false";

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeBillDataSQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeBillSelectSQL() + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "cb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort);
		return sql;
	}

	makeBillSelectSQL() {
		var A_col = ["cb.pactid", "cb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "cb.copyid", "cb.copycoid", "copy_co_tb.copyconame", "ct.username", "ct.copyname", "cb.charge+cb.excise as charge", "cb.excise", "cb.aspcharge", "cb.aspexcise", "cb.charge+cb.excise+cb.aspcharge+cb.aspexcise as all_charge", "cb.excise+cb.aspexcise as all_excise", "cb.printcount", "cb.kamoku1", "cb.kamoku2", "cb.kamoku3", "cb.kamoku4", "cb.kamoku5", "cb.kamoku6", "cb.kamoku7", "cb.kamoku8", "cb.kamoku9", "cb.kamoku10"];
		return A_col.join(",");
	}

	makeBillFromSQL() {
		var sql = this.H_Tb.copy_bill_tb + " as cb " + " left join " + this.H_Tb.post_tb + " on cb.postid=" + this.H_Tb.post_tb + ".postid" + " left join " + this.H_Tb.copy_tb + " as ct on cb.pactid=ct.pactid" + " and cb.copyid=ct.copyid and cb.copycoid=ct.copycoid" + " left join copy_co_tb on cb.copycoid=copy_co_tb.copycoid";
		return sql;
	}

	makeBillWhereSQL(H_post) {
		var A_where = Array();

		if (undefined !== H_post.copycoid === true && H_post.copycoid !== "0") //請求元
			{
				A_where.push("cb.copycoid=" + H_post.copycoid);
			}

		if (undefined !== H_post.copyid === true && H_post.copyid != "") {
			A_where.push("cb.copyid like '%" + H_post.copyid + "%'");
		}

		if (undefined !== H_post.username === true && H_post.username != "") {
			A_where.push("ct.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.kamoku === true && H_post.kamoku != "" && undefined !== H_post.kamokuprice === true && H_post.kamokuprice != "") {
			A_where.push("cb.kamoku" + H_post.kamoku + H_post.kamokuprice_condition + H_post.kamokuprice);
		}

		if (A_where.length > 0) {
			var str = "(" + A_where.join(" and ") + ")";
		}

		return str;
	}

	makeBillOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cb.copyid", "ct.username", "copy_co_tb.copyconame", "ct.copyname", "cb.printcount", "charge", "cb.aspcharge", "all_charge"];

		if ("00" === A_sort[0]) {
			var sql = " order by " + A_col[0];
		} else {
			sql = " order by " + A_col[A_sort[0]];
		}

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".userpostid ";
		}

		if (A_sort[0] != 2) {
			sql += ",cb.copyid ";
		}

		if (A_sort[0] != 4) {
			sql += ",copy_co_tb.copyconame ";
		}

		return sql;
	}

	checkInRecalc(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from copy_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "integer", true) + " and month=" + this.get_DB().dbQuote(month, "integer", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	getRecalcDateTime(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from copy_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and status like '2%'" + " order by recdate desc;";
		var last_history = this.get_db().queryOne(sql);
		return last_history;
	}

	__destruct() {
		super.__destruct();
	}

};