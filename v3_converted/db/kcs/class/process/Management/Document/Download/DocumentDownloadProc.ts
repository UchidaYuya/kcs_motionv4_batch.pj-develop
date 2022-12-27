//
//添付資料管理DL
//
//error_reporting(E_ALL|E_STRICT);
//
//DocumentDownloadProc
//添付資料管理修正
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2016/05/24
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Document/Download/DocumentDownloadView.php");

require("model/Management/Document/Download/DocumentDownloadModel.php");

//
//ディレクトリ名
//
//
//__construct
//
//@author date
//@since 2016/05/24
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author date
//@since 2016/05/24
//
//@access protected
//@return void
//
//
//get_Model
//
//@author web
//@since 2016/05/24
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2016/05/24
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author date
//@since 2016/05/24
//
//@access public
//@return void
//
class DocumentDownloadProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new DocumentDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new DocumentDownloadModel(this.get_DB(), H_g_sess, O_manage);
	}

	doExecute(H_param: {} | any[] = Array()) //idの取得
	//設定弄り
	//ini_set('memory_limit', '2048M');
	//view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//ダウンロード環境変数設定
	//添付資料管理の情報を取得
	//ダウンロードファイル名決定
	//ヘッダー行作成
	//部署ID取得
	//表示するデータ取得
	//CSV出力
	{
		var docid = _GET.docid;
		ini_set("max_execution_time", 6000);
		ini_set("memory_limit", "1600M");
		var O_view = this.get_View();
		O_view.startCheckDownload();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_document_manage_dl") == false) {
			this.errorOut(6, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		var H_prop = Array();
		O_view.setDLProperty();
		var H_document = O_model.getDocument(H_g_sess.pactid, docid);
		O_view.setFileName(H_document.title);
		O_view.getHeaderLine(A_auth, H_prop, H_sess.SELF);
		O_model.setTableName(H_sess[DocumentDownloadProc.PUB].cym);
		var A_post = O_model.getPostidList(H_sess[DocumentDownloadProc.PUB].current_postid, H_sess[DocumentDownloadProc.PUB].posttarget);
		var A_data = O_model.getList(A_post, _GET.docid, H_document.use_header);
		O_model.insertMngLog(H_document.title, H_g_sess.pactid, H_g_sess.postid, H_g_sess.postname, H_g_sess.userid, H_g_sess.loginname, H_g_sess.loginid, H_g_sess.joker);
		O_view.displayCSV(A_auth, A_data, H_prop, H_sess.SELF, O_model);
	}

	__destruct() {
		super.__destruct();
	}

};