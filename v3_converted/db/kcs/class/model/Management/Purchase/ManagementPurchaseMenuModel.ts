//
//購買ID一覧用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementPurchaseModel
//
//
//
//購買ID一覧用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ManagementPurchaseModel
//

require("model/Management/Purchase/ManagementPurchaseModel.php");

require("MtAuthority.php");

require("TableMake.php");

require("ManagementUtil.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//購買一覧のデータを生成する <br>
//
//電話一覧取得<br>
//ETC一覧取得<br>
//各データの結合<br>
//
//@author houshiyama
//@since 2008/02/26
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param mixed $dounload
//@access private
//@return string
//
//
//一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_sess
//@access private
//@return $sql
//
//
//件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_sess
//@access private
//@return string
//
//
//購買一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
//@param mixed $postid
//@param mixed $H_post（CGIパラメータ）
//@param mixed $sort
//@access protected
//@return stringy
//
//
//where句作成
//
//@author houshiyama
//@since 2008/03/14
//
//@access protected
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//ユーザ設定項目取得 <br>
//
//@author houshiyama
//@since 2008/03/31
//
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
class ManagementPurchaseMenuModel extends ManagementPurchaseModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post, download = false) //テーブル名決定
	//フリーワードの値をローカルセッションのポストの値に合体させる
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		this.setTableName(H_sess[ManagementPurchaseMenuModel.PUB].cym);
		var A_freeword = this.makeFreeWordArray(H_sess[ManagementPurchaseMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementPurchaseMenuModel.PUB].freeword);
		}

		var A_data = Array();

		if (false == download) //件数取得
			//最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(this.makePurchListCntSQL(A_post, H_sess.SELF.post));

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		A_data[1] = this.get_DB().queryHash(this.makePurchListSQL(A_post, H_sess.SELF.post, H_sess.SELF.sort));

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeListSQL(H_sess: {} | any[]) {
		return this.makePurchListSQL(H_sess);
	}

	makeListCntSQL(H_sess: {} | any[]) {
		return this.makePurchListCntSQL(H_sess);
	}

	makePurchListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makePurchSelectSQL() + " from " + this.makePurchFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "pu") + this.makePurchWhereSQL(H_post) + this.makeOrderBySQL(sort);
		return sql;
	}

	makePurchWhereSQL(H_post) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		var sql = " and pu.dummy_flg=false ";
		sql = " and pu.delete_flg=false ";

		if (H_post.purchid != "") {
			A_where.push("pu.purchid like '%" + H_post.purchid + "%'");
		}

		if (H_post.purchcoid != "") {
			A_where.push("pu.purchcoid=" + H_post.purchcoid);
		}

		if (H_post.loginid != "") {
			A_where.push("pu.loginid like '%" + H_post.loginid + "%'");
		}

		if (H_post.username != "") {
			A_where.push("pu.username like '%" + H_post.username + "%'");
		}

		if (H_post.employeecode != "") {
			A_where.push("pu.employeecode like '%" + H_post.employeecode + "%'");
		}

		if (H_post.registcomp != "") {
			A_where.push("pu.registcomp like '%" + H_post.registcomp + "%'");
		}

		if (H_post.registpost != "") {
			A_where.push("pu.registpost like '%" + H_post.registpost + "%'");
		}

		if (H_post.registzip != "") {
			A_where.push("pu.registzip like '%" + H_post.registzip + "%'");
		}

		if (H_post.registaddr != "") {
			A_where.push("pu.registaddr1||registaddr2||registbuilding like '%" + H_post.registaddr + "%'");
		}

		if (H_post.registtelno != "") {
			A_where.push("pu.registtelno like '%" + H_post.registtelno + "%'");
		}

		if (H_post.registfaxno != "") {
			A_where.push("pu.registfaxno like '%" + H_post.registfaxno + "%'");
		}

		if (H_post.registemail != "") {
			A_where.push("pu.registemail like '%" + H_post.registemail + "%'");
		}

		if (H_post.text.column != "" && H_post.text.val != "") {
			A_where.push("pu." + H_post.text.column + " like '%" + H_post.text.val + "%'");
		}

		if (H_post.int.column != "" && H_post.int.val != "") {
			A_where.push("pu." + H_post.int.column + " " + H_post.int.condition + " " + H_post.int.val);
		}

		if (H_post.date.column != "" && H_post.date.val.Y + H_post.date.val.m + H_post.date.val.d != "") {
			var dateval = this.O_Manage.convertDatetime(H_post.date.val);
			A_where.push("pu." + H_post.date.column + " " + H_post.date.condition + " " + this.get_DB().dbQuote(dateval, "timestamp"));
		}

		if (H_post.mail.column != "" && H_post.mail.val != "") {
			A_where.push("pu." + H_post.mail.column + " like '%" + H_post.mail.val + "%'");
		}

		if (H_post.url.column != "" && H_post.url.val != "") {
			A_where.push("pu." + H_post.url.column + " like '%" + H_post.url.val + "%'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getPurchFreeWordCol(), H_post.A_freeword));
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".postname", "pu.purchid", "purchase_co_tb.purchconame", "pu.username", "pu.registdate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".postname ";
		}

		if (A_sort[0] != 1) {
			sql += ",pu.purchid ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(ManagementPurchaseMenuModel.PURCHMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};