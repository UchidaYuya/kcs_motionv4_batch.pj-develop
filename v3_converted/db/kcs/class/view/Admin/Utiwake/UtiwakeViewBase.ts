//
//内訳コードベースビュー
//
//@uses ViewSmarty
//@package
//@author igarashi
//@since 2011/11/11
//

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
//@since 2011/11/10
//
//@access public
//@return void
//
//
//getPubKey
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
//
//getQuickFormObject
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//setQuickFormElements
//
//@author igarashi
//@since 2011/11/11
//
//@param mixed $elements
//@access public
//@return void
//
//
//makeQuickFormObject
//
//@author igarashi
//@since 2011/11/11
//
//@param mixed $elements
//@access public
//@return void
//
//
//rendererQuickForm
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//setDefaults
//
//@author igarashi
//@since 2011/11/15
//
//@param mixed $defaults
//@access public
//@return void
//
//
//validate
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//setTitle
//
//@author igarashi
//@since 2011/11/16
//
//@param mixed $title
//@access public
//@return void
//
//
//setNavi
//
//@author igarashi
//@since 2011/11/16
//
//@param mixed $navi
//@access public
//@return void
//
//
//assignSmarty
//
//@author igarashi
//@since 2011/11/11
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author igarashi
//@since 2011/11/10
//
//@access public
//@return void
//
//
//registerSmarty
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//unregisterSmarty
//
//@author igarashi
//@since 2011/11/15
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
class UtiwakeViewBase extends ViewSmarty {
	static APP_PATH = "/template/Admin/Utiwake/";
	static PUB = "/Utiwake";

	constructor() {
		super();
		this.js = this.css = this.assigns = Array();
	}

	checkCGIParam() {}

	getPubKey() {
		return UtiwakeViewBase.PUB;
	}

	getQuickFormObject() {
		if (!this.quickform instanceof QuickFormUtil) {
			this.quickform = new QuickFormUtil("quickform");
		}

		return this.quickform;
	}

	setQuickFormElements(elements) {
		this.getQuickFormObject().setFormElement(elements);
	}

	makeQuickFormObject(elements = undefined, default = undefined) {
		if (Array.isArray(elements) && Array() != elements) {
			this.setQuickFormElements(elements);
			this.formObject = this.getQuickFormObject().makeFormObject();
		}

		if (Array.isArray(default)) {
			this.quickform.setDefaultsWrapper(default);
		}
	}

	rendererQuickForm() {
		var renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.formObject.accept(renderer);
		this.assigns.form = renderer.toArray();
	}

	setDefaults(defaults) {
		this.quickform.setDefaultsWrapper(defaults);
	}

	validate() {
		if (this.confirm) {
			if (this.quickform.validateWrapper()) {
				this.quickform.freezeWrapper();
				return true;
			}
		}

		return false;
	}

	setTitle(title) {
		this.assigns.admin_fncname = title;
	}

	setNavi(navi) {
		this.assigns.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(navi, this.exec_site);
	}

	assignSmarty() {
		{
			let _tmp_0 = this.assigns;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];
				this.get_Smarty().assign(key, val);
			}
		}
	}

	displaySmarty(template = undefined) {
		this.rendererQuickForm();
		this.assignSmarty();

		if (is_null(template)) {
			this.get_Smarty().display(this.getDefaultTemplate());
		} else {
			this.get_Smarty().display(UtiwakeViewBase.APP_PATH + template);
		}
	}

	registerSmarty() {
		this.rendererQuickForm();
		this.assignSmarty();
		this.gSess().clearSessionSelf();
		this.get_Smarty().display(this.getSetting().KCS_DIR + UtiwakeViewBase.APP_PATH + "finish.tpl");
		throw die();
	}

	unregisterSmarty() {
		this.rendererQuickForm();
		this.assignSmarty();
		this.gSess().clearSessionSelf();
		this.get_Smarty().display(this.getSetting().KCS_DIR + UtiwakeViewBase.APP_PATH + "finish.tpl");
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};