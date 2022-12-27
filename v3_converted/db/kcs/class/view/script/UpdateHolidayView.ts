//
//祝日の更新
//
//error_reporting(E_ALL|E_STRICT);
//
//UpdateHolidayView
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2017/12/14
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
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class UpdateHolidayView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = Array();
		A_arg_help.push(["-u", "CharSwitch", "\u30AB\u30EC\u30F3\u30C0\u30FC\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u3092\u884C\u3046\u304B\u3069\u3046\u304B\uFF08y/n\uFF09", "y,n"]);
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