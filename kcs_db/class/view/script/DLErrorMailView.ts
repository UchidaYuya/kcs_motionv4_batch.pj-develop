//請求DLエラーメール

import ViewBaseScript from "./ViewBaseScript"
import MtScriptArgs from "../../MtScriptArgs"

export default class DLErrorMailView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	is_dump: boolean;
	constructor() //メール送信しないフラグ追加20101129morihara
	{
		super();
		var A_arg_help = [["-s", "flag", "メール送信しない"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		this.is_dump = false;

		for (var value of this.A_Argv) //引数を=で分割
		{
			var A_each = value.split("=");
			if ("-s" === A_each[0]) this.is_dump = true;
		}
	}

};
