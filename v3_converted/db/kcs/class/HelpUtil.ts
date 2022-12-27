//
// ヘルプファイル取得クラス
//
// 作成日：2004/10/07
// 作成者：上杉勝史
//

require("DBUtil.php");

require("common.php");

//
// ヘルプファイルの取得
//
// [引　数] $fncid : 権限ID
// [返り値] なし
//
//
// ヘルプファイルの取得
//
// [引　数] $path : パスを指定(省略可能)
// [返り値] なし
//
//
// ヘルプ表示権限を取得
//
// [引　数] $userid : ユーザを指定（省略可）
// [返り値] なし
//
//
// 指定したヘルプファイルをセット
//
// [引　数] $filename : ヘルプファイル名
// [返り値] なし
//
class HelpUtil {
	getHelpFnc(fncid) {
		if (fncid == "") //権限IDがなかったら何もしない
			{
				return false;
			}

		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var sql = "select " + "helpfile " + "from " + "function_tb " + "where " + "fncid=" + fncid;
		var result = GLOBALS.GO_db.getOne(sql);

		if (result != "") {
			GLOBALS.G_HELP_FILE = result;
		}

		if (_SESSION.helpfile == "on" && _SESSION.pactid != "") //存在確認
			{
				if (file_exists(KCS_DIR + "/htdocs/Help/" + _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE) == true) {
					GLOBALS.G_HELP_FILE = _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE;
				}
			}
	}

	getHelpPath(path = "") //お問い合わせはMenu直下にあるため、function_tbでヘルプファイルを指定されたinquiry_menuより先（inquiry.php）に進むとヘルプファイル指定が効かなかった
	//これを修正するためにここで直接指定している 20061109miya
	//DBUtilオブジェクト
	{
		if (path == "") {
			if (_SERVER.PHP_SELF == "/Menu/inquiry.php") {
				var phpself_str = "/Menu/inquiry_menu.php";
			} else {
				phpself_str = _SERVER.PHP_SELF;
			}

			var wheresql = "path in ('" + phpself_str + "','" + dirname(_SERVER.PHP_SELF) + "')";
		} else {
			wheresql = "path = '" + path + "'";
		}

		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var sql = "select " + "path," + "helpfile " + "from " + "function_tb " + "where " + wheresql + " order by fncid";
		var A_result = GLOBALS.GO_db.getHash(sql);

		if (A_result.length > 0) {
			if (A_result[0].helpfile != "") //パスにＰＨＰファイルが指定されている場合はそれを優先
				{
					GLOBALS.G_HELP_FILE = A_result[0].helpfile;

					for (var i = 0; i < A_result.length; i++) {
						if (preg_match("/\\.php$/", A_result[i].path) == true) {
							GLOBALS.G_HELP_FILE = A_result[i].helpfile;
						}
					}
				}
		}

		if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
			GLOBALS.G_HELP_FILE = "Hotline/" + GLOBALS.G_HELP_FILE;
		}

		if (undefined !== _SESSION.helpfile == true && _SESSION.helpfile == "on" && _SESSION.pactid != "") //存在確認
			{
				if (file_exists(KCS_DIR + "/htdocs/Help/" + _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE) == true) {
					GLOBALS.G_HELP_FILE = _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE;
				}
			}
	}

	getHelpAuth(userid = "") {
		if (userid == "") {
			userid = _SESSION.userid;
		}

		if (userid == "" || _SESSION.pactid == "") {
			GLOBALS.G_HELP_DISPLAY = false;
		} else //権限取得
			{
				var sql = "SELECT fncid FROM fnc_relation_tb WHERE pactid=" + _SESSION.pactid + " AND userid=" + userid + " AND fncid=" + HELP;
				var result = GLOBALS.GO_db.getOne(sql);

				if (result != "") {
					GLOBALS.G_HELP_DISPLAY = true;
				} else {
					GLOBALS.G_HELP_DISPLAY = false;
				}
			}
	}

	setHelpFile(filename) {
		if (filename == "") //ファイル名がなかったら何もしない
			{
				return false;
			} else {
			if (file_exists(KCS_DIR + "/htdocs/Help/" + filename) == true) {
				GLOBALS.G_HELP_FILE = filename;
			}
		}
	}

};