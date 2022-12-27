//
//承認履歴一覧トップページProccess
//
//更新履歴：<br>
//2008/06/03 宮澤龍彦 作成
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/06/03
//@filesource
//@uses OrderListMenuProc
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文履歴一覧トップページProccess
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/05/22
//@uses OrderListMenuProcBase
//@uses OrderListMenuView
//@uses OrderListMenuModel
//

require("process/Order/OrderListMenuProcBase.php");

require("model/Order/RecogMenuModel.php");

require("view/Order/RecogMenuView.php");

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
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/06/03
//
//@access protected
//@return void
//@uses RecogMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/06/03
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//@uses RecogMenuModel
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
//@since 2008/03/14
//
//@access public
//@return void
//
class RecogMenuProc extends OrderListMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new RecogMenuView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new RecogMenuModel(O_db0, H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //
	//注文履歴のexecuteをコピーしただけなので詳細は確認する事
	//
	//viewオブジェクトの生成
	//不要セッション削除
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//英語化権限 20090210miya
	//テンプレートに渡すための検索条件
	//パラメータのエラーチェック
	//受領確認処理
	//表示に必要なものを格納する配列を取得
	//Javascriptの生成
	//パンくずリンクの生成
	//年月バーの生成
	//配下の部署ID取得
	//検索フォームの作成
	//検索フォームルールの作成
	//$O_view->makeSearchRule();
	//フォームのデフォルト値をセット
	//検索実行時
	//ダウンロード用のorderidリストを作る
	//ページリンクの生成
	//キャリアごとにDLボタンを表示するか調べる
	{
		var O_view = this.get_View();
		O_view.clearUnderSession();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				var H_sess = O_view.getLocalSession();
			}

		H_sess = O_view.getLocalSession();
		var H_search = H_sess[RecogMenuProc.PUB].search.post;
		O_view.checkParamError(H_sess, H_g_sess);
		O_model.updateReceipt(H_sess);
		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
		}

		if ("ENG" == H_g_sess.language) {
			H_view.monthly_bar = O_order.getDateTreeEng(H_sess[RecogMenuProc.PUB].search.cym, 24, true);
		} else {
			H_view.monthly_bar = O_order.getDateTree(H_sess[RecogMenuProc.PUB].search.cym, 24, true);
		}

		var A_post = O_model.getPostidList(H_g_sess.postid, 1);
		O_view.makeSearchForm(H_sess, A_post, O_order, O_model);
		H_view.O_SearchFormUtil.setDefaultsWrapper(H_sess[RecogMenuProc.PUB].search.post);

		var O_fjp = this._getFjpModel(A_auth);

		O_model.setfjpModelObject(O_fjp);

		if (undefined !== H_sess[RecogMenuProc.PUB].search.post.search == true) //Smartyに渡す一覧データ取得
			{
				var A_data = [0, Array()];
				A_data = O_model.getList(H_sess, A_post, false, H_g_sess, A_auth);
			} else //Smartyに渡す一覧データ取得
			{
				A_data = O_model.getList(H_sess, A_post, false, H_g_sess, A_auth);
			}

		var H_order = O_model.getOrderRegistData(H_g_sess, H_sess);
		var A_data_all = O_model.getList(H_sess, A_post, true, H_g_sess);
		var A_orderid = Array();

		if (true == 0 < A_data_all.length) {
			for (var val of Object.values(A_data_all)) {
				A_orderid.push(val.orderid);
			}
		}

		O_view.setOrderIdList(A_orderid);
		H_sess = O_view.getLocalSession();

		if ("ENG" == H_g_sess.language) {
			H_view.page_link = O_order.getPageLinkEng(A_data[0], H_sess[RecogMenuProc.PUB].search.limit, H_sess[RecogMenuProc.PUB].search.offset);
		} else {
			H_view.page_link = O_order.getPageLink(A_data[0], H_sess[RecogMenuProc.PUB].search.limit, H_sess[RecogMenuProc.PUB].search.offset);
		}

		if (true == (-1 !== A_auth.indexOf("fnc_download"))) {
			var H_carcnt = O_model.eachCarrierOrder();
			H_sess.H_carcnt = H_carcnt;
		}

		if (undefined !== H_sess[RecogMenuProc.PUB].search.post.orderregist) {
			H_order.message = O_model.registOrder(H_order.data);
		}

		O_view.displaySmarty(H_sess, A_data, A_auth, H_g_sess, H_search, H_order);
	}

	__destruct() {
		super.__destruct();
	}

};