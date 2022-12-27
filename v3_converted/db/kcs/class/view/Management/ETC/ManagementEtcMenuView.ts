//
//ETC一覧のView
//
//更新履歴：<br>
//2008/04/03 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/03
//@filesource
//@uses ManagementMenuViewBase
//
//
//error_reporting(E_ALL);
//
//ETC一覧のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/03
//@uses ManagementMenuViewBase
//

require("view/Management/ManagementMenuViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ETC一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//ETC一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//ETC一覧の検索フォームを作成する<br>
//
//カード会社の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_sess
//@param array $A_post
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//ETC一覧固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/04/03
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
//@since 2008/04/03
//
//@param array $H_post
//@access private
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return array
//
//
//ダウンロードリンクを作成し返す
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return void
//
class ManagementEtcMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //カード会社の配列を生成
	//ユーザ設定項目を取得する
	//検索条件の配列を生成
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//ユーザ設定項目の配列生成
	//文字列、数値、日付項目の検索フォーム作成
	{
		var H_co = O_model.getUseEtcCoData(A_post, H_sess[ManagementEtcMenuView.PUB].cym, H_sess.SELF.post);
		this.H_Prop = O_model.getManagementProperty(ManagementEtcMenuView.ETCMID);
		var H_searchcondition = O_manage.getSearchCondition();
		var A_formelement = [{
			name: "cardno",
			label: "\u30AB\u30FC\u30C9\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "cardno",
				size: "25"
			}
		}, {
			name: "cardcoid",
			label: "\u30AB\u30FC\u30C9\u4F1A\u793E",
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
			name: "employeecode",
			label: "\u793E\u54E1\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "employeecode",
				size: "25"
			}
		}, {
			name: "card_meigi",
			label: "\u30AB\u30FC\u30C9\u540D\u7FA9",
			inputtype: "text",
			options: {
				id: "card_meigi",
				size: "25"
			}
		}, {
			name: "card_corpno",
			label: "\u6CD5\u4EBA\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "card_corpno",
				size: "25"
			}
		}, {
			name: "bill_cardno",
			label: "\u30AB\u30FC\u30C9\u756A\u53F72",
			inputtype: "text",
			options: {
				id: "bill_cardno",
				size: "25"
			}
		}, {
			name: "card_corpname",
			label: "\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D",
			inputtype: "text",
			options: {
				id: "card_corpname",
				size: "25"
			}
		}, {
			name: "card_membername",
			label: "\u30AB\u30FC\u30C9\u4F1A\u54E1\u540D\u79F0",
			inputtype: "text",
			options: {
				id: "card_membername",
				size: "25"
			}
		}, {
			name: "car_no",
			label: "\u8ECA\u4E21\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "car_no",
				size: "25"
			}
		}, {
			name: "userid",
			label: "\u8ACB\u6C42\u95B2\u89A7\u8005",
			inputtype: "text",
			options: {
				id: "memo",
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
			card_corpno: "\u6CD5\u4EBA\u756A\u53F7",
			bill_cardno: "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u756A\u53F7",
			card_corpname: "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D",
			car_no: "\u8ECA\u4E21\u756A\u53F7",
			userid: "\u8ACB\u6C42\u95B2\u89A7\u8005",
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

	getDownloadLink() {}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/Management/ManagementMenu.js\"></script>";
		return str;
	}

	__destruct() {
		super.__destruct();
	}

};