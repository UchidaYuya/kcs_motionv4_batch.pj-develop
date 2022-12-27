//
//shopメニュープロセス
//
//更新履歴：<br>
//2008/10/21 宝子山浩平 作成
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses InfoModel
//@uses MenuView
//@package Menu
//@filesource
//@author houshiyama
//@since 2008/10/21
//
//error_reporting(E_ALL|E_STRICT);
//
//
//メニュープロセス
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses InfoModel
//@uses MenuView
//@package Menu
//@author houshiyama
//@since 2008/10/21
//

require("process/ProcessBaseHtml.php");

require("model/Shop/MenuModel.php");

require("model/InfoModel.php");

require("view/Shop/MenuView.php");

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
class MenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("shop_menu");
		this.getSetting().loadConfig("H_fnc_car");
		this.O_Info = new InfoModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//共通のCGIチェック
	//権限一覧取得（fncid）
	//model の生成
	//表示用権限情報取得
	//お知らせ取得
	//$O_view->setAssign( "A_info", $A_info );
	//$O_view->addJs( "xmlhttprequest.js" );
	//$O_view->addJs( "menu.js");
	//$O_view->setAssign( "selg", $O_view->getCookieTab() );
	//$O_view->setAssign( "nowcar", $O_view->getCookieOrderTab() );
	//shopの権限取得
	//全セッションを消す
	//Smartyによる表示
	{
		var O_view = new MenuView();
		O_view.startCheck();
		var A_auth = O_view.getAuthBase();
		var O_model = new MenuModel();
		var H_menu = O_model.getMenu(A_auth);
		O_view.setAssign("H_menu", H_menu);
		var A_info = this.O_Info.getAllInfoList(O_view.gSess().shopid, O_view.gSess().memid, O_view.gSess().su, this.getSetting().shop_menu_info_count + 1);
		var info_more = "";

		if (A_info.length > this.getSetting().shop_menu_info_count) {
			A_info.pop();
			info_more = "\u7D9A\u304D\u306F\u3053\u3061\u3089\u3078";
		}

		O_view.setAssign("shop_person", O_view.gSess().name + " " + O_view.gSess().personname);
		O_view.setAssign("info_more", info_more);
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