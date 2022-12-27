//error_reporting(E_ALL|E_STRICT);
//
//AdminOrderMenuProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2018/09/11
//

require("MtSession.php");

require("process/ProcessBaseHtml.php");

require("model/Admin/Order/AdminOrderMenuModel.php");

require("view/Admin/Order/AdminOrderMenuView.php");

require("model/PactModel.php");

require("model/FuncModel.php");

//
//
//
//__construct
//
//@author web
//@since 2018/09/11
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author web
//@since 2018/09/11
//
//@access protected
//@return void
//
//
//get_Model
//
//@author web
//@since 2018/09/11
//
//@access protected
//@return void
//
//
//checkFunc
//権限があるかチェックする
//@author web
//@since 2018/09/27
//
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2018/09/11
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
class AdminOrderMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new AdminOrderMenuView();
	}

	get_Model() {
		return new AdminOrderMenuModel();
	}

	checkFunc() {
		var O_func = new FuncModel();
		if (!(undefined !== _SESSION.admin_shopid)) return false;
		if (!(undefined !== _SESSION.admin_memid)) return false;
		var funcs = O_func.getAdminFuncs(_SESSION.admin_shopid, _SESSION.admin_memid);

		if (!(-1 !== funcs.indexOf(19))) {
			return false;
		}

		return true;
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//$O_model = $this->get_Model();
	//権限チェック
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		this.checkFunc();
		var O_pact = new PactModel();

		if (!this.checkFunc()) {
			this.errorOut(6, "\u305D\u306E\u4ED6\u5185\u5BB9\u8A2D\u5B9A\u6A29\u9650\u304C\u7121\u3044", 0, "/index_admin.php");
		}

		var pacts = Array();
		var sess = O_view.getLocalSession();
		var search = sess.post;
		O_view.makeForm();
		O_view.makeFormLimit();

		if (_SESSION.admin_groupid != 0) {
			search.groupid = _SESSION.admin_groupid;
		}

		pacts = O_pact.getPactSerach(sess.page, sess.view.limit, Array(), search);
		var pcnt = !pacts ? 0 : pacts[0].pcnt;
		O_view.displaySmarty(pacts, pcnt, sess.page, sess.view.limit);
	}

	__destruct() {
		super.__destruct();
	}

};