//SUO基底　(process)
//2008/03/28 石崎公久 作成
import ProcessBaseBatch from "./ProcessBaseBatch";

export default class SUOBaseProc extends ProcessBaseBatch {
	TelNoError: any;
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("SUO");
	}

	errorTel(telno, errorcode, errormsg) {
		if (this.TelNoError != telno) {
			this.TelNoError = telno;
			this.errorOut(errorcode, errormsg);
		}
	}
};
