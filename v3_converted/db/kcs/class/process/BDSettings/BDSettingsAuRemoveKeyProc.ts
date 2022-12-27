//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/11/15 五十嵐 作成
//
//@uses BDSettingsAuRemoveKey
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

require("process/BDSettings/BDSettingsAuRemoveClampProc.php");

require("view/BDSettings/BDSettingsAuRemoveKeyView.php");

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
class BDSettingsAuRemoveKeyProc extends BDSettingsAuRemoveClampProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsAuRemoveKeyView)) {
			this.O_view = new BDSettingsAuRemoveKeyView();
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
		this.getView().setAssign("keyfile", H_Get.keyfile);
		var H_str = O_Clamp.getClampString();

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_str);
		} else {
			var result = O_Clamp.removeKeyFile(this.getView().gSess().pactid, H_Get.keyfile);

			if (0 === result) {
				this.getView().setAssign("result", H_str.key_file + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
			} else if (1 === result) {
				this.getView().setAssign("result", H_str.key_file + "\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
			} else if (2 === result) {
				this.getView().setAssign("result", H_str.key_file + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			}
		}

		this.getView().setNaviHTML(this.setNaviArray(H_str.key_file));
		this.getView().setAssign("H_str", H_str);
		this.getView().displayHTML(result);
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