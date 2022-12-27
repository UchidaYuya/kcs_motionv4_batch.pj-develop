//
//EV ID削除用のView
//
//更新履歴：<br>
//2010/07/27 前田 作成
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/27
//@filesource
//@uses ManagementDelViewBase
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//EV ID削除用のView
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/27
//@uses ManagementDelViewBase
//@uses ViewFinish
//

require("view/Management/ManagementDelViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author maeda
//@since 2010/07/27
//
//@access public
//@return void
//
//
//各ページ用各権限チェック
//
//@author maeda
//@since 2010/07/27
//
//@access protected
//@return void
//
//
//全て一覧移動固有のsetDeraultSession
//
//@author maeda
//@since 2010/07/27
//
//@access protected
//@return void
//
//
//全て一覧移動固有のcheckCGIParam
//
//@author maeda
//@since 2010/07/27
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author maeda
//@since 2010/07/27
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author maeda
//@since 2010/07/27
//
//@access public
//@return void
//
//public function getHeaderJS(){
//}
//
//各ページ固有のdisplaySmarty
//
//@author maeda
//@since 2010/07/27
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
//@return void
//
//
//エラー画面表示
//
//@author maeda
//@since 2010/07/27
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
//@author maeda
//@since 2010/07/27
//
//@param mixed $O_manage
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/27
//
//@access public
//@return void
//
class EvDelView extends ManagementDelViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_ev_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/Ev/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "EV ID\u524A\u9664"
		};
		return H_link;
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	viewCanNotError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u8ACB\u6C42\u304C\u3042\u308BID\u306E\u524A\u9664\u306F\u3067\u304D\u307E\u305B\u3093\u3002", 0, "./menu.php", "\u623B\u308B");
	}

	endDelView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("ID\u524A\u9664", "/Management/Ev/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};