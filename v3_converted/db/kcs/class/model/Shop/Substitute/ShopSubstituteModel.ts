//
//ショップ成り代わり用モデル
//
//@uses ModelBase
//@package Shop
//@filesource
//@author nakanita
//@since 2008/08/26
//
//
//
//ショップ成り代わり用モデル
//
//@uses ModelBase
//@package Shop
//@author nakanita
//@since 2008/08/26
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/08/26
//
//@param object $O_db0
//@access public
//@return void
//
//
//ショップの成り代わり情報を取得する
//
//@author nakanita
//@since 2008/08/26
//
//@param integer $shopid
//@access public
//@return void
//
//
//ショップの成り代わりログを記録する
//
//@author nakanita
//@since 2008/08/26
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//__destruct
//
//@author nakanita
//@since 2008/08/26
//
//@access public
//@return void
//
class ShopSubstituteModel extends ModelBase {
	constructor(O_db0 = undefined) {
		super(O_db0);
	}

	getJokerLog(shopid) //$this->debugOut( $sql );
	{
		var sql = "select " + " lo.shopid, lo.memid, lo.name, lo.pactid, lo.compname, lo.postid, lo.postname, lo.userid_j, lo.username_j, lo.logindate, us.loginid" + " from shop_joker_log_tb lo" + " inner join user_tb us on lo.userid_j = us.userid " + " where shopid = " + shopid + " and date(logindate) >= current_date - ('3 months')::interval " + " order by logindate desc";
		return this.get_DB().queryHash(sql);
	}

	writeJokerLog(H_sess, H_g_sess) //$this->debugOut("MemberModel::createMember, " . $ins_sql );
	// ToDo * ちいさくトランザクション入れてみたのだが、本来ページ単位では？
	//成功
	{
		var nowdate = date("Y-m-d H:i:s");
		var ins_sql = "insert into shop_joker_log_tb (" + " shopid, memid, name, pactid, compname, postid, postname, userid_j, username_j, logindate" + ") values ( " + H_g_sess.shopid + "," + H_g_sess.memid + "," + "'" + H_g_sess.personname + "'," + "'" + H_sess.pactid + "'," + "'" + H_sess.compname + "'," + H_sess.postid + "," + "'" + H_sess.postname + "'," + "'" + H_sess.userid_j + "'," + "'" + H_sess.username_j + "'," + "'" + nowdate + "' )";
		this.get_DB().beginTransaction();
		var ret_line = this.get_DB().exec(ins_sql);

		if (ret_line != 1) //更新された数が１ではない
			//失敗
			{
				this.get_DB().rollback();
				return false;
			}

		this.get_DB().commit();
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};