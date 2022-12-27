//
//スクリプト引数処理クラス
//
//スクリプトの引数のタイプ管理する
//
//@uses MtScriptArgs
//@package Base
//@subpackage Scirpt
//@filesource
//@since 2008/02/26
//@author ishizaki<ishizaki@motion.co.jp>
///
///**
//
//スクリプト引数処理クラス
//
//@uses MtScriptArgs
//@package Base
//@subpackage Scirpt
//@author ishizaki
//@since 2008/02/26
//

require("MtScriptArgs.php");

//
//インポート系のスクリプトの引数を使いやすい形に整形する
//
//@author ishizaki
//@since 2008/02/26
//
//@param Array
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class MtScriptArgsImport extends MtScriptArgs {
	constructor(A_argf: {} | any[] = Array()) //デバッグ
	//引数のフォーマットが指定されていれば、そのフォーマット自体を確認
	{
		this.set_DebugFlag();
		A_argf = array_merge([["-e", "CharSwitch", "\u30E2\u30FC\u30C9\t\tO:delete\u5F8CCOPY,A:\u8FFD\u52A0", "O,A"], ["-y", "YYYYMM", "\u8ACB\u6C42\u5E74\t\tYYYY:\u5E74,MM:\u6708"], ["-p", "pactid", "\u5951\u7D04ID\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,pactid:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C"], ["-b", "CharSwitch", "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\tY:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044", "Y,N"], ["-t", "CharSwitch", "\u5BFE\u8C61\u6708\u304C\u6700\u65B0/\u904E\u53BB\tN:\u6700\u65B0,O:\u904E\u53BB", "N,O"]], A_argf);

		if (A_argf.length > 0) {
			this.formatChecker(A_argf);
		}

		super(A_argf);

		if (this.get_DebugFlag() == true) {
			console.log(this);
		}
	}

	__destruct() {
		super.__destruct();
	}

};