//
//注文履歴一覧トップページProccess
//
//更新履歴：<br>
//2008/05/22 宮澤龍彦 作成
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/05/22
//@filesource
//@uses OrderListMenuProcBase
//@uses OrderListMenuView
//@uses OrderListMenuModel
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

require("process/Order/RecogMenuProc.php");

require("model/Order/OrderListMenuModel.php");

require("view/Order/OrderListMenuView.php");

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
//@since 2008/05/22
//
//@access protected
//@return void
//@uses OrderListMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/05/22
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//@uses OrderListMenuModel
//
//
//プロセス処理のメイン<br>
//RecogMenuProcから持ってきた 20141216date
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
//@author date
//@since 2014/12/16
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
class OrderListMenuProc extends RecogMenuProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderListMenuView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new OrderListMenuModel(O_db0, H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
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
	////	S179 注文履歴検索にて廃止になりました。 20141217date
	//		// 年月バーの生成
	//		if ( "ENG" == $H_g_sess["language"] ) {
	//			$H_view["monthly_bar"] = $O_order->getDateTreeEng( $H_sess[self::PUB]["search"]["cym"], 24, true );
	//		} else {
	//			$H_view["monthly_bar"] = $O_order->getDateTree( $H_sess[self::PUB]["search"]["cym"], 24, true );
	//		}
	//配下の部署ID取得
	//検索フォームの作成
	//検索フォームルールの作成
	//フォームのデフォルト値をセット
	//ページングした場合、POSTの値がなくなりバリデーションが失敗するようなのでチェックいれた
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
		var H_search = H_sess[OrderListMenuProc.PUB].search.post;
		O_view.checkParamError(H_sess, H_g_sess);
		O_model.updateReceipt(H_sess);
		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
		}

		var A_post = O_model.getPostidList(H_g_sess.postid, 1);
		O_view.makeSearchForm(H_sess, A_post, O_order, O_model);
		O_view.makeSearchRule();
		H_view.O_SearchFormUtil.setDefaultsWrapper(H_sess[OrderListMenuProc.PUB].search.post);

		var O_fjp = this._getFjpModel(A_auth);

		O_model.setfjpModelObject(O_fjp);

		if (!!_POST) //formのvalidationチェック
			//validation駄目なので検索結果が0になるようにする
			{
				var validation_result = H_view.O_SearchFormUtil.validateWrapper();

				if (validation_result == false) {
					H_sess[OrderListMenuProc.PUB].search.post.carrier = Array();
					H_sess[OrderListMenuProc.PUB].search.post.fromdate.Y = "";
					H_sess[OrderListMenuProc.PUB].search.post.todate.Y = "";
				}
			}

		if (undefined !== H_sess[OrderListMenuProc.PUB].search.post.search == true) //Smartyに渡す一覧データ取得
			{
				var A_data = [0, Array()];
				A_data = O_model.getList(H_sess, A_post, false, H_g_sess);
			} else //Smartyに渡す一覧データ取得
			{
				A_data = O_model.getList(H_sess, A_post, false, H_g_sess);
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
			H_view.page_link = O_order.getPageLinkEng(A_data[0], H_sess[OrderListMenuProc.PUB].search.limit, H_sess[OrderListMenuProc.PUB].search.offset);
		} else {
			H_view.page_link = O_order.getPageLink(A_data[0], H_sess[OrderListMenuProc.PUB].search.limit, H_sess[OrderListMenuProc.PUB].search.offset);
		}

		if (true == (-1 !== A_auth.indexOf("fnc_download"))) {
			var H_carcnt = O_model.eachCarrierOrder();
			H_sess.H_carcnt = H_carcnt;
		}

		if (undefined !== H_sess[OrderListMenuProc.PUB].search.post.orderregist) {
			H_order.message = O_model.registOrder(H_order.data);
		}

		O_view.displaySmarty(H_sess, A_data, A_auth, H_g_sess, H_search, H_order);
	}

	__destruct() {
		super.__destruct();
	}

};