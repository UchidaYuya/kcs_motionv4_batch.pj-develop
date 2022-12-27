//
//運送管理情報一覧Proccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementMenuProcBase
//@uses ManagementTransitMenuView
//@uses ManagementTransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementMenuProcBase
//@uses ManagementTransitMenuView
//@uses ManagementTransitMenuModel
//

require("process/Management/ManagementMenuProcBase.php");

require("view/Management/Document/ManagementDocumentMenuView.php");

require("model/Management/Document/ManagementDocumentMenuModel.php");

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
//@uses TransitMenuView
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
//@uses TransitMenuModel
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの取得 <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト取得 <br>
//ログインチェック <br>
//権限一覧取得 <br>
//自ページを表示できるかチェック <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//管理が唯一ならばそこにリダイレクトする<br>
//不要セッション削除 <br>
//表示に必要なものを格納する配列を取得<br>
//ツリーデータ取得 <br>
//Javascriptの生成<br>
//パンくずリンクの生成<br>
//年月バーの生成<br>
//ツリーの生成<br>
//権限下の部署一覧取得 <br>
//管理情報共通フォームのデフォルト値生成 <br>
//管理情報共通フォームの作成 <br>
//管理情報共通フォームルールの作成 <br>
//検索フォームの作成 <br>
//検索フォームルールの作成 <br>
//フォームのデフォルト値（入力値）をセット<br>
//フォームにエラーが無い時 <br>
//一覧データ取得 <br>
//ページリンクの生成<br>
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
class ManagementDocumentMenuProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementDocumentMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementDocumentMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//管理が唯一ならばそこにリダイレクトする
	//不要セッション削除
	//表示に必要なものを格納する配列を取得
	//Javascriptの生成
	//パンくずリンクの生成
	//年月バーの生成
	//ツリー作成
	//部署ID取得
	//ヘッダーフォームのデフォルト値作成
	//管理情報共通フォームの作成
	//部署が無かったらここで終了
	//ページリンクの生成
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		O_view.checkLocation(A_auth);
		O_view.clearUnderSession();
		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
			H_view.monthly_bar = O_manage.getDateTreeEng(H_sess[ManagementDocumentMenuProc.PUB].cym, 25);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
			H_view.monthly_bar = O_manage.getDateTree(H_sess[ManagementDocumentMenuProc.PUB].cym, 25);
		}

		H_view.H_tree = O_model.getTreeJS(H_sess[ManagementDocumentMenuProc.PUB]);
		H_view.js += H_view.H_tree.js;
		var A_post = O_model.getPostidList(H_sess[ManagementDocumentMenuProc.PUB].current_postid, H_sess[ManagementDocumentMenuProc.PUB].posttarget);
		var H_default = O_view.makeDefaultValue(H_sess);
		O_view.makeHeaderForm(O_manage);
		H_view.O_HeaderFormUtil.setDefaultsWrapper(H_default);

		if (true == !A_post) {
			O_view.displayError(H_sess, A_data, A_auth, O_manage);
			throw die();
		}

		var A_data = O_model.getList(H_sess, A_post);

		if ("ENG" == H_g_sess.language) {
			H_view.page_link = O_manage.getPageLinkEng(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
		} else {
			H_view.page_link = O_manage.getPageLink(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
		}

		O_view.displaySmarty(H_sess, A_data, A_auth, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};