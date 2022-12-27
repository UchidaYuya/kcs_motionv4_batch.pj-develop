//
//ショップメンバーモデル
//
//@uses ModelBase
//@package Shop
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//ショップメンバーモデル
//
//@uses ModelBase
//@package Shop
//@author nakanita
//@since 2008/02/08
//

require("MtCryptUtil.php");

require("model/ModelBase.php");

//
//エラーメッセージ
//
//@var string
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param object $O_db0
//@access public
//@return void
//
//
//エラーメッセージを得る
//
//@author nakanita
//@since 2008/06/19
//
//@access public
//@return void
//
//
//ショップメンバー情報を返す
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $memid メンバーID
//@access public
//@return void
//
//
//ショップに属するスーパーユーザーの情報を返す
//
//@author nakanita
//@since 2008/11/21
//
//@param integer $shopid
//@access public
//@return void
//
//
//ショップに属するメンバーの一覧を得る
//
//@author nakanita
//@since 2008/05/23
//
//@param mixed $shopid
//@access public
//@return void
//
//
//ショップメンバーを新規登録する
//
//@author nakanita
//@since 2008/05/28
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@param string $type
//@param mixed $H_members
//@access public
//@return void
//
//
//ショップメンバー情報を更新する
//
//@author nakanita
//@since 2008/05/27
//
//@param mixed $memid
//@param mixed $H_meminfo
//@param mixed $H_sess
//@access public
//@return void
//
//
//ショップメンバーを削除する
//
//@author nakanita
//@since 2008/05/27
//
//@param mixed $memid
//@access public
//@return void
//
//
//ショップメンバーのパスワードを更新する
//
//@author nakanita
//@since 2008/05/22
//
//@param integer $memid メンバーID
//@param string $passwd 新規パスワード
//@access public
//@return void
//
//
//ショップメンバーの権限情報を書き換える
//
//@author nakanita
//@since 2008/06/06
//
//@param mixed $memid
//@param mixed $H_sess
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
class MemberModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getErrorMessage() {
		return this.ErrorMessage;
	}

	getMemberInfo(memid) //$this->debugOut( $sql );
	{
		var sql = "select " + "memid," + "loginid," + "name as username," + "mail," + "passwd," + "passwd2nd," + "passwd3rd," + "passchanged," + "type, " + "miscount " + "from " + "shop_member_tb " + "where " + "memid = " + memid;
		return this.get_DB().queryRowHash(sql);
	}

	getMemberSUInfo(shopid) //スーパーユーザー
	//$this->debugOut( $sql );
	{
		var sql = "select " + "memid," + "loginid," + "name as username," + "mail," + "passwd," + "passwd2nd," + "passwd3rd," + "passchanged," + "type, " + "miscount " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " and type='SU'";
		return this.get_DB().queryRowHash(sql);
	}

	getMemberList(shopid) //$this->debugOut( $sql );
	{
		var sql = "select " + "memid," + "loginid," + "name as username," + "mail," + "passwd," + "passwd2nd," + "passwd3rd," + "passchanged," + "type, " + "miscount, " + "case when miscount >= " + this.getSetting().shop_passwd_miscount + " then 1 else 0 end as misflag " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " order by memid";
		return this.get_DB().queryHash(sql);
	}

	createMember(H_sess, shopid, type, H_members = undefined) //var_dump( $H_sess );	// DEBUG
	//var_dump( $H_members );	// DEBUG
	//既存のメンバーとの比較チェックを行う
	// ToDo * ちいさくトランザクション入れてみたのだが、本来ページ単位では？
	//$this->debugOut("MemberModel::createMember, " . $ins_sql );
	//成功
	{
		if (is_null(H_members) == false) {
			for (var row of Object.values(H_members)) {
				if (row.loginid === H_sess.loginid) //成功リターン
					{
						this.ErrorMessage = "\u300C" + H_sess.loginid + "\u300D\u3068\u3044\u3046LoginID\u306F\u3059\u3067\u306B\u3042\u308A\u307E\u3059\u3002\u5225\u306EID\u3067\u767B\u9332\u3057\u3066\u304F\u3060\u3055\u3044.";
						return true;
					}
			}
		}

		var nowdate = date("Y-m-d H:i:s");
		var O_crypt = MtCryptUtil.singleton();
		this.get_DB().beginTransaction();
		var sql = "select nextval('shop_member_tb_memid_seq')";
		var memid = this.get_DB().queryOne(sql);
		var ins_sql = "insert into shop_member_tb ( shopid, memid, name, mail, passwd, loginid, type, fixdate ) values ( " + shopid + "," + memid + "," + "'" + H_sess.personname + "'," + "'" + H_sess.mail + "'," + "'" + O_crypt.getCrypt(H_sess.passwd) + "'," + "'" + H_sess.loginid + "'," + "'" + type + "'," + "'" + nowdate + "' )";
		var ret_line = this.get_DB().exec(ins_sql);

		if (ret_line != 1) //更新された数が１ではない
			//失敗
			{
				this.get_DB().rollback();
				return false;
			}

		if (type === "SU") {
			var up_sql = "update shop_tb set memid=" + memid + " where shopid=" + shopid;
			ret_line = this.get_DB().exec(up_sql);

			if (ret_line != 1) //更新された数が１ではない
				//失敗
				{
					this.get_DB().rollback();
					return false;
				}
		}

		this.get_DB().commit();
		return true;
	}

	updateMemberInfo(memid, H_meminfo, H_sess = undefined) //DB禁則文字のエスケープは？
	// ToDo *
	//$this->debugOut("MemberModel::updateMemberInfo, " . $upd_sql );
	// ToDo * ちいさくトランザクション入れてみたのだが、本来ページ単位では？
	//成功
	{
		if (is_numeric(memid) == false) {
			MtExcept.raise("MemberModel::updateMemberInfo() \u5F15\u6570(memid)\u304C\u306A\u3044");
			throw die(-1);
		}

		var new_name = false;
		var new_mail = false;

		if (is_null(H_sess) == false) //既存情報との比較あり
			{
				if (H_meminfo.username != H_sess.personname) //違っていたら
					{
						new_name = true;
					}

				if (H_meminfo.mail != H_sess.mail) //違っていたら
					{
						new_mail = true;
					}

				if (new_name == false && new_mail == false) //$this->debugOut("MemberModel::updateMemberInfo, メンバー情報変更なし");
					//何の変更もなく成功リターン
					{
						return true;
					}
			} else //比較するユーザー情報が無ければ、存在したものだけを更新
			{
				if (undefined !== H_sess.mail) {
					new_name = true;
				}

				if (undefined !== H_sess.personname) {
					new_mail = true;
				}
			}

		var nowdate = date("Y-m-d H:i:s");
		var upd_sql = "update shop_member_tb set ";

		if (new_name == true) {
			upd_sql += "name = '" + H_sess.personname + "',";
		}

		if (new_mail == true) {
			upd_sql += "mail = '" + H_sess.mail + "',";
		}

		upd_sql += "fixdate = '" + nowdate + "' " + "where " + "memid = " + memid;
		this.get_DB().beginTransaction();
		var ret_line = this.get_DB().exec(upd_sql);

		if (ret_line != 1) //更新された数が１ではない
			//失敗
			{
				this.get_DB().rollback();
				return false;
			}

		this.get_DB().commit();
		return true;
	}

	deleteMember(shopid, memid) //shopidは不要かもしれないが、安全のために入れた
	//まだ担当している部署が残っていないかどうか確認する
	//$this->debugOut("MemberModel::updateMemberInfo, " . $upd_sql );
	//メンバーそのものを削除する
	//$this->debugOut("MemberModel::updateMemberInfo, " . $upd_sql );
	//if( $ret_line != 1 ){	// 削除の場合はうまくカウントしていない？
	////	更新された数が１ではない
	//$this->get_DB()->rollback();
	//return false;	// 失敗
	//}
	//成功
	{
		if (is_numeric(shopid) == false) {
			MtExcept.raise("MemberModel::deleteMember() \u5F15\u6570(shopid)\u304C\u306A\u3044");
			throw die(-1);
		}

		if (is_numeric(memid) == false) {
			MtExcept.raise("MemberModel::deleteMember() \u5F15\u6570(memid)\u304C\u306A\u3044");
			throw die(-1);
		}

		this.get_DB().beginTransaction();
		var sql = "select pact.compname, post.userpostid, post.postname from shop_relation_tb shrel " + "inner join pact_tb pact on pact.pactid=shrel.pactid " + "inner join post_tb post on pact.pactid=post.pactid and shrel.postid=post.postid " + "where shopid=" + shopid + " and memid=" + memid;
		var H_result = this.get_DB().queryHash(sql);

		if (H_result.length > 0) //成功リターン
			{
				this.ErrorMessage = "\u62C5\u5F53\u3057\u3066\u3044\u308B\u90E8\u7F72\u304C\u6B8B\u3063\u3066\u3044\u307E\u3059.<br/>";

				for (var row of Object.values(H_result)) {
					this.ErrorMessage += row.compname + ", " + row.userpostid + ", " + row.postname + "<br/>";
				}

				this.get_DB().rollback();
				return true;
			}

		sql = "delete from shop_fnc_relation_tb where shopid=" + shopid + " and memid=" + memid;
		var ret_line = this.get_DB().exec(sql);
		var sumemid = this.get_DB().queryOne("SELECT memid FROM shop_member_tb WHERE type='SU' AND shopid=" + this.get_DB().dbQuote(shopid, "int", true));

		if (is_numeric(sumemid) && !is_null(sumemid)) {
			var ordersql = "UPDATE mt_order_tb SET shopmemid=" + sumemid + " WHERE shopmemid=" + this.get_DB().dbQuote(memid, "int", true);
			this.get_DB().exec(ordersql);
		} else //true返さないとエラーメッセージ表示されない
			{
				this.ErrorMessage = "\u6CE8\u6587\u306E\u62C5\u5F53\u8005\u304C\u5207\u308A\u66FF\u3048\u3089\u308C\u306A\u3044\u305F\u3081\u3001\u524A\u9664\u3067\u304D\u307E\u305B\u3093";
				this.get_DB().rollback();
				return true;
			}

		sql = "delete from shop_member_tb where shopid=" + shopid + " and memid=" + memid;
		ret_line = this.get_DB().exec(sql);
		this.get_DB().commit();
		return true;
	}

	updatePassword(memid, passwd) //shop_user_tbを更新する
	//if( $ret_line != 1 ){
	//更新された数が１ではない
	//return false;	// 失敗
	//}
	//ユーザ管理記録に書き込む
	//ここは次のようにする
	//		// ユーザ管理記録に書き込む
	//		$H_log = array( "pactid" => $this->O_Sess->pactid,
	//						"postid" => $this->O_Sess->postid,
	//						"postname" => $this->O_Sess->postname,
	//						"userid" => $this->O_Sess->userid,
	//						"username" => $this->O_Sess->loginname,
	//						"comment1" => "ID: " . $this->O_Sess->loginid,
	//						"comment2" => "ログイン処理",
	//						"kind" => "L",
	//						"type" => "ログイン",
	//						"joker_flag" => 0   // $this->O_Sess->joker
	//			);
	//		$this->O_Out->writeMnglog($H_log);
	//		
	//		$ins_mng_sql = "insert into mnglog_tb(pactid, postid, postname, userid, username, targetpostid, recdate, comment1, comment2, kind, type, joker_flag ) values(" .
	//			$_SESSION["pactid"] . "," .
	//			$_SESSION["postid"] . "," .
	//			"'" . $_SESSION["postname"] . "'," .
	//			$_SESSION["userid"] . "," .
	//			"'" . $_SESSION["loginname"] . "'," .
	//			$_SESSION["current_postid"] . "," .
	//			"'" . $nowdate . "'," .
	//			"'ID：" . $H_user["loginid"] . "'," .
	//			"'パスワード変更'," .
	//			"'U'," .
	//			"'変更'," .
	//			$joker_flg . ")";
	//commitはいらんかえ？
	//成功
	{
		if (is_numeric(memid) == false) {
			MtExcept.raise("MemberModel::updatePassword() \u5F15\u6570(memid)\u304C\u306A\u3044");
			throw die(-1);
		}

		var nowdate = date("Y-m-d H:i:s");
		var O_crypt = MtCryptUtil.singleton();
		var upd_sql = "update shop_member_tb set " + "passwd = '" + O_crypt.getCrypt(passwd) + "'," + "passwd2nd = passwd," + "passwd3rd = passwd2nd," + "fixdate = '" + nowdate + "'," + "passchanged = '" + nowdate + "'," + "miscount = 0 " + "where " + "memid = " + memid;
		var ret_line = this.get_DB().exec(upd_sql);
		return true;
	}

	updateMemberAuth(shopid, memid, H_sess) //var_dump( $H_sess );	// * DEBUG *
	//一度全ての権限を削除する
	//付いている権限だけInsertする
	//成功
	{
		if (is_numeric(shopid) == false) {
			MtExcept.raise("MemberModel::updateMemberAuth() \u5F15\u6570(memid)\u304C\u306A\u3044");
			throw die(-1);
		}

		if (is_numeric(memid) == false) {
			MtExcept.raise("MemberModel::updateMemberAuth() \u5F15\u6570(memid)\u304C\u306A\u3044");
			throw die(-1);
		}

		this.get_DB().beginTransaction();
		var sql = "delete from shop_fnc_relation_tb where shopid=" + shopid + " and memid=" + memid;
		var ret_line = this.get_DB().exec(sql);

		for (var key in H_sess) //頭に fnc_ と付いているパラメーターが権限のチェックボックス
		{
			var val = H_sess[key];

			if (preg_match("/^fnc_/", key) == true && val == 1) //$this->debugOut( $sql );	// * DEBUG *
				{
					sql = "insert into shop_fnc_relation_tb(shopid,memid,fncid) values(" + shopid + "," + memid + ",(select fncid from shop_function_tb where ininame='" + key + "') )";
					ret_line = this.get_DB().exec(sql);
				}
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};