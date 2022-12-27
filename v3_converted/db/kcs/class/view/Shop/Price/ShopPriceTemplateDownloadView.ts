//
//価格表テンプレートダウンロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceTemplateDownloadView
//
//
//価格表テンプレートダウンロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceTemplateDownloadView
//

require("view/Admin/Price/AdminPriceTemplateDownloadView.php");

//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return void
//
class ShopPriceTemplateDownloadView extends AdminPriceTemplateDownloadView {
  constructor() {
    super(ViewBaseHtml.SITE_SHOP);
  }

};