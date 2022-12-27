//
//ダウンロードパターン選択画面プロセス
//
//更新履歴：<br>
//2009/02/23 宝子山浩平 作成
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/23
//@filesource
//@uses ProcessBaseHtml
//@uses VariousDLMenuView
//@uses VariousDLModel
//@uses MakePankuzuLink
//@uses MtUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ダウンロードパターン選択画面プロセス
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/23
//@uses ProcessBaseHtml
//@uses VariousDLMenuView
//@uses VariousDLModel
//@uses MakePankuzuLink
//@uses MtUtil
//

require("process/ProcessBaseHtml.php");

require("view/VariousDL/VariousDLMenuView.php");

require("model/VariousDL/VariousDLModel.php");

require("view/MakePankuzuLink.php");

require("MtUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/23
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/18
//
//@access protected
//@return void
//@uses VariousDLMenuView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses VariousDLMenuModel
//
//
//プロセス処理の実質的なメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//表示に必要なものを格納する配列取得 <br>
//パンくずリンク作成 <br>
//Javascriptの生成 <br>
//ツリー作成 <br>
//パターン選択フォームの作成 <br>
//パターン選択フォームルールの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//フォームの入力チェック <br>
//（フォームにエラーが無い） <br>
//ダウンロード <br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/02/20
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
class VariousDLMenuProc extends ProcessBaseHtml {
	static PUB = "/VariousDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new VariousDLMenuView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new VariousDLModel(H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//Javascriptの生成
	//対象年月からテーブル名決定
	//ツリー作成
	//パターン選択フォームの作成
	//パターン選択フォームルールの作成
	//フォームのデフォルト値をセット
	//DBが必要な入力のエラーチェック
	//フォームにエラーが無い
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = MakePankuzuLink.makePankuzuLinkHTMLEng(O_view.makePankuzuLinkHash(H_sess.mode));
		} else {
			H_view.pankuzu_link = MakePankuzuLink.makePankuzuLinkHTML(O_view.makePankuzuLinkHash(H_sess.mode));
		}

		H_view.js = O_view.getHeaderJS();
		O_model.setTableName(H_sess.post.trg_month);
		H_view.H_tree = O_model.getTreePostJS();
		H_view.js += H_view.H_tree.js;
		O_view.makePatternSelectForm(O_model, H_sess);
		O_view.makePatternSelectRule(O_model, H_sess);
		H_view.O_FormUtil.setDefaultsWrapper(H_sess.post);
		O_view.checkInputError(O_model, H_sess.post);

		if (undefined !== H_sess.post.download == true && H_view.O_FormUtil.validateWrapper() == true) {
			O_view.locationDownload(H_sess);
		}

		O_view.displaySmarty(H_sess);
	}

	__destruct() {
		super.__destruct();
	}

};