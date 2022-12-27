//
//管理情報トップページ用Model
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/02/20
//@uses ManageModel
//@uses ManagementUtil
//
//
//
//管理情報トップページ用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ManagementModel
//

require("model/Management/ManagementModel.php");

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
//全て一覧のデータを生成する <br>
//
//電話一覧取得<br>
//Etc一覧取得<br>
//各データの結合<br>
//
//@author houshiyama
//@since 2008/02/26
//
//@param array $H_sess（CGIパラメータ）
//@param mixed $dounload
//@access public
//@return array
//
//
//tel_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//card_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//purchase_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/03/17
//
//@param mixed $H_post（検索条件）
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
//@access private
//@return string
//
//
//ユーザ設定項目取得 <br>
//（全て一覧のダウンロードでは使用しないので空配列を返す） <br>
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
class ManagementTerminalMenuModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess: {} | any[], download = false) {
		var A_name = ["\u677E\u7530", "\u4E2D\u6CA2", "\u5C71\u702C", "\u30ED\u30CB\u30FC", "\u30ED\u30DA\u30B9", "\u6C34\u6CBC", "\u5175\u85E4", "\u9577\u8C37\u5DDD", "\u698E\u672C", "\u5927\u5CF6", "\u5742\u7530", "\u6817\u539F", "\u7530\u4E2D", "\u7530\u4E2D", "\u5C0F\u690B", "\u6CB3\u5408", "\u5C0F\u5BAE\u5C71", "\u6589\u85E4", "\u4E7E", "\u72E9\u91CE"];
		var A_machine = ["P905i", "P904i", "SH905i", "SH904i", "SO905i", "SO904i", "N905i", "N904i", "E61", "P705i", "P704i", "SH705i", "SH704i", "SO705i", "SO704i"];
		var A_data = Array();
		A_data[0] = 20;
		A_data[1] = Array();

		for (var i = 0; i < 10; i++) {
			var A_tmp = {
				postname: "\uFF08\u682A\uFF09\u5E84\u7530\u5546\u4E8B",
				genre: "\u643A\u5E2F\u7AEF\u672B",
				terminalno: i + i + i + i + (i + 1) + (i + 1) + (i + 1) + (i + 1),
				serialno: str_pad(i + (i + 1) + (i + 2) + (i + 3), 20, "0", STR_PAD_LEFT),
				machine: A_machine[array_rand(A_machine)],
				username: A_name[array_rand(A_name)]
			};
			A_data[1].push(A_tmp);
		}

		return A_data;
	}

	makeTelWhereSQL(H_post: {} | any[]) //管理番号入力あり
	{
		var A_where = Array();

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			var telno = this.O_Manage.convertNoView(H_post.manageno);
			A_where.push("te.telno like '%" + telno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("carrier_tb.carname like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("te.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push("circuit_tb.cirname like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.date.Y == true && H_post.contractdate.date.Y + H_post.contractdate.date.m + H_post.contractdate.date.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.date);
			A_where.push("te.contractdate " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeEtcWhereSQL(H_post: {} | any[]) //削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("ca.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			var cardno = this.O_Manage.convertNoView(H_post.manageno);
			A_where.push("ca.cardno like '%" + cardno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("card_co_tb.cardconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("ca.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.username == true && H_post.note != "") {
			A_where.push("ca.card_corpno like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.date.Y == true && H_post.contractdate.date.Y + H_post.contractdate.date.m + H_post.contractdate.date.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.date);
			A_where.push("ca.recdate " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getEtcFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makePurchWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("pu.dummy_flg=false");
		A_where.push("pu.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("pu.purchid like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("purchase_co_tb.purchconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("pu.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.username == true && H_post.note != "") {
			A_where.push("pu.registcomp like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.date.Y == true && H_post.contractdate.date.Y + H_post.contractdate.date.m + H_post.contractdate.date.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.date);
			A_where.push("pu.registdate " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getPurchFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["postid", "manageno", "mid", "contract", "note", "username", "contractdate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",postid ";
		}

		if (A_sort[0] != 1) {
			sql += ",manageno ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = Array();
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};