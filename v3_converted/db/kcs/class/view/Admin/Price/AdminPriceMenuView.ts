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

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//H_postdata
//
//@var mixed
//@access private
//
//
//O_Sess
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
//getPostData
//
//@author katsushi
//@since 2008/07/09
//
//@access public
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
//getPriceNavi
//
//@author ishizaki
//@since 2008/06/26
//
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
class AdminPriceMenuView extends ViewSmarty {
	constructor(H_navi) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Sess = MtSession.singleton();
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_fncname = H_navi[""];
		this.H_assign.H_jsfile = ["adminPriceDelete.js"];
	}

	checkCGIParam() //削除フラグ変更用JSから飛んできた場合はセッションに入れて読み直し
	//$this->O_Sess->setSelf("pricepattern", $_GET["pricepattern"]);
	{
		if (true == (undefined !== _POST.pricelistid) && true == (undefined !== _POST.delflag)) {
			this.O_Sess.setSelf("pricelistid", _POST.pricelistid);
			this.O_Sess.setSelf("delflag", _POST.delflag);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.carcir) && true == Array.isArray(_POST.carcir) && 0 != _POST.carcir[0]) {
			this.H_postdata.carid = +_POST.carcir[0];
			this.H_postdata.cirid = +_POST.carcir[1];
		} else {
			this.H_postdata.carid = undefined;
			this.H_postdata.cirid = undefined;
		}

		if (true == (undefined !== _POST.productname)) {
			this.H_postdata.productname = _POST.productname;
		} else {
			this.H_postdata.productname = undefined;
		}

		if (true == (undefined !== _POST.delflg)) {
			this.H_postdata.delflg = true;
		} else {
			this.H_postdata.delflg = false;
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

	getPostData() {
		return this.H_postdata;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	__destruct() {
		super.__destruct();
	}

};