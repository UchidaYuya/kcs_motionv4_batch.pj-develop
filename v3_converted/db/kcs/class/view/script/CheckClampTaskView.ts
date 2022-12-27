//
//ものたろう取込み
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportMonotaroView
//ものたろう取込み
//@uses ViewBaseScript
//@package
//@author web
//@since 2017/01/26
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
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
class CheckClampTaskView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = Array();
		A_arg_help.push(["-e", "string", "\u74B0\u5883\u540D\u3002\u30E1\u30FC\u30EB\u306E\u4EF6\u540D\u306B\u4F7F\u7528\u3057\u307E\u3059", "\u74B0\u5883\u540D"]);
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