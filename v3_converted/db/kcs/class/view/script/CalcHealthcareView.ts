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
class CalcHealthcareView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	//// 引数がおかしかった場合に使用法を表示し終了
	//function go_usage($message,$argv=""){
	//	print "\n\n";
	//	print $message . ":" . $argv . "\n";
	//	print "php card_calc.php [m|p|y|c]=各パラメータ(指定なしのデフォルト値)\n\n";
	//	print "		-m={0|1}			実行前に問い合わせる場合は1(1)\n";
	//	print "		-p=pactid		処理対象顧客（全顧客）\n";
	//	print "		-y=yyyymm		処理対象請求年月（現在の年月）\n";
	//	print "		-c=cardcoid		処理対象請求元会社ID（全会社）\n";
	//	exit(1);
	//}
	{
		super();
		var A_arg_help = [["-y", "YYYYMMnone", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708,none:\u6307\u5B9A\u306A\u3057(recalc\u306E\u307F\u6709\u52B9)"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"]];
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