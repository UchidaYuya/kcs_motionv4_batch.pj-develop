//管理者機能権限クラス

import MtExcept from "./MtExcept";
import MtOutput from "./MtOutput";
import MtSetting from "./MtSetting";

export default class MtAdminAuthority {
	static OH_Instance : MtAdminAuthority[] = Array();
	O_Out: MtOutput;
	O_Setting: MtSetting;

	constructor(shopid: number) //アウトプット
	//設定
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
	}

	static singleton(shopid: number) {
		if (!isNaN(Number(shopid)) == false) {
			MtExcept.raise("MtAdminAuthority::singleton() 引数(shopid)がない");
			throw process.exit(-1);
		}
	}

	getOut() {
		return this.O_Out;
	}

	getSetting() {
		return this.O_Setting;
	}

	gFuncUser(memid:number, hhmm: string = "") //なにもしない
	{
		return false;
	}

	sFuncUser(memid: number, H_fnc: {} | any[], hhmm = "") //なにもしない
	{}

	setAllUserFunc(memid: number) //なにもしない
	{}

	getUserFunc(memid: number, hhmm = "") //空を返す
	{
		return Array();
	}

	getUserFuncIni(memid: number, hhmm = "") {
		return Object.keys(this.getUserFunc(memid, hhmm));
	}

	getUserFuncId(memid: number, hhmm = "") {
		return Object.values(this.getUserFunc(memid, hhmm));
	}

	chkUserFuncIni(memid: number, ininame: string, hhmm = "") //常にtrue
	{
		return true;
	}

	chkUserFuncId(memid: number, fncid: number, hhmm = "") //常にtrue
	{
		return true;
	}

	chkUserFuncPath(memid: number, path: string, hhmm = "") //常にtrue
	{
		return true;
	}
};
