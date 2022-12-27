//プラン、パケット反映処理 （View）


import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class ReflectBillingDataView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        var A_arg_help = [
            [
                "-y",
                "YYYYMM",
				"請求年月\t\tYYYY:年,MM:月"
            ],
            [
                "-p",
                "pactid",
				"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
            ],
            [
                "-c",
                "carid",
				"キャリア\t\tall:対応全キャリアを実行,CARID:指定したCARIDのみ実行",
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
