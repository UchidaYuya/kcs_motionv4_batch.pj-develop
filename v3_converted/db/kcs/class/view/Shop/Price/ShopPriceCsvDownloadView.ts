//
//価格表CSVダウンロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceCsvDownloadView
//
//
//価格表CSVダウンロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceCsvDownloadView
//

require("view/Admin/Price/AdminPriceCsvDownloadView.php");

//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return void
//
//
//ショップIDの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return integer
//
class ShopPriceCsvDownloadView extends AdminPriceCsvDownloadView {
	constructor() {
		super(ViewBaseHtml.SITE_SHOP);
	}

	getShopId() {
		return this.gSess().shopid;
	}

};