
import { ProcessCarid } from './lib/process_base';
import {CreateUpdateAlert} from './lib/update_alert';
import { GuessDocomoCSV } from './lib/guess_docomo';

import { G_SCRIPT_WARNING } from './lib/script_log';
import { G_DOCOMO_ALERT_CSV } from './lib/script_common';
import { G_LOG, G_LOG_HAND } from '../../db_define/define';

const G_PROCNAME_ALERT = "alert";
const G_OPENTIME_ALERT = "0000,2400";

export class ProcessAlert extends ProcessCarid {

	m_csv_name!: string;
	constructor(procname: string, logpath: string, opentime: string) {

		super(procname, logpath, opentime);
		this.m_args.addSetting({
			C: {
				type: "string"
			}
		});
	}

	getProcname() {
		return "プラン警告更新プロセス";
	}

	commitArg(args) {
		if (!this.commitArg(args)) return false;

		switch (args.key) {
			case "C":
				this.m_csv_name = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = this.getUsage();
		rval.push(["-C=fname", "ドコモCSVファイル名"]);
		return rval;
	}

	getManual() //CSVファイル名が無ければここで作る
	{
		var rval = this.getManual();
		if (0 == this.m_csv_name.length) this.m_csv_name = this.getDocomoCSV();
		rval += "ドコモCSVファイル名" + this.m_csv_name + "\n";
		return rval;
	}

	async executePactid(pactid, logpath) //警告フラグを立てる
	//CSV出力
	{
		var csv_name = this.getDocomoCSV();
		// var rval = true;
		var rval;
		var alert = await CreateUpdateAlert(this.m_listener, this.m_db, this.m_table_no);
		var A_carid = Array();
		if (this.m_carid.length) A_carid.push(this.m_carid);
		rval = alert.execute([pactid], A_carid, this.m_year, this.m_month, logpath + "tel_tb.delete");
		var O_csv = new GuessDocomoCSV(this.m_listener, this.m_db, this.m_table_no, csv_name);

		if (!O_csv.execute(pactid, this.m_year, this.m_month)) {
			this.putError(G_SCRIPT_WARNING, "CSV出力失敗");
			return false;
		}

		return rval;
	}

	getDocomoCSV() {
		var csv_name = this.m_csv_name;

		if (0 == csv_name.length) {
			csv_name = G_DOCOMO_ALERT_CSV.replace("%s", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""));
		}

		return csv_name;
	}

};
(() => {
	// checkClient(G_CLIENT_DB);
	var log = G_LOG;
	if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
	var proc = new ProcessAlert(G_PROCNAME_ALERT, log, G_OPENTIME_ALERT);
	if (!proc.readArgs(undefined)) throw process.exit(1);
	if (!proc.execute()) throw process.exit(1);
	// throw process.exit(0);
})();