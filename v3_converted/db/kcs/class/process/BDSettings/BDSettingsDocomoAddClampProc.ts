//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsDocomoAddClamp
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

require("view/BDSettings/BDSettingsDocomoAddClampView.php");

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
class BDSettingsDocomoAddClampProc extends BDSettingsBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsDocomoAddClampView)) {
			this.O_view = new BDSettingsDocomoAddClampView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_Post = this.getView().gSess().getSelf("POST");
		var O_gs = this.getView().gSess();
		var H_string = O_Clamp.getClampString();

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_string);
		} else {
			if (1 == O_Clamp.addClamp(this.getView().gSess().pactid, O_Clamp.getCarId(), H_Post)) {
				this.getView().setAssign("result", H_string.clampid + "\u3092\u767B\u9332\u3057\u307E\u3057\u305F");
			}
		}

		this.getView().setNaviHTML(this.setNaviArray(H_string.clampid));
		this.getView().displayHTML(result);
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