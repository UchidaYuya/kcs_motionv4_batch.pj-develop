import ViewBaseScript from "../script/ViewBaseScript";
import MtScriptArgs from  "../../MtScriptArgs";
//
//__construct
//
//@author web
//@since 2012/05/21
//
//@access public
//@return void
//
//
//checkArgv
//
//@author web
//@since 2012/05/29
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2012/05/21
//
//@access public
//@return void
//
export default class ImportCheckListView extends ViewBaseScript {
	scriptArgs!: MtScriptArgs;

	constructor() {
		super();
// 2022cvt_015
		var argv = Array();

// 2022cvt_015
        var flag = true;
		for (var value of process.argv) {
// 2022cvt_019
			// if (preg_match("/^-y=/", value)) {
			if (value.match("/^-y=/")) {
// 2022cvt_015
				var yyyymm = value.replace(/-y=/g, "");

				// if (is_numeric(yyyymm) && 6 == yyyymm.length) {
				if (!isNaN(parseInt(yyyymm)) && 6 == yyyymm.length) {
// 2022cvt_015
					flag = true;
					argv.push(value);
				}
			} else {
				argv.push(value);
			}
		}

		if (!(undefined !== flag)) {
			argv.push("-y=" + new Date().getFullYear() + '' + (new Date().getMonth() + 1));
		}

		this.set_Argv(argv);
	}

	checkArgv() {
// 2022cvt_015
		var rules = [["-y", "YYYYMM", "請求年月"], ["-p", "pactid", "契約ID\t\tall:全社実行,PACTID:指定した会社のみ"]];
		this.scriptArgs = new MtScriptArgs(rules);

		if (!this.scriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(0, "パラメータがに誤りがあります\n");
		}

		this.checkArg(this.scriptArgs);
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
