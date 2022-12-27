//
//全て一覧のView
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementMenuViewBase
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//全て一覧のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@uses ManagementMenuViewBase
//@uses QuickFormUtil
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
//全て一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@access protected
//@return void
//
//
//全て一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@access protected
//@return void
//
//
//管理が唯一ならばタブを出さずにそのページへ移動する <br>
//
//@author houshiyama
//@since 2008/04/04
//
//EV管理対応  2010/07/20 s.maeda
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//全て一覧の検索フォームを作成する<br>
//
//管理種別の配列を生成<br>
//日付条件の配列を生成<br>
//日付型のフォーマット配列を生成<br>
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
//検索フォームのルール作成
//
//@author houshiyama
//@since 2008/04/08
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
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	checkLocation(A_auth) {
		var A_vwauth = this.getManageVwAuthIni(A_auth);

		if (A_vwauth.length == 0) {
			this.errorOut(6, "\u8868\u793A\u53EF\u80FD\u306A\u7BA1\u7406\u60C5\u5831\u304C\u306A\u3044", false, "/Menu/menu.php");
		}

		if (A_vwauth.length == 1) //電話管理しかない
			{
				if (A_vwauth[0] == "fnc_tel_manage_vw") {
					MtExceptReload.raise("/Management/Tel/menu.php");
				}

				if (A_vwauth[0] == "fnc_etc_manage_vw") {
					MtExceptReload.raise("/Management/ETC/menu.php");
				}

				if (A_vwauth[0] == "fnc_purch_manage_vw") {
					MtExceptReload.raise("/Management/Purchase/menu.php");
				}

				if (A_vwauth[0] == "fnc_copy_manage_vw") {
					MtExceptReload.raise("/Management/Copy/menu.php");
				}

				if (A_vwauth[0] == "fnc_assets_manage_vw") {
					MtExceptReload.raise("/Management/Assets/menu.php");
				}

				if (A_vwauth[0] == "fnc_tran_manage_vw") {
					MtExceptReload.raise("/Management/Transit/menu.php");
				}

				if (A_vwauth[0] == "fnc_ev_manage_vw") {
					MtExceptReload.raise("/Management/Ev/menu.php");
				}
			}
	}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //検索条件の配列を生成
	//表示言語分岐
	//クイックフォームオブジェクト生成
	//表示言語分岐
	{
		var H_searchcondition = O_manage.getSearchCondition();

		if (this.O_Sess.language == "ENG") //管理種別の配列を生成
			//フォーム要素の配列作成
			{
				var H_mid = O_model.getUsableManagementTypeEng(true);
				var A_formelement = [{
					name: "manageno",
					label: "Admin No",
					inputtype: "text",
					options: {
						id: "manageno"
					}
				}, {
					name: "mid",
					label: "Admin type",
					inputtype: "select",
					data: H_mid
				}, {
					name: "contract",
					label: "Carrier",
					inputtype: "text",
					options: {
						id: "contract"
					}
				}, {
					name: "note",
					label: "Note",
					inputtype: "text",
					options: {
						id: "note"
					}
				}, {
					name: "username",
					label: "User",
					inputtype: "text",
					options: {
						id: "username"
					}
				}, {
					name: "search_condition",
					label: "\u691C\u7D22\u6761\u4EF6",
					inputtype: "radio",
					data: H_searchcondition
				}, {
					name: "search",
					label: "Search",
					inputtype: "submit"
				}, {
					name: "reset",
					label: "Reset",
					inputtype: "button",
					options: {
						onClick: "javascript:resetFormValue()"
					}
				}];
			} else //管理種別の配列を生成
			//フォーム要素の配列作成
			{
				H_mid = O_model.getUsableManagementType(true);
				A_formelement = [{
					name: "manageno",
					label: "\u7BA1\u7406\u756A\u53F7",
					inputtype: "text",
					options: {
						id: "manageno"
					}
				}, {
					name: "mid",
					label: "\u7BA1\u7406\u7A2E\u5225",
					inputtype: "select",
					data: H_mid
				}, {
					name: "contract",
					label: "\u5951\u7D04\u4F1A\u793E",
					inputtype: "text",
					options: {
						id: "contract"
					}
				}, {
					name: "note",
					label: "\u5099\u8003",
					inputtype: "text",
					options: {
						id: "note"
					}
				}, {
					name: "username",
					label: "\u4F7F\u7528\u8005",
					inputtype: "text",
					options: {
						id: "username"
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
			}

		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();

		if (this.O_Sess.language == "ENG") //日付条件の配列を生成
			//日付型のフォーマット配列を生成
			//契約日用グループの配列作成
			//グループをオブジェクトに追加
			{
				var H_datecondition = O_manage.getDateConditionEng();
				var H_date = O_manage.getDateFormatEng();
				var A_groupelement = [{
					name: "condition",
					label: "\u6761\u4EF6",
					inputtype: "select",
					data: H_datecondition
				}, {
					name: "val",
					label: "\u65E5\u4ED8",
					inputtype: "date",
					data: H_date
				}];
				this.H_View.O_SearchFormUtil.setFormElement(A_groupelement);
				var A_group = this.H_View.O_SearchFormUtil.createFormElement(A_groupelement);
				this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "contractdate", "Contracted date", ["&nbsp;&nbsp;"]);
			} else //日付条件の配列を生成
			//日付型のフォーマット配列を生成
			//契約日用グループの配列作成
			//グループをオブジェクトに追加
			{
				H_datecondition = O_manage.getDateCondition();
				H_date = O_manage.getDateFormat();
				A_groupelement = [{
					name: "val",
					label: "\u65E5\u4ED8",
					inputtype: "date",
					data: H_date
				}, {
					name: "condition",
					label: "\u6761\u4EF6",
					inputtype: "select",
					data: H_datecondition
				}];
				this.H_View.O_SearchFormUtil.setFormElement(A_groupelement);
				A_group = this.H_View.O_SearchFormUtil.createFormElement(A_groupelement);
				this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "contractdate", "\u5951\u7D04\u65E5", ["&nbsp;\u3068&nbsp;"]);
			}
	}

	makeSearchRule() //表示言語分岐
	//ここで使用する自作関数の読込
	//表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var A_grouprule = [{
				name: "contractdate",
				mess: "Specify a contract date in full date, month, and year.  Non-existent dates are not allowed",
				type: "QRSelectAndCheckDateAllList",
				format: undefined,
				validation: "client"
			}];
		} else {
			A_grouprule = [{
				name: "contractdate",
				mess: "\u5951\u7D04\u65E5\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
				type: "QRSelectAndCheckDateAllList",
				format: undefined,
				validation: "client"
			}];
		}

		var A_orgrule = ["QRSelectAndCheckDateAllList"];
		this.H_View.O_SearchFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_SearchFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_SearchFormUtil.makeFormRule(A_grouprule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) {}

	makePankuzuLinkHash() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"": "Admin informations"
			};
		} else {
			H_link = {
				"": "\u7BA1\u7406\u60C5\u5831"
			};
		}

		return H_link;
	}

	getHeaderJS() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var str = "<script language=\"Javascript\" src=\"/js/eng/Management/ManagementMenu.js\"></script>";
		} else {
			str = "<script language=\"Javascript\" src=\"/js/Management/ManagementMenu.js\"></script>";
		}

		return str;
	}

	__destruct() {
		super.__destruct();
	}

};