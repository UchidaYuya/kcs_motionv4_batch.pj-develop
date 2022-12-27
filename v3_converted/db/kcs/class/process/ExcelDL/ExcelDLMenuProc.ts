//
//エクセルダウンロードProccess
//
//更新履歴：<br>
//2008/06/23 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/23
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//エクセルダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/23
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("view/ExcelDL/ExcelDLMenuView.php");

require("model/ExcelDL/ExcelDLMenuModel.php");

require("MtUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/23
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/06/23
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/06/23
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス実行のメイン
//
//@author houshiyama
//@since 2008/06/24
//
//@param array $H_param
//@access protected
//@return void
//
class ExcelDLMenuProc extends ProcessBaseHtml {
	static PUB = "/ExcelDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ExcelDLMenuView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new ExcelDLMenuModel(H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//不要セッション削除
	//表示に必要なものを格納する配列を取得
	//Javascriptの生成
	//ツリー作成
	//パンくずリンクの生成
	//管理情報共通フォームの作成
	//新規登録フォームルールの作成
	//フォームのデフォルト値をセット
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_util = new MtUtil();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		O_view.clearUnderSession();
		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();
		H_view.H_tree = O_model.getTreeJS(H_sess);
		H_view.js += H_view.H_tree.js;
		H_view.pankuzu_link = O_view.makePankuzuLink();
		O_view.makeForm(O_util, O_model);
		O_view.makeRule();
		H_view.O_FormUtil.setDefaultsWrapper(H_sess.SELF.post);
		O_view.displaySmarty(H_sess);
	}

};