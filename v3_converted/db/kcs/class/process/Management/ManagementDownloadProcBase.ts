//
//管理情報ダウンロードProccess基底
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報ダウンロードProccess基底
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/27
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの生成 <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//ログインチェック <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//ユーザ設定項目取得 <br>
//ダウンロード環境変数設定 <br>
//ダウンロードファイル名決定 <br>
//ヘッダー行作成<br>
//権限下の部署一覧取得 <br>
//表示するデータ取得 <br>
//csv出力 <br>
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_param
//@access protected
//@return void
//@uses ManagementUtil
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementDownloadProcBase extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //設定弄り
	//ini_set('memory_limit', '2048M');
	//ini_set('memory_limit', '1600M');
	//SUOメモリ足りないので上げる
	//view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//ダウンロード環境変数設定
	//ダウンロードファイル名決定
	//ヘッダー行作成
	//部署ID取得
	//ログに書き込み
	//CSV出力
	{
		ini_set("max_execution_time", 6000);
		ini_set("memory_limit", "2000M");
		var O_view = this.get_View();
		O_view.startCheckDownload();
		var H_g_sess = O_view.getGlobalSession();
		var O_manage = new ManagementUtil();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_download") == false) {
			this.errorOut(6, "", false);
		}

		var H_prop = O_model.getViewProperty();
		O_view.setDLProperty();
		O_view.getFileName(H_sess);
		O_view.getHeaderLine(A_auth, H_prop, H_sess.SELF);
		O_model.setTableName(H_sess[ManagementDownloadProcBase.PUB].cym);
		var A_post = O_model.getPostidList(H_sess[ManagementDownloadProcBase.PUB].current_postid, H_sess[ManagementDownloadProcBase.PUB].posttarget);

		if (strpos(_SERVER.REQUEST_URI, "/Management/Tel") === 0) {
			O_model.insertMngLog(H_g_sess.pactid, H_g_sess.postid, H_g_sess.postname, H_g_sess.userid, H_g_sess.loginname, H_g_sess.loginid, H_sess.SELF.get.dlmode, H_sess[ManagementDownloadProcBase.PUB].cym, H_g_sess.joker);
		}

		var A_data = O_model.getList(H_sess, A_post, true);
		O_view.displayCSV(A_auth, A_data, H_prop, H_sess.SELF, O_model);
	}

	__destruct() {
		super.__destruct();
	}

};