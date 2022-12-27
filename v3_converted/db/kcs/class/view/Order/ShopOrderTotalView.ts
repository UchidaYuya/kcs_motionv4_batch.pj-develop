//
//注文Viewの基底クラス
//
//更新履歴：<br>
//2008/06/30 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文Viewの基底クラス
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("/kcs/class/OrderUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("view/Order/ShopOrderDetailViewBase.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
//
//ページ個別のCGIparamチェック
//
//@author igarashi
//@since 2008/07/23
//
//@return none
//
//
//Smarty表示
//
//@author igarashi
//@since 2008/07/16
//
//@access public
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderTotalView extends ShopOrderDetailViewBase {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParam() {
		echo("a");
	}

	checkCGIParamPeculiar() {}

	displaySmarty(H_g_sess, H_view) {
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DetailForm.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
	}

	__destruct() {
		super.__destruct();
	}

};