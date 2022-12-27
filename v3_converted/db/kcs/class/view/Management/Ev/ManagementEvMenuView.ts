//
//EV ID一覧のView
//
//更新履歴：<br>
//2010/07/15 前田 作成
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/15
//@filesource
//@uses ManagementMenuViewBase
//
//
//error_reporting(E_ALL);
//
//EV ID一覧のView
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/15
//@uses ManagementMenuViewBase
//

require("view/Management/ManagementMenuViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//EV ID一覧固有のsetDeraultSession
//
//@author maeda
//@since 2010/07/15
//
//@access protected
//@return void
//
//
//EV ID一覧固有のcheckCGIParam
//
//@author maeda
//@since 2010/07/15
//
//@access protected
//@return void
//
//
//EV ID一覧の検索フォームを作成する<br>
//
//EV IDキャリアの配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author maeda
//@since 2010/07/15
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
//EV ID一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
//
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
//
//@param array $H_post
//@access private
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
class ManagementEvMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //EV IDキャリアの配列を生成
	//ユーザ設定項目を取得する
	//検索条件の配列を生成
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//ユーザ設定項目の配列生成
	//文字列、数値、日付項目の検索フォーム作成
	{
		var H_co = O_model.getUseEvCoData(A_post, H_sess[ManagementEvMenuView.PUB].cym, H_sess.SELF.post);
		this.H_Prop = O_model.getManagementProperty(ManagementEvMenuView.EVMID);
		var H_searchcondition = O_manage.getSearchCondition();
		var A_formelement = [{
			name: "evid",
			label: "ID",
			inputtype: "text",
			options: {
				id: "evid",
				size: "25"
			}
		}, {
			name: "evcoid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: H_co
		}, {
			name: "username",
			label: "\u4F7F\u7528\u8005",
			inputtype: "text",
			options: {
				id: "username",
				size: "25"
			}
		}, {
			name: "ev_car_number",
			label: "\u8ECA\u4E21No",
			inputtype: "text",
			options: {
				id: "ev_car_number",
				size: "25"
			}
		}, {
			name: "ev_car_type",
			label: "\u8ECA\u7A2E",
			inputtype: "text",
			options: {
				id: "ev_car_type",
				size: "25"
			}
		}, {
			name: "ev_telno",
			label: "\u96FB\u8A71\u9023\u7D61\u5148",
			inputtype: "text",
			options: {
				id: "ev_telno",
				size: "25"
			}
		}, {
			name: "ev_mail",
			label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "text",
			options: {
				id: "ev_mail",
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