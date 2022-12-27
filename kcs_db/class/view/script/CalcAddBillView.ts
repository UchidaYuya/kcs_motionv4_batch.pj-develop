//ＳＵＯ 福山通運請求データ取込処理 （View）

import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class CalcAddBillView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        var A_arg_help = Array();
        A_arg_help.push([
            "-y",
            "YYYYMMnone",
			"請求年月\t\tYYYY:年,MM:月,none:指定なし(recalcのみ有効)"
        ]);
        A_arg_help.push([
            "-p",
            "pactid",
			"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
        ]);

        if (this.get_ScriptName() == "calc_addbill.php") {
            A_arg_help.push([
                "-c",
                "CharSwitch",
				"確定を請求年月にコピー\tY:する,N:しない",
                "Y,N",
            ]);
        }

        this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

        if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
            this.errorOut(
                "パラメータが不正です\n"
            );
        }

        this.checkArg(this.O_MtScriptArgs);
    }
}
