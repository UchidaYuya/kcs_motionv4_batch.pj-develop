//
//ShopLogoutプロセス
//
//更新履歴：<br>
//2008/11/18 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Shop
//@filesource
//@author nakanita
//@since 2008/11/18
//
//error_reporting(E_ALL|E_STRICT);
//
//
//ShopIndexプロセス
//
//@uses ProcessBaseHtml
//@package Shop
//@author nakanita
//@since 2008/11/18
//

require("process/ProcessBaseHtml.php");

require("view/Shop/ShopLogoutView.php");

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
//@author nakanita
//@since 2008/11/06
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクター
//
//@author nakanita
//@since 2008/11/06
//
//@access public
//@return void
//
class ShopLogoutProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログアウト処理
	//Smartyによる表示
	{
		var O_view = new ShopLogoutView();
		O_view.doLogout();
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};