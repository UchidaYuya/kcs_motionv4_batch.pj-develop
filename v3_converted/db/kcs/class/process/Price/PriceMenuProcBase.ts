//
//価格表Proccess基底
//
//更新履歴：<br>
//2008/06/26 石崎公久 作成
//
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Price
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

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
//各ページのview取得
//
//@author ishizaki
//@since 2008/06/26
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author ishizaki
//@since 2008/06/26
//
//@abstract
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//１．Viewオブジェクト作成
//２．ログインチェック
//３．Modelオブジェクト
//４．現在有効である価格表の取得
//５．価格表表示
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access protected
//@return void
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
class PriceMenuProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//パラメータチェック
	//modelオブジェクトの生成
	//会社権限側の価格表権限があるか確認
	//テンプレート名取得
	//部署に割り当てられているキャリアと対応する販売店を取得＆グループID
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var warning = "";

		if ("ENG" == O_view.gSess().language) {
			warning = "Now Printing";
		} else {
			warning = "\u8868\u793A\u3067\u304D\u308B\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093";
		}

		O_view.startCheck();
		var H_session = O_view.getSelfSession();
		var O_model = this.get_Model(O_view.gSess().pactid, O_view.gSess().postid);
		var price_auth_type = O_view.getPriceAuthType();

		if (false === price_auth_type) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		var A_carid = O_model.getOrderableCarrier(O_view.gSess().pactid, O_view.gSess().postid);

		if (false == (undefined !== H_session.carid)) {
			H_session.carid = A_carid[0];
			H_session.type = "N";
		}

		if (true == is_null(H_session.carid)) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		var H_type_ppid = O_model.getPPID(H_session.carid);

		if (H_session.type != "A") {
			var ppid = H_type_ppid.N;
		} else {
			ppid = H_type_ppid.A;
		}

		var tmpfile = O_model.getPriceTemplate(ppid);
		var shopinfo = O_model.getCarrierShop(H_session.carid);

		if (0 == shopinfo.length) {
			O_view.displaySmarty(warning);
			throw die(0);
		}

		var pricelistid = O_model.getPricelistID(ppid, shopinfo.shopid, shopinfo.groupid, price_auth_type);

		if (true == is_null(pricelistid)) {
			var err_str = warning;
			var H_price = Array();
			var H_stock = Array();
		} else //auのみ、CDMAONEとWINをふりわけ
			//中間コメントを挿入する
			{
				err_str = undefined;
				H_price = O_model.getPriceList(pricelistid);

				if (3 == H_session.carid && "A" != H_session.type) {
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
				H_stock = O_model.getStocklist(shopinfo.shopid);
			}

		O_view.displayHTML(H_session.carid, H_price, tmpfile, H_stock, H_session.type, A_carid, header, footer, err_str);
	}

	__destruct() {
		super.__destruct();
	}

};