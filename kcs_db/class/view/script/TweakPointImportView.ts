//ポイント調整　インポート(view)
//2008/03/07 石崎 作成
import ViewBaseDialog from "./ViewBaseDialog";
import MtScriptArgsDialog from "../../MtScriptArgsDialog";

export default class TweakPointImportView extends ViewBaseDialog {
	O_MtScriptArgsDialog: MtScriptArgsDialog;
	constructor() {
		super();
		var A_arg_help = [["-p", "pactid", "契約ID\t\tall:全契約分を実行,pactid:指定した契約IDのみ実行"], ["-y", "YYYYMM", "請求月\t\tt指定された年月の請求書を取り込む"]];
		this.O_MtScriptArgsDialog = new MtScriptArgsDialog(A_arg_help);

		if (false == this.O_MtScriptArgsDialog.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "引数フォーマットの指定が間違っています。\n");
		}

		this.checkArg(this.O_MtScriptArgsDialog);
	}
};
