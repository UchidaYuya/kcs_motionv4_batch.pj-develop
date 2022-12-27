//error_reporting(E_ALL);
//TCPDFの読み込み
//require_once("MtSetting.php");
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

require("view/ViewFinish.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("MtUniqueString.php");

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
//O_Form
//フォームオブジェクト
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
//@author date
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
//getFormDefault
//formの初期値の設定
//@author date
//@since 2015/11/27
//
//@param mixed $H_post
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
//validate
//フォームの値チェック
//@author web
//@since 2015/11/27
//
//@access public
//@return void
//
//
//freezeForm
//freece処理を行う
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//unfreezeForm
//
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//endAddView
//完了画面
//@author date
//@since 2015/11/27
//
//@param array $H_sess
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
class AddBillMasterAddView extends ViewSmarty {
	static PUB = "/Management";

	constructor() //define.iniを読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillMasterAddView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillMasterAddView.PUB]: this.O_Sess.getPub(AddBillMasterAddView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //リセット
	{
		if (_GET.r != "") {
			delete this.H_Local.post;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (_POST.length > 0) {
			this.H_Local.post = _POST;
		}

		this.O_Sess.SetPub(AddBillMasterAddView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			"/Management/AddBill/menu.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7",
			"": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u767B\u9332"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	getFormElement(pactid, co_list) //フォームの設定
	{
		var elem = Array();
		elem.push({
			name: "coid",
			label: "\u7A2E\u5225",
			inputtype: "select",
			data: co_list,
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "class1",
			label: "\u5927\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "class2",
			label: "\u4E2D\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "class3",
			label: "\u5C0F\u5206\u985E",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "productcode",
			label: "\u5546\u54C1\u30B3\u30FC\u30C9",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "spec",
			label: "\u5185\u5BB9\u660E\u7D30",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "cost",
			label: "\u539F\u4FA1\u5358\u4FA1",
			inputtype: "text",
			options: {
				style: "width:90%;",
				maxlength: "9"
			}
		});
		elem.push({
			name: "price",
			label: "\u91D1\u984D\u5358\u4FA1",
			inputtype: "text",
			options: {
				style: "width:90%;",
				maxlength: "9"
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
				addEmptyOption: false
			}
		});
		elem.push({
			name: "comment",
			label: "\u5546\u54C1\u5099\u8003",
			inputtype: "text",
			options: {
				style: "width:90%;"
			}
		});
		elem.push({
			name: "addsubmit",
			label: "\u78BA\u8A8D\u753B\u9762\u3078",
			value: "\u78BA\u8A8D\u753B\u9762\u3078",
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
				onClick: "javascript:location.href='?r=1'"
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
			name: "setuser",
			label: "\u30E6\u30FC\u30B6\u30FC\u8A2D\u5B9A",
			inputtype: "button",
			options: {
				onClick: "setUser();"
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		elem.push({
			name: "userid",
			inputtype: "hidden"
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		return elem;
	}

	getFormRule() //$A_rule[] = array(	"name" => "spec",
	//							"mess" => "内容明細を入力してください。",
	//							"type" => "required",
	//							"format" => null,
	//							"validation" => "client");
	{
		var A_rule = Array();
		A_rule.push({
			name: "class1",
			mess: "\u5927\u5206\u985E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "class1",
			mess: "\u5927\u5206\u985E\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		A_rule.push({
			name: "class2",
			mess: "\u4E2D\u5206\u985E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "class2",
			mess: "\u4E2D\u5206\u985E\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		A_rule.push({
			name: "class3",
			mess: "\u5C0F\u5206\u985E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "class3",
			mess: "\u5C0F\u5206\u985E\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		A_rule.push({
			name: "productcode",
			mess: "\u5546\u54C1\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "productcode",
			mess: "\u5546\u54C1\u30B3\u30FC\u30C9\u306F\u534A\u89D2\u82F1\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRalnumRegex",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "productname",
			mess: "\u5546\u54C1\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "productname",
			mess: "\u5546\u54C1\u540D\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		A_rule.push({
			name: "cost",
			mess: "\u539F\u4FA1\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "cost",
			mess: "\u539F\u4FA1\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "price",
			mess: "\u91D1\u984D\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "price",
			mess: "\u91D1\u984D\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "required",
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
		A_rule.push({
			name: "userid",
			mess: "\u30E6\u30FC\u30B6\u30FC\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "spec",
			mess: "\u5185\u5BB9\u660E\u7D30\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		A_rule.push({
			name: "comment",
			mess: "\u5546\u54C1\u5099\u8003\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		return A_rule;
	}

	getFormDefault(H_post) //postの値がないなら初期値を設定しよう
	//postの値があるならそれを初期値にしよう
	{
		var default = Array();

		if (!!H_post) {
			default = H_post;
		}

		if (undefined !== default.csrfid == false) {
			var O_unique = MtUniqueString.singleton();
			default.csrfid = O_unique.getNewUniqueId();
		}

		if (undefined !== default.registdate == false) {
			default.registdate = {
				Y: date("Y"),
				m: date("m"),
				d: date("d")
			};
		}

		return default;
	}

	makeForm(pactid, co_list) //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	{
		var elem = this.getFormElement(pactid, co_list);
		this.O_FormUtil = new QuickFormUtil("form");
		this.O_FormUtil.setFormElement(elem, co_list);
		this.O_Form = this.O_FormUtil.makeFormObject();
		var A_rule = this.getFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex", "QRForbiddenCharacter"];
		this.O_FormUtil.registerOriginalRules(A_orgrule);
		this.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_FormUtil.makeFormRule(A_rule);
		var default = this.getFormDefault(this.H_Local.post);
		this.O_FormUtil.setDefaultsWrapper(default);
	}

	validate() {
		return this.O_FormUtil.validateWrapper();
	}

	freezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.RecName
		});
		this.O_FormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.NextName
		});
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u3092\u767B\u9332", "/Management/AddBill/menu.php", "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7\u753B\u9762\u3078");
	}

	displaySmarty() //$this->get_Smarty()->assign( "printdate",$printdate);
	//Formの登録
	//smartyに設定
	//templateの取得
	//serachform
	//表示を返す・・・
	{
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());

		if (undefined !== this.H_Local.search) {
			this.get_Smarty().assign("showform", "none");
		} else {
			this.get_Smarty().assign("showform", "block");
		}

		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};