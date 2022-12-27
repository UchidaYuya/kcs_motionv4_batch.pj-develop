//
//ページリンク作成用クラス
//
//@package Shared View
//@subpackage PageLink
//@author houshiyama
//@since 2008/03/06
//@filesource
//
//
//
//ページリンク作成用クラス
//
//@package Shared View
//@subpackage PageLink
//@author houshiyama
//@since 2008/03/06
//

//
//initPaging
//
//@author houshiyama
//@since 2008/03/06
//
//@param mixed $cnt（件数）
//@param mixed $limit（1ページの表示数）
//@param mixed $offset（カレントページ）
//@param float $view（一度に表示するリンク数）
//@access public
//@return void
//
//
//initPaging
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $cnt（件数）
//@param mixed $limit（1ページの表示数）
//@param mixed $offset（カレントページ）
//@param float $view（一度に表示するリンク数）
//@access public
//@return void
//
class MakePageLink {
	makePageLinkHTML(cnt, limit, offset, view = 10) //全ページ数
	//スタートページの設定（一画面に表示するページ数の真ん中（端数切捨て））
	//偶数の時は真ん中が無いのでカレントをひとつ前に移動
	//一画面の表示数よりmaxが小さければ最後はその表示数
	//まだページが残っていれば次の何件を表示
	{
		var str = "<div>";
		var page_cnt = Math.ceil(cnt / limit);
		var start = offset - Math.floor(view / 2);

		if (view % 2 == 0) {
			start++;
		}

		var max = offset + Math.floor(view / 2);

		if (max < view) {
			max = view;
		}

		if (max > page_cnt) {
			max = page_cnt;
		}

		if (max - start < view - 1) {
			start = start - (view - 1 - (max - start));
		}

		if (0 >= start) {
			start = 1;
		}

		if (offset >= 2) {
			str += "<a href=?p=" + (offset - 1) + " class=\"csPathLink\">\u524D\u306E" + limit + "\u4EF6</a>";
		}

		for (var page = start; page <= max; page++) {
			if (page == offset) {
				str += "&nbsp;<span class=\"csPath\">" + page + "</span>&nbsp;";
			} else {
				str += "&nbsp;<a href=?p=" + page + " class=\"csPathLink\">" + page + "</a>&nbsp;";
			}
		}

		if (offset < max) {
			str += "<a href=?p=" + (offset + 1) + " class=\"csPathLink\">\u6B21\u306E" + limit + "\u4EF6</a>";
		}

		str += "</font></div>";
		return str;
	}

	makePageLinkHTMLEng(cnt, limit, offset, view = 10) //全ページ数
	//スタートページの設定（一画面に表示するページ数の真ん中（端数切捨て））
	//偶数の時は真ん中が無いのでカレントをひとつ前に移動
	//一画面の表示数よりmaxが小さければ最後はその表示数
	//まだページが残っていれば次の何件を表示
	{
		var str = "<div>";
		var page_cnt = Math.ceil(cnt / limit);
		var start = offset - Math.floor(view / 2);

		if (view % 2 == 0) {
			start++;
		}

		var max = offset + Math.floor(view / 2);

		if (max < view) {
			max = view;
		}

		if (max > page_cnt) {
			max = page_cnt;
		}

		if (max - start < view - 1) {
			start = start - (view - 1 - (max - start));
		}

		if (0 >= start) {
			start = 1;
		}

		if (offset >= 2) {
			str += "<a href=?p=" + (offset - 1) + " class=\"csPathLink\">Previous" + limit + "</a>";
		}

		for (var page = start; page <= max; page++) {
			if (page == offset) {
				str += "&nbsp;<span class=\"csPath\">" + page + "</span>&nbsp;";
			} else {
				str += "&nbsp;<a href=?p=" + page + " class=\"csPathLink\">" + page + "</a>&nbsp;";
			}
		}

		if (offset < max) {
			str += "<a href=?p=" + (offset + 1) + " class=\"csPathLink\">Next" + limit + "</a>";
		}

		str += "</font></div>";
		return str;
	}

};