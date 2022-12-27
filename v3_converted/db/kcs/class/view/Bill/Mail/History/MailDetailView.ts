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
class MailHistoryMenuView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u9001\u4FE1\u3059\u308B";
		this.menu_uri = "";
		this.FuncName = "\u767B\u9332";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(MailHistoryMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[MailHistoryMenuView.PUB]: this.O_Sess.getPub(MailHistoryMenuView.PUB),
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

		if (undefined !== _GET.limit) {
			this.H_Local.limit = _GET.limit;
		}

		if (undefined !== _POST.limit) {
			this.H_Local.limit = _POST.limit;
		}

		if (!(undefined !== this.H_Local.limit)) //前のページの表示数を引き継ぐ
			{
				this.H_Local.limit = limit;
			}

		if (undefined !== _GET.p) {
			if (is_numeric(_GET.p)) {
				this.H_Local.offset = _GET.p;
			}
		}

		if (!(undefined !== this.H_Local.offset)) {
			this.H_Local.offset = 1;
		}

		if (undefined !== _GET.id) {
			this.H_Local.history_id = _GET.id;
		}

		if (undefined !== _GET.s) {
			this.H_Local.sort = _GET.s;
		}

		if (!(undefined !== this.H_Local.sort)) {
			this.H_Local.sort = "0,a";
		}

		this.O_Sess.SetPub(MailHistoryMenuView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			"menu.php": "\u30E1\u30FC\u30EB\u9001\u4FE1\u5C65\u6B74",
			"": "\u30E1\u30FC\u30EB\u8A73\u7D30"
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

	getMailFormElement() //$elem[] = array(
	//					"name" => "send_test_mail",
	//					"label" => "TESTメール送信",
	//					"inputtype" => "button",
	//					"options" => array( 
	//									"onClick" => "SendTestMail()",
	//									"id" => "send_test_mail"
	//								) );	
	//		$elem[] = array(
	//					"name" => "submit",
	//					"label" => "確認画面へ",
	//					"value" => "確認画面へ",
	//					"inputtype" => "submit",
	//				);
	//		$elem[] = array("name" => "reset",
	//						"label" => "リセット",
	//						"inputtype" => "button",
	//						"options" => array( "onClick" => "javascript:location.href='?r=1'" ) );
	//		$elem[] = array("name" => "cancel",
	//						"label" => "キャンセル",
	//						"inputtype" => "button",
	//						"options" => array( "onClick" => "javascript:ask_cancel('".$link_next."')" ) );
	//$elem[] = array("name" => "csrfid",
	//						"inputtype" => "hidden");
	{
		var elem = Array();
		var link_next = "";
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
				rows: "5"
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
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='menu.php';"
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
		return elem;
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

	makeMailForm(H_default = Array()) {
		var elem = this.getMailFormElement();
		this.A_MailForm = this.makeForm("mailForm", elem, Array(), H_default);
	}

	endView() //完了画面表示
	//$O_finish->displayFinish( "メールの送信","/Menu/menu.php", "請求一覧画面へ" );
	{
		var link_next = this.getReturnLink();
		var btn_name = "";

		switch (this.H_Local.post_prev.mail_type) {
			case "bill":
				btn_name = "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078";
				break;

			case "management":
				btn_name = "\u96FB\u8A71\u7BA1\u7406\u753B\u9762\u3078";
				break;

			case "order_history":
				btn_name = "\u6CE8\u6587\u5C65\u6B74\u3078";
				break;

			default:
				btn_name = "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078";
				break;
		}

		this.O_Sess.clearSessionSelf();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u30E1\u30FC\u30EB\u306E\u9001\u4FE1", link_next, btn_name);
	}

	displaySmarty(history, to_list, to_list_count, mail_target) //formをフリーズしておく
	//formをsmartyに登録
	//templateの取得
	//
	//メールターゲット(申請者、承認者)
	//表示を返す・・・
	//$this->get_Smarty()->display( KCS_DIR."/template/Bill/Mail/History/menu.tpl" );
	{
		var util = this.A_MailForm.util;
		util.updateAttributesWrapper({
			onsubmit: false
		});
		util.freezeWrapper();
		this.assignForm("O_form", this.A_MailForm.form);
		this.assignForm("O_listForm", this.A_ListForm.form);
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("H_list", H_to_list);
		this.get_Smarty().assign("list_cnt", to_list_count);
		this.get_Smarty().assign("loginname", this.O_Sess.loginname);
		this.get_Smarty().assign("loginid", this.O_Sess.loginid);

		switch (history.type) {
			case 1:
				var mail_type = "management";
				break;

			case 2:
				mail_type = "bill";
				break;

			case 3:
				mail_type = "order_history";
				break;
		}

		this.get_Smarty().assign("mail_type", mail_type);
		this.get_Smarty().assign("H_list", to_list);
		this.get_Smarty().assign("list_cnt", to_list_count);
		var page_link = MakePageLink.makePageLinkHTML(to_list_count, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("mail_target", mail_target);
		this.get_Smarty().display(KCS_DIR + "/template/Bill/Mail/SendMail.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};