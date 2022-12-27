//error_reporting(E_ALL|E_STRICT);
//
//ショップスーパーユーザー権限変更
//
//更新履歴：<br>
//2008/11/20 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/11/20
//
//
//require_once("view/ViewFinish.php");
//
//ショップスーパーユーザー権限変更
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/11/20
//

require("process/ProcessBaseHtml.php");

require("model/Shop/MemberModel.php");

require("model/GroupModel.php");

require("view/Admin/Shop/ShopSUAuthView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/11/20
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/11/20
//
//@param array $H_param
//@access protected
//@return void
//
class ShopSUAuthProc extends ProcessBaseHtml {
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
	//ショップ管理ユーザー情報を得る
	//var_dump( $H_user );
	//現行のグループIDを得る
	//表示に必要な情報をセットする
	//グループ設定から、このショップの権限を得る
	//var_dump( $H_allauth );
	//このメンバーのショップ権限を得る
	//var_dump( $H_auth );
	//フォームの作成
	//フォームルールの作成
	//フォームのデフォルト値をセットする
	//DBが必要な入力のエラーチェック
	//$O_model->checkInputError( $H_sess["post"]["old_passwd"], $H_user, &$H_view["O_FormUtil"] );
	//(今回はDB不要だったのでView内でチェックした)
	//$O_view->checkInputError( $H_sess["post"]["old_passwd"], $H_sess["post"]["passwd"], $H_user );
	//フォームにエラーが無い
	{
		var O_view = new ShopSUAuthView();
		O_view.startCheck();
		var O_model = new MemberModel(this.get_DB());
		var O_authmodel = new ShopFuncModel(this.get_DB());
		var O_groupmodel = new GroupModel(this.get_DB());
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();
		var shopid = H_sess.get.shopid;
		var H_user = O_model.getMemberSUInfo(shopid);
		var memid = H_user.memid;
		var groupid = O_view.getAdminGroupId();
		H_view.shopid = shopid;
		H_view.memid = memid;
		H_view.mode = H_sess.get.mode;
		var H_allauth = O_groupmodel.getShopGroupAuth(groupid, "US");
		var H_auth = O_authmodel.getUserFuncList(shopid, memid);
		O_view.makeAuthForm(H_user, H_allauth);
		O_view.makeAuthRule();
		var def_value = O_view.defaultAuthForm(H_auth);

		if (H_view.O_FormUtil.validateWrapper() == true) //if( isset($H_sess["post"]["typ"]) == true && $H_sess["post"]["typ"] != "" ){
			//フォームをフリーズする
			//$O_view->freezeForm();
			//メンバー情報更新
			{
				if (H_sess.post.mode == "update") //権限情報を更新する
					//変更完了
					{
						if (O_model.updateMemberAuth(shopid, memid, H_sess.post) == false) //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Admin/menu.php");
							}

						if (H_sess.post.passwd != "") //パスワードがあったなら
							{
								if (O_model.updatePassword(memid, H_sess.post.passwd) == false) //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
									{
										this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Admin/menu.php");
									}
							}

						H_view.changed = true;
					}

				delete H_sess.post;
			}

		O_view.displaySmarty();
	}

};