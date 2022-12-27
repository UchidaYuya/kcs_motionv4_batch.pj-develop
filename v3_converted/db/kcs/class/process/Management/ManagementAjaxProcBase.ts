//
//管理情報AjaxProccess基底
//
//更新履歴：<br>
//2008/05/28 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/28
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報AjaxProccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/28
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/28
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/05/28
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/05/28
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
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
//表示に必要なものを格納する配列を取得<br>
//権限下の部署一覧取得 <br>
//フォームの作成 <br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/05/28
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
//@since 2008/05/28
//
//@access public
//@return void
//
class ManagementAjaxProcBase extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//cgiパラメータ処理
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//表示に必要なものを格納する配列を取得
	//Smartyに渡すデータ取得
	//フォームの作成
	//フォームのデフォルト値をセット
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.checkCGIParam();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		var H_view = O_view.get_View();
		var H_data = O_model.getMastersList(H_sess);
		O_view.makeForm(O_manage, O_model, H_sess, H_data);
		H_view.O_FormUtil.setDefaultsWrapper(H_sess.SELF.post);
		O_view.displaySmarty(H_sess, H_data);
	}

	__destruct() {
		super.__destruct();
	}

};