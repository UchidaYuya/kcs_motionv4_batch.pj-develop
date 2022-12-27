//
//購買請求のView
//
//更新履歴：<br>
//2008/03/07 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/23
//@uses BillDetailsViewBase
//
//
//error_reporting(E_ALL);
//
//購買請求のView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/23
//@uses BillDetailsViewBase
//

require("view/Bill/BillDetailsViewBase.php");

require("MtAuthority.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return void
//@uses BillUtil
//
//
//購買一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/23
//
//@access protected
//@return void
//
//
//購買一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/04/23
//
//@access protected
//@return void
//
//
//購買一覧の検索フォームを作成する<br>
//
//管理種別の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2008/04/23
//
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses BillUtil
//@uses QuickFormUtil
//
//
//検索フォームのルール作成
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return void
//
//
//購買一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
//
//@author houshiyama
//@since 2008/04/23
//
//@param mixed $H_session
//@param mixed $A_data
//@param mixed $A_auth
//@param mixed $O_model
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/23
//
//@access public
//@return void
//
class BillPurchaseDetailsView extends BillDetailsViewBase {
		constructor() {
				super();
		}

		setDefaultSessionPeculiar() {}

		checkCGIParamPeculiar() //初期アクセス時ＩＤをセッションに入れリロード
		{
				if (undefined !== _GET.id == true) {
						var A_id = split(":", _GET.id);
						this.H_Local.get.purchid = A_id[0];
						this.H_Local.get.purchcoid = A_id[1];
						this.O_Sess.setSelfAll(this.H_Local);
						MtExceptReload.raise(undefined);
				}

				if (undefined !== this.H_Local.get == false) {
						this.errorOut(15, "get\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u7121\u3044", false);
				}
		}

		makeSearchForm(O_bill: BillUtil, O_model) //管理種別の配列を生成
		//科目の配列を生成
		//金額条件の配列を取得
		//表示形式の配列を取得
		//フォーム要素の配列作成
		//クイックフォームオブジェクト生成
		{
				var H_co = O_model.getPurchCoData();
				var H_kamoku = O_model.getKamokuData(false, this.O_Sess.pactid);
				var H_cond = O_bill.getMoneyCondition();
				var H_mode = O_bill.getPurchViewMode();
				var A_formelement = [{
						name: "purchid",
						label: "\u8CFC\u8CB7ID",
						inputtype: "text",
						options: {
								id: "purchid",
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
						name: "kamoku",
						label: "\u79D1\u76EE\u304C",
						inputtype: "select",
						data: H_kamoku,
						options: {
								id: "kamoku"
						}
				}, {
						name: "kamokuprice",
						label: "\u91D1\u984D\u304C",
						inputtype: "text",
						options: {
								id: "kamokuprice",
								size: "25"
						}
				}, {
						name: "kamokuprice_condition",
						label: "\u6761\u4EF6",
						inputtype: "select",
						data: H_cond,
						options: {
								id: "kamokucondition"
						}
				}, {
						name: "slipno",
						label: "\u4F1D\u7968\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "slipno",
								size: "25"
						}
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
				}, {
						name: "purchcoid",
						label: "\u8CFC\u8CB7\u5148",
						inputtype: "select",
						data: H_co,
						options: {
								id: "purchcoid"
						}
				}, {
						name: "comodbutton",
						label: "\u5909\u66F4",
						inputtype: "button",
						options: {
								onClick: "javascript:submitCoForm()"
						}
				}, {
						name: "mode",
						label: "\u8868\u793A\u5F62\u5F0F",
						inputtype: "select",
						data: H_mode,
						options: {
								id: "mode"
						}
				}, {
						name: "modebutton",
						label: "\u5909\u66F4",
						inputtype: "button",
						options: {
								onClick: "javascript:submitModeForm()"
						}
				}, {
						name: "limit",
						label: "\u691C\u7D22\u7D50\u679C\u3092",
						inputtype: "text",
						options: {
								id: "limit",
								size: "3",
								maxlength: "3"
						}
				}, {
						name: "limitbutton",
						label: "\u8868\u793A",
						inputtype: "button",
						options: {
								onClick: "javascript:submitLimitForm()"
						}
				}];
				this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
				this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
				this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
		}

		makeSearchRule() //ここで使用する自作関数の読込
		{
				var A_grouprule = [{
						name: "int",
						mess: "\u6570\u5024\u9805\u76EE\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "QRSelectAndNumeric",
						format: undefined,
						validation: "client"
				}, {
						name: "date",
						mess: "\u65E5\u4ED8\u9805\u76EE\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
						type: "QRSelectAndCheckDate",
						format: undefined,
						validation: "client"
				}];
				var A_orgrule = ["QRSelectAndNumeric", "QRSelectAndCheckDate"];
				this.H_View.O_SearchFormUtil.registerOriginalRules(A_orgrule);
				this.H_View.O_SearchFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				this.H_View.O_SearchFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
				this.H_View.O_SearchFormUtil.makeFormRule(A_grouprule);
		}

		displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model) //タブ作成
		//購買ID
		//購買先
		{
				var year = H_sess[BillPurchaseDetailsView.PUB].cym.substr(0, 4);
				var month = H_sess[BillPurchaseDetailsView.PUB].cym.substr(4, 2);
				var O_auth = MtAuthority.singleton(this.O_Sess.pactid);
				createTabBill5(this.get_Smarty(), year, month, H_sess[BillPurchaseDetailsView.PUB].current_postid, false, "purchase", O_auth, this.O_Sess.userid);
				this.get_Smarty().assign("purchid", H_sess.SELF.get.purchid);
				var A_co = O_model.getPurchCoData();
				this.get_Smarty().assign("purchconame", A_co[H_sess.SELF.get.purchcoid]);
		}

		makePankuzuLinkHash() {
				var H_link = {
						"/Bill/Purchase/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u8ACB\u6C42\u660E\u7D30"
				};
				return H_link;
		}

		getHeaderJS() {
				var str = "<script language=\"Javascript\" src=\"/js/Bill/BillMenu.js\"></script>";
				return str;
		}

		__destruct() {
				super.__destruct();
		}

};