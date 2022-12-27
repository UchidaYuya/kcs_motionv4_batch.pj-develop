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

require("view/Admin/Price/AdminPriceAddModBaseView.php");

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
class ShopPriceAddView extends AdminPriceAddModBaseView {
	constructor(H_navi) {
		super(H_navi, ViewBaseHtml.SITE_SHOP);
		this.setFinishArg("\u4FA1\u683C\u8868\u306E\u65B0\u898F\u767B\u9332", "/Shop/MTPrice/menu.php", "\u4FA1\u683C\u8868\u4E00\u89A7\u3078");
		this.H_assign.shop_submenu = this.H_assign.admin_submenu;
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
	}

	checkCGIParam() {
		if (undefined !== _POST.type == true && is_numeric(_POST.type) == true) {
			if (undefined !== _POST.shopid == true && is_numeric(_POST.shopid) == true) {
				this.gSess().setSelf("insertShopid", _POST.shopid);
			}

			this.gSess().setSelf("pattern", _POST.type);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		var pricelist_shop = this.gSess().getPub("/pricelist_shop");

		if (undefined !== pricelist_shop && "" != pricelist_shop) {
			this.gSess().setSelf("insertShopid", pricelist_shop);
		}

		super.checkCGIParam();
	}

	__destruct() {
		super.__destruct();
	}

};