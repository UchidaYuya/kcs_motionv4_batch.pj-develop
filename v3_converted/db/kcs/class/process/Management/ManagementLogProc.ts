//
//管理情報一覧Proc基底クラス
//
//更新履歴：<br>
//2008/03/30 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/30
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementLogView
//@uses ManagementLogModel
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報一覧Proc基底クラス
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/30
//@uses ProcessBaseHtml
//@uses ManagementLogView
//@uses ManagementLogModel
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("model/Management/ManagementLogModel.php");

require("view/Management/ManagementLogView.php");

require("ManagementUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/30
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/30
//
//@access protected
//@return void
//@uses ManagementLogView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/30
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses ManagementLogModel
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの取得 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト取得 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//表示に必要なものを格納する配列を取得<br>
//一覧データ取得 <br>
//Javascriptの生成<br>
//パンくずリンクの生成<br>
//年月バーの生成<br>
//ページリンクの生成<br>
//管理記録絞込みフォームの作成
//フォームのデフォルト値（入力値）をセット<br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/03/30
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
//@since 2008/03/30
//
//@access public
//@return void
//
class ManagementLogProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementLogView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementLogModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//Smartyに渡す一覧データ取得
	//Javascriptの生成
	//パンくずリンクの生成
	//年月バーの生成
	//ページリンクの生成
	//フォームのデフォルト値作成
	//管理記録絞込みフォームの作成
	//フォームのデフォルト値をセット
	//ツリーについて
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_view = O_view.get_View();
		var A_data = O_model.getList(A_auth, H_sess);
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(H_sess.SELF.from));
			H_view.monthly_bar = O_manage.getHalfDateTreeEng(H_sess.SELF.cym);
			H_view.page_link = O_manage.getPageLinkEng(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash(H_sess.SELF.from));
			H_view.monthly_bar = O_manage.getHalfDateTree(H_sess.SELF.cym);
			H_view.page_link = O_manage.getPageLink(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
		}

		var H_default = O_view.makeDefaultValue(H_sess);
		O_view.makeForm(O_model);
		H_view.O_FormUtil.setDefaultsWrapper(H_default);
		var H_tree = O_model.getTreeJS(H_g_sess.pactid, H_g_sess.postid, H_sess.SELF.pid);
		var tree_js = H_tree.js;
		O_view.displaySmarty(H_sess, A_data, A_auth, O_manage, H_tree, tree_js);
	}

	__destruct() {
		super.__destruct();
	}

};