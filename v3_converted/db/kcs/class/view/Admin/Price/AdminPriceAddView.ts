//
//管理者：価格表登録View
//
//更新履歴<br>
//2008/08/05 勝史 作成
//
//@uses AdminPriceAddModBaseView
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/08/05
//@filesource
//
//
//
//管理者：価格表登録View
//
//@uses AdminPriceAddModBaseView
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/08/05
//

require("AdminPriceAddModBaseView.php");

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
class AdminPriceAddView extends AdminPriceAddModBaseView {
	constructor(H_navi) {
		super(H_navi, ViewBaseHtml.SITE_ADMIN);
		this.setFinishArg("\u4FA1\u683C\u8868\u306E\u65B0\u898F\u767B\u9332", "/Admin/Price/menu.php", "\u4FA1\u683C\u8868\u4E00\u89A7\u3078");
	}

	checkCGIParam() {
		if (undefined !== _POST.type == true && is_numeric(_POST.type) == true) {
			this.gSess().setSelf("pattern", _POST.type);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		super.checkCGIParam();
	}

	__destruct() {
		super.__destruct();
	}

};