//
//管理情報トップページ用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//

require("model/Management/ManagementModelBase.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@param mixed $O_form
//@access public
//@return void
//
//
//getNotExistsUserPostId
//存在しないuserpostidの取得
//@author date
//@since 2015/08/19
//
//@param mixed $filename
//@param mixed $title_exists
//@access public
//@return void
//
//
//登録時に必要なSQL文を作る <br>
//
//SQL文作成 <br>
//
//@author date
//@since 2008/03/18
//
//@param mixed $H_sess
//@access public
//@return array
//
//
//DBが必要なデータ、権限チェックを行う <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_view
//@param array $H_sess
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
class DocumentAddModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	checkInputError(H_post, O_form) //$O_form->setElementErrorWrapper( "tranid", "登録済みの運送ＩＤです" );
	//登録系共通チェック
	{
		this.setTableName(date("Ym"));
		this.checkAddAuth(H_post);
	}

	getNextDocid() {
		var sql = "SELECT NEXTVAL('document_tb_docid_seq');";
		return this.get_db().queryOne(sql);
	}

	makeInsertDocumentTb(H_sess, docid) //インサートする
	{
		var enddate = sprintf("%04d-%02d-%02d", H_sess.SELF.post.enddate.Y, H_sess.SELF.post.enddate.m, H_sess.SELF.post.enddate.d);

		if (H_sess.SELF.post.use_header == "1") {
			var use_header = true;
		} else {
			use_header = false;
		}

		var colum = {
			docid: this.get_db().dbQuote(docid, "integer", true),
			pactid: this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true),
			postid: this.get_db().dbQuote(this.H_G_Sess.postid, "integer", true),
			userid: this.get_db().dbQuote(this.H_G_Sess.userid, "integer", true),
			title: this.get_db().dbQuote(H_sess.SELF.upload.up_name, "text", true),
			comment: this.get_db().dbQuote(H_sess.SELF.post.comment, "text"),
			use_header: this.get_db().dbQuote(use_header, "bool"),
			enddate: this.get_db().dbQuote(enddate, "timestamp", true),
			recdate: this.get_db().dbQuote(this.NowTime, "timestamp", true)
		};
		var key = Object.keys(colum);
		var sql = "insert into document_tb ( " + key.join(",") + ")values(" + colum.join(",") + ")";
		return sql;
	}

	makeInsertDocumentLineTb(filename, docid, header_use) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//$A_fileData = file($H_sess["SELF"]["upload"]["up_file"]);
	//データが１行もなかった場合はエラー
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 0;
		var entryLine = 1;
		var A_rtnData = Array();
		var array_count = 100;
		var A_fileData = file(filename);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //タイトルの表示
		{
			var colum = Array();
			var lineno = lineCounter;
			lineCounter++;
			var line_rtrim = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");
			colum.docid = this.get_db().dbQuote(docid, "integer", true);
			colum.lineno = this.get_db().dbQuote(lineno, "integer", true);
			colum.line = this.get_db().dbQuote(line_rtrim, "text", false);
			colum.recdate = this.get_db().dbQuote(this.NowTime, "timestamp", true);

			if (header_use == true && lineno == 0) //タイトル行いれる
				{
					colum.userpostid = this.get_db().dbQuote("", "text", false);
				} else //登録してく
				//カンマ区切り
				{
					var A_lineData = split("\\,", line_rtrim);
					colum.userpostid = this.get_db().dbQuote(A_lineData[0], "text", false);
				}

			var key = Object.keys(colum);
			A_rtnData[array_count] = "insert into document_line_tb ( " + key.join(",") + ")values(" + colum.join(",") + ")";
			array_count++;
		}

		return A_rtnData;
	}

	getNotExistsUserPostId(filename, header_use) //行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//存在するpostid一覧の取得をするよ
	//存在しないpostidを出していく
	{
		var lineCounter = 0;
		var A_rtnData = Array();
		var userpostid_list_quote = Array();
		var userpostid_list = Array();
		var A_fileData = file(filename);

		if (A_fileData.length == 0) {
			var errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //カンマ区切り
		{
			var colum = Array();
			var lineno = lineCounter;
			lineCounter++;
			var line_rtrim = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");

			if (header_use == true) {
				if (lineno == 0) //タイトル行いれる
					{
						colum.userpostid = this.get_db().dbQuote("", "text", false);
						continue;
					}
			}

			var A_lineData = split("\\,", line_rtrim);

			if (!(-1 !== userpostid_list.indexOf(A_lineData[0]))) //DB用のuserpostid
				//php用
				{
					userpostid_list_quote.push(this.get_db().dbQuote(A_lineData[0], "text", false));
					userpostid_list.push(A_lineData[0]);
				}
		}

		var sql = "select userpostid from post_tb where" + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and userpostid in(" + userpostid_list_quote.join(",") + ")";
		var res = this.get_db().queryCol(sql);

		for (var id of Object.values(userpostid_list)) {
			if (!(-1 !== res.indexOf(id))) {
				A_rtnData.push(id);
			}
		}

		return A_rtnData;
	}

	makeAddSQL(H_sess: {} | any[]) {
		var A_sql = Array();
		var docid = this.getNextDocid();
		A_sql.push(this.makeInsertDocumentTb(H_sess, docid));
		A_sql += this.makeInsertDocumentLineTb(H_sess.SELF.upload.up_file, docid, H_sess.SELF.upload.use_header == 1 ? true : false);
		return A_sql;
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};