//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsSoftbankEditNumberView
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

require("process/BDSettings/BDSettingsDocomoEditNumberProc.php");

require("model/BDSettingsModel.php");

require("view/BDSettings/BDSettingsSoftbankEditNumberView.php");

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
//public function doExecute( array $H_param = array() ){
//		$this->getView()->startCheck();
//		$this->getView()->setNaviHTML($this->setNaviArray());
//		$H_post = $this->getView()->gSess()->getSelf("POST");
//		$H_get = $this->getView()->gSess()->getSelf("GET");
//		$O_Clamp = $this->_getModel();
//		if (false === $this->getView()->getSubmitFlag()) {
//			$this->getView()->setDefault($O_Clamp->getParentTel($this->getView()->gSess()->pactid, $O_Clamp->getCarId(), $H_get["prtelno"]));
//			$this->getView()->makeFormElements();
//		} else {
//			if (true == $O_Clamp->checkParentTel($this->getView()->gSess()->pactid, $O_Clamp->getCarId(), $H_post)) {
//				$O_Clamp->editParentTel($this->getView()->gSess()->pactid, $O_Clamp->getCarId(), $H_get["prtelno"], $H_post);
//				$this->getview()->setAssign("result", "親番号を修正しました");
//			}
//		}
//		$this->getView()->displayHTML();
//	}
//
//setNaviArray
//
//@author
//@since 2010/11/18
//
//@access protected
//@return void
//
//
//_getModel
//
//@author
//@since 2010/11/16
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
class BDSettingsSoftbankEditNumberProc extends BDSettingsDocomoEditNumberProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsSoftbankEditNumberView)) {
			this.O_view = new BDSettingsSoftbankEditNumberView();
		}

		return this.O_view;
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/softbank/management.php": "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u5909\u66F4"
		};
	}

	_getModel() {
		if (!this._bdSettingModel instanceof BDSettingsModel) {
			this._bdSettingModel = new BDSettingsModel();
		}

		return this._bdSettingModel;
	}

	__destruct() {
		super.__destruct();
	}

};