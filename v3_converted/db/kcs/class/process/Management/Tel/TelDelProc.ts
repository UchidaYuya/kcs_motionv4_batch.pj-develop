//
//電話削除Proccess
//
//更新履歴：<br>
//2008/06/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/18
//@filesource
//@uses ManagementDelProcBase
//@uses TelDelView
//@uses TelDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/18
//@uses ManagementDelProcBase
//@uses TelDelView
//@uses TelDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Tel/TelDelModel.php");

require("view/Management/Tel/TelDelView.php");

require("MtUniqueString.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/06/18
//
//@access protected
//@return void
//@uses TelDelView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/06/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelDelModel
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
//権限下の部署一覧取得 <br>
//上部に表示する一覧データ取得 <br>
//削除フォームの作成 <br>
//フォームのデフォルト値をセット <br>
//DBが必要なフォームの入力チェック <br>
//削除が実行された時 <br>
//削除用SQL文作成 <br>
//更新成功 <br>
//セッション削除 <br>
//完了画面表示 <br>
//更新失敗 <br>
//エラー画面表示 <br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/03/21
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
//@since 2008/06/18
//
//@access public
//@return void
//
class TelDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//部署ID取得
	//上に表示する一覧データ取得
	//削除フォームの作成
	//削除フォームの作成
	//フォームのデフォルト値をセット
	//請求存在チェック
	//フォームにエラーが無い
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash());
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		O_model.setTableName(H_sess[TelDelProc.PUB].cym);
		var A_post = O_model.getPostidList(H_sess[TelDelProc.PUB].current_postid, H_sess[TelDelProc.PUB].posttarget);
		var A_data = O_model.getList(H_sess[TelDelProc.PUB], H_sess.SELF.trg_list, A_post);
		O_view.makeDelForm(O_manage, O_model, H_sess);
		O_view.makeDelRule(O_manage, O_model, H_sess[TelDelProc.PUB], A_data);
		H_view.O_DelFormUtil.setDefaultsWrapper(H_sess.SELF.post);

		if (O_model.checkBillExist(H_sess) === true) {
			O_view.viewCanNotError();
			throw die();
		}

		O_model.checkDelAuth(H_sess, A_data);

		if (undefined !== H_sess.SELF.post.delsubmit === true && H_view.O_DelFormUtil.validateWrapper() == true) //確認画面
			{
				if (H_sess.SELF.post.delsubmit == O_view.NextName) //フォームをフリーズする
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.post.delsubmit == O_view.RecName) //CSRF
					//移動用sql文を作成
					//DB更新成功
					{
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.SELF.post.uniqueid);
						var A_sql = O_model.makeDelSQLProc(H_sess.SELF.post, A_data, H_sess[TelDelProc.PUB].cym);

						if (O_model.execDB(A_sql) == true) //セッション削除処理
							{
								O_view.endDelView(O_manage, H_sess);
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