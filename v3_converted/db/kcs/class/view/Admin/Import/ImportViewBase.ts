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
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//checkCGI
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//assignSmarty
//
//@author web
//@since 2012/01/31
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
class ImportViewBase extends ViewSmarty {
	constructor() {
		super();
	}

	checkCGI() {
		var old = this.gSess().getSelfAll();
		this.gSess().clearSessionSelf();

		if (Array.isArray(old)) {
			for (var key in old) {
				var value = old[key];

				if ("display" != key) {
					this.gSess().setSelf(key, value);
				} else {
					if (old.y != _GET.y || old.m != _GET.m) {
						this.gSess().setSelf("display", old.display);
					}
				}
			}
		}

		for (var key in _GET) {
			var value = _GET[key];
			this.gSess().setSelf(key, value);
		}

		for (var key in _POST) {
			var value = _POST[key];
			this.gSess().setSelf(key, value);
		}
	}

	assignSmarty() {
		if (Array.isArray(this.assigns)) {
			{
				let _tmp_0 = this.assigns;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					this.get_Smarty().assign(key, val);
				}
			}
		}
	}

	displaySmarty() {
		this.assignSmarty();

		if (is_null(template)) {
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	__destruct() {
		super.__destruct();
	}

};