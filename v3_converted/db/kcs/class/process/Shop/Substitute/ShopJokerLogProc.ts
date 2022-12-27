//error_reporting(E_ALL|E_STRICT);
//
//ショップ側成り代わり記録表示プロセス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//
//
//
//ショップ側成り代わり記録表示プロセス
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/Shop/Substitute/ShopSubstituteModel.php");

require("view/Shop/Substitute/ShopJokerLogView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access protected
//@return void
//
class ShopJokerLogProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//$H_sess   = $O_view->getSelfSession();
	//var_dump( $H_g_sess );	// * DEBUG *
	//var_dump( $H_sess );	// * DEBUG *
	//表示に必要なものを格納する配列を取得
	//ショップ名、メンバー名の表示 * ToDo * できればViewにもってゆく
	//タイトル
	//会社情報を得る
	//Smartyによる表示
	{
		var O_view = new ShopJokerLogView();
		O_view.startCheck();
		var O_logmodel = new ShopSubstituteModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_view = O_view.getView();
		H_view.shop_person = H_g_sess.shopname + " " + H_g_sess.personname;
		H_view.title = "\u6210\u308A\u4EE3\u308A\u8A18\u9332";
		var H_logdata = O_logmodel.getJokerLog(H_g_sess.shopid);
		H_view.logdata = H_logdata;
		O_view.displaySmarty();
	}

};