//
//電話新規登録Proccess
//
//更新履歴：<br>
//2008/05/30 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/30
//@filesource
//@uses ManagementAddProcBase
//@uses TelAddView
//@uses TelAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話新規登録Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/30
//@uses ManagementAddProcBase
//@uses TelAddView
//@uses TelAddModel
//

require("model/Order/OrderReceiptFormModel.php");

require("view/Order/OrderReceiptFormView.php");

require("process/ProcessBaseHtml.php");

require("MtUtil.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/30
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//@uses TelAddView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/30
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelAddModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//
class OrderReceiptFormProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderReceiptFormView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new OrderReceiptFormModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//Javascriptの生成
	//新規登録フォームの作成
	//新規登録フォームルールの作成
	//デフォルト値を設定
	//フォームのデフォルト値をセット
	//DBが必要な入力のエラーチェック
	//$O_model->checkInputError( $H_sess["SELF"]["post"], &$H_view["O_AddFormUtil"] );
	//権限のチェック
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_util = new MtUtil();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_util.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_util.getPankuzuLink(O_view.makePankuzuLinkHash());
		}

		var H_SubDetail = O_model.getSubDetail(H_sess);
		H_view.js = O_view.getHeaderJS();
		O_view.makeForm(H_sess, H_SubDetail);
		O_view.makeRule(H_SubDetail);
		O_view.setDefault(H_sess, H_SubDetail);
		H_view.O_FormUtil.setDefaultsWrapper(H_sess.SELF.post);

		if (-1 !== A_auth.indexOf("fnc_receipt") == false) {
			this.getOut().displayError("\u53D7\u9818\u65E5\u5165\u529B\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u4ED6\u306E\u4EBA\u306E\u64CD\u4F5C\u306B\u3088\u308A\u6A29\u9650\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F\u3002", 0, "/Menu/menu.php", "\u623B\u308B");
		}

		if (H_view.O_FormUtil.validateWrapper() == true) {
			if (H_sess.SELF.post.submitName == OrderReceiptFormView.NEXTNAME) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.submitRec == OrderReceiptFormView.RECNAME) //CSRF
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.uniqueid);

					if (O_model.updateReceiptDate(H_sess["/MTOrder"].orderid, H_g_sess, H_sess, H_SubDetail)) {
						O_view.endFormReceiptFormView();
					} else {
						this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./menu.php");
					}
				} else {
				O_view.unfreezeForm();
			}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess, A_auth, H_SubDetail);
	}

	__destruct() {
		super.__destruct();
	}

};