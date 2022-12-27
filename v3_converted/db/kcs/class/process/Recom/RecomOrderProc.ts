//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション電話１件のプラン変更
//
//更新履歴：<br>
//2008/09/16 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/09/16
//
//
//require_once("model/Recom/RecomModel.php");
//
//シミュレーション電話１件のプラン変更
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/08/20
//

require("process/ProcessBaseHtml.php");

require("model/Order/OrderTelInfoModel.php");

require("model/Order/OrderMainModel.php");

require("view/Recom/RecomOrderView.php");

require("view/Order/OrderInputTelView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/08/20
//
//@param array $H_param
//@access public
//@return void
//
//
//ここで必要となるViewを返す<br/>
//Hotline側と切り替えるための仕組み<br/>
//
//@author nakanita
//@since 2008/09/18
//
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/07/17
//
//@param array $H_param
//@access protected
//@return void
//
class RecomOrderProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomOrderView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得
	//var_dump( $H_g_sess );	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//電話情報モデルの生成
	//引数のHashを準備
	//Orderに必要な電話情報を付ける
	//ムーバの買増はFOMAへの移行に飛ばす by kitamura 2009/05/27
	//オーダーパターンが得られなかった
	//販売店が紐付いていなかった場合に生じる
	//OrderFormに飛ぶ
	//var_dump( $_SESSION );	// * DEBUG
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);

		if (O_view.getSiteMode() == ViewBaseHtml.SITE_SHOP) {
			var order_site = OrderModelBase.SITE_SHOP;
		} else {
			order_site = OrderModelBase.SITE_USER;
		}

		var O_telinfo_model = new OrderTelInfoModel(this.get_DB(), H_g_sess, order_site);
		H_order_sess.SELF.telno = H_sess.post.telno;
		H_order_sess["/MTOrder"].carid = H_sess.post.carid;
		var H_telinfo = O_telinfo_model.checkTelInfoOne(H_order_sess, H_g_sess);
		var O_inputtel_view = new OrderInputTelView();
		O_inputtel_view.setTelInfoSession(H_telinfo);

		if ("C" === H_sess.post.ordermode && 1 == H_sess.post.carid && 2 == H_sess.post.cirid) //CDMA1xの買増はWINへの移行に飛ばす by kitamura 2009/05/28
			{
				H_sess.post.ordermode = "S";
				H_sess.post.cirid = 1;
			} else if ("C" === H_sess.post.ordermode && 3 == H_sess.post.carid && 8 == H_sess.post.cirid) {
			H_sess.post.ordermode = "S";
			H_sess.post.cirid = 9;
		}

		H_order_dir.type = H_sess.post.ordermode;
		H_order_dir.carid = H_sess.post.carid;
		H_order_dir.cirid = H_sess.post.cirid;
		var H_order_pattern = O_telinfo_model.getOrderPatternName(H_order_dir);

		if (is_null(H_order_pattern) || H_order_pattern.length == 0) //ユーザー側、Shop側で戻り先が異なる
			{
				switch (O_view.getSiteMode()) {
					case ViewBaseHtml.SITE_USER:
						var backurl = "RecomResult.php";
						break;

					case ViewBaseHtml.SITE_SHOP:
						backurl = "RecomHotlineResult.php";
						break;

					default:
						backurl = "RecomResult.php";
						break;
				}

				this.errorOut(26, "\u8CA9\u58F2\u5E97\u672A\u767B\u9332\u3001\u30AA\u30FC\u30C0\u30FC\u30D1\u30BF\u30FC\u30F3\u304C\u5F97\u3089\u308C\u306A\u304B\u3063\u305F", 0, backurl);
				throw die(0);
			}

		O_view.setOrderSession(H_order_pattern, H_sess);
		O_view.gotoNextPage();
	}

};