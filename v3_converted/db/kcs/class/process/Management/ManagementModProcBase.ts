//
//管理情報変更Proccess基底
//
//更新履歴：<br>
//2008/03/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/20
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報変更Proccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/20
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/20
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/20
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/20
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
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
//パンくずリンク作成 <br>
//javascript作成 <br>
//変更対象のデータ取得 <br>
//データの取得を兼ねたパラメータチェック <br>
//変更フォームの作成 <br>
//変更フォームルールの作成 <br>
//フォームのデフォルト値をセット <br>
//キーカラムの変更があるかチェック <br>
//DBが必要なフォームの入力チェック <br>
//フォームの入力チェック <br>
//（フォームにエラーが無い） <br>
//請求があるかチェック <br>
//確認画面 <br>
//フォームをフリーズ <br>
//完了画面 <br>
//キーの変更あり
//delete-insertSQL文作成 <br>
//キーの変更なし
//updateSQL文作成 <br>
//management_log__tbへのSQL文作成 <br>
//インサート実行 <br>
//完了画面表示 <br>
//（フォームにエラーがある） <br>
//フォームをフリーズさせない（入力画面） <br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/03/20
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
//@since 2008/03/20
//
//@access public
//@return void
//
class ManagementModProcBase extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
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
	//パンくずリンクの生成
	//Javascriptの生成
	//変更対象のデータ取得
	//変更フォームの作成
	//変更フォームルールの作成
	//データ取得の取得を兼ねたパラメータチェック
	//フォームのデフォルト値をセット
	//キーの変更があるかチェック
	//DBが必要な入力のエラーチェック
	//フォームにエラーが無い
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();

		if (get_magic_quotes_gpc() == true && undefined !== H_sess.SELF.post == true) {
			{
				let _tmp_0 = H_sess.SELF.post;

				for (var key in _tmp_0) //日付のような配列要素はエスケープしない
				{
					var value = _tmp_0[key];

					if (Array.isArray(value) == false) {
						H_sess.SELF.post[key] = stripslashes(value);
					}
				}
			}
		}

		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		H_view.js = O_view.getHeaderJS();
		O_model.getManageInfo(H_sess);
		O_view.makeModForm(O_manage, O_model, H_sess);
		O_view.makeModRule(O_manage, O_model, H_sess);
		O_view.getInfoParamCheck(O_model, H_sess);
		H_view.O_ModFormUtil.setDefaultsWrapper(H_sess.SELF.post);
		var chgflg = O_view.checkModKeyCol(H_sess.SELF, O_manage);
		O_model.checkInputError(H_sess, H_view.O_ModFormUtil, chgflg);

		if (H_view.O_ModFormUtil.validateWrapper() == true) //請求があるかチェック
			//請求があるのにキーを変更したらエラー画面表示
			{
				var billflg = O_model.checkBillExist(H_sess);

				if (true == chgflg && true == billflg) {
					O_view.viewChgKeyError();
					throw die();
				}

				if (H_sess.SELF.post.modsubmit == O_view.NextName) //フォームをフリーズする
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.post.modsubmit == O_view.RecName) //CSRF
					//sql文を作成
					//DB更新成功
					{
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.SELF.post.uniqueid);

						if (true == chgflg) {
							var A_sql = O_model.makeDelInsertSQL(H_sess);
						} else {
							A_sql = O_model.makeModSQL(H_sess);
						}

						if (O_model.execDB(A_sql) == true) //セッション削除処理
							{
								O_view.endModView(H_sess);
								throw die();
							} else //エラー画面
							{
								this.errorOut(1, "SQL\u66F4\u65B0\u30EC\u30B3\u30FC\u30C9\u6570\u30A8\u30E9\u30FC", false, "./menu.php");
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