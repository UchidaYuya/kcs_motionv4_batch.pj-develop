//
//管理者：商品マスター画面のView
//
//更新履歴<br>
//2008/07/08 石崎公久 作成
//
//@uses AdminProductAddModBaseView
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/29
//@filesource
//
//
//
//管理者：商品マスター画面のView
//
//@uses AdminProductAddModBaseView
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/09
//

require("AdminProductAddModBaseView.php");

//
//__construct
//コンストラクタ
//
//@author katsushi
//@since 2008/07/19
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/02
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class AdminProductAddView extends AdminProductAddModBaseView {
	constructor(H_navi) {
		super(H_navi);
	}

	checkCGIParam() {
		super.checkCGIParam();
	}

	__destruct() {
		super.__destruct();
	}

};