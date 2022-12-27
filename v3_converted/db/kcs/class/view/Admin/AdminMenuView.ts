//
//AdminメニューViewクラス
//
//@uses ViewSmarty
//@package AdminMenu
//@filesource
//@author miyazawa
//@since 2009/09/08
//
//
//error_reporting(E_ALL);
//
//AdminメニューViewクラス
//
//@uses ViewSmarty
//@package AdminMenu
//@author miyazawa
//@since 2009/09/08
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

//
//__construct
//
//@author miyazawa
//@since 2009/09/08
//
//@access public
//@return void
//
//
//ログイン時の入力値をクッキーに保存する
//
//@author nakanita
//@since 2008/11/06
//
//@access public
//@return void
//
//
//restrictMenu
//
//@author miyazawa
//@since 2009/09/11
//
//@access public
//@return void
//
//
//checkAuth
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//getAuthBase
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//getAuthPact
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//setAssign
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//addJs
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//assignSmarty
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
class AdminMenuView extends ViewSmarty {
	constructor() //管理者属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.H_js = Array();
		this.H_css = Array();
		this.H_assign = Array();
	}

	setLoginCookie() //ログイン時以外は何もしない
	//30日
	{
		if (_POST.login !== "login") {
			return;
		}

		var expire = Date.now() / 1000 + 60 * 60 * 24 * 30;

		if (undefined !== _POST.gid == true && _POST.gid !== "") {
			setcookie("ad_group", _POST.gid, expire, "/");
		}

		if (undefined !== _POST.loginid == true && _POST.loginid !== "") {
			setcookie("ad_loginid", _POST.loginid, expire, "/");
		}

		if (undefined !== _POST.personname == true && _POST.personname !== "") {
			setcookie("ad_personname", _POST.personname, expire, "/");
		}
	}

	restrictMenu(groupid, H_menu) //fncid |           fncname            |        ininame
	//-------+------------------------------+------------------------
	//     1 | お知らせ                     | fnc_admin_info
	//     2 | 受注集計                     | fnc_admin_orderlist_v2
	//     3 | V3受注集計                   | fnc_admin_orderlist_v3
	//     4 | 商品マスター                 | fnc_admin_product
	//     5 | 価格表一覧                   | fnc_admin_price
	//     6 | 料金プラン一覧               | fnc_admin_plan
	//     7 | オプション・割引サービス一覧 | fnc_admin_option
	//     8 | パケットプラン一覧           | fnc_admin_packet
	//     9 | 公私分計パターン一覧         | fnc_admin_kousi
	//    10 | 勘定科目内訳パターン登録     | fnc_admin_account
	//    11 | 販売店一覧                   | fnc_admin_shop
	//    12 | 会社登録                     | fnc_admin_regist
	//    13 | 管理者パスワード変更         | fnc_admin_password
	//    14 | お問い合わせ                 | fnc_admin_faq
	//    15 | ショップ管理記録             | fnc_admin_shopmnglog
	//たとえadmin_function_tbで設定されていても、グループIDによって制限される機能があるので、ここで許可されない機能を除外する
	//このグループIDには許可されない機能
	{
		var H_menu_restricted = Array();

		for (var key in H_menu) {
			var val = H_menu[key];

			switch (groupid) {
				case 0:
					if (false == (-1 !== ["fnc_admin_orderlist_v2", "fnc_admin_orderlist_v3", "fnc_admin_product", "fnc_admin_price"].indexOf(val.ininame))) {
						H_menu_restricted.push(val);
					}

					break;

				case 1:
					H_menu_restricted.push(val);
					break;

				default:
					if (false == (-1 !== ["fnc_admin_plan", "fnc_admin_option", "fnc_admin_packet"].indexOf(val.ininame))) {
						H_menu_restricted.push(val);
					}

			}
		}

		return H_menu_restricted;
	}

	checkAuth() {
		this.checkCustomAuth();
	}

	getAuthBase() {
		return this.getAuth().getUserFuncId(this.gSess().memid);
	}

	getAuthAdmin() {
		return this.getAuth().getAdminFuncId();
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	addJs(jsfile) {
		if (Array.isArray(this.H_assign.H_jsfile) == false) {
			this.H_assign.H_jsfile = Array();
		}

		this.H_assign.H_jsfile.push(jsfile);
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

	displaySmarty() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};