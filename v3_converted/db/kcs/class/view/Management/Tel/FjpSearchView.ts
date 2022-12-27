require("view/Order/SearchPostView.php");

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
//displaySmarty
//
//@author igarashi
//@since 2011/05/25
//
//@access public
//@return void
//
class FjpSearchView extends SearchPostView {
	__constrcut() {
		super();
	}

	startCheck() {
		super.startCheck();
		return this;
	}

	checkCGIParam() {
		this.pactid = _SESSION.pactid;

		if (!!_GET.type) {
			this.type = _GET.type;
		}

		if (!!_POST.postname) {
			this.postname = _POST.postname;
		}

		if (!!_POST.postcode) {
			this.postcode = _POST.postcode;
		}

		if (!!_POST.username) {
			this.username = _POST.username;
		}

		if (!!_POST.employeecode) {
			this.employeecode = _POST.employeecode;
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
		return this;
	}

	displaySmarty() {
		this.assign("type", this.type);
		this.assign("postname", this.postname);
		this.assign("postcode", this.postcode);
		this.assign("username", this.username);
		this.assign("employeecode", this.employeecode);
		this.get_Smarty().display(this.getdefaultTemplate());
		return this;
	}

};