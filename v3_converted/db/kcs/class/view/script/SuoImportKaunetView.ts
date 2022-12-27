//
//ＳＵＯ Ｋａｕｎｅｔ購買データ取込処理 （View）
//
//更新履歴：<br>
//2008/05/09 前田 聡 作成
//
//SuoImportKaunetView
//
//@package SUO
//@subpackage View
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/05/09
//@uses ViewBaseScript
//@uses MtScriptArgs
//
//
//error_reporting(E_ALL|E_STRICT);

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//スクリプト実行オプション処理クラス
//
//@var mixed
//@access public
//
//
//デストラクタ
//
//@author maeda
//@since 2008/05/09
//
//@access public
//@return void
//
class SuoImportKaunetView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-e", "CharSwitch", "\u30E2\u30FC\u30C9\t\tO:delete\u5F8CCOPY,A:\u8FFD\u52A0", "O,A"], ["-y", "YYYYMM", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-b", "CharSwitch", "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\tY:\u3059\u308B,N:\u3057\u306A\u3044", "Y,N"], ["-t", "CharSwitch", "\u8CFC\u8CB7\u30C6\u30FC\u30D6\u30EB\tN:purchase_tb\u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:purchase_X_tb\u3078\u30A4\u30F3\u30B5\u30FC\u30C8", "N,O"]];
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