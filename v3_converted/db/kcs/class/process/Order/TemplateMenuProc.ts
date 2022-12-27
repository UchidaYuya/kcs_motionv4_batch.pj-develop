//
//注文雛型メニュープロセス
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
//@uses TemplateProcBase
//@package Order
//@author miyazawa
//@since 2008/04/17
//

require("process/Order/TemplateProcBase.php");

require("view/Order/TemplateMenuView.php");

require("model/Order/TemplateMenuModel.php");

require("model/PostModel.php");

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
class TemplateMenuProc extends TemplateProcBase {
	static PUB = "/MTTemplate";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TemplateMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_order) {
		return new TemplateMenuModel(O_db0, H_g_sess, O_order);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//
	//ログインチェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//英語化権限 20090210miya
	//表示に必要なものを格納する配列を取得
	//パンくずリンクの生成
	//フォーム部品生成
	//$O_view->makeTemplateMenuForm( $O_order, $O_model, $H_sess );
	//配下の部署IDを取得
	//注文権限を取得
	//注文パターンの名とテンプレートファイル名を取得
	//注文権限のあるキャリア（$A_orderauth）から絞り込まれたパターンのみ残す
	//※$A_orderauthを下のgetTemplateDataでそのまま使うと、一度つけた権限を外した場合に、使えないキャリアの雛形がリスト表示される）20081030miya
	//雛型登録データを読み込む
	//整形
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess, O_order);
		O_view.setModel(O_model);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();

		if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				H_sess = O_view.getLocalSession();
			}

		O_view.clearUnderSession();
		var H_view = O_view.get_View();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
		}

		var O_post = new PostModel();
		var A_post = O_post.getChildList(H_g_sess.pactid, H_g_sess.postid);
		var postid_str = join(",", A_post);
		var A_orderauth = O_view.makeOrderAuth(A_auth);
		A_orderauth = O_model.editOtherCarrier(A_orderauth);
		O_model.setDivisionPattern(H_sess[TemplateMenuProc.PUB].division_pattern);
		var H_list = O_model.getTemplateList(postid_str, A_orderauth);
		var A_carid = Array();

		for (var key in H_list) {
			var val = H_list[key];
			A_carid.push(val.carid);
		}

		A_carid = array_unique(A_carid);
		var H_data = O_model.getTemplateData(postid_str, A_carid);
		H_list = O_view.makeTemplateMenuList(H_list, H_data);
		O_view.displaySmarty(H_sess, H_list);
	}

	__destruct() {
		super.__destruct();
	}

};