//
//管理者：価格表一覧View
//
//更新履歴<br>
//2008/07/29 勝史 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/07/29
//@filesource
//
//
//
//管理者：価格表一覧View
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/07/29
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//コンストラクタ
//
//@author ishizaki
//@since 2008/06/26
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
//displaySmarty
//
//@author ishizaki
//@since 2008/05/01
//
//@access public
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
//@access private
//@return void
//
//
//setAssign
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
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
class AdminPriceShowRelView extends ViewSmarty {
	constructor(H_navi) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_fncname = H_navi[""];
	}

	checkCGIParam() {
		if (true == (undefined !== _GET.pricelistid) && true == is_numeric(_GET.pricelistid)) {
			this.gSess().setSelf("pricelistid", _GET.pricelistid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}
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