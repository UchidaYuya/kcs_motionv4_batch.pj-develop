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
//フォームの作成
//
//アップロードボタン作る
//
//@author date
//@since 2015/08/13
//
//@param $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses QuickFormUtil
//
//
//フォームの作成
//
//アップロードボタン作る
//
//@author date
//@since 2015/08/13
//
//@param $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses QuickFormUtil
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
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
class ManagementDocumentMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeAddForm(O_manage: ManagementUtil) //表示言語分岐
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
			{
				var A_formelement = [{
					name: "submit",
					label: "Upload",
					inputtype: "submit"
				}];
			} else //フォーム要素の配列作成
			{
				A_formelement = [{
					name: "submit",
					label: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
					inputtype: "submit"
				}];
			}

		this.H_View.O_AddFormUtil = new QuickFormUtil("addform");
		this.H_View.O_AddFormUtil.setFormElement(A_formelement);
		this.O_AddForm = this.H_View.O_AddFormUtil.makeFormObject();
	}

	makeLookForm(O_manage: ManagementUtil) //表示言語分岐
	//クイックフォームオブジェクト生成
	//デフォルト値
	{
		var A_formelement = Array();
		var H_radio = {
			only: ["\u81EA\u90E8\u7F72\u306E\u307F", {
				id: "post_only",
				onClick: "setDownloadDisable(0)"
			}],
			under: ["\u914D\u4E0B\u90E8\u7F72\u3082\u542B\u3080", {
				id: "post_under",
				onClick: "setDownloadDisable(1)"
			}]
		};

		if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
			{
				A_formelement.push({
					name: "target_post",
					label: "\u90E8\u7F72\u9078\u629E",
					inputtype: "radio",
					data: H_radio,
					options: {
						id: "target_post"
					}
				});
			} else //フォーム要素の配列作成
			{
				A_formelement.push({
					name: "target_post",
					label: "\u90E8\u7F72\u9078\u629E",
					inputtype: "radio",
					data: H_radio,
					options: {
						id: "target_post"
					}
				});
			}

		this.H_View.O_LookFormUtil = new QuickFormUtil("lookform");
		this.H_View.O_LookFormUtil.setFormElement(A_formelement);
		this.O_LookForm = this.H_View.O_LookFormUtil.makeFormObject();
		this.H_View.O_LookFormUtil.setDefaultsWrapper({
			target_post: "under"
		});
	}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) {}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) {}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) //QuickFormとSmartyの合体
	//assaign
	//ここじゃないほうがいいかも
	//ここじゃないほうがいいかも
	//ページ固有の表示処理
	//display
	{
		var O_headrenderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_HeaderForm.accept(O_headrenderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("monthly_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("showform", this.getShowForm(H_sess.SELF.post));
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_headerform", O_headrenderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("doc_post", A_data[2]);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("A_manage_auth", this.getManageVwAuthIni(A_auth));
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[ManagementDocumentMenuView.PUB].cym));
		this.get_Smarty().assign("cym", H_sess[ManagementDocumentMenuView.PUB].cym);
		this.get_Smarty().assign("current_postid", H_sess[ManagementDocumentMenuView.PUB].current_postid);
		this.get_Smarty().assign("invisible_monthly_bar", true);
		this.get_Smarty().assign("invisible_post_select", true);
		this.makeAddForm(O_manage);
		var O_addform = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_AddForm.accept(O_addform);
		this.get_Smarty().assign("O_addform", O_addform.toArray());
		this.makeLookForm(O_manage);
		var O_lookform = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_LookForm.accept(O_lookform);
		this.get_Smarty().assign("O_lookform", O_lookform.toArray());
		this.displaySmartyPeculiar(H_sess, A_data, A_auth, O_manage);
		this.get_Smarty().display(this.getDefaultTemplate());
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