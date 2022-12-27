//
//資産データ設定 （View）
//
//更新履歴：<br>
//2011/01/24 宝子山浩平 作成
//
//@package script
//@subpackage View
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2011/01/24
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
//@since 2011/01/24
//
//@access public
//@return void
//
class SetAssetsRecordsView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.ArgCountCheck = false;
		var A_arg_help = [["-p", "pactidNotAll", "\u5951\u7D04\uFF29\uFF24\t\tPACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-x", "tableno", "\u30C6\u30FC\u30D6\u30EB\u756A\u53F7\tTABLENO:\u6307\u5B9A\u3057\u305F\u30C6\u30FC\u30D6\u30EB\u756A\u53F7\u306E\u307F\u5B9F\u884C"], ["-c", "carid", "\u30AD\u30E3\u30EA\u30A2ID\t\tCARID:\u6307\u5B9A\u3057\u305F\u30AD\u30E3\u30EA\u30A2\u306E\u307F\u5B9F\u884C"], ["-t", "string", "\u96FB\u8A71\u756A\u53F7\tTELNO:\u6307\u5B9A\u3057\u305F\u96FB\u8A71\u756A\u53F7\u306E\u307F\u5B9F\u884C"], ["-v", "string", "\u5024\tKEY:VALUE:\u66F4\u65B0\u3057\u305F\u3044\u5185\u5BB9"], ["-u", "CharSwitch", "Update\tUpdate\u3092\u884C\u3046\u304B\u5426\u304B", "Y,N"]];
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