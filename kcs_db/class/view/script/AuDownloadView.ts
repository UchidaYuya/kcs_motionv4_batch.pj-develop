
//au brossデータ ダウンロード （View）

import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class AuDownloadView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        const A_arg_help = [
            [
				"-y",
				"YYYYMMnone",
				"請求年月\t\tYYYY:年,MM:月,none:指定しない（当月で実行）"
            ],
            [
				"-p",
				"pactid",
				"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
            ],
            [
				"-s",
				"CharSwitch",
				"実行時間制限\tY:有り,N:無し",
				"Y,N"
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
