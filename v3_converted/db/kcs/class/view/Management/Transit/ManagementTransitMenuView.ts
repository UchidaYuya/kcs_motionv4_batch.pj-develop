//
//運送一覧のView
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementMenuViewBase
//
//
//error_reporting(E_ALL);
//
//運送一覧のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@uses ManagementMenuViewBase
//

require("view/Management/ManagementMenuViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//運送一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//運送一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//運送一覧の検索フォームを作成する<br>
//
//運送会社の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//運送一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
//
//
//メニューに拡張表示するカラムの配列生成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_post
//@access private
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return array
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
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class ManagementTransitMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //運送会社の配列を生成
	//ユーザ設定項目を取得する
	//検索条件の配列を生成
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//ユーザ設定項目の配列生成
	//文字列、数値、日付項目の検索フォーム作成
	{
		var H_co = O_model.getUsetranCoData(A_post, H_sess[ManagementTransitMenuView.PUB].cym, H_sess.SELF.post);
		this.H_Prop = O_model.getManagementProperty(ManagementTransitMenuView.TRANMID);
		var H_searchcondition = O_manage.getSearchCondition();
		var A_formelement = [{
			name: "tranid",
			label: "\u904B\u9001ID",
			inputtype: "text",
			options: {
				id: "tranid",
				size: "25"
			}
		}, {
			name: "trancoid",
			label: "\u904B\u9001\u4F1A\u793E",
			inputtype: "select",
			data: H_co
		}, {
			name: "username",
			label: "\u62C5\u5F53",
			inputtype: "text",
			options: {
				id: "username",
				size: "25"
			}
		}, {
			name: "employeecode",
			label: "\u793E\u54E1\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "employeecode",
				size: "25"
			}
		}, {
			name: "search_condition",
			label: "\u691C\u7D22\u6761\u4EF6",
			inputtype: "radio",
			data: H_searchcondition
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:resetFormValue()"
			}
		}];
		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
		var H_prop = this.makeSearchPropertyElement(this.H_Prop);
		this.makePropertyForm(this.H_View.O_SearchFormUtil, H_prop, O_manage);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) //拡張表示項目一覧取得
	//拡張表示項目で検索されたもの取得
	//拡張表示項目
	{
		var H_addcol = this.getAddViewColArray(H_sess.SELF.post);
		var H_viewcol = this.getAddViewCol(H_addcol, H_sess.SELF.post);
		this.get_Smarty().assign("H_viewcol", H_viewcol);
	}

	getAddViewColArray(H_post: {} | any[]) //ユーザ設定項目の配列生成
	{
		var H_prop = this.makeSearchPropertyElement(this.H_Prop);

		if (undefined !== H_post.text == false) {
			H_post.text.column = "";
		}

		if (undefined !== H_post.int == false) {
			H_post.int.column = "";
		}

		if (undefined !== H_post.date == false) {
			H_post.date.column = "";
		}

		if (undefined !== H_post.mail == false) {
			H_post.mail.column = "";
		}

		if (undefined !== H_post.url == false) {
			H_post.url.column = "";
		}

		var H_addcol = {
			employeecode: "\u793E\u54E1\u756A\u53F7",
			text: H_prop.text[H_post.text.column],
			int: H_prop.int[H_post.int.column],
			date: H_prop.date[H_post.date.column],
			mail: H_prop.mail[H_post.mail.column],
			url: H_prop.url[H_post.url.column]
		};
		return H_addcol;
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u7BA1\u7406\u60C5\u5831"
		};
		return H_link;
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/Management/ManagementMenu.js\"></script>";
		return str;
	}

	__destruct() {
		super.__destruct();
	}

};