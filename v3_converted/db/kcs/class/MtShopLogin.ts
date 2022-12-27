//
//認証クラス
//
//一般ユーザ向けの認証ライブラリ。<br>
//※販売店ページは ShopLogin クラス<br>
//※管理者ページは AdminLogin クラス
//
//更新履歴：<br>
//2008/03/14 上杉勝史 作成
//2009/02/02 石崎公久　エラー時のグループごとの戻り先を対応
//
//@package Base
//@subpackage Login
//@filesource
//@author katsushi
//@since 2008/03/14
//
//
//
//認証クラス
//
//一般ユーザ向けの認証ライブラリ。<br>
//※販売店ページは ShopLogin クラス<br>
//※管理者ページは AdminLogin クラス
//
//@package Base
//@subpackage Login
//@author katsushi
//@since 2008/03/14
//

require("model/ShopLoginModel.php");

require("MtLogin.php");

require("MtOutput.php");

require("MtSession.php");

require("MtShopAuthority.php");

require("MtCryptUtil.php");

require("Net/IPv4.php");

require("model/GroupModel.php");

//
//グループログイン文字列=>groupid
//
//
//GroupModelオブジェクト
//
//@var mixed
//@access private
//
//
//__construct
//
//@author nakanita
//@since 2008/09/03
//
//@access protected
//@return void
//
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
//有効時間のチェック
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
//
//パスワード間違い回数のチェック
//
//@author nakanita
//@since 2008/06/24
//
//@param mixed $shopid
//@param mixed $miscount
//@access private
//@return void
//
//
//パスワードの間違い回数を設定する
//
//@author nakanita
//@since 2008/06/24
//
//@param integer $shopid
//@param integer $memid
//@param boolean $flag  trueのとき+1する、falseのときリセットで０に戻す
//@access private
//@return void
//
//
//パスワードの有効期限チェック
//
//会社権限を調べて、パスワード有効期限の確認<br>
//ユーザー権限を調べてパスワード変更権限の確認<br>
//両方ともある場合は、パスワードの有効期限が切れているか、いないかの確認
//
//@author nakanita
//@since 2008/04/24
//
//@param integer $shopid
//@param integer $uid
//@param boolean $type trueが渡されたとき、ジャンプ動作をしない
//@access public
//@return void
//
//
//有効期限切れフラグをON
//
//パスワード変更権限がある場合は変更ページへ飛ばす
//
//@param integer shopid
//@param integer uid
//@param boolean type
//@param int out 0のとき初回、1のとき有効期限切れ
//{@source}
//
//
//２重ログインチェックのため、セッションIDを記録する
//
//@author nakanita
//@since 2008/05/01
//
//@access protected
//@return void
//
//
//二重ログインチェック
//
//@author katsushi
//@since 2008/03/17
//
//@access public
//@return boolean
//
//
//ログインチェックを行う
//
//@author nakanita
//@since 2008/09/03
//
//@access public
//@return void
//
//
//初期ログインデータをセッションに書き込む
//
//@author katsushi
//@since 2008/03/17
//
//@param string $group
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
//成り代わりログインを行う。ショップユーザーへの成り代わり。
//
//@author nakanita
//@since 2008/06/20
//
//@param mixed $group
//@param mixed $userid_ini
//@param mixed $loginid
//@param string $loginname
//@access public
//@return void
//
//
//ショップ関連セッション値をハッシュテーブルに取得する
//成り代わり処理に使用
//
//@author nakanita
//@since 2008/06/03
//
//@access protected
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
class MtShopLogin extends MtLogin {
	constructor() //モデルを上書きする
	//必要な設定を取得する
	//グループ文字列->ID
	//max_groupid に件数が登録されている
	{
		super();
		this.O_Model = new ShopLoginModel();
		this.O_group = new GroupModel();
		var O_Conf = MtSetting.singleton();
		O_Conf.loadConfig("group");
		this.H_Group = Array();
		var max_gid = O_Conf.max_groupid;

		for (var idx = 0; idx <= max_gid; idx++) //groupid + 数字 という規則で登録されている
		{
			var key = "groupid" + idx;

			try {
				var prop = O_Conf[key];
			} catch (ex) //項目がなかったら空文字とする
			{
				prop = "";
			}

			if (prop != "") {
				this.H_Group[O_Conf[key]] = idx;
			} else //設定が無かった場合"groupidN"が販売店グループとなる
				{
					this.H_Group[key] = idx;
				}
		}
	}

	static singleton() {
		if (super[O_Instance] == undefined) {
			super[O_Instance] = new MtShopLogin();
		}

		return super[O_Instance];
	}

	checkSession() //print "memid=" . $this->O_Sess->memid . ", and shopid=" . $this->O_Sess->shopid . "\n";	// DEBUG * セッションが付いてない？
	{
		if (is_numeric(this.O_Sess.memid) == true && is_numeric(this.O_Sess.shopid) == true) //ログインしている
			{
				return true;
			}

		return false;
	}

	checkSessionLimit() {
		if (is_numeric(this.O_Sess.shop_limit_time) == false || this.O_Sess.shop_limit_time < 1) //未ログインのエラー
			{
				this.errorPattern("Session", this.O_Sess.memid);
			}

		if (this.O_Sess.shop_limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //有効時間外
			{
				return false;
			}
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

	checkMiscount(shopid, miscount) //会社権限でパスワード間違い回数のチェックがオンになっている場合のみ処理
	//パスワード間違い回数があれば
	//問題なし
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_miscount") == true) {
			if (miscount >= this.O_Conf.shop_passwd_miscount) //設定している回数を超えたらエラー
				{
					return false;
				}
		}

		return true;
	}

	setPasswdMiscount(shopid, memid, flag) //会社権限でパスワード間違い回数のチェックがオンになっている場合のみ処理
	//パスワード間違い回数があれば
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_miscount") == true) {
			this.O_Model.setMiscount(shopid, memid, flag);
		}
	}

	checkPassWordLimit(shopid, uid, type = false) //まずはパス有効期限の権限がある会社か？
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_limit") == true) //パスワードの有効時間を取得
			{
				var pass_lim = this.O_Model.getLoginPasschanged(uid);

				if (pass_lim == "") //パスワード変更日が空（権限追加後初アクセスなど）
					//パスワード変更画面へ飛ばす
					{
						this.jumpPassChage(shopid, uid, type, 0);
					} else {
					var date_exe = pass_lim.split(" ");
					date_exe[1] = date("Y-m-d");
					var change_days = (strtotime(date_exe[1]) - strtotime(date_exe[0])) / (24 * 60 * 60);

					if (change_days > this.O_Conf.shop_password_limit) {
						this.jumpPassChage(shopid, uid, type, 1);
					} else {
						delete _SESSION.shopPassOUT;
					}
				}
			}
	}

	jumpPassChage(shopid, uid, type, out) {
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkUserFuncIni(uid, "fnc_chg_pass") == true && type == false) //
			//ここでセッションを開始
			//パスワード変更だけのための、特別なセッションを付ける
			//本当のログイン時とセッション名を変えている、直接ログインできないように
			//初回or期限切れフラグを設定する
			{
				session_start();
				this.O_Sess.setGlobal("shopid_pass", shopid);
				this.O_Sess.setGlobal("memid_pass", uid);

				if (out == 0) {
					this.O_Sess.setGlobal("shopPassOUT", "ON");
				} else {
					this.O_Sess.setGlobal("shopPassOUT", "OFF");
				}

				header("Location: /Shop/chg_password.php");
				throw die(0);
			}
	}

	writeLoginRelSess(shopid, memid) //会社権限に二重ログイン禁止が設定されているか確認
	//２重ログイン権限があれば
	//成功
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_double_login") == true) //設定されている場合は、login_rel_sess_tb にログイン情報を書き込む
			{
				var sess_id = session_id();
				var result = this.O_Model.setLoginSessInfo(shopid, memid, sess_id);

				if (result == 0) //失敗
					{
						session_unset();
						return false;
					}
			}

		return true;
	}

	checkDoubleLogin(shopid, memid) //成り代わりフラグがついていない場合のみ処理	// * ToDo *
	//if( $this->O_Sess->narikawari === null ){
	//$narikawari = $this->O_Sess->narikawari;
	//会社権限で二重ログインがオンになっている場合のみ処理
	//２重ログイン権限があれば
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_double_login") == true) //, $narikawari );
			{
				var sess_id = session_id();
				var A_pact_user_num = this.O_Model.getLoginSessInfo(shopid, memid, sess_id);

				if (A_pact_user_num.length != 1) //自分がいなければ
					{
						session_unset();
						this.O_Out.errorOut(32, "memid: " + memid + "-sess: " + sess_id, 0);
						return false;
					}
			}

		return true;
	}

	checkLogin() //POST["login"]があればログイン画面からの入力
	{
		if (undefined !== _POST.login == true && _POST.login == "login") //POSTデータチェック
			{
				if (undefined !== _POST.group == false || undefined !== _POST.userid_ini == false || undefined !== _POST.loginid == false || undefined !== _POST.password == false) {
					this.errorPattern("NoInput");
				}

				this.setLogin(_POST.group.trim(), _POST.userid_ini.trim(), _POST.loginid.trim(), _POST.password.trim());
				header("Location: " + _SERVER.PHP_SELF);
				throw die(0);
			} else //ログイン中の場合は情報の更新処理
			{
				this.refreshLogin();
			}
	}

	setLogin(group, userid_ini, loginid, password, loginname = "") //グループIDの取得
	//ユーザー情報の取得
	//パスワード間違い回数のチェック
	//二重ログインチェックのため、ログインセッション情報を書き込む
	//セッションへの書き込み
	//loginnameがあれば上書きする、成り代わり時の設定など
	//間違い回数リセット
	//ユーザ管理記録に書き込む
	{
		if (undefined !== this.H_Group[group] == false) {
			this.errorPattern("GroupNotFound", group);
		}

		var groupid = this.H_Group[group];
		var H_userinfo = this.O_Model.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		var shopid = H_userinfo.shopid;
		var memid = H_userinfo.memid;

		if (this.checkMiscount(shopid, H_userinfo.miscount) == false) {
			this.errorPattern("Miscount", loginid);
		}

		if (this.checkPassword(H_userinfo, password) == false) //間違い回数カウント
			{
				this.setPasswdMiscount(shopid, memid, true);
				this.errorPattern("Password", loginid);
			}

		this.checkPassWordLimit(shopid, memid);

		if (this.writeLoginRelSess(shopid, memid) == false) {
			this.errorPattern("DoubleLogin", memid);
		}

		if (this.checkDoubleLogin(shopid, memid) == false) {
			this.errorPattern("DoubleLogin", memid);
		}

		if (this.checkIPrestrict(shopid) == false) {
			this.errorPattern("IPRestrict", memid);
		}

		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", H_userinfo.personname);
		}

		this.setPasswdMiscount(shopid, memid, false);
		var H_log = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: "ID: " + this.O_Sess.memid,
			comment2: "\u30ED\u30B0\u30A4\u30F3\u51E6\u7406",
			kind: "L",
			type: "\u30ED\u30B0\u30A4\u30F3",
			joker_flag: 0
		};
		this.O_Out.writeShopMnglog(H_log);
	}

	setLoginCore(H_userinfo) //セッションへの書き込み
	//shop_tb.name
	//shop_member_tb.name
	//personname と同じ
	//ショップ側スーパーユーザーの設定
	{
		this.O_Sess.setGlobal("memid", H_userinfo.memid);
		this.O_Sess.setGlobal("shopid", H_userinfo.shopid);
		this.O_Sess.setGlobal("groupid", H_userinfo.groupid);
		this.O_Sess.setGlobal("grouptitle", this.O_group.getGroupTitle(H_userinfo.groupid, "S"));
		this.O_Sess.setGlobal("name", H_userinfo.shopname);
		this.O_Sess.setGlobal("postcode", H_userinfo.postcode);
		this.O_Sess.setGlobal("personname", H_userinfo.personname);
		this.O_Sess.setGlobal("ownermail", H_userinfo.ownermail);
		this.O_Sess.setGlobal("ownername", H_userinfo.personname);
		this.O_Sess.setGlobal("shop_limit_time", Date.now() / 1000 + 60 * this.O_Conf.shop_sesslimit);
		this.O_Sess.setGlobal("fiscalmonth", H_userinfo.fiscalmonth);

		if (H_userinfo.usertype == "SU") {
			this.O_Sess.setGlobal("su", true);
		} else {
			this.O_Sess.setGlobal("su", false);
		}
	}

	refreshLogin() //ログインしているかのチェック
	//$_SESSION["GROUPID"] = $H_userinfo["groupid"];
	{
		if (this.checkSession() == false) {
			this.errorPattern("Session");
		}

		if (this.checkSessionLimit() == false) {
			this.errorPattern("SessionLimit", this.O_Sess.memid);
		}

		if (this.checkDoubleLogin(this.O_Sess.shopid, this.O_Sess.memid) == false) {
			this.errorPattern("DoubleLogin", this.O_Sess.memid);
		}

		var H_userinfo = this.O_Model.getUserInfo(this.O_Sess.memid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserDeleted", this.O_Sess.shopid + "," + this.O_Sess.memid);
		}

		if (this.checkIPrestrict(H_userinfo.shopid) == false) {
			this.errorPattern("IPRestrict", this.O_Sess.memid);
		}

		this.setLoginCore(H_userinfo);
		GLOBALS.GROUPID = H_userinfo.groupid;
	}

	ShopJoker(group, userid_ini, loginid, loginname = "") //グループIDの取得
	//ユーザー情報の取得
	//パスワードチェックが無い
	//二重ログインチェックは行わない
	//IP制限チェックも行わない
	//まずセッションをクリアしてから
	//セッションへの書き込み
	//loginnameがあれば上書きする、成り代わり時の設定など
	// ToDo * Mnglogへの書き込みを行なおう
	{
		if (undefined !== this.H_Group[group] == false) {
			this.errorPattern("GroupNotFound", group);
		}

		var groupid = this.H_Group[group];
		var H_userinfo = this.O_Model.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		var shopid = H_userinfo.shopid;
		var memid = H_userinfo.memid;
		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", H_userinfo.personname);
		}
	}

	getShopSessionHash() {
		var A_ShopSessKey = ["memid", "shopid", "groupid", "name", "postcode", "personname", "ownermail", "ownername", "loginname", "shop_limit_time", "fiscalmonth", "su"];
		var H_shopkey = Array();

		for (var key of Object.values(A_ShopSessKey)) {
			H_shopkey[key] = this.O_Sess[key];
		}

		return H_shopkey;
	}

	logOut() //セッションのクリア
	{
		var H_log = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: "ID: " + this.O_Sess.memid,
			comment2: "\u30ED\u30B0\u30A2\u30A6\u30C8\u51E6\u7406",
			kind: "L",
			type: "\u30ED\u30B0\u30A2\u30A6\u30C8",
			joker_flag: this.O_Sess.joker
		};
		this.O_Out.writeShopMnglog(H_log);
		this.O_Sess.clearSessionAll();
	}

	errorPattern(pattern, info = "") {
		var goto = "";

		if (undefined !== this.O_Sess.groupid) {
			if (1 < this.O_Sess.groupid) {
				goto = "/" + this.O_group.getGroupName(this.O_Sess.groupid) + "/index_shop.php";
			} else {
				goto = "/index_shop.php";
			}
		} else if ("" != GLOBALS.GROUPID) {
			if (1 < GLOBALS.GROUPID) {
				goto = "/" + this.O_group.getGroupName(GLOBALS.GROUPID) + "/index_shop.php";
			} else {
				goto = "/index_shop.php";
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

			case "GroupNotFound":
				this.O_Out.errorOut(9, "\u30B0\u30EB\u30FC\u30D7\u304C\u898B\u3064\u304B\u3089\u306A\u3044(group: " + info + ")", false, goto);
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