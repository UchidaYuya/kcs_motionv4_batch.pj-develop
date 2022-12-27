//
//請求ダウンロード設定（基礎プロセス）
//
//更新履歴：<br>
//2010/10/01 石崎 作成
//
//@uses ProcessBaseHtml
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//請求ダウンロード設定（基礎プロセス）
//
//@package BDSettings
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("process/ProcessBaseHtml.php");

require("model/BDSettingsModel.php");

//
//O_view
//
//@var mixed
//@access protected
//
//
//O_model
//
//@var mixed
//@access protected
//
//
//trueだとdisplayFinishを呼ぶ
//
//@var boolean
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
//Modelクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//setFinishFlag
//
//@author ishizaki
//@since 2008/10/16
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
class BDSettingsBaseProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.finishFlag = false;
	}

	getModel() {
		if (!this.O_model instanceof BDSettingsModel) {
			this.O_model = new BDSettingsModel();
		}

		return this.O_model;
	}

	setFinishFlag(flag = true) {
		this.finishFlag = flag;
	}

	__destruct() {
		super.__destruct();
	}

};