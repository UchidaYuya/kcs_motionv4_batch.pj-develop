//
//管理情報削除Proccess基底
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報削除Proccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/21
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
//権限下の部署一覧取得 <br>
//削除フォームの作成 <br>
//フォームのデフォルト値をセット <br>
//上部に表示する一覧データ取得 <br>
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
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementDelProcBase extends ProcessBaseHtml {
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
	//パラメータのエラーチェック
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//部署ID取得
	//削除フォームの作成
	//削除フォームの作成
	//フォームのデフォルト値をセット
	//上に表示する一覧データ取得
	//請求データの存在チェック
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
			H_view.pankuzu_link = O_manage.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_manage.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		O_model.setTableName(H_sess[ManagementDelProcBase.PUB].cym);
		var A_post = O_model.getPostidList(H_sess[ManagementDelProcBase.PUB].current_postid, H_sess[ManagementDelProcBase.PUB].posttarget);
		O_view.makeDelForm(O_manage, O_model, H_sess);
		O_view.makeDelRule(O_manage, O_model, H_sess[ManagementDelProcBase.PUB]);
		H_view.O_DelFormUtil.setDefaultsWrapper(H_sess.SELF.post);
		var A_data = O_model.getList(H_sess[ManagementDelProcBase.PUB], H_sess.SELF.trg_list, A_post);

		if (O_model.checkBillExist(H_sess) === true) {
			O_view.viewCanNotError();
			throw die();
		}

		if (O_model.checkDeleteAuth(H_sess) === false) {
			O_view.viewDeleteAuthError();
			throw die();
		}

		if (undefined !== H_sess.SELF.post.delsubmit == true) //CSRF
			//削除用sql文を作成
			//DB更新成功
			{
				var O_unique = MtUniqueString.singleton();
				O_unique.validate(H_sess.SELF.post.uniqueid);
				var A_sql = O_model.makeDelSQL(H_sess.SELF.post, A_data, H_sess[ManagementDelProcBase.PUB].cym);

				if (O_model.execDB(A_sql) == true) //セッション削除処理
					{
						O_view.endDelView(O_manage, H_sess);
						throw die();
					} else //エラー画面
					{
						this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
					}
			}

		O_view.displaySmarty(H_sess, A_auth, A_data);
	}

	__destruct() {
		super.__destruct();
	}

};