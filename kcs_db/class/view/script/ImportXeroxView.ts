import ViewBaseScript from "../../view/script/ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

//
//__construct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//オプションを取得
//
//@author web
//@since 2013/04/19
//
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
export default class ImportXeroxView extends ViewBaseScript {
	
	scriptArgs!: MtScriptArgs;
	constructor() {
		super();
// 2022cvt_015
		var helps = [["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O,A"], ["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"], ["-t", "CharSwitch", "コピー機テーブル\tN:copy_tbへインサート,O:copy_X_tbへインサート", "N,O"]];

		if (!this.getScriptArgs(helps).get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です");
		}

		this.checkArg(this.getScriptArgs());
	}

	// getScriptArgs(help = undefined) {
	getScriptArgs(help: Array<any> | null = null) {
		// if (!is_null(help) && !this.scriptArgs instanceof MtScriptArgs) {
		if (help && !(this.scriptArgs instanceof MtScriptArgs)) {
			this.scriptArgs = new MtScriptArgs(help);
		}

		return this.scriptArgs;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
