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

require("model/WebAPI/findUserModel.php");

require("view/WebAPI/findUserView.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
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
class FindUserProc extends ProcessBaseHtml {
	static PUB = "/Const";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new FindUserView();
	}

	get_Model(H_g_sess) {
		return new FindUserModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var res = O_model.findUser(H_g_sess.pactid, H_g_sess.current_postid, _POST.loginid, _POST.username);

		if (!res) //$res = array();
			{
				echo("none");
				throw die();
			}

		echo(JSON.stringify(res));
	}

	__destruct() {
		super.__destruct();
	}

};