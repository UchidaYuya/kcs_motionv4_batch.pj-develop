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
//makeData
//DB用のマスタデータ作成
//@author web
//@since 2015/11/27
//
//@param mixed $pactid
//@param mixed $H_post
//@param mixed $date
//@access protected
//@return void
//
//
//getValidUser
//ユーザーIDの確認。有効なuseridか調べる
//@author web
//@since 2015/12/03
//
//@param mixed $pactid
//@param mixed $userid
//@access protected
//@return void
//
//
//getNextTempId
//tempidの取得
//@author web
//@since 2015/12/03
//
//@access private
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
//getCoList
//種別の取得
//@author web
//@since 2016/01/21
//
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
class AddBillMasterAddModel extends ModelBase {
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

	makeData(pactid, H_post, date) //登録日をDB用に修正
	{
		var data = Array();
		var registdate = H_post.registdate.Y + "-" + H_post.registdate.m + "-" + H_post.registdate.d;
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		data.coid = this.get_DB().dbQuote(H_post.coid, "integer", true);
		data.class1 = this.get_DB().dbQuote(H_post.class1, "text", true);
		data.class2 = this.get_DB().dbQuote(H_post.class2, "text", true);
		data.class3 = this.get_DB().dbQuote(H_post.class3, "text", true);
		data.productcode = this.get_DB().dbQuote(H_post.productcode, "text", true);
		data.productname = this.get_DB().dbQuote(H_post.productname, "text", true);
		data.spec = this.get_DB().dbQuote(H_post.spec, "text", true);
		data.cost = this.get_DB().dbQuote(H_post.cost, "integer", true);
		data.price = this.get_DB().dbQuote(H_post.price, "integer", true);
		data.registdate = this.get_DB().dbQuote(registdate, "date", true);
		data.comment = this.get_DB().dbQuote(H_post.comment, "date", true);
		data.update = this.get_DB().dbQuote(date, "timestamp", true);
		return data;
	}

	getValidUser(pactid, users) {
		var temp = users.split(",");

		for (var userid of Object.values(temp)) {
			var sql = "select userid from user_tb where " + " pactid =" + this.get_DB().dbQuote(pactid, "integer", true) + " and userid =" + this.get_DB().dbQuote(userid, "integer", true);
			var res = this.get_DB().queryOne(sql);

			if (!res) //エラー画面
				{
					this.errorOut(1, "\u5B58\u5728\u3057\u306A\u3044\u30E6\u30FC\u30B6\u30FC\u304C\u6307\u5B9A\u3055\u308C\u305F", false, "/Menu/menu.php");
				}
		}

		return temp;
	}

	getNextTempId() {
		var sql = "SELECT NEXTVAL('add_bill_temp_id_seq');";
		return this.get_db().queryOne(sql);
	}

	makeAddSQL(pactid, H_post) //戻値用バッファ
	//マスタID取得
	//更新日の作成
	//SQL用データの作成
	//マスタIdの設定
	//登録日の設定
	//SQL作成
	//useridの設定
	{
		var sql = Array();
		var tempid = this.getNextTempId();
		tempid = this.get_DB().dbQuote(tempid, "integer", true);
		var date = date("Y-m-d H:i:s");
		var data = this.makeData(pactid, H_post, date);
		data.tempid = tempid;
		data.recdate = data.update;
		var keys = Object.keys(data);
		sql.push("INSERT INTO addbill_temp_tb( " + keys.join(",") + ")VALUES(" + data.join(",") + ")");
		var users = this.getValidUser(pactid, H_post.userid);
		data = Array();
		data.tempid = tempid;
		data.recdate = this.get_DB().dbQuote(date, "timestamp", true);
		data.userid = 0;
		keys = Object.keys(data);

		for (var userid of Object.values(users)) {
			data.userid = userid;
			sql.push("INSERT INTO addbill_temp_user_tb( " + keys.join(",") + ")VALUES(" + data.join(",") + ")");
		}

		return sql;
	}

	getCoList() {
		var sql = "select coid,coname from addbill_co_tb" + " where defaultflg=true" + " and pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " ORDER BY sort";
		return this.get_DB().queryAssoc(sql);
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