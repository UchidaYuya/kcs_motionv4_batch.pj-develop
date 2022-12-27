//
//au brossデータ ダウンロード （View）
//
//更新履歴：<br>
//2009/06/01 前田 聡 作成
//
//AuDownloadView
//
//@package script
//@subpackage View
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/01
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
//@since 2009/06/01
//
//@access public
//@return void
//
class AuDownloadView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-y", "YYYYMMnone", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708,none:\u6307\u5B9A\u3057\u306A\u3044\uFF08\u5F53\u6708\u3067\u5B9F\u884C\uFF09"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-s", "CharSwitch", "\u5B9F\u884C\u6642\u9593\u5236\u9650\tY:\u6709\u308A,N:\u7121\u3057", "Y,N"]];
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