//
//注文フォームへの中継ぎプロセス（必須情報の入力が不要な注文パターン用）
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

require("view/Order/OrderInputTelView.php");

require("model/Order/OrderInputModelBase.php");

require("model/Order/OrderTelInfoModel.php");

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
class OrderInputProc extends OrderInputProcBase {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderInputTelView();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//ログインチェック
	//CGIパラメータ取得
	//セッション情報取得（ローカル）
	//直打ちエラーをキャッチ 20090217miya
	//不要セッション削除
	//表示するキャリア名、注文種別をSESSIONに入れる
	//セッション再取得
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var site_flg = OrderModelBase.SITE_USER;

		if (H_param.site == "shop") {
			site_flg = OrderModelBase.SITE_SHOP;
			var H_g_shop_sess = O_view.getGlobalShopSession();
			H_g_sess = H_g_sess + H_g_shop_sess;
		}

		var O_model = this.get_Model(H_g_sess, site_flg);
		O_view.setSiteMode(site_flg);
		O_view.startCheck();
		O_view.checkCGIParam();
		var H_sess = O_view.getLocalSession();

		if (false == is_numeric(H_sess[OrderInputProc.PUB].carid) || false == is_numeric(H_sess[OrderInputProc.PUB].cirid) || "" == H_sess[OrderInputProc.PUB].type) {
			this.errorOut(15, "OrderInputProc:\u30AA\u30FC\u30C0\u30FC\u60C5\u5831(type,carid,cirid)\u304C\u3042\u308A\u307E\u305B\u3093", false, "../Menu/menu.php");
		}

		var A_auth = O_model.get_AuthIni();
		O_view.clearUnderSession();
		O_view.setOrderPatternSession(O_model);
		H_sess = O_view.getLocalSession();
		header("Location: " + dirname(_SERVER.PHP_SELF) + "/order_form.php");
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};