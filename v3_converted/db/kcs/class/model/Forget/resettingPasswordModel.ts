//
//パスワード再設定モデル
//
//@uses ModelBase
//@package
//@author igarashi
//@since 2012/12/05
//

require("model/ModelBase.php");

//
//setViewObject
//
//@author igarashi
//@since 2012/12/04
//
//@param mixed $vObj
//@access public
//@return void
//
//
//checkUserId
//
//@author igarashi
//@since 2012/12/04
//
//@access public
//@return void
//
//
//makePassword
//
//@author igarashi
//@since 2012/12/04
//
//@param int $len
//@access public
//@return void
//
//
//updatePassword
//
//@author igarashi
//@since 2012/12/07
//
//@access public
//@return void
//
//
//beginTransaction
//
//@author igarashi
//@since 2012/12/07
//
//@access public
//@return void
//
//
//endTransaction
//
//@author igarashi
//@since 2012/12/07
//
//@access public
//@return void
//
//
//sendMail
//
//@author igarashi
//@since 2012/12/04
//
//@access public
//@return void
//
//
//writeLog
//
//@author igarashi
//@since 2012/12/04
//
//@access public
//@return void
//
//
//getCompData
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//getCompRow
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//getPassword
//
//@author igarashi
//@since 2012/12/04
//
//@access public
//@return void
//
//
//getIsUser
//
//@author web
//@since 2012/12/20
//
//@access public
//@return void
//
class resettingPasswordModel extends ModelBase {
	constructor() {
		super(...arguments);
		this.dbError = false;
		this.newPassword = "";
		this.encryptPassword = "";
		this.isUser = false;
	}

	static LANGUAGE_JP = "JPN";
	static LANGUAGE_EN = "ENG";
	static MAIL_PATH = "/conf_sync/mail_template/forget_password_j.txt";

	setViewObject(vObj) {
		this._vObj = vObj;
	}

	checkUserId() {
		var cnt = 0;

		var loginId = this._vObj.getLoginId();

		var mailAddr = this._vObj.getMailAddr();

		if (!!loginId && !!mailAddr) {
			var sql = "SELECT COUNT(*) " + "FROM " + "user_tb u " + "INNER JOIN pact_tb pa ON u.pactid=pa.pactid " + "WHERE " + "pa.groupid=" + this.get_DB().dbQuote(this._vObj.getGroupId(), "int", true) + " AND pa.userid_ini=" + this.get_DB().dbQuote(this._vObj.getPactCode(), "text", true) + " AND u.loginid=" + this.get_DB().dbQuote(loginId, "text", true) + " AND u.mail=" + this.get_DB().dbQuote(mailAddr, "text", true);
			cnt = this.get_DB().queryOne(sql);

			if (0 < cnt) {
				this.isUser = true;
			}

			this._vObj.setMessage("login", "\u8A72\u5F53\u3059\u308B\u30E6\u30FC\u30B6\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		return this.isUser;
	}

	makePassword(len = 9) {
		var strings = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789";
		var str = str_shuffle(strings);

		for (var i = 0; i < 9; i++) {
			this.newPassword += str[mt_rand(0, 56)];
		}

		require("CryptUtil.php");

		var cryptObj = new CryptUtil();
		this.encryptPassword = cryptObj.getCrypt(this.newPassword);
		return this.newPassword;
	}

	updatePassword() {
		var row = this.getCompRow();
		var sql = "UPDATE user_tb " + "SET " + "passwd3rd=passwd2nd, " + "passwd2nd=passwd, " + "passwd=" + this.get_DB().dbQuote(this.encryptPassword, "text", true) + ", " + "passchanged=" + this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true) + " " + "WHERE " + "userid=" + this.get_DB().dbQuote(row.userid, "int", true);

		if (PEAR.isError(this.get_DB().query(sql))) {
			this.dbError = true;
		}
	}

	beginTransaction() {
		this.get_DB().beginTransaction();
	}

	endTransaction() {
		if (this.dbError) {
			this.get_DB().rollback();
		} else {
			this.get_DB().commit();
		}
	}

	sendMail() {
		if (this.dbError) {
			return false;
		}

		var row = this.getCompRow();
		var mailTemplate = KCS_DIR + resettingPasswordModel.MAIL_PATH;

		if (resettingPasswordModel.LANGUAGE_EN == row.language) {
			mailTemplate = mailTemplate.replace(/_j.txt$/g, "_e.txt");
		}

		var content = file(mailTemplate);
		var cnt = content.length;
		var group = new GroupModel();
		var systemName = group.getGroupSystemName(row.groupid);

		for (var i = 0; i < cnt; i++) {
			content[i] = content[i].replace(/SYSTEMNAME/g, systemName);
			content[i] = content[i].replace(/NEWPASSWORD/g, this.newPassword);
		}

		require("model/Order/OrderModelBase.php");

		var dummySession = {
			pactid: row.pactid,
			userid: row.userid
		};
		var subject = rtrim(content.shift());
		var message = join("", content);
		var order = new OrderModelBase(this.get_DB(), dummySession, 0);
		var fromname = order.getSystemName(row.groupid, row.language, row.type);

		if (!!subject && !!message) //システムの共通名を入れる
			{
				var mail = new MtMailUtil();
				var from = "";
				mail.send(row.mail, message, frommail, subject, systemName, row.username);
			}
	}

	writeLog() {
		var row = this.getCompRow();

		if (!is_null(row)) {
			var sql = "INSERT INTO mnglog_tb (" + "pactid, " + "postid, " + "postname, " + "userid, " + "username, " + "recdate, " + "comment1, " + "comment2, " + "comment1_eng, " + "comment2_eng, " + "kind, " + "type) " + "VALUES (" + this.get_DB().dbQuote(row.pactid, "int", true) + ", " + this.get_DB().dbQuote(row.postid, "int", true) + ", " + this.get_DB().dbQuote(row.postname, "text", true) + ", " + this.get_DB().dbQuote(row.userid, "int", true) + ", " + this.get_DB().dbQuote(row.username, "text", true) + ", " + this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true) + ", " + this.get_DB().dbQuote("ID:" + this._vObj.getLoginId(), "text", true) + ", " + this.get_DB().dbQuote("\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u8A2D\u5B9A", "text", true) + ", " + this.get_DB().dbQuote("ID:" + this._vObj.getLoginId(), "text", true) + ", " + this.get_DB().dbQuote("Reset Password", "text", true) + ", " + this.get_DB().dbQuote("L", "text", true) + ", " + this.get_DB().dbQuote("\u30ED\u30B0\u30A4\u30F3", "text", true) + ")";
			this.get_DB().query(sql);
		}
	}

	getCompData() {
		var sql = "SELECT " + "pa.groupid, " + "pa.pactid, " + "pa.compname, " + "pa.type, " + "po.postid, " + "po.postname, " + "u.userid, " + "u.username, " + "u.language, " + "u.mail " + "FROM " + "user_tb u " + "INNER JOIN post_tb po ON u.postid=po.postid " + "INNER JOIN pact_tb pa ON po.pactid=pa.pactid " + "WHERE " + "pa.groupid=" + this.get_DB().dbQuote(this._vObj.getGroupId(), "int", true) + " AND pa.userid_ini=" + this.get_DB().dbQuote(this._vObj.getPactCode(), "text", true) + " AND u.loginid=" + this.get_DB().dbQuote(this._vObj.getLoginId(), "text", true) + " AND u.mail=" + this.get_DB().dbQuote(this._vObj.getMailAddr(), "text", true);
		this.compRow = this.get_DB().queryRowHash(sql);
		return this.compRow;
	}

	getCompRow() {
		if (!is_null(this.compRow)) {
			return this.compRow;
		}

		return this.getCompData();
	}

	getPassword() {
		return this.newPassword;
	}

	getIsUser() {
		return this.isUser;
	}

};