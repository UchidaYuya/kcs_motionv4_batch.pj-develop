//ショップ機能権限クラス
//
//権限関連のクラスライブラリ

import MtExcept from './MtExcept';
import MtSetting from './MtSetting';
import MtOutput from './MtOutput';
import MtBusinessDay from './MtBusinessDay';
import ShopFuncModel from './model/ShopFuncModel';

export default class MtShopAuthority {
	static OH_Instance : MtShopAuthority[] = Array();
	Joker: boolean | undefined;
	O_Biz: MtBusinessDay;
	BizType: string;
	H_FuncShop: any[];
	H_FuncUser: any[];
	HHMM: any;
	Shopid: any;
	O_Out: MtOutput;
	O_Setting: MtSetting;
	O_Func: ShopFuncModel;

	constructor(shopid: any) //アウトプット
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
		this.O_Func = new ShopFuncModel();
		this.O_Biz = new MtBusinessDay();
		this.BizType = this.O_Biz.chkBusinessType();
		this.Shopid = shopid;
		this.H_FuncShop = Array();
		this.H_FuncUser = Array();
		this.setJoker(false);
		this.setHHMM();
		this.setAllShopFunc();
	}

	static singleton(shopid: any) {
		if (!isNaN(Number(shopid)) == false) {
			MtExcept.raise("MtShopAuthority::singleton() 引数(shopid)がない");
			throw process.exit(-1);
		}

		if(!this.OH_Instance[shopid] == false){
			this.OH_Instance[shopid] = new MtShopAuthority(shopid);
		}

		return this.OH_Instance[shopid];

	}

	getOut() {
		return this.O_Out;
	}

	getSetting() {
		return this.O_Setting;
	}

	getFuncModel() {
		return this.O_Func;
	}

	setJoker(bool = true) {
		if (bool == true) {
			this.Joker = true;
			this.setHHMM(this.getSetting().get("joker_time"));
		} else {
			this.Joker = false;
			this.setHHMM();
		}
	}

	gBizType() {
		return this.BizType;
	}

	resetBizType(year: number, month: number, day: number, hour: any) //引数チェック
	//
	{
		if (!isNaN(Number(year))  == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() yearが不正", false);
		}

		if (!isNaN(Number(month)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() monthが不正", false);
		}

		if (!isNaN(Number(day)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() dayが不正", false);
		}

		if (!isNaN(Number(hour)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() hourが不正", false);
		}

		this.O_Biz.setMember(year, month, day, hour);
		this.BizType = this.O_Biz.chkBusinessType(year, month, day, hour);
		this.O_Biz.setMember();

		if (this.gHHMM() != ( '0' + hour ).slice( 2 ) + "00") {
			this.setHHMM(( '0' + hour ).slice( 2 ) + "00");

		}
	}

	gFuncShop(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncShop[hhmm] == true) {
			return this.H_FuncShop[hhmm];
		}

		return false;
	}

	gFuncUser(memid: string, hhmm = "") //引数チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::gFuncUser() 引数のmemidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncUser[hhmm][memid] == true) {
			return this.H_FuncUser[hhmm][memid];
		}

		return false;
	}

	sFuncShop(H_fnc: {} | any[], hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncShop[hhmm] = H_fnc;
	}

	sFuncUser(memid: string , H_fnc: {} | any[], hhmm:any = "") //引数チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::sFuncUser() memidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncUser[hhmm][memid] = H_fnc;
	}

	setHHMM(hhmm: any = undefined) //引数がなかったら現在時間
	{
		if (hhmm === undefined) {
			this.HHMM = new Date().getHours() + '' + new Date().getMinutes() ;
		} else //引数のチェック
			{
				if (!isNaN(Number(hhmm)) == false) {
					this.getOut().errorOut(0, "MtShopAuthority::setHHMM() 引数の時間(hhmm)が不正", false);
					throw process.exit(-1);// 2022cvt_009
				} else //Joker以外なら夜間注文フラグを再設定
					{
						if ("string" === typeof hhmm == false) {
							this.getOut().errorOut(0, "MtShopAuthority::setHHMM() 引数の時間(hhmm)が10進ではない?ダブルクォート忘れ？", false);
							throw process.exit(-1);// 2022cvt_009
						}

						this.HHMM = hhmm;

						if (this.Joker == false) {
							this.resetBizType(new Date().getFullYear(),  (new Date().getMonth() + 1), new Date().getDay(), ( '0' + hhmm ).slice( 4 ).substr(0, 2));
							this.clearFuncHHMM();
						}
					}
			}
	}

	gHHMM() {
		return this.HHMM;
	}

	clearFuncHHMM() {
		{
			let _tmp_0 = this.H_FuncShop;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (key != "all") {
					delete this.H_FuncShop[key];
				}
			}
		}
		{
			let _tmp_1 = this.H_FuncUser;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				if (key != "all") {
					delete this.H_FuncUser[key];
				}
			}
		}
	}

	setAllShopFunc() //既に取得済みなら取得済みデータを返す
	{
		if ((!this.gFuncShop("all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncShop(this.getFuncModel().getShopFunc(this.Shopid), "all");
			}
	}

	setAllUserFunc(memid: string) //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::getUserFunc() 引数のmemidが不正", false);
		}

		if ((!this.gFuncUser(memid, "all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncUser(memid, this.getFuncModel().getUserFunc(memid, this.Shopid, undefined, false), "all");
			}
	}

	getShopFunc(hhmm: any = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncShop(hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllShopFunc();
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncShop(this.getFuncModel().getShopFunc(this.Shopid, hhmm, false), hhmm);
				}
		}

		return this.gFuncShop(hhmm);
	}

	getShopFuncIni(hhmm = "") {
		return Object.keys(this.getShopFunc(hhmm));
	}

	getShopFuncId(hhmm = "") {
		return Object.values(this.getShopFunc(hhmm));
	}

	chkShopFuncIni(ininame: string, hhmm = "") //入力チェック
	{
		if (ininame == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkShopFuncIni() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

// 2022cvt_015
		var H_func = this.getShopFunc(hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkShopFuncId(fncid: any, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(fncid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkShopFuncId() 引数のfncidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getShopFunc(hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	getUserFunc(memid: string, hhmm: any = "") //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::getUserFunc() 引数のmemidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncUser(memid, hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllUserFunc(memid);
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncUser(memid, this.getFuncModel().getUserFunc(memid, this.Shopid, hhmm, false), hhmm);
				}
		}

		return this.gFuncUser(memid, hhmm);
	}

	getUserFuncIni(memid: any, hhmm = "") {
		return Object.keys(this.getUserFunc(memid, hhmm));
	}

	getUserFuncId(memid: any, hhmm = "") {
		return Object.values(this.getUserFunc(memid, hhmm));
	}

	chkUserFuncIni(memid: string, ininame: string, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncIni() 引数のmemidが不正", false);
		}

		if (ininame == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncIni() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(memid, hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkUserFuncId(memid: string, fncid: any, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncId() 引数のmemidが不正", false);
		}

		if (!isNaN(Number(fncid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncId() 引数のfncidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(memid, hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	async chkUserFuncPath(memid: string, path: string, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncPath() 引数のmemidが不正", false);
		}

		if (path == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncPath() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var A_fncid = await this.getFuncModel().getFuncidFromPath(path);
		var H_func = await this.getUserFunc(memid, hhmm);

		if (-1 !== A_fncid.indexOf(26)) {
			A_fncid.push(203);
			A_fncid.push(206);
		}

		for (var i = 0; i < A_fncid.length; i++) {
			if (-1 !== H_func.indexOf(A_fncid[i]) == true) {
				return true;
			}
		}

		return false;
	}
};
