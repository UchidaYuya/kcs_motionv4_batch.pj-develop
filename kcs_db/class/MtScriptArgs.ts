//スクリプト引数処理クラス
//
//スクリプトの引数のタイプ管理する
//
//@package Base
//@subpackage Scirpt
//@filesource
//@since 2008/02/26
//@author ishizaki<ishizaki@motion.co.jp>
export default class MtScriptArgs {
	MtScriptArgsFlag: boolean;
	H_Arg: any[];
	DebugFlag: boolean | undefined;
	constructor(A_argf: any = Array()) //デバッグ
	{
		this.MtScriptArgsFlag = true;
		this.H_Arg = Array();
		this.set_DebugFlag();

		if (A_argf.length > 0) {
			for (var value of A_argf) {
				var type = value.shift();
				this.H_Arg[type] = value;
			}
		}
	}

	set_DebugFlag() {
		if (undefined !== global.debugging == true && global.debugging == true) {
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
};
