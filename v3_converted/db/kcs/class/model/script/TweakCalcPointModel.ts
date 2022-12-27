//
//獲得ポイント計算(model)
//
//更新履歴：<br>
//2008/03/31
//
//@uses TweakModel
//@package SUO
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/31
//
//
//
//獲得ポイント計算(model)
//
//@uses TweakModel
//@package SUO
//@subpackage Model
//@author ishizaki
//@since 2008/03/31
//

require("model/TweakModel.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/03/07
//
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class TweakCalcPointModel extends TweakModel {
	constructor(O_msa: ?MtScriptAmbient = undefined) {
		super(O_msa);
	}

	__destruct() {
		super.__destruct();
	}

};