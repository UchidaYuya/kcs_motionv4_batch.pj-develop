//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/11/15 五十嵐 作成
//
//@uses BDSettingsSoftbankEditClamp
//@package BDSettings
//@subpackage Process
//@author igarashi
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
//@author igarashi
//@since 2010/10/01
//

require("process/BDSettings/BDSettingsDocomoEditClampProc.php");

require("view/BDSettings/BDSettingsSoftbankEditClampView.php");

//
//コンストラクト
//
//@author igarashi
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//Viewクラスの生成
//
//@author igarashi
//@since 2008/10/16
//
//@access protected
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
//@author igarashi
//@since 2008/06/26
//
//@access public
//@return void
//
class BDSettingsSoftbankEditClampProc extends BDSettingsDocomoEditClampProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsSoftbankEditClampView)) {
			this.O_view = new BDSettingsSoftbankEditClampView();
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

	__destruct() {
		super.__destruct();
	}

};