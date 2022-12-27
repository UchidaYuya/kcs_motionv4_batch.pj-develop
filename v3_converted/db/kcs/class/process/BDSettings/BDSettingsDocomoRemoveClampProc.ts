//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/11/15 五十嵐 作成
//
//@uses BDSettingsDocomoRemoveClamp
//@package BDSettings
//@subpackage Process
//@author igarashi
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
//@author igarashi
//@since 2010/10/01
//

require("process/BDSettings/BDSettingsBaseProc.php");

require("view/BDSettings/BDSettingsDocomoRemoveClampView.php");

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
//doExecute
//
//@author igarashi
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
//@since 2010/11/18
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
class BDSettingsDocomoRemoveClampProc extends BDSettingsBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsDocomoRemoveClampView)) {
			this.O_view = new BDSettingsDocomoRemoveClampView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_Post = this.getView().gSess().getSelf("POST");
		var H_Get = this.getView().gSess().getSelf("GET");
		var O_gs = this.getView().gSess();
		this.getView().setDefault(H_Get);
		this.getView().setAssign("clampid", H_Get.clampid);
		var H_str = O_Clamp.getClampString();

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_str);
		} else {
			if (true === O_Clamp.removeClamp(this.getView().gSess().pactid, O_Clamp.getCarId(), H_Get.detailno, H_Post)) {
				this.getView().setAssign("result", H_str.clampid + "\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
			}
		}

		this.getView().setNaviHTML(this.setNaviArray(H_str.clampid));
		this.getView().setAssign("H_str", H_str);
		this.getView().displayHTML(result);
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/docomo/management.php": "NTT\u30C9\u30B3\u30E2\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u524A\u9664"
		};
	}

	__destruct() {
		super.__destruct();
	}

};