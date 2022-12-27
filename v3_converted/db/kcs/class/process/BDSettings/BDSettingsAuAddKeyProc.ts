//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsAuAddClamp
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

require("process/BDSettings/BDSettingsAuAddClampProc.php");

require("view/BDSettings/BDSettingsAuAddKeyView.php");

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
class BDSettingsAuAddKeyProc extends BDSettingsAuAddClampProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsAuAddKeyView)) {
			this.O_view = new BDSettingsAuAddKeyView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.getView().startCheck();
		var O_Clamp = this.getModel();
		var H_Post = this.getView().gSess().getSelf("POST");
		var H_File = this.getView().gSess().getSelf("FILE");
		var O_gs = this.getView().gSess();
		var H_string = O_Clamp.getClampString();

		if (false === this.getView().getSubmitFlag()) {
			this.getView().makeFormElements(H_string, O_Clamp.getKeyFileList(O_gs.pactid, O_Clamp.getCarId()));

			if (undefined !== H_File.key_file.name) {
				this.getView().setAssign("filename", H_File.key_file.name);
			}
		} else {
			if (O_Clamp.addKeyFile(O_gs.pactid)) {
				if (O_Clamp.convertPem(O_gs.pactid, H_Post.key_pass)) {
					this.getView().setAssign("result", H_string.key_file + "\u3092\u767B\u9332\u3057\u307E\u3057\u305F");
				} else {
					this.getView().setAssign("result", H_string.key_file + "pem\u5F62\u5F0F\u306E\u5909\u63DB\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
				}
			} else {
				this.getView().setAssign("result", H_string.key_file + "\u306E\u767B\u9332\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			}
		}

		this.getView().setNaviHTML(this.setNaviArray(H_string.key_file));
		this.getView().displayHTML(result);
	}

	setNaviArray(str) {
		return {
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"/BDSettings/au/management.php": "au\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": str + "\u65B0\u898F\u767B\u9332"
		};
	}

	__destruct() {
		super.__destruct();
	}

};