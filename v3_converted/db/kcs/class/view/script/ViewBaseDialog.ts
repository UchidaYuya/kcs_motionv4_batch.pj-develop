//
//対話型の基底となるクラス
//
//更新履歴：<br>
//2008/03/05 石崎公久 作成
//
//@uses ViewBase
//@package Base
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/05
//
//
//error_reporting(E_ALL|E_STRICT);
//
//対話型の基底となるクラス
//
//@uses ViewBase
//@package Base
//@subpackage View
//@author ishizaki
//@since 2008/03/05
//

require("view/script/ViewBaseScript.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/02/25
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
class ViewBaseDialog extends ViewBaseScript {
	constructor() {
		super();
	}

	__destruct() {
		super.__destruct();
	}

};