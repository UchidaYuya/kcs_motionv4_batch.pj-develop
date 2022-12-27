//
//Userに関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/28
//
//
//
//Userに関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/28
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/05/28
//
//@param object $O_DB
//@access public
//@return void
//
//
//ある会社に属するユーザー一覧を取得する
//
//@author nakanita
//@since 2008/05/02
//
//@access public
//@return ユーザー情報配列
//
//
//請求閲覧者一覧取得
//
//@author houshiyama
//@since 2008/08/28
//
//@param mixed $pactid
//@param mixed $postid
//@param string $userid
//@access public
//@return void
//
//
//指定したユーザIDが存在するか調べる
//あればtrue、無ければfalse
//
//@author houshiyama
//@since 2012/11/15
//
//@param mixed $userid
//@access public
//@return void
//
//指定したユーザーが存在するかどうかなどはstatic関数で良いんじゃね(´･ω･`)
//------------------------------------------------------------------------------------------------------
//20180220伊達
//ユーザー情報を事前にDBから読み込み、読み込んだ情報を使用するようにしたい・・
//
//initialize
//ユーザー情報の初期化
//@author web
//@since 2018/02/20
//
//@param mixed $pactid
//@param mixed $userid
//@access public
//@return void
//
//
//receiveMailFromShop
//ショップからのメールを受け取る？
//@author web
//@since 2018/02/20
//
//@access public
//@return void
//
//
//getColumn
//
//@author web
//@since 2018/02/20
//
//@param string $name
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author nakanita
//@since 2008/05/28
//
//@access public
//@return void
//
class UserModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
		this.m_pactid = 0;
		this.m_userid = 0;
		this.m_user = undefined;
	}

	getUserList(pactid) {
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "ShopModel::getUserList() pactid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select po.postid,po.postname,po.userpostid,us.userid,us.username,us.loginid,us.type,pact.userid_ini " + "from post_tb po " + "inner join user_tb us on po.postid = us.postid " + "inner join pact_tb pact on pact.pactid = po.pactid and pact.pactid = us.pactid " + "where us.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " " + "order by us.type,po.userpostid,us.userid";
		return this.getDB().queryHash(sql);
	}

	getUserKeyHash(pactid, postid, userid = "") {
		var sql = "select userid,username from user_tb " + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and ( postid=" + this.get_DB().dbQuote(postid, "integer", true) + " ";

		if (userid != "") {
			sql += " or userid = " + this.get_DB().dbQuote(userid, "integer", true) + " ";
		}

		sql += " ) ORDER BY userid";
		return this.get_DB().queryAssoc(sql);
	}

	checkUserExist(userid) {
		var sql = "select count(userid) from user_tb" + " where userid=" + this.getDB().dbQuote(userid, "integer", true);
		var res = this.getDB().queryOne(sql);

		if (res > 0) {
			return true;
		} else {
			return false;
		}
	}

	initialize(pactid, userid) //ユーザーテーブル読み込み
	{
		this.m_pactid = 0;
		this.m_userid = 0;
		var sql = "select * from user_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and userid=" + this.get_DB().dbQuote(userid, "integer", true);
		this.m_user = this.get_DB().queryRowHash(sql);

		if (!(undefined !== this.m_user)) //ユーザーない
			{
				this.m_user = undefined;
				return false;
			}

		this.m_pactid = pactid;
		this.m_userid = userid;
		return true;
	}

	receiveMailFromShop() {
		if (undefined !== this.m_user) {
			return this.m_user.acceptmail5 == 0 ? false : true;
		}

		return true;
	}

	getColumn(name: ?string = undefined) {
		if (is_null(name)) {
			return this.m_user;
		}

		return this.m_user[name];
	}

	__destruct() {
		super.__destruct();
	}

};