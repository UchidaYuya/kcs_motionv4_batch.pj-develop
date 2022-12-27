//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30	石崎公久	作成
//
//@package FAQ
//@uses FAQViewBase
//@uses QuickFormUtil
//@uses ArraySmarty
//@uses MtUtil
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//
//
//
//お問い合わせ　一覧
//
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("view/FAQ/FAQViewBase.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

//
//O_Qf
//
//@var mixed
//@access protected
//
//
//O_MTU
//
//@var mixed
//@access protected
//
//
//H_post
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_param
//@access public
//@return void
//
//
//getMode
//
//@author ishizaki
//@since 2008/09/04
//
//@access public
//@return void
//
//
//getPost
//
//@author ishizaki
//@since 2008/10/29
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/10/29
//
//@access public
//@return void
//
//
//makeFormElements
//
//@author ishizaki
//@since 2008/10/29
//
//@access public
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class FAQListViewBase extends FAQViewBase {
	constructor(H_param = undefined) {
		super(H_param);
		this.O_Qf = new QuickFormUtil("form");
		this.O_MTU = new MtUtil();
		this.H_post = undefined;
		this.clearLastForm();
	}

	getMode() {
		return this.Mode;
	}

	getPost() {
		return this.H_post;
	}

	checkCGIParam() {
		if (0 < _GET.length && true == (undefined !== _GET.reset)) {
			this.gSess().clearSessionKeySelf("POST");
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (0 < _GET.length && true == (undefined !== _GET.p)) {
			this.gSess().setSelf("p", _GET.p);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (0 < _POST.length) {
			this.H_post = _POST;
			this.gSess().setSelf("POST", _POST);
			this.gSess().clearSessionKeySelf("p");
		} else if (0 == _POST.length && undefined !== this.gSess().getSelf("POST")) {
			this.H_post = this.gSess().getSelf("POST");
		}

		super.checkCGIParam();
	}

	makeFormElements() {
		var H_SessPost = this.gSess().getSelf("POST");
		this.A_elements = [{
			name: "searchtext",
			label: "\u691C\u7D22\u6587\u5B57",
			inputtype: "text",
			options: "size=20"
		}, {
			name: "status",
			label: "\u30B9\u30C6\u30FC\u30BF\u30B9",
			inputtype: "select",
			data: {
				"": "\u3059\u3079\u3066\u304B\u3089\u691C\u7D22",
				"0": "\u304A\u554F\u3044\u5408\u308F\u305B\u4E2D",
				"50": "\u5B8C\u4E86",
				"100": "FAQ"
			}
		}, {
			name: "datefrom",
			label: "\u65E5\u4ED8",
			inputtype: "date",
			data: this.O_MTU.getDateFormat()
		}, {
			name: "dateto",
			label: "\u65E5\u4ED8",
			inputtype: "date",
			data: this.O_MTU.getDateFormat()
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='?reset'"
			}
		}];
		this.addFormElements();
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		this.O_Qf.setDefaultsWrapper({
			publiclevel: 0
		});

		if (false == is_null(H_SessPost)) {
			this.O_Qf.setDefaultsWrapper(H_SessPost);
			this.addDefaults();
		} else if (false !== this.H_assign.formdefaults) {
			this.O_Qf.setDefaultsWrapper({
				inquiryname: this.H_assign.formdefaults.inquiryname
			});
			this.O_Qf.setDefaultsWrapper({
				contents: this.H_assign.formdefaults.contents
			});
			this.O_Qf.setDefaultsWrapper({
				publiclevel: this.H_assign.formdefaults.publiclevel
			});
			this.O_Qf.setDefaultsWrapper({
				status: 0
			});
			this.addDefaults();
		}

		this.A_rules = [{
			name: "datefrom",
			mess: "\u958B\u59CB\u65E5\u4ED8\u306F\u6B63\u3057\u304F\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}, {
			name: "dateto",
			mess: "\u7D42\u4E86\u65E5\u4ED8\u306F\u6B63\u3057\u304F\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}, {
			name: ["dateto", "datefrom"],
			mess: "\u7D42\u4E86\u65E5\u4ED8\u306F\u958B\u59CB\u65E5\u4ED8\u3088\u308A\u3042\u3068\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRDatecompareRule",
			format: "gt",
			validation: "client"
		}];
		this.addFormRules();

		for (var key in _FILES) {
			var value = _FILES[key];

			if (_FILES[key].name != "" && preg_match("/\\.(xls|xlt|csv|pdf|doc|ppt|zip|lzh|pgp|html|htm|text|txt|gif|jpg|jpeg)$/i", _FILES[key].name) == false) {
				this.O_Qf.setElementErrorWrapper(key, "\u8A31\u53EF\u3055\u308C\u3066\u3044\u306A\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u7A2E\u985E\u306F\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093");
			}

			if (_FILES[key].error == 2) {
				this.O_Qf.setElementErrorWrapper(key, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306E\u6700\u5927\u30B5\u30A4\u30BA\u306F\uFF13MB\u307E\u3067\u3067\u3059");
			}
		}

		this.O_Qf.makeFormRule(this.A_rules);
		this.O_Qf.setDefaultWarningNote();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	displayHTML() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};