//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsDocomoAddNumberView
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//請求ダウンロード設定
//
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("process/BDSettings/BDSettingsBaseProc.php");

require("model/BDSettingsModel.php");

require("view/BDSettings/BDSettingsDocomoAddNumberView.php");

//
//clampModel
//
//@var mixed
//@access protected
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//Viewクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//doExecute
//
//@author ishizaki
//@since 2008/08/27
//
//@param array $H_param
//@access public
//@return void
//
//
//setNaviArray
//
//@author
//@since 2010/11/17
//
//@access protected
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class BDSettingsDocomoAddNumberProc extends BDSettingsBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsDocomoAddNumberView)) {
			this.O_view = new BDSettingsDocomoAddNumberView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_str = O_Clamp.getClampString();
		this.getView().setNaviHTML(this.setNaviArray(H_str.prtelno));
		var H_post = this.getView().gSess().getSelf("POST");

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_str);
		} else {
			if (true == O_Clamp.checkParentTel(this.getView().gSess().pactid, O_Clamp.getCarId(), H_post)) {
				O_Clamp.addParentTel(this.getView().gSess().pactid, O_Clamp.getCarId(), H_post);
				this.getview().setAssign("result", H_str.prtelno + "\u3092\u767B\u9332\u3057\u307E\u3057\u305F");
			}
		}

		this.getView().displayHTML();
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/docomo/management.php": "NTT\u30C9\u30B3\u30E2\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u65B0\u898F\u767B\u9332"
		};
	}

	__destruct() {
		super.__destruct();
	}

};