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
class AddBillAddView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.menu_uri = "";
		this.FuncName = "\u767B\u9332";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillAddView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillAddView.PUB]: this.O_Sess.getPub(AddBillAddView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //リセット
	//GETパラメーターは削除する
	{
		var menu_sess = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
		this.menu_uri = menu_sess.menu_uri;

		if (_GET.r != "") //$this->O_Sess->SetSelfAll($this->H_Local);
			//header("Location: " . $_SERVER["PHP_SELF"]);
			//exit();
			{
				delete this.H_Local.post;
			}

		if (_POST.length > 0) {
			this.H_Local.post = _POST;
		}

		if (!!_GET.pid) {
			this.H_Dir.pid = _GET.pid;
		}

		if (!this.H_Dir.pid) {
			this.H_Dir.pid = _SESSION.postid;
		}

		if (!!_POST) {
			this.H_Local.post = _POST;
			this.H_Local.post.delivery_dest = stripslashes(_POST.delivery_dest);
		}

		this.O_Sess.SetPub(AddBillAddView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			[this.menu_uri]: "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7",
			"": "\u8FFD\u52A0\u767B\u9332"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	makeSelectData(A_data) {
		var res = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		if (!!A_data) {
			for (var value of Object.values(A_data)) {
				res[value] = value;
			}
		}

		return res;
	}

	getFormElement(pactid, co_list, class1, class2, class3, productcode, productname) ////	種別の取得
	//		$types = array();
	//		if( isset( $this->H_ini[$pactid] ) ){
	//			$temp = explode(",",$this->H_ini[$pactid]["type"]);
	//		}else{
	//			$temp = explode(",",$this->H_ini[0]["type"]);
	//		}
	//		//	種別を加工する
	//		//	0=>種別となっているのを種別=>種別に変更する:
	//		$types = array();
	//		foreach( $temp as $value ){
	//			$types[$value] = $value;
	//		}
	//フォームの設定
	//$elem[] = array("name" => "submit_elem",
	//						"inputtype" => "hidden");
	{
		var elem = Array();
		elem.push({
			name: "coid",
			label: "\u7A2E\u5225",
			inputtype: "select",
			data: co_list,
			options: {
				id: "template[coid]",
				onChange: "change_class('template','coid')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "class1",
			label: "\u5927\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class1),
			options: {
				id: "template[class1]",
				onChange: "change_class('template','class1')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "class2",
			label: "\u4E2D\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class2),
			options: {
				id: "template[class2]",
				onChange: "change_class('template','class2')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "class3",
			label: "\u5C0F\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class3),
			options: {
				id: "template[class3]",
				onChange: "change_class('template','class3')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "productcode",
			label: "\u5546\u54C1\u30B3\u30FC\u30C9",
			inputtype: "select",
			data: {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			} + productcode,
			options: {
				id: "template[productcode]",
				onChange: "change_productcode('template')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "select",
			data: {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			} + productname,
			options: {
				id: "template[productname]",
				onChange: "change_productname('template')",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "num",
			label: "\u6570\u91CF",
			inputtype: "text",
			options: {
				id: "template[num]",
				onChange: "change_num('template')",
				maxlength: 9,
				style: "width:95%;"
			}
		});
		elem.push({
			name: "unit_cost",
			label: "\u539F\u4FA1\u5358\u4FA1",
			inputtype: "text",
			options: {
				id: "template[unit_cost]",
				onChange: "change_num('template')",
				maxlength: 9
			}
		});
		elem.push({
			name: "unit_price",
			label: "\u5546\u54C1\u5358\u4FA1",
			inputtype: "text",
			options: {
				id: "template[unit_price]",
				onChange: "change_num('template')",
				maxlength: 9
			}
		});
		elem.push({
			name: "cost",
			label: "\u539F\u4FA1",
			inputtype: "hidden",
			options: {
				id: "cost"
			}
		});
		elem.push({
			name: "price",
			label: "\u91D1\u984D",
			inputtype: "hidden",
			options: {
				id: "price"
			}
		});
		elem.push({
			name: "tax",
			label: "\u7A0E\u984D",
			inputtype: "hidden",
			options: {
				id: "tax"
			}
		});
		var year = date("Y");
		elem.push({
			name: "acceptdate",
			label: "\u53D7\u4ED8\u65E5",
			inputtype: "date",
			data: {
				minYear: year - 1,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: false
			}
		});
		elem.push({
			name: "deliverydate",
			label: "\u7D0D\u54C1\u65E5",
			inputtype: "date",
			data: {
				minYear: year - 1,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: false
			}
		});
		elem.push({
			name: "delivery_dest",
			label: "\u7D0D\u54C1\u5148",
			inputtype: "text",
			options: {
				style: "width:95%;"
			}
		});
		elem.push({
			name: "card_name",
			label: "\u540D\u523A\u8A18\u8F09\u6C0F\u540D",
			inputtype: "text",
			options: {
				style: "width:95%;"
			}
		});
		elem.push({
			name: "comment",
			label: "\u5099\u8003",
			inputtype: "text",
			options: {
				style: "width:95%;"
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
				onClick: "javascript:ask_cancel('" + this.menu_uri + "')"
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		elem.push({
			name: "excise_tax",
			inputtype: "hidden",
			options: {
				id: "excise_tax"
			}
		});
		return elem;
	}

	getFormRule() {
		var A_rule = Array();
		A_rule.push({
			name: "class1",
			mess: "\u5927\u5206\u985E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
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
			name: "class3",
			mess: "\u5C0F\u5206\u985E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
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
			name: "num",
			mess: "\u6570\u91CF\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "num",
			mess: "\u6570\u91CF\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "unit_cost",
			mess: "\u539F\u4FA1\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "unit_cost",
			mess: "\u539F\u4FA1\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C11\u6570\u4E0D\u53EF)",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "unit_price",
			mess: "\u91D1\u984D\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u5C11\u6570\u4E0D\u53EF",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "unit_price",
			mess: "\u91D1\u984D\u5358\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u5C11\u6570\u4E0D\u53EF",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "acceptdate",
			mess: "\u53D7\u4ED8\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "deliverydate",
			mess: "\u7D0D\u54C1\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "comment",
			mess: "\u5099\u8003\u306B\u3066\u300C\"\u300D\u300C'\u300D\u300C<\u300D\u300C>\u300D\u306E\u6587\u5B57\u306F\u7981\u6B62\u3055\u308C\u3066\u3044\u307E\u3059",
			type: "QRForbiddenCharacter",
			format: "/\"|'|\\\\|<|>/",
			validation: "client"
		});
		return A_rule;
	}

	getFormDefault(H_post, excise_tax) //postの値がないなら初期値を設定しよう
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

		if (undefined !== default.acceptdate == false) {
			default.acceptdate = {
				Y: date("Y"),
				m: date("m"),
				d: date("d")
			};
		}

		if (undefined !== default.deliverydate == false) {
			default.deliverydate = {
				Y: date("Y"),
				m: date("m"),
				d: date("d")
			};
		}

		if (!(undefined !== default.num)) {
			default.num = 1;
		}

		if (!default.num || default.num == "") {
			default.num = 0;
		}

		default.excise_tax = excise_tax;
		return default;
	}

	makeForm(pactid, form_element, form_default) //フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	//$this->O_FormUtil->setDefaultsWrapper( $form_default );	//	こっちだとマスタが反映されない・・
	//マスタ適用時に値が反映されないのでこちらを使う
	//原価を登録する
	//価格を登録する
	//消費税を登録する
	{
		this.O_FormUtil = new QuickFormUtil("form");
		this.O_FormUtil.setFormElement(form_element);
		this.O_Form = this.O_FormUtil.makeFormObject();
		var A_rule = this.getFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex", "QRForbiddenCharacter"];
		this.O_FormUtil.registerOriginalRules(A_orgrule);
		this.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_FormUtil.makeFormRule(A_rule);
		this.O_Form.setConstants(form_default);
		this.get_Smarty().assign("cost", form_default.cost);
		this.get_Smarty().assign("price", form_default.price);
		this.get_Smarty().assign("tax", form_default.tax);
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

	endAddView(id, id_sub) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		var comment = "<div align='left'>";
		comment += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u53D7\u4ED8\u756A\u53F7 " + id + "<br>";
		comment += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u660E\u7D30\u756A\u53F7 " + id_sub;
		comment += "</div>";
		comment += "\u8FFD\u52A0\u8ACB\u6C42\u306E" + this.FuncName;
		O_finish.displayFinish(comment, this.menu_uri, "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078");
	}

	displaySmarty(H_tree, tree_js) //部署指定
	//Formの登録
	//smartyに設定
	//templateの取得
	//$this->get_Smarty()->assign( "meta_insert",'<meta http-equiv="X-UA-Compatible" content="IE=edge">');
	//表示を返す・・・
	{
		this.get_Smarty().assign("H_tree", H_tree);
		this.get_Smarty().assign("tree_js", tree_js);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().display(KCS_DIR + "/template/Bill/AddBill/AddBillAdd.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};