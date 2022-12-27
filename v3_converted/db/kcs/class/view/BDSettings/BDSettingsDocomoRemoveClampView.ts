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
//@author igarashi<ishizaki@motion.co.jp>
//@since 2010/10/01
//
//
//
//請求ダウンロード設定
//
//@uses BDSettingsViewBase
//@package BDSettings
//@subpackage View
//@author igarashi<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("view/BDSettings/BDSettingsDocomoAddClampView.php");

//
//__construct
//
//@author igarashi
//@since 2008/07/31
//
//@param mixed $H_param
//@access public
//@return void
//
//
//_checkCGIParamFunctional
//
//@author
//@since 2010/11/15
//
//@access protected
//@return void
//
//
//makeFormElements
//
//@author
//@since 2010/11/16
//
//@access public
//@return void
//
//
//setDefault
//
//@author
//@since 2010/11/16
//
//@param mixed $H_default
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2008/07/30
//
//@access public
//@return void
//
class BDSettingsDocomoRemoveClampView extends BDSettingsDocomoAddClampView {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	_checkCGIFunctional() {
		if (undefined !== _GET.clampid && undefined !== _GET.detailno) {
			this.gSess().setSelf("GET", _GET);
		}

		var H_post = this.gSess().getSelf("POST");

		if (undefined !== H_post.submitConfirm) {
			this.submitFlag = true;
		}
	}

	makeFormElements() {
		var H_SessPost = this.gSess().getSelf("POST");
		this.A_elements = Array();

		if (false == (false == is_null(H_SessPost) && undefined !== H_SessPost.submitConfirm)) {
			this.A_elements.push({
				name: "submitConfirm",
				label: "\u524A\u9664\u3059\u308B",
				inputtype: "submit"
			});
		}

		this._addElements();

		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	setDefault(H_default) {
		this.O_Qf.setDefaultsWrapper(H_default);
	}

	__destruct() {
		super.__destruct();
	}

};