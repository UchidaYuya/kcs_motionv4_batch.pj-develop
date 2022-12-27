//
//パスワード再設定プロセス
//
//@uses ProcessBaseHtml
//@package
//@author igarashi
//@since 2012/12/05
//

require("process/ProcessBaseHtml.php");

require("model/Forget/resettingPasswordModel.php");

require("view/Forget/resettingPasswordView.php");

//
//doExecute
//
//@author igarashi
//@since 2012/12/07
//
//@param array $H_param
//@access protected
//@return void
//
//
//setUserConfig
//
//@author igarashi
//@since 2012/12/07
//
//@param array $configs
//@access public
//@return void
//
//
//setSystemConfig
//
//@author igarashi
//@since 2012/12/07
//
//@param array $config
//@access public
//@return void
//
//
//_getResettingModel
//
//@author igarashi
//@since 2012/12/04
//
//@access protected
//@return void
//
//
//_getResettingView
//
//@author igarashi
//@since 2012/12/04
//
//@access protected
//@return void
//
class resettingPasswordProc extends ProcessBaseHtml {
	constructor() {
		super(...arguments);
		this._mObj = undefined;
		this._vObj = undefined;
	}

	doExecute(H_param: {} | any[] = Array()) {
		var mObj = this._getResettingModel();

		var vObj = this._getResettingView();

		vObj.setModelObject(mObj);
		mObj.setViewObject(vObj);
		vObj.getParam();
		var sess = vObj.gSess().getSelf("passReset");

		if (mObj.checkUserId()) {
			if (!is_null(sess)) {
				mObj.makePassword();
				mObj.beginTransaction();
				mObj.writeLog();
				mObj.updatePassword();
				mObj.endTransaction();
				mObj.sendMail();
			}

			vObj.transfer();
		}

		vObj.displaySmarty();
	}

	setUserConfig(configs: {} | any[]) {
		for (var key in configs) {
			var config = configs[key];

			switch (key) {
				case "tpl":
					this._getResettingView().setTplFile(config);

					break;

				case "tplpath":
					this._getResettingView().setTplPath(config);

					break;

				case "pactcode":
					this._getResettingView().setPactCode(config);

					break;

				case "groupid":
					this._getResettingView().setGroupId(config);

					break;

				case "verisign":
					this._getResettingView().setVerisign(config);

					break;
			}
		}
	}

	setSystemConfig(config: {} | any[]) {}

	_getResettingModel() {
		if (!this._mObj instanceof resettingPasswordModel) {
			this._mObj = new resettingPasswordModel();
		}

		return this._mObj;
	}

	_getResettingView() {
		if (!this._vObj instanceof resettingPasswordView) {
			this._vObj = new resettingPasswordView();
		}

		return this._vObj;
	}

};