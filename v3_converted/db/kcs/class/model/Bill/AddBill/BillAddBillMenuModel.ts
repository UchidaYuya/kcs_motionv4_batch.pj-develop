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
//getSearchWhere
//検索whereの作成
//@author web
//@since 2015/11/30
//
//@param mixed $search
//@access public
//@return void
//
//
//getOrderBy
//OrderByの取得を行う
//@author 伊達
//@since 2015/12/01
//
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
class AddBillMenuModel extends ModelBase {
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

	getSearchWhere(search) //種別
	{
		var temp = Array();

		if (!!search.type) {
			temp.push("type=" + this.get_DB().dbQuote(search.type, "text"));
		}

		if (!!search.class1) {
			temp.push("class1=" + this.get_DB().dbQuote(search.class1, "text"));
		}

		if (!!search.class2) {
			temp.push("class2=" + this.get_DB().dbQuote(search.class2, "text"));
		}

		if (!!search.class3) {
			temp.push("class3=" + this.get_DB().dbQuote(search.class3, "text"));
		}

		if (!!search.productcode) {
			temp.push("productcode=" + this.get_DB().dbQuote(search.productcode, "text"));
		}

		if (!!search.productname) {
			temp.push("productname=" + this.get_DB().dbQuote(search.productname, "text"));
		}

		if (!!search.spec) {
			temp.push("spec=" + this.get_DB().dbQuote("%" + search.spec + "%", "text"));
		}

		if (!!search.cost) {
			temp.push("spec=" + this.get_DB().dbQuote(search.spec, "text"));
		}

		if (!!search.price) {
			temp.push("price=" + this.get_DB().dbQuote(search.price, "integer"));
		}

		if (!!search.registdate) {
			var date = search.registdate.Y + search.registdate.m + search.registdate.d;

			if (!!date) {
				var registdate = search.registdate.Y + "-" + search.registdate.m + "-" + search.registdate.d;
				temp.push("registdate" + search.registdate_sub + this.get_DB().dbQuote(registdate, "date"));
			}
		}

		if (!!search.comment) {
			temp.push("comment like " + this.get_DB().dbQuote("%" + search.comment + "%", "text"));
		}

		var res = temp.join(" " + search.search_condition + " ");
		return res;
	}

	getOrderBy(sort) {
		var sql = "";
		var param = sort.split(",");
		var column = "";

		switch (param[0]) {
			case 0:
				column = "type";
				break;

			case 1:
				column = "class1";
				break;

			case 2:
				column = "class2";
				break;

			case 3:
				column = "class3";
				break;

			case 4:
				column = "productcode";
				break;

			case 5:
				column = "productname";
				break;

			case 6:
				column = "spec";
				break;

			case 7:
				column = "cost";
				break;

			case 8:
				column = "price";
				break;

			case 9:
				column = "registdate";
				break;

			case 10:
				column = "comment";
				break;
		}

		if (column == "") {
			return "";
		}

		sql = " order by " + column;

		if (param[1] == "d") {
			sql += " desc";
		}

		sql += ",tempid";
		return sql;
	}

	getList(pactid, offset, limit, search, sort) {
		var sql = "select * from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var search_where = this.getSearchWhere(search);

		if (!!search_where) {
			sql += " AND (" + search_where + ")";
		}

		var orderby = this.getOrderBy(sort);

		if (!!orderby) {
			sql += orderby;
		}

		if (limit > 0) {
			this.get_DB().setLimit(limit, offset - 1);
		}

		return this.get_DB().queryHash(sql);
	}

	getListCount(pactid, search) //検索用
	{
		var sql = "select count(*) from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var search_where = this.getSearchWhere(search);

		if (!!search_where) {
			sql += " AND (" + search_where + ")";
		}

		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};