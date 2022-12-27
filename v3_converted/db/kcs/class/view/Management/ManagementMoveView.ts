//
//全て一覧用移動のView
//
//更新履歴：<br>
//2008/03/17 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementMoveViewBase
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//全て一覧用移動のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/17
//@uses ManagementMoveViewBase
//@uses ViewFinish
//

require("view/Management/ManagementMoveViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//@uses ManagementUtil
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
//全て一覧移動固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/03/13
//
//@access protected
//@return void
//
//
//全て一覧移動固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/13
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/03/03
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
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
//@since 2008/09/04
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
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementMoveView extends ManagementMoveViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makePankuzuLinkHash() {
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/menu.php": "Admin informations",
				"": "Shift of Admin informations"
			};
		} else {
			H_link = {
				"/Management/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u7BA1\u7406\u60C5\u5831\u79FB\u52D5"
			};
		}

		return H_link;
	}

	getHeaderJS() {}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	endMoveView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	//表示言語分岐
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			O_finish.displayFinish("Shift of Admin informations", "./menu.php", "To list screen", "", "ENG");
		} else {
			O_finish.displayFinish("\u7BA1\u7406\u60C5\u5831\u79FB\u52D5", "./menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
		}
	}

	__destruct() {
		super.__destruct();
	}

};