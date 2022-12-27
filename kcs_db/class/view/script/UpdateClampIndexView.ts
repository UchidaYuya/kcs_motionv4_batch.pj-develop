//clamp_index_tbアップデートビュー
//2009/10/28 宮澤龍彦 作成
import ViewBaseScript from "./ViewBaseScript";
import MtSetting from "../../MtSetting";
import MtOutput from "../../MtOutput";
import MtScriptArgs from "../../MtScriptArgs";
import HTTP_Client from "../../HttpClient2";

export default class UpdateClampIndexView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	UpdYear: MtScriptArgs | undefined;
	UpdMonth: MtScriptArgs | undefined;
	UpdPactid: MtScriptArgs | undefined;
	UpdCarid: MtScriptArgs | undefined;
	UpdColumn: MtScriptArgs | undefined;
	UpdResult: MtScriptArgs | undefined;
	constructor() {
		super();
		var A_arg_help = [["-y", "YYYYMM", "年月"], ["-p", "pactidNotAll", "契約ID"], ["-c", "pactidNotAll", "キャリアID"], ["-u", "CharSwitch", "アップデートするカラム", "is_ready,is_details,is_comm,is_info,is_calc,is_trend,is_recom"], ["-r", "CharSwitch", "アップデート内容（true/false\uFF09", "true,false"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		var argsflg_y = false;
		var argsflg_p = false;
		var argsflg_c = false;
		var argsflg_u = false;
		var argsflg_r = false;

		for (var value of this.A_Argv) //引数を=で分割
		{
			var A_each = value.split("=");

			if ("-y" == A_each[0] && "" != A_each[1]) {
				if (6 == A_each[1].length) {
					this.UpdYear = A_each[1].substr(0, 4);
					this.UpdMonth = A_each[1].substr(4, 2);
					argsflg_y = true;
				}
			} else if ("-p" == A_each[0] && "" != A_each[1]) {
				this.UpdPactid = A_each[1];
				argsflg_p = true;
			} else if ("-c" == A_each[0] && "" != A_each[1]) {
				this.UpdCarid = A_each[1];
				argsflg_c = true;
			} else if ("-u" == A_each[0] && "" != A_each[1]) {
				this.UpdColumn = A_each[1];
				argsflg_u = true;
			} else if ("-r" == A_each[0] && "" != A_each[1]) {
				this.UpdResult = A_each[1];
				argsflg_r = true;
			}
		}

		if (false == argsflg_y) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートする年月を指定してください\n");
		}

		if (false == argsflg_p) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートするpactidを指定してください\n");
		}

		if (false == argsflg_c) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートするcaridを指定してください\n");
		}

		if (false == argsflg_u) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートするカラム名を指定してください\n");
		}

		if (false == argsflg_r) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデート内容を指定してください\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}
};
