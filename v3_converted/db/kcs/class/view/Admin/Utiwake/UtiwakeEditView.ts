//
//内訳コード編集ビュー
//
//@uses UtiwakeEntryView
//@package
//@author igarashi
//@since 2011/11/15
//

require("view/Admin/Utiwake/UtiwakeEntryView.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//checkCGIParam
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
class UtiwakeEditView extends UtiwakeEntryView {
	constructor() {
		super();
	}

	checkCGIParam() {
		if (Array() != _POST) {
			for (var key in _POST) {
				var val = _POST[key];
				this.gSess().setSelf(key, val);
			}
		}

		if (!is_null(this.gSess().getSelf("confirm"))) {
			this.confirm = true;
		} else {
			this.confirm = false;
		}

		if (undefined !== _GET.orgcode) {
			this.gSess().setSelf("orgcode", _GET.orgcode);
		}

		if (undefined !== _GET.orgcarid) {
			this.gSess().setSelf("orgcarid", _GET.orgcarid);
		}
	}

	__destruct() {
		super.__destruct();
	}

};