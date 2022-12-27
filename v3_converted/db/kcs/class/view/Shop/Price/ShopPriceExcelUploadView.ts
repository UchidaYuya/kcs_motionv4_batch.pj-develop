//
//価格表Excelアップロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@filesource
//@uses AdminPriceExcelUploadView
//
//
//価格表Excelアップロードビュー
//
//@package Shop
//@subpackage Price
//@author kitamura
//@since 2009/09/11
//@uses AdminPriceExcelUploadView
//

require("view/Admin/Price/AdminPriceExcelUploadView.php");

//
//O_model
//
//@var ShopPriceModel
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return void
//
//
//初期化
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return void
//
//
//グループIDの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return integer
//
//
//ショップIDの取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return integer
//
//
//ユーザ名の取得
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return string
//
//
//モデルの設定
//
//@author kitamura
//@since 2009/11/06
//
//@access public
//@return void
//
//
//モデルの取得
//
//@author kitamura
//@since 2009/11/06
//
//@access public
//@return ShopPriceModel
//
//
//パンくずリストの生成
//
//@author kitamura
//@since 2009/09/11
//
//@access protected
//@return string
//
class ShopPriceExcelUploadView extends AdminPriceExcelUploadView {
	constructor() {
		super(ViewBaseHtml.SITE_SHOP);
	}

	init() {
		this.H_default_assign = {
			shop_submenu: this.createTopicPath(),
			shop_person: this.gSess().name + " " + this.gSess().personname,
			title: "\u4FA1\u683C\u8868Excel\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		this.assign(this.H_default_assign);
	}

	getGroupId() {
		return this.gSess().groupid;
	}

	getShopId() {
		var shopid = this.gSess().shopid;
		var child_shopid = this.getChildShopId();

		if (child_shopid.length > 0 && +(shopid !== +child_shopid)) {
			if (true == ctype_digit(strval(child_shopid)) && this.getModel().chkChildShopId(shopid, child_shopid)) {
				shopid = child_shopid;
			} else {
				this.errorOut(8, "\u5305\u62EC\u5B50\u306E\u30B7\u30E7\u30C3\u30D7ID\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093", false);
			}
		}

		return shopid;
	}

	getPersonName() {
		return this.gSess().personname;
	}

	setModel(O_model: ShopPriceModel) {
		this.O_model = O_model;
	}

	getModel() {
		return this.O_model;
	}

	createTopicPath() {
		var O_tp = new MakePankuzuLink();
		var H_link = {
			"/Shop/MTPrice/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868Excel\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		return O_tp.makePankuzuLinkHTML(H_link, "shop", true);
	}

};