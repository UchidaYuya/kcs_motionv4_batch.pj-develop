//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsAuRemoveNumberView
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("process/BDSettings/BDSettingsBaseProc.php");
//
//請求ダウンロード設定
//
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("process/BDSettings/BDSettingsDocomoRemoveNumberProc.php");

require("model/BDSettingsModel.php");

require("view/BDSettings/BDSettingsAuRemoveNumberView.php");

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
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class BDSettingsAuRemoveNumberProc extends BDSettingsDocomoRemoveNumberProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsAuRemoveNumberView)) {
			this.O_view = new BDSettingsAuRemoveNumberView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_str = O_Clamp.getClampString();
		this.getView().setNaviHTML(this.setNaviArray(H_str.prtelno));
		var H_post = this.getView().gSess().getSelf("POST");
		var H_get = this.getView().gSess().getSelf("GET");
		var H_prtel = O_Clamp.getParentTel(this.getView().gSess().pactid, O_Clamp.getCarId(), H_get.prtelno);
		this.getView().setAssign("data", H_prtel);

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements();
		} else {
			O_Clamp.removeParentTel(this.getView().gSess().pactid, O_Clamp.getCarId(), H_prtel.prtelno);
			this.getview().setAssign("result", "\u89AA\u756A\u53F7\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
		}

		this.getView().setAssign("H_str", O_Clamp.getClampString());
		this.getView().displayHTML();
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/au/management.php": "au\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u524A\u9664"
		};
	}

	__destruct() {
		super.__destruct();
	}

};