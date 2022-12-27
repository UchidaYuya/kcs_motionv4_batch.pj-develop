//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする（View）

import ViewBaseScript from "./ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class KgCheckTelnoPostidView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
    constructor() {
        //親のコンストラクタを必ず呼ぶ
        super();
        const A_arg_help = [
            [
                "-y",
                "YYYYMM",
                "請求年月\t\tYYYY:年,MM:月",
            ],
            [
                "-p",
                "pactid",
                "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行",
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
