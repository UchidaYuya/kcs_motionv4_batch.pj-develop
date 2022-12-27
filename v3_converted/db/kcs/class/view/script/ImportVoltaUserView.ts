//
//Voltaユーザ取込処理 （View）
//
//更新履歴：<br>
//2010/08/05 石崎公久 作成
//
//@package script
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ViewBaseScript
//@uses MtScriptArgs
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaユーザ取込処理 （View）
//
//@uses ViewBaseScript
//@package
//@author ishizaki
//@since 2010/08/05
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
//コンストラクタ
//
//@author houshiyama
//@since 2010/08/05
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/08/05
//
//@access public
//@return void
//
class ImportVoltaUserView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-p", "pactid", "\u5951\u7D04ID\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,pactid:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C"]];
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