//
//パンくずリンク作成クラス
//
//@package Shared View
//@subpackage PankuzuLink
//@author houshiyama
//@since 2008/03/06
//@filesource
//
//
//
//パンくずリンク作成クラス
//
//@package Shared View
//@subpackage PankuzuLink
//@author houshiyama
//@since 2008/02/27
//

//
//パンくずリンクHTML作成メソッド
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_link
//@param string $type（user、shop、admin）
//@param mixed $menulink（トップをメニューにするかどうか（デフォルトはする））
//@access public
//@return string
//
//
//パンくずリンクHTML作成メソッド（英語）
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_link
//@param string $type（user、shop、admin）
//@param mixed $menulink（トップをメニューにするかどうか（デフォルトはする））
//@access public
//@return string
//
class MakePankuzuLink {
	makePankuzuLinkHTML(H_link, type = "user", menulink = true) //ユーザの時（スタイルシートが違うので）
	{
		var str = "";

		if ("user" == type) {
			if (true == menulink) {
				str += "<li class=\"csPath\"><a href=\"/Menu/menu.php\" class=\"csNavi\" tabindex=\"-1\">\u30E1\u30CB\u30E5\u30FC</a> > ";
			}

			for (var url in H_link) {
				var view = H_link[url];

				if (url != "") {
					str += "<a href=\"" + url + "\" class=\"csNavi\"> " + view + " </a> > ";
				} else {
					str += "<span class=\"csNavi\"> " + view + " </span></li>";
				}
			}
		} else {
			if (true == menulink) //ショップの時（トップメニューが違うので）
				{
					if ("shop" == type) {
						str += "<font style=\"font-weight:bold; font-size:13px;\"><a href=\"/Shop/menu.php\">SHOP MENU</a> >";
					} else {
						str += "<font style=\"font-weight:bold; font-size:13px;\"><a href=\"/Admin/menu.php\">ADMIN MENU</a> >";
					}
				}

			for (var url in H_link) {
				var view = H_link[url];

				if (url != "") {
					str += "<a href=\"" + url + "\"> " + view + " </a> > ";
				} else {
					str += " " + view + " </font>";
				}
			}
		}

		return str;
	}

	makePankuzuLinkHTMLEng(H_link, type = "user", menulink = true) //ユーザの時（スタイルシートが違うので）
	{
		var str = "";

		if ("user" == type) {
			if (true == menulink) {
				str += "<li class=\"csPath\"><a href=\"/Menu/menu.php\" class=\"csNavi\" tabindex=\"-1\">Menu</a> > ";
			}

			for (var url in H_link) {
				var view = H_link[url];

				if (url != "") {
					str += "<a href=\"" + url + "\" class=\"csNavi\"> " + view + " </a> > ";
				} else {
					str += "<span class=\"csNavi\"> " + view + " </span></li>";
				}
			}
		} else {
			if (true == menulink) //ショップの時（トップメニューが違うので）
				{
					if ("shop" == type) {
						str += "<font style=\"font-weight:bold; font-size:13px;\"><a href=\"/Shop/menu.php\">SHOP MENU</a> >";
					} else {
						str += "<font style=\"font-weight:bold; font-size:13px;\"><a href=\"/Admin/menu.php\">ADMIN MENU</a> >";
					}
				}

			for (var url in H_link) {
				var view = H_link[url];

				if (url != "") {
					str += "<a href=\"" + url + "\"> " + view + " </a> > ";
				} else {
					str += " " + view + " </font>";
				}
			}
		}

		return str;
	}

};