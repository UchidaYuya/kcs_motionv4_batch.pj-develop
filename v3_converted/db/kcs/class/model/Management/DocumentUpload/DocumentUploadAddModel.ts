//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//setAllAuthIni
//権限の設定
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//get_AuthIni
//権限の取得
//@author date
//@since 2015/11/02
//
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
//getNextDocid
//
//@author web
//@since 2016/02/15
//
//@access private
//@return void
//
//
//makeInsertDocumentTb
//
//@author web
//@since 2016/02/15
//
//@param mixed $H_sess
//@param mixed $docid
//@access private
//@return void
//
//
//makeInsertDocumentLineTb
//
//@author web
//@since 2016/02/15
//
//@param mixed $filename
//@param mixed $docid
//@param mixed $header_use
//@access private
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
//execDB
//DBの実行
//@author web
//@since 2015/11/27
//
//@param mixed $A_sql
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class DocumentUploadAddModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getNotExistsUserPostId(filename, header_use) //行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//処理するものがあるかどうか・・
	{
		var lineCounter = 0;
		var A_rtnData = Array();
		var postid_list = Array();
		var A_fileData = file(filename);

		if (A_fileData.length == 0) {
			var errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //タイトル行を含んでいる場合は、最初の行を無視する
		//カンマ区切り
		{
			var lineno = lineCounter;
			lineCounter++;
			var line_rtrim = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");

			if (header_use == true && lineno == 0) {
				continue;
			}

			var A_lineData = split("\\,", line_rtrim);

			if (!(-1 !== postid_list.indexOf(A_lineData[0]))) {
				var postid = str_replace(" ", "", A_lineData[0]);
				postid_list.push(postid);
			}
		}

		if (!!postid_list) //対象の企業のpostid一覧を取得する
			//アップロードされたファイルのpostidにて、存在しないpostidがあれば追加する
			{
				var sql = "select postid,true from post_tb where" + " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true);
				var res = this.get_db().queryAssoc(sql);

				for (var id of Object.values(postid_list)) {
					if (!res[id]) {
						A_rtnData.push(id);
					}
				}
			}

		return A_rtnData;
	}

	getNextDocid() {
		var sql = "SELECT NEXTVAL('document_tb_docid_seq');";
		return this.get_db().queryOne(sql);
	}

	makeInsertDocumentTb(H_sess, docid, nowtime) //インサートする
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
			recdate: this.get_db().dbQuote(nowtime, "timestamp", true)
		};
		var key = Object.keys(colum);
		var sql = "insert into document_tb ( " + key.join(",") + ")values(" + colum.join(",") + ")";
		return sql;
	}

	makeInsertDocumentLineTb(filename, docid, header_use, nowtime) //エラーフラグ（false:エラー無し、true:エラー有り）
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

		for (var lineData of Object.values(A_fileData)) //データがNULLの場合は空文字にする
		//タイトルの表示
		{
			var colum = Array();
			var lineno = lineCounter;
			lineCounter++;
			var line_rtrim = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");

			if (is_null(line_rtrim)) {
				line_rtrim = "";
			}

			colum.docid = this.get_db().dbQuote(docid, "integer", true);
			colum.lineno = this.get_db().dbQuote(lineno, "integer", true);
			colum.line = this.get_db().dbQuote(line_rtrim, "text", false);
			colum.recdate = this.get_db().dbQuote(nowtime, "timestamp", true);

			if (header_use == true && lineno == 0) //タイトル行いれる
				{
					colum.postid = this.get_db().dbQuote("", "integer", false);
					colum.userpostid = this.get_db().dbQuote(undefined, "text", false);
				} else //登録してく
				//カンマ区切り
				//部署IDがNULLの場合は空文字にする
				{
					var A_lineData = split("\\,", line_rtrim);

					if (is_null(A_lineData[0])) {
						var postid = "";
					} else {
						postid = A_lineData[0];
					}

					postid = str_replace(" ", "", postid);
					colum.postid = this.get_db().dbQuote(postid, "integer", false);
					colum.userpostid = this.get_db().dbQuote(undefined, "text", false);
				}

			var key = Object.keys(colum);
			A_rtnData[array_count] = "insert into document_line_tb ( " + key.join(",") + ")values(" + colum.join(",") + ")";
			array_count++;
		}

		return A_rtnData;
	}

	makeAddSQL(H_sess: {} | any[]) {
		var A_sql = Array();
		var docid = this.getNextDocid();
		var nowtime = date("Y-m-d H:i:s");
		A_sql.push(this.makeInsertDocumentTb(H_sess, docid, nowtime));
		A_sql += this.makeInsertDocumentLineTb(H_sess.SELF.upload.up_file, docid, H_sess.SELF.post.use_header == 1 ? true : false, nowtime);
		return A_sql;
	}

	execDB(A_sql) //トランザクションの開始
	//更新ＳＱＬ実行
	//失敗
	{
		var cnt = 0;
		var error = false;
		this.get_DB().beginTransaction();

		for (var sql of Object.values(A_sql)) //delete以外のSQLで、レコードが余分にupdateされてないか確認する
		{
			var tmpcnt = this.get_DB().exec(sql);

			if (strpos(sql, "delete", 0) !== 0 && tmpcnt != 1) //echo ($sql) . "<br>" . $tmpcnt;
				{
					error = true;
					break;
				}
		}

		if (error == true) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};