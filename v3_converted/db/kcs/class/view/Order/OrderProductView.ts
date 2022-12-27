//
//注文商品表示View
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文商品表示View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//商品情報入力フォーム作成
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@access protected
//@return void
//
//
//商品情報反映
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class OrderProductView extends OrderViewBase {
	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(OrderProductView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	makeProductForm(H_sess) {
		var hoge = "";
		return hoge;
	}

	setProductValue(O_form) {
		var hoge = "";
		return hoge;
	}

	__destruct() {
		super.__destruct();
	}

};