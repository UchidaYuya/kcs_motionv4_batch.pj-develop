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

require("view/BDSettings/BDSettingsViewBase.php");

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
//getSet
//
//@author
//@since 2010/10/21
//
//@access public
//@return void
//
//
//checkCGIParam
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
//@since 2010/11/15
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
class BDSettingsAddViewBase extends BDSettingsViewBase {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	getSet() {
		return this.getSetting();
	}

	checkCGIParam() {
		if (0 < _POST.length && undefined !== _POST.submitConfirm) {
			for (var key in _POST) {
				var val = _POST[key];
				_POST[key] = val.replace(/<|>/g, "");
			}

			this.gSess().setSelf("POST", _POST);

			if (0 < _FILES.length) {
				this.gSess().setSelf("FILE", _FILES);
			}
		}

		var H_post = this.gSess().getSelf("POST");

		if (undefined !== _GET.input && "normal" == _GET.input) {
			if (!is_null(H_post)) {
				delete H_post.submitConfirm;
				this.gSess().setSelf("POST", H_post);
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (undefined !== _POST.submitFinish) {
			this.submitFlag = true;
		}

		this._checkCGIFunctional();
	}

	_checkCGIFunctional() {}

	__destruct() {
		super.__destruct();
	}

};