//ＫＧ通話明細データ（転送用詳細ファイル）取込処理 （View）


import ViewBaseScript from "./ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class KgImportTuwaView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs | any;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        const A_arg_help = [
            [
                "-e",
                "CharSwitch",
				"モード\t\tO:delete後COPY,A:追加",
                "O,A",
            ],
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
                "-b",
                "CharSwitch",
				"バックアップ\tY:する,N:しない",
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
