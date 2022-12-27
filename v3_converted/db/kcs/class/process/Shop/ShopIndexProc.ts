//
//ShopIndexプロセス
//
//更新履歴：<br>
//2008/11/06 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package ShopMenu
//@filesource
//@author nakanita
//@since 2008/11/06
//
//error_reporting(E_ALL|E_STRICT);
//
//require_once("model/Shop/ShopMenuModel.php");
//
//ShopIndexプロセス
//
//@uses ProcessBaseHtml
//@package ShopMenu
//@author nakanita
//@since 2008/11/06
//

require("process/ProcessBaseHtml.php");

require("view/Shop/ShopIndexView.php");

require("model/GroupModel.php");

//
//H_param
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
class ShopIndexProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.H_param = H_param;
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//model の生成
	//$O_model = new ShopMenuModel();
	//全セッションを消す
	//Smartyによる表示
	{
		var O_view = new ShopIndexView();
		var O_model = new GroupModel();
		O_view.setAssign("group", group);
		O_view.setAssign("groupid", this.H_param.groupid);
		O_view.setAssign("grouptitle", O_model.getGroupTitle(this.H_param.groupid, "S"));
		O_view.setAssign("userid_ini", userid_ini);
		O_view.setAssign("loginid", loginid);
		O_view.gSess().clearSessionMenu();
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};