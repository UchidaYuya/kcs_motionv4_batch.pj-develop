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

require("model/Admin/Order/AdminOrderMiscTypeModel.php");

require("view/Admin/Order/AdminOrderMiscTypeView.php");

require("model/PactModel.php");

require("model/FuncModel.php");

require("model/MiscModel.php");

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
class AdminOrderMiscTypeProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.m_mode = mode;
	}

	get_View() {
		return new AdminOrderMiscTypeView();
	}

	get_Model() {
		return new AdminOrderMiscTypeModel();
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
	//権限チェック
	//設定可能なキャリアを取得し、フォームを作成する
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();

		if (!this.checkFunc()) {
			this.errorOut(6, "\u305D\u306E\u4ED6\u5185\u5BB9\u8A2D\u5B9A\u6A29\u9650\u304C\u7121\u3044", 0, "/index_admin.php");
		}

		var O_model = this.get_Model();
		var H_sess = O_view.getLocalSession();

		if (H_sess.pactid == 0) {
			var pact = Array();
			pact.groupid = H_sess.groupid;
			pact.pactid = 0;
			pact.compname = "\u521D\u671F\u5024";
		} else //$compname = $O_pact->getCompname( $H_sess["pactid"] );
			{
				var O_pact = new PactModel();
				pact = O_pact.getPactSerach(1, 1, Array(), {
					pactid: H_sess.pactid
				});
				pact = pact[0];
			}

		var O_misc = new MiscModel();
		var carriers = O_misc.getConfigurableCarrierId();
		O_view.makeForm(pact.groupid, carriers);
		O_view.displaySmarty(pact.groupid, pact.compname);
	}

	__destruct() {
		super.__destruct();
	}

};