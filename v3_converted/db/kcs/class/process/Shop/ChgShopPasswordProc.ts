//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装のサンプル
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
//プロセス実装のサンプル
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/Shop/MemberModel.php");

require("view/Shop/ChgShopPasswordView.php");

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
class ChgShopPasswordProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//とりあえずチェックを中止
	//model の生成
	//セッション情報取得
	//パラメータのエラーチェック
	//$O_view->checkParamError( $H_sess, $H_g_sess );
	//表示に必要なものを格納する配列を取得
	//JavaScript を入れる * ToDo * できればViewにもってゆく
	//メンバー情報を得る
	//フォームの作成
	//フォームルールの作成
	//フォームのデフォルト値をセット
	//$def_value = $O_view->defaultPassForm( $H_user );
	//$H_view["O_FormUtil"]->setDefaultsWrapper( $def_value );
	//DBが必要な入力のエラーチェック
	//$O_model->checkInputError( $H_sess["post"]["old_passwd"], $H_user, &$H_view["O_FormUtil"] );
	//(今回はDB不要だったのでView内でチェックした)
	//$O_view->checkInputError( $H_sess["post"]["old_passwd"], $H_sess["post"]["passwd"], $H_user );
	//フォームにエラーが無い
	{
		var O_view = new ChgShopPasswordView();
		O_view.startCheck();
		var O_model = new MemberModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();
		H_view.js = "<script src=\"/js/cancel.js\" type=\"text/javascript\"></script>";
		H_view.title = "\u30D1\u30B9\u30EF\u30FC\u30C9\u5909\u66F4";
		var H_user = O_model.getMemberInfo(H_g_sess.memid);
		O_view.makePassForm(H_user);
		O_view.makePassRule();

		if (H_view.O_FormUtil.validateWrapper() == true) //フォームをフリーズする
			//$O_view->freezeForm();
			//もしパスワードが空でなければ
			{
				if (H_sess.post.passwd != "") //パスワード更新
					{
						if (O_model.updatePassword(H_g_sess.memid, H_sess.post.passwd) == true) //変更完了
							//完了画面 * 画面を変えるのは止めにした
							//$O_view->endView( $H_g_sess["shopid"] );
							{
								H_view.changed = true;
							} else //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/index_shop.php");
							}
					}
			}

		O_view.displaySmarty();
	}

};