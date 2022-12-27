//
//購買ID新規登録のView
//
//更新履歴：<br>
//2008/03/10 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//購買ID新規登録のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/10
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//

require("view/Management/ManagementAddViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/03/10
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
//購買一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@access protected
//@return void
//
//
//購買一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@access protected
//@return void
//
//
//購買IDの新規登録フォームを作成する<br>
//
//基底クラスから新規、変更共通フォーム要素取得<br>
//新規登録固有の要素追加<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/03/10
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//購買ID新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/03/10
//
//@access public
//@return void
//
//
//全て一覧固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/03/03
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return array
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
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_sess
//@access protected
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
class PurchaseAddView extends ManagementAddViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_purch_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeAddForm(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォーム要素取得
	//クイックフォームオブジェクト生成
	{
		var A_formelement = this.getPurchaseAddModFormElement(O_manage, O_model, H_sess);
		var A_tmp = {
			name: "addsubmit",
			label: this.NextName,
			inputtype: "submit"
		};
		A_formelement.push(A_tmp);
		A_tmp = {
			name: "flag",
			label: "",
			inputtype: "hidden"
		};
		A_formelement.push(A_tmp);
		this.H_View.O_AddFormUtil = new QuickFormUtil("form");
		this.H_View.O_AddFormUtil.setFormElement(A_formelement);
		this.O_AddForm = this.H_View.O_AddFormUtil.makeFormObject();
	}

	makeAddRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得
	//ここで使用する自作関数の読込
	{
		var A_rule = this.getPurchaseAddModFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_AddFormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_AddFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_AddFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_AddFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/Purchase/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "\u8CFC\u8CB7ID\u65B0\u898F\u767B\u9332"
		};
		return H_link;
	}

	getHeaderJS() {}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u8CFC\u8CB7ID\u65B0\u898F\u767B\u9332", "/Management/Purchase/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};