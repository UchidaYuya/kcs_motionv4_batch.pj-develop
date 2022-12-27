//
//コピー機請求一覧表示Model
//
//更新履歴：<br>
//2008/07/10 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/07/10
//@uses BillCopyModel
//
//
//
//コピー機請求一覧表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/07/10
//@uses BillCopyModel
//

require("model/Bill/Copy/BillCopyModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/10
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
//@author houshiyama
//@since 2008/07/10
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
//@author houshiyama
//@since 2008/07/10
//
//@access private
//@return void
//
//
//コピー機部署単位請求数
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//コピー機部署単位請求数
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
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
//@access public
//@return void
//
//
//コピー機部署単位請求情報取得自のFROM句作成
//
//@author houshiyama
//@since 2008/07/10
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
//@author houshiyama
//@since 2008/07/10
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
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $H_post
//@access private
//@return void
//
//
//請求部署単位の時のOrder句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $sort
//@access private
//@return void
//
//
//コピー機部署単位請求数
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $mode
//@access public
//@return void
//
//
//コピー機部署単位請求数
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
//デストラクタ
//
//@author houshiyama
//@since 2008/07/10
//
//@access public
//@return void
//
class BillCopyMenuModel extends BillCopyModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = false, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//コピー機ID単位なら配下全ての部署
	//配下にもう部署が無い時は表示モードを部署コピー機ID単位に変更
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		var postid = H_sess[BillCopyMenuModel.PUB].current_postid;
		this.setTableName(H_sess[BillCopyMenuModel.PUB].cym);
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
		H_post.copycoid = H_sess.SELF.copycoid;
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
		var A_col = ["cpb.pactid", "cpb.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "cpb.charge+cpb.excise as charge", "cpb.excise", "cpb.aspcharge", "cpb.aspexcise", "cpb.copyid_num", "cpb.copycoid", "cpb.flag", "cpb.charge+cpb.excise+cpb.aspcharge+cpb.aspexcise as all_charge", "cpb.excise+cpb.aspexcise as all_excise", "cpb.printcount", "cpb.kamoku1", "cpb.kamoku2", "cpb.kamoku3", "cpb.kamoku4", "cpb.kamoku5", "cpb.kamoku6", "cpb.kamoku7", "cpb.kamoku8", "cpb.kamoku9", "cpb.kamoku10"];
		return A_col.join(",");
	}

	makePostBillCntSQL(A_post, postid, H_post) {
		var sql = "select " + " count(cpb.postid) " + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "cpb") + " and " + this.makePostBillWhereSQL(H_post);
		return sql;
	}

	makePostBillSumSQL(A_post, postid, H_post) {
		var sql = "select " + " coalesce(sum(cpb.copyid_num),0) as copyid_sum" + ",coalesce(sum(cpb.charge)+sum(cpb.excise),0) as charge_sum" + ",coalesce(sum(cpb.excise),0) as excise_sum" + ",coalesce(sum(cpb.kamoku2),0) as green_sum" + ",coalesce(sum(cpb.aspcharge)+sum(cpb.aspexcise),0) as asp_sum" + ",coalesce(sum(cpb.aspexcise),0) as asx_sum" + ",coalesce(sum(cpb.charge)+sum(cpb.excise)+sum(cpb.aspcharge)+sum(cpb.aspexcise),0) as all_charge_sum" + ",coalesce(sum(cpb.excise)+sum(cpb.aspexcise),0) as all_excise_sum" + ",coalesce(sum(cpb.printcount),0) as printcount_sum" + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "cpb") + " and " + this.makePostBillWhereSQL(H_post);
		return sql;
	}

	makePostBillDataSQL(A_post, postid, H_post, sort) {
		var sql = "select " + this.makePostBillSelectSQL() + " from " + this.makePostBillFromSQL() + " where " + this.makePostBillPostidWhereSQL(A_post, postid, "cpb") + " and " + this.makePostBillWhereSQL(H_post) + this.makePostBillOrderBySQL(sort);
		return sql;
	}

	makePostBillFromSQL() {
		var sql = this.H_Tb.copy_post_bill_tb + " as cpb " + " left join " + this.H_Tb.post_tb + " on cpb.postid=" + this.H_Tb.post_tb + ".postid";
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
		A_where.push("cpb.copycoid=" + H_post.copycoid);
		return A_where.join(" and ");
	}

	makePostBillOrderBySQL(sort) //ノーマルはflagもソートに入れる
	{
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cpb.copyid_num", "cpb.printcount", "charge", "cpb.aspcharge", "all_charge"];

		if ("00" === A_sort[0]) {
			var sql = " order by flag," + A_col[0];
		} else {
			sql = " order by " + A_col[A_sort[0]];
		}

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] !== "0") {
			sql += ",cpb.postid ";
		}

		return sql;
	}

	makeBillCntSQL(A_post, postid, H_post, mode) {
		var sql = "select " + " count(cb.postid) " + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "cb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		return sql;
	}

	makeBillSumSQL(A_post, postid, H_post, mode) {
		var sql = "select " + " coalesce(count(cb.copyid),0) as copyid_sum" + ",coalesce(sum(cb.charge)+sum(cb.excise),0) as charge_sum" + ",coalesce(sum(cb.excise),0) as excise_sum" + ",coalesce(sum(cb.aspcharge)+sum(cb.aspexcise),0) as asp_sum" + ",coalesce(sum(cb.aspexcise),0) as asx_sum" + ",coalesce(sum(cb.charge)+sum(cb.excise)+sum(cb.aspcharge)+sum(cb.aspexcise),0) as all_charge_sum" + ",coalesce(sum(cb.excise)+sum(cb.aspexcise),0) as all_excise_sum" + ",coalesce(sum(cb.printcount),0) as printcount_sum" + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "cb", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};