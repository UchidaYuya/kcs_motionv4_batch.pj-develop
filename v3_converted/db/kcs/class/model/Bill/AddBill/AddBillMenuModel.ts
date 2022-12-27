//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("MtTableUtil.php");

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

require("MtPostUtil.php");

require("PostLinkBill.php");

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
//@author 伊達
//@since 2015/11/02
//
//@access public
//@return void
//
//
//getDateArrayToText
//[Y][m][d]をY-m-dに変換する
//@author web
//@since 2016/09/30
//
//@param mixed $date
//@access private
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
//getList
//
//@author web
//@since 2016/01/26
//
//@param mixed $pactid
//@param mixed $offset
//@param mixed $limit
//@param mixed $search
//@param mixed $sort
//@param mixed $userid
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
//getPostListAll
//配下部署の部署IDを取得する
//@author web
//@since 2016/01/07
//
//@param mixed $pactid
//@param mixed $cym
//@param mixed $postid
//@access public
//@return void
//
//
//getPostList
//配下部署の所得
//@author web
//@since 2016/02/04
//
//@param mixed $pactid
//@param mixed $cym
//@param mixed $postid
//@access public
//@return void
//
//
//getPostTree
//
//@author web
//@since 2016/01/05
//
//@param mixed $H_sess
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
//getPostBillList
//部署リストの取得
//@author web
//@since 2016/02/04
//
//@param mixed $pactid
//@param mixed $postlist
//@param mixed $current_postid
//@param mixed $coid
//@param mixed $sort
//@param mixed $offset
//@param mixed $limit
//@access public
//@return void
//
//
//getPostBillListFull
//部署請求情報の取得。ダウンロードで使う
//@author web
//@since 2016/01/31
//
//@param mixed $pactid
//@param mixed $postlist
//@param mixed $coid
//@access public
//@return void
//
//
//getPostBillListCount
//部署単位の請求情報の数を取得
//@author web
//@since 2016/01/07
//
//@param mixed $pactid
//@param mixed $cym
//@param mixed $postlist
//@access public
//@return void
//
//
//getTableNoOneYearPast
//過去一年のテーブル番号
//@author web
//@since 2016/09/30
//
//@access private
//@return void
//
//
//getAddBillColumn
//selectで取得するカラムの一覧を取得する
//@author web
//@since 2016/01/07
//
//@param mixed $pre_addbill
//@param mixed $pre_post
//@access private
//@return void
//
//
//getBillList
//明細単位
//@author web
//@since 2016/01/07
//
//@param mixed $pactid
//@param mixed $cym
//@param mixed $current_postid
//@access public
//@return void
//
//
//getBillListCount
//明細単位の数
//@author web
//@since 2016/01/07
//
//@param mixed $pactid
//@param mixed $cym
//@param mixed $current_postid
//@access public
//@return void
//
//
//checkInRecalc
//
//@author web
//@since 2016/03/17
//
//@param mixed $year
//@param mixed $month
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

	initialize(cym) {
		var O_table = new MtTableUtil();
		var m_tbname = Array();

		if (cym == "current") {
			this.m_tbno = "";
			this.m_tbname.addbill_tb = "addbill_tb";
			this.m_tbname.post_tb = "post_tb";
			this.m_tbname.post_relation_tb = "post_relation_tb";
		} else {
			var tbno = O_table.getTableNo(cym);
			this.m_tbno = tbno;
			this.m_tbname.addbill_tb = "addbill_" + tbno + "_tb";
			this.m_tbname.addbill_post_bill_tb = "addbill_post_bill_" + tbno + "_tb";
			this.m_tbname.post_tb = "post_" + tbno + "_tb";
			this.m_tbname.post_relation_tb = "post_relation_" + tbno + "_tb";
		}
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

	getDateArrayToText(date_array) {
		if (!Array.isArray(date_array)) return "";
		if (!date_array.Y) return "";
		if (!date_array.m) return "";
		if (!date_array.d) return "";
		var text = sprintf("%4d-%02d-%02d", date_array.Y, date_array.m, date_array.d);
		return this.get_DB().dbQuote(text, "date", true);
	}

	getSearchWhere(search, pre = "", usr = "", co = "", post = "") //ユーザー部署ID
	{
		var temp = Array();

		if (!!search.userpostid) {
			temp.push(" " + post + "userpostid like " + this.get_DB().dbQuote("%" + search.userpostid + "%", "text"));
		}

		if (!!search.postname) {
			temp.push(" " + post + "postname like " + this.get_DB().dbQuote("%" + search.postname + "%", "text"));
		}

		if (!!search.addbillid) {
			temp.push(" " + pre + "addbillid like " + this.get_DB().dbQuote("%" + search.addbillid + "%", "text"));
		}

		if (!!search.addbillid_sub) {
			temp.push(" " + pre + "addbillid_sub  " + search.addbillid_sub_sub + " " + this.get_DB().dbQuote(search.addbillid_sub, "integer"));
		}

		if (!!search.coname) {
			temp.push(" " + co + "coname like " + this.get_DB().dbQuote("%" + search.coname + "%", "text"));
		}

		if (!!search.class1) {
			temp.push(" " + pre + "class1 like " + this.get_DB().dbQuote("%" + search.class1 + "%", "text"));
		}

		if (!!search.class2) {
			temp.push(" " + pre + "class2 like " + this.get_DB().dbQuote("%" + search.class2 + "%", "text"));
		}

		if (!!search.class3) {
			temp.push(" " + pre + "class3 like " + this.get_DB().dbQuote("%" + search.class3 + "%", "text"));
		}

		if (!!search.productcode) {
			temp.push(" " + pre + "productcode like " + this.get_DB().dbQuote("%" + search.productcode + "%", "text"));
		}

		if (!!search.productname) {
			temp.push(" " + pre + "productname like " + this.get_DB().dbQuote("%" + search.productname + "%", "text"));
		}

		if (!!search.num) {
			temp.push(" " + pre + "num " + search.num_sub + " " + this.get_DB().dbQuote(search.num, "text"));
		}

		if (!!search.cost) {
			temp.push(" " + pre + "cost " + search.cost_sub + " " + this.get_DB().dbQuote(search.cost, "text"));
		}

		if (!!search.price) {
			temp.push(" " + pre + "price " + search.price_sub + " " + this.get_DB().dbQuote(search.price, "integer"));
		}

		var date = Array();
		var text = this.getDateArrayToText(search.acceptdate_from);

		if (text != "") {
			date.push(pre + "acceptdate >= " + text);
		}

		text = this.getDateArrayToText(search.acceptdate_to);

		if (text != "") {
			date.push(pre + "acceptdate <= " + text);
		}

		if (!!date) {
			temp.push("(" + date.join(" and ") + ")");
		}

		date = Array();
		text = this.getDateArrayToText(search.deliverydate_from);

		if (text != "") {
			date.push(pre + "deliverydate >= " + text);
		}

		text = this.getDateArrayToText(search.deliverydate_to);

		if (text != "") {
			date.push(pre + "deliverydate <= " + text);
		}

		if (!!date) {
			temp.push("(" + date.join(" and ") + ")");
		}

		if (!!search.card_name) {
			temp.push(" " + pre + "card_name like " + this.get_DB().dbQuote("%" + search.card_name + "%", "text"));
		}

		if (!!search.delivery_dest) {
			temp.push(" " + pre + "delivery_dest like " + this.get_DB().dbQuote("%" + search.delivery_dest + "%", "text"));
		}

		if (!!search.comment) {
			temp.push(" " + pre + "comment like " + this.get_DB().dbQuote("%" + search.comment + "%", "text"));
		}

		if (!!search.username) {
			temp.push(" " + usr + "username like " + this.get_DB().dbQuote("%" + search.username + "%", "text"));
		}

		var res = temp.join(" " + search.search_condition + " ");
		return res;
	}

	getList(pactid, offset, limit, search, sort, userid = undefined) //useridが指定されている場合はそのIDを取得しよう
	//検索条件を付与
	//並び替えリスト。
	//並び替え
	{
		var user_sql = "";

		if (!!userid) {
			user_sql = " AND usr.userid=" + this.get_DB().dbQuote(userid, "integer", true);
		}

		var sql_1 = "select" + " bill.addbillid" + ",bill.addbillid_sub" + ",bill.postid" + ",co.coname" + ",co.coid" + ",bill.class1" + ",bill.class2" + ",bill.class3" + ",bill.productcode" + ",bill.productname" + ",bill.num" + ",bill.price" + ",bill.cost" + ",bill.tax" + ",bill.acceptdate" + ",bill.deliverydate" + ",bill.delivery_dest" + ",bill.comment" + ",bill.confirm_flg" + ",post.userpostid" + ",post.postname" + ",usr.username" + ",bill.card_name" + " from ";
		var sql_2 = " as bill " + " join " + this.m_tbname.post_tb + " post on" + " post.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and post.postid=bill.postid" + " join user_tb usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = bill.userid" + user_sql + " join addbill_co_tb co on" + " bill.coid=co.coid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and bill.delete_flg=" + this.get_DB().dbQuote(false, "bool", true);
		var search_where = this.getSearchWhere(search, "bill.", "usr.");

		if (!!search_where) {
			sql_2 += " AND (" + search_where + ")";
		}

		if (undefined !== search.range) {
			switch (search.range) {
				case "year1":
					var nolist = this.getTableNoOneYearPast();
					var sql = sql_1 + "addbill_tb" + sql_2;

					for (var no of Object.values(nolist)) {
						sql += " union all ";
						sql += sql_1 + sprintf("addbill_%02d_tb", no) + sql_2;
					}

					break;

				case "year2":
					sql = sql_1 + "addbill_tb" + sql_2;

					for (var i = 1; i <= 24; i++) {
						sql += " union all ";
						sql += sql_1 + sprintf("addbill_%02d_tb", i) + sql_2;
					}

					break;

				default:
					sql = sql_1 + this.m_tbname.addbill_tb + sql_2;
					break;
			}
		} else //rangeの値がない時は当月扱い
			{
				sql = sql_1 + this.m_tbname.addbill_tb + sql_2;
			}

		var order_list = {
			0: "addbillid",
			1: "addbillid_sub",
			2: "userpostid",
			3: "postname",
			4: "coid",
			5: "class1",
			6: "class2",
			7: "class3",
			8: "productcode",
			9: "productname",
			10: "num",
			11: "cost",
			12: "price",
			13: "tax",
			14: "acceptdate",
			15: "deliverydate",
			16: "delivery_dest",
			17: "username",
			18: "confirm_flg",
			19: "comment",
			20: "card_name"
		};
		var order_sub_list = {
			0: "addbillid",
			1: "addbillid_sub"
		};
		sql += this.makeOrderBy(order_list, order_sub_list, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getListCount(pactid, search, userid = undefined) //useridが指定されている場合はそのIDを取得しよう
	//検索条件
	//結果を返す
	{
		var user_sql = "";

		if (!!userid) {
			user_sql = " AND usr.userid=" + this.get_DB().dbQuote(userid, "integer", true);
		}

		var sql_1 = "select count(*) as cnt " + " from ";
		var sql_2 = " as bill" + " join user_tb usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = bill.userid" + user_sql + " join addbill_co_tb co on" + " bill.coid=co.coid" + " join " + this.m_tbname.post_tb + " post on" + " post.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and post.postid=bill.postid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and bill.delete_flg=" + this.get_DB().dbQuote(false, "bool", true);
		var search_where = this.getSearchWhere(search, "bill.", "usr.");

		if (!!search_where) {
			sql_2 += " AND (" + search_where + ")";
		}

		if (undefined !== search.range) {
			switch (search.range) {
				case "year1":
					var nolist = this.getTableNoOneYearPast();
					var sql = sql_1 + "addbill_tb" + sql_2;

					for (var no of Object.values(nolist)) {
						sql += " union all ";
						sql += sql_1 + sprintf("addbill_%02d_tb", no) + sql_2;
					}

					break;

				case "year2":
					sql = sql_1 + "addbill_tb" + sql_2;

					for (var i = 1; i <= 24; i++) {
						sql += " union all ";
						sql += sql_1 + sprintf("addbill_%02d_tb", i) + sql_2;
					}

					break;

				default:
					sql = sql_1 + this.m_tbname.addbill_tb + sql_2;
					break;
			}
		} else //rangeの値がない時は当月扱い
			{
				sql = sql_1 + this.m_tbname.addbill_tb + sql_2;
			}

		sql = "select sum(cnt) from (" + sql + ") as addbill";
		return this.get_DB().queryOne(sql);
	}

	getPostListAll(pactid, cym, postid) //配下部署一覧
	{
		var O_Post = new PostModel();
		var postlist = O_Post.getChildList(pactid, postid, this.m_tbno);
		return postlist;
	}

	getPostList(pactid, cym, postid) //時部署しかない時
	{
		var sql = "select  postidchild from " + this.m_tbname.post_relation_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postidparent=" + this.get_DB().dbQuote(postid, "integer", true);
		var res = this.get_DB().queryCol(sql);

		if (!(-1 !== res.indexOf(postid))) {
			res.push(+postid);
		}

		return res;
	}

	getPostTree(cym, mode, current_postid) {
		var O_table = new MtTableUtil();
		tablename.post_tb = this.m_tbname.post_tb;
		tablename.post_relation_tb = this.m_tbname.post_relation_tb;
		var O_post = new PostLinkBill();

		if (mode === "0") {
			O_post.m_link_tail = false;
		} else {
			O_post.m_link_tail = true;
		}

		O_post.m_mode = "0";

		if (O_post.m_empty_login || O_post.m_empty_postid) {
			var post_tree = "\u90E8\u7F72\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093";
		} else {
			post_tree = O_post.getPosttreeBand(this.H_G_Sess.pactid, this.H_G_Sess.postid, current_postid, tablename.post_tb, tablename.post_relation_tb, " -> ", 1, 0);
		}

		if (strip_tags(post_tree) === "") {
			post_tree = "\u90E8\u7F72\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093";
		}

		return post_tree;
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
		O_tree.post_tb = this.m_tbname.post_tb;
		O_tree.post_relation_tb = this.m_tbname.post_relation_tb;
		H_tree.tree_str = O_tree.makeTree(postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = this.m_tbname.post_tb;
		O_xlist.post_relation_tb = this.m_tbname.post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getCoid(pactid) {
		var sql = "select coid,coname from addbill_co_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " or pactid=0" + " order by coid";
		return this.get_DB().queryAssoc(sql);
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

	getPostBillList(pactid, postlist, current_postid, coid, sort, offset, limit) //テーブル名の取得を行う
	//請求テーブル名の取得
	//検索
	//並び替え
	{
		var O_table = new MtTableUtil();
		var curpostid = this.get_DB().dbQuote(current_postid, "integer", true);
		var sql = "SELECT" + " post.userpostid" + ",post.postname" + ",post.postid" + ",bill.num" + ",bill.price" + ",bill.tax" + " FROM " + this.m_tbname.addbill_post_bill_tb + " AS bill" + " LEFT JOIN " + this.m_tbname.post_tb + " AS post ON " + " bill.pactid=post.pactid" + " and bill.postid=post.postid" + where + order;
		sql += " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND bill.postid in(" + postlist.join(",") + ")" + " AND ( (bill.postid=" + curpostid + " AND bill.flag=0 ) OR (bill.postid!=" + curpostid + " AND bill.flag=1 ))" + " AND bill.coid=" + this.get_DB().dbQuote(coid, "integer", true);
		var order_list = {
			0: "post.userpostid",
			1: "post.postname",
			2: "bill.num",
			3: "bill.price",
			4: "bill.tax"
		};
		var order_list_sub = ["post.userpostid", "post.postname"];
		sql += this.makeOrderBy(order_list, order_list_sub, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getPostBillListFull(pactid, postlist, coid, sort) //テーブル名の取得を行う
	//請求テーブル名の取得
	//並び替え
	{
		var O_table = new MtTableUtil();
		var tablename = "addbill_post_bill_" + this.m_tbno + "_tb";
		var sql = "SELECT" + " post.userpostid" + ",post.postname" + ",post.postid" + ",bill.num" + ",bill.price" + ",bill.tax" + " FROM " + this.m_tbname.addbill_post_bill_tb + " AS bill" + " LEFT JOIN " + this.m_tbname.post_tb + " AS post ON " + " bill.pactid=post.pactid" + " and bill.postid=post.postid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND bill.flag=0" + " AND bill.coid=" + this.get_DB().dbQuote(coid, "integer", true) + " AND bill.postid in (" + postlist.join(",") + ")";
		var order_list = {
			0: "post.userpostid",
			1: "post.postname",
			2: "bill.num",
			3: "bill.price",
			4: "bill.tax"
		};
		var order_list_sub = ["post.userpostid", "post.postname"];
		sql += this.makeOrderBy(order_list, order_list_sub, sort);
		var data = this.get_DB().queryHash(sql);
		return data;
	}

	getPostBillListCount(pactid, postlist, current_postid, coid) {
		var curpostid = this.get_DB().dbQuote(current_postid, "integer", true);
		var where = " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid in(" + postlist.join(",") + ")" + " AND ( (postid=" + curpostid + " AND flag=0 ) OR (postid!=" + curpostid + " AND flag=1 ))" + " AND coid=" + this.get_DB().dbQuote(coid, "integer", true);
		var sql = "select count(*) from " + this.m_tbname.addbill_post_bill_tb + where;
		return this.get_DB().queryOne(sql);
	}

	getPostBill(pactid, current_postid, coid, flag) {
		var sql = "select cnt,num,price,tax from " + this.m_tbname.addbill_post_bill_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid=" + this.get_DB().dbQuote(current_postid, "integer", true) + " AND coid=" + this.get_DB().dbQuote(coid, "integer", true) + " AND flag=" + this.get_DB().dbQuote(flag, "integer", true) + " limit 1";
		return this.get_DB().queryRowHash(sql);
	}

	getTableNoOneYearPast() {
		var O_table = new MtTableUtil();
		var res = Array();
		var year = date("Y") - 1;
		var month = date("n");

		for (var i = 0; i < 12; i++) {
			month++;

			if (month > 12) {
				year++;
				month -= 12;
			}

			var ym = sprintf("%04d%02d", year, month);
			res.push(O_table.getTableNo(ym));
		}

		return res;
	}

	getAddBillColumn(pre_addbill, pre_post, pre_usr, pre_co) {
		var res = [pre_addbill + "addbillid", pre_addbill + "addbillid_sub", pre_post + "userpostid", pre_post + "postname", pre_addbill + "coid", pre_co + "coname", pre_addbill + "class1", pre_addbill + "class2", pre_addbill + "class3", pre_addbill + "productcode", pre_addbill + "productname", pre_addbill + "num", pre_addbill + "cost", pre_addbill + "price", pre_addbill + "tax", pre_addbill + "deliverydate", pre_addbill + "delivery_dest", pre_addbill + "acceptdate", pre_usr + "username", pre_addbill + "comment", pre_addbill + "card_name"];
		return res;
	}

	getBillList(pactid, cym, current_postid, coid, sort, search, limit = 0, offset = 1, post_under = true) //テーブル名の設定
	//カラム一覧の取得
	//取得する部署の一覧を取得する
	//並び替えリスト。
	//並び替え
	//オフセットと上限
	{
		if (cym == "current") {
			var postname = "post_tb";
			var tablename = "addbill_tb";
		} else {
			postname = "post_" + this.m_tbno + "_tb";
			tablename = "addbill_" + this.m_tbno + "_tb";
		}

		var column = this.getAddBillColumn("bill.", "post.", "usr.", "co.");

		if (post_under) {
			var postlist = this.getPostListAll(pactid, cym, current_postid);
		} else {
			postlist = [current_postid];
		}

		if (!postlist) {
			return Array();
		}

		var sql_1 = "select " + column.join(",") + " from ";
		var sql_2 = " as bill" + " join " + postname + " post on" + " post.postid=bill.postid" + " left join user_tb usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = bill.userid" + " join addbill_co_tb co on" + " co.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and co.coid =bill.coid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and bill.postid in(" + postlist.join(",") + ")" + " and bill.delete_flg = false";

		if (coid != 0) {
			sql_2 += " and bill.coid=" + this.get_DB().dbQuote(coid, "integer", true);
		}

		var sql_search = this.getSearchWhere(search, "bill.", "usr.");

		if (sql_search != "") {
			sql_2 += " and " + sql_search;
		}

		if (undefined !== search.range) {
			switch (search.range) {
				case "year1":
					var nolist = this.getTableNoOneYearPast();
					var sql = "";

					for (var no of Object.values(nolist)) {
						if (sql != "") {
							sql += " union all ";
						}

						sql += sql_1 + sprintf("addbill_%02d_tb", no) + sql_2;
					}

					break;

				case "year2":
					sql = "";

					for (var i = 1; i <= 24; i++) {
						if (sql != "") {
							sql += " union all ";
						}

						sql += sql_1 + sprintf("addbill_%02d_tb", i) + sql_2;
					}

					break;

				default:
					sql = sql_1 + tablename + sql_2;
					break;
			}
		} else //rangeの値がない時は当月扱い
			{
				sql = sql_1 + tablename + sql_2;
			}

		var order_list = {
			0: "addbillid",
			1: "addbillid_sub",
			2: "userpostid",
			3: "postname",
			4: "coid",
			5: "class1",
			6: "class2",
			7: "class3",
			8: "productcode",
			9: "productname",
			10: "num",
			11: "cost",
			12: "price",
			13: "tax",
			14: "acceptdate",
			15: "deliverydate",
			16: "delivery_dest",
			17: "username",
			19: "comment",
			20: "card_name"
		};
		var order_sub_list = {
			0: "addbillid",
			1: "addbillid_sub"
		};
		sql += this.makeOrderBy(order_list, order_sub_list, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getBillListCount(pactid, cym, current_postid, coid = 0, search = Array()) //取得する部署の一覧を取得する
	//合計値を算出するSQL
	{
		var O_table = new MtTableUtil();
		var tbno = O_table.getTableNo(cym);
		var postname = "post_" + tbno + "_tb";
		var tablename = "addbill_" + tbno + "_tb";
		var postlist = this.getPostListAll(pactid, cym, current_postid);

		if (!postlist) {
			return 0;
		}

		var sql_1 = "select count(*) as cnt " + " from ";
		var sql_2 = " as bill" + " join " + postname + " post on post.postid=bill.postid" + " left join user_tb usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = bill.userid" + " join addbill_co_tb co on" + " bill.coid=co.coid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and bill.postid in(" + postlist.join(",") + ")";

		if (coid != 0) {
			sql_2 += " and bill.coid=" + this.get_DB().dbQuote(coid, "integer", true);
		}

		var sql_search = this.getSearchWhere(search, "bill.", "usr.");

		if (sql_search != "") {
			sql_2 += " and " + sql_search;
		}

		if (undefined !== search.range) {
			switch (search.range) {
				case "year1":
					var nolist = this.getTableNoOneYearPast();
					var sql = "";

					for (var no of Object.values(nolist)) {
						if (sql != "") {
							sql += " union all ";
						}

						sql += sql_1 + sprintf("addbill_%02d_tb", no) + sql_2;
					}

					break;

				case "year2":
					sql = "";

					for (var i = 1; i <= 24; i++) {
						if (sql != "") {
							sql += " union all ";
						}

						sql += sql_1 + sprintf("addbill_%02d_tb", i) + sql_2;
					}

					break;

				default:
					sql = sql_1 + tablename + sql_2;
					break;
			}
		} else //rangeの値がない時は当月扱い
			{
				sql = sql_1 + tablename + sql_2;
			}

		sql = "select sum(cnt) from (" + sql + ") as addbill";
		return this.get_DB().queryOne(sql);
	}

	checkInRecalc(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from addbill_bill_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};