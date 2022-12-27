//
//資産変更のView
//
//更新履歴：<br>
//2008/08/19 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/19
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
//資産変更のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/19
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
//@since 2008/08/19
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/08/19
//
//@access protected
//@return void
//
//
//資産変更固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/08/19
//
//@access protected
//@return void
//
//
//資産変更固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/08/19
//
//@access protected
//@return void
//
//
//資産変更登録フォームを作成する<br>
//
//日付条件の配列を生成<br>
//日付型のフォーマット配列を生成<br>
//フォーム要素の配列を作成<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/08/19
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
//資産変更フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/08/19
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
//@since 2008/08/19
//
//@param mixed $H_sess
//@param mixed $O_manage
//@access public
//@return void
//
//
//資産変更固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/08/19
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
//@since 2008/08/19
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/08/19
//
//@access public
//@return void
//
//
//エラー画面表示
//
//@author houshiyama
//@since 2008/08/19
//
//@access protected
//@return void
//
//
//完了画面表示
//
//@author houshiyama
//@since 2008/08/19
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
//@since 2008/08/19
//
//@access public
//@return void
//
class AssetsModView extends ManagementModViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_us") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() //登録が実行された時
	{
		if (undefined !== _POST.modsubmit == true && _POST.modsubmit == this.NextName) //ajaxの値をフォーム要素に入れる
			{
				for (var key in _POST) {
					var val = _POST[key];

					if (preg_match("/aj/", key) == true) {
						var ajkey = key.replace(/aj/g, "id");
						this.H_Local.post[ajkey] = val;
					}
				}
			}
	}

	makeModForm(O_manage, O_model, H_sess: {} | any[]) //機種IDを取得
	//基底クラスから新規登録フォーム要素取得
	//表示言語分岐
	//クイックフォームオブジェクト生成
	{
		var A_product = split(":", H_sess.SELF.post.productid);
		H_sess.SELF.post.productid = A_product[0];
		var A_formelement = this.getAssetsAddModFormElement(O_manage, O_model, H_sess, "ass", "mod");
		var A_tmp = {
			name: "modsubmit",
			label: this.NextName,
			inputtype: "submit"
		};
		A_formelement.push(A_tmp);

		if (this.O_Sess.language == "ENG") //現在の変更のとき
			{
				if (this.YM == H_sess[AssetsModView.PUB].cym) {
					A_tmp = {
						name: "pastflg",
						label: "Check to update last month's data as well.",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_tmp);
				}
			} else //現在の変更のとき
			{
				if (this.YM == H_sess[AssetsModView.PUB].cym) {
					A_tmp = {
						name: "pastflg",
						label: "\u524D\u6708\u5206\u3082\u5909\u66F4\u3059\u308B\u5834\u5408\u306F\u30C1\u30A7\u30C3\u30AF\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_tmp);
				}
			}

		this.H_View.O_ModFormUtil = new QuickFormUtil("form");
		this.H_View.O_ModFormUtil.setFormElement(A_formelement);
		this.O_ModForm = this.H_View.O_ModFormUtil.makeFormObject();
	}

	makeModRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得
	//ここで使用する自作関数の読込
	//表示言語分岐
	{
		var A_rule = this.getAssetsAddModFormRule("ass");
		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_ModFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_ModFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_ModFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_ModFormUtil.makeFormRule(A_rule);
	}

	checkModKeyCol(H_sess, O_manage) //キーカラムの変更無し
	{
		if (H_sess.post.assetsno == H_sess.get.coid) {
			H_sess.post.pre_assetsno = "";
			return false;
		} else {
			H_sess.post.pre_assetsno = H_sess.get.coid;
			return true;
		}
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	makePankuzuLinkHash() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Assets/menu.php": "Admin informations",
				"": "Property change"
			};
		} else {
			H_link = {
				"/Management/Assets/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u8CC7\u7523\u5909\u66F4"
			};
		}

		return H_link;
	}

	getHeaderJS() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/AssetsAjax.js\"></script>\n";
		} else {
			str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/AssetsAjax.js\"></script>\n";
		}

		return str;
	}

	viewChgKeyError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u8ACB\u6C42\u304C\u3042\u308B\u8CC7\u7523\u306E\u7BA1\u7406\u756A\u53F7\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
	}

	endModView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			O_finish.displayFinish("Property change", "/Management/Assets/menu.php", "To list screen", "", "ENG");
		} else {
			O_finish.displayFinish("\u8CC7\u7523\u5909\u66F4", "/Management/Assets/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
		}
	}

	__destruct() {
		super.__destruct();
	}

};