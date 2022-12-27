require("common.php");

require("DBUtil.php");

require("Post.php");

require("Authority.php");

require("MtPostUtil.php");

//対象テーブル -- 過去分のときはここを書き換える
//カレント部署ＩＤセッション名
//現行部署の指定、getCurrentPath で使用
//ツリーの全開時に確認を出すか否か
//var $confOpen = false;
//makeTreePostにおいて、chgPostかsetPostかを選択
//初期表示状態
//var $disp = "block";    // or "none"
//日本語表示（英語化対応）
//追加 20090424miya
//追加 20090827miya
//追加 20090827miya
//
//コンストラクタ
//
//@author houshiyama
//@since 2008/12/24
//
//@access public
//@return void
//
////////////////////////////////////////////////////////////////
//カレント部署へのパスを求める
//返り値: カレント部署までのパス、アンダースコア区切の文字列
////////////////////////////////////////////////////////////////
//Treeの作成
////////////////////////////////////////////////////////////////
//Treeの作成
////////////////////////////////////////////////////////////////
//Treeの作成、部署移動（過去）で使用
//ほとんど上の makeTreeと同じだが、各所に"2"が入る
////////////////////////////////////////////////////////////////
//Treeの作成、ユーザー変更、部署移動で使用
////////////////////////////////////////////////////////////////
//Treeの作成、部署新規登録に使用
////////////////////////////////////////////////////////////////
//Treeの作成、受注新規に使用
////////////////////////////////////////////////////////////////
//Treeの作成、雛形の登録時に使用
////////////////////////////////////////////////////////////////
//Treeの作成、受注新規に使用
////////////////////////////////////////////////////////////////
//Treeの作成販売店の注文代行に使用 20061012iga (makeTreeRecogを一部改変)
//包括対応　2008/11/05 houshiyama
////////////////////////////////////////////////////////////////
//Treeの作成サポート部門による販売店の注文代行成り代わりに使用 20080319miya (makeTreeShopOrdをshopid指定に改変)
////////////////////////////////////////////////////////////////
//子供がいるかどうか調べる
////////////////////////////////////////////////////////////////
//JavaScript
//
//Treeの作成、管理情報移動で使用
//makeTreePostを参考に作成
//
//@author houshiyama
//@since 2008/06/04
//
//@param mixed $postid
//@param string $expand
//@access public
//@return void
//
class TreeAJAX {
	constructor() {
		this.post_tb = "post_tb";
		this.post_relation_tb = "post_relation_tb";
		this.curpost_sessionname = "";
		this.current_postid = "";
		this.setPost = false;
		this.disp = "none";
		this.WindowTitle = "\u90E8\u7F72\u9078\u629E";
		this.CloseBtn = "\u9589\u3058\u308B";
		this.NoShopStr = "\u8CA9\u58F2\u5E97\u304C\u95A2\u9023\u4ED8\u3051\u3089\u308C\u3066\u3044\u307E\u305B\u3093";
		this.SelectablePostStr = "\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD";
		this.NoSelectStr = "\u627F\u8A8D\u5148\u3092\u6307\u5B9A\u3057\u306A\u3044";

		if (undefined !== _SESSION.language == true && "ENG" == _SESSION.language) //追加 20090424miya
			//追加 20090827miya
			//追加 20090827miya
			{
				this.WindowTitle = "Department Select";
				this.CloseBtn = "Close";
				this.NoShopStr = "Not related with a shop";
				this.SelectablePostStr = "Only department with \"\u25CE\" can be selected";
				this.NoSelectStr = "Select no department to be approved";
			}
	}

	getCurrentPath() //現在作業中の部署の位置をシステム用部署ＩＤ文字列で返す
	//[引　数] $pactid：契約ＩＤ
	//$curpostid:ログインユーザの所属部署ＩＤ
	//$targetpostid:作業部署ＩＤ
	//$posttable:部署検索対象テーブル
	//$postreltable:部署ツリー検索対象テーブル
	//$joint:部署と部署を繋げる文字列、デフォルトは" -> "
	//echo "DEBUG: pactid=" . $_SESSION["pactid"] . "<br>\n";
	//echo "DEBUG: postid=" . $_SESSION["postid"] . "<br>\n";
	//echo "DEBUG: current_postid=" . $_SESSION["current_postid"] . "<br>\n";
	//echo "DEBUG: postpath=" . $postpath . "<br>\n";
	{
		var pst = new Post();
		var postpath = pst.getSystempostidtreeband(_SESSION.pactid, _SESSION.postid, this.current_postid, this.post_tb, this.post_relation_tb, "_");
		return postpath;
	}

	makeTreeForAddBillModBulk(postid = false, expand = "") //先頭のTabより前を除く
	//SQL
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0<span id='MaintreeTitle'>" + this.WindowTitle + "</span></font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink = "/XML/treexml_addbillmodbulk.php?pa=" + H_post.postidchild + "-" + H_post.level + "-" + expand + "&curpos=" + this.curpost_sessionname + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:set_postid(" + H_post.postidchild + ",'" + H_post.userpostid + "','" + H_post.postname + "')\"" + ");";
		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTree(postid = false, expand = "") //先頭のTabより前を除く
	//SQL
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink = "/XML/treexml.php?pa=" + H_post.postidchild + "-" + H_post.level + "-" + expand + "&curpos=" + this.curpost_sessionname + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"?pid=" + H_post.postidchild + "\"" + ");";
		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreePast(postid = false, expand = "") //先頭のTabより前を除く
	//SQL
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var rtn_str = "\n<div class=\"layer\" id=\"XTree2\" style=\"z-index:2; position:absolute; top:200; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree2\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree2');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
			var user_post2 = " \u3014" + htmlspecialchars(H_post.userpostid) + "\u3015";
		} else {
			user_post = "";
			user_post2 = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_past.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&curpos=" + this.curpost_sessionname + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree2 = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:chgPost('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post2 + "', true, 'Maintree2')\"" + ");";
		rtn_str += "\ntree2.write();\ntree2.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree2');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree2.src = \"" + xlink_base + "-\" + expand + \"&curpos=" + this.curpost_sessionname + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree2.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreePost(postid = false, expand = "") //先頭のTabより前を除く
	//SQL
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	//リンク先には２パターンある...
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
			var user_post2 = " \u3014" + htmlspecialchars(H_post.userpostid) + "\u3015";
		} else {
			user_post = "";
			user_post2 = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) //子供には２パターンある...
			{
				if (this.setPost == false) {
					xlink_base = "/XML/treexml_post.php?pa=" + H_post.postidchild + "-" + H_post.level;
				} else {
					xlink_base = "/XML/treexml_setpost.php?pa=" + H_post.postidchild + "-" + H_post.level;
				}

				xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
			}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\",";

		if (this.setPost == false) {
			rtn_str += "\"javascript:chgPost('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post2 + "', true, 'Maintree')\"" + ");";
		} else {
			rtn_str += "\"javascript:setPost('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post + "')\"" + ");";
		}

		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeRecog(postid = false, expand = "", postnew = false) //$postnew : 新規登録なら true 、部署変更なら false
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//$_SESSION["recog_tree_post"] = $A_pickup_postid;
	//セッション名を変更 20070510iga
	//SQL
	//Tree最初の部署の表示スタイル修飾
	//承認部署であるかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		var H_fnc = GLOBALS.GO_db.getAssoc("SELECT ininame, fncid FROM function_tb WHERE ininame IN ('fnc_mt_recog')");

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		var sql_str = "select rec.postidfrom " + "from recognize_tb rec inner join user_tb us on rec.pactid = us.pactid and rec.postidfrom = us.postid " + "inner join fnc_relation_tb frl on frl.pactid = us.pactid and frl.userid = us.userid " + "inner join " + this.post_tb + " po on us.pactid = po.pactid and  us.postid = po.postid " + "where rec.pactid = " + _SESSION.pactid + " and " + "frl.fncid IN ( " + RECOG + ", " + H_fnc.fnc_mt_recog + ")";

		if (postnew == false) {
			sql_str = sql_str + " union " + "select us.postid " + "from user_tb us inner join fnc_relation_tb frl on us.pactid = frl.pactid and us.userid = frl.userid " + "inner join " + this.post_tb + " po on us.pactid = po.pactid and us.postid = po.postid " + "where us.pactid = " + _SESSION.pactid + " and " + "us.postid = " + _SESSION.current_postid + " and " + "frl.fncid IN ( " + RECOG + ", " + H_fnc.fnc_mt_recog + ")";
		}

		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		_SESSION.makeTreeRecog_tree_post = A_pickup_postid;
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t<span class=\"treeAlert\">" + this.SelectablePostStr + "</span>&nbsp;\n\t\t\t<br><br>\n\t\t\t\t<a class=\"treeAlert\" href=\"javascript:setRecog('','',true)\">" + this.NoSelectStr + "</a>\n\t\t\t<br><br>\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " ";

		if (postid != false) //postid が指定されているときにはその部署を
			{
				top_sql += "and po.postid = " + postid;
			} else //そうでないときにはTOP部署を指定する
			{
				top_sql += "and pr.level = 0";
			}

		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var recogflg = false;

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid == H_post.postid) {
				recogflg = true;
				break;
			}
		}

		if (recogflg) //部署名の前にマークを表示
			{
				var chkmark = "\u25CE";
			} else {
			chkmark = "";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_recog.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		if (recogflg) {
			rtn_str += "\n\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:setRecog('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post + "', true)\"" + ");";
		} else {
			rtn_str += "\n\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"\");";
		}

		rtn_str += "\n\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n    tree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeRegist(postid = false, expand = "", carid) //$postnew : 新規登録なら true 、部署変更なら false
	//先頭のTabより前を除く
	//登録部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・販売店が紐付いている部署
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//SQL
	//Tree最初の部署の表示スタイル修飾
	//販売店が紐付いているかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" + _SESSION.pactid + " AND carid=" + carid;
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		_SESSION.regist_tree_post = A_pickup_postid;
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t\t&nbsp;&nbsp;&nbsp;\n\t\t\t<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>&nbsp;\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var shopflg = false;

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid == H_post.postid) {
				shopflg = true;
				break;
			}
		}

		if (shopflg) //部署名の前にマークを表示
			{
				var chkmark = "\u25CE";
				var shopmsg = "";
			} else {
			chkmark = "";
			shopmsg = "\uFF08" + this.NoShopStr + "\uFF09";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_regist.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + shopmsg + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:setRecog('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post + "', true)\"" + ");";
		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand;\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeOrderForm(postid = false, expand = "", carid) //$postnew : 新規登録なら true 、部署変更なら false
	//先頭のTabより前を除く
	//登録部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・販売店が紐付いている部署
	//雛形の登録ではキャリアidを見ない
	//$sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" . $_SESSION["pactid"] .
	//" AND carid=" . $carid;
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//SQL
	//Tree最初の部署の表示スタイル修飾
	//販売店が紐付いているかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" + _SESSION.pactid;
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		_SESSION.regist_tree_post = A_pickup_postid;
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t\t&nbsp;&nbsp;&nbsp;\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var shopflg = false;

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid == H_post.postid) {
				shopflg = true;
				break;
			}
		}

		if (shopflg) //部署名の前にマークを表示（※廃止した）
			{
				var chkmark = "";
				var shopmsg = "";
			} else {
			chkmark = "";
			shopmsg = "\uFF08" + this.NoShopStr + "\uFF09";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_orderform.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + shopmsg + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:setRecog('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post + "', true)\"" + ");";
		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand;\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeRootActOrder(postid = false, expand = "", carid) //$postnew : 新規登録なら true 、部署変更なら false
	//先頭のTabより前を除く
	//ルート部署の注文制御(第2階層販売店への発注対応) 20061024iga
	//pactidを取得
	//ルート部署を取得
	//第2階層権限を取得
	//ルート部署でログインして第2階層権限を持っていれば、第2階層の販売店へオーダーする(実処理はorder_form.php)
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//$_SESSION["regist_tree_post"] = $A_pickup_postid;
	//セッション名変更 20070510iga
	//SQL
	//A_pickup_postidに1件も登録が無ければ表示する 20070509iga
	//Tree最初の部署の表示スタイル修飾
	//販売店が紐付いているかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	{
		var Auth = new Authority();

		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var pact_sql = "SELECT pactid FROM " + this.post_relation_tb + " WHERE postidchild=" + _SESSION.current_postid;
		var getpact = GLOBALS.GO_db.getOne(pact_sql);
		var root_sql = "SELECT postidparent FROM " + this.post_relation_tb + " WHERE level=0 AND pactid=" + getpact;
		var rootpost = GLOBALS.GO_db.getOne(root_sql);
		var auth_sql = "SELECT fncid FROM fnc_relation_tb WHERE fncid=" + G_AUTH_ROOT_ACTORDER + " AND pactid=" + getpact;
		var get_auth = GLOBALS.GO_db.getOne(auth_sql);

		if (rootpost == _SESSION.current_postid && get_auth == G_AUTH_ROOT_ACTORDER) {
			var chk_flg = true;
			_SESSION.chk_flg = chk_flg;
		}

		if (chk_flg == false) //登録部署として指定可能な部署ＩＤのリストを取得する
			//（条件）・販売店が紐付いている部署 -> フルオープンに変更
			//$sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" . $_SESSION["pactid"] . " AND carid=" . $carid;
			{
				var sql_str = "SELECT postid FROM post_tb WHERE pactid=" + _SESSION.pactid;
				var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
			} else //ルート部署の注文制御(第2階層販売店への発注対応) 20061024iga
			//(条件)・販売店が登録されている第2階層部署とその配下の部署
			//全ての部署を取得する
			//販売店が登録されていて、承認先に指定されている第2階層部署を取得
			//第2階層の部署を全て取得
			//セッション名を変更 20070511iga
			//販売店が登録されていない第2階層部署を抜き出す
			//$_SESSION["A_extract"] = $A_extract;	//	使ってない＆重くなるので消去 20070507iga
			//ツリー生成時に同じ処理をさせたのここでは行わない 20070508iga
			//			// 販売店が登録されていない第2階層部署の配下にある部署を抜き出す
			//			$A_except = array(0);
			//			foreach($A_extract as $temp){
			//				$A_except = array_merge($A_except, $Auth->getFollowerPost($temp, $getpact)); 				
			//			}
			//販売店が登録されている第2階層部署とその配下の部署のみツリーに表示する
			//$except_sql = "SELECT postid FROM " . $this->post_tb . " WHERE postid NOT IN(" . implode(",", $A_except) . ") and pactid=" . $getpact;
			//$A_pickup_postid = $GLOBALS["GO_db"]->getCol($except_sql);
			//表示しない第2階層部署を渡す 20070509iga
			{
				var allpost_sql = "SELECT postid FROM " + this.post_relation_tb + " WHERE pactid=" + getpact;
				var spost_sql = "SELECT DISTINCT postid FROM shop_relation_tb WHERE postid IN " + "(SELECT DISTINCT " + this.post_tb + ".postid FROM " + this.post_tb + " " + "INNER JOIN " + this.post_relation_tb + " ON " + this.post_relation_tb + ".postidchild=" + this.post_tb + ".postid " + "LEFT JOIN shop_relation_tb ON shop_relation_tb.pactid=" + this.post_tb + ".pactid " + "WHERE " + this.post_tb + ".pactid=" + getpact + " AND " + this.post_relation_tb + ".level=1) " + "AND shop_relation_tb.carid=" + carid;
				var A_spost = GLOBALS.GO_db.getCol(spost_sql);
				var lpost_sql = "SELECT postidchild FROM " + this.post_relation_tb + " WHERE level=1 AND pactid=" + getpact;
				var A_lpost = GLOBALS.GO_db.getCol(lpost_sql);
				_SESSION.MakeTreeRootActOrder_A_lpost = A_lpost;
				var A_extract = array_diff(A_lpost, A_spost);
				A_pickup_postid = Array();

				for (var key in A_extract) {
					var val = A_extract[key];
					A_pickup_postid.push(val);
				}
			}

		_SESSION.makeTreeRootActOrder_tree_post = A_pickup_postid;

		if (chk_flg == true) {
			var ale_str = "\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD";
		} else {
			ale_str = "";
		}

		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t\t&nbsp;&nbsp;&nbsp;\n\t\t\t<span class=\"treeAlert\">" + ale_str + "</span>&nbsp;\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);

		if (A_pickup_postid.length <= 0) {
			var shopflg = true;
		} else {
			shopflg = false;
		}

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid != H_post.postid) //条件を==から!=に変更(A_pickup_postidを許可リストから拒否リストに変えた) 20070509iga
				{
					shopflg = true;
					break;
				}
		}

		if (shopflg) //部署名の前にマークを表示
			{
				var chkmark = "\u25CE";
				var shopmsg = "";
			} else {
			chkmark = "";
			shopmsg = "\uFF08" + this.NoShopStr + "\uFF09";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_rootactorder.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + shopmsg + r2tag + "\", " + "\"" + xlink + "\"," + "\"javascript:setRecog('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.postname) + user_post + "', true)\"" + ");";
		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand;\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeShopOrd(postid = false, expand = "", postnew = false, houkatsu = true) //$postnew : 新規登録なら true 、部署変更なら false
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//$_SESSION["recog_tree_post"] = $A_pickup_postid;
	//セッション名を変更 20070510iga
	//SQL
	//Tree最初の部署の表示スタイル修飾
	//承認部署であるかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	//userpostidがなければ（）を表示しない
	//初回表示の動作(ツリー展開後はtreexml_shopord.phpで設定)
	//販売店に結び付けられていないルート部署はリンクしない
	{
		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		if (houkatsu == true) {
			var get_support = "select childshop from support_shop_tb where parentshop=" + _SESSION.shopid;
			var A_shopid = GLOBALS.GO_db.getCol(get_support);
			A_shopid.push(_SESSION.shopid);
		} else {
			A_shopid = Array();
			A_shopid.push(_SESSION.shopid);
		}

		var sql_str = "select distinct postid " + "from shop_relation_tb where pactid=" + _SESSION.pactid + " and " + "shopid in (" + A_shopid.join(",") + ")";
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		_SESSION.makeTreeShopOrd_tree_post = A_pickup_postid;
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>&nbsp;\n\t\t\t<br><br>\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " ";

		if (postid != false) //postid が指定されているときにはその部署を
			{
				top_sql += "and po.postid = " + postid;
			} else //そうでないときにはTOP部署を指定する
			{
				top_sql += "and pr.level = 0";
			}

		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var recogflg = false;

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid == H_post.postid) {
				recogflg = true;
				break;
			}
		}

		if (recogflg) //部署名の前にマークを表示
			{
				var chkmark = "\u25CE";
			} else {
			chkmark = "";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_shopord.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		var root_sql = "select " + "distinct shop.postid " + "from shop_relation_tb shop " + "inner join post_relation_tb post on post.pactid=shop.pactid AND post.postidparent=shop.postid AND post.level=0 " + "where post.pactid=" + _SESSION.pactid + " and " + "shop.shopid in (" + A_shopid.join(",") + ") ";
		var root_post = GLOBALS.GO_db.getOne(root_sql);

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		if (H_post.postid == root_post) {
			rtn_str += "\n\t\t\tvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"?pos=" + H_post.postidchild + "\"" + ");";
		} else {
			rtn_str += "\n\t\t\tvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\")";
		}

		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	makeTreeShopOrdForSupport(postid = false, shopid = "", expand = "", postnew = false) //$postnew : 新規登録なら true 、部署変更なら false
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//セッションに付加する
	//print_r( $A_pickup_postid );	// DEBUG
	//$_SESSION["recog_tree_post"] = $A_pickup_postid;
	//成り代わり販売店
	//SQL
	//Tree最初の部署の表示スタイル修飾
	//承認部署であるかどうか
	//カレントの部署が指定されていれば表示を赤くする
	//XML読込先
	//子供があるか？
	//userpostidがなければ（）を表示しない
	//初回表示の動作(ツリー展開後はtreexml_shopordsupport.phpで設定)
	//販売店に結び付けられていないルート部署はリンクしない
	{
		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		var sql_str = "select distinct postid " + "from shop_relation_tb where pactid=" + _SESSION.pactid + " and " + "shopid=" + shopid;
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		_SESSION.makeTreeShopOrdForSupport_tree_post = A_pickup_postid;
		_SESSION.makeTreeShopOrdForSupport_tree_shop = shopid;
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n\t<table cellspacing=\"0\" cellpadding=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n\t\t\t<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>&nbsp;\n\t\t\t<br><br>\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postid," + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " ";

		if (postid != false) //postid が指定されているときにはその部署を
			{
				top_sql += "and po.postid = " + postid;
			} else //そうでないときにはTOP部署を指定する
			{
				top_sql += "and pr.level = 0";
			}

		var H_post = GLOBALS.GO_db.getRowHash(top_sql);
		var recogflg = false;

		for (var pid of Object.values(A_pickup_postid)) {
			if (pid == H_post.postid) {
				recogflg = true;
				break;
			}
		}

		if (recogflg) //部署名の前にマークを表示
			{
				var chkmark = "\u25CE";
			} else {
			chkmark = "";
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) {
			xlink_base = "/XML/treexml_shopordsupport.php?pa=" + H_post.postidchild + "-" + H_post.level;
			xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
		}

		var root_sql = "select " + "distinct shop.postid " + "from shop_relation_tb shop " + "inner join post_relation_tb post on post.pactid=shop.pactid AND post.postidparent=shop.postid AND post.level=0 " + "where post.pactid=" + _SESSION.pactid + " and " + "shop.shopid=" + shopid + ";";
		var root_post = GLOBALS.GO_db.getOne(root_sql);

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
		} else {
			user_post = "";
		}

		if (H_post.postid == root_post) {
			rtn_str += "\n\t\t\tvar tree = new WebFXLoadTree(" + "\"" + r1tag + chkmark + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\"," + "\"?pos=" + H_post.postidchild + "\"" + ");";
		} else {
			rtn_str += "\n\t\t\tvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\")";
		}

		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

	getChildCnt(pactid, postid) //echo "DEBUG: " . $cnt . "<br>";
	{
		var sql = "select count(po.postid) " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidparent " + "where " + "po.pactid=" + pactid + " " + "and pr.postidparent != pr.postidchild ";

		if (postid == false) //Root部署を表す
			//１つ下のレベルを数える
			{
				sql += "and pr.level = 1";
			} else {
			sql += "and po.postid = " + postid;
		}

		var cnt = GLOBALS.GO_db.getOne(sql);
		return cnt;
	}

	treeJs() {
		return "\n\t\t\t<script src=\"/js/tree.js\" type=\"text/javascript\"></script>\n\t\t\t<script src=\"/js/xtree2.js\" type=\"text/javascript\"></script>\n\t\t\t<script src=\"/js/xloadtree2.js\" type=\"text/javascript\"></script>\n\t\t\t<script src=\"/js/xloadtree_common.js\" type=\"text/javascript\"></script>\n\t\t\t<script src=\"/js/prototype.js\" type=\"text/javascript\"></script>\n\t\t\t<script type=\"text/javascript\" src=\"/js/dragwin.js\"></script>\n\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/global.css\" />";
	}

	makeTreeMove(postid = false, expand = "") //先頭のTabより前を除く
	//SQL
	//XML読込先
	//子供があるか？
	//パンくず状の部署ツリー作成
	//負荷が大きいのでコメント
	//		$O_post = new MtPostUtil();
	//		$H_post["posttree"] = $O_post->getPostTreeBand( $_SESSION["pactid"], $postid, $H_post["postidchild"], "", " -> ", "", 1, false, false, true );
	//リンク先には２パターンある...
	{
		if (postid == false) {
			postid = _SESSION.postid;
		}

		if (this.curpost_sessionname == "") {
			this.curpost_sessionname = _SESSION.current_postid;
		}

		if (this.current_postid == "") {
			this.current_postid = _SESSION.current_postid;
		}

		expand = this.getCurrentPath();
		expand = expand.replace(/^[^_]*_/g, "");
		var rtn_str = "\n<div class=\"layer\" id=\"XTree\" style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"Maintree\" style=\"display: " + this.disp + "\">\n\t\t\t<table border=\"1\" bgcolor=\"#CCCCCC\" height=\"120\" cellspacing=0 cellpadding=0>\n\t\t\t<tr>\n\t\t\t\t<td height=\"24\" bgcolor=\"#666699\">\n\t\t\t\t<table width=\"100%\" border=\"0\" cellspacing=0 cellpadding=0>\n\t\t\t\t<tr>\n\t\t\t\t\t<td align=\"left\" valign=\"center\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<font color=\"white\">&nbsp;\u25A0" + this.WindowTitle + "</font>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td align=\"right\" valign=\"top\" bgcolor=\"#666699\">\n\t\t\t\t\t\t<input type=\"button\" onClick=\"javascript:ShowHide('Maintree');\" value=\"" + this.CloseBtn + "\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\" style=\"padding:8px;\">\n<script language=\"JavaScript\">";
		var top_sql = "select " + "po.postname," + "po.userpostid," + "pr.postidparent," + "pr.postidchild," + "pr.level " + "from " + this.post_tb + " po inner join " + this.post_relation_tb + " pr on po.postid=pr.postidchild " + "and pr.pactid=" + _SESSION.pactid + " " + "where " + "po.pactid=" + _SESSION.pactid + " " + "and po.postid = " + postid;
		var H_post = GLOBALS.GO_db.getRowHash(top_sql);

		if (H_post == undefined || H_post.length < 0) {
			return false;
		}

		var r1tag = "";
		var r2tag = "";

		if (this.curpost_sessionname == H_post.postidchild) {
			r1tag = "<font color='red'><b>";
			r2tag = "</b></font>";
		}

		if (H_post.userpostid != "") {
			var user_post = " (" + htmlspecialchars(H_post.userpostid) + ")";
			var user_post2 = " \u3014" + htmlspecialchars(H_post.userpostid) + "\u3015";
		} else {
			user_post = "";
			user_post2 = "";
		}

		var xlink = "";
		var xlink_base = "";

		if (TreeAJAX.getChildCnt(_SESSION.pactid, postid) > 0) //子供には２パターンある...
			{
				if (this.setPost == false) {
					xlink_base = "/XML/treexml_move.php?pa=" + H_post.postidchild + "-" + H_post.level;
				} else {
					xlink_base = "/XML/treexml_setpost.php?pa=" + H_post.postidchild + "-" + H_post.level;
				}

				xlink = xlink_base + "-" + expand + "&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb;
			}

		rtn_str += "\nvar tree = new WebFXLoadTree(" + "\"" + r1tag + htmlspecialchars(H_post.postname) + user_post + r2tag + "\", " + "\"" + xlink + "\",";

		if (this.setPost == false) {
			var tableno = this.post_tb.replace(/post|_|tb/g, "");
			rtn_str += "\"javascript:chgPostAjax(" + postid + "," + H_post.postidchild + ",'" + tableno + "', true, 'Maintree')\");";
		} else {
			var O_post = new MtPostUtil();
			H_post.posttree = O_post.getPostTreeBand(_SESSION.pactid, postid, H_post.postidchild, "", " -> ", "", 1, false, false, true);
			rtn_str += "\"javascript:setPost('" + H_post.postidchild + "', '" + htmlspecialchars(H_post.posttree) + "')\");";
		}

		rtn_str += "\ntree.write();\ntree.setExpanded(true);\n\n// \u30C9\u30E9\u30C3\u30B0\u79FB\u52D5\u958B\u59CB\ninitDrag('XTree');\n\n// \u30C4\u30EA\u30FC\u306E\u518D\u4F5C\u6210\u3001\u6307\u5B9A\u3057\u305F\u90E8\u7F72\u3092\u958B\u304D\u76F4\u3059\n// \u90E8\u7F72\u691C\u7D22\u306E\u7D50\u679C\u30EA\u30F3\u30AF\u304B\u3089\u547C\u3073\u51FA\u3055\u308C\u308B\nfunction RemakeXTree( expand ){ //\u5F15\u6570:\u30C8\u30C3\u30D7\u3092\u9664\u3044\u305F\uFF12\u756A\u76EE\u4EE5\u964D\u306Epostpath\n//\talert('DEBUG: ' + expand );\n\ttree.src = \"" + xlink_base + "-\" + expand + \"&post_tb=" + this.post_tb + "&post_relation_tb=" + this.post_relation_tb + "\";\n\ttree.reload();\n}\n\n</script>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t</td>\n\t</tr>\n\t</table></div>\n";
		return rtn_str;
	}

};