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
//require_once("view/BDSettings/BDSettingsSoftbankEditNumberView.php");
//
//請求ダウンロード設定
//
//@uses BDSettingsViewBase
//@package BDSettings
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("view/BDSettings/BDSettingsDocomoEditNumberView.php");

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
//checkCGIFunctional
//
//@author
//@since 2010/11/16
//
//@access protected
//@return void
//
//protected function _checkCGIFunctional(){
//		if (isset($_GET["prtelno"])) {
//			$this->gSess()->setSelf("GET", $_GET);
//		}
//	}
//
//setDefault
//
//@author
//@since 2010/11/16
//
//@param mixed $H_data
//@access public
//@return void
//
//public function setDefault($H_data){
//		$this->O_Qf->setDefaultsWrapper($H_data);
//	}
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class BDSettingsSoftbankEditNumberView extends BDSettingsDocomoEditNumberView {
	constructor(H_param = undefined) {
		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}
	}

	__destruct() {
		super.__destruct();
	}

};