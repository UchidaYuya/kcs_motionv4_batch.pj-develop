//
//ETC削除用のView
//
//更新履歴：<br>
//2008/04/02 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementDelViewBase
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//ETC削除用のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
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
//@since 2008/04/02
//
//@access public
//@return void
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/04/25
//
//@access protected
//@return void
//
//
//ETC移動固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//ETC移動固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/04/02
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
//@return void
//
//
//エラー画面表示
//
//@author houshiyama
//@since 2008/04/02
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
//@since 2008/04/02
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
//@since 2008/04/02
//
//@access public
//@return void
//
class EtcDelView extends ManagementDelViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_etc_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/ETC/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "ETC\u524A\u9664"
		};
		return H_link;
	}

	getHeaderJS() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	viewCanNotError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u8ACB\u6C42\u304C\u3042\u308BETC\u30AB\u30FC\u30C9\u306E\u524A\u9664\u306F\u3067\u304D\u307E\u305B\u3093\u3002", 0, "./menu.php", "\u623B\u308B");
	}

	endDelView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("ETC\u524A\u9664", "/Management/ETC/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};