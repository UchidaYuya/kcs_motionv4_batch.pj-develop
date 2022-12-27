//
//在庫マスター 在庫設定 PROC
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
//在庫マスター 在庫設定 PROC
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//

require("process/ProcessBaseHtml.php");

require("model/Shop/Product/ShopProductModel.php");

require("view/Shop/Product/ShopProductStockEditView.php");

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
class ShopProductStockEditProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("stock");
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//ショップID
	//フォーム作成
	//登録する前
	{
		var O_view = new ShopProductStockEditView({
			"/Shop/Product/menu.php": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7",
			"": "\u5728\u5EAB\u8A2D\u5B9A"
		});
		O_view.startCheck();
		var O_model = new ShopProductModel();
		var shopid = O_view.getShopID();

		if ("" == shopid) {
			shopid = O_view.gSess().shopid;
		}

		var H_stock_detail = O_model.getStockDetail(shopid, O_view.getProductID(), O_view.getBranchID());
		O_view.makeFormElements(H_stock_detail);

		if (false == O_view.getSubmitFlag()) //Smartyによる表示
			{
				O_view.displaySmarty(H_stock_detail);
			} else {
			O_model.updateInsertStockDetail(shopid, O_view.getProductID(), O_view.getBranchID(), O_view.getSessStatus(), O_view.getSessReserve(), O_view.getSessLayaway(), O_view.getSessStock());
			var H_mnglog = {
				shopid: O_view.gSess().shopid,
				groupid: O_view.gSess().groupid,
				memid: O_view.gSess().memid,
				name: O_view.gSess().personname,
				postcode: O_view.gSess().postcode,
				comment1: "ID:" + O_view.gSess().memid,
				comment2: "\u30D7\u30ED\u30C0\u30AF\u30C8ID" + O_view.getProductID() + "-" + O_view.getBranchID() + "\u306E\u5728\u5EAB\u60C5\u5831\u3092\u7DE8\u96C6",
				kind: "Product",
				type: "\u5728\u5EAB\u7DE8\u96C6",
				joker_flag: 0
			};
			this.getOut().writeShopMnglog(H_mnglog);
			O_view.clearSessSelf();
			O_view.displayFinish();
		}
	}

};