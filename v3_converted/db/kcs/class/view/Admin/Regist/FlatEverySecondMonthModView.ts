//error_reporting(E_ALL);
//
//FlatEverySecondMonthModView
//
//@uses FlatEverySecondMonthAddView
//@package
//@author web
//@since 2015/09/24
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUniqueString.php");

require("view/ViewFinish.php");

require("view/Admin/Regist/FlatEverySecondMonthAddView.php");

//
//__construct
//
//@author web
//@since 2015/09/24
//
//@access public
//@return void
//
//
//checkUse
//
//@author web
//@since 2015/09/27
//
//@param mixed $use
//@access private
//@return void
//
//
//__destruct
//
//@author web
//@since 2015/09/24
//
//@access public
//@return void
//
class FlatEverySecondMonthModView extends FlatEverySecondMonthAddView {
	constructor() //ショップ属性を付ける
	{
		super();
	}

	checkUse(use) {
		if (undefined !== H_default.sp_fee && H_default.sp_fee > 0) {
			H_default.sp_use = "use";
		} else {
			H_default.sp_use = "";
		}
	}

	__destruct() {
		super.__destruct();
	}

};