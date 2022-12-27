//
//テストViewAJAXクラス
//
//@uses ViewSmarty
//@package Menu
//@filesource
//@author katsushi
//@since 2008/06/17
//
//
//error_reporting(E_ALL);
//
//テストViewAJAXクラス
//
//@uses ViewSmarty
//@package TEST
//@author katsushi
//@since 2008/06/25
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewBaseHtml.php");

require("MtSession.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//sendJson
//
//@author katsushi
//@since 2008/06/25
//
//@param array $A_json
//@access public
//@return void
//
//
//getLimit
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getOffset
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getSortType
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getSortColumn
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getSearchWord
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//getSearchColumn
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class TESTJsonView extends ViewBaseHtml {
	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
	}

	sendJson(A_option: {} | any[], cnt) {
		var H_json = {
			page: +this.getOffset(),
			total: cnt
		};
		H_json.rows = Array();

		for (var i = 0; i < A_option.length; i++) {
			var A_row = Array();
			{
				let _tmp_0 = A_option[i];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					A_row.push(val);
				}
			}
			H_json.rows.push({
				cell: A_row
			});
		}

		echo(JSON.stringify(H_json));
	}

	getLimit() {
		if (undefined !== _POST.rp == true && is_numeric(_POST.rp) == true) {
			return _POST.rp;
		}

		return false;
	}

	getOffset() {
		if (undefined !== _POST.page == true && is_numeric(_POST.page) == true) {
			return _POST.page;
		}

		return false;
	}

	getSortType() {
		if (undefined !== _POST.sortorder == true && _POST.sortorder != "") {
			return _POST.sortorder;
		}

		return false;
	}

	getSortColumn() {
		if (undefined !== _POST.sortname == true && _POST.sortname != "") {
			return _POST.sortname;
		}

		return false;
	}

	getSearchWord() {
		if (undefined !== _POST.query == true && _POST.query != "") {
			return _POST.query;
		}

		return false;
	}

	getSearchColumn() {
		if (undefined !== _POST.qtype == true && _POST.qtype != "") {
			return _POST.qtype;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};