//
//取込金額確認ベースモデル
//
//@uses ModelBase
//@package
//@author igarashi
//@since 2011/11/10
//

require("model/ModelBase.php");

require("MtSetting.php");

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
//setView
//
//@author web
//@since 2012/01/30
//
//@param mixed $view
//@access public
//@return void
//
//
//getTableNo
//
//@author web
//@since 2012/01/31
//
//@param mixed $year
//@param mixed $month
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
class ImportModelBase extends ModelBase {
	constructor() {
		super();
	}

	setView(view) {
		this.view = view;
		this.groupId = this.view.gSess().admin_groupid;
	}

	getTableNo(year, month) {
		var diff = 12 * (this.m_cur_year - year) + this.m_cur_month - month + 1;

		if (diff < 13) {
			if (1 == month) return 12;else {
				var rval = month - 1;
				if (rval < 10) rval = "0" + rval;
				return rval;
			}
		} else {
			if (1 == month) return 24;else return month - 1 + 12;
		}
	}

	__destruct() {
		super.__destruct();
	}

};