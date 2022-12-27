//
//ダウンロードパターン登録画面プロセス
//
//更新履歴：<br>
//2009/02/17 宝子山浩平 作成
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/17
//@filesource
//@uses ProcessBaseHtml
//@uses PatternAddView
//@uses VariousDLModel
//@uses MakePankuzuLink
//@uses MtUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ダウンロードパターン登録画面プロセス
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/17
//@uses ProcessBaseHtml
//@uses PatternAddView
//@uses VariousDLModel
//@uses MakePankuzuLink
//@uses MtUtil
//

require("process/ProcessBaseHtml.php");

require("view/VariousDL/PatternAddView.php");

require("model/VariousDL/VariousDLModel.php");

require("view/MakePankuzuLink.php");

require("MtUtil.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2009/02/23
//
//@access protected
//@return void
//@uses PatternAddView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2009/02/23
//
//@param array $H_g_sess
//@access protected
//@return void
//@uses PatternAddModel
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
//Treeの生成 <br>
//パターンが選択された<br>
//変更の時はパターン情報取得<br>
//削除の時はパターン情報取得<br>
//完了画面表示 <br>
//登録フォームの作成 <br>
//登録フォームルールの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//フォームの入力チェック <br>
//（フォームにエラーが無い） <br>
//確認画面 <br>
//フォームをフリーズ <br>
//完了画面 <br>
//insertSQL文作成 <br>
//インサート実行 <br>
//完了画面表示 <br>
//（フォームにエラーがある） <br>
//フォームをフリーズさせない（入力画面） <br>
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
class PatternAddProc extends ProcessBaseHtml {
	static PUB = "/VariousDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new PatternAddView();
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
	//ツリー作成
	//パターンが選択された
	//登録フォームルールの作成
	//フォームのデフォルト値をセット
	//DBが必要な入力のエラーチェック
	//フォームにエラーが無い
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = MakePankuzuLink.makePankuzuLinkHTMLEng(O_view.makePankuzuLinkHash());
		} else {
			H_view.pankuzu_link = MakePankuzuLink.makePankuzuLinkHTML(O_view.makePankuzuLinkHash());
		}

		H_view.js = O_view.getHeaderJS();
		H_view.H_tree = O_model.getTreeJS(H_sess);
		H_view.js += H_view.H_tree.js;

		if (undefined !== H_sess.post.buttonName == true) //パターン変更
			{
				if (H_sess.post.buttonName == "change") {
					O_view.setSelectPattern(O_model, H_sess);
				} else if (H_sess.post.buttonName == "delete") //CSRF
					//削除完了
					{
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.post.uniqueid);
						var res = O_model.deleteSelectPattern(H_sess.post.pattern);

						if (res == true) //完了画面表示
							{
								O_view.endPatternDeleteView();
								throw die();
							} else //エラー画面
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
								throw die();
							}
					}
			}

		O_view.makePatternAddForm(O_model, H_sess);
		O_view.makePatternAddRule(H_sess);
		H_view.O_FormUtil.setDefaultsWrapper(H_sess.post);
		O_view.checkInputError(O_model, H_sess.post);

		if (H_view.O_FormUtil.validateWrapper() == true && undefined !== H_sess.post.addsubmit == true) {
			if (H_sess.post.addsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.post.addsubmit == O_view.RecName) //CSRF
				//SQL文を作成しDB更新成功
				{
					O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.post.uniqueid);

					if (O_model.doAddDLPatternSQL(H_sess.post, O_view.H_Element) == true) //完了画面表示
						{
							O_view.endPatternAddView();
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
							throw die();
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess);
	}

	__destruct() {
		super.__destruct();
	}

};