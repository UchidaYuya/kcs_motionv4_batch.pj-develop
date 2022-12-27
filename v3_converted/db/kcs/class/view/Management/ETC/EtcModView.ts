//
//ETC変更のView
//
//更新履歴：<br>
//2008/04/02 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//ETC変更のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//

require("view/Management/ManagementModViewBase.php");

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
//ETC変更固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//ETC変更固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@access protected
//@return void
//
//
//ETC新規登録フォームを作成する<br>
//
//日付条件の配列を生成<br>
//日付型のフォーマット配列を生成<br>
//フォーム要素の配列を作成<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/04/02
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//ETCカード変更フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
//
//キーカラムの変更が無ければfalse <br>
//キーカラムの変更があればtrue <br>
//キーカラムの変更があれば変更前のキーを保持（DBに書込むため） <br>
//
//@author houshiyama
//@since 2008/04/02
//
//@param mixed $H_sess
//@param mixed $O_manage
//@access public
//@return void
//
//
//ETCカード変更固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/04/02
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
//@since 2008/04/02
//
//@access public
//@return array
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
//エラー画面表示
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//完了画面表示
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $H_sess
//@access protected
//@return void
//@uses ViewFinish
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
class EtcModView extends ManagementModViewBase {
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

	makeModForm(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォーム要素取得
	//現在の変更のとき
	{
		var A_formelement = this.getEtcAddModFormElement(O_manage, O_model, H_sess);
		var A_tmp = {
			name: "modsubmit",
			label: this.NextName,
			inputtype: "submit"
		};
		A_formelement.push(A_tmp);

		if (date("Ym") == H_sess[EtcModView.PUB].cym) {
			A_tmp = {
				name: "pastflg",
				label: "\u524D\u6708\u5206\u3082\u5909\u66F4\u3059\u308B\u5834\u5408\u306F\u30C1\u30A7\u30C3\u30AF\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044",
				inputtype: "checkbox",
				options: "1"
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_ModFormUtil = new QuickFormUtil("form");
		this.H_View.O_ModFormUtil.setFormElement(A_formelement);
		this.O_ModForm = this.H_View.O_ModFormUtil.makeFormObject();
	}

	makeModRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得
	//ここで使用する自作関数の読込
	{
		var A_rule = this.getEtcAddModFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_ModFormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_ModFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_ModFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_ModFormUtil.makeFormRule(A_rule);
	}

	checkModKeyCol(H_sess, O_manage) //キーカラムの変更無し
	{
		if (O_manage.convertNoView(H_sess.post.cardno_view) == H_sess.get.manageno) {
			H_sess.post.pre_cardno = "";
			return false;
		} else {
			H_sess.post.pre_cardno = H_sess.get.manageno;
			return true;
		}
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/ETC/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "ETC\u5909\u66F4"
		};
		return H_link;
	}

	getHeaderJS() {}

	viewChgKeyError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u8ACB\u6C42\u304C\u3042\u308BETC\u30AB\u30FC\u30C9\u306EETC\u30AB\u30FC\u30C9\u756A\u53F7\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
	}

	endModView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("ETC\u30AB\u30FC\u30C9\u5909\u66F4", "/Management/ETC/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};