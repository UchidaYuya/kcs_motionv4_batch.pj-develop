//===========================================================================
//機能：コピーの計算プロセスxz
//
//作成：森原
import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { G_CLIENT_DB } from "./lib/script_common";
import {ProcessCalcBase, UpdateBillName} from "./lib/update_bill_item";

const G_PROCNAME_CALC_COPY = "copy_calc";
const G_OPENTIME_CALC_COPY = "0000,2400";

class ProcessCalcCopy extends ProcessCalcBase {
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime, "コピー計算プロセス");
	}

	initName() {
		this.m_O_name.initCopy();
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

var proc = new ProcessCalcCopy(G_PROCNAME_CALC_COPY, log, G_OPENTIME_CALC_COPY);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw process.exit(1);
}
proc.execute().then((res) => {
	if (false == res) {
		throw process.exit(1);
	}
})

throw process.exit(0);
