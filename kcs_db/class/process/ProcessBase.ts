//全てのプロセスの基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
import MtDateUtil from '../MtDateUtil';
import MtExcept from '../MtExcept';
import MtOutput, { SiteType } from '../MtOutput';
import MtSetting from '../MtSetting';
export default class ProcessBase {
	O_DateUtil: MtDateUtil;
	O_Out: MtOutput;
	O_Setting: MtSetting;
	constructor(site: SiteType, H_param: {} | any[] = Array()){
		this.O_Setting = MtSetting.singleton();
		this.O_Out = MtOutput.singleton();
		this.O_DateUtil = MtDateUtil.singleton();
	}

	getSetting() {
		return this.O_Setting;
	}

	getOut() {
		return this.O_Out;
	}

	getDateUtil() {
		return this.O_DateUtil;
	}

	doExecute(H_param: {} | any[] = Array()){
	}

	execute(H_param: {} | any[] = Array()) {
		try {
			this.doExecute(H_param);
		} catch (ex) {
			if (ex instanceof MtExcept) {
				this.caught(ex);
			} else if (true) {
				this.caughtUnknown(ex);
			}
		}
	}

	caught(ex: MtExcept) {
		this.errorOut(0, ex.getMessage());
	}

	caughtUnknown(e:any) {
		console.log(e);
	}

	debugOut(msg: string, disp = 1) {
		this.getOut().debugOut(msg, disp);
	}

	infoOut(msg: string, disp = 1) {
		this.getOut().infoOut(msg, disp);
	}

	warningOut(code: number, errstr = "", disp = 0) {
		this.getOut().warningOut(code, errstr, disp);
	}

	errorOut(code: number, errstr = "", mailflg = 1, goto = "", buttonstr = "") {
		this.getOut().errorOut(code, errstr, mailflg, goto, buttonstr);
	}
};
