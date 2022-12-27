//
//購買一覧のView
//
//更新履歴：<br>
//2008/03/07 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/20
//@filesource
//@uses ManagementMenuViewBase
//
//
//error_reporting(E_ALL);
//
//購買一覧のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/20
//@uses ManagementMenuViewBase
//

require("view/Management/ManagementMenuViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses ManagementUtil
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
//購買一覧の検索フォームを作成する<br>
//
//購買先の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2008/02/21
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
//購買一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
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
//メニューに拡張表示するカラムの配列生成
//
//@author houshiyama
//@since 2008/03/28
//
//@param array $H_post
//@access private
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
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementPurchaseMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //購買先の配列を生成
	//ユーザ設定項目を取得する
	//検索条件の配列を生成
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//ユーザ設定項目の配列生成
	//文字列、数値、日付項目の検索フォーム作成
	{
		var H_co = O_model.getUsePurchCoData(A_post, H_sess[ManagementPurchaseMenuView.PUB].cym, H_sess.SELF.post);
		this.H_Prop = O_model.getManagementProperty(ManagementPurchaseMenuView.PURCHMID);
		var H_searchcondition = O_manage.getSearchCondition();
		var A_formelement = [{
			name: "purchid",
			label: "\u8CFC\u8CB7ID",
			inputtype: "text",
			options: {
				id: "purchid",
				size: "25"
			}
		}, {
			name: "purchcoid",
			label: "\u8CFC\u8CB7\u5148",
			inputtype: "select",
			data: H_co
		}, {
			name: "loginid",
			label: "\u30ED\u30B0\u30A4\u30F3ID",
			inputtype: "text",
			options: {
				id: "loginid",
				size: "25"
			}
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
			name: "registcomp",
			label: "\u767B\u9332\u4F1A\u793E\u540D",
			inputtype: "text",
			options: {
				id: "registcomp",
				size: "25"
			}
		}, {
			name: "registpost",
			label: "\u767B\u9332\u90E8\u7F72\u540D",
			inputtype: "text",
			options: {
				id: "registpost",
				size: "25"
			}
		}, {
			name: "registzip",
			label: "\u767B\u9332\u90F5\u4FBF\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "registzip",
				size: "25"
			}
		}, {
			name: "registaddr",
			label: "\u767B\u9332\u4F4F\u6240",
			inputtype: "text",
			options: {
				id: "registaddr",
				size: "25"
			}
		}, {
			name: "registtelno",
			label: "\u767B\u9332\u96FB\u8A71\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "registtelno",
				size: "25"
			}
		}, {
			name: "registfaxno",
			label: "\u767B\u9332FAX\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "registfaxno",
				size: "25"
			}
		}, {
			name: "registemail",
			label: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "text",
			options: {
				id: "registemail",
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
		H_prop.date.registdate = "\u767B\u9332\u65E5";
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
			loginid: "\u30ED\u30B0\u30A4\u30F3ID",
			employeecode: "\u793E\u54E1\u756A\u53F7",
			registcomp: "\u767B\u9332\u4F1A\u793E\u540D",
			registpost: "\u767B\u9332\u90E8\u7F72\u540D",
			registzip: "\u767B\u9332\u90F5\u4FBF\u756A\u53F7",
			registaddr: "\u767B\u9332\u4F4F\u6240",
			registtelno: "\u767B\u9332\u96FB\u8A71\u756A\u53F7",
			registfaxno: "\u767B\u9332FAX\u756A\u53F7",
			registemail: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
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