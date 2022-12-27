//
//ユーザ設定画面Proccess
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//2009/9/8 maeda 英語化対応
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//@uses ManagementPropertyView
//@uses ManagementPropertyModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ユーザ設定画面Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/02/20
//@uses ProcessBaseHtml
//@uses ManagementUtil
//@uses ManagementPropertyView
//@uses ManagementPropertyModel
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("model/Management/ManagementPropertyModel.php");

require("view/Management/ManagementPropertyView.php");

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
//@since 2008/03/18
//
//@access protected
//@return void
//@uses ManagementPropertyView
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
//@uses ManagementPropertyModel
//
//
//プロセス処理の実質的なメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//表示に必要なものを格納する配列取得 <br>
//Smartyに渡すデータ取得 <br>
//パンくずリンク作成 <br>
//設定フォームの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//フォームの入力チェック <br>
//（フォームにエラーが無い） <br>
//確認画面 <br>
//フォームをフリーズ <br>
//完了画面 <br>
//insertSQL文作成 <br>
//management_log__tbへのSQL文作成 <br>
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
//@uses ManagementUtil
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
class ManagementPropertyProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementPropertyView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementPropertyModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//クオートの自動的エスケープ(magic quotes gpc)を無効にする処理を追加 2010/08/13 maeda
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//Smartyに渡すデータ取得
	//表示言語設定
	//設定フォームの作成
	//ルールの追加
	//フォームのデフォルト値をセット
	//$H_view["O_PropertyFormUtil"]->setDefaultsWrapper( $H_sess["SELF"]["post"] );
	//フォームにエラーが無い
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();

		if (get_magic_quotes_gpc() == true && undefined !== H_sess.SELF.post == true) {
			{
				let _tmp_0 = H_sess.SELF.post;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					H_sess.SELF.post[key] = stripslashes(value);
				}
			}
		}

		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni(H_g_sess);
		var H_view = O_view.get_View();
		O_model.getProperty(H_sess);

		if ("ENG" == _SESSION.language) //パンくずリンクの生成
			{
				H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash());
			} else //パンくずリンクの生成
			{
				H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
			}

		O_view.makePropertyForm(O_model, H_sess);
		O_view.makePropertyRule(H_sess);
		var H_def = O_model.makeDefaultForm(H_sess.SELF.post);
		H_view.O_PropertyFormUtil.setDefaultsWrapper(H_def.reldata);
		H_view.O_PropertyFormUtil.setDefaultsWrapper(H_def.ordata);
		H_view.O_PropertyFormUtil.setDefaultsWrapper(H_def.required);

		if (H_view.O_PropertyFormUtil.validateWrapper() == true && undefined !== H_sess.SELF.post.addsubmit == true) //表示言語設定
			{
				if ("ENG" == _SESSION.language) {
					var nextname = ManagementPropertyView.NEXTNAME_ENG;
					var recname = ManagementPropertyView.RECNAME_ENG;
				} else {
					nextname = ManagementPropertyView.NEXTNAME;
					recname = ManagementPropertyView.RECNAME;
				}

				if (H_sess.SELF.post.addsubmit == nextname) //フォームをフリーズする
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.post.addsubmit == recname) //CSRF
					//SQL文を作成しDB更新成功
					{
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.SELF.post.uniqueid);

						if (O_model.doAddPropertySQL(H_g_sess, H_sess.SELF.post) == true) //セッション削除処理
							{
								O_view.endPropertyView();
								throw die();
							} else //表示言語設定
							{
								if ("ENG" == _SESSION.language) //エラー画面
									{
										this.errorOut(1, "SQL ERROR", false, "./menu.php");
									} else //エラー画面
									{
										this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
									}

								throw die();
							}
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess, A_auth, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};