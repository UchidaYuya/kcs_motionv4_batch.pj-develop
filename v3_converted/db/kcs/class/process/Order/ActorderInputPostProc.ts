//
//注文必須情報入力画面（所属部署選択）プロセス
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@uses OrderInputProcBase
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/04/17
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderInputProcBase
//@package Order
//@author miyazawa
//@since 2008/04/17
//

require("process/Order/OrderInputProcBase.php");

require("view/Order/OrderInputPostView.php");

require("model/Order/ActorderInputModelBase.php");

require("model/Order/OrderTelInfoModel.php");

require("MtDBUtil.php");

//
//ディレクトリ名
//
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
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@protected
//@access protected
//@return void
//@uses
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
class ActorderInputPostProc extends OrderInputProcBase {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderInputPostView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new ActorderInputModelBase(H_g_sess);
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
	//ツリー作成
	//登録部署を設定
	//フォーム部品生成
	//入力チェック生成
	//hiddenで登録部署パラメータ作成
	//注文フォームのデフォルト値作成、セット
	//件数をカウント
	//sessionの有無を確認
	//SESSIONがあるかはViewで見ないとダメ。
	//表示するキャリア名、注文種別をSESSIONに入れる
	//取得した電話情報をSESSIONに入れる
	//スタティック表示作成
	//セッション再取得
	//パンくずリンクの生成（セッション再取得があるためここに置く）
	//フォームにエラーが無い
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		H_g_sess.memid = O_view.gSess().memid;
		H_g_sess.shopid = O_view.gSess().shopid;
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();
		O_view.clearUnderSession();
		var H_view = O_view.get_View();
		H_view.H_tree = O_model.getOrderTreeJS(H_sess[ActorderInputPostProc.PUB]);
		H_view.js = H_view.H_tree.js;
		H_view.recogpostid = O_view.makeRecogPostid(H_sess, H_g_sess);
		H_view.recogpostname = O_model.getPostNameString(H_view.recogpostid);
		O_view.makeInputForm(O_order, O_model, H_sess);
		O_view.makeInputRule();
		O_view.makeHiddenParam();
		H_view.O_InputFormUtil.setDefaultsWrapper(H_sess.SELF);
		var telcount = O_view.countTel();
		O_view.setOrderPatternSession(O_model);
		O_view.setTelInfoSession(H_telinfo);
		O_view.makeFormStatic(H_g_sess);
		H_sess = O_view.getLocalSession();
		H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash());

		if (H_view.O_InputFormUtil.validateWrapper() == true) {
			header("Location: " + dirname(_SERVER.PHP_SELF) + "/order_form.php");
			throw die();
		} else //Smartyによる表示
			{
				O_view.displaySmarty(H_sess, A_auth);
			}
	}

	__destruct() {
		super.__destruct();
	}

};