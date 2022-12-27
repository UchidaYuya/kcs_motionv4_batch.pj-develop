require("ViewBaseScript.php");

require("MtScriptArgs.php");

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
class ImportCheckListView extends ViewBaseScript {
	constructor() {
		super();
		var argv = Array();

		for (var value of Object.values(_SERVER.argv)) {
			if (preg_match("/^-y=/", value)) {
				var yyyymm = value.replace(/^-y=/g, "");

				if (is_numeric(yyyymm) && 6 == yyyymm.length) {
					var flag = true;
					argv.push(value);
				}
			} else {
				argv.push(value);
			}
		}

		if (!(undefined !== flag)) {
			argv.push("-y=" + date("Ym"));
		}

		this.set_Argv(argv);
	}

	checkArgv() {
		var rules = [["-y", "YYYYMM", "\u8ACB\u6C42\u5E74\u6708"], ["-p", "pactid", "\u5951\u7D04ID\t\tall:\u5168\u793E\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u4F1A\u793E\u306E\u307F"]];
		this.scriptArgs = new MtScriptArgs(rules);

		if (!this.scriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(0, "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059\n");
		}

		this.checkArg(this.scriptArgs);
	}

	__destruct() {
		super.__destruct();
	}

};