//
//注文メニューProc基底クラス
//
//更新履歴：<br>
//2008/04/16 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/04/16
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ディレクトリ名
//
//const PUB = "/Order";
//
//プロセス実装
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/ProcessBaseHtml.php");

require("process/Order/OrderMenuProcBase.php");

require("model/Order/OrderMenuModelBase.php");

require("view/Order/OrderMenuViewBase.php");

require("OrderUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@abstract
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_g_sess
//@abstract
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//viewオブジェクトの取得 <br>
//セッション情報取得（グローバル） <br>
//modelオブジェクト取得 <br>
//ログインチェック <br>
//セッション情報取得（ローカル） <br>
//権限一覧取得 <br>
//不要セッション削除 <br>
//表示に必要なものを格納する配列を取得<br>
//パンくずリンクの生成<br>
//承認部署を取得して、設定されなければワーニング <br>
//注文パターン取得 <br>
//注文メニュー作成 <br>
//注文フォームの作成 <br>
//フォームのデフォルト値（入力値）をセット<br>
//Smartyによる表示 <br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@protected
//@access protected
//@return void
//@uses
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderMenuProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//不要セッション削除
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//承認部署を取得して、設定されていなければワーニング
	//注文メニュー作成
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();
		O_view.clearUnderSession();
		var H_view = O_view.get_View();
		H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash());
		var recogpost = O_model.getRecogPost();

		if (recogpost == undefined or recog == "") {
			this.warningOut(17, "", 1, "../Menu/menu.php");
		}

		var H_pattern = O_model.getOrderPattern();
		var H_data = O_view.makeOrderMenu(H_pattern, A_auth);
		O_view.displaySmarty(H_sess, H_data, A_auth, O_order);
	}

	__destruct() {
		super.__destruct();
	}

};