//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//部署用クラス (JavaScriptによるリンクつき)
//部署検索のリンクに使用する
//
//
//
//作成日：2006/06/20
//作成者：中西
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//require_once("MtPostUtil.php");

require("Post.php");

require("Authority.php");

//右端の部署にリンクをつけるならtrue
//typeによってリンク先を変える
//<div id= で指定する名前
//承認型の場合の内部フラグ
//承認型以外=0, 部署登録変更=1、部署新規登録=2
//登録型のキャリアID
//対象テーブル -- 過去分のときはここを書き換える
////////////////////////////////////////////////////////////////
//カレント部署へのパスを求める
//返り値: カレント部署までのパス、アンダースコア区切の文字列
////////////////////////////////////////////////////////////////
//承認型で許可のある部署リストを返す
//引数： postnew 承認型以外=0, 部署登録変更=1、部署新規登録=2
//結果は A_pickup_postid に反映される
////////////////////////////////////////////////////////////////
//除外すべき部署リストを作成、受注新規に使用
//引数：キャリアID
//結果は A_pickup_postid に反映される
class PostLinkXList extends Post {
	constructor() {
		super(...arguments);
		this.dividname = "XList";
		this.postnew = 0;
		this.A_pickup_postid = undefined;
		this.post_tb = "post_tb";
		this.post_relation_tb = "post_relation_tb";
	}

	getPosttreebandUrl(src, postid, curpostid, targetpostid) {
		if (this.link_tail || targetpostid != postid) //// 部署管理型
			{
				if (this.type == "addbill_set_post") //return "<a href=\"?pid=$postid\" class=\"csDeptLink\">$src</a>";
					//return "<a href=\"javascript:setPost('". $postid ."', '". htmlspecialchars($src) ."')\" class=\"csDeptLink\">$src</a>";
					//userpostid調べる
					//return "<a href=\"javascript:set_postid(".$postid.",'".$userpostid."','".htmlspecialchars($src)."')\" class=\"csDeptLink\">$src</a>";
					{
						var sql = "SELECT  postname,userpostid FROM " + this.post_tb + " WHERE pactid=" + _SESSION.pactid + " and postid=" + postid;
						var res = GLOBALS.GO_db.getRowHash(sql);

						if (is_null(res)) {
							var postname = "undefined";
							var userpostid = "undefined";
						} else {
							postname = res.postname;
							userpostid = res.userpostid;
						}

						return "<a href=\"javascript:set_postid(" + postid + ",'" + userpostid + "','" + postname + `')" class="csDeptLink">${src}</a>`;
					} else if (this.type == "post") //展開パスを求める
					{
						var expand = this.getCurrentPath(postid);
						return "<a href=\"javascript:chgPost('" + postid + "', '" + htmlspecialchars(src) + "', true, '" + this.dividname + "'); RemakeXTree('" + expand + `');" class="csDeptLink">${src}</a>`;
					} else if (this.type == "recog") //展開パスを求める
					//象となる部署リストを得る
					{
						expand = this.getCurrentPath(postid);
						this.getRecogPermits(this.postnew);

						if (this.postnew == 0 || -1 !== this.A_pickup_postid.indexOf(postid)) //リンク有り
							{
								return "<a href=\"javascript:setRecog('" + postid + "', '" + htmlspecialchars(src) + "', true, '" + this.dividname + "'); RemakeXTree('" + expand + `');" class="csDeptLink">${src}</a>`;
							} else //リンク無し
							{
								return htmlspecialchars(src);
							}
					} else if (this.type == "setpost") //$expand = $this->getCurrentPath( $postid );	// 展開パスを求める
					{
						return "<a href=\"javascript:setPost('" + postid + "', '" + htmlspecialchars(src) + `')" class="csDeptLink">${src}</a>`;
					} else if (this.type == "regist") //展開パスを求める
					//対象から除外する部署リストを得る
					{
						expand = this.getCurrentPath(postid);
						this.getRegistNotPermit(this.carid);

						if (!(-1 !== this.A_pickup_postid.indexOf(postid))) //リンク有り
							{
								return "<a href=\"javascript:setRecog('" + postid + "', '" + htmlspecialchars(src) + "', true, '" + this.dividname + "'); RemakeXTree('" + expand + `');" class="csDeptLink">${src}</a>`;
							} else //リンク無し
							{
								return htmlspecialchars(src);
							}
					}

				if (this.type == "move") //展開パスを求める
					//$O_mtpost = new MtPostUtil;
					//テーブル名からテーブル番号取得
					//$listsrc = $O_mtpost->getPostTreeBand( $_SESSION["pactid"], $_SESSION["postid"], $postid, $tableno, " -> ", "", 1 ,true ,false );
					{
						expand = this.getCurrentPath(postid);

						if (this.post_tb != "post_tb") {
							var tableno = this.post_tb.replace(/^post_|_tb$/g, "");
						} else {
							tableno = "";
						}

						return "<a href=\"javascript:chgPostAjax(" + postid + "," + postid + ",'" + tableno + "', true, '" + this.dividname + "'); RemakeXTree('" + expand + `');" class="csDeptLink">${src}</a>`;
					} else {
					return `<a href="?pid=${postid}" class="csDeptLink">${src}</a>`;
				}
			}

		return src;
	}

	getCurrentPath(current_post) //現在作業中の部署の位置をシステム用部署ＩＤ文字列で返す
	//[引　数] $pactid：契約ＩＤ
	//$curpostid:ログインユーザの所属部署ＩＤ
	//$targetpostid:作業部署ＩＤ
	//$posttable:部署検索対象テーブル
	//$postreltable:部署ツリー検索対象テーブル
	//$joint:部署と部署を繋げる文字列、デフォルトは" -> "
	//一番先頭の部署を除く
	{
		var pst = new Post();
		var postpath = pst.getSystempostidtreeband(_SESSION.pactid, _SESSION.postid, current_post, this.post_tb, this.post_relation_tb, "_");
		postpath = postpath.replace(/^[^_]*_/g, "");
		return postpath;
	}

	getRecogPermits(postnew) //123 は V3型のRECOG, fnc_mt_recog
	{
		if (postnew == 0) //0の場合は何もしない
			{
				return;
			}

		if (this.A_pickup_postid != undefined) {
			return;
		}

		var sql_recog = "select rec.postidfrom " + "from recognize_tb rec inner join user_tb us on rec.pactid = us.pactid and rec.postidfrom = us.postid " + "inner join fnc_relation_tb frl on frl.pactid = us.pactid and frl.userid = us.userid " + "inner join " + this.post_tb + " po on us.pactid = po.pactid and  us.postid = po.postid " + "where rec.pactid = " + _SESSION.pactid + " and " + "(frl.fncid = " + RECOG + " or frl.fncid = 123 )";

		if (postnew == 1) //部署登録変更の場合
			//123 は V3型のRECOG, fnc_mt_recog
			{
				sql_recog = sql_recog + " union " + "select us.postid " + "from user_tb us inner join fnc_relation_tb frl on us.pactid = frl.pactid and us.userid = frl.userid " + "inner join " + this.post_tb + " po on us.pactid = po.pactid and us.postid = po.postid " + "where us.pactid = " + _SESSION.pactid + " and " + "us.postid = " + _SESSION.current_postid + " and " + "(frl.fncid = " + RECOG + " or frl.fncid = 123 )";
			}

		this.A_pickup_postid = GLOBALS.GO_db.getCol(sql_recog);
	}

	getRegistNotPermit(carid) //２回目以降は何もしない。
	//実際にSQLを発して設定を行うのは１回目に呼び出されたときのみ。
	//毎回SQLを発する無駄を回避した
	//第2階層権限を取得
	//ルート部署でログインして第2階層権限を持っていれば・・・
	{
		if (this.A_pickup_postid != undefined) {
			return;
		}

		var root_sql = "SELECT postidparent FROM " + this.post_relation_tb + " WHERE level=0 AND pactid=" + _SESSION.pactid;
		var rootpost = GLOBALS.GO_db.getOne(root_sql);
		var auth_sql = "SELECT fncid FROM fnc_relation_tb WHERE fncid=" + G_AUTH_ROOT_ACTORDER + " AND pactid=" + _SESSION.pactid;
		var get_auth = GLOBALS.GO_db.getOne(auth_sql);

		if (rootpost == _SESSION.current_postid && get_auth == G_AUTH_ROOT_ACTORDER) //ルート部署の注文制御(第2階層販売店への発注対応)
			//(条件)・販売店が登録されている第2階層部署とその配下の部署
			//販売店が登録されていて、承認先に指定されている第2階層部署を取得
			//第2階層の部署を全て取得
			//販売店が登録されていない第2階層部署を抜き出す
			//販売店が登録されていない第2階層部署の配下にある部署を抜き出す
			{
				var spost_sql = "SELECT DISTINCT postid FROM shop_relation_tb WHERE postid IN " + "(SELECT DISTINCT " + this.post_tb + ".postid FROM " + this.post_tb + " " + "INNER JOIN " + this.post_relation_tb + " ON " + this.post_relation_tb + ".postidchild=" + this.post_tb + ".postid " + "LEFT JOIN shop_relation_tb ON shop_relation_tb.pactid=" + this.post_tb + ".pactid " + "WHERE " + this.post_tb + ".pactid=" + _SESSION.pactid + " AND " + this.post_relation_tb + ".level=1) " + "AND shop_relation_tb.carid=" + this.carid;
				var A_spost = GLOBALS.GO_db.getCol(spost_sql);
				var lpost_sql = "SELECT postidchild FROM " + this.post_relation_tb + " WHERE level=1 AND pactid=" + _SESSION.pactid;
				var A_lpost = GLOBALS.GO_db.getCol(lpost_sql);
				_SESSION.A_lpost = A_lpost;
				var A_extract = array_diff(A_lpost, A_spost);
				var O_auth = new Authority();
				var A_except = Array();

				for (var temp of Object.values(A_extract)) {
					A_except = array_merge(A_except, O_auth.getFollowerPost(temp, _SESSION.pactid));
				}

				this.A_pickup_postid = A_except;
			} else //それ以外の場合、除外する部署は無い
			{
				this.A_pickup_postid = Array();
				return;
			}
	}

};