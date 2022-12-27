//
//部署に関する情報を取得するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/03/17
//@filesource
//
//
//
//部署に関する情報を取得するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/03/17
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtTableUtil.php");

require("model/ModelBase.php");

require("model/TelModel.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/03/18
//
//@param object $O_db0 default=null データベース接続オブジェクト
//@access public
//@return void
//
//
//指定されたpostidの親postidを取得する
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $postid
//@access public
//@return integer
//
//
//会社の部署を一覧で取得
//
//@author ishizaki
//@since 2008/08/07
//
//@param mixed $pactid
//@param mixed $shopid
//@param mixed $type
//@param string $carid
//@access public
//@return void
//
//
//指定されたpostidの親postid一覧を配列で取得する
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $postid
//@param string $tableno default = ""
//@access public
//@return array
//
//
//指定されたpostidの配下を配列を取得する
//
//@author katsushi
//@since 2008/04/07
//
//@param integer $pactid
//@param integer $postid
//@param string $tableno default = ""
//@access public
//@return array
//
//
//指定された部署の部署名、ユーザー部署コードを取得する<br>
//postname,userpostidのキーを持った連想配列
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $postid
//@param string $tableno
//@access public
//@return array
//
//
//指定された複数部署の部署名、ユーザー部署コードを取得する<br>
//postidをキーとした連想配列
//
//@author katsushi
//@since 2008/04/02
//
//@param array $A_postid
//@param string $tableno
//@access public
//@return array
//
//
//ルート部署の部署ID(postid)を取得する
//
//@author katsushi
//@since 2008/04/02
//
//@param string $pactid
//@param int $level
//@param string $tableno
//@access public
//@return void
//
//
//電話番号の所属部署ID(postid)を取得する
//
//@author katsushi
//@since 2008/04/03
//
//@param string $telno_view
//@param integer $pactid
//@param integer $carid
//@param string $tableno
//@access public
//@return integer
//
//
//ユーザーの所属部署ID(postid)を取得する
//
//@author katsushi
//@since 2008/04/03
//
//@param integer $userid
//@param integer $pactid
//@access public
//@return integer
//
//
//指定した部署IDの部署名の取得
//
//@author houshiyama
//@since 2008/03/14
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $postid
//@param mixed $tb
//@access public
//@return void
//
//
//指定した部署IDに関連付いているショップIDをキャリアIDをキーとしたハッシュで返す
//
//@author ishizaki
//@since 2008/09/04
//
//@param mixed $postid
//@access public
//@return void
//
//
//指定した部署IDが存在するか調べる
//あればtrue、無ければfalse
//
//@author houshiyama
//@since 2008/09/10
//
//@param mixed $postid
//@param string $tb
//@access public
//@return void
//
//
//指定した部署階層より上の部署ＩＤリストを取得する
//
//@author maeda
//@since 2009/06/25
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $level：部署階層
//@param mixed $tableno：対象テーブル番号
//@access public
//@return 部署ＩＤリスト
//
//
//指定した部署階層にある部署ＩＤリストを取得する
//
//@author maeda
//@since 2009/06/25
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $level：部署階層
//@param mixed $tableno：対象テーブル番号
//@access public
//@return 部署ＩＤリスト
//
//
//指定された会社の部署構成情報の取得(階層付)<BR>
//Post.phpから移植
//
//@author miyazawa
//@since 2009/10/09
//
//@param int $pactid：契約ＩＤ
//@param int $table：部署構成テーブル
//@access public
//@return $H_return：子部署ＩＤをキー、親部署ＩＤと階層の連想配列を値とした連想配列
//
//
//指定された部署の指定された階層の親部署ＩＤを取得する
//Post.phpから移植
//
//@author miyazawa
//@since 2009/10/09
//
//@param int $pactid：契約ＩＤ
//@param int $curpostid：カレント部署ＩＤ
//@param mixed $postreltable：部署構成テーブル
//@param int $level：返り値として返す親部署の階層レベルy
//@access public
//@return 部署ＩＤリスト
//
//
//userpostidからpostid取得
//
//@author web
//@since 2012/02/28
//
//@param mixed $pactid
//@param mixed $userpostid
//@param string $tableno
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
class PostModel extends ModelBase {
	static FILENAME = "model/PostModel";

	constructor(O_db0 = undefined) {
		super(O_db0);
	}

	getParent(postid) {
		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "PostModel::getParent() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select " + "postidparent " + "from " + "post_relation_tb " + "where " + "postidchild = " + postid;
		var result = this.getDB().queryOne(sql);
		return result;
	}

	getPostHash(pactid, shopid, type, carid = "") {
		var where_car = "";

		if ("" != carid) {
			where_car = "and srel.carid = " + this.getDB().dbQuote(carid, "integer", true) + " ";
		}

		var post_sql = "select " + "po.postid," + "po.postname " + "from " + "shop_relation_tb srel inner join post_tb po on srel.postid = po.postid " + "where " + "srel.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "and srel.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + where_car + "group by po.postid,po.postname " + "order by po.postid";

		if (type == "assoc") {
			return this.getDB().queryAssoc(post_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(post_sql);
		} else {
			return this.getDB().getHash(post_sql);
		}
	}

	getParentList(postid, tableno = "") //※PostgreSQLのみ使用可能(DB変更の際は実装を変更すること)
	//再帰SQLを使用するためにストアドファンクション(connectby)を使用
	//$sql = "select " .
	//					"postidparent " .
	//				"from " .
	//					"connectby(" .
	//								"'" . $tablename . "', " .
	//								"'postidparent', " .
	//								"'postidchild', " .
	//								$postid . "::text, " .
	//								"0" .
	//							") as prel (" .
	//								"postidparent integer, " .
	//								"postidchild integer, " .
	//								"level integer" .
	//							") " .
	//				"order by " .
	//					"level desc," .
	//					"postidchild";
	//		$A_result = $this->getDB()->queryCol($sql);
	{
		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "PostModel::getParentList() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select pactid,level,postidparent from " + tablename + " where postidchild = " + postid;
		[pactid, level, postidparent] = this.getDB().queryRow(sql);

		if (is_numeric(pactid) == false) {
			return false;
		}

		sql = "select postidparent,postidchild,level" + " from " + tablename + " where " + " pactid = " + pactid + " and level < " + level + " order by level desc";
		var A_post = this.getDB().queryHash(sql);
		var A_result = [postid];

		if (true == Array.isArray(A_post)) {
			var cur_level = level;

			for (var cnt = 0; cnt < A_post.length; cnt++) {
				if (A_post[cnt].level < level) {
					if (A_post[cnt].postidchild == postidparent) {
						A_result.unshift(postidparent);
						postidparent = A_post[cnt].postidparent;
						level--;
					}
				}
			}
		}

		return A_result;
	}

	getChildList(pactid, postid, tableno = "") //※PostgreSQLのみ使用可能(DB変更の際は実装を変更すること)
	//再帰SQLを使用するためにストアドファンクション(connectby)を使用
	//部署が多いと凄くsqlが遅くなるので変更
	//		$sql = "select " .
	//					"postidchild " .
	//				"from " .
	//					"connectby(" .
	//								"'" . $tablename . "', " .
	//								"'postidchild', " .
	//								"'postidparent', " .
	//								$postid . "::text, " .
	//								"0" .
	//							") as prel (" .
	//								"postidchild integer, " .
	//								"postidparent integer, " .
	//								"level integer" .
	//							") " .
	//				"order by " .
	//					"level," .
	//					"postidchild";
	//		$A_result = $this->getDB()->queryCol($sql);
	{
		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "PostModel::getChildList() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select postidparent,postidchild,level" + " from " + tablename + " where " + " pactid=" + pactid + " order by level";
		var H_post = this.getDB().queryHash(sql);
		var H_postid = Array();
		var A_result = Array();
		var chk = false;

		for (var cnt = 0; cnt < H_post.length; cnt++) {
			var lvl = H_post[cnt].level;
			var pid = H_post[cnt].postidparent;
			var cid = H_post[cnt].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_result.push(cid);
				}
			} else {
				if (lvl > level) {
					if (undefined !== H_postid[pid] == true && H_postid[pid] == true) {
						H_postid[cid] = true;
						A_result.push(cid);
					}
				}
			}
		}

		delete H_postid;
		return A_result;
	}

	getPostData(postid, tableno = "") {
		if (is_numeric(postid) == false) {
			this.getOut().errorOut(0, "PostModel::getPostData() postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select " + "postname," + "userpostid " + "from " + tablename + " " + "where " + "postid = " + postid;
		return this.getDB().queryRowHash(sql);
	}

	getPostDataList(A_postid: {} | any[], tableno = "") {
		var tablename = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select " + "postid," + "postname," + "userpostid " + "from " + tablename + " " + "where " + "postid in (" + A_postid.join(",") + ")";
		return this.getDB().queryKeyAssoc(sql);
	}

	getRootPostid(pactid, level = 0, tableno = "") //入力パラメータのエラーチェック
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "PostModel::getRootPostid() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select " + "postidparent " + "from " + tablename + " " + "where " + "pactid = " + pactid + " " + "and postidparent = postidchild " + "and level = 0";
		return this.getDB().queryOne(sql);
	}

	getPostidFromTel(telno_view, pactid, carid, tableno = "") //入力パラメータのエラーチェック
	//電話番号から不要な文字列を削除する(telno_view -> telno)
	{
		if (telno_view == "") {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() telno_view\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(carid) == false) {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() carid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var tablename = MtTableUtil.makeTableName("tel_tb", tableno);
		var telno = TelModel.telnoFromTelview(telno_view);
		var sql = "select " + "postid " + "from " + tablename + " " + "where " + "pactid = " + pactid + " " + "and carid = " + carid + " " + "and telno = '" + telno + "'";
		return this.getDB().queryOne(sql);
	}

	getPostidFromUser(userid, pactid) //入力パラメータのエラーチェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "PostModel::getPostidFromUser() userid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "PostModel::getPostidFromUser() pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var sql = "select " + "postid " + "from " + "user_tb " + "where " + "pactid = " + pactid + " " + "and userid = " + userid;
		return this.getDB().queryOne(sql);
	}

	getPostNameOne(postid, tb = "post_tb") {
		var sql = "select postname from " + tb + " where postid=" + this.getDB().dbQuote(postid, "integer", true, "postid");
		return this.getDB().queryOne(sql);
	}

	getCarRelShopFromPost(postid) {
		this.getOut().debugOut(PostModel.FILENAME + "::getCarRelShopFromPost(" + postid + ")", false);
		var sql = "SELECT carid, shopid FROM shop_relation_tb WHERE postid = " + this.getDB().dbQuote(postid, "integer", true);
		this.getOut().debugOut(PostModel.FILENAME + "::getCarRelShopFromPost():sql->" + sql, false);
		return this.getDB().queryAssoc(sql);
	}

	checkPostExist(postid, tb = "post_tb") {
		var sql = "select count(postid) from " + tb + " where postid=" + this.getDB().dbQuote(postid, "integer", true);
		var res = this.getDB().queryOne(sql);

		if (res > 0) {
			return true;
		} else {
			return false;
		}
	}

	getUpperLevelPostidList(pactid, level, tableno) {
		var sql = "select postidchild from post_relation_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "level < " + level;
		return this.getDB().queryCol(sql);
	}

	getLevelPostidList(pactid, level, tableno) {
		var sql = "select postidchild from post_relation_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "level = " + level;
		return this.getDB().queryCol(sql);
	}

	getPostrelationLevel(pactid, table) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var result;
		var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = this.getDB().query(sql_str);

		while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			H_return[result.postidchild] = {
				postidparent: result.postidparent,
				level: result.level
			};
		}

		return H_return;
	}

	getTargetRootPostid(pactid, curpostid, postreltable, level) //部署構成を取得
	{
		var H_postrellevel = this.getPostrelationLevel(pactid, postreltable);
		var targetpostid = curpostid;
		var targetlevel = -1;

		while (level != targetlevel) //指定された部署ＩＤが連想配列のキーとして存在している場合
		{
			if (!H_postrellevel[targetpostid] == false) //親部署ＩＤを返す
				//指定された部署ＩＤが連想配列のキーとして存在しない場合はカレント部署ＩＤを（ルート部署になるよう）返す
				{
					targetlevel = H_postrellevel[targetpostid].level;
					targetpostid = H_postrellevel[targetpostid].postidparent;
				} else {
				return curpostid;
			}
		}

		return targetpostid;
	}

	getPostidFromUserpostid(pactid, userpostid, tableno = "") {
		if (userpostid == "") {
			this.getOut().errorOut(0, "PostModel::getPostidFromUserpostid() userpostid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var post_tb = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select postid from " + post_tb + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and userpostid=" + this.getDB().dbQuote(userpostid, "text", true);
		var postid = this.getDB().queryOne(sql);

		if (!postid || !is_numeric(postid)) {
			return false;
		}

		return postid;
	}

	__destruct() {
		super.__destruct();
	}

};