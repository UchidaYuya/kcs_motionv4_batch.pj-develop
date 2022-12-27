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

require("view/Admin/Order/AdminOrderMiscTypeView.php");

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
//更新でーた
//@author web
//@since 2018/09/20
//
//@access private
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
class AdminOrderMiscTypeSaveProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new AdminOrderMiscTypeView();
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
	//POSTされたデータを取得
	//エラーなら400で終わり
	//エラーなら400で終わり
	{
		var O_view = this.get_View();

		if (!this.checkFunc()) {
			header("HTTP", true, 400);
			echo("\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093");
			throw die();
		}

		O_view.startCheck();
		var param = this.getParam();

		if (param.error) {
			header("HTTP", true, 400);
			echo("\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u30A8\u30E9\u30FC");
			throw die();
		}

		var misc = new MiscModel();
		var res = misc.updateRelation(param.groupid, param.pactid, param.carid, param.data, param.is_use_unique);

		if (!res.result) {
			header("HTTP", true, 400);
			echo(res.message);
			throw die();
		}
	}

	getParam() //0,1以外はエラー
	{
		var res = Array();
		res.error = true;
		res.message = "";
		if (!(undefined !== _POST.groupid)) return res;
		if (!(undefined !== _POST.pactid)) return res;
		if (!(undefined !== _POST.carid)) return res;
		if (!(undefined !== _POST.data)) return res;
		res.groupid = _POST.groupid;
		res.pactid = _POST.pactid;
		res.carid = _POST.carid;
		res.is_use_unique = undefined !== _POST.is_use_unique ? _POST.is_use_unique : undefined;
		res.data = Array();

		if (!(-1 !== [0, 1].indexOf(res.is_use_unique))) {
			return res;
		}

		var data = str_replace("\\\"", "", _POST.data);
		data = JSON.parse(data);
		var sort = 1;

		for (var key in data) {
			var value = data[key];
			var temp = Array();
			temp.miscid = value;
			temp.sort = sort;
			res.data.push(temp);
			sort++;
		}

		res.error = false;
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};