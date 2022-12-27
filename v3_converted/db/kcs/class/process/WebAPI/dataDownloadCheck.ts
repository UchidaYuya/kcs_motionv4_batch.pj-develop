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

require("view/WebAPI/findUserView.php");

//const PUB = "/Const";
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
//@since 2020/10/28
//
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2020/10/28
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2020/10/28
//
//@access public
//@return void
//
class DataDownloadCheck extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new FindUserView();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//ログインチェック
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		O_view.startCheck();

		if (undefined !== _GET.reset) //初期化する
			{
				_SESSION.dataDownloadCheck = 0;
				echo("ok");
				throw die();
			} else if (undefined !== _GET.check) //現在の状態を返す
			{
				if (undefined !== _SESSION.dataDownloadCheck) {
					echo(_SESSION.dataDownloadCheck);
				} else //セッションが無い場合は、初期化して返す
					{
						_SESSION.dataDownloadCheck = 0;
						echo(_SESSION.dataDownloadCheck);
					}

				throw die();
			}

		echo("ng");
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};