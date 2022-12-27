//
//仮登録内訳コード一覧ビュー
//
//@uses UtiwakeViewBase
//@package
//@author igarashi
//@since 2011/11/11
//

require("view/Admin/Utiwake/UtiwakeViewBase.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/10
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//checkCGIPeculiar
//
//@author igarashi
//@since 2011/11/18
//
//@access protected
//@return void
//
//
//getSearchCarrier
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//getLimit
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//getOffset
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/11/16
//
//@access public
//@return void
//
class UtiwakeListView extends UtiwakeViewBase {
	static DEFAULT_DISPLAY = 20;
	static DEFAULT_PAGE = 1;
	static PROVISIONAL_CODETYPE = "4";

	constructor() {
		super();
		this.display = UtiwakeListView.DEFAULT_DISPLAY;
		this.page = UtiwakeListView.DEFAULT_PAGE;
		this.search = false;
		this.delete = false;
		this.delcarid = undefined;
		this.delcode = undefined;
		this.orderby = undefined;
		this.H_dir = Array();
		this.H_local = Array();
	}

	checkCGIParam() {
		this.H_dir = this.gSess().getPub(UtiwakeListView.PUB);

		if (undefined !== _POST.search_carid) {
			this.H_dir.search_carid = _POST.search_carid;
		}

		if (undefined !== _POST.search_code) {
			this.H_dir.search_code = _POST.search_code;
		}

		if (undefined !== _POST.search_kamoku) {
			this.H_dir.search_kamoku = _POST.search_kamoku;
		}

		if (undefined !== _POST.search_simkamoku) {
			this.H_dir.search_simkamoku = _POST.search_simkamoku;
		}

		if (undefined !== _POST.search_taxtype) {
			this.H_dir.search_taxtype = _POST.search_taxtype;
		}

		if (undefined !== _POST.search_codetype) {
			this.H_dir.search_codetype = _POST.search_codetype;
		} else if (!(undefined !== this.H_dir.search_codetype)) {
			this.H_dir.search_codetype = UtiwakeListView.PROVISIONAL_CODETYPE;
		}

		if (undefined !== _POST.display && is_numeric(_POST.display) && 0 <= _POST.display) {
			this.H_dir.display = _POST.display;
		} else if (!(undefined !== this.H_dir.display)) {
			this.H_dir.display = UtiwakeListView.DEFAULT_DISPLAY;
		}

		if (undefined !== _POST.search) {
			this.H_dir.search = true;
		} else {
			this.H_dir.search = false;
		}

		if (undefined !== _GET.p && is_numeric(_GET.p)) {
			this.H_dir.page = _GET.p;
		} else if (!(undefined !== this.H_dir.page)) {
			this.H_dir.page = UtiwakeListView.DEFAULT_PAGE;
		}

		if (undefined !== _GET.del && "1" == _GET.del) {
			this.H_dir.delete = true;
		}

		if (undefined !== _GET.orgcode) {
			this.H_dir.delcode = _GET.orgcode;
		}

		if (undefined !== _GET.orgcarid && is_numeric(_GET.orgcarid)) {
			this.H_dir.delcarid = _GET.orgcarid;
		}

		if (undefined !== _GET.o) {
			this.H_dir.orderby = _GET.o;
		}

		this.checkCGIPeculiar();
		this.gSess().clearSessionMenu();
		this.gSess().setPub(UtiwakeListView.PUB, this.H_dir);
		this.gSess().setSelfAll(this.H_local);
	}

	checkCGIPeculiar() {}

	getSearchCarrier() {
		return this.H_dir.search_carid;
	}

	getLimit() {
		return this.H_dir.display;
	}

	getPage() {
		return this.H_dir.page;
	}

	__destruct() {
		super.__destruct();
	}

};