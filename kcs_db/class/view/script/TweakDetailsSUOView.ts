//割引額調整　(view)


import ViewBaseScript from "./ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class TweakDetailsSUOView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	constructor() {
		super();
		var A_arg_help = [["-p", "pactidNotAll", "契約ID\t\tpactid:指定した契約IDのみ実行"], ["-y", "YYYYMM", "請求月\t\t指定された年月の割引額を調整する"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "引数フォーマットの指定が間違っています。\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}
};
