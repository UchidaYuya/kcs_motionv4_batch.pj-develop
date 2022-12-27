//
//獲得ポイント計算(view)
//
//更新履歴：<br>
//2008/03/28 石崎 作成
//
//@uses ViewBaseScript
//@package SUO
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//
//
//error_reporting(E_ALL);
//
//獲得ポイント計算(view)
//
//@uses ViewBaseScript
//@package SUO
//@subpackage View
//@author ishizaki
//@since 2008/03/28
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsScript
//@access public
//
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
class TweakCalcPointView extends ViewBaseScript {
	constructor() {
		super();
		var A_arg_help = [["-p", "pactidNotAll", "\u5951\u7D04ID\t\tpactid:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C"], ["-y", "YYYYMM", "\u8ACB\u6C42\u6708\t\t\u6307\u5B9A\u3055\u308C\u305F\u5E74\u6708\u306E\u7372\u5F97\u30DD\u30A4\u30F3\u30C8\u3092\u96C6\u8A08\u3059\u308B"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "\u5F15\u6570\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u306E\u6307\u5B9A\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() {
		super.__destruct();
	}

};