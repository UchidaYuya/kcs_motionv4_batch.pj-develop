//
//運送ID新規登録Process
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementAddProcBase
//@uses TransitAddView
//@uses TransitAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID新規登録Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementAddProcBase
//@uses TransitAddView
//@uses TransitAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Document/DocumentAddModel.php");

require("view/Management/Document/DocumentAddView.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//@uses TransitAddView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TransitAddModel
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
//ツリー作成 <br>
//Javascript作成 <br>
//データの取得を兼ねたパラメータチェック <br>
//新規登録フォームの作成 <br>
//新規登録フォームルールの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//DBが必要なデータ、権限のチェック <br>
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
//@since 2010/02/19
//
//@access public
//@return void
//
class DocumentAddProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new DocumentAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new DocumentAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//クオートの自動的エスケープ(magic quotes gpc)を無効にする処理を追加 2010/08/16 maeda
	//権限一覧取得
	//パンくずリンクの生成
	//ツリー作成
	//Javascriptの生成
	//新規登録フォームの作成
	//新規登録フォームルールの作成
	//データ取得の取得を兼ねたパラメータチェック
	//フォームのデフォルト値をセット
	//DBが必要な入力のエラーチェック
	//DBが必要なデータ、権限のチェック
	//ファイルアップロードについて
	//Smartyによる表示
	{
		var warning = "";
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

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		H_view.H_tree = O_model.getAddTreeJS(H_g_sess.postid);
		H_view.js = H_view.H_tree.js;
		H_view.js += O_view.getHeaderJS();
		O_view.makeAddForm(O_manage, O_model, H_sess);
		O_view.makeAddRule(O_manage, O_model, H_sess);
		O_view.getInfoParamCheck(O_model, H_sess);
		H_view.O_AddFormUtil.setDefaultsWrapper(H_sess.SELF.post);
		O_model.checkInputError(H_sess.SELF.post, H_view.O_AddFormUtil);
		O_model.checkDataAuth(H_view, H_sess, H_g_sess);

		if (_FILES.file.name != "") //ファイルのアップロード
			//エラーチェック
			{
				var uperr = O_view.uploadFile(H_g_sess.pactid, H_g_sess.userid);

				if (!uperr) //アップロード情報をセッションに書いたため、セッション情報の取り直しをします。
					//存在しないpostIDの取得を行う
					//警告として登録する
					{
						H_sess = O_view.getLocalSession();
						var notexistUserPostId = O_model.getNotExistsUserPostId(H_sess.SELF.upload.up_file, H_sess.SELF.post.use_header == 1 ? true : false);

						if (!!notexistUserPostId) {
							warning.file += "<font color='red'>";
							warning.file += "<br><br>\u4EE5\u4E0B\u306E\u90E8\u7F72\u306F\u672A\u767B\u9332\u3067\u3059\u3002<br>";
							warning.file += notexistUserPostId.join(",") + "<br>";
							warning.file += "</font>";
						}
					} else //拡張子やサイズエラー
					{
						var msg = "<br><font color='red'>";
						msg += uperr.join("<br>") + "<br>";
						msg += "</font>";
						H_view.O_AddFormUtil.setElementErrorWrapper("file", msg);
					}
			}

		if (H_view.O_AddFormUtil.validateWrapper() == true) {
			if (H_sess.SELF.post.addsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.addsubmit == O_view.RecName) //CSRF
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.uniqueid);
					var A_sql = O_model.makeAddSQL(H_sess);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endAddView(H_sess);
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess, A_auth, warning);
	}

	__destruct() {
		super.__destruct();
	}

};