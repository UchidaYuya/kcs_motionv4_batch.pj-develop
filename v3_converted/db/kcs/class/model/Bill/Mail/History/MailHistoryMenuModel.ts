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
//makeListSQL
//一覧取得
//@author web
//@since 2016/11/21
//
//@param mixed $pactid
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

	makeListSQL(pactid, select) {
		var sql = "select " + select + " from bill_mail_history_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
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

			if (key != column) {
				sql += "," + key;

				if (value == "d") {
					sql += " desc";
				}
			}
		}

		return sql;
	}

	getList(pactid, sort, offset, limit) //一覧を取得するSQLを取得する
	//並び替え
	//オフセットと上限
	{
		var sql = "";
		sql = this.makeListSQL(pactid, "id,type,recdate,username,username_exec,subject");
		var order_list = {
			0: "type",
			1: "recdate",
			2: "username",
			3: "username_exec",
			4: "subject"
		};
		var order_list_sub = {
			recdate: "d",
			type: "a",
			username: "a"
		};
		sql += " " + this.makeOrderBy(order_list, order_list_sub, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getListCount(pactid) {
		var sql = this.makeListSQL(pactid, "count(*)");
		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};