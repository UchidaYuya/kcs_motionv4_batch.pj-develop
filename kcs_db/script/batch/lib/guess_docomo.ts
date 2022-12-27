//機能：請求明細から回線種別などを予測する(ドコモ専用)

//作成：森原


import { G_AREA_DOCOMO_UNKNOWN, G_CARRIER_DOCOMO, G_CIRCUIT_DOCOMO_OTHER, G_CIRCUIT_DOCOMO_XI, G_CIRCUIT_FOMA } from './script_common';
import TableNo, {FetchAdaptor, ScriptDB, ScriptDBAdaptor, TableInserter} from './script_db';
import {G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase} from './script_log';

const ARID_COMMON = 100;
const AUTH_V3 = 120;
const TOO_BIG_INTEGER = 2147483647;

const fs = require('fs');
const moji = require("moji");
const Iconv  = require('iconv').Iconv;
 export class GuessDocomoCore extends ScriptDBAdaptor {
	m_H_plan!: any[];
	m_H_packet!:any[];
	m_db!: ScriptDB;
	m_A_arid!:any[];
	m_A_cirid!:string[];
	m_H_packet_zero!:any[];
	m_shop_arid: string | undefined;
	m_A_plan_prior!:any[];
	m_is_v3: string | undefined;
	m_H_buyselid!:any[];
	m_H_planid_100!:any[];
	m_H_packetid_100!:any[];
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo) //プランマスターの準備
	{
		super(listener, db, table_no);
		this.m_shop_arid = undefined;
		new Promise(async resolve => {
			let sql = "select planid as id,planname as name,arid,cirid,basic as fix";
			sql += ",coalesce(prior_order, " + TOO_BIG_INTEGER + ") as prior_order";
			const A_key_boolean = ["is_data"];

			for (var key of Object.values(A_key_boolean)) {
				sql += ",case when coalesce(" + key + ",false)" + " then 1 else 0 end as " + key;
			}

			sql += " from plan_tb";
			sql += " where carid=" + G_CARRIER_DOCOMO;
			sql += " and viewflg=true";
			sql += ";";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_H_plan = Array();
 			if(result instanceof Array){
				for (const line of result) {
					line.fix = [line.fix];
					line.packet = Array();
					this.m_H_plan[line.id] = line;
				}
			}
		})

		new Promise(async resolve => {
			let sql = "select packetid as id,packetname as name" + ",arid,cirid,fixcharge as fix";
			sql += ",coalesce(prior_order, " + TOO_BIG_INTEGER + ") as prior_order";
			sql += " from packet_tb";
			sql += " where carid=" + G_CARRIER_DOCOMO;
			sql += " and viewflg=true";
			sql += ";";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_H_packet = Array();
 			if(result instanceof Array){
				for (const line of result) {
					line.fix = [line.fix];
					this.m_H_packet[line.id] = line;
				}
			}
		})

		new Promise(async resolve => {
			const sql = "select packetid,fixcharge from packet_basic_tb;";
			var result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_H_packet = Array();
 			if(result instanceof Array){
				for (const line of result) {
					var packetid = line.packetid;
					var fix = line.fixcharge;
					if (undefined !== this.m_H_packet[packetid]) this.m_H_packet[packetid].fix.push(fix);
				}
			}
		})

		new Promise(async resolve => {
			let sql = "select arid from area_tb";
			sql += " where";
			sql += " (";
			sql += " carid=" + G_CARRIER_DOCOMO;
			sql += " and arid!=" + G_AREA_DOCOMO_UNKNOWN;
			sql += ")";
			sql += " or arid=" + ARID_COMMON;
			sql += ";";
			const result = await this.m_db.getAll(sql);
			resolve(result);
		}).then(result => {
			this.m_A_arid = Array();
 			if(result instanceof Array){
				for (const line of result) this.m_A_arid.push(line[0]);
			}
		})

		new Promise(async resolve => {
			let sql = "select cirid from circuit_tb";
			sql += " where carid=" + G_CARRIER_DOCOMO;
			sql += " and cirid!=" + G_CIRCUIT_DOCOMO_OTHER;
			sql += ";";
			const result = await this.m_db.getAll(sql);
			resolve(result);
		}).then(result => {
			this.m_A_cirid = Array();
 			if(result instanceof Array){
				for (const line of result) this.m_A_cirid.push(line[0]);
			}
		})

		new Promise(async resolve => {
			let sql = "select arid,cirid,packetid from packet_tb";
			sql += " where carid=1";
			sql += " and cirid in(" + G_CIRCUIT_FOMA + "," + G_CIRCUIT_DOCOMO_XI + ")";
			sql += " and is_empty=true";
			sql += ";";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_H_packet_zero = Array();
 			if(result instanceof Array){
				for (const line of result) this.m_H_packet_zero[line.arid + "," + line.cirid] = line.packetid;
			}
		})

		new Promise(async resolve => {
			const sql = "select planid from plan_tb" + " where coalesce(is_prior,false)=true;";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_A_plan_prior = Array();
 			if(result instanceof Array){
				for (const line of result) this.m_A_plan_prior.push(line.planid);
			}
		})

		new Promise(async resolve => {
			const sql = "select planid,buyselid from plan_tb;";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			this.m_H_buyselid = Array();
 			if(result instanceof Array){
				for (const line of result) this.m_H_buyselid[line.planid] = line.buyselid;
			}
		})

		new Promise(async resolve => {
			const sql = "select planid,planname,buyselid,cirid,arid" + " from plan_tb" + " where carid=" + G_CARRIER_DOCOMO + " order by arid,cirid,buyselid" + ";";

			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			const H_100: any[] = Array();
			const H_all: any[] = Array();
 			if(result instanceof Array){
				for (const H_line of result) {
					let name = H_line.planname;
					name = name.replace(" ", "");
					name = name.replace(" ", "");
					// name = mb_convert_kana(name, "VASK");
					name = moji(name).convert("ZEtoHE").toString();
					const key = H_line.cirid + "," + name;
		
					if (ARID_COMMON == H_line.arid) {
						if (!(undefined !== H_100[key])) H_100[key] = Array();
						H_100[key][H_line.planid] = H_line.buyselid;
					} else {
						if (!(undefined !== H_all[key])) H_all[key] = Array();
						H_all[key][H_line.planid] = H_line.buyselid;
					}
				}
		
				this.m_H_planid_100 = Array();
		
				for (const key in H_all) {
					const H_planid: any[] = H_all[key];
					if (!(undefined !== H_100[key])) continue;
		
					for (const planid in H_planid) {
						let buyselid: any = H_planid[planid];
						
						if (1 == H_100[key].length) //地域会社共通に該当するプランが一個だけなのでそれを選ぶ
						{
							const _tmp_0 = H_100[key];
							for (var k in _tmp_0) {
								var v = _tmp_0[k];
								this.m_H_planid_100[planid] = k;
								break;
							}
						} else //地域会社共通に該当するプランが複数ある
						{
							let is_match = false;
							if (!buyselid.length) buyselid = 1;
							{
								let _tmp_1 = H_100[key];
	
								for (var k in _tmp_1) {
									var v = _tmp_1[k];
	
									if (buyselid == v) {
										is_match = true;
										this.m_H_planid_100[planid] = k;
										break;
									}
								}
							}
	
							if (!is_match) {
								{
									let _tmp_2 = H_100[key];
	
									for (const k in _tmp_2) {
										const v = _tmp_2[k];
										this.m_H_planid_100[planid] = k;
										break;
									}
								}
							}
						}
					}
				}
			}
		})

		new Promise(async resolve => {
			const sql = "select packetid,packetname,cirid,arid" + " from packet_tb" + " where carid=" + G_CARRIER_DOCOMO + " order by arid,cirid" + ";";
			const result = await this.m_db.getHash(sql);
			resolve(result);
		}).then(result => {
			const H_100 = Array();
			const H_all = Array();
 			if(result instanceof Array){
				for (const H_line of result) {
					let name = H_line.packetname;
					name = name.replace(" ", "");
					name = name.replace(" ", "");
					// name = mb_convert_kana(name, "VASK");
					name = 	name = moji(name).convert("HKtoZK").toString();
					const key = H_line.cirid + "," + name;
		
					if (ARID_COMMON == H_line.arid) {
						H_100[key] = H_line.packetid;
					} else {
						if (!(undefined !== H_all[key])) H_all[key] = Array();
						H_all[key].push(H_line.packetid);
					}
				}
		
				this.m_H_packetid_100 = Array();
		
				for (const key in H_all) {
					var A_packetid = H_all[key];
					if (!(undefined !== H_100[key])) continue;
		
					for (const packetid of A_packetid) this.m_H_packetid_100[packetid] = H_100[key];
				}
			}
		})
	}

	set_shop_arid(shop_arid: string) {
		this.m_shop_arid = shop_arid;
	}

	set_v3(is_v3: string) {
		this.m_is_v3 = is_v3;
	}

	execute(telno: string, A_detail: string, H_last: string, 
		H_result: { 
			prtelno: undefined; 
			cirid: undefined; 
			arid: undefined; 
			planid: undefined; 
			planalert: boolean; 
			packetid: undefined; 
			packetalert: boolean; }, 
		H_errmsg: { 
			prtelno: any[]; 
			cirid: any[]; arid: 
			any[]; planid: any[]; 
			packetid: any[]; 
		}) 
	{
		H_result = {
			prtelno: undefined,
			cirid: undefined,
			arid: undefined,
			planid: undefined,
			planalert: false,
			packetid: undefined,
			packetalert: false
		};
		H_errmsg = {
			prtelno: Array(),
			cirid: Array(),
			arid: Array(),
			planid: Array(),
			packetid: Array()
		};
		return this.do_execute(telno, A_detail, H_last, H_result, H_errmsg);
	}

	do_execute(telno: string, A_detail: string, H_last: string, 
		H_result: { 
			prtelno: undefined; 
			cirid: undefined; 
			arid: undefined; 
			planid: undefined; 
			planalert: boolean; 
			packetid: undefined; 
			packetalert: boolean; }, 
		H_errmsg: { 
			prtelno: any[]; 
			cirid: any[]; arid: 
			any[]; planid: any[]; 
			packetid: any[]; 
			})  //明細からの地域会社・回線種別の絞り込み
	{
		const A_arid = this.m_A_arid;
		const A_cirid = this.m_A_cirid;
		const A_plan: any = Array();
		const A_packet: any = Array();
		const prtelno = "";
		if (!this.pass1(telno, A_detail, A_arid, A_cirid, H_errmsg)) return false;
		if (!this.pass2(telno, A_detail, A_plan, A_packet, H_errmsg)) return false;
		if (!this.pass3(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_errmsg)) return false;
		if (!this.pass4(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_result, H_errmsg)) return false;
		return true;
	}

	setArray(A_tgt: string | any[], value: any, def: undefined) {
		if (-1 !== A_tgt.indexOf(value)) {
			A_tgt = [value];
		} else {
			if (undefined !== def) A_tgt = [def];
		}
	}

	pass1(telno: string, A_detail: string, A_arid: any[], A_cirid: any[], H_errmsg: any) //1.1)PHSの処理は除去した
	{
		return true;
	}

	pass2(telno: string, A_detail: any, A_plan: string[], A_packet: string[], H_errmsg: any) {
		for (var H_line of A_detail) //プラン候補の追加
		{
			var code = H_line.code;
			var charge = H_line.charge;

			if (0 == code.localeCompare("001")) {
				{
					let _tmp_3 = this.m_H_plan;

					for (var id in _tmp_3) {
						var H_info = _tmp_3[id];
						if (!(-1 !== H_info.fix.indexOf(charge))) continue;
						if (!(-1 !== A_plan.indexOf(id))) A_plan.push(id);
					}
				}
			}

			if (0 == code.localeCompare("02I") || 0 == code.localeCompare("200")) {
				{
					let _tmp_4 = this.m_H_packet;

					for (var id in _tmp_4) {
						var H_info = _tmp_4[id];
						if (!(-1 !== H_info.fix.indexOf(charge))) continue;
						if (!(-1 !== A_packet.indexOf(id))) A_packet.push(id);
					}
				}
			}
		}

		return true;
	}

	pass3(telno: string, A_detail: any, H_last: any, A_arid: any, A_cirid: any, A_plan: any, A_packet: any, prteln: string, H_errmsg: any) //親番号の取り出し
	//回線で絞り込む(地域では絞り込まない)
	//回線で絞り込む
	{
		var A_prtelno = Array();

		for (var H_line of A_detail) {
			if (0 == H_line.prtelno.length) continue;
			var pr = H_line.prtelno;
			if (!(-1 !== A_prtelno.indexOf(pr))) A_prtelno.push(pr);
		}

		// if (A_prtelno.length) prtelno = A_prtelno[0];

		if (1 < A_arid.length) {
			if (-1 !== A_arid.indexOf(H_last.arid)) A_arid = [H_last.arid];
		}

		if (1 < A_arid.length) //総務省データの消滅により、この処理は削除した
			//ショップの地域会社があれば、それを優先する
			//ただしV3型顧客なら地域会社共通とする
			{
				if (!this.m_is_v3) {
					if (undefined !== this.m_shop_arid && -1 !== A_arid.indexOf(this.m_shop_arid)) A_arid = [this.m_shop_arid];
				} else {
					A_arid = [ARID_COMMON];
				}
			}

		if (1 != A_arid.length) {
			A_arid = [ARID_COMMON];
		}

		if (1 < A_cirid.length) {
			var A_temp = Array();

			for (let id of A_plan) {
				var H_info = this.m_H_plan[id];
				if (!(-1 !== A_temp.indexOf(H_info.cirid))) A_temp.push(H_info.cirid);
			}

			if (A_temp.length) A_cirid = A_temp;
			A_temp = Array();

			for (let id of A_packet) {
				H_info = this.m_H_packet[id];
				if (!(-1 !== A_temp.indexOf(H_info.cirid))) A_temp.push(H_info.cirid);
			}

			if (A_temp.length) A_cirid = A_temp;
		}

		if (1 < A_cirid.length) {
			if (-1 !== A_cirid.indexOf(H_last.cirid)) A_cirid = [H_last.cirid];
		}

		if (0 == A_cirid.length) {
			H_errmsg.cirid.push("回線種別の候補存在せず");
		} else if (1 < A_cirid.length) {
			H_errmsg.cirid.push("回線種別の候補が複数存在する");
			A_cirid = Array();
		}

		if (0 == A_cirid.length) A_plan = Array();
		A_temp = Array();

		for (let id of A_plan) {
			H_info = this.m_H_plan[id];
			if (!(-1 !== A_cirid.indexOf(H_info.cirid))) continue;
			A_temp.push(id);
		}

		A_plan = A_temp;

		if (1 < A_plan.length) {
			if (-1 !== A_plan.indexOf(H_last.planid)) //前月のプランと同じ名前で地域会社共通にあればそちらにする
				{
					var last = H_last.planid;
					if (undefined !== this.m_H_planid_100[last]) last = this.m_H_planid_100[last];
					A_plan = [last];
				}
		}

		if (1 < A_plan.length) {
			A_temp = Array();

			for (var id of A_plan) {
				if (undefined !== this.m_H_plan[id] && ARID_COMMON == this.m_H_plan[id].arid) A_temp.push(id);
			}

			if (A_temp.length) A_plan = A_temp;
		}

		if (1 < A_plan.length) {
			var cur_prior = undefined;
			A_temp = Array();

			for (var id of A_plan) {
				var tgt_prior = this.m_H_plan[id].prior_order;

				if (!(undefined !== cur_prior) || tgt_prior < cur_prior) {
					cur_prior = tgt_prior;
					A_temp = Array();
				}

				if (tgt_prior == cur_prior) A_temp.push(id);
			}

			A_plan = A_temp;
		}

		if (1 < A_plan.length) {
			A_temp = Array();

			for (var id of this.m_A_plan_prior) if (-1 !== A_plan.indexOf(id)) A_temp.push(id);

			if (A_temp.length) A_plan = A_temp;
		}

		if (0 == A_plan.length) {
			H_errmsg.planid.push("料金プランの候補存在せず");
		} else if (1 < A_plan.length) {
			H_errmsg.planid.push("料金プランの候補が複数存在する");
			A_plan = Array();
		}

		if (0 == A_cirid.length) A_packet = Array();
		A_temp = Array();

		for (let id of A_packet) {
			H_info = this.m_H_packet[id];
			if (!(-1 !== A_cirid.indexOf(H_info.cirid))) continue;
			A_temp.push(id);
		}

		A_packet = A_temp;

		if (1 < A_packet.length) {
			if (-1 !== A_packet.indexOf(H_last.packetid)) //前月のパケットと同じ名前で地域会社共通にあればそちらにする
				{
					last = H_last.packetid;
					if (undefined !== this.m_H_packetid_100[last]) last = this.m_H_packetid_100[last];
					A_packet = [last];
				}
		}

		if (1 < A_packet.length) {
			A_temp = Array();

			for (var id of A_packet) {
				if (undefined !== this.m_H_packet[id] && ARID_COMMON == this.m_H_packet[id].arid) A_temp.push(id);
			}

			if (A_temp.length) A_packet = A_temp;
		}

		if (1 == A_plan.length && undefined !== this.m_H_plan[A_plan[0]] && this.m_H_plan[A_plan[0]].packet.length) {
			var A_rel = this.m_H_plan[A_plan[0]].packet;
			A_temp = Array();

			for (var id of A_packet) {
				if (-1 !== A_rel.indexOf(id)) A_temp.push(id);
			}

			A_packet = A_temp;
		}

		if (1 < A_packet.length) {
			cur_prior = undefined;
			A_temp = Array();

			for (var id of A_packet) {
				tgt_prior = this.m_H_packet[id].prior_order;

				if (!(undefined !== cur_prior) || tgt_prior < cur_prior) {
					cur_prior = tgt_prior;
					A_temp = Array();
				}

				if (tgt_prior == cur_prior) A_temp.push(id);
			}

			A_packet = A_temp;
		}

		if (1 < A_packet.length || 0 == A_packet.length) //明細にパケット定額通信料が無ければ無しとする
			{
				if (1 == A_cirid.length && 1 == A_arid.length && (G_CIRCUIT_FOMA == A_cirid[0] || G_CIRCUIT_DOCOMO_XI == A_cirid[0])) {
					var key = A_arid[0] + "," + A_cirid[0];
					var match = false;

					for (var H_line of A_detail) {
						if (0 == H_line.code.localeCompare("02I") || 0 == H_line.code.localeCompare("200")) {
							match = true;
							break;
						}
					}

					if (!match && undefined !== this.m_H_packet_zero[key]) {
						A_packet = [this.m_H_packet_zero[key]];
					}
				}
			}

		if (0 == A_packet.length) {
			if (1 == A_cirid.length && (G_CIRCUIT_FOMA == A_cirid[0] || G_CIRCUIT_DOCOMO_XI == A_cirid[0])) {
				H_errmsg.packetid.push("パケットパックの候補存在せず");
			}
		}

		if (1 < A_packet.length) {
			A_packet = Array();
			H_errmsg.packetid.push("パケットパックの候補が複数存在する");
		}

		return true;
	}

	pass4(telno: string, A_detail: string, H_last: any, A_arid: any[], A_cirid: string[], A_plan: string, A_packet: string, prtelno: string, H_result: any, H_errmsg: any) {
		H_result.prtelno = prtelno;
		if (1 == A_arid.length) H_result.arid = A_arid[0];
		if (1 == A_cirid.length) H_result.cirid = A_cirid[0];

		if (1 == A_plan.length) {
			H_result.planid = A_plan[0];
			if (H_last.planid.length && H_result.planid.localeCompare(H_last.planid)) H_result.planalert = true;
		}

		if (1 == A_packet.length) {
			H_result.packetid = A_packet[0];
			if (H_last.packetid.length && H_result.packetid.localeCompare(H_last.packetid)) H_result.packetalert = true;
		}

		return true;
	}

};

export class GuessDocomo extends ScriptDBAdaptor {
	m_O_core: any;
	m_pactid: any;
	m_year: any;
	m_month: any;
	getTableNo: any;
	m_O_detail: any;
	m_O_last: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_core: any) {
		super(listener, db, table_no);
		this.m_O_core = O_core;
	}

	begin(pactid: string | number, year: number, month: number) //明細の読み出し
	//前月のtel_X_tbの情報
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		var table_no = this.getTableNo(year, month);
		var sql = "select telno,code,charge,prtelno";
		sql += " from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " order by telno,detailno";
		sql += ";";
		this.m_O_detail = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_detail.query(sql);
		var last_year = year;
		var last_month = month;
		--last_month;

		if (0 == last_month) {
			last_month = 12;
			--last_year;
		}

		var last_table_no = this.getTableNo(last_year, last_month);
		sql = "select telno,arid,cirid,planid,packetid";
		sql += " from tel_" + last_table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " order by telno";
		sql += ";";
		this.m_O_last = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_last.query(sql);
		return true;
	}

	end() {
		if (undefined !== this.m_O_detail) {
			this.m_O_detail.free();
			delete this.m_O_detail;
		}

		if (undefined !== this.m_O_last) {
			this.m_O_last.free();
			delete this.m_O_last;
		}

		return true;
	}

	execute(telno: string, H_result: any, H_errmsg: string) //DBからの値の取り出し
	{
		var line;
		var A_detail: any = Array();

		while (line = this.m_O_detail.fetch(telno)) A_detail.push(line);

		var H_last = undefined;

		while (line = this.m_O_last.fetch(telno)) if (!(undefined !== H_last)) H_last = line;

		return this.m_O_core.execute(telno, A_detail, H_last, H_result, H_errmsg);
	}

	format(H_errmsg: any) {
		var rval = "";
		var delim = "/";

		for (var H_line of H_errmsg) {
			for (var line of H_line) {
				if (line.length) {
					if (rval.length) rval += delim;
					rval += line;
				}
			}
		}

		return rval;
	}

};

export class GuessDocomoTel extends ScriptDBAdaptor {
	m_O_core: any;
	m_quote: boolean | undefined;
	m_delim: string | undefined;
	m_db: any;
	getTableNo: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo) {
		super(listener, db, table_no);
		this.m_O_core = new GuessDocomoCore(listener, db, table_no);
		this.m_quote = false;
		this.m_delim = "\t";
	}

	execute(pactid: number, year: number, month: number, pre: string, use_tel: boolean, use_tel_X: boolean, csv_name: string = "") //ショップの地域会社を読み出す
	{
		var shop_arid = undefined;
		var sql = "select postidparent from post_relation_tb";
		sql += " where pactid=" + pactid;
		sql += " and level=0";
		sql += " limit 1";
		sql += ";";
		var top_postid = this.m_db.getOne(sql);

		if (undefined !== top_postid) {
			sql = "select shopid from shop_relation_tb";
			sql += " where pactid=" + pactid;
			sql += " and postid=" + top_postid;
			sql += " and carid=" + G_CARRIER_DOCOMO;
			sql += " limit 1";
			sql += ";";
			var shopid = this.m_db.getOne(sql);

			if (undefined !== shopid) {
				sql = "select arid from shop_carrier_tb";
				sql += " where shopid=" + shopid;
				sql += " and carid=" + G_CARRIER_DOCOMO;
				sql += " limit 1";
				sql += ";";
				shop_arid = this.m_db.getOne(sql);

				if (undefined !== shop_arid) {
					this.putError(G_SCRIPT_INFO, "ショップ地域会社" + shop_arid + "/" + shopid);
					this.m_O_core.set_shop_arid(shop_arid);
				}
			}
		}

		sql = "select count(*) from fnc_relation_tb";
		sql += " where fncid=" + AUTH_V3;
		sql += " and pactid=" + pactid;
		sql += ";";
		var is_v3 = 0 < this.m_db.getOne(sql);
		this.putError(G_SCRIPT_INFO, (is_v3 ? "V3型顧客" : "V2型顧客") + pactid);
		this.m_O_core.set_v3(is_v3);

		if (use_tel) {
			if (!this.delete(pactid, year, month, pre, true)) {
				this.putError(G_SCRIPT_WARNING, "tel_tbの電話削除に失敗");
				return false;
			}

			if (!this.do_execute(pactid, year, month, pre, true, "","")) {
				this.putError(G_SCRIPT_WARNING, "tel_tbへの追加に失敗");
				return false;
			}
		}

		if (use_tel_X) {
			if (!this.delete(pactid, year, month, pre, false)) {
				this.putError(G_SCRIPT_WARNING, "tel_X_tbの電話削除に失敗");
				return false;
			}

			if (!this.do_execute(pactid, year, month, pre, false, csv_name,"")) {
				this.putError(G_SCRIPT_WARNING, "tel_X_tbへの追加に失敗");
				return false;
			}
		}

		this.m_O_core.set_shop_arid(undefined);
		this.m_O_core.set_v3(false);
		return true;
	}

	delete(pactid: number, year: number, month: number, pre: string, is_tel: boolean) //手動入力フラグは常にtel_X_tbを見る
	{
		var table_no = this.getTableNo(year, month);
		var tel_tb = is_tel ? "tel_tb" : "tel_" + table_no + "_tb";
		var sqlwhere = " from " + tel_tb;
		sqlwhere += " where pactid=" + pactid;
		sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
		sqlwhere += " and telno not in (";
		sqlwhere += " select telno from tel_" + table_no + "_tb";
		sqlwhere += " where pactid=" + pactid;
		sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
		sqlwhere += " and coalesce(handflg,false)=true";
		sqlwhere += " group by telno";
		sqlwhere += ")";
		var fname = pre + tel_tb + ".0.delete";
		if (!this.m_db.backup(fname, "select *" + sqlwhere + ";")) return false;
		var sql = "delete";
		sql += sqlwhere;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	do_execute(pactid: number, year: number, month: number, pre: string, is_tel: boolean, csv_name: string,H_errmsg: any) //CSVファイル作成
	{
		var fh = false;

		if (csv_name.length) {
			fh = fs.openSync(csv_name, "at");

			if (false === fh) {
				this.putError(G_SCRIPT_WARNING, "CSV出力:ファイル作成失敗:" + csv_name);
				return false;
			}
		}

		var table_no = this.getTableNo(year, month);
		var tel_tb = is_tel ? "tel_tb" : "tel_" + table_no + "_tb";
		var tel_handflg_tb = "tel_" + table_no + "_tb";
		var sql = "select * from " + tel_tb;
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += ";";
		var result = this.m_db.getHash(sql);
		var H_tel_hand: any = Array();

		for (var line of result) H_tel_hand["T" + line.telno] = line;

		var A_delete_hand = Array();
		sql = "select postidparent from";
		if (is_tel) sql += " post_relation_tb";else sql += " post_relation_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and level=0";
		sql += " limit 1";
		sql += ";";
		result = this.m_db.getAll(sql);

		if (0 == result.length) {
			this.putError(G_SCRIPT_WARNING, "電話追加:トップの部署がない");
			if (csv_name.length) fs.closeSync(fh);
			return false;
		}

		var top_postid = result[0][0];
		sql = "select telno from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
		var A_telno = this.m_db.getAll(sql);
		var O_ins: any = new TableInserter(this.m_listener, this.m_db, pre + tel_tb + ".insert", "");

		if (!O_ins.begin(tel_tb)) {
			this.putError(G_SCRIPT_WARNING, "電話追加:追加初期化失敗");
			if (csv_name.length) fs.closeSync(fh);
			return false;
		}

		O_ins.setConst({
			pactid: pactid,
			postid: top_postid,
			carid: G_CARRIER_DOCOMO,
			recdate: "now()",
			fixdate: "now()",
			handflg: "false"
		});
		var O_func: any = new GuessDocomo(this.m_listener, this.m_db, this.m_table_no, this.m_O_core);

		if (!O_func.begin(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, "電話追加:予測型初期化失敗");
			if (csv_name.length) fs.closeSync(fh);
			return false;
		}

		var status = true;

		for (var line of A_telno) //その電話番号で手動入力電話があるか
		{
			var telno = line[0];
			var H_result;
			if (!O_func.execute(telno, H_result, H_errmsg)) {
				status = false;
				this.putError(G_SCRIPT_WARNING, "電話追加:処理失敗:" + telno);
				break;
			}

			var arid = H_result.arid;
			if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;
			var cirid = H_result.cirid;
			if (0 == cirid.length) cirid = G_CIRCUIT_DOCOMO_OTHER;
			var telno_view = telno;
			if (11 == telno_view.length) telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7, 4);
			var H_ins: any = {
				telno: telno,
				telno_view: telno_view,
				arid: arid,
				cirid: cirid,
				planid: H_result.planid,
				planalert: H_result.planalert ? "1" : "0",
				packetid: H_result.packetid,
				packetalert: H_result.packetalert ? "1" : "0"
			};

			if (undefined !== H_tel_hand["T" + telno]) //手動入力電話があれば、重複分を処理する
				//手動入力電話から不足情報を補う
				//手動入力電話の削除リストに追加する
				{
					var H_cur = H_tel_hand["T" + telno];

					if (is_tel) //tel_tbの場合、手入力を優先する
						{
							if (H_cur.arid.localeCompare(H_ins.arid) || H_cur.cirid.localeCompare(H_ins.cirid)) //地域会社・回線種別が異なれば、手動入力値とする
								{
									var A_needle = ["arid", "cirid", "planid", "planalert", "packetid", "packetalert"];

									for (var key of A_needle) H_ins[key] = H_cur[key];
								} else //地域会社・回線種別が同一なら、
								//手動入力値が不明の場合のみクランプ値を使用する
								{
									A_needle = ["planid", "planalert", "packetid", "packetalert"];

									for (var key of A_needle) if (0 == H_ins[key].length) H_ins[key] = H_cur[key];
								}
						} else //tel_X_tbの場合、手入力よりもクランプを優先する
						{
							if ( H_cur.arid.localeCompare(H_ins.arid) || H_cur.cirid.localeCompare(H_ins.cirid)) //地域会社・回線種別が異なれば、クランプ値とする
								//なので何もしない
								{} else //地域会社・回線種別が同一なら、
								//手動入力値が不明の場合のみクランプ値を使用する
								{
									A_needle = ["planid", "planalert", "packetid", "packetalert"];

									for (var key of Object.values(A_needle)) if (0 == H_ins[key].length) H_ins[key] = H_cur[key];
								}
						}

					var A_skip = ["telno", "fixdate", "arid", "cirid", "planid", "planalert", "packetid", "packetalert", "handflg", "buyselid"];

					for (var key in H_cur) {
						var value = H_cur[key];
						if (-1 !== A_skip.indexOf(key)) continue;
						if (!(undefined !== H_ins[key])) H_ins[key] = value;
					}

					A_delete_hand.push("T" + telno);
				}

			if (undefined !== this.m_O_core.m_H_buyselid[H_result.planid]) H_ins.buyselid = this.m_O_core.m_H_buyselid[H_result.planid];

			if (!O_ins.insert(H_ins)) {
				this.putError(G_SCRIPT_WARNING, "電話追加:電話追加失敗:" + telno);
				if (csv_name.length)  fs.closeSync(fh);
				return false;
			}

			if (csv_name.length) {
				var A_result = [pactid, H_result.prtelno, telno, cirid, arid, H_result.planid, H_result.packetid, O_func.format(H_errmsg), tel_tb];

				for (var cnt = 0; cnt < A_result.length; ++cnt) {
					const iconv = new Iconv('SJIS-win', 'UTF-8');
					var msg = iconv.convert(A_result[cnt]);
					if (this.m_quote) msg = "\"" + msg + "\"";
					A_result[cnt] = msg;
				}

				fs.writeSync(fh, A_result.join(this.m_delim) + "\r\n");
			}
		}

		if (A_delete_hand.length) {
			var sqlwhere = " from " + tel_tb;
			sqlwhere += " where pactid=" + pactid;
			sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
			sqlwhere += " and telno in (";
			var comma = false;

			for (var telno of Object.values(A_delete_hand)) {
				if (comma) sqlwhere += ",";
				comma = true;
				telno = telno.substr(1);
				sqlwhere += "'" + telno + "'";
			}

			sqlwhere += ")";
			var fname = pre + tel_tb + ".1.delete";
			if (!this.m_db.backup(fname, "select *" + sqlwhere + ";")) return false;
			sql = "delete";
			sql += sqlwhere;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		if (!O_func.end()) {
			this.putError(G_SCRIPT_WARNING, "電話追加:予測型終了処理失敗");
			if (csv_name.length)  fs.closeSync(fh);
			return false;
		}
		O_func = undefined;
		// delete O_func;

		if (!O_ins.end()) {
			this.putError(G_SCRIPT_WARNING, "電話追加:追加終了失敗");
			if (csv_name.length)  fs.closeSync(fh);
			return false;
		}
		O_ins = undefined;
		// delete O_ins;
		if (csv_name.length)  fs.closeSync(fh);
		return status;
	}

};


export class GuessDocomoCSV extends ScriptDBAdaptor {
	m_db: any;
	m_quote: boolean;
	m_delim: string;
	m_fname: any;
	getTableNo: any;
	m_O_core: GuessDocomoCore;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, fname: string) {
		super(listener, db, table_no);
		this.m_quote = false;
		this.m_delim = "\t";
		this.m_O_core = new GuessDocomoCore(listener, db, table_no);
		this.m_fname = fname;
	}

	execute(pactid: number, year: number, month: number,H_errmsg?: string) //処理すべき電話番号のリストを作る
	//CSV出力を行う
	{
		var sql = "select telno";
		sql += " from tel_details_" + this.getTableNo(year, month) + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and telno in (";
		sql += " select telno from tel_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and (";
		sql += " coalesce(planalert,'')='1' or coalesce(packetalert,'')='1'";
		sql += " )";
		sql += " )";
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
		var A_telno = this.m_db.getAll(sql);
		var O_func: any = new GuessDocomo(this.m_listener, this.m_db, this.m_table_no, this.m_O_core);

		if (!O_func.begin(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, "CSV出力:予測型初期化失敗");
			return false;
		}

		var fh = fs.readFileSync(this.m_fname, "at");

		if (false === fh) {
			this.putError(G_SCRIPT_WARNING, "CSV出力:ファイル作成失敗:" + this.m_fname);
			return false;
		}

		var status = true;
		var H_result;

		for (var line of A_telno) {
			var telno = line[0];

			if (!O_func.execute(telno, H_result, H_errmsg)) {
				status = false;
				this.putError(G_SCRIPT_WARNING, "CSV出力:処理失敗:" + telno);
				break;
			}

			var arid = H_result.arid;
			if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;
			var cirid = H_result.cirid;
			if (0 == cirid.length) cirid = G_CIRCUIT_DOCOMO_OTHER;
			var A_result = [pactid, H_result.prtelno, telno, cirid, arid, H_result.planid, H_result.packetid, O_func.format(H_errmsg), "tel_tb"];

			for (var cnt = 0; cnt < A_result.length; ++cnt) {
				const iconv2 = new Iconv('SJIS-win', 'UTF-8');
				var msg = iconv2.convert(A_result[cnt]);
				if (this.m_quote) msg = "\"" + msg + "\"";
				A_result[cnt] = msg;
			}

			fs.writeSync(fh, A_result.join(this.m_delim) + "\r\n");
		}

		fs.closeSync(fh);

		if (!O_func.end()) {
			this.putError(G_SCRIPT_WARNING, "CSV出力:予測型終了処理失敗");
			return false;
		}
		O_func = undefined;
		// delete O_func;
		return status;
	}

};