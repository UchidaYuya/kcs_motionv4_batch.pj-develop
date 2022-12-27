//
//在庫マスター一覧画面PROC
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ProcessBaseHtml
//@uses CircuitModel
//@uses CarrierModel
//@uses ShopModel
//@package Product
//@filesource
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//
//在庫マスター一覧画面PROC
//
//@package Product
//@subpackage process
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//

require("process/ProcessBaseHtml.php");

require("model/Shop/Product/ShopProductModel.php");

require("view/Shop/Product/ShopProductMenuView.php");

require("model/CircuitModel.php");

require("model/CarrierModel.php");

require("model/ShopModel.php");

//
//販売店モデル
//
//@var mixed
//@access private
//
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
class ShopProductMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Shop = new ShopModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//自分を含む店名
	//$A_shopid = array();
	//		$A_tmp = $this->O_Shop->getIncludeShop($O_view->gSess()->shopid);
	//		array_push($A_shopid, $O_view->gSess()->shopid);
	//		$A_shopid = array_merge($A_shopid, $A_tmp);
	//有効な在庫情報の一覧を取得
	//$A_stocklist = $O_model->enableStockList($O_view->gSess()->groupid, $A_shopid, $H_search["productname"], $H_search["carid"], $H_search["cirid"]);
	//Smartyによる表示
	{
		var O_view = new ShopProductMenuView({
			"": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7"
		});
		O_view.startCheck();
		var O_model = new ShopProductModel();
		var O_CarModel = new CarrierModel();
		var O_CirModel = new CircuitModel();
		var delflg = O_view.getDelflag();
		var productid = O_view.getProductID();
		var branchid = O_view.getBranchID();
		var shopid = O_view.getShopID();

		if (false == is_null(productid) && false == is_null(branchid) && false == is_null(delflg) && false == is_null(shopid)) {
			var res = O_model.changeDelflg(productid, branchid, shopid, delflg);

			if (res === false) {
				this.getOut().warningOut(8, "\u95A2\u9023\u4ED8\u3051\u306E\u306A\u3044 productid \u3082\u3057\u304F\u306F branchid \u304C\u6307\u5B9A\u3055\u308C\u305F\u305F\u3081");
			}

			var H_mnglog = {
				shopid: O_view.gSess().shopid,
				groupid: O_view.gSess().groupid,
				memid: O_view.gSess().memid,
				name: O_view.gSess().personname,
				postcode: O_view.gSess().postcode,
				comment1: "ID:" + O_view.gSess().memid,
				comment2: "\u30D7\u30ED\u30C0\u30AF\u30C8ID" + O_view.getProductID() + "-" + O_view.getBranchID() + "\u306E\u524A\u9664\u30D5\u30E9\u30B0\u3092\u5909\u66F4",
				kind: "Product",
				type: "\u5728\u5EAB\u7DE8\u96C6",
				joker_flag: 0
			};
			this.getOut().writeShopMnglog(H_mnglog);
		}

		var H_car = O_CarModel.getCarrierFromProductBranchTbKeyHash();

		if (0 < H_car.length) {
			var A_cir = O_CirModel.getCircuitCarrier(Object.keys(H_car));
		} else {
			A_cir = Array();
		}

		H_car = {
			0: "----"
		} + H_car;
		var H_shop = this.O_Shop.getIncludeShopWithName(O_view.gSess().shopid, true);
		O_view.setAssign("supportshop", !H_shop);
		O_view.makeFormElements([H_car, O_view.makeHierSelectCircuit(A_cir)], H_shop);
		var H_search = O_view.getPostData();
		var nowshopid = H_search.shoplist;

		if (true == is_null(nowshopid)) {
			nowshopid = O_view.gSess().shopid;
		}

		O_view.gSess().setPub("/product_shop", nowshopid);
		O_view.setAssign("shopname", O_view.gSess().name);
		var A_stocklist = O_model.enableStockList(O_view.gSess().groupid, nowshopid, H_search.productname, H_search.carid, H_search.cirid);
		O_view.displaySmarty(A_stocklist);
	}

};