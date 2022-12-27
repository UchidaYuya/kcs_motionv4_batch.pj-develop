//
//運送ID一覧用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementTransitModel
//
//
//
//運送ID一覧用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//

require("model/Management/Healthcare/ManagementHealthcareModel.php");

require("MtAuthority.php");

require("TableMake.php");

require("ManagementUtil.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//運送一覧のデータを生成する <br>
//
//電話一覧取得<br>
//ETC一覧取得<br>
//各データの結合<br>
//
//@author houshiyama
//@since 2010/02/19
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
//@since 2010/02/19
//
//@param array $H_sess
//@access private
//@return $sql
//
//
//件数を取得するSQL文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_sess
//@access private
//@return string
//
//
//運送一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2010/02/19
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
//@since 2010/02/19
//
//@access protected
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//ユーザ設定項目取得 <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class ManagementHealthcareMenuModel extends ManagementHealthcareModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post, download = false) //テーブル名決定
	//フリーワードの値をローカルセッションのポストの値に合体させる
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		this.setTableName(H_sess[ManagementHealthcareMenuModel.PUB].cym);
		var A_freeword = this.makeFreeWordArray(H_sess[ManagementHealthcareMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementHealthcareMenuModel.PUB].freeword);
		}

		var A_data = Array();

		if (false == download) //件数取得
			//最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(this.makeHealthListCntSQL(A_post, H_sess.SELF.post));

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		A_data[1] = this.get_DB().queryHash(this.makeHealthListSQL(A_post, H_sess.SELF.post, H_sess.SELF.sort));

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeListSQL(H_sess: {} | any[]) {
		return this.makeHealthListSQL(H_sess);
	}

	makeListCntSQL(H_sess: {} | any[]) {
		echo("test");
		return this.makeHealthListCntSQL(H_sess);
	}

	makeHealthListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makeHealthSelectSQL() + " from " + this.makeHealthFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "hlt") + this.makeHealthWhereSQL(H_post) + this.makeOrderBySQL(sort);
		return sql;
	}

	makeHealthWhereSQL(H_post) //ダミーフラグ
	//$sql =  " and tr.dummy_flg=false ";
	//削除フラグ
	//ヘルスケアID
	{
		var A_where = Array();
		var sql = " and hlt.delete_flg=false ";

		if (H_post.healthid != "") {
			A_where.push("hlt.healthid like '%" + H_post.healthid + "%'");
		}

		if (H_post.healthcoid != "") {
			A_where.push("hlt.healthcoid=" + H_post.healthcoid);
		}

		if (H_post.username != "") {
			A_where.push("hlt.username like '%" + H_post.username + "%'");
		}

		if (H_post.employeecode != "") {
			A_where.push("hlt.employeecode like '%" + H_post.employeecode + "%'");
		}

		if (H_post.registdate.Y + H_post.registdate.m + H_post.registdate.d != "") {
			var dateval = this.O_Manage.convertDatetime(H_post.registdate);
			A_where.push("hlt.registdate " + H_post.registdate_condition + " " + this.get_DB().dbQuote(dateval, "timestamp"));
		}

		if (H_post.remarks != "") {
			A_where.push("hlt.remarks like '%" + H_post.remarks + "%'");
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".postname", "hlt.healthid", "healthcare_co_tb.healthconame", "hlt.username", "hlt.registdate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".postname ";
		}

		if (A_sort[0] != 1) {
			sql += ",hlt.healthid ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(ManagementHealthcareMenuModel.TRANMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};