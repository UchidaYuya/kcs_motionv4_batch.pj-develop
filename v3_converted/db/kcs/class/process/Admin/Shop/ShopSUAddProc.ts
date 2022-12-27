//error_reporting(E_ALL|E_STRICT);
//
//ショップスーパーユーザー権限作成
//
//更新履歴：<br>
//2008/12/02 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/12/02
//
//
//require_once("view/ViewFinish.php");
//
//ショップスーパーユーザー権限作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/12/02
//

require("process/ProcessBaseHtml.php");

require("model/ShopFuncModel.php");

require("model/GroupModel.php");

require("view/Admin/Shop/ShopSUAddView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/12/02
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/12/02
//
//@param array $H_param
//@access protected
//@return void
//
class ShopSUAddProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump( $H_sess );		// * DEBUG *
	//パラメータのエラーチェック
	//$O_view->checkParamError( $H_sess, $H_g_sess );
	//表示に必要なものを格納する配列を取得
	//$groupid = $O_view->getAdminGroupId();	// 現行のグループIDを得る
	//親側で指定した値
	//グループ設定から、このショップの権限を得る
	//var_dump( $H_allauth );
	//フォームの作成
	//フォームルールの作成
	//$O_view->makeAuthRule();
	//フォームのデフォルト値をセットする
	//フォームにエラーが無い
	{
		var O_view = new ShopSUAddView();
		O_view.startCheck();
		var O_authmodel = new ShopFuncModel(this.get_DB());
		var O_groupmodel = new GroupModel(this.get_DB());
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();
		H_view.frozen = H_sess.get.frozen;
		var groupid = H_sess.get.groupid;
		var H_allauth = O_groupmodel.getShopGroupAuth(groupid, "US");
		O_view.makeAuthForm(H_allauth, H_sess.get.frozen);
		var def_value = O_view.defaultAuthForm(H_allauth);

		if (H_view.O_FormUtil.validateWrapper() == true) //フォームをフリーズする
			//$O_view->freezeForm();
			//メンバー情報更新
			{
				if (H_sess.post.mode == "update") //権限情報を更新する
					//変更完了
					{
						O_view.setAuthSession(H_sess.post);
						H_view.changed = true;
					}

				delete H_sess.post;
			}

		O_view.displaySmarty();
	}

};