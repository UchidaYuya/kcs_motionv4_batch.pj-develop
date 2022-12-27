//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("process/ProcessBaseHtml.php");

require("view/Management/AddBill/AddBillMasterView.php");

require("model/Management/AddBill/AddBillMasterModel.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillMasterProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMasterView();
	}

	get_Model(H_g_sess) {
		return new AddBillMasterModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//マスタ一覧の取得
	//マスタの数を取得
	//種別の取得
	//検索フォーム
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_addbill_confirm") == false) {
			this.errorOut(6, "", false);
		}

		var H_sess = O_view.getLocalSession();
		var H_list = O_model.getList(H_g_sess.pactid, H_sess.SELF.offset, H_sess.SELF.limit, H_sess.SELF.search, H_sess.SELF.sort);
		var list_cnt = O_model.getListCount(H_g_sess.pactid, H_sess.SELF.search);
		var co_list = O_model.getCoList();
		var search_validate = O_view.makeSearchForm(H_g_sess.pactid, co_list);
		O_view.displaySmarty(H_list, list_cnt);
	}

	__destruct() {
		super.__destruct();
	}

};