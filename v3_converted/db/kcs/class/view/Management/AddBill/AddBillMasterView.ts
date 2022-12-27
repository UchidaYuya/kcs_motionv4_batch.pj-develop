//error_reporting(E_ALL);
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//H_ini
//add_bill.iniの中身
//@var mixed
//@access protected
//
//
//__construct
//コンストラクタ
//@author web
//@since 2015/11/13
//
//@access public
//@return void
//
//
//getLocalSession
//ローカルセッションの取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author web
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//makePankuzuLinkHash
//パンくずリスト
//@author date
//@since 2015/11/12
//
//@access public
//@return void
//
//
//getFormElement
//一覧表示のForm
//@author 伊達
//@since 2015/12/01
//
//@access private
//@return void
//
//
//getFormDefault
//Formの初期値の設定
//@author web
//@since 2015/12/01
//
//@access private
//@return void
//
//
//makeAddForm
//新規登録ボタンの作成
//@author web
//@since 2015/11/16
//
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//getSearchFormElement
//フォームエレメント
//@author date
//@since 2015/11/27
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getFormRule
//ルールの取得を行う
//@author date
//@since 2015/11/27
//
//@access private
//@return void
//
//
//makeSearchForm
//
//@author web
//@since 2015/11/30
//
//@param mixed $pactid
//@access public
//@return void
//
//
//displaySmarty
//displaySmarty
//@author date
//@since 2015/11/02
//
//@param array $H_sess
//@param array $A_data
//@param array $A_auth
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillMasterView extends ViewSmarty {
	static PUB = "/Management";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillMasterView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillMasterView.PUB]: this.O_Sess.getPub(AddBillMasterView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() {
		if (!_POST) {
			this.clearLastForm();
		}

		if (undefined !== this.H_Local.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.management_limit == true) {
					this.H_Local.limit = _COOKIE.management_limit;
				} else {
					this.H_Local.limit = 10;
				}
			}

		if (undefined !== _POST.limit) //0以上の時のみ代入する
			{
				if (_POST.limit > 0) {
					this.H_Local.limit = _POST.limit;
				}
			}

		if (undefined !== this.H_Local.sort == false) {
			this.H_Local.sort = "0,a";
		}

		if (undefined !== _POST.search) {
			this.H_Local.search = _POST;
		}

		if (!(undefined !== this.H_Local.search)) {
			this.H_Local.search = Array();

			if (undefined !== this.H_Local.search.search_condition == false) {
				this.H_Local.search.search_condition = "AND";
			}
		}

		if (undefined !== this.H_Local.offset == false) {
			this.H_Local.offset = 1;
		}

		if (!!_GET.p) {
			this.H_Local.offset = _GET.p;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (!!_GET.s) {
			this.H_Local.sort = _GET.s;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		this.O_Sess.SetPub(AddBillMasterView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() {
		var H_link = {
			"": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	getFormElement() //フォーム要素の配列作成
	//$elem[] = array("name" => "viewchange",
	//						"label" => "変更",
	//						"inputtype" => "submit");
	//		$elem[] = array("name" => "freesearch",
	//						"label" => "検索",
	//						"inputtype" => "submit");
	//		
	//		$elem[] = array("name" => "freereset",
	//						"label" => "リセット",
	//						"inputtype" => "submit");
	//新規登録
	{
		var elem = Array();
		elem.push({
			name: "add",
			label: "\u65B0\u898F\u767B\u9332",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='AddBillMasterAdd.php';",
				style: "height:22;width:70;"
			}
		});
		elem.push({
			name: "limit",
			label: "\u8868\u793A\u4EF6\u6570",
			inputtype: "text",
			options: {
				size: "3",
				maxlength: "3"
			}
		});
		elem.push({
			name: "view",
			label: "\u8868\u793A",
			inputtype: "submit"
		});
		elem.push({
			name: "delete",
			label: "\u524A\u9664\u3059\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoDeletePage();"
			}
		});
		elem.push({
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='/Menu/menu.php';"
			}
		});
		elem.push({
			name: "create",
			label: "\u65B0\u898F\u767B\u9332",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='/Management/AddBill/AddBillMasterAdd.php';"
			}
		});
		return elem;
	}

	getFormDefault() {
		var default = Array();
		default.limit = this.H_Local.limit;
		return default;
	}

	makeForm() //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//フォームに初期値設定。
	//$util->setDefaultsWrapper( $default );
	//検索結果で0を指定された時に反映しないようにするためにこうした
	//登録するぽよ
	//smartyに設定
	{
		var element = this.getFormElement();
		var util = new QuickFormUtil("addform");
		util.setFormElement(element);
		var form = util.makeFormObject();
		var default = this.getFormDefault();
		form.setConstants(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
	}

	getSearchFormElement(pactid, co_list) //フォームの設定
	//登録日の以上、以下、当日などの設定
	//"options" => array( "onClick" => "javascript:location.href='?r=1'" ) );
	{
		var elem = Array();
		co_list = {
			"": "--"
		} + co_list;
		elem.push({
			name: "coid",
			label: "\u7A2E\u5225",
			inputtype: "select",
			data: co_list,
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "class1",
			label: "\u5927\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "class2",
			label: "\u4E2D\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "class3",
			label: "\u5C0F\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "productcode",
			label: "\u5546\u54C1\u30B3\u30FC\u30C9",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "spec",
			label: "\u5185\u5BB9\u660E\u7D30",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "cost",
			label: "\u539F\u4FA1\u5358\u4FA1",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "price",
			label: "\u91D1\u984D\u5358\u4FA1",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		var year = date("Y");
		elem.push({
			name: "registdate",
			label: "\u767B\u9332\u65E5",
			inputtype: "date",
			data: {
				minYear: year,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "registdate_sub",
			inputtype: "select",
			data: {
				"=": "\u3068\u7B49\u3057\u3044",
				"<=": "\u3088\u308A\u524D",
				">=": "\u3088\u308A\u5F8C"
			}
		});
		elem.push({
			name: "comment",
			label: "\u5546\u54C1\u5099\u8003",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "search_condition",
			label: "\u691C\u7D22\u6761\u4EF6",
			inputtype: "radio",
			data: {
				AND: ["AND"],
				OR: ["OR"]
			}
		});
		elem.push({
			name: "search",
			label: "\u691C\u7D22",
			value: "\u691C\u7D22",
			inputtype: "submit"
		});
		elem.push({
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
			}
		});
		elem.push({
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "resetSearch();"
			}
		});
		elem.push({
			name: "cancel",
			label: "\u4E00\u89A7\u753B\u9762\u306B\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel('/Management/AddBill/menu.php')"
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		return elem;
	}

	getSearchFormRule() ////	QRalnumRegexを指定すると必須扱いになってしまうので一旦外しておく。
	//		$A_rule[] = array(	"name" => "productcode",
	//							"mess" => "商品コードは半角英数字で入力してください。",
	//							"type" => "QRalnumRegex",
	//							"format" => null,
	//							"validation" => "client");
	{
		var A_rule = Array();
		A_rule.push({
			name: "cost",
			mess: "\u539F\u4FA1\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "price",
			mess: "\u91D1\u984D\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "registdate",
			mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		return A_rule;
	}

	makeSearchForm(pactid, co_list) //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	//登録するぽよ
	//smartyに設定
	//validatorの値を返す
	{
		var elem = this.getSearchFormElement(pactid, co_list);
		var util = new QuickFormUtil("form");
		util.setFormElement(elem);
		var form = util.makeFormObject();
		var A_rule = this.getSearchFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		util.registerOriginalRules(A_orgrule);
		util.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		util.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		util.makeFormRule(A_rule);
		util.setDefaultsWrapper(this.H_Local.search);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_searchform", render.toArray());
		return util.validateWrapper();
	}

	displaySmarty(H_list, list_cnt) //$this->get_Smarty()->assign( "printdate",$printdate);
	//serachform
	//templateの取得
	//123456789のやつ
	//Formの登録
	//表示を返す・・・
	{
		var search = this.H_Local.search;
		delete search.search_condition;

		if (!!search) {
			this.get_Smarty().assign("showform", "block");
		} else {
			this.get_Smarty().assign("showform", "none");
		}

		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("list_cnt", list_cnt);
		var page_link = MakePageLink.makePageLinkHTML(list_cnt, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("page_link", page_link);
		this.makeForm();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};