//機能：運輸の計算プロセス
//作成：森原
// require("lib/update_bill_item.php");
import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { G_CLIENT_DB } from "./lib/script_common";
import {ProcessCalcBase} from "./lib/update_bill_item";

const G_PROCNAME_CALC_TRANSIT = "transit_calc";
const G_OPENTIME_CALC_TRANSIT = "0000,2400";

export default class ProcessCalcTransit extends ProcessCalcBase {
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime, "運輸計算プロセス");
	}

	initName() {
		this.m_O_name.initTransit();
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

var proc = new ProcessCalcTransit(G_PROCNAME_CALC_TRANSIT, log, G_OPENTIME_CALC_TRANSIT);
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
