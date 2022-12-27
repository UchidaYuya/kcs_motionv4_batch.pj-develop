//
//機能権限クラス
//
//修正履歴<br>
//2004/05/09 各メソッドの初期値を修正 上杉勝史<br>
//2004/05/09 メソッドgetAllFuncを追加 上杉勝史<br>
//2004/05/27 森原	chkUserAuthで、エラー画面を出さない機能を追加<br>
//getFollowerPostで、過去分を検索可能に
//2004/11/18 宮澤 getFollowerAndRecogPost追加 宮澤龍彦
//2004/11/19 宮澤 getFollowerAndRecogPost修正 宮澤龍彦
//2005/02/24 chkPactAuthで、エラー画面を出さない機能を追加 上杉勝史
//2006/11/20 chkFollowerETCを追加 宝子山
//2007/10/01 夜間注文用判定関数を追加 chkPathAuthExtend
//
//@filesource
//@package Base
//@subpackage Authority
//@since 2004/03/31
//@author 前田
//
//
//
//機能権限クラス
//
//@package Base
//@subpackage Authority
//@since 2004/03/31
//@author 前田
//

require("common.php");

require("DBUtil.php");

require("ErrorUtil.php");

require("BusinessDay.php");

//
//現在時間
//
//@var mixed
//@access public
//
//
//夜間注文ステータス
//
//@var mixed
//@access public
//
//
//コンストラクタ
//
//@access public
//@return void
//
//
//指定された会社の現在利用可能な権限の取得
//
//@param int $pactid default = "" 契約ＩＤ
//@return Array 権限ＩＤリスト
//
//
//指定されたユーザの現在利用可能な権限の取得
//
//@param integer $userid default = "" ユーザＩＤ
//@param boolean $time default = false 時間
//@param boolean $super default = false スーパーユーザ
//@return array 権限ＩＤリスト
//
//
//指定されたユーザの現在利用可能な権限の取得
//
//@param int $userid default = "" ユーザＩＤ
//@param boolean $time default = false 時間
//@param boolean $super default = true スーパーユーザフラグ
//@param boolean $assoc default = false 検索方式
//@return Hash 権限ＩＤリスト
//
//
//指定されたユーザの現在利用可能な権限の取得（英語）
//
//@param int $userid default = "" ユーザＩＤ
//@param boolean $time default = false 時間
//@param boolean $super default = true スーパーユーザフラグ
//@param boolean $assoc default = false 検索方式
//@return Hash 権限ＩＤリスト
//
//
//指定された会社が指定された機能を現在使用可能かチェックする
//
//@param int $fncid 権限ＩＤ
//@param int $pactid default = "" 契約ＩＤ
//@param boolean $myerr default = false
//@return bool true：使用可
//
//
//指定されたユーザが指定された機能を現在使用可能かチェックする
//
//@param int $fncid 権限ＩＤ
//@param int $userid default = "" ユーザＩＤ
//@param int $myerr default = false エラー画面を出さずにfalseを返す/20040527森原追加
//@return bool true：使用可
//
//
//指定されたユーザが指定された機能を使用可能かチェックする時間指定無し
//
//@param int $fncid 権限ＩＤ
//@param int $userid default = "" ユーザＩＤ
//@return bool true：使用可
//
//
//指定されたユーザが指定されたパスの機能を現在使用可能かチェックする
//
//@param int $userid default = "" ユーザＩＤ
//@param int $path default = "" ディレクトリパス
//@return void
//
//
//現在のログインユーザがスーパーユーザかどうか調べる
//
//@return void
//
//
//指定されたユーザの全権限をHashで返す
//
//@param int $userid default = "" ユーザＩＤ
//@return Hash 権限IDをキー、権限名を値としたHash
//
//
//指定された部署配下の部署IDを配列で返す
//
//20040527森原 引数 $tableno default を追加
//
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@param int $tableno default = "" post_relation_X_tbのXに入る数値(空文字列なら現在)
//@return Array 部署IDの配列
//
//
//指定された部署配下と自分を承認先に指定している部署IDを配列で返す
//
//@param int $orderid 受付番号、必須
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return Array 部署IDの配列
//
//
//指定されたユーザが配下にいるかどうか
//
//@param int $targetuserid ユーザID
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//承認先部署があるかどうかのチェック
//
//@param int $postid default = "" 自部署ID
//@return bool true,false
//
//
//現在時間（ＨＨＭＭ）を取得
//
//@return void
//
//
//指定された電話番号が配下にいるかどうか
//
//2004.07.02 by suehiro : $telno と $carid で識別するように対応
//2004.09.14 by suehiro : 不要部分削除
//2004.09.14 by suehiro : false 時のロジックの最適化
//
//@param int $targettelno 電話番号(ハイフンなし)
//@param int $carid 電話会社
//@param int $tableno default = "" テーブル番号(tel_X_tb)
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//指定された予約電話番号が配下にいるかどうか
//
//@param int $targettelno 電話番号(ハイフンなし)
//@param int $carid 電話会社
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//指定されたETC番号が配下にいるかどうか
//
//@param int $etc_cardno ETCカード番号(ハイフンなし)
//@param int $tableno default = "" テーブル番号(tel_X_tb)
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//ユーザの所属する企業コードを取得する
//
//@param int $userid $default = ""
//@return int 企業コード
//
//
//pactid から userid_iniを取得
//
//@author
//@since 2010/10/28
//
//@param string $pactid
//@access public
//@return void
//
class Authority {
	Authority() //$this->hhmm = 200;
	//夜間注文ステータスを取得
	//このしたのコメントアウトをはずし、上の一行を削除する
	//$this->extend = BusinessDay::chkBizTime();
	{
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}

		this.getTime();
		this.extend = "normal";
	}

	getAllPactAuth(pactid = "") //有効無効フラグ true:有効、false:無効
	//2007-10-02 katsushi 夜間注文対応
	//権限ＩＤのリストを返す
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var sql_str = "select frl.fncid " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.pactid = " + pactid + " and " + "frl.userid = 0 and " + "fnc.type = 'CO' and " + "fnc.enable = true and ";
		var extend_flg = false;

		if (this.extend == "extend" && this.chkPactAuth(EXTEND_FNCID, pactid, true) == true && undefined !== _SESSION.joker == false) {
			extend_flg = true;
		}

		if (extend_flg == true) //$sql_str .= "extend = true ";
			//利用可能終了時間
			{
				sql_str += "(extend = true or (";
				sql_str += "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + ")) ";
			} else //利用可能終了時間
			{
				sql_str += "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + " ";
			}

		sql_str += "order by frl.fncid";
		var A_return = GLOBALS.GO_db.getCol(sql_str);
		return A_return;
	}

	getAllUserAuth(userid = "", time = false, super = false) //権限ＩＤのリストを返す
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select frl.fncid " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true ";

		if (super == false) //権限タイプ
			{
				sql_str += "and fnc.type != 'SU' ";
			}

		if (time == false) //2007-10-02 katsushi 夜間注文対応
			{
				if (undefined !== _SESSION.pactid == true) {
					var pactid = _SESSION.pactid;
				}

				if (pactid == "") {
					pactid = this.getPactId(userid);
				}

				var extend_flg = false;

				if (this.extend == "extend" && this.chkPactAuth(EXTEND_FNCID, pactid, true) == true && undefined !== _SESSION.joker == false) {
					extend_flg = true;
				}

				if (extend_flg == true) //利用可能終了時間
					{
						sql_str += "and (extend = true or (" + "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + ")) ";
					} else //利用可能終了時間
					{
						sql_str += "and cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + " ";
					}
			}

		sql_str += "order by frl.fncid";
		var A_return = GLOBALS.GO_db.getCol(sql_str);
		return A_return;
	}

	getAllUserAuthHash(userid = "", time = false, super = true, assoc = false) //有効無効フラグ true:有効、false:無効
	//権限ＩＤのリストを返す
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select frl.fncid,fnc.fncname " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true ";

		if (super == false) //権限タイプ
			{
				sql_str += "and fnc.type != 'SU' ";
			}

		sql_str += "order by fnc.show_order,frl.fncid";

		if (assoc == true) {
			var H_return = GLOBALS.GO_db.getAssoc(sql_str);
		} else {
			H_return = GLOBALS.GO_db.getAll(sql_str);
		}

		return H_return;
	}

	getAllUserAuthHashEng(userid = "", time = false, super = true, assoc = false) //有効無効フラグ true:有効、false:無効
	//権限ＩＤのリストを返す
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select frl.fncid,fnc.fncname_eng " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true ";

		if (super == false) //権限タイプ
			{
				sql_str += "and fnc.type != 'SU' ";
			}

		sql_str += "order by frl.fncid";

		if (assoc == true) {
			var H_return = GLOBALS.GO_db.getAssoc(sql_str);
		} else {
			H_return = GLOBALS.GO_db.getAll(sql_str);
		}

		return H_return;
	}

	chkPactAuth(fncid, pactid = "", myerr = false) //利用可能終了時間
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var sql_str = "select count(frl.fncid) " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.pactid = " + pactid + " and " + "frl.userid = 0 and " + "fnc.fncid = " + fncid + " and " + "fnc.type = 'CO' and " + "fnc.enable = true and " + "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm;
		var result = GLOBALS.GO_db.getOne(sql_str);

		if (result == 0) {
			if (myerr) return false;

			if ("ENG" == _SESSION.language) {
				GLOBALS.GO_errlog.warningOut(6, "pactcd: " + pactid, 1, "/Menu/menu.php", "To menu");
			} else {
				GLOBALS.GO_errlog.warningOut(6, "pactcd: " + pactid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
			}
		} else {
			return true;
		}
	}

	chkUserAuth(fncid, userid = "", myerr = false) //有効無効フラグ true:有効、false:無効
	//2007-10-02 katsushi 夜間注文対応
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select count(frl.fncid) " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.fncid = " + fncid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true and ";

		if (undefined !== _SESSION.pactid == true) {
			var pactid = _SESSION.pactid;
		}

		if (pactid == "") {
			pactid = this.getPactId(userid);
		}

		var extend_flg = false;

		if (this.extend == "extend" && this.chkPactAuth(EXTEND_FNCID, pactid, true) == true && undefined !== _SESSION.joker == false) {
			extend_flg = true;
		}

		if (extend_flg == true) {
			sql_str += "extend = true";
		} else //利用可能終了時間
			{
				sql_str += "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm;
			}

		var result = GLOBALS.GO_db.getOne(sql_str);

		if (result == 0) {
			if (myerr) return false;

			if ("ENG" == _SESSION.language) {
				GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "To menu");
			} else {
				GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
			}
		} else {
			return true;
		}
	}

	chkUserAuthAll(fncid, userid = "") //有効無効フラグ true:有効、false:無効
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select count(frl.fncid) " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.fncid = " + fncid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true";
		var result = GLOBALS.GO_db.getOne(sql_str);

		if (result == 0) {
			return false;
		}

		return true;
	}

	chkPathAuth(userid = "", path = "") //2007-10-02 katsushi 夜間注文対応
	{
		if (userid == "") {
			userid = _SESSION.userid;
		}

		if (path == "") {
			path = dirname(_SERVER.PHP_SELF);
		}

		var sql_str = "select " + "count(frl.fncid) " + "from " + "fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.userid = " + userid + " " + "and fnc.path = '" + path + "' " + "and fnc.type != 'CO' " + "and fnc.enable = true ";

		if (undefined !== _SESSION.pactid == true) {
			var pactid = _SESSION.pactid;
		}

		if (pactid == "") {
			pactid = this.getPactId(userid);
		}

		var extend_flg = false;

		if (this.extend == "extend" && this.chkPactAuth(EXTEND_FNCID, pactid, true) == true && undefined !== _SESSION.joker == false) {
			extend_flg = true;
		}

		if (extend_flg == true) //利用可能終了時間
			{
				sql_str += "and (extend = true or (" + "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + ")) ";
			} else {
			sql_str += "and cast(fnc.starttime as integer) <= " + this.hhmm + " " + "and cast(fnc.endtime as integer) > " + this.hhmm;
		}

		var result = GLOBALS.GO_db.getOne(sql_str);

		if (result <= 0) //$_SESSION["userid"] = "";
			//表示言語分岐
			{
				if ("ENG" == _SESSION.language) {
					GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "To menu");
				} else {
					GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
				}
			}
	}

	chkSuperUser() {
		if (_SESSION.su == false) //$_SESSION["userid"] = "";
			//表示言語分岐
			{
				if ("ENG" == _SESSION.language) {
					GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "To menu");
				} else {
					GLOBALS.GO_errlog.warningOut(6, "usercd: " + userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
				}
			}
	}

	getAllFunc(userid = "") {
		if (userid == "") {
			userid = _SESSION.userid;
		}

		var sql_str = "select frl.fncid " + "from fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where frl.userid = " + userid + " and " + "fnc.type != 'CO' and " + "fnc.enable = true and " + "cast(fnc.starttime as integer) <= " + this.hhmm + " and " + "cast(fnc.endtime as integer) > " + this.hhmm + " " + "order by frl.fncid";
		sql_str = "select " + "fnc.fncid," + "fnc.fncname " + "from " + " function_tb fnc left join fnc_relation_tb frl on frl.fncid = fnc.fncid " + "where " + "frl.userid = " + userid + " " + "and fnc.type != 'CO' " + "and fnc.enable = true " + "order by fnc.fncid";
		return GLOBALS.GO_db.getAll(sql_str);
	}

	getFollowerPost(postid = "", pactid = "", tableno = "") //20040527森原修正ここまで
	{
		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var sql_str = "select postidparent,postidchild,level from ";
		if ("" == tableno) sql_str += "post_relation_tb";else //20040602森原一行削除
			{
				sql_str += "post_relation_";
				sql_str += tableno;
				sql_str += "_tb";
			}
		sql_str += " where pactid=" + _SESSION.pactid + " order by level";
		var H_post = GLOBALS.GO_db.getHash(sql_str);
		var H_postid = Array();
		var A_postid_list = Array();
		var chk = false;

		for (var i = 0; i < H_post.length; i++) {
			var lvl = H_post[i].level;
			var pid = H_post[i].postidparent;
			var cid = H_post[i].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_postid_list.push(cid);
				}
			} else {
				if (lvl > level) {
					if (undefined !== H_postid[pid] && H_postid[pid] == true) {
						H_postid[cid] = true;
						A_postid_list.push(cid);
					}
				}
			}
		}

		delete H_postid;
		return A_postid_list;
	}

	getFollowerAndRecogPost(orderid, postid = "", pactid = "") {
		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var sql_str = "select postidparent,postidchild,level from post_relation_tb where pactid=" + _SESSION.pactid + " order by level";
		var H_post = GLOBALS.GO_db.getHash(sql_str);
		var H_postid = Array();
		var A_postid_list = Array();
		var chk = false;

		for (var i = 0; i < H_post.length; i++) {
			var lvl = H_post[i].level;
			var pid = H_post[i].postidparent;
			var cid = H_post[i].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_postid_list.push(cid);
				}
			} else {
				if (lvl > level) {
					if (H_postid[pid] == true) {
						H_postid[cid] = true;
						A_postid_list.push(cid);
					}
				}
			}
		}

		var recog_sql_str = "SELECT postidfrom FROM recognize_tb WHERE pactid=" + pactid + " AND postidto=" + postid;
		A_postid_list = array_merge(A_postid_list, GLOBALS.GO_db.getCol(recog_sql_str));
		var ch_sql_str = "SELECT DISTINCT chpostid FROM order_history_tb WHERE chpostid IS NOT NULL AND orderid =" + orderid;
		A_postid_list = array_merge(A_postid_list, GLOBALS.GO_db.getCol(ch_sql_str));
		var next_sql_str = "SELECT DISTINCT nextpostid FROM order_history_tb WHERE nextpostid IS NOT NULL AND orderid =" + orderid;
		A_postid_list = array_merge(A_postid_list, GLOBALS.GO_db.getCol(next_sql_str));
		A_postid_list = array_unique(A_postid_list);
		delete H_postid;
		return A_postid_list;
	}

	checkFollowerUser(targetuserid, postid = "", pactid = "") {
		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (is_numeric(targetuserid) == false) //表示言語分岐
			{
				if ("ENG" == _SESSION.language) {
					GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "To menu");
				} else {
					GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
				}
			}

		var check_sql = "select postid from user_tb where userid = " + targetuserid;
		var targetpostid = GLOBALS.GO_db.getOne(check_sql);
		var sql_str = "select postidparent,postidchild,level from post_relation_tb where pactid=" + _SESSION.pactid + " order by level";
		var H_post = GLOBALS.GO_db.getHash(sql_str);
		var H_postid = Array();
		var A_postid_list = Array();
		var chk = false;

		for (var i = 0; i < H_post.length; i++) {
			var lvl = H_post[i].level;
			var pid = H_post[i].postidparent;
			var cid = H_post[i].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_postid_list.push(cid);
				}
			} else {
				if (lvl > level) {
					if (H_postid[pid] == true) {
						H_postid[cid] = true;
						A_postid_list.push(cid);
					}
				}
			}
		}

		delete H_postid;

		if (-1 !== A_postid_list.indexOf(targetpostid) == false) //表示言語分岐
			{
				if ("ENG" == _SESSION.language) {
					GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "To menu");
				} else {
					GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
				}
			}

		return true;
	}

	checkRecog(postid = "") {
		if (postid == "") {
			postid = _SESSION.postid;
		}

		var cksql = "select count(usr.userid) from recognize_tb recg inner join user_tb usr on recg.postidto=usr.postid " + "where recg.postidfrom = " + postid;
		var cnt = GLOBALS.GO_db.getOne(cksql);

		if (cnt < 1) //表示言語分岐
			{
				if ("ENG" == _SESSION.language) {
					GLOBALS.GO_errlog.warningOut(l7, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "To menu");
				} else {
					GLOBALS.GO_errlog.warningOut(l7, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
				}
			}
	}

	getTime() //jokerでログインした場合は現在時間を１２時にする
	{
		if (undefined !== _SESSION.joker == true and _SESSION.joker == 1) //$this->hhmm = "1200";
			{
				this.hhmm = "800";
			} else {
			this.hhmm = date("Hi") + 0;
		}
	}

	checkFollowerTel(targettelno, carid, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "tel_tb";
		} else {
			tablename = "tel_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerTelReserve(targettelno, carid, postid = "", pactid = "") {
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var check_sql = "select postid from tel_reserve_tb where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerETC(etc_cardno, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "card_tb";
		} else {
			tablename = "card_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where cardno = '" + etc_cardno + "' and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	getPactID(userid = "") {
		if (is_numeric(userid) == false) {
			userid = _SESSION.userid;
		}

		if (userid == "") {
			return false;
		}

		var get_sql = "select pactid from user_tb where userid=" + userid;
		var pactid = GLOBALS.GO_db.getOne(get_sql);
		return pactid;
	}

	getUseridIni(pactid = "") {
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var sql = "SELECT userid_ini FROM pact_tb WHERE pactid = " + pactid;
		return GLOBALS.GO_db.getOne(sql);
	}

};