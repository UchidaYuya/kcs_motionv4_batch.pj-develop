//
//販売店：販売店間のお知らせ表示AJAX
//
//更新履歴：<br>
//2008/12/22 宮澤龍彦  作成
//
//@uses ViewBaseHtml
//@package Shop
//@subpackage View
//@filesource
//@author miyazawa
//@since 2008/12/19
//@uses ViewBaseHtml
//
//
//
//販売店：販売店間のお知らせ表示AJAX
//
//@uses ViewBaseHtml
//@package Shop
//@subpackage View
//@author miyazawa
//@since 2008/12/19
//@uses ViewBaseHtml
//

require("view/ViewBaseHtml.php");

//
//response
//
//@var mixed
//@access private
//
//
//H_GETdata
//
//@var mixed
//@access private
//
//
//__construct
//
//@author katsushi
//@since 2008/07/15
//
//@access public
//@return void
//
//
//getData
//
//@author katsushi
//@since 2008/07/15
//
//@access public
//@return void
//
//
//setResponse
//
//@author katsushi
//@since 2008/07/15
//
//@param mixed $value
//@access public
//@return void
//
//
//putJSON
//
//@author katsushi
//@since 2008/07/15
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class InfoShopAjaxView extends ViewBaseHtml {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.response = undefined;
	}

	getData() {
		return this.H_GETdata;
	}

	setResponse(value) {
		this.response = value;
	}

	putJSON() {
		echo(JSON.stringify(this.response));
	}

	__destruct() {
		super.__destruct();
	}

};