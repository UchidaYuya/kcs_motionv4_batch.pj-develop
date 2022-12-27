//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsAuEditNumberView
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

require("process/BDSettings/BDSettingsAuAddNumberProc.php");

require("model/BDSettingsModel.php");

require("view/BDSettings/BDSettingsAuEditNumberView.php");

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
//@since 2010/11/19
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
class BDSettingsAuEditNumberProc extends BDSettingsAuAddNumberProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsAuEditNumberView)) {
			this.O_view = new BDSettingsAuEditNumberView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var H_post = this.getView().gSess().getSelf("POST");
		var H_get = this.getView().gSess().getSelf("GET");
		var O_model = this.getModel();
		var H_string = O_model.getClampString();

		if (false === this.getView().getSubmitFlag()) {
			this.getView().setDefault(O_model.getParentTel(this.getView().gSess().pactid, O_model.getCarId(), H_get.prtelno));
			this.getView().makeFormElements(H_string);
		} else {
			O_model.editParentTel(this.getView().gSess().pactid, O_model.getCarId(), H_get.prtelno, H_post);
			this.getview().setAssign("result", "\u89AA\u756A\u53F7\u3092\u4FEE\u6B63\u3057\u307E\u3057\u305F");
		}

		this.getView().setNaviHTML(this.setNaviArray(H_string.prtelno));
		this.getView().displayHTML();
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/au/management.php": "au\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u5909\u66F4"
		};
	}

	__destruct() {
		super.__destruct();
	}

};