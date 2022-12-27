//
//メニューよく使う項目のAJAX
//
//更新履歴：<br>
//2008/08/17 上杉勝史  作成
//
//@uses ViewBaseHtml
//@package Menu
//@subpackage View
//@filesource
//@author katsushi
//@since 2008/08/17
//@uses ViewBaseHtml
//
//
//
//メニューよく使う項目のAJAX
//
//@uses ViewBaseHtml
//@package Menu
//@subpackage View
//@author katsushi
//@since 2008/08/17
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
//checkAuth
//
//@author katsushi
//@since 2008/08/17
//
//@access protected
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
class MenuAjaxView extends ViewBaseHtml {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_USER
		});
		this.response = undefined;
	}

	checkAuth() {
		this.checkCustomAuth();
	}

	checkCGIParam() {
		this.H_GETdata = Array();

		if (undefined !== _GET.type == true && !_GET.type == false) {
			this.H_GETdata.type = _GET.type;
		}

		if (undefined !== _GET.fnc == true && !_GET.fnc == false) {
			this.H_GETdata.fncid = str_replace("fnc", "", _GET.fnc);
		}
	}

	getData() {
		return this.H_GETdata;
	}

	setResponse(value) {
		this.response = value;
	}

	put() {
		echo(this.response);
	}

	__destruct() {
		super.__destruct();
	}

};