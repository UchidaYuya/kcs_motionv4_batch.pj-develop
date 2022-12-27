//
//請求ダウンロード設定
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses BDSettingsMenuView
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

require("model/BDSettingsModel.php");

require("view/BDSettings/BDSettingsAuManagementView.php");

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
//checkParam
//
//@author
//@since 2010/11/18
//
//@param mixed $post
//@access public
//@return void
//
//
//setJs
//
//@author
//@since 2010/11/18
//
//@access public
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
class BDSettingsAuManagementProc extends BDSettingsBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (!(undefined !== this.O_view) || !(this.O_view instanceof BDSettingsAuManagementView)) {
			this.O_view = new BDSettingsAuManagementView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) //請求ダウンロード設定を取得
	{
		this.getView().startCheck();

		if (!this.getModel().checkCarrier(this.getView().gSess().pactid, this.getView().getSet().car_docomo)) {
			this.errorOut(6, "carid:" + this.getView().getSet().car_docomo + "\u304C\u3001pactid:" + this.getView().gSess().pactid + "\u306B\u7D50\u3073\u3064\u3044\u3066\u3044\u307E\u305B\u3093", 0);
			throw die();
		}

		this.checkParam(this.getView().getPost(), this.getModel().getCarId());
		this.getView().gSess().clearSessionMenu();
		this.getView().setAssign("js", this.setJs());
		this.getView().setAssign("delete", this.getModel().getBDSettings(this.getView().gSess().pactid, this.getModel().getCarId()));
		this.getView().setAssign("keyfiles", this.getModel().getKeyFileList(this.getView().gSess().pactid, this.getModel().getCarId()));
		this.getView().setAssign("clamps", this.getModel().hideFilePath(this.getModel().getClamps(this.getView().gSess().pactid, this.getModel().getCarId())));
		this.getView().setAssign("tels", this.getModel().getParentTels(this.getView().gSess().pactid, this.getModel().getCarId()));
		this.getView().setAssign("H_string", this.getModel().getClampString());
		this.getView().setNaviHTML({
			"/BDSettings/menu.php": "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A",
			"": "au\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8A2D\u5B9A"
		});
		this.getView().displayHTML();
	}

	checkParam(post, carid) {
		if (undefined !== post && post.length && undefined !== post.flag) {
			this.getModel().unsetDeleteSetting(this.getView().gSess().pactid, carid);

			if (post.flag == "false") {
				this.getModel().setDeleteSetting(this.getView().gSess().pactid, carid);
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	setJs() {
		return "\n<script type=\"text/javascript\"> \nfunction changeSetting(flag){\n\tvar string = \"\";\n\tif(flag == true) {\n\t\tstring = \"\u4E0B\u8A18\u306B\u8868\u793A\u4E2D\u306E\u8A2D\u5B9A\u3067\u6BCE\u6708\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u307E\u3059\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\u3002\";\n\t} else {\n\t\tstring = \"\u4E0B\u8A18\u306B\u8868\u793A\u4E2D\u306E\u8A2D\u5B9A\u306F\u6765\u6708\uFF11\u65E5\u306B\u6D88\u53BB\u3057\u307E\u3059\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\u3002\";\n\t}\n\tif(confirm(string)){\n\t\treturn true;\n\t}\n\treturn false;\n}\n</script>";
	}

	__destruct() {
		super.__destruct();
	}

};