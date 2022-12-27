//
//お問い合わせ　一覧
//
//更新履歴：<br>
//2008/08/27	石崎公久	作成
//
//@uses FAQViewBase
//@package FAQ
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//お問い合わせ　一覧
//
//@uses FAQViewBase
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("view/FAQ/FAQViewBase.php");

//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_param
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class ShopFAQMenuView extends FAQViewBase {
	constructor(H_param = undefined) {
		super(H_param);
	}

	checkCGIParam() {
		if (true == (undefined !== _GET.fncid)) {
			this.gSess().setPub(this.MySess, {
				fncid: _GET.fncid
			});
			this.gSess().setSelf("Mode", "showfaqlist");
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var S_pub = this.gSess().getPub(this.MySess);

		if (false == is_null(S_pub.fncid) && false == is_null(this.gSess().getSelf("Mode"))) {
			this.Fncid = S_pub.fncid;
			this.Mode = this.gSess().getSelf("Mode");
		}

		this.gSess().clearSessionMenu();
		this.gSess().setPub(this.MySess, S_pub);
		this.gSess().setSelf("Mode", this.Mode);
	}

	displayHTML() {
		this.assignSmarty();
		this.get_Smarty().assign("Mode", this.Mode);
		this.get_Smarty().assign("php_self", _SERVER.php_self);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};