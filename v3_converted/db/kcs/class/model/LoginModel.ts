//
//MtLoginで使用するモデル
//
//@filesource
//@package Base
//@subpackage Login
//@author katsushi
//@since 2008/03/17
//
//
//
//MtLoginで使用するモデル
//
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/03/17
//

// require("MtDBUtil.php");

// require("MtOutput.php");

// require("MtSetting.php");

import MtDBUtil from '../MtDBUtil';
import MtOutput from '../MtOutput';
import MtSetting from '../MtSetting';

//
//データベースオブジェクト
//
//@var object MtDBUtil
//@access private
//
//
//MtOutputオブジェクト
//
//@var object MtOutput
//@access private
//
//
//コンストラクタ
//
//@author katsushi
//@since 2008/03/17
//
//@param object $O_db
//@access public
//@return void
//
//
//メンバー変数にデータベースオブジェクトを設定する
//
//@author katsushi
//@since 2008/03/17
//
//@param MtDBUtil $O_db
//@access private
//@return void
//
//
//データベースオブジェクトを得る
//
//@author nakanita
//@since 2008/04/30
//
//@access protected
//@return object
//
//
//共通出力を得る
//
//@author nakanita
//@since 2008/04/30
//
//@access protected
//@return object
//
//
//ログイン情報更新で使用する情報を取得する
//
//@author katsushi
//@since 2008/03/17
//
//@param integer $userid
//@access public
//@return array
//
//
//ログインで使用する情報を全て取得する
//
//@author katsushi
//@since 2008/03/17
//
//// 削除フラグを参照するよう修正 2010/10/19 s.maeda
//
//@param string $userid_ini
//@param string $loginid
//@param integer $groupid
//@access public
//@return array
//
//
//IP制限テーブルから設定一覧を取得する
//
//@author katsushi
//@since 2008/03/17
//
//@param integer $pactid
//@access public
//@return array
//
//
//user_tbのパスワードを更新する
//
//@author katsushi
//@since 2008/03/17
//
//@param integer $userid
//@param string $password
//@access public
//@return boolean
//
//
//現在ログイン中であることをセッション情報に書き込む。
//二重ログインチェックに用いている
//
//@author nakanita
//@since 2008/05/01
//
//@param mixed $pactid
//@param mixed $userid
//@param mixed $sess_id
//@access public
//@return integer 更新した行数、0 なら失敗
//
//
//現在ログイン中のセッション情報を取得する。
//二重ログインチェックに用いている
//
//@author nakanita
//@since 2008/04/23
//
//@param integer $userid
//@param string $sess_id
//@param string $comment
//@access public
//@return void
//
//
//パスワードの変更日付を得る
//
//@author nakanita
//@since 2008/04/23
//
//@param integer $userid
//@access public
//@return void
//
export default class LoginModel {
	O_DB: any;
	O_Out: any;
	constructor(O_db = undefined) {
		if (O_db === undefined) {
			this.setDB(MtDBUtil.singleton());
		} else {
			this.setDB(O_db);
		}

		this.O_Out = MtOutput.singleton();
	}

	setDB(O_db: MtDBUtil) {
		this.O_DB = O_db;
	}

	getDB() {
		return this.O_DB;
	}

	getOut() {
		return this.O_Out;
	}

	getUserInfo(userid) {
		if (!isNaN(Number(userid)) == false) {
			this.O_Out.errorOut(5, "ユーザID(userid)が正しく指定されていません", 0);
		}

		var sql = "select " + "pact_tb.pactid," + "pact_tb.groupid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "post_tb.userpostid," + "user_tb.type as usertype," + "user_tb.userid," + "coalesce(user_tb.language,'JPN') as language," + "pact_tb.type as pacttype, " + "pact_tb.helpfile " + "from " + "(user_tb inner join pact_tb on user_tb.pactid = pact_tb.pactid) " + "inner join post_tb on user_tb.postid = post_tb.postid " + "where " + "user_tb.userid = " + userid;
		return this.O_DB.queryRowHash(sql);
	}

	getUserInfoAll(userid_ini = "", loginid = "", groupid = "") {
		if (userid_ini == "" || loginid == "" || groupid == "") {
			this.O_Out.errorOut(5, "顧客コード(userid_ini)、ログインID(loginid)が正しく指定されていない", false);
		}

		var sql = "select " + "user_tb.userid," + "pact_tb.groupid," + "user_tb.username," + "pact_tb.pactid," + "pact_tb.compname," + "post_tb.postid," + "post_tb.postname," + "post_tb.userpostid," + "user_tb.passwd," + "user_tb.type as usertype," + "coalesce(user_tb.language,'JPN') as language," + "pact_tb.logo," + "pact_tb.manual," + "pact_tb.inquiry," + "pact_tb.type as pacttype, " + "pact_tb.helpfile, " + "post_relation_tb.level " + "from " + "((user_tb inner join pact_tb on user_tb.pactid = pact_tb.pactid) " + "inner join post_tb on user_tb.postid = post_tb.postid) " + "inner join post_relation_tb on post_tb.postid = post_relation_tb.postidchild " + "where " + "pact_tb.userid_ini = '" + userid_ini + "' " + "and pact_tb.delflg = false " + "and user_tb.loginid = '" + loginid + "' " + "AND pact_tb.groupid = " + this.O_DB.dbQuote(groupid, "integer", true);
		return this.O_DB.queryRowHash(sql);
	}

	getIpRestrict(pactid) {
		if (!isNaN(Number(pactid)) == false) {
			this.O_Out.errorOut(5, "顧客ID(pactid)が正しく指定されていません", false);
		}

		var sql = "select " + "net," + "start_time," + "end_time," + "week," + "type " + "from " + "ip_restrict_tb " + "where " + "pactid = " + pactid + " " + "order by " + "sort";
		return this.O_DB.queryHash(sql);
	}

	updateUserPassword(userid, password) //更新した行数を判定
	{
		var sql = "update " + "user_tb " + "set " + "passwd = '" + password + "'," + "fixdate = '" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "' " + "where " + "userid = " + userid;
		var cnt = this.O_DB.exec(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	setLoginSessInfo(pactid, userid, sess_id) //ます $pactid, $userid だけで検索を行う
	//他に無ければ新規作成
	{
		var A_pact_user_num = this.getLoginSessInfo(pactid, userid);

		if (A_pact_user_num.length == 0) {
			var pact_user_sql = "INSERT INTO login_rel_sess_tb(pactid, userid, sess)values(" + pactid + "," + userid + ",'" + sess_id + "')";
			var cnt = this.getDB().exec(pact_user_sql);
		} else if (A_pact_user_num.length == 1) //在れば上書き
			{
				pact_user_sql = "UPDATE login_rel_sess_tb SET sess = '" + sess_id + "' WHERE pactid = " + pactid + " and userid = " + userid;
				cnt = this.getDB().exec(pact_user_sql);
			} else //２つ以上セッションがあった、これは異常
			{
				return 0;
			}

		return cnt;
	}

	getLoginSessInfo(pactid, userid, sess_id = "") //セッションID条件
	{
		var pact_user_sql = "SELECT * FROM login_rel_sess_tb " + " WHERE pactid = " + pactid + " AND userid = '" + userid + "'";

		if (sess_id != "") {
			pact_user_sql += " AND sess ='" + sess_id + "'";
		}

		return this.O_DB.queryHash(pact_user_sql);
	}

	getLoginPasschanged(userid) {
		var sql = "select passchanged from user_tb where userid = " + userid;
		return this.O_DB.queryOne(sql);
	}

};