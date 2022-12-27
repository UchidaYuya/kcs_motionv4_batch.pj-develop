//
// 認証クラス(販売店用)
//
//
// 作成日：2004/05/21
// 作成者：上杉勝史
// 追加 2006/06/09 宮澤 DB二重化now()対応
// 追加 2009/03/12 石崎 ログイン時にグループタイトルをセッションに入れる
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.conf");

require("CryptUtil.php");

require("model/GroupModel.php");

//
// 指定された会社の現在利用可能な権限の取得
//
// [引　数] $in : ログイン画面からの場合はtrueを設定
// [返り値] なし
//
//
// 指定された会社の現在利用可能な権限の取得
//
// [引　数] : なし
// [返り値] : なし
//
//function chkDB($pactid, $loginid, $password){
//
// 現在のログイン状態の取得
//
// [引　数] : なし
// [返り値] : True
//
//
// 現在のログイン有効時間の有効性の取得
//
// [引　数] : なし
// [返り値] : true
//
//
// 指定された会社の現在利用可能な権限の取得
//
// [引　数] : なし
// [返り値] : なし
//
class ShopLogin {
	getLogin(in = false) //DBUtilオブジェクト
	{
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}

		if (in == true) //DBから値を取得しパスワードチェック後セッション生成
			{
				ShopLogin.chkDB();
			} else //POSTでloginパラメータがあればログイン画面とみなす
			{
				if (_POST.login == "login") //DBから値を取得しパスワードチェック後セッション生成
					{
						ShopLogin.chkDB();
					} else //ログインしているかのチェック
					{
						if (ShopLogin.chkSession() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSession");
						}

						if (ShopLogin.chkSessTime() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSessTime");
						}

						var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_member_tb.name," + "shop_tb.fiscalmonth " + "from " + "shop_tb inner join shop_member_tb on shop_tb.shopid = shop_member_tb.shopid " + "where " + " shop_tb.type != 'A'" + " and shop_tb.shopid = " + _SESSION.shopid + " and shop_member_tb.memid = " + _SESSION.memid + " and shop_tb.delflg = false";
						var A_result = GLOBALS.GO_db.getRow(sql);
						_SESSION.shopid = A_result[0];
						_SESSION.groupid = A_result[1];
						_SESSION.name = A_result[2];
						_SESSION.ownermail = A_result[3];
						_SESSION.postcode = A_result[4];
						_SESSION.ownername = A_result[5];
						_SESSION.fiscalmonth = A_result[6];
						_SESSION.shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;
						var O_group = new GroupModel();
						_SESSION.grouptitle = O_group.getGroupTitle(_SESSION.groupid, "S");

						if (KCS_DIR != "/kcs") {
							_SESSION.TRY = 1;
						}
					}
			}
	}

	chkDB() //groupidが決め打ちだったのを変更 20060324miya
	//$groupid = trim($_POST["gid"]);
	//// ユーザ管理記録に書き込む
	//		$ins_mng_sql = "insert into mnglog_tb values(" .
	//							$_SESSION["pactid"] . "," .
	//							$_SESSION["postid"] . "," .
	//							$_SESSION["userid"] . "," .
	//							"'" . date("Y-m-d H:i:s") . "'," .	// DB二重化now()対応 20060609miya
	//							"'ID：" . $loginid . "'," .
	//							"'ログイン認証'," .
	//							"'" . $_SESSION["loginname"] . "'," .
	//							"'L'," .
	//							"'ログイン')";
	//		$GLOBALS["GO_db"]->query($ins_mng_sql);
	{
		var loginid = _POST.loginid.trim();

		if (_SESSION.groupid != "") {
			var groupid = _SESSION.groupid;
		} else {
			var group_sql = "SELECT groupid FROM shop_tb WHERE loginid = '" + loginid + "'";
			groupid = GLOBALS.GO_db.getOne(group_sql);
		}

		var password = _POST.password;
		var personname = _POST.personname;

		if (groupid == "" || loginid == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(5, "\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.passwd," + "shop_tb.name," + "shop_member_tb.memid," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth " + "from " + "shop_tb inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.loginid = '" + loginid + "' " + "and shop_tb.groupid = " + groupid + " " + "and shop_tb.type != 'A' " + "and shop_tb.delflg = false";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(9, "\u8CA9\u58F2\u5E97\u304C\u3042\u308A\u307E\u305B\u3093 shopid: " + A_result[0], 0);
		}

		var O_crypt = new CryptUtil();

		if (A_result[2] != O_crypt.getCrypt(password)) //if($A_result[2] != $password){
			//Hotline移植対応 20060228miya
			{
				if (A_result[2] == md5(password)) //旧ホットラインのパスワードに合致したら、ここでV2方式に書き換えてしまう
					//COMMIT
					{
						var upd_shop_sql = "UPDATE shop_tb SET " + "passwd = '" + O_crypt.getCrypt(password) + "'," + "fixdate = '" + date("Y-m-d H:i:s") + "' " + "WHERE " + "shopid = " + A_result[0];
						GLOBALS.GO_db.query(upd_shop_sql);
						GLOBALS.GO_db.commit();
					} else {
					session_unset();
					GLOBALS.GO_errlog.errorOut(9, "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059 shopid: " + A_result[0], 0);
				}
			}

		session_unset();
		_SESSION.shopid = A_result[0];
		_SESSION.groupid = A_result[1];
		_SESSION.name = A_result[3];
		_SESSION.memid = A_result[4];
		_SESSION.postcode = A_result[7];
		_SESSION.shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;
		var O_group = new GroupModel();
		_SESSION.grouptitle = O_group.getGroupTitle(_SESSION.groupid, "S");

		if (_POST.personname != "") {
			_SESSION.personname = _POST.personname;
		} else {
			_SESSION.personname = A_result[5];
		}

		_SESSION.ownermail = A_result[6];
		_SESSION.ownername = A_result[5];
		_SESSION.fiscalmonth = A_result[8];

		if (KCS_DIR != "/kcs") {
			_SESSION.TRY = 1;
		}

		setcookie("sh_uid", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("person", personname, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
	}

	chkSession() //if($this->userid != ""){
	{
		if (_SESSION.shopid != "") //ログインしている
			{
				return true;
			} else //ログインしていない
			{
				session_unset();
				GLOBALS.GO_errlog.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306A\u3057", 0);
			}

		return false;
	}

	chkSessTime() {
		if (_SESSION.shop_limit_time < 1) //未ログインのエラー
			{
				session_unset();
				GLOBALS.GO_errlog.errorOut(10, "shopid: " + _SESSION.shopid, 0);
			}

		if (_SESSION.shop_limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //有効時間外エラー
			{
				var groupid = _SESSION.groupid;
				session_unset();
				_SESSION.groupid = groupid;
				GLOBALS.GO_errlog.errorOut(7, "shopid: " + _SESSION.shopid, 0);
			}

		return false;
	}

	logOut() //ユーザ管理記録に書き込む
	//DBUtilオブジェクト
	//if($GLOBALS["GO_db"] == false){
	//			$GLOBALS["GO_db"] = new DBUtil();
	//		}
	//		$ins_mng_sql = "insert into mnglog_tb values(" .
	//							$_SESSION["pactid"] . "," .
	//							$_SESSION["postid"] . "," .
	//							$_SESSION["userid"] . "," .
	//							"'" . date("Y-m-d H:i:s") . "'," .	// DB二重化now()対応 20060609miya
	//							"'ID：" . $_SESSION["loginid"] . "'," .
	//							"'ログアウト処理'," .
	//							"'" . $_SESSION["loginname"] . "'," .
	//							"'L'," .
	//							"'ログアウト')";
	//		$GLOBALS["GO_db"]->query($ins_mng_sql);
	{
		session_unset();
	}

	ShopJoker() {
		var groupid = _POST.gid.trim();

		var loginid = _POST.loginid.trim();

		var password = _POST.password;
		var personname = _POST.personname;

		if (groupid == "" || loginid == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(5, "\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.passwd," + "shop_tb.name," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth " + "from " + "shop_tb inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.loginid = '" + loginid + "' " + "and shop_tb.groupid = " + groupid + " " + "and shop_tb.type != 'A' " + "and shop_tb.delflg = false";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(9, "\u8CA9\u58F2\u5E97\u304C\u3042\u308A\u307E\u305B\u3093 shopid: " + A_result[0], 0);
		}

		session_unset();
		_SESSION.shopid = A_result[0];
		_SESSION.groupid = A_result[1];
		_SESSION.name = A_result[3];
		_SESSION.postcode = A_result[4];
		_SESSION.shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;

		if (_POST.personname != "") {
			_SESSION.personname = _POST.personname;
		} else {
			_SESSION.personname = A_result[4];
		}

		_SESSION.ownermail = A_result[5];
		_SESSION.ownername = A_result[4];
		_SESSION.fiscalmonth = A_result[7];

		if (KCS_DIR != "/kcs") {
			_SESSION.TRY = 1;
		}
	}

};