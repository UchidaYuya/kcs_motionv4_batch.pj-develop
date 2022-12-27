//
//管理情報移動Proccess基底
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/13
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報移動Proccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/13
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("view/ViewFinish.php");

require("MtUniqueString.php");

require("MtPostUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//権限一覧取得 <br>
//表示に必要なものを格納する配列取得 <br>
//パンくずリンク作成 <br>
//ツリー作成 <br>
//権限下の部署一覧取得 <br>
//上部に表示する一覧データ取得 <br>
//変更フォームの作成 <br>
//変更フォームルールの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//フォームの入力チェック <br>
//（フォームにエラーが無い） <br>
//確認画面 <br>
//フォームをフリーズ <br>
//完了画面 <br>
//移動用SQL文作成 <br>
//更新成功 <br>
//セッション削除 <br>
//完了画面表示 <br>
//更新失敗 <br>
//エラー画面表示 <br>
//（フォームにエラーがある） <br>
//フォームをフリーズさせない（入力画面） <br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_param
//@access protected
//@return void
//@uses ManagementMenuView
//@uses ManagementUtil
//@uses ManagementMenuModel
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
class ManagementMoveProcBase extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//20141111　#32部署移動先抜け対策
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//ツリー作成
	//部署ID取得
	//上に表示する一覧データ取得
	//移動フォームの作成
	//移動フォームルールの作成
	//フォームのデフォルト値をセット
	//フォームにエラーが無い
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();

		if (undefined !== H_sess.SELF.post.recogpostid) {
			if (H_sess.SELF.post.recogpostname == "" || is_null(H_sess.SELF.post.recogpostname)) //階層部署表示取得
				{
					var O_post = new MtPostUtil();
					var postid = +H_sess.SELF.post.recogpostid;
					var postname = O_post.getPostTreeBand(+H_g_sess.pactid, postid, postid, "", " -> ", "", 1, false, false, true);
					H_sess.SELF.post.recogpostname = postname;
				}
		}

		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		H_view.H_tree = O_model.getMoveTreeJS(H_g_sess, H_sess, A_auth);
		H_view.js = H_view.H_tree.js;
		var A_post = O_model.getPostidList(H_sess[ManagementMoveProcBase.PUB].current_postid, H_sess[ManagementMoveProcBase.PUB].posttarget);
		var A_data = O_model.getList(H_sess[ManagementMoveProcBase.PUB], H_sess.SELF.trg_list, A_post);
		O_view.makeMoveForm(O_manage, O_model, H_sess);
		O_view.makeMoveRule(O_manage, O_model, H_sess[ManagementMoveProcBase.PUB], A_data);
		H_view.O_MoveFormUtil.setDefaultsWrapper(H_sess.SELF.post);

		if (H_view.O_MoveFormUtil.validateWrapper() == true) //権限チェック
			//確認画面
			{
				O_model.checkMoveAuth(H_sess, A_data);

				if (H_sess.SELF.post.movesubmit == O_view.NextName) //フォームをフリーズする
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.post.movesubmit == O_view.RecName) //CSRF
					//移動用sql文を作成
					//DB更新成功
					{
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.SELF.post.uniqueid);
						var A_sql = O_model.makeMoveSQLProc(H_sess.SELF.post, A_data, H_sess[ManagementMoveProcBase.PUB].cym);

						if (O_model.execDB(A_sql) == true) //セッション削除処理
							{
								O_view.endMoveView(O_manage, H_sess);
								throw die();
							} else //エラー画面
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC\uFF08\u66F4\u65B0\u6570\u304C\u4E00\u81F4\u3057\u306A\u3044\uFF09", false, "./menu.php");
							}
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess, A_auth, A_data);
	}

	__destruct() {
		super.__destruct();
	}

};