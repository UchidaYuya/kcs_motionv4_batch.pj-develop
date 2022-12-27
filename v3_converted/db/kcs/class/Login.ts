//
//認証クラス
//
//一般ユーザ向けの認証ライブラリ。<br>
//管理者ページは AdminLogin クラスが使用されている
//
//更新履歴：<br>
//2004/06/28 森原 POSTメッセージの有無を確認<br>
//2005/01/12 勝史 IP制限の追加<br>
//2005/12/12 宮澤 helpfileフラグ追加<br>
//2006/02/28 宮澤 Hotline統合対応でmd5による暗号化にも合致するよう変更<br>
//2006/03/28 宮澤 ログイン時に権限を見て会社名を第二階層の部署名で置き換える<br>
//2006/06/09 宮澤 DB二重化now()対応<br>
//2006/06/30 宮澤 JokerLoginにpactid追加（loginidが同じユーザが複数いた場合、別の会社でログインされてしまったため）<br>
//2006/07/13 宮澤 上記JokerLoginにif文追加（jokerex.phpにはセッションがあるが、joker.phpにはないためSQLエラーになっていた）<br>
//2006/07/28 中西 会社名、部署名の表示修正、level, toppostname を追加<br>
//2006/11/24 石崎 二重ログインチェックを追加<br>
//2006/12/13 石崎 ログインログアウト時に mnglog_tb に、作業者所属部署名称を追記<br>
//2006/12/19 石崎 ログイン時にパス変権あり且つパス有権ありで、期限切れは変更ページへ飛ぶ<br>
//2007/06/11 宝子山 mnglog_tb書き込み時成り代わりならjoker_flagに1、通常なら0を追加<br>
//2009/03/12 石崎 ログイン時にセッションにグループタイトルをつめる
//2009/08/27 前田 ログアウト記録英語化対応
//
//@package Base
//@subpackage Login
//@filesource
//@since 2004/04/08
//@author 上杉勝史
//
//
//第二階層参照権限対応 20060328miya
//第二階層参照権限対応 20060328miya
//20090312石崎
//
//認証クラス
//
//一般ユーザ向けの認証ライブラリ。<br>
//管理者ページは AdminLogin クラスが使用されている
//
//更新履歴：<br>
//2004/06/28 森原 POSTメッセージの有無を確認<br>
//2005/01/12 勝史 IP制限の追加<br>
//2005/12/12 宮澤 helpfileフラグ追加<br>
//2006/02/28 宮澤 Hotline統合対応でmd5による暗号化にも合致するよう変更<br>
//2006/03/28 宮澤 ログイン時に権限を見て会社名を第二階層の部署名で置き換える<br>
//2006/06/09 宮澤 DB二重化now()対応<br>
//2006/06/30 宮澤 JokerLoginにpactid追加（loginidが同じユーザが複数いた場合、別の会社でログインされてしまったため）<br>
//2006/07/13 宮澤 上記JokerLoginにif文追加（jokerex.phpにはセッションがあるが、joker.phpにはないためSQLエラーになっていた）<br>
//2006/07/28 中西 会社名、部署名の表示修正、level, toppostname を追加<br>
//2006/11/24 石崎 二重ログインチェックを追加<br>
//2006/12/13 石崎 ログインログアウト時に mnglog_tb に、作業者所属部署名称を追記<br>
//2006/12/19 石崎 ログイン時にパス変権あり且つパス有権ありで、期限切れは変更ページへ飛ぶ<br>
//2007/06/11 宝子山 mnglog_tb書き込み時成り代わりならjoker_flagに1、通常なら0を追加
//2009/03/12 石崎 ログイン時にセッションにグループタイトルをつめる
//
//@package Base
//@subpackage Login
//@filesource
//@since 2004/04/08
//@author 上杉勝史
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.php");

require("CryptUtil.php");

require("Net/IPv4.php");

require("Authority.php");

require("Post.php");

require("model/GroupModel.php");

//
//ログイン後のデータ取得
//
//使用例
//ログインのチェックが必要なページに以下のソースを埋め込む<br>
//ログイン状態であれば、そのまま以降のソースの実行に移るが、<br>
//そうでない場合は、不正アクセスのページ表示を行う。
//<code>
//Login::getLogin();
//</code>
//
//グローバル変数にDBUtilとErrorUtilが存在しない場合はここで生成する。
//{@source 3 9}
//
//@param boolean $in : ログイン画面からの場合はtrueを設定
//
//
//ログイン時
//
//
//
//セッションが有効かどうか
//
//@return boolean
//
//
//有効時間のチェック
//
//@return boolean
//
//
//二重ログインチェック
//
//@since 2006/12/04
//@author ishizaki
//@return boolean
//
//
//ログアウト
//
//
//ショップセッションが付いていたら、それを戻してショップに戻る
//
//@author nakanita
//@since 2008/06/13
//
//@access public
//@return void
//
//
//Jokerログイン
//
//履歴<br>
//[修　正] 2006/12/19　石崎　ユーザーポストIDもセレクト
//
//
//アジコムログイン
//
//
//IP制限のチェック
//
//@param int 企業コード
//
//
//パスワードのフォーマットチェック
//
//会社権限を調べて、パスワード有効期限の確認<br>
//ユーザー権限を調べてパスワード変更権限の確認<br>
//両方ともある場合は、パスワードの有効期限が切れているか、いないかの確認
//
//@param int userid
//@param int postid
//@param boolean typeはtrueが渡されたとき、ジャンプ動作をしない
//
//
//有効期限切れフラグをON
//
//パスワード変更権限がある場合は変更ページへ飛ばす
//
//@param Array A_auth 現在の所有権限一覧配列
//@param boolean type
//@param int out
//{@source}
//
class Login {
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
				Login.chkDB();
				Login.checkPassWordLimit(_SESSION.userid, _SESSION.pactid);
			} else //POSTでloginパラメータがあればログイン画面とみなす
			{
				if (undefined !== _POST.login && _POST.login == "login") //20040628森原修正
					//DBから値を取得しパスワードチェック後セッション生成
					{
						Login.chkDB();
						Login.checkPassWordLimit(_SESSION.userid, _SESSION.pactid);
					} else //ログインしているかのチェック
					{
						if (Login.chkSession() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSession");
						}

						if (Login.chkSessTime() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSessTime");
						}

						if (Login.chkDoubleLogin() == false) {
							GLOBALS.GO_errlog.errorOut(11, "chkSessDoubleLogin");
						}

						var sql = "select " + "pact_tb.pactid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "user_tb.type," + "user_tb.userid," + "pact_tb.type, " + "pact_tb.helpfile, " + "coalesce(user_tb.language,'JPN') as language " + "from " + "user_tb," + "pact_tb," + "post_tb " + "where " + "user_tb.pactid = pact_tb.pactid " + "and user_tb.pactid = post_tb.pactid " + "and user_tb.postid = post_tb.postid " + "and user_tb.userid = " + _SESSION.userid;
						var A_result = GLOBALS.GO_db.getRow(sql);

						if (A_result.length == 0) {
							var O_group = new GroupModel();
							var goto = "/" + O_group.getGroupName(_SESSION.groupid);
							var auth = new Authority();

							if (auth.chkPactAuth(206, _SESSION.pactid)) {
								goto += "/" + auth.getUseridIni(_SESSION.pactid) + "/";
							}

							GLOBALS.GO_errlog.warningOut(25, "\u30E6\u30FC\u30B6\u524A\u9664", 1, goto, "\u30ED\u30B0\u30A4\u30F3\u30DA\u30FC\u30B8\u3078");
						}

						if (Login.checkIPrestrict(A_result[0]) == false) {
							session_unset();
							GLOBALS.GO_errlog.errorOut(29, "IP\u5236\u9650\u30ED\u30B0\u30A4\u30F3 usercd: " + A_result[0], 0);
						}

						_SESSION.pactid = A_result[0];

						if (_SESSION.compname == "") //第二階層参照権限対応 20060328miya
							{
								_SESSION.compname = A_result[1];
							}

						_SESSION.postid = A_result[2];
						_SESSION.postname = A_result[3];
						_SESSION.userid = A_result[5];
						_SESSION.pacttype = A_result[6];
						_SESSION.helpfile = A_result[7];
						_SESSION.language = A_result[8];
						O_group = new GroupModel();
						_SESSION.grouptitle = O_group.getGroupTitle(_SESSION.groupid, _SESSION.pacttype, _SESSION.language);

						if (A_result[4] == "SU") {
							_SESSION.su = true;
						} else {
							_SESSION.su = false;
						}

						_SESSION.limit_time = Date.now() / 1000 + 60 * GLOBALS.G_sesslimit;

						if (KCS_DIR != "/kcs") {
							_SESSION.TRY = 1;
						}

						GLOBALS.GROUPID = _SESSION.groupid;
					}
			}
	}

	chkDB() //第二階層部署名参照 20060328miya
	//権限チェック
	//第二階層書き換えを行ったかどうかを示す
	//会社権限に二重ログイン禁止が設定されているか確認
	//設定されている場合は、login_rel_sess_tb にログイン情報を書き込む
	//2006/11/24 K.Ishizaki
	//コピーライト表示の有無
	//20061213 石崎　ユーザー部署ID 取得
	{
		var userid_ini = _POST.userid_ini.trim();

		var loginid = _POST.loginid.trim();

		var password = _POST.password;

		if (userid_ini == "" || loginid == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(5, "\u9867\u5BA2\u30B3\u30FC\u30C9\u3001\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "user_tb.userid," + "user_tb.username," + "pact_tb.pactid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "user_tb.passwd," + "user_tb.type," + "pact_tb.logo," + "pact_tb.manual," + "pact_tb.inquiry," + "pact_tb.type, " + "pact_tb.helpfile, " + "post_relation_tb.level, " + "pact_tb.groupid " + "from " + "user_tb," + "pact_tb," + "post_tb," + "post_relation_tb " + "where " + "user_tb.pactid = pact_tb.pactid " + "and user_tb.pactid = post_tb.pactid " + "and user_tb.postid = post_tb.postid " + "and post_relation_tb.postidchild = post_tb.postid " + "and pact_tb.userid_ini = '" + userid_ini + "' " + "and user_tb.loginid = '" + loginid + "'";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(9, "\u30E6\u30FC\u30B6\u304C\u3042\u308A\u307E\u305B\u3093 usercd: " + A_result[0], 0);
		}

		var O_crypt = new CryptUtil();

		if (A_result[6] != O_crypt.getCrypt(password)) //if($A_result[6] != $password){
			//Hotline移植対応 20060228miya
			{
				if (A_result[6] == md5(password)) //旧ホットラインのパスワードに合致したら、ここでV2方式に書き換えてしまう
					//COMMIT
					{
						var upd_user_sql = "update user_tb set " + "passwd = '" + O_crypt.getCrypt(password) + "'," + "fixdate = '" + date("Y-m-d H:i:s") + "' " + "where " + "userid = " + A_result[0];
						GLOBALS.GO_db.query(upd_user_sql);
						GLOBALS.GO_db.commit();
					} else {
					session_unset();
					GLOBALS.GO_errlog.errorOut(9, "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059 usercd: " + A_result[0], 0);
				}
			}

		if (Login.checkIPrestrict(A_result[2]) == false) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(29, "IP\u5236\u9650 usercd: " + A_result[0], 0);
		}

		session_unset();
		_SESSION.userid = A_result[0];
		_SESSION.pactid = A_result[2];
		_SESSION.groupid = A_result[14];
		_SESSION.compname = A_result[3];
		_SESSION.postid = A_result[4];
		_SESSION.current_postid = A_result[4];
		_SESSION.postname = A_result[5];
		_SESSION.current_postname = A_result[5];
		_SESSION.loginid = loginid;

		if (_POST.loginname != "") {
			_SESSION.loginname = _POST.loginname;
		} else {
			_SESSION.loginname = A_result[1];
		}

		if (A_result[7] == "SU") {
			_SESSION.su = true;
		} else {
			_SESSION.su = false;
		}

		_SESSION.logo = A_result[8].trim();
		_SESSION.manual = A_result[9].trim();
		_SESSION.inq_mail = A_result[10].trim();
		_SESSION.pacttype = A_result[11];
		_SESSION.helpfile = A_result[12];
		_SESSION.level = A_result[13];
		_SESSION.limit_time = Date.now() / 1000 + 60 * GLOBALS.G_sesslimit;
		var O_group = new GroupModel();
		_SESSION.grouptitle = O_group.getGroupTitle(_SESSION.groupid, _SESSION.pacttype);
		var O_auth = new Authority();
		var A_co_auth = O_auth.getAllPactAuth(_SESSION.pactid);
		var lv1flag = false;

		for (var i = 0; i < A_co_auth.length; i++) //第二階層（level=1）を参照するよう権限設定されていたら$_SESSION["compname"]を上書きする
		{
			if (A_co_auth[i] == NOT_VIEW_ROOT) {
				var O_post = new Post();
				var lv1postid = O_post.getTargetRootPostid(_SESSION.pactid, _SESSION.postid, "post_relation_tb", 2);
				var lv1sql = "SELECT postname FROM post_tb WHERE pactid=" + _SESSION.pactid + " AND postid=" + lv1postid;
				_SESSION.compname = GLOBALS.GO_db.getOne(lv1sql);
				lv1flag = true;
				break;
			}
		}

		if (-1 !== A_co_auth.indexOf(67) == true) {
			var pact_user_sql = "SELECT * FROM login_rel_sess_tb WHERE userid = " + _SESSION.userid;
			var A_pact_user_num = GLOBALS.GO_db.getHash(pact_user_sql);
			var session_number = session_id();

			if (A_pact_user_num.length == 0) {
				pact_user_sql = "INSERT INTO login_rel_sess_tb(pactid, userid, sess)values(";
				pact_user_sql += _SESSION.pactid + "," + _SESSION.userid + ",'" + session_number + "')";
				GLOBALS.GO_db.query(pact_user_sql);
				_SESSION.session_number = session_number;
			} else if (A_pact_user_num.length == 1) {
				pact_user_sql = "UPDATE login_rel_sess_tb SET sess = '" + session_number + "' WHERE pactid = " + _SESSION.pactid + " and userid = " + _SESSION.userid;
				GLOBALS.GO_db.query(pact_user_sql);
			} else {
				session_unset();
				GLOBALS.GO_errlog.errorOut(9, "\u30ED\u30B0\u30A4\u30F3\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u7BA1\u7406\u8005\u306B\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002 usercd: " + A_result[0], 0);
			}
		}

		if (lv1flag == true) //第二階層書き換えの場合
			//TOP部署名に書き換えた第二階層部署名を持ってくる
			{
				_SESSION.toppostname = _SESSION.compname;

				if (_SESSION.level > 0) //スーパーユーザーでもマイナスにならないように
					//部署レベルを１段下げる
					{
						_SESSION.level = _SESSION.level - 1;
					}
			} else //通常通りTOPから表示の場合
			{
				if (A_result[13] == 0) //TOP部署か？
					//TOP部名=現行部署名
					{
						_SESSION.toppostname = _SESSION.postname;
					} else //TOP部署でなければ、TOP部署名を検索して表示する
					{
						sql = "select post_tb.postname from post_tb, post_relation_tb " + "where post_tb.pactid=" + _SESSION.pactid + " and post_tb.postid = post_relation_tb.postidparent " + " and post_relation_tb.level = 0";
						_SESSION.toppostname = GLOBALS.GO_db.getOne(sql);
					}
			}

		var get_copyright = "select count(fncid) from fnc_relation_tb where fncid=" + COPYRIGHT + " and pactid=" + A_result[2];
		_SESSION.copyright = GLOBALS.GO_db.getOne(get_copyright);

		if (KCS_DIR != "/kcs") {
			_SESSION.TRY = 1;
		}

		setcookie("ini", userid_ini, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("uid", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		var userpostid_sql = "select userpostid from post_tb where postid = " + _SESSION.postid;
		var H_userpostid = GLOBALS.GO_db.getHash(userpostid_sql);
		var userpostname = _SESSION.postname;

		if (H_userpostid.userpostid != "") {
			userpostname += "(" + H_userpostid[0].userpostid + ")";
		}

		var ins_mng_sql = "insert into mnglog_tb" + "(pactid,postid,userid,recdate,comment1,comment2,username,kind,type,postname,joker_flag,,comment1_eng,comment2_eng) " + "values(" + _SESSION.pactid + "," + _SESSION.postid + "," + _SESSION.userid + "," + "'" + date("Y-m-d H:i:s") + "'," + "'ID\uFF1A" + loginid + "'," + "'\u30ED\u30B0\u30A4\u30F3\u8A8D\u8A3C'," + "'" + GLOBALS.GO_db.escapeSimple(_SESSION.loginname) + "'," + "'L'," + "'\u30ED\u30B0\u30A4\u30F3'," + "'" + GLOBALS.GO_db.escapeSimple(userpostname) + "'," + "0," + "'ID\uFF1A" + loginid + "'," + "'Login')";
		GLOBALS.GO_db.query(ins_mng_sql);
	}

	chkSession() {
		if (is_numeric(_SESSION.userid) == true && is_numeric(_SESSION.pactid) == true && is_numeric(_SESSION.postid) == true) //ログインしている
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
		if (_SESSION.limit_time < 1) //未ログインのエラー
			{
				session_unset();
				GLOBALS.GO_errlog.errorOut(10, "userid: " + _SESSION.userid, 0);
			}

		if (_SESSION.limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //有効時間外エラー
			{
				var pacttype = _SESSION.pacttype;
				var groupid = _SESSION.groupid;
				var pactid = _SESSION.pactid;
				GLOBALS.GROUPID = _SESSION.groupid;
				session_unset();
				_SESSION.pacttype = pacttype;
				_SESSION.groupid = groupid;
				_SESSION.pid = pactid;
				GLOBALS.GO_errlog.errorOut(7, "userid: " + _SESSION.userid, 0);
			}

		return false;
	}

	chkDoubleLogin() //成り代わりフラグがついていない場合のみ処理
	{
		if (undefined !== _SESSION.narikawari == false) //会社権限で二重ログインがオンになっている場合のみ処理
			{
				var O_auth = new Authority();
				var A_co_auth = O_auth.getAllPactAuth(_SESSION.pactid);

				if (-1 !== A_co_auth.indexOf(67) == true) {
					var pact_user_sql = "SELECT * FROM login_rel_sess_tb WHERE userid = " + _SESSION.userid + " AND sess = '" + session_id() + "' -- " + _POST.narikawari;

					var A_pact_user_num = GLOBALS.GO_db.getHash(pact_user_sql);

					if (A_pact_user_num.length != 1) {
						var pid = _SESSION.pactid;
						session_unset();
						_SESSION.pid = pid;
						GLOBALS.GO_errlog.errorOut(32, "userid: " + _SESSION.userid + "-sess: " + session_id(), 0);
						return false;
					}
				}
			}

		return true;
	}

	logOut() //ユーザ管理記録に書き込む
	//DBUtilオブジェクト
	//もしショップからの成り代わりだったら、ショップに戻る
	//2008.06.11 by T.naka
	{
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var userpostid_sql = "select userpostid from post_tb where postid = " + _SESSION.postid;
		var H_userpostid = GLOBALS.GO_db.getHash(userpostid_sql);
		var userpostname = _SESSION.postname;

		if (H_userpostid.userpostid != "") {
			userpostname += "(" + H_userpostid[0].userpostid + ")";
		}

		if (undefined !== _SESSION.joker == true && _SESSION.joker == 1) {
			var joker_flag = 1;
		} else {
			joker_flag = 0;
		}

		var ins_mng_sql = "insert into mnglog_tb" + "(pactid,postid,userid,recdate,comment1,comment2,username,kind,type,postname,joker_flag,comment1_eng,comment2_eng) " + "values(" + _SESSION.pactid + "," + _SESSION.postid + "," + _SESSION.userid + "," + "'" + date("Y-m-d H:i:s") + "'," + "'ID\uFF1A" + _SESSION.loginid + "'," + "'\u30ED\u30B0\u30A2\u30A6\u30C8\u51E6\u7406'," + "'" + GLOBALS.GO_db.escapeSimple(_SESSION.loginname) + "'," + "'L'," + "'\u30ED\u30B0\u30A2\u30A6\u30C8'," + "'" + GLOBALS.GO_db.escapeSimple(userpostname) + "'," + joker_flag + "," + "'ID\uFF1A" + _SESSION.loginid + "'," + "'Logout')";
		GLOBALS.GO_db.query(ins_mng_sql);
		Login.restoreShop();
		session_unset();
	}

	restoreShop() //ショップセッションが無ければ、何事もなくリターン
	//現行セッションを一度全てクリアーする
	//ショップセッションを元に戻す
	//ishizaki
	//ショップメニューに飛ぶ
	{
		if (undefined !== _SESSION.SAVE_SESSION_SHOP == false) {
			return;
		}

		var H_shopkey = Array();
		{
			let _tmp_0 = _SESSION.SAVE_SESSION_SHOP;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];
				H_shopkey[key] = val;
			}
		}
		session_unset();

		for (var key in H_shopkey) {
			var val = H_shopkey[key];
			_SESSION[key] = val;
		}

		header("Location: /Shop/menu.php");
		throw die(0);
	}

	JokerLogin() //ユーザー部署ID が空でないなら
	//Jokerはログイン名必須
	//第二階層書き換えを行ったかどうかを示す
	//会社名ではなくTOP部署名を表示する 20060727naka
	//コピーライト表示の有無
	//成り代わりの時 20070611 houshiyama
	//ユーザ管理記録に書き込む
	{
		var userid_ini = _POST.userid_ini.trim();

		var loginid = _POST.loginid.trim();

		if (userid_ini == "" || loginid == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(5, "\u9867\u5BA2\u30B3\u30FC\u30C9\u3001\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "user_tb.userid," + "user_tb.username," + "pact_tb.pactid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "user_tb.passwd," + "user_tb.type," + "pact_tb.logo," + "pact_tb.manual," + "pact_tb.inquiry," + "pact_tb.type, " + "pact_tb.helpfile, " + "post_relation_tb.level, " + "post_tb.userpostid " + "from " + "user_tb," + "pact_tb," + "post_tb," + "post_relation_tb " + "where " + "user_tb.pactid = pact_tb.pactid " + "and user_tb.pactid = post_tb.pactid " + "and user_tb.postid = post_tb.postid " + "and post_relation_tb.postidchild = post_tb.postid ";

		if (_SESSION.pactid != "") //joker.phpにはSESSIONがないので（jokerexにはある）if文追加 20060713miya
			//loginidがダブった別会社を除くためpactid追加 20060630miya
			{
				sql += "and pact_tb.pactid = " + _SESSION.pactid + " ";
			}

		sql += "and pact_tb.userid_ini = '" + userid_ini + "' " + "and user_tb.loginid = '" + loginid + "'";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(9, "\u30E6\u30FC\u30B6\u304C\u3042\u308A\u307E\u305B\u3093 usercd: " + A_result[0], 0);
		}

		session_unset();
		_SESSION.userid = A_result[0];
		_SESSION.pactid = A_result[2];
		_SESSION.compname = A_result[3];
		_SESSION.postid = A_result[4];
		_SESSION.current_postid = A_result[4];
		_SESSION.postname = A_result[5];

		if (A_resutlt[14] != "") {
			_SESSION.postname += "(" + A_resutlt[14] + ")";
		}

		_SESSION.current_postname = A_result[5];
		_SESSION.loginid = loginid;
		_SESSION.loginname = _POST.loginname;

		if (A_result[7] == "SU") {
			_SESSION.su = true;
		} else {
			_SESSION.su = false;
		}

		_SESSION.logo = A_result[8].trim();
		_SESSION.manual = A_result[9].trim();
		_SESSION.inq_mail = A_result[10].trim();
		_SESSION.pacttype = A_result[11];
		_SESSION.helpfile = A_result[12];
		_SESSION.level = A_result[13];
		_SESSION.limit_time = Date.now() / 1000 + 60 * GLOBALS.G_sesslimit;
		_SESSION.joker = 1;

		if (KCS_DIR != "/kcs") {
			_SESSION.TRY = 1;
		}

		var O_auth = new Authority();
		var A_co_auth = O_auth.getAllPactAuth(_SESSION.pactid);
		var lv1flag = false;

		for (var i = 0; i < A_co_auth.length; i++) //第二階層（level=1）を参照するよう権限設定されていたら$_SESSION["compname"]を上書きする
		{
			if (A_co_auth[i] == NOT_VIEW_ROOT) {
				var O_post = new Post();
				var lv1postid = O_post.getTargetRootPostid(_SESSION.pactid, _SESSION.postid, "post_relation_tb", 2);
				var lv1sql = "SELECT postname FROM post_tb WHERE pactid=" + _SESSION.pactid + " AND postid=" + lv1postid;
				_SESSION.compname = GLOBALS.GO_db.getOne(lv1sql);
				lv1flag = true;
				break;
			}
		}

		if (lv1flag == true) //第二階層書き換えの場合
			//TOP部署名に書き換えた第二階層部署名を持ってくる
			{
				_SESSION.toppostname = _SESSION.compname;

				if (_SESSION.level > 0) //スーパーユーザーでもマイナスにならないように
					//部署レベルを１段下げる
					{
						_SESSION.level = _SESSION.level - 1;
					}
			} else //通常通りTOPから表示の場合
			{
				if (A_result[13] == 0) //TOP部署か？
					//TOP部名=現行部署名
					{
						_SESSION.toppostname = _SESSION.postname;
					} else //TOP部署でなければ、TOP部署名を検索して表示する
					{
						sql = "select post_tb.postname from post_tb, post_relation_tb " + "where post_tb.pactid=" + _SESSION.pactid + " and post_tb.postid = post_relation_tb.postidparent " + " and post_relation_tb.level = 0";
						_SESSION.toppostname = GLOBALS.GO_db.getOne(sql);
					}
			}

		var get_copyright = "select count(fncid) from fnc_relation_tb where fncid=" + COPYRIGHT + " and pactid=" + A_result[2];
		_SESSION.copyright = GLOBALS.GO_db.getOne(get_copyright);

		if (undefined !== _SESSION.joker == true && _SESSION.joker == 1) {
			var joker_flg = 1;
		} else {
			joker_flg = 0;
		}

		var ins_mng_sql = "insert into mnglog_tb" + "(pactid,postid,postname,userid,recdate,comment1,comment2,username,kind,type,joker_flag,comment1_eng,comment2_eng) " + "values(" + _SESSION.pactid + "," + _SESSION.postid + "," + "'" + GLOBALS.GO_db.escapeSimple(_SESSION.postname) + "'," + _SESSION.userid + "," + "'" + date("Y-m-d H:i:s") + "'," + "'ID\uFF1A" + loginid + "'," + "'\u30ED\u30B0\u30A4\u30F3\u8A8D\u8A3C'," + "'" + GLOBALS.GO_db.escapeSimple(_SESSION.loginname) + "'," + "'L'," + "'\u30ED\u30B0\u30A4\u30F3'," + joker_flg + "," + "'ID\uFF1A" + loginid + "'," + "'Login')";
		GLOBALS.GO_db.query(ins_mng_sql);
	}

	AjiLogin() //ログイン名
	//コピーライト表示の有無
	//ユーザ管理記録に書き込む
	{
		var userid_ini = _POST.userid_ini.trim();

		var loginid = _POST.loginid.trim();

		if (userid_ini == "" || loginid == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(5, "\u9867\u5BA2\u30B3\u30FC\u30C9\u3001\u30ED\u30B0\u30A4\u30F3ID\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "user_tb.userid," + "user_tb.username," + "pact_tb.pactid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "user_tb.passwd," + "user_tb.type," + "pact_tb.logo," + "pact_tb.manual," + "pact_tb.inquiry, " + "pact_tb.helpfile " + "from " + "user_tb," + "pact_tb," + "post_tb " + "where " + "user_tb.pactid = pact_tb.pactid " + "and user_tb.pactid = post_tb.pactid " + "and user_tb.postid = post_tb.postid " + "and pact_tb.userid_ini = '" + userid_ini + "' " + "and user_tb.loginid = '" + loginid + "'";
		var A_result = GLOBALS.GO_db.getRow(sql);

		if (A_result.length == 0) {
			session_unset();
			GLOBALS.GO_errlog.errorOut(9, "\u30E6\u30FC\u30B6\u304C\u3042\u308A\u307E\u305B\u3093 usercd: " + A_result[0], 0);
		}

		session_unset();
		_SESSION.userid = A_result[0];
		_SESSION.pactid = A_result[2];
		_SESSION.compname = A_result[3];
		_SESSION.postid = A_result[4];
		_SESSION.current_postid = A_result[4];
		_SESSION.postname = A_result[5];
		_SESSION.current_postname = A_result[5];
		_SESSION.loginid = loginid;
		_SESSION.ajiloginname = _POST.ajiloginname;
		_SESSION.loginname = _POST.loginname;

		if (A_result[7] == "SU") {
			_SESSION.su = true;
		} else {
			_SESSION.su = false;
		}

		_SESSION.logo = A_result[8].trim();
		_SESSION.manual = A_result[9].trim();
		_SESSION.inq_mail = A_result[10].trim();
		_SESSION.helpfile = A_result[11].trim();
		_SESSION.limit_time = Date.now() / 1000 + 60 * GLOBALS.G_sesslimit;
		_SESSION.aji = 1;

		if (KCS_DIR != "/kcs") {
			_SESSION.TRY = 1;
		}

		_SESSION.level = 0;
		_SESSION.toppostname = _SESSION.postname;
		var get_copyright = "select count(fncid) from fnc_relation_tb where fncid=" + COPYRIGHT + " and pactid=" + A_result[2];
		_SESSION.copyright = GLOBALS.GO_db.getOne(get_copyright);
		var ins_mng_sql = "insert into mnglog_tb" + "(pactid,postid,userid,recdate,comment1,comment2,username,kind,type) " + "values(" + _SESSION.pactid + "," + _SESSION.postid + "," + _SESSION.userid + "," + "'" + date("Y-m-d H:i:s") + "'," + "'ID\uFF1A" + loginid + "'," + "'\u30ED\u30B0\u30A4\u30F3\u8A8D\u8A3C'," + "'" + GLOBALS.GO_db.escapeSimple(_SESSION.loginname) + "'," + "'L'," + "'\u30ED\u30B0\u30A4\u30F3')";
		GLOBALS.GO_db.query(ins_mng_sql);
	}

	checkIPrestrict(pactid) //接続元IP
	//一件も制限がなかったらなんでも通す
	//制限にかからなかったら通さない
	{
		var remote = _SERVER.REMOTE_ADDR;

		if (remote == "") {
			session_unset();
			GLOBALS.GO_errlog.errorOut(29, "\u63A5\u7D9A\u5143IP\u304C\u4E0D\u6B63\uFF1A " + remote, 0);
		}

		var A_okip = ["210.147.199.166", "210.248.145.56", "222.151.209.224"];

		if (-1 !== A_okip.indexOf(remote) == true) {
			return true;
		}

		var sql = "select net,start_time,end_time,week,type from ip_restrict_tb where pactid=" + pactid + " order by sort";
		var H_list = GLOBALS.GO_db.getHash(sql);
		var cnt = H_list.length;

		if (cnt == 0) {
			return true;
		}

		var A_now = preg_split("/:/", date("H:m:i"));
		var now = mktime(A_now[0], A_now[1], A_now[2], 1, 1, 2000);

		for (var i = 0; i < cnt; i++) {
			if (H_list[i].net == remote || NET_IPv4.ipInNetwork(remote, H_list[i].net) == true) //時間帯
				{
					var A_stime = preg_split("/:/", H_list[i].start_time);
					var stime = mktime(A_stime[0], A_stime[1], A_stime[2], 1, 1, 2000);
					var A_etime = preg_split("/:/", H_list[i].end_time);
					var etime = mktime(A_etime[0], A_etime[1], A_etime[2], 1, 1, 2000);

					if (now >= stime && now <= etime && H_list[i].week[date("w")] == 1) //制限
						{
							if (H_list[i].type == "allow") {
								return true;
							} else {
								return false;
							}
						}
				}
		}

		return false;
	}

	checkPassWordLimit(uid, pactid, type = false) //まずはパス有効期限の権限がある会社か？
	{
		var O_auth = new Authority();
		var A_auth = O_auth.getAllPactAuth(pactid);
		var A_auth2 = O_auth.getAllUserAuth(uid);
		A_auth = array_merge(A_auth, A_auth2);

		if (-1 !== A_auth.indexOf(74) == true) //パスワードの有効時間を取得
			{
				var sqlstr = "select passchanged from user_tb where userid = " + uid;
				var pass_lim = GLOBALS.GO_db.getOne(sqlstr);

				if (pass_lim == "") //パスワード変更日が空（権限追加後初アクセスなど）
					//パスワード変更画面へ飛ばす
					{
						Login.jumpPassChage(A_auth, type, 0);
					} else {
					var date_exe = pass_lim.split(" ");
					date_exe[1] = date("Y-m-d");
					var change_days = GLOBALS.GO_db.getOne("SELECT to_date('" + date_exe[1] + "','yyyy-mm-dd') - to_date('" + date_exe[0] + "','yyyy-mm-dd') from user_tb limit 1");

					if (change_days > G_PASSWORD_LIM) {
						Login.jumpPassChage(A_auth, type, 1);
					} else {
						delete _SESSION.passOUT;
					}
				}
			}
	}

	jumpPassChage(A_auth, type, out) {
		session_start();

		if (out == 0) {
			_SESSION.passOUT = "ON";
		} else {
			_SESSION.passOUT = "OFF";
		}

		if (-1 !== A_auth.indexOf(56) && type == false) {
			header("Location: /Menu/chg_password.php");
			throw die();
		}
	}

};