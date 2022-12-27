//
//価格表テンプレートダウンロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceTemplateDownloadProc
//@uses ShopPriceTemplateDownloadView
//
//
//価格表テンプレートダウンロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceTemplateDownloadProc
//@uses ShopPriceTemplateDownloadView
//

require("process/Admin/Price/AdminPriceTemplateDownloadProc.php");

require("view/Shop/Price/ShopPriceTemplateDownloadView.php");

//
//Viewの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return ShopPriceTemplateDownloadView
//
class ShopPriceTemplateDownloadProc extends AdminPriceTemplateDownloadProc {
  getView() {
    if (false == (undefined !== this.O_view)) {
      this.O_view = new ShopPriceTemplateDownloadView();
    }

    return this.O_view;
  }

};