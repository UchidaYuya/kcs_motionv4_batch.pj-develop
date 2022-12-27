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
//H_define_ini
//define.iniの取得
//@var mixed
//@access private
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
//addbillidの取得
//@author web
//@since 2015/12/03
//
//@access private
//@return void
//
//
//getNextIdSub
//addbillid_subの取得
//@author web
//@since 2016/02/03
//
//@param mixed $pactid
//@param mixed $id
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
//getCoList
//種別の取得
//@author web
//@since 2016/01/21
//
//@access public
//@return void
//
//
//getAddBillData
//データ取得
//@author web
//@since 2015/12/04
//
//@param mixed $pactid
//@param mixed $tempid
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
class AddBillAddModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
		this.H_define_ini = parse_ini_file(KCS_DIR + "/conf_sync/define.ini", true);
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

	makeData(pactid, postid, userid, H_post, tempid, productcode, productname, date, card_name) //登録日をDB用に修正
	{
		var data = Array();
		var acceptdate = H_post.acceptdate.Y + "-" + H_post.acceptdate.m + "-" + H_post.acceptdate.d;
		var deliverydate = H_post.deliverydate.Y + "-" + H_post.deliverydate.m + "-" + H_post.deliverydate.d;
		var cost = H_post.unit_cost * H_post.num;
		var price = H_post.unit_price * H_post.num;
		var tax = +Math.round(price * this.H_define_ini.Other.excise_tax);
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		data.postid = this.get_DB().dbQuote(postid, "integer", true);
		data.tempid = this.get_DB().dbQuote(tempid, "integer", true);
		data.userid = this.get_DB().dbQuote(userid, "integer", true);
		data.coid = this.get_DB().dbQuote(H_post.coid, "coid", true);
		data.class1 = this.get_DB().dbQuote(H_post.class1, "text", true);
		data.class2 = this.get_DB().dbQuote(H_post.class2, "text", true);
		data.class3 = this.get_DB().dbQuote(H_post.class3, "text", true);
		data.productcode = this.get_DB().dbQuote(productcode, "text", true);
		data.productname = this.get_DB().dbQuote(productname, "text", true);
		data.unit_cost = this.get_DB().dbQuote(H_post.unit_cost, "integer", true);
		data.unit_price = this.get_DB().dbQuote(H_post.unit_price, "integer", true);
		data.num = this.get_DB().dbQuote(H_post.num, "integer", true);
		data.tax = this.get_DB().dbQuote(tax, "integer", true);
		data.price = this.get_DB().dbQuote(price, "integer", true);
		data.cost = this.get_DB().dbQuote(cost, "integer", true);
		data.acceptdate = this.get_DB().dbQuote(acceptdate, "date", true);
		data.deliverydate = this.get_DB().dbQuote(deliverydate, "date", true);
		data.delivery_dest = this.get_DB().dbQuote(H_post.delivery_dest, "date", true);
		data.comment = this.get_DB().dbQuote(H_post.comment, "date", true);
		data.update = this.get_DB().dbQuote(date, "timestamp", true);
		data.delete_flg = this.get_DB().dbQuote(false, "bool", true);
		data.dummy_flg = this.get_DB().dbQuote(false, "bool", true);
		data.card_name = this.get_DB().dbQuote(H_post.card_name, "text", true);
		return data;
	}

	makeAddSQL(pactid, postid, userid, id, id_sub, H_post, tempid, productcode, productname, card_name) //戻値用バッファ
	//更新日の作成
	//SQL用データの作成
	//登録日の設定
	//SQL作成
	{
		var sql = Array();
		var date = date("Y-m-d H:i:s");
		var data = this.makeData(pactid, postid, userid, H_post, tempid, productcode, productname, date, card_name);
		data.addbillid = this.get_DB().dbQuote(id, "text", true);
		data.addbillid_sub = this.get_DB().dbQuote(id_sub, "integer", true);
		data.recdate = data.update;
		var keys = Object.keys(data);
		sql.push("INSERT INTO addbill_tb( " + keys.join(",") + ")VALUES(" + data.join(",") + ")");
		return sql;
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

	getCoList() {
		var sql = "select coid,coname from addbill_co_tb" + " where" + " defaultflg=true" + " and pactid=" + this.H_G_Sess.pactid + " ORDER BY sort";
		return this.get_DB().queryAssoc(sql);
	}

	getTempList(pactid, userid, coid) {
		var sql = "select temp.tempid,temp.productname from addbill_temp_user_tb as usr" + " join addbill_temp_tb temp on" + " usr.tempid = temp.tempid" + " and pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and coid=" + this.get_DB().dbQuote(coid, "integer", true) + " where" + " userid=" + this.get_DB().dbQuote(userid, "integer", true);
		var data = this.get_DB().queryAssoc(sql);
		return data;
	}

	getTempData(pactid, tempid) {
		var sql = "select * from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid=" + this.get_DB().dbQuote(tempid, "integer", true);
		var data = this.get_DB().queryRowHash(sql);
		return data;
	}

	getTempClass1(pactid, tempid: {} | any[]) {
		if (!tempid) {
			return Array();
		}

		var sql = "select class1 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " group by class1" + " order by class1";
		return this.get_DB().queryCol(sql);
	}

	getTempClass2(pactid, tempid: {} | any[], class1) {
		if (!tempid || !class1) {
			return Array();
		}

		var sql = "select class2 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " group by class2" + " order by class2";
		return this.get_DB().queryCol(sql);
	}

	getTempClass3(pactid, tempid: {} | any[], class1, class2) {
		if (!tempid || !class1 || !class2) {
			return Array();
		}

		var sql = "select class3 from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " group by class3" + " order by class3";
		return this.get_DB().queryCol(sql);
	}

	getTempProductCode(pactid, tempid: {} | any[], class1, class2, class3) {
		if (!tempid || !class1 || !class2 || !class3) {
			return Array();
		}

		var sql = "select tempid,productcode from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " and class3 = " + this.get_DB().dbQuote(class3, "text", true) + " group by tempid,productcode" + " order by productcode";
		return this.get_DB().queryAssoc(sql);
	}

	getTempProductName(pactid, tempid: {} | any[], class1, class2, class3) {
		if (!tempid || !class1 || !class2 || !class3) {
			return Array();
		}

		var sql = "select tempid,productname from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid in ( " + tempid.join(",") + ")" + " and class1 = " + this.get_DB().dbQuote(class1, "text", true) + " and class2 = " + this.get_DB().dbQuote(class2, "text", true) + " and class3 = " + this.get_DB().dbQuote(class3, "text", true) + " group by tempid,productname" + " order by productname";
		return this.get_DB().queryAssoc(sql);
	}

	getTempCostAndPrice(pactid, tempid) {
		if (!tempid) {
			return Array();
		}

		var sql = "select cost,price from addbill_temp_tb" + " where " + "pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid = " + this.get_DB().dbQuote(tempid, "integer", true);
		var res = this.get_DB().queryRowHash(sql);
		res.tax = +(res.price * this.H_define_ini.Other.excise_tax);
		return res;
	}

	getAddBillData(pactid, id, id_sub) {
		var sql = "select * from addbill_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(id, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(id_sub, "integer", true);
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