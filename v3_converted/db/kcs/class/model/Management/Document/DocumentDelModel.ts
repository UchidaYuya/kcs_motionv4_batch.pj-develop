//
//運送ID削除用Model
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2010/02/19
//@uses ManagementTransitModel
//
//
//
//運送ID削除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//

require("model/Management/Document/ManagementDocumentMenuModel.php");

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
//docidチェック
//
//削除用sql文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//getList
//一覧取得
//@author web
//@since 2016/01/05
//
//@param array $H_sess
//@param mixed $docid
//@param array $A_post
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
class DocumentDelModel extends ManagementDocumentMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	checkDocumentId(docid, A_post) //この会社にはこのdocidは存在しない
	{
		var sql = "select count(*) from document_tb where" + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and docid=" + this.get_db().dbQuote(docid, "integer", true) + " and postid in (" + A_post.join(",") + ")";
		var res = this.get_db().queryOne(sql);

		if (res == 0) {
			this.errorOut(5, "\u6307\u5B9A\u3055\u308C\u305F\u6DFB\u4ED8\u8CC7\u6599\u306F\u524A\u9664\u3067\u304D\u307E\u305B\u3093", false, "./menu.php");
		}
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var key in A_data) //document_line_tbの削除
		//document_tbの削除
		//管理記録はいらないみたい
		//array_push( $A_sql, $this->makeTranDelLogSQL( $A_data[$cnt], $H_post, $cym ) );
		{
			var value = A_data[key];
			var sql = "select lineno from document_line_tb where" + " docid=" + this.get_db().dbQuote(value.docid, "integer", true);
			var lineno_list = this.get_db().queryCol(sql);

			for (var no of Object.values(lineno_list)) {
				A_sql.push("delete from document_line_tb where" + " docid=" + this.get_db().dbQuote(value.docid, "integer", true) + " and lineno=" + this.get_db().dbQuote(no, "integer", true));
			}

			A_sql.push("delete from document_tb where" + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and docid=" + this.get_db().dbQuote(value.docid, "integer", true));
		}

		return A_sql;
	}

	getList(H_sess: {} | any[], docid, A_post: {} | any[]) {
		this.setTableName(H_sess.cym);
		var A_data = Array();
		var sql = "select" + " doc.recdate,doc.docid,doc.title,doc.comment,doc.enddate,doc.use_header,post.userpostid" + " from " + " document_tb as doc" + " left join post_tb  post on post.postid = doc.postid and post.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " where " + " doc.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and doc.docid = " + this.get_DB().dbQuote(docid, "integer", true);
		A_data.push(this.get_db().queryRowHash(sql));
		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};