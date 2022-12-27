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

require("model/Management/ManagementModelBase.php");

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
//makeDocumentListSQL
//添付資料管理の一覧を取得する
//@author web
//@since 2016/01/04
//
//@param mixed $A_post
//@param mixed $sort
//@access protected
//@return void
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
class ManagementDocumentMenuModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post) //テーブル名決定
	//件数取得
	//最期のページが無くなっていないかチェック
	//一覧
	//自部署のみの場合、DL出来ないものをリストアップ
	{
		this.setTableName(H_sess[ManagementDocumentMenuModel.PUB].cym);
		var A_data = Array();
		var today = date("Y-m-d");
		A_data[0] = this.get_DB().queryOne(this.makeDocumentListCntSQL(A_post, today));

		if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
			H_sess.SELF.offset = H_sess.SELF.offset - 1;
		}

		this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
		A_data[1] = this.get_DB().queryHash(this.makeDocumentListSQL(A_post, today, H_sess.SELF.sort));
		var docid_list = Array();
		{
			let _tmp_0 = A_data[1];

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				docid_list.push(value.docid);
			}
		}

		if (!docid_list) {
			A_data[2] = Array();
		} else {
			A_data[2] = this.getDocumentDLList(this.H_G_Sess.pactid, this.H_G_Sess.postid, docid_list, A_post);
		}

		return A_data;
	}

	makeDocumentListCntSQL(A_post, today) {
		var sql = "select" + " count( distinct(doc.docid) )" + " from " + " document_line_tb as line" + " join post_tb  post on" + " post.pactid =" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and ( (post.postid = line.postid) or ( post.postid is null and line.postid is null ) )" + " and post.postid in (" + A_post.join(",") + ")" + " join document_tb doc on" + " doc.docid=line.docid" + " and doc.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and doc.enddate >= " + this.get_DB().dbQuote(today, "date", true);
		return sql;
	}

	makeDocumentListSQL(A_post, today, sort = undefined) //自部署、配下部署のみに絞り込むように修正した
	{
		var sql = "select" + " doc.recdate,doc.docid,doc.title,doc.comment,doc.enddate,doc.use_header" + " from " + " document_line_tb as line" + " join post_tb  post on" + " post.pactid =" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and ( (post.postid = line.postid) or ( post.postid is null and line.postid is null ) )" + " and post.postid in (" + A_post.join(",") + ")" + " join document_tb doc on" + " doc.docid=line.docid" + " and doc.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and doc.enddate >= " + this.get_DB().dbQuote(today, "date", true) + " group by doc.recdate,doc.docid,doc.title,doc.comment,doc.enddate,doc.use_header";

		if (!is_null(sort)) {
			sql += this.makeOrderBySQL(sort);
		}

		return sql;
	}

	makeDocumentListWhere() {
		var now = date("Y-m-d");
		var sql = " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and enddate >= " + this.get_DB().dbQuote(now, "date", true);
		return sql;
	}

	getDocumentDLList(pactid, postid, docid_list, A_post) //現在のユーザーのpostidを取得
	//現在のユーザー配下のpostidを取得する
	//添付資料に記述されているpostidを取得する
	{
		var res = Array();
		var sql = "select postid from post_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(postid, "integer", true);
		postid = this.get_DB().queryOne(sql);
		res.current = postid;
		var postlist = Array();

		for (var id of Object.values(A_post)) {
			if (!!id) {
				postlist.push(this.get_DB().dbQuote(id, "text", true));
			}
		}

		sql = "select postid from post_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid in (" + postlist.join(",") + ")" + " and postid is not null";
		var under = this.get_DB().queryCol(sql);

		if (!under) {
			res.under = "";
		} else {
			res.under = under.join(",");
		}

		for (var docid of Object.values(docid_list)) //title行ありますか
		//この添付資料に記述されているpostidを取得する
		{
			sql = "select use_header from document_tb where" + " docid=" + this.get_db().dbQuote(docid, "integer", true) + " and pactid=" + this.get_db().dbQuote(pactid, "integer", true);
			var use_header = this.get_DB().queryOne(sql);
			sql = "select postid from document_line_tb where" + " docid=" + this.get_db().dbQuote(docid, "integer", true);

			if (use_header == true) {
				sql += " and lineno != 0";
			}

			postid = this.get_DB().queryCol(sql);
			res[docid] = postid.join(",");
		}

		return res;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["recdate", "title", "comment", "enddate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",enddate ";
		}

		return sql;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(ManagementDocumentMenuModel.TRANMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};