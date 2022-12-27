//
//AddBillDelModel
//請求削除
//@uses ModelBase
//@package
//@author date
//@since 2015/12/21
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

require("model/Bill/AddBill/AddBillAddModel.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

//makeSQLで対象になったaddbillidをここに保存する(Modでは使ってないけどCopyで使ってる)
//
//__construct
//コンストラクタ
//@author date
//@since 2015/12/21
//
//@param mixed $O_db0
//@param mixed $H_g_sess
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
//getTargetId
//
//@author web
//@since 2016/10/04
//
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
class AddBillModBulkModel extends AddBillAddModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
		this.sql_addbillid = Array();
	}

	getOrderBy(sort) //switch( (int)$param[0] ){
	//		case 0:		$column = "bill.addbillid";		break;
	//		case 1: 	$column = "bill.addbillid_sub";	break;
	//		case 2: 	$column = "post.userpostid";	break;
	//		case 3:		$column = "post.postname";		break;
	//		case 4:		$column = "co.coid"; 			break;
	//		case 5:		$column = "bill.class1";		break;
	//		case 6:		$column = "bill.class2";		break;
	//		case 7:		$column = "bill.class3";		break;
	//		case 8:		$column = "bill.productcode";	break;
	//		case 9:		$column = "bill.productname";	break;
	//		case 10:	$column = "bill.num";			break;
	//		case 11:	$column = "bill.cost";			break;
	//		case 12:	$column = "bill.price";			break;
	//		case 13:	$column = "bill.tax";			break;
	//		case 14:	$column = "bill.acceptdate";	break;
	//		case 15:	$column = "bill.deliverydate";	break;
	//		case 16:	$column = "bill.delivery_dest";	break;
	//		case 17:	$column = "usr.username";		break;
	//		case 18:	$column = "bill.confirm_flg";	break;
	//		case 19:	$column = "bill.comment";		break;
	//		case 20:	$column = "bill.card_name";		break;
	//		}
	{
		var sql = "";
		var param = sort.split(",");
		var column = "";

		switch (+param[0]) {
			case 0:
				column = "addbillid";
				break;

			case 1:
				column = "addbillid_sub";
				break;

			case 2:
				column = "userpostid";
				break;

			case 3:
				column = "postname";
				break;

			case 4:
				column = "coid";
				break;

			case 5:
				column = "class1";
				break;

			case 6:
				column = "class2";
				break;

			case 7:
				column = "class3";
				break;

			case 8:
				column = "productcode";
				break;

			case 9:
				column = "productname";
				break;

			case 10:
				column = "num";
				break;

			case 11:
				column = "cost";
				break;

			case 12:
				column = "price";
				break;

			case 13:
				column = "tax";
				break;

			case 14:
				column = "acceptdate";
				break;

			case 15:
				column = "deliverydate";
				break;

			case 16:
				column = "delivery_dest";
				break;

			case 17:
				column = "username";
				break;

			case 18:
				column = "confirm_flg";
				break;

			case 19:
				column = "comment";
				break;

			case 20:
				column = "card_name";
				break;
		}

		if (column == "") {
			return "";
		}

		sql = " order by " + column;

		if (param[1] == "d") {
			sql += " desc";
		}

		if (column != "addbillid_sub") {
			sql += ",addbillid_sub";
		}

		return sql;
	}

	getList(pactid, delid, sort, tb_all_flag = false) //対象のIDのwhereを作成
	//全て対象なら・・・
	{
		var where = "";

		for (var value of Object.values(delid)) {
			var id = value.split(":");

			if (where != "") {
				where += "or";
			}

			where += " (bill.addbillid=" + this.get_DB().dbQuote(id[0], "text", true) + " and bill.addbillid_sub=" + this.get_DB().dbQuote(id[1], "integer", true) + ") ";
		}

		var sql_1 = "select" + " bill.addbillid" + ",bill.addbillid_sub" + ",bill.postid" + ",co.coid" + ",bill.class1" + ",bill.class2" + ",bill.class3" + ",bill.tempid as productcode" + ",bill.tempid as productname" + ",bill.num" + ",bill.unit_price" + ",bill.unit_cost" + ",bill.price" + ",bill.cost" + ",bill.tax" + ",bill.acceptdate" + ",bill.deliverydate" + ",bill.delivery_dest" + ",bill.comment" + ",bill.tempid" + ",post.userpostid" + ",post.postname" + ",usr.username" + ",bill.card_name" + " from ";
		var sql_2 = " as bill" + " join post_tb post on" + " post.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and post.postid=bill.postid" + " join user_tb usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = bill.userid" + " join addbill_co_tb co on" + " bill.coid=co.coid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and bill.delete_flg=false" + " and (" + where + ")";
		var sql = sql_1 + "addbill_tb" + sql_2;

		if (tb_all_flag) {
			for (var i = 1; i <= 24; i++) {
				sql += " union all " + sql_1 + sprintf("addbill_%02d_tb", i) + sql_2;
			}
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

	makeSqlData(pactid, post, excise_tax) //一応、最新のマスタを取得して、その値を設定する
	//部署が存在するかのチェックを行っておく
	//受付日
	//納品日
	{
		var res = Array();
		var sql = "select" + " class1" + ",class2" + ",class3" + ",cost" + ",price" + ",productcode" + ",productname" + " from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid=" + this.get_DB().dbQuote(post.productcode, "integer", true);
		var temp_data = this.get_DB().queryRowHash(sql);
		sql = "select postid from post_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(post.postid, "integer", true);
		var check = this.get_DB().queryOne(sql);

		if (is_null(check)) {
			this.errorOut(1, "\u90E8\u7F72SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
		}

		var cost = post.unit_cost * post.num;
		var price = post.unit_price * post.num;
		var tax = +Math.round(price * excise_tax);
		res.coid = this.get_DB().dbQuote(post.coid, "integer", true);
		res.class1 = this.get_DB().dbQuote(temp_data.class1, "text", true);
		res.class2 = this.get_DB().dbQuote(temp_data.class2, "text", true);
		res.class3 = this.get_DB().dbQuote(temp_data.class3, "text", true);
		res.productcode = this.get_DB().dbQuote(temp_data.productcode, "text", true);
		res.productname = this.get_DB().dbQuote(temp_data.productname, "text", true);
		res.num = this.get_DB().dbQuote(post.num, "integer", true);
		res.delivery_dest = this.get_DB().dbQuote(post.delivery_dest, "text", true);
		res.comment = this.get_DB().dbQuote(post.comment, "text", true);
		res.unit_cost = this.get_DB().dbQuote(post.unit_cost, "integer", true);
		res.unit_price = this.get_DB().dbQuote(post.unit_price, "integer", true);
		res.cost = this.get_DB().dbQuote(cost, "integer", true);
		res.price = this.get_DB().dbQuote(price, "integer", true);
		res.tax = this.get_DB().dbQuote(tax, "integer", true);
		res.tempid = this.get_DB().dbQuote(post.productcode, "integer", true);
		res.card_name = this.get_DB().dbQuote(post.card_name, "text", true);
		res.postid = this.get_DB().dbQuote(post.postid, "integer", true);
		var date = post.acceptdate.Y + "-" + post.acceptdate.m + "-" + post.acceptdate.d;
		res.acceptdate = this.get_DB().dbQuote(date, "date", true);
		date = post.deliverydate.Y + "-" + post.deliverydate.m + "-" + post.deliverydate.d;
		res.deliverydate = this.get_DB().dbQuote(date, "date", true);
		return res;
	}

	makeSQL(pactid, post, excise_tax) //戻値用
	{
		var res = Array();
		this.sql_addbillid = Array();
		{
			let _tmp_0 = post.bill;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				var addbillid = this.getNextId(pactid);
				var id = key.split(":");
				var data = Array();
				data = this.makeSqlData(pactid, value, excise_tax);
				res.push("UPDATE addbill_tb set" + " coid=" + data.coid + ",tempid=" + data.tempid + ",class1=" + data.class1 + ",class2=" + data.class2 + ",class3=" + data.class3 + ",productcode=" + data.productcode + ",productname=" + data.productname + ",num=" + data.num + ",comment=" + data.comment + ",delivery_dest=" + data.delivery_dest + ",unit_cost=" + data.unit_cost + ",unit_price=" + data.unit_price + ",cost=" + data.cost + ",price=" + data.price + ",tax=" + data.tax + ",card_name=" + data.card_name + ",postid=" + data.postid + ",acceptdate=" + data.acceptdate + ",deliverydate=" + data.deliverydate + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(id[0], "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(id[1], "integer", true));
				this.sql_addbillid.push({
					addbillid: id[0],
					addbillid_sub: id[1]
				});
			}
		}
		return res;
	}

	getIdOfSqlTarget() {
		return this.sql_addbillid;
	}

	getTreeJS(pactid, postid, current_postid) //$H_tree["tree_str"] = $O_tree->makeTree( $postid );
	//追加請求用に新しく作りもうした
	{
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
		H_tree.tree_str = O_tree.makeTreeForAddBillModBulk(postid);
		var O_xlist = new ListAJAX();
		O_xlist.type = "addbill_set_post";
		O_xlist.post_tb = "post_tb";
		O_xlist.post_relation_tb = "post_relation_tb";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
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