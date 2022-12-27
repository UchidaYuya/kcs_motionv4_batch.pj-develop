//
//汎用ダウンロードProccess
//
//更新履歴：<br>
//2009/02/26 宝子山浩平 作成
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/26
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//汎用ダウンロードProccess
//
//@package VariousDL
//@subpackage Proccess
//@author houshiyama
//@since 2009/02/26
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/VariousDL/Download/VariousDownloadView.php");

require("model/VariousDL/VariousDLModel.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2009/02/26
//
//@param array $H_param
//@access public
//@return void
//
//
//view取得
//
//@author houshiyama
//@since 2009/02/26
//
//@access protected
//@return void
//
//
//モデル取得
//
//@author houshiyama
//@since 2009/02/26
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//パターン情報取得 <br>
//カラム情報作成 <br>
//表示順をセットする <br>
//ソート順をセットする <br>
//ダウンロード環境変数設定 <br>
//ダウンロードファイル名決定 <br>
//ヘッダー行作成<br>
//対象年月からテーブル名決定<br>
//権限下の部署一覧取得 <br>
//部署ID一覧取得 <br>
//表示するデータ取得 <br>
//csv出力 <br>
//
//@author houshiyama
//@since 2009/02/26
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
//@since 2009/02/26
//
//@access public
//@return void
//
class VariousDownloadProc extends ProcessBaseHtml {
	static PUB = "/VariousDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new VariousDownloadView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new VariousDLModel(H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//ソート順をセットする
	//表示順をセットする
	//ダウンロード環境変数設定
	//ダウンロードファイル名決定
	//ヘッダー行作成
	//対象年月からテーブル名決定
	//部署ID取得
	//表示するデータ取得
	{
		var O_view = this.get_View();
		O_view.startCheckDownload();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.getAuthIni();

		if (-1 !== A_auth.indexOf("fnc_vdl_download") == false) {
			this.errorOut(6, "", false);
		}

		var A_pattern = O_model.getSelectPattern(H_sess.post.dlid);

		if (A_pattern.length < 1) //エラー画面表示
			{
				this.errorOut(41, "\u4ED6\u306E\u30E6\u30FC\u30B6\u306B\u3088\u308A\u65E2\u306B\u524A\u9664\u3055\u308C\u3066\u3044\u308B", false);
			}

		O_view.makeColumnForm(O_model, H_sess);
		A_pattern = O_view.setSortNum(A_pattern);
		A_pattern = O_view.setViewNum(A_pattern);
		O_view.setDLProperty(A_pattern[0]);
		O_view.getFileName(H_sess);
		O_view.getHeaderLine(O_model, H_sess, A_pattern);
		O_model.setTableName(H_sess.post.trg_month);
		var A_post = O_model.getPostidList(H_sess.post.recogpostid, H_sess.post.trg_type);
		var A_data = O_model.getList(A_pattern, O_view.H_Element, H_sess, A_post);

		if (-1 !== ["tel", "telpostbill", "telbill"].indexOf(H_sess.mode)) //ログに書き込み
			{
				O_model.insertTelMngLog(H_g_sess.pactid, H_g_sess.postid, H_g_sess.postname, H_g_sess.userid, H_g_sess.loginname, H_g_sess.loginid, H_sess.post.trg_month, H_sess.mode, H_g_sess.joker);
			}

		O_view.displayCSV(O_model, A_data, H_sess);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};