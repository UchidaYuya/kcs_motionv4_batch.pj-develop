//
//shopメニュープロセス
//
//更新履歴：<br>
//2008/10/21 宝子山浩平 作成
//
//@uses ProcessBaseHtml
//@uses ShopMenuModel
//@uses InfoModel
//@uses ShopMenuView
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2008/10/21
//
//error_reporting(E_ALL|E_STRICT);
//
//
//Shopメニュープロセス
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses InfoModel
//@uses ShopMenuView
//@package ShopMenu
//@author houshiyama
//@since 2008/10/21
//

require("process/ProcessBaseHtml.php");

require("model/Shop/ShopMenuModel.php");

require("model/InfoModel.php");

require("view/Shop/ShopMenuView.php");

//
//O_Info
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author houshiyama
//@since 2008/10/21
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2008/10/21
//
//@param array $H_param
//@access protected
//@return void
//
//
//makeOrderPattern
//
//@author houshiyama
//@since 2008/10/21
//
//@param array $A_pattern
//@access protected
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/21
//
//@access public
//@return void
//
class ShopMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("shop_menu");
		this.getSetting().loadConfig("H_fnc_car");
		this.O_Info = new InfoModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//クッキーに値を保持する -- 2008/11/06 by T.Naka
	//共通のCGIチェック
	//権限一覧取得（fncid）
	//model の生成
	//表示用権限情報取得
	//shopの権限取得
	//全セッションを消す
	//Smartyによる表示
	{
		var O_view = new ShopMenuView();
		O_view.setLoginCookie();
		GLOBALS.GROUPID = _POST.groupid;
		O_view.startCheck();
		var A_auth = O_view.getAuthBase();
		var O_model = new ShopMenuModel();

		if (A_auth.length < 1) {
			var H_menu = Array();
		} else {
			H_menu = O_model.getMenu(A_auth);
		}

		O_view.setAssign("H_menu", H_menu);
		var info_more = "";

		if (A_info.length > this.getSetting().shop_menu_info_count) {
			A_info.pop();
			info_more = "\u7D9A\u304D\u306F\u3053\u3061\u3089\u3078";
		}

		O_view.setAssign("shop_person", O_view.gSess().name + " " + O_view.gSess().personname);
		O_view.setAssign("info_more", info_more);
		O_view.setAssign("title", "\u30E1\u30CB\u30E5\u30FC");
		var A_shop_auth = O_view.getAuthShop();
		O_view.gSess().clearSessionMenu();
		O_view.displaySmarty();
	}

	makeOrderPattern(A_pattern: {} | any[]) {
		var H_ptn = Array();

		for (var i = 0; i < A_pattern.length; i++) {
			if (undefined !== H_ptn[A_pattern[i].carid] == false) {
				H_ptn[A_pattern[i].carid] = Array();
			}

			H_ptn[A_pattern[i].carid].push({
				name: A_pattern[i].ptnname,
				url: "/MTOrder/select.php?carid=" + A_pattern[i].carid + "&cirid=" + A_pattern[i].cirid + "&type=" + A_pattern[i].type + "&ppid=" + A_pattern[i].ppid,
				menucomment: A_pattern[i].menucomment
			});
		}

		return H_ptn;
	}

	__destruct() {
		super.__destruct();
	}

};