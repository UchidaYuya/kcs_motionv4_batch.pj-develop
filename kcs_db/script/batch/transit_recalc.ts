//===========================================================================
//機能：運輸の再計算プロセス
//作成：森原
import { G_LOG, G_LOG_RECALC } from "../../db_define/define";
import { G_CLIENT_DB } from "./lib/script_common";
import {ProcessRecalcBase} from "./lib/update_bill_item";

const G_PROCNAME_RECALC_TRANSIT = "transit_recalc";
const G_OPENTIME_RECALC_TRANSIT = "0000,2400";
class ProcessRecalcTransit extends ProcessRecalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "運輸再計算プロセス");
	}

	initName() {
		this.m_O_name.initTransit();
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcTransit(G_PROCNAME_RECALC_TRANSIT, log, G_OPENTIME_RECALC_TRANSIT);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw process.exit(1);
}

if (false == proc.isRequest()) {
	throw process.exit(0);
}
proc.execute().then((res) => {
	if (false == res) {
		throw process.exit(1);
	}
})
throw process.exit(0);
