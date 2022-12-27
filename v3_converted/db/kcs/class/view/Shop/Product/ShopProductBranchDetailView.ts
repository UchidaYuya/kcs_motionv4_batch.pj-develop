//
//ショップ：在庫詳細表示
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses MtSession
//@uses ViewSmarty
//@uses ViewFinish
//@uses MakePankuzuLink
//@uses QuickFormUtil
//@package Product
//@subpackage View
//@filesource
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//error_reporting(E_ALL);
//
//ショップ：在庫設定
//
//@uses MtSession
//@uses ViewSmarty
//@uses ViewFinish
//@uses MakePankuzuLink
//@uses QuickFormUtil
//@package Product
//@subpackage View
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/02/08
//

require("MtSetting.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//productid
//
//@var mixed
//@access private
//
//
//branchid
//
//@var mixed
//@access private
//
//
//getProductID
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//getBranchID
//
//@author ishizaki
//@since 2008/07/23
//
//@access public
//@return void
//
//
//O_ini
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
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//assignUserConf
//
//@author ishizaki
//@since 2008/08/12
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/23
//
//@param mixed $H_stock_detail
//@access public
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/07/18
//
//@access private
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/07/25
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShopProductStockEditView extends ViewSmarty {
	getProductID() {
		return this.productid;
	}

	getBranchID() {
		return this.branchid;
	}

	constructor(H_navi) //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.O_Ini = MtSetting.singleton();
		this.O_Ini.loadConfig("product");
		this.H_assign.title = "\u5728\u5EAB\u8A73\u7D30\u8868\u793A";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
		this.assignUserConf();
		this.productid = undefined;
		this.branchid = undefined;
	}

	checkCGIParam() {
		if (true == (undefined !== _GET.productid) && true == (undefined !== _GET.branchid)) {
			this.gSess().setSelf("productid", _GET.productid);
			this.gSess().setSelf("branchid", _GET.branchid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.productid = this.gSess().getSelf("productid");
		this.branchid = this.gSess().getSelf("branchid");
	}

	assignUserConf() {
		this.H_assign.product_text1 = this.O_Ini.product_text1;
		this.H_assign.product_text2 = this.O_Ini.product_text2;
		this.H_assign.product_text3 = this.O_Ini.product_text3;
		this.H_assign.product_text4 = this.O_Ini.product_text4;
		this.H_assign.product_text5 = this.O_Ini.product_text5;
		this.H_assign.product_int1 = this.O_Ini.product_int1;
		this.H_assign.product_int2 = this.O_Ini.product_int2;
		this.H_assign.product_int3 = this.O_Ini.product_int3;
		this.H_assign.product_date1 = this.O_Ini.product_date1;
		this.H_assign.product_date2 = this.O_Ini.product_date2;
	}

	displaySmarty() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	assignSmarty() {
		{
			let _tmp_0 = this.H_assign;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				this.get_Smarty().assign(key, value);
			}
		}
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	__destruct() {
		super.__destruct();
	}

};