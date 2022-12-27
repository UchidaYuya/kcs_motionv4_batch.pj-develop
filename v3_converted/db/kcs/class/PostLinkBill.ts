//
//機能権限クラス
//
//権限関連のクラスライブラリ
//
//更新履歴：<br>
//2008/04/09 上杉勝史 作成<br>
//
//@package Base
//@subpackage Post
//@filesource
//@author houshiyama
//@since 2008/04/16
//@uses Post
//
//
//
//リンク有無切り替え付き部署クラス<br>
//（請求画面で使用<br>
//
//@package Base
//@subpackage Post
//@author houshiyama
//@since 2008/04/16
//@uses Post
//

require("Post.php");

//右端の部署にリンクをつけるならtrue
//切り替え先のモード
//
//部署ツリーリンクの作成
//
//@author houshiyama
//@since 2008/04/16
//
//@param mixed $src
//@param mixed $postid
//@param mixed $curpostid
//@param mixed $targetpostid
//@access public
//@return void
//
class PostLinkBill extends Post {
	getPosttreebandUrl(src, postid, curpostid, targetpostid) {
		if (this.m_link_tail || targetpostid != postid) {
			var rval = "<a href=\"?postid=" + postid;
			if (this.m_mode.length) rval += "&mode=" + this.m_mode;
			rval += "\">" + src + "</a>";
			return rval;
		}

		return src;
	}

};