//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション表示カラム変更のプロセス実装
//
//更新履歴：<br>
//2008/07/17 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//
//
//
//シミュレーションカラム設定のプロセス実装
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//

require("process/ProcessBaseHtml.php");

require("model/Recom/RecomModel.php");

require("view/Recom/RecomColumnView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/07/17
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
//@since 2008/07/17
//
//@param array $H_param
//@access protected
//@return void
//
class RecomColumnProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomColumnView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump($H_p_sess);	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//ユーザー権限一覧を得る
	//会社権限一覧を得る
	//電話情報表示権限がなければ権限エラー
	//用途区分と警告の権限をテンプレートに渡す
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var O_model = new RecomModel(this.get_DB());
		var H_g_sess = O_view.getGlobalSession();
		var H_p_sess = O_view.getPubSession();
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.getView();
		var A_auth = O_view.getUserAuth();

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_USER) {
			var A_pa_auth = O_view.getPactAuth();
		} else //if( $O_view->getSiteMode() == ViewBaseHtml::SITE_SHOP ){
			//ショップ側の場合は権限なし
			{
				A_pa_auth = Array();
			}

		var A_auth_all = array_merge(A_auth, A_pa_auth);

		if (-1 !== A_auth.indexOf("fnc_tel_vw") == false && -1 !== A_auth.indexOf("fnc_tel_manage_vw") == false && O_view.getSiteMode() != ViewBaseHtml.SITE_SHOP) //ショップ側は無条件で利用可
			{
				this.errorOut(6, "\u96FB\u8A71\u60C5\u5831\u8868\u793A\u6A29\u9650\u304C\u7121\u3044", 0, "javascript:window.close();", "\u9589\u3058\u308B");
			}

		H_view.page_path = O_view.makePankuzuLink();

		if (-1 !== A_auth_all.indexOf("fnc_tel_division") == true && -1 !== A_auth_all.indexOf("fnc_fjp_co") == true) {
			H_view.fnc_tel_division = true;
		} else {
			H_view.fnc_tel_division = false;
		}

		if (-1 !== A_auth_all.indexOf("fnc_show_admonition") == true && (!(undefined !== H_g_sess.su) || !H_g_sess.su)) //警告抑止権限があり、スーパーユーザーではない
			{
				H_view.fnc_show_admonition = false;
			} else {
			H_view.fnc_show_admonition = true;
		}

		if (H_sess.post.mode == "set") //更新ボタンを押した場合
			//チェックボックス値を配列に変換する
			//更新ボタンを押した場合、設定を変更後にリダイレクトする
			{
				O_view.setColumns(H_sess.post);
				O_view.gotoResult();
			} else //キャンセルの場合
			//カラムのデフォルト値をセット
			//Smartyによる表示
			{
				O_view.defaultColumns();
				O_view.displaySmarty();
			}
	}

};