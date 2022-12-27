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
//@param array $A_post（部署一覧）
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
//copy_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//assets_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/08/24
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//transit_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2010/02/24
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//ev_tbへのSQL文のwhere句を作成する
//
//@author maeda
//@since 2010/08/09
//
//@param mixed $H_post（検索条件）
//@access protected
//@return string
//
//
//healthcare_tbへのSQL文のwhere句を作成する
//
//@author date
//@since 2015/06/24
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
class ManagementMenuModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess: {} | any[], A_post: {} | any[], download = false) //管理情報の絞込みに電話が含まれている時
	{
		var A_listsql = Array();
		var A_cntsql = Array();
		var A_data = Array();
		var mid = "";

		if (undefined !== H_sess.SELF.post == false) {
			H_sess.SELF.post = Array();
		}

		if (undefined !== H_sess.SELF.post.mid == true) {
			mid = H_sess.SELF.post.mid;
		}

		var A_freeword = this.makeFreeWordArray(H_sess[ManagementMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementMenuModel.PUB].freeword);
		}

		this.setTableName(H_sess[ManagementMenuModel.PUB].cym);

		if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.TELMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeTelListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeTelListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.ETCMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeEtcListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeEtcListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.PURCHMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makePurchListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makePurchListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.COPYMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeCopyListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeCopyListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.ASSMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeAssetsListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeAssetsListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_tran_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.TRANMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeTranListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeTranListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_ev_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.EVMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeEvListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeEvListSQL(A_post, H_sess.SELF.post));
			}

		if (-1 !== this.A_Auth.indexOf("fnc_healthcare_manage_vw") == true && (mid == "" || mid == ManagementMenuModel.HEALTHMID)) //ダウンロードでは使用しない
			{
				if (false == download) {
					A_cntsql.push(this.makeHealthListCntSQL(A_post, H_sess.SELF.post));
				}

				A_listsql.push(this.makeHealthListSQL(A_post, H_sess.SELF.post));
			}

		if (A_listsql.length > 0) //ダウンロードでは使用しない
			{
				if (false == download) {
					var cntsql = "select (" + A_cntsql.join(") + (") + ")";
				}

				var listsql = A_listsql.join(" union all ") + this.makeOrderBySQL(H_sess.SELF.sort);
			}

		if (false == download) //最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(cntsql);

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		A_data[1] = this.get_DB().queryHash(listsql);

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeTelWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//管理番号入力あり
	{
		var A_where = Array();
		var sql = " and (te.dummy_flg = false or te.dummy_flg is null) ";

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			var telno = this.O_Manage.convertNoView(H_post.manageno);
			A_where.push("te.telno like '%" + telno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") //表示言語分岐
			{
				if (this.H_G_Sess.language == "ENG") {
					A_where.push("carrier_tb.carname_eng like '%" + H_post.contract + "%'");
				} else {
					A_where.push("carrier_tb.carname like '%" + H_post.contract + "%'");
				}
			}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("te.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") //表示言語分岐
			{
				if (this.H_G_Sess.language == "ENG") {
					A_where.push("circuit_tb.cirname_eng like '%" + H_post.note + "%'");
				} else {
					A_where.push("circuit_tb.cirname like '%" + H_post.note + "%'");
				}
			}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.val);
			A_where.push("te.contractdate " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getTelFreeWordCol(), H_post.A_freeword));
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);
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

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push("ca.card_corpno like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			A_where.push(" 1=2 ");
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

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push("pu.registcomp like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.val);
			A_where.push("pu.registdate " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getPurchFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeCopyWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("co.dummy_flg=false");
		A_where.push("co.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("co.copyid like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("copy_co_tb.copyconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("co.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push("co.copyname like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			A_where.push(" 1=2 ");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getCopyFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeAssetsWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("ass.dummy_flg=false");
		A_where.push("ass.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("ass.assetsno like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("0=1");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("ass.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push("product_tb.productname like '%" + H_post.note + "%'");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			var contractdate = this.O_Manage.convertDatetime(H_post.contractdate.val);
			A_where.push("ass.bought_date " + H_post.contractdate.condition + "'" + contractdate + "'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getAssetsFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeTranWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("tr.dummy_flg=false");
		A_where.push("tr.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("tr.tranid like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("transit_co_tb.tranconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("tr.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push(" 1=2 ");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			A_where.push(" 1=2 ");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getTranFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeEvWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//array_push( $A_where, "ev.dummy_flg=false" );
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("ev.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("ev.evid like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("ev_co_tb.evconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("ev.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") //検索する項目がないので必ず検索ヒットしないようにする
			{
				A_where.push(" 1=2 ");
			}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") //検索する項目がないので必ず検索ヒットしないようにする
			{
				A_where.push(" 1=2 ");
			}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getEvFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeHealthWhereSQL(H_post: {} | any[]) //ダミーフラグ
	//削除フラグ
	//管理番号入力あり
	{
		var A_where = Array();
		A_where.push("hlt.dummy_flg=false");
		A_where.push("hlt.delete_flg=false");

		if (undefined !== H_post.manageno == true && H_post.manageno != "") {
			A_where.push("hlt.healthid like '%" + H_post.manageno + "%'");
		}

		if (undefined !== H_post.contract == true && H_post.contract != "") {
			A_where.push("healthcare_co_tb.healthconame like '%" + H_post.contract + "%'");
		}

		if (undefined !== H_post.username == true && H_post.username != "") {
			A_where.push("hlt.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.note == true && H_post.note != "") {
			A_where.push(" 1=2 ");
		}

		if (undefined !== H_post.contractdate.val.Y == true && H_post.contractdate.val.Y + H_post.contractdate.val.m + H_post.contractdate.val.d != "") {
			A_where.push(" 1=2 ");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getHealthFreeWordCol(), H_post.A_freeword));
		}

		var sql = this.implodeWhereArray(A_where, H_post.search_condition);
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["postname", "manageno", "mid", "contract", "note", "username", "contractdate"];
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

		sql += ",main_flg desc";
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