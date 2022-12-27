//管理記録ダウンロード
//20160316伊達
//error_reporting(E_ALL|E_STRICT);
//
//AddBillDownloadProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2016/03/15
//

require("process/ProcessBaseHtml.php");

require("BillUtil.php");

require("view/Management/ManagementLogDownloadView.php");

require("model/Management/ManagementLogModel.php");

//
//ディレクトリ名
//
//
//__construct
//
//@author web
//@since 2016/03/16
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author web
//@since 2016/03/16
//
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_g_sess
//@param mixed $O_bill
//@abstract
//@access protected
//@return void
//@uses TransitMenuModel
//
//
//doExecute
//だうんろーど
//@author web
//@since 2015/12/01
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
class ManagementLogDownloadProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementLogDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementLogModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//ダウンロード環境変数設定
	//全てダウンロードなら検索条件を消す
	//// 表示するデータ取得
	//		$H_list= $O_model->getList(
	//							$H_g_sess["pactid"],
	//							0,	//	offset
	//							0,	//	limit
	//							$H_sess["SELF"]["search"],
	//							$H_sess["SELF"]["sort"],
	//							$userid
	//						);
	//CSV出力
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();
		O_view.setDLProperty();

		if (_GET.full == "true") {
			delete H_sess.SELF.search;
		}

		var H_list = O_model.getList(A_auth, H_sess, false);
		O_view.displayCSV(H_list[1], A_auth);
	}

	__destruct() {
		super.__destruct();
	}

};