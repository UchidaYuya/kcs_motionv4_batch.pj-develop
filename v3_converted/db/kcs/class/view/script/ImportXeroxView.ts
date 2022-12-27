//
//Xeroxインポートビュー
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2013/04/19
//

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//__construct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//オプションを取得
//
//@author web
//@since 2013/04/19
//
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
class ImportXeroxView extends ViewBaseScript {
	constructor() {
		super();
		var helps = [["-e", "CharSwitch", "\u30E2\u30FC\u30C9\t\tO:delete\u5F8CCOPY,A:\u8FFD\u52A0", "O,A"], ["-y", "YYYYMM", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-b", "CharSwitch", "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\tY:\u3059\u308B,N:\u3057\u306A\u3044", "Y,N"], ["-t", "CharSwitch", "\u30B3\u30D4\u30FC\u6A5F\u30C6\u30FC\u30D6\u30EB\tN:copy_tb\u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:copy_X_tb\u3078\u30A4\u30F3\u30B5\u30FC\u30C8", "N,O"]];

		if (!this.getScriptArgs(helps).get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		this.checkArg(this.getScriptArgs());
	}

	getScriptArgs(help = undefined) {
		if (!is_null(help) && !this.scriptArgs instanceof MtScriptArgs) {
			this.scriptArgs = new MtScriptArgs(help);
		}

		return this.scriptArgs;
	}

	__destruct() {
		super.__destruct();
	}

};