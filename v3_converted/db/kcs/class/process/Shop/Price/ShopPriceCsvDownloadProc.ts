//
//価格表CSVダウンロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceCsvDownloadProc
//@uses ShopPriceCsvDownloadView
//@uses ShopPriceModel
//
//
//価格表CSVダウンロードプロセス
//
//更新履歴：
//2009/09/11 北村俊士 作成
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceCsvDownloadProc
//@uses ShopPriceCsvDownloadView
//@uses ShopPriceModel
//

require("process/Admin/Price/AdminPriceCsvDownloadProc.php");

require("view/Shop/Price/ShopPriceCsvDownloadView.php");

require("model/Shop/Price/ShopPriceModel.php");

//
//pricelistidを絞り込むIDを返すメソッド名
//
//@var string
//@access protected
//
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
//@return ShopPriceCsvDownloadView
//
class ShopPriceCsvDownloadProc extends AdminPriceCsvDownloadProc {
	constructor() {
		super(...arguments);
		this.id_method = "getShopId";
	}

	getModel() {
		if (false == (undefined !== this.O_model)) {
			this.O_model = new ShopPriceModel();
		}

		return this.O_model;
	}

	getView() {
		if (false == (undefined !== this.O_view)) {
			this.O_view = new ShopPriceCsvDownloadView();
		}

		return this.O_view;
	}

};