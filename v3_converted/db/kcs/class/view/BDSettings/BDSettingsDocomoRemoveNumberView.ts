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
//require_once("view/BDSettings/BDSettingsAddViewBase.php");
//
//請求ダウンロード設定
//
//@uses BDSettingsViewBase
//@package BDSettings
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("view/BDSettings/BDSettingsDocomoRemoveClampView.php");

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
//_checkCGIFunctional
//
//@author
//@since 2010/11/17
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
class BDSettingsDocomoRemoveNumberView extends BDSettingsDocomoRemoveClampView {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	makeFormElements() {
		this.A_elements = [{
			name: "submitFinish",
			label: "\u524A\u9664",
			inputtype: "submit"
		}];

		this._addElements();

		H_SessPost.submit = "";
		this.gSess().setSelf("POST", H_SessPost);
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	_checkCGIFunctional() {
		if (undefined !== _GET.prtelno) {
			this.gSess().setSelf("GET", _GET);
		}
	}

	__destruct() {
		super.__destruct();
	}

};