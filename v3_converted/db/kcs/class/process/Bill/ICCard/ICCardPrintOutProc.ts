//
//交通費申請画面Proccess
//
//更新履歴：<br>
//2010/04/27 宮澤龍彦 作成
//
//@package ICCard
//@subpackage Proccess
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//交通費申請画面Proccess
//
//@package ICCard
//@subpackage Proccess
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Bill/ICCard/ICCardPrintOutModel.php");

require("view/Bill/ICCard/ICCardPrintOutView.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author miyazawa
//@since 2010/04/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2010/04/27
//
//@access protected
//@return void
//@uses ManagementDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2010/04/27
//
//@author miyazawa
//@since 2010/04/27
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//表示するデータ取得 <br>
//Smartyによる表示 <br>
//
//@author miyazawa
//@since 2010/04/27
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ICCardPrintOutProc extends ProcessBaseHtml {
	static PUB = "/Bill/ICCard";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ICCardPrintOutView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new ICCardPrintOutModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//$O_view->checkParamError( $H_sess, $H_g_sess );
	//権限一覧取得
	//表示するデータ取得
	//●とりあえずFelicaのみ
	//$H_hist = $O_model->getUseHistory( $H_g_sess["pactid"], $H_g_sess["userid"], $H_sess);
	//20110114iga
	//データの整形
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();
		H_sess.cardcoid = 1;
		var H_hist = O_model.getUseHistory(H_g_sess.pactid, O_view.getViewUserId(), H_sess);
		var H_modified = O_view.modHistory(H_hist);
		O_view.displaySmarty(H_g_sess, H_modified, H_sess, O_model.getViewUserInfo(H_g_sess.pactid, O_view.getViewUserId(), H_sess));
	}

	__destruct() {
		super.__destruct();
	}

};