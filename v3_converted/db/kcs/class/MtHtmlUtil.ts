//
//HTML関連の整形を行うモデル
//
//@filesource
//@package Base
//@subpackage HTML
//@author katsushi
//@since 2008/04/02
//
//
//
//HTML関連の整形を行うモデルクラス
//
//@package Base
//@subpackage HTML
//@author katsushi
//@since 2008/04/02
//

//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/02
//
//@param object $O_db
//@access public
//@return void
//
//
//部署用のリンクを整形する<br>
//static呼び出し可能
//
//@author katsushi
//@since 2008/04/02
//
//@param integer $postid
//@param string $linksrc
//@param string $cssclass
//@access public
//@return string
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/04/02
//
//@access public
//@return void
//
export default class MtHtmlUtil {
	static makePostLink: any;
	constructor() {}

	makePostLink(postid, linksrc, cssclass:any = undefined) {
		if (cssclass == undefined) {
			cssclass = "csDeptLink";
		}

		return "<a href=\"?pid=" + postid + "\" class=\"" + cssclass + "\">" + linksrc + "</a>";
	}

	// __destruct() {}

};