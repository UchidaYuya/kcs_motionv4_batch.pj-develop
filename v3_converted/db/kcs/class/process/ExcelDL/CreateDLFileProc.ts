//
//エクセルファイル生成Proccess
//
//更新履歴：<br>
//2008/06/25 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/25
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
//@since 2008/06/25
//@uses ProcessBaseHtml
//@uses ManagementUtil
//

require("process/ProcessBaseHtml.php");

require("view/ExcelDL/CreateDLFileView.php");

require("model/ExcelDL/CreateDLFileModel.php");

require("MtUtil.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/23
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/06/23
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/06/23
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス実行のメイン
//
//時間がかかるので
//viewオブジェクトの生成
//関数集のオブジェクトの生成
//modelオブジェクトの生成
//ログインチェック
//権限一覧取得
//セッション情報取得（ローカル）
//パラメータのエラーチェック
//表示に必要なものを格納する配列を取得
//プログレスバーの生成
//スプレッドシートのインスタンスの生成
//スプレッドシートのフォーマットの生成
//シートの生成
//Smartyによる表示
//部署情報取得
//スプレッドシートの表紙シートの生成
//出力データファイル作成
//印刷時の改ページ
//ページ数取得
//ここでviewのファイルをclose
//Smartyによる表示
//
//@author houshiyama
//@since 2008/06/24
//
//@param array $H_param
//@access protected
//@return void
//
class CreateDLFileProc extends ProcessBaseHtml {
	static PUB = "/ExcelDL";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CreateDLFileView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new CreateDLFileModel(H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //時間がかかるので
	//viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//表示に必要なものを格納する配列を取得
	//プログレスバーの生成
	//スプレッドシートのインスタンスの生成
	//スプレッドシートのフォーマットの生成
	//シートの生成
	//Smartyによる表示
	//部署情報取得
	//スプレッドシートの表紙シートの生成
	//出力データファイル作成
	//印刷時の改ページ
	//ページ数取得
	//ここでviewのファイルをclose
	//Smartyによる表示
	{
		set_time_limit(1800);
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_util = new MtUtil();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		var H_view = O_view.get_View();
		O_view.makeProgressBar();
		O_view.makeBookInstance(H_sess.SELF.post.mtype);
		O_view.makeBookFormat();
		O_view.makeSheet();
		O_view.displaySmarty();
		var H_postdata = O_model.getPostData(H_sess.SELF.post.postid, H_sess.SELF.post.cym);
		O_view.makeBookCover(H_g_sess, H_sess, H_postdata, O_model);
		var H_data = O_model.getList(H_g_sess, H_sess, O_util, O_view);
		var page_cnt = Math.ceil((O_view.row_no - O_view.cover_row) / O_view.limit_row) * O_view.limit_row;

		if (O_view.cover_row > 0) {
			page_cnt++;
		}

		O_view.H_View.O_sheet.fitToPages(1, page_cnt);
		O_view.H_View.O_book.close();
		O_view.displaySmartyEnd();
	}

};