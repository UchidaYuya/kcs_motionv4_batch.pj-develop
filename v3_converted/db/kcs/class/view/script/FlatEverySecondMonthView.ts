//error_reporting(E_ALL|E_STRICT);
//
//FlatEverySecondMonthView
//
//@uses ViewBaseScript
//@package
//@author date
//@since 2015/09/18
//

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//スクリプト実行オプション処理クラス
//
//@var mixed
//@access public
//
//
//__construct
//コンストラクタ
//@author date
//@since 2015/09/18
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/09/18
//
//@access public
//@return void
//
class FlatEverySecondMonthView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-e", "CharSwitch", "\u30E2\u30FC\u30C9\t\tO:delete\u5F8CCOPY,A:\u8FFD\u52A0", "O,A"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-y", "YYYYMMnone", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};