//
//MtShopLoginで使用するモデル
//
//@filesource
//@package Base
//@subpackage Login
//@author nakanita
//@since 2008/04/17
//
//
//
//MtLoginで使用するモデル
//
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/04/17
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("LoginModel.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/04/17
//
//@param object $O_db
//@access public
//@return void
//
//
//ログイン情報更新で使用する情報を取得する
//
//@author nakanita
//@since 2008/04/17
//
//@param integer $memid
//@access public
//@return array
//
//
//ログインで使用する情報を全て取得する
//
//@author nakanita
//@since 2008/04/17
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
//@author nakanita
//@since 2008/04/17
//
//@param integer $pactid
//@access public
//@return array
//
//
//現在ログイン中であることをセッション情報に書き込む。
//二重ログインチェックに用いている
//
//@author nakanita
//@since 2008/05/01
//
//@param mixed $shopid
//@param mixed $memid
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
//@param integer $shopid
//@param integer $memid
//@param string $sess_id
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
//
//パスワードの失敗回数を得る
//
//@author nakanita
//@since 2008/06/20
//
//@param integer $shopid
//@param integer $memid
//@access public
//@return void
//
//
//パスワードの失敗回数を変更する
//
//@author nakanita
//@since 2008/06/20
//
//@param integer $shopid
//@param integer $memid
//@param boolean $flag trueのとき+1する、falseのときリセットで０に戻す
//@access public
//@return integer
//
class ShopLoginModel extends LoginModel {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getUserInfo(memid) {
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(5, "\u30B7\u30E7\u30C3\u30D7\u30E1\u30F3\u30D0\u30FCID(memid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.postcode," + "shop_tb.name as shopname," + "shop_member_tb.memid, " + "shop_member_tb.name as personname, " + "shop_member_tb.mail as ownermail, " + "shop_tb.fiscalmonth " + "from " + "(shop_member_tb inner join shop_tb on shop_member_tb.shopid = shop_tb.shopid) " + "where " + "shop_member_tb.memid = " + memid + " and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

	getUserInfoAll(userid_ini, loginid, groupid) //$this->getOut()->debugOut( $sql );
	{
		if (userid_ini == "" || loginid == "") {
			this.getOut().errorOut(5, "\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9(userid_ini)\u3001\u30ED\u30B0\u30A4\u30F3ID(loginid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044", false);
		}

		if (is_numeric(groupid) == false) {
			this.getOut().errorOut(5, "\u30B0\u30EB\u30FC\u30D7ID(groupid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044", false);
		}

		var sql = "select " + "shop_member_tb.memid," + "shop_member_tb.name," + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.postcode," + "shop_tb.name as shopname," + "shop_member_tb.name as personname, " + "shop_member_tb.mail as ownermail, " + "shop_member_tb.passwd, " + "shop_member_tb.miscount, " + "shop_member_tb.type as usertype, " + "shop_tb.fiscalmonth " + "from " + "shop_member_tb inner join shop_tb on shop_member_tb.shopid = shop_tb.shopid " + "where " + "shop_tb.loginid = '" + userid_ini + "' " + "and shop_tb.groupid = " + groupid + " " + "and shop_member_tb.loginid = '" + loginid + "' " + "and shop_tb.type != 'A' " + "and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

	getIpRestrict(shopid) {
		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(5, "\u30B7\u30E7\u30C3\u30D7ID(shopid)\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var sql = "select " + "net," + "start_time," + "end_time," + "week," + "type " + "from " + "shop_ip_restrict_tb " + "where " + "shopid = " + shopid + " " + "order by " + "sort";
		return this.getDB().queryHash(sql);
	}

	setLoginSessInfo(shopid, memid, sess_id) //まず $shopid, $memid だけで検索を行う
	//他に無ければ新規作成
	{
		var A_pact_user_num = this.getLoginSessInfo(shopid, memid);

		if (A_pact_user_num.length == 0) {
			var pact_user_sql = "INSERT INTO shop_login_rel_sess_tb(shopid, memid, sess)values(" + shopid + "," + memid + ",'" + sess_id + "')";
			var cnt = this.getDB().exec(pact_user_sql);
		} else if (A_pact_user_num.length == 1) {
			pact_user_sql = "UPDATE shop_login_rel_sess_tb SET sess = '" + sess_id + "' WHERE shopid = " + shopid + " and memid = " + memid;
			cnt = this.getDB().exec(pact_user_sql);
		} else //２つ以上セッションがあった、これは異常
			{
				return 0;
			}

		return cnt;
	}

	getLoginSessInfo(shopid, memid, sess_id = "") //セッションID条件
	{
		var pact_user_sql = "SELECT * FROM shop_login_rel_sess_tb " + " WHERE shopid = " + shopid + " AND memid = " + memid;

		if (sess_id != "") {
			pact_user_sql += " AND sess ='" + sess_id + "'";
		}

		return this.getDB().queryHash(pact_user_sql);
	}

	getLoginPasschanged(memid) {
		var sql = "select passchanged from shop_member_tb where memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	getMiscount(shopid, memid) //$this->debugOut( $sql );
	{
		var sql = "select " + "miscount " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " and memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	setMiscount(shopid, memid, flag) //成功
	{
		if (flag == true) {
			var cnt = this.getMiscount(shopid, memid);
			cnt++;
		} else {
			cnt = 0;
		}

		var sql = "update shop_member_tb set miscount = " + cnt + " where " + " shopid = " + shopid + " and memid = " + memid;
		var ret_line = this.getDB().exec(sql);

		if (ret_line != 1) //更新された数が１ではない
			//失敗
			{
				return -1;
			}

		return cnt;
	}

};