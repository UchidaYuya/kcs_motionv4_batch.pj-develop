//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQListProcBase
//@uses UserFAQModel
//@uses MenuModel
//@uses FAQListView
//@uses MtAuthority
//@uses MtSession
//@users MtPostUtil
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問い合わせ履歴一覧
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("process/FAQ/FAQListProcBase.php");

require("model/FAQ/UserFAQModel.php");

require("model/Menu/MenuModel.php");

require("view/FAQ/FAQListView.php");

require("MtAuthority.php");

require("MtPostUtil.php");

require("MtSession.php");

//
//O_menu
//
//@var mixed
//@access private
//
//
//O_post
//
//@var mixed
//@access private
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//getView
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//getModel
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//addNewClass
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//検索条件の引数を設定する
//
//@author ishizaki
//@since 2008/10/16
//
//@param mixed $H_param
//@access protected
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class FAQListProc extends FAQListProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u5C65\u6B74"
		};
		this.O_view = new FAQListView(this.H_param);
	}

	getModel() {
		this.O_model = new UserFAQModel();
	}

	addNewClass() {
		this.O_auth = MtAuthority.singleton(this.O_view.gSess().pactid);
		this.O_menu = new MenuModel();
		this.O_post = new MtPostUtil();
	}

	setListMode() {
		this.H_param.groupid = this.O_view.gSess().groupid;
		this.H_param.pactid = this.O_view.gSess().pactid;
		this.H_param.postid = this.O_view.gSess().postid;
		this.H_param.userid = this.O_view.gSess().userid;
		this.H_param.secondroot = this.O_auth.chkPactFuncIni("fnc_not_view_root");

		if (true == this.H_param.secondroot) {
			this.H_param.rootpostid = this.O_post.getTargetLevelPostid(this.O_view.gSess().postid, 1);
		} else {
			this.H_param.rootpostid = this.O_post.getTargetLevelPostid(this.O_view.gSess().postid, 0);
		}

		this.H_param.su = this.O_view.gSess().su;
		var A_auth = this.O_view.getAuthUser();
		var temp = A_auth.length;

		if (0 < temp) {
			A_auth = this.O_model.getFncidExcludePathNull(A_auth);
			temp = A_auth.length;
		}

		for (var i = 0; i < temp; i++) {
			if (true == (-1 !== this.getSetting().A_exclude_fnc.indexOf(String(A_auth[i])))) {
				delete A_auth[i];
			}
		}

		var A_order = this.filteringFunctionOrder(this.O_menu.getOrderableCarrier(this.O_view.gSess().pactid, this.O_view.gSess().postid), false);
		this.H_param.fncidlist = A_auth;

		if (true == Array.isArray(A_order)) {
			this.H_param.fncidlist = array_merge(this.H_param.fncidlist, A_order);
		}

		this.H_param.fncidlist = array_merge(this.H_param.fncidlist, [120, 0]);
		this.O_view.setAssign("fncidlist", this.H_param.fncidlist);
		this.H_param.fncidlist.sort();
		this.H_param.fncnamelist = this.O_model.setFncName(this.H_param.fncidlist);
		this.O_view.setAssign("fncnamelist", this.H_param.fncnamelist);
		var O_sess = MtSession.singleton();
		var S_POST = O_sess.getSelf("POST");
		var H_post = this.O_view.getPost();

		if (false != Array.isArray(H_post)) {
			this.H_param.search = H_post;
		} else if (undefined !== S_POST) {
			this.H_param.search = S_POST;
		}
	}

	__destruct() {
		super.__destruct();
	}

};