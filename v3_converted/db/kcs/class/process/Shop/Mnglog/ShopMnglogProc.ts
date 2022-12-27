//
//shopメニュープロセス
//
//更新履歴：<br>
//2009/01/08 宝子山浩平 作成
//
//@uses ProcessBaseHtml
//@uses ShopMenuModel
//@uses InfoModel
//@uses ShopMenuView
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2009/01/08
//
//error_reporting(E_ALL|E_STRICT);
//
//
//Shopメニュープロセス
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses InfoModel
//@uses ShopMenuView
//@package ShopMenu
//@author houshiyama
//@since 2009/01/08
//

require("process/ProcessBaseHtml.php");

require("view/Shop/Mnglog/ShopMnglogView.php");

require("view/MakePankuzuLink.php");

require("view/MakeMonthlyBar.php");

require("view/MakePageLink.php");

require("model/ShopMnglogModel.php");

require("MtUtil.php");

//
//__construct
//
//@author houshiyama
//@since 2009/01/08
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2009/01/08
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2009/01/08
//
//@access public
//@return void
//
class ShopMnglogProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//共通のCGIチェック
	//権限一覧取得（fncid）
	//model の生成
	//関数集のオブジェクトの生成
	//セッション情報取得（ローカル）
	//shopの権限取得
	//表示に必要なものを格納する配列を取得
	//Smartyに渡す一覧データ取得
	//フォームのデフォルト値作成
	//管理記録絞込みフォームの作成
	//フォームのデフォルト値をセット
	//assign
	//パンくずリンクの生成
	//年月バーの生成
	//ページリンクの生成
	//一覧データ
	//その他assign
	//Smartyによる表示
	{
		var O_view = new ShopMnglogView();
		O_view.startCheck();
		var A_auth = O_view.getAuthBase();
		var O_model = new ShopMnglogModel();
		var O_util = new MtUtil();
		var H_sess = O_view.getLocalSession();
		var A_shop_auth = O_view.getAuthShop();
		var H_view = O_view.get_View();
		var A_data = O_model.getList(H_sess);
		var H_default = O_view.makeDefaultValue(H_sess);
		O_view.makeForm(O_model);
		H_view.O_FormUtil.setDefaultsWrapper(H_default);
		O_view.setAssign("shop_person", O_view.gSess().name + " " + O_view.gSess().personname);
		O_view.setAssign("shop_submenu", MakePankuzuLink.makePankuzuLinkHTML({
			"": "\u7BA1\u7406\u8A18\u9332"
		}, "shop"));
		O_view.setAssign("monthly_bar", O_util.getHalfDateTree(H_sess.cym));
		O_view.setAssign("page_link", MakePageLink.makePageLinkHTML(A_data[0], H_sess.limit, H_sess.offset));
		O_view.setAssign("list_cnt", A_data[0]);
		O_view.setAssign("H_list", A_data[1]);
		O_view.setAssign("css", "csMnglog");
		O_view.setAssign("title", "\u30B7\u30E7\u30C3\u30D7\u7BA1\u7406\u8A18\u9332");
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};