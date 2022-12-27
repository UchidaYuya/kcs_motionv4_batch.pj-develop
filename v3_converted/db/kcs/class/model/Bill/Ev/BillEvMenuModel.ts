//
//EV請求一覧表示Model
//
//更新履歴：<br>
//2010/07/15 宮澤龍彦 作成
//
//@package Bill
//@subpackage Model
//@author miyazawa
//@filesource
//@since 2010/07/15
//@uses BillEvModel
//
//
//
//EV請求一覧表示Model
//
//@package Bill
//@subpackage Model
//@author miyazawa
//@since 2010/07/15
//@uses BillEvModel
//

require("model/Bill/Ev/BillEvModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/07/15
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//一覧データ取得
//
//@author miyazawa
//@since 2010/07/15
//
//@param array $H_sess
//@param mixed $download
//@param mixed $O_view
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
//EV部署単位請求数
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//EV部署単位請求数
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
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
//@access public
//@return void
//
//
//EV部署単位請求情報取得自のFROM句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $sort
//@access public
//@return void
//
//
//請求部署単位の部署ID、flag部分のSQLを返す <br>
//選択部署はflag=0、配下部署はflag=1 <br>
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $tb
//@access private
//@return void
//
//
//請求部署単位のwhere句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $H_post
//@access private
//@return void
//
//
//請求部署単位の時のOrder句作成
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $sort
//@access private
//@return void
//
//
//EV部署単位請求数
//
//@author miyazawa
//@since 2010/07/15
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $mode
//@access public
//@return void
//
//
//EV部署単位請求数
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
//デストラクタ
//
//@author miyazawa
//@since 2010/07/15
//
//@access public
//@return void
//
class BillEvMenuModel extends BillEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = false, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//ID単位なら配下全ての部署
	//配下にもう部署が無い時は表示モードをID単位に変更
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		var postid = H_sess[BillEvMenuModel.PUB].current_postid;
		this.setTableName(H_sess[BillEvMenuModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var allflg = false;

		if (H_sess.SELF.mode !== "0") {
			allflg = true;
		}

		var A_post = this.getUnderChildPostid(postid, A_allpost, allflg);

		if (A_post.length === 0) {
			H_sess.SELF.mode = "2";
		}

		var H_post = H_sess.SELF.post;
		H_post.evcoid = H_sess.SELF.evcoid;
		var A_data = Array();

		if (false === download) //件数取得
			//部署単位の時
			//リミット設定
			{
				if (H_sess.SELF.mode === "0") {
					A_data[0] = this.get_DB().queryOne(this.makePostBillCntSQL(A_post, postid, H_post));
				} else {
					A_data[0] = this.get_DB().queryOne(this.makeBillCntSQL(A_post, postid, H_post, H_sess.SELF.mode));
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		if (H_sess.SELF.mode === "0") {
			A_data[1] = this.get_DB().queryHash(this.makePostBillDataSQL(A_post, postid, H_post, H_sess.SELF.sort));
			A_data[2] = this.get_DB().queryRowHash(this.makePostBillSumSQL(A_post, postid, H_post));
		} else {
			A_data[1] = this.get_DB().queryHash(this.makeBillDataSQL(A_post, postid, H_post, H_sess.SELF.sort, H_sess.SELF.mode));
			A_data[2] = this.get_DB().queryRowHash(this.makeBillSumSQL(A_post, postid, H_post, H_sess.SELF.mode));
		}

		if (false === download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makePostBillSelectSQL() {
		var A_col = ["epb.pactid", "epb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "epb.charge as charge", "epb.aspcharge", "epb.aspexcise", "epb.evid_num", "epb.evcoid", "epb.flag", "epb.charge+epb.aspcharge+epb.aspexcise as all_charge", "epb.aspexcise as all_excise", "epb.kamoku1", "epb.kamoku2", "epb.kamoku3", "epb.kamoku4", "epb.kamoku5", "epb.kamoku6", "epb.kamoku7", "epb.kamoku8", "epb.kamoku9", "epb.kamoku10"];
		return A_col.join(",");
	}

	makePostBillCntSQL(A_post, postid, H_post) {
		var sql = "select " + " count(epb.postid) " + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "epb") + " and " + this.makePostBillWhereSQL(H_post);
		return sql;
	}

	makePostBillSumSQL(A_post, postid, H_post) {
		var sql = "select " + " coalesce(sum(epb.evid_num),0) as evid_sum" + ",coalesce(sum(epb.charge),0) as charge_sum" + ",coalesce(sum(epb.aspcharge)+sum(epb.aspexcise),0) as asp_sum" + ",coalesce(sum(epb.aspexcise),0) as asx_sum" + ",coalesce(sum(epb.charge)+sum(epb.aspcharge)+sum(epb.aspexcise),0) as all_charge_sum" + ",coalesce(sum(epb.aspexcise),0) as all_excise_sum" + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "epb") + " and " + this.makePostBillWhereSQL(H_post);
		return sql;
	}

	makePostBillDataSQL(A_post, postid, H_post, sort) {
		var sql = "select " + this.makePostBillSelectSQL() + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "epb") + " and " + this.makePostBillWhereSQL(H_post) + this.makePostBillOrderBySQL(sort);
		return sql;
	}

	makePostBillFromSQL() {
		var sql = this.H_Tb.ev_post_bill_tb + " as epb " + " left join " + this.H_Tb.post_tb + " on epb.postid=" + this.H_Tb.post_tb + ".postid";
		return sql;
	}

	makePostBillPostidWhereSQL(A_post, postid, tb) //部署一覧から選択部署を除く
	{
		if (-1 !== A_post.indexOf(postid) === true) {
			delete A_post[array_search(postid, A_post)];
		}

		if (A_post.length < 1) //$this->errorOut( 15, "恐らく2画面操作", false, "/Menu/menu.php" );
			{
				var sql = "(" + this.makeCommonWhereSQL(A_post, postid, tb, "2") + " and " + tb + ".flag='0')";
			} else {
			sql = "((" + this.makeCommonWhereSQL(A_post, postid, tb, "2") + " and " + tb + ".flag='0')" + " or " + "(" + this.makeCommonWhereSQL(A_post, postid, tb, "0") + " and " + tb + ".flag='1'))";
		}

		return sql;
	}

	makePostBillWhereSQL(H_post) //請求元
	{
		var A_where = Array();
		A_where.push("epb.evcoid=" + H_post.evcoid);
		return A_where.join(" and ");
	}

	makePostBillOrderBySQL(sort) //ノーマルはflagもソートに入れる
	{
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "epb.evid_num", "charge", "epb.aspcharge", "all_charge"];

		if ("00" === A_sort[0]) {
			var sql = " order by flag," + A_col[0];
		} else {
			sql = " order by " + A_col[A_sort[0]];
		}

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] !== "0") {
			sql += ",epb.postid ";
		}

		return sql;
	}

	makeBillCntSQL(A_post, postid, H_post, mode) {
		var sql = "select " + " count(eb.postid) " + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "eb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		return sql;
	}

	makeBillSumSQL(A_post, postid, H_post, mode) {
		var sql = "select " + " coalesce(count(eb.evid),0) as evid_sum" + ",coalesce(sum(eb.charge),0) as charge_sum" + ",coalesce(sum(eb.aspcharge)+sum(eb.aspexcise),0) as asp_sum" + ",coalesce(sum(eb.aspexcise),0) as asx_sum" + ",coalesce(sum(eb.charge)+sum(eb.aspcharge)+sum(eb.aspexcise),0) as all_charge_sum" + ",coalesce(sum(eb.aspexcise),0) as all_excise_sum" + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "eb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};