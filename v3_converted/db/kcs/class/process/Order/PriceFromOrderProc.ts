//
//注文側　価格表
//
//更新履歴：<br>
//2008/06/26 石崎 作成
//
//@uses ProcessBaseHtml
//@uses
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文側　価格表
//
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("process/ProcessBaseHtml.php");

require("model/Order/PriceFromOrderModel.php");

require("view/Order/PriceFromOrderView.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author ishizaki
//@since 2008/07/30
//
//@param array $H_param
//@access public
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class PriceFromOrderProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェ生成
	//価格表権限タイプの取得
	//model オブジェクト生成
	//価格表ヘッダーとフッターを抜き出す
	//中間コメントを挿入する
	{
		var O_view = new PriceFromOrderView();
		var warning = "";

		if ("ENG" == O_view.gSess().language) {
			warning = "Now Printing";
		} else {
			warning = "\u8868\u793A\u3067\u304D\u308B\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093";
		}

		if (false == is_null(O_view.gSess().memid)) {
			O_view.setSiteMode(1);
		}

		O_view.startCheck();
		var price_auth_type = O_view.getPriceAuthType();
		var H_session = O_view.getSelfSession();
		var O_model = new PriceFromOrderModel(O_view.getPactID());
		O_model.setPostID(O_view.getPostID());
		var shopinfo = O_model.getCarrierShop(H_session.carid);

		if (0 == shopinfo.length) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		var pricelistid = O_model.getPricelistID(H_session.ppid, shopinfo.shopid, shopinfo.groupid, price_auth_type);

		if (true == is_null(pricelistid)) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		if ((H_session.carid == "1" || H_session.carid == "3") && H_session.type == "Nmnp") {
			var H_price = O_model.getPriceList(pricelistid, H_session.buytype1, 100, H_session.cirid);
		} else {
			H_price = O_model.getPriceList(pricelistid, H_session.buytype1, H_session.buytype2, H_session.cirid);
		}

		if (1 > H_price.length) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		if (3 == H_session.carid) //付属品
			{
				var H_cdmaone_price = Array();
				var H_lte_price = Array();

				if (4 == H_session.ppid) //雛形登録からきたばあい
					{
						if (true == (undefined !== O_view.H_order_session.from_template) && true == O_view.H_order_session.from_template) {
							for (var key in H_price) //cdmaone用の付属品テンプレート登録時
							{
								var value = H_price[key];

								if (value.cirid == 8) {
									H_cdmaone_price += {
										[key]: value
									};
									delete H_price[key];
								} else if (value.cirid == 10) {
									H_cdmaone_price += {
										[key]: value
									};
								}
							}

							if (8 == O_view.H_order_session.cirid) {
								H_price = H_cdmaone_price;
							}
						}
					} else {
					for (var key in H_price) {
						var value = H_price[key];

						if (value.cirid == 8) {
							H_cdmaone_price += {
								[key]: value
							};
							delete H_price[key];
						}

						if (value.cirid == 78) {
							H_lte_price += {
								[key]: value
							};
							delete H_price[key];
						}
					}

					if (H_session.cirid == 8) {
						if (0 < H_cdmaone_price.length) {
							O_view.setAssign("H_cdmaone_price", H_cdmaone_price);
							H_price = undefined;
						} else {
							O_view.displaySmarty(warning);
							throw die(0);
						}
					} else if (H_session.cirid == 78) {
						if (0 < H_lte_price.length) {
							O_view.setAssign("H_lte_price", H_lte_price);
							H_price = undefined;
						} else {
							O_view.displaySmarty(warning);
							throw die(0);
						}
					} else {
						if (0 == H_price.length) {
							O_view.displaySmarty(warning);
							throw die(0);
						}
					}
				}
			}

		var tmpfile = O_model.getPriceTemplate(H_session.ppid);
		var header = O_model.getPriceHeader(pricelistid);
		var footer = O_model.getPriceFooter(pricelistid);
		var H_comment = O_model.getPriceComment(pricelistid);
		if (Array.isArray(H_price)) H_price = O_model.addPriceComment(H_price, H_comment);
		var H_stock = O_model.getStocklist(shopinfo.shopid);
		O_view.displayHTML(H_price, tmpfile, H_stock, header, footer);
	}

	__destruct() {
		super.__destruct();
	}

};