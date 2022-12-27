//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//部署用クラス (Getリンクつき)
//リンク有無切り替え付き部署クラス
//
//
//
//作成日：2004/06/30
//作成者：末広
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

require("Post.php");

//右端の部署にリンクをつけるならtrue
class PostLinkGet extends Post {
	getPosttreebandUrl(src, postid, curpostid, targetpostid) {
		if (this.link_tail || targetpostid != postid) return `<a href="?pid=${postid}" class="csDeptLink">${src}</a>`;
		return src;
	}

};