//
//内訳コード登録ビュー
//
//@uses UtiwakeViewBase
//@package
//@author igarashi
//@since 2011/11/14
//

require("view/Admin/Utiwake/UtiwakeViewBase.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/14
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
class UtiwakeEntryView extends UtiwakeViewBase {
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
	}

	__destruct() {
		super.__destruct();
	}

};