//
//Felicaカード登録Model
//
//@package Clouds
//@subpackage Model
//@author miyazawa
//@since 2010/04/27
//@uses ModelBase
//
//
//
//Felicaカード登録Model
//
//@package Base
//@subpackage Model
//@author miyazawa
//@since 2010/04/27
//@uses ModelBase
//

require("MtDBUtil.php");

require("MtDateUtil.php");

require("model/ModelBase.php");

//
//コンストラクタ
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $O_db
//@access public
//@return void
//
//
//社員番号登録チェック
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_view
//@access public
//@return void
//
//
//カードID重複チェック
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_view
//@access public
//@return void
//
//
//カード仮登録
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_view
//@access public
//@return void
//
//
//カード本登録
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_view
//@access public
//@return void
//
//
//●開発テスト用ログ
//
//@author miyazawa
//@since 2010/04/27
//
//@param mixed $H_view
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
class FelicaAddModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	checkEmployee(H_view = Array()) {
		var sql = "SELECT count(userid) FROM user_tb WHERE pactid=" + H_view.pactid + " AND employeecode='" + H_view.employee + "'";
		var cnt = this.get_DB().queryOne(sql);

		if (1 > cnt) {
			var message = mb_convert_encoding("\u793E\u54E1\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093", "UTF-8");
			echo("r=1&e=102&m=" + message);
			throw die();
		}
	}

	checkDuplicate(H_view = Array()) //delflg!=trueだったのを修正 20101013miya
	{
		var sql = "SELECT count(iccardid) FROM iccard_tb WHERE pactid=" + H_view.pactid + " AND iccardcoid=" + H_view.iccardcoid + " AND iccardid='" + H_view.cid + "' AND (delflg is null OR delflg = false)";
		var cnt = this.get_DB().queryOne(sql);

		if (0 < cnt) {
			var message = mb_convert_encoding("\u30AB\u30FC\u30C9ID\u304C\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059", "UTF-8");
			echo("r=1&e=103&m=" + message);
			throw die();
		}
	}

	addCardTemp(H_view = Array()) //エラーを入れる配列
	//ユーザ情報取得
	//日付
	//delflgが立ってるのがあったらUPDATE、そうでなければINSERT
	{
		var H_error = Array();
		var u_sql = "SELECT userid,username,postid FROM user_tb WHERE pactid=" + H_view.pactid + " AND employeecode='" + H_view.employee + "'";
		var H_user = this.get_DB().queryRowHash(u_sql);
		var nowdate = MtDateUtil.getNow();
		var sql = "SELECT count(iccardid) FROM iccard_tb WHERE pactid=" + H_view.pactid + " AND iccardcoid=" + H_view.iccardcoid + " AND iccardid='" + H_view.cid + "' AND delflg = true";
		var cnt = this.get_DB().queryOne(sql);

		if (1 == cnt) //更新日時追加 2011/05/30 s.maeda
			{
				var update_sql = "UPDATE iccard_tb SET ";
				update_sql += "userid=" + H_user.userid + ",";
				update_sql += "username='" + H_user.username + "',";
				update_sql += "postid=" + H_user.postid + ",";
				update_sql += "pre_addflg=true,";
				update_sql += "delflg=false,";
				update_sql += "fixdate='" + nowdate + "',";
				update_sql += "employeecode='" + H_view.employee + "'";
				update_sql += " WHERE pactid=" + H_view.pactid + " AND iccardcoid=" + H_view.iccardcoid + " AND iccardid='" + H_view.cid + "' AND delflg = true";
				this.get_DB().query(update_sql);
			} else if (0 == cnt) //新規登録時削除フラグ追加 2011/05/30 s.maeda
			//新規登録時更新日時追加 2011/05/30 s.maeda
			{
				var insert_sql = "INSERT INTO iccard_tb (iccardid,iccardid_view,pactid,userid,username,postid,iccardcoid,pre_addflg,delflg,recdate,fixdate,employeecode) VALUES (";
				insert_sql += "'" + H_view.cid + "',";
				insert_sql += "'" + H_view.cid + "',";
				insert_sql += H_view.pactid + ",";
				insert_sql += H_user.userid + ",";
				insert_sql += "'" + H_user.username + "',";
				insert_sql += H_user.postid + ",";
				insert_sql += H_view.iccardcoid + ",";
				insert_sql += "true,";
				insert_sql += "false,";
				insert_sql += "'" + nowdate + "',";
				insert_sql += "'" + nowdate + "',";
				insert_sql += "'" + H_view.employee + "'";
				insert_sql += ")";
				this.get_DB().query(insert_sql);
			} else {
			H_error.r = 1;
			H_error.e = 103;
			H_error.m = mb_convert_encoding("\u30AB\u30FC\u30C9ID\u304C\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059", "UTF-8");
			return H_error;
		}

		return true;
	}

	addCard(H_view = Array()) {
		var update_sql = "UPDATE iccard_tb SET ";
		update_sql += "pre_addflg=false";
		update_sql += " WHERE pactid=" + H_view.pactid + " AND iccardcoid=" + H_view.iccardcoid + " AND iccardid='" + H_view.cid + "' AND pre_addflg = true";
		var result = this.get_DB().query(update_sql);
		return result;
	}

	testLog(no, mes = "") {
		var nowdate = MtDateUtil.getNow();
		var sql = "INSERT INTO clouds_test_tb VALUES(" + no + ",'" + nowdate + "','" + mes + "')";
		this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};