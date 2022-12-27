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
//デストラクタ
//
//@author maeda
//@since 2009/06/16
//
//@access public
//@return void
//
export default class AdjustFreeChargeView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
// 2022cvt_015
		var A_arg_help = [["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactidNotAll", "契約ＩＤ\t\tPACTID:指定した契約ＩＤのみ実行"], ["-m", "CharSwitch", "モード\t\t1:指定部署階層で調整,2:所属部署で調整", "1,2"], ["-l", "postLevel", "部署階層指定\tモード2の場合は1を指定"]];
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
