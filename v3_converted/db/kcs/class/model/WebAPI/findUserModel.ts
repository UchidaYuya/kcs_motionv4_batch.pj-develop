//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//setAllAuthIni
//権限の設定
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//get_AuthIni
//権限の取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//findUser
//
//@author web
//@since 2016/03/28
//
//@param mixed $pactid
//@param mixed $username
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class FindUserModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	findUser(pactid, postid, loginid, username) {
		if (loginid == "" && username == "") {
			return Array();
		}

		var O_Post = new PostModel();
		var post_list = O_Post.getChildList(pactid, postid);

		if (!post_list) {
			return Array();
		}

		var sql = "select usr.userid,post.postname,usr.loginid,usr.username from user_tb as usr " + " join post_tb post on post.pactid = usr.pactid and post.postid = usr.postid" + " where" + " usr.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.postid in (" + post_list.join(",") + ")";

		if (loginid != "") {
			sql += " and usr.loginid like " + this.get_DB().dbQuote("%" + loginid + "%", "text", true);
		}

		if (username != "") {
			sql += " and usr.username like " + this.get_DB().dbQuote("%" + username + "%", "text", true);
		}

		return this.get_DB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};