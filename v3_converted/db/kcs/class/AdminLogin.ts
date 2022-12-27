//
//認証クラス(管理者用)
//
//管理者用の認証ライブラリ<br>
//一般ユーザでは行わない処理を纏めている
//
//更新履歴：<br>
//2004/09/13 上杉勝史 パスワード暗号化対応<br>
//2006/06/09 宮澤龍彦 DB二重化now()対応<br>
//2008/01/29 石崎公久 コメント書式をPhpdocumentor対応
//2008/11/28 石崎公久 グループ化
//2009/02/02	石崎公久	グループ化ぬけ修正
//
//@package Base
//@subpackage Login
//@access public
//@filesource
//@since 2004/08/10
//@author 末広秀樹
//
//
//
//認証クラス(管理者用)
//
//管理者用の認証ライブラリ<br>
//一般ユーザでは行わない処理を纏めている
//
//@package Base
//@subpackage Login
//@access public
//@since 2004/08/10
//@author 末広秀樹
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.conf");

require("CryptUtil.php");

require("MtSetting.php");

require("model/GroupModel.php");

//
//指定された会社の現在利用可能な権限の取得
//
//使用例
//ログインのチェックが必要なページに以下のソースを埋め込む<br>
//ログイン状態であれば、そのまま以降のソースの実行に移るが、<br>
//そうでない場合は、不正アクセスのページ表示を行う。
//<code>
//AdminLogin::getLogin();
//</code>
//
//グローバル変数にDBUtilとErrorUtilが存在しない場合はここで生成する。
//{@source 3 9}
//
//@param boolean $in default = false ログイン画面からの場合はtrueを設定
//@see AdminLogin::chkDB();
//@see AdminLogin::chkSessTime();
//@see AdminLogin::chkSessTime();
//@uses shop_tb
//@uses shop_member_tb
//
//
// 指定された会社の現在利用可能な権限の取得
//
// [引　数] : なし
// [返り値] : なし
// 権限化 20090910miya
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
class AdminLogin {
	getLogin(in = false) {
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}

		if (in == true) //DBから値を取得しパスワードチェック後セッション生成
			{
				AdminLogin.chkDB();
			} else //POSTでloginパラメータがあればログイン画面とみなす
			{
				if (_POST.login == "login") //DBから値を取得しパスワードチェック後セッション生成
					{
						AdminLogin.chkDB();
					} else //ログインしているかのチェック
					//
					//chkSession()
					//
					//グルプか
					{
						if (AdminLogin.chkSession() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSession");
						}

						if (AdminLogin.chkSessTime() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSessTime");
						}

						var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_member_tb.name," + "shop_tb.fiscalmonth," + "shop_tb.name_eng " + "from " + "shop_tb " + " inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.shopid = " + _SESSION.admin_shopid;
						var A_result = GLOBALS.GO_db.getRow(sql);
						_SESSION.admin_shopid = A_result[0];
						_SESSION.admin_groupid = A_result[1];
						_SESSION.admin_name = A_result[2];
						_SESSION.admin_ownermail = A_result[3];
						_SESSION.admin_postcode = A_result[4];
						_SESSION.admin_ownername = A_result[5];
						_SESSION.admin_fiscalmonth = A_result[6];
						_SESSION.admin_name_eng = A_result[7];
						_SESSION.admin_shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;
						_SESSION.admin_pactid = A_result[8];
						var O_group = new GroupModel();
						GLOBALS.GROUPID = A_result[1];
						GLOBALS.GROUPNAME = "/" + O_group.getGroupName(A_result[1]);
					}
			}

		if (true == (undefined !== _SESSION.admin_groupid)) {
			var O_set = MtSetting.singleton();
			O_set.loadConfig("group");
			global.LOGIN_GROUPNAME = O_set["groupid" + _SESSION.admin_groupid];
		} else {
			global.LOGIN_GROUPNAME = "";
		}
	}

	chkDB() //ユーザ管理記録に書き込む
	//DBUtilオブジェクト
	{
		var loginid = _POST.loginid.trim();

		var password = _POST.password;
		var personname = _POST.personname;

		if (loginid == "") //$GLOBALS["GO_errlog"]->errorOut(5, "ログインIDが入力されていません", 0);
			{
				session_unset();
				GLOBALS.GO_errlog.warningOut(5, "\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 1, "/index_admin.php");
			}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_member_tb.passwd," + "shop_tb.name," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth," + "shop_tb.name_eng," + "shop_member_tb.memid," + "shop_member_tb.type " + "from " + "shop_tb inner join shop_member_tb on shop_tb.shopid = shop_member_tb.shopid " + "where " + "shop_member_tb.loginid = '" + loginid + "' " + "and shop_tb.type = 'A' " + "and shop_tb.delflg = false";
		var A_result = GLOBALS.GO_db.getRow(sql);
		var O_group = new GroupModel();

		if (A_result.length == 0) //$GLOBALS["GO_errlog"]->errorOut(9, "販売店がありません shopid: " . $A_result[0], 0);
			{
				session_unset();
				GLOBALS.GROUPID = _POST.gid;
				GLOBALS.GO_errlog.warningOut(9, "\u8CA9\u58F2\u5E97\u304C\u3042\u308A\u307E\u305B\u3093 adminid: " + A_result[0], 1, "/" + O_group.getGroupName(_POST.gid) + "/index_admin.php");
			}

		var O_crypt = new CryptUtil();

		if (A_result[2] != O_crypt.getCrypt(password)) //if($A_result[2] != $password){
			//$GLOBALS["GO_errlog"]->errorOut(9, "パスワードが違います shopid: " . $A_result[0], 0);
			{
				session_unset();
				GLOBALS.GROUPID = A_result[1];
				GLOBALS.GO_errlog.warningOut(9, "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059 adminid: " + A_result[0], 1, "/" + O_group.getGroupName(A_result[1]) + "/index_admin.php");
			}

		session_unset();
		_SESSION.admin_shopid = A_result[0];
		_SESSION.admin_groupid = A_result[1];
		_SESSION.admin_name = A_result[3];
		_SESSION.admin_shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;

		if (_POST.personname != "") {
			_SESSION.admin_personname = _POST.personname;
		} else {
			_SESSION.admin_personname = A_result[4];
		}

		_SESSION.admin_ownermail = A_result[5];
		_SESSION.admin_ownername = A_result[4];
		_SESSION.admin_fiscalmonth = A_result[7];
		_SESSION.admin_name_eng = A_result[8];
		_SESSION.admin_memid = A_result[9];
		_SESSION.admin_usertype = A_result[10];
		_SESSION.admin_logintype = "admin";
		setcookie("sh_uid_admin", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("admin_person", personname, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");

		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var ins_mng_sql = "insert into admin_mnglog_tb values(" + _SESSION.admin_shopid + "," + "'" + _SESSION.admin_name + "'," + "'" + _SESSION.admin_personname + "'," + "'L'," + "'\u30ED\u30B0\u30A4\u30F3'," + "'\u30ED\u30B0\u30A4\u30F3\u51E6\u7406'," + "'" + date("Y-m-d H:i:s") + "'" + ")";
		GLOBALS.GO_db.query(ins_mng_sql);
	}

	chkSession() {
		if (_SESSION.admin_logintype == "admin") //ログインしている
			{
				return true;
			} else //ログインしていない
			{
				var O_group = new GroupModel();

				if (1 < _SESSION.groupid) {
					var backurl = "/" + O_group.getGroupName(_SESSION.groupid) + "/index_admin.php";
				} else {
					backurl = "/index_admin.php";
				}

				session_unset();
				GLOBALS.GO_errlog.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306A\u3057", 0, backurl);
			}

		return false;
	}

	chkSessTime() {
		if (_SESSION.admin_shop_limit_time < 1) //未ログインのエラー
			//$GLOBALS["GO_errlog"]->errorOut(10, "shopid: " . $_SESSION["admin_shopid"], 0);
			{
				session_unset();
				GLOBALS.GO_errlog.warningOut(10, "adminid: " + _SESSION.admin_shopid, 1, "/index_admin.php");
			}

		if (_SESSION.admin_shop_limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //$GLOBALS["GO_errlog"]->errorOut(7, "shopid: " . $_SESSION["admin_shopid"], 0);
			{
				var O_group = new GroupModel();
				var backurl = "/index_admin.php";

				if (1 < _SESSION.groupid) {
					backurl = "/" + O_group.getGroupName(_SESSION.groupid) + "/index_admin.php";
				}

				session_unset();
				GLOBALS.GO_errlog.warningOut(7, "adminid: " + _SESSION.admin_shopid, 1, backurl);
			}

		return false;
	}

	logOut() //ユーザ管理記録に書き込む
	//DBUtilオブジェクト
	//ログイン情報を破棄
	{
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var ins_mng_sql = "insert into admin_mnglog_tb values(" + _SESSION.admin_shopid + "," + "'" + _SESSION.admin_name + "'," + "'" + _SESSION.admin_personname + "'," + "'L'," + "'\u30ED\u30B0\u30A2\u30A6\u30C8'," + "'\u30ED\u30B0\u30A2\u30A6\u30C8\u51E6\u7406'," + "'" + date("Y-m-d H:i:s") + "'" + ")";
		GLOBALS.GO_db.query(ins_mng_sql);
		session_unset();
	}

	ShopJoker() {
		var groupid = _POST.gid.trim();

		var loginid = _POST.loginid.trim();

		var password = _POST.password;
		var personname = _POST.personname;

		if (groupid == "" || loginid == "") //$GLOBALS["GO_errlog"]->errorOut(5, "ログインIDが入力されていません", 0);
			{
				session_unset();
				GLOBALS.GO_errlog.warningOut(5, "\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 1, "/index_admin.php");
			}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.passwd," + "shop_tb.name," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth," + "shop_tb.name " + "from " + "shop_tb inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.loginid = '" + loginid + "' " + "and shop_tb.groupid = " + groupid + " " + "and shop_tb.delflg = false";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) //$GLOBALS["GO_errlog"]->errorOut(9, "販売店がありません shopid: " . $A_result[0], 0);
			{
				session_unset();
				GLOBALS.GO_errlog.warningOut(9, "\u8CA9\u58F2\u5E97\u304C\u3042\u308A\u307E\u305B\u3093 adminid: " + A_result[0], 1, "/index_admin.php");
			}

		session_unset();
		_SESSION.admin_shopid = A_result[0];
		_SESSION.admin_groupid = A_result[1];
		_SESSION.admin_name = A_result[3];
		_SESSION.admin_postcode = A_result[4];
		_SESSION.admin_shop_limit_time = Date.now() / 1000 + 60 * GLOBALS.G_shop_sesslimit;

		if (_POST.personname != "") {
			_SESSION.admin_personname = _POST.personname;
		} else {
			_SESSION.admin_personname = A_result[4];
		}

		_SESSION.admin_ownermail = A_result[5];
		_SESSION.admin_ownername = A_result[4];
		_SESSION.admin_fiscalmonth = A_result[7];
		_SESSION.admin_name_eng = A_result[8];
	}

};