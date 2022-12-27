//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//
header("Contet-Type: application/json; charset=UTF-8");

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("model/healthcare/GetStepModel.php");

require("view/healthcare/GetStepView.php");

//
//__construct
//
//@author web
//@since 2016/04/06
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class GetStepProc extends ProcessBaseHtml {
	static PUB = "/Const";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new GetStepView();
	}

	get_Model() {
		return new GetStepModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//$H_g_sess = $O_view->getGlobalSession();
	//modelオブジェクトの生成
	//ログインチェック
	//引数として渡されたjsonを受取る
	//NULLならエラー
	{
		var O_view = this.get_View();
		var O_model = this.get_Model();
		O_view.startCheck();
		var param = O_view.getParam();

		if (is_null(param)) {
			var res = O_view.makeError("json\u306E\u66F8\u5F0F\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059", -32700, undefined);
			echo(JSON.stringify(res));
			throw die();
		}

		var message = O_view.checkParam(param);

		if (message != "") {
			res = O_view.makeError(message, -32600, undefined);
			echo(JSON.stringify(res));
			throw die();
		}

		if (param.execno != "1001") {
			res = O_view.makeError("Execno not found", -32601, undefined);
			echo(JSON.stringify(res));
			throw die();
		}

		res = O_model.getStep(param.params.datefrom, param.params.dateto, param.params.user_list, param.id);
		echo(JSON.stringify(res));
	}

	__destruct() {
		super.__destruct();
	}

};