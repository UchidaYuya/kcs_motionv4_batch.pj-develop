//
//エクセルファイルダウンロードProccess
//
//更新履歴：<br>
//2008/07/01 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/01
//@filesource
//@uses ProcessBaseHtml
//@uses ManagementUtil
//
//
//error_reporting(E_ALL|E_STRICT);
//
//エクセルファイル生成Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/01
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/ExcelDL/ExcelDownloadView.php");

require("MtUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/07/01
//
//@abstract
//@access protected
//@return void
//
//
//プロセス実行のメイン
//
//@author houshiyama
//@since 2008/07/01
//
//@param array $H_param
//@access protected
//@return void
//
class ExcelDownloadProc extends ProcessBaseHtml {
	static PUB = "/ExcelDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ExcelDownloadView();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//ログインチェック
	//セッション情報取得（ローカル）
	//ファイルの存在チェック（無ければここで終了）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//ダウンロード実行
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		O_view.checkFileExist(H_sess.SELF.post.fkey);
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();
		O_view.execDL(H_sess.SELF.post.fkey);
		throw die();
	}

};