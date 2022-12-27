//error_reporting(E_ALL|E_STRICT);// 2022cvt_011

import ViewBaseScript from '../script/ViewBaseScript';

import MtScriptArgs from '../../MtScriptArgs';

export class SuoImportAlphapurchaseView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		var A_arg_help = [["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O,A"], ["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"], ["-t", "CharSwitch", "購買テーブル\tN:purchase_tbへインサート,O:purchase_X_tbへインサート", "N,O"]];
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
