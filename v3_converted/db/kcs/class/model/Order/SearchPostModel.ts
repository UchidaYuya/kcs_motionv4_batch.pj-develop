require("model/ModelBase.php");

require("view/Order/SearchPostView.php");

//
//setTableNo
//
//@author nakanita
//@since 2011/08/11
//
//@param mixed $month
//@access public
//@return this
//
//
//searchRecogUser
//
//@author igarashi
//@since 2011/05/25
//
//@param mixed $pactid
//@access public
//@return void
//
//
//searchPost
//
//@author igarashi
//@since 2011/05/26
//
//@param mixed $pactid
//@param mixed $view
//@access public
//@return void
//
//
//splitCode
//
//@author igarashi
//@since 2011/06/02
//
//@param mixed $code
//@access public
//@return void
//
//
//searchTelInfo
//
//@author houshiyama
//@since 2011/07/27
//
//@param mixed $view
//@access public
//@return void
//
//
//getErrorMessage
//
//@author igarashi
//@since 2011/08/22
//
//@param mixed $submit
//@param mixed $cnt
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/05/27
//
//@access public
//@return void
//
class SearchPostModel extends ModelBase {
	static FNC_FJP_RECOG = 209;

	constructor() {
		super();
		this._tableNo = undefined;
	}

	setTableNo(no) {
		this._tableNo = no;
		return this;
	}

	searchRecogUser(view) {
		if (!view.submit) {
			return Array();
		}

		var sql = "SELECT " + "p.postname, u.username, u.employeecode, u.userid " + "FROM " + "user_tb u " + "INNER JOIN post_tb p ON u.postid=p.postid AND p.pactid=" + this.getDB().dbQuote(view.pactid, "int", true) + " " + "INNER JOIN fnc_relation_tb r ON u.userid=r.userid " + "WHERE " + "u.pactid=" + this.getDB().dbQuote(view.pactid, "int", true) + " AND u.employeecode IS NOT NULL " + " AND u.employeecode != '' " + " AND r.fncid=" + SearchPostModel.FNC_FJP_RECOG + " ";

		if (view instanceof SearchPostView) {
			if (!is_null(view.postcode)) {
				sql += " AND p.userpostid like " + this.getDB().dbQuote("%" + view.postcode + "%", "text", false) + " ";
			}

			if (!is_null(view.username)) {
				sql += " AND u.username like " + this.getDB().dbQuote("%" + view.username + "%", "text", false) + " ";
			}

			if (!is_null(view.employeecode)) {
				sql += " AND u.employeecode like " + this.getDB().dbQuote("%" + view.employeecode + "%", "text", false) + " ";
			}
		}

		sql += "ORDER BY employeecode";
		return this.getDB().queryHash(sql);
	}

	searchPost(view) {
		if (!view.submit) {
			return Array();
		}

		var table = "post_tb";

		if (!is_null(this._tableNo)) {
			table = "post_" + this._tableNo + "_tb";
		}

		var sql = "SELECT postname, userpostid " + "FROM " + table + " " + "WHERE " + "pactid=" + this.getDB().dbQuote(view.pactid, "int", true) + " AND userpostid IS NOT NULL " + " AND userpostid != '' ";

		if (!is_null(view.postcode)) {
			sql += "AND userpostid like " + this.getDB().dbQuote("%" + view.postcode + "%", "text", false) + " ";
		}

		sql += "ORDER BY userpostid";
		return this.getDB().queryHash(sql);
	}

	splitCode(code, target = "") {
		if ("string" === typeof code) {
			if (4 < code.length) {
				var result = {
					original: code,
					split1: code.substr(0, 6),
					split2: code.substr(6)
				};
			} else {
				result = {
					original: code,
					split1: code,
					split2: ""
				};
			}
		} else if (Array.isArray(code)) {
			if (!target) {
				return false;
			}

			result = code;

			for (var key in code) {
				var val = code[key];

				if (4 < val[target].length) {
					result[key].original = val[target];
					result[key].split1 = val[target].substr(0, 6);
					result[key].split2 = val[target].substr(6);
				} else {
					result[key].original = val[target];
					result[key].split1 = val[target];
					result[key].split2 = "";
				}
			}
		}

		return result;
	}

	searchTelInfo(view) {
		var telno = view.telno.replace(/[^0-9a-zA-Z]/g, "");
		var sql = "SELECT t.telno, t.pbpostcode_first, t.cfbpostcode_first, t.ioecode, t.coecode, " + "p1.postname AS pbpostname, p2.postname AS cfbpostname, " + "t.username, t.employeecode, " + "t.pbpostcode_second, t.cfbpostcode_second, t.commflag, " + "t.text1, t.text2, t.text3, t.text4, t.text5, t.text6, t.text7, t.text8, " + "t.text9, t.text10, t.text11, t.text12, t.text13, t.text14, t.text15, " + "t.int1, t.int2, t.int3, int4, int5, int6, " + "t.date1, t.date2, t.date3, t.date4, t.date5, t.date6, " + "t.mail1, t.mail2, t.mail3, t.url1, t.url2, t.url3, " + "t.mail, t.memo, t.kousiflg, t.kousiptn, " + "select1,select2,select3,select4,select5," + "select6,select7,select8,select9,select10 " + "FROM " + "tel_tb t " + "LEFT JOIN post_tb p1 ON t.pbpostcode_first=p1.userpostid " + "LEFT JOIN post_tb p2 ON t.cfbpostcode_first=p2.userpostid " + "WHERE " + "t.pactid=" + this.get_DB().dbQuote(view.pactid, "int", true) + " AND t.carid=" + this.get_DB().dbQuote(view.carid, "int", true) + " AND t.telno=" + this.get_DB().dbQuote(telno, "text", true);
		var result = this.get_DB().queryRowHash(sql);

		if (result.commflag == "auto") {
			result.commflag = 1;
		} else if (result.commflag == "manual") {
			result.commflag = 2;
		} else {
			result.commflag = 0;
		}

		result.memo = preg_replace("/\r\n/", "\\n", result.memo);
		return result;
	}

	getErrorMessage(submit, cnt) {
		var errmsg = "";

		if (submit) {
			if (25 < cnt) {
				errmsg = "\u691C\u7D22\u7D50\u679C\u304C\u591A\u3059\u304E\u307E\u3059\u3002\u6761\u4EF6\u3092\u8FFD\u52A0\u3057\u3066\u691C\u7D22\u3057\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
			} else if (0 >= cnt) {
				errmsg = "\u8A72\u5F53\u306A\u3057";
			}
		}

		return errmsg;
	}

	__destruct() {
		super.__destruct();
	}

};