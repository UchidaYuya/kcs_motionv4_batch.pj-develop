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
//makeAddSQL
//SQL作成ぽよ
//@author web
//@since 2015/11/27
//
//@param mixed $pactid
//@param mixed $H_post
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
class AddBillMasterDelModel extends ModelBase {
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

	getOrderBy(sort, pre_temp) {
		var sql = "";
		var param = sort.split(",");
		var column = "";

		switch (param[0]) {
			case 0:
				column = "coid";
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

		sql = " order by " + pre_temp + column;

		if (param[1] == "d") {
			sql += " desc";
		}

		sql += "," + pre_temp + "tempid";
		return sql;
	}

	getList(pactid, delid, sort) {
		var sql = "select" + " co.coname" + ",temp.class1" + ",temp.class2" + ",temp.class3" + ",temp.productcode" + ",temp.productname" + ",temp.spec" + ",temp.cost" + ",temp.price" + ",temp.registdate" + ",temp.comment" + "  from addbill_temp_tb as temp" + " join addbill_co_tb co on co.coid = temp.coid" + " where" + " temp.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and temp.tempid in (" + delid.join(",") + ")";
		var orderby = this.getOrderBy(sort, "temp.");

		if (!!orderby) {
			sql += orderby;
		}

		return this.get_DB().queryHash(sql);
	}

	makeDelSQL(pactid, delid) //念のため有効なIDか確認をする
	//戻値用
	//ユーザー設定の削除
	//SQL作成
	{
		var sql = "select tempid from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in (" + delid.join(",") + ")";
		delid = this.get_DB().queryCol(sql);
		sql = Array();
		sql.push("delete from addbill_temp_user_tb" + " where" + " tempid in (" + delid.join(",") + ")");
		sql.push("delete from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in (" + delid.join(",") + ")");
		return sql;
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