//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//部署用クラス
//
//
//
//作成日：2004/04/21
//作成者：前田
//修正：2004/05/27 森原 getPosttreebandが仮想メソッドを呼び出すよう修正
//修正：2004/06/29 宮澤 getPosttreebandとgetPostNameCodeに引数追加（デフォルト値設定済）
//メソッド追加：getTargetRootPostidとgetPostrelationLevel 2005/12/08 maeda
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

require("common.php");

require("DBUtil.php");

require("ErrorUtil.php");

//部署ツリー文字列
//システム用部署ＩＤツリー文字列
//部署ＩＤをキー、部署名（顧客用部署ＩＤ）を値とした連想配列
//子部署ＩＤをキー、親部署ＩＤを値とした連想配列
//コンストラクタ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された会社の部署名と顧客用部署ＩＤの取得
//
//[引　数] $pactid：契約ＩＤ
//$table:検索対象テーブル
//$userpostidflg:1なら顧客用部署ＩＤ追加（デフォ）、0なら追加しない	// 20040629miya追加 発送先部署名表示用
//[返り値] $H_return：部署ＩＤをキー、部署名（顧客用部署ＩＤ）を値とした連想配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された会社の部署構成情報の取得
//
//[引　数] $pactid：契約ＩＤ
//$table:検索対象テーブル
//[返り値] $H_return：子部署ＩＤをキー、親部署ＩＤを値とした連想配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された会社の部署構成情報の取得(階層付)
//
//[引　数] $pactid：契約ＩＤ
//$table:検索対象テーブル
//[返り値] $H_return：子部署ＩＤをキー、親部署ＩＤと階層の連想配列を値とした連想配列
//2005/12/08 maeda
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された子部署ＩＤの親部署ＩＤを取得する
//
//[引　数] $postidchild：子部署ＩＤ
//[返り値] 親部署ＩＤ
//親部署ＩＤがない場合は false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された子部署ＩＤの親部署ＩＤリストを取得する
//
//[引　数] $postid：子部署ＩＤ
//[返り値] 親部署ＩＤリスト（配列）
//部署単位の注文雛型導入に伴って追加 20061013miya
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//20040527森原追加
//機能：getPosttreebandから呼び出される仮想メソッド
//表示用の部署にリンクを追加するために使用する
//引数：$src：表示する文字列
//$postid：表示する部署ID
//$curpostid:ログインユーザの所属部署ＩＤ
//$targetpostid:作業部署ＩＤ
//20040527森原追加ここまで
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在作業中の部署の位置を文字列で表示する
//
//[引　数] $pactid：契約ＩＤ
//$curpostid:ログインユーザの所属部署ＩＤ
//$targetpostid:作業部署ＩＤ
//$posttable:部署検索対象テーブル
//$postreltable:部署ツリー検索対象テーブル
//$joint:部署と部署を繋げる文字列、デフォルトは" -> "	// 20040629miya追加、申請の発送先部署名表示用
//$userpostidflg:1なら顧客用部署ＩＤ追加（デフォ）、0なら追加しない	// 20040629miya追加 発送先部署名表示用、getPostNameCodeに渡す
//$errflg:デフォは1、ここでエラーを出したくないときには0	// 20040731miya追加
//[返り値] $this->posttree_str：部署ツリー文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在作業中の部署の位置をシステム用部署ＩＤ文字列で返す
//
//[引　数] $pactid：契約ＩＤ
//$curpostid:ログインユーザの所属部署ＩＤ
//$targetpostid:作業部署ＩＤ
//$posttable:部署検索対象テーブル
//$postreltable:部署ツリー検索対象テーブル
//$joint:部署と部署を繋げる文字列、デフォルトは" -> "	// 20060616naka追加、Treeの現行部署取得
//[返り値] $this->systempostidtree_str：システム用部署ＩＤツリー文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//部署情報を取得する
//
//[引　数] $pactid:契約ＩＤ
//$postid:部署ＩＤ
//$table:部署テーブル
//[返り値] $H_result:カラム名をキーとした連想配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ルート部署のシステム用部署ＩＤを取得する
//
//[引　数] $pactid:契約ＩＤ
//[返り値] $rootpostid:ルート部署のシステム用部署ＩＤ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された部署の指定された階層の親部署ＩＤを取得する
//
//[引　数] $pactid:契約ＩＤ
//$curpostid:カレント部署ＩＤ
//$postreltable:部署構成テーブル
//$level:返り値として返す親部署の階層レベル
//[返り値] システム用親部署ＩＤ
//2005/12/08 maeda
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class Post {
	constructor() {
		this.systempostidtree_str = "";
	}

	Post() {
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}
	}

	getPostNameCode(pactid, table, userpostidflg = 1) //検索結果を部署ＩＤをキーとした連想配列へ部署名（顧客用部署ＩＤ）を追加
	{
		var result;
		var sql_str = "select postid,postname,userpostid " + "from " + table + " " + "where pactid = " + pactid + " " + "order by cast(postid as int4)";
		var O_result = GLOBALS.GO_db.query(sql_str);

		while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) //顧客用部署ＩＤが空またはＮＵＬＬ、または$userpostidflgが0のとき
		{
			if (result.userpostid == "" or result.userpostid == undefined or userpostidflg == 0) {
				var value_str = htmlspecialchars(result.postname);
			} else {
				value_str = htmlspecialchars(result.postname) + "(" + result.userpostid + ")";
			}

			H_return[result.postid] = value_str;
		}

		return H_return;
	}

	getPostrelation(pactid, table) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var result;
		var sql_str = "select postidparent,postidchild " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = GLOBALS.GO_db.query(sql_str);

		while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			H_return[result.postidchild] = result.postidparent;
		}

		return H_return;
	}

	getPostrelationLevel(pactid, table) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var result;
		var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = GLOBALS.GO_db.query(sql_str);

		while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			H_return[result.postidchild] = {
				postidparent: result.postidparent,
				level: result.level
			};
		}

		return H_return;
	}

	getPostidparent(postidchild) //指定された部署ＩＤが連想配列のキーとして存在している場合
	{
		if (!this.H_postrel[postidchild] == false) //親部署ＩＤを返す
			{
				return this.H_postrel[postidchild];
			} else {
			return false;
		}
	}

	getParentList(postid) //postid基準で自分以上の部署を取得
	//重複排除
	{
		var level = "";
		var child = postid;
		A_parentlist.push(postid);

		while (level == "" || level != 0) {
			var lv_sql = "SELECT postidparent,level FROM post_relation_tb WHERE postidchild=" + child;
			var H_parent = GLOBALS.GO_db.getRow(lv_sql);

			if (H_parent != "") {
				child = H_parent[0];
				A_parentlist.push(H_parent[0]);
				level = H_parent[1];
			} else {
				level = 0;
			}
		}

		var A_parentlist = array_unique(A_parentlist);
		return A_parentlist;
	}

	getPosttreebandUrl(src, postid, curpostid, targetpostid) {
		return src;
	}

	getPosttreeband(pactid, curpostid, targetpostid, posttable = "post_tb", postreltable = "post_relation_tb", joint = " -> ", userpostidflg = 1, errflg = 1) //メンバー変数を書き換える　2009/01/09 houshi
	//部署ＩＤをキー、部署名（顧客用部署ＩＤ）を値とした連想配列が存在しないとき
	{
		this.post_tb = posttable;
		this.post_relation_tb = postreltable;

		if (this.H_post.length == 0) //部署ＩＤをキー、部署名（顧客用部署ＩＤ）を値とした連想配列を取得
			//20040629miya追加 発送先部署名表示用
			{
				this.H_post = this.getPostNameCode(pactid, posttable, userpostidflg);
			}

		if (this.H_postrel.length == 0) //子部署ＩＤをキー、親部署ＩＤを値とした連想配列を取得
			{
				this.H_postrel = this.getPostrelation(pactid, postreltable);
			}

		if (this.posttree_str == "") //20040527森原修正
			{
				this.posttree_str = this.getPosttreebandUrl(this.H_post[targetpostid], targetpostid, curpostid, targetpostid);
			}

		if (curpostid == targetpostid) {
			return this.posttree_str;
		} else //親部署ＩＤが取得できた場合
			{
				var parentid = this.getPostidparent(targetpostid);

				if (parentid != false) //所属部署と親部署が違う場合
					{
						if (curpostid != parentid) //20040527森原修正	//20040629miya修正
							//再度親部署を捜す
							//所属部署と親部署が同じ場合
							{
								this.posttree_str = this.getPosttreebandUrl(this.H_post[parentid], parentid, curpostid, targetpostid) + joint + this.posttree_str;
								this.getPosttreeband(pactid, curpostid, parentid, posttable, postreltable, joint, userpostidflg);
							} else if (curpostid == parentid) //これ以上親部署を捜す必要がないので部署ツリー文字列を返す
							//20040527森原修正	//20040629miya修正
							{
								this.posttree_str = this.getPosttreebandUrl(this.H_post[curpostid], curpostid, curpostid, targetpostid) + joint + this.posttree_str;
								return this.posttree_str;
							}
					} else {
					if (errflg == 1) {
						GLOBALS.GO_errlog.errorOut(12, "pactcd: " + pactid + "curpost: " + curpostid + "targetpost: " + targetpostid);
					} else {
						return errflg;
					}
				}

				return this.posttree_str;
			}
	}

	getSystempostidtreeband(pactid, curpostid, targetpostid, posttable = "post_tb", postreltable = "post_relation_tb", joint = " -> ") //子部署ＩＤをキー、親部署ＩＤを値とした連想配列が存在しないとき
	{
		if (this.H_postrel.length == 0) //子部署ＩＤをキー、親部署ＩＤを値とした連想配列を取得
			{
				this.H_postrel = this.getPostrelation(pactid, postreltable);
			}

		if (this.systempostidtree_str == "") {
			this.systempostidtree_str = targetpostid;
		}

		if (curpostid == targetpostid) //部署構成情報がない場合は-1をかえす
			{
				if (this.H_postrel.length == 0) {
					return -1;
				} else {
					return this.systempostidtree_str;
				}
			} else //親部署ＩＤが取得できた場合
			{
				var parentid = this.getPostidparent(targetpostid);

				if (parentid != false) //所属部署と親部署が違う場合
					{
						if (curpostid != parentid) //再度親部署を捜す
							//所属部署と親部署が同じ場合
							{
								this.systempostidtree_str = parentid + joint + this.systempostidtree_str;
								this.getSystempostidtreeband(pactid, curpostid, parentid, posttable, postreltable, joint);
							} else if (curpostid == parentid) //これ以上親部署を捜す必要がないので部署ツリー文字列を返す
							{
								this.systempostidtree_str = curpostid + joint + this.systempostidtree_str;
								return this.systempostidtree_str;
							}
					}

				return this.systempostidtree_str;
			}
	}

	getPostData(pactid, postid, table = "post_tb") {
		var sql_str = "select * from " + table + " where pactid = " + pactid + " and postid = " + postid;
		var H_result = GLOBALS.GO_db.getRowHash(sql_str);
		return H_result;
	}

	getRootPostid(pactid) {
		var sql_str = "select postidparent from post_relation_tb where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
		var rootpostid = GLOBALS.GO_db.getOne(sql_str);
		return rootpostid;
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

};