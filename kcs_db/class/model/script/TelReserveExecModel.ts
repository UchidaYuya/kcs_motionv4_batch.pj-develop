//電話予約処理 （Model）
//2008/09/08 宝子山 作成
import MtScriptAmbient from "../../MtScriptAmbient";
import ModelBase from "../ModelBase"
import PostModel from "../PostModel"

export default class TelReserveExecModel extends ModelBase {
	static TELMID = 1;
	static TERMINALID = 1;
	static ADDMODE = 0;
	static MODMODE = 1;
	static MOVEMODE = 2;
	static DELMODE = 3;
	O_Post: PostModel;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_Post = new PostModel();
	}

	beginWrapper() {
		this.get_DB().beginTransaction();
	}

	rollbackWrapper() {
		this.get_DB().rollback();
	}

	getTelReserveListUnExec() {
		var sql = "select * from tel_reserve_tb " + " where reserve_date <= " + this.get_DB().dbQuote(this.getToday(), "timestamp", true) + " and exe_state = 0" + " order by add_edit_flg desc,reserve_date";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getNow() 
	{
		return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	}

	getToday() 
	{
		return new Date().toJSON().slice(0,10).replace(/-/g,'-');
	}


	async checkTelExist(pactid: number, telno: string, carid: number) {
		var sql = "select count(telno) from tel_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);

		if (await this.get_DB().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	async checkTelRelAssetsExist(pactid: number, telno: string, carid: number, assetsid: any) {
		var sql = "select count(telno) from tel_rel_assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true);

		if (await this.get_DB().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	async checkAssetsExist(pactid, assetsid) {
		var sql = "select count(assetsid) from assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true) + " and assetstypeid=" + this.get_DB().dbQuote(TelReserveExecModel.TERMINALID, "integer", true);

		if (await this.get_DB().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	async checkTelRelTelExist(pactid: number, telno: string, carid: number) {
		var sql = "select count(telno) from tel_rel_tel_tb" + " where " + " (telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + ")" + " or " + " (rel_telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(carid, "integer", true) + ")";

		if (await this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	async checkUsedTerminal(pactid: number, telno: string, carid: number, assetsid: any) {
		var sql = "select count(telno) from tel_rel_assets_tb" + " where " + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and " + " telno!=" + this.getDB().dbQuote(telno, "text", true) + " and " + " carid!=" + this.getDB().dbQuote(carid, "integer", true) + " and " + " assetsid=" + this.getDB().dbQuote(assetsid, "integer", true);
		var res = this.getDB().queryOne(sql);

		if (await res >= 1) {
			return true;
		} else {
			return false;
		}
	}

	checkDeleteInsertTel(pactid: number, telno: string, carid: number, flg: number, A_reserve: string | any[]) //新規または削除の時
	{
		if (TelReserveExecModel.ADDMODE == flg || TelReserveExecModel.DELMODE == flg) {
			for (var cnt = 0; cnt < A_reserve.length; cnt++) //同じ電話があったとき
			{
				if (A_reserve[cnt].pactid == pactid && A_reserve[cnt].telno == telno && A_reserve[cnt].carid == carid) {
					if (TelReserveExecModel.ADDMODE == flg && TelReserveExecModel.DELMODE == A_reserve[cnt].add_edit_flg || TelReserveExecModel.DELMODE == flg && TelReserveExecModel.ADDMODE == A_reserve[cnt].add_edit_flg) {
						return true;
					}
				}
			}
		}

		return false;
	}

	async makeDummyTelNo(pactid: number) {
		var ans = false;

		while (ans == false) //ランダム文字列生成
		//対象テーブルで使用されていないか調べる
		//未使用ならばその文字列を返す
		{
		const crypto = require("crypto");
		var str = crypto.randomBytes(16).toString("dummy");
			// var str = uniqueId("dummy");
			var sql = "select count(telno) from tel_tb" + " where " + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and " + " telno=" + this.getDB().dbQuote(str, "text", true);
			var res = this.getDB().queryOne(sql);

			if (0 === await res) {
				ans = true;
			}
		}

		return str;
	}

	makeTelCols(type = "insert") //新規のみの項目
	{
		var A_col = {
			pactid: ["integer", true],
			telno_view: ["text", true],
			telno: ["text", true],
			mail: ["text", false],
			userid: ["integer", false],
			carid: ["integer", true],
			arid: ["integer", true],
			cirid: ["integer", true],
			planid: ["integer", false],
			planalert: ["text", false],
			packetid: ["integer", false],
			packetalert: ["text", false],
			pointstage: ["integer", false],
			buyselid: ["integer", false],
			options: ["text", false],
			discounts: ["text", false],
			username: ["text", false],
			employeecode: ["text", false],
			simcardno: ["text", false],
			memo: ["text", false],
			orderdate: ["timestamp", false],
			contractdate: ["timestamp", false],
			machine: ["text", false],
			color: ["text", false],
			webreliefservice: ["text", false],
			recogcode: ["text", false],
			pbpostcode: ["text", false],
			cfbpostcode: ["text", false],
			ioecode: ["text", false],
			coecode: ["text", false],
			pbpostcode_first: ["text", false],
			pbpostcode_second: ["text", false],
			cfbpostcode_first: ["text", false],
			cfbpostcode_second: ["text", false],
			commflag: ["text", false],
			employee_class: ["integer", false],
			executive_no: ["text", false],
			executive_name: ["text", false],
			executive_mail: ["text", false],
			salary_source_name: ["text", false],
			salary_source_code: ["text", false],
			office_code: ["integer", false],
			office_name: ["text", false],
			building_name: ["text", false],
			text1: ["text", false],
			text2: ["text", false],
			text3: ["text", false],
			text4: ["text", false],
			text5: ["text", false],
			text6: ["text", false],
			text7: ["text", false],
			text8: ["text", false],
			text9: ["text", false],
			text10: ["text", false],
			text11: ["text", false],
			text12: ["text", false],
			text13: ["text", false],
			text14: ["text", false],
			text15: ["text", false],
			int1: ["integer", false],
			int2: ["integer", false],
			int3: ["integer", false],
			int4: ["integer", false],
			int5: ["integer", false],
			int6: ["integer", false],
			date1: ["timestamp", false],
			date2: ["timestamp", false],
			date3: ["timestamp", false],
			date4: ["timestamp", false],
			date5: ["timestamp", false],
			date6: ["timestamp", false],
			mail1: ["text", false],
			mail2: ["text", false],
			mail3: ["text", false],
			url1: ["text", false],
			url2: ["text", false],
			url3: ["text", false],
			select1: ["text", false],
			select2: ["text", false],
			select3: ["text", false],
			select4: ["text", false],
			select5: ["text", false],
			select6: ["text", false],
			select7: ["text", false],
			select8: ["text", false],
			select9: ["text", false],
			select10: ["text", false],
			fixdate: ["timestamp", true],
			kousiflg: ["text", false],
			kousiptn: ["integer", false],
			pre_telno: ["text", false],
			pre_carid: ["integer", false],
			extensionno: ["text", false],
			postid: ["integer", false],
			recdate: ["timestamp", false],
			dummy_flg: ["boolean", true]
		};
		if ("insert" == type) {
			A_col.postid = ["integer", true];
			A_col.recdate = ["timestamp", true];
			var H_col:any = Object.keys(A_col);
		} else {
			var H_col:any = A_col;
		}

		return H_col;
	}

	makeTelBaseCols(flag, order_flg = false) {
		if (order_flg) {
			var A_col = ["planid", "packetid", "options", "discounts", "webreliefservice", "fixdate"];
		} else //v2型では決めで更新してはいけない
			{
				A_col = ["pactid", "postid", "telno_view", "extensionno", "telno", "carid", "arid", "cirid", "planid", "packetid", "pointstage", "buyselid", "options", "discounts", "webreliefservice", "simcardno", "orderdate", "contractdate", "fixdate"];

				if ("v2" != flag) {
					A_col.push("userid");
					A_col.push("mail");
					A_col.push("kousiflg");
					A_col.push("kousiptn");
				}
			}

		return A_col;
	}

	makeTelValues(H_val, type = "insert") //フラグ系をSQL用にコンバート
	//新規のみの項目
	{
		if (H_val.dummy_flg == true) {
			H_val.dummy_flg = "t";
		} else {
			H_val.dummy_flg = "f";
		}

		var A_val = [this.get_DB().dbQuote(H_val.pactid, "integer", true, "pactid"), this.get_DB().dbQuote(H_val.telno_view, "text", true, "telno"), this.get_DB().dbQuote(H_val.telno, "text", true, "telno_view"), this.get_DB().dbQuote(H_val.mail, "text"), this.get_DB().dbQuote(H_val.userid, "integer"), this.get_DB().dbQuote(H_val.carid, "integer", true, "carid"), this.get_DB().dbQuote(H_val.arid, "integer"), this.get_DB().dbQuote(H_val.cirid, "integer", true, "cirid"), this.get_DB().dbQuote(H_val.planid, "integer"), this.get_DB().dbQuote(H_val.planalert, "text"), this.get_DB().dbQuote(H_val.packetid, "integer"), this.get_DB().dbQuote(H_val.packetalert, "text"), this.get_DB().dbQuote(H_val.pointstage, "integer"), this.get_DB().dbQuote(H_val.buyselid, "integer"), this.get_DB().dbQuote(H_val.options, "text"), this.get_DB().dbQuote(H_val.discounts, "text"), this.get_DB().dbQuote(H_val.username, "text"), this.get_DB().dbQuote(H_val.employeecode, "text"), this.get_DB().dbQuote(H_val.simcardno, "text"), this.get_DB().dbQuote(H_val.memo, "text"), this.get_DB().dbQuote(H_val.orderdate, "timestamp"), this.get_DB().dbQuote(H_val.contractdate, "timestamp"), this.get_DB().dbQuote(H_val.machine, "text"), this.get_DB().dbQuote(H_val.color, "text"), this.get_DB().dbQuote(H_val.webreliefservice, "text"), this.get_DB().dbQuote(H_val.recogcode, "text"), this.get_DB().dbQuote(H_val.pbpostcode, "text"), this.get_DB().dbQuote(H_val.cfbpostcode, "text"), this.get_DB().dbQuote(H_val.ioecode, "text"), this.get_DB().dbQuote(H_val.coecode, "text"), this.get_DB().dbQuote(H_val.pbpostcode_first, "text"), this.get_DB().dbQuote(H_val.pbpostcode_second, "text"), this.get_DB().dbQuote(H_val.cfbpostcode_first, "text"), this.get_DB().dbQuote(H_val.cfbpostcode_second, "text"), this.get_DB().dbQuote(H_val.commflag, "text"), this.get_DB().dbQuote(H_val.employee_class, "integer"), this.get_DB().dbQuote(H_val.executive_no, "text"), this.get_DB().dbQuote(H_val.executive_name, "text"), this.get_DB().dbQuote(H_val.executive_mail, "text"), this.get_DB().dbQuote(H_val.salary_source_name, "text"), this.get_DB().dbQuote(H_val.salary_source_code, "text"), this.get_DB().dbQuote(H_val.office_code, "text"), this.get_DB().dbQuote(H_val.office_name, "text"), this.get_DB().dbQuote(H_val.building_name, "text"), this.get_DB().dbQuote(H_val.text1, "text"), this.get_DB().dbQuote(H_val.text2, "text"), this.get_DB().dbQuote(H_val.text3, "text"), this.get_DB().dbQuote(H_val.text4, "text"), this.get_DB().dbQuote(H_val.text5, "text"), this.get_DB().dbQuote(H_val.text6, "text"), this.get_DB().dbQuote(H_val.text7, "text"), this.get_DB().dbQuote(H_val.text8, "text"), this.get_DB().dbQuote(H_val.text9, "text"), this.get_DB().dbQuote(H_val.text10, "text"), this.get_DB().dbQuote(H_val.text11, "text"), this.get_DB().dbQuote(H_val.text12, "text"), this.get_DB().dbQuote(H_val.text13, "text"), this.get_DB().dbQuote(H_val.text14, "text"), this.get_DB().dbQuote(H_val.text15, "text"), this.get_DB().dbQuote(H_val.int1, "integer"), this.get_DB().dbQuote(H_val.int2, "integer"), this.get_DB().dbQuote(H_val.int3, "integer"), this.get_DB().dbQuote(H_val.int4, "integer"), this.get_DB().dbQuote(H_val.int5, "integer"), this.get_DB().dbQuote(H_val.int6, "integer"), this.get_DB().dbQuote(H_val.date1, "timestamp"), this.get_DB().dbQuote(H_val.date2, "timestamp"), this.get_DB().dbQuote(H_val.date3, "timestamp"), this.get_DB().dbQuote(H_val.date4, "timestamp"), this.get_DB().dbQuote(H_val.date5, "timestamp"), this.get_DB().dbQuote(H_val.date6, "timestamp"), this.get_DB().dbQuote(H_val.mail1, "text"), this.get_DB().dbQuote(H_val.mail2, "text"), this.get_DB().dbQuote(H_val.mail3, "text"), this.get_DB().dbQuote(H_val.url1, "text"), this.get_DB().dbQuote(H_val.url2, "text"), this.get_DB().dbQuote(H_val.url3, "text"), this.get_DB().dbQuote(H_val.select1, "text"), this.get_DB().dbQuote(H_val.select2, "text"), this.get_DB().dbQuote(H_val.select3, "text"), this.get_DB().dbQuote(H_val.select4, "text"), this.get_DB().dbQuote(H_val.select5, "text"), this.get_DB().dbQuote(H_val.select6, "text"), this.get_DB().dbQuote(H_val.select7, "text"), this.get_DB().dbQuote(H_val.select8, "text"), this.get_DB().dbQuote(H_val.select9, "text"), this.get_DB().dbQuote(H_val.select10, "text"), this.get_DB().dbQuote(this.getNow(), "timestamp", true), this.get_DB().dbQuote(H_val.kousiflg, "text"), this.get_DB().dbQuote(H_val.kousiptn, "integer"), this.get_DB().dbQuote(H_val.pre_telno, "text"), this.get_DB().dbQuote(H_val.pre_carid, "integer"), this.get_DB().dbQuote(H_val.extensionno, "text"), this.get_DB().dbQuote(H_val.dummy_flg, "text", true)];
		if ("insert" == type) {
			A_val.push(this.get_DB().dbQuote(H_val.postid, "integer", true, "postid"));
			A_val.push(this.get_DB().dbQuote("timestamp", "",true));
		}

		return A_val;
	}

	makeAssetsCols(type = "insert") //新規のみの項目
	{
		var A_col = {
			assetsno: ["text", false],
			assetstypeid: ["integer", true],
			serialno: ["text", false],
			seriesname: ["text", false],
			productid: ["integer", false],
			productname: ["text", false],
			branchid: ["integer", false],
			property: ["text", false],
			search_carid: ["integer", false],
			search_cirid: ["integer", false],
			bought_date: ["text", false],
			bought_price: ["text", false],
			pay_startdate: ["text", false],
			pay_frequency: ["text", false],
			pay_monthly_sum: ["text", false],
			firmware: ["text", false],
			version: ["text", false],
			smpcirid: ["integer", false],
			accessory: ["text", false],
			username: ["text", false],
			employeecode: ["text", false],
			memo: ["text", false],
			text1: ["text", false],
			text2: ["text", false],
			text3: ["text", false],
			text4: ["text", false],
			text5: ["text", false],
			text6: ["text", false],
			text7: ["text", false],
			text8: ["text", false],
			text9: ["text", false],
			text10: ["text", false],
			text11: ["text", false],
			text12: ["text", false],
			text13: ["text", false],
			text14: ["text", false],
			text15: ["text", false],
			int1: ["integer", false],
			int2: ["integer", false],
			int3: ["integer", false],
			int4: ["integer", false],
			int5: ["integer", false],
			int6: ["integer", false],
			date1: ["timestamp", false],
			date2: ["timestamp", false],
			date3: ["timestamp", false],
			date4: ["timestamp", false],
			date5: ["timestamp", false],
			date6: ["timestamp", false],
			mail1: ["text", false],
			mail2: ["text", false],
			mail3: ["text", false],
			url1: ["text", false],
			url2: ["text", false],
			url3: ["text", false],
			fixdate: ["timestamp", false],
			pre_assetsno: ["text", false],
			pre_assetstypeid: ["integer", false],
			receiptdate: ["date", false],
			pactid : ["integer", false],
			postid : ["integer", false],
			assetsid : ["integer", false],
			recdate : ["timestamp", false]
		};

		if ("insert" == type) {
			A_col.pactid = ["integer", true];
			A_col.postid = ["integer", true];
			A_col.assetsid = ["integer", true];
			A_col.recdate = ["timestamp", true];
			var H_col:any = Object.keys(A_col);
		} else {
			var	H_col:any = A_col;
		}

		return H_col;
	}

	makeAssetsValues(H_val: any[number | string], type = "insert") //新規のみの項目
	{
		var A_val = [this.get_DB().dbQuote(H_val.assetsno, "text"), this.get_DB().dbQuote(H_val.assetstypeid, "integer", true), this.get_DB().dbQuote(H_val.serialno, "text"), this.get_DB().dbQuote(H_val.seriesname, "text"), this.get_DB().dbQuote(H_val.productid, "integer"), this.get_DB().dbQuote(H_val.productname, "text"), this.get_DB().dbQuote(H_val.branchid, "integer"), this.get_DB().dbQuote(H_val.property, "text"), this.get_DB().dbQuote(H_val.search_carid, "integer"), this.get_DB().dbQuote(H_val.search_cirid, "integer"), this.get_DB().dbQuote(H_val.bought_date, "text"), this.get_DB().dbQuote(H_val.bought_price, "integer"), this.get_DB().dbQuote(H_val.pay_startdate, "text"), this.get_DB().dbQuote(H_val.pay_frequency, "text"), this.get_DB().dbQuote(H_val.pay_monthly_sum, "text"), this.get_DB().dbQuote(H_val.firmware, "text"), this.get_DB().dbQuote(H_val.version, "text"), this.get_DB().dbQuote(H_val.smpcirid, "integer"), this.get_DB().dbQuote(H_val.accessory, "text"), this.get_DB().dbQuote(H_val.username, "text"), this.get_DB().dbQuote(H_val.employeecode, "text"), this.get_DB().dbQuote(H_val.memo, "text"), this.get_DB().dbQuote(H_val.text1, "text"), this.get_DB().dbQuote(H_val.text2, "text"), this.get_DB().dbQuote(H_val.text3, "text"), this.get_DB().dbQuote(H_val.text4, "text"), this.get_DB().dbQuote(H_val.text5, "text"), this.get_DB().dbQuote(H_val.text6, "text"), this.get_DB().dbQuote(H_val.text7, "text"), this.get_DB().dbQuote(H_val.text8, "text"), this.get_DB().dbQuote(H_val.text9, "text"), this.get_DB().dbQuote(H_val.text10, "text"), this.get_DB().dbQuote(H_val.text11, "text"), this.get_DB().dbQuote(H_val.text12, "text"), this.get_DB().dbQuote(H_val.text13, "text"), this.get_DB().dbQuote(H_val.text14, "text"), this.get_DB().dbQuote(H_val.text15, "text"), this.get_DB().dbQuote(H_val.int1, "integer"), this.get_DB().dbQuote(H_val.int2, "integer"), this.get_DB().dbQuote(H_val.int3, "integer"), this.get_DB().dbQuote(H_val.int4, "integer"), this.get_DB().dbQuote(H_val.int5, "integer"), this.get_DB().dbQuote(H_val.int6, "integer"), this.get_DB().dbQuote(H_val.date1, "timestamp"), this.get_DB().dbQuote(H_val.date2, "timestamp"), this.get_DB().dbQuote(H_val.date3, "timestamp"), this.get_DB().dbQuote(H_val.date4, "timestamp"), this.get_DB().dbQuote(H_val.date5, "timestamp"), this.get_DB().dbQuote(H_val.date6, "timestamp"), this.get_DB().dbQuote(H_val.mail1, "text"), this.get_DB().dbQuote(H_val.mail2, "text"), this.get_DB().dbQuote(H_val.mail3, "text"), this.get_DB().dbQuote(H_val.url1, "text"), this.get_DB().dbQuote(H_val.url2, "text"), this.get_DB().dbQuote(H_val.url3, "text"), this.get_DB().dbQuote(this.getNow(), "timestamp", true), this.get_DB().dbQuote(H_val.pre_assetsno, "text"), this.get_DB().dbQuote(H_val.pre_assetstypeid, "integer"), this.get_DB().dbQuote(H_val.receiptdate, "date")];

		if ("insert" == type) {
			A_val.push(this.get_DB().dbQuote(H_val.pactid, "integer", true));
			A_val.push(this.get_DB().dbQuote(H_val.postid, "integer", true));
			A_val.push(this.get_DB().dbQuote(H_val.assetsid + "", "integer", true));
			// A_val.push(this.get_db().dbQuote(this.getNow(), "timestamp", true));
			A_val.push(this.get_DB().dbQuote( "timestamp", "" ,true));
		}

		return A_val;
	}

	doTelAddSQL(H_tel) {
		var sql = "insert into tel_tb (" + this.makeTelCols().join(",") + ")" + " values (" + this.makeTelValues(H_tel).join(",") + ")";
		this.doExec(sql);
	}

	doTelMoveSQL(H_tel) {
		var sql = "update tel_tb set " + " postid=" + this.get_DB().dbQuote(H_tel.movepostid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(H_tel.telno, "text", true) + " and carid=" + this.get_DB().dbQuote(H_tel.carid, "integer", true);
		this.doExec(sql);
	}

	doTelDelSQL(H_tel) {
		var sql = "delete from tel_tb " + " where " + " pactid=" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(H_tel.telno, "text", true) + " and carid=" + this.get_DB().dbQuote(H_tel.carid, "integer", true);
		this.doExec(sql);
	}

	async doTelModSQL(H_tel) //常に更新カラム
	//カラム取得
	//sql文格納用
	//sql文作成
	{
		H_tel.fixdate = this.getNow();
		var A_base = this.makeTelBaseCols(H_tel.schedule_person_name, H_tel.order_flg);
		var H_col = this.makeTelCols("update");
		var A_sql = Array();

		for (var col in H_col) {
			var A_meth = H_col[col];

			if (-1 !== A_base.indexOf(col) == true) {
				if (col == "userid") {
					if (H_tel[col] != "" && await this.checkUseridExists(H_tel[col])) {
						A_sql.push(col + "=" + this.get_DB().dbQuote(H_tel[col], A_meth[0], A_meth[1]));
					}
				} else {
					A_sql.push(col + "=" + this.get_DB().dbQuote(H_tel[col], A_meth[0], A_meth[1]));
				}
			} else {
				if (H_tel[col] != "") {
					A_sql.push(col + "=" + this.get_DB().dbQuote(H_tel[col], A_meth[0], A_meth[1]));
				}
			}
		}

		var sql = "update tel_tb set " + A_sql.join(",") + " where " + " pactid=" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(H_tel.telno, "text", true) + " and carid=" + this.get_DB().dbQuote(H_tel.carid, "integer", true);
		this.doExec(sql);
	}

	doAssetsAddSQL(H_assets) {
		var sql = "insert into assets_tb (" + this.makeAssetsCols().join(",") + ")" + " values (" + this.makeAssetsValues(H_assets).join(",") + ")";
		this.doExec(sql);
	}

	doAssetsModSQL(H_assets) //カラム取得
	//値部分のsql文格納配列
	//sql文作成
	{
		H_assets.assetstpeid = TelReserveExecModel.TERMINALID;
		H_assets.fixdate = this.getNow();
		var H_col = this.makeAssetsCols("update");
		var A_sql = Array();

		for (var col in H_col) {
			var A_meth = H_col[col];

			if (H_assets[col] != "") {
				A_sql.push(col + "=" + this.get_DB().dbQuote(H_assets[col], A_meth[0], A_meth[1]));
			}
		}

		var sql = "update assets_tb set " + A_sql.join(",") + " where " + " pactid=" + this.get_DB().dbQuote(H_assets.pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(H_assets.assetsid, "integer", true);
		this.doExec(sql);
	}

	doAssetsMoveSQL(H_tel, assetsid) {
		var sql = "update assets_tb set " + " postid=" + this.get_DB().dbQuote(H_tel.movepostid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true);
		this.doExec(sql);
	}

	doAssetsDelSQL(pactid, assetsid) {
		var sql = "delete from assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true) + " and assetstypeid=" + this.get_DB().dbQuote(TelReserveExecModel.TERMINALID, "integer", true);
		this.doExec(sql);
	}

	doTelRelAssetsAddSQL(pactid, telno, carid, assetsid, mainflg = "true") {
		var sql = "insert into tel_rel_assets_tb (pactid,telno,carid,assetsid,main_flg)" + " values (" + this.get_DB().dbQuote(pactid, "integer", true) + "," + this.get_DB().dbQuote(telno, "text", true) + "," + this.get_DB().dbQuote(carid, "integer", true) + "," + this.get_DB().dbQuote(assetsid, "integer", true) + "," + this.get_DB().dbQuote(mainflg, "boolean", true) + ")";
		this.doExec(sql);
	}

	doTelRelAssetsDelSQL(pactid, telno, carid, assetsid) {
		var sql = "delete from tel_rel_assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true);
		this.doExec(sql);
	}

	doTelRelTelAddSQL(pactid, telno, carid, rel_telno, rel_carid) {
		var sql = "insert into tel_rel_tel_tb (pactid,telno,carid,rel_telno,rel_carid)" + " values (" + this.get_DB().dbQuote(pactid, "integer", true) + "," + this.get_DB().dbQuote(telno, "text", true) + "," + this.get_DB().dbQuote(carid, "integer", true) + "," + this.get_DB().dbQuote(rel_telno, "text", true) + "," + this.get_DB().dbQuote(rel_carid, "integer", true) + ")";
		this.doExec(sql);
	}

	setTelRelAssetsMainFlagFalse(pactid, telno, carid) {
		var where = " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);
		var sql = "select assetsid from tel_rel_assets_tb" + where;
		var assetsid = this.get_DB().queryCol(sql);

		for (var id of Object.values(assetsid)) {
			sql = "update tel_rel_assets_tb  set main_flg = false" + where + " and assetsid=" + this.get_DB().dbQuote(id, "integer", true);
			this.doExec(sql);
		}
	}

	updateTelReserveExec(pactid, telno, carid, date, flg, state = 1) {
		var sql = "update tel_reserve_tb set " + " exe_state=" + this.get_DB().dbQuote(state, "integer", true) + "," + " exe_date=" + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + "," + " fixdate=" + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "telno") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		this.doExec(sql);
	}

	updateTelRelAssetsReserveExec(pactid, telno, carid, assetsid, date, flg, state = 1) {
		var sql = "update tel_rel_assets_reserve_tb set " + " exe_state=" + this.get_DB().dbQuote(state, "integer", true) + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "telno") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "telno") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		this.doExec(sql);
	}

	updateAssetsReserveExec(pactid, assetsid, date, flg, state = 1) {
		var sql = "update assets_reserve_tb set " + " exe_state=" + this.get_DB().dbQuote(state, "integer", true) + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "telno") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		this.doExec(sql);
	}

	updateTelRelTelReserveExec(pactid, telno, carid, rel_telno, rel_carid, date, flg, state = 1) {
		var sql = "update tel_rel_tel_reserve_tb set " + " exe_state=" + this.get_DB().dbQuote(state, "integer", true) + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and rel_telno=" + this.get_DB().dbQuote(rel_telno, "text", true) + " and rel_carid=" + this.get_DB().dbQuote(rel_carid, "integer", true) + " and exe_state=0";
		this.doExec(sql);
	}

	getTelRelAssetsReserveList(pactid, telno, carid, date, flg) {
		var sql = "select * from tel_rel_assets_reserve_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "telno") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getTelRelAssetsList(pactid, telno, carid) {
		var sql = "select * from tel_rel_assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "telno");
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getTelRelAssetsListFromAssetsID(pactid, assetsid) {
		var sql = "select * from tel_rel_assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid");
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getTelRelTelReserveList(pactid, telno, carid, date, flg) {
		var sql = "select * from tel_rel_tel_reserve_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "telno") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getAssetsReserveList(pactid, assetsid, date, flg) {
		var sql = "select * from assets_reserve_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "telno") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "telno") + " and exe_state=0";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getAssetsList(pactid, assetsid) {
		var sql = "select * from assets_tb " + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true, "pactid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid") + " and assetstypeid=" + this.get_DB().dbQuote(TelReserveExecModel.TERMINALID, "integer", true);
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	async doPostNotExistLogSQL(H_tel) {
		H_tel.postid = this.O_Post.getRootPostid(H_tel.pactid);
		H_tel.postname = this.O_Post.getPostNameOne(H_tel.postid);
		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, "登録先の部署が無いか請求閲覧者が居ません", "★ 登録先の部署が無いか請求閲覧者が居ません", "処理不可")).join(",") + ")";
		this.doExec(sql);
	}

	async doPostNotExistLogSQLV2(H_tel) {
		H_tel.postid = this.O_Post.getRootPostid(H_tel.pactid);
		H_tel.postname = this.O_Post.getPostNameOne(H_tel.postid);
		var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel,"★ 登録先の部署が無いか請求閲覧者が居ません", "処理不可")).join(",") + ")";
		// var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel, "登録先の部署が無いか請求閲覧者が居ません", "★ 登録先の部署が無いか請求閲覧者が居ません", "処理不可")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelAddLogSQL(H_tel, mode = 0) {
		if (1 == mode) {
			var mess = "新規予約登録（変更に切り替え実行）";
			var mess_eng = "★新規予約登録（変更に切り替え実行）";
		} else {
			mess = "新規予約登録（実行）";
			mess_eng = "★新規予約登録（実行）";
		}

		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, mess, mess_eng, "新規登録")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelAddLogSQLV2(H_tel, mode = 0) {
		if (1 == mode) {
			var mess = "新規予約登録（変更に切り替え実行）";
		} else {
			mess = "新規予約登録（実行）";
		}

		var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel, mess, "新規登録")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelModLogSQL(H_tel) {
		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, "変更予約（実行）", "Change reservation (implementation)", "変更")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelModLogSQLV2(H_tel) {
		var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel, "変更予約（実行）", "変更")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelMoveLogSQL(H_tel) {
		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, "移動予約（実行）", "Shift reservation (implementation)", "移動")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelMoveLogSQLV2(H_tel) {
		var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel, "移動予約（実行）", "移動")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelDelLogSQL(H_tel) {
		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, "削除予約（実行）", "Deletion reservation (implementation)", "削除")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelDelLogSQLV2(H_tel) {
		var sql = "insert into telmnglog_tb (" + this.getV2LogTbCols().join(",") + ")" + " values (" + (await this.getV2LogValueSQL(H_tel, "削除予約（実行）", "削除")).join(",") + ")";
		this.doExec(sql);
	}

	async doTelDissolutionLogSQL(H_tel) //販売店からの削除処理は実行者を「システム」に置き換える 2014-07-17
	{
		H_tel.exe_name = "システム";
		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ")" + " values (" + (await this.getLogValueSQL(H_tel, "システムによる削除", "Deletion by system", "削除")).join(",") + ")";
		this.doExec(sql);
	}

	getLogTbCols() {
		var A_col = ["mid", "pactid", "postid", "userid", "username", "manageno", "manageno_view", "coid", "comment", "comment_eng", "trg_postid", "trg_postid_aft", "trg_postname", "trg_postname_aft", "joker_flag", "type", "recdate"];
		return A_col;
	}

	getV2LogTbCols() {
		var A_col = ["pactid", "postid", "userid", "name", "telno", "carid", "comment", "telpostid", "telpostidaft", "telpostname", "telpostnameaft", "joker_flag", "type", "recdate"];
		return A_col;
	}

	async getLogValueSQL(H_tel:any, comment: string, comment_eng: string, type: string) {
		var postname = this.O_Post.getPostNameOne(H_tel.postid);
		var movepostname = "";

		if (H_tel.movepostid != "") {
			movepostname = await this.O_Post.getPostNameOne(H_tel.movepostid);
		}

		var A_val = [TelReserveExecModel.TELMID, this.get_DB().dbQuote(H_tel.pactid, "integer", true), this.get_DB().dbQuote(H_tel.postid, "integer", true), this.get_DB().dbQuote(H_tel.exe_userid, "integer", true), this.get_DB().dbQuote(H_tel.exe_name, "text", true), this.get_DB().dbQuote(H_tel.telno, "text", true), this.get_DB().dbQuote(H_tel.telno_view, "text", true), this.get_DB().dbQuote(H_tel.carid, "integer", true), this.get_DB().dbQuote(comment, "text", true), this.get_DB().dbQuote(comment_eng, "text", true), this.get_DB().dbQuote(H_tel.postid, "integer", true), this.get_DB().dbQuote(H_tel.movepostid, "integer"), this.get_DB().dbQuote(postname, "text", true), this.get_DB().dbQuote(movepostname, "text"), this.get_DB().dbQuote(H_tel.joker_flag, "integer", true), this.get_DB().dbQuote(type, "text", true), this.get_DB().dbQuote(this.getNow(), "timestamp", true)];
		return A_val;
	}

	async getV2LogValueSQL(H_tel:any[string | number], comment: string, type: string) {
		var postname = this.O_Post.getPostNameOne(H_tel.postid);
		var movepostname = "";

		if (H_tel.movepostid != "") {
			movepostname = await this.O_Post.getPostNameOne(H_tel.movepostid);
		}

		var A_val = [this.get_DB().dbQuote(H_tel.pactid, "integer", true), this.get_DB().dbQuote(H_tel.postid, "integer", true), this.get_DB().dbQuote(H_tel.exe_userid, "integer", true), this.get_DB().dbQuote(H_tel.exe_name, "text", true), this.get_DB().dbQuote(H_tel.telno_view, "text", true), this.get_DB().dbQuote(H_tel.carid, "integer", true), this.get_DB().dbQuote(comment, "text", true), this.get_DB().dbQuote(H_tel.postid, "integer", true), this.get_DB().dbQuote(H_tel.movepostid, "integer"), this.get_DB().dbQuote(postname, "text", true), this.get_DB().dbQuote(movepostname, "text"), this.get_DB().dbQuote(H_tel.joker_flag, "integer", true), this.get_DB().dbQuote(type, "text", true), this.get_DB().dbQuote(this.getNow(), "timestamp", true)];
		return A_val;
	}

	doInsertChangePost(H_tel, type) {
		H_tel.postname = this.O_Post.getPostNameOne(H_tel.postid);
		H_tel.movepostname = undefined;

		if (undefined != H_tel.movepostid) {
			H_tel.movepostname = this.O_Post.getPostNameOne(H_tel.movepostid);
		}

		var sql = "insert into change_post_tb (" + "pactid,postid,postname,postidaft,postnameaft,telno,carid,status,date,recdate,fixdate " + ") values (" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + "," + this.get_DB().dbQuote(H_tel.postid, "integer", true) + "," + this.get_DB().dbQuote(H_tel.postname, "text", true) + "," + this.get_DB().dbQuote(H_tel.movepostid, "integer") + "," + this.get_DB().dbQuote(H_tel.movepostname, "text") + "," + this.get_DB().dbQuote(H_tel.telno, "text", true) + "," + this.get_DB().dbQuote(H_tel.carid, "integer", true) + "," + this.get_DB().dbQuote(type, "text", true) + "," + this.get_DB().dbQuote(H_tel.reserve_date, "timestamp", true) + "," + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + "," + this.get_DB().dbQuote(this.getNow(), "timestamp", true) + ")";
		this.doExec(sql);
	}

	doUpdateDelteldate(H_tel) {
		var sql = "update tel_tb set " + " delteldate=" + this.get_DB().dbQuote(H_tel.reserve_date, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(H_tel.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(H_tel.telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(H_tel.carid, "integer", true);
		this.doExec(sql);
	}

	async doExec(sql) {
		var res = await this.get_DB().exec(sql, false);

		if (!res) {
			this.errorOut(1001, "SQLエラー\n" + res.getMessage());
			this.get_DB().rollback();
			this.getOut().flushMessage();
			throw process.exit();// 2022cvt_009
		}

		if (await res != 1) {
			this.errorOut(1001, "更新レコードが1ではない\n結果：" + res + "\n" + sql);
			this.get_DB().rollback();
			this.getOut().flushMessage();
			throw process.exit();// 2022cvt_009
		}
	}

	async checkUseridExists(userid) {
		var sql = "select count(*) from user_tb where " + "userid=" + this.get_DB().dbQuote(userid, "integer", true);
		var count = this.get_DB().queryOne(sql);

		if (!isNaN(Number(count)) || await count == 0) {
			return false;
		} else {
			return true;
		}
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
