//
//資産管理トップページ用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/02/20
//@uses ManagementAssetsModel
//
//
//
//資産管理トップページ用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ManagementAssetsModel
//

require("model/Management/Assets/ManagementAssetsModel.php");

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
//資産管理一覧のデータを生成する <br>
//
//資産一覧取得<br>
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
//資産一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
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
class ManagementAssetsMenuModel extends ManagementAssetsModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post, download = false) //テーブル名決定
	//フリーワードの値をローカルセッションのポストの値に合体させる
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		this.setTableName(H_sess[ManagementAssetsMenuModel.PUB].cym);
		var A_freeword = this.makeFreeWordArray(H_sess[ManagementAssetsMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementAssetsMenuModel.PUB].freeword);
		}

		var A_data = Array();

		if (false == download) //件数取得
			//最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(this.makeAssetsListCntSQL(A_post, H_sess.SELF.post));

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		A_data[1] = this.get_DB().queryHash(this.makeAssetsListSQL(A_post, H_sess.SELF.post, H_sess.SELF.sort));

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeListSQL(H_sess: {} | any[]) {
		return this.makeAssetsListSQL(H_sess);
	}

	makeListCntSQL(H_sess: {} | any[]) {
		return this.makeAssetsListCntSQL(H_sess);
	}

	makeAssetsListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makeAssetsSelectSQL() + " from " + this.makeAssetsFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ass") + this.makeAssetsWhereSQL(H_post) + this.makeOrderBySQL(sort);
		return sql;
	}

	makeAssetsWhereSQL(H_post) //削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		var sql = " and ass.delete_flg=false ";

		if (H_post.assetsno != "") {
			A_where.push("ass.assetsno like '%" + H_post.assetsno + "%'");
		}

		if (H_post.assetstypeid != "") {
			A_where.push("ass.assetstypeid=" + H_post.assetstypeid);
		}

		if (H_post.username != "") {
			A_where.push("ass.username like '%" + H_post.username + "%'");
		}

		if (H_post.productname != "") {
			A_where.push("ass.productname like '%" + H_post.productname + "%'");
		}

		if (H_post.property != "") {
			A_where.push("ass.property like '%" + H_post.property + "%'");
		}

		if (H_post.serialno != "") {
			A_where.push("ass.serialno like '%" + H_post.serialno + "%'");
		}

		if (H_post.firmware != "") {
			A_where.push("ass.firmware like '%" + H_post.firmware + "%'");
		}

		if (H_post.version != "") {
			A_where.push("ass.version like '%" + H_post.version + "%'");
		}

		if (H_post.smpcirid != "") {
			A_where.push("ass.smpcirid=" + H_post.smpcirid);
		}

		if (H_post.accessory != "") {
			A_where.push("ass.accessory like '%" + H_post.accessory + "%'");
		}

		if (H_post.memo != "") {
			A_where.push("ass.memo like '%" + H_post.memo + "%'");
		}

		if (H_post.text.column != "" && H_post.text.val != "") {
			A_where.push("ass." + H_post.text.column + " like '%" + H_post.text.val + "%'");
		}

		if (H_post.int.column != "" && H_post.int.val != "") {
			A_where.push("ass." + H_post.int.column + " " + H_post.int.condition + " " + H_post.int.val);
		}

		if (H_post.date.column != "" && H_post.date.val.Y + H_post.date.val.m + H_post.date.val.d != "") {
			var dateval = this.O_Manage.convertDatetime(H_post.date.val);
			A_where.push("ass." + H_post.date.column + " " + H_post.date.condition + " " + this.get_DB().dbQuote(dateval, "timestamp"));
		}

		if (H_post.mail.column != "" && H_post.mail.val != "") {
			A_where.push("ass." + H_post.mail.column + " like '%" + H_post.mail.val + "%'");
		}

		if (H_post.url.column != "" && H_post.url.val != "") {
			A_where.push("ass." + H_post.url.column + " like '%" + H_post.url.val + "%'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getAssetsFreeWordCol(), H_post.A_freeword));
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".postname", "ass.assetsno", "assetstypename", "ass.productname", "ass.username"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".postname ";
		}

		if (A_sort[0] != 1) {
			sql += ",ass.assetsno ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(ManagementAssetsMenuModel.ASSMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};