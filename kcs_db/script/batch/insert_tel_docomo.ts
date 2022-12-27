//機能：ホットライン電話追加プロセス

//作成：森原

import { G_LOG, G_LOG_HAND } from '../../db_define/define';
import {GuessDocomoTel} from './lib/guess_docomo';
import {ProcessDefault} from './lib/process_base';
import { G_DOCOMO_ALERT_CSV } from './lib/script_common';
import { G_SCRIPT_INFO, G_SCRIPT_WARNING } from './lib/script_log';

export const G_PROCNAME_INSERT_TEL_DOCOMO = "insert_tel_docomo";
export const G_OPENTIME_INSERT_TEL_DOCOMO = "0000,2400";

export default class ProcessInsertTelDocomo extends ProcessDefault {
	m_defaultadd: boolean;
	m_csv_name!: string;
	m_addtelflag!: boolean;
	
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);
		this.m_args.addSetting({
			C: { type: "string" },
			a: { type: "int" }
		});
		this.m_defaultadd = true;
	}

	getProcname() {
		return "ホットライン電話追加プロセス";
	}

	commitArg(args: any) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "C":
				this.m_csv_name = args.value;
				break;

			case "a":
				this.m_addtelflag = args.value;
				this.m_defaultadd = false;
				break;
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		const rval = super.getUsage();
		rval.push(["-C=fname", "ドコモCSVファイル名"]);
		rval.push(["-a={0|1}", "tel_tbに追加するか(-yが現在なら1,でなければ0)"]);
		return rval;
	}

	getManual() //CSVファイル名が無ければここで作る
	{
		let rval = super.getManual();
		if (0 == this.m_csv_name.length) this.m_csv_name = this.getDocomoCSV();
		rval += "ドコモCSVファイル名" + this.m_csv_name + "\n";

		if (this.m_defaultadd) {
			if (new Date().getFullYear() == this.m_year && new Date().getMonth()+1 == this.m_month) this.m_addtelflag = true;else this.m_addtelflag = false;
		}

		rval += "tel_tbに電話追加";
		rval += this.m_addtelflag ? "する" : "しない";
		rval += "\n";
		return rval;
	}

	async executePactid(pactid: number, logpath: string) //ホットラインか
	//現在月ならtel_tbにも追加するが、起動時オプションがあればそちらを優先
	{

		const csv_name = this.getDocomoCSV();

		let is_hotline = false;

		let sql = "select count(*) from pact_tb";
		sql += " where pactid=" + pactid;

		sql += " and coalesce(type,'')='H'";
		sql += ";";

		if (0 < await this.m_db.getOne(sql)) is_hotline = true;
		if (!is_hotline) {
			this.putError(G_SCRIPT_INFO, "ホットラインで無いので終了" + pactid);
			return true;
		}

		const use_tel_X: boolean = true;

		const use_tel = this.m_addtelflag;

		const O_ins_tel = new GuessDocomoTel(this.m_listener, this.m_db, this.m_table_no);

		if (!O_ins_tel.execute(pactid, this.m_year, this.m_month, logpath, use_tel, use_tel_X, csv_name)) {
			this.putError(G_SCRIPT_WARNING, "電話追加失敗");
			return false;
		}

		return true;
	}

	getDocomoCSV() {
		let csv_name = this.m_csv_name;

		if (0 == csv_name.length) {
			csv_name = G_DOCOMO_ALERT_CSV.replace("%s", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""));
		}

		return csv_name;
	}

};


let log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;

var proc = new ProcessInsertTelDocomo(G_PROCNAME_INSERT_TEL_DOCOMO, log, G_OPENTIME_INSERT_TEL_DOCOMO);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);

