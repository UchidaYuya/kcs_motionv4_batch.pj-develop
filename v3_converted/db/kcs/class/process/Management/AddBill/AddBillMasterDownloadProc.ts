//
//運送請求明細ダウンロードProccess
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@filesource
//@uses BillDownloadProcBase
//@uses TransitDownloadView
//@uses TransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送請求明細ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@uses BillDownloadProcBase
//@uses TransitDownloadView
//@uses TransitMenuModel
//

require("process/ProcessBaseHtml.php");

require("BillUtil.php");

require("view/Management/AddBill/AddBillMasterDownloadView.php");

require("model/Management/AddBill/AddBillMasterModel.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/04/28
//
//@abstract
//@access protected
//@return void
//@uses TransitDownloadView
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
class AddBillMasterDownloadProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMasterDownloadView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new AddBillMasterModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//権限チェック
	//表示するデータ取得
	//CSV出力
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_addbill_confirm") == false) {
			this.errorOut(6, "", false);
		}

		O_view.setDLProperty();
		var H_data = O_model.getList(H_g_sess.pactid, 0, 0, H_sess.SELF.search, H_sess.SELF.sort);
		O_view.displayCSV(H_data);
	}

	__destruct() {
		super.__destruct();
	}

};