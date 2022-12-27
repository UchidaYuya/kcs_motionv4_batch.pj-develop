//
//スクリプト引数処理クラス
//
//スクリプトの引数のタイプ管理する
//
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
//@package Base
//@subpackage Scirpt
//@author ishizaki
//@since 2008/02/26
//

//
//整形の際に何か不具合があったfalseが入っている
//
//@var boolean
//@access private
//
//
//スクリプトが受け取るはずの引数の一覧とルールを格納
//
//@var array
//@access private
//
//
//Debug判定用
//
//@var Boolean
//@access private
//
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
//$GLOBALS["debugging"] == true ならばメンバー変数 $DebugFlag に true をいれ、そうでなければ false をいれる。
//
//@author ishizaki
//@since 2008/02/26
//
//@access protected
//@return void
//@final
//
//
//現在セットされている DebugFlag を返す
//
//@author ishizaki
//@since 2008/03/06
//
//@access protected
//@return boolean
//@final
//
//
//メンバー変数 H_Arg をそのまま返す
//
//@author ishizaki
//@since 2008/02/26
//
//@access public
//@return Array
//@final
//
//
//このクラス内の処理で、予期せぬ事態に遭遇し処理が続行できる場合に、ここに false がはいる。
//
//@author ishizaki
//@since 2008/02/26
//
//@access public
//@return boolean
//@final
//
//
//整形時でエラーが発生した際に呼び出しフラグをfalseにする。
//
//@author ishizaki
//@since 2008/02/27
//
//@access protected
//@return void
//@final
//
//
//引数定義のフォーマットを確認する
//
//引数定義のフォーマット自体が間違っていたら<br>
//set_MtScriptArgsFlag を呼び出しエラー扱いにする
//
//@author ishizaki
//@since 2008/03/06
//
//@param array $A_argf
//@access protected
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
class MtScriptArgs {
	constructor(A_argf: {} | any[] = Array()) //デバッグ
	{
		this.MtScriptArgsFlag = true;
		this.H_Arg = Array();
		this.set_DebugFlag();

		if (A_argf.length > 0) {
			for (var value of Object.values(A_argf)) {
				var type = value.shift();
				this.H_Arg[type] = value;
			}
		}
	}

	set_DebugFlag() {
		if (undefined !== GLOBALS.debugging == true && GLOBALS.debugging == true) {
			this.DebugFlag = true;
		} else {
			this.DebugFlag = false;
		}
	}

	get_DebugFlag() {
		return this.DebugFlag;
	}

	get_HArg() {
		return this.H_Arg;
	}

	get_MtScriptArgsFlag() {
		return this.MtScriptArgsFlag;
	}

	set_MtScriptArgsFlag() {
		this.MtScriptArgsFlag = false;
	}

	formatChecker(A_argf: {} | any[]) {
		for (var A_value of Object.values(A_argf)) {
			if (Array.isArray(A_value) == false) {
				this.set_MtScriptArgsFlag();
			}

			if (A_value.length < 3) {
				this.set_MtScriptArgsFlag();
			}

			if ("CharSwitch" == A_value[1]) {
				if (A_value.length != 4) {
					this.set_MtScriptArgsFlag();
				}
			}
		}
	}

	__destruct() {}

};