//
//利用者グラフ画像表示Procクラス
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
//利用者グラフ画像表示Procクラス
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
class GraphChartProcBase extends ProcessBaseHtml {
	static PUB = "/Recom";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {}

	get_Model(H_g_sess: {} | any[], O_manage) {}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//パラメータのエラーチェック
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//セッション情報取得（呼び出し元セッション）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//データ取得
	//グラフによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		O_view.checkCGIParam();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		var H_p_sess = O_view.getParentSession();
		O_view.checkParamError(H_p_sess, H_g_sess);
		var H_view = O_view.get_View();
		var H_data = O_model.getList(H_p_sess);
		O_view.displayChart(H_sess, H_data);
	}

	__destruct() {
		super.__destruct();
	}

};