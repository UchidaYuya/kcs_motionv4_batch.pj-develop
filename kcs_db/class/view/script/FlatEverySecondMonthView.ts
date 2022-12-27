import ViewBaseScript from "../../view/script/ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

//
//スクリプト実行オプション処理クラス
//
// 2022cvt_015
//@var mixed
//@access public
//
//
//__construct
//コンストラクタ
//@author date
//@since 2015/09/18
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/09/18
//
//@access public
//@return void
//
export default class FlatEverySecondMonthView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
// 2022cvt_015
		var A_arg_help = [["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O,A"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-y", "YYYYMMnone", "請求年月\t\tYYYY:年,MM:月"]];
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
