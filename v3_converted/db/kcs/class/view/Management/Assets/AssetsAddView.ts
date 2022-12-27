//
//資産新規登録のView
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//資産新規登録のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/18
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
//@since 2008/08/18
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//資産新規登録のsetDeraultSession
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//資産新規登録固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//データの取得を兼ねたパラメータチェック <br>
//
//端末情報取得処理 <br>
//予約重複処理 <br>
//
//@author houshiyama
//@since 2008/07/31
//
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//資産の新規登録フォームを作成する<br>
//
//基底クラスから新規、変更共通フォーム要素取得<br>
//新規登録固有の要素追加<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/08/18
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//資産新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
//
//資産新規登録固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/08/18
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
//@since 2008/08/18
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/08/18
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
//@since 2008/08/18
//
//@param array $H_sess
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
class AssetsAddView extends ManagementAddViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") == false || -1 !== A_auth.indexOf("fnc_assets_manage_adm_us") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() //登録が実行された時
	{
		if (undefined !== _POST.addsubmit == true) //チェックボックス要素
			//ajaxの値をフォーム要素に入れる
			{
				var A_checkBoxElement = ["opaj", "discountaj"];

				for (var key in _POST) {
					var val = _POST[key];

					if (preg_match("/aj/", key) == true) {
						var ajkey = key.replace(/aj/g, "id");
						this.H_Local.post[ajkey] = val;
					}
				}
			}
	}

	getInfoParamCheck(O_model, H_sess: {} | any[]) //登録時の予約の存在チェック
	{
		if (undefined !== _POST.addsubmit === true) {
			O_model.setTableName(H_sess[AssetsAddView.PUB].cym);

			if (O_model.checkAssetsReserveExist(_POST.assetsno) == true) //表示言語分岐
				{
					if (this.O_Sess.language == "ENG") {
						this.H_View.res_mess = "\u203B\n\t\t\t\t\tNew registration reservation with the same admin number is already registered in telephone management reservation.  Registered reservation will be cleared if operation is continued.  ";
					} else {
						this.H_View.res_mess = "\u203B\n\t\t\t\t\t\u5165\u529B\u3055\u308C\u305F\u7BA1\u7406\u756A\u53F7\u3068\u540C\u3058\u65B0\u898F\u767B\u9332\u4E88\u7D04\u304C\u96FB\u8A71\u7BA1\u7406\u4E88\u7D04\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002 \u3053\u306E\u307E\u307E\u64CD\u4F5C\u3092\u7D9A\u884C\u3059\u308B\u3068\u767B\u9332\u6E08\u306E\u4E88\u7D04\u306F\u89E3\u9664\u3055\u308C\u307E\u3059\u3002";
					}
				}
		}
	}

	makeAddForm(O_manage, O_model, H_sess: {} | any[]) //機種IDを取得
	//基底クラスから新規登録フォーム要素取得
	//新規のみの要素追加
	//クイックフォームオブジェクト生成
	{
		var A_product = split(":", H_sess.SELF.post.productid);
		H_sess.SELF.post.productid = A_product[0];
		var A_formelement = this.getAssetsAddModFormElement(O_manage, O_model, H_sess, "ass", "add");
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
	//表示言語分岐
	{
		var A_rule = this.getAssetsAddModFormRule("ass");
		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_AddFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_AddFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_AddFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_AddFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) //予約に関するメッセージ
	{
		this.get_Smarty().assign("res_mess", this.H_View.res_mess);
	}

	makePankuzuLinkHash() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Assets/menu.php": "Admin informations",
				"": "Register new property"
			};
		} else {
			H_link = {
				"/Management/Assets/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u8CC7\u7523\u65B0\u898F\u767B\u9332"
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

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			O_finish.displayFinish("New property registration", "/Management/Assets/menu.php", "To list screen", "", "ENG");
		} else {
			O_finish.displayFinish("\u8CC7\u7523\u65B0\u898F\u767B\u9332", "/Management/Assets/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
		}
	}

	__destruct() {
		super.__destruct();
	}

};