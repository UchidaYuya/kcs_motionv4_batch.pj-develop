import MtScriptArgs from "./MtScriptArgs";

export default class MtScriptArgsDialog extends MtScriptArgs {
	constructor(A_argf: any[]) //デバッグ
	//引数のフォーマットが指定されていれば、そのフォーマット自体を確認
	{
		super(A_argf);
		this.set_DebugFlag();

		if (A_argf.length > 0) {
			this.formatChecker(A_argf);
		}
		
		if (this.get_DebugFlag() == true) {
			console.log(this);
		}
	}
};
