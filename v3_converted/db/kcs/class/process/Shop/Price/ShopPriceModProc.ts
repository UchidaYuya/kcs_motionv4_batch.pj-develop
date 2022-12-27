//
//管理者：価格表登録
//
//更新履歴：<br>
//2008/08/05 上杉勝史 作成
//2009/02/25 石崎公久 pricelistid が空の場合のチェックを入れた
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/07/15
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceAddModBaseProc
//@uses AdminProductModel
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
//@uses AdminPriceAddModBaseProc
//@uses ShopProductModel
//

require("process/Admin/Price/AdminPriceAddModBaseProc.php");

require("view/Shop/Price/ShopPriceModView.php");

require("model/Shop/Price/ShopPriceModel.php");

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
//setView
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//1.Viewオブジェクト作成
//2.ログインチェック
//3.Modelオブジェクト(ShopPriceModel)
//4.Modelオブジェクト(CarrierModel)
//5.キャリア一覧の取得
//6.キャリア一覧に空(未選択)を加える
//7.検索フォームの作成(QuickForm)
//8.ViewからPOSTの値を取得
//9.検索結果をViewへ渡す
//10.smarty出力
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
//setShopid
//
//@author katsushi
//@since 2008/08/08
//
//@access protected
//@return void
//
//
//setStepParam
//
//@author katsushi
//@since 2008/08/10
//
//@param string $form_step
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
class ShopPriceModProc extends AdminPriceAddModBaseProc {
	constructor(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	{
		super(H_param);
		this.setView();
		this.setShopid();
		this.O_model = new ShopPriceModel();
	}

	setView() {
		this.O_view = new ShopPriceModView({
			"/Shop/MTPrice/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868\u4FEE\u6B63"
		});
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	{
		this.getView().startCheck();

		if ("" === this.getView().gSess().getSelf("pricelistid") || undefined === this.getView().gSess().getSelf("pricelistid")) {
			this.errorOut(8, "pricelistid\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044", false);
		}

		if (this.O_model.chkPriceListId(this.shopid, this.getView().gSess().getSelf("pricelistid"), false, true) === false || "" == this.getView().gSess().getSelf("pricelistid")) {
			this.errorOut(8, "\u4FA1\u683C\u8868\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093", false);
		}

		this.setModData();
		this.execFormStep();
	}

	setShopid() {
		this.shopid = this.getSess().shopid;
		this.groupid = this.getSess().groupid;
		this.personname = this.getSess().personname;
	}

	setStepParam(form_step = "") {
		if (form_step == "input_pricelist") {
			this.getView().setSubmitName("\u78BA\u8A8D\u753B\u9762\u3078");
		} else if (form_step == "confirm_pricelist") {
			var H_tmp = this.getSess().getSelf("postdata");

			if (undefined !== H_tmp.copy == true && H_tmp.copy["1"] == "1") {
				this.getView().setSubmitName("\u5225\u306E\u4FA1\u683C\u8868\u3068\u3057\u3066\u767B\u9332\u3059\u308B");
			} else {
				this.getView().setSubmitName("\u4FEE\u6B63");
			}
		} else {
			this.getView().setSubmitName("\u4FA1\u683C\u5165\u529B\u3078");
		}
	}

	__destruct() {
		super.__destruct();
	}

};