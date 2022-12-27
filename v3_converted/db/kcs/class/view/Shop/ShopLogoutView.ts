//
//ShopLogoutViewクラス
//
//@uses ViewSmarty
//@uses GroupModel
//@package Shop
//@filesource
//@author nakanita
//@since 2008/11/18
//
//
//error_reporting(E_ALL);
//require_once("MtSession.php");
//独自ドメイン対応 20090811miya
//
//ShopLogoutViewクラス
//
//@uses ViewSmarty
//@package Shop
//@author nakanita
//@since 2008/11/18
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtShopLogin.php");

require("model/GroupModel.php");

require("MtSetting.php");

//
//__construct
//
//@author nakanita
//@since 2008/11/18
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author nakanita
//@since 2008/11/18
//
//@access public
//@return void
//
//
//__destruct
//
//@author nakanita
//@since 2008/11/18
//
//@access public
//@return void
//
class ShopLogoutView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
	}

	doLogout() //独自ドメイン対応 20090811miya
	{
		GLOBALS.GROUPID = this.gSess().groupid;
		var O_group = new GroupModel();
		this.groupname = O_group.getGroupName(this.gSess().groupid);
		this.O_Conf = MtSetting.singleton();
		this.O_Conf.loadConfig("group");
		var O_login = MtShopLogin.singleton();
		O_login.logout();
	}

	displaySmarty() //独自ドメイン対応 20090811miya
	{
		if (true == this.O_Conf.existsKey("groupid" + GLOBALS.GROUPID + "_is_original_domain") && true == this.O_Conf["groupid" + GLOBALS.GROUPID + "_is_original_domain"]) {
			this.get_Smarty().assign("groupname", "");
		} else {
			this.get_Smarty().assign("groupname", "/" + this.groupname);
		}

		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};