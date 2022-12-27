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

require(_SERVER.DOCUMENT_ROOT + "/Bill/tab.php");

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
//protected $H_ini;
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
//フォームの作成
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
//setMode
//
//@author web
//@since 2016/10/05
//
//@param mixed $mode
//@access public
//@return void
//
//
//assignPostBill
//
//@author web
//@since 2016/10/05
//
//@param mixed $cnt
//@param mixed $num
//@param mixed $price
//@param mixed $tax
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
class AddBillMenuView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() //define.iniを読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillMenuView.PUB]: this.O_Sess.getPub(AddBillMenuView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //GETパラメーターを消す
	{
		if (!_POST) {
			this.clearLastForm();
		}

		if (!(undefined !== this.H_Local.menu_uri)) {
			this.H_Local.menu_uri = _SERVER.PHP_SELF;
		}

		if (strpos(_SERVER.REQUEST_URI, "Input") != false) {
			this.H_Local.input_flg = true;
			this.H_Local.mode = "1";
		}

		if (undefined !== _POST.coid_selsubmit) {
			this.H_Local.offset = 1;
		}

		if (undefined !== _POST.modesubmit) {
			this.H_Local.offset = 1;
		}

		if (undefined !== _POST.limitbutton) {
			this.H_Local.offset = 1;
		}

		if (undefined !== _GET.postid === true && is_numeric(_GET.postid) === true) {
			if (_GET.tab != 1) {
				if (this.H_Dir.current_postid == _GET.postid) {
					this.H_Local.mode = "1";
				} else {
					this.H_Local.mode = "0";
					this.H_Local.offset = 1;
				}
			}

			this.H_Dir.current_postid = _GET.postid;
			this.O_Sess.setGlobal("current_postid", _GET.postid);
		}

		if (undefined !== _GET.pid === true && is_numeric(_GET.pid) === true) {
			this.H_Dir.current_postid = _GET.pid;
			this.O_Sess.setGlobal("current_postid", _GET.pid);
			this.H_Local.mode = "0";
			this.H_Local.offset = 1;
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

		if (undefined !== _POST.search) //明細表示にする
			{
				this.H_Local.search = _POST;
				this.H_Local.mode = "1";
				this.H_Local.offset = 1;
			}

		if (!(undefined !== this.H_Local.search)) {
			this.H_Local.search = Array();

			if (undefined !== this.H_Local.search.search_condition == false) {
				this.H_Local.search.search_condition = "AND";
			}

			this.H_Local.search.range = "now";
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

		if (undefined !== _GET.ym) {
			this.H_Dir.cym = _GET.ym;
			this.H_Local.offset = 1;
			this.H_Local.search.range = "now";
		}

		if (!(undefined !== this.H_Dir.cym)) {
			this.H_Dir.cym = "current";
		}

		if (this.H_Dir.cym != "current") {
			if (this.H_Dir.cym.length == 5) {
				var temp = this.H_Dir.cym.substr(0, 4) + "0" + this.H_Dir.cym.substr(4, 1);
				this.H_Dir.cym = temp;
			}
		}

		if (this.H_Dir.cym == "current" && this.H_Local.input_flg == false) ///kcs/htdocs/Bill/Etc/card_bill_common.phpを参考にして、今月の請求がなければ前月を表示
			{
				this.H_Dir.cym = date("Ym");
				var O_table = new MtTableUtil();
				var tbno = O_table.getTableNo(this.H_Dir.cym);
				var sql = "select count(*) from addbill_" + tbno + "_tb";
				sql += " where pactid=" + _SESSION.pactid;
				var res = GLOBALS.GO_db.getOne(sql);

				if (res == 0) {
					this.H_Dir.cym = date("Ym", mktime(0, 0, 0, date("m") - 1, date("d"), date("Y")));
				}
			}

		if (undefined !== _POST.mode) {
			this.H_Local.mode = _POST.mode;
		}

		if (undefined !== _POST.coid_sel) {
			this.H_Local.coid = _POST.coid_sel;
		}

		if (!(undefined !== this.H_Local.coid)) {
			this.H_Local.coid = 0;
		}

		if (!(undefined !== this.H_Local.mode)) {
			this.H_Local.mode = "0";
		}

		if (undefined !== this.H_Dir.current_postid === false) {
			this.H_Dir.current_postid = _SESSION.postid;
			this.H_Local.offset = 1;
		}

		this.O_Sess.SetPub(AddBillMenuView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!_GET == false) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() {
		if (this.H_Local.input_flg) {
			var H_link = {
				"": "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7"
			};
		} else {
			H_link = {
				"": "\u540D\u523A / \u5C01\u7B52\u8ACB\u6C42\u60C5\u5831"
			};
		}

		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	getFormElement(coid_sel) //フォーム要素の配列作成
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
	//未確定に戻す
	//確定
	//削除
	//追加登録
	//一括編集
	//コピー
	//if( !$range_now ){
	//			$temp["options"]["disabled"] = "disabled";
	//		}
	//新規登録
	//表示形式について
	//表示形式submit
	//表示形式の切り替え
	//表示形式submit
	{
		var range_now = this.H_Local.search.range == "now" ? true : false;
		var elem = Array();
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
			name: "limitbutton",
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
		var temp = {
			name: "unsettled",
			label: "\u672A\u78BA\u5B9A\u306B\u623B\u3059",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoUnsettledPage();"
			}
		};

		if (!range_now) {
			temp.options.disabled = "disabled";
		}

		elem.push(temp);
		temp = {
			name: "confirm",
			label: "\u78BA\u5B9A",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoConfirmPage();"
			}
		};

		if (!range_now) {
			temp.options.disabled = "disabled";
		}

		elem.push(temp);
		temp = {
			name: "delete",
			label: "\u524A\u9664\u3059\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoDeletePage();"
			}
		};

		if (!range_now) {
			temp.options.disabled = "disabled";
		}

		elem.push(temp);
		temp = {
			name: "add",
			label: "\u8FFD\u52A0\u767B\u9332",
			inputtype: "button",
			options: {
				onClick: "location.href='AddBillAdd.php'"
			}
		};

		if (!range_now) {
			temp.options.disabled = "disabled";
		}

		elem.push(temp);
		temp = {
			name: "mod_bulk",
			label: "\u4E00\u62EC\u7DE8\u96C6",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoModBulkPage();"
			}
		};

		if (!range_now) {
			temp.options.disabled = "disabled";
		}

		elem.push(temp);
		temp = {
			name: "copy_bulk",
			label: "\u30B3\u30D4\u30FC",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoCopyBulkPage();"
			}
		};
		elem.push(temp);
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
		elem.push({
			name: "coid_sel",
			label: "\u7A2E\u5225",
			inputtype: "select",
			data: coid_sel
		});
		elem.push({
			name: "coid_selsubmit",
			label: "\u5909\u66F4",
			inputtype: "submit"
		});
		elem.push({
			name: "mode",
			label: "\u8868\u793A\u5F62\u5F0F",
			inputtype: "select",
			data: {
				"0": "\u90E8\u7F72\u5358\u4F4D",
				"1": "\u660E\u7D30\u5358\u4F4D"
			}
		});
		elem.push({
			name: "modesubmit",
			label: "\u5909\u66F4",
			inputtype: "submit"
		});
		return elem;
	}

	getFormDefault() {
		var default = Array();
		default.limit = this.H_Local.limit;
		default.mode = this.H_Local.mode;
		default.coid_sel = this.H_Local.coid;
		return default;
	}

	makeForm(coid_sel) //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//フォームに初期値設定。
	//$util->setDefaultsWrapper( $default );
	//検索結果で0を指定された時に反映しないようにするためにこうした
	//登録するぽよ
	//smartyに設定
	{
		var element = this.getFormElement(coid_sel);
		var util = new QuickFormUtil("addform");
		util.setFormElement(element);
		var form = util.makeFormObject();
		var default = this.getFormDefault();
		form.setConstants(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
	}

	getSearchFormElement(pactid) ////	種別の取得
	//		$types = array();
	//		if( isset( $this->H_ini[$pactid] ) ){
	//			$temp = explode(",",$this->H_ini[$pactid]["type"]);
	//		}else{
	//			$temp = explode(",",$this->H_ini[0]["type"]);
	//		}
	//		//	種別を加工する
	//		//	0=>種別となっているのを種別=>種別に変更する:
	//		$types = array();
	//		$types[""] = "--";
	//		foreach( $temp as $value ){
	//			$types[$value] = $value;
	//		}
	//		//	フォームの設定
	//		$elem[] = array(
	//						"name" => "type",
	//						"label" => "種別",
	//						"inputtype" => "select",
	//						"data" => $types
	//					);
	//登録日の以上、以下、当日などの設定
	//登録日の以上、以下、当日などの設定
	////	登録日の以上、以下、当日などの設定
	//		$elem[] = array(
	//						"name" => "acceptdate_sub",
	//						"inputtype" => "select",
	//						"data" => array(	
	//										"=" => "と等しい",
	//										"<=" => "より前",
	//										">=" => "より後",
	//									)
	//					);
	//納品日
	//納品日
	////	納品日の比較
	//		$elem[] = array(
	//						"name" => "deliverydate_sub",
	//						"inputtype" => "select",
	//						"data" => array(	
	//										"=" => "と等しい",
	//										"<=" => "より前",
	//										">=" => "より後",
	//									)
	//					);
	//納品先
	//名刺記載氏名
	//"options" => array( "onClick" => "javascript:location.href='?r=1'" ) );
	{
		var elem = Array();
		elem.push({
			name: "addbillid",
			label: "\u53D7\u4ED8\u756A\u53F7",
			inputtype: "text"
		});
		elem.push({
			name: "addbillid_sub",
			label: "\u660E\u7D30\u756A\u53F7",
			inputtype: "text"
		});
		elem.push({
			name: "addbillid_sub_sub",
			inputtype: "select",
			data: {
				"=": "\u3068\u7B49\u3057\u3044",
				"<=": "\u4EE5\u4E0B",
				">=": "\u4EE5\u4E0A"
			}
		});
		elem.push({
			name: "userpostid",
			label: "\u90E8\u7F72ID",
			inputtype: "text"
		});
		elem.push({
			name: "postname",
			label: "\u90E8\u7F72\u540D",
			inputtype: "text"
		});
		elem.push({
			name: "coname",
			label: "\u7A2E\u5225",
			inputtype: "text"
		});
		elem.push({
			name: "class1",
			label: "\u5927\u5206\u985E",
			inputtype: "text"
		});
		elem.push({
			name: "class2",
			label: "\u4E2D\u5206\u985E",
			inputtype: "text"
		});
		elem.push({
			name: "class3",
			label: "\u5C0F\u5206\u985E",
			inputtype: "text"
		});
		elem.push({
			name: "productcode",
			label: "\u5546\u54C1\u30B3\u30FC\u30C9",
			inputtype: "text"
		});
		elem.push({
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text"
		});
		elem.push({
			name: "num",
			label: "\u6570\u91CF",
			inputtype: "text"
		});
		elem.push({
			name: "num_sub",
			inputtype: "select",
			data: {
				"=": "\u3068\u7B49\u3057\u3044",
				"<=": "\u4EE5\u4E0B",
				">=": "\u4EE5\u4E0A"
			}
		});
		elem.push({
			name: "cost",
			label: "\u539F\u4FA1",
			inputtype: "text"
		});
		elem.push({
			name: "cost_sub",
			inputtype: "select",
			data: {
				"=": "\u3068\u7B49\u3057\u3044",
				"<=": "\u4EE5\u4E0B",
				">=": "\u4EE5\u4E0A"
			}
		});
		elem.push({
			name: "price",
			label: "\u91D1\u984D",
			inputtype: "text"
		});
		elem.push({
			name: "price_sub",
			inputtype: "select",
			data: {
				"=": "\u3068\u7B49\u3057\u3044",
				"<=": "\u4EE5\u4E0B",
				">=": "\u4EE5\u4E0A"
			}
		});
		var year = date("Y");
		elem.push({
			name: "acceptdate_from",
			label: "\u53D7\u4ED8\u65E5",
			inputtype: "date",
			data: {
				minYear: year - 2,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "acceptdate_to",
			label: "\u53D7\u4ED8\u65E5To",
			inputtype: "date",
			data: {
				minYear: year - 2,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "deliverydate_from",
			label: "\u7D0D\u54C1\u65E5",
			inputtype: "date",
			data: {
				minYear: year - 2,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "deliverydate_to",
			label: "\u7D0D\u54C1\u65E5",
			inputtype: "date",
			data: {
				minYear: year - 2,
				maxYear: year + 1,
				format: "Y \u5E74 m \u6708 d \u65E5",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "delivery_dest",
			label: "\u7D0D\u54C1\u5148",
			inputtype: "text"
		});
		elem.push({
			name: "card_name",
			label: "\u540D\u523A\u8A18\u8F09\u6C0F\u540D",
			inputtype: "text"
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
			name: "comment",
			label: "\u5099\u8003",
			inputtype: "text"
		});
		elem.push({
			name: "username",
			label: "\u5165\u529B\u8005\u540D",
			inputtype: "text"
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
				onClick: "javascript:ask_cancel('/Management/AddBill/AddBillMaster.php')"
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		var H_radio = {
			now: ["\u5F53\u6708", {
				id: "range_now"
			}],
			year1: ["\u904E\u53BB\u4E00\u5E74", {
				id: "range_year1"
			}],
			year2: ["\u904E\u53BB\u4E8C\u5E74", {
				id: "range_year2"
			}]
		};
		elem.push({
			name: "range",
			label: "\u5BFE\u8C61\u6708",
			inputtype: "radio",
			data: H_radio
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
			name: "addbillid_sub",
			mess: "\u660E\u7D30\u756A\u53F7\u306F\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "num",
			mess: "\u6570\u91CF\u306F\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "cost",
			mess: "\u539F\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "price",
			mess: "\u91D1\u984D\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "acceptdate_from",
			mess: "\u53D7\u4ED8\u65E5From\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "acceptdate_to",
			mess: "\u53D7\u4ED8\u65E5To\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "deliverydate_from",
			mess: "\u7D0D\u54C1\u65E5From\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "deliverydate_to",
			mess: "\u7D0D\u54C1\u65E5To\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		return A_rule;
	}

	makeSearchForm(pactid) //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	////	登録するぽよ
	//		$render = new HTML_QuickForm_Renderer_ArraySmarty( $this->get_Smarty() );
	//		$form->accept( $render );
	//		//	smartyに設定
	//		$this->get_Smarty()->assign( "O_searchform", $render->toArray() );
	//validatorの値を返す
	{
		var elem = this.getSearchFormElement(pactid);
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
		this.O_SearchForm = form;
		return util.validateWrapper();
	}

	setMode(mode) //モードの設定
	//セッションに記録する
	{
		this.H_Local.mode = mode;
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	assignPostBill(cnt, num, price, tax) {
		this.get_Smarty().assign("post_bill_cnt", cnt);
		this.get_Smarty().assign("post_bill_num", num);
		this.get_Smarty().assign("post_bill_price", price);
		this.get_Smarty().assign("post_bill_tax", tax);
	}

	displaySmarty(A_auth, recalc_flg, H_list, list_cnt, post_tree, H_tree, js, coid_sel) //$this->get_Smarty()->assign( "printdate",$printdate);
	//レンダラーの作成
	//Smartyに設定
	//serachform
	//templateの取得
	//123456789のやつ
	//Formの登録
	//-------------------------------------------------
	//// 年月バーの生成
	//        // 英語化 20090702miya
	//        if ("ENG" == $H_g_sess["language"]) {
	//            $H_view["monthly_bar"] = $O_bill->getDateTreeEng( $H_sess[self::PUB]["cym"], 24, "", $H_view["billtype"]);
	//        } else {
	//            $H_view["monthly_bar"] = $O_bill->getDateTree( $H_sess[self::PUB]["cym"], 24, "", $H_view["billtype"] );
	//        }
	//年月バーの設定。未確定リンクのあるevを使う
	//タブ作成
	//部署ツリー
	//再計算権限
	//追加請求情報からきた時はタブを表示する
	//受注内容入力の場合は表示しない。
	//ダウンロードは後で権限対応させる
	//確定権限の有無
	//再計算中の画面表示
	{
		var input_flg = this.H_Local.input_flg;
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_SearchForm.accept(O_renderer);
		this.get_Smarty().assign("O_searchform", O_renderer.toArray());

		if (undefined !== this.H_Local.search.search) {
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
		this.makeForm(coid_sel);
		this.get_Smarty().assign("H_tree", H_tree);
		this.get_Smarty().assign("js", js);
		this.get_Smarty().assign("post_tree", post_tree);
		var O_util = new MtUtil();

		if (input_flg) {
			var date_tree = O_util.getDateTree(this.H_Dir.cym, 24, "", "ev");
		} else {
			date_tree = O_util.getDateTree(this.H_Dir.cym, 24, "", "");
		}

		this.get_Smarty().assign("ym_bar", date_tree);
		var year = this.H_Dir.cym.substr(0, 4);
		var month = this.H_Dir.cym.substr(4, 2);
		var O_auth = MtAuthority.singleton(this.O_Sess.pactid);
		var use_tree = true;
		var auth_recalc = false;

		if (input_flg == true) //受注内容入力画面。
			//部署ツリーは表示しない
			{
				use_tree = false;
			} else if (-1 !== A_auth.indexOf("fnc_recalc") == true) //再計算中の時は非表示
			{
				auth_recalc = true;

				if (recalc_flg == true) {
					auth_recalc = false;
					use_tree = false;
				}

				if (0 >= list_cnt) {
					auth_recalc = false;
				}
			}

		this.get_Smarty().assign("extend", "normal");

		if (!input_flg) //タブ制御
			//再計算用
			{
				createTabBill5(this.get_Smarty(), year, month, H_Dir.current_postid, input_flg, "addbill", O_auth, this.O_Sess.userid);
				applyRecalc(this.get_Smarty(), O_renderer, year, month, "\u540D\u523A / \u5C01\u7B52\u8ACB\u6C42\u60C5\u5831", "addbill", auth_recalc, false, "\u540D\u523A / \u5C01\u7B52\u8ACB\u6C42\u60C5\u5831");
			}

		this.get_Smarty().assign("year", year);
		this.get_Smarty().assign("month", month);
		this.get_Smarty().assign("use_tree", use_tree);
		this.get_Smarty().assign("mode", this.H_Local.mode);
		this.get_Smarty().assign("cym", this.H_Dir.cym);
		this.get_Smarty().assign("input_flg", input_flg);
		this.get_Smarty().assign("person", input_flg);
		this.get_Smarty().assign("range_now", this.H_Local.search.range == "now" ? true : false);
		this.get_Smarty().assign("auth_download", true);
		this.get_Smarty().assign("confirm_flg", -1 !== A_auth.indexOf("fnc_addbill_confirm") ? true : false);

		if (-1 !== A_auth.indexOf("fnc_addbill_input")) {
			this.get_Smarty().assign("cost_flg", true);
		} else {
			this.get_Smarty().assign("cost_flg", false);
		}

		if (recalc_flg == true && !input_flg) {
			this.get_Smarty().display("addbill_bill_underconst.tpl");
		} else {
			this.get_Smarty().display(KCS_DIR + "/template/Bill/AddBill/menu.tpl");
		}
	}

	__destruct() {
		super.__destruct();
	}

};