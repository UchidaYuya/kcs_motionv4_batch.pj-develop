//
//請求画面Proccess基底
//
//更新履歴：<br>
//2008/04/11 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/11
//@filesource
//@uses ProcessBaseHtml
//@uses BillUtil
//
//
//
//error_reporting(E_ALL|E_STRICT);
//
//請求画面Proccess基底
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/11
//@uses ProcessBaseHtml
//@uses BillUtil
//
//

require("process/ProcessBaseHtml.php");

require("BillUtil.php");

//
//ディレクトリ名
//
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/11
//
//@param array $H_param
//@access public
//@return void
//
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/04/11
//
//@abstract
//@access protected
//@return void
//
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/04/11
//
//@param array $H_g_sess
//@param mixed $O_bill
//@abstract
//@access protected
//@return void
//
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの取得 <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト取得 <br>
//ログインチェック <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//管理が唯一ならばそこにリダイレクトする<br>
//不要セッション削除 <br>
//表示に必要なものを格納する配列を取得<br>
//ツリーデータ取得 <br>
//Javascriptの生成<br>
//パンくずリンクの生成<br>
//年月バーの生成<br>
//ツリーの生成<br>
//管理情報共通フォームのデフォルト値生成 <br>
//管理情報共通フォームの作成 <br>
//検索フォームの作成 <br>
//検索フォームルールの作成 <br>
//フォームのデフォルト値（入力値）をセット<br>
//フォームにエラーが無い時 <br>
//一覧データ取得 <br>
//ページリンクの生成<br>
//Smartyによる表示 <br>
//
//@author houshiyama
//@since 2008/04/11
//
//@param array $H_param
//@access protected
//@return void
//@uses BillUtil
//
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/11
//
//@access public
//@return void
//
//
class BillMenuProcBase extends ProcessBaseHtml {
		static PUB = "/Bill";

		constructor(H_param: {} | any[] = Array()) {
				super(H_param);
		}

		doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
		//セッション情報取得（グローバル）
		//関数集のオブジェクトの生成
		//modelオブジェクトの生成
		//ログインチェック
		//セッション情報取得（ローカル）
		//パラメータのエラーチェック
		//権限一覧取得
		//管理が唯一ならばそこにリダイレクトする
		//不要セッション削除
		//表示に必要なものを格納する配列を取得
		//Javascriptの生成
		//請求タイプの取得
		//パンくずリンクの生成
		//英語化 20090702miya
		//年月バーの生成
		//英語化 20090702miya
		//ツリー作成
		//検索フォームの作成
		//再計算フォームの作成
		//検索フォームルールの作成
		//検索実行時
		//部署ツリー作成
		//フォームのデフォルト値作成
		//フォームのデフォルト値をセット
		//ページリンクの生成
		//英語化 20090702miya
		//Smartyによる表示
		{
				var O_view = this.get_View();
				var H_g_sess = O_view.getGlobalSession();
				var O_bill = new BillUtil();
				var O_model = this.get_Model(H_g_sess, O_bill);
				O_view.startCheck();
				var H_sess = O_view.getLocalSession();
				O_view.checkParamError(H_sess, H_g_sess);
				var A_auth = O_model.get_AuthIni();
				O_view.checkLocation(A_auth);
				O_view.clearUnderSession();
				var H_view = O_view.get_View();
				H_view.js = O_view.getHeaderJS();
				H_view.billtype = O_view.getBillType();

				if ("ENG" == H_g_sess.language) {
						H_view.pankuzu_link = O_bill.getPankuzuLinkEng(O_view.makePankuzuLinkHash());
				} else {
						H_view.pankuzu_link = O_bill.getPankuzuLink(O_view.makePankuzuLinkHash());
				}

				if ("ENG" == H_g_sess.language) {
						H_view.monthly_bar = O_bill.getDateTreeEng(H_sess[BillMenuProcBase.PUB].cym, 24, "", H_view.billtype);
				} else {
						H_view.monthly_bar = O_bill.getDateTree(H_sess[BillMenuProcBase.PUB].cym, 24, "", H_view.billtype);
				}

				H_view.H_tree = O_model.getTreeJS(H_sess[BillMenuProcBase.PUB]);
				H_view.js += H_view.H_tree.js;
				O_view.makeSearchForm(H_sess, O_bill, O_model);
				O_view.makeRecalcForm(H_sess);
				O_view.makeSearchRule();

				if (undefined !== H_sess.SELF.post.search == true) //フォームにエラーが無い
						{
								var A_data = [0, Array()];

								if (H_view.O_SearchFormUtil.validateWrapper() == true) //Smartyに渡す一覧データ取得
										{
												A_data = O_model.getList(H_sess);
										}
						} else //Smartyに渡す一覧データ取得
						{
								A_data = O_model.getList(H_sess);
						}

				H_view.post_tree = O_model.getPostTree(H_sess);
				var H_default = O_view.makeDefaultValue(H_sess);
				H_view.O_SearchFormUtil.setDefaultsWrapper(H_default);

				if ("ENG" == H_g_sess.language) {
						H_view.page_link = O_bill.getPageLinkEng(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
				} else {
						H_view.page_link = O_bill.getPageLink(A_data[0], H_sess.SELF.limit, H_sess.SELF.offset);
				}

				O_view.displaySmarty(H_sess, A_data, A_auth, O_model);
		}

		__destruct() {
				super.__destruct();
		}

};