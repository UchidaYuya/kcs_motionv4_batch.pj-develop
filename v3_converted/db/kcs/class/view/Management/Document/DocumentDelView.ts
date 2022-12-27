//
//運送ID削除用のView
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementDelViewBase
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//運送ID削除用のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@uses ManagementDelViewBase
//@uses ViewFinish
//

require("view/Management/ManagementDelViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//全て一覧移動固有のsetDeraultSession
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//全て一覧移動固有のcheckCGIParam
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//削除画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//メニューから来たときはCGIパラメータを配列に入れる<br>
//submitが実行されたら配列に入れる<br>
//リセットが実行されたら配列を消してリロード<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
//@return void
//
//
//パラメータチェック <br>
//処理対象の存在チェック <br>
//2重登録防止チェック <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//エラー画面表示
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $O_manage
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class DocumentDelView extends ManagementDelViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	checkCGIParam() //menuから来たとき
	{
		if (undefined !== _GET.docid == true) //$this->H_Local["trg_list"] = $_POST;
			{
				this.H_Local.docid = _GET.docid;
			}

		if (undefined !== _POST.delsubmit == true) {
			this.H_Local.post = _POST;
		}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.O_Sess.setPub(DocumentDelView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/Document/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "\u6DFB\u4ED8\u8CC7\u6599\u524A\u9664"
		};
		return H_link;
	}

	getHeaderJS() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	//リストが無ければ2重登録エラー（リストは正常終了時に消すため）
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF.docid == false) {
			this.errorOut(8, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}
	}

	viewCanNotError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u524A\u9664\u306F\u3067\u304D\u307E\u305B\u3093\u3002", 0, "./menu.php", "\u623B\u308B");
	}

	endDelView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u6DFB\u4ED8\u8CC7\u6599\u524A\u9664", "/Management/Document/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};