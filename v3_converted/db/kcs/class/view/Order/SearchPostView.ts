require("view/ViewSmarty.php");

require("model/Order/OrderModelBase.php");

//
//startCheck
//
//@author igarashi
//@since 2011/05/25
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author igarashi
//@since 2011/05/25
//
//@access public
//@return void
//
//
//assign
//
//@author igarashi
//@since 2011/05/26
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//setCss
//
//@author igarashi
//@since 2011/05/27
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author igarashi
//@since 2011/05/25
//
//@access public
//@return void
//
class SearchPostView extends ViewSmarty {
	__constrcut() {
		super();
	}

	startCheck() {
		super.startCheck();
		return this;
	}

	checkCGIParam() {
		if (!!_GET.p) {
			this.pactid = _GET.p;
		} else if (!!_SESSION.pactid) {
			this.pactid = _SESSION.pactid;
		} else if (!!_SESSION["/MTOrder"].pactid) {
			this.pactid = _SESSION["/MTOrder"].pactid;
		}

		if (undefined !== _GET.t) {
			this.telno = _GET.t;
		}

		if (undefined !== _GET.c) {
			this.carid = _GET.c;
		}

		if (!!_GET.m) {
			if ("user" == _GET.m) {
				this.mode = "user";
			} else if ("pb" == _GET.m) {
				this.mode = "pb";
			} else if ("cfb" == _GET.m) {
				this.mode = "cfb";
			} else if ("telno" == _GET.m) {
				this.mode = "tel";
			}
		}

		if (!!_POST.postname) {
			this.postname = _POST.postname;
			this.H_Dir._postname = _POST.postname;
		}

		if (!!_POST.postcode) {
			this.postcode = _POST.postcode;
			this.H_Dir._postcode = _POST.postcode;
		}

		if (!!_POST.username) {
			this.username = _POST.username;
			this.H_Dir._username = _POST.username;
		}

		if (!!_POST.employeecode) {
			this.employeecode = _POST.employeecode;
			this.H_Dir._employeecode = _POST.employeecode;
		}

		if (undefined !== _POST.submit) {
			this.submit = true;
		} else {
			this.submit = false;
		}

		return this;
	}

	assign(key, value) {
		this.get_Smarty().assign(key, value);
	}

	setCss() {
		if (OrderModelBase.SITE_SHOP == this.getSiteMode()) {
			this.assign("css", "actorderDetail");
			this.assign("cssTh", "actorderDetailTh");
			this.assign("cssTd", "actorderDetail");

			if (preg_match("/Shop\\/MTOrder/", _SERVER.PHP_SELF)) {
				this.assign("css", "csRecog");
				this.assign("cssTh", "csRecogTh");
				this.assign("cssTd", "csRecog");
			}
		} else {
			this.assign("css", "csOrder");
			this.assign("cssTh", "csOrderTh");
			this.assign("cssTd", "val");
		}
	}

	displaySmarty(tplfile = "") {
		this.setCss();
		this.assign("postname", this.postname);
		this.assign("postcode", this.postcode);
		this.assign("username", this.username);
		this.assign("employeecode", this.employeecode);
		this.assign("mode", this.mode);

		if (!tplfile) {
			tplfile = this.getdefaultTemplate();
		}

		this.get_Smarty().display(tplfile);
	}

};