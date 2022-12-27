//
//資産一覧のView
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
//資産一覧のView
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
//資産一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//資産一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//資産一覧の検索フォームを作成する<br>
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
//資産一覧固有のdisplaySmarty
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
class ManagementAssetsMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() //登録が実行された時
	{
		if (undefined !== _POST.search == true) //ajaxの値をフォーム要素に入れる
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

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //資産種別の配列を生成
	//電話会社の配列を生成
	//キャリアの指定がある時
	//端末種別取得
	//ユーザ設定項目を取得する
	//検索条件の配列を生成
	//クイックフォームオブジェクト生成
	//ユーザ設定項目の配列生成
	//表示言語分岐
	//文字列、数値、日付項目の検索フォーム作成
	{
		var H_type = O_model.getAssetsTypeData();
		var H_co = O_model.getUseCarrierData(A_post, H_sess[ManagementAssetsMenuView.PUB].cym, H_sess.SELF.post);

		if (undefined !== H_sess.SELF.post.carid == true && H_sess.SELF.post.carid != "") //回線の指定あり
			{
				var carid = H_sess.SELF.post.carid;
				var cirid = "";

				if (undefined !== H_sess.SELF.post.carid == true && H_sess.SELF.post.carid != "") {
					cirid = H_sess.SELF.post.cirid;
				}

				var H_cir = O_model.getCircuitDataForAssets(carid);
			} else //回線種別の配列を生成
			{
				if (this.O_Sess.language == "ENG") {
					H_cir = {
						"": "--Please select a carrier--"
					};
				} else {
					H_cir = {
						"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
					};
				}
			}

		var H_smpcirid = O_model.getSmartCircuitData();
		this.H_Prop = O_model.getManagementProperty(ManagementAssetsMenuView.ASSMID);
		var H_searchcondition = O_manage.getSearchCondition();

		if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
			{
				var A_formelement = [{
					name: "assetsno",
					label: "Admin number",
					inputtype: "text",
					options: {
						id: "assetsno",
						size: "25"
					}
				}, {
					name: "assetstypeid",
					label: "Property type",
					inputtype: "select",
					data: H_type,
					options: {
						id: "assetstypeid"
					}
				}, {
					name: "username",
					label: "User",
					inputtype: "text",
					options: {
						id: "username",
						size: "25"
					}
				}, {
					name: "employeecode",
					label: "Employee number",
					inputtype: "text",
					options: {
						id: "employeecode",
						size: "25"
					}
				}, {
					name: "serialno",
					label: "IMEI number",
					inputtype: "text",
					options: {
						id: "serialno",
						size: "25"
					}
				}, {
					name: "productname",
					label: "Product name",
					inputtype: "text",
					options: {
						id: "productname",
						size: "25"
					}
				}, {
					name: "property",
					label: "Color",
					inputtype: "text",
					options: {
						id: "property",
						size: "25"
					}
				}, {
					name: "firmware",
					label: "Firmware",
					inputtype: "text",
					options: {
						id: "firmware",
						size: "25"
					}
				}, {
					name: "version",
					label: "Version",
					inputtype: "text",
					options: {
						id: "version",
						size: "25"
					}
				}, {
					name: "smpcirid",
					label: "Handset type",
					inputtype: "select",
					options: {
						id: "smpcirid"
					},
					data: H_smpcirid
				}, {
					name: "accessory",
					label: "Accessory",
					inputtype: "text",
					options: {
						id: "accessory",
						size: "25"
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
			} else //フォーム要素の配列作成
			{
				A_formelement = [{
					name: "assetsno",
					label: "\u7BA1\u7406\u756A\u53F7",
					inputtype: "text",
					options: {
						id: "assetsno",
						size: "25"
					}
				}, {
					name: "assetstypeid",
					label: "\u8CC7\u7523\u7A2E\u5225",
					inputtype: "select",
					data: H_type,
					options: {
						id: "assetstypeid"
					}
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
					name: "serialno",
					label: "\u88FD\u9020\u756A\u53F7",
					inputtype: "text",
					options: {
						id: "serialno",
						size: "25"
					}
				}, {
					name: "productname",
					label: "\u88FD\u54C1\u540D",
					inputtype: "text",
					options: {
						id: "productname",
						size: "25"
					}
				}, {
					name: "property",
					label: "\u8272",
					inputtype: "text",
					options: {
						id: "property",
						size: "25"
					}
				}, {
					name: "firmware",
					label: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
					inputtype: "text",
					options: {
						id: "firmware",
						size: "25"
					}
				}, {
					name: "version",
					label: "\u30D0\u30FC\u30B8\u30E7\u30F3",
					inputtype: "text",
					options: {
						id: "version",
						size: "25"
					}
				}, {
					name: "smpcirid",
					label: "\u7AEF\u672B\u7A2E\u5225",
					inputtype: "select",
					options: {
						id: "smpcirid"
					},
					data: H_smpcirid
				}, {
					name: "accessory",
					label: "\u4ED8\u5C5E\u54C1",
					inputtype: "text",
					options: {
						id: "accessory",
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
			}

		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
		var H_prop = this.makeSearchPropertyElement(this.H_Prop);

		if (this.O_Sess.language == "ENG") {
			H_prop.int.bought_price = "Purchase cost";
			H_prop.int.pay_frequency = "At the time of installment payment";
			H_prop.int.pay_monthly_sum = "Payment of monthly installment";
			H_prop.date.bought_date = "Purchase date";
			H_prop.date.pay_startdate = "First month of installment month";
		} else {
			H_prop.int.bought_price = "\u53D6\u5F97\u4FA1\u683C";
			H_prop.int.pay_frequency = "\u5272\u8CE6\u56DE\u6570";
			H_prop.int.pay_monthly_sum = "\u5272\u8CE6\u6708\u984D";
			H_prop.date.bought_date = "\u8CFC\u5165\u65E5";
			H_prop.date.pay_startdate = "\u5272\u8CE6\u958B\u59CB\u6708";
		}

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

	getDownloadLink() {}

	getHeaderJS() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/ManagementMenu.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/AssetsAjax.js\"></script>\n";
		} else {
			str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/ManagementMenu.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/AssetsAjax.js\"></script>\n";
		}

		return str;
	}

	__destruct() {
		super.__destruct();
	}

};