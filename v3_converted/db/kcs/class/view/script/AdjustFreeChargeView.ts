//
//請求明細無料通話調整処理 （View）
//
//更新履歴：<br>
//2009/06/16 前田 聡 作成
//
//AdjustFreeChargeView
//
//@package script
//@subpackage View
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/16
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
//@since 2009/06/16
//
//@access public
//@return void
//
class AdjustFreeChargeView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-y", "YYYYMM", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708"], ["-p", "pactidNotAll", "\u5951\u7D04\uFF29\uFF24\t\tPACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-m", "CharSwitch", "\u30E2\u30FC\u30C9\t\t1:\u6307\u5B9A\u90E8\u7F72\u968E\u5C64\u3067\u8ABF\u6574,2:\u6240\u5C5E\u90E8\u7F72\u3067\u8ABF\u6574", "1,2"], ["-l", "postLevel", "\u90E8\u7F72\u968E\u5C64\u6307\u5B9A\t\u30E2\u30FC\u30C92\u306E\u5834\u5408\u306F1\u3092\u6307\u5B9A"]];
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