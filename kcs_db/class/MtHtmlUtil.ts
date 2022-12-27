//HTML関連の整形を行うモデル


export default class MtHtmlUtil {
	constructor() {}

	static makePostLink(postid: string, linksrc: string, cssclass:any = undefined) {
		if (cssclass == undefined) {
			cssclass = "csDeptLink";
		}

		return "<a href=\"?pid=" + postid + "\" class=\"" + cssclass + "\">" + linksrc + "</a>";
	}
};