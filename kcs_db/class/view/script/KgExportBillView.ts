//ＫＧ ＦＥＳＴＡ用データ出力処理 （View）


import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class KgExportBillView extends ViewBaseScript {
    O_MtScriptArgs: any;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        const A_arg_help = [
            [
                "-y",
                "YYYYMM",
                "請求年月\t\tYYYY:年,MM:月",
            ],
            [
                "-p",
                "pactidNotAll",
                "契約ＩＤ\t\tPACTID:指定した契約ＩＤのみ実行",
            ],
        ];
        this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

        if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
            this.errorOut(
                "パラメータが不正です\n"
            );
        }

        this.checkArg(this.O_MtScriptArgs);
    }
}
