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
/// * O_Form
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
//makeForm
//フォームの作成
//@author web
//@since 2016/10/12
//
//@access public
//@return void
//
//
//assignForm
//smartyにform登録
//@author web
//@since 2016/10/12
//
//@param mixed $name
//@param mixed $form
//@access public
//@return void
//
//メールフォーム登録
//
//makeListForm
//
//@author web
//@since 2017/05/17
//
//@param mixed $limit
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
//getReturnLink
//戻り先の取得
//@author web
//@since 2016/10/26
//
//@access private
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
class SendMailView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u9001\u4FE1\u3059\u308B";
		this.menu_uri = "";
		this.FuncName = "\u767B\u9332";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(SendMailView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[SendMailView.PUB]: this.O_Sess.getPub(SendMailView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //リセット
	//GETパラメーターは削除する
	{
		var menu_sess = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");

		if (_GET.r != "") //$this->O_Sess->SetSelfAll($this->H_Local);
			//header("Location: " . $_SERVER["PHP_SELF"]);
			//exit();
			{
				delete this.H_Local.post;
			}

		if (_POST.length > 0) {
			var mail_type = undefined !== _POST.mail_type ? _POST.mail_type : "";

			if (mail_type != "") //POST情報の取得
				//対象のリストとか格納する
				//選択しているものをセッションにいれる
				{
					this.H_Local.menu_uri = _SERVER.HTTP_REFERER;
					this.H_Local.post_prev = _POST;
					var checklist = Array();

					if (mail_type == "order_history") //注文履歴から来た場合。注文番号一覧を作成
						//注文番号一覧を取得
						{
							this.H_Local.order_list = Array();

							for (var key in _POST) {
								var value = _POST[key];

								if (strpos(key, "id") === 0) {
									var data = value.split(":");
									this.H_Local.order_list.push(data[0]);
									checklist[data[0]] = true;
								}
							}
						} else //請求、電話管理から来た場合。
						//対象の電話回線などの取得
						{
							this.H_Local.tel_list = Array();

							for (var key in _POST) {
								var value = _POST[key];

								if (strpos(key, "id") === 0) {
									data = value.split(":");
									this.H_Local.tel_list.push({
										postid: data[0],
										telno: data[1],
										carid: data[2]
									});
									checklist[value] = true;
								}
							}
						}

					switch (mail_type) {
						case "bill":
							_SESSION["/Bill/Tel/menu.php,checklist"] = checklist;
							break;

						case "order_history":
							_SESSION["/MTOrderList/menu.php"].checklist = checklist;
							break;

						case "management":
							_SESSION["/Management/Tel/menu.php"].checklist = checklist;
							break;
					}

					switch (mail_type) {
						case "bill":
							var year = _SESSION["/Bill/Tel/menu.php,cy"];
							var month = _SESSION["/Bill/Tel/menu.php,cm"];
							this.H_Local.cym = sprintf("%04d%02d", year, month);
							this.H_Local.postid = _SESSION["/Bill/Tel/menu.php,postid"];
							break;

						case "management":
							this.H_Local.cym = _SESSION["/Management"].cym;
							this.H_Local.postid = _SESSION["/Management"].current_postid;
							break;
					}

					this.menu_uri = this.H_Local.menu_uri;
				} else {
				this.H_Local.post = _POST;
			}
		}

		if (undefined !== _POST.limit) {
			this.H_Local.limit = _POST.limit;
			this.H_Local.offset = 1;
		}

		if (!(undefined !== this.H_Local.limit)) {
			this.H_Local.limit = 30;
		}

		if (undefined !== _GET.p) {
			if (is_numeric(_GET.p)) {
				this.H_Local.offset = _GET.p;
			}
		}

		if (!(undefined !== this.H_Local.offset)) {
			this.H_Local.offset = 1;
		}

		if (undefined !== _GET.s) {
			this.H_Local.sort = _GET.s;
		}

		if (!(undefined !== this.H_Local.sort)) {
			this.H_Local.sort = "0,a";
		}

		this.O_Sess.SetPub(SendMailView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		switch (this.H_Local.post_prev.mail_type) {
			case "bill":
				var H_link = {
					[this.menu_uri]: "\u8ACB\u6C42\u60C5\u5831",
					"": "\u8ACB\u6C42\u30E1\u30FC\u30EB\u9001\u4FE1"
				};
				break;

			case "management":
				H_link = {
					[this.menu_uri]: "\u7BA1\u7406\u60C5\u5831",
					"": "\u96FB\u8A71\u7BA1\u7406\u30E1\u30FC\u30EB\u9001\u4FE1"
				};
				break;

			case "order_history":
				H_link = {
					[this.menu_uri]: "\u6CE8\u6587\u5C65\u6B74",
					"": "\u5C65\u6B74\u30E1\u30FC\u30EB\u9001\u4FE1"
				};
				break;
		}

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

	getMailFormElement() {
		var elem = Array();
		var link_next = this.getReturnLink();
		var year = date("Y");
		elem.push({
			name: "mail",
			label: "\u9001\u4FE1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "text",
			options: {
				style: "width:100%;"
			}
		});
		elem.push({
			name: "name",
			label: "\u9001\u4FE1\u8005\u540D",
			inputtype: "text",
			options: {
				style: "width:100%;"
			}
		});
		elem.push({
			name: "subject",
			label: "\u4EF6\u540D",
			inputtype: "text",
			options: {
				style: "width:100%;"
			}
		});
		elem.push({
			name: "comment",
			label: "\u30E1\u30FC\u30EB\u672C\u6587",
			inputtype: "textarea",
			options: {
				style: "width:100%;",
				rows: "20"
			}
		});
		elem.push({
			name: "test_mail",
			label: "TEST\u9001\u4FE1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "text",
			options: {
				style: "width:100%;"
			}
		});
		elem.push({
			name: "submit",
			label: "\u78BA\u8A8D\u753B\u9762\u3078",
			value: "\u78BA\u8A8D\u753B\u9762\u3078",
			inputtype: "submit"
		});
		elem.push({
			name: "send_test_mail",
			label: "TEST\u30E1\u30FC\u30EB\u9001\u4FE1",
			inputtype: "button",
			options: {
				onClick: "SendTestMail()",
				id: "send_test_mail"
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
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel('" + link_next + "')"
			}
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
			name: "group_flag",
			label: "\u9001\u4FE1\u5358\u4F4D",
			inputtype: "radio",
			data: {
				off: ["\u30B0\u30EB\u30FC\u30D7\u5316\u3057\u306A\u3044"],
				on: ["\u30B0\u30EB\u30FC\u30D7\u5316\u3059\u308B"]
			}
		});
		elem.push({
			name: "cc_flag",
			label: "CC\u9001\u4FE1\u533A\u5206",
			inputtype: "radio",
			data: {
				off: ["CC\u9001\u4FE1\u3057\u306A\u3044"],
				on: ["CC\u9001\u4FE1\u3059\u308B"]
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		return elem;
	}

	getMailFormRule(cc_flag = false) //---------------------
	//-------------------------
	//-------------------------
	{
		var A_rule = Array();
		A_rule.push({
			name: "mail",
			mess: "\u9001\u4FE1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "mail",
			mess: "\u9001\u4FE1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059",
			type: "email",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "name",
			mess: "\u9001\u4FE1\u8005\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "subject",
			mess: "\u4EF6\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "comment",
			mess: "\u30E1\u30FC\u30EB\u672C\u6587\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "test_mail",
			mess: "TEST\u9001\u4FE1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "test_mail",
			mess: "TEST\u9001\u4FE1\u30E1\u30FC\u30EB\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059\u3002",
			type: "QRMultiMailCheck",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "group_flag",
			mess: "\u9001\u4FE1\u5358\u4F4D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});

		if (cc_flag) {
			A_rule.push({
				name: "cc_flag",
				mess: "CC\u9001\u4FE1\u533A\u5206\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "required",
				format: undefined,
				validation: "client"
			});
		}

		return A_rule;
	}

	getMailFormDefault(H_post) //postの値がないなら初期値を設定しよう
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

		if (undefined !== default.group_flag == false) {
			default.group_flag = "off";
		}

		if (undefined !== default.cc_flag == false) {
			default.cc_flag = "on";
		}

		if (undefined !== _POST.limitbutton) {
			this.H_Local.offset = 1;
		}

		return default;
	}

	makeForm(name, elem, rule, default) //フォームオブジェクト生成
	//ルールの設定
	//フォームに初期値設定。
	//$this->O_FormUtil->setDefaultsWrapper( $form_default );	//	こっちだとマスタが反映されない・・
	//マスタ適用時に値が反映されないのでこちらを使う
	{
		var orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex", "QRForbiddenCharacter"];
		var util = new QuickFormUtil(name);
		util.setFormElement(elem);
		var form = util.makeFormObject();
		util.registerOriginalRules(orgrule);
		util.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		util.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		util.makeFormRule(rule);
		form.setConstants(default);
		return {
			form: form,
			util: util
		};
	}

	assignForm(name, form) //Formの登録
	//smartyに設定
	{
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign(name, render.toArray());
	}

	makeMailForm(H_post) //CC送信区分について。注文履歴では表示しない
	{
		var use_cc_flag = true;

		if (undefined !== this.H_Local.post_prev) {
			if (this.H_Local.post_prev.mail_type == "order_history") {
				use_cc_flag = false;
			}
		}

		var elem = this.getMailFormElement();
		var rule = this.getMailFormRule(use_cc_flag);
		var default = this.getMailFormDefault(H_post);
		this.A_MailForm = this.makeForm("mailForm", elem, rule, default);
	}

	makeListForm(limit) //form
	{
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
		var default = {
			limit: limit
		};
		this.A_ListForm = this.makeForm("listForm", elem, Array(), default);
	}

	validate() {
		var util = this.A_MailForm.util;
		return util.validateWrapper();
	}

	freezeForm() {
		var util = this.A_MailForm.util;
		util.updateElementAttrWrapper("submit", {
			value: this.RecName
		});
		util.updateAttributesWrapper({
			onsubmit: false
		});
		util.freezeWrapper();
	}

	unfreezeForm() {
		var util = this.A_MailForm.util;
		util.updateElementAttrWrapper("addsubmit", {
			value: this.NextName
		});
	}

	getReturnLink() {
		var link_next = "/Bill/Tel/menu.php";

		switch (this.H_Local.post_prev.mail_type) {
			case "bill":
				link_next = "/Bill/Tel/menu.php";
				break;

			case "management":
				link_next = "/Management/Tel/menu.php";
				break;

			case "order_history":
				link_next = "/MTOrderList/menu.php";
				break;
		}

		return link_next;
	}

	endView() //選択を削除
	//選択しているものをセッションにいれる
	//$O_finish->displayFinish( "メールの送信","/Menu/menu.php", "請求一覧画面へ" );
	{
		var link_next = this.getReturnLink();
		var btn_name = "";

		switch (this.H_Local.post_prev.mail_type) {
			case "bill":
				btn_name = "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078";
				delete _SESSION["/Bill/Tel/menu.php,checklist"];
				break;

			case "management":
				btn_name = "\u96FB\u8A71\u7BA1\u7406\u753B\u9762\u3078";
				delete _SESSION["/Management/Tel/menu.php"].checklist;
				break;

			case "order_history":
				btn_name = "\u6CE8\u6587\u5C65\u6B74\u3078";
				delete _SESSION["/MTOrderList/menu.php"].checklist;
				break;

			default:
				btn_name = "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078";
				break;
		}

		this.O_Sess.clearSessionSelf();

		switch (mail_type) {
			case "bill":
				break;

			case "order_history":
				break;

			case "management":
				break;
		}

		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u30E1\u30FC\u30EB\u306E\u9001\u4FE1", link_next, btn_name);
	}

	displaySmarty(data, data_cnt) //templateの取得
	//$this->get_Smarty()->assign( "meta_insert",'<meta http-equiv="X-UA-Compatible" content="IE=edge">');
	//123456789のやつ
	//注文履歴からきたらこの値をsmartyに。
	//表示を返す・・・
	{
		this.assignForm("O_form", this.A_MailForm.form);
		this.assignForm("O_listForm", this.A_ListForm.form);
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		var page_link = MakePageLink.makePageLinkHTML(data_cnt, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("mail_type", this.H_Local.post_prev.mail_type);

		if (this.H_Local.post_prev.mail_type == "order_history") {
			this.get_Smarty().assign("mail_target", this.H_Local.post_prev.mail_target);
		}

		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("H_list", data);
		this.get_Smarty().assign("list_cnt", data_cnt);
		this.get_Smarty().assign("loginname", this.O_Sess.loginname);
		this.get_Smarty().assign("loginid", this.O_Sess.loginid);
		this.get_Smarty().display(KCS_DIR + "/template/Bill/Mail/SendMail.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};