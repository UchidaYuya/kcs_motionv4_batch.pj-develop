//
//グラフ基底Procクラス
//
//更新履歴：<br>
//2008/12/18 宝子山浩平 作成
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@filesource
//@uses ProcessBaseHtml
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//グラフ基底Procクラス
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@uses ProcessBaseHtml
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//

require("process/ProcessBaseHtml.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/12/18
//
//@access protected
//@return void
//@uses RecomUserGraphView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses RecomUserGraphModel
//
//
//プロセス処理のメイン<br>
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
class GraphProcBase extends ProcessBaseHtml {
	static PUB = "/Graph";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {}

	get_Model(H_g_sess: {} | any[], O_manage) {}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//Smartyに渡す一覧データ取得
	//表示ボタンフォーム作成
	//フォームのデフォルト値をセット
	//Javascriptの生成
	//パンくずリンクの生成
	//フォームのデフォルト値をセット
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();
		var H_data = O_model.getList(H_sess);
		O_view.makeViewForm();
		H_view.O_FormUtil.setDefaultsWrapper(H_sess);
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = O_view.makePankuzuLink();
		H_view.O_FormUtil.setDefaultsWrapper(H_sess);
		O_view.displaySmarty(H_sess, H_data);
	}

	__destruct() {
		super.__destruct();
	}

};