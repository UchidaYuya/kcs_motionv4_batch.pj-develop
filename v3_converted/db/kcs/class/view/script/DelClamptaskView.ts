//
//clamptask_tb消去ビュー
//
//更新履歴：<br>
//2009/05/28 宮澤龍彦 作成
//
//@uses ViewBaseScript
//@package SBDownload
//@filesource
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/09/08
//
//
//error_reporting(E_ALL);
//
//clamptask_tb消去ビュー
//
//@uses ViewSmarty
//@package Base
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/09/08
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

require("HTTP/Client.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsImport
//@access public
//
//
//clamptask_tbから消去するスクリプト名
//
//@var MtScriptArgsImport
//@access public
//
//
//コンストラクター
//
//@author miyazawa
//@since 2009/06/05
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/06/05
//
//@access public
//@return void
//
class DelClamptaskView extends ViewBaseScript {
	constructor() //引数のフォーマットを確認する
	{
		super();
		var A_arg_help = [["-c", "command", "clamptask_tb\u304B\u3089\u6D88\u53BB\u3059\u308Bcommand"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);
		var argsflg = false;

		for (var value of Object.values(this.A_Argv)) //引数を=で分割
		{
			var A_each = value.split("=");

			if ("-c" == A_each[0] && "" != A_each[1]) {
				this.ScriptName = A_each[1];
				argsflg = true;
			}
		}

		if (false == argsflg) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamptask_tb\u304B\u3089\u6D88\u53BB\u3059\u308B\u30B9\u30AF\u30EA\u30D7\u30C8\u540D\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};