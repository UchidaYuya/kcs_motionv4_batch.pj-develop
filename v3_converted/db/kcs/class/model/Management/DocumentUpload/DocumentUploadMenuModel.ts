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
//getListCount
//件数を取得する
//@author web
//@since 2015/11/30
//
//@param mixed $pactid
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
class DocumentUploadMenuModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
		this.nowtime = date("Y-m-d");
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

	makeOrderBySQL(order_list, order_sub_list, sort) //columnが空の場合は何もしない
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

	getList(pactid, offset, limit, sort, userid = undefined) {
		var sql = "select" + " doc.recdate,doc.docid,doc.title,doc.comment,doc.enddate,doc.use_header,post.userpostid" + " from document_tb as doc" + " left join post_tb  post on post.postid = doc.postid and post.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " where " + " doc.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and doc.enddate >= " + this.get_DB().dbQuote(this.nowtime, "date", true);

		if (!!userid) {
			sql += " and doc.userid = " + this.get_DB().dbQuote(userid, "integer");
		}

		var order_list = ["recdate", "title", "comment", "enddate"];
		var order_sub_list = ["recdate"];
		sql += this.makeOrderBySQL(order_list, order_sub_list, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getListCount(pactid, userid = undefined) {
		var sql = "select count(*) from document_tb as doc" + " where" + " doc.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and doc.enddate >= " + this.get_DB().dbQuote(this.nowtime, "date", true);

		if (!!userid) {
			sql += " and doc.userid = " + this.get_DB().dbQuote(userid, "integer");
		}

		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};