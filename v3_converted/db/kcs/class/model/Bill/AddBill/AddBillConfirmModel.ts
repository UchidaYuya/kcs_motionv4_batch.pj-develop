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
//@since 2015/12/21
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
//@since 2015/12/21
//
//@access public
//@return void
//
//
//get_AuthIni
//権限の取得
//@author web
//@since 2015/12/21
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
class AddBillConfirmModel extends ModelBase {
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

	getList(pactid, cfmid, sort) //並び替えリスト。
	//並び替え
	{
		var where = "";

		for (var value of Object.values(cfmid)) {
			var id = value.split(":");

			if (where != "") {
				where += "or";
			}

			where += " (bill.addbillid=" + this.get_DB().dbQuote(id[0], "text", true) + " and bill.addbillid_sub=" + this.get_DB().dbQuote(id[1], "integer", true) + ") ";
		}

		var sql = "select" + " bill.addbillid" + ",bill.addbillid_sub" + ",co.coname" + ",bill.class1" + ",bill.class2" + ",bill.class3" + ",bill.productcode" + ",bill.productname" + ",bill.cost" + ",bill.price" + ",bill.tax" + ",bill.acceptdate" + ",bill.deliverydate" + ",bill.delivery_dest" + ",bill.comment" + ",bill.num" + ",post.userpostid" + ",post.postname" + ",usr.username" + ",bill.confirm_flg" + ",bill.card_name" + " from addbill_tb as bill" + " join addbill_co_tb co on bill.coid=co.coid and co.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " join post_tb post on bill.postid=post.postid and bill.pactid=post.pactid" + " join user_tb usr on usr.userid=bill.userid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and (" + where + ")";
		var order_list = {
			0: "bill.addbillid",
			1: "bill.addbillid_sub",
			2: "post.userpostid",
			3: "post.postname",
			4: "bill.coid",
			5: "bill.class1",
			6: "bill.class2",
			7: "bill.class3",
			8: "bill.productcode",
			9: "bill.productname",
			10: "bill.num",
			11: "bill.cost",
			12: "bill.price",
			13: "bill.tax",
			14: "bill.acceptdate",
			15: "bill.deliverydate",
			16: "bill.delivery_dest",
			17: "usr.username",
			18: "bill.confirm_flg",
			19: "bill.comment",
			20: "bill.card_name"
		};
		var order_sub_list = {
			0: "bill.addbillid",
			1: "bill.addbillid_sub"
		};
		sql += this.makeOrderBy(order_list, order_sub_list, sort);
		return this.get_DB().queryHash(sql);
	}

	makeConfirmSQL(pactid, cfmid) //戻値用
	//テーブルNoの取得
	//対象を一件ずつ処理するぽよ
	{
		var res = Array();
		var recdate = date("Y-m-d h:i:s");
		var O_table = new MtTableUtil();
		var cym = recdate.substr(0, 4) + recdate.substr(5, 2);
		var tbno = O_table.getTableNo(cym);

		for (var value of Object.values(cfmid)) ////	対象を請求てーぶるにコピーする
		//			$sql = "select * from addbill_tb".$where;
		//			$bill = $this->get_DB()->queryRowHash($sql);
		//			$bill = $this->makeBillInsertData($bill);		//	SQL用に成型するぽよ
		//			$bill["recdate"] = $this->get_DB()->dbQuote($recdate,"timestamp",true);	//	更新日を更新する
		//			$keys = array_keys($bill);
		//			//	請求に入れる
		//			$res[] = "insert into addbill_".$tbno."_tb(".implode(",",$keys).")values(".implode(",",$bill).")";
		//削除フラグを立てる
		{
			var id = value.split(":");
			var where = " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(id[0], "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(id[1], "integer", true);
			res.push("update addbill_tb set confirm_flg=true" + where);
		}

		return res;
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