//
//よく使う項目関連のModel
//
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/08/17
//@uses ModelBase
//
//
//
//よく使う項目関連のModel
//
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/08/17
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getFavoriteMenuFncid
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $pactid
//@param mixed $userid
//@access public
//@return void
//
//
//addFavoriteMenu
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $pactid
//@param mixed $userid
//@param mixed $fncid
//@access public
//@return void
//
//
//delFavoriteMenu
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $pactid
//@param mixed $userid
//@param mixed $fncid
//@access public
//@return void
//
//
//デストラクト
//
//@author katsushi
//@since 2008/08/17
//
//@access public
//@return void
//
class FavoriteModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getFavoriteMenuFncid(pactid, userid) {
		var sql = "select fncid from favorite_usermenu_tb where pactid = " + pactid + " and userid = " + userid + " order by recdate";
		return this.getDB().queryCol(sql);
	}

	addFavoriteMenu(pactid, userid, fncid) {
		var sql = "insert into favorite_usermenu_tb values(" + this.getDB().dbQuote(pactid, "integer", true) + "," + this.getDB().dbQuote(userid, "integer", true) + "," + this.getDB().dbQuote(fncid, "integer", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";
		return this.getDB().exec(sql, false);
	}

	delFavoriteMenu(pactid, userid, fncid) {
		var sql = "delete from favorite_usermenu_tb where pactid = " + pactid + " and userid = " + userid + " and fncid = " + fncid;
		return this.getDB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};