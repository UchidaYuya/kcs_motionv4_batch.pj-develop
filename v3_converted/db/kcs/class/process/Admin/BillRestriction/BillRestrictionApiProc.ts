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

require("view/Admin/BillRestriction/BillRestrictionApiView.php");

require("model/Admin/BillRestriction/BillRestrictionApiModel.php");

require("model/FuncModel.php");

require("BillUtil.php");

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
class BillRestrictionApiProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new BillRestrictionApiView();
	}

	checkFunc() {
		var O_func = new FuncModel();
		if (!(undefined !== _SESSION.admin_shopid)) return false;
		if (!(undefined !== _SESSION.admin_memid)) return false;
		var funcs = O_func.getAdminFuncs(_SESSION.admin_shopid, _SESSION.admin_memid);

		if (!(-1 !== funcs.indexOf(20))) {
			return false;
		}

		return true;
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//POSTされたデータを取得
	//エラーなら400で終わり
	//設定しなおし
	{
		var O_view = this.get_View();
		var O_model = new BillRestrictionApiModel();

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

		if (!O_model.isGroupCheck(_SESSION.admin_groupid, param.pactid)) {
			header("HTTP", true, 400);
			echo("\u3053\u306E\u7BA1\u7406\u8005\u3067\u306F\u3001\u3053\u306E\u4F1A\u793E\u306E\u64CD\u4F5C\u304C\u3067\u304D\u307E\u305B\u3093(groupid\u4E0D\u4E00\u81F4)");
			throw die();
		}

		var O_bill = new BillUtil();

		switch (param.mode) {
			case 1:
				if (O_bill.insertBillRestriction(param.pactid, param.type, param.year, param.month, date("Y-m-d H:i:s"), true)) //請求公開timeを返す
					{
						var res = Array();
						res.br_time = mktime(0, 0, 0, param.month + 1, 0, param.year);
						res.br = date("Y-m-d H:i:s", res.br_time);
						echo(JSON.stringify(res));
					} else //エラーです・・
					{
						res = Array();
						res.error = "insert_error";
						header("HTTP", true, 400);
						echo(JSON.stringify(res));
					}

				break;

			case 2:
				O_bill.deleteBillRestriction(param.pactid, param.type);
				res = Array();
				res.br_time = 0;
				echo(JSON.stringify(res));
				break;

			default:
				res = Array();
				res.error = "invalid mode";
				header("HTTP", true, 400);
				echo(JSON.stringify(res));
				break;
		}
	}

	getParam() //mode・・
	//1:insert
	//2:delete
	//0,1以外はエラー
	{
		var res = Array();
		res.error = true;
		res.message = "";
		if (!(undefined !== _POST.type)) return res;
		if (!(undefined !== _POST.mode)) return res;
		if (!(undefined !== _POST.pactid)) return res;

		if (_POST.mode == 1) {
			if (!(undefined !== _POST.year)) return res;
			if (!(undefined !== _POST.month)) return res;
			res.year = _POST.year;
			res.month = _POST.month;
		}

		res.mode = _POST.mode;
		res.type = _POST.type;
		res.pactid = _POST.pactid;
		res.data = Array();

		if (!(-1 !== [1, 2].indexOf(res.mode))) {
			return res;
		}

		res.error = false;
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};