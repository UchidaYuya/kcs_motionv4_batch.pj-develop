//Ymobileインポート
//    WILLCOMのインポートを元にしている
//    (WILLCOMとファイル構成が同じと聞いたので・・)
//    2019527 伊達改造
// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011
//
//ImportYmobileBillView
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2019/05/27
//


import ViewBaseScript from "../../../class/view/script/ViewBaseScript";
// require("view/script/ViewBaseScript.php");


import MtScriptArgs from "../../MtScriptArgs";
// require("MtScriptArgs.php");

//
//スクリプト実行オプション処理クラス
//

//@var mixed
//@access public
//
//
//デストラクタ
//
//@author houshiyama
//@since 2011/04/08
//
//@access public
//@return void
//
export default class ImportYmobileBillView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();

		var A_arg_help = [["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O,A"], ["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"], ["-t", "CharSwitch", "電話管理テーブル\tN:tel_tbへインサート,O:tel_X_tbへインサート", "N,O"]];
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
