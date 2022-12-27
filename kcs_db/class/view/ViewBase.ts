//あらゆるＶＩＥＷの基底となるクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/02/08
import MtDateUtil from "../MtDateUtil";
import MtOutput from "../MtOutput";
import MtSetting from "../MtSetting";

export default class ViewBase {
	O_Setting: MtSetting;
	O_Out: MtOutput;
	O_DateUtil: MtDateUtil;
	constructor(H_param: {} | any[] = Array()) {
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

	debugOut(msg: string, disp = 1) {
		this.getOut().debugOut(msg, disp);
	}

	infoOut(msg: string, disp = 1) {
		this.getOut().infoOut(msg, disp);
	}

	warningOut(code: number, errstr = "", disp = 0) {
		this.getOut().warningOut(code, errstr, disp);
	}

	errorOut(code: any, errstr = "", mailflg = 1, goto = "", buttonstr = "") {
		this.getOut().errorOut(code, errstr, mailflg, goto, buttonstr);
	}
};
