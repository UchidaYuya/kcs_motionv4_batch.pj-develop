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
//private $H_define_ini;
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
//makeHistorySQL
//履歴の取得
//@author web
//@since 2016/11/22
//
//@param mixed $pactid
//@param mixed $id
//@param mixed $select
//@access public
//@return void
//
//
//makeToSQL
//送信先の取得
//@author web
//@since 2016/11/22
//
//@param mixed $id
//@param mixed $select
//@access public
//@return void
//
//
//makeOrderBy
//
//@author web
//@since 2016/11/21
//
//@param mixed $order_list
//@param mixed $order_sub_list
//@param mixed $sort
//@access protected
//@return void
//
//
//getList
//
//@author web
//@since 2016/11/21
//
//@param mixed $pactid
//@param mixed $offset
//@param mixed $limit
//@access public
//@return void
//
//
//getListCount
//
//@author web
//@since 2016/11/21
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
class MailHistoryMenuModel extends ModelBase {
	constructor(O_db0, H_g_sess) //$this->H_define_ini = parse_ini_file(KCS_DIR."/conf_sync/define.ini", true);
	{
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

	getHistory(pactid, history_id) {
		var sql = "select * from bill_mail_history_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and id=" + this.get_DB().dbQuote(history_id, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	makeToListSQL(history_id, select) {
		var sql = "select " + select + " from bill_mail_to_tb mto" + " join post_tb post on post.postid=mto.postid" + " left join carrier_tb car on car.carid = mto.carid" + " where" + " mto.hid=" + this.get_DB().dbQuote(history_id, "integer", true);
		return sql;
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

	getToList(history_id, type, sort, offset, limit) //一覧を取得するSQLを取得する
	//オフセットと上限
	{
		var sql = "";
		sql = this.makeToListSQL(history_id, "mto.orderid," + "mto.telno," + "mto.carid," + "mto.mail," + "mto.username," + "mto.status," + "post.postid," + "car.carname," + "mto.telno_view," + "mto.postname," + "mto.employee_class," + "case when mto.employee_class = 1 then '\u4E00\u822C\u793E\u54E1' when mto.employee_class=2 then '\u5E79\u90E8\u793E\u54E1' end as employee_class_name," + "mto.executive_name," + "mto.executive_mail");

		if (type == 3) //注文履歴
			{
				var order_list = {
					0: "orderid",
					1: "mail",
					2: "postid",
					3: "username",
					4: "employee_class",
					5: "executive_mail",
					6: "executive_name"
				};
				var order_list_sub = ["orderid"];
			} else //電話管理、請求
			{
				order_list = {
					0: "telno",
					1: "carid",
					2: "mail",
					3: "postid",
					4: "username",
					5: "employee_class",
					6: "executive_mail",
					7: "executive_name"
				};
				order_list_sub = ["telno"];
			}

		sql += " " + this.makeOrderBy(order_list, order_list_sub, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getToListCount(history_id) {
		var sql = this.makeToListSQL(history_id, "count(*)");
		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};