//
//EV ID一覧用Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/15
//@filesource
//@uses ManagementEvModel
//
//
//
//EV ID一覧用Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/15
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

require("MtAuthority.php");

require("TableMake.php");

require("ManagementUtil.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
//
//@param array $H_sess
//@access private
//@return $sql
//
//
//件数を取得するSQL文作成
//
//@author maeda
//@since 2010/07/15
//
//@param array $H_sess
//@access private
//@return string
//
//
//EV ID一覧を取得するSQL文作成
//
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
//
//@access protected
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//ユーザ設定項目取得 <br>
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
class ManagementEvMenuModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post, download = false) //テーブル名決定
	//フリーワードの値をローカルセッションのポストの値に合体させる
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		this.setTableName(H_sess[ManagementEvMenuModel.PUB].cym);
		var A_freeword = this.makeFreeWordArray(H_sess[ManagementEvMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementEvMenuModel.PUB].freeword);
		}

		var A_data = Array();

		if (false == download) //件数取得
			//最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(this.makeEvListCntSQL(A_post, H_sess.SELF.post));

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		A_data[1] = this.get_DB().queryHash(this.makeEvListSQL(A_post, H_sess.SELF.post, H_sess.SELF.sort));

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeListSQL(H_sess: {} | any[]) {
		return this.makeEvListSQL(H_sess);
	}

	makeListCntSQL(H_sess: {} | any[]) {
		return this.makeEvListCntSQL(H_sess);
	}

	makeEvListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makeEvSelectSQL() + " from " + this.makeEvFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ev") + this.makeEvWhereSQL(H_post) + this.makeOrderBySQL(sort);
		return sql;
	}

	makeEvWhereSQL(H_post) //ダミーフラグ
	//$sql =  " and ev.dummy_flg=false ";
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		var sql = " and ev.delete_flg=false ";

		if (H_post.evid != "") {
			A_where.push("ev.evid like '%" + H_post.evid + "%'");
		}

		if (H_post.evcoid != "") {
			A_where.push("ev.evcoid=" + H_post.evcoid);
		}

		if (H_post.username != "") {
			A_where.push("ev.username like '%" + H_post.username + "%'");
		}

		if (H_post.ev_car_number != "") {
			A_where.push("ev.ev_car_number like '%" + H_post.ev_car_number + "%'");
		}

		if (H_post.ev_car_type != "") {
			A_where.push("ev.ev_car_type like '%" + H_post.ev_car_type + "%'");
		}

		if (H_post.ev_telno != "") {
			A_where.push("ev.ev_telno like '%" + H_post.ev_telno + "%'");
		}

		if (H_post.ev_mail != "") {
			A_where.push("ev.ev_mail like '%" + H_post.ev_mail + "%'");
		}

		if (H_post.text.column != "" && H_post.text.val != "") {
			A_where.push("ev." + H_post.text.column + " like '%" + H_post.text.val + "%'");
		}

		if (H_post.int.column != "" && H_post.int.val != "") {
			A_where.push("ev." + H_post.int.column + " " + H_post.int.condition + " " + H_post.int.val);
		}

		if (H_post.date.column != "" && H_post.date.val.Y + H_post.date.val.m + H_post.date.val.d != "") {
			var dateval = this.O_Manage.convertDatetime(H_post.date.val);
			A_where.push("ev." + H_post.date.column + " " + H_post.date.condition + " " + this.get_DB().dbQuote(dateval, "timestamp"));
		}

		if (H_post.mail.column != "" && H_post.mail.val != "") {
			A_where.push("ev." + H_post.mail.column + " like '%" + H_post.mail.val + "%'");
		}

		if (H_post.url.column != "" && H_post.url.val != "") {
			A_where.push("ev." + H_post.url.column + " like '%" + H_post.url.val + "%'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getEvFreeWordCol(), H_post.A_freeword));
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".postname", "ev.evid", "ev.username", "ev.ev_car_number"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += "," + this.H_Tb.post_tb + ".postname ";
		}

		if (A_sort[0] != 1) {
			sql += ",ev.evid ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(ManagementEvMenuModel.EVMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};