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

		if (_POST.length > 0) {
			var mail_type = undefined !== _POST.mail_type ? _POST.mail_type : "";

			if (mail_type != "") //POST情報の取得
				//対象のリストとか格納する
				//対象年月とか部署の取得
				{
					this.H_Local.menu_uri = _SERVER.HTTP_REFERER;
					this.H_Local.post_prev = _POST;

					if (mail_type == "order_history") //注文履歴から来た場合。注文番号一覧を作成
						//注文番号一覧を取得
						{
							this.H_Local.order_list = Array();

							for (var key in _POST) {
								var value = _POST[key];

								if (strpos(key, "id") === 0) {
									var data = value.split(":");
									this.H_Local.order_list.push(data[0]);
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
								}
							}
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

		if (undefined !== _GET.s) {
			this.H_Local.sort = _GET.s;
		} else if (!(undefined !== this.H_Local.sort)) {
			this.H_Local.sort = "1,d";
		}

		if (undefined !== _POST.limit) {
			this.H_Local.limit = _POST.limit;
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
			"": "\u30E1\u30FC\u30EB\u9001\u4FE1\u5C65\u6B74"
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

	displaySmarty(H_list, list_count) //templateの取得
	//表示を返す・・・
	{
		this.assignForm("O_listForm", this.A_ListForm.form);
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		var page_link = MakePageLink.makePageLinkHTML(list_count, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("list_cnt", list_count);
		this.get_Smarty().assign("loginname", this.O_Sess.loginname);
		this.get_Smarty().assign("loginid", this.O_Sess.loginid);
		this.get_Smarty().assign("limit", this.H_Local.limit);
		this.get_Smarty().display(KCS_DIR + "/template/Bill/Mail/History/menu.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};