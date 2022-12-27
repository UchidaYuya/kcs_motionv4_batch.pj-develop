//error_reporting(E_ALL|E_STRICT);
//
//DocumentUploadMenuProc
//添付資料管理
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2016/02/15
//

require("process/ProcessBaseHtml.php");

require("view/Management/DocumentUpload/DocumentUploadMenuView.php");

require("model/Management/DocumentUpload/DocumentUploadMenuModel.php");

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
class DocumentUploadMenuProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new DocumentUploadMenuView();
	}

	get_Model(H_g_sess) {
		return new DocumentUploadMenuModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//マスタ一覧の取得
	//マスタの数を取得
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u306A\u3044", false);
		}

		var H_sess = O_view.getLocalSession();

		if (H_g_sess.su) {
			var userid = undefined;
		} else {
			userid = H_g_sess.userid;
		}

		var H_list = O_model.getList(H_g_sess.pactid, H_sess.SELF.offset, H_sess.SELF.limit, H_sess.SELF.sort, userid);
		var list_cnt = O_model.getListCount(H_g_sess.pactid, userid);
		O_view.displaySmarty(H_list, list_cnt);
	}

	__destruct() {
		super.__destruct();
	}

};