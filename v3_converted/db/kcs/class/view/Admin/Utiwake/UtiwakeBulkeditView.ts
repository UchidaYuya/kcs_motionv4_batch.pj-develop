//
//内訳コード一括修正ビュー
//
//@uses UtiwakeListView
//@package
//@author igarashi
//@since 2011/11/28
//

require("view/Admin/Utiwake/UtiwakeListView.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/17
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
//__destruct
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
class UtiwakeBulkeditView extends UtiwakeListView {
	constructor() {
		super();
	}

	checkCGIPeculiar() {
		this.H_dir.display = UtiwakeBulkeditView.DEFAULT_DISPLAY;
		this.H_local = _POST;

		if (undefined !== this.H_local.regist || !is_null(this.gSess().getSelf("regist"))) {
			this.confirm = true;
		} else {
			this.confirm = false;
		}
	}

	__destruct() {
		super.__destruct();
	}

};