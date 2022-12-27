//
//FAQ作成
//
//更新履歴：<br>
//2008/10/23	石崎公久	作成
//
//@package FAQ
//@uses InquiryBaseView
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//
//
//
//FAQ作成
//
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("view/FAQ/InquiryBaseView.php");

//
//選択されているお問い合わせのID
//
//@var mixed
//@access private
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//getID
//
//@author ishizaki
//@since 2008/10/19
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//addDefaults
//
//@author ishizaki
//@since 2008/09/10
//
//@access public
//@return void
//
//
//ベースが保有するQFオブジェクトに要素を追加
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//addFormRules
//
//@author ishizaki
//@since 2008/10/22
//
//@access public
//@return void
//
//
//makeFormElements
//
//@author ishizaki
//@since 2008/10/23
//
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/10/20
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
class MakeFAQView extends InquiryBaseView {
	static SELECT_PACTID = "\u63B2\u8F09\u5148\u9078\u629E";
	static SUBMIT_VALUE = "\u767B\u9332";

	constructor(H_param = undefined) {
		super(H_param);
		this.inquiryid = this.gSess().getPub(this.getSetting().faq_inquiryid);
		this.getSetting().loadConfig("H_fnc_car");
		this.H_assign.H_jsfile = ["shopfaqselect.js"];
	}

	getInquiryID() {
		return this.inquiryid;
	}

	checkCGIParam() {
		var H_post = this.gSess().getSelf("POST");

		if (0 < _POST.length && true == (undefined !== _POST.publictype)) {
			H_post.publictype = _POST.publictype;

			if (true == (undefined !== _POST.submit)) {
				H_post.submit = _POST.submit;
			}

			if (true == (undefined !== _POST.pactid)) {
				H_post.pactid = _POST.pactid;
			}

			this.gSess().setSelf("POST", H_post + _POST);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (0 < _POST.length && true == (undefined !== _POST.submit) && MakeFAQView.SELECT_PACTID === _POST.submit) {
			if (true == (undefined !== _POST.submit)) {
				H_post.submit = _POST.submit;
			}

			this.gSess().setSelf("POST", H_post + _POST);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (MakeFAQView.SELECT_PACTID === H_post.submit) {
			this.Mode = "selectpact";
			return true;
		}

		if (0 < _POST.length && true == (undefined !== _POST.submit) && MakeFAQView.SUBMIT_VALUE === _POST.submit) {
			if (true == (undefined !== _POST.submit)) {
				H_post.submit = _POST.submit;
			}

			this.gSess().setSelf("POST", H_post + _POST);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (MakeFAQView.SUBMIT_VALUE === H_post.submit) {
			this.setSubmitFlag(true);
			return true;
		}

		if (true === (undefined !== H_post.publictype)) {
			this.Mode = "selectpactconf";
			return true;
		}

		super.checkCGIParam();
	}

	addDefaults() {}

	addFormElements() {}

	addFormRules() {}

	makeFormElements() //$this->H_assign["H_car"] = array("a" => "ドコモ", "b" => "au");
	{
		var H_SessPost = this.gSess().getSelf("POST");
		this.A_elements = [{
			name: "title",
			label: "\u30BF\u30A4\u30C8\u30EB",
			inputtype: "text",
			options: "size=50"
		}, {
			name: "fnc",
			label: "\u533A\u5206",
			inputtype: "select",
			data: this.H_assign.H_car
		}, {
			name: "question",
			label: "\u8CEA\u554F",
			inputtype: "textarea",
			options: {
				cols: "50",
				rows: "15"
			}
		}, {
			name: "attachment",
			label: "\u6DFB\u4ED8",
			inputtype: "file",
			options: {
				size: 50
			}
		}, {
			name: "answer",
			label: "\u56DE\u7B54",
			inputtype: "textarea",
			options: {
				cols: "50",
				rows: "15"
			}
		}, {
			name: "note",
			label: "\u91CD\u8981\u5EA6",
			inputtype: "text",
			options: "size=3 maxlength=3"
		}];

		if (false == (false == is_null(H_SessPost) && "\u78BA\u8A8D\u753B\u9762\u3078" == H_SessPost.submit)) {
			this.A_elements.push({
				name: "submit",
				label: "\u78BA\u8A8D\u753B\u9762\u3078",
				inputtype: "submit"
			});
		} else {
			this.A_elements.push({
				name: "submit",
				label: "\u63B2\u8F09\u5148\u9078\u629E",
				inputtype: "submit"
			});
			this.O_Qf.freezeWrapper();
			H_SessPost.submit = "";
			this.gSess().setSelf("POST", H_SessPost);
		}

		this.addFormElements();
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();

		if (false == is_null(H_SessPost)) {
			delete H_SessPost.submit;
			this.O_Qf.setDefaultsWrapper(H_SessPost);
			this.addDefaults();
		} else if (false !== this.H_assign.formdefaults && false == is_null(this.H_assign.formdefaults)) {
			this.O_Qf.setDefaultsWrapper(this.H_assign.formdefaults);
			this.O_Qf.setDefaultsWrapper({
				fnc: "0",
				note: "50"
			});
			this.addDefaults();
		} else {
			this.O_Qf.setDefaultsWrapper({
				fnc: "0",
				note: "50"
			});
			this.addDefaults();
		}

		this.A_rules = [{
			name: "title",
			mess: "\u30BF\u30A4\u30C8\u30EB\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "question",
			mess: "\u8CEA\u554F\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "answer",
			mess: "\u56DE\u7B54\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "note",
			mess: "\u91CD\u8981\u5EA6\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "note",
			mess: "\u91CD\u8981\u5EA6\u306F\u534A\u89D2\u6570\u5B57\u3067\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "numeric",
			format: undefined,
			validation: "client"
		}, {
			name: "attachment",
			mess: "\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059\u3002",
			type: "maxfilesize",
			format: 5242880,
			validation: "server"
		}, {
			name: "note",
			mess: "\u91CD\u8981\u5EA6\u306F0-100\u3067\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "RangeInteger",
			format: [0, 100],
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

	displayFinish() {
		super.displayFinish("FAQ\u306E\u4F5C\u6210", "menu.php", "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7");
	}

	__destruct() {
		super.__destruct();
	}

};