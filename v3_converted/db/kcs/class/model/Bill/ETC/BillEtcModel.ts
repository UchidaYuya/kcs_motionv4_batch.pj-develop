//
//ETC請求用モデル
//
//@package Bill
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/07/03
//@uses ModelBase
//@uses CardCoModel
//
//
//
//ETC請求用モデル
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/07/03
//@uses ModelBase
//@uses CardCoModel
//

require("model/Bill/BillModelBase.php");

require("model/CardCoModel.php");

require("model/CardKamokuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/03
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//ETCカード会社一覧データ取得
//
//@author houshiyama
//@since 2008/07/03
//
//@access public
//@return void
//
//
//請求ありETCカード会社一覧データ取得
//
//@author houshiyama
//@since 2008/07/03
//
//@param array $H_sess
//@access public
//@return array
//
//
//ETC科目データ取得
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $select
//@param int $pactid
//@access public
//@return array
//
//
//card_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $cardno
//@param mixed $cardcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//ETC部署単位請求情報取得
//
//@author houshiyama
//@since 2008/07/03
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
//@since 2008/07/03
//
//@access private
//@return void
//
//
//ETCカード単位請求情報取得自のFROM句作成
//
//@author houshiyama
//@since 2008/07/03
//
//@access protected
//@return void
//
//
//ETCカード単位請求情報取得自のWhere句作成
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//請求ETCカード単位の時のOrder句作成
//
//@author houshiyama
//@since 2008/07/03
//
//@param mixed $sort
//@access protected
//@return void
//
//
//再計算中か調べる
//
//@author houshiyama
//@since 2008/07/03
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
//@since 2008/07/03
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
//@since 2008/07/03
//
//@access public
//@return void
//
class BillEtcModel extends BillModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getCardCoData() {
		var H_co = CardCoModel.getCardCoKeyHash(false);
		return H_co;
	}

	getBillCardCoData(H_sess) //テーブル名の決定
	//全てを追加
	//現在表示中のETCカード会社追加
	{
		var H_co = CardCoModel.getCardCoKeyHash(false);
		this.setTableName(H_sess[BillEtcModel.PUB].cym);
		var sql = "select cardcoid" + " from " + this.H_Tb.card_post_bill_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and " + " postid=" + H_sess[BillEtcModel.PUB].current_postid + " and " + " flag=1 " + " and " + " coalesce(cardno_num,0)>0" + " group by cardcoid";
		var A_coid = this.get_DB().queryCol(sql);
		A_coid.push(0);

		if (-1 !== A_coid.indexOf(H_sess.SELF.cardcoid) == false) {
			A_coid.push(H_sess.SELF.cardcoid);
		}

		var A_data = Array();

		for (var key in H_co) {
			var val = H_co[key];

			if (-1 !== A_coid.indexOf(key) == true) {
				A_data[key] = val;
			}
		}

		return A_data;
	}

	getCardKamokuData(select = false, pactid = 0) {
		if (true == select) {
			var A_data = {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
			A_data += CardKamokuModel.getCardKamokuKeyHash(pactid);
		} else {
			A_data = CardKamokuModel.getCardKamokuKeyHash(pactid);
		}

		return A_data;
	}

	makeCommonEtcWhere(cardno, cardcoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and cardno=" + this.get_db().dbQuote(cardno, "text", true) + " and cardcoid=" + this.get_db().dbQuote(cardcoid, "integer", true) + " and dummy_flg=false";

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
		var A_col = ["cb.pactid", "cb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "cb.cardno", "cb.cardcoid", "card_co_tb.cardconame", "pt.username", "cb.charge", "cb.aspcharge", "cb.aspexcise", "cb.charge+cb.aspcharge+cb.aspexcise as all_charge", "cb.aspexcise as all_excise", "cb.kamoku1", "cb.kamoku2", "cb.kamoku3", "cb.kamoku4", "cb.kamoku5", "cb.kamoku6", "cb.kamoku7", "cb.kamoku8", "cb.kamoku9", "cb.kamoku10"];
		return A_col.join(",");
	}

	makeBillFromSQL() {
		var sql = this.H_Tb.card_bill_tb + " as cb " + " left join " + this.H_Tb.post_tb + " on cb.postid=" + this.H_Tb.post_tb + ".postid" + " left join " + this.H_Tb.card_tb + " as pt on cb.pactid=pt.pactid" + " and cb.cardno=pt.cardno and cb.cardcoid=pt.cardcoid" + " left join card_co_tb on cb.cardcoid=card_co_tb.cardcoid";
		return sql;
	}

	makeBillWhereSQL(H_post) {
		var A_where = Array();

		if (H_post.cardcoid != 0) //請求元
			{
				A_where.push("cb.cardcoid=" + H_post.cardcoid);
			}

		if (A_where.length > 0) {
			var str = "(" + A_where.join(" and ") + ")";
		}

		return str;
	}

	makeBillOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cb.cardno", "pt.username", "card_co_tb.cardconame", "cb.itemsum", "charge", "cb.aspcharge", "all_charge"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".userpostid ";
		}

		if (A_sort[0] != 2) {
			sql += ",cb.cardno ";
		}

		if (A_sort[0] != 4) {
			sql += ",card_co_tb.cardconame ";
		}

		return sql;
	}

	checkInRecalc(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from card_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	getRecalcDateTime(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from card_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and status like '2%'" + " order by recdate desc;";
		var last_history = this.get_db().queryOne(sql);
		return last_history;
	}

	__destruct() {
		super.__destruct();
	}

};