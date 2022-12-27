//
//ポイントメニュートップページProccess
//
//更新履歴：<br>
//2008/04/10 石崎 作成
//
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ポイントメニュートップページProccess
//
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//

require("process/TweakPoint/TweakPointMenuProcBase.php");

require("model/TweakPoint/TweakPointMenuModel.php");

require("view/TweakPoint/TweakPointMenuView.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/04/10
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author ishizaki
//@since 2008/04/10
//
//@access protected
//@return void
//@uses TweakPointMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author ishizaki
//@since 2008/04/10
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TweakPointMenuModel
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class TweakPointMenuProc extends TweakPointMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TweakPointMenuView({
			"": "\u30DD\u30A4\u30F3\u30C8\u8868\u793A"
		});
	}

	get_Model() {
		return new TweakPointMenuModel();
	}

	__destruct() {
		super.__destruct();
	}

};