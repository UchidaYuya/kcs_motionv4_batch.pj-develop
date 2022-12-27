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
//getNextDocid
//
//@author web
//@since 2016/02/15
//
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
//getList
//ファイルアップロードの一覧を取得
//@author web
//@since 2018/05/10
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFileInfo
//
//@author web
//@since 2018/05/11
//
//@param mixed $pactid
//@param mixed $id
//@access public
//@return void
//
//
//deleteFile
//
//@author web
//@since 2018/05/11
//
//@param string $H_g_sess
//@param string $_GET
//@param mixed $O_model
//@param mixed $O_view
//@access public
//@return void
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
class FileUploadMenuModel extends ModelBase {
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

	getNextId() {
		var sql = "SELECT NEXTVAL('file_upload_id_seq');";
		return this.get_db().queryOne(sql);
	}

	makeAddSQL(pactid, postid, userid, username, dataname, filename) //$temp["postid"]		= $this->get_DB()->dbQuote( $postid,"integer",true );
	{
		var A_sql = Array();
		var id = this.getNextId();
		var nowdate = date("Y-m-d H:i:s");
		var temp = Array();
		temp.id = this.get_DB().dbQuote(id, "integer", true);
		temp.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		temp.userid = this.get_DB().dbQuote(userid, "integer", true);
		temp.username = this.get_DB().dbQuote(username, "text", true);
		temp.dataname = this.get_DB().dbQuote(dataname, "text", true);
		temp.filename = this.get_DB().dbQuote(filename, "text", true);
		temp.recdate = this.get_DB().dbQuote(nowdate, "timestamp", true);
		var keys = Object.keys(temp);
		A_sql.push("INSERT INTO file_upload_tb (" + keys.join(",") + ")VALUES(" + temp.join(",") + ")");
		return A_sql;
	}

	getList(pactid, offset, limit) {
		var sql = "SELECT" + " file.id" + ",file.recdate" + ",CASE WHEN usr.userid is null" + " THEN file.username" + " ELSE usr.username" + " END AS username" + ",file.filename" + ",count(*) over() AS full_count" + " FROM file_upload_tb AS file" + " LEFT JOIN user_tb usr ON" + " usr.pactid = file.pactid" + " AND usr.userid = file.userid" + " WHERE" + " file.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " ORDER BY file.id desc";
		this.get_DB().setLimit(limit, (offset - 1) * limit);
		return this.get_DB().queryHash(sql);
	}

	getFileInfo(pactid, id) {
		var sql = "SELECT * FROM file_upload_tb" + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND id=" + this.get_DB().dbQuote(id, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	deleteFile(pactid, id) //ファイル情報取得
	//ファイル存在チェック
	//DBから削除
	{
		var info = this.getFileInfo(pactid, id);

		if (!info) {
			return "\u6307\u5B9A\u3055\u308C\u305FID\u304C\u7121\u52B9\u3067\u3059";
		}

		var filepath = "/kcs/files/FileUpload/" + pactid + "/" + info.dataname;

		if (file_exists(filepath)) {
			if (!unlink(filepath)) {
				return "\u30D5\u30A1\u30A4\u30EB\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
			}
		} else {
			return "\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093";
		}

		var sql = Array();
		sql.push("DELETE FROM file_upload_tb" + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND id=" + this.get_DB().dbQuote(id, "integer", true));

		if (this.execDB(sql)) {
			return true;
		}

		return "\u524A\u9664\u5931\u6557";
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