//
//添付資料管理DL
//
//
//DocumentDownloadModel
//添付資料管理DL
//@uses ManagementDocumentMenuModel
//@package
//@author date
//@since 2016/05/24
//

require("model/Management/Document/ManagementDocumentMenuModel.php");

//
//__construct
//
//@author date
//@since 2016/05/24
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@param mixed $O_manage
//@access public
//@return void
//
//
//makePostWhereSQL
//部署の絞込み部分のSQL
//@author date
//@since 2016/05/24
//
//@param mixed $A_post
//@param mixed $tb
//@access protected
//@return void
//
//
//getList
//csvの中身を取得
//@author web
//@since 2017/01/11
//
//@param mixed $A_post
//@param mixed $docid
//@param mixed $use_header
//@access public
//@return void
//
//
//getDocument
//添付資料のデータ取得
//@author web
//@since 2017/01/11
//
//@param mixed $pactid
//@param mixed $docid
//@access public
//@return void
//
//
//getDocumentLine
//csvの中身を1行ずつ取得
//@author web
//@since 2017/01/11
//
//@param mixed $docid
//@param mixed $A_postid
//@param mixed $use_header
//@access private
//@return void
//
//
//InsertMngLog
//ログの書き込み
//@author date
//@since 2016/03/31
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $postname
//@param mixed $userid
//@param mixed $username
//@param mixed $loginid
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2016/05/24
//
//@access public
//@return void
//
class DocumentDownloadModel extends ManagementDocumentMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makePostWhereSQL(A_post, tb) //部署を取得していなければここで取得
	{
		if (A_post.length <= 1) {
			A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
		}

		var sql = tb + ".postid in (" + A_post.join(",") + ") ";
		return sql;
	}

	getList(A_post, docid, use_header) //ファイルデータを返す
	{
		var A_rtnData = Array();

		if (_GET.only == 1) {
			var postid_list = [this.H_G_Sess.postid];
		} else {
			postid_list = A_post;
		}

		A_rtnData = this.getDocumentLine(docid, postid_list, use_header);
		return A_rtnData;
	}

	getDocument(pactid, docid) {
		var sql = "select * from document_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and docid=" + this.get_DB().dbQuote(docid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	getDocumentLine(docid, A_postid, use_header) //空チェック
	//取得する
	{
		var postid = Array();

		if (!A_postid) {
			return Array();
		}

		var where = " docid=" + this.get_DB().dbQuote(docid, "integer", true);

		if (use_header == false) //タイトル行なしで1行目
			{
				where += " and postid in (" + A_postid.join(",") + ")";
			} else //タイトル行ありで1行目から
			{
				where += " and ( postid in (" + A_postid.join(",") + ") or lineno = 0)";
			}

		var sql = "select line from document_line_tb where" + where + " order by lineno";
		return this.get_DB().queryCol(sql);
	}

	insertMngLog(title, pactid, postid, postname, userid, username, loginid, joker) {
		var data = Array();
		data.pactid = this.get_DB().dbQuote(pactid, "int", true);
		data.postid = this.get_DB().dbQuote(postid, "int", true);
		data.targetpostid = this.get_DB().dbQuote(postid, "int", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.userid = this.get_DB().dbQuote(userid, "int", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.recdate = this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true);
		data.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2 = this.get_DB().dbQuote("\u6DFB\u4ED8\u8CC7\u6599\u7BA1\u7406\u306E\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9(" + title + ")", "text", true);
		data.comment1_eng = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2_eng = this.get_DB().dbQuote("download dorder history", "text", true);
		data.kind = this.get_DB().dbQuote("D", "text", true);
		data.type = this.get_DB().dbQuote("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9", "text", true);
		data.joker_flag = this.get_DB().dbQuote(joker === 1 ? 1 : 0, "integer", true);
		var keys = Object.keys(data);
		var sql = "INSERT INTO mnglog_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")";
		this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};