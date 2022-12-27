//
//請求ダウンロードProccess基底
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@filesource
//@uses ProcessBaseHtml
//@uses BillUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//請求ダウンロードProccess基底
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@uses ProcessBaseHtml
//@uses BillUtil
//

require("process/ProcessBaseHtml.php");

require("BillUtil.php");

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
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの生成 <br>
//セッション情報取得（グローバル） <br>
//請求用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//ログインチェック <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//ユーザ設定項目取得 <br>
//ダウンロード環境変数設定 <br>
//ダウンロードファイル名決定 <br>
//ヘッダー行作成<br>
//表示するデータ取得 <br>
//csv出力 <br>
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_param
//@access protected
//@return void
//@uses BillUtil
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
class BillDownloadProcBase extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//科目情報取得
	//ダウンロードファイル名決定
	//ヘッダー行作成
	//表示するデータ取得
	//CSV出力
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_bill = new BillUtil();
		var O_model = this.get_Model(H_g_sess, O_bill);
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_download") == false) {
			this.errorOut(6, "", false);
		}

		O_view.setDLProperty();
		var H_kamoku = O_model.getKamokuData(false, H_g_sess.pactid);
		O_view.getFileName(H_sess.SELF.dlmode);
		O_view.getHeaderLine(H_kamoku, A_auth, H_sess.SELF);
		var A_data = O_model.getList(H_sess, true, O_view);
		O_view.displayCSV(A_auth, H_kamoku, H_sess.SELF, A_data, O_model);
	}

	__destruct() {
		super.__destruct();
	}

};