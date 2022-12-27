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
//makeBillListSQL
//電話請求からメールする
//@author web
//@since 2016/10/26
//
//@param mixed $cym
//@param mixed $postid
//@param mixed $tel_list
//@param mixed $select
//@access public
//@return void
//
//
//makeManagerListSQL
//電話管理からメールする
//@author web
//@since 2016/10/26
//
//@param mixed $cym
//@param mixed $postid
//@param mixed $tel_list
//@param mixed $select
//@access public
//@return void
//
//
//makeManagerListSQL
//電話管理からメールする
//@author web
//@since 2016/10/26
//
//@param mixed $cym
//@param mixed $postid
//@param mixed $tel_list
//@param mixed $select
//@access public
//@return void
//
//
//getList
//メール送付先リストの取得(電話管理、電話請求用)
//@author web
//@since 2016/10/12
//
//@access public
//@return void
//
//
//getSendTargetListCount
//対象数調べる(電話管理、電話請求用)
//@author web
//@since 2016/10/14
//
//@param mixed $cym
//@param mixed $postid
//@param mixed $tel_list
//@access public
//@return void
//
//
//makeSendListForOrderSQL
//注文履歴からメール。申請者一覧を返す
//@author web
//@since 2016/10/27
//
//@param mixed $order_list
//@param mixed $postid
//@param mixed $select
//@access private
//@return void
//
//
//makeSendListForOrderAuthorizerSQL
//注文履歴からメール。承認者一覧のSQLを返す
//@author web
//@since 2016/10/27
//
//@param mixed $order_list
//@param mixed $postid
//@param mixed $select
//@access private
//@return void
//
//
//getSendListForOrder
//注文履歴からメール出す、一覧取得
//@author web
//@since 2016/10/27
//
//@param mixed $order_list
//@access public
//@return void
//
//
//getSendListCountForOrder
//注文履歴からメール出す、数取得
//@author web
//@since 2016/10/27
//
//@param mixed $order_list
//@access public
//@return void
//
//
//getNextOrderid
//
//@author date
//@since 2016/10/14
//
//@access public
//@return void
//
//
//makeHistoryData
//送信
//@author date
//@since 2016/10/14
//
//@param mixed $id
//@param mixed $pactid
//@param mixed $username
//@param mixed $username_exec
//@param mixed $subject
//@param mixed $mail
//@param mixed $comment
//@param mixed $recdate
//@access protected
//@return void
//
//
//makeMailToDataForTel
//
//@author web
//@since 2017/05/17
//
//@param mixed $hid
//@param mixed $telno
//@param mixed $telno_view
//@param mixed $carid
//@param mixed $mail
//@param mixed $username
//@param mixed $postid
//@param mixed $postname
//@param mixed $employee_class
//@param mixed $executive_mail
//@param mixed $recdate
//@access private
//@return void
//
//
//makeMailHistorySQL
//メールヒストリー用のSQL作成
//@author web
//@since 2016/11/17
//
//@param mixed $id
//@param mixed $subject
//@param mixed $comment
//@param mixed $group_flag
//@param mixed $test_mail
//@param mixed $recdate
//@access protected
//@return void
//
//
//makeSQL
//
//@author web
//@since 2016/11/17
//
//@param mixed $subject
//@param mixed $mail
//@param mixed $comment
//@param mixed $group_flag
//@param mixed $test_mail
//@param mixed $data_list
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
class SendMailModel extends ModelBase {
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

	makeBillListSQL(cym, postid, tel_list, select) //テーブル番号取得
	//配下部署一覧
	//$O_Post = new PostModel;
	//$postlist = $O_Post->getChildList( $this->H_G_Sess["pactid"], $postid, $tableNo );
	//テーブル名作成
	//sql作成
	{
		var tableNo = MtTableUtil.getTableNo(cym, false);
		var bill_tb = "tel_bill_" + tableNo + "_tb";
		var tel_tb = "tel_" + tableNo + "_tb";
		var post_tb = "post_" + tableNo + "_tb";
		var sql = "select " + select + " from " + bill_tb + " as bill" + " left join " + tel_tb + " tel on tel.telno=bill.telno and tel.carid=bill.carid and tel.pactid=bill.pactid" + " join " + post_tb + " post on post.postid=bill.postid and post.pactid=bill.pactid" + " join carrier_tb car on car.carid=bill.carid" + " where" + " bill.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true);
		var temp = "";

		for (var value of Object.values(tel_list)) {
			if (temp != "") {
				temp += " or";
			}

			temp += " (" + "bill.telno=" + this.get_DB().dbQuote(value.telno, "text", true) + " and bill.postid=" + this.get_DB().dbQuote(value.postid, "integer", true) + " and bill.carid=" + this.get_DB().dbQuote(value.carid, "integer", true) + ")";
		}

		sql += " and (" + temp + ")";
		return sql;
	}

	makeManagerListSQL(cym, postid, tel_list, select) //配下部署一覧
	//$O_Post = new PostModel;
	//$postlist = $O_Post->getChildList( $this->H_G_Sess["pactid"], $postid, $tableNo );
	//テーブル名を決める
	//sql作成
	{
		var now = this.getDateUtil().getNow();
		var A_Time = split("-| |:", now);
		var YM = A_Time[0] + A_Time[1];

		if (YM == cym) {
			var tel_tb = "tel_tb";
			var post_tb = "post_tb";
		} else //テーブル番号取得
			{
				var tbno = MtTableUtil.getTableNo(cym, true);
				tel_tb = "tel_" + tbno + "_tb";
				post_tb = "post_" + tbno + "_tb";
			}

		var sql = "select " + select + " from " + tel_tb + " tel" + " join " + post_tb + " post on post.postid=tel.postid and post.pactid=tel.pactid" + " join carrier_tb car on car.carid=tel.carid" + " where" + " tel.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true);
		var temp = "";

		for (var value of Object.values(tel_list)) {
			if (temp != "") {
				temp += " or";
			}

			temp += " (" + "tel.telno=" + this.get_DB().dbQuote(value.telno, "text", true) + " and tel.postid=" + this.get_DB().dbQuote(value.postid, "integer", true) + " and tel.carid=" + this.get_DB().dbQuote(value.carid, "integer", true) + ")";
		}

		sql += " and (" + temp + ")";
		return sql;
	}

	makeOrderListSQL(cym, postid, tel_list, select) //配下部署一覧
	//$O_Post = new PostModel;
	//$postlist = $O_Post->getChildList( $this->H_G_Sess["pactid"], $postid, $tableNo );
	//テーブル名を決める
	//sql作成
	{
		var tel_tb = "mt_order_tb";
		var sql = "select " + select + " from " + tel_tb + " where" + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true);
		var temp = "";

		for (var value of Object.values(tel_list)) {
			if (temp != "") {
				temp += " or";
			}

			temp += " (" + "telno=" + this.get_DB().dbQuote(value.telno, "text", true) + " and postid=" + this.get_DB().dbQuote(value.postid, "integer", true) + " and carid=" + this.get_DB().dbQuote(value.carid, "integer", true) + ")";
		}

		sql += " and (" + temp + ")";
		return sql;
	}

	getSendListForTel(mail_type, cym, postid, tel_list, sort, offset, limit) //一覧を取得するSQLを取得する
	//オフセットと上限
	{
		var sql = "";

		switch (mail_type) {
			case "bill":
				sql = this.makeBillListSQL(cym, postid, tel_list, "bill.telno," + "tel.telno_view," + "bill.carid," + "tel.mail," + "tel.username," + "case when tel.employee_class=1 then '\u4E00\u822C\u793E\u54E1' when employee_class=2 then '\u5E79\u90E8\u793E\u54E1' else '' end as employee_class_name," + "case when tel.employee_class=1 then tel.executive_mail when employee_class=2 then null else '' end as executive_mail," + "case when tel.employee_class=1 then tel.executive_name when employee_class=2 then null else '' end as executive_name," + "tel.employee_class," + "post.postid," + "post.postname," + "car.carname");
				break;

			case "management":
				sql = this.makeManagerListSQL(cym, postid, tel_list, "tel.telno," + "tel.telno_view," + "tel.carid,tel.mail," + "tel.username," + "case when tel.employee_class=1 then '\u4E00\u822C\u793E\u54E1' when employee_class=2 then '\u5E79\u90E8\u793E\u54E1' else '' end as employee_class_name," + "case when tel.employee_class=1 then tel.executive_mail when employee_class=2 then null else '' end as executive_mail," + "case when tel.employee_class=1 then tel.executive_name when employee_class=2 then null else '' end as executive_name," + "tel.employee_class," + "post.postid," + "post.postname," + "car.carname");
				break;
		}

		var order_list = {
			0: "telno",
			1: "carid",
			2: "mail",
			3: "postid",
			4: "username"
		};
		var order_list_sub = ["telno"];
		sql += " " + this.makeOrderBy(order_list, order_list_sub, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getSendListForTelCount(mail_type, cym, postid, tel_list) //一覧を取得するSQLを取得する
	{
		switch (mail_type) {
			case "bill":
				var sql = this.makeBillListSQL(cym, postid, tel_list, "count(*)");
				break;

			case "management":
				sql = this.makeManagerListSQL(cym, postid, tel_list, "count(*)");
				break;
		}

		return this.get_DB().queryOne(sql);
	}

	makeSendListForOrderApplicantSQL(order_list, select) //申請者への送信について
	{
		var sql = "select " + select + " from mt_order_tb as ord" + " left join post_tb post on post.postid = ord.applypostid and post.pactid = ord.pactid" + " left join user_tb usr on usr.userid = ord.applyuserid and usr.pactid = ord.pactid" + " left join fnc_relation_tb frel on frel.pactid=ord.pactid and frel.userid=ord.applyuserid and fncid=209" + " left join user_tb rusr on rusr.userid=ord.recoguserid and rusr.pactid=ord.pactid" + " where" + " ord.pactid = " + this.H_G_Sess.pactid + " and ord.orderid in(" + order_list.join(",") + ")";
		return sql;
	}

	makeSendListForOrderAuthorizerSQL(order_list, select) //承認者
	{
		var sql = "select " + select + " from user_tb as usr" + " left join fnc_relation_tb fnc on" + " fnc.userid=usr.userid" + " and fnc.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and fnc.fncid=123" + " join mt_order_tb ord on" + " ord.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and ord.orderid in (" + order_list.join(",") + ")" + " and (" + " (ord.status=10 and ord.nextpostid = usr.postid  and fnc.fncid=123) or" + " (ord.status=5  and ord.recoguserid = usr.userid )" + " )" + " left join post_tb post on" + " post.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and post.postid=usr.postid" + " where" + " usr.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true);
		return sql;
	}

	getSendListForOrder(order_list, type, sort, offset, limit) //取得する項目
	//オフセットと上限
	{
		var select = "ord.orderid,ord.carid,usr.mail,post.postname,usr.username,post.postid";

		switch (type) {
			case "applicant":
				select += ",case when fncid is null then 1 else 2 end employee_class" + ",case when fncid is null then '\u4E00\u822C\u793E\u54E1' else '\u5E79\u90E8\u793E\u54E1' end as employee_class_name" + ",case when ord.status=5 then rusr.username else '' end as executive_name" + ",case when ord.status=5 then rusr.mail else '' end as executive_mail";
				var sql = this.makeSendListForOrderApplicantSQL(order_list, select);
				break;

			case "authorizer":
				select += ",case when fncid is null then 1 else 2 end employee_class";
				sql = this.makeSendListForOrderAuthorizerSQL(order_list, select);
				break;
		}

		var sort_list = {
			0: "orderid",
			1: "mail",
			2: "postid",
			3: "username",
			4: "employee_class",
			5: "executive_mail",
			6: "executive_name"
		};
		var sort_list_sub = ["orderid"];
		sql += " " + this.makeOrderBy(sort_list, sort_list_sub, sort);

		if (limit > 0) {
			this.get_DB().setLimit(limit, (offset - 1) * limit);
		}

		return this.get_DB().queryHash(sql);
	}

	getSendListCountForOrder(order_list, type) {
		switch (type) {
			case "applicant":
				var sql = this.makeSendListForOrderApplicantSQL(order_list, "count(*)");
				break;

			case "authorizer":
				sql = this.makeSendListForOrderAuthorizerSQL(order_list, "count(*)");
				break;
		}

		return this.get_DB().queryOne(sql);
	}

	getNextId() {
		var sql = "SELECT NEXTVAL('bill_mail_id_seq');";
		return this.get_db().queryOne(sql);
	}

	makeHistoryData(type, id, pactid, username, username_exec, subject, mail, comment, group_flag, test_mail, recdate, mail_target = undefined, executive_cc_flag = false) //登録日をDB用に修正
	//K86
	//注文履歴からのメール送信にて、申請者か承認者のどちら宛にメールをするか
	{
		var data = Array();
		data.type = this.get_DB().dbQuote(type, "integer", true);
		data.id = this.get_DB().dbQuote(id, "integer", true);
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.username_exec = this.get_DB().dbQuote(username_exec, "text", true);
		data.subject = this.get_DB().dbQuote(subject, "text", true);
		data.mail = this.get_DB().dbQuote(mail, "text", true);
		data.comment = this.get_DB().dbQuote(comment, "text", true);
		data.group_flag = this.get_DB().dbQuote(group_flag, "bool", true);
		data.test_mail = this.get_DB().dbQuote(test_mail, "text", true);
		data.recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		data.executive_cc_flag = this.get_DB().dbQuote(executive_cc_flag, "bool", true);

		if (!is_null(mail_target)) {
			data.mail_target = this.get_DB().dbQuote(mail_target, "integer", true);
		}

		return data;
	}

	makeMailToDataForTel(hid, telno, telno_view, carid, mail, username, postid, postname, employee_class, executive_name, executive_mail, recdate) //登録日をDB用に修正
	{
		var data = Array();
		data.hid = this.get_DB().dbQuote(hid, "integer", true);
		data.telno = this.get_DB().dbQuote(telno, "text", true);
		data.telno_view = this.get_DB().dbQuote(telno_view, "text", true);
		data.carid = this.get_DB().dbQuote(carid, "integer", true);
		data.mail = this.get_DB().dbQuote(mail, "text", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.status = this.get_DB().dbQuote(0, "integer", true);
		data.recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		data.postid = this.get_DB().dbQuote(postid, "integer", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.employee_class = this.get_DB().dbQuote(employee_class, "integer");
		data.executive_name = this.get_DB().dbQuote(executive_name, "text");
		data.executive_mail = this.get_DB().dbQuote(executive_mail, "text");
		return data;
	}

	makeMailHistorySQL(type, id, name, subject, mail, comment, group_flag, test_mail, recdate, mail_target = undefined, executive_cc_flag = false) {
		var data = this.makeHistoryData(type, id, this.H_G_Sess.pactid, name, this.H_G_Sess.loginname, subject, mail, comment, group_flag, test_mail, recdate, mail_target, executive_cc_flag);
		var columns = Object.keys(data);
		return "INSERT INTO bill_mail_history_tb (" + columns.join(",") + ")VALUES(" + data.join(",") + ")";
	}

	makeSQL(type, name, subject, mail, comment, group_flag, test_mail, data_list, mail_target = undefined, executive_cc_flag = false) //戻値用バッファ
	//更新日の作成
	{
		var sql = Array();
		var recdate = date("Y-m-d H:i:s");
		var id = this.getNextId();
		sql.push(this.makeMailHistorySQL(type, id, name, subject, mail, comment, group_flag, test_mail, recdate, mail_target, executive_cc_flag));

		for (var key in data_list) {
			var value = data_list[key];
			var data = this.makeMailToDataForTel(id, value.telno, value.telno_view, value.carid, value.mail, value.username, value.postid, value.postname, value.employee_class, value.executive_name, value.executive_mail, recdate);
			var columns = Object.keys(data);
			sql.push("INSERT INTO bill_mail_to_tb (" + columns.join(",") + ")VALUES(" + data.join(",") + ")");
		}

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