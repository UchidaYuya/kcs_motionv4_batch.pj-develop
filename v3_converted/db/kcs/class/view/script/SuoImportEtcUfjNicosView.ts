//
//SUO:ETC UFJ/Nicos (view)
//
//更新履歴：<br>
//2008/04/25	石崎公久	作成
//
//@uses ViewBaseScript
//@package SUO
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//
//
//error_reporting(E_ALL);
//
//SUO:ETC UFJ/Nicos (view)
//
//@uses ViewBaseScript
//@package SUO
//@subpackage View
//@author ishizaki
//@since 2008/04/25
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsScript
//@access public
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/03/05
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class SuoImportEtcUfjNicosView extends ViewBaseScript {
	constructor() {
		super();
		var A_arg_help = [["-p", "pactid", "\u5951\u7D04ID\t\tall:\u5168\u5951\u7D04\u5206\u3092\u5B9F\u884C,pactid:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C"], ["-y", "YYYYMM", "\u8ACB\u6C42\u6708\t\t\u6307\u5B9A\u3055\u308C\u305F\u5E74\u6708\u306E\u5272\u5F15\u984D\u3092\u8ABF\u6574\u3059\u308B"], ["-e", "CharSwitch", "\u30E2\u30FC\u30C9\t\tO:delete\u5F8CCOPY,A:\u8FFD\u52A0", "O|A"], ["-t", "CharSwitch", "\u672A\u767B\u9332\u30AB\u30FC\u30C9\u306E\u30C6\u30FC\u30D6\u30EB\u3078\u306E\u53CD\u6620\t\tN:\u6700\u65B0\u6708\u306E\u306B\u3082\u53CD\u6620,O:\u904E\u53BB\u6708\u306E\u307F\u306E\u53CD\u6620", "N|O"], ["-b", "CharSwitch", "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\t\tY:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092\u3057\u306A\u3044"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "\u5F15\u6570\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u306E\u6307\u5B9A\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() {
		super.__destruct();
	}

};