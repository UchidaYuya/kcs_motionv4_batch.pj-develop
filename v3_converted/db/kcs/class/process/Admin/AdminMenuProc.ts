//
//Adminメニュープロセス
//
//更新履歴：<br>
//2009/09/08 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@uses AdminMenuModel
//@uses InfoModel
//@uses AdminMenuView
//@package AdminMenu
//@filesource
//@author miyazawa
//@since 2009/09/08
//
//error_reporting(E_ALL|E_STRICT);
//
//
//Adminメニュープロセス
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses InfoModel
//@uses AdminMenuView
//@package AdminMenu
//@author miyazawa
//@since 2009/09/08
//

require("process/ProcessBaseHtml.php");

require("model/Admin/AdminMenuModel.php");

require("model/InfoModel.php");

require("view/Admin/AdminMenuView.php");

require("AdminLogin.php");

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
//@author miyazawa
//@since 2009/09/08
//
//@param array $H_param
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
class AdminMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("shop_menu");
		this.getSetting().loadConfig("H_fnc_car");
		this.O_Info = new InfoModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//クッキーに値を保持する -- 2008/11/06 by T.Naka
	//model の生成
	//権限一覧取得（fncid）
	//表示用権限情報取得
	/// グループIDによる表示制限を適用
	//全セッションを消す
	//Smartyによる表示
	{
		var O_view = new AdminMenuView();
		AdminLogin.getLogin();
		O_view.setLoginCookie();

		if ("" != _POST.gid) {
			GLOBALS.GROUPID = _POST.gid;
		}

		var H_g_sess = O_view.getGlobalAdminSession();
		var O_model = new AdminMenuModel();
		var A_auth = O_model.getAuth(H_g_sess.admin_memid);

		if (A_auth.length < 1) {
			var H_menu = Array();
		} else {
			H_menu = O_model.getMenu(H_g_sess.admin_groupid, A_auth);
		}

		H_menu = O_view.restrictMenu(H_g_sess.admin_groupid, H_menu);
		O_view.setAssign("H_menu", H_menu);
		O_view.setAssign("shop_person", H_g_sess.admin_name + " " + H_g_sess.admin_personname);
		O_view.setAssign("title", "\u30E1\u30CB\u30E5\u30FC");
		O_view.setAssign("admin_fncname", "ADMIN MENU");
		O_view.setAssign("shopid", H_g_sess.admin_shopid);
		O_view.setAssign("groupid", H_g_sess.admin_groupid);
		O_view.gSess().clearSessionMenu();
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};