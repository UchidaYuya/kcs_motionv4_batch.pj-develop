//ImportMonotaroView
//ものたろう取込み
//@uses ViewBaseScript
//@package
//@author web
//@since 2017/01/26
import ViewBaseScript from "../script/ViewBaseScript"
import MtScriptArgs from "../../MtScriptArgs"

export default class ApportionDiscountView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = Array();
		A_arg_help.push(["-y", "YYYYMMnone", "請求年月\t\tYYYY:年,MM:月,none:指定なし(recalcのみ有効)"]);
		A_arg_help.push(["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"]);
		A_arg_help.push(["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"]);
		A_arg_help.push(["-n", "string", "親番号の指定\t指定なしならnone", "親番号,none"]);
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}
};
