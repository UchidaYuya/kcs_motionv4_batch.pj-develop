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

require("view/ViewFinish.php");

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
//setMasterData
//postにMasterData設定する
//@author web
//@since 2015/11/27
//
//@param mixed $H_master_data
//@access public
//@return void
//
//
//getFormElement
//編集箇所のフォームを作成する(submitやcancelボタン以外のもの)
//@author date
//@since 2015/11/27
//
//@param mixed $pactid
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
//getFormRule
//ルールの取得を行う
//@author date
//@since 2015/11/27
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
//validate
//フォームの値チェック
//@author web
//@since 2015/11/27
//
//@access public
//@return void
//
//
//endView
//完了画面
//@author date
//@since 2015/11/27
//
//@param array $H_sess
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
class AddBillModBulkView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.ConfirmName = "\u5909\u66F4\u3059\u308B";
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.menu_uri = "";
		this.bulk_mode = "mod";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillModBulkView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() //呼び出し元のセッションを取得する
	//現在のLocalと呼び出し元のローカルを足す
	{
		var H_sess = {
			[AddBillModBulkView.PUB]: this.O_Sess.getPub(AddBillModBulkView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		var key = dirname(_SERVER.PHP_SELF) + "/menu.php";
		var par_sess = this.O_Sess.getPub(key);
		H_sess.SELF += par_sess;
		return H_sess;
	}

	checkCGIParam() //対象のIDを取得
	//GETパラメーターは削除する
	{
		var id_list = Array();
		var id_key = Array();
		var menu_sess = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
		this.menu_uri = menu_sess.menu_uri;

		if (!!_POST || _GET.r == 1) //postの値を削除しておく
			//対象のIDがあるなら代入する
			{
				for (var key in _POST) {
					var value = _POST[key];

					if (strpos(key, "id") !== false && key != "csrfid") {
						id_list.push(value);
						id_key.push(key);
					}
				}

				for (var value of Object.values(id_key)) {
					delete _POST[value];
				}

				if (!!id_list) {
					this.H_Local.id = id_list;
				}

				this.H_Local.post = _POST;

				if (undefined !== _POST.bill) {
					{
						let _tmp_0 = this.H_Local.post.bill;

						for (var key in _tmp_0) {
							var value = _tmp_0[key];
							this.H_Local.post.bill[key].delivery_dest = stripslashes(value.delivery_dest);
							this.H_Local.post.bill[key].comment = stripslashes(value.comment);
							this.H_Local.post.bill[key].card_name = stripslashes(value.card_name);
						}
					}
				}
			}

		this.O_Sess.SetPub(AddBillModBulkView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() {
		var H_link = {
			[this.menu_uri]: "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7",
			"": "\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u306E\u4E00\u62EC\u7DE8\u96C6"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	setAddBillData(H_data) //postに値が入っているか確認
	//データ入れていく
	//プロダクトコードはマスタIdで扱う。
	//プロダクト名はマスタIdで扱う。
	//マスタ選択
	//post書き換え
	//値設定する
	{
		var id = H_data.addbillid + ":" + H_data.addbillid_sub;

		if (!this.H_Local.post.bill[id] == false) //値が入っているなら何もしない
			{
				return;
			}

		var data = Array();

		for (var key in H_data) //その他の値入れる
		{
			var value = H_data[key];
			data[key] = value;
		}

		data.productcode = H_data.tempid;
		data.productname = H_data.tempid;
		data.templist = H_data.tempid;
		this.H_Local.post.bill[id] = data;
		this.O_Sess.SetPub(AddBillModBulkView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
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

	getFormElementEdit(elem_key, coid, class1, class2, class3, productcode, productname) //postid
	//userpostid
	//postname
	//フォームの設定
	//$elem[] = array(
	//					"name" => "tempsubmit",
	//					"label" => "マスタ適用",
	//					"value" => "マスタ適用",
	//					"inputtype" => "button",
	//					"options" => array(
	//									"onClick" => "select_submit('tempsubmit')"
	//								),
	//				);
	//		$elem[] = array(
	//						"name" => "select_tempid",
	//						"label" => "マスタ選択",
	//						"inputtype" => "select",
	//						"data" => array( ""=> "--選択してください--") + $templist
	//					);
	{
		var elem = Array();
		elem.push({
			name: "postid",
			inputtype: "hidden",
			options: {
				id: elem_key + "[postid]"
			}
		});
		elem.push({
			name: "userpostid",
			inputtype: "hidden",
			options: {
				id: elem_key + "[userpostid]"
			}
		});
		elem.push({
			name: "postname",
			inputtype: "hidden",
			options: {
				id: elem_key + "[postname]"
			}
		});
		elem.push({
			name: "coid",
			label: "\u7A2E\u5225",
			inputtype: "select",
			data: coid,
			options: {
				id: elem_key + "[coid]",
				onChange: "change_class('" + elem_key + "','coid')"
			}
		});
		elem.push({
			name: "class1",
			label: "\u5927\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class1),
			options: {
				id: elem_key + "[class1]",
				onChange: "change_class('" + elem_key + "','class1')"
			}
		});
		elem.push({
			name: "class2",
			label: "\u4E2D\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class2),
			options: {
				id: elem_key + "[class2]",
				onChange: "change_class('" + elem_key + "','class2')"
			}
		});
		elem.push({
			name: "class3",
			label: "\u5C0F\u5206\u985E",
			inputtype: "select",
			data: this.makeSelectData(class3),
			options: {
				id: elem_key + "[class3]",
				onChange: "change_class('" + elem_key + "','class3')"
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
				id: elem_key + "[productcode]",
				onChange: "change_productcode('" + elem_key + "')"
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
				id: elem_key + "[productname]",
				onChange: "change_productname('" + elem_key + "')"
			}
		});
		elem.push({
			name: "num",
			label: "\u6570\u91CF",
			inputtype: "text",
			options: {
				id: elem_key + "[num]",
				onChange: "change_num('" + elem_key + "')",
				maxlength: "9",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "cost",
			inputtype: "hidden",
			options: {
				id: elem_key + "[cost]"
			}
		});
		elem.push({
			name: "price",
			inputtype: "hidden",
			options: {
				id: elem_key + "[price]"
			}
		});
		elem.push({
			name: "tax",
			inputtype: "hidden",
			options: {
				id: elem_key + "[tax]"
			}
		});
		elem.push({
			name: "unit_cost",
			inputtype: "text",
			options: {
				id: elem_key + "[unit_cost]",
				onChange: "change_num('" + elem_key + "')",
				maxlength: "9",
				style: "width:95%;"
			}
		});
		elem.push({
			name: "unit_price",
			inputtype: "text",
			options: {
				id: elem_key + "[unit_price]",
				onChange: "change_num('" + elem_key + "')",
				maxlength: "9",
				style: "width:95%;"
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
			inputtype: "text"
		});
		elem.push({
			name: "card_name",
			label: "\u540D\u523A\u8A18\u8F09\u6C0F\u540D",
			inputtype: "text"
		});
		elem.push({
			name: "comment",
			label: "\u5546\u54C1\u5099\u8003",
			inputtype: "text"
		});

		for (var key in elem) {
			var value = elem[key];
			elem[key].name = "bill[" + elem_key + "][" + value.name + "]";
		}

		return elem;
	}

	getFormElement() {
		var elem = Array();
		elem.push({
			name: "excise_tax",
			inputtype: "hidden",
			options: {
				id: "excise_tax"
			}
		});
		elem.push({
			name: "modsubmit",
			label: this.NextName,
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
		return elem;
	}

	getFormDefault(H_post, excise_tax) //postの値がないなら初期値を設定しよう
	//postの値があるならそれを初期値にしよう
	////	受付日の設定
	//		if( isset( $default["accetptdate"] ) == false ){
	//			$default["acceptdate"] = array('Y'=>date('Y'), 'm' => date('m'), 'd' => date('d'));
	//		}
	//		//	数量
	//		if( empty( $default["num"] ) || $default["num"] == ""){
	//			$default["num"] = 0;
	//		}
	//		//-------------------------------------------------------------
	//		//	テンプレートが適用された
	//		//-------------------------------------------------------------
	//		if( $H_post["submit_elem"] == "tempsubmit" ){
	//			$column_list = array(
	//				"type","class1","class2","class3",
	//				"cost","price",
	//			);
	//			foreach( $column_list as $column ){
	//				$default[$column] = $tempdata[$column];
	//			}
	//			//	商品コードと商品名はidを設定する
	//			$default["productcode"] = $tempdata["tempid"];
	//			$default["productname"] = $tempdata["tempid"];
	//		}
	//		//-------------------------------------------------------------
	//		//	大中小項目、商品コード、商品名が変更されたので項目をリセットする
	//		//-------------------------------------------------------------
	//		if( !empty($H_post["submit_elem"]) ){
	//			if( $H_post["submit_elem"] == "productcode" ){
	//				$default["productname"] = $default["productcode"];
	//			}else
	//			if( $H_post["submit_elem"] == "productname" ){
	//				$default["productcode"] = $default["productname"];				
	//			}else{
	//				//	大中小分類が変更されたら
	//				$column_list = array(
	//					"class1","class2","class3","cost","price",
	//				);
	//				$reset_flag = false;
	//				foreach( $column_list as $column ){
	//					if( $reset_flag ){
	//						$default[$column] = "";
	//					}
	//	
	//					if( $column == $H_post["submit_elem"] ){
	//						$reset_flag = true;
	//					}
	//				}
	//			}
	//			$default["submit_elem"] = "";
	//		}
	{
		var default = Array();

		if (!!H_post) {
			default = H_post;
		}

		if (undefined !== default.csrfid == false) {
			var O_unique = MtUniqueString.singleton();
			default.csrfid = O_unique.getNewUniqueId();
		}

		default.excise_tax = excise_tax;
		return default;
	}

	getFormRule(elem_key) {
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
			mess: "\u539F\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "unit_cost",
			mess: "\u539F\u4FA1\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "unit_price",
			mess: "\u91D1\u984D\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		A_rule.push({
			name: "unit_price",
			mess: "\u91D1\u984D\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "required",
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

		for (var key in A_rule) //$A_rule[$key]["mess"] = "受付番号 ".$elem_key."の".$value["mess"];	//	メッセージの変更をしてみたけどクドいのでやめた
		{
			var value = A_rule[key];
			A_rule[key].name = "bill[" + elem_key + "][" + value.name + "]";
		}

		return A_rule;
	}

	makeForm(pactid, form_element, form_default) //フォームオブジェクト生成
	//ルールの取得
	//受注ごとにルール追加
	//ルールの設定
	//フォームに初期値設定。
	//$this->O_FormUtil->setDefaultsWrapper( $form_default );	//	こっちだとマスタが反映されない・・
	//マスタ適用時に値が反映されないのでこちらを使う
	{
		this.O_FormUtil = new QuickFormUtil("form");
		this.O_FormUtil.setFormElement(form_element);
		this.O_Form = this.O_FormUtil.makeFormObject();
		var A_rule = Array();
		var A_rule_temp = this.getFormRule(key);
		var keys = Object.keys(form_default.bill);

		for (var elem_key of Object.values(keys)) {
			var res = this.getFormRule(elem_key);
			A_rule = array_merge(A_rule, res);
		}

		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex", "QRForbiddenCharacter"];
		this.O_FormUtil.registerOriginalRules(A_orgrule);
		this.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_FormUtil.makeFormRule(A_rule);
		this.O_Form.setConstants(form_default);
	}

	validate() {
		return this.O_FormUtil.validateWrapper();
	}

	endView(H_sess: {} | any[], id_list: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u306E\u4E00\u62EC\u7DE8\u96C6", this.menu_uri, "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078");
	}

	freezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("modsubmit", {
			value: this.ConfirmName
		});
		this.O_FormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("modsubmit", {
			value: this.NextName
		});
	}

	displaySmarty(H_list, H_tree, tree_js) //Formの登録
	//smartyに設定
	//部署指定
	//templateの取得
	//$this->get_Smarty()->assign( "meta_insert",'<meta http-equiv="X-UA-Compatible" content="IE=edge">');
	//表示を返す・・・
	{
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
		this.get_Smarty().assign("H_tree", H_tree);
		this.get_Smarty().assign("tree_js", tree_js);
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("bulk_mode", this.bulk_mode);
		this.get_Smarty().display(KCS_DIR + "/template/Bill/AddBill/AddBillModBulk.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};