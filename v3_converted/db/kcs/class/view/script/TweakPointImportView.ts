//
//ポイント調整　インポート(view)
//
//更新履歴：<br>
//2008/03/07 石崎 作成
//
//@uses ViewBaseDialog
//@package SUO
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/05
//
//
//error_reporting(E_ALL);
//
//ポイント調整　インポート(view)
//
//@uses ViewBaseDialog
//@package SUO
//@subpackage View
//@author ishizaki
//@since 2008/03/05
//

require("view/script/ViewBaseDialog.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgsDialog.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsDialog
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
class TweakPointImportView extends ViewBaseDialog {
	constructor() {
		super();
		var A_arg_help = [["-p", "pactid", "\u5951\u7D04ID\t\tall:\u5168\u5951\u7D04\u5206\u3092\u5B9F\u884C,pactid:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C"], ["-y", "YYYYMM", "\u8ACB\u6C42\u6708\t\t\u6307\u5B9A\u3055\u308C\u305F\u5E74\u6708\u306E\u8ACB\u6C42\u66F8\u3092\u53D6\u308A\u8FBC\u3080"]];
		this.O_MtScriptArgsDialog = new MtScriptArgsDialog(A_arg_help);

		if (false == this.O_MtScriptArgsDialog.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "\u5F15\u6570\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u306E\u6307\u5B9A\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002\n");
		}

		this.checkArg(this.O_MtScriptArgsDialog);
	}

	__destruct() {
		super.__destruct();
	}

};