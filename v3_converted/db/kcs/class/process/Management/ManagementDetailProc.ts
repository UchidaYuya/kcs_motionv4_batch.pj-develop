//
//全て一覧詳細画面Proc
//
//更新履歴：<br>
//2008/04/04 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/04
//@filesource
//@uses ManagementDetailProcBase
//@uses ManagementDetailView
//
//
//error_reporting(E_ALL|E_STRICT);
//
//全て一覧詳細画面Proc
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/04
//@uses ManagementDetailProcBase
//@uses ManagementDetailView
//

require("process/Management/ManagementDetailProcBase.php");

require("view/Management/ManagementDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/04
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/04
//
//@access protected
//@return void
//@uses ManagementDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/04
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//ログインチェックだけして各種別の詳細画面にリダイレクトする<br>
//
//@author houshiyama
//@since 2008/04/04
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/04
//
//@access public
//@return void
//
class ManagementDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return undefined;
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};