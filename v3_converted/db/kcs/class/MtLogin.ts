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
//2009/08/26 前田 ログイン記録英語化対応
//
//@package Base
//@subpackage Login
//@filesource
//@author katsushi
//@since 2008/03/14
//
//
//require_once("Post.php");	// 第二階層参照権限対応 20060328miya
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

// require("model/LoginModel.php");

// require("MtOutput.php");

// require("MtSession.php");

// require("MtAuthority.php");

// require("MtCryptUtil.php");

// require("MtPostUtil.php");

require("Net/IPv4.php");

// require("model/GroupModel.php");

// require("model/PactModel.php");

import MtOutput from './MtOutput';
import MtSession from './MtSession';
import MtAuthority from './MtAuthority';
import MtCryptUtil from './MtCryptUtil';
import MtPostUtil from './MtPostUtil';
import GroupModel from './model/GroupModel';
import PactModel from './model/PactModel';
import MtSetting from './MtSetting';
import LoginModel from './model/LoginModel';
import PostModel from './model/PostModel';
import MtShopLogin from './MtShopLogin';

//ショップ成り代わり時に保存するセッション名
//
//ログインで使用するモデル
//
//@var object
//@access private
//
//
//MtOutputオブジェクト
//
//@var object
//@access private
//
//
//セッションオブジェクト
//
//@var object
//@access private
//
//
//基本設定オブジェクト
//
//@var mixed
//@access private
//
//
//MtCryptUtilオブジェクト
//
//@var object
//@access private
//
//
//GroupModelオブジェクト
//
//@var mixed
//@access private
//
//
//コンストラクタ
//
//@author katsushi
//@since 2008/03/14
//
//@access public
//@return void
//
//
//ただ１つしか無いこのクラスのインスタンスを取得する
//new の代わりに、このメソッドによってインスタンスを得ること
//
//@author nakanita
//@since 2008/04/22
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
//パスワードの有効期限チェック
//
//会社権限を調べて、パスワード有効期限の確認<br>
//ユーザー権限を調べてパスワード変更権限の確認<br>
//両方ともある場合は、パスワードの有効期限が切れているか、いないかの確認
//
//@author nakanita
//@since 2008/04/24
//
//@param integer $pactid
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
//@param integer pactid
//@param integer uid
//@param boolean type
//@param int out
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
//@param integer $pactid
//@param integer $userid
//@access public
//@return boolean
//
//
//IP制限のチェック
//
//@author katsushi
//@since 2008/03/17
//
//@param integer $pactid
//@access public
//@return boolean
//
//
//第二階層表示の補正処理
//
//@author nakanita
//@since 2008/06/23
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $level
//@param mixed $postname
//@access private
//@return void
//
//
//コピーライト表示権限の有無をチェックする
//
//@author nakanita
//@since 2008/06/23
//
//@param integer $pactid
//@access private
//@return boolean コピーライト表示権限ありのときtrue
//
//
//ログインチェックを行う
//
//@author nakanita
//@since 2008/04/23
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
//@param string $userid_ini
//@param string $loginid
//@param string $password
//@param integer $groupid
//@param string $loginname
//@access public
//@return void
//
//
//ログイン時にセッションを設定する共通部分
//
//@author nakanita
//@since 2008/06/23
//
//@param mixed $H_userinfo
//@param boolean $joker
//@access private
//@return void
//
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
//成り代わりログインを行う。ショップから一般ユーザーへの成り代わり。
//
//@author nakanita
//@since 2008/06/03
//
//@param mixed $userid_ini
//@param mixed $loginid
//@param string $loginname
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
//もしショップセッションが残っていたら、それを戻してショップメニューに移動する<br/>
//セッションが残っていた場合、この関数内でExitするので注意
//
//@author nakanita
//@since 2008/06/13
//
//@access private
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
const fs = require("fs");
const MD5 = require("crypto-js/md5");
export default class MtLogin {
	static SAVE_SESSION_SHOP = "SAVE_SESSION_SHOP";
	static O_Instance;
	O_Out: any;
	O_Conf: any;
	O_Sess: any;
	O_Model: any;
	O_group: GroupModel;
	O_Crypt: any;
	loginid: any;

	constructor() {
		this.O_Out = MtOutput.singleton();
		this.O_Sess = MtSession.singleton();
		this.O_Conf = MtSetting.singleton();
		this.O_Conf.loadConfig("group");
		this.O_Model = new LoginModel();
		this.O_group = new GroupModel();
	}

	static singleton() //まだインスタンスが生成されていなければ
	{
		if (MtLogin.O_Instance == undefined) {
			MtLogin.O_Instance = new MtLogin();
		}

		return MtLogin.O_Instance;
	}

	checkSession() {
		if (!isNaN(Number(this.O_Sess.userid)) == true && !isNaN(Number(this.O_Sess.pactid)) == true && !isNaN(Number(this.O_Sess.postid)) == true) //ログインしている
			{
				return true;
			}

		return false;
	}

	checkSessionLimit() {
		if (!isNaN(Number(this.O_Sess.limit_time)) == false || this.O_Sess.limit_time < 1) //未ログインのエラー
			{
				this.errorPattern("Session", this.O_Sess.userid);
			}

		if (this.O_Sess.limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //有効時間外
			{
				return false;
			}
	}

	checkPassword(H_userinfo, input_passwd) {
		this.O_Crypt = MtCryptUtil.singleton();

		if (H_userinfo.passwd != this.O_Crypt.getCrypt(input_passwd)) //Hotlineのパスワードチェック
			{
				if (H_userinfo.passwd == MD5(input_passwd).toString()) //Hotlineと合致した場合は新パスワードへの暗号化処理
					{
						this.O_Model.updateUserPassword(H_userinfo.userid, this.O_Crypt.getCrypt(input_passwd));
					} else {
					return false;
				}
			}

		return true;
	}

	checkPassWordLimit(pactid, uid, type = false) //まずはパス有効期限の権限がある会社か？
	{
		var O_auth:any = MtAuthority.singleton(pactid);

		if (O_auth.chkPactFuncIni("fnc_password_limit") == true) //パスワードの有効時間を取得
			{
				var pass_lim = this.O_Model.getLoginPasschanged(uid);

				if (pass_lim == "") //パスワード変更日が空（権限追加後初アクセスなど）
					//パスワード変更画面へ飛ばす
					{
						this.jumpPassChage(pactid, uid, type, 0);
					} else {
					var date_exe = pass_lim.split(" ");
					date_exe[1] = new Date().toJSON().slice(0,10).replace(/-/g,'-');
					var change_days = (Date.parse(date_exe[1]) - Date.parse(date_exe[0])) / (24 * 60 * 60);

					if (change_days > this.O_Conf.password_limit) {
						this.jumpPassChage(pactid, uid, type, 1);
					} else {
						delete _SESSION.passOUT;
					}
				}
			}
	}

	jumpPassChage(pactid, uid, type, out) {
		session_start();

		if (out == 0) //初期パスワードはそのまま利用できません。新しいパスワードを設定してください
			{
				_SESSION.passOUT = "ON";
			} else //パスワードの有効期限が過ぎました。新しいパスワードを設定してください
			{
				_SESSION.passOUT = "OFF";
			}

		var O_auth:any = MtAuthority.singleton(pactid);

		if (O_auth.chkUserFuncIni(uid, "fnc_chg_pass") == true && type == false) {
			header("Location: /Menu/chg_password.php");
			throw process.exit(0);
		}
	}

	writeLoginRelSess(pactid, userid) //会社権限に二重ログイン禁止が設定されているか確認
	//２重ログイン権限があれば
	//成功
	{
		var O_auth:any = MtAuthority.singleton(pactid);

		if (O_auth.chkPactFuncIni("fnc_double_login") == true) //設定されている場合は、login_rel_sess_tb にログイン情報を書き込む
			{
				var sess_id = session_id();
				var result = this.O_Model.setLoginSessInfo(pactid, userid, sess_id);

				if (result == 0) //失敗
					{
						session_unset();
						return false;
					}
			}

		return true;
	}

	checkDoubleLogin(pactid, userid) //成り代わりフラグがついていない場合のみ処理
	{
		if (this.O_Sess.narikawari === undefined) //会社権限で二重ログインがオンになっている場合のみ処理
			//２重ログイン権限があれば
			{
				var O_auth:any = MtAuthority.singleton(pactid);

				if (O_auth.chkPactFuncIni("fnc_double_login") == true) //, $narikawari );
					{
						var sess_id = session_id();
						var A_pact_user_num = this.O_Model.getLoginSessInfo(pactid, userid, sess_id);

						if (A_pact_user_num.length != 1) //$this->O_Out->errorOut(32, "userid: " . $userid . "-sess: " . $sess_id, 0);
							{
								global.GROUPID = _SESSION.groupid;
								var pid = _SESSION.pactid;
								session_unset();
								_SESSION.pid = pid;
								return false;
							}
					}
			}

		return true;
	}

	checkIPrestrict(pactid) //接続元IP
	//一件も制限がなかったらなんでも通す
	//設定を一つずつ検証する
	//制限にかからなかったら通さない
	{
		var remote = process.REMOTE_ADDR;

		if (remote == "") {
			this.errorPattern("RemoteAddr", remote);
		}

		this.O_Conf.loadConfig("iprestrict");

		if (-1 !== this.O_Conf.A_ip_exclude.indexOf(remote) == true) {
			return true;
		}

		var A_list = this.O_Model.getIpRestrict(pactid);
		var cnt = A_list.length;

		if (cnt === 0) {
			return true;
		}

		var A_now:any = new Date().toLocaleTimeString().split(":");
		var now = new Date(2000,1,1,A_now[0], A_now[1], A_now[2]);

		for (var i = 0; i < cnt; i++) {
			if (A_list[i].net == remote || NET_IPv4.ipInNetwork(remote, A_list[i].net) == true) //時間帯
				{
					var A_stime = A_list[i].start_time.split(":");
					var stime = new Date(2000,1,1,A_stime[0], A_stime[1], A_stime[2]);
					var A_etime = A_list[i].end_time.split(":");
					var etime = new Date(2000,1,1,A_etime[0], A_etime[1], A_etime[2]);

					if (now >= stime && now <= etime && A_list[i].week[date("w")] == 1) //制限
						{
							if (A_list[i].type == "allow") {
								return true;
							} else {
								return false;
							}
						}
				}
		}

		return false;
	}

	modify2ndLevel(pactid, postid, level, postname) //第二階層、ルート部署を表示しない設定を見る
	{
		var O_auth:any = MtAuthority.singleton(pactid);
		var lv1flag = O_auth.chkPactFuncIni("fnc_not_view_root");

		if (lv1flag == true) //第二階層書き換えの場合
			//会社名ではなくTOP部署名を表示する
			//TOP部署名に書き換えた第二階層部署名を持ってくる
			{
				var O_post = new MtPostUtil();
				var lv1postid = O_post.getTargetLevelPostid(postid, 2);

				if (lv1postid == false) //取得できなかったらroot部署にする
					//if( $lv1postid == false ){ // それでも何も取得できなければ
					// ToDo * rootなしエラー
					//}
					{
						lv1postid = O_post.getTargetLevelPostid(postid, 0);
					}

				var O_postmodel = new PostModel();
				var H_postdata = O_postmodel.getPostData(lv1postid);
				this.O_Sess.setGlobal("compname", H_postdata.postname);
				this.O_Sess.setGlobal("toppostname", H_postdata.postname);

				if (this.O_Sess.level > 0) //スーパーユーザーでもマイナスにならないように
					//部署レベルを１段下げる
					{
						this.O_Sess.setGlobal("level", level - 1);
					}
			} else //通常通りTOPから表示の場合
			{
				if (level == 0) //TOP部署か？
					//TOP部名=現行部署名
					{
						this.O_Sess.setGlobal("toppostname", postname);
					} else //TOP部署でなければ、TOP部署名を検索して表示する
					{
						O_post = new MtPostUtil();
						var rootpostid = O_post.getTargetLevelPostid(postid, 0);
						O_postmodel = new PostModel();
						H_postdata = O_postmodel.getPostData(rootpostid);
						this.O_Sess.setGlobal("toppostname", H_postdata.postname);
					}
			}
	}

	checkCopyRight(pactid) //コピーライト表示権限の有無をチェックする
	{
		var O_auth:any = MtAuthority.singleton(pactid);
		return O_auth.chkPactFuncIni("fnc_copyright");
	}

	checkLogin() //POST["login"]があればログイン画面からの入力
	{
		if (undefined !== _POST.login == true && _POST.login == "login") //POSTデータチェック
			{
				if (undefined !== _POST.userid_ini == false || undefined !== _POST.loginid == false || undefined !== _POST.password == false || undefined !== _POST.group == false) {
					this.errorPattern("NoInput");
				}

				this.setLogin(_POST.userid_ini.trim(), _POST.loginid.trim(), _POST.password.trim(), _POST.group.trim());
				header("Location: " + process.PHP_SELF);
				throw process.exit(0);
			} else //ログイン中の場合は情報の更新処理
			{
				this.refreshLogin();
			}
	}

	setLogin(userid_ini, loginid, password, groupid, loginname = "") //ユーザー情報の取得
	//パスワードチェック
	//セッションへの書き込み
	//第二階層対応
	//コピーライト表示の有無
	//ユーザ管理記録に書き込む
	//パスワードの有効期限チェック
	{
		var H_userinfo = this.O_Model.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid + "," + groupid);
		}

		var pactid = H_userinfo.pactid;
		var userid = H_userinfo.userid;

		if (this.checkPassword(H_userinfo, password) == false) {
			this.errorPattern("Password", loginid);
		}

		if (this.writeLoginRelSess(pactid, userid) == false) {
			this.errorPattern("DoubleLogin", userid);
		}

		if (this.checkDoubleLogin(pactid, userid) == false) {
			this.errorPattern("DoubleLogin", userid);
		}

		if (this.checkIPrestrict(pactid) == false) {
			this.errorPattern("IPRestrict", userid);
		}

		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);
		this.O_Sess.setGlobal("loginid", loginid);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", H_userinfo.username);
		}

		this.modify2ndLevel(pactid, H_userinfo.postid, H_userinfo.level, H_userinfo.postname);

		if (this.checkCopyRight(pactid) == true) {
			this.O_Sess.setGlobal("copyright", 1);
		} else {
			this.O_Sess.setGlobal("copyright", 0);
		}

		var H_log = {
			pactid: this.O_Sess.pactid,
			postid: this.O_Sess.postid,
			postname: this.O_Sess.postname,
			userid: this.O_Sess.userid,
			username: this.O_Sess.loginname,
			comment1: "ID：" + this.O_Sess.loginid,
			comment2: "ログイン処理",
			kind: "L",
			type: "ログイン",
			joker_flag: 0,
			comment1_eng: "ID：" + this.O_Sess.loginid,
			comment2_eng: "LOGIN"
		};
		this.O_Out.writeMnglog(H_log);
		this.checkPassWordLimit(pactid, userid);
		setcookie("ini", userid_ini, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("uid", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		setcookie("gid", groupid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
	}

	setLoginCore(H_userinfo, joker = false) //セッションへの書き込み
	//currentにもpostidを入れておく
	//スーパーユーザーの設定
	//Joker以外でHotlineならクッキーに書き込む
	{
		this.O_Sess.setGlobal("userid", H_userinfo.userid);
		this.O_Sess.setGlobal("groupid", H_userinfo.groupid);
		this.O_Sess.setGlobal("pactid", H_userinfo.pactid);
		this.O_Sess.setGlobal("compname", H_userinfo.compname);
		this.O_Sess.setGlobal("postid", H_userinfo.postid);
		this.O_Sess.setGlobal("current_postid", H_userinfo.postid);
		this.O_Sess.setGlobal("postname", H_userinfo.postname);
		this.O_Sess.setGlobal("userpostid", H_userinfo.userpostid);
		this.O_Sess.setGlobal("loginid", this.loginid);
		this.O_Sess.setGlobal("logo", H_userinfo.logo);
		this.O_Sess.setGlobal("manual", H_userinfo.manual);
		this.O_Sess.setGlobal("inq_mail", H_userinfo.inquiry);
		this.O_Sess.setGlobal("pacttype", H_userinfo.pacttype);
		this.O_Sess.setGlobal("helpfile", H_userinfo.helpfile);
		this.O_Sess.setGlobal("level", H_userinfo.level);
		this.O_Sess.setGlobal("limit_time", Date.now() / 1000 + 60 * this.O_Conf.sesslimit);

		if (H_userinfo.usertype == "SU") {
			this.O_Sess.setGlobal("su", true);
		} else {
			this.O_Sess.setGlobal("su", false);
		}

		if (false == joker && "H" == H_userinfo.pacttype) {
			setcookie("type", "H", Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
		}
	}

	refreshLogin() //ログインしているかのチェック
	//$this->O_Sess->setGlobal("compname", $H_userinfo["compname"]);	// 第二階層権限があるので、上書きしてはいけない！
	//第二階層対応 * DEBUG * これはテストだよ、ほんとはここにはないんだよ！
	//$this->modify2ndLevel($H_userinfo["pactid"], $H_userinfo["postid"], $H_userinfo["level"], $H_userinfo["postname"]);
	{
		if (this.checkSession() == false) {
			this.errorPattern("Session");
		}

		if (this.checkSessionLimit() == false) {
			this.errorPattern("SessionLimit", this.O_Sess.userid);
		}

		if (this.checkDoubleLogin(this.O_Sess.pactid, this.O_Sess.userid) == false) {
			this.errorPattern("DoubleLogin", this.O_Sess.userid);
		}

		var H_userinfo = this.O_Model.getUserInfo(this.O_Sess.userid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserDeleted", this.O_Sess.pactid + "," + this.O_Sess.userid);
		}

		if (this.checkIPrestrict(H_userinfo.pactid) == false) {
			this.errorPattern("IPRestrict", this.O_Sess.userid);
		}

		if (this.checkIPrestrict(H_userinfo.pactid) == false) {
			this.errorPattern("IPRestrict", this.O_Sess.userid);
		}

		this.O_Sess.setGlobal("pactid", H_userinfo.pactid);
		this.O_Sess.setGlobal("postid", H_userinfo.postid);
		this.O_Sess.setGlobal("postname", H_userinfo.postname);
		this.O_Sess.setGlobal("userpostid", H_userinfo.userpostid);
		this.O_Sess.setGlobal("userid", H_userinfo.userid);
		this.O_Sess.setGlobal("pacttype", H_userinfo.pacttype);
		this.O_Sess.setGlobal("helpfile", H_userinfo.helpfile);
		this.O_Sess.setGlobal("limit_time", Date.now() / 1000 + 60 * this.O_Conf.sesslimit);
		this.O_Sess.setGlobal("groupname", this.O_Conf["groupid" + H_userinfo.groupid]);
		this.O_Sess.setGlobal("grouptitle", this.O_group.getGroupTitle(H_userinfo.groupid, H_userinfo.pacttype, H_userinfo.language));
		this.O_Sess.setGlobal("language", H_userinfo.language);
		global.GROUPID = H_userinfo.groupid;

		if (H_userinfo.usertype == "SU") {
			this.O_Sess.setGlobal("su", true);
		} else {
			this.O_Sess.setGlobal("su", false);
		}
	}

	JokerLogin(userid_ini, loginid, groupid, loginname = "") //ユーザー情報の取得
	//ショップログインモデルではなく、ユーザー側のログインモデルを用いる
	//$userid = $H_userinfo["userid"];
	//パスワードチェックは行わない
	//パスワードの有効期限チェックも行わない
	//二重ログインチェックもとりあえず行わない
	//二重ログインチェックのため、ログインセッション情報を書き込む
	//if($this->writeLoginRelSess( $pactid, $userid ) == false){
	//$this->errorPattern("DoubleLogin", $userid);
	//}
	//// 二重ログインチェック
	//if($this->checkDoubleLogin( $pactid, $userid ) == false){
	//$this->errorPattern("DoubleLogin", $userid);
	//}
	//IP制限チェックも行わない
	//ショップから成り代わりを行っているか？ shopid と memid で判断
	//セッションへの書き込み
	//第二階層対応
	//コピーライト表示の有無
	//ユーザ管理記録に書き込む
	{
		var O_login = new LoginModel();
		var H_userinfo = O_login.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		var pactid = H_userinfo.pactid;

		if (!this.O_Sess.shopid == false && !isNaN(Number(this.O_Sess.shopid)) && !this.O_Sess.memid == false && !isNaN(Number(this.O_Sess.memid))) //ショップセッション値を得る --（ここで子クラスを読んでいる）
			//セッションをクリアする
			//ショップセッションを保存する
			{
				var O_shoplogin = MtShopLogin.singleton();
				var H_shopkey = O_shoplogin.getShopSessionHash();
				this.O_Sess.clearSessionAll();
				this.O_Sess.setGlobal(MtLogin.SAVE_SESSION_SHOP, H_shopkey);
			} else //セッションをクリアする
			{
				this.O_Sess.clearSessionAll();
			}

		this.setLoginCore(H_userinfo);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", "KCS Motion成り代わりユーザー");
		}

		this.modify2ndLevel(pactid, H_userinfo.postid, H_userinfo.level, H_userinfo.postname);

		if (this.checkCopyRight(pactid) == true) {
			this.O_Sess.setGlobal("copyright", 1);
		} else {
			this.O_Sess.setGlobal("copyright", 0);
		}

		var H_log = {
			pactid: this.O_Sess.pactid,
			postid: this.O_Sess.postid,
			postname: this.O_Sess.postname,
			userid: this.O_Sess.userid,
			username: this.O_Sess.loginname,
			comment1: "ID：" + this.O_Sess.loginid,
			comment2: "ログイン処理",
			kind: "L",
			type: "ログイン",
			joker_flag: 1
		};
		this.O_Out.writeMnglog(H_log);
	}

	logOut() //ショップから成り代わっていた場合、ショップに戻る
	//セッションのクリア
	{
		var H_log = {
			pactid: this.O_Sess.pactid,
			postid: this.O_Sess.postid,
			postname: this.O_Sess.postname,
			userid: this.O_Sess.userid,
			username: this.O_Sess.loginname,
			comment1: "ID：" + this.O_Sess.loginid,
			comment2: "ログアウト処理",
			kind: "L",
			type: "ログアウト",
			joker_flag: this.O_Sess.joker
		};
		this.O_Out.writeMnglog(H_log);
		this.restoreShop();
		this.O_Sess.clearSessionAll();
	}

	restoreShop() //ショップセッションが無ければ、何事もなくリターン
	//if( isset( $this->O_Sess->SAVE_SESSION_SHOP ) == false ){
	//現行セッションを一度全てクリアーする
	//ショップセッションを元に戻す
	//ショップメニューに飛ぶ
	{
		if (this.O_Sess.SAVE_SESSION_SHOP === undefined) {
			return;
		}

		var H_shopkey = Array();
		{
			let _tmp_0 = this.O_Sess.SAVE_SESSION_SHOP;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];
				H_shopkey[key] = val;
			}
		}
		this.O_Sess.clearSessionAll();

		for (var key in H_shopkey) {
			var val = H_shopkey[key];
			this.O_Sess.setGlobal(key, val);
		}

		header("Location: /Shop/menu.php");
		throw process.exit(0);
	}

	errorPattern(pattern, info = "") //グループIDがあったら諸々の戻り値を設定する
	{
		var O_group = "";
		var goto = "";

		if (undefined !== this.O_Sess.groupid) {
			if ("H" == this.O_Sess.pacttype) {
				if (1 < this.O_Sess.groupid) {
					goto = "/" + this.O_group.getGroupName(this.O_Sess.groupid) + "/hotline.php";
				} else {
					goto = "/Hotline/index.php";
				}
			} else {
				if (1 < this.O_Sess.groupid) {
					goto = "/" + this.O_group.getGroupName(this.O_Sess.groupid);
					var auth:any = MtAuthority.singleton(this.O_Sess.pactid);
					var pactModel = new PactModel();

					if (auth.chkPactFuncIni("fnc_pact_login")) {
						goto += "/" + pactModel.getUseridIniFromPactid(this.O_Sess.pactid) + "/";
					}
				}
			}
		} else if (true == (undefined !== _COOKIE.gid) && true == !isNaN(Number(_COOKIE.gid))) {
			if ("H" == this.O_Sess.pacttype || true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
				if (1 < _COOKIE.gid) {
					goto = "/" + this.O_group.getGroupName(_COOKIE.gid) + "/hotline.php";
				} else {
					goto = "/Hotline/index.php";
				}
			} else {
				if (1 < _COOKIE.gid) {
					goto = "/" + this.O_group.getGroupName(_COOKIE.gid);

					if (undefined !== _SESSION.pid && !isNaN(Number(_SESSION.pid)) ) {
						auth = MtAuthority.singleton(_SESSION.pid);
						pactModel = new PactModel();

						if (auth.chkPactFuncIni("fnc_pact_login")) {
							goto += "/" + pactModel.getUseridIniFromPactid(_SESSION.pid) + "/";
						}
					}
				}
			}
		} else //cookieにtype=HがあればHotline
			{
				if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
					goto = "/Hotline/index.php";
				}
			}

		if (process.HTTP_REFERER.match("/Hotline/")) {
			goto = "/Hotline/index.php";
		} else if (undefined !== process.HTTP_REFERER && "" != process.HTTP_REFERER) {
			if (process.HTTP_REFERER.match("/" + process.SERVER_NAME + "/")) {
				var temp, filename;
				[temp, filename] = process.HTTP_REFERER.split(process.SERVER_NAME);

				if ("" != filename) {
					var localFilename = KCS_DIR + "/htdocs" + filename;

					if (localFilename.match("/\\/$/")) {
						localFilename += "index.php";
					}

					if (fs.existsSync(localFilename) && fs.statSync(localFilename).isDirectory()) {
						var goto2 = filename;
					}
				}
			}
		}

		switch (pattern) {
			case "Session":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(10, "セッションがないか、有効ではない(IP: " + process.REMOTE_ADDR + ")", false, goto);
				break;

			case "Password":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(9, "パスワード間違い(loginid: " + info + ")", false, goto2);
				break;

			case "UserNotFound":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(9, "ユーザ情報が見つからない(userid_ini,loginid: " + info + ")", false, goto2);
				break;

			case "SessionLimit":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(7, "Session有効時間オーバー(userid: " + info + ")", false, goto);
				break;

			case "DoubleLogin":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(32, "二重ログインエラー", false, goto);
				break;

			case "IPRestrict":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "IP制限ログイン(userid: " + info + ")", false, goto2);
				break;

			case "RemoteAddr":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "接続元IPが不正(IP: " + info + ")", false, goto2);
				break;

			case "UserDeleted":
				this.O_Out.errorOut(25, "ログイン中のユーザが削除された(pactid,userid: " + info + ")", true, goto, "ログインページへ");
				break;

			case "NoInput":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(5, "顧客コード、ログインIDが入力されていません", false, goto2);
				break;

			default:
				this.O_Out.errorOut(11, "MtLogin: その他のエラー(userid: " + this.O_Sess.userid + ")");
				break;
		}
	}

};