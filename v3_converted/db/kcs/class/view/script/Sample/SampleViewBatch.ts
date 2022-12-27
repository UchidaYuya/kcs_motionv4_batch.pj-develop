//
//Batch実装のサンプル
//
//更新履歴：<br>
//2008/02/22 石崎 作成
//
//@uses ViewBaseScript
//@package Sample
//@filesource
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/02/22
//
//
//error_reporting(E_ALL);
//
//BatchView実装のサンプル
//
//@uses ViewSmarty
//@package Base
//@subpackage View
//@author ishizaki
//@since 2008/02/22
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgsImport.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsImport
//@access public
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/02/22
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
class SampleViewBatch extends ViewBaseScript {
	constructor(O_Set0: MtSetting, O_Out0: MtOutput) {
		super(O_Set0, O_Out0);
		this.O_MtScriptArgsImport = new MtScriptArgsImport([["-m", "CharSwitch", "\u52D5\u4F5C\u65B9\u6CD5 1:\u30DE\u30CB\u30E5\u30A2\u30EB 2:\u554F\u3044\u5408\u308F\u305B\u306A\u3057", "0,1"]]);

		if (false == this.O_MtScriptArgsImport.getMtScriptArgsFlag()) {
			this.errorOut("\u5F15\u6570\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u306E\u6307\u5B9A\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002\n");
		}

		this.checkArg(this.O_MtScriptArgsImport);
	}

	display() {}

};