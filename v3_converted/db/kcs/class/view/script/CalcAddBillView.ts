//
//ＳＵＯ 福山通運請求データ取込処理 （View）
//
//更新履歴：<br>
//2010/02/03 宮澤龍彦 作成
//
//SuoImportFukuyamaView
//
//@package SUO
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/02/03
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
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class CalcAddBillView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = Array();
		A_arg_help.push(["-y", "YYYYMMnone", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708,none:\u6307\u5B9A\u306A\u3057(recalc\u306E\u307F\u6709\u52B9)"]);
		A_arg_help.push(["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"]);

		if (this.get_ScriptName() == "calc_addbill.php") {
			A_arg_help.push(["-c", "CharSwitch", "\u78BA\u5B9A\u3092\u8ACB\u6C42\u5E74\u6708\u306B\u30B3\u30D4\u30FC\tY:\u3059\u308B,N:\u3057\u306A\u3044", "Y,N"]);
		}

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