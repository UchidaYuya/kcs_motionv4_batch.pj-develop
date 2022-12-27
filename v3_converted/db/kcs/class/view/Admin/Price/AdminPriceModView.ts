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
//addFormPriceListStep
//
//@author katsushi
//@since 2008/08/10
//
//@access protected
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
class AdminPriceModView extends AdminPriceAddModBaseView {
	constructor(H_navi) {
		super(H_navi, ViewBaseHtml.SITE_ADMIN);
		this.setFinishArg("\u4FA1\u683C\u8868\u306E\u4FEE\u6B63", "/Admin/Price/menu.php", "\u4FA1\u683C\u8868\u4E00\u89A7\u3078");
	}

	checkCGIParam() {
		if (undefined !== _GET.plid == true && is_numeric(_GET.plid) == true) {
			this.gSess().clearSessionSelf();
			this.gSess().setSelf("pricelistid", _GET.plid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		super.checkCGIParam();
	}

	addFormPriceListStep() {
		this.A_elements.push({
			name: "copy",
			label: "\u30B3\u30D4\u30FC\u3057\u3066\u767B\u9332\u3059\u308B",
			inputtype: "groupcheckbox",
			data: {
				"1": "\u5225\u306E\u4FA1\u683C\u8868\u3068\u3057\u3066\u767B\u9332\u3059\u308B"
			}
		});
	}

	__destruct() {
		super.__destruct();
	}

};