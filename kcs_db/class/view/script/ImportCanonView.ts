import ViewBaseScript from "../script/ViewBaseScript"
import MtScriptArgs from "../../MtScriptArgs"

export default class ImportCanonView extends ViewBaseScript {
	scriptArgs!: MtScriptArgs;

	constructor() {
		super();
		var helps = [["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O,A"], ["-y", "YYYYMM", "請求年月\t\tYYYY:年,MM:月"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-b", "CharSwitch", "バックアップ\tY:する,N:しない", "Y,N"], ["-t", "CharSwitch", "コピー機テーブル\tN:copy_tbへインサート,O:copy_X_tbへインサート", "N,O"]];

		if (!this.getScriptArgs(helps).get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		this.checkArg(this.getScriptArgs());
	}

	getScriptArgs(help: string[][] | undefined = undefined) {
		if (!help && !(this.scriptArgs instanceof MtScriptArgs)) {
		// if (!is_null(help) && !this.scriptArgs instanceof MtScriptArgs) {
			this.scriptArgs = new MtScriptArgs(help);
		}

		return this.scriptArgs;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
