//SUO:ETC UFJ/Nicos (view)
//2008/04/25	石崎公久	作成
import ViewBaseScript from "./ViewBaseScript";
import MtScriptArgs from "../../MtScriptArgs";

export default class SuoImportEtcUfjNicosView extends ViewBaseScript {
	O_MtScriptArgs: MtScriptArgs;
	constructor() {
		super();
		var A_arg_help = [["-p", "pactid", "契約ID\t\tall:全契約分を実行,pactid:指定した契約IDのみ実行"], ["-y", "YYYYMM", "請求月\t\t指定された年月の割引額を調整する"], ["-e", "CharSwitch", "モード\t\tO:delete後COPY,A:追加", "O|A"], ["-t", "CharSwitch", "未登録カードのテーブルへの反映\t\tN:最新月のにも反映,O:過去月のみの反映", "N|O"], ["-b", "CharSwitch", "バックアップ\t\tY:バックアップをする,N:バックアップをしない"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut(1000, "引数フォーマットの指定が間違っています。\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}
};
