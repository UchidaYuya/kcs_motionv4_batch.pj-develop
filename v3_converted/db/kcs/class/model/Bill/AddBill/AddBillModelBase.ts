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
//getNextId
//tempidの取得
//@author web
//@since 2015/12/03
//
//@access private
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
class AddBillModelBase extends ModelBase {
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

	getNextId(pactid) //IDの作成
	//IDが99999を超えるのであればエラー
	{
		var today = date("Ymd");
		var sql = "select addbillid from addbill_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid like '" + today + "%'" + " order by addbillid desc";
		var res = this.get_DB().queryOne(sql);

		if (!res) {
			var id = 1;
		} else {
			id = res.substr(9, 5) + 1;
		}

		if (id >= 99999) {
			this.errorOut(1, "\u53D7\u4ED8\u756A\u53F7\u306E\u4E0A\u9650\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
		}

		return today + "-" + sprintf("%05d", id);
	}

	getNextIdSub(pactid, id) //現在のsubidを取得
	//subidの作成
	//上限は999にしよう
	{
		var sql = "select addbillid_sub from addbill_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(id, "text", true) + " order by addbillid_sub desc";
		var id_sub = this.get_DB().queryOne(sql);

		if (!id_sub) {
			id_sub = 1;
		} else {
			id_sub++;
		}

		if (id_sub >= 999) {
			this.errorOut(1, "\u660E\u7D30\u756A\u53F7\u306E\u4E0A\u9650\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
		}

		return id_sub;
	}

	makeData(pactid, postid, userid, H_post, tempid, productcode, productname, date) //登録日をDB用に修正
	{
		var data = Array();
		var acceptdate = H_post.acceptdate.Y + "-" + H_post.acceptdate.m + "-" + H_post.acceptdate.d;
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		data.postid = this.get_DB().dbQuote(postid, "integer", true);
		data.tempid = this.get_DB().dbQuote(tempid, "integer", true);
		data.select_tempid = this.get_DB().dbQuote(global[H_post].select_tempid, "integer", false);
		data.userid = this.get_DB().dbQuote(userid, "integer", true);
		data.type = this.get_DB().dbQuote(H_post.type, "text", true);
		data.class1 = this.get_DB().dbQuote(H_post.class1, "text", true);
		data.class2 = this.get_DB().dbQuote(H_post.class2, "text", true);
		data.class3 = this.get_DB().dbQuote(H_post.class3, "text", true);
		data.productcode = this.get_DB().dbQuote(productcode, "text", true);
		data.productname = this.get_DB().dbQuote(productname, "text", true);
		data.num = this.get_DB().dbQuote(H_post.num, "integer", true);
		data.cost = this.get_DB().dbQuote(H_post.cost, "integer", true);
		data.price = this.get_DB().dbQuote(H_post.price, "integer", true);
		data.tax = 0;
		data.acceptdate = this.get_DB().dbQuote(acceptdate, "date", true);
		data.comment = this.get_DB().dbQuote(H_post.comment, "date", true);
		data.update = this.get_DB().dbQuote(date, "timestamp", true);
		data.delete_flg = this.get_DB().dbQuote(false, "bool", true);
		data.dummy_flg = this.get_DB().dbQuote(false, "bool", true);
		return data;
	}

	getTreeJS(pactid, postid, current_postid) {
		var H_tree = Array();
		var tb_no = "";
		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		var sql = "select userpostid,postname from post_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(current_postid, "integer", true);
		var post = this.get_DB().queryRowHash(sql);
		H_tree.userpostid = post.userpostid;
		H_tree.post_name = post.postname;
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

	getTempList(pactid, userid) {
		var sql = "select temp.tempid,temp.productname from addbill_temp_user_tb as usr" + " join addbill_temp_tb temp on" + " usr.tempid = temp.tempid" + " and pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " where" + " userid=" + this.get_DB().dbQuote(userid, "integer", true);
		var data = this.get_DB().queryAssoc(sql);
		return data;
	}

	getTempData(pactid, tempid) {
		var sql = "select * from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid=" + this.get_DB().dbQuote(tempid, "integer", true);
		var data = this.get_DB().queryRowHash(sql);
		return data;
	}

	getTempClass1(pactid, tempid: {} | any[], coid) {
		if (!tempid) {
			return Array();
		}

		var sql = "select class1 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and coid=" + this.getDB().dbQuote(coid, "integer", true) + " group by class1" + " order by class1";
		return this.get_DB().queryCol(sql);
	}

	getTempClass2(pactid, tempid: {} | any[], coid, class1) {
		if (!tempid || !class1) {
			return Array();
		}

		var sql = "select class2 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and coid=" + this.getDB().dbQuote(coid, "integer", true) + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " group by class2" + " order by class2";
		return this.get_DB().queryCol(sql);
	}

	getTempClass3(pactid, tempid: {} | any[], coid, class1, class2) {
		if (!tempid || !class1 || !class2) {
			return Array();
		}

		var sql = "select class3 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and coid=" + this.getDB().dbQuote(coid, "integer", true) + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " group by class3" + " order by class3";
		return this.get_DB().queryCol(sql);
	}

	getTempProductCode(pactid, tempid: {} | any[], coid, class1, class2, class3) {
		if (!tempid || !class1 || !class2 || !class3) {
			return Array();
		}

		var sql = "select tempid,productcode from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and coid=" + this.getDB().dbQuote(coid, "integer", true) + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " and class3 = " + this.get_DB().dbQuote(class3, "text", true) + " group by tempid,productcode" + " order by productcode";
		return this.get_DB().queryAssoc(sql);
	}

	getTempProductName(pactid, tempid: {} | any[], coid, class1, class2, class3) {
		if (!tempid || !class1 || !class2 || !class3) {
			return Array();
		}

		var sql = "select tempid,productname from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and coid=" + this.getDB().dbQuote(coid, "integer", true) + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " and class3 = " + this.get_DB().dbQuote(class3, "text", true) + " group by tempid,productname" + " order by productname";
		return this.get_DB().queryAssoc(sql);
	}

	getTempCostAndPrice(pactid, tempid) {
		if (!tempid) {
			return Array();
		}

		var sql = "select cost,price from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid = " + this.get_DB().dbQuote(tempid, "integer", true);
		return this.get_DB().queryRowHash(sql);
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