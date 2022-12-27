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

require("view/ViewSmarty.php");

require("model/MiscModel.php");

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
//getParam
//
//@author web
//@since 2018/09/19
//
//@access public
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
class AdminOrderMiscTypeSwitchProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new ViewSmarty({
			site: ViewBaseHtml.SITE_ADMIN
		});
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
	{
		var O_view = this.get_View();

		if (!this.checkFunc()) {
			header("HTTP", true, 400);
			echo("\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093");
			throw die();
		}

		O_view.startCheck();
		var misc = new MiscModel();
		var param = this.getParam();

		if (param.error) {
			header("HTTP", true, 400);
			echo(param.message);
			throw die();
		}

		if (misc.isMiscTypeUnique(param.groupid, param.pactid, param.carid)) {
			res.is_unique = 1;
		} else {
			res.is_unique = 0;
		}

		res.groupid = _GET.groupid;
		res.pactid = _GET.pactid;
		res.carid = _GET.carid;
		echo(JSON.stringify(res));
	}

	getParam() {
		var res = Array();
		res.error = true;
		if (!(undefined !== _GET.groupid)) return res;
		if (!(undefined !== _GET.pactid)) return res;
		if (!(undefined !== _GET.carid)) return res;

		if (_SESSION.admin_groupid !== 0) {
			if (_SESSION.admin_groupid !== _GET.groupid) {
				res.message = "\u81EA\u5206\u306E\u30B0\u30EB\u30FC\u30D7\u4EE5\u5916\u306F\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093";
			}
		}

		res.groupid = _GET.groupid;
		res.pactid = _GET.pactid;
		res.carid = _GET.carid;
		res.error = false;
		res.meesage = "";
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};