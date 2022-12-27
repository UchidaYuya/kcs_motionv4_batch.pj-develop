//error_reporting(E_ALL|E_STRICT);
//
//ショップ側成り代わりプロセス
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
//ショップ側成り代りプロセス
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/PactModel.php");

require("model/UserModel.php");

require("view/Shop/Substitute/ShopSubstituteView.php");

require("view/ViewFinish.php");

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
class ShopSubstituteProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump( $H_g_sess );	// * DEBUG *
	//var_dump( $H_sess );	// * DEBUG *
	//パラメータのエラーチェック
	//$O_view->checkParamError( $H_sess, $H_g_sess );
	//成り代わりを実行
	//パンくずリンクの生成
	//ショップ名、メンバー名の表示 * ToDo * できればViewにもってゆく
	//JavaScript を入れる * ToDo * できればViewにもってゆく
	//会社情報を得る
	//$H_pactdata = $O_pactmodel->getPactListFromShop( $H_g_sess["shopid"] );
	//2008/10/30 * 権限を持ったmember->pact
	//会社が選ばれていれば
	{
		var O_view = new ShopSubstituteView();
		O_view.startCheck();
		var O_pactmodel = new PactModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getSelfSession();

		if (H_sess.post.mode == "user") //ここで終了
			{
				O_view.doNarikawari(H_sess.post);
				throw die(0);
			}

		var H_view = O_view.getView();
		H_view.page_path = O_view.makePankuzuLink();
		H_view.shop_person = H_g_sess.shopname + " " + H_g_sess.personname;
		H_view.js = "<script src=\"/js/cancel.js\" type=\"text/javascript\"></script>";
		H_view.title = "\u6210\u308A\u4EE3\u308F\u308A";
		var H_pactdata = O_pactmodel.getPactListFromShopMember(H_g_sess.memid);
		H_view.pactdata = H_pactdata;

		if (undefined !== H_sess.post.pactid == true) {
			H_view.pactid = H_sess.post.pactid;
			var O_usermodel = new UserModel(this.get_DB());
			var H_userdata = O_usermodel.getUserList(H_sess.post.pactid);
			H_view.userdata = H_userdata;
		}

		O_view.displaySmarty();
	}

};