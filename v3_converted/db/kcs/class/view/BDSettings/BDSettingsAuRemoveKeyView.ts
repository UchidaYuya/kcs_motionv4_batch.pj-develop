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

require("view/BDSettings/BDSettingsAuRemoveClampView.php");

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
//__destruct
//
//@author igarashi
//@since 2008/07/30
//
//@access public
//@return void
//
class BDSettingsAuRemoveKeyView extends BDSettingsAuRemoveClampView {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	_checkCGIFunctional() {
		if (undefined !== _GET.keyfile) {
			this.gSess().setSelf("GET", _GET);
		}

		var H_post = this.gSess().getSelf("POST");

		if (undefined !== H_post.submitConfirm) {
			this.submitFlag = true;
		}
	}

	__destruct() {
		super.__destruct();
	}

};