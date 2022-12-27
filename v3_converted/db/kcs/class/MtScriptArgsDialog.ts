//
//スクリプト引数処理クラス（対話型）
//
//対話型のスクリプト引数処理クラス
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
//対話型のスクリプトの引数を使いやすい形に整形する
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
class MtScriptArgsDialog extends MtScriptArgs {
	constructor(A_argf: {} | any[] = Array()) //デバッグ
	//引数のフォーマットが指定されていれば、そのフォーマット自体を確認
	{
		this.set_DebugFlag();

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