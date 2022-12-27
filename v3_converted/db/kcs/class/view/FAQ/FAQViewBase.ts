//
//お問い合わせ　一覧
//
//更新履歴：<br>
//2008/08/27	石崎公久	作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtSession
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
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtSession
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("MtAuthority.php");

//
//MySess
//
//@var mixed
//@access protected
//
//
//O_Auth
//
//@var mixed
//@access protected
//
//
//H_assign
//
//@var mixed
//@access protected
//
//
//Mode
//
//@var mixed
//@access protected
//
//
//Fncid
//
//@var mixed
//@access protected
//
//
//__construct
//
//
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//getAuthUser
//
//@author ishizaki
//@since 2008/08/27
//
//@access public
//@return void
//
//
//getAuthUser
//
//@author ishizaki
//@since 2008/08/27
//
//@access public
//@return void
//
//
//getMode
//
//@author ishizaki
//@since 2008/09/04
//
//@access public
//@return void
//
//
//getFuncid
//
//@author ishizaki
//@since 2008/09/04
//
//@access public
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//setNaviHTML
//
//@author ishizaki
//@since 2008/08/27
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/08/27
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/30
//
//@param string $err_str
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/10/19
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
class FAQViewBase extends ViewSmarty {
	constructor(H_param = undefined) {
		super(H_param);
		this.H_assign = Array();

		if (false == is_null(H_param.navi)) {
			this.setNaviHTML(H_param.navi);
		}

		if (1 == H_param.authtype) {
			this.O_Auth = MtAuthority.singleton(this.gSess().pactid);
		} else if (2 == H_param.authtype) {
			this.H_assign.title = H_param.navi[""];
		}

		this.H_assign.phpself = _SERVER.PHP_SELF;
		this.getSetting().loadConfig("faq");
		this.Mode = undefined;
		this.Fncid = undefined;
		this.MySess = this.getSetting().faq_sess;
	}

	getAuthUser(userid = undefined) {
		if (true == is_null(userid)) {
			if (false == this.gSess().userid) {
				return false;
			} else {
				userid = this.gSess().userid;
			}
		}

		var A_tmp = this.O_Auth.getUserFuncId(userid, "all");
		return A_tmp;
	}

	getAuthPact() {
		return this.O_Auth.getPactFuncid();
	}

	getMode() {
		return this.Mode;
	}

	getFncid() {
		return this.Fncid;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	setNaviHTML(H_navi) {
		switch (this.getSiteMode()) {
			case 1:
				this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
				this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
				break;

			case 2:
				this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
				this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
				this.H_assign.admin_fncname = H_navi[""];
				break;

			case 0:
			default:
				this.H_assign.page_path = MakePankuzuLink.makePankuzuLinkHTML(H_navi);
				break;
		}
	}

	getAuthObject() {
		return this.getAuth();
	}

	assignSmarty() {
		if (0 < this.H_assign.length) {
			{
				let _tmp_0 = this.H_assign;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					this.get_Smarty().assign(key, value);
				}
			}
		}
	}

	displaySmarty(err_str = "") {
		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayHTML() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};