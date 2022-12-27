//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション注意書きのプロセス実装
//
//更新履歴：<br>
//2008/07/17 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/08/20
//
//
//
//シミュレーション注意書きのプロセス実装
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/08/20
//

require("process/ProcessBaseHtml.php");

require("model/Recom/RecomModel.php");

require("view/Recom/RecomDownloadView.php");

require("model/Recom/RecomResultModel.php");

require("model/Recom/RecomDownloadPropertyModel.php");

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
//@since 2008/10/15
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
class RecomDownloadProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getRecomView() {
		return new RecomDownloadView();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//var_dump( $H_g_sess );	// * DEBUG
	//var_dump( $H_sess );	// * DEBUG
	//パラメータのエラーチェック
	//ユーザー権限一覧を得る
	//結果ダウンロード権限
	{
		var O_view = this.getRecomView();
		O_view.startCheck();
		var O_model = new RecomModel(this.get_DB());
		var H_g_sess = O_view.getGlobalSession();
		var H_sess = O_view.getSelfSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_view.getUserAuth();

		if (-1 !== A_auth.indexOf("fnc_recom_download") == false && -1 !== A_auth.indexOf("fnc_shop_download") == false) //ショップ側の場合、共通ダウンロード権限をあてがう
			{
				this.errorOut(6, "\u7D50\u679C\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u7121\u3044", 0, "javascript:window.close();", "\u9589\u3058\u308B");
			}

		switch (O_view.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				var shopid = 0;
				var user_memid = H_g_sess.userid;
				break;

			case ViewBaseHtml.SITE_SHOP:
				shopid = H_g_sess.shopid;
				user_memid = H_g_sess.memid;
				break;

			default:
				shopid = 0;
				user_memid = 0;
				break;
		}

		var H_view = O_view.getView();
		var O_resultModel = new RecomResultModel();

		if (O_resultModel.checkFile(H_sess.get.simid, H_g_sess.language)) {
			O_view.downloadFile(H_sess.get.simid, H_g_sess.language);
		} else //シミュレーション条件を得る
			//viewに付ける
			//var_dump( $H_cond );	// * DEBUG
			//ダウンロードデータを取得
			//ダウンロード
			{
				var H_cond = O_model.getIndexList(H_g_sess.pactid, shopid, user_memid, 0, H_sess.get.simid, H_g_sess.language);
				H_view.cond = H_cond;
				var H_options = {
					[RecomDownloadPropertyModel.G_SESS]: H_g_sess,
					[RecomDownloadPropertyModel.COND]: H_cond[0]
				};
				var O_property = new RecomDownloadPropertyModel(H_options);
				O_resultModel.setProperty(O_property);
				H_view.H_data = O_resultModel.getDownloadData();
				O_view.displayDownload();
			}
	}

};