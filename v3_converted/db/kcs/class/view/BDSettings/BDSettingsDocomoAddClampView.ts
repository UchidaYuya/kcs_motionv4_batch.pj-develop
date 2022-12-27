//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01	石崎公久	作成
//
//@uses BDSettingsViewBase
//@package BDSettings
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//
//
//
//請求ダウンロード設定
//
//@uses BDSettingsViewBase
//@package BDSettings
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("view/BDSettings/BDSettingsAddViewBase.php");

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
//makeFormElements
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//_addElements
//
//@author
//@since 2010/11/24
//
//@access protected
//@return void
//
//
//_addRules
//
//@author
//@since 2010/11/24
//
//@access protected
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
class BDSettingsDocomoAddClampView extends BDSettingsAddViewBase {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	makeFormElements(H_str) {
		var H_SessPost = this.gSess().getSelf("POST");
		this.A_elements = [{
			name: "clampid",
			label: H_str.clampid,
			inputtype: "text",
			options: "size=25"
		}, {
			name: "clamppasswd",
			label: H_str.clamppasswd,
			inputtype: "password",
			options: "size=25"
		}, {
			name: "passwdcheck",
			label: H_str.clamppasswd + "\u78BA\u8A8D",
			inputtype: "password",
			options: "size=25"
		}];

		this._addElements();

		if (false == (false == is_null(H_SessPost) && undefined !== H_SessPost.submitConfirm)) {
			this.A_elements.push({
				name: "submitConfirm",
				label: "\u78BA\u8A8D\u753B\u9762\u3078",
				inputtype: "submit"
			});
		} else {
			this.A_elements.push({
				name: "submitFinish",
				label: "\u767B\u9332\u3059\u308B",
				inputtype: "submit"
			});
			this.O_Qf.freezeWrapper();
			H_SessPost.submit = "";
			this.gSess().setSelf("POST", H_SessPost);
		}

		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();

		if (!is_null(H_SessPost)) {
			this.O_Qf.setDefaultsWrapper({
				clampid: stripslashes(H_SessPost.clampid)
			});
			this.O_Qf.setDefaultsWrapper({
				clamppasswd: stripslashes(H_SessPost.clamppasswd)
			});
		}

		this.A_rules = [{
			name: "clampid",
			mess: H_str.clampid + "\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "clampid",
			mess: H_str.clampid + "\u306F\u534A\u89D2\u82F1\u6570\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "regex",
			format: "/[a-zA-Z0-9]/",
			validation: "client"
		}, {
			name: "clamppasswd",
			mess: H_str.clamppasswd + "\u306F\u534A\u89D2\u82F1\u6570\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "regex",
			format: "/[a-zA-Z0-9]/",
			validation: "client"
		}, {
			name: ["clamppasswd", "passwdcheck"],
			mess: H_str.clamppasswd + "\u3068\u78BA\u8A8D\u7528" + H_str.clamppasswd + "\u304C\u7570\u306A\u308A\u307E\u3059",
			type: "compare",
			format: undefined,
			validation: "client"
		}];

		this._addRules(H_str);

		this.O_Qf.makeFormRule(this.A_rules);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	setClampStr() {}

	_addElements() {}

	_addRules(H_str) {
		this.A_rules.push({
			name: "clamppasswd",
			mess: H_str.clamppasswd + "\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
	}

	__destruct() {
		super.__destruct();
	}

};