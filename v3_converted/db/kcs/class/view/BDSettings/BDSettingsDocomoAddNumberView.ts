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

require("view/BDSettings/BDSettingsDocomoAddClampView.php");

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
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class BDSettingsDocomoAddNumberView extends BDSettingsDocomoAddClampView {
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
			name: "prtelno",
			label: H_str.prtelno,
			inputtype: "text",
			options: "size=50"
		}, {
			name: "prtelname",
			label: H_str.prtelname,
			inputtype: "text",
			options: "size=50"
		}];

		if (false == (false == is_null(H_SessPost) && "\u78BA\u8A8D\u753B\u9762\u3078" == H_SessPost.submitConfirm)) {
			this.A_elements.push({
				name: "submitConfirm",
				label: "\u78BA\u8A8D\u753B\u9762\u3078",
				inputtype: "submit"
			});
		} else {
			this.A_elements.push({
				name: "submitFinish",
				label: "\u767B\u9332",
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
				prtelno: stripslashes(H_SessPost.prtelno)
			});
			this.O_Qf.setDefaultsWrapper({
				prtelname: stripslashes(H_SessPost.prtelname)
			});
		}

		this.A_rules = [{
			name: "prtelno",
			mess: H_str.prtelno + "\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "prtelname",
			mess: H_str.prtelname + "\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "prtelno",
			mess: H_str.prtelno + "\u306F\u534A\u89D2\u82F1\u6570\u3068(\u3001)\u3001-\u3001\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "regex",
			format: "/^[a-zA-Z0-9-()]+$/",
			validation: "client"
		}];
		this.O_Qf.makeFormRule(this.A_rules);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	__destruct() {
		super.__destruct();
	}

};