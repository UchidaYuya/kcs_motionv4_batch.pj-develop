//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション結果保存画面
//
//更新履歴：<br>
//2008/10/15 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/10/06
//
//
//
//シミュレーション結果保存画面
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/10/06
//

require("process/ProcessBaseHtml.php");

require("model/Recom/RecomModel.php");

require("view/Recom/RecomSaveView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/10/06
//
//@param array $H_param
//@access public
//@return void
//
//
//ここで必要となるViewを返す<br/>
//Hotline側と切り替えるための仕組み<br/>
//
//@author nakanita
//@since 2008/10/15
//
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/10/06
//
//@param array $H_param
//@access protected
//@return void
//
class RecomSaveProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomSaveView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump( $H_g_sess );	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//ユーザー権限一覧を得る
	//会社権限一覧を得る
	//結果ダウンロード権限
	//用途区分の権限をテンプレートに渡す
	//パンくずリンクの生成
	//結果をVIEWに付ける
	//var_dump( $H_view['H_data'] ); // * DEBUG *
	//Smartyによる表示
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var O_model = new RecomModel(this.get_DB());
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_view.getUserAuth();

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_USER) {
			var A_pa_auth = O_view.getPactAuth();
		} else //if( $O_view->getSiteMode() == ViewBaseHtml::SITE_SHOP ){
			//ショップ側の場合は権限なし
			{
				A_pa_auth = Array();
			}

		var A_auth_all = array_merge(A_auth, A_pa_auth);

		if (-1 !== A_auth.indexOf("fnc_recom_download") == false && -1 !== A_auth.indexOf("fnc_shop_download") == false) //ショップ側の場合、共通ダウンロード権限をあてがう
			{
				this.errorOut(6, "\u7D50\u679C\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u7121\u3044", 0, "javascript:window.close();", "\u9589\u3058\u308B");
			}

		switch (O_view.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				var shopid = 0;
				var user_memid = H_g_sess.userid;
				break;

			case ViewBaseHtml.SITE_SHOP:
				shopid = H_g_sess.shopid;
				user_memid = H_g_sess.memid;
				break;

			default:
				shopid = 0;
				user_memid = 0;
				break;
		}

		var H_view = O_view.getView();

		if (-1 !== A_auth_all.indexOf("fnc_tel_division") == true && -1 !== A_auth_all.indexOf("fnc_fjp_co") == true) {
			H_view.fnc_tel_division = true;
		} else {
			H_view.fnc_tel_division = false;
		}

		H_view.page_path = O_view.makePankuzuLink();
		H_view.H_data = O_model.getIndexList(H_g_sess.pactid, shopid, user_memid, 0, undefined, H_g_sess.language);
		O_view.displaySmarty();
	}

};