//ＫＧ請求データ（転送用内線別月報ファイル）取込処理 （View）

import ViewBaseScript from "../script/ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class KgImportBillView extends ViewBaseScript {
    // O_MtScriptArgs: MtScriptArgs;
    errorOut: any;
	get_ScriptName: any;
    O_MtScriptArgs: MtScriptArgs | any;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        var A_arg_help = [
            [
                "-e",
                "CharSwitch",
                "モード\t\tO:deletedelete後COPY,A:追加",
                "O,A",
            ],
            ["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"],
            [
                "-p",
                "pactid",
                "契約ＩＤ\t\ttall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行",
            ],
            [
                "-b",
                "CharSwitch",
                "バックアップ\tY:する,N:しない",
                "Y,N",
            ],
            [
                "-t",
                "CharSwitch",
                "電話管理テーブル\tN:tel_tbへインサート,O:tel_X_tbへインサート",
                "N,O",
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

