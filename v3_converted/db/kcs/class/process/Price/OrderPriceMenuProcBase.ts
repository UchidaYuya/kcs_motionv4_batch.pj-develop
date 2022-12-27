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
class OrderPriceMenuProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//パラメータチェック
	//$O_view->checkCGIParam();
	//会社権限側の価格表権限があるか確認
	//現在のキャリアのパターンリストを作成する
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_session = O_view.getSelfSession();

		if (false == (undefined !== H_session.carid)) {
			H_session.carid = 1;
		}

		if (false == (undefined !== H_session.pricepattern)) {
			H_session.pricepattern = "docomo_foma_new";
		}

		var O_model = this.get_Model(O_view.gSess().pactid, O_view.gSess().postid);
		var price_auth_type = O_model.getPriceAuthType();

		if (false === price_auth_type) {
			O_view.displaySmarty("\u8868\u793A\u3067\u304D\u308B\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093");
			throw die(0);
		}

		var shopinfo = O_model.getCarrierShop(H_session.carid);

		if (0 == shopinfo.length) {
			O_view.displaySmarty("\u8868\u793A\u3067\u304D\u308B\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093");
			throw die(0);
		}

		var H_price = O_model.getPriceList(H_session.carid, shopinfo.shopid, H_session.pricepattern, shopinfo.groupid);
		var priceheader = O_model.getPriceHeader();
		var pricefooter = O_model.getPriceFooter();
		var A_pattern = O_model.getPatternList(H_session.carid, shopinfo.shopid, shopinfo.groupid);
		O_view.displayHTML(H_price, A_pattern, H_session.pricepattern, carid, priceheader, pricefooter);
	}

	__destruct() {
		super.__destruct();
	}

};