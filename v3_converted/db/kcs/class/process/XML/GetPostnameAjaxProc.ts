//
//管理情報AjaxProccess基底
//
//更新履歴：<br>
//2009/05/07 宝子山浩平 作成
//
//@package XML
//@subpackage Proccess
//@author houshiyama
//@since 2009/05/07
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報AjaxProccess基底
//
//@package XML
//@subpackage Proccess
//@author houshiyama
//@since 2009/05/07
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/XML/GetPostnameAjaxView.php");

require("MtPostUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2009/05/07
//
//@param array $H_param
//@access public
//@return void
//
//
//view取得
//
//@author houshiyama
//@since 2009/05/07
//
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
//@since 2009/05/07
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2009/05/07
//
//@access public
//@return void
//
class GetPostnameAjaxProc extends ProcessBaseHtml {
	static PUB = "/XML";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new GetPostnameAjaxView();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//cgiパラメータ処理
	//セッション情報取得（グローバル）
	//セッション情報取得（ローカル）
	//階層部署表示取得
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.checkCGIParam();
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getLocalSession();
		var O_post = new MtPostUtil();
		var postname = O_post.getPostTreeBand(H_g_sess.pactid, H_sess.post.postid, H_sess.post.postidchild, H_sess.post.tableno, " -> ", "", 1, false, false, true);
		O_view.displayAjax(postname);
	}

	__destruct() {
		super.__destruct();
	}

};