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
//検索フォームのルール作成
//
//@author date
//@since 2015/06/15
//
//@access public
//@return void
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
class ManagementHealthcareMenuView extends ManagementMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //運送会社の配列を生成
	//検索条件の配列を生成
	//表示言語分岐
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//// 表示言語分岐
	//		if( $this->O_Sess->language == "ENG" ){
	//			// 日付条件の配列を生成
	//			$H_datecondition = $O_manage->getDateConditionEng();
	//			// 日付型のフォーマット配列を生成
	//			$H_date = $O_manage->getDateFormatEng();
	//		}
	//		else{
	//			// 日付条件の配列を生成
	//			$H_datecondition = $O_manage->getDateCondition();
	//			// 日付型のフォーマット配列を生成
	//			$H_date = $O_manage->getDateFormat();
	//		}
	//		// 日付項目
	//		// 表示言語分岐（配列の順序が違う）
	//		if( $this->O_Sess->language == "ENG" ){
	//			$A_dategroup = array( array( "name" => "condition",
	//										 "label" => "条件",
	//										 "inputtype" => "select",
	//										 "data" => $H_datecondition ),
	//								  array( "name" => "val",
	//										 "label" => "値",
	//										 "inputtype" => "date",
	//										 "data" => $H_date ) );
	//		}
	//		else{
	//			$A_dategroup = array( array( "name" => "val",
	//										 "label" => "値",
	//										 "inputtype" => "date",
	//										 "data" => $H_date ),
	//								  array( "name" => "condition",
	//										 "label" => "条件",
	//										 "inputtype" => "select",
	//										 "data" => $H_datecondition ) );
	//		}
	//		// グループをオブジェクトに追加
	//		$this->H_View["O_SearchFormUtil"]->setFormElement( $A_dategroup );
	//		$A_group = $this->H_View["O_SearchFormUtil"]->createFormElement( $A_dategroup );
	//		// 表示言語分岐
	//		if( $this->O_Sess->language == "ENG" ){
	//			$this->H_View["O_SearchFormUtil"]->addGroupWrapper( $A_group, "registdate", "登録日", array( "&nbsp;is&nbsp;", "&nbsp;&nbsp;" ) );
	//		}
	//		else{
	//			$this->H_View["O_SearchFormUtil"]->addGroupWrapper( $A_group, "registdate", "登録日", array( "&nbsp;が&nbsp;", "&nbsp;&nbsp;" ) );
	//		}
	//		// ユーザ設定項目の配列生成
	//	//	$H_prop = $this->makeSearchPropertyElement( $this->H_Prop );
	//		// 文字列、数値、日付項目の検索フォーム作成
	//	//	$this->makePropertyForm( $this->H_View["O_SearchFormUtil"], $H_prop, $O_manage );a
	{
		var H_co = O_model.getUseHealthcareCoData(A_post, H_sess[ManagementHealthcareMenuView.PUB].cym, H_sess.SELF.post);
		var H_searchcondition = O_manage.getSearchCondition();

		if (this.O_Sess.language == "ENG") //日付条件の配列を生成
			//日付型のフォーマット配列を生成
			{
				var H_datecondition = O_manage.getDateConditionEng();
				var H_date = O_manage.getDateFormatEng();
			} else //日付条件の配列を生成
			//日付型のフォーマット配列を生成
			{
				H_datecondition = O_manage.getDateCondition();
				H_date = O_manage.getDateFormat();
			}

		var A_formelement = [{
			name: "healthid",
			label: "\u30D8\u30EB\u30B9\u30B1\u30A2ID",
			inputtype: "text",
			options: {
				id: "healthid",
				size: "25"
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
			name: "healthcoid",
			label: "\u53D6\u5F97\u5148",
			inputtype: "select",
			data: H_co
		}, {
			name: "employeecode",
			label: "\u793E\u54E1\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "employeecode",
				size: "25"
			}
		}, {
			name: "registdate_condition",
			label: "\u6761\u4EF6",
			inputtype: "select",
			data: H_datecondition
		}, {
			name: "registdate",
			label: "\u767B\u9332\u65E5",
			inputtype: "date",
			data: H_date
		}, {
			name: "remarks",
			label: "\u5099\u8003",
			inputtype: "text",
			options: {
				id: "remarks",
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
				onClick: "javascript:resetHealthFormValue()"
			}
		}];
		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
	}

	makeSearchRule() //必要なら追加するといい
	//$A_grouprule = $this->makePropertyFormRule();
	//ここで使用する自作関数の読込
	//表示言語分岐
	//$this->H_View["O_SearchFormUtil"]->makeFormRule( $A_grouprule );
	{
		var A_rule = Array();
		A_rule.push({
			name: "registdate",
			mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		});
		var A_orgrule = ["QRSelectAndTextInput", "QRSelectAndNumeric", "QRSelectAndCheckDate"];
		this.H_View.O_SearchFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_SearchFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_SearchFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) //拡張表示項目はなし
	//拡張管理項目は、追加管理項目の内容を表示一覧の項目として表示するかどうかだよ
	//// 拡張表示項目一覧取得
	//		$H_addcol = $this->getAddViewColArray( $H_sess["SELF"]["post"] );
	//		// 拡張表示項目で検索されたもの取得
	//		$H_viewcol = $this->getAddViewCol( $H_addcol, $H_sess["SELF"]["post"] );
	//var_dump( $H_viewcol );
	//		// 拡張表示項目
	//		$this->get_Smarty()->assign( "H_viewcol", $H_viewcol );
	{}

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