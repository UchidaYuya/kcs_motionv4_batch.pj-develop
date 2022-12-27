//
//在庫マスター 在庫 詳細表示
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ProcessBaseHtml
//@package Product
//@filesource
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//
//在庫マスター 在庫 詳細表示
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//

require("process/ProcessBaseHtml.php");

require("model/Shop/Product/ShopProductModel.php");

require("view/Shop/Product/ShopProductBranchDetailView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access protected
//@return void
//
//
//グローバルセッション/pricelist_shop にshopidが入っていればかえす。<br>なければ、標準のshopidを返す
//
//@author ishizaki
//@since 2009/01/06
//
//@access private
//@return void
//
class ShopProductBranchDetailProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//Smartyによる表示
	{
		var O_view = new ShopProductStockEditView({
			"/Shop/Product/menu.php": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7",
			"": "\u8A73\u7D30\u60C5\u5831"
		});
		O_view.startCheck();
		var O_model = new ShopProductModel();
		var H_product = Array();
		H_product = array_merge(Array.from(O_model.getProductDetailFull(O_view.gSess().groupid, O_view.getProductId())), Array.from(O_model.getStockDetail(this.switchShopid(O_view), O_view.getProductId(), O_view.getBranchID())));
		O_view.setAssign("H_product", H_product);
		O_view.displaySmarty();
	}

	switchShopid(O_view) {
		var shopid = O_view.gSess().getPub("/product_shop");

		if (undefined !== shopid && "" != shopid) {
			return shopid;
		}

		return O_view.gSess().shopid;
	}

};