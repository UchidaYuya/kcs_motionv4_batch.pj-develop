//
//DocumentUploadDelModel
//
//@uses ModelBase
//@package
//@author web
//@since 2016/02/15
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
//makeOrderBy
//オーダー句の作成
//@author web
//@since 2016/02/04
//
//@param mixed $order_list
//@param mixed $order_list_sub
//@param mixed $sort
//@access protected
//@return void
//
//
//getList
//マスタ一覧の取得
//@author web
//@since 2015/11/30
//
//@param mixed $pactid
//@param mixed $offset
//@param mixed $limit
//@param mixed $search
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
class DocumentUploadDelModel extends ModelBase {
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

	makeOrderBy(order_list, order_sub_list, sort) //columnが空の場合は何もしない
	//降順？
	{
		var sql = "";
		var param = sort.split(",");
		var column = order_list[+param[0]];

		if (!column) {
			return "";
		}

		sql = " order by " + column;

		if (param[1] == "d") {
			sql += " desc";
		}

		for (var key in order_sub_list) {
			var value = order_sub_list[key];

			if (value != column) {
				sql += "," + value;
			}
		}

		return sql;
	}

	getList(pactid, userid, delid, sort) {
		var sql = "select" + " recdate" + ",title" + ",comment" + ",enddate" + " from document_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and docid in (" + delid.join(",") + ")";

		if (!!userid) {
			sql += " and userid=" + this.get_DB().dbQuote(userid, "integer", true);
		}

		var order_list = ["recdate", "title", "comment", "enddate"];
		var order_sub_list = ["recdate"];
		var orderby = this.makeOrderBy(order_list, order_sub_list, sort);

		if (!!orderby) {
			sql += orderby;
		}

		return this.get_DB().queryHash(sql);
	}

	makeDelSQL(pactid, userid, del_list: {} | any[]) {
		var A_sql = Array();

		for (var docid of Object.values(del_list)) //document_line_tbの削除
		//document_tbの削除
		//管理記録はいらないみたい
		//array_push( $A_sql, $this->makeTranDelLogSQL( $A_data[$cnt], $H_post, $cym ) );
		{
			var sql = "select lineno from document_line_tb where" + " docid=" + this.get_db().dbQuote(docid, "integer", true);
			var lineno_list = this.get_db().queryCol(sql);

			for (var no of Object.values(lineno_list)) {
				A_sql.push("delete from document_line_tb where" + " docid=" + this.get_db().dbQuote(docid, "integer", true) + " and lineno=" + this.get_db().dbQuote(no, "integer", true));
			}

			sql = "delete from document_tb where" + " pactid=" + this.get_db().dbQuote(pactid, "integer", true) + " and docid=" + this.get_db().dbQuote(docid, "integer", true);

			if (!!userid) {
				sql += " and userid=" + this.get_DB().dbQuote(userid, "integer", true);
			}

			A_sql.push(sql);
		}

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