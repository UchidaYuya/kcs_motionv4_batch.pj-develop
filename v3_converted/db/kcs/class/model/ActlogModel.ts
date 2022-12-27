//
//ユーザーの行動履歴を記録する
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/04/01
//
//
//
//ユーザーの行動履歴を記録する
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/04/01
//

require("MtExcept.php");

require("MtSession.php");

require("ModelBase.php");

//
//行動履歴から除外されるディレクトリのパターン
//
//@var mixed
//@access private
//
//
//コンストラクター。
//このモデルの場合 new ではなく singletonを用いること。
//
//@author nakanita
//@since 2008/04/01
//
//@access public
//@return void
//
//
//ただ１つしか無いこのモデルのインスタンスを取得する。
//new の代わりに、このメソッドによってインスタンスを得ること。
//
//@author nakanita
//@since 2008/04/03
//
//@access public
//@return void
//
//
//Actlog除外ファイルを読み込む
//
//@author nakanita
//@since 2008/04/02
//
//@access private
//@return void
//
//
//行動履歴ログに書き込む
//
//@author nakanita
//@since 2008/04/02
//
//@param string $memo
//@param string $phpself 呼び出された機能の置かれているフルパス、PHP_SELFの値を期待している
//@param string $sessflag=false DBのsessionカラムにセッションを書き込むかどうか
//@param boolean $forced=true 強制的に書き込む
//@access public
//@return void
//
//
//ショップ側行動履歴ログに書き込む
//
//@author nakanita
//@since 2009/01/26
//
//@param string $memo
//@param string $phpself 呼び出された機能の置かれているフルパス、PHP_SELFの値を期待している
//@param string $sessflag=false DBのsessionカラムにセッションを書き込むかどうか
//@param boolean $forced=true 強制的に書き込む
//@access public
//@return void
//
//
//管理者側行動履歴ログに書き込む
//
//@author nakanita
//@since 2009/02/16
//
//@param string $memo
//@param string $phpself 呼び出された機能の置かれているフルパス、PHP_SELFの値を期待している
//@param string $sessflag=false DBのsessionカラムにセッションを書き込むかどうか
//@param boolean $forced=true 強制的に書き込む
//@access public
//@return void
//
//
//デストラクター
//
//@author nakanita
//@since 2008/04/01
//
//@access public
//@return void
//
class ActlogModel extends ModelBase {
	static O_Instance = undefined;

	constructor() {
		super();
		this.getExceptDirs();
	}

	static singleton() //まだインスタンスが生成されていなければ
	{
		if (ActlogModel.O_Instance == undefined) {
			ActlogModel.O_Instance = new ActlogModel();
		}

		return ActlogModel.O_Instance;
	}

	getExceptDirs() {
		var exfname = this.getSetting().KCS_DIR + "/conf/actlog_except.txt";

		if (false == file_exists(exfname)) {
			MtExcept.raise("Actlog\u9664\u5916\u30D5\u30A1\u30A4\u30EB" + exfname + "\u304C\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093.");
		}

		var exfile = fopen(exfname, "r");

		if (exfile == false) {
			MtExcept.raise("Actlog\u9664\u5916\u30D5\u30A1\u30A4\u30EB" + exfile + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		}

		this.A_ExceptDirs = Array();

		while ((line = fgets(exfile)) != undefined) {
			if (feof(exfile)) {
				break;
			}

			line = line.trim();

			if (line == "") {
				continue;
			}

			if (preg_match("/^#/", line)) //行頭の # はコメント
				{
					continue;
				}

			line = "/" + line.replace(/\//g, "\\/") + "/";
			this.A_ExceptDirs.push(line);
		}

		fclose(exfile);
	}

	setActlog(memo, phpself, sessflag = false, forced = true) //強制書き込みoffの場合
	//取得できなかった値に対してはデフォルト値をセットする
	//Loginしていない状態だと値がとれないので。
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of Object.values(this.A_ExceptDirs)) {
					if (preg_match(reg, phpself)) {
						return;
					}
				}
			}

		var sess = MtSession.singleton();

		if (is_null(sess.pactid) || sess.pactid == "") //$this->getOut()->debugOut("setActlog:ログインセッションが無い");
			{
				return;
			}

		if (is_null(sess.postid) || sess.postid == "") {
			return;
		}

		if (is_null(sess.userid) || sess.userid == "") {
			return;
		}

		if (sessflag == true) {
			var sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		var now_time = "'" + date("Y-m-d H:i:s") + "'";
		var sql = "insert into actlog_tb(recdate, pactid, postid, userid, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.pactid + "," + sess.postid + "," + sess.userid + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string") + "," + this.get_DB().dbQuote(session_id(), "string") + ")";
		this.get_DB().exec(sql);
	}

	setShopActlog(memo, phpself, sessflag = false, forced = true) //強制書き込みoffの場合
	//値がとれなければ何もしない
	//Loginしていない状態だと値がとれないので。
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of Object.values(this.A_ExceptDirs)) {
					if (preg_match(reg, phpself)) {
						return;
					}
				}
			}

		var sess = MtSession.singleton();

		if (is_null(sess.groupid) || sess.groupid == "") //$this->getOut()->debugOut("setShopActlog:ログインセッションが無い");
			{
				return;
			}

		if (is_null(sess.shopid) || sess.shopid == "") {
			return;
		}

		if (is_null(sess.memid) || sess.memid == "") {
			return;
		}

		if (sessflag == true) {
			var sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		var now_time = "'" + date("Y-m-d H:i:s") + "'";
		var sql = "insert into shop_actlog_tb(recdate, groupid, shopid, memid, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.groupid + "," + sess.shopid + "," + sess.memid + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string") + "," + this.get_DB().dbQuote(session_id(), "string") + ")";
		this.get_DB().exec(sql);
	}

	setAdminActlog(memo, phpself, sessflag = false, forced = true) //強制書き込みoffの場合
	//値がとれなければ何もしない
	//Loginしていない状態だと値がとれないので。
	//$this->debugOut( $sql );
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of Object.values(this.A_ExceptDirs)) {
					if (preg_match(reg, phpself)) {
						return;
					}
				}
			}

		var sess = MtSession.singleton();

		if (is_null(sess.admin_groupid) || sess.admin_groupid == "") //$this->getOut()->debugOut("setShopActlog:ログインセッションが無い");
			{
				return;
			}

		if (is_null(sess.admin_shopid) || sess.admin_shopid == "") {
			return;
		}

		if (sessflag == true) {
			var sess_serial = sess.getSerialize();
		} else {
			sess_serial = "";
		}

		var now_time = "'" + date("Y-m-d H:i:s") + "'";
		var sql = "insert into admin_actlog_tb(recdate, groupid, shopid, personname, dir, memo, session, sessid) " + "values (" + now_time + "," + sess.admin_groupid + "," + sess.admin_shopid + "," + this.get_DB().dbQuote(sess.admin_personname, "string") + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess_serial, "string") + "," + this.get_DB().dbQuote(session_id(), "string") + ")";
		this.get_DB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};