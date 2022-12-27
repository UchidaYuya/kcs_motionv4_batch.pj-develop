//
//管理者：商品マスター詳細View
//
//更新履歴<br>
//2008/07/25 上杉勝史 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtSetting
//@package Product
//@subpackage View
//@author katsushi
//@since 2008/07/25
//@filesource
//
//
//
//管理者：商品マスター詳細のView
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Product
//@subpackage View
//@author katsushi
//@since 2008/07/25
//

require("AdminProductAddModBaseView.php");

require("view/MakePankuzuLink.php");

require("MtSetting.php");

//
//H_assign
//
//@var mixed
//@access protected
//
//
//productid
//
//@var mixed
//@access private
//
//
//O_Ini
//
//@var mixed
//@access private
//
//
//__construct
//コンストラクタ
//
//@author katsushi
//@since 2008/07/19
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//assignUserConf
//
//@author katsushi
//@since 2008/08/12
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/02
//
//@access public
//@return void
//
//
//getProductId
//
//@author katsushi
//@since 2008/07/22
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author katsushi
//@since 2008/07/25
//
//@access public
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/07/25
//
//@access protected
//@return void
//
//
//setAssign
//
//@author katsushi
//@since 2008/07/25
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class AdminProductDetailView extends ViewSmarty {
	constructor(H_navi) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Ini = MtSetting.singleton();
		this.O_Ini.loadConfig("product");
		this.H_assign = Array();
		this.H_assign.admin_fncname = H_navi[""];
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.productid = undefined;
		this.assignUserConf();
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

	checkCGIParam() {
		if (undefined !== _GET.productid == true || is_numeric(_GET.productid) == true) {
			this.gSess().clearSessionSelf();
			this.gSess().setSelf("productid", _GET.productid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.productid = this.gSess().getSelf("productid");
	}

	getProductId() {
		return this.productid;
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