//
//価格表お知らせメール
//
//更新履歴：<br>
//2008/12/09 石崎 作成
//
//@package Shop
//@subpackage View
//@users ViewBaseScript
//@users MtSetting
//@users MtOutput
//@users MtScriptArgs
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/12/09
//
//
//error_reporting(E_ALL);
//
//価格表お知らせメール
//
//@package Shop
//@subpackage View
//@author ishizaki
//@since 2008/12/09
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/03/05
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class PriceMailView extends ViewBaseScript {
	constructor() {
		super();
	}

	__destruct() {
		super.__destruct();
	}

};