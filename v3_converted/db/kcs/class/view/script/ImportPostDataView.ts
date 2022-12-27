//
//部署データ取込処理 （View）
//
//更新履歴：<br>
//2012/02/17 宝子山浩平 作成
//
//ImportPostDataView
//
//@package script
//@subpackage View
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2012/02/17
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
//@author houshiyama
//@since 2012/02/17
//
//@access public
//@return void
//
class ImportPostDataView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-n", "integer", "\u51E6\u7406\u3059\u308B\u6708\u6570\t\u73FE\u5728\u304B\u3089\u4F55\u30F6\u6708\u9061\u308B\u304B"], ["-l", "string", "\u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\u30D1\u30B9\t\u30D5\u30A1\u30A4\u30EB\u30D1\u30B9"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);
		this.ArgCountCheck = false;

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		if (!this.A_Argv) {
			this.showHelp(this.O_MtScriptArgs);
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};