//ＳＵＯ 福山通運請求データ取込処理 （View）

import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class SendBillMailView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs;
    constructor() //// 引数がおかしかった場合に使用法を表示し終了 //親のコンストラクタを必ず呼ぶ
    {
        super();
        var A_arg_help = Array();
        A_arg_help.push([
            "-p",
            "pactid",
			"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
        ]);
        this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

        if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
            this.errorOut(
                "パラメータが不正です\n"
            );
        }

        this.checkArg(this.O_MtScriptArgs);
    }

}
