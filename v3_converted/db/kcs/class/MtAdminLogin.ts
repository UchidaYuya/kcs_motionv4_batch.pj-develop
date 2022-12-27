//
//認証クラス
//
//管理ユーザ向けの認証ライブラリ。<br>
//※販売店ページは ShopLogin クラス<br>
//※管理者ページは AdminLogin クラス
//
//更新履歴：<br>
//2008/07/04 中西達夫 作成
//2009/02/02 石崎公久　エラー時のグループごとの戻り先を対応
//
//@package Base
//@subpackage Login
//@filesource
//@author nakanita
//@since 2008/07/04
//
//
//
//認証クラス
//
//管理ユーザ向けの認証ライブラリ。<br>
//※販売店ページは ShopLogin クラス<br>
//
//@package Base
//@subpackage Login
//@author nakanita
//@since 2008/03/14
//

require("model/AdminLoginModel.php");

require("MtLogin.php");

require("MtOutput.php");

require("MtSession.php");

require("MtAdminAuthority.php");

require("MtCryptUtil.php");

require("model/GroupModel.php");

//
//ただ１つしか無いこのクラスのインスタンスを取得する
//new の代わりに、このメソッドによってインスタンスを得ること
//
//@author nakanita
//@since 2008/04/30
//
//@static
//@access public
//@return object
//
//
//セッションが有効かどうか
//
//@author katsushi
//@since 2008/03/17
//
//@access public
//@return boolean
//
//
//パスワードのチェック
//
//@author katsushi
//@since 2008/03/18
//
//@param array $H_userinfo
//@param string $input_passwd
//@access public
//@return void
//
//管理者側での checkLogin は、親クラスのものを使う
//
//初期ログインデータをセッションに書き込む
//
//@author katsushi
//@since 2008/03/17
//
//@param string $userid_ini
//@param string $loginid
//@param string $password
//@param string $loginname
//@access public
//@return void
//
// ログイン時にセッションを設定する共通部分
// 
// @author nakanita 
// @since 2008/06/20
// 
// @param mixed $H_userinfo 
// @access private
// @return void
//
//ログインデータの更新
//
//@author katsushi
//@since 2008/03/17
//
//@access public
//@return void
//
//
//ログアウト処理
//
//@author katsushi
//@since 2008/03/18
//
//@access public
//@return void
//
//
//エラー出力の一覧
//
//@author katsushi
//@since 2008/03/18
//
//@param string $pattern
//@param string $info
//@access public
//@return void
//
class MtAdminLogin extends MtLogin {
	constructor() //モデルを上書きする
	{
		super();
		this.O_Model = new AdminLoginModel();
	}

	static singleton() {
		if (super[O_Instance] == undefined) {
			super[O_Instance] = new MtAdminLogin();
		}

		return super[O_Instance];
	}

	checkSession() {
		if (_SESSION.admin_logintype == "admin") //ログインしている
			{
				return true;
			}

		return false;
	}

	checkPassword(H_userinfo: {} | any[], input_passwd) //print $H_userinfo["passwd"] . "<br>\n";
	//print $input_passwd . "<br>\n";
	{
		this.O_Crypt = MtCryptUtil.singleton();

		if (H_userinfo.passwd != this.O_Crypt.getCrypt(input_passwd)) {
			return false;
		}

		return true;
	}

	setLogin(userid_ini, loginid, password, loginname = "") //ユーザー情報の取得
	//セッションへの書き込み
	//ログインに必要な情報を設定する
	//ユーザ管理記録に書き込む
	//$ins_mng_sql = "insert into admin_mnglog_tb values(" .
	//                            $_SESSION["admin_shopid"] . "," .
	//                            "'".$_SESSION["admin_name"] . "'," .
	//                            "'".$_SESSION["admin_personname"] . "'," .
	//                            "'L'," .
	//                            "'ログイン'," .
	//                            "'ログイン処理'," .
	//                            "'" . date("Y-m-d H:i:s") . "'" .
	//                        ")";
	//        $GLOBALS["GO_db"]->query($ins_mng_sql);
	{
		var H_userinfo = this.O_Model.getUserInfoAll(userid_ini, loginid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		if (this.checkPassword(H_userinfo, password) == false) {
			this.errorPattern("Password", loginid);
		}

		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);
		_SESSION.admin_logintype = "admin";
		setcookie("sh_uid_admin", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("admin_person", personname, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");

		if (_POST.personname != "") {
			_SESSION.admin_personname = _POST.personname;
		} else {
			_SESSION.admin_personname = A_result[4];
		}
	}

	setLoginCore(H_userinfo) //セッションへの書き込み
	//$this->O_Sess->setGlobal("admin_name", $H_userinfo["shopname"]);	// shop_tb.name
	//2008/08/11 * リフレッシュ時に "admin_name" を上書きしないように修正
	//personname と同じ
	{
		this.O_Sess.setGlobal("admin_shopid", H_userinfo.shopid);
		this.O_Sess.setGlobal("admin_groupid", H_userinfo.groupid);
		this.O_Sess.setGlobal("admin_postcode", H_userinfo.postcode);
		this.O_Sess.setGlobal("admin_ownermail", H_userinfo.ownermail);
		this.O_Sess.setGlobal("admin_ownername", H_userinfo.personname);
		this.O_Sess.setGlobal("admin_shop_limit_time", Date.now() / 1000 + 60 * this.O_Conf.shop_sesslimit);
		this.O_Sess.setGlobal("admin_fiscalmonth", H_userinfo.fiscalmonth);
		this.O_Sess.setGlobal("admin_pactid", H_userinfo.shopid);
		var O_set = MtSetting.singleton();
		O_set.loadConfig("group");
		global.LOGIN_GROUPNAME = O_set["groupid" + H_userinfo.groupid];
	}

	refreshLogin() //ログインしているかのチェック
	//IP制限チェックは行わない
	//セッションへの書き込み
	{
		if (this.checkSession() == false) {
			this.errorPattern("Session");
		}

		var H_userinfo = this.O_Model.getUserInfo(this.O_Sess.admin_shopid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserDeleted", this.O_Sess.admin_shopid);
		}

		GLOBALS.GROUPID = H_userinfo.groupid;
		this.setLoginCore(H_userinfo);
	}

	logOut() //セッションのクリア
	{
		this.O_Sess.clearSessionAll();
	}

	errorPattern(pattern, info = "") {
		var O_group = "";
		var goto = "";

		if (undefined !== this.O_Sess.groupid) {
			O_group = new GroupModel();

			if (1 < this.O_Sess.groupid) {
				goto = "/" + O_group.getGroupName(this.O_Sess.groupid) + "/index_admin.php";
			} else {
				goto = "/index_admin.php";
			}
		}

		switch (pattern) {
			case "Session":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u306A\u3044\u304B\u3001\u6709\u52B9\u3067\u306F\u306A\u3044(IP: " + _SERVER.REMOTE_ADDR + ")", false, goto);
				break;

			case "Password":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(9, "\u30D1\u30B9\u30EF\u30FC\u30C9\u9593\u9055\u3044(loginid: " + info + ")", false, goto);
				break;

			case "UserNotFound":
				this.O_Out.errorOut(9, "\u30E6\u30FC\u30B6\u60C5\u5831\u304C\u898B\u3064\u304B\u3089\u306A\u3044(userid_ini,loginid: " + info + ")", false, goto);
				break;

			case "SessionLimit":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(7, "Session\u6709\u52B9\u6642\u9593\u30AA\u30FC\u30D0\u30FC(userid: " + info + ")", false, goto);
				break;

			case "DoubleLogin":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(32, "\u4E8C\u91CD\u30ED\u30B0\u30A4\u30F3\u30A8\u30E9\u30FC", false, goto);
				break;

			case "Miscount":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(36, "\u30D1\u30B9\u30EF\u30FC\u30C9\u9593\u9055\u3044\u56DE\u6570\u304C\u5236\u9650\u3092\u8D85\u3048\u305F(loginid: " + info + ")", false, goto);
				break;

			case "IPRestrict":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "IP\u5236\u9650\u30ED\u30B0\u30A4\u30F3(userid: " + info + ")", false, goto);
				break;

			case "RemoteAddr":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "\u63A5\u7D9A\u5143IP\u304C\u4E0D\u6B63(IP: " + info + ")", false, goto);
				break;

			case "UserDeleted":
				this.O_Out.errorOut(25, "\u30ED\u30B0\u30A4\u30F3\u4E2D\u306E\u30E6\u30FC\u30B6\u304C\u524A\u9664\u3055\u308C\u305F(pactid,userid: " + info + ")", true, "/", "\u30ED\u30B0\u30A4\u30F3\u30DA\u30FC\u30B8\u3078", goto);
				break;

			case "NoInput":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(5, "\u9867\u5BA2\u30B3\u30FC\u30C9\u3001\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false, goto);
				break;

			default:
				this.O_Out.errorOut(11, "MtLogin: \u305D\u306E\u4ED6\u306E\u30A8\u30E9\u30FC(userid: " + this.O_Sess.userid + ")");
				break;
		}
	}

};