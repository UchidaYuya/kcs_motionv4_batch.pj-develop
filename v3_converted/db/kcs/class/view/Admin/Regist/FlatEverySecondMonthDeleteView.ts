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
//endAddView
//完了画面
//@author web
//@since 2015/09/15
//
//@param array $H_sess
//@access public
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
class FlatEverySecondMonthDeleteView extends FlatEverySecondMonthAddView {
	constructor() //ショップ属性を付ける
	{
		super();
		this.DeleteName = "\u524A\u9664";
	}

	checkUse(use) {
		if (undefined !== H_default.sp_fee && H_default.sp_fee > 0) {
			H_default.sp_use = "use";
		} else {
			H_default.sp_use = "";
		}
	}

	freezeForm() {
		this.H_View.O_FormUtil.updateElementAttrWrapper("submit", {
			value: this.DeleteName
		});
		this.H_View.O_FormUtil.freezeWrapper();
	}

	endDeleteView(H_sess: {} | any[]) //セッションクリア
	//一時的に無効化。あとでコメント外しといて
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u5E73\u6E96\u5316\u524A\u9664", "/Admin/Regist/regist_list.php", "\u4F1A\u793E\u4E00\u89A7\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};