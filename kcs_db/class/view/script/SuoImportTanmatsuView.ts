import ViewBaseScript from "../script/ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class SuoImportTanmatsuView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
// 2022cvt_015
		var A_arg_help = [["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
