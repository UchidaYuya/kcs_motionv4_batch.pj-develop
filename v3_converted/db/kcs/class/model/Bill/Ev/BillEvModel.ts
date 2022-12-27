//
//EV請求用モデル
//
//@package Bill
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//@uses EvCoModel
//
//
//
//EV請求用モデル
//
//@package Bill
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses ModelBase
//@uses EvCoModel
//

require("model/Bill/BillModelBase.php");

require("model/EvCoModel.php");

require("model/EvKamokuModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/07/15
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//EV先一覧データ取得
//
//@author miyazawa
//@since 2010/07/15
//
//@access public
//@return void
//
//
//請求ありEV一覧データ取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_sess
//@access public
//@return array
//
//
//EV科目データ取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $select
//@param int $pactid
//@access public
//@return array
//
//
//ev_tbへの固定的なwhere句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//EV部署単位請求情報取得
//
//@author miyazawa
//@since 2010/07/15
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
//@author miyazawa
//@since 2010/07/15
//
//@access private
//@return void
//
//
//ID単位請求情報取得自のFROM句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@access protected
//@return void
//
//
//EVID単位請求情報取得時のWhere句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//請求EVID単位の時のOrder句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $sort
//@access protected
//@return void
//
//
//再計算中か調べる
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//集計日時取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//ID単位画面で管理情報を得る
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/07/15
//
//@access public
//@return void
//
class BillEvModel extends BillModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getEvCoData() {
		var H_co = EvCoModel.getEvCoKeyHash(false);
		return H_co;
	}

	getBillEvCoData(H_sess) //テーブル名の決定
	//全てを追加
	//現在表示中のEV先追加
	{
		var H_co = EvCoModel.getEvCoKeyHash(false);
		this.setTableName(H_sess[BillEvModel.PUB].cym);
		var sql = "select evcoid" + " from " + this.H_Tb.ev_post_bill_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and " + " postid=" + H_sess[BillEvModel.PUB].current_postid + " and " + " flag='1' " + " and " + " coalesce(evid_num,0)>0" + " group by evcoid";
		var A_coid = this.get_DB().queryCol(sql);
		A_coid.push(0);

		if (-1 !== A_coid.indexOf(H_sess.SELF.evcoid) === false) {
			A_coid.push(H_sess.SELF.evcoid);
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
		var O_model = new EvKamokuModel();

		if (true === select) {
			var A_data = {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
			A_data += O_model.getEvKamokuKeyHash(pactid);
		} else {
			A_data = O_model.getEvKamokuKeyHash(pactid);
		}

		return A_data;
	}

	makeCommonEvWhere(evid, evcoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and evid=" + this.get_db().dbQuote(evid, "text", true) + " and evcoid=" + this.get_db().dbQuote(evcoid, "integer", true) + " and dummy_flg=false";

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeBillDataSQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeBillSelectSQL() + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "eb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort);
		return sql;
	}

	makeBillSelectSQL() {
		var A_col = ["eb.pactid", "eb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "eb.evid", "eb.evcoid", "ev_co_tb.evconame", "et.username", "et.ev_car_number", "et.ev_car_type", "eb.charge as charge", "eb.aspcharge", "eb.aspexcise", "eb.charge+eb.aspcharge+eb.aspexcise as all_charge", "eb.aspexcise as all_excise", "eb.kamoku1", "eb.kamoku2", "eb.kamoku3", "eb.kamoku4", "eb.kamoku5", "eb.kamoku6", "eb.kamoku7", "eb.kamoku8", "eb.kamoku9", "eb.kamoku10"];
		return A_col.join(",");
	}

	makeBillFromSQL() {
		var sql = this.H_Tb.ev_bill_tb + " as eb " + " left join " + this.H_Tb.post_tb + " on eb.postid=" + this.H_Tb.post_tb + ".postid" + " left outer join " + this.H_Tb.ev_tb + " as et on eb.pactid=et.pactid" + " and eb.evid=et.evid and eb.evcoid=et.evcoid" + " left join ev_co_tb on eb.evcoid=ev_co_tb.evcoid";
		return sql;
	}

	makeBillWhereSQL(H_post) {
		var A_where = Array();

		if (undefined !== H_post.evcoid === true && H_post.evcoid !== "0") //請求元
			{
				A_where.push("eb.evcoid=" + H_post.evcoid);
			}

		if (undefined !== H_post.evid === true && H_post.evid != "") {
			A_where.push("eb.evid like '%" + H_post.evid + "%'");
		}

		if (undefined !== H_post.username === true && H_post.username != "") {
			A_where.push("et.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.kamoku === true && H_post.kamoku != "" && undefined !== H_post.kamokuprice === true && H_post.kamokuprice != "") {
			A_where.push("eb.kamoku" + H_post.kamoku + H_post.kamokuprice_condition + H_post.kamokuprice);
		}

		if (A_where.length > 0) {
			var str = "(" + A_where.join(" and ") + ")";
		}

		return str;
	}

	makeBillOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "eb.evid", "et.username", "et.ev_car_number", "et.ev_car_type", "charge", "eb.aspcharge", "all_charge"];

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
			sql += ",eb.evid ";
		}

		if (A_sort[0] != 4) {
			sql += ",ev_co_tb.evconame ";
		}

		return sql;
	}

	checkInRecalc(year, month) //最新の請求は再計算できない 20100916miya
	{
		if (false == is_numeric(year) || false == is_numeric(month)) {
			return false;
		}

		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from ev_bill_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "integer", true) + " and month=" + this.get_DB().dbQuote(month, "integer", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	getRecalcDateTime(year, month) //最新の請求は再計算できない 20100916miya
	{
		if (false == is_numeric(year) || false == is_numeric(month)) {
			return "";
		}

		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from ev_bill_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and status like '2%'" + " order by recdate desc;";
		var last_history = this.get_db().queryOne(sql);
		return last_history;
	}

	getIdData(evcoid, evid) {
		var sql = "SELECT username, ev_car_number, ev_car_type FROM " + this.H_Tb.ev_tb + " WHERE pactid=" + this.H_G_Sess.pactid + " AND evcoid=" + evcoid + " AND evid='" + evid + "'";
		var A_result = this.get_db().queryRowHash(sql);
		var charge_sql = "SELECT SUM(charge) as charge FROM " + this.H_Tb.ev_details_tb + " WHERE pactid=" + this.H_G_Sess.pactid + " AND evcoid=" + evcoid + " AND evid='" + evid + "'";
		var charge = this.get_db().queryOne(charge_sql);
		A_result.charge = charge;
		return A_result;
	}

	__destruct() {
		super.__destruct();
	}

};