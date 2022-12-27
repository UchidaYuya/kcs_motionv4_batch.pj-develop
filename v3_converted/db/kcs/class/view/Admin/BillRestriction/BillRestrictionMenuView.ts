require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("view/MakePageLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//__construct
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//getLocalSession
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//makeForm
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//makeFormLimit
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//__makeForm
//
//@author web
//@since 2019/04/23
//
//@param mixed $form_name
//@param array $elements
//@param array $rules
//@param array $default
//@access private
//@return void
//
//
//displaySmarty
//
//@author web
//@since 2019/04/23
//
//@param mixed $pacts
//@param mixed $pacts_count
//@param mixed $offset
//@param mixed $limit
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
class BillRestrictionMenuView extends ViewSmarty {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Sess = MtSession.singleton();
		this.H_Local = this.O_Sess.getSelfAll();
	}

	checkCGIParam() //初期化
	//-------------------------------------------------------
	//GETパラメーターは削除する
	//-------------------------------------------------------
	{
		if (!Array.isArray(this.H_Local)) {
			this.H_Local = Array();
		}

		if (undefined !== _GET.r) {
			delete this.H_Local.post;
		}

		if (!(undefined !== this.H_Local.post)) {
			var init_value = Array();
			init_value.userid_ini = "";
			init_value.type = "";
			init_value.compname = "";
			init_value.pactid = "";
			this.H_Local.post = init_value;
		}

		if (!(undefined !== this.H_Local.view)) {
			init_value = Array();
			init_value.limit = 50;
			this.H_Local.view = init_value;
		}

		if (!(undefined !== this.H_Local.page)) {
			this.H_Local.page = 1;
		}

		if (_POST.submit == "\u8868\u793A") {
			this.H_Local.view = _POST;
		}

		if (_POST.submit == "\u691C\u7D22") {
			this.H_Local.post = _POST;
			this.H_Local.page = 1;
		}

		if (undefined !== _GET.p && is_numeric(_GET.p) && _GET.p > 0) {
			this.H_Local.page = _GET.p;
		}

		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getLocalSession() {
		return this.H_Local;
	}

	makeForm() //---------------------------------------------------------------------------
	////	何故か必須扱いになってしまうのでやめた
	//		$rules[] =	array(	"name" => "userid_ini",
	//							"mess" => "会社コードは半角英数字で入力してください。",
	//							"type" => "QRalnumRegex",
	////							"format" => null,
	//							"validation" => "client");
	{
		var rules;
		var elements = rules = Array();
		var type_list = {
			"": "\u5168\u3066",
			H: "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3",
			M: "KCSMotion"
		};
		elements.push({
			name: "userid_ini",
			label: "\u4F1A\u793E\u30B3\u30FC\u30C9",
			inputtype: "text"
		});
		elements.push({
			name: "pactid",
			label: "\u9867\u5BA2ID",
			inputtype: "text"
		});
		elements.push({
			name: "type",
			label: "\u8B58\u5225",
			inputtype: "select",
			data: type_list
		});
		elements.push({
			name: "compname",
			label: "\u9867\u5BA2\u540D",
			inputtype: "text"
		});
		elements.push({
			name: "submit",
			label: "\u691C\u7D22",
			value: "\u691C\u7D22",
			inputtype: "submit"
		});
		elements.push({
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='?r=1'"
			}
		});
		rules.push({
			name: "pactid",
			mess: "\u9867\u5BA2ID\u306F\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			validation: "client"
		});
		return this.__makeForm("O_form", elements, rules, this.H_Local.post);
	}

	makeFormLimit() //---------------------------------------------------------------------------
	{
		var rules;
		var elements = rules = Array();
		elements.push({
			name: "limit",
			label: "\u4EF6\u6570",
			inputtype: "text",
			options: {
				size: "1",
				maxlength: "3"
			}
		});
		elements.push({
			name: "submit",
			label: "\u8868\u793A",
			value: "\u8868\u793A",
			inputtype: "submit"
		});
		rules.push({
			name: "limit",
			mess: "\u6570\u91CF\u3092\u6570\u5024\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u5C0F\u6570\u4E0D\u53EF)",
			type: "QRIntNumeric",
			format: "required",
			validation: "client"
		});
		return this.__makeForm("O_formLimit", elements, rules, this.H_Local.view);
	}

	__makeForm(form_name, elements: {} | any[] = Array(), rules: {} | any[] = Array(), default: {} | any[] = Array()) //FormUtil生成
	//Form作成
	//ルールの設定
	//フォームに初期値設定。
	//$util->setDefaultsWrapper( $default );
	//デフォルト値はこっちで・・
	//smarty用に作成
	//smartyに登録
	{
		var util = new QuickFormUtil(form_name);
		util.setFormElement(elements);
		var form = util.makeFormObject();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex", "QRForbiddenCharacter"];
		util.registerOriginalRules(A_orgrule);
		util.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		util.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		util.makeFormRule(rules);
		form.setConstants(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign(form_name, render.toArray());
		return util.validateWrapper();
	}

	displaySmarty(pacts, pacts_count, offset, limit, year_now, month_now, time_now, year_prev, month_prev, time_prev) //pacts
	//123456789のやつ
	//pactidの一覧を・・
	{
		var H_navi = Array();
		H_navi[""] = "\u305D\u306E\u4ED6\u306E\u5185\u5BB9\u8A2D\u5B9A";
		H_navi = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.get_Smarty().assign("admin_submenu", H_navi);
		this.get_Smarty().assign("groupid", _SESSION.admin_groupid);
		this.get_Smarty().assign("pacts", pacts);
		var page_link = MakePageLink.makePageLinkHTML(pacts_count, limit, offset);
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("year_now", year_now);
		this.get_Smarty().assign("month_now", month_now);
		this.get_Smarty().assign("time_now", time_now);
		this.get_Smarty().assign("year_prev", year_prev);
		this.get_Smarty().assign("month_prev", month_prev);
		this.get_Smarty().assign("time_prev", time_prev);
		var temp = Array();

		for (var key in pacts) {
			var value = pacts[key];
			temp.push(value.pactid);
		}

		this.get_Smarty().assign("pactid_list", temp.join(","));
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};