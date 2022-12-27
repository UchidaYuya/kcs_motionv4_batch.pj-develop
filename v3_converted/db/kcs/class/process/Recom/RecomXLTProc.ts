//error_reporting(E_ALL|E_STRICT);
//
//Excelテンプレートのダウンロード
//
//更新履歴：<br>
//2008/10/06 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/11/14
//
//
//
//Excelテンプレートのダウンロード
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/10/06
//

require("process/ProcessBaseHtml.php");

require("view/Recom/RecomXLTView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/11/14
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
class RecomXLTProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomXLTView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得
	//$H_g_sess = $O_view->getGlobalSession();
	//$H_sess   = $O_view->getSelfSession();
	//var_dump( $H_g_sess );	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//$O_view->checkParamError( $H_sess, $H_g_sess );
	//ユーザー権限一覧を得る
	//結果ダウンロード権限
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var A_auth = O_view.getUserAuth();

		if (-1 !== A_auth.indexOf("fnc_recom_download") == false && -1 !== A_auth.indexOf("fnc_shop_download") == false) //ショップ側の場合、共通ダウンロード権限をあてがう
			{
				this.errorOut(6, "\u7D50\u679C\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u7121\u3044", 0, "javascript:window.close();", "\u9589\u3058\u308B");
			}

		O_view.displayDownload();
	}

};