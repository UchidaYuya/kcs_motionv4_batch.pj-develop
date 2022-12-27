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

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

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
//GetOrderBy
//
//@author web
//@since 2016/01/25
//
//@param mixed $sort
//@access public
//@return void
//
//
//getUserList
//ユーザー一覧の取得
//@author web
//@since 2015/12/02
//
//@access public
//@return void
//
//
//getUserCnt
//対象のユーザー数を取得する
//@author date
//@since 2015/12/02
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $posttarget
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
//getTreeJS
//部署ツリーの作成
//@author web
//@since 2015/12/15
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $current_postid
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
class AddBillMasterUserModel extends ModelBase {
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

	getOrderBy(sort) {
		var data = sort.split(",");
		var column = "";

		switch (data[0]) {
			case "0":
				column = "loginid";
				break;

			case "1":
				column = "username";
				break;
		}

		var res = " order by " + column;

		if (data[1] == "d") {
			res += " desc";
		}

		res += ",postid";
		return res;
	}

	getUserList(pactid, postid, posttarget, offset, limit, sort) //配下の部署ID取得
	//オフセットとリミットの設定
	{
		if (posttarget == 0) {
			var A_post = [postid];
		} else {
			var O_post = new PostModel();
			A_post = O_post.getChildList(pactid, postid);
		}

		var order = this.getOrderBy(sort);
		var sql = "select username,loginid,userid,postid from user_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid in ( " + A_post.join(",") + ")" + order;

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getUserCnt(pactid, postid, posttarget) //配下の部署ID取得
	{
		if (posttarget == 0) {
			var A_post = [postid];
		} else {
			var O_post = new PostModel();
			A_post = O_post.getChildList(pactid, postid);
		}

		var sql = "select count(*) from user_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid in ( " + A_post.join(",") + ")";
		return this.get_DB().queryOne(sql);
	}

	makeData(pactid, H_post, date) //登録日をDB用に修正
	{
		var data = Array();
		var registdate = H_post.registdate.Y + "-" + H_post.registdate.m + "-" + H_post.registdate.d;
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		data.type = this.get_DB().dbQuote(H_post.type, "text", true);
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

	makeAddSQL(pactid, H_post) //戻値用バッファ
	//更新日の作成
	//SQL用データの作成
	//登録日の設定
	//SQL作成
	{
		var sql = Array();
		var date = date("Y-m-d H:i:s");
		var data = this.makeData(pactid, H_post, date);
		data.recdate = data.update;
		var keys = Object.keys(data);
		sql.push("INSERT INTO addbill_temp_tb( " + keys.join(",") + ")VALUES(" + data.join(",") + ")");
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

	getTreeJS(pactid, postid, current_postid) {
		var H_tree = Array();
		var tb_no = "";
		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		H_tree.post_name = O_post.getPostTreeBand(pactid, postid, current_postid, tb_no, " -> ", "", 1, false);
		var O_tree = new TreeAJAX();
		O_tree.post_tb = "post_tb";
		O_tree.post_relation_tb = "post_relation_tb";
		H_tree.tree_str = O_tree.makeTree(postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = "post_tb";
		O_xlist.post_relation_tb = "post_relation_tb";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	__destruct() {
		super.__destruct();
	}

};