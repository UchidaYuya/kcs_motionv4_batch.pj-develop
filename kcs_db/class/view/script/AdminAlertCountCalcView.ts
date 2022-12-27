//au・softbankの警告・電話カウント・計算バッチビュー
//更新履歴：<br>
//2009/10/28 宮澤龍彦 作成
import ViewBaseScript from "./ViewBaseScript";
import MtOutput from "../../MtOutput";
import MtScriptArgs from "../../MtScriptArgs";

export default class AdminAlertCountCalcView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	UpdPactType: string;
	UpdYear: number | undefined ;
	UpdMonth: string | undefined;
	UpdCarid: number | undefined;
	UpdColumn: number | undefined;
	UpdEnv: number | undefined;
	constructor() //デフォルトではモーション、「H」が指定されたらホットライン
	{
		super();
		var A_arg_help = [["-y", "YYYYMMnone", "年月（noneにすると当月）"], ["-c", "pactidNotAll", "キャリアID"], ["-e", "CharSwitch", "実行環境（dev/try/check/pay/honban）", "dev,try,check,pay,honban"], ["-t", "CharSwitch", "ホットラインかどうか（H/all）", "H,all"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		var argsflg_y = false;
		var argsflg_c = false;
		var argsflg_e = false;
		this.UpdPactType = "M";

		for (var value of this.A_Argv) //引数を=で分割
		{
			var A_each = value.split("=");

			if ("-y" == A_each[0] && "" != A_each[1]) {
				if ("none" != A_each[1] && 6 == A_each[1].length) {
					this.UpdYear = A_each[1].substr(0, 4);
					this.UpdMonth = A_each[1].substr(4, 2);
					argsflg_y = true;
				} else {
					this.UpdYear = new Date().getFullYear();
					this.UpdMonth = (new Date().getMonth()+1).toString().padStart(2, '0');
					argsflg_y = true;
				}
			} else if ("-c" == A_each[0] && "" != A_each[1]) {
				this.UpdCarid = A_each[1];
				argsflg_c = true;
			} else if ("-u" == A_each[0] && "" != A_each[1]) {
				this.UpdColumn = A_each[1];
				var argsflg_u = true;
			} else if ("-e" == A_each[0] && "" != A_each[1]) {
				this.UpdEnv = A_each[1];
				argsflg_e = true;
			} else if ("-t" == A_each[0] && "" != A_each[1]) {
				if ("H" == A_each[1]) {
					this.UpdPactType = "H";
				}
			}
		}

		if (false == argsflg_y) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートする年月を指定してください（YYYYMM/none）\n");
		}

		if (false == argsflg_c) {
			this.errorOut("パラメータが不正です。clamp_index_tbのアップデートするcaridを指定してください\n");
		}

		if (false == argsflg_e) {
			this.errorOut("パラメータが不正です。バッチの実行環境を指定してください（dev/try/check/pay/honban）\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}
};
