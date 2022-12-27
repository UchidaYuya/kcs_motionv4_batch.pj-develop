import MtDBUtil from '../MtDBUtil';
import MtOutput from '../MtOutput';
import MtSetting from '../MtSetting';
import MtDateUtil from '.././MtDateUtil';

const fs = require("fs");
export default class ModelBase {
	H_table: any[];
	O_Setting: MtSetting;
	O_Out: MtOutput;
	O_DateUtil: MtDateUtil;
	O_Db: MtDBUtil;
	constructor(O_db0 = undefined) {
		this.H_table = Array();
		this.O_Setting = MtSetting.singleton();
		this.O_Out = MtOutput.singleton();
		this.O_DateUtil = MtDateUtil.singleton();

		if (O_db0 === undefined) {
			this.O_Db = MtDBUtil.singleton();
		} else {
			this.O_Db = O_db0;
		}
	}

	getSetting() : MtSetting {
		return this.O_Setting;
	}

	getOut() : MtOutput {
		return this.O_Out;
	}

	getDateUtil() {
		return this.O_DateUtil;
	}

	get_DB() {
		return this.getDB();
	}

	getDB() {
		return this.O_Db;
	}

	debugOut(msg: string, disp = 1) {
		this.getOut().debugOut(msg, disp);
	}

	infoOut(msg: string, disp = 1) {
		this.getOut().infoOut(msg, disp);
	}

	warningOut(code, errstr: string = "", disp = 0) {
		this.getOut().warningOut(code, errstr, disp);
	}

	errorOut(code: any, errstr: string = "", mailflg: number = 1, goto: string = "", buttonstr: string = "") {
		this.getOut().errorOut(code, errstr, mailflg, goto, buttonstr);
	}

	async setOutPut(table: string, A_outPut: any, H_data: any) {
		var H_table = await this.getTableInfo(table);
		var H_tmp:any = Array();

		for (var col in H_table) {
			var H_info = H_table[col];

			if (Object.keys(H_data).includes(col)) {
				H_tmp[col] = H_data[col];
			} else {
				if ("t" == H_info.notnull) {
					throw new Error(table + "の" + col + "はnot nullです\n");
				}

				H_tmp[col] = undefined;
			}
		}

		A_outPut.push(H_tmp);
	}

	async getTableInfo(table:string) {
		if (false == (-1 !== Object.keys(this.H_table).indexOf(table))) {
			var H_table = {};
			const sql = "SELECT a.attnum, n.nspname, c.relname, a.attname AS colname, t.typname AS type, a.atttypmod, FORMAT_TYPE(a.atttypid, a.atttypmod) AS complete_type, '' AS default_value, a.attnotnull AS notnull, a.attlen AS length, co.contype, ARRAY_TO_STRING(co.conkey, ',') AS conkey" 
				+ " FROM pg_attribute AS a" 
				+ " JOIN pg_class AS c ON a.attrelid = c.oid JOIN pg_namespace AS n ON c.relnamespace = n.oid" 
				+ " JOIN pg_type AS t ON a.atttypid = t.oid" 
				+ " LEFT OUTER JOIN pg_constraint AS co ON (co.conrelid = c.oid AND a.attnum = ANY(co.conkey) AND co.contype = 'p')"
				+ " LEFT OUTER JOIN pg_attrdef AS d ON d.adrelid = c.oid AND d.adnum = a.attnum"
				+ " WHERE a.attnum > 0 AND c.relname = '" + table + "' ORDER BY a.attnum";
			const res = await this.get_DB().queryHash(sql);
			
			res.forEach(row => {
				H_table[row['colname']] = row;	
			})

			this.H_table[table] = H_table;
		}

		return this.H_table[table];
	}

	fgetcsv_reg(handle: string, length = undefined, d:any = ",", e:any = "\"") {
		d = new RegExp(d);
		e = new RegExp(e);
		var _line = "";
		var eof = false;

		while (eof != true) {
			_line += !length ? fs.createReadStream(handle) : fs.createReadStream(handle, length);
			var matches = [];
			if (matches.length % 2 == 0) eof = true;
		}

		var _csv_line = _line.trim().replace("/(?:\r\n|[\r\n])?$/", d);

		var _csv_pattern = "/(" + e + "[^" + e + "]*(?:" + e + e + "[^" + e + "]*)*" + e + "|[^" + d + "]*)" + d + "/";

		var _csv_matches = _csv_line.matchAll(new RegExp(_csv_pattern));
		var _csv_data = _csv_matches[1];

		for (var _csv_i = 0; _csv_i < _csv_data.length; _csv_i++) {
			_csv_data[_csv_i] = _csv_data[_csv_i].replace("/^" + e + "(.*)" + e + "$/s", "$1");
			_csv_data[_csv_i] = _csv_data[_csv_i].replace(e + e, e);
		}

		return !_line ? false : _csv_data;
	}
};