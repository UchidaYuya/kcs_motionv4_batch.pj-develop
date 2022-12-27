//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsSoftbankAddClamp
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

require("process/BDSettings/BDSettingsDocomoAddClampProc.php");

require("view/BDSettings/BDSettingsSoftbankAddClampView.php");

//class BDSettingsSoftbankAddClampProc extends BDSettingsBaseProc{
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
//setNaviArray
//
//@author
//@since 2010/11/17
//
//@access private
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
class BDSettingsSoftbankAddClampProc extends BDSettingsDocomoAddClampProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsSoftbankAddClampView)) {
			this.O_view = new BDSettingsSoftbankAddClampView();
		}

		return this.O_view;
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/softbank/management.php": "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u65B0\u898F\u767B\u9332"
		};
	}

	__destruct() {
		super.__destruct();
	}

};