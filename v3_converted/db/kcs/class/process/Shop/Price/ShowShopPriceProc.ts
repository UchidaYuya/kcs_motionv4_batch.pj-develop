//
//管理者：価格表登録
//
//更新履歴：<br>
//2008/08/05 上杉勝史 作成
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/07/15
//@filesource
//@uses ProcessBaseHtml
//@uses ShopPriceModel
//@uses ShowShopPriceView
//@uses MtSession
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/08/05
//@uses ProcessBaseHtml
//@uses ShopPriceModel
//@uses ShowShopPriceView
//@uses MtSession
//

require("process/ProcessBaseHtml.php");

require("model/Shop/Price/ShopPriceModel.php");

require("view/Shop/Price/ShowShopPriceView.php");

require("MtSession.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理のメイン
//
//@author katsushi
//@since 2008/07/10
//
//@param array $H_param
//@access protected
//@return void
//@uses CarrierModel::getCarrierKeyHash()
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class ShowShopPriceProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("price");
		this.O_Sess = MtSession.singleton();
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//$H_stock = $O_model->getStocklist($O_view->gSess()->shopid);
	//$O_view->setAssign("H_stock", $H_stock);
	{
		var O_view = new ShowShopPriceView();
		O_view.startCheck();
		var O_model = new ShopPriceModel();
		var pricelistid = this.O_Sess.getSelf("pricelistid");

		if (pricelistid == undefined || false == O_model.chkPriceListId(O_view.gSess().shopid, pricelistid, true)) {
			this.errorOut(8, "\u4FA1\u683C\u8868\u304C\u898B\u3064\u304B\u3089\u306A\u3044", false);
		}

		var carid = O_model.getCaridFromPricelistID(pricelistid);

		if (carid == undefined) {
			this.errorOut(8, "\u4FA1\u683C\u8868\u304C\u898B\u3064\u304B\u3089\u306A\u3044", false);
		}

		var ppid = O_model.getPPIDfromPricelistID(pricelistid);
		var tmpfile = O_model.getPriceTemplate(ppid);
		var H_price = O_model.getPriceList(pricelistid);

		if (1 > H_price.length) {
			O_view.displaySmarty("\u8868\u793A\u3067\u304D\u308B\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093");
			throw die(0);
		}

		if (3 == carid) {
			var H_cdmaone_price = Array();

			for (var key in H_price) {
				var value = H_price[key];

				if (value.cirid == 8) {
					H_cdmaone_price += {
						[key]: value
					};
					delete H_price[key];
				}
			}

			if (0 < H_cdmaone_price.length) {
				O_view.setAssign("H_cdmaone_price", H_cdmaone_price);
			}
		}

		var header = O_model.getPriceHeader(pricelistid);
		var footer = O_model.getPriceFooter(pricelistid);
		var H_comment = O_model.getPriceComment(pricelistid);
		if (Array.isArray(H_price)) H_price = O_model.addPriceComment(H_price, H_comment);
		O_view.setAssign("tmpfile", tmpfile);
		O_view.setAssign("H_price", H_price);
		O_view.setAssign("priceheader", header);
		O_view.setAssign("pricefooter", footer);
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};