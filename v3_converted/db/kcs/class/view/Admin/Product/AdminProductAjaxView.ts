//
//管理者：商品マスターAJAX
//
//更新履歴：<br>
//2008/07/15 上杉勝史  作成
//
//@uses ViewBaseHtml
//@package Product
//@subpackage View
//@filesource
//@author katsushi
//@since 2008/07/15
//@uses ViewBaseHtml
//
//
//
//管理者：商品マスターAJAX
//
//@uses ViewBaseHtml
//@package Product
//@subpackage View
//@author katsushi
//@since 2008/07/15
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
//checkCGIParam
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
class AdminProductAjaxView extends ViewBaseHtml {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.response = undefined;
	}

	checkCGIParam() {
		this.H_GETdata = Array();

		if (undefined !== _GET.type == true && !_GET.type == false) {
			this.H_GETdata.type = _GET.type;
		}

		if (undefined !== _GET.val == true && !_GET.val == false) {
			this.H_GETdata.val = _GET.val;
		}
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