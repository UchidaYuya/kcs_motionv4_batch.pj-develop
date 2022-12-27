require("model/Bill/Mail/SendMailModel.php");

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
//makeMailToData
//
//@author web
//@since 2016/11/16
//
//@param mixed $hid
//@param mixed $orderid
//@param mixed $carid
//@param mixed $mail
//@param mixed $username
//@param mixed $recdate
//@access private
//@return void
//
//
//makeSQL
//更新用SQLの作成
//@author web
//@since 2016/11/16
//
//@param mixed $subject
//@param mixed $mail
//@param mixed $comment
//@param mixed $group_flag
//@param mixed $data_list
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
class SendOrderHistoryMailModel extends SendMailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	makeMailToData(hid, orderid, carid, mail, username, postid, postname, employee_class, executive_name, executive_mail, recdate) //登録日をDB用に修正
	//k86
	{
		var data = Array();
		data.hid = this.get_DB().dbQuote(hid, "integer", true);
		data.orderid = this.get_DB().dbQuote(orderid, "integer", true);
		data.carid = this.get_DB().dbQuote(carid, "integer", true);
		data.mail = this.get_DB().dbQuote(mail, "text", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.status = this.get_DB().dbQuote(0, "integer", true);
		data.postid = this.get_DB().dbQuote(postid, "integer", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		data.employee_class = this.get_DB().dbQuote(employee_class, "integer");
		data.executive_name = this.get_DB().dbQuote(executive_name, "text");
		data.executive_mail = this.get_DB().dbQuote(executive_mail, "text");
		return data;
	}

	makeSQL(type, name, subject, mail, comment, group_flag, test_mail, data_list, mail_target, executive_cc_flag) //戻値用バッファ
	//更新日の作成
	{
		var sql = Array();
		var recdate = date("Y-m-d H:i:s");
		var id = this.getNextId();
		sql.push(this.makeMailHistorySQL(3, id, name, subject, mail, comment, group_flag, test_mail, recdate, mail_target, executive_cc_flag));

		for (var key in data_list) {
			var value = data_list[key];
			var data = this.makeMailToData(id, value.orderid, value.carid, value.mail, value.username, value.postid, value.postname, value.employee_class, value.executive_name, value.executive_mail, recdate);
			var columns = Object.keys(data);
			sql.push("INSERT INTO bill_mail_to_tb (" + columns.join(",") + ")VALUES(" + data.join(",") + ")");
		}

		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};