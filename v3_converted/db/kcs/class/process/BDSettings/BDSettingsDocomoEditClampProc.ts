//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/11/15 五十嵐 作成
//
//@uses BDSettingsDocomoEditClamp
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

require("view/BDSettings/BDSettingsDocomoEditClampView.php");

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
class BDSettingsDocomoEditClampProc extends BDSettingsBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsDocomoEditClampView)) {
			this.O_view = new BDSettingsDocomoEditClampView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_string = O_Clamp.getClampString();
		var H_Post = this.getView().gSess().getSelf("POST");
		var H_Get = this.getView().gSess().getSelf("GET");
		var O_gs = this.getView().gSess();
		this.getView().setDefault(H_Get);

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_string, false);
		} else {
			if (1 == O_Clamp.editClamp(this.getView().gSess().pactid, O_Clamp.getCarId(), H_Get.detailno, H_Post)) {
				this.getView().setAssign("result", H_string.clampid + "\u3092\u5909\u66F4\u3057\u307E\u3057\u305F");
			} else {
				this.getView().setAssign("result", "\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" + H_string.clampid + "\u304C\u91CD\u8907\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059");
			}
		}

		this.getView().setNaviHTML(this.setNaviArray(H_string.clampid));
		this.getView().displayHTML(result);
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/docomo/management.php": "NTT\u30C9\u30B3\u30E2\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u5909\u66F4"
		};
	}

	__destruct() {
		super.__destruct();
	}

};