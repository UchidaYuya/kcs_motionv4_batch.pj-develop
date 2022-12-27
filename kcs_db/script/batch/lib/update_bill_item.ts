//機能：購買・コピーの請求一覧を作成する(要素毎)電話のtel_bill_X_tbに相当する
//
//作成：森原


import TableNo, {ScriptDB, ScriptDBAdaptor, TableInserter} from "./script_db";
import {ProcessBase, ProcessDefault, ProcessLog} from "./process_base";
import { G_SCRIPT_BEGIN, G_SCRIPT_ERROR, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase } from "./script_log";
import { DB_FETCHMODE_ASSOC } from "../../../class/MtDBUtil";
import { PGPOOL_NO_INSERT_LOCK } from "../../../conf/batch_setting";

export class UpdateBillName extends ScriptDBAdaptor {
	m_H_setting: any;
	m_H_name: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, exit_on_error = true ) {
		super(listener, db, table_no);
		this.m_H_name = Array();
		this.m_H_setting = Array();
	}

	getName(key: string, table_no: string) {
		var name = "";

		if (undefined !== this.m_H_name[key]) {
			name = this.m_H_name[key];
		} else {
			this.putError(G_SCRIPT_ERROR, "内部エラー:未定義キーワード(DB)/" + key);
		}

		if (table_no.length) name = name.replace("%X", table_no);else name = name.replace("_%X", "");
		return name;
	}

	getSetting(key: string) {
		if (undefined !== this.m_H_setting[key]) {
			return this.m_H_setting[key];
		} else {
			this.putError(G_SCRIPT_ERROR, "内部エラー:未定義キーワード(設定)/" + key);
		}
	}

	getAdd(idx: number) {
		var add_line = this.getName("add_column", "");
		if (!add_line.length) return Array();
		var A_line = add_line.split("/");
		var A_result = Array();

		for (var line of Object.values(A_line)) {
			var A_temp = line.split(",");
			A_result.push(A_temp[idx]);
		}

		return A_result;
	}

	initPurchase() {
		this.m_H_name = {
			history: "purchase_history_tb",
			history_coid: "purchcoid",
			details: "purchase_details_%X_tb",
			details_coid: "purchcoid",
			details_id: "purchid",
			bill: "purchase_bill_%X_tb",
			bill_coid: "purchcoid",
			bill_id: "purchid",
			kamoku: "purchase_kamoku_tb",
			utiwake: "purchase_utiwake_tb",
			utiwake_coid: "purchcoid",
			rel: "purchase_kamoku_rel_utiwake_tb",
			rel_coid: "purchcoid",
			xxx: "purchase_%X_tb",
			xxx_coid: "purchcoid",
			xxx_key: "purchid",
			co: "purchase_co_tb",
			co_coid: "purchcoid",
			postbill: "purchase_post_bill_%X_tb",
			postbill_coid: "purchcoid",
			postbill_num: "purchid_num",
			add_column: "itemsum,itemsum,itemsum"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initCopy() {
		this.m_H_name = {
			history: "copy_history_tb",
			history_coid: "copycoid",
			details: "copy_details_%X_tb",
			details_coid: "copycoid",
			details_id: "copyid",
			bill: "copy_bill_%X_tb",
			bill_coid: "copycoid",
			bill_id: "copyid",
			kamoku: "copy_kamoku_tb",
			utiwake: "copy_utiwake_tb",
			utiwake_coid: "copycoid",
			rel: "copy_kamoku_rel_utiwake_tb",
			rel_coid: "copycoid",
			xxx: "copy_%X_tb",
			xxx_coid: "copycoid",
			xxx_key: "copyid",
			co: "copy_co_tb",
			co_coid: "copycoid",
			postbill: "copy_post_bill_%X_tb",
			postbill_coid: "copycoid",
			postbill_num: "copyid_num",
			add_column: "printcount,printcount,printcount"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initTransit() {
		this.m_H_name = {
			history: "transit_history_tb",
			history_coid: "trancoid",
			details: "transit_details_%X_tb",
			details_coid: "trancoid",
			details_id: "tranid",
			bill: "transit_bill_%X_tb",
			bill_coid: "trancoid",
			bill_id: "tranid",
			kamoku: "transit_kamoku_tb",
			utiwake: "transit_utiwake_tb",
			utiwake_coid: "trancoid",
			rel: "transit_kamoku_rel_utiwake_tb",
			rel_coid: "trancoid",
			xxx: "transit_%X_tb",
			xxx_coid: "trancoid",
			xxx_key: "tranid",
			co: "transit_co_tb",
			co_coid: "trancoid",
			postbill: "transit_post_bill_%X_tb",
			postbill_coid: "trancoid",
			postbill_num: "tranid_num",
			add_column: "weight,weight,weight/sendcount,sendcount,sendcount"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initEv() {
		this.m_H_name = {
			history: "ev_bill_history_tb",
			history_coid: "evcoid",
			details: "ev_details_%X_tb",
			details_coid: "evcoid",
			details_id: "evid",
			bill: "ev_bill_%X_tb",
			bill_coid: "evcoid",
			bill_id: "evid",
			kamoku: "ev_kamoku_tb",
			utiwake: "ev_utiwake_tb",
			utiwake_coid: "evcoid",
			rel: "ev_kamoku_rel_utiwake_tb",
			rel_coid: "evcoid",
			xxx: "ev_%X_tb",
			xxx_coid: "evcoid",
			xxx_key: "evid",
			co: "ev_co_tb",
			co_coid: "evcoid",
			postbill: "ev_post_bill_%X_tb",
			postbill_coid: "evcoid",
			postbill_num: "evid_num",
			add_column: ""
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: -1,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: false,
			is_dummy: false
		};
	}

};

export class UpdateBillHistory extends ScriptDBAdaptor {
	m_O_name: UpdateBillName;
	m_procname: string;
	m_is_recalc: boolean;
	getname: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_name: UpdateBillName, procname: string, is_recalc: boolean) {
		super(listener, db, table_no);
		this.m_O_name = O_name;
		this.m_procname = procname;
		this.m_is_recalc = is_recalc;
	}

	getName(key: string) //テーブルNoは付けない
	{
		return this.m_O_name.getName(key, "");
	}

	getSetting(key: string) {
		return this.m_O_name.getSetting(key);
	}

	insert(pactid: string, year: string, month: string) {
		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("history");
		sql += "(pactid,year,month";
		sql += ",username,recdate,status," + this.getName("history_coid") + ")values";
		sql += "(" + this.m_db.escape(pactid);
		sql += "," + this.m_db.escape(year);
		sql += "," + this.m_db.escape(month);
		sql += ",'" + this.m_db.escape(this.m_procname) + "'";
		sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
		sql += ",'1'," + this.getSetting("coid_all") + ")";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	update(pactid: any, year: any, month: any, is_fail: boolean) {
		var sql = "";

		if (is_fail) //処理に失敗した
			{
				if (this.m_is_recalc) //再計算なら、計算中を計算要求に戻す
					{
						sql += "update " + this.getname("history") + " set status='0'";
					} else //計算要求なら、計算中フラグを削除する
					{
						sql += "delete from " + this.getname("history");
					}
			} else //処理に成功したので、計算中フラグを計算終了にする
			{
				sql += "update " + this.getname("history");

				if (this.m_is_recalc) {
					sql += " set status='2'";
				} else {
					sql += " set status='2C'";
				}
			}

		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(year);
		sql += " and month=" + this.m_db.escape(month);
		sql += " and status='1'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	getLimit() {
// 2022cvt_015
		var sql = "select count(*) from " + this.getName("history");
		sql += " where status='0'";
		sql += ";";
		return this.m_db.getOne(sql);
	}

	start(H_status: any) {
// 2022cvt_015
		var sql = "update " + this.getname("history");
		sql += " set status='1'";
		sql += " where status='0'";
		sql += " and pactid=" + this.m_db.escape(H_status.pactid);
		sql += " and year=" + this.m_db.escape(H_status.year);
		sql += " and month=" + this.m_db.escape(H_status.month);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async get(H_status: any, idx: string, is_debugmode: boolean | undefined) {
		H_status = Array();
		let sql = "select pactid,year,month," + this.getName("history_coid") + " from " + this.getName("history");
		sql += " where status='0'";
		sql += " order by recdate,year,month,pactid";
		sql += " limit 1";

		if (is_debugmode) {
			sql += " offset " + this.m_db.escape(idx);
		}

		sql += ";";
		let param: any = await this.m_db.getHash(sql);

		if (0 == param.length) {
			return true;
		}

		param = param[0];
		H_status = {
			pactid: param.pactid,
			year: param.year,
			month: param.month
		};
		return true;
	}

};

export class UpdateBillItem extends ScriptDBAdaptor {
	m_inserter: any;
	m_kamokuid_default: string;
	m_O_name: any;
	m_kamokuid_limit: number;
	m_code_asp: any;
	m_code_asx: any;
	m_A_code_excise: any;
	m_kamokuid_excise: any;
	m_coid_all: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_name: UpdateBillName, inserter: any) {
		super(listener, db, table_no);
		this.m_inserter = inserter;
		this.m_inserter.setUnlock();
		this.m_O_name = O_name;
		this.m_A_code_excise = O_name.getSetting("A_code_excise");
		this.m_kamokuid_excise = O_name.getSetting("kamokuid_excise");
		this.m_coid_all = O_name.getSetting("coid_all");
		this.m_kamokuid_default = O_name.getSetting("kamokuid_default");
		this.m_kamokuid_limit = O_name.getSetting("kamokuid_limit");
		this.m_code_asp = O_name.getSetting("code_asp");
		this.m_code_asx = O_name.getSetting("code_asx");
	}

	getName(key: string, table_no: number) {
		return this.m_O_name.getName(key, table_no);
	}

	getTableNo(year: number, month: number) {
		if (0 == year || 0 == month) return "";
		return super.getTableNo(year, month);
	}

	async delete(pactid: number, year: number, month: number, fname: string) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from " + this.getName("bill", table_no) + " where pactid=" + this.escape(pactid);

		if (fname.length) {
			if (false == await this.m_db.backup(fname, "select *" + sqlfrom + ";")) {
				return false;
			}
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async execute(pactid: number, year: number, month: number) //この顧客の科目設定があるか確認する
	{
		var table_no = this.getTableNo(year, month);
		var sql = "select count(*) from " + this.getName("kamoku", table_no) + " where pactid=" + this.escape(pactid) + ";";
		var is_kamoku = 0 < await this.m_db.getOne(sql);
		sql = "select " + this.getName("co_coid", table_no) + " from " + this.getName("co", table_no) + " where " + this.getName("co_coid", table_no) + "!=" + this.escape(this.m_coid_all) + " order by " + this.getName("co_coid", table_no) + ";";
		var A_coid = await this.m_db.getAll(sql);

		if (false == this.m_inserter.begin(this.getName("bill", table_no))) {
			return false;
		}

		for (var A_item of A_coid) {
			var coid = A_item[0];

			if (false == this.executeCoid(pactid, coid, year, month, table_no, is_kamoku)) {
				return false;
			}
		}

		if (false == this.m_inserter.end()) {
			return false;
		}

		return true;
	}

	executeCoid(pactid: number, coid: number, year: number, month: number, table_no: number, is_kamoku: boolean) //明細を取り出す
	{
		var H_details: any = Array();

		if (false == this.getDetails(pactid, coid, table_no, H_details, is_kamoku)) {
			return false;
		}

		var A_info = Array();

		if (false == this.getInfo(pactid, coid, table_no, A_info)) {
			return false;
		}

		for (var H_info of Object.values(A_info)) //明細が存在しなければ処理しない
		{
			var id = H_info.id;

			if (false == (undefined !== H_details["T" + id])) {
				continue;
			}

			if (false == this.insert(pactid, H_info.coid, H_info.postid, year, month, table_no, id, H_details["T" + id])) {
				return false;
			}
		}

		return true;
	}

	getDetails(pactid: number, coid: number, table_no: number, H_details: any, is_kamoku: boolean) //科目明細を取り出す
	{
		H_details = Array();
		var sql = "select details_tb" + "." + this.getName("details_id", table_no) + " as id";
		sql += ",details_tb.charge as charge";
		sql += ",details_tb.code as code";
		sql += ",(case when rel_tb.kamokuid is null then " + this.m_kamokuid_default + " else rel_tb.kamokuid end) as kamokuid";
		var A_col = this.m_O_name.getAdd(0);

		for (var col of A_col) {
			sql += ",coalesce(details_tb." + col + ",0) as " + " details_tb_" + col;
		}

		sql += " from " + this.getName("details", table_no) + " as details_tb";
		sql += " left join " + this.getName("utiwake", table_no) + " as utiwake_tb";
		sql += " on details_tb.code=utiwake_tb.code";
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=utiwake_tb." + this.getName("utiwake_coid", table_no);
		sql += " left join " + this.getName("rel", table_no) + " as rel_tb";
		sql += " on details_tb.code=rel_tb.code";
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=rel_tb." + this.getName("rel_coid", table_no);

		if (is_kamoku) {
			sql += " and details_tb.pactid=rel_tb.pactid";
		} else {
			sql += " and rel_tb.pactid=0";
		}

		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=" + this.escape(coid);
		sql += " and utiwake_tb.codetype='0'";
		sql += " order by details_tb." + this.getName("details_id", table_no);
		sql += ";";
		var O_result: any = this.m_db.query(sql);
		var H_init = {
			kamoku: Array(),
			asp: 0,
			asx: 0,
			charge: 0,
			excise: 0,
			add: Array()
		};

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) {
			H_init.kamoku.push(0);
		}

		for (var col of A_col) {
			H_init.add.push(0);
		}

		while (H_line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) //新しく要素番号が出現したら、バッファを作る
		{
			var H_line;
			var id = H_line.id;
			var charge = H_line.charge;
			var code = H_line.code;
			var kamokuid = H_line.kamokuid;
			var key = "T" + id;

			if (false == (undefined !== H_details[key])) {
				H_details[key] = H_init;
			}

			if (false == (undefined !== H_details[key].kamoku[kamokuid])) {
				this.putError(G_SCRIPT_WARNING, "大きすぎる科目ID" + kamokuid);
			} else {
				H_details[key].kamoku[kamokuid] += charge;
			}

			if (0 == code.localeCompare(this.m_code_asp)) {
				H_details[key].asp += charge;
			}

			if (0 == code.localeCompare(this.m_code_asx)) {
				H_details[key].asx += charge;
			}

			if (-1 !== this.m_A_code_excise.indexOf(code) || this.m_kamokuid_excise == kamokuid) {
				H_details[key].excise += charge;
			} else {
				H_details[key].charge += charge;
			}

			for (cnt = 0; cnt < A_col.length; ++cnt) {
				var col = A_col[cnt];

				if (undefined !== H_line["details_tb_" + col]) {
					H_details[key].add[cnt] += H_line["details_tb_" + col];
				}
			}
		}

		O_result.free();
		return true;
	}

	getInfo(pactid: number, coid: number, table_no: number, A_info: any[]) {
		var sql = "select " + this.getName("xxx_key", table_no) + " as id";
		sql += ",postid";
		sql += "," + this.getName("xxx_coid", table_no) + " as coid";
		sql += " from " + this.getName("xxx", table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " and " + this.getName("xxx_coid", table_no) + "=" + this.escape(coid);
		sql += " order by coid,id";
		sql += ";";
		var result = this.m_db.getHash(sql);
		A_info = Array();

		for (var H_result of Object.values(result)) {
			A_info.push(H_result);
		}

		return true;
	}

	insert(pactid: number, coid: number, postid: number, year: number, month: number, table_no: number, id: number, H_details: { kamoku: string; charge: number; asp: number; excise: number; asx: number; add: string; }) //共通部分
	{
		var H_cur: any = Array();
		H_cur.pactid = pactid;
		H_cur.postid = postid;
		H_cur[this.getName("details_id", table_no)] = id;
		H_cur[this.getName("details_coid", table_no)] = coid;
		H_cur.recdate = "now()";

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) {
			H_cur["kamoku" + (cnt + 1)] = H_details.kamoku[cnt];
		}

		if (this.m_O_name.getSetting("is_excise")) {
			H_cur.charge = H_details.charge - H_details.asp;
			H_cur.excise = H_details.excise - H_details.asx;
		} else {
			H_cur.charge = H_details.charge - H_details.asx - H_details.asp;
		}

		H_cur.aspcharge = H_details.asp;
		H_cur.aspexcise = H_details.asx;
		var A_col = this.m_O_name.getAdd(1);

		for (cnt = 0; cnt < A_col.length; ++cnt) {
			H_cur[A_col[cnt]] = H_details.add[cnt];
		}

		this.m_inserter.insert(H_cur);
		return true;
	}

};

export class UpdateBillPost extends ScriptDBAdaptor {
	m_O_name: UpdateBillName;
	m_coid_all: any;
	m_kamokuid_limit: any;
	m_A_coid!: any[];
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_name: UpdateBillName) //すべてのキャリアIDをマスターから読み出す
	{
		super(listener, db, table_no);
		this.m_O_name = O_name;
		this.m_coid_all = O_name.getSetting("coid_all");
		this.m_kamokuid_limit = O_name.getSetting("kamokuid_limit");

		new Promise(async resolve => {
			let sql = "select " + this.getName("co_coid", "") + " from " + this.getName("co", "") + " order by " + this.getName("co_coid", "");
			sql += ";";
			const result = await this.m_db.getAll(sql);
			resolve(result);
		}).then(result => {
			this.m_A_coid = Array();
 			if(result instanceof Array){
				for (var line of result) {
					if (this.m_coid_all != line[0]) {
						this.m_A_coid.push(line[0]);
					}
				}
			}
		})
	}

	getName(key: string, table_no: string) {
		return this.m_O_name.getName(key, table_no);
	}

	getColumn() {
		var A_keys = "charge,aspcharge,aspexcise".split(",");
		if (this.m_O_name.getSetting("is_excise")) A_keys.push("excise");

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) A_keys.push("kamoku" + (1 + cnt));

		return A_keys;
	}

	getTableNo(year: number, month: number) {
		if (0 == year || 0 == month) return "";
		return super.getTableNo(year, month);
	}

	getTableNamePost(table_no: string) {
		if (table_no.length) return "post_" + table_no + "_tb";else return "post_tb";
	}

	getTableNamePostRelation(table_no: string) {
		if (table_no.length) return "post_relation_" + table_no + "_tb";else return "post_relation_tb";
	}

	async delete(pactid: number, year: number, month: number, fname: string) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from " + this.getName("postbill", table_no) + " where pactid=" + this.escape(pactid);

		if (fname.length) {
			if (false == await this.m_db.backup(fname, "select *" + sqlfrom + ";")) {
				return false;
			}
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async execute(pactid: number, year: number, month: number) //部署情報を取り出す
	{
		var table_no = this.getTableNo(year, month);
		var A_rel = Array();
		var toppostid = undefined;

		if (false == await this.getPostRel(pactid, year, month, table_no, A_rel, toppostid)) {
			return false;
		}

		if (undefined == toppostid) {
			this.putOperator(G_SCRIPT_WARNING, "部署情報取得失敗" + pactid);
			return false;
		}

		if (false == this.updateOwn(pactid, year, month, table_no)) {
			return false;
		}

		if (false == await this.updateDummy(pactid, year, month, table_no)) {
			return false;
		}

		if (false == await this.updateChild(pactid, year, month, table_no, A_rel, toppostid)) {
			return false;
		}

		if (false == this.updateAllCoid(pactid, year, month, table_no)) {
			return false;
		}

		return true;
	}

	async getPostRel(pactid: number, year: number, month: number, table_no: string, A_rel: string[], toppostid: undefined) {
		var sql = "select postidparent,postidchild,level";
		sql += " from " + this.getTableNamePostRelation(table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by level,postidparent";
		sql += ";";
		var result = await this.m_db.getHash(sql);

		for (var line of result) {
			var level = line.level;
			var parent = line.postidparent;
			var child = line.postidchild;

			if (0 == level) {
				toppostid = line.postidparent;
			}

			var H_rel: any = {
				parent: parent,
				child: child,
				level: level
			};

			if (false == (-1 !== A_rel.indexOf(H_rel))) {
				A_rel.push(H_rel);
			}
		}

		return true;
	}

	updateOwn(pactid: number, year: number, month: number, table_no: string) //集計するカラム名
	{
		var A_keys = this.getColumn();
		var A_coid = this.m_A_coid;
		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no) + "(pactid,postid,flag,recdate";
		sql += "," + this.getName("postbill_coid", table_no);
		if (this.getName("postbill_num", table_no).length) sql += "," + this.getName("postbill_num", table_no);

		for (var key of Object.values(A_keys)) sql += "," + key;

		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			sql += "," + col;
		}

		sql += ")";
		sql += " select " + this.escape(pactid);
		sql += ",sub_tb.postid,'0','" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
		sql += ",sub_tb.coid";
		if (this.getName("postbill_num", table_no).length) sql += ",count(child_tb.*)";

		for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

		A_col = this.m_O_name.getAdd(1);

		for (var col of Object.values(A_col)) {
			sql += `,sum(case when ${col} is null then 0 else ${col} end)`;
		}

		sql += " from (select pactid" + "," + this.getName("co_coid", table_no) + " as coid" + ",postid from " + this.getName("co", table_no);
		sql += "," + this.getTableNamePost(table_no);
		sql += " where " + this.getName("co_coid", table_no) + " in (";
		var comma = false;

		for (var coid of Object.values(A_coid)) {
			if (comma) sql += ",";
			comma = true;
			sql += coid;
		}

		sql += ")";
		sql += " and pactid=" + this.escape(pactid);
		sql += " order by coid,postid";
		sql += ") as sub_tb";
		sql += " left join " + this.getName("bill", table_no) + " as child_tb";
		sql += " on sub_tb.coid=child_tb." + this.getName("bill_coid", table_no);
		sql += " and sub_tb.postid=child_tb.postid";
		sql += " and sub_tb.pactid=child_tb.pactid";
		sql += " group by sub_tb.coid,sub_tb.postid";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async updateDummy(pactid: number, year: number, month: number, table_no: string) //自部署・各キャリアから、除外回線数だけ回線数を減じる
	{
		if (!this.getName("postbill_num", table_no).length) return true;
		if (!this.m_O_name.getSetting("is_dummy")) return true;
		var sql = "select count(root_tb.*) as dummy_num" + ",root_tb.postid as postid" + ",root_tb." + this.getName("xxx_coid", table_no) + " as coid" + " from " + this.getName("xxx", table_no) + " as root_tb";
		sql += " where coalesce(dummy_flg,false)=true";
		sql += " and pactid=" + this.escape(pactid);
		sql += " and " + this.getName("xxx_coid", table_no) + " in (" + this.m_A_coid.join(",") + ")";
		sql += " group by postid" + "," + this.getName("xxx_coid", table_no);
		sql += " order by postid" + "," + this.getName("xxx_coid", table_no);
		sql += ";";
		var result = await this.m_db.getHash(sql);

		for (var H_line of result) {
			sql = "update " + this.getName("postbill", table_no);
			sql += " set " + this.getName("postbill_num", table_no) + "=" + this.getName("postbill_num", table_no) + "-" + (0 + H_line.dummy_num);
			sql += " where pactid=" + this.escape(pactid);
			sql += " and postid=" + this.escape(H_line.postid);
			sql += " and " + this.getName("xxx_coid", table_no) + "=" + this.escape(H_line.coid);
			sql += " and flag='0'";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

	async updateChild(pactid: any, year: number, month: number, table_no: string, A_rel: any[], toppostid: undefined) //配下部署のリストを作る
	{
		var sql = "select postid from " + this.getTableNamePost(table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by postid";
		sql += ";";
		var result = await this.m_db.getAll(sql);
		var A_child: any = Array();

		for (var line of result) {
			var postid = line[0];
			var tgt = [postid];
			var add = Array();

			do {
				add = Array();

				for (var rel of A_rel) {
					if (!(-1 !== tgt.indexOf(rel.parent))) continue;
					if (-1 !== tgt.indexOf(rel.child)) continue;
					add.push(rel.child);
				}

				for (var id of Object.values(add)) tgt.push(id);
			} while (add.length);

			A_child[postid] = tgt;
		}

		var A_keys = this.getColumn();
		if (this.getName("postbill_num", table_no).length) A_keys.push(this.getName("postbill_num", table_no));
		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			A_keys.push(col);
		}

		var coid = this.getName("postbill_coid", table_no);

		for (let postid in A_child) //挿入SQLを作成する
		{
			var A_child = A_child[postid];
			sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no);
			sql += "(pactid,postid,flag,recdate," + coid;

			for (var key of Object.values(A_keys)) sql += "," + key;

			sql += ")";
			sql += " select " + this.escape(pactid);
			sql += "," + this.escape(postid);
			sql += ",'1','" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'," + coid;

			for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

			sql += " from " + this.getName("postbill", table_no);
			sql += " where pactid=" + this.escape(pactid);
			sql += " and postid in(" + A_child.join(",") + ")";
			sql += " and flag='0'";
			sql += " group by " + coid;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

	updateAllCoid(pactid: number, year: number, month: number, table_no: string) //集計するカラム名(回線数を含む)
	{
		var A_keys = this.getColumn();
		if (this.getName("postbill_num", table_no).length) A_keys.push(this.getName("postbill_num", table_no));
		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			A_keys.push(col);
		}

		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no) + "(pactid,postid,flag,recdate";
		sql += "," + this.getName("postbill_coid", table_no);

		for (var key of Object.values(A_keys)) sql += "," + key;

		sql += ")";
		sql += " select " + this.escape(pactid);
		sql += ",post_tb.postid,flag,'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'," + this.escape(this.m_coid_all);

		for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

		sql += " from " + this.getTableNamePost(table_no) + " as post_tb";
		sql += " left join " + this.getName("postbill", table_no) + " as parent_tb";
		sql += " on post_tb.pactid=parent_tb.pactid";
		sql += " and post_tb.postid=parent_tb.postid";
		sql += " where post_tb.pactid=" + this.escape(pactid);
		sql += " and parent_tb." + this.getName("postbill_coid", table_no) + "!=" + this.escape(this.m_coid_all);
		sql += " group by post_tb.postid,flag";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};

export class ProcessCalcBase extends ProcessDefault {
	m_procname_long: string;
	m_O_name: UpdateBillName;
	m_username: string;
	m_listener!: ScriptLogBase;
	m_O_hist!: UpdateBillHistory;
	constructor(procname: string, logpath: any, opentime: any, procname_long: any, username = "") {
		super(procname, logpath, opentime);
		this.m_procname_long = procname_long;

		if (0 == username.length) {
			username = procname;
		}

		this.m_username = username;
		this.m_O_name = new UpdateBillName(this.m_listener, this.m_db, this.m_table_no);
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.initName();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, this.m_username, false);
	}

	initName() //派生型で実装する
	//this->m_O_name->initPurchaseかinitCopyのどちらかを実行する
	{}

	beginPactid(pactid: any) //計算中の履歴を作る
	{
		if (false == this.beginDB()) {
			return false;
		}

		if (false == this.m_O_hist.insert(pactid, this.m_year.toString(), this.m_month.toString())) {
			this.endDB(false);
			return false;
		}

		if (false == this.endDB(true)) {
			return false;
		}

		if (false == this.beginDB()) {
			return false;
		}

		return true;
	}

	async executePactidc(pactid: number, logpath: string) //tel_bill_X_tb更新型の作成
	{
		var no = this.getTableNo();
		var ins_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + this.m_O_name.getName("bill", no) + ".insert", "true");
		var tel_bill = new UpdateBillItem(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, ins_tel_bill);
		var bill = new UpdateBillPost(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);

		if (false == await tel_bill.delete(pactid, this.m_year, this.m_month, logpath + this.m_O_name.getName("bill", no) + ".delete")) {
			return false;
		}

		if (false == await bill.delete(pactid, this.m_year, this.m_month, logpath + this.m_O_name.getName("postbill", no) + ".delete")) {
			return false;
		}

		if (false == await tel_bill.execute(pactid, this.m_year, this.m_month)) {
			return false;
		}

		if (false == await bill.execute(pactid, this.m_year, this.m_month)) {
			return false;
		}

		return true;
	}

	endPactid(pactid: any, status: any) //通常のトランザクション終了
	{
		if (false == this.endDB(status)) {
			return false;
		}

		if (false == this.beginDB()) {
			return false;
		}

		var is_fail = !status;

		if (false == this.m_O_hist.update(pactid, this.m_year, this.m_month, is_fail)) {
			this.endDB(false);
			return false;
		}

		if (false == this.endDB(true)) {
			return false;
		}

		return true;
	}

};

export class ProcessRecalcBase extends ProcessBase {
	m_O_name: UpdateBillName;
	m_procname_long: string;
	m_O_hist: UpdateBillHistory | any;
	m_cur_pactid!: number;
	m_cur_year: number | undefined;
	m_cur_month: number | undefined;
	constructor(procname: any, logpath: string, opentime: any, procname_long: any) {
		super(procname, logpath, opentime);
		this.m_O_name = new UpdateBillName(this.m_listener, this.m_db, this.m_table_no);
		this.m_procname_long = procname_long;
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.initName();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, "", true);
	}

	initName() //派生型で実装する
	//this->m_O_name->initPurchaseかinitCopyのどちらかを実行する
	{}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		return 0 < this.m_O_hist.getLimit();
	}

	async do_Execute() //処理回数
	{
		var count = 0;
		var all_status = true;

		for (; true; ++count) //計算要求を取り出す
		{
			if (false == this.beginDB()) {
				return false;
			}

			var H_param: any = Array();
			this.m_O_hist.get(H_param, count, this.m_debugflag);

			if (0 == H_param.length) {
				if (false == this.endDB(false)) {
					return false;
				}

				break;
			}

			this.m_cur_pactid = H_param.pactid;
			this.m_cur_year = H_param.year;
			this.m_cur_month = H_param.month;
			var log: any = new ProcessLog(0);
			log.setPath(this.m_listener, this.m_curpath, H_param.pactid + "_" + `${H_param.year}04d${H_param.month}02d`+ "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "再計算開始" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_O_hist.start(H_param);

			if (false == this.endDB(true)) {
				return false;
			}

			if (false == this.beginDB()) {
				return false;
			}

			var status = await this.executeParam(H_param, log.m_path);
			this.m_O_hist.update(H_param.pactid, H_param.year, H_param.month, !status);

			if (false == this.endDB(status)) {
				return false;
			}

			this.putError(G_SCRIPT_BEGIN, "再計算終了" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status = status;
			// delete log;
			log = undefined;
			
			if (false == status) {
				return status;
			}

			this.m_cur_pactid = 0;
			this.m_cur_year = 0;
			this.m_cur_month = 0;
		}

		return all_status;
	}

	async executeParam(H_param: any, logpath: string) //tel_bill_X_tb更新型の作成
	{
		var pactid = H_param.pactid;
		var year = H_param.year;
		var month = H_param.month;
		var no = this.m_table_no.get(year, month);
		var ins_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + this.m_O_name.getName("bill", no) + ".insert", "true");
		var tel_bill = new UpdateBillItem(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, ins_tel_bill);
		var bill = new UpdateBillPost(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);

		if (false == await tel_bill.delete(pactid, year, month, logpath + this.m_O_name.getName("bill", no) + ".delete")) {
			return false;
		}

		if (false == await bill.delete(pactid, year, month, logpath + this.m_O_name.getName("postbill", no) + ".delete")) {
			return false;
		}

		if (false == await tel_bill.execute(pactid, year, month)) {
			return false;
		}

		if (false == await bill.execute(pactid, year, month)) {
			return false;
		}

		return true;
	}

};
