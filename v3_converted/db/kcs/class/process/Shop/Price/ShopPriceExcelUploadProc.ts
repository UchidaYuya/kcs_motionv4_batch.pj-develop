//
//価格表Excelアップロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceExcelUploadProc
//@uses ShopPriceExcelUploadView
//@uses ShopPriceModel
//
//
//価格表Excelアップロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceExcelUploadProc
//@uses ShopPriceExcelUploadView
//@uses ShopPriceModel
//

require("process/Admin/Price/AdminPriceExcelUploadProc.php");

require("view/Shop/Price/ShopPriceExcelUploadView.php");

require("model/Shop/Price/ShopPriceModel.php");

//
//Modelの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return ShopPriceModel
//
//
//Viewの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return ShopPriceExcelUploadView
//
class ShopPriceExcelUploadProc extends AdminPriceExcelUploadProc {
	getModel() {
		if (false == (undefined !== this.O_model)) {
			this.O_model = new ShopPriceModel();
		}

		return this.O_model;
	}

	getView() {
		if (false == (undefined !== this.O_view)) {
			this.O_view = new ShopPriceExcelUploadView();
			this.O_view.setModel(this.getModel());
		}

		return this.O_view;
	}

};