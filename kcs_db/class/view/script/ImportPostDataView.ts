//部署データ取込処理 （View
//2012/02/17 宝子山浩平 作成

import MtScriptArgs from "../../MtScriptArgs";
import ViewBaseScript from "./ViewBaseScript";

export default class ImportPostDataView extends ViewBaseScript {
    O_MtScriptArgs: MtScriptArgs;
    constructor() { //親のコンストラクタを必ず呼ぶ
        super();
        var A_arg_help = [
            [
                "-p",
                "pactid",
				"契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"
            ],
            [
                "-n",
                "integer",
				"処理する月数\t現在から何ヶ月遡るか"
            ],
            [
                "-l",
                "string",
				"ログファイルパス\tファイルパス",
            ],
        ];
        this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);
        this.ArgCountCheck = false;

        if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
            this.errorOut("パラメータが不正です\n");
        }

        if (!this.A_Argv) {
            this.showHelp(this.O_MtScriptArgs);
        }

        this.checkArg(this.O_MtScriptArgs);
    }
}
