//
//注文履歴一覧Proccess基底
//
//更新履歴：<br>
//2008/05/22 宮澤龍彦 作成
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/05/22
//@filesource
//@uses ProcessBaseHtml
//@uses OrderUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文履歴一覧Proccess基底
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/02/22
//@uses ProcessBaseHtml
//@uses OrderUtil
//

require("process/ProcessBaseHtml.php");

require("OrderUtil.php");

require("model/Order/fjpModel.php");

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
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_g_sess
//@param mixed $O_order
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
//_getFjpModel
//
//@author igarashi
//@since 2011/06/09
//
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
class OrderListMenuProcBase extends ProcessBaseHtml {
	static PUB = "/MTOrderList";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//不要セッション削除
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//CGIパラメータ取得
	//権限一覧取得
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//Javascriptの生成
	//パンくずリンクの生成
	//年月バーの生成
	//配下の部署ID取得
	//検索フォームの作成
	//検索フォームルールの作成
	//$O_view->makeSearchRule();
	//フォームのデフォルト値をセット
	//$H_view["O_SearchFormUtil"]->setDefaultsWrapper( $H_sess[self::PUB]["search"]["post"] );
	//検索実行時
	//ページリンクの生成
	//受領確認の更新
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.clearUnderSession();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		O_view.checkCGIParam();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
		}

		if ("ENG" == H_g_sess.language) {
			H_view.monthly_bar = O_order.getDateTreeEng(H_sess[OrderListMenuProcBase.PUB].search.cym, 24);
		} else {
			H_view.monthly_bar = O_order.getDateTree(H_sess[OrderListMenuProcBase.PUB].search.cym, 24);
		}

		var A_post = O_model.getPostidList(H_g_sess.postid, 1);
		O_view.makeSearchForm(H_sess, A_post, O_order, O_model);

		if (undefined !== H_sess[OrderListMenuProcBase.PUB].search.post.search == true) //フォームにエラーが無い
			{
				var A_data = [0, Array()];

				if (H_view.O_SearchFormUtil.validateWrapper() == true) //Smartyに渡す一覧データ取得
					{
						A_data = O_model.getList(H_sess, A_post);
					}
			} else //Smartyに渡す一覧データ取得
			{
				A_data = O_model.getList(H_sess, A_post);
			}

		if ("ENG" == H_g_sess.language) {
			H_view.page_link = O_order.getPageLinkEng(A_data[0], H_sess[OrderListMenuProcBase.PUB].search.limit, H_sess[OrderListMenuProcBase.PUB].search.offset);
		} else {
			H_view.page_link = O_order.getPageLink(A_data[0], H_sess[OrderListMenuProcBase.PUB].search.limit, H_sess[OrderListMenuProcBase.PUB].search.offset);
		}

		O_model.updateReceipt(H_sess);
		O_view.displaySmarty(H_sess, A_data, A_auth, H_g_sess);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(OrderListMenuProcBase.PUB, A_auth);
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};