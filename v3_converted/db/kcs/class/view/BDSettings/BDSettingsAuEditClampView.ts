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

require("view/BDSettings/BDSettingsDocomoEditClampView.php");

require("view/BDSettings/BDSettingsAuAddClampView.php");

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
class BDSettingsAuEditClampView extends BDSettingsAuAddClampView {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	_addRules() {}

	_checkCGIFunctional() {
		if (undefined !== _GET.clampid && undefined !== _GET.detailno) {
			this.gSess().setSelf("GET", _GET);
		}
	}

	setDefault(H_default) //パスワードは表示しない
	{
		if (undefined !== H_default.clamppasswd) {
			H_default.clamppasswd = undefined;
		}

		if (undefined !== H_default.key_pass) {
			H_default.key_pass = undefined;
		}

		if (undefined !== H_default.key_file) {
			var pos = strrpos(H_default.key_file, "/");

			if (pos) {
				H_default.key_file = H_default.key_file.substr(pos + 1);
			}
		}

		this.O_Qf.setDefaultsWrapper(H_default);
	}

	__destruct() {
		super.__destruct();
	}

};