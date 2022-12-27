//機能権限クラス
//
//権限関連のクラスライブラリ
//
//更新履歴：<br>
//2008/04/09 上杉勝史 作成<br>
import MtExcept from './MtExcept';
import MtSetting from './MtSetting';
import MtOutput from './MtOutput';
import MtBusinessDay from './MtBusinessDay';
import FuncModel from './model/FuncModel';
import PostModel from './model/PostModel';
import { KCS_DIR } from '../conf/batch_setting';

const fs = require("fs");
var _SESSION: { [value: string]: string }
var _COOKIE: { [value: string]: string }
export default class MtAuthority {
	static OH_Instance = Array();
	O_Out: MtOutput;
	O_Setting: MtSetting;
	O_Func: FuncModel;
	O_Post: PostModel;
	BizType: any;
	O_Biz: MtBusinessDay;
	Pactid: any;
	H_FuncPact: any[];
	H_FuncUser: any[];
	Extend: boolean | undefined;
	Joker: boolean | undefined;
	HHMM!: string;
	getFollowerPost: any;

	constructor(pactid: string) //アウトプット
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
		this.getSetting().loadConfig("define");
		this.O_Func = new FuncModel();
		this.O_Post = new PostModel();
		this.O_Biz = new MtBusinessDay();
		this.BizType = this.O_Biz.chkBusinessType();
		this.Pactid = pactid;
		this.H_FuncPact = Array();
		this.H_FuncUser = Array();
		this.setJoker(false);
		this.setExtend(false);
		this.setHHMM();
		this.setAllPactFunc();
		this.checkExtend();
	}

	static singleton(pactid: string) {
		if (!isNaN(Number(pactid)) == false) {
			MtExcept.raise("MtAuthority::singleton() 引数(pactid)がない");
			throw process.exit(-1);
		}

		// インスタンスが既に生成されていない場合のみインスタンス生成
		if(!this.OH_Instance[pactid]){
			this.OH_Instance[pactid] = new MtAuthority(pactid);
		}

		// 各所でsetJokerする必要があったのだが抜けているのでここで実行
		if (_SESSION["joker"]) {
			this.OH_Instance[pactid].setJoker(_SESSION["joker"]);
		}

		return this.OH_Instance[pactid];
	}

	getOut(): any {
		return this.O_Out;
	}

	getSetting() {
		return this.O_Setting;
	}

	getFuncModel() {
		return this.O_Func;
	}

	getPostModel() {
		return this.O_Post;
	}

	setJoker(bool = true) {
		if (bool == true) {
			this.Joker = true;
			this.setExtend(false);
			this.setHHMM(this.getSetting().get("joker_time"));
		} else {
			this.Joker = false;
			this.setHHMM();
		}
	}

	setExtend(bool = true) {
		if (bool == true) {
			this.Extend = true;
		} else {
			this.Extend = false;
		}
	}

	gExtend() {
		return this.Extend;
	}

	checkExtend() {
		if (this.gBizType() == "extend" && this.chkPactFuncIni("fnc_extend", "all") == true) {
			this.setExtend(true);
		} else {
			this.setExtend(false);
		}
	}

	setHelpFunc(userid: number, hhmm = "") {
		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== global.G_HELP_DISPLAY == false) {
			if (this.chkUserFuncIni(userid, "fnc_help", hhmm) == true) {
				global.G_HELP_DISPLAY = true;
				this.setHelpFile();
			} else {
				global.G_HELP_DISPLAY = false;
			}
		}
	}

	async setHelpFromId(fncid: string) {
		this.setHelpFile(await this.getFuncModel().getHelpFromId(fncid));
	}

	async setHelpFromIni(ininame: string) {
		this.setHelpFile(await this.getFuncModel().getHelpFromIni(ininame));
	}

	setHelpFile(helpfile = "help.pdf") {
		if (helpfile != "") {
			global.G_HELP_FILE = helpfile;
		}

		if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
			global.G_HELP_FILE = "Hotline/" + global.G_HELP_FILE;
		}

		if (undefined !== _SESSION.helpfile == true && _SESSION.helpfile == "on" && _SESSION.pactid != "") //存在確認
			{
				if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
					if (fs.existsSync(KCS_DIR + "/htdocs/Help/Hotline/" + _SESSION.pactid + "/" + helpfile) == true) {
						global.G_HELP_FILE = "Hotline/" + _SESSION.pactid + "/" + helpfile;
					}
				} else {
					if (fs.existsSync(KCS_DIR + "/htdocs/Help/" + _SESSION.pactid + "/" + global.G_HELP_FILE) == true) {
						global.G_HELP_FILE = _SESSION.pactid + "/" + global.G_HELP_FILE;
					}
				}
			}
	}

	gBizType() {
		return this.BizType;
	}

	resetBizType(year: number, month: number, day: number, hour: string) //引数チェック
	//オブジェクト内の日付指定を元に戻す
	//
	{
		if (!isNaN(Number(year)) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() yearが不正", false);
		}

		if (!isNaN(Number(month)) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() monthが不正", false);
		}

		if (!isNaN(Number(day)) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() dayが不正", false);
		}

		if (!isNaN(Number(hour)) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() hourが不正", false);
		}

		this.O_Biz.setMember(year, month, day, hour);
		this.BizType = this.O_Biz.chkBusinessType(year, month, day, hour);
		this.O_Biz.setMember();

		if (this.gHHMM() != hour.padStart(2, "0") + "00") {
			this.setHHMM(hour.padStart(2, "0") + "00");
		}
	}

	gFuncPact(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncPact[hhmm] == true) {
			return this.H_FuncPact[hhmm];
		}

		return false;
	}

	gFuncUser(userid: number, hhmm = "") //引数チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::gFuncUser() useridが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncUser[hhmm][userid] == true) {
			return this.H_FuncUser[hhmm][userid];
		}

		return false;
	}

	sFuncPact(H_fnc: any, hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncPact[hhmm] = H_fnc;
	}

	sFuncUser(userid: number, H_fnc: any, hhmm = "") //引数チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::sFuncUser() useridが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncUser[hhmm][userid] = H_fnc;
	}

	setHHMM(hhmm:any = undefined) //引数がなかったら現在時間
	{
		var myDate = new Date();
		if (hhmm === undefined) {
			this.HHMM = myDate.getHours() + '' + myDate.getMinutes();
		} else //引数のチェック
			{
				if (!isNaN(Number(hhmm)) == false) {
					this.getOut().errorOut(0, "MtAuthority::setHHMM() 引数の時間(hhmm)が不正", false);
					throw process.exit(-1);
				} else //Joker以外なら夜間注文フラグを再設定
					{
						if ("string" === typeof hhmm == false) {
							this.getOut().errorOut(0, "MtAuthority::setHHMM() 引数の時間(hhmm)が10進ではない?ダブルクォート忘れ？", false);
							throw process.exit(-1);
						}

						this.HHMM = hhmm;

						if (this.Joker == false) { 
							this.resetBizType(myDate.getFullYear(), (myDate.getMonth()+1), myDate.getDate(), hhmm.padStart(2, "0").substr(0, 2));
							this.checkExtend();
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
			let _tmp_0 = this.H_FuncPact;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (key != "all") {
					delete this.H_FuncPact[key];
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

	setAllPactFunc() //既に取得済みなら取得済みデータを返す
	{
		if ((!this.gFuncPact("all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncPact(this.getFuncModel().getPactFunc(this.Pactid), "all");
			}
	}

	setAllUserFunc(userid: any) //入力チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::getUserFunc() 引数のuseridが不正", false);
		}

		if ((!this.gFuncUser(userid, "all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncUser(userid, this.getFuncModel().getUserFunc(userid, this.Pactid, undefined, this.gExtend()), "all");
			}
	}

	getPactFunc(hhmm:any = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncPact(hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllPactFunc();
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncPact(this.getFuncModel().getPactFunc(this.Pactid, hhmm, this.gExtend()), hhmm);
				}
		}

		return this.gFuncPact(hhmm);
	}

	getPactFuncIni(hhmm = "") {
		return Object.keys(this.getPactFunc(hhmm));
	}

	getPactFuncId(hhmm = "") {
		return Object.values(this.getPactFunc(hhmm));
	}

	chkPactFuncIni(ininame: string, hhmm = "") //入力チェック
	{
		if (ininame == "") {
			this.getOut().errorOut(0, "MtAuthority::chkPactFuncIni() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getPactFunc(hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkPactFuncId(fncid: number, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(fncid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkPactFuncId() 引数のfncidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getPactFunc(hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	getUserFunc(userid: any, hhmm: any = "") //入力チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::getUserFunc() 引数のuseridが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncUser(userid, hhmm) === false) //ヘルプ表示の権限チェック(V2互換の為)
			{
				if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
					{
						this.setAllUserFunc(userid);
					} else //DBから取得したものをメンバー変数に格納
					{
						this.sFuncUser(userid, this.getFuncModel().getUserFunc(userid, this.Pactid, hhmm, this.gExtend()), hhmm);
					}

				this.setHelpFunc(userid, hhmm);
			}

		return this.gFuncUser(userid, hhmm);
	}

	getUserFuncIni(userid: number, hhmm = "") {
		return Object.keys(this.getUserFunc(userid, hhmm));
	}

	getUserFuncId(userid: number, hhmm = "") {
		return Object.values(this.getUserFunc(userid, hhmm));
	}

	chkUserFuncIni(userid: number, ininame: string, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncIni() 引数のuseridが不正", false);
		}

		if (ininame == "") {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncIni() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(userid, hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkUserFuncId(userid: number, fncid: number, hhmm = "") //入力チェック
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncId() 引数のuseridが不正", false);
		}

		if (!isNaN(Number(fncid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncId() 引数のfncidが不正", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(userid, hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	async chkUserFuncPath(userid: number, path: string, hhmm = "") //入力チェック
	//ヘルプファイル
	{
		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncPath() 引数のuseridが不正", false);
		}

		if (path == "") {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncPath() 引数のininameが空です", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var A_fncid = await this.getFuncModel().getFuncidFromPath(path);
		var H_func = await this.getUserFunc(userid, hhmm);

		if (A_fncid.length == 1 && global.G_HELP_DISPLAY == true) {
			var helpfile = await this.getFuncModel().getHelpFromId(A_fncid[0]);

			if (helpfile != "") {
				this.setHelpFile(helpfile);
			}
		}

		for (var i = 0; i < A_fncid.length; i++) {
			if (-1 !== H_func.indexOf(A_fncid[i]) == true) {
				return true;
			}
		}

		return false;
	}

	checkFollowerUser(target_userid: number, targer_postid: number) //入力チェック
	{
		if (!isNaN(Number(target_userid)) == true) {
			this.getOut().warningOut(14, "MtAuthority::checkFollowerUser() 引数のtarget_useridが不正");
		}

		if (!isNaN(Number(targer_postid)) == true) {
			this.getOut().warningOut(14, "MtAuthority::checkFollowerUser() 引数のtarget_postidが不正");
		}
	}

	getFollowerAndRecogPost(orderid: number, postid = "", pactid = "") {}

	checkFollowerUser2(targetuserid: number, postid = "", pactid = "") {
		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (!isNaN(Number(targetuserid)) == false) {
			global.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "メニューへ");
		}

		var check_sql = "select postid from user_tb where userid = " + targetuserid;
		var targetpostid = global.GO_db.getOne(check_sql);
		var sql_str = "select postidparent,postidchild,level from post_relation_tb where pactid=" + _SESSION.pactid + " order by level";
		var H_post = global.GO_db.getHash(sql_str);
		var H_postid = Array();
		var A_postid_list = Array();
		var chk = false;

		for (var i = 0; i < H_post.length; i++) {
			var lvl = H_post[i].level;
			var pid = H_post[i].postidparent;
			var cid = H_post[i].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_postid_list.push(cid);
				}
			} else {
				if (lvl > level) {
					if (H_postid[pid] == true) {
						H_postid[cid] = true;
						A_postid_list.push(cid);
					}
				}
			}
		}

		// delete H_postid;
		H_postid = [];

		if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
			global.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "メニューへ");
		}

		return true;
	}

	checkFollowerTel(targettelno: string, carid: number, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "tel_tb";
		} else {
			tablename = "tel_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		// if (DEBUG == 1) {
		// 	//// echo(`${check_sql}<br>`);
		// }

		var targetpostid = global.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerTelReserve(targettelno: string, carid: number, postid = "", pactid = "") {
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var check_sql = "select postid from tel_reserve_tb where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		// if (DEBUG == 1) {
		// //	// echo(`${check_sql}<br>`);
		// }

		var targetpostid = global.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerETC(etc_cardno: string, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "card_tb";
		} else {
			tablename = "card_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where cardno = '" + etc_cardno + "' and pactid=" + pactid;

		// if (DEBUG == 1) {
		// 	// // echo(`${check_sql}<br>`);
		// }

		var targetpostid = global.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	isLanguage(userid: number) {
		if (this.chkUserFuncIni(userid, "fnc_view_english") == true) {
			return "ENG";
		} else {
			return "JPN";
		}
	}

};